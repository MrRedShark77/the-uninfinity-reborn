<script setup lang="ts">
import { InfinityEnergy } from '@/data/infinity-energy';
import PrimaryButton from '../PrimaryButton.vue';
import { computed } from 'vue';
import { player } from '@/main';
import { CURRENCIES } from '@/data/currencies';
import { format } from '@/utils/formats';
import Decimal from 'break_eternity.js';

const { n } = defineProps<{'n' : number}>()

const U = InfinityEnergy.upgrades[n]
const level = computed(() => player.infinity.energy.upgrades[n])
const effect = computed(() => {
  const E = U.effect, D = U.display, L = level.value
  return D(E(L)) + " ➜ " + D(E(Decimal.add(L, 1)))
})
const C = CURRENCIES[U.currency]
</script>

<template>
  <PrimaryButton class="g--energy-button" :enabled="Decimal.gte(C.amount, U.cost(level))" @click="InfinityEnergy.purchaseUpgrade(n)">
    {{ U.description }}
    <hr class="sub-line">
    Effect: <b>{{ effect }}</b>
    <br>
    Cost: {{ format(U.cost(level)) }} {{ C.name }}
  </PrimaryButton>
</template>

<style scoped>
button {
  position: relative;
  font-size: 11px;
  margin: 0px;
  padding: 2px;
}
</style>
