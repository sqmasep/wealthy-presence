export type Preset =
  | {
      title?: OrAnyFunction<string>;
      description?: OrAnyFunction<string>;

      largeImage?: OrAnyFunction<string>;
      largeImageText?: OrAnyFunction<string>;

      smallImage?: OrAnyFunction<string>;
      smallImageText?: OrAnyFunction<string>;

      // If defined, only one or two buttons maximum allowed (discord limitations)
      buttons?: OrAnyFunction<[Button] | [Button, Button]>;

      partyId?: OrAnyFunction<string>;
      partySize?: OrAnyFunction<number>;
      partyMax?: OrAnyFunction<number>;

      startTimestamp?: OrAnyFunction<number>;
      endTimestamp?: OrAnyFunction<number>;

      instance?: boolean;
      joinSecret?: string;
      spectateSecret?: string;
      matchSecret?: string;
    }
  | (() => Exclude<Preset, Function>)
  | (() => Promise<Exclude<Preset, Function>>);

interface Button {
  url: string;
  label: string;
}

type OrAnyFunction<T> = T | (() => T) | (() => Promise<T>);
