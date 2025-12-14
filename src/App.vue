<script setup lang="ts">
import { computed } from 'vue';
import InfinityPoints from './components/infinity/InfinityPoints.vue';
import TabButtons from './components/TabButtons.vue';
import { Currency, formatCurrencyGain } from './data/currencies';
import { TABS } from './data/tabs';
import { load, player, temp } from './main';
import { format } from './utils/formats';
import { inNormalChallenge, NORMAL_CHALLENGES } from './data/challenges/normal-challenges';
import InfinityGeneratorUnlock from './components/infinity-generators/InfinityGeneratorUnlock.vue';
import { inInfinityChallenge } from './data/challenges/infinity-challenges';
import DialogMain from './components/dialog/DialogMain.vue';
import QuoteItem from './components/QuoteItem.vue';
import PrimaryButton from './components/PrimaryButton.vue';
import { INFINITY } from './data/infinity';

const CT = computed(() => {
  if (player.infinity.reached) return;

  const h = [];

  if (!inNormalChallenge(0)) h.push(`"${NORMAL_CHALLENGES[player.challenges.normal.current].name}" Challenge`);
  if (!inInfinityChallenge(0)) h.push(`IC${player.challenges.infinity.current}`);

  return "You are currently in " + (h.length === 0 ? "the Normal Universe" : h.join(", "))
})

function exitChallenge() {
  if (!inNormalChallenge(0)) {
    player.challenges.normal.current = 0;
    INFINITY.reset()
  }
  else if (!inInfinityChallenge(0)) {
    player.challenges.infinity.current = 0;
    INFINITY.reset()
  }
}

load()
</script>

<template>
  <div>
    <div class="topbar">
      <div>
        <InfinityGeneratorUnlock v-if="player.infinity.break && player.infinity.generatorsUnlocked < 10" />
      </div>
      <div>
        You have <h3 class="g--points">{{ format(player.points,0) }}</h3> {{ formatCurrencyGain(Currency.Points) }} points.
      </div>
      <div>
        <InfinityPoints />
      </div>
    </div>
    <div class="table-center" style="align-items: center; gap: 5px; min-height: 32px;">
      <div style="font-weight: bold;" v-html="CT"></div>
      <PrimaryButton v-if="!temp.no_challenges" @click="exitChallenge"> Exit Challenge </PrimaryButton>
    </div>
  </div>
  <hr class="line">
  <TabButtons/>
  <component :is="TABS[player.tab].stabs[player.stab[player.tab]][0]"/>
  <div style="height: 100px;"></div>

  <DialogMain />
  <QuoteItem />
</template>

<style scoped>
.topbar {
  min-height: 130px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 10px;
}
.topbar > div {
  justify-self: center;
}
</style>
