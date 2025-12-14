<script setup lang="ts">
import { inNormalChallenge, isNCBeaten, NORMAL_CHALLENGES, startNormalChallenge } from '@/data/challenges/normal-challenges';
import PrimaryButton from '../PrimaryButton.vue';
import { formatTime } from '@/utils/formats';
import { player } from '@/main';

const { ID } = defineProps<{ ID: number }>();
const CHAL = NORMAL_CHALLENGES[ID];
</script>

<template>
  <div class="g--challenge">
    <div class="g--challenge-header">C{{ ID }}: {{ CHAL.name }}</div>
    {{ CHAL.description }}
    <hr class="sub-line"/>
    Reward: {{ CHAL.reward }}
    <div class="g--challenge-bottom">
      <div v-if="isNCBeaten(ID)">Fastest: {{ formatTime(player.challenges.normal.fastest[ID-1]) }}</div>
      <PrimaryButton style="min-width: 200px;" @click="startNormalChallenge(ID)" :enabled="!inNormalChallenge(ID)" :bought="isNCBeaten(ID)">{{ inNormalChallenge(ID) ? "Running" : isNCBeaten(ID) ? "Completed" : "Start" }}</PrimaryButton>
    </div>
  </div>
</template>

<style scoped>

</style>
