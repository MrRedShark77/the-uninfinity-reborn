import { player, temp } from "@/main"
import { DC } from "@/utils/decimal"
import Decimal, { type DecimalSource } from "break_eternity.js"
import { CURRENCIES } from "./currencies"
import { calcCompletedAchievements, giveAchievement, hasAchievement } from "./achievements"
import { INFINITY, type RepeatableInfinityUpgrade } from "./infinity"
import { InfinityEnergy } from "./infinity-energy"
import { getTimeStudyEffect, respecTimeStudies } from "./timestudies"
import { format, formatMult, formatPlus, formatTime } from "@/utils/formats"
import { getTotalFastestIC } from "./challenges/infinity-challenges"
import { Quote } from "@/utils/quote"

export enum EternityUpgrade {
  InfGenMult1 = 'infGenMult1',
  InfGenMult2 = 'infGenMult2',
  InfGenMult3 = 'infGenMult3',
}

export const EternityUpgrades: Record<string, {
  condition?: () => boolean;
  description: string;
  cost: DecimalSource;
  effect?: () => DecimalSource;
  display?: (x: DecimalSource) => string;
  onBought?(): void;
} | RepeatableInfinityUpgrade> = {
  'infGenMult1': {
    description: `Increases Infinity Generators based on unspent Eternity Points.`,
    cost: 5,
    effect: () => Decimal.add(player.eternity.points, 1),
    display: x => formatMult(x, 0),
  },
  'infGenMult2': {
    description: `Increases Infinity Generators based on Eternities.`,
    cost: 10,
    effect: () => Decimal.add(player.eternity.times, 1).log(5).pow(2).pow_base(5),
    display: x => formatMult(x),
  },
  'infGenMult3': {
    description: `Increases Infinity Generators based on the sum of Infinity Challenge times.`,
    cost: 5e4,
    effect: () => Decimal.div(30, Math.max(getTotalFastestIC(), .5)).pow_base(2),
    display: x => formatMult(x),
  },
  'infGenMult4': {
    description: `Infinity Power slowdown is delayed by Infinity Energy.`,
    cost: 1e9,
    effect: () => Decimal.add(player.infinity.power, 1).log2().mul(10).add(1).log2().sqr().pow_base(2),
    display: x => formatMult(x),
  },

  'timeGenMult1': {
    description: `Time Generators are increased by your achievements beaten.`,
    cost: 2e16,
    effect: () => Decimal.pow(1.25, calcCompletedAchievements()),
    display: x => formatMult(x),
  },
  'timeGenMult2': {
    description: `Time Shards affect Infinity Generators at a reduced rate.`,
    cost: 4e25,
    effect: () => Decimal.add(player.eternity.shards, 1).log(1.5),
    display: x => formatPlus(x),
  },
  'timeGenMult3': {
    description: `Time Generators are increased by the unspent time theorems.`,
    cost: 8e36,
    effect: () => Decimal.add(player.eternity.timestudy.theorems, 1).sqr(),
    display: x => formatMult(x, 0),
  },
  'timeGenMult4': {
    description: `Time Generators are increased by the total time you played.`,
    cost: 1e50,
    effect: () => Decimal.div(player.timePlayed, 3600).add(1),
    display: x => formatMult(x),
  },

  "epMult": {
    condition: () => true,

    max: DC.DINF,
    description: "Gain ×5 more EP.",

    cost: x => Decimal.pow(50, x).mul(50),
    bulk: x => Decimal.div(x,50).log(50).floor().add(1),

    effect: x => Decimal.pow(5, x),
    display: x => formatMult(x,0),
    maxButton: true,
  },
}

export function hasEternityUpgrade(id: string, level: DecimalSource = 1) { return Decimal.gte(player.eternity.upgrades[id], level) }
export function eternityUpgradeEffect(id: string, def: DecimalSource = 1) { return temp.eternity.upgrades[id] ?? def }
export function simpleEternityEffect(id: string, def: DecimalSource = 1) { return hasEternityUpgrade(id) ? temp.eternity.upgrades[id] ?? def : def }

