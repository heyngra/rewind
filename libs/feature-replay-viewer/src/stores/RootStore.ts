import { BlueprintService } from "./BlueprintService";
import { PreferencesService } from "./PreferencesService";
import { ReplayService } from "./ReplayService";
import { ScenarioService } from "./ScenarioService";
import { ScenarioUI } from "./ScenarioUI";
import { SkinService } from "./SkinService";

export class RootStore {
  public replayService: ReplayService;
  public skinService: SkinService;
  public blueprintService: BlueprintService;
  public preferencesService: PreferencesService;

  public scenarioService: ScenarioService;
  public scenarioUI: ScenarioUI;

  constructor(options: { url: string }) {
    const { url } = options;
    this.replayService = new ReplayService(url);
    this.skinService = new SkinService(url);
    this.blueprintService = new BlueprintService(url);
    this.preferencesService = new PreferencesService();
    this.scenarioUI = new ScenarioUI();
    this.scenarioService = new ScenarioService(
      this.blueprintService,
      this.replayService,
      this.skinService,
      this.preferencesService,
    );
  }
}
