import type { DecimalSource } from "break_eternity.js";
import { EXPANDER, GENERATOR, getGeneratorBase, getGeneratorScalingPower, purchaseAllGenerators, REFINER, totalGeneratorMultiplier, totalGeneratorOoMMultiplier } from "./data/generators/normal-generators";
import { player, state, temp } from "./main";
import Decimal from "break_eternity.js";
import { DC, softcap } from "./utils/decimal";
import { CURRENCIES, Currency } from "./data/currencies";
import { hasInfinityUpgrade, INFINITY, InfinityUpgrade, infinityUpgradeEffect, simpleInfinityEffect, updateInfinityTemp } from "./data/infinity";
import { getNC10Exponent, inNormalChallenge } from "./data/challenges/normal-challenges";
import { AUTO_TIMEOUTS, AUTOMATIONS } from "./data/automations";
import { forceDeepAssign } from "./utils/saveload";
import { getInfinityPowerEffect, INF_GEN_POWER, INF_GENERATOR, purchaseAllInfinityGenerators, totalInfinityGeneratorMultiplier } from "./data/generators/infinity-generators";
import { checkICUnlocks, inInfinityChallenge, isICBeaten } from "./data/challenges/infinity-challenges";
import { InfinityEnergy } from "./data/infinity-energy";
import { AchievementKeys, Achievements, checkAllAchievements, getAchievementEffect, giveAchievement, hasAchievement, updateAchievementTemp } from "./data/achievements";
import { keyPressed } from "./utils/keybinds";
import { notify } from "./utils/notify";
import { getTimeShardsEffect, TIME_GENERATOR, totalTimeGeneratorMultiplier } from "./data/generators/time-generators";
import { getTimeStudyEffect, updateTimeStudiesTemp } from "./data/timestudies";
import { ETERNITY, simpleEternityEffect, updateEternityTemp } from "./data/eternity";

// Calculation

let diff = 0, cond = 0;

export function loop() {
  // requestAnimationFrame(loop)

  diff = Date.now() - player.lastPlayed;
  calc(diff/1000);

  document.documentElement.style.setProperty("--flux-color", `hsl(${60 * (1 + Math.sin(state.time))}, 72%, 57%)`)
  document.documentElement.style.setProperty("--rainbow-color", `hsl(${360 * (state.time / 10 % 1)}, 100%, 50%)`)

  updateTemp()

  player.lastPlayed = Date.now() // player.lastPlayed
}

