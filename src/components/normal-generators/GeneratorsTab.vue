<script setup lang="ts">
import { purchaseAllGenerators } from "@/data/generators/normal-generators";
import ExpanderReset from "@/components/normal-generators/ExpanderReset.vue";
import GeneratorItem from "./GeneratorItem.vue"
import PrimaryButton from "@/components/PrimaryButton.vue";
import RefinerReset from "@/components/normal-generators/RefinerReset.vue";
import { formatMult, formatPow } from "@/utils/formats";
import { player } from "@/main";
import { getNC10Exponent, inNormalChallenge } from "@/data/challenges/normal-challenges";
import { inInfinityChallenge } from "@/data/challenges/infinity-challenges";
</script>

<template>
  <div>
    <PrimaryButton @click="purchaseAllGenerators()">Buy All [M]</PrimaryButton>

    <p v-if="inNormalChallenge(1)">Production: {{ formatMult(player.challenges.normal.C1) }}</p>
    <p v-if="inNormalChallenge(2)">Multi-Generator: {{ formatMult(player.challenges.normal.C2) }}</p>
    <p v-if="inNormalChallenge(10) || inInfinityChallenge(6)">Production: {{ formatPow(getNC10Exponent(),3) }}</p>

    <div class="generators">
      <GeneratorItem v-for="x in 10" :key="x" :n="x"/>
      <ExpanderReset class="g--expander expander"/>
      <RefinerReset class="g--expander refiner"/>
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
</style>
