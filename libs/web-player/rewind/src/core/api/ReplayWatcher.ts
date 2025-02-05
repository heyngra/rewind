import { inject, injectable, postConstruct } from "inversify";
import { Subject } from "rxjs";
import { TYPES } from "../../types/types";
import { ScenarioManager } from "../../apps/analysis/manager/ScenarioManager";
import { io } from "socket.io-client";

// interface Payload {
//   replay: { filename: string };
//   beatmapMetaData: { md5Hash: string };
// }
type Payload = {
  blueprintId: string;
  replayId: string;
};

@injectable()
export class ReplayWatcher {
  public readonly newReplays$: Subject<string>;

  constructor(@inject(TYPES.WS_URL) private readonly wsUrl: string, private readonly scenarioManager: ScenarioManager) {
    this.newReplays$ = new Subject<string>();
  }

  @postConstruct()
  initialize() {
    // Probably this should be somewhere else...
    /*this.newReplays$.subscribe((replayId) => {
      // TODO: if settings also true
      this.scenarioManager.loadReplay(replayId);
    });*/
    // removed cuz it messes up everything
  }

  replayAddedHandler(replay: { filename: string }, beatmapMetaData: { md5Hash: string }) {
    if (beatmapMetaData === null) {
      return;
    }
    const { md5Hash } = beatmapMetaData;
    console.log(`WebSocket: Replay added: ${replay.filename}, ${md5Hash}`);
    const replayId = "exported:" + replay.filename;
    this.newReplays$.next(replayId);
  }

  startWatching() {
    const socket = io(this.wsUrl, {
      extraHeaders: {
        "Access-Control-Allow-Origin": "*",
      }
    });
    // // https://github.com/socketio/socket.io/issues/474#issuecomment-289316361 Why though?
    socket.on("connect", () => {
      console.log(`ReplayWatcher: Connected to WebSocket with id = ${socket.id}`);
    });
    socket.on("disconnect", () => {
      console.log("ReplayWatcher: Disconnected from WebSocket");
    });
    // const listener = this.replayAddedHandler.bind(this);
    //socket.on("replayAdded", this.replayAddedHandler.bind(this));
  }
}