export function calc(dt: number) {
  const dt_cap = player.flux.amount / (state.flux_speed - 1)
  const dt_flux = state.flux_speed > 1 ? Math.min(dt, dt_cap) * state.flux_speed + (Math.max(dt, dt_cap) - dt_cap) : dt

  cond = Decimal.gte(temp.currencies.points, player.points) ? cond + dt_flux : 0;

  for (let i = 10; i > 0; i--) {
    const G = TIME_GENERATOR(i)

    player.eternity.generators[i].amount = Decimal.mul(G.temp.gain, dt_flux).add(player.eternity.generators[i].amount);
  }

  for (let i = 10; i > 0; i--) {
    const G = INF_GENERATOR(i)

    player.infinity.generators[i].amount = Decimal.mul(G.temp.gain, dt_flux).add(player.infinity.generators[i].amount);
  }

  for (let i = 10; i > 0; i--) {
    const G = GENERATOR(i)

    if (!player.infinity.reached) player.generators[i].amount = Decimal.mul(G.temp.gain, dt_flux).add(player.generators[i].amount);
  }

  for (const i in CURRENCIES) {
    const C = CURRENCIES[i as Currency]
    C.amount = Decimal.mul(C.gain, C.passive).mul(dt_flux).add(C.amount)
  }

  player.infinity.points = Decimal.mul(infinityUpgradeEffect(InfinityUpgrade.IPGen), dt_flux/60).add(player.infinity.points);

  if (hasInfinityUpgrade(InfinityUpgrade.PassiveGen)) {
    player.infinity.passive += dt_flux;
    const f = player.infinity.fastest * 10
    if (player.infinity.passive >= f) player.infinity.points = Decimal.mul(Math.floor(player.infinity.passive / f), INFINITY.totalIPMultiplier).add(player.infinity.points);
    player.infinity.passive %= f
  } else player.infinity.passive = 0;

  if (hasInfinityUpgrade(InfinityUpgrade.TimesGen)) {
    player.infinity.passiveTimes += dt_flux;
    const f = player.infinity.fastest * 5
    if (player.infinity.passiveTimes >= f) player.infinity.times = Decimal.mul(Math.floor(player.infinity.passiveTimes / f), temp.infinity.infinities_gain).add(player.infinity.times);
    player.infinity.passiveTimes %= f
  } else player.infinity.passiveTimes = 0;

  checkICUnlocks()

  if (player.infinity.energy.unlocked) {
    player.infinity.energy.amount = InfinityEnergy.calc(player.infinity.energy.amount, Decimal.mul(InfinityEnergy.base, dt_flux))
  }

  if (Decimal.gte(player.eternity.times, 5)) player.eternity.points = Decimal.mul(ETERNITY.milestones[4].rate as DecimalSource, dt_flux/60).add(player.eternity.points);
  if (Decimal.gte(player.eternity.times, 1e3)) player.infinity.times = Decimal.mul(player.eternity.fastInfinties, dt_flux).add(player.infinity.times);

  if (Decimal.gte(player.eternity.times, 100)) {
    player.eternity.passiveTimes += dt_flux;
    const f = player.eternity.fastest * 2
    if (player.eternity.passiveTimes >= f) player.eternity.times = Decimal.mul(Math.floor(player.eternity.passiveTimes / f), 1).add(player.eternity.times);
    player.eternity.passiveTimes %= f
  } else player.eternity.passiveTimes = 0;

  for (const i in AUTOMATIONS) {

    const AUTO = AUTOMATIONS[i], DATA = player.automations[i], interval = AUTO.interval * Math.pow(AUTO.decrease, DATA.level);

    if (AUTO.unl() && DATA.enabled) {
      if (interval < .1) {
        AUTO.tick(DATA);
        DATA.tick = 0;
        continue
      }

      const t = DATA.tick + dt_flux;
      if (t >= interval) AUTO.tick(DATA);
      DATA.tick = t % interval;
    } else DATA.tick = 0;
  }

  for (const i in AUTO_TIMEOUTS) {
    const AT = AUTO_TIMEOUTS[i]

    AT.time += dt;

    if (AT.willReject()) {
      // console.log("Rejected!")
      delete AUTO_TIMEOUTS[i];
      continue
    }
    else if (AT.willReset()) {
      // console.log("Reset!")
      AT.time = 0;
      continue
    }

    if (AT.time >= AT.interval) {
      // console.log("Approved!")
      AT.tick()
      delete AUTO_TIMEOUTS[i];
    }
  }

  if (keyPressed('M') && player.tab === 0) {
    if (player.stab[0] === 0) purchaseAllGenerators();
    if (player.stab[0] === 1) purchaseAllInfinityGenerators();
  }
  if (keyPressed('E')) EXPANDER.expand();
  if (keyPressed('R')) REFINER.refine();
  if (keyPressed('C')) INFINITY.crunch();

  player.timePlayed += dt_flux
  player.eternity.time += dt_flux

  if (!player.infinity.reached) player.infinity.time += dt_flux;
  if (cond >= 30) giveAchievement(32);

  checkAllAchievements();

  if (inNormalChallenge(1)) player.challenges.normal.C1 = Decimal.add(player.challenges.normal.C1, dt_flux / 180).min(1);
  if (inNormalChallenge(2)) player.challenges.normal.C2 = Decimal.pow(1.005, dt_flux).mul(player.challenges.normal.C2);
  if (inNormalChallenge(10) || inInfinityChallenge(6)) player.challenges.normal.C10 = Decimal.add(player.challenges.normal.C10, inInfinityChallenge(6) ? dt_flux * 10 : dt_flux);

  state.time += dt
  if (state.flux_speed > 1) {
    player.flux.amount = Math.max(0, player.flux.amount - dt * (state.flux_speed - 1))
    if (player.flux.amount === 0) {
      state.flux_speed = 1;
      notify(`You ran out of flux time, so flux speed is back to the normal!`, 'warn')
    }
  }
}