export function purchaseEternityUpgrade(id: string, all: boolean = false) {
  const U = EternityUpgrades[id], max = 'max' in U ? U.max ?? DC.DINF : 1;

  if (!(U.condition?.() ?? true) || hasEternityUpgrade(id, max)) return;

  let cost = 'max' in U ? U.cost(player.eternity.upgrades[id]) : U.cost;

  if (Decimal.gte(player.eternity.points, cost)) {
    if ('max' in U) {
      let bulk = Decimal.add(player.eternity.upgrades[id], 1)

      if (all) {
        bulk = bulk.max(U.bulk(player.eternity.points))
        cost = U.cost(bulk.sub(1));
      }

      player.eternity.upgrades[id] = bulk;
    }
    else player.eternity.upgrades[id] = 1;

    player.eternity.points = Decimal.sub(player.eternity.points, cost).max(0);
    if ('onBought' in U) U.onBought?.();
  }
}

export const ETERNITY = {
  get reached() { return Decimal.gte(player.infinity.points, DC.DE308) },

  get totalEPMultiplier(): DecimalSource {
    let x = DC.D1

    x = x.mul(simpleEternityEffect('epMult'))

    x = x.mul(getTimeStudyEffect(61))
    .mul(getTimeStudyEffect(121)).mul(getTimeStudyEffect(122)).mul(getTimeStudyEffect(123))

    return x
  },

  get eternitiesGain(): DecimalSource {
    let x = DC.D1

    x = x;

    return x.max(1).round()
  },

  eternity() {
    if (!this.reached) return;

    const gain = CURRENCIES.eternity.gain

    player.eternity.points = Decimal.add(player.eternity.points, gain);
    player.eternity.times = Decimal.add(player.eternity.times, 1);
    player.eternity.fastest = Math.min(player.eternity.fastest, player.eternity.time)
    player.first.eternity = true

    player.eternity.last10.push({
      time: player.eternity.time,
      amount: gain,
    })
    if (player.eternity.last10.length > 10) player.eternity.last10.splice(0,1);

    giveAchievement(86)
    if (player.achRestrictions.a91) giveAchievement(91);
    if (player.achRestrictions.a93) giveAchievement(93);
    if (player.achRestrictions.a97 < 10) giveAchievement(97);
    if (Decimal.lte(player.eternity.time, 10)) giveAchievement(98);

    Quote.addFromKeys('eternity');

    this.reset()
  },

  reset() {
    player.eternity.time = 0

    let R;

    if (Decimal.lt(player.eternity.times, 3)) {
      R = [
        'timeMult',   'genBoost', 'refineBoost', 'infinityBonus', 'expanderBoost',
        'genMult1',   'genMult2', 'genMult3',    'genMult4',      'genMult5',
        'passiveGen',
      ]

      R.forEach(x => player.infinity.upgrades[x] = 0);
    }

    if (Decimal.lt(player.eternity.times, 7)) {
      R = [
        'currentMult',   'betterGenMult', 'currentOomMult',
        'chalMult',      'timesGen',      'currentMult2',
        'expanderBulk',  'refineBoost2',  'OomMultBoost',
        'slowerOomMult', 'slowerGenCost', 'ipGen',
      ]

      R.forEach(x => player.infinity.upgrades[x] = 0);
    }

    player.infinity.upgrades['ipMult'] = 0

    player.infinity.power = 0

    if (hasAchievement(98)) player.infinity.points = 5e25;
    else player.infinity.points = 0;

    player.infinity.times = 0
    player.infinity.fastest = Number.MAX_VALUE
    player.eternity.fastInfinties = 0
    player.infinity.last10 = []

    if (Decimal.lt(player.eternity.times, 2)) {
      player.infinity.break = false
      player.challenges.normal.completedBits = 0;
      R = [
        'generators', 'expander', 'refiner', 'infinity'
      ]

      R.forEach(x => player.automations[x].level = 0);
    }

    for (let i = 1; i <= 10; i++) player.infinity.generators[i].bought = 0;
    if (Decimal.lt(player.eternity.times, 20)) player.infinity.generatorsUnlocked = 0;
    if (Decimal.lt(player.eternity.times, 8)) player.infinity.energy.unlocked = false;
    for (let i = 0; i < InfinityEnergy.upgrades.length; i++) player.infinity.energy.upgrades[i] = 0;

    player.challenges.infinity.unlocked = 0;
    player.challenges.normal.current = 0;
    player.challenges.infinity.current = 0;

    player.challenges.infinity.completedBits = 0;

    player.eternity.shards = 0;
    for (let i = 1; i <= 10; i++) player.eternity.generators[i].amount = 0;

    player.achRestrictions.a91 = true;
    player.achRestrictions.a93 = true;
    player.achRestrictions.a97 = 0;

    if (player.eternity.timestudy.respec) {
      respecTimeStudies(true);
      player.eternity.timestudy.respec = false;
    }

    INFINITY.reset()
  },

  milestones: [
    {
      count: 1,
      get description() { return `Unlock the Infinity Point multiplier autobuyer.` },
    },{
      count: 2,
      get description() { return `Start with all Normal Challenges complete, all normal autobuyers, and infinity broken in the Eternity.` },
    },{
      count: 3,
      get description() { return `Start with all non-break infinity upgrades in the Eternity.` },
    },{
      count: 4,
      get description() { return `Unlock a new Big Crunch autobuyer option.` },
    },{
      count: 5,
      get rate() { return player.eternity.last10.reduce((a,b) => Decimal.div(b.amount, b.time).mul(60).max(a), DC.D0).div(4) },
      get description() { return `Generate <b>25%</b> of your best Eternity Points per minute from the previous Eternities. <b>(${format(this.rate as DecimalSource)} EP/min)</b>` },
    },{
      count: 6,
      get description() { return `Infinity Challenges can be completed as soon as they're unlocked.` },
    },{
      count: 7,
      get description() { return `Start with all break infinity upgrades in the Eternity.` },
    },{
      count: 8,
      get description() { return `Start with Infinity Energy unlocked in the Eternity.` },
    },{
      count: 9,
      get description() { return `Unlock the 1st Infintiy Generator autobuyer.` },
    },{
      count: 10,
      get description() { return `Unlock the 2nd Infintiy Generator autobuyer.` },
    },{
      count: 11,
      get description() { return `Unlock the 3rd Infintiy Generator autobuyer.` },
    },{
      count: 12,
      get description() { return `Unlock the 4th Infintiy Generator autobuyer.` },
    },{
      count: 13,
      get description() { return `Unlock the 5th Infintiy Generator autobuyer.` },
    },{
      count: 14,
      get description() { return `Unlock the 6th Infintiy Generator autobuyer.` },
    },{
      count: 15,
      get description() { return `Unlock the 7th Infintiy Generator autobuyer.` },
    },{
      count: 16,
      get description() { return `Unlock the 8th Infintiy Generator autobuyer.` },
    },{
      count: 17,
      get description() { return `Unlock the 9th Infintiy Generator autobuyer.` },
    },{
      count: 18,
      get description() { return `Unlock the 10th Infintiy Generator autobuyer.` },
    },{
      count: 20,
      get description() { return `Start with all Infinity Generators unlocked in the Eternity. Buying them no longer takes IP away.` },
    },{
      count: 30,
      get description() { return `Generator Refiner no longer resets anything.` },
    },{
      count: 40,
      get description() { return `Unlock a Infinity Energy Upgrades autobuyer.` },
    },{
      count: 50,
      get description() { return `Unlock an Eternity autobuyer.` },
    },{
      count: 100,
      get description() { return `Generate Eternities based on your fastest Eternity at a <b>50%</b> rate. <b>(${format(1,0)} Eternities every ${formatTime(Decimal.mul(player.eternity.fastest, 2))})</b>` },
    },{
      count: 1000,
      get description() { return `Generate Infinities at a <b>50%</b> rate of your best Infinities/s this Eternity. <b>(${format(Decimal.div(player.eternity.fastInfinties, 2),0)} Infinities/s)</b>` },
    },
  ] as {
    count: DecimalSource,
    description: string,

    [index: string]: unknown,
  }[],
}

export function updateEternityTemp() {
  for (const id in EternityUpgrades) {
    const U = EternityUpgrades[id]
    if (U.effect) temp.eternity.upgrades[id] = 'max' in U ? U.effect(player.eternity.upgrades[id]) : U.effect();
  }
}
