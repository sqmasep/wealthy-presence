import type { AnyPreset } from ".";
import type { AppId } from "./lib/validation/appId";

export interface WealthyConfig {
  // queue: AnyPreset[];
  appId: AppId | undefined;
  lists: Lists;
}

// List
export interface List {
  id: string;
  name: string;
  presets: AnyPreset[];
}
export type Lists = [List, ...List[]];

// Events
export type EventName = "start" | "stop" | "error" | "activity changed";
export type EventUnion =
  | {
      name: "start";
      listener: () => void;
    }
  | {
      name: "stop";
      listener: () => void;
    }
  | {
      name: "activity changed";
      listener: (preset: AnyPreset) => void;
    };

export type EventData = {
  [K in EventUnion["name"]]: Extract<EventUnion, { name: K }>;
}[EventUnion["name"]];
