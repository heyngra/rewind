import { Skin } from "../skins/Skin";
import { OsuExpressSkinManager } from "../skins/SkinManager";

export class SkinService {
  skins: Record<string, Skin>;

  constructor(private readonly url: string) {
    this.skins = {};
  }

  resolveSkin(id: string): Skin | undefined {
    return this.skins[id];
  }

  clearCache() {
    this.skins = {};
  }

  async loadSkin(skinId: string): Promise<Skin> {
    return (this.skins[skinId] = await new OsuExpressSkinManager(this.url).loadSkin(skinId));
  }
}
