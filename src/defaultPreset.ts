import { Preset } from "./types";

export const defaultPreset = {
  title: "Wealthy Presence",
  description: "A super cool Discord Rich Presence client",
  largeImage: "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
  smallImage:
    "https://m.media-amazon.com/images/I/51kMZcurWgL._UXNaN_FMjpg_QL85_.jpg",
  buttons: [{ label: "Eskiu's Github  =>", url: "https://github.com/sqmasep" }],
} satisfies Preset;
