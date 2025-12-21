import type { DecimalSource } from "break_eternity.js";
import { CURRENCIES, Currency } from "./currencies";
import Decimal from "break_eternity.js";
import { player, temp } from "@/main";
import { formatMult, formatPlus } from "@/utils/formats";
import { DC, expPow } from "@/utils/decimal";
import { ETERNITY } from "./eternity";

type TS_ID = number | string
type TS_type = "normal" | "NG" | "IG" | "TG" | "active" | "passive" | "idle"

export interface TimeStudy {
  type: TS_type,

  id: TS_ID,
  condition?(): boolean;
  posiiton?: [number, number];
  branch: (TS_ID)[];

  require?(): boolean;
  requirement?: string;

  description: string;
  cost: DecimalSource;
  currency?: string;

  effect?: [()=>DecimalSource, DecimalSource] | [()=>DecimalSource, DecimalSource, (x: DecimalSource)=>string],
}

interface InvisibleBlock {
  type: "invisible"
  condition?(): boolean;
  position: [number, number];
}

export const TimeStudies: (TimeStudy | InvisibleBlock)[] = [
  {
    type: "normal",

    id: 11,
    branch: [],
    get description() { return `The 1st Time Generator is affected by Generator Refiner at a reduced rate.` },
    cost: 1,

    effect: [() => Decimal.max(temp.refiner_boost, 1).pow(.005), 1, x => formatMult(x)],
  },

  {
    type: "normal",

    id: 21,
    branch: [11],
    get description() { return `The effect of Infinity Energy is powered by <b>^2</b>.` },
    cost: 3,
    effect: [() => 2, 1],
  },{
    type: "normal",

    id: 22,
    branch: [11],
    get description() { return `The exponent of Infinity Energy is increased by <b>+100%</b>.` },
    cost: 2,
    effect: [() => 2, 1],
  },

  {
    type: "invisible",
    position: [3,0],
  },{
    type: "normal",

    id: 31,
    branch: [21],
    get description() { return `Upgrades that boost anything based on Infinities are powered by <b>^5</b>.` },
    cost: 3,
    effect: [() => 5, 1],
  },{
    type: "normal",

    id: 32,
    branch: [22],
    get description() { return `Gain more Infinities based on Generator Expanders.` },
    cost: 2,

    effect: [() => Decimal.add(player.expanders, 1), 1, x => formatMult(x,0)],
  },{
    type: "normal",

    id: 33,
    branch: [22],
    get description() { return `Infinity no longer resets Infinity Energy.` },
    cost: 2,
  },

  {
    type: "normal",

    id: 41,
    branch: [31],
    get description() { return `Generator Refiner boosts Infinity Points at a reduced rate.` },
    cost: 4,
    effect: [() => expPow(Decimal.max(temp.refiner_boost, 1), .5), 1, x => formatMult(x)],
  },{
    type: "normal",

    id: 42,
    branch: [32],
    get description() { return `Improve Generator Refiner further.` },
    cost: 6,
    effect: [() => .25, 0],
  },

  {
    type: "normal",

    id: 51,
    branch: [41,42],
    get description() { return `Gain <b>${formatMult(1e20)}</b> more Infinity Points.` },
    cost: 3,
    effect: [() => 1e20, 1],
  },

  {
    type: "normal",

    id: 61,
    branch: [51],
    get description() { return `Gain <b>${formatMult(20,0)}</b> more Eternity Points.` },
    cost: 3,
    effect: [() => 20, 1],
  },

  {
    type: "NG",
    require: () => +hasTimeStudy(71) + +hasTimeStudy(72) + +hasTimeStudy(73) < 1,

    id: 71,
    branch: [61],
    get description() { return `The multiplier per Generator Expander is increased to <b>×16</b>.` },
    cost: 4,
  },{
    type: "IG",
    require: () => +hasTimeStudy(71) + +hasTimeStudy(72) + +hasTimeStudy(73) < 1,

    id: 72,
    branch: [61],
    get description() { return `Infinity Generators are increased by <b>×1.5</b> per Generator Expander.` },
    cost: 5,
    effect: [() => Decimal.pow(1.5, player.expanders), 1, x => formatMult(x)],
  },{
    type: "TG",
    require: () => +hasTimeStudy(71) + +hasTimeStudy(72) + +hasTimeStudy(73) < 1,

    id: 73,
    branch: [61],
    get description() { return `Time Generators are increased by <b>×1.1</b> per Generator Expander.` },
    cost: 6,
    effect: [() => Decimal.pow(1.1, player.expanders), 1, x => formatMult(x)],
  },

  {
    type: "NG",

    id: 81,
    branch: [71],
    get description() { return `The requirement of Generator Expanders is slower.` },
    cost: 4,
  },{
    type: "IG",

    id: 82,
    branch: [72],
    get description() { return `The multiplier per Generator Expander is boosted by Infinity Power.` },
    cost: 5,
    effect: [() => Decimal.add(player.infinity.power, 1).log10().cbrt().pow_base(1.01), 1, x => formatMult(x)],
  },{
    type: "TG",

    id: 83,
    branch: [73],
    get description() { return `The multiplier per Generator Expander is boosted by Time Shards.` },
    cost: 6,
    effect: [() => Decimal.add(player.eternity.shards, 1).log10().sqrt().pow_base(1.01), 1, x => formatMult(x)],
  },

  {
    type: "NG",

    id: 91,
    branch: [81],
    get description() { return `Normal Generators are boosted by time spent in this Eternity.` },
    cost: 4,
    effect: [() => Decimal.min(player.eternity.time, 3600).mul(1024/3600).pow_base(2), 1, x => formatMult(x)],
  },{
    type: "IG",

    id: 92,
    branch: [82],
    get description() { return `Infinity Generators are boosted by the fastest Eternity time.` },
    cost: 5,
    effect: [() => Decimal.div(3600, Math.max(player.eternity.fastest, .3)).clamp(1,1e4).pow(5), 1, x => formatMult(x)],
  },{
    type: "TG",

    id: 93,
    branch: [83],
    get description() { return `Time Generators are boosted by Time Shards.` },
    cost: 6,
    effect: [() => expPow(Decimal.add(player.eternity.shards, 1), .25), 1, x => formatMult(x)],
  },

  {
    type: "NG",

    id: 101,
    branch: [91],
    get description() { return `Normal Generators are multiplied by Infinity Energy.` },
    cost: 4,
    effect: [() => Decimal.add(player.infinity.energy.amount, 1), 1, x => formatMult(x)],
  },{
    type: "IG",

    id: 102,
    branch: [92],
    get description() { return `Infinity Energy adds its exponent at a reduced rate.` },
    cost: 5,
    effect: [() => Decimal.add(player.infinity.energy.amount, 10).log10().log10().div(2), 0, x => formatPlus(x,3)],
  },{
    type: "TG",

    id: 103,
    branch: [93],
    get description() { return `The 1st Time Generator is boosted by Infinity Energy at a reduced rate.` },
    cost: 6,
    effect: [() => expPow(Decimal.add(player.infinity.energy.amount, 1), .5), 1, x => formatMult(x)],
  },

  {
    type: "normal",

    id: 111,
    branch: [101,102,103],
    get description() { return `Infinity Points are powered by <b>^1.08</b>.` },
    cost: 12,
    effect: [() => 1.08, 1],
  },

  {
    type: "active",
    require: () => +hasTimeStudy(121) + +hasTimeStudy(122) + +hasTimeStudy(123) < 1,

    id: 121,
    branch: [111],
    get description() { return `Increase Eternity Points gained how fast you last ten Eternities are.` },
    cost: 9,
    effect: [() => Decimal.div(300, player.eternity.last10.reduce((a,b) => Decimal.add(a, b.time), DC.D0).div(player.eternity.last10.length)).clamp(1, 60), 1, x => formatMult(x)],
  },{
    type: "passive",
    require: () => +hasTimeStudy(121) + +hasTimeStudy(122) + +hasTimeStudy(123) < 1,

    id: 122,
    branch: [111],
    get description() { return `Gain <b>${formatMult(40,0)}</b> more Eternity Points.` },
    cost: 9,
    effect: [() => 40, 1],
  },{
    type: "idle",
    require: () => +hasTimeStudy(121) + +hasTimeStudy(122) + +hasTimeStudy(123) < 1,

    id: 123,
    branch: [111],
    get description() { return `Increase Eternity Points gained based on time spent on Eternity.` },
    cost: 9,
    effect: [() => Decimal.mul(player.eternity.time, 2).add(1).sqrt(), 1, x => formatMult(x)],
  },

  {
    type: "active",

    id: 131,
    branch: [121],
    get description() { return `The exponent of Infinity Energy is increased by <b>+50%</b>, but it reduces over this Infinity to <b>0%</b>.` },
    cost: 5,
    effect: [() => Decimal.sub(1, Decimal.sqrt(player.infinity.time).div(11)).max(0).mul(1.5), 1, x => formatMult(x,3,false)],
  },{
    type: "passive",

    id: 132,
    branch: [122],
    get description() { return `The exponent of Infinity Energy is increased by <b>+40%</b>.` },
    cost: 5,
    effect: [() => 1.4, 1],
  },{
    type: "idle",

    id: 133,
    branch: [123],
    get description() { return `The exponent of Infinity Energy is reduced to <b>0%</b>, but it increases over this Infinity to <b>+50%</b>.` },
    cost: 5,
    effect: [() => Decimal.sqrt(player.infinity.time).div(11).min(1).mul(1.5), 1, x => formatMult(x,3,false)],
  },

  {
    type: "active",

    id: 141,
    branch: [131],
    get description() { return `Give Infinity Points a boost decayed over Infinity.` },
    cost: 4,
    effect: [() => Decimal.sub(50, Decimal.mul(player.infinity.time, 10).add(1).log2().mul(Decimal.pow(player.infinity.time, .125).min(1e3))).pow10().max(1), 1, x => formatMult(x,3,false)],
  },{
    type: "passive",

    id: 142,
    branch: [132],
    get description() { return `Gain <b>${formatMult(1e30,0)}</b> more Infinity Points.` },
    cost: 4,
    effect: [() => 1e30, 1],
  },{
    type: "idle",

    id: 143,
    branch: [133],
    get description() { return `Give Infinity Points a boost increased over Infinity.` },
    cost: 4,
    effect: [() => Decimal.mul(player.infinity.time, 10).add(1).log2().mul(Decimal.pow(player.infinity.time, .125).min(1e3)).pow10(), 1, x => formatMult(x,3,false)],
  },

  {
    type: "normal",

    id: 151,
    branch: [141,142,143],
    get description() { return `<b>${formatMult(1e6,0)}</b> multiplier on Time Generators.` },
    cost: 8,
    effect: [() => 1e6, 1],
  },

  {
    type: "normal",

    id: 161,
    branch: [151],
    get description() { return `<b>${formatMult('e1000',0)}</b> multiplier on Normal Generators.` },
    cost: 7,
    effect: [() => 'e1000', 1],
  },{
    type: "normal",

    id: 162,
    branch: [151],
    get description() { return `<b>${formatMult(1e100,0)}</b> multiplier on Infinity Generators.` },
    cost: 7,
    effect: [() => 1e100, 1],
  },

  {
    type: "normal",

    id: 171,
    branch: [161,162],
    get description() { return `Improve Time Shards slightly.` },
    cost: 15,
  },
]

