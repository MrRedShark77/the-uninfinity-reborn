import type { DecimalSource } from "break_eternity.js";
import { player, temp } from "./main";
import { copySave, deepAssign, save, type Save } from "./utils/saveload";
import Decimal from "break_eternity.js";
import { D, softcap, scale, scaleAll, expPow, sumBase, simpleCost } from "./utils/decimal";
import { calc } from "./update";
import { notify } from "./utils/notify";
import { Quote } from "./utils/quote";
import { respecTimeStudies } from "./data/timestudies";
import { giveAchievement, giveAchievements } from "./data/achievements";

declare global {
  interface Window {
    player: Save;
    D: (x: DecimalSource) => Decimal;
    Decimal: unknown;

    formulas: Record<string, unknown>;

    dev: Record<string, unknown>;
  }
}

const Q = (s: string) => Quote.addFromKeys(s, true)
const respecTS = (b: boolean) => respecTimeStudies(b);

if (import.meta.env.DEV) {
  window.player = player;
  window.D = D;
  window.Decimal = Decimal;

  window.formulas = {
    softcap, scale, scaleAll, expPow, sumBase, simpleCost
  }

  window.dev = {
    save, calc, temp, copySave, notify, Q, respecTS, deepAssign, giveAchievement, giveAchievements
  }
}
