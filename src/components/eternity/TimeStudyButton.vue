<script setup lang="ts">
import { canAffordTimeStudy, hasTimeStudy, purchaseTimeStudy, TimeStudies, type TimeStudy } from '@/data/timestudies';
import PrimaryButton from '../PrimaryButton.vue';
import { format } from '@/utils/formats';
import { CURRENCIES, Currency } from '@/data/currencies';
import { player } from '@/main';
import { computed } from 'vue';

const { n } = defineProps<{'n' : number}>()

const TS = TimeStudies[n] as TimeStudy;

const classObject = computed(() => {
  const bought = hasTimeStudy(TS.id)

  if (!bought && !canAffordTimeStudy(TS.id)) return;

  return {
    [`g--time-study--${TS.type}` + (bought ? '-bought' : "")]: true
  }
})
</script>

<template>
  <PrimaryButton :id="'time-study-'+n" class="opaque g--time-study-button g--eternity-button" @click="purchaseTimeStudy(TS.id)" :class="classObject"
  :enabled="canAffordTimeStudy(TS.id)" :bought="player.eternity.timestudy.purchased[TS.id]">
    <div class="g--time-study-id">{{ TS.id }}</div>
    <div v-html="TS.description"></div>
    <hr class="sub-line" />
    <div v-if="'effect' in TS && TS.effect?.[2]">Effect: <b v-html="TS.effect[2](TS.effect[0]())"></b></div>
    <div>Cost: {{ format(TS.cost ,0) }} {{ CURRENCIES[TS.currency! as Currency].name }}</div>
  </PrimaryButton>
</template>

<style>
.g--time-study-button {
  position: relative;
  font-size: 11px;
}


</style>
