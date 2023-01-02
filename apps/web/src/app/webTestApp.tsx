import { Box } from "@mui/material";
import { Analyzer, useAnalysisApp, useCommonManagers } from "@rewind/feature-replay-viewer";
import { useEffect } from "react";
import { SkinId } from "@rewind/web-player/rewind";

const akatsukiId = "535c6e5b4febb48629cbdd4e3a268624";
const akatsukiReplayId = "exported:RyuK - HoneyWorks - Akatsuki Zukuyo [Taeyang's Extra] (2019-06-08) Osu.osr";
const tunaReplayId =
  "exported:FlyingTuna - sabi - true DJ MAG top ranker's song Zenpen (katagiri Remix) [KEMOMIMI EDM SQUAD] (2021-08-02) Osu.osr";
const centipede =
  "exported:- Knife Party - Centipede [This isn't a map, just a simple visualisation] (2021-10-04) Osu.osr";
const sidetrackedDay = "exported:Umbre - VINXIS - Sidetracked Day [Sojourn Collab] (2020-09-24) Osu.osr";

const chosenBlueprintId = akatsukiId;
const chosenReplayId = sidetrackedDay;
// const skin = DEFAULT_SKIN_ID;
const skin: SkinId = { source: "osu", name: "Incandescent Nebulae (ekoro edit)" };

export function WebTestApp() {
  const theater = useCommonManagers();
  const analyzer = useAnalysisApp();
  useEffect(() => {
     //theater.changeSkin(skin);
    const params = new URLSearchParams(window.location.search);
    if (params.get("scoreId") === null) {
      return;
    }
    analyzer.loadReplay("local:"+"Replays/"+params.get("scoreId")+".osr"); // here you need to put your path to this folder
  }, []);
  return (
    <Box sx={{ height: "100vh" }}>
      <Analyzer />
    </Box>
  );
}
