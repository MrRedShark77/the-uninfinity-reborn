<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
import { format } from '@/utils/formats';
import { player } from '@/main';
import { EternityChallenges, getECCompletions, getECGoal, inEternitychallenge, isECUnlocked, startEternityChallenge } from '@/data/challenges/eternity-challenges';
import { computed } from 'vue';
import { hasTimeStudy } from '@/data/timestudies';

const { ID } = defineProps<{ ID: number }>();
const CHAL = EternityChallenges[ID];

const effect = computed(() => {
  const C = player.challenges.eternity.completed[ID]
  const [e1,e2,e3] = CHAL.effect

  return `(${(C > 0 ? e3(e1(C),C) : e3(e2,C)) + (C < 5 ? " ➜ " + e3(e1(C+1),C+1) : "")})`
})

const status = computed(() => {
  const unl = hasTimeStudy("EC"+ID)
  return inEternitychallenge(ID) ? "Running" : getECCompletions(ID) < 5 ? unl ? "Start" : "Locked" : unl ? "Re-run" : "Completed"
})
</script>

<template>
  <div class="g--challenge eternity" v-if="isECUnlocked(ID)">
    <div class="g--challenge-header">EC{{ ID }} ({{ player.challenges.eternity.completed[ID] }}/5)</div>
    <div v-html="CHAL.description"></div>
    <hr class="sub-line"/>
    Reward: {{ CHAL.reward }} <b v-html="effect"></b>
    <div class="g--challenge-bottom">
      <!-- <div v-if="isICBeaten(ID)">Fastest: {{ formatTime(player.challenges.infinity.fastest[ID-1]) }}</div> -->
      <PrimaryButton style="min-width: 200px;" @click="startEternityChallenge(ID)"
      :enabled="hasTimeStudy('EC'+ID) && !inEternitychallenge(ID)"
      :bought="!hasTimeStudy('EC'+ID) && getECCompletions(ID) === 5">{{ status }}</PrimaryButton>
      <div>Goal: {{ format(getECGoal(ID)) }} IP</div>
    </div>
  </div>
</template>

<style scoped>

</style>
