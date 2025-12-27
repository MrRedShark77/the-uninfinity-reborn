import { player, temp } from "@/main";
import { resetTemp, type GeneratorTemp } from "@/update";
import { D, DC, expPow } from "@/utils/decimal";
import type { DecimalSource } from "break_eternity.js";
import Decimal from "break_eternity.js";
import { hasInfinityUpgrade, InfinityUpgrade, infinityUpgradeEffect, simpleInfinityEffect } from "../infinity";
import { inNormalChallenge, isNCBeaten } from "../challenges/normal-challenges";
import { inInfinityChallenge, isICBeaten } from "../challenges/infinity-challenges";
import { getAchievementEffect, giveAchievement, hasAchievement } from "../achievements";
import { getTimeStudyEffect, hasTimeStudy } from "../timestudies";
import { getECCompletions, getECReward, inEternitychallenge } from "../challenges/eternity-challenges";

const GENERATOR_PREFIXES = ['Mono-',"Kilo-","Mega-","Giga-","Tera-","Peta-","Exa-","Zetta-","Yotta-","Ronna-","Quetta-"]

const GEN_COST_BASE = [null, 10, 1e2, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24, 1e31, 1e39],
GEN_COST_INC = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15, 1e19, 1e24],

GEN_COST_BASE_C5 = [null, 10, 100, 100, 100, 500, 2500, 2e4, 2e5, 4e6, 8e7],
GEN_COST_INC_C5 = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.6e4, 4.8e4, 7.2e4, 1e5]

