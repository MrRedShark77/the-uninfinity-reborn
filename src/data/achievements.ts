import { player, temp } from "@/main"
import { DC, expPow } from "@/utils/decimal"
import { format, formatMult, formatPow } from "@/utils/formats"
import { notify } from "@/utils/notify"
import type { DecimalSource } from "break_eternity.js"
import Decimal from "break_eternity.js"
import { getTotalFastestNC, isNCBeaten } from "./challenges/normal-challenges"
import { hasInfinityUpgrade, InfinityUpgrade } from "./infinity"
import { getTotalFastestIC } from "./challenges/infinity-challenges"
import { InfinityEnergy } from "./infinity-energy"

interface Achievement {
  name: string
  description: string
  reward?: string
  condition?(): boolean
  effect?: [()=>DecimalSource,DecimalSource] | [()=>DecimalSource,DecimalSource,(x:DecimalSource)=>string]
}

export const Achievements: Record<number, Achievement> = {
  11: {
    name: "Get started from point",
    get description() { return "Purchase a Kilo-Generator." },
  },
  12: {
    name: "100 points is not enough",
    get description() { return "Purchase a Mega-Generator." },
  },
  13: {
    name: "Half Life 3 CONFIRMED, almost...",
    get description() { return "Purchase a Giga-Generator." },
  },
  14: {
    name: "Bring us a Tesseract",
    get description() { return "Purchase a Tera-Generator." },
  },
  15: {
    name: "High Five!",
    get description() { return "Purchase a Peta-Generator." },
  },
  16: {
    name: "Don’t be devilish...",
    get description() { return "Purchase an Exa-Generator." },
  },
  17: {
    name: "Not a luck related achievement",
    get description() { return "Purchase a Zetta-Generator." },
  },
  18: {
    name: "90 degrees to infinity",
    get description() { return "Purchase a Yotta-Generator." },
  },

  21: {
    name: "“The 9th Dimension doesn’t exist”",
    get description() { return "Purchase a Ronna-Generator." },
  },
  22: {
    name: "Are you kidding me?",
    get description() { return "Purchase a Quetta-Generator." },
  },
  23: {
    name: "Where’s the NEWS?",
    get description() { return "Encounter 10 different fact messages. (NYI)" },
  },
  24: {
    name: "Half-Infinity",
    get description() { return `Get over <b>2^512 (${format(2**512)})</b> points.` },
    condition: () => Decimal.gte(player.points, 2**512),
  },
  25: {
    name: "Hyperdimension",
    get description() { return "Buy <b>12</b> Generator Expanders." },
    condition: () => Decimal.gte(player.expanders, 12),
  },
  26: {
    name: "Polish Generators",
    get description() { return "Refine Generators." },
  },
  27: {
    name: `Count to ten`,
    get description() { return `Have purchased just ten 10th Generators, nine 9th Generators, and so on.` },
    get reward() { return `Each Generator gains a boost proportional to tier. (10th gets 10%, 9th gets 9%, etc.)` },
    condition: () => player.generators.every((x,i) => i == 0 || Decimal.eq(x.bought,i)),
  },
  28: {
    name: "Getting inflated",
    get description() { return `Get over <b>${formatMult(1e3,0)}</b> from Generator Refiner.` },
    get reward() { return `Generator Refiner is <b>5%</b> stronger.` },
    condition: () => Decimal.gte(temp.refiner_boost, 1e3),
    effect: [()=>1.05,1],
  },

  31: {
    name: `To infinity!`,
    get description() { return `Go Infinite.` },
    get reward() { return `Start with <b>${format(200,0)}</b> points.` },
  },
  32: {
    name: `Simultaneous Derivative`,
    get description() { return `Having points per second exceeds your current points for 30 consecutive seconds.` },
  },
  33: {
    name: `Automation begins`,
    get description() { return `Max the interval for Generator autobuyers.` },
    condition: () => player.automations.generators.level >= 5,
  },
  34: {
    name: `Is this timewall?`,
    get description() { return `Play for <b>one hour</b>.` },
    condition: () => player.timePlayed >= 3600,
  },
  35: {
    name: `That’s FAST!`,
    get description() { return `Infinity in under <b>2 hours</b>.` },
    get reward() { return `Start with <b>${format(5e3,0)}</b> points.` },
  },
  36: {
    name: `Claustrophobia`,
    get description() { return `Infinity with at most <b>${formatMult(100,0)}</b> from Generator Refiner.` },
    get reward() { return `Generator Refiner is <b>5%</b> stronger.` },
    effect: [()=>1.05,1],
  },
  37: {
    name: `Nine Revolutions`,
    get description() { return `Infinity without purchasing Quetta-Generators.` },
  },
  38: {
    name: `Rest and sleep well`,
    get description() { return `Be offline for a period of over 8 hours.` },
  },

  41: {
    name: `Forgot to nerf that`,
    get description() { return `Get any Generator multiplier over <b>${formatMult(1e30)}</b>.` },
    get reward() { return `Multiplier per OoMs of each Generator is increased by <b>+1%</b>.` },
    effect: [()=>1.01,1],
    condition: () => temp.generators.some((x,i) => i > 0 && Decimal.gte(x.mult, 1e30)),
  },
  42: {
    name: `Many Infinities`,
    get description() { return `Infinity <b>10</b> times.` },
    get reward() { return `Gain <b>${formatMult(2,0)}</b> more Infinity Points.` },
    effect: [()=>2,1],
    condition: () => Decimal.gte(player.infinity.times, 10)
  },
  43: {
    name: `Ok, automation is worthless`,
    get description() { return `Max the interval for all normal autobuyers.` },
    condition: () => player.automations.generators.level >= 5 && player.automations.expander.level >= 8 && player.automations.refiner.level >= 11,
  },
  44: {
    name: `That’s FASTER!`,
    get description() { return `Infinity in under <b>10 minutes</b>.` },
    get reward() { return `Start with <b>${format(5e5,0)}</b> points.` },
  },
  45: {
    name: `That’s the FASTEST!`,
    get description() { return `Infinity in under <b>one minute</b>.` },
    get reward() { return `Start with <b>${format(5e10,0)}</b> points.` },
  },
  46: {
    name: `HOLY SHOT! IS THAT A FREAKING ANTIMATTER DIMENSIONS REFERENCE???`,
    get description() { return `Complete the 9th Normal Challenge.` },
    get reward() { return `Generators 1-8 are <b>8%</b> stronger.` },
    effect: [()=>1.08,1],
    condition: () => isNCBeaten(9)
  },
  47: {
    name: `Here are from heaven`,
    get description() { return `Purchase 15 Infinity Upgrades.` },
    condition() {
      const INF_UPGS_ORDER = [
        'timeMult',   'genBoost', 'refineBoost', 'infinityBonus', 'expanderBoost',
        'genMult1',   'genMult2', 'genMult3',    'genMult4',      'genMult5',
        'passiveGen', 'start1',   'start2',      'start3',        'start4',
      ]

      return INF_UPGS_ORDER.every(x => hasInfinityUpgrade(x))
    },
  },
  48: {
    name: `Anti-challenged`,
    get description() { return `Complete all 12 Normal Challenges.` },
    get reward() { return `Generators are <b>10%</b> stronger.` },
    effect: [()=>1.1,1],
    condition: () => player.challenges.normal.completedBits === 8192 - 1,
  },

  51: {
    name: `Infinity problems require break infinity`,
    get description() { return `Break Infinity.` },
    condition: () => player.infinity.break,
  },
  52: {
    name: `Not-so-challenging`,
    get description() { return `Get the sum of normal Challenge times under <b>3 minutes</b>.` },
    condition: () => getTotalFastestNC() <= 180,
  },
  53: {
    name: `Are you still here?`,
    get description() { return `Reach <b>${format(1e8,0)}</b> Infinity Points per minute.` },
    condition: () => Decimal.div(temp.currencies.infinity,player.infinity.time).mul(60).round().gte(1e8),
  },
  54: {
    name: `For strange things`,
    get description() { return `Purchase a Xenna-Generator.` },
    condition: () => Decimal.gt(player.infinity.power, 0),
  },
  55: {
    name: `Curse of the Immortal`,
    get description() { return `Complete any normal challenge without expanding or refining Generators.` },
    get reward() { return `The first 4 Generators are <b>25%</b> stronger.` },
    effect: [()=>1.25,1],
  },
  56: {
    name: `Infinitely many deaths`,
    get description() { return `Complete the 1st Normal Challenge in under <b>one minute</b>.` },
    condition: () => player.challenges.normal.fastest[0] <= 60,
  },
  57: {
    name: `Cap or slap?`,
    get description() { return `Complete the 6th Normal Challenge in under <b>one minute</b>.` },
    get reward() { return `Multiplier per OoMs of each Generator is increased by <b>+1%</b>.` },
    effect: [()=>1.01,1],
    condition: () => player.challenges.normal.fastest[5] <= 60,
  },
  58: {
    name: `Feeling nostalgic`,
    get description() { return `Complete the 11th Normal Challenge without refining.` },
  },

  61: {
    name: `Just one thing`,
    get description() { return `Complete the 1st Normal Challenge with only a single first generator without expanding or refining Generators.` },
    get reward() { return `The first Generator is multiplied by <b>10</b>.` },
    effect: [()=>10,1],
  },
  62: {
    name: `No longer spamming needed`,
    get description() { return `Purchase the 5th Break Infinity upgrade.` },
    get reward() { return `Gain <b>${formatMult(2,0)}</b> more Infinities.` },
    effect: [()=>2,1],
    condition: () => hasInfinityUpgrade(InfinityUpgrade.TimesGen),
  },
  63: {
    name: `Were you already here?`,
    get description() { return `Reach <b>${format(1e16,0)}</b> Infinity Points per minute.` },
    condition: () => Decimal.div(temp.currencies.infinity,player.infinity.time).mul(60).round().gte(1e16),
  },
  64: {
    name: `Hyper-Hyperdimension`,
    get description() { return `Buy <b>64</b> Generator Expanders.` },
    condition: () => Decimal.gte(player.expanders, 64),
  },
  65: {
    name: `Is this useless?`,
    get description() { return `Get the sum of normal Challenge times under <b>5 seconds</b>.` },
    get reward() { return `Generators are <b>50%</b> stronger during some Challenges.` },
    condition: () => getTotalFastestNC() <= 5,
    effect: [()=>1.5,1],
  },
  66: {
    name: `Another challenge?`,
    get description() { return `Complete an Infinity Challenge.` },
  },
  67: {
    name: `Pouring water on a rock`,
    get description() { return `Reach <b>${format(1e6,0)}</b> Infinity Powers.` },
    condition: () => Decimal.gte(player.infinity.power, 1e6),
  },
  68: {
    name: `Bruh, where’s the car?`,
    get description() { return `Infinity in under <b>250 milliseconds</b>.` },
    get reward() { return `Start with <b>${format(5e40,0)}</b> points.` },
  },

  71: {
    name: `It’s Mario time!`,
    get description() { return `Complete the 5th Infinity Challenge in under <b>15 seconds</b>.` },
    condition: () => player.challenges.infinity.fastest[6] <= 15,
  },
  72: {
    name: `Jacorbian-RedSharkian balancing in a nutshell`,
    get description() { return `Reach <b>${format('ee4',0)}</b> points.` },
    get reward() { return `The unspent points boost Generators at a reduced rate.` },
    effect: [()=>expPow(Decimal.add(player.points, 1).root(100000), .5),1,x=>formatMult(x)],
    condition: () => Decimal.gte(player.points, 'ee4'),
  },
  73: {
    name: `Infinities everywhere`,
    get description() { return `Get all Generator multipliers over <b>${formatMult(DC.DE308)}</b>.` },
    condition: () => temp.generators.every((x,i) => i == 0 || Decimal.gte(x.mult,DC.DE308)),
  },
  74: {
    name: `The more you know`,
    get description() { return `Get the 5th Generator multiplier greater than the 4th one, the 4th Generator – the 3rd, and so on, if reach <b>${format(DC.DE308)}</b> of these Generators.` },
    condition() {
      for (let x = 5; x > 0; x--) if (Decimal.lt(player.generators[x].amount, DC.DE308) || x > 1 && Decimal.lte(temp.generators[x].mult,temp.generators[x-1].mult)) return false;

      return true;
    }
  },
  75: {
    name: `One of each generator`,
    get description() { return `Play for <b>10 days</b>.` },
    get reward() { return `Total time played boosts Generators at a very reduced rate.` },
    effect: [()=>Decimal.div(player.timePlayed,86400).add(1).root(10),1,x=>formatMult(x)],
    condition: () => player.timePlayed >= 864000,
  },
  76: {
    name: `GOOGOL REFINIER`,
    get description() { return `Get over <b>${formatMult(DC.DE100)}</b> from Generator Refiner.` },
    condition: () => Decimal.gte(temp.refiner_boost, DC.DE100),
  },
  77: {
    name: `1.946% to inf-infinity`,
    get description() { return `Infinity <b>${format(1e6,0)}</b> times.` },
    condition: () => Decimal.gte(player.infinity.times, 1e6),
  },
  78: {
    name: `Unnaturally challenged`,
    get description() { return `Complete all 8 Infinity Challenges.` },
    get reward() { return `Infinity Generators are <b>10%</b> stronger.` },
    effect: [()=>1.1,1],
    condition: () => player.challenges.infinity.completedBits === 512 - 2,
  },

  81: {
    name: `Halfway to the Eternity`,
    get description() { return `Get over <b>2^512 (${format(2**512)})</b> Infinity Points.` },
    get reward() { return `Gain <b>${formatMult(10,0)}</b> more Infinity Points.` },
    effect: [()=>10,1],
    condition: () => Decimal.gte(player.infinity.points, 2**512),
  },
  82: {
    name: `Two steps away`,
    get description() { return `Unlock the 8th Infinity Generator.` },
    condition: () => player.infinity.generatorsUnlocked >= 8
  },
  83: {
    name: `Polynomial Growth`,
    get description() { return `Get over <b>${formatPow(2,0)}</b> of Infinity Energy’s growth.` },
    condition: () => Decimal.gte(InfinityEnergy.exponent, 2),
  },
  84: {
    name: `Get (softcapped)`,
    get description() { return `Reach <b>${format(DC.DE308)}</b> Infinity Powers.` },
    condition: () => Decimal.gte(player.infinity.power, DC.DE308),
  },
  85: {
    name: `Are you waiting for infinity galaxy?`,
    get description() { return `Reach <b>${format(1e15)}</b> Infinity Energy in under <b>one hour</b>.` },
    get reward() { return `Infinity Energy provides a measuredly small boost to Infinity Points.` },
    effect: [()=>expPow(Decimal.add(player.infinity.energy.amount, 1).root(5), .5),1,x=>formatMult(x)],
    condition: () => player.infinity.time <= 3600 && Decimal.gte(player.infinity.energy.amount, 1e15)
  },
  86: {
    name: `Time is relative`,
    get description() { return `Go Eternal. (NYI)` },
    get reward() { return `Start with the last 4 infinity upgrades bought.` },
  },
  87: {
    name: `Am I wrong about this?`,
    get description() { return `Get the sum of Infinity Challenge times under <b>10 seconds</b>.` },
    condition: () => getTotalFastestIC() <= 10
  },
  88: {
    name: `Turning twenty`,
    get description() { return `Unlock the 10th Infinity Generator.` },
    condition: () => player.infinity.generatorsUnlocked >= 10
  },

  /*
  41: {
    name: ``,
    get description() { return `` },
    get reward() { return `` },
  },
  */
}

