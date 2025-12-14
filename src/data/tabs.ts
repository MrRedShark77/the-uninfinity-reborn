import AutomationsTab from "@/components/automations/AutomationsTab.vue";
import ChallengesTab from "@/components/challenges/ChallengesTab.vue";
import GeneratorsTab from "@/components/normal-generators/GeneratorsTab.vue";
import BreakInfinityTab from "@/components/infinity/BreakInfinityTab.vue";
import InfinityUpgradesTab from "@/components/infinity/InfinityUpgradesTab.vue";
import { player, state } from "@/main";
import type { Component, StyleValue } from "vue";
import InfinityGeneratorsTab from "@/components/infinity-generators/InfinityGeneratorsTab.vue";
import InfinityChallengesTab from "@/components/challenges/InfinityChallengesTab.vue";
import InfinityEnergyTab from "@/components/infinity/InfinityEnergyTab.vue";
import OptionsTab from "@/components/OptionsTab.vue";
import AchievementsTab from "@/components/AchievementsTab.vue";
import InfinityPreStab from "@/components/infinity/InfinityPreStab.vue";
import FluxTab from "@/components/FluxTab.vue";

export const TABS: {
  name: string;
  style?: StyleValue;
  class?: Record<string, boolean>;
  condition?: () => boolean;
  pre_stab?: Component;
  stabs: [Component, string?, (() => boolean)?][];
}[] = [
  {
    name: "Generators",

    stabs: [
      [GeneratorsTab, "Normal Generators"],
      [InfinityGeneratorsTab, "Infinity Generators", () => player.infinity.break],
    ],
  },{
    name: 'Time Circuits',

    class: {
      'g--flux-button': true,
    },
    style: {
      get color() { return `hsl(${60 * (1 + Math.sin(state.time))}, 100%, 75%)` }
    },

    stabs: [
      [FluxTab]
    ],
  },{
    name: 'Options',

    stabs: [
      [OptionsTab]
    ],
  },{
    name: "Achievements",

    stabs: [
      [AchievementsTab],
    ],
  },{
    condition: () => player.first.infinity,
    name: "Automations",

    stabs: [
      [AutomationsTab],
    ],
  },{
    condition: () => player.first.infinity,
    name: "Challenges",

    stabs: [
      [ChallengesTab, "Normal Challenges"],
      [InfinityChallengesTab, "Infinity Challenges", () => player.infinity.break],
    ],
  },{
    condition: () => player.first.infinity,
    name: "Infinity",

    class: {
      'g--infinity-button': true,
    },
    style: {
      color: "#ff9400",
    },

    pre_stab: InfinityPreStab,
    stabs: [
      [InfinityUpgradesTab, "Infinity Upgrades"],
      [BreakInfinityTab, "Break Infinity"],
      [InfinityEnergyTab, "Infinity Energy"],
    ],
  },
]

export function checkTab() {
  player.stab[player.tab] = Math.min(player.stab[player.tab] ??= 0, TABS[player.tab].stabs.length - 1)
}

export function setTab(i: number, stab: boolean = false) {
  if (stab) player.stab[player.tab] = i;
  else player.tab = i;

  checkTab()
}
