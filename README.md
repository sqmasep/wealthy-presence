# Wealthy Presence

[🔄] This is still work in progress dont blame my readme

This is heavily based on [xKawu's Rich Presence +](https://github.com/xkawu/rich-presence-plus)

## How to run it?

Please create a presets.ts in the root of the project, and export a `const` named `presets` with the following type:

```ts
import { Preset } from "./src/types";

export const presets = [
  // your presets here
  {
    // one preset
  },
] satisfies Preset[];
```

## Why not just using xKawu's one?

I wanted to add more type-safety features, which means removing all the file loaders, .json config files and remove all the useless logs, unnecessary prompts and other stuff that were causing the presence to use unnecessary CPU like an infinite loading spinner in the console. I don't need console library just to run a simple app like this one too btw

Also, i wanted to improve the terrible file structure and make it more readable and maintainable. Original project is a single .js file, which is a very bad idea

The goal is also to improved variable names for the users, `largeImageKey` is confusing, `largeImage` is more explicit and i even may change it to `largeImageUrl` instead to be even more clear. Also i will perform local validation so it errors faster if you make a mistake in the config (not an url, not a string, etc.)

The good point is that by using a programming language for static data, you can reuse the same data in multiple places, which is not possible with .json files. Just use a shared constant and you're good to go

## Why "Wealthy Presence"?

Because Rich Presence + has already two positive signs, and Rich Presence ++ is comically long, so i'm using Wealthy Presence like it's a luxury version of Rich Presence + and i think it's funny

## What can Wealthy Presence do that Rich Presence + can't?

You can now write custom functions to generate the data that will be displayed in your presence.

First time:
![Dynamic value](/assets/dynamic_value.png)

Second time:
![Dynamic value](/assets/dynamic_value2.png)

Third time:
![Dynamic value](/assets/dynamic_value3.png)

To reproduce that, your `presets.ts` can look like this:

```ts
import { Preset } from "./src/types";

// Create a function that will get a random atom from an API, and return the data that will be displayed in the presence
const getRandomAtomFormatted = async () => {
  // Fetch a random atom from an API (mine is local)
  const res = await fetch("http://localhost:4222/atoms/random").then(r =>
    r.json()
  );

  // Return the data that will be displayed in the presence (see the image above)
  return {
    title: `Atom ${res.atomicNumber} / 118`,
    description: `${res.name.en} (${res.symbol})`,
    largeImage:
      "https://static.wixstatic.com/media/8fbcc2_bcb7e56373b84487b14d693a927c6814~mv2.gif",
  } satisfies Preset;
};

export const presets = [
  // In order to be changed every 15s, you need to pass it at least twice, else it will be run only once and never change
  getRandomAtomFormatted,
  getRandomAtomFormatted,
] satisfies Preset[];
```

Note that you are not force to use named functions, you can write it inline as well:

```ts
import { Preset } from "./src/types";

export const presets = [
  // Dynamic value that will be rerun every time the presence will meet the function
  async () => {
    const res = await fetch("...").then(res => res.json());

    return {
      title: "title",
      description: "description",
    } satisfies Preset;
  },
  // Static data, will never change
  {
    title: "title",
    description: "description",
  },
] satisfies Preset[];
```

Note that you can also use functions for each field in a preset:

```ts
import { Preset } from "./src/types";

export const presets = [
  {
    title: "Heads or tails?",
    description: () => (Math.random() > 0.5 ? "Heads" : "Tails"),
  },
] satisfies Preset[];
```
