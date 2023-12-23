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

const preset = createPreset(async () => {
  const a = (await fetch("").then(async (r) => r.json())) as { title: string };

  return {
    description: a.title,
    title: "s",
  };
});

const a = createPreset(() => {
  const random = Math.random();
  return {
    title: random.toString(),
  };
});

const b = createPreset({
  title: "eee",
  largeImageTex: "",
});

const c = createPreset({
  title: () => "eee",
});

const d = createPreset({
  title: async () => {
    const res = (await fetch("...").then(async (r) => r.json())) as string;
    return res;
  },
});
