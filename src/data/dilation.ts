import { player, temp } from "@/main"
import { ETERNITY } from "./eternity"
import Decimal, { type DecimalSource } from "break_eternity.js"
import { D, DC, expPow, simpleCost } from "@/utils/decimal"
import { format, formatMult, formatPlus } from "@/utils/formats"
import { getAchievementEffect, giveAchievement } from "./achievements"

export const TimeDilation = {
  get active() { return player.eternity.dilation.active },

  run(force=false) {
    if (!force && player.eternity.dilation.active && Decimal.lt(player.points, this.pointRequirement)) return;

    if (player.eternity.dilation.active) {
      player.eternity.dilation.tachyonParticles = this.pendingTP.add(player.eternity.dilation.tachyonParticles)
    }

    player.eternity.dilation.active = !player.eternity.dilation.active
    giveAchievement(126)

    ETERNITY.reset()
  },

  get tachyonParticles() { return player.eternity.dilation.tachyonParticles },

  get penalty() { return hasDilationUpgrade(10) ? .75 : 1 },

  get TP_mult() {
    let x = DC.D1

    x = x.mul(temp.eternity.dilation.upgrades[2])
    x = x.mul(getAchievementEffect(127)).mul(getAchievementEffect(128))

    return x
  },

  get TP_exp() {
    let x = D(1.5)

    x = x.add(temp.eternity.dilation.upgrades[3])

    return x
  },

  get pendingTP(): Decimal {
    if (!this.active) return DC.D0;

    let x = Decimal.max(player.points, 1).log10()

    x = x.div(1e3).max(0).pow(this.TP_exp).mul(this.TP_mult)

    return x.add(1).floor().sub(this.tachyonParticles).max(0)
  },

  get pointRequirement() {
    return Decimal.div(this.tachyonParticles, this.TP_mult).root(this.TP_exp).mul(1e3).pow10();
  },

  get DT_mult() {
    let x = DC.D1

    x = x.mul(temp.eternity.dilation.upgrades[0])
    x = x.mul(getAchievementEffect(127))

    return x
  },

  get effect() {
    return Decimal.add(player.eternity.dilation.bestDilatedTime, 1).log10().mul(temp.eternity.dilation.upgrades[1]).div(100).add(1)
  },

  upgrades: [
    {
      max: DC.DINF,
      condition: () => true,
      get description() { return `Increase Dilated Time gained by <b>${formatMult(2)}</b>.` },

      cost: x => simpleCost(x, "ES", 1e3, 10, 1.001),
      bulk: x => simpleCost(x, "ESI", 1e3, 10, 1.001).floor().add(1),

      effect: [x => Decimal.pow(2, x), 1, x => formatMult(x)],
    },{
      max: DC.DINF,
      condition: () => true,
      get description() { return `The Dilated Time's effect is stronger.` },

      cost: x => simpleCost(x, "E", 1e4, 100),
      bulk: x => simpleCost(x, "EI", 1e4, 100).floor().add(1),

      effect: [x => Decimal.mul(x, .05).add(1), 1, x => formatMult(x)],
    },{
      max: DC.DINF,
      condition: () => true,
      get description() { return `Increase Tachyon Particles earned by <b>${formatMult(3)}</b>.` },

      cost: x => simpleCost(x, "ES", 1e5, 25, 1.001),
      bulk: x => simpleCost(x, "ESI", 1e5, 25, 1.001).floor().add(1),

      effect: [x => Decimal.pow(3, x), 1, x => formatMult(x)],
    },{
      max: DC.DINF,
      condition: () => true,
      get description() { return `Increase the exponent of the formula for pending Tachyon Particles by <b>${formatPlus(.25)}</b>.` },

      cost: x => simpleCost(x, "ES", 1e6, 1e3, 1.1),
      bulk: x => simpleCost(x, "ESI", 1e6, 1e3, 1.1).floor().add(1),

      effect: [x => Decimal.mul(x, .25), 0, x => "+^"+format(x)],
    },

    {
      max: 1,
      condition: () => true,
      get description() { return `Dilated Time applies to Infinity Generators.` },

      cost: () => 1e9,
      bulk: () => 1,
    },{
      max: 1,
      condition: () => true,
      get description() { return `Time Generators are affected by Infinity Energy at a reduced rate.` },

      cost: () => 1e12,
      bulk: () => 1,

      effect: [() => expPow(Decimal.add(player.infinity.energy.amount, 1), .5), 1, x => formatMult(x)],
    },{
      max: 1,
      condition: () => true,
      get description() { return `Normal Generators are boosted by Dilated Time, ignoring Time Dilation.` },

      cost: () => 1e15,
      bulk: () => 1,

      effect: [() => Decimal.add(player.eternity.dilation.bestDilatedTime, 1).pow(500), 1, x => formatMult(x)],
    },{
      max: 1,
      condition: () => true,
      get description() { return `Infinity Points are boosted by Dilated Time.` },

      cost: () => 1e18,
      bulk: () => 1,

      effect: [() => Decimal.add(player.eternity.dilation.bestDilatedTime, 1).pow(1e3), 1, x => formatMult(x)],
    },{
      max: 1,
      condition: () => true,
      get description() { return `Dilated Time applies to Time Generators.` },

      cost: () => 1e21,
      bulk: () => 1,
    },{
      max: 1,
      condition: () => true,
      get description() { return `You can buy all three Time Study paths from the Generator split.` },

      cost: () => 1e24,
      bulk: () => 1,
    },{
      max: 1,
      condition: () => true,
      get description() { return `Reduce the Dilation penalty.` },

      cost: () => 1e27,
      bulk: () => 1,
    },{
      max: 1,
      condition: () => true,
      get description() { return `ACH102 and TS111 apply to Infinity Points gain instead of their multiplier.` },

      cost: () => 1e33,
      bulk: () => 1,
    },{
      max: 1,
      condition: () => true,
      get description() { return `Infinity upgrade for IP multiplier also boosts IP based on Dilated Time after ${format(1e6)} purchases.` },

      cost: () => 1e30,
      bulk: () => 1,

      effect: [() => Decimal.sub(player.infinity.upgrades['ipMult'], 1e6).max(0).pow_base(temp.eternity.dilation.effect), 1, x => formatMult(x)],
    },
  ] as {
    max: DecimalSource;
    condition: () => boolean;
    description: string;
    cost: (x: DecimalSource) => DecimalSource;
    bulk: (x: DecimalSource) => DecimalSource;
    effect?: [(x: DecimalSource)=>DecimalSource, DecimalSource] | [()=>DecimalSource, DecimalSource, (x: DecimalSource)=>string],
  }[],

  purchaseUpgrade(i: number, max = false) {
    const U = this.upgrades[i], A = player.eternity.dilation.upgrades[i];
    let cost;

    if (Decimal.gte(player.eternity.dilation.dilatedTime, cost = U.cost(A))) {
      let bulk = Decimal.add(A, 1)
      if (max) cost = U.cost(bulk = bulk.max(U.bulk(player.eternity.dilation.dilatedTime)));
      player.eternity.dilation.dilatedTime = Decimal.sub(player.eternity.dilation.dilatedTime, cost).max(0);
      player.eternity.dilation.upgrades[i] = bulk;
    }
  },
}

export function hasDilationUpgrade(i: number) { return Decimal.gte(player.eternity.dilation.upgrades[i], 1) };
