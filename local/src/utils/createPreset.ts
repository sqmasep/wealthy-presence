import { Preset } from "../types";

// So you don't have to type "satisfies Preset" at the end of each preset
export function createPreset<TPreset extends Preset>(preset: TPreset) {
  return preset;
}
