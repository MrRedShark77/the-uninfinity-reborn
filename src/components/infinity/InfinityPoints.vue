<script setup lang="ts">
import { player, temp } from '@/main';
import PrimaryButton from '../PrimaryButton.vue';
import Decimal from 'break_eternity.js';
import { DC } from '@/utils/decimal';
import { format, formatGain } from '@/utils/formats';
import { INFINITY } from '@/data/infinity';
import { INF_CHALLENGES, inInfinityChallenge } from '@/data/challenges/infinity-challenges';
import { inNormalChallenge } from '@/data/challenges/normal-challenges';
import { CURRENCIES } from '@/data/currencies';

const C = CURRENCIES.infinity
</script>

<template>
  <div class="g--topbar-div">
    <div v-if="player.first.infinity">You have <b class="g--infinity">{{ format(player.infinity.points,0) }}</b> <span v-if="Decimal.gt(C.passive, 0)">{{ formatGain(player.infinity.points, Decimal.mul(temp.currencies.infinity, C.passive)) }}</span> Infinity Points</div>
    <PrimaryButton class="g--infinity-button" v-if="player.infinity.reached || player.first.infinity" :enabled="INFINITY.reached" @click="INFINITY.crunch()">
      <div v-if="INFINITY.reached">
        <div v-if="inNormalChallenge(0) && inInfinityChallenge(0) && player.infinity.break">
          Big Crunch for <b style="color: white;">{{ format(temp.currencies.infinity,0) }}</b> IP<br>
          Current: <b style="color: white;">{{ format(Decimal.div(temp.currencies.infinity,player.infinity.time).mul(60).round(),0) }} IP/min</b>
        </div>
        <div v-else style="font-size: 24px;">Big Crunch</div>
      </div>
      <div v-else>Reach <b>{{ format(inInfinityChallenge(0) ? DC.DE308 : INF_CHALLENGES[player.challenges.infinity.current].goal) }}</b> points</div>
    </PrimaryButton>
  </div>
</template>

<style scoped>
.g--infinity-button {
  color: #ff9400;
  grid-row: 2 / 3;
}
</style>
