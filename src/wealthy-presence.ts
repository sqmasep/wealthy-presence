import { parse } from "valibot";
import { appIdSchema, type AppId } from "./lib/validation/appId";
import type { PresetWithMaybeFunctions } from "./lib/validation/preset";
import { getOrAwait } from "./utils/getOrAwait";
import { isFunction } from "./utils/isFunction";
import type { MaybeAnyFunction } from "./utils/types";
import "dotenv/config";
import RPC from "discord-rpc";

export interface AnyPreset {
  value: MaybeAnyFunction<PresetWithMaybeFunctions>;
  id: string;
}

export class WealthyPresence {
  #presets: AnyPreset[] = [];
  #appId: AppId;
  #discordClient: RPC.Client | null = null;
  #currentIndex = 0;
  #interval: NodeJS.Timeout | null = null;

  constructor(config: WealthyConfig) {
    const appId = parse(appIdSchema, config.appId);
    this.#presets = config.presets;
    this.#appId = appId;

    RPC.register(appId);
  }

  setPresets(presets: AnyPreset[]) {
    if (this.#interval) clearInterval(this.#interval);
    this.#presets = presets;
    this.#discordClient?.emit("ready");
  }
  getPresets() {
    return this.#presets;
  }

  addPreset(preset: AnyPreset) {
    this.#presets.push(preset);
    this.#discordClient?.emit("ready");
  }

  removePreset(id: AnyPreset["id"]) {
    this.#presets = this.#presets.filter(preset => preset.id !== id);
    this.#discordClient?.emit("ready");
  }

  async setActivity(preset: AnyPreset["value"]) {
    try {
      const p = await getOrAwait(preset);

      await this.#discordClient?.setActivity({
        details: await getOrAwait(p.title),
        state: await getOrAwait(p.description),

        largeImageKey: await getOrAwait(p.largeImageUrl),
        largeImageText: await getOrAwait(p.largeImageText),

        smallImageKey: await getOrAwait(p.smallImageUrl),
        smallImageText: await getOrAwait(p.smallImageText),

        buttons: await getOrAwait(p.buttons),

        partyId: await getOrAwait(p.partyId),
        partySize: await getOrAwait(p.partySize),
        partyMax: await getOrAwait(p.partyMax),

        startTimestamp: await getOrAwait(p.startTimestamp),
        endTimestamp: await getOrAwait(p.endTimestamp),

        instance: await getOrAwait(p.instance),

        matchSecret: await getOrAwait(p.matchSecret),
        joinSecret: await getOrAwait(p.joinSecret),
        spectateSecret: await getOrAwait(p.spectateSecret),
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async run() {
    await this.stop();
    await this.#discordClient?.destroy();
    this.#discordClient = new RPC.Client({ transport: "ipc" });
    this.#discordClient.on("ready", async () => {
      const presets = this.#presets;

      // Empty state
      if (presets.length === 0) {
        return;
      }

      // More than 1 preset
      if (presets.length > 1) {
        await this.setActivity(presets[this.#currentIndex].value);

        this.#interval = setInterval(async () => this.skip(), 15000);
        return;
      }

      // Only 1 preset
      if (isFunction(presets[0].value)) {
        await this.setActivity(presets[0].value);

        this.#interval = setInterval(async () => {
          await this.setActivity(presets[0].value);
        }, 15000);
      } else {
        await this.setActivity(presets[0].value);
      }
    });

    await this.#discordClient.login({ clientId: this.#appId });
  }

  async skip(amount?: number) {
    this.#currentIndex =
      (amount ?? this.#currentIndex + 1) % this.#presets.length;

    const currentActivity = this.#presets[this.#currentIndex].value;
    await this.setActivity(currentActivity);
  }

  async stop() {
    if (this.#interval) clearInterval(this.#interval);
    await this.#discordClient?.destroy();
    this.#discordClient = null;
  }

  isRunning() {
    return !!this.#discordClient;
  }
}

interface WealthyConfig {
  presets: AnyPreset[];
  appId: AppId | undefined;
}
