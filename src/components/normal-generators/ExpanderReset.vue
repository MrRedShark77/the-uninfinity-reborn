<script setup lang="ts">
import PrimaryButton from '@/components/PrimaryButton.vue';
import { EXPANDER, GENERATOR } from '@/data/generators/normal-generators';
import { temp } from '@/main';
import { format, formatMult } from '@/utils/formats';
import Decimal from 'break_eternity.js';
import { computed } from 'vue';

const require = computed(() => {
  const [n, a] = EXPANDER.requirement, G = GENERATOR(n);

  return format(a,0) + " " + G.name
})

const canExpand = computed(() => {
  const [n, a] = EXPANDER.requirement, G = GENERATOR(n);

  return Decimal.gte(G.bought, a)
})
</script>

<template>
  <div :class="{[EXPANDER.canQuickReset ? 'g--generator' : 'full']: true}">
    <PrimaryButton :enabled="canExpand" @click="() => EXPANDER.expand()">
      <img class="image" src="@/assets/textures/expand.png" draggable="false">
      <div class="g--gen-top">
        <div><b>Generator Expanders</b> ({{ format(EXPANDER.amount,0) }})</div>
      </div>
      <div>Resets the game for a new Generator. Each generator gains a <b>{{ formatMult(temp.expander_power) }}</b> boost to its multiplier per expander.</div>
      <div class="g--gen-bottom">Require: {{ require }}</div>
    </PrimaryButton>
    <PrimaryButton v-if="EXPANDER.canQuickReset" @click="EXPANDER.quick()">Quick reset for NO boosts</PrimaryButton>
  </div>
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

.full {
  display: grid;
  grid-template-rows: 1fr;
}
</style>
