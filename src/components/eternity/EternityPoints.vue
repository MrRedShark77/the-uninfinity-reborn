<script setup lang="ts">
import { player, temp } from '@/main';
import PrimaryButton from '../PrimaryButton.vue';
import Decimal from 'break_eternity.js';
import { DC } from '@/utils/decimal';
import { format } from '@/utils/formats';
import { ETERNITY } from '@/data/eternity';
import { Quote } from '@/utils/quote';
import { INF_GENERATOR_REQUIREMENTS } from '@/data/generators/infinity-generators';
import { computed } from 'vue';
import { getECGoal, inEternitychallenge } from '@/data/challenges/eternity-challenges';

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
  <div class="g--topbar-div" v-if="player.first.eternity || player.infinity.break">
    <div v-if="player.first.eternity">You have <b class="g--eternity">{{ format(player.eternity.points,0) }}</b> Eternity Points</div>
    <template v-if="player.infinity.generatorsUnlocked < 10">
      <PrimaryButton class="g--infinity-button" :enabled="reached" @click="unlock">
        <div v-if="reached">
          Unlock a new Generator
        </div>
        <div v-else>
          Reach <b>{{ format(INF_GENERATOR_REQUIREMENTS[player.infinity.generatorsUnlocked][0]) }}</b> points and <b>{{ format(INF_GENERATOR_REQUIREMENTS[player.infinity.generatorsUnlocked][1]) }}</b> infinity points to unlock a new generator.
        </div>
      </PrimaryButton>
    </template><template v-else>
      <PrimaryButton class="g--eternity-button" :enabled="ETERNITY.reached" @click="ETERNITY.eternity()">
        <div v-if="ETERNITY.reached">
          <div v-if="inEternitychallenge(0) && player.first.eternity">
            Eternity for <b style="color: white;">{{ format(temp.currencies.eternity,0) }}</b> EP<br>
            Current: <b style="color: white;">{{ format(Decimal.div(temp.currencies.eternity,player.eternity.time).mul(60).round(),0) }} EP/min</b>
          </div>
          <div v-else-if="inEternitychallenge(0)">
            Other times await...<br>I need to become Eternal
          </div>
          <div v-else>
            Other challenges await...<br>I need to become Eternal
          </div>
        </div>
        <div v-else>Reach <b>{{ format(inEternitychallenge(0) ? DC.DE308 : getECGoal(player.challenges.eternity.current)) }}</b> Infinity Points</div>
      </PrimaryButton>
    </template>
  </div>
</template>

<style scoped>
.g--infinity-button {
  color: #ff9400;
  grid-row: 2 / 3;
}

.g--eternity-button {
  color: #b341e0;
  grid-row: 2 / 3;
}
</style>
