<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import InfinityGeneratorItem from "./InfinityGeneratorItem.vue";
import { format, formatMult, formatPow } from "@/utils/formats";
import { player, temp } from "@/main";
import { Currency, formatCurrencyGain } from "@/data/currencies";
import { purchaseAllInfinityGenerators } from "@/data/generators/infinity-generators";
import { inEternitychallenge } from "@/data/challenges/eternity-challenges";
</script>

<template>

  <div>
    <PrimaryButton @click="purchaseAllInfinityGenerators()">Buy All [M]</PrimaryButton>

    <p>You have <span class="g--infinity">{{ format(player.infinity.power) }}</span> {{ formatCurrencyGain(Currency.InfinityPower) }} Infinity Powers, increased by <span class="g--infinity">{{ formatPow(temp.infinity.power.exp,3) }}</span> to a <span class="g--infinity">{{ formatMult(temp.infinity.power.mult) }}</span> multiplier in all generators.</p>

    <p v-if="inEternitychallenge(8)">You have <b>{{ player.challenges.eternity.C8[0] }}</b> purchases left.</p>

    <div class="generators">
      <InfinityGeneratorItem v-for="x in 10" :key="x" :n="x"/>
    </div>
  </div>
</template>

<style scoped>
.expander {
  grid-column: 3 / 4;
  grid-row: 3 / 4;
}
.refiner {
  grid-column: 4 / 5;
  grid-row: 3 / 4;
}

.g--infinity {
  font-size: 20px;
}
</style>