// Temp

export type GeneratorTemp = {
  mult: DecimalSource;
  oom_inc: DecimalSource;
  gain: DecimalSource;
};

export type TempData = {
  generators: GeneratorTemp[];
  generator_mult: DecimalSource;
  generator_base: DecimalSource;
  generator_scale_power: DecimalSource;
  generator_oom_mult: DecimalSource,
  expander_power: DecimalSource;
  refiner_boost: DecimalSource;
  refiner_boost_increase: DecimalSource;

  infinity: {
    upgrades: Record<string, DecimalSource>;
    infinities_gain: DecimalSource;

    generators: GeneratorTemp[];
    generator_mult: DecimalSource;

    power: {
      exp: DecimalSource;
      mult: DecimalSource;
    },

    energy: {
      effect: { mult: DecimalSource },
      upgrades: DecimalSource[],
    },
  };

  eternity: {
    upgrades: Record<string, DecimalSource>;

    generators: GeneratorTemp[];
    generator_mult: DecimalSource;

    shards: DecimalSource;

    timestudies: Record<string, DecimalSource>;
  };

  currencies: Record<string, DecimalSource>;

  achievements: Record<number, DecimalSource>;

  no_challenges: boolean;

  [index: string]: unknown;
}

export function getTempData(): TempData {
  const T: TempData = {
    generators: [],
    generator_mult: 1,
    generator_scale_power: 1,
    generator_base: 2,
    generator_oom_mult: 1,
    expander_power: 2,
    refiner_boost: 1,
    refiner_boost_increase: 1,

    infinity: {
      upgrades: {},
      infinities_gain: 1,

      generators: [],
      generator_mult: 1,

      power: {
        exp: 5,
        mult: 1,
      },

      energy: {
        effect: { mult: 1 },
        upgrades: [],
      },
    },

    eternity: {
      upgrades: {},

      generators: [],
      generator_mult: 1,

      shards: 0,

      timestudies: {},
    },

    currencies: {},
    achievements: {},
    no_challenges: false,
  };

  for (let i = 1; i <= 10; i++) {
    T.generators[i] = {
      mult: 1,
      oom_inc: 1,
      gain: 0,
    }

    T.infinity.generators[i] = {
      mult: 1,
      oom_inc: 1,
      gain: 0,
    }

    T.eternity.generators[i] = {
      mult: 1,
      oom_inc: 1,
      gain: 0,
    }
  }

  for (const i in CURRENCIES) T.currencies[i] = 0;
  for (const i of AchievementKeys) {
    const A = Achievements[i]
    if ('effect' in A) T.achievements[i] = A.effect![1];
  };

  return T
}

export function resetTemp() {
  forceDeepAssign(temp, getTempData())
  updateTemp()
}

