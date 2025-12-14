<script setup lang="ts">
import { player, state } from '@/main';
import { formatMult, formatTime } from '@/utils/formats';
import PrimaryButton from './PrimaryButton.vue';

function controlSpeed(i: number) {
  switch (i) {
    case 0:
      state.flux_speed = 1
    break;
    case 1:
      state.flux_speed = Math.max(1, state.flux_speed / 2)
    break;
    case 2:
      if (player.flux.amount > 0) state.flux_speed *= 2;
    break;
    case 3:
      if (player.flux.amount > 10) state.flux_speed = player.flux.amount / 10 + 1;
    break;
  }
}
</script>

<template>
  <p>You have stored <span class="g--flux">{{ formatTime(player.flux.amount) }}</span> from being offline.</p>
  <p>
    Your flux speed is <span class="g--flux">{{ formatMult(state.flux_speed,0) }}</span>
    <span v-if="state.flux_speed > 1">, but it costs <span class="g--flux">{{ formatTime(state.flux_speed - 1) }}</span> of flux time</span>.
  </p>
  <div class="flux-speed-control">
    <PrimaryButton @click="controlSpeed(0)">=1</PrimaryButton>
    <PrimaryButton :enabled="state.flux_speed > 1" @click="controlSpeed(1)">/2</PrimaryButton>
    <PrimaryButton :enabled="player.flux.amount > 0" @click="controlSpeed(2)">x2</PrimaryButton>
    <PrimaryButton :enabled="player.flux.amount > 10" @click="controlSpeed(3)">10%</PrimaryButton>
  </div>
</template>

<style scoped>
.g--flux {
  font-size: 20px;
}

.flux-speed-control {
  display: grid;
  grid-template-columns: repeat(4, 75px);
  grid-auto-rows: 75px;
  justify-content: center;
}
.flux-speed-control > button {
  font-size: 18px;
}
</style>
