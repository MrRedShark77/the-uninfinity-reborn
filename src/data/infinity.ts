import { player, temp } from "@/main";
import { DC, softcap } from "@/utils/decimal";
import { format, formatMult, formatPercent, formatTime } from "@/utils/formats";
import type { DecimalSource } from "break_eternity.js";
import Decimal from "break_eternity.js";
import { REFINER } from "./generators/normal-generators";
import { completeNormalChallenge, getNCCompletions, inNormalChallenge } from "./challenges/normal-challenges";
import { completeInfinityChallenge, INF_CHALLENGES, inInfinityChallenge } from "./challenges/infinity-challenges";
import { getAchievementEffect, giveAchievement, hasAchievement } from "./achievements";
import { infinityEnergyUpgradeEffect } from "./infinity-energy";
import { Quote } from "@/utils/quote";
import { CURRENCIES } from "./currencies";
import { getTimeStudyEffect, hasTimeStudy } from "./timestudies";
import { failEternityChallenge, getECCompletions, inEternitychallenge } from "./challenges/eternity-challenges";

export enum InfinityUpgrade {
  TimeMult = 'timeMult',
  GenBoost = 'genBoost',
  RefineBoost = 'refineBoost',
  InfinityBonus = 'infinityBonus',
  ExpanderBoost = 'expanderBoost',
  GenMult1 = 'genMult1',
  GenMult2 = 'genMult2',
  GenMult3 = 'genMult3',
  GenMult4 = 'genMult4',
  GenMult5 = 'genMult5',
  PassiveGen = 'passiveGen',
  Start1 = 'start1',
  Start2 = 'start2',
  Start3 = 'start3',
  Start4 = 'start4',
  IPMult = 'ipMult',

  CurrentMult = 'currentMult',
  BetterGenMult = 'betterGenMult',
  CurrentOoMMult = 'currentOomMult',
  ChalMult = 'chalMult',
  TimesGen = 'timesGen',
  ExpanderBulk = 'expanderBulk',
  RefineBoost2 = 'refineBoost2',
  OoMMultBoost = 'OomMultBoost',

  SlowerOoMMult = 'slowerOomMult',
  SlowerGenCost = 'slowerGenCost',
  IPGen = 'ipGen',
  CurrentMult2 = 'currentMult2',
}

export type RepeatableInfinityUpgrade = {
  max: DecimalSource;
  condition?: () => boolean;
  description: string;
  cost: (x: DecimalSource) => DecimalSource;
  bulk: (x: DecimalSource) => DecimalSource;
  effect?: (x: DecimalSource) => DecimalSource;
  display?: (x: DecimalSource) => string;
  maxButton?: boolean,
}

