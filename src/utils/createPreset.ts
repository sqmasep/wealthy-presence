import type { PresetWithMaybeFunctions } from "~/lib/validation/preset";
import type { MaybeAnyFunction } from "./types";
import type { AnyPreset } from "~/wealthy-presence";

export function createPreset<
  TPreset extends MaybeAnyFunction<PresetWithMaybeFunctions>,
>(preset: TPreset) {
  return { value: preset, id: crypto.randomUUID() } satisfies AnyPreset;
}
