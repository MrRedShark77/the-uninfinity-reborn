<script setup lang="ts">
import { computed } from 'vue';
import InfinityPoints from './components/infinity/InfinityPoints.vue';
import TabButtons from './components/TabButtons.vue';
import { Currency, formatCurrencyGain } from './data/currencies';
import { TABS } from './data/tabs';
import { load, player, temp } from './main';
import { format, formatTime } from './utils/formats';
import { inNormalChallenge, NORMAL_CHALLENGES } from './data/challenges/normal-challenges';
import { inInfinityChallenge } from './data/challenges/infinity-challenges';
import DialogMain from './components/dialog/DialogMain.vue';
import QuoteItem from './components/QuoteItem.vue';
import PrimaryButton from './components/PrimaryButton.vue';
import { INFINITY } from './data/infinity';
import EternityPoints from './components/eternity/EternityPoints.vue';
import NewsTicker from './components/NewsTicker.vue';
import { inEternitychallenge } from './data/challenges/eternity-challenges';
import { ETERNITY } from './data/eternity';

const CT = computed(() => {
  if (player.infinity.reached) return;

  const h = [];

  if (!inNormalChallenge(0)) h.push(`"${NORMAL_CHALLENGES[player.challenges.normal.current].name}" Challenge`);
  if (!inInfinityChallenge(0)) h.push(`IC${player.challenges.infinity.current}`);
  if (!inEternitychallenge(0)) h.push(`EC${player.challenges.eternity.current}`);

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
  else if (!inEternitychallenge(0)) {
    player.challenges.eternity.current = 0;
    ETERNITY.reset()
  }
}

load()
</script>

<template>
  <NewsTicker />
  <div>
    <div class="topbar">
      <div>
        <EternityPoints />
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

  <div id="session-time">
    Session Time: {{ formatTime(player.realTimePlayed) }}<br>
    Game Time: {{ formatTime(player.timePlayed) }}
  </div>

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
