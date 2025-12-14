<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
import { format, formatTime } from '@/utils/formats';
import { player } from '@/main';
import { INF_CHALLENGES, inInfinityChallenge, isICBeaten, startInfinityChallenge } from '@/data/challenges/infinity-challenges';

const { ID } = defineProps<{ ID: number }>();
const CHAL = INF_CHALLENGES[ID];
</script>

<template>
  <div class="g--challenge infinity" v-if="player.challenges.infinity.unlocked >= ID">
    <div class="g--challenge-header">IC{{ ID }}</div>
    {{ CHAL.description }}
    <hr class="sub-line"/>
    Reward: {{ CHAL.reward }}
    <div class="g--challenge-bottom">
      <div v-if="isICBeaten(ID)">Fastest: {{ formatTime(player.challenges.infinity.fastest[ID-1]) }}</div>
      <PrimaryButton style="min-width: 200px;" @click="startInfinityChallenge(ID)" :enabled="!inInfinityChallenge(ID)" :bought="isICBeaten(ID)">{{ inInfinityChallenge(ID) ? "Running" : isICBeaten(ID) ? "Completed" : "Start" }}</PrimaryButton>
      <div>Goal: {{ format(CHAL.goal) }} points</div>
    </div>
  </div>
</template>

<style scoped>

</style>
