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
      name: "preset changed";
      listener: (preset: AnyPreset["value"]) => void;
    };

export type EventData = {
  [K in EventUnion["name"]]: Extract<EventUnion, { name: K }>;
}[EventUnion["name"]];
