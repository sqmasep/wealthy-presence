import type { AnyPreset } from "..";

export function createList(name: string, presets: AnyPreset[]) {
  return {
    id: crypto.randomUUID(),
    name,
    presets,
  };
}