export function getTimeStudy(id: number, index: boolean = false) { return TimeStudies[index ? id : TimeStudiesIndex[id]] };

export const TimeStudiesIndex: Record<string, number> = {};

TimeStudies.forEach((x, i) => {
  if (x.type === 'invisible') return;

  TimeStudiesIndex[x.id] = i;

  if (typeof x.id === 'string') return;

  x.posiiton ??= [Math.floor(x.id/10),x.id%10];
  x.currency ??= "time-theorems";
  x.condition ??= () => true;
  x.require ??= () => true;
})

export function TimeStudiesOrder() {
  const O: number[][] = []
  TimeStudies.forEach((x,i) => (O[x.type === 'invisible' ? x.position[0]-1 : x.posiiton![0]-1] ??= []).push(i))
  return O
}

export function TimeStudyBranches() {
  const B: [number, number][] = []
  TimeStudies.filter(x => x.type !== 'invisible').forEach(x => B.push(...(x.branch.map(y => [TimeStudiesIndex[y], TimeStudiesIndex[x.id]]) as [number, number][])))
  return B;
}

export function respecTimeStudies(noreset: boolean = false) {
  for (const TS of TimeStudies) if (TS.type !== 'invisible') player.eternity.timestudy.purchased[TS.id] = false;
  player.eternity.timestudy.theorems = player.eternity.timestudy.p_theorems.reduce((a,b) => Decimal.add(a,b), DC.D0);

  if (!noreset) ETERNITY.reset();
}

