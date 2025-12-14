<script setup lang="ts">
import InfinityUpgradeItem from './InfinityUpgradeItem.vue';

const INF_UPGS_ORDER = [
  'timeMult',   'genBoost', 'refineBoost', 'infinityBonus', 'expanderBoost',
  'genMult1',   'genMult2', 'genMult3',    'genMult4',      'genMult5',
  'passiveGen', 'start1',   'start2',      'start3',        'start4',
]
</script>

<template>
  <div>
    <div class="main-infinity-upgrades">
      <InfinityUpgradeItem v-for="x in INF_UPGS_ORDER" :key="x" :id="x" />
      <InfinityUpgradeItem class="ipMult" :id="'ipMult'" />
    </div>
  </div>
</template>

<style scoped>
.main-infinity-upgrades {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(5, 200px);
  grid-auto-rows: minmax(120px, auto);
  gap: 5px;
}

.ipMult {
  grid-column: 3 / 4;
  grid-row: 4 / 5;
}
</style>
