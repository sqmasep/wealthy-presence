import type { Output } from "valibot";
import { string } from "valibot";

export const appIdSchema = string("Invalid Discord App ID");

export type AppId = Output<typeof appIdSchema>;
