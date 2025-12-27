<script setup lang="ts">
import { player } from '@/main';
import PrimaryButton from '../PrimaryButton.vue';
import TimeStudyPreset from './TimeStudyPreset.vue';
import { newTSPreset } from '@/data/timestudies';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { config } = defineProps<{ config: Record<string, unknown> }>()
</script>

<template>
  <div id="time-study-presets">
    <div id="time-study-presets-content">
      <TimeStudyPreset v-for="i in player.eternity.timestudy.presets.length" :index="i-1" :key="'tsp-'+i" />
    </div><div>
      <hr class="sub-line">
      <div id="time-study-preset-buttons">
        <PrimaryButton @click="newTSPreset()">New preset</PrimaryButton>
        <PrimaryButton>Import preset</PrimaryButton>
      </div>
    </div>
  </div>
</template>

<style>
#time-study-presets {
  width: 640px;
  display: grid;
  grid-template-rows: 320px 60px;
}
#time-study-presets-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
}
#time-study-preset-buttons {
  display: grid;
  grid-template-columns: repeat(2, 120px);
  grid-template-rows: 40px;
  justify-content: center;
}
</style>
