import { player } from "@/main";
import type { DecimalSource } from "break_eternity.js";
import { GENERATOR } from "./generators/normal-generators";
import Decimal from "break_eternity.js";
import { formatGain } from "@/utils/formats";
import { DC } from "@/utils/decimal";
import { inNormalChallenge } from "./challenges/normal-challenges";
import { INFINITY } from "./infinity";
import { INF_GENERATOR } from "./generators/infinity-generators";
import { INF_CHALLENGES, inInfinityChallenge } from "./challenges/infinity-challenges";
import { ETERNITY } from "./eternity";
import { TIME_GENERATOR } from "./generators/time-generators";
import { inEternitychallenge } from "./challenges/eternity-challenges";
import { getTimeStudyEffect, hasTimeStudy } from "./timestudies";
import { hasDilationUpgrade, TimeDilation } from "./dilation";
import { getAchievementEffect } from "./achievements";

export interface CurrencyData {
  name: string;
  amount: DecimalSource;
  gain: DecimalSource;
  passive: DecimalSource;
}
export enum Currency {
  Points = "points",
  InfinityPoints = "infinity",
  InfinityPower = "infinity-power",
  InfinityEnergy = "infinity-energy",
  EternityPoints = "eternity",
  TimeShards = "time-shards",
  TimeTheorems = "time-theorems",
  DilatedTime = "dilated-time",
}

export const CURRENCIES: Record<Currency, CurrencyData> = {
  points: {
    name: "Points",

    get amount() { return player.points },
    set amount(v) {
      player.points = Decimal.max(v,0)

      const CAP = inInfinityChallenge(0) ? DC.DE308 : INF_CHALLENGES[player.challenges.infinity.current].goal

      if ((!player.infinity.break || !inNormalChallenge(0) || !inInfinityChallenge(0)) && Decimal.gte(player.points, CAP)) {
        player.points = CAP
        player.infinity.reached = true;
      }
    },

    get gain() {
      let G = GENERATOR(1), x = Decimal.mul(G.amount, G.temp.mult)

      if (inNormalChallenge(12)) { G = GENERATOR(2); x = Decimal.pow(G.amount, 1.8).mul(G.temp.mult).add(x) }

      return x
    },

    passive: 1,
  },
  infinity: {
    name: "Infinity Points",

    get amount() { return player.infinity.points },
    set amount(v) {
      player.infinity.points = Decimal.max(v,0)
    },

    get gain() {
      if (!INFINITY.reached) return 0;

      let x = Decimal.log10(player.points).div(308).sub(.75).pow10()

      x = x.mul(INFINITY.totalIPMultiplier)

      if (hasDilationUpgrade(11)) x = x.pow(getTimeStudyEffect(111)).pow(getAchievementEffect(102));

      return x.floor()
    },

    get passive() { return +hasTimeStudy(191) / 100 },
  },
  "infinity-power": {
    name: "Infinity Power",

    get amount() { return player.infinity.power },
    set amount(v) {
      player.infinity.power = Decimal.max(v,0)
    },

    get gain() {
      if (inEternitychallenge(2) || inEternitychallenge(10)) return 0;

      const G = INF_GENERATOR(1), x = Decimal.mul(G.amount, G.temp.mult)

      return x
    },

    passive: 1,
  },
  "infinity-energy": {
    name: "Infinity Energy",

    get amount() { return player.infinity.energy.amount },
    set amount(v) { player.infinity.energy.amount = Decimal.max(v,0) },

    gain: 0,
    passive: 0,
  },
  eternity: {
    name: "Eternity Points",

    get amount() { return player.eternity.points },
    set amount(v) {
      player.eternity.points = Decimal.max(v,0)
    },

    get gain() {
      if (!ETERNITY.reached) return 0;

      let x = Decimal.log10(player.infinity.points).div(308).sub(.7).pow_base(5)

      x = x.mul(ETERNITY.totalEPMultiplier)

      x = x.pow(getAchievementEffect(122))

      return x.floor()
    },

    passive: 0,
  },
  "time-shards": {
    name: "Time Shards",

    get amount() { return player.eternity.shards },
    set amount(v) {
      player.eternity.shards = Decimal.max(v,0)
    },

    get gain() {
      if (inEternitychallenge(1) || inEternitychallenge(10)) return 0;

      const G = TIME_GENERATOR(1), x = Decimal.mul(G.amount, G.temp.mult)

      return x
    },

    passive: 1,
  },
  "time-theorems": {
    name: "Time Theorems",

    get amount() { return player.eternity.timestudy.theorems },
    set amount(v) {
      player.eternity.timestudy.theorems = v
    },

    gain: 0,

    passive: 0,
  },
  "dilated-time": {
    name: "Dilated Time",

    get amount() { return player.eternity.dilation.dilatedTime },
    set amount(v) {
      player.eternity.dilation.dilatedTime = Decimal.max(v,0);
      player.eternity.dilation.bestDilatedTime = Decimal.max(player.eternity.dilation.bestDilatedTime, player.eternity.dilation.dilatedTime);
    },

    get gain() {
      if (!hasTimeStudy("DIL")) return 0;

      return Decimal.mul(player.eternity.dilation.tachyonParticles, TimeDilation.DT_mult)
    },

    passive: 1,
  },
}

export function formatCurrencyGain(id: Currency) {
  const C = CURRENCIES[id]
  return formatGain(C.amount, Decimal.mul(C.gain, C.passive))
}
