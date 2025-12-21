import { player, temp } from "@/main";
import type { GeneratorTemp } from "@/update";
import { D, DC } from "@/utils/decimal";
import Decimal, { type DecimalSource } from "break_eternity.js";
import { getTimeStudyEffect, hasTimeStudy } from "../timestudies";
import { simpleEternityEffect } from "../eternity";

const GENERATOR_PREFIXES = ['Mono-',"Minga-","Nena-","Luma-","Kama-","Jamea-","Iana-","Hotta-","Gexa-","Fotta-","Eotta-"]

const GEN_COST_BASE = [null, 1, 5, 100, 1000, DC.DE308, Decimal.pow(2,2**11), Decimal.pow(2,2**12), Decimal.pow(2,2**13), Decimal.pow(2,2**14), Decimal.pow(2,2**15)],
GEN_COST_INC = [null, 3, 9, 27, 81, 243*10, 729*1e2, 2187*1e3, 6561*1e4, 19683*1e5, 59049*1e6];

export const TIME_GENERATOR = (i: number) => ({
  name: GENERATOR_PREFIXES[i] + "Generators",

  get amount() { return Decimal.add(player.eternity.generators[i].amount, player.eternity.generators[i].bought) },
  set amount(value) { player.eternity.generators[i].amount = value },

  get bought() { return player.eternity.generators[i].bought },
  set bought(value) { player.eternity.generators[i].bought = value },

  get unlocked() { return i <= 4 || Decimal.gte(player.eternity.generators[i-1].bought, 1) },
  temp: temp.eternity.generators[i],

  get base() {
    return 2
  },

  COST_BASE: GEN_COST_BASE[i] ?? DC.DINF,
  COST_INC: GEN_COST_INC[i] ?? DC.DINF,

  get resource() {
    return player.eternity.points
  },
  set resource(value) {
    player.eternity.points = value;
  },

  get resourceName() { return 'EP' },

  COST(l) {
    return Decimal.pow(this.COST_INC, l).mul(this.COST_BASE)
  },
  get cost() { return this.COST(this.bought) },

  get bulk() {
    let x = D(this.resource)

    if (x.lt(this.COST_BASE)) return 0

    x = x.div(this.COST_BASE).log(this.COST_INC)

    return x.floor().add(1)
  },

  purchase(max=false) {
    if (!this.unlocked) return;

    let cost = this.cost
    const amount = this.resource

    if (Decimal.gte(amount,cost)) {
      let bulk = Decimal.add(this.bought, 1)

      if (max) cost = this.COST(Decimal.sub(bulk = bulk.max(this.bulk),1));

      this.bought = bulk
      this.resource = Decimal.sub(amount,cost).max(0)
    }
  },
}) as {
  name: string;

  amount: DecimalSource;
  bought: DecimalSource;

  unlocked: boolean;
  temp: GeneratorTemp;

  base: DecimalSource;

  COST_BASE: DecimalSource;
  COST_INC: DecimalSource;

  resource: DecimalSource;
  resourceName: string;

  COST(x: DecimalSource): DecimalSource;
  cost: DecimalSource;

  bulk: DecimalSource;

  purchase(max: boolean): void;
}

export function getTimeShardsEffect() {
  let x = Decimal.max(player.eternity.shards,1)

  x = x.log(hasTimeStudy(171) ? 4/3 : 1.5).mul(10)

  return x
}

export function totalTimeGeneratorMultiplier(): DecimalSource {
  let x = DC.D1

  x = x.mul(getTimeStudyEffect(73)).mul(getTimeStudyEffect(93)).mul(getTimeStudyEffect(151))

  x = x.mul(simpleEternityEffect('timeGenMult1')).mul(simpleEternityEffect('timeGenMult3'))
  .mul(simpleEternityEffect('timeGenMult4'))

  return x
}

export function purchaseAllTimeGenerators() {
  for (let i = 1; i <= 10; i++) TIME_GENERATOR(i).purchase(true);
}
