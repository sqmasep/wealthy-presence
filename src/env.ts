import { parse, string } from "valibot";
import "dotenv/config";

const appIdSchema = string();

export const APP_ID = parse(appIdSchema, process.env.APP_ID);
// export const APP_ID = process.env.APP_ID;
