import type { DecimalSource } from "break_eternity.js";
import { CURRENCIES, Currency } from "./currencies";
import Decimal from "break_eternity.js";
import { player, temp } from "@/main";
import { format, formatMult, formatPercent, formatPlus, formatPow } from "@/utils/formats";
import { DC, expPow } from "@/utils/decimal";
import { ETERNITY } from "./eternity";
import { getECCompletions } from "./challenges/eternity-challenges";
import { hasAchievement } from "./achievements";
import { EXPANDER } from "./generators/normal-generators";
import { notify } from "@/utils/notify";
import { Quote } from "@/utils/quote";

type TS_ID = number | string
type TS_type = "normal" | "NG" | "IG" | "TG" | "active" | "passive" | "idle" | "light" | "dark"

export interface TimeStudy {
  type: TS_type,

  id: TS_ID,
  condition?(): boolean;
  posiiton?: [number, number];
  branch: (TS_ID)[];

  EC_base?: DecimalSource;
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

interface EC_TS {
  type: "EC"

  id: string,
  condition?(): boolean;
  posiiton: [number, number];
  branch: (TS_ID)[];

  EC_base: DecimalSource;
  require(): boolean;
  requirement: string;

  description: string;
  cost: DecimalSource;
  currency?: string;
}

export const TS_type: Record<TS_type, string> = {
  "normal": "",
  "NG": "Normal Gens",
  "IG": "Infinity Gens",
  "TG": "Time Gens",
  "active": "Active",
  "passive": "Passive",
  "idle": "Idle",
  "light": "Light",
  "dark": "Dark",
}

export const TimeStudies: (TimeStudy | InvisibleBlock | EC_TS)[] = [
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
    get description() { return `The effect of Infinity Energy is <b>squared</b>.` },
    cost: 3,
    effect: [() => 2, 1],
  },{
    type: "normal",

    id: 22,
    branch: [11],
    get description() { return `The exponent of Infinity Energy is <b>doubled</b>.` },
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

    effect: [() => Decimal.add(EXPANDER.total, 1), 1, x => formatMult(x,0)],
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
    type: "invisible",
    position: [5,0],
  },{
    type: "normal",

    id: 51,
    branch: [41,42],
    get description() { return `Gain <b>${formatMult(1e20)}</b> more Infinity Points.` },
    cost: 3,
    effect: [() => 1e20, 1],
  },{
    type: "EC",

    id: 'EC5',
    posiiton: [5, 2],
    branch: [42],

    get EC_base() { return Decimal.pow10(Math.min(player.challenges.eternity.completed[5], 4) * 250 + 2000) },
    require() { return Decimal.gte(temp.refiner_boost, this.EC_base) },
    get requirement() { return `<b>${formatMult(temp.refiner_boost)} / ${formatMult(this.EC_base)}</b> from Generator Refiner's boost` },

    get description() { return `Eternity Challenge 5 (${player.challenges.eternity.completed[5]}/5)` },
    cost: 135,
  },

  {
    type: "invisible",
    position: [6,0],
  },{
    type: "normal",

    id: 61,
    branch: [51],
    get description() { return `Gain <b>${formatMult(20,0)}</b> more Eternity Points.` },
    cost: 3,
    effect: [() => 20, 1],
  },{
    type: "normal",

    id: 62,
    branch: ['EC5'],
    get description() { return `The exponent of Infinity Energy is increased by <b>+25%</b>.` },
    cost: 3,
    effect: [() => 1.25, 1],
  },