export const InfinityUpgrades: Record<string, {
  condition?: () => boolean;
  description: string;
  cost: DecimalSource;
  effect?: () => DecimalSource;
  display?: (x: DecimalSource) => string;
  onBought?(): void;
} | RepeatableInfinityUpgrade> = {
  "timeMult": {
    description: "Increases all generators based on your time played.",
    cost: 1,
    effect: () => Decimal.div(player.timePlayed, 60).add(1).root(5),
    display: x => formatMult(x),
  },
  "genBoost": {
    description: `Increases the multiplier per generator (×2 ➜ <b>×2.2</b>).`,
    cost: 1,
  },
  "refineBoost": {
    condition: () => hasInfinityUpgrade('genBoost'),
    description: "Generator refiner is <b>25%</b> stronger.",
    cost: 2,
  },
  "infinityBonus": {
    condition: () => hasInfinityUpgrade('refineBoost'),
    description: "Increases all generators based on unspent infinity points.",
    cost: 5,
    effect: () => softcap(Decimal.div(player.infinity.points, 2).add(1).pow(1.5), 1e4, 0.2, "P"),
    display: x => formatMult(x),
  },
  "expanderBoost": {
    condition: () => hasInfinityUpgrade('infinityBonus'),
    description: "Increases the multiplier per generator expander (×2 ➜ <b>×2.5</b>).",
    cost: 10,
  },

  "genMult1": {
    description: "Increases the 1st and 10th generators based on infinities.",
    cost: 1,
    effect: () => Decimal.div(INFINITY.totalInfinities,5).add(1).pow(getTimeStudyEffect(31)),
    display: x => formatMult(x),
  },
  "genMult2": {
    condition: () => hasInfinityUpgrade('genMult1'),
    description: "Increases the 2nd and 9th generators based on infinities.",
    cost: 1,
    effect: () => Decimal.div(INFINITY.totalInfinities,5).add(1).pow(getTimeStudyEffect(31)),
    display: x => formatMult(x),
  },
  "genMult3": {
    condition: () => hasInfinityUpgrade('genMult2'),
    description: "Increases the 3rd and 8th generators based on infinities.",
    cost: 1,
    effect: () => Decimal.div(INFINITY.totalInfinities,5).add(1).pow(getTimeStudyEffect(31)),
    display: x => formatMult(x),
  },
  "genMult4": {
    condition: () => hasInfinityUpgrade('genMult3'),
    description: "Increases the 4th and 7th generators based on infinities.",
    cost: 1,
    effect: () => Decimal.div(INFINITY.totalInfinities,5).add(1).pow(getTimeStudyEffect(31)),
    display: x => formatMult(x),
  },
  "genMult5": {
    condition: () => hasInfinityUpgrade('genMult4'),
    description: "Increases the 5th and 6th generators based on infinities.",
    cost: 1,
    effect: () => Decimal.div(INFINITY.totalInfinities,5).add(1).pow(getTimeStudyEffect(31)),
    display: x => formatMult(x),
  },

  "start1": {
    condition: () => inNormalChallenge(0),
    description: "You start with the 5th and 6th generators unlocked.",
    cost: 20,

    onBought() { player.expanders = Decimal.max(player.expanders, 2) },
  },
  "start2": {
    condition: () => inNormalChallenge(0) && hasInfinityUpgrade('start1'),
    description: "You start with the 7th and 8th generators unlocked.",
    cost: 40,

    onBought() { player.expanders = Decimal.max(player.expanders, 4) },
  },
  "start3": {
    condition: () => inNormalChallenge(0) && hasInfinityUpgrade('start2'),
    description: "You start with the 9th and 10th generators unlocked.",
    cost: 80,

    onBought() { player.expanders = Decimal.max(player.expanders, 6) },
  },
  "start4": {
    condition: () => inNormalChallenge(0) && hasInfinityUpgrade('start3'),
    description: "You start with additional generator expander, and the requirement of generator refiner is reduced by <b>^0.9</b>.",
    cost: 320,

    onBought() {
      player.expanders = Decimal.max(player.expanders, 7);
      if (Decimal.lte(player.refiner.highest, 1e100)) player.refiner.highest = 1e90;
    },
  },

  "passiveGen": {
    description: "Passively generates infinity points based on your fastest infinity.",
    cost: 10,
    display: () => format(INFINITY.totalIPMultiplier,0) + " IP every " + formatTime(Decimal.mul(player.infinity.fastest, 10)),
  },

  "ipMult": {
    condition: () => true,

    max: DC.DINF,
    description: "Gain ×2 more IP.",

    cost(x) {
      let y = Decimal.pow(10, x).mul(10).log10()

      if (y.gte(1e6)) y = y.pow(2).div(1e6);

      return y.pow10()
    },
    bulk(x) {
      let y = Decimal.log10(x)

      if (y.gte(1e6)) y = y.mul(1e6).root(2);

      return y.pow10().div(10).log(10).floor().add(1)
    },

    effect: x => Decimal.pow(2, x),
    display: x => formatMult(x,0),
    maxButton: true,
  },

  // Break Infinity

  "currentMult": {
    condition: () => true,
    description: `All Generators are powered based on your current points.`,
    cost: 1e4,
    effect: () => Decimal.add(player.points,10).log10(),
    display: x => formatMult(x),
  },
  "betterGenMult": {
    condition: () => true,
    description: `All Generators are powered based on infinities.`,
    cost: 1e5,
    effect: () => Decimal.sqr(INFINITY.totalInfinities).div(100).add(1).pow(getTimeStudyEffect(31)),
    display: x => formatMult(x),
  },
  "currentOomMult": {
    condition: () => true,
    description: `The multiplier per OoMs of each generator is stronger based on your current points.`,
    cost: 1e6,
    effect: () => Decimal.add(player.points,10).log10().log10().div(10).add(1),
    display: x => formatMult(x,3),
  },
  "chalMult": {
    condition: () => true,
    description: `All Generators are powered based on the slowest challenge run.`,
    cost: 1e7,
    effect: () => {
      let x = DC.D0

      player.challenges.normal.fastest.forEach(y => {x = Decimal.max(x, y)})

      return Decimal.div(3000, Decimal.max(x,.1)).max(1)
    },
    display: x => formatMult(x),
  },
  "timesGen": {
    description: "Passively generates Infinitied stat based on your fastest infinity.",
    cost: 2.5e7,
    display: () => format(temp.infinity.infinities_gain, 0) + " Infinities every " + formatTime(Decimal.mul(player.infinity.fastest, 5)),
  },
  "currentMult2": {
    condition: () => true,
    description: `All Infinity Generators are powered based on your current IP.`,
    cost: 1e8,
    effect: () => Decimal.add(player.infinity.points,10).log10(),
    display: x => formatMult(x),
  },
  "expanderBulk": {
    condition: () => true,
    description: `You can max Generator Expanders (there is a bulk option). Buying any Generator no longer takes points away.`,
    cost: 5e9,
  },
  "refineBoost2": {
    condition: () => true,
    description: `Generator refiner is <b>100%</b> stronger.`,
    cost: 1e17,
  },
  "OomMultBoost": {
    condition: () => true,
    description: `The multiplier per OoMs of each generator is <b>50%</b> stronger.`,
    cost: 1e24,
  },

  "slowerOomMult": {
    max: 10,
    condition: () => true,
    description: `Slows down the post-infinity reduction of multiplier per OoMs of each generator by <b>5%</b>.`,

    cost: x => Decimal.pow10(x).mul(1e6),
    bulk: x => Decimal.div(x,1e6).log10().floor().add(1),

    effect: x => Decimal.mul(x, .05),
    display: x => formatPercent(x,0) + (Decimal.lt(x, .5) ? " ➜ " + formatPercent(Decimal.add(x, .05),0) : ""),
  },
  "slowerGenCost": {
    max: 10,
    condition: () => true,
    description: `Slows down the post-infinity scaling of all generators by <b>5%</b>.`,

    cost: x => Decimal.pow(1e4, x).mul(1e7),
    bulk: x => Decimal.div(x, 1e7).log(1e4).floor().add(1),

    effect: x => Decimal.mul(x, .05),
    display: x => formatPercent(x,0) + (Decimal.lt(x, .5) ? " ➜ " + formatPercent(Decimal.add(x, .05),0) : ""),
  },
  "ipGen": {
    max: 10,
    condition: () => true,
    get description() {
      const L = player.infinity.upgrades.ipGen

      return `Generates <b>${formatPercent(Decimal.mul(L, .05),0) + (Decimal.lt(L, 10) ? " ➜ " + formatPercent(Decimal.mul(L, .05).add(.05),0) : "")}</b> of your best IP/min from last 10 infinities.`
    },

    cost: x => Decimal.pow(10, x).mul(1e7),
    bulk: x => Decimal.div(x, 10).log(1e4).floor().add(1),

    effect: x => {
      let best: DecimalSource = 0

      player.infinity.last10.forEach(y => { best = Decimal.div(y.amount, y.time).mul(60).max(best) })

      return Decimal.mul(x, .05).mul(best)
    },
    display: x => format(x,0)+" IP/min",
  },
}

