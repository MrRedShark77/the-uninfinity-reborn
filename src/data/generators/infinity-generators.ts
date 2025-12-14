import { player, temp } from "@/main"
import type { GeneratorTemp } from "@/update"
import { D, DC, softcap } from "@/utils/decimal"
import type { DecimalSource } from "break_eternity.js"
import Decimal from "break_eternity.js"
import { InfinityUpgrade, simpleInfinityEffect } from "../infinity"
import { getICCompletions, isICBeaten } from "../challenges/infinity-challenges"
import { infinityEnergyUpgradeEffect } from "../infinity-energy"
import { getAchievementEffect } from "../achievements"

const GENERATOR_PREFIXES = ['Mono-',"Xenna-","Weka-","Vendeka-","Udeka-","Treda-","Sorta-","Rinta-","Quexa-","Pepta-","Ocha-"]

const GEN_COST_BASE = [null, 1e8, 1e10, 1e13, 1e30, 1e45, 1e60, 1e100, 1e160, 1e230, 1e270],
GEN_COST_INC = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30, 1e40, 1e50];

export const INF_GEN_POWER = [null, 10, 5, 3, 2, 2, 2, 2, 2, 2, 2]

export const INF_GENERATOR = (i: number) => ({
  name: GENERATOR_PREFIXES[i] + "Generators",

  get amount() { return Decimal.add(player.infinity.generators[i].amount, player.infinity.generators[i].bought) },
  set amount(value) { player.infinity.generators[i].amount = value },

  get bought() { return player.infinity.generators[i].bought },
  set bought(value) { player.infinity.generators[i].bought = value },

  get unlocked() { return player.infinity.generatorsUnlocked >= i },
  temp: temp.infinity.generators[i],

  get base() {
    let x = D(2)

    if (isICBeaten(6)) x = Decimal.div(this.bought, 50).add(x);

    return x
  },

  COST_BASE: GEN_COST_BASE[i] ?? DC.DINF,
  COST_INC: GEN_COST_INC[i] ?? DC.DINF,

  get resource() {
    return player.infinity.points
  },
  set resource(value) {
    player.infinity.points = value;
  },

  get resourceName() { return 'IP' },

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
  name: string,

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

export const INF_GENERATOR_REQUIREMENTS: [DecimalSource, DecimalSource][] = [
  ['1e1400', 1e8],
  ['1e2000', 1e10],
  ['1e2700', 1e13],
  ['1e6400', 1e30],
  ['1e9400', 1e45],
  ['1e13000', 1e60],
  ['1e21000', 1e100],
  ['1e35000', 1e160],
  ['1e50000', 1e230],
  ['1e58000', 1e270],
  [DC.DINF, DC.DINF],
]

export function getInfinityPowerEffect() {
  let OoMs = Decimal.max(player.infinity.power,1).log10();
  const fixed_OoMs = OoMs;

  OoMs = softcap(OoMs, DC.DE308LOG, .5, "P")

  const exp = Decimal.add(5, infinityEnergyUpgradeEffect(3, 0))

  const mult = OoMs.mul(exp).pow10()

  return {exp: fixed_OoMs.gte(DC.DE308LOG) ? Decimal.div(OoMs, fixed_OoMs).mul(exp) : exp, mult}
}

export function totalInfinityGeneratorMultiplier(): DecimalSource {
  let x = DC.D1

  x = x.mul(simpleInfinityEffect(InfinityUpgrade.CurrentMult2))
  .mul(Decimal.pow(2, getICCompletions()))
  .mul(temp.infinity.energy.effect.mult)

  x = x.mul(getAchievementEffect(78))

  return x
}

export function purchaseAllInfinityGenerators() {
  for (let i = 1; i <= 10; i++) INF_GENERATOR(i).purchase(true);
}
