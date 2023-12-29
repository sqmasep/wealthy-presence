import type { PresetWithMaybeFunctions } from "~/lib/validation/preset";
import type { MaybeAnyFunction } from "./types";

export function createPreset<
  TPreset extends MaybeAnyFunction<PresetWithMaybeFunctions>,
>(
  preset: TPreset,
  // | (() => PresetWithMaybeFunctions)
  // | PresetWithMaybeFunctions
  // | (() => Promise<PresetWithMaybeFunctions>)
  // | Promise<PresetWithMaybeFunctions>,
) {
  return preset;
}
