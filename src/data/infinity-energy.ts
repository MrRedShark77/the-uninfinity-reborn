import { player, temp } from "@/main"
import Decimal, { type DecimalSource } from "break_eternity.js"
import { CURRENCIES, Currency } from "./currencies";
import { format, formatMult, formatPlus, formatPow } from "@/utils/formats";
import { D, DC, simpleCost, softcap, sumBase } from "@/utils/decimal";
import { Quote } from "@/utils/quote";
import { getTimeStudyEffect, hasTimeStudy } from "./timestudies";
import { inEternitychallenge } from "./challenges/eternity-challenges";

type InfinityEnergyUpgrade = {
  description: string;

  cost(x: DecimalSource): DecimalSource;
  bulk(x: DecimalSource): DecimalSource;
  currency: Currency;

  effect(x: DecimalSource): DecimalSource;
  display(x: DecimalSource): string;
}

export const InfinityEnergy = {
  requirement: 1e190,

  unlock() {
    if (Decimal.lt(player.infinity.points, this.requirement)) return;

    player.infinity.energy.unlocked = true;
    Quote.addFromKeys('infinity_energy');
  },

  effect() {
    const amount = player.infinity.energy.amount;

    const exp = Decimal.add(.1, infinityEnergyUpgradeEffect(2,0)).mul(getTimeStudyEffect(21))

    let mult = Decimal.mul(amount, 10).add(1).pow(exp).mul(Decimal.add(amount, 2).log2().sqr())

    mult = softcap(mult, DC.DE308, .5, "E")

    return { mult }
  },

  get amount() { return player.infinity.energy.amount },

  get base() {
    let x = DC.D0

    x = x.add(infinityEnergyUpgradeEffect(0,0))

    x = x.mul(infinityEnergyUpgradeEffect(4))

    return x
  },
  get exponent() {
    let x = infinityEnergyUpgradeEffect(1)

    x = Decimal.add(x, getTimeStudyEffect(102))

    x = x.mul(getTimeStudyEffect(22)).mul(getTimeStudyEffect(62))
    .mul(getTimeStudyEffect(131)).mul(getTimeStudyEffect(132)).mul(getTimeStudyEffect(133))
    .mul(getTimeStudyEffect(223))

    return x
  },
  get overflowStart(): DecimalSource {
    return 'e3e5'
  },

  calc(amount: DecimalSource, offest: DecimalSource): Decimal {
    const exp = this.exponent

    let x = D(amount)

    if (exp.lte(0)) return x;

    const overflow = this.overflowStart, overflow_log = Decimal.log10(overflow)
    let o1 = false

    if (o1 = x.gte(overflow)) x = x.log10().sqr().div(overflow_log).pow10()

    x = x.root(exp)

    x = x.add(offest)

    x = x.pow(exp)

    if (o1) x = x.log10().mul(overflow_log).sqrt().pow10()

    return x
  },

  upgrades: [
    {
      description: `Increases the base of Infinity Energy.`,

      cost: x => simpleCost(x, "ES", 1e190, 1e10, inEternitychallenge(6) ? 1.001 : 1.005).mul(getTimeStudyEffect(243)),
      bulk: x => simpleCost(Decimal.div(x, getTimeStudyEffect(243)), "ESI", 1e190, 1e10, inEternitychallenge(6) ? 1.001 : 1.005).floor().add(1),
      currency: "infinity",

      effect: x => {
        x = Decimal.mul(x, getTimeStudyEffect(244))
        return Decimal.sub(x, 1).pow_base(1.5).mul(x)
      },
      display: x => format(x,0),
    },{
      description: `Infinity Energy grows faster.`,

      cost: x => simpleCost(x, "ES", 1e200, 1e15, inEternitychallenge(6) ? 3 : 10).mul(getTimeStudyEffect(243)),
      bulk: x => simpleCost(Decimal.div(x, getTimeStudyEffect(243)), "ESI", 1e200, 1e15, inEternitychallenge(6) ? 3 : 10).floor().add(1),
      currency: "infinity",

      effect: x => Decimal.mul(x, .25).mul(getTimeStudyEffect(244)).add(1),
      display: x => formatPow(x),
    },{
      description: `Increases the exponent of Infinity Energy's effect.`,

      cost: x => simpleCost(x, "ES", 1e225, 1e25, inEternitychallenge(6) ? 10 : 1e2).mul(getTimeStudyEffect(243)),
      bulk: x => simpleCost(Decimal.div(x, getTimeStudyEffect(243)), "ESI", 1e225, 1e25, inEternitychallenge(6) ? 10 : 1e2).floor().add(1),
      currency: "infinity",

      effect: x => Decimal.mul(x, .05).mul(getTimeStudyEffect(244)),
      display: x => formatPlus(x),
    },

    {
      description: `Increases the Infinity Power conversion.`,

      cost: x => Decimal.add(x, 2).pow(2).sub(1).pow10(),
      bulk: x => Decimal.log10(x).add(1).root(2).sub(2).floor().add(1),
      currency: "infinity-energy",

      effect: x => Decimal.root(x, 2).mul(.25),
      display: x => formatPlus(x,3),
    },{
      description: `Increases the base of Infinity Energy again.`,

      cost: x => sumBase(x, 1.1).pow_base(1e3).mul(1e6),
      bulk: x => sumBase(Decimal.div(x, 1e6).log(1e3), 1.1, true).floor().add(1),
      currency: "infinity-energy",

      effect: x => Decimal.pow(2, hasTimeStudy(234) ? Decimal.sqr(x) : x),
      display: x => formatMult(x,0),
    },{
      description: `Gains more Infinities.`,

      cost: x => Decimal.add(x, 4).pow(1.5).add(1).pow10(),
      bulk: x => Decimal.log10(x).sub(1).root(1.5).sub(4).floor().add(1),
      currency: "infinity-energy",

      effect: x => Decimal.add(x, 1),
      display: x => formatMult(x,0),
    },
  ] as InfinityEnergyUpgrade[],
  purchaseUpgrade(i: number, max = false) {
    if (inEternitychallenge(8) && player.challenges.eternity.C8[1] === 0) return;

    const U = this.upgrades[i], C = CURRENCIES[U.currency], A = player.infinity.energy.upgrades[i];
    let cost;

    if (Decimal.gte(C.amount, cost = U.cost(A))) {
      let bulk = Decimal.add(A, 1)
      if (max) cost = U.cost(bulk = bulk.max(U.bulk(C.amount)));
      if (Decimal.lt(player.eternity.times, 40)) C.amount = Decimal.sub(C.amount, cost).max(0);
      player.infinity.energy.upgrades[i] = bulk;

      player.challenges.eternity.C8[1]--
    }
  },

  temp() {
    for (let i = 0; i < this.upgrades.length; i++) {
      const U = this.upgrades[i];

      temp.infinity.energy.upgrades[i] = U.effect(player.infinity.energy.upgrades[i])
    }
  },
}

export function infinityEnergyUpgradeEffect(i: number, def: DecimalSource = 1) { return temp.infinity.energy.upgrades[i] ?? def }