export const AchievementKeys = Object.keys(Achievements).map(x => Number(x));

export function getAchievementTooltip(id: number) {
  const ach = Achievements[id]
  let h = ""

  h += `<h4>${ach.name}</h4> (#${id})`
  h += `<hr class='sub-line'>${ach.description}`

  if ("reward" in ach) h += `<hr class='sub-line'><i><b>Reward:</b> ${ach.reward}</i>`;
  if ("effect" in ach && ach.effect?.[2]) h += `<hr class='sub-line'><i><b>Effect:</b> ${ach.effect[2](ach.effect[0]())}</i>`;

  return h
}

export function checkAllAchievements() {
  for (const id of AchievementKeys) {
    const A = Achievements[id];
    if (A.condition?.()) giveAchievement(id);
  }
}

export function giveAchievement(id: number) {
  if (player.achievements[id]) return;

  player.achievements[id] = true;
  notify(`<b>Achievement Unlocked:</b> ${Achievements[id].name}`,'success')
}

export function updateAchievementTemp() {
  for (const id of AchievementKeys) {
    const A = Achievements[id];
    if ('effect' in A) temp.achievements[id] = player.achievements[id] ? A.effect![0]() : A.effect![1];
  }
}

export const hasAchievement = (id: number) => player.achievements[id];
export const getAchievementEffect = (id: number) => temp.achievements[id];
export const calcCompletedAchievements = () => AchievementKeys.reduce((a,id) => a + +(player.achievements[id] ?? 0), 0);
