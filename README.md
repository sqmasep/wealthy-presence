# Wealthy Presence

This is heavily based on [xKawu's Rich Presence +](https://github.com/xkawu/rich-presence-plus)

Wealthy Presence is a Discord Rich Presence client that allows you to display custom data in your presence. It's based on [Rich Presence +](https://github.com/xkawu/rich-presence-plus), but with a lot of improvements and cool features. It's also written in TypeScript, which means it's more type-safe and more readable. The difference with Rich Presence + is that Wealthy Presence is oriented towards developers, while Rich Presence + is focused on users that don't know how to program. Thus, Wealthy Presence is more for professional uses and could be used in discord bots.

## Motivation

When Rich Presence + came out first, I noticed a few problems and things I wanted to improve. I removed all the useless CLI and console stuff, I wrote it in Typescript and I added features like dynamic presets. Then Rich Presence + also added those features, while staying in Javascript, so I moved my project to make a library so anyone can use it with ease.

## How to install it?

Add the library to your project

```bash
# npm
npm i wealthy-presence

# yarn
yarn add wealthy-presence

# pnpm
pnpm add wealthy-presence
```

Then, instanciate the client and run it

```ts
import { WealthyPresence } from "wealthy-presence";

const wealthyPresence = new WealthyPresence({
  // Your discord app ID
  appId: "1234567890",

  presets: [
    // Your presets (either objects, or functions that return objects, see below)
  ],
});

wealthyPresence.run();
```

## How to create a preset

There are two types of presets. Object-like, and function-like

### Object-like preset

Object-like are just a simple object with the data that will be displayed in your presence. Note that you have autocomplete.

Import the `createPreset` function from the library,
and create a preset like this:

```ts
import { createPreset } from "wealthy-presence";

const myPreset = createPreset({
  title: "Hi! I'm eskiu",
  description: "Developer of Wealthy Presence",
  buttons: [
    {
      label: "Check out the repo",
      url: "https://github.com/sqmasep/wealthy-presence",
    },
    {
      label: "Check out my GitHub",
      url: "https://github.com/sqmasep/",
    },
  ],
});
```

You can also initially fetch from an API and display its result in your presence

```ts
import { createPreset } from "wealthy-presence";

const res = await fetch("https://api.github.com/users/sqmasep").then(r =>
  r.json(),
);

const myPreset = createPreset({
  title: res.name,
  description: res.bio,
  largeImageUrl: res.avatar_url,
  buttons: [
    {
      label: "Check out my GitHub!",
      url: res.html_url,
    },
  ],
});
```

For convenience, you can use functions for each field in a preset.

```ts
import { createPreset } from "wealthy-presence";

const myPreset = createPreset({
  title: "Heads or tails?",
  description: () => generateText({ length: 32 }),
});
```

> [!NOTE]
> Note that it will only be run **once**, when the presence connects. If you want to update it every 15 seconds, use a function-like preset instead

> [!NOTE]
> Note that this preset can either be run **once** or **every 15 seconds**. In order to be rerun every 15 seconds, your `presets` have to contain at least two items so the cycle begins.

### Dynamic preset

Dynamic presets are presets that will be recalculated everytime the presence will meet them. They are functions that return the data that will be displayed in your presence.

Import the `createPreset` function from the library,
and create a preset like this:

```ts
import { createPreset } from "wealthy-presence";

let isOdd = false;

// It's a function, so it will be rerun at every cycle
const myPreset = createPreset(() => {
  isOdd = !isOdd;
  const randomBoolean = Math.random() > 0.5;

  return {
    title: `Heads or tails? ${isOdd ? "🃏" : "👑"}`,
    description: randomBoolean ? "Heads" : "Tails",
  };
});
```

You can also use async functions to fetch data from an API

```ts
import { createPreset } from "wealthy-presence";

const getRandomAtomPreset = createPreset(async () => {
  // Fetch a random atom from an API (mine is local)
  const res = await fetch("http://localhost:3000/atoms/random").then(r =>
    r.json(),
  );

  // Return the data that will be displayed in the presence (see the image above)
  return {
    title: `Atom ${res.atomicNumber} / 118`,
    description: `${res.name.en} (${res.symbol})`,
    largeImageUrl:
      "https://static.wixstatic.com/media/8fbcc2_bcb7e56373b84487b14d693a927c6814~mv2.gif",
  };
});
```

## Why "Wealthy Presence"?

Because Rich Presence + has already two positive signs, and Rich Presence ++ is comically long, so i'm using Wealthy Presence like it's a luxury version of Rich Presence + and i think it's funny

## TODO

- [x] Add a way to use functions to generate the data
- [x] Add a way to use functions for each field in a preset
- [x] Make it a library
- [ ] Add a website to control the presence with a GUI
- [ ] Improve README for the different fields (title, description) with images so the user can configure it more easily
- [ ] Apparently discord-rpc is deprecated? i've seen stuff about discord game-sdk, i need to check that out