export const GENERATOR = (i: number) => ({
  name: GENERATOR_PREFIXES[i] + "Generators",

  get amount() { return Decimal.add(player.generators[i].amount, player.generators[i].bought) },
  set amount(value) { player.generators[i].amount = value },

  get bought() { return player.generators[i].bought },
  set bought(value) { player.generators[i].bought = value },

  get unlocked() { return Decimal.add(player.expanders, 4).min(inNormalChallenge(9) ? 8 : 10).gte(i) },
  get autoUnlocked() { return isNCBeaten(i-1) },
  temp: temp.generators[i],

  get base() {
    if (inInfinityChallenge(7) || inInfinityChallenge(8) || inEternitychallenge(6) || inEternitychallenge(7) || inEternitychallenge(10)) return 1;
    if (inInfinityChallenge(3)) return Decimal.mul(this.bought, player.expanders).div(1e5).add(1);

    let m = D(.1)

    if (isICBeaten(3)) m = m.add(Decimal.sqrt(player.expanders).mul(this.bought).div(1e5));

    if (inNormalChallenge(4)) m = m.div(5);
    else if (inNormalChallenge(11)) m = m.mul(10/3);

    m = m.mul(simpleInfinityEffect(InfinityUpgrade.CurrentOoMMult))
    if (hasInfinityUpgrade(InfinityUpgrade.OoMMultBoost)) m = m.mul(1.5);
    m = m.mul(getECReward(3))

    m = m.mul(i).add(1).mul(temp.generator_oom_mult)

    return m
  },

  /*
  get gain() {
    if (i >= 10) return Decimal.add(GENERATOR(1).amount,1);

    const G = GENERATOR(i+1)

    return Decimal.mul(G.amount, G.temp.mult)
  },
  */

  get COST_BASE() { return (inNormalChallenge(5) ? GEN_COST_BASE_C5[i] : GEN_COST_BASE[i]) ?? DC.DINF },
  get COST_INC() { return (inNormalChallenge(5) ? GEN_COST_INC_C5[i] : GEN_COST_INC[i]) ?? DC.DINF },

  get resource() {
    if (inNormalChallenge(5) && i > 2) return player.generators[i-2].amount;
    return player.points
  },
  set resource(value) {
    if (inNormalChallenge(5) && i > 2) player.generators[i-2].amount = value;
    else player.points = value;
  },

  get resourceName() { return inNormalChallenge(5) && i > 2 ? 'G'+(i-2) : '' },

  COST(l) {
    let x = Decimal.add(l, player.generators[i].additionalBought).pow_base(this.COST_INC).mul(this.COST_BASE).log10()

    if (x.gt(308)) {
      const pre_x = x;
      x = x.div(308).sub(1).mul(temp.generator_scale_power)
      if (getECCompletions(5) > 0 && i === 10) x = x.add(1).pow(3).mul(308);
      else x = x.pow_base(2).mul(pre_x);
    };

    return x.pow10().mul(player.generators[i].additionalCost)
  },
  get cost() { return this.COST(this.bought) },

  get bulk() {
    let x = Decimal.div(this.resource, player.generators[i].additionalCost)

    if (x.lt(this.COST_BASE)) return 0

    x = x.log10()

    // d.mul(p).mul(ln_p).div(s).lambertw().mul(s).div(ln_p)
    if (x.gt(308)) {
      if (getECCompletions(5) > 0 && i === 10) {
        x = x.div(308).root(3).sub(1).div(temp.generator_scale_power).add(1).mul(308)
      } else {
        const ln_p = Decimal.ln(2).mul(temp.generator_scale_power)
        x = Decimal.pow(2,temp.generator_scale_power).mul(x).mul(ln_p).div(308).lambertw().mul(308).div(ln_p)
      }
    }

    x = Decimal.pow10(x).div(this.COST_BASE).log(this.COST_INC).sub(player.generators[i].additionalBought)

    return x.floor().add(1)
  },

  purchase(max=false) {
    if (!this.unlocked || player.infinity.reached) return;

    let cost = this.cost
    const amount = this.resource

    if (Decimal.gte(amount,cost)) {
      let bulk = Decimal.add(this.bought, 1)

      if (max) cost = this.COST(Decimal.sub(bulk = bulk.max(this.bulk),1));

      const count = bulk.sub(this.bought).round();

      this.bought = bulk
      if (!hasInfinityUpgrade(InfinityUpgrade.ExpanderBulk)) this.resource = Decimal.sub(amount,cost).max(0);

      if (inNormalChallenge(1)) player.challenges.normal.C1 = 0;
      if (inNormalChallenge(3)) for (let j = i - 1; j > 0; j--) GENERATOR(j).amount = 0;
      if (inNormalChallenge(8)) for (let j = 1; j <= 10; j++) if (i !== j && Decimal.gt(player.generators[j].bought, 0)) player.generators[j].additionalCost = count.pow10().mul(player.generators[j].additionalCost);
      if (inNormalChallenge(10)) player.challenges.normal.C10 = 0;

      if (inInfinityChallenge(4)) player.challenges.infinity.C4 = i;
      if (inInfinityChallenge(5)) for (let j = 1; j <= 10; j++) if (i !== j && Decimal[i > 5 ? 'lte' : 'gte'](cost, GENERATOR(j).cost)) player.generators[j].additionalBought = count.add(player.generators[j].additionalBought);

      giveAchievement(i > 8 ? 12 + i : 10 + i)
      if (i < 10) player.achRestrictions.a91 = false;
      if (i > 1) player.achRestrictions.a112 = false;
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

  autoUnlocked: boolean;
}

export function purchaseAllGenerators() {
  for (let i = 1; i <= 10; i++) GENERATOR(i).purchase(true);
}

export function getGeneratorScalingPower(): DecimalSource {
  let x: DecimalSource = DC.D1

  x = Decimal.sub(1, infinityUpgradeEffect(InfinityUpgrade.SlowerGenCost,0)).mul(x)
  x = Decimal.sub(1, getECReward(6)).mul(x)

  return x
}

export function getGeneratorBase(): DecimalSource {
  if (inInfinityChallenge(8)) return 1;
  if (inNormalChallenge(6)) return Decimal.mul(.2, player.expanders).add(1).min(2);
  if (inNormalChallenge(11)) return 1;

  let x: DecimalSource = 2

  if (hasInfinityUpgrade(InfinityUpgrade.GenBoost)) x = 2.2;
  if (isICBeaten(8)) x = 2.5;

  return x
}

export function totalGeneratorOoMMultiplier(): DecimalSource {
  let x = DC.D1

  if (isICBeaten(5)) x = x.mul(1.1);
  x = x.mul(getAchievementEffect(41)).mul(getAchievementEffect(57));

  return x
}

export function totalGeneratorMultiplier(): DecimalSource {
  let x = DC.D1

  x = x.mul(simpleInfinityEffect(InfinityUpgrade.TimeMult))
  .mul(simpleInfinityEffect(InfinityUpgrade.InfinityBonus))
  .mul(simpleInfinityEffect(InfinityUpgrade.CurrentMult))
  .mul(simpleInfinityEffect(InfinityUpgrade.BetterGenMult))
  .mul(simpleInfinityEffect(InfinityUpgrade.ChalMult))

  if (inNormalChallenge(1)) x = x.mul(player.challenges.normal.C1);

  x = x.mul(temp.infinity.power.mult).mul(temp.eternity.ec10)

  x = x.mul(getTimeStudyEffect(91)).mul(getTimeStudyEffect(101)).mul(getTimeStudyEffect(161)).mul(getTimeStudyEffect(213))

  x = x.mul(getAchievementEffect(48)).mul(getAchievementEffect(72)).mul(getAchievementEffect(75));
  if (!temp.no_challenges) x = x.mul(getAchievementEffect(65));

  return x
}

export const EXPANDER = {
  get amount() { return player.expanders },
  set amount(v) { player.expanders = v },

  get bonus(): DecimalSource {
    return getTimeStudyEffect(232)
  },

  get total(): DecimalSource {
    return Decimal.add(this.amount, temp.bouns_expander)
  },

  get base() {
    let x = 1.5
    if (isICBeaten(5)) x -= .1;
    if (hasTimeStudy(81)) x -= .1;
    if (hasTimeStudy(221)) x -= .1;
    if (hasTimeStudy(231)) x -= .1;
    return x
  },

  get requirement(): [number, DecimalSource] {
    const NC9 = inNormalChallenge(9)

    const n = Decimal.add(this.amount, 4).min(NC9 ? 8 : 10).toNumber()

    let m = Decimal.sub(this.amount, NC9 ? 4 : 6).max(0)

    if (inEternitychallenge(5)) m = m.pow(2);

    m = m.mul(this.base).add(2).ceil()

    return [n,m]
  },
  get bulk(): DecimalSource {
    const NC9 = inNormalChallenge(9)

    const amount = GENERATOR(NC9 ? 8 : 10).bought

    let x = Decimal.sub(amount, 2).div(this.base)

    if (inEternitychallenge(5)) x = x.root(2);

    x = x.add(NC9 ? 4 : 6).floor().add(1)
    // Decimal.sub(this.amount, NC9 ? 4 : 6).max(0).mul(1.5).add(2).ceil()

    return x
  },

  get power(): DecimalSource {
    if (inNormalChallenge(7) || inNormalChallenge(11) || inInfinityChallenge(8) || inEternitychallenge(6)) return 1;
    if (inInfinityChallenge(7)) return 10;

    let x: DecimalSource = 2

    if (hasInfinityUpgrade(InfinityUpgrade.ExpanderBoost)) x = 2.5;
    if (isICBeaten(7)) x = 4;
    if (hasTimeStudy(71)) x = 16;

    x = Decimal.mul(x, getTimeStudyEffect(82)).mul(getTimeStudyEffect(83)).mul(getTimeStudyEffect(233)).mul(getTimeStudyEffect(241))

    return x
  },

  expand(max = false) {
    if (player.infinity.reached) return;

    const [n,m] = this.requirement, G = GENERATOR(n)

    if (Decimal.gte(G.bought,m)) {
      let bulk = Decimal.add(this.amount,1)
      if (max && Decimal.gte(this.amount, inNormalChallenge(9) ? 4 : 6)) bulk = bulk.max(this.bulk);
      if (bulk.sub(this.amount).gte(256)) giveAchievement(115);
      this.amount = bulk

      if (Decimal.gte(player.eternity.times, 20)) {
        if (inNormalChallenge(2)) player.challenges.normal.C2 = .01;
        if (inInfinityChallenge(6)) player.challenges.normal.C10 = 0;
      } else this.reset();
    }
  },

  reset() {
    if (inNormalChallenge(2)) player.challenges.normal.C2 = .01;
    if (inInfinityChallenge(6)) player.challenges.normal.C10 = 0;

    if (hasAchievement(68)) player.points = 5e40;
    else if (hasAchievement(45)) player.points = 5e10;
    else if (hasAchievement(44)) player.points = 5e5;
    else if (hasAchievement(35)) player.points = 5e3;
    else if (hasAchievement(31)) player.points = 200;
    else player.points = 10;

    for (let i = 1; i <= 10; i++) player.generators[i] = { amount: 0, bought: 0, additionalCost: 1, additionalBought: 0 };

    resetTemp()
  },

  get canQuickReset() { return inNormalChallenge(8) || inNormalChallenge(10) || inInfinityChallenge(4) || inInfinityChallenge(5) || inInfinityChallenge(6) },

  quick() {
    if (!this.canQuickReset) return;

    this.reset()
  },
}

export const REFINER = {
  get unlocked() { return !inInfinityChallenge(2) && !inInfinityChallenge(7) && !inInfinityChallenge(8) && !inEternitychallenge(3) && !inEternitychallenge(6) && (player.refiner.times > 0 || Decimal.gte(player.expanders, 6)) },

  get requirement() { return hasInfinityUpgrade(InfinityUpgrade.Start4) ? 1e90 : 1e100 },

  calc_boost(amount: DecimalSource): DecimalSource {
    let x = Decimal.max(amount, 1).log10()
    const L = Math.log10(this.requirement)

    if (x.lt(L)) return 1;

    const exp = Decimal.sub(isICBeaten(2) ? 2.5 : 3, getTimeStudyEffect(42)).sub(getTimeStudyEffect(236))

    x = x.div(L).root(exp).mul(10).sub(10).pow10()

    if (hasInfinityUpgrade(InfinityUpgrade.RefineBoost)) x = x.pow(1.25);
    if (hasInfinityUpgrade(InfinityUpgrade.RefineBoost2)) x = x.sqr();

    x = x.pow(getAchievementEffect(28)).pow(getAchievementEffect(36)).pow(getAchievementEffect(116));

    x = x.pow(getTimeStudyEffect(222)).pow(getTimeStudyEffect(242));

    if (inEternitychallenge(5)) x = expPow(x, .5);

    return x
  },

  refine() {
    if (player.infinity.reached || !this.unlocked) return;

    if (Decimal.gt(player.points, player.refiner.highest)) {
      player.refiner.times++
      player.refiner.highest = player.points
      giveAchievement(26)

      if (hasAchievement(101)) {
        if (inNormalChallenge(2)) player.challenges.normal.C2 = .01;
        if (inInfinityChallenge(6)) player.challenges.normal.C10 = 0;
      } else this.reset();
    }
  },

  get startingExpander() {
    let n = 0
    if (inNormalChallenge(0)) for (let x = 1; x <= 4; x++) if (hasInfinityUpgrade('start'+x)) n += x == 4 ? 1 : 2;
    return n
  },

  reset() {
    player.expanders = this.startingExpander

    EXPANDER.reset()
  },
}
