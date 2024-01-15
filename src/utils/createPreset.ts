import type { Preset } from "..";
import type { MaybeAnyFunction } from "./types";
import type { AnyPreset } from "~/wealthy-presence";

export function createPreset<TPreset extends MaybeAnyFunction<Preset>>(
  preset: TPreset,
) {
  return {
    value: preset,
    id: crypto.randomUUID(),
  } as const satisfies AnyPreset;
}
