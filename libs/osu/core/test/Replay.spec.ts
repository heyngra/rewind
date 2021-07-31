import { fromRawToReplay, OsuAction, ReplayFrame } from "@rewind/osu/core";
import { parseReplayFromFS, TEST_REPLAYS } from "./util.spec";

// w, x, y, z
// w time since last action
// x, y coordinates
// z bitmask of what was pressed
describe("Parsing rawReplayData (from node-osr)", function () {
  it("should ignore the first three frames from legacy due to negative", function () {
    // From RyuK +HDDT Akatsuki Zukuyo replay
    const raw = "0|256|-500|0,-1|256|-500|0,-1171|257.0417|124.7764|1";
    const actual = fromRawToReplay(raw);
    expect(actual).toBe([]);
    // assert.deepStrictEqual(actual, []);
    console.log(actual);
  });
  it("should have the first correct frame", function () {
    // From RyuK +HDDT Akatsuki Zukuyo replay
    const raw = "0|256|-500|0,-1|256|-500|0,-1171|257.0417|124.7764|1,13|256.8854|124.8789|1";
    const f1: ReplayFrame = {
      time: -1171 - 1 + 13,
      position: { x: 256.8854, y: 124.8789 },
      actions: [OsuAction.leftButton],
    };
    const actual = fromRawToReplay(raw);
    expect(actual).toBe([f1]);
  });
});

describe("Parsing SunMoonStar", function () {
  const r = parseReplayFromFS(TEST_REPLAYS.SUN_MOON_STAR_VARVALIAN);

  it("should not have duplicated frames", function () {
    const seen: Record<number, boolean> = {};
    for (const frame of r) {
      // expect(frame.time in seen, `Duplicated at time=${frame.time}`).to.be.false;
      seen[frame.time] = true;
    }
  });
});