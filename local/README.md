# Wealthy Presence

[🔄] This is still work in progress

This is heavily based on [xKawu's Rich Presence +](https://github.com/xkawu/rich-presence-plus)

Wealthy Presence is a Discord Rich Presence client that allows you to display custom data in your presence. It's based on [Rich Presence +](https://github.com/xkawu/rich-presence-plus), but with a lot of improvements and cool features. It's also written in TypeScript, which means it's more type-safe and more readable. It's also more flexible, you can now use functions to generate your data, which means you can use loops, fetch, database calls, etc. The main goal is to be less limited and more creative, while offering a better DX (Developer Experience) and a better UX (User Experience)

## How to run it?

Assuming you already have `git`, `node`, and `npm` installed in your machine, you can follow these steps:

First, run `git clone https://github.com/sqmasep/wealthy-presence` to clone the repository

Then, run `npm install` to install the dependencies

Then, please create a `presets.ts` file at the root of the project (at the same location of that README.md), and export a `const` named `presets` with the following type:

```ts
import { Preset } from "./src/types";

export const presets = [
  // your presets here
  {
    // one preset
  },
] satisfies Preset[];
```

Then, create a `.env` file at the root of the project (at the same location of that README.md), and add the following content:

```bash
APP_ID=your_app_id
```

Replace `your_app_id` with your Discord application ID. You can create [a new application here](https://discord.com/developers/applications) if you don't have one yet

Then, run `npm run dev` to start the project

Have fun and enjoy your presence!

## Why not just using xKawu's one?

The most significative reason is that you can now use a programming language to generate your presence data, which means you can use loops, functions, etc. You can also use external APIs to fetch data and display it in your presence with functions. You will see examples below. Wealthy Presence was made to be more flexible, for your convenience and for your creativity. You can now do whatever you want with your presence, you are not limited to a static data anymore

I wanted to add more type-safety features, which means removing all the file loaders, .json config files and remove all the useless logs, unnecessary prompts and other stuff that were causing the presence to use unnecessary CPU like an infinite loading spinner in the console. I don't need console library just to run a simple app like this one too btw

Also, i wanted to improve the terrible file structure and make it more readable and maintainable. Original project is a single .js file, which is a very bad idea

The goal was also to improved variable names for the users, `largeImageKey` is confusing, `largeImage` is more explicit and i even may change it to `largeImageUrl` instead to be even more clear. Also i will perform local validation so it errors faster if you make a mistake in the config (not an url, not a string, etc.)

## What can Wealthy Presence do that Rich Presence + can't?

You can now write custom functions to generate the data that will be displayed in your presence.

First time:

![Dynamic value](/local/assets/dynamic_value.png)

Second time:

![Dynamic value](/local/assets/dynamic_value2.png)

Third time:

![Dynamic value](/local/assets/dynamic_value3.png)

To reproduce that, your `presets.ts` can look like this:

```ts
import { Preset } from "./src/types";
import { createPreset } from "./src/utils";

// Create a function that will get a random atom from an API, and return the data that will be displayed in the presence
// You can use the `createPreset` function so you have autocomplete and type-safety without having to write the type yourself
const getRandomAtomPreset = createPreset(async () => {
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
  };
});

export const presets = [
  // If there is only one preset that is a function, it will be rerun every 15s, else it will be static
  // If there is multiple presets, they will be cycled every 15s and if there is a function, it will be rerun as well
  // If the preset is not a function but contains functions, they will be executed once and the result will be static
  // If there are multiple presets, every preset having at least one function will be recalculated
  getRandomAtomPreset,
] satisfies Preset[];
```

Note that you are not force to use named functions, you can write them inline as well:

```ts
import { Preset } from "./src/types";

export const presets = [
  // Dynamic value that will be rerun every time the presence will meet the function
  async () => {
    const res = await fetch("...").then(res => res.json());

    return {
      title: "title",
      description: "description",
    };
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

## Why "Wealthy Presence"?

Because Rich Presence + has already two positive signs, and Rich Presence ++ is comically long, so i'm using Wealthy Presence like it's a luxury version of Rich Presence + and i think it's funny

## TODO

- [x] Add a way to use functions to generate the data
- [x] Add a way to use functions for each field in a preset
- [ ] Improve README for the different fields (title, description) with images so the user can configure it more easily
- [ ] Apparently discord-rpc is deprecated? i've seen stuff about discord game-sdk, i need to check that out
- [ ] Make it a library so it can be used in other projects
