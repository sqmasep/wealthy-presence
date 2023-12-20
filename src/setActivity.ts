import { discordClient } from "./discordClient";
import { Preset } from "./types";

const isFunction = (x: any): x is Function => typeof x === "function";
const getOrAwait = async <T>(x: T | (() => Promise<T>)): Promise<T> =>
  isFunction(x) ? await x() : x;

export async function setActivity(preset: Preset) {
  const p = isFunction(preset) ? await preset() : preset;

  try {
    await discordClient.setActivity({
      details: await getOrAwait(p.title),
      state: await getOrAwait(p.description),

      largeImageKey: await getOrAwait(p.largeImage),
      largeImageText: await getOrAwait(p.largeImageText),

      smallImageKey: await getOrAwait(p.smallImage),
      smallImageText: await getOrAwait(p.smallImageText),

      buttons: await getOrAwait(p.buttons),

      partyId: await getOrAwait(p.partyId),
      partySize: await getOrAwait(p.partySize),
      partyMax: await getOrAwait(p.partyMax),

      startTimestamp: await getOrAwait(p.startTimestamp),
      endTimestamp: await getOrAwait(p.endTimestamp),

      instance: await getOrAwait(p.instance),
      joinSecret: await getOrAwait(p.joinSecret),
      spectateSecret: await getOrAwait(p.spectateSecret),
      matchSecret: await getOrAwait(p.matchSecret),
    });
  } catch (e) {
    console.error(e);
    process.exit();
  }
}
