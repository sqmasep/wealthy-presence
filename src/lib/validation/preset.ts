import type { Input } from "valibot";
import {
  array,
  boolean,
  date,
  maxLength,
  minLength,
  number,
  object,
  optional,
  string,
  url,
} from "valibot";
import type { Button } from "./button";
import { buttonSchema } from "./button";
import type { Except } from "~/utils/types";

const nonEmptyString = () => string([minLength(1)]);

export const presetSchema = object({
  title: optional(string([minLength(2)])),
  description: optional(nonEmptyString()),

  largeImageUrl: optional(string([url()])),
  largeImageText: optional(nonEmptyString()),

  smallImageUrl: optional(string([url()])),
  smallImageText: optional(nonEmptyString()),

  buttons: optional(array(buttonSchema, [maxLength(2)])),

  partyId: optional(nonEmptyString()),
  partySize: optional(number()),
  partyMax: optional(number()),

  startTimestamp: optional(date()),
  endTimestamp: optional(date()),

  instance: optional(boolean()),

  matchSecret: optional(nonEmptyString()),
  joinSecret: optional(nonEmptyString()),
  spectateSecret: optional(nonEmptyString()),

  // Additional properties
  durationInMs: optional(number(), 15000),
});

export type Preset = Except<Input<typeof presetSchema>, "buttons"> & {
  buttons?: [Button] | [Button, Button];
};
