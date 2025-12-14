<script setup lang='ts'>
import { player } from '@/main';
import { DC } from '@/utils/decimal';
import { format } from '@/utils/formats';
import PrimaryButton from '../PrimaryButton.vue';
import InfinityUpgradeItem from './InfinityUpgradeItem.vue';
import { INFINITY } from '@/data/infinity';

const INF_UPGS_ORDER = [
  'currentMult',   'betterGenMult', 'currentOomMult',
  'chalMult',      'timesGen',      'currentMult2',
  'expanderBulk',  'refineBoost2',  'OomMultBoost',
  'slowerOomMult', 'slowerGenCost', 'ipGen',
]
</script>

<template>
  <div v-if="player.automations.infinity.level >= 14">
    <p>Breaking Infinity allows you to get past {{ format(DC.DE308) }} points, but Generators will scale drastically faster after this point.</p>
    <PrimaryButton class="g--infinity-button break-infinity" :bought="player.infinity.break" @click="INFINITY.break()">{{ player.infinity.break ? "Infinity is broken" : "Break Infinity" }}</PrimaryButton>
    <div class="break-infinity-upgrades">
      <InfinityUpgradeItem v-for="x in INF_UPGS_ORDER" :key="x" :id="x" />
    </div>
  </div><div v-else>
    Make Infinity Autobuyer's interval instant to unlock this feature.
  </div>
</template>

<style scoped>
.break-infinity {
  width: 200px;
  height: 120px;
  font-family: 24px;
}

.break-infinity-upgrades {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(3, 200px);
  grid-auto-rows: minmax(120px, auto);
  gap: 5px;
  margin-top: 5px;
}
</style>
