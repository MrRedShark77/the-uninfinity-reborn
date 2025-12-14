<script setup lang="ts">
import { InfinityUpgrades, purchaseInfinityUpgrade } from '@/data/infinity';
import PrimaryButton from '../PrimaryButton.vue';
import { computed } from 'vue';
import { player, temp } from '@/main';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/formats';

const { id } = defineProps<{ id: string }>()
const UPG = InfinityUpgrades[id]

const hasEffect = 'display' in UPG
const bought = computed(() => Decimal.gte(player.infinity.upgrades[id], 'max' in UPG ? UPG.max : 1))
const cost = computed(() => 'max' in UPG ? UPG.cost(player.infinity.upgrades[id]) : UPG.cost)

</script>

<template>
  <div>
    <PrimaryButton class="g--infinity-button upgrade" :enabled="(UPG.condition?.() ?? true) && Decimal.gte(player.infinity.points,cost)" :bought="bought" @click="purchaseInfinityUpgrade(id)">
      <img src="/assets/textures/infinity.png" draggable="false">
      <div v-html="UPG.description"></div>
      <div v-if="hasEffect || !bought">
        <hr class="sub-line">
        <div v-if="hasEffect">Effect: <b>{{ UPG.display?.(temp.infinity.upgrades[id]) }}</b></div>
        <div v-if="!bought">Cost: {{ format(cost,0) }} Infinity Points</div>
      </div>
    </PrimaryButton>
    <PrimaryButton class="maxButton" v-if="'maxButton' in UPG" @click="purchaseInfinityUpgrade(id, true)">Buy Max</PrimaryButton>
  </div>
</template>

<style scoped>
.upgrade {
  font-size: 11px;
  padding: 2px;
  margin: 0px;

  width: 100%;
  height: 120px;
}
img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110px;
  transform: translate(-50%, -50%);
  opacity: .1;
}
.maxButton {
  width: 100%;
  padding: 2px;
  margin: 0px;
}
</style>
