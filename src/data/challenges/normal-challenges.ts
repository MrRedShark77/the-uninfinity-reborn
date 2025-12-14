import { player } from "@/main"
import { INFINITY } from "../infinity"
import Decimal from "break_eternity.js"
import { inInfinityChallenge } from "./infinity-challenges"
import { REFINER } from "../generators/normal-generators"
import { giveAchievement } from "../achievements"

export enum NormalChallenge {
  C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12
}

export const NORMAL_CHALLENGES: {
  name: string,
  description: string,
  reward: string,
}[] = [
  {
    name: `Normal`,
    description: `Has no condition, just reach infinity.`,
    reward: `Unlock a Multi-Generator autobuyer.`,
  },{
    name: `More Idle`,
    description: `Buying Generators halts production of all Generators. Production gradually returns to normal over 3 minutes.`,
    reward: `Unlock a Mega-Generator autobuyer.`,
  },{
    name: `First Weakness`,
    description: `The Multi-Generator is divided by 100, but gets uncapped exponentially increasing multiplier. This multiplier resets after Generator Expander and Refiner.`,
    reward: `Unlock a Giga-Generator autobuyer.`,
  },{
    name: `Micro-Prestige`,
    description: `Buying any Generator erases all pervious Generators.`,
    reward: `Unlock a Tera-Generator autobuyer.`,
  },{
    name: `Less Synergism`,
    description: `The multiplier per order of magnitudes (OoMs) of each generator is reduced.`,
    reward: `Unlock a Peta-Generator autobuyer.`,
  },{
    name: `Factory`,
    description: `Upgrading each Generator costs the Generator 2 tiers below it instead of points. The Generator costs are modified.`,
    reward: `Unlock an Exa-Generator autobuyer.`,
  },{
    name: `Semi-Linear`,
    description: `The multiplier per generator is reduced to ×1. This increases by +0.2 per Generator Expander, to a maximum of ×2, and is unaffected by any upgrades.`,
    reward: `Unlock a Zetta-Generator autobuyer.`,
  },{
    name: `Generator Limiter`,
    description: `Generator Expander provides no multiplier.`,
    reward: `Unlock a Yotta-Generator autobuyer.`,
  },{
    name: `Price Inflation`,
    description: `Buying any Generator increases cost of all other bought-first Generators by ×10.`,
    reward: `Unlock a Ronna-Generator autobuyer.`,
  },{
    name: `Antimatter Dimensions`,
    description: `There are only 8 Generators. Generator Expander and Refiner are modified.`,
    reward: `Unlock a Quetta-Generator autobuyer.`,
  },{
    name: `Less Idle`,
    description: `Generators are decreased by a time drastically, but buying any Generator resets this time.`,
    reward: `Unlock a Generator Expander autobuyer.`,
  },{
    name: `Classic`,
    description: `The multiplier per generator is reduced to ×1, and Generator Expander provides no multiplier, but the multiplier per order of magnitudes (OoMs) of each generator is increased significantly.`,
    reward: `Unlock a Generator Refiner autobuyer.`,
  },{
    name: `Generator-Skip`,
    description: `Each Generator produces the Generator 2 tiers below it instead of 1. The 1st and 2nd Generators produce points. The Generators are stronger sometimes.`,
    reward: `Unlock an Infinity autobuyer.`,
  },
]

export function inNormalChallenge(id: number) { return inInfinityChallenge(1) && id !== 8 && id !== 12 || player.challenges.normal.current === id };
export function isNCBeaten(id: number) { return (player.challenges.normal.completedBits & (1 << id)) !== 0 };
export function getNCCompletions() {
  let n = 0
  for (let m = (player.challenges.normal.completedBits | 1) ^ 1; m !== 0; m >>= 1) n += m & 1;
  return n
}
export function getTotalFastestNC() { return player.challenges.normal.fastest.reduce((a,b) => a + b, 0) }

export function startNormalChallenge(id: number) {
  if (!player.first.infinity || inNormalChallenge(id)) return;

  player.challenges.normal.current = id;
  INFINITY.reset();

  player.tab = 0;
  player.stab[0] = 0;
};
export function completeNormalChallenge() {
  const id = player.challenges.normal.current

  if (INFINITY.reached) {
    if (id > 0) player.challenges.normal.fastest[id-1] = Math.min(player.challenges.normal.fastest[id-1], player.infinity.time);
    player.challenges.normal.completedBits |= 1 << id;

    const no = Decimal.lte(player.expanders, REFINER.startingExpander) && Decimal.lte(player.refiner.highest, 1e100)

    if (id === 1 && Decimal.eq(player.generators[1].bought,1) && no) giveAchievement(61);
    if (no) giveAchievement(55);
    if (id === 11 && Decimal.lte(player.refiner.highest, 1e100)) giveAchievement(58);
  }

  player.challenges.normal.current = 0;
}

export function getNC10Exponent() {
  return Decimal.sqrt(player.challenges.normal.C10).div(10).add(1).pow(-1)
}
