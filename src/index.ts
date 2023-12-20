import { presets } from "./presets";
import { APP_ID } from "./env";
import { discordClient as discordClient } from "./discordClient";
import { setActivity } from "./setActivity";
import "dotenv/config";
import { defaultPreset } from "./defaultPreset";

console.log(APP_ID);

// Data stuff
const INTERVAL_PRESETS_IN_MS = 15000; // Do not set this to less than 15000 (15 seconds) or you will be rate limited.
process.title = "Rich Presence +";
console.clear();

console.log(
  "Connecting to Application... (if this takes time, it might be because you're being rate limited)"
);

(async () => {
  discordClient.on("ready", () => {
    console.info("Wealthy Presence connected.");

    if (!presets.length) setActivity(defaultPreset);
    if (presets.length === 1) setActivity(presets[0]);
    else if (presets.length > 1) {
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
