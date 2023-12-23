import RPC from "discord-rpc";
import { APP_ID } from "./env";

RPC.register(APP_ID);
export const discordClient = new RPC.Client({ transport: "ipc" });
