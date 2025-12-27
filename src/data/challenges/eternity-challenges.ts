import { player, temp } from "@/main"
import { DC, expPow } from "@/utils/decimal"
import { format, formatMult, formatPercent, formatPow, formatTime } from "@/utils/formats"
import type { DecimalSource } from "break_eternity.js"
import Decimal from "break_eternity.js"
import { getTimeStudyEffect, hasTimeStudy, respecTimeStudies } from "../timestudies"
import { ETERNITY } from "../eternity"
import { notify } from "@/utils/notify"
import { INFINITY } from "../infinity"
import { giveAchievement } from "../achievements"
import { Quote } from "@/utils/quote"

export const EternityChallenges: {
  description: string,
  goal(x: number): DecimalSource,
  reward: string,
  effect: [(x: number) => DecimalSource, DecimalSource, (x: DecimalSource, c: number) => string]
}[] = [
  {
    description: `Has no condition, still reach eternity already, cheating scum.`,
    goal: () => DC.DINF,
    reward: `???`,
    effect: [()=>0,0,()=>"???"]
  },{
    description: `Time Generators are disabled.`,
    goal: x => Decimal.mul(x, 200).add(1800).pow10(),
    reward: `Time Generators are boosted by time spent this Eternity.`,
    effect: [x=>Decimal.mul(player.eternity.time,100).max(1).pow(.5 + x * .05), 1, x=>formatMult(x)]
  },{
    description: `Infinity Generators are disabled.`,
    goal: x => Decimal.mul(x, 175).add(900).pow10(),
    reward: `Infinity Power affects the 1st Infinity Generator at a reduced rate.`,
    effect: [x=>expPow(Decimal.add(player.infinity.power, 1), .8).pow(x), 1, x=>formatMult(x)]
  },{
    description: `Normal Generators 5-10 don’t produce anything. Generator Refiner has no boosts.`,
    goal: x => ['e450','e850','e1200','e1400','e1650'][x],
    reward: `Increase the multiplier per OoMs of each generator.`,
    effect: [x=>x / 5 + 1, 1, x=>formatMult(x)]
  },{
    get description() { return `All Infinity multipliers and generators are disabled. The goal must be reached with at most <b>${8 - 2 * Math.min(player.challenges.eternity.completed[4], 4)}</b> Infinities or else you will fail the Challenge.` },
    goal: x => Decimal.mul(x, 1250).add(6750).pow10(),
    reward: `Infinity Generators are boosted by unspent Infinity Points at a reduced rate.`,
    effect: [x=>Decimal.add(player.infinity.points, 1).pow(x * .1), 1, x=>formatMult(x)]
  },{
    description: `Generator Expanders scale faster, and Generator Refiner is weaker.`,
    goal: x => Decimal.mul(x, 1000).add(5600).pow10(),
    reward: `Quetta-Generator’s cost no longer scales exponentially, so it scales polynomially instead.`,
    effect: [x=>3.25 - x * .25, 3, (x,c)=>c > 0 ? formatPow(x,2) : "Exponential"]
  },{
    description: `The multiplier per OoMs of each generator is reduced to ×1, and Generator Expanders and Generator Refiner have no boosts. The cost of some Infinity Energy upgrades is reduced.`,
    goal: x => Decimal.mul(x, 400).add(3200).pow10(),
    reward: `Slow down the post-infinity scaling of all generators further.`,
    effect: [x=>.1*x, 0, x=>formatPercent(x,0)]
  },{
    description: `1st Time Generators produce 10th Infinity Generators and 1st Infinity Generators produce 10th Normal Generators. The multiplier per OoMs of each normal and infinity generator is reduced to ×1.`,
    goal: x => Decimal.mul(x, 700).add(2100).pow10(),
    reward: `First Time Generators produce tenth Infinity Generators.`,
    effect: [x=>.2*x, 0, x=>`+${format(Decimal.max(temp.currencies['time-shards'], 1).pow(x).sub(1))}/s`]
  },{
    description: `You can only upgrade Infinity Generators 50 times and Infinity Energy upgrades 50 times. Their automation is disabled.`,
    goal: x => Decimal.mul(x, 2000).add(7500).pow10(),
    reward: `Infinity Power slowdown is weaker.`,
    effect: [x=>x * .05, 0, x=>formatPercent(x,0)]
  },{
    description: `Effective OoMs only apply to Normal Generators.`,
    goal: x => Decimal.mul(x, 10000).add(15000).pow10(),
    reward: `Improve the 6th Eternity upgrade.`,
    effect: [x=>1+x, 1, x=>formatMult(x)]
  },{
    get description() { return `Infinity and Time Generators are disabled. The multiplier per OoMs of each generator is reduced to ×1. Normal Generators are boosted by Infinities significantly. <b>(${formatMult(getEC10Boost())})</b>` },
    goal: x => Decimal.mul((x+1)**2, 1500).add(2000).pow10(),
    reward: `Infinities boost Time Generators.`,
    effect: [x=>Decimal.pow(INFINITY.totalInfinities, .375+.125*x).div(1e5).add(1).pow(getTimeStudyEffect(31)), 1, x=>formatMult(x)]
  },{
    description: `All Normal Generator multipliers and exponents are disabled except for the multipliers from Infinity Power and Generator Expanders. The multiplier per OoMs of each infinity generator is reduced to ×1.`,
    goal: x => ['e27500','e31500','e35500','e37500','e41800'][x],
    reward: `Slow down the post-infinity reduction of multiplier per OoMs of each generator further.`,
    effect: [x=>.05*x, 0, x=>formatPercent(x,0)]
  },{
    get description() { return `The game runs <b>${formatMult(1e3)}</b> slower; all other game speed effects are disabled. The goal must be reached within <b>${formatTime(1 - .2 * Math.min(player.challenges.eternity.completed[12], 4))}</b>, or you will fail the Challenge.` },
    goal: x => Decimal.mul(x, 9e4).add(3e5).pow10(),
    reward: `The cost of Infinity Generators is reduced.`,
    effect: [x=>1-.18*x, 1, x=>formatPow(x)]
  },
]

