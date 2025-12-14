<script setup lang="ts">
import { format } from '@/utils/formats';
import { player } from '@/main';
import { INF_CHALLENGES } from '@/data/challenges/infinity-challenges';
import InfinityChallengeItem from './InfinityChallengeItem.vue';


</script>

<template>
  <div>
    <div v-if="player.challenges.infinity.unlocked < 8">
      Reach <h3 class="g--points">{{ format(INF_CHALLENGES[player.challenges.infinity.unlocked+1].require) }}</h3> points to unlock a new challenge.
    </div>
    <div class="table-center">
      <InfinityChallengeItem v-for="x in 8" :key="x" :ID="x" />
    </div>
  </div>
</template>

<style scoped>
.table-center {
  margin-top: 30px;
  gap: 20px 10px;
}
</style>
