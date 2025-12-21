<script setup lang="ts">
import EternityUpgradeItem from './EternityUpgradeItem.vue';

const ETER_UPGS_ORDER = [
  'infGenMult1','infGenMult2','infGenMult3','infGenMult4',
  'timeGenMult1','timeGenMult2','timeGenMult3','timeGenMult4',
]
</script>

<template>
  <div>
    <div class="main-eternity-upgrades">
      <EternityUpgradeItem v-for="x in ETER_UPGS_ORDER" :key="x" :id="x" />
      <EternityUpgradeItem class="epMult" :id="'epMult'" />
    </div>
  </div>
</template>

<style scoped>
.main-eternity-upgrades {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, 200px);
  grid-auto-rows: minmax(120px, auto);
  gap: 5px;
}

.epMult {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}
</style>