export function canAffordTimeStudy(id: TS_ID) {
  const TS = TimeStudies[TimeStudiesIndex[id]] as TimeStudy;

  return !player.eternity.timestudy.purchased[id]
  && (!TS.branch.length || TS.branch.some(x => player.eternity.timestudy.purchased[x]))
  && TS.condition!()
  && TS.require!()
  && Decimal.gte(CURRENCIES[TS.currency! as Currency].amount, TS.cost)
}

export const TimeTheorems: {
  cost(X: DecimalSource): DecimalSource;
  bulk(X: DecimalSource): DecimalSource;
  currency: string;
}[] = [
  {
    cost: x => Decimal.add(x, 1).mul(2e4).pow10(),
    bulk: x => Decimal.log10(x).div(2e4).floor(),
    currency: 'points',
  },{
    cost: x => Decimal.mul(x, 100).pow10(),
    bulk: x => Decimal.log10(x).div(100).floor().add(1),
    currency: 'infinity',
  },{
    cost: x => Decimal.pow(2, x),
    bulk: x => Decimal.log2(x).floor().add(1),
    currency: 'eternity',
  },
]

export function purchaseTimeTheorem(i: number, max: boolean = false) {
  if (i === 2 && Decimal.lt(player.eternity.generators[1].bought, 1)) return;

  let cost;
  const TT = TimeTheorems[i], C = CURRENCIES[TT.currency as Currency]

  if (Decimal.gte(C.amount, cost = TT.cost(player.eternity.timestudy.p_theorems[i]))) {
    let bulk = Decimal.add(player.eternity.timestudy.p_theorems[i], 1)
    if (max) cost = TT.cost((bulk = bulk.max(TT.bulk(C.amount))).sub(1));
    C.amount = Decimal.sub(C.amount, cost).max(0)
    player.eternity.timestudy.theorems = bulk.sub(player.eternity.timestudy.p_theorems[i]).add(player.eternity.timestudy.theorems);
    player.eternity.timestudy.p_theorems[i] = bulk;
  }
}

export function purchaseTimeStudy(id: TS_ID) {
  const TS = TimeStudies[TimeStudiesIndex[id]] as TimeStudy

  if (canAffordTimeStudy(id)) {
    player.eternity.timestudy.theorems = Decimal.sub(player.eternity.timestudy.theorems, TS.cost).max(0)
    player.eternity.timestudy.purchased[id] = true;
  }
}

export function getTimeStudyEffect(id: TS_ID) { return temp.eternity.timestudies[id] }
export function hasTimeStudy(id: TS_ID) { return player.eternity.timestudy.purchased[id] }

export function updateTimeStudiesTemp() {
  for (const TS of TimeStudies) if (TS.type !== 'invisible') {
    const id = TS.id;
    if ('effect' in TS) temp.eternity.timestudies[id] = player.eternity.timestudy.purchased[id] ? TS.effect![0]() : TS.effect![1];
  }
}
