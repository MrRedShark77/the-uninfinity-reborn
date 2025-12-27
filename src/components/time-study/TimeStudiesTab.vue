<script setup lang="ts">
import { TimeStudies, TimeStudiesOrder, TimeStudyBranches } from '@/data/timestudies';
import TimeStudyButton from './TimeStudyButton.vue';
import TimeStudyLine from './TimeStudyLine.vue';
import TimeTheorems from './TimeTheorems.vue';
import { player } from '@/main';
import PrimaryButton from '../PrimaryButton.vue';
</script>

<template>
  <div class="table-center">
    <PrimaryButton @click="player.eternity.timestudy.respec = !player.eternity.timestudy.respec">Respec Time Studies on next Eternity: <b v-if="player.eternity.timestudy.respec" style="color: lime;">ON</b><b v-else style="color: red;">OFF</b></PrimaryButton>
  </div>
  <div class="g--tree-studies-div">
    <svg id="g--tree-studies-svg">
      <TimeStudyLine v-for="(b,i) in TimeStudyBranches()" :key="'ts-line'+i" :n="b" />
    </svg>
    <div v-for="(x,i) in TimeStudiesOrder()" class="g--tree-studies-row" :key="'ts-row'+i">
      <template v-for="y in x" :key="'ts'+y">
        <TimeStudyButton v-if="TimeStudies[y].type !== 'invisible' && TimeStudies[y].condition!()" :n="y"/>
        <div class="g--tree-study-block" v-else></div>
      </template>
    </div>
  </div>
  <TimeTheorems />
</template>

<style>
.g--tree-studies-div {
  position: relative;
  margin-bottom: 100px;
}
.g--tree-studies-row {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  gap: 15px;
}
#g--tree-studies-svg {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
