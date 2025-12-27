import { player } from "@/main"
import { INFINITY } from "../infinity"
import type { DecimalSource } from "break_eternity.js"
import { D, DC } from "@/utils/decimal"
import Decimal from "break_eternity.js"
import { giveAchievement } from "../achievements"
import { Quote } from "@/utils/quote"
import { notify } from "@/utils/notify"

export enum InfinityChallenge {
  C1 = 1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12
}

export const INF_CHALLENGES: {
  description: string,
  require: DecimalSource,
  goal: DecimalSource,
  reward: string,
}[] = [
  {
    description: `Has no condition, just reach infinity already.`,
    require: DC.DINF,
    goal: DC.DINF,
    reward: `???`,
  },{
    description: `All Normal Challenge restrictions are active at once, except the C8 & C12.`,
    require: D('e2600'),
    goal: D('e1100'),
    reward: `All Infinity Generators are doubled per Infinity Challenge completed.`,
  },{
    description: `Generator Refiner has no boosts.`,
    require: D('e7200'),
    goal: D('e6000'),
    reward: `Improve the formula of Generator Refiner's boost.`,
  },{
    description: `The multiplier per OoMs of each generator is reduced to ×1, but it is increased every purchased Generator based on Generator Expander.`,
    require: D('e10000'),
    goal: D('e6400'),
    reward: `The multiplier per OoMs of each generator is increased based on purchased Generator and Generator Expander slightly.`,
  },{
    description: `Only the latest bought Normal Gemerator's production is normal. All other Normal Gemerators produce less (^0.25).`,
    require: D('e14400'),
    goal: D('e14000'),
    reward: `All Generators are raised to the 1.05th power.`,
  },{
    description: `Buying Generators 1-5 causes all cheaper Generator costs to increase. Buying Generators 6-10 causes all more expensive Generator costs to increase.`,
    require: D('e18000'),
    goal: D('e17000'),
    reward: `The multiplier per OoMs of each generator is 10% stronger, and reduce the requirement of Generator Expander.`,
  },{
    description: `Does like Normal Challenge 10, but it’s ×10 faster and the time resets by Generator Expander instead of buying any Generator.`,
    require: D('e24000'),
    goal: D('e20000'),
    reward: `The multiplier per OoMs of each infinity generator is also increased based on purchased Infinity Generator.`,
  },{
    description: `The multiplier per OoMs of each generator is reduced to ×1 and Generator Refiner has no boosts, but the multiplier per generator expander is increased to ×10.`,
    require: D('e30000'),
    goal: D('e14500'),
    reward: `The multiplier per generator expander is increased to ×4.`,
  },{
    description: `The multiplier per generator and OoMs of each generator is reduced to ×1, Generator Expander provides no multiplier, and  Generator Refiner has no boosts.`,
    require: D('e42000'),
    goal: D('e19500'),
    reward: `The multiplier per generator is increased to ×2.5.`,
  },
]

export function inInfinityChallenge(id: number) { return player.challenges.infinity.current === id };
export function isICBeaten(id: number) { return (player.challenges.infinity.completedBits & (1 << id)) !== 0 };
export function getICCompletions() {
  let n = 0
  for (let m = (player.challenges.infinity.completedBits | 1) ^ 1; m !== 0; m >>= 1) n += m & 1;
  return n
}
export function getTotalFastestIC() { return player.challenges.infinity.fastest.reduce((a,b) => Decimal.add(a, b), 0) }

export function startInfinityChallenge(id: number) {
  if (!player.first.infinity || inInfinityChallenge(id)) return;

  player.challenges.infinity.current = id;
  INFINITY.reset();

  player.tab = 0;
  player.stab[0] = 0;
};
export function completeInfinityChallenge() {
  const id = player.challenges.infinity.current

  if (Decimal.gte(player.points, INF_CHALLENGES[id].goal)) {
    if (id > 0) {
      player.challenges.infinity.fastest[id-1] = Decimal.min(player.challenges.infinity.fastest[id-1], player.infinity.time);
      player.challenges.infinity.completedBits |= 1 << id;
    }
    giveAchievement(66)

    if (id === 5) Quote.addFromKeys('ic5');
    if (getICCompletions() >= 8) Quote.addFromKeys('all_ic');
  }

  player.challenges.infinity.current = 0;
}

export function checkICUnlocks() {
  const C = INF_CHALLENGES[player.challenges.infinity.unlocked+1]

  if (C !== undefined && Decimal.gte(player.points, C.require)) {
    player.challenges.infinity.unlocked++;
    if (Decimal.gte(player.eternity.times, 6)) player.challenges.infinity.completedBits += 1 << player.challenges.infinity.unlocked;
    else notify("You unlocked a new Infinity Challenge!","success");
  }
}
