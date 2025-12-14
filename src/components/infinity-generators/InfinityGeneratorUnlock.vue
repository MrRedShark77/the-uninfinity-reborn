<script setup lang="ts">
import { player } from '@/main';
import PrimaryButton from '../PrimaryButton.vue';
import Decimal from 'break_eternity.js';
import { computed } from 'vue';
import { format } from '@/utils/formats';
import { INF_GENERATOR_REQUIREMENTS } from '@/data/generators/infinity-generators';
import { Quote } from '@/utils/quote';

const reached = computed(() => {
  const U = INF_GENERATOR_REQUIREMENTS[player.infinity.generatorsUnlocked]

  return Decimal.gte(player.points, U[0]) && Decimal.gte(player.infinity.points, U[1])
})

const unlock = () => {
  if (reached.value) {
    Quote.addFromKeys('infinity_gen')
    player.infinity.generatorsUnlocked++;
  }
}
</script>

<template>
  <div class="g--topbar-div">
    <PrimaryButton class="g--infinity-button" :enabled="reached" @click="unlock">
      <div v-if="reached">
        Unlock a new Generator
      </div>
      <div v-else>
        Reach <b>{{ format(INF_GENERATOR_REQUIREMENTS[player.infinity.generatorsUnlocked][0]) }}</b> points and <b>{{ format(INF_GENERATOR_REQUIREMENTS[player.infinity.generatorsUnlocked][1]) }}</b> infinity points to unlock a new generator.
      </div>
    </PrimaryButton>
  </div>
</template>

<style scoped>
.g--infinity-button {
  color: #ff9400;
  grid-row: 2 / 3;
}
</style>
