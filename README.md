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

## TODO

- add all the default features from xKawu's one, even the one i'm not using myself
- add other cool ideas like dynamic values (for example fetch something and use the response to display it in the presence, which wouldn't be possible with xKawu's JSON-based config). Which means you can even have it linked to a database and a server, and having a GUI to customize it through the web (yes it's overkill but it's possible)
