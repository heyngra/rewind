import { Skin } from "../skins/Skin";
import { Beatmap, GameplayInfo, ReplayState } from "@rewind/osu/core";
import { OsuReplay } from "../api/ReplayManager";
import { ViewSettings } from "./ViewSettings";

export interface Scene {
  time: number;
  skin: Skin;
  beatmap: Beatmap;
  replay?: OsuReplay;
  gameplayState?: ReplayState;
  gameplayInfo?: GameplayInfo;
  view: ViewSettings;
}

export type SceneLoader = () => Scene;
