<script setup lang="ts">

import { GENERATOR } from '@/data/generators/normal-generators';
import { format, formatGain, formatMult } from '@/utils/formats';
import Decimal from 'break_eternity.js';
import { computed } from 'vue';
import PrimaryButton from '@/components/PrimaryButton.vue';

const { n } = defineProps<{'n' : number}>()

const GEN = GENERATOR(n);

const gain = computed(() => {
  const g = GEN.temp.gain;
  return Decimal.gt(g,0) ? formatGain(GEN.amount,g) : ""
})
const cost = computed(() => GEN.cost)

</script>

<template>
  <div class="g--generator" v-if="GEN.unlocked">
    <PrimaryButton class="g--generator-button top" :enabled="Decimal.gte(GEN.resource,cost)" @click="GEN.purchase(false)">
      <img class="image" :src="`src/assets/textures/generator-${n}.png`" draggable="false">
      <div class="g--gen-top">
        <div><b>{{ GEN.name }}</b> ({{ format(GEN.bought,0) }})</div>
        <div class="g--gen-L">Multiplier:</div><div class="g--gen-R">{{ formatMult(GEN.temp.mult) }}</div>
        <div class="g--gen-R">({{ formatMult(GEN.base) }} / {{ format(GEN.temp.oom_inc) }} OoMs)</div>
        <div class="g--gen-L">Amount:</div><div class="g--gen-R">{{ format(GEN.amount,0) }}</div>
        <div class="g--gen-R">{{ gain }}</div>
      </div>
      <div class="g--gen-bottom">Cost: {{ format(cost,0) }} {{ GEN.resourceName }}</div>
    </PrimaryButton>
    <PrimaryButton class="g--generator-button bottom" @click="GEN.purchase(true)">Buy Max</PrimaryButton>
  </div>
</template>

<style scoped>
.top {
  border-radius: 5px 5px 0px 0px;
  border-bottom: none;
}
.bottom {
  border-radius: 0px 0px 5px 5px;
}
.image {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 160px;
  transform: translateX(-50%);
  opacity: .1;
}
</style>
