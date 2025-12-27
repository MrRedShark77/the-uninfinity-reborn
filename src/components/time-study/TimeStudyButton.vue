<script setup lang="ts">
import { canAffordTimeStudy, hasTimeStudy, purchaseTimeStudy, TimeStudies, TS_type, type TimeStudy } from '@/data/timestudies';
import PrimaryButton from '../PrimaryButton.vue';
import { format } from '@/utils/formats';
import { CURRENCIES, Currency } from '@/data/currencies';
import { player } from '@/main';
import { computed } from 'vue';

const { n } = defineProps<{'n' : number}>()

const TS = TimeStudies[n] as TimeStudy, id = TS.id;

const classObject = computed(() => {
  const bought = hasTimeStudy(id)
  const c: Record<string, boolean> = {}

  if (typeof id === 'number') c['g--ts-small'] = Math.floor(id / 10) === 23;
  if (bought || canAffordTimeStudy(id)) c[`g--time-study--${TS.type}` + (bought ? '-bought' : "")] = true;

  return c
})
</script>

<template>
  <PrimaryButton :id="'time-study-'+n" class="opaque g--time-study-button g--eternity-button" @click="purchaseTimeStudy(id)" :class="classObject"
  :enabled="canAffordTimeStudy(id)" :bought="player.eternity.timestudy.purchased.includes(id)">
    <div class="g--time-study-id">{{ id }} {{ TS_type[TS.type] }}</div>
    <div v-html="TS.description"></div>
    <hr class="sub-line" />
    <div v-if="'effect' in TS && TS.effect?.[2]">Effect: <b v-html="TS.effect[2](TS.effect[0]())"></b></div>
    <div v-if="'requirement' in TS">Require: <span v-html="TS.requirement"></span></div>
    <div>Cost: {{ format(TS.cost ,0) }} {{ CURRENCIES[TS.currency! as Currency].name }}</div>
  </PrimaryButton>
</template>

<style>
.g--time-study-button {
  position: relative;
  font-size: 11px;
}

.g--ts-small {
  width: 160px;
  font-size: 10px;
}
</style>
