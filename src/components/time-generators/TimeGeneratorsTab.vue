<script setup lang="ts">
import PrimaryButton from "@/components/PrimaryButton.vue";
import { format, formatPlus } from "@/utils/formats";
import { player, temp } from "@/main";
import { Currency, formatCurrencyGain } from "@/data/currencies";
import TimeGeneratorItem from "./TimeGeneratorItem.vue";
import { purchaseAllTimeGenerators } from "@/data/generators/time-generators";
</script>

<template>
  <div>
    <PrimaryButton @click="purchaseAllTimeGenerators()">Buy All [M]</PrimaryButton>

    <p>You have <span class="g--eternity">{{ format(player.eternity.shards) }}</span> {{ formatCurrencyGain(Currency.TimeShards) }} Time Shards, translated to a <span class="g--eternity">{{ formatPlus(temp.eternity.shards,3) }}</span> effective OoMs in normal generators (not affected by a slowdown).</p>

    <div class="generators">
      <TimeGeneratorItem v-for="x in 10" :key="x" :n="x"/>
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

.g--eternity {
  font-size: 20px;
}
</style>
