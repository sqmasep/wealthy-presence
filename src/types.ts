import type { AnyPreset } from ".";
import type { AppId } from "./lib/validation/appId";

export interface WealthyConfig {
  presets: AnyPreset[];
  appId: AppId | undefined;
}

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
