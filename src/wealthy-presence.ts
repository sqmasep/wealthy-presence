import { parse } from "valibot";
import { appIdSchema, type AppId } from "./lib/validation/appId";
import type { Preset } from "./lib/validation/preset";
import { getOrAwait } from "./utils/getOrAwait";
import { isFunction } from "./utils/isFunction";
import type { MaybeAnyFunction } from "./utils/types";
import "dotenv/config";
import RPC from "discord-rpc";
import EventEmitter from "events";
import { createList, createPreset, type EventData } from ".";
import type { List, Lists, WealthyConfig } from "./types";

export interface AnyPreset {
  value: MaybeAnyFunction<Preset>;
  id: string;
}

export class WealthyPresence {
  #queue: AnyPreset[] = [];
  #lists: Lists;
  #appId: AppId;
  #discordClient: RPC.Client | null = null;

  #currentQueueIndex = 0;
  #interval: NodeJS.Timeout | null = null;

  #eventEmitter = new EventEmitter();

  constructor(config: WealthyConfig) {
    const appId = parse(appIdSchema, config.appId);
    this.#appId = appId;
    this.#lists = config.lists;
    this.#queue = [...config.lists[0].presets];

    RPC.register(appId);
  }

  // Events
  on<TEventData extends EventData>(
    event: TEventData["name"],
    listener: TEventData["listener"],
  ) {
    this.#eventEmitter.addListener(event, listener);
  }

  removeListener<TEventData extends EventData>(
    event: TEventData["name"],
    listener: TEventData["listener"],
  ) {
    this.#eventEmitter.removeListener(event, listener);
  }

  #emit<TEventData extends EventData>(
    event: TEventData["name"],
    ...args: Parameters<TEventData["listener"]>
  ) {
    this.#eventEmitter.emit(event, args);
  }

  // Queue
  setQueue(queue: AnyPreset[]) {
    if (this.#interval) clearInterval(this.#interval);

    this.#queue = [...queue];
    this.#discordClient?.emit("ready");
  }

  getQueue() {
    return { presets: this.#queue };
  }

  addPresetToQueue(preset: AnyPreset) {
    this.getQueue().presets.push(preset);
    this.#discordClient?.emit("ready");
  }

  removePresetFromQueue(id: AnyPreset["id"]) {
    this.#queue = this.#queue.filter(preset => preset.id !== id);
    this.#discordClient?.emit("ready");
  }

  replacePresetInQueue(presetId: AnyPreset["id"], preset: AnyPreset) {
    const queue = this.getQueue();
    const index = queue.presets.findIndex(p => p.id === presetId);

    queue.presets[index] = preset;
    this.#discordClient?.emit("ready");

    return this.getQueue().presets[index];
  }

  // Lists
  getLists() {
    return this.#lists;
  }

  addList(list: List) {
    this.#lists.push(list);
  }

  // removeList(id: List["id"]) {
  //   this.#lists = this.#lists.filter(list => list.id !== id);
  // }

  playList(id: List["id"]) {
    const list = this.#lists.find(list => list.id === id);
    if (!list) return;

    this.setQueue(list.presets);
  }

  // Utils
  async getComputedValue(preset: AnyPreset) {
    return getOrAwait(preset.value);
  }

  async setActivity(preset: AnyPreset) {
    try {
      const p = await getOrAwait(preset.value);

      await this.#discordClient?.setActivity({
        details: p.title,
        state: p.description,

        largeImageKey: p.largeImageUrl,
        largeImageText: p.largeImageText,

        smallImageKey: p.smallImageUrl,
        smallImageText: p.smallImageText,

        buttons: p.buttons,

        partyId: p.partyId,
        partySize: p.partySize,
        partyMax: p.partyMax,

        startTimestamp: p.startTimestamp,
        endTimestamp: p.endTimestamp,

        instance: p.instance,

        matchSecret: p.matchSecret,
        joinSecret: p.joinSecret,
        spectateSecret: p.spectateSecret,
      });
      this.#emit("activity changed", preset);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Indexing (queue)
  getCurrentQueueIndex() {
    return this.#currentQueueIndex;
  }

  // WARN this may cause issues
  experimental$setCurrentQueueIndex(index: number) {
    this.#currentQueueIndex = index % this.#queue.length;
    this.#discordClient?.emit("ready");
  }

  async skip(amount?: number) {
    const queue = this.getQueue();
    this.#currentQueueIndex =
      (amount ?? this.#currentQueueIndex + 1) % queue.presets.length;

    const currentActivity = queue.presets[this.#currentQueueIndex];
    await this.setActivity(currentActivity);
  }

  // State
  async start() {
    await this.stop();
    await this.#discordClient?.destroy();
    this.#discordClient = new RPC.Client({ transport: "ipc" });
    this.#discordClient.on("ready", async () => {
      if (this.#interval) clearInterval(this.#interval);
      const queuePresets = this.getQueue().presets;

      // Empty state
      if (queuePresets.length === 0) return;

      // More than 1 preset
      if (queuePresets.length > 1) {
        await this.setActivity(queuePresets[this.#currentQueueIndex]);

        this.#interval = setInterval(async () => this.skip(), 15000);
        return;
      }

      // Only 1 preset
      if (isFunction(queuePresets[0].value)) {
        await this.setActivity(queuePresets[0]);

        this.#interval = setInterval(async () => {
          await this.setActivity(queuePresets[0]);
        }, 15000);
      } else {
        await this.setActivity(queuePresets[0]);
      }
    });

    await this.#discordClient.login({ clientId: this.#appId });
  }

  async stop() {
    if (this.#interval) clearInterval(this.#interval);
    await this.#discordClient?.clearActivity();
    await this.#discordClient?.destroy();
    this.#discordClient = null;
  }

  isRunning() {
    return !!this.#discordClient;
  }
}

const wealthyPresence = new WealthyPresence({
  appId: "",

  lists: [
    createList("list1", [createPreset({ title: "test", description: "test" })]),
    createList("list2", [createPreset({ title: "test2" })]),
  ],
});

/**
 * Preset: one unit of activity
 * List: multiple presets
 * Queue: current list of presets that are being cycled through
 */
