import type { Output } from "valibot";
import { object, string, url, minLength } from "valibot";

export const buttonSchema = object({
  label: string([minLength(1)]),
  url: string([url("Please provide a valid URL.")]),
});

export type Button = Output<typeof buttonSchema>;