export function updateTemp() {
  temp.no_challenges = inNormalChallenge(0) && inInfinityChallenge(0)

  updateAchievementTemp()

  updateTimeStudiesTemp()
  updateEternityTemp()
  updateInfinityTemp()

  InfinityEnergy.temp()
  temp.infinity.energy.effect = InfinityEnergy.effect()

  temp.infinity.power = getInfinityPowerEffect()
  temp.infinity.generator_mult = totalInfinityGeneratorMultiplier()

  temp.eternity.shards = getTimeShardsEffect()
  temp.eternity.generator_mult = totalTimeGeneratorMultiplier()

  temp.generator_scale_power = getGeneratorScalingPower()

  temp.generator_base = getGeneratorBase();
  temp.expander_power = EXPANDER.power;
  temp.generator_mult = totalGeneratorMultiplier();
  temp.generator_oom_mult = totalGeneratorOoMMultiplier();
  temp.refiner_boost = REFINER.calc_boost(player.refiner.highest);
  temp.refiner_boost_increase = Decimal.div(REFINER.calc_boost(player.points), temp.refiner_boost)

  const NC12 = inNormalChallenge(12), s = NC12 ? 1 : 0;
  const oom_inc_exp = Decimal.sub(1, infinityUpgradeEffect(InfinityUpgrade.SlowerOoMMult,0)).pow_base(.5)

  for (let i = 10; i > 0; i--) {
    const G = TIME_GENERATOR(i), T = temp.eternity.generators[i];

    let OoMs = Decimal.max(G.amount,1).log10();
    const fixed_OoMs = OoMs;

    OoMs = softcap(OoMs, DC.DE308LOG, .5, "P")

    T.oom_inc = OoMs.gt(0) ? fixed_OoMs.div(OoMs) : 1

    T.mult = OoMs.add(getAchievementEffect(94)).pow_base(G.base)
    .mul(temp.eternity.generator_mult)
    .mul(Decimal.pow(4,G.bought))

    if (i === 1) T.mult = T.mult.mul(getTimeStudyEffect(11)).mul(getTimeStudyEffect(103));

    if (i >= 10) T.gain = 0;
    else {
      const NG = TIME_GENERATOR(i + 1)

      const amount = NG.amount

      T.gain = Decimal.mul(amount, NG.temp.mult)
    }
  }

  for (let i = 10; i > 0; i--) {
    const G = INF_GENERATOR(i), T = temp.infinity.generators[i];

    let OoMs = Decimal.max(G.amount,1).log10();
    const fixed_OoMs = OoMs;

    OoMs = softcap(OoMs, DC.DE308LOG, .5, "P")

    T.oom_inc = OoMs.gt(0) ? fixed_OoMs.div(OoMs) : 1

    T.mult = OoMs.add(simpleEternityEffect('timeGenMult2',0)).pow_base(G.base)
    .mul(temp.infinity.generator_mult)
    .mul(Decimal.pow(INF_GEN_POWER[i] ?? 1,G.bought))

    if (i >= 10) T.gain = 0;
    else {
      const NG = INF_GENERATOR(i + 1)

      const amount = NG.amount

      T.gain = Decimal.mul(amount, NG.temp.mult)
    }
  }

  for (let i = 10; i > 0; i--) {
    const G = GENERATOR(i), T = temp.generators[i];

    let OoMs = Decimal.max(G.amount,1).log10();
    const fixed_OoMs = OoMs;

    OoMs = softcap(OoMs, DC.DE308LOG, oom_inc_exp, "P")

    T.oom_inc = OoMs.gt(0) ? fixed_OoMs.div(OoMs) : 1

    T.mult = OoMs.add(temp.eternity.shards).pow_base(G.base)
    .mul(temp.generator_mult).mul(temp.refiner_boost)
    .mul(Decimal.pow(temp.generator_base,G.bought))
    .mul(Decimal.sub(player.expanders, i - 1).max(0).pow_base(temp.expander_power));

    if (i == 1 && inNormalChallenge(2)) T.mult = T.mult.mul(player.challenges.normal.C2);

    T.mult = T.mult.mul(simpleInfinityEffect('genMult' + (5.5 - Math.abs(5.5 - i))))

    if (hasAchievement(27)) T.mult = T.mult.mul(1 + i / 100);
    if (i <= 8) T.mult = T.mult.mul(getAchievementEffect(46));
    if (i <= 4) T.mult = T.mult.mul(getAchievementEffect(55));
    if (i === 1) T.mult = T.mult.mul(getAchievementEffect(61));

    if (inNormalChallenge(10) || inInfinityChallenge(6)) T.mult = T.mult.pow(getNC10Exponent());
    if (inInfinityChallenge(4) && i !== player.challenges.infinity.C4) T.mult = T.mult.pow(.25);
    if (isICBeaten(4)) T.mult = T.mult.pow(1.05);

    if (i + s >= 10) T.gain = 0;
    else {
      const NG = GENERATOR(i + s + 1)

      let amount = NG.amount

      if (NC12 && i % 2 === 0) amount = Decimal.pow(amount, 1 + (8 - i) / 10);

      T.gain = Decimal.mul(amount, NG.temp.mult)
    }
  }

  for (const i in CURRENCIES) temp.currencies[i] = CURRENCIES[i as Currency].gain;
}
