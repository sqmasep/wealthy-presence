import { createPreset } from "../src/utils/createPreset";

let headsOrTails = false;

// The argument needs to be a function so it can be called every time the preset is used: else
// it will be considered as static and will run `description` only at initialization
export const headsOrTailsPreset = createPreset(() => {
  headsOrTails = !headsOrTails;
  const randomNumber = Math.random();
  return {
    title: `Heads or tails ${headsOrTails ? "👑" : "🃏"}`,
    description: randomNumber > 0.5 ? "Heads" : "Tails",
  };
});
