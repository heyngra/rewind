import { readSync } from "../src";
// xd -> todo
import { TEST_REPLAYS } from "../../../osu/core/test/utils/testBlueprintPath";

test("Large file", () => {
  const s = readSync(TEST_REPLAYS.SUN_MOON_STAR_VARVALIAN);
  console.log(s.replay_data.length);
});
