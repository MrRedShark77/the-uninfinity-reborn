<script setup lang="ts">
import { getNCCompletions } from '@/data/challenges/normal-challenges';
import ChallengeItem from './ChallengeItem.vue';
import { formatMult } from '@/utils/formats';


</script>

<template>
  <div>
    <div>You have completed <h3 class="g--points">{{ getNCCompletions() }} / 12</h3> normal challenges, which increases infinity points gained by <h4 class="g--infinity">{{ formatMult(1+Math.floor(getNCCompletions()/4),0) }}</h4> (+100% per 4 challenges completed).</div>
    <div>
      While in any normal challenge, the last 4 infinity upgrades don't work and cannot be purchased.
    </div>
    <div class="table-center">
      <ChallengeItem v-for="x in 12" :key="x" :ID="x" />
    </div>
  </div>
</template>

<style scoped>
.table-center {
  margin-top: 30px;
  gap: 20px 10px;
}
</style>
