import { discordClient } from "./discordClient";
import { Preset } from "./types";

export async function setActivity(preset: Preset) {
  try {
    await discordClient.setActivity({
      details: preset.title,
      state: preset.description,
      largeImageKey: preset.largeImage,
      smallImageKey: preset.smallImage,
      buttons: preset.buttons,
    });
  } catch (e) {
    console.error(e);
    process.exit();
  }
}