export function hasInfinityUpgrade(id: string, level: DecimalSource = 1) { return Decimal.gte(player.infinity.upgrades[id], level) }
export function infinityUpgradeEffect(id: string, def: DecimalSource = 1) { return temp.infinity.upgrades[id] ?? def }
export function simpleInfinityEffect(id: string, def: DecimalSource = 1) { return hasInfinityUpgrade(id) ? temp.infinity.upgrades[id] ?? def : def }

export function purchaseInfinityUpgrade(id: string, all: boolean = false) {
  const U = InfinityUpgrades[id], max = 'max' in U ? U.max ?? DC.DINF : 1;

  if (!(U.condition?.() ?? true) || hasInfinityUpgrade(id, max)) return;

  let cost = 'max' in U ? U.cost(player.infinity.upgrades[id]) : U.cost;

  if (Decimal.gte(player.infinity.points, cost)) {
    if ('max' in U) {
      let bulk = Decimal.add(player.infinity.upgrades[id], 1)

      if (all) {
        bulk = bulk.max(U.bulk(player.infinity.points))
        cost = U.cost(bulk.sub(1));
      }

      player.infinity.upgrades[id] = bulk;
    }
    else player.infinity.upgrades[id] = 1;

    if (id !== InfinityUpgrade.IPMult || Decimal.lt(player.eternity.times, 1)) player.infinity.points = Decimal.sub(player.infinity.points, cost).max(0);
    if ('onBought' in U) U.onBought?.();
  }
}

export function updateInfinityTemp() {
  temp.infinity.infinities_gain = INFINITY.infinitiesGain

  for (const id in InfinityUpgrades) {
    const U = InfinityUpgrades[id]
    if (U.effect) temp.infinity.upgrades[id] = 'max' in U ? U.effect(player.infinity.upgrades[id]) : U.effect();
  }
}