  {
    type: "NG",
    require: () => +hasTimeStudy(71) + +hasTimeStudy(72) + +hasTimeStudy(73) < getGeneratorSplitAllowance(),

    id: 71,
    branch: [61],
    get description() { return `The multiplier per Generator Expander is increased to <b>×16</b>.` },
    cost: 4,
  },{
    type: "IG",
    require: () => +hasTimeStudy(71) + +hasTimeStudy(72) + +hasTimeStudy(73) < getGeneratorSplitAllowance(),

    id: 72,
    branch: [61],
    get description() { return `Infinity Generators are increased by <b>×1.5</b> per Generator Expander.` },
    cost: 5,
    effect: [() => Decimal.pow(1.5, EXPANDER.total), 1, x => formatMult(x)],
  },{
    type: "TG",
    require: () => +hasTimeStudy(71) + +hasTimeStudy(72) + +hasTimeStudy(73) < getGeneratorSplitAllowance(),

    id: 73,
    branch: [61],
    get description() { return `Time Generators are increased by <b>×1.1</b> per Generator Expander.` },
    cost: 6,
    effect: [() => Decimal.pow(1.1, EXPANDER.total), 1, x => formatMult(x)],
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
    effect: [() => Decimal.div(3600, Decimal.max(player.eternity.fastest, .3)).clamp(1,1e4).pow(5), 1, x => formatMult(x)],
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
    type: "EC",

    id: 'EC7',
    posiiton: [11, 0],
    branch: [111],

    get EC_base() { return Decimal.pow10(Math.min(player.challenges.eternity.completed[7], 4) * 1.1e6 + 2.1e6) },
    require() { return Decimal.gte(player.points, this.EC_base) },
    get requirement() { return `<b>${format(player.points,0)} / ${format(this.EC_base,0)}</b> Points` },

    get description() { return `Eternity Challenge 7 (${player.challenges.eternity.completed[7]}/5)` },
    cost: 245,
  },{
    type: "normal",

    id: 111,
    branch: [101,102,103],
    get description() { return `Infinity Points are powered by <b>^1.08</b>.` },
    cost: 12,
    effect: [() => 1.08, 1],
  },{
    type: "invisible",
    position: [11,2],
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
    type: "EC",

    id: 'EC6',
    posiiton: [13, 0],
    branch: [121],

    get EC_base() { return Decimal.pow10(Math.min(player.challenges.eternity.completed[6], 4) * 2500 + 15000) },
    require() { return Decimal.gte(player.infinity.energy.amount, this.EC_base) },
    get requirement() { return `<b>${format(player.infinity.energy.amount,0)} / ${format(this.EC_base,0)}</b> Infinity Energy` },

    get description() { return `Eternity Challenge 6 (${player.challenges.eternity.completed[6]}/5)` },
    cost: 220,
  },{
    type: "active",

    id: 131,
    branch: [121],
    get description() { return hasAchievement(111) ? `The exponent of Infinity Energy is increased by <b>+50%</b>.` : `The exponent of Infinity Energy is increased by <b>+50%</b>, but it reduces over this Infinity to <b>0%</b>.` },
    cost: 5,
    effect: [() => hasAchievement(111) ? 1.5 : Decimal.sub(1, Decimal.sqrt(player.infinity.time).div(11)).max(0).mul(1.5), 1, x => formatMult(x,3,false)],
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
    get description() { return hasAchievement(111) ? `The exponent of Infinity Energy is increased by <b>+50%</b>.` : `The exponent of Infinity Energy is reduced to <b>0%</b>, but it increases over this Infinity to <b>+50%</b>.` },
    cost: 5,
    effect: [() => hasAchievement(111) ? 1.5 : Decimal.sqrt(player.infinity.time).div(11).min(1).mul(1.5), 1, x => formatMult(x,3,false)],
  },{
    type: "EC",

    id: 'EC8',
    posiiton: [13, 4],
    branch: [123],

    get EC_base() { return Decimal.pow10(Math.min(player.challenges.eternity.completed[8], 4) * 5000 + 15000) },
    require() { return Decimal.gte(player.infinity.points, this.EC_base) },
    get requirement() { return `<b>${format(player.infinity.points,0)} / ${format(this.EC_base,0)}</b> Infinity Points` },

    get description() { return `Eternity Challenge 8 (${player.challenges.eternity.completed[8]}/5)` },
    cost: 385,
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
    type: "invisible",
    position: [15,0],
  },{
    type: "EC",

    id: 'EC9',
    posiiton: [15, 0],
    branch: [151],

    get EC_base() { return Decimal.pow10(Math.min(player.challenges.eternity.completed[9], 4) * 4e5 + 8e5) },
    require() { return Decimal.gte(player.infinity.power, this.EC_base) },
    get requirement() { return `<b>${format(player.infinity.power,0)} / ${format(this.EC_base,0)}</b> Infinity Power` },

    get description() { return `Eternity Challenge 9 (${player.challenges.eternity.completed[9]}/5)` },
    cost: 750,
  },{
    type: "normal",

    id: 151,
    branch: [141,142,143],
    get description() { return `<b>${formatMult(1e6,0)}</b> multiplier on Time Generators.` },
    cost: 8,
    effect: [() => 1e6, 1],
  },{
    type: "invisible",
    position: [15,1],
  },{
    type: "EC",

    id: 'EC4',
    posiiton: [15, 2],
    branch: [143],

    get EC_base() { return Decimal.mul(Math.min(player.challenges.eternity.completed[4], 4) + 1, 2e8) },
    require() { return Decimal.gte(player.infinity.times, this.EC_base) },
    get requirement() { return `<b>${format(player.infinity.times,0)} / ${format(this.EC_base,0)}</b> Infinities` },

    get description() { return `Eternity Challenge 4 (${player.challenges.eternity.completed[4]}/5)` },
    cost: 125,
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

  {
    type: "EC",

    id: 'EC1',
    posiiton: [18, 1],
    branch: [171],

    get EC_base() { return Decimal.mul(Math.min(player.challenges.eternity.completed[1], 4) + 1,2e4) },
    require() { return Decimal.gte(player.eternity.times, this.EC_base) },
    get requirement() { return `<b>${format(player.eternity.times,0)} / ${format(this.EC_base,0)}</b> Eternities` },

    get description() { return `Eternity Challenge 1 (${player.challenges.eternity.completed[1]}/5)` },
    cost: 30,
  },{
    type: "EC",

    id: 'EC2',
    posiiton: [18, 2],
    branch: [171],

    get EC_base() { return Decimal.add(Math.min(player.challenges.eternity.completed[2], 4) * 2500, 15000) },
    require() { return Decimal.gte(temp.eternity.shards, this.EC_base) },
    get requirement() { return `<b>${format(temp.eternity.shards,0)} / ${format(this.EC_base,0)}</b> effective OoMs from Time Shards` },

    get description() { return `Eternity Challenge 2 (${player.challenges.eternity.completed[2]}/5)` },
    cost: 35,
  },{
    type: "EC",

    id: 'EC3',
    posiiton: [18, 3],
    branch: [171],

    get EC_base() { return [185,200,215,430,530][Math.min(player.challenges.eternity.completed[3], 4)] },
    require() { return Decimal.gte(player.generators[10].bought, this.EC_base) },
    get requirement() { return `<b>${format(player.generators[10].bought,0)} / ${format(this.EC_base,0)}</b> bought Quetta-Generators` },

    get description() { return `Eternity Challenge 3 (${player.challenges.eternity.completed[3]}/5)` },
    cost: 40,
  },

  {
    type: "normal",

    require: () => player.challenges.eternity.completed[1] > 0 && player.challenges.eternity.completed[2] > 0 && player.challenges.eternity.completed[3] > 0,

    id: 191,
    branch: ["EC1","EC2","EC3"],
    get description() { return `Passively generate <b>1%</b> of pending Infinity Points on crunch every second.` },
    cost: 200,
  },

  {
    type: "EC",

    id: 'EC10',
    posiiton: [20, 0],
    branch: [191],

    get EC_base() { return Decimal.pow10(Math.min(player.challenges.eternity.completed[10], 4) * 150 + 400) },
    require() { return Decimal.gte(player.eternity.points, this.EC_base) },
    get requirement() { return `<b>${format(player.eternity.points,0)} / ${format(this.EC_base,0)}</b> Eternity Points` },

    get description() { return `Eternity Challenge 10 (${player.challenges.eternity.completed[10]}/5)` },
    cost: 3200,
  },

  {
    type: "normal",

    id: 211,
    branch: ["EC10"],
    get description() { return `Keep <b>5%</b> of your Infinities as Banked Infinities on Eternity.` },
    cost: 800,
  },{
    type: "normal",
    require: () => !hasTimeStudy("EC11") && !hasTimeStudy("EC12"),

    id: 212,
    branch: ["EC10"],
    get description() { return `Pick a second path from the Generator Split.` },
    cost: 2400,
  },{
    type: "normal",

    id: 213,
    branch: ["EC10"],
    get description() { return `Eternities boost Normal Generators.` },
    cost: 800,

    effect: [()=>expPow(Decimal.add(player.eternity.times, 1).pow(50), 2), 1, x => formatMult(x)]
  },

  {
    type: "normal",

    id: 221,
    branch: [211],
    get description() { return `The requirement of Generator Expanders is slower again.` },
    cost: 480,

    effect: [() => .1, 0],
  },{
    type: "normal",

    id: 222,
    branch: [211],
    get description() { return `Generator Refiner is stronger based on Time Shards.` },
    cost: 600,

    effect: [() => Decimal.add(player.eternity.shards, 10).log10().log10().mul(1.8).add(1), 1, x => formatPow(x)]
  },{
    type: "normal",

    id: 223,
    branch: [213],
    get description() { return `The exponent of Infinity Energy is increased by <b>+50%</b>.` },
    cost: 720,

    effect: [() => 1.5, 1],
  },{
    type: "normal",

    id: 224,
    branch: [213],
    get description() { return `Generator Refiner boosts Quetta-Generators even more.` },
    cost: 480,

    effect: [() => Decimal.pow(temp.refiner_boost, 4), 1, x => formatMult(x)]
  },

  {
    type: "light",
    require: () => +hasTimeStudy(231) + +hasTimeStudy(232) < 1,

    id: 231,
    branch: [221],
    get description() { return `The requirement of Generator Expanders is slower even again.` },
    cost: 900,
  },{
    type: "dark",
    require: () => +hasTimeStudy(231) + +hasTimeStudy(232) < 1,

    id: 232,
    branch: [221],
    get description() { return `Time Shards give an effective amount of Generator Expanders with a reduced effect.` },
    cost: 900,

    effect: [() => Decimal.add(player.eternity.shards, 1).log10().pow(.8).floor(), 0, x => formatPlus(x)]
  },{
    type: "normal",

    id: 233,
    branch: [222],
    get description() { return `Generator Refiner strengthens Generator Expanders.` },
    cost: 900,

    effect: [() => Decimal.max(temp.refiner_boost, 10).log10().sqrt(), 1, x => formatMult(x)]
  },{
    type: "normal",

    id: 234,
    branch: [223],
    get description() { return `The 5th Infinity Energy upgrade is improved.` },
    cost: 900,
  },{
    type: "light",
    require: () => +hasTimeStudy(235) + +hasTimeStudy(236) < 1,

    id: 235,
    branch: [224],
    get description() { return `Generator Refiner boosts Time Generators.` },
    cost: 900,

    effect: [() => expPow(Decimal.max(temp.refiner_boost, 10).log10(), 3), 1, x => formatMult(x)]
  },{
    type: "dark",
    require: () => +hasTimeStudy(235) + +hasTimeStudy(236) < 1,

    id: 236,
    branch: [224],
    get description() { return `Improve Generator Refiner furthest-er.` },
    cost: 900,

    effect: [() => .25, 0],
  },

  {
    type: "light",
    require: () => +hasTimeStudy(241) + +hasTimeStudy(242) < 1,

    id: 241,
    branch: [231,232],
    get description() { return `Generator Expander are stronger based on your current points.` },
    cost: 500,

    effect: [() => Decimal.add(player.points, 10).log10().cbrt(), 1, x => formatMult(x)]
  },{
    type: "dark",
    require: () => +hasTimeStudy(241) + +hasTimeStudy(242) < 1,

    id: 242,
    branch: [233],
    get description() { return `Generator Refiner is stronger based on your current points.` },
    cost: 500,

    effect: [() => Decimal.add(player.points, 10).log10().log10().div(10).add(1), 1, x => formatPow(x)]
  },{
    type: "light",
    require: () => +hasTimeStudy(243) + +hasTimeStudy(244) < 1,

    id: 243,
    branch: [234],
    get description() { return `Infinity Energy divides its first 3 upgrades.` },
    cost: 500,

    effect: [() => Decimal.add(player.infinity.energy.amount, 1).pow(-.1), 1, x => formatMult(x)]
  },{
    type: "dark",
    require: () => +hasTimeStudy(243) + +hasTimeStudy(244) < 1,

    id: 244,
    branch: [235,236],
    get description() { return `Infinity Energy strengthens its first 3 upgrades.` },
    cost: 500,

    effect: [() => Decimal.add(player.infinity.energy.amount, 10).log10().log10().div(25).add(1), 1, x => formatPercent(Decimal.sub(x, 1))]
  },

  {
    type: "EC",

    id: 'EC11',
    posiiton: [25, 1],
    branch: [241,242],

    get EC_base() { return 0 },
    require() { return hasTimeStudy(71) && !hasTimeStudy(72) && !hasTimeStudy(73) },
    get requirement() { return `Only the Normal Generator path.` },

    get description() { return `Eternity Challenge 11 (${player.challenges.eternity.completed[11]}/5)` },
    cost: 1,
  },{
    type: "EC",

    id: 'EC12',
    posiiton: [25, 2],
    branch: [243,244],

    get EC_base() { return 0 },
    require() { return !hasTimeStudy(71) && !hasTimeStudy(72) && hasTimeStudy(73) },
    get requirement() { return `Only the Time Generator path.` },

    get description() { return `Eternity Challenge 12 (${player.challenges.eternity.completed[12]}/5)` },
    cost: 1,
  },
]

export function getGeneratorSplitAllowance() { return 1 + +hasTimeStudy(212) }
export function getTimeStudy(id: number, index: boolean = false) { return TimeStudies[index ? id : TimeStudiesIndex[id]] };

export const TimeStudiesIndex: Record<string, number> = {};

TimeStudies.forEach((x, i) => {
  if (x.type === 'invisible') return;

  TimeStudiesIndex[x.id] = i;

  x.currency ??= "time-theorems";
  x.condition ??= () => true;
  x.require ??= () => true;

  if (typeof x.id === 'string') return;

  x.posiiton ??= [Math.floor(x.id/10),x.id%10];
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
  const keep: TS_ID[] = []
  // for (const TS of TimeStudies) if (TS.type !== 'invisible');
  player.eternity.timestudy.purchased = keep

  player.eternity.timestudy.theorems = player.eternity.timestudy.p_theorems.reduce((a,b) => Decimal.add(a,b), DC.D0);

  if (!noreset) ETERNITY.reset();
}

export function canAffordTimeStudy(id: TS_ID) {
  const TS = TimeStudies[TimeStudiesIndex[id]] as TimeStudy;

  return !player.eternity.timestudy.purchased.includes(id)
  && (!TS.branch.length || TS.branch.some(x => advancedAffordTS(x)))
  && TS.condition!()
  && TS.require!()
  && Decimal.gte(CURRENCIES[TS.currency! as Currency].amount, TS.cost)
}
export function advancedAffordTS(id: TS_ID) {
  const TS = TimeStudies[TimeStudiesIndex[id]] as TimeStudy | EC_TS;

  if (TS.type === 'EC') return getECCompletions(+TS.id.split("EC")[1]) && TS.branch.some(x => player.eternity.timestudy.purchased.includes(x))
  else return player.eternity.timestudy.purchased.includes(id);
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
  if (i === 2 && player.eternity.generators.every((x,i) => i === 0 || Decimal.lt(x.bought, 1))) return;

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
  const TS = TimeStudies[TimeStudiesIndex[id]] as TimeStudy | EC_TS

  if (canAffordTimeStudy(id)) {
    player.eternity.timestudy.theorems = Decimal.sub(player.eternity.timestudy.theorems, TS.cost).max(0)
    player.eternity.timestudy.purchased.push(id);

    if (TS.type === 'EC') {
      player.tab = 5
      player.stab[5] = 2
      Quote.addFromKeys("unlock_ec")
    }
  }
}

export function getTimeStudyEffect(id: TS_ID) { return temp.eternity.timestudies[id] }
export function hasTimeStudy(id: TS_ID) { return player.eternity.timestudy.purchased.includes(id) }

export function updateTimeStudiesTemp() {
  for (const TS of TimeStudies) if (TS.type !== 'invisible') {
    const id = TS.id;
    if ('effect' in TS) temp.eternity.timestudies[id] = player.eternity.timestudy.purchased.includes(id) ? TS.effect![0]() : TS.effect![1];
  }
}

export function calculateTimeStudiesCount(): number {
  let x = 0;
  for (const TS of TimeStudies) if (TS.type !== 'invisible' && TS.type !== 'EC') x += +hasTimeStudy(TS.id);
  return x
}
export function isTimeStudyEmpty(): boolean {
  for (const TS of TimeStudies) if (TS.type !== 'invisible' && TS.type !== 'EC' && hasTimeStudy(TS.id)) return false;
  return true
}

export function filterTimeStudyPreset(arr: number[]) {
  const value = arr.filter(x => !isNaN(x) && (x in TimeStudiesIndex));
  const result: number[] = []
  value.forEach(x => {
    if (result.includes(x)) return;
    const TS = TimeStudies[TimeStudiesIndex[x]]
    if (TS.type === 'invisible' || TS.type === 'EC') return;
    result.push(x)
  })
  return result
}

export function newTSPreset() {
  if (isTimeStudyEmpty()) return;

  player.eternity.timestudy.presets.push({
    id: "New Preset",
    value: filterTimeStudyPreset(player.eternity.timestudy.purchased.map(x => Number(x))),
  })

  notify("New Preset is created!","success")
}

export function buyAllTimeStudies(arr: number[], index: boolean = false) {
  arr.forEach(x => {
    if (index || (x in TimeStudiesIndex)) purchaseTimeStudy(index ? (TimeStudies[x] as TimeStudy).id : x);
  })
}
