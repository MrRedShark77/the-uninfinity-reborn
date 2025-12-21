<script setup lang="ts">

import PrimaryButton from '../PrimaryButton.vue';
import { player } from '@/main';
import { INF_GENERATOR } from '@/data/generators/infinity-generators';

const { n } = defineProps<{'n' : number}>()

const GEN = INF_GENERATOR(n);
const A = player.infinity.autoGenerators[n];

</script>

<template>
  <div v-if="GEN.autoUnlocked" class="auto-generator-item">
    <div>{{ GEN.name }}</div>
    <PrimaryButton @click="A.enabled = !A.enabled">{{ A.enabled ? "ON" : "OFF" }}</PrimaryButton>
    <PrimaryButton @click="A.bulk = !A.bulk">{{ A.bulk ? "ALL" : "1" }}</PrimaryButton>
  </div>
</template>

<style scoped>
.auto-generator-item {
  display: grid;
  grid-template-columns: 1fr 30px 30px;
  height: 30px;
  align-items: center;
}
.auto-generator-item > div {
  text-align: left;
}
.auto-generator-item > button {
  height: 30px;
  padding: 0px;
  margin: 0px;
}
</style>
