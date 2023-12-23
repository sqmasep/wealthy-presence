import { presets } from "../presets";
import { APP_ID } from "./env";
import { discordClient as discordClient } from "./discordClient";
import { setActivity } from "./setActivity";
import "dotenv/config";
import { defaultPreset } from "./defaultPreset";
import { isFunction } from "./utils/isFunction";

// Data stuff
const INTERVAL_PRESETS_IN_MS = 15000; // Do not set this to less than 15000 (15 seconds) or you will be rate limited.
process.title = "Wealthy Presence";
console.clear();

console.log(
  "Connecting to Application... (if this takes time, it might be because you're being rate limited)"
);

(async () => {
  discordClient.on("ready", async () => {
    console.info("Wealthy Presence connected.");

    // No preset, set default preset
    if (!presets.length) setActivity(defaultPreset);

    // Only one preset, check if it's a function or not
    // If it's a function, make it a loop and call it every 15 seconds so it updates
    // If it's not a function, just set it and never change it again
    if (presets.length === 1) {
      const preset = presets[0];
      if (isFunction(preset)) {
        setActivity(await preset());
        setInterval(() => {
          (async () => setActivity(await preset()))();
        }, INTERVAL_PRESETS_IN_MS);
      } else setActivity(preset);
    }

    // If there is more than one preset, make it a loop and change it every 15 seconds
    if (presets.length > 1) {
      let i = 0;
      setActivity(presets[i]);
      setInterval(() => {
        if (i < presets.length - 1) i++;
        else i = 0;
        setActivity(presets[i]);
      }, INTERVAL_PRESETS_IN_MS);
    }
  });

  await discordClient
    .login({ clientId: APP_ID })
    .catch(e => console.log("login error", e));
})();
