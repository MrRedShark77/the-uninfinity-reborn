<script setup lang="ts">
import PrimaryButton from '@/components/PrimaryButton.vue';
import { REFINER } from '@/data/generators/normal-generators';
import { player, temp } from '@/main';
import { format, formatMult } from '@/utils/formats';
import Decimal from 'break_eternity.js';
import { computed } from 'vue';

const b = computed(() => Decimal.div(REFINER.calc_boost(player.points), temp.refiner_boost).max(1))
</script>

<template>
  <PrimaryButton v-if="REFINER.unlocked" :enabled="Decimal.gt(player.points, player.refiner.highest)" @click="() => REFINER.refine()">
    <img class="image" src="/assets/textures/star.png" draggable="false">
    <div class="g--gen-top">
      <div><b>Generator Refiner</b></div>
    </div>
    <div>Resets everything before this point for a <b>{{ formatMult(b) }}</b> boost.<hr class="sub-line">Total boost: <b>{{ formatMult(temp.refiner_boost) }}</b> to Generators</div>
    <div class="g--gen-bottom">Require: {{ format(player.refiner.highest) }} Points</div>
  </PrimaryButton>
</template>

<style scoped>
.image {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 160px;
  transform: translateX(-50%);
  opacity: .1;
}
</style>