export function isECsUnlocked(): boolean {
  if (player.challenges.eternity.unlockedBits > 0) return true;
  for (let x = 1; x <= 12; x++) if (hasTimeStudy("EC"+x)) return true;
  return false;
}
export function isECUnlocked(id: number): boolean { return (player.challenges.eternity.unlockedBits & (1 << (id - 1))) !== 0 || hasTimeStudy("EC"+id) }
export function inEternitychallenge(id: number) { return player.challenges.eternity.current === id }
export function getECCompletions(id: number) { return player.challenges.eternity.completed[id] }
export function getECGoal(id: number, level: number = player.challenges.eternity.completed[id]) { return EternityChallenges[id].goal(Math.min(level, 4)) }
export function getECReward(id: number) { return temp.eternity.challenge_rewards[id] }
export function getTotalECTiers() { return player.challenges.eternity.completed.reduce((a,b,i) => i>0 ? a+b : 0, 0) }

export function startEternityChallenge(id: number) {
  if (!hasTimeStudy("EC"+id) || inEternitychallenge(id)) return;

  player.challenges.eternity.current = id;
  ETERNITY.reset();
};
export function completeEternityChallenge() {
  const id = player.challenges.eternity.current, c = getECCompletions(id)

  if (Decimal.gte(player.infinity.points, getECGoal(id, c))) {
    if (id > 0) {
      // player.challenges.infinity.fastest[id-1] = Math.min(player.challenges.infinity.fastest[id-1], player.infinity.time);
      if (c < 5) player.challenges.eternity.completed[id] ++;
      if (player.challenges.eternity.completed[id] >= 5) player.challenges.eternity.fastest5[id-1] = Decimal.min(player.challenges.eternity.fastest5[id-1], player.eternity.time);
    }

    Quote.addFromKeys('complete_ec');
    giveAchievement(104)
    if (c+1 >= 5) {
      giveAchievement(105);
      Quote.addFromKeys('complete_ec_5t');
    }
    if (id === 10 && player.challenges.eternity.C8[0] >= 50 && player.challenges.eternity.C8[1] >= 50) giveAchievement(113);

    player.challenges.eternity.unlockedBits |= 1 << (id - 1)
    respecTimeStudies(true)

    if (getTotalECTiers() >= 60) Quote.addFromKeys('all_ec');
  }

  player.challenges.eternity.current = 0;
}
export function failEternityChallenge() {
  const id = player.challenges.eternity.current

  if (id > 0) {
    notify(`You failed an Eternity Challenge ${id}!`, "error")

    giveAchievement(106)

    player.challenges.eternity.current = 0;
    ETERNITY.reset();
  }
}

export function updateECTemp() {
  for (let x = 1; x < EternityChallenges.length; x++) {
    const EC = EternityChallenges[x], C = player.challenges.eternity.completed[x]

    temp.eternity.challenge_rewards[x] = C > 0 ? EC.effect[0](C) : EC.effect[1];
  }

  temp.eternity.ec10 = inEternitychallenge(10) ? getEC10Boost() : 1
}

export function getEC10Boost() {
  return Decimal.add(INFINITY.totalInfinities, 1).pow(1e3).pow(getTimeStudyEffect(31))
}