export const INFINITY = {
  get reached() { return Decimal.gte(player.points, inInfinityChallenge(0) ? DC.DE308 : INF_CHALLENGES[player.challenges.infinity.current].goal) },

  crunch() {
    if (!this.reached) return;

    const gain = player.infinity.break ? CURRENCIES.infinity.gain : this.totalIPMultiplier

    player.achRestrictions.a101 += +Decimal.div(gain, player.infinity.points).gte(DC.DE308);
    if (player.achRestrictions.a101 >= 10) giveAchievement(101);

    player.infinity.points = Decimal.add(player.infinity.points, gain);
    player.infinity.times = Decimal.add(player.infinity.times, temp.infinity.infinities_gain);
    player.infinity.fastest = Decimal.min(player.infinity.fastest, player.infinity.time)
    player.eternity.fastInfinties = Decimal.clampMin(player.eternity.fastInfinties, Decimal.div(temp.infinity.infinities_gain, Decimal.max(player.infinity.fastest, .025)))
    player.first.infinity = true

    player.infinity.last10.push({
      time: player.infinity.time,
      amount: gain,
    })
    if (player.infinity.last10.length > 10) player.infinity.last10.splice(0,1);

    player.achRestrictions.a97++;

    player.challenges.normal.completedBits ||= 1;
    if (!inNormalChallenge(0)) completeNormalChallenge();
    if (!inInfinityChallenge(0)) completeInfinityChallenge();

    player.challenges.normal.C2 = .01;
    player.challenges.normal.C10 = 0;

    giveAchievement(31)
    if (Decimal.lte(player.infinity.time, 7200)) giveAchievement(35);
    if (Decimal.lte(player.infinity.time, 600)) giveAchievement(44);
    if (Decimal.lte(player.infinity.time, 60)) giveAchievement(45);
    if (Decimal.lte(player.infinity.time, .25)) giveAchievement(68);

    if (Decimal.lte(temp.refiner_boost, 100)) giveAchievement(36);
    if (Decimal.lt(player.generators[10].bought, 1)) giveAchievement(37);

    Quote.addFromKeys('infinity');

    if (inEternitychallenge(4) && Decimal.gt(player.infinity.times, 8 - 2 * Math.min(getECCompletions(4)))) {
      failEternityChallenge()
      return
    }

    this.reset()
  },

  reset() {
    player.infinity.time = 0
    player.refiner.highest = hasInfinityUpgrade(InfinityUpgrade.Start4) ? 1e90 : 1e100
    player.infinity.reached = false

    for (let i = 1; i <= 10; i++) player.infinity.generators[i].amount = 0;
    if (!hasTimeStudy(33)) player.infinity.energy.amount = 0;

    REFINER.reset()
  },

  break() {
    if (player.infinity.break)
      return;
    Quote.addFromKeys('break_infinity');
    player.infinity.break = true
    player.infinity.reached = false
  },

  get totalIPMultiplier(): DecimalSource {
    let x: DecimalSource = 1

    x *= 1 + Math.floor(getNCCompletions() / 4)

    x = Decimal.mul(x, infinityUpgradeEffect(InfinityUpgrade.IPMult))

    x = x.mul(getAchievementEffect(42)).mul(getAchievementEffect(81)).mul(getAchievementEffect(85)).mul(getAchievementEffect(107))

    x = x.mul(getTimeStudyEffect(41)).mul(getTimeStudyEffect(51)).mul(getTimeStudyEffect(141)).mul(getTimeStudyEffect(142)).mul(getTimeStudyEffect(143))

    x = x.pow(getTimeStudyEffect(111)).pow(getAchievementEffect(102))

    return x
  },

  get infinitiesGain(): DecimalSource {
    if (inEternitychallenge(4)) return 1;

    let x = DC.D1

    x = x.mul(infinityEnergyUpgradeEffect(5, 1)).mul(getTimeStudyEffect(32))
    x = x.mul(getAchievementEffect(62)).mul(getAchievementEffect(92))

    return x.max(1).round()
  },

  get totalInfinities(): DecimalSource { return Decimal.add(player.infinity.times, player.infinity.banked) },

  bankInfinities() {
    let percent = 0

    if (hasTimeStudy(211)) percent += .05;
    if (hasAchievement(121)) percent += .05;

    player.infinity.banked = Decimal.mul(player.infinity.times, percent).add(player.infinity.banked)
  },
}
