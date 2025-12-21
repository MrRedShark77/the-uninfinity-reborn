<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
import { computed } from 'vue';
import { player, temp } from '@/main';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/formats';
import { EternityUpgrades, purchaseEternityUpgrade } from '@/data/eternity';

const { id } = defineProps<{ id: string }>()
const UPG = EternityUpgrades[id]

const hasEffect = 'display' in UPG
const bought = computed(() => Decimal.gte(player.eternity.upgrades[id], 'max' in UPG ? UPG.max : 1))
const cost = computed(() => 'max' in UPG ? UPG.cost(player.eternity.upgrades[id]) : UPG.cost)

</script>

<template>
  <div>
    <PrimaryButton class="g--eternity-button upgrade" :enabled="(UPG.condition?.() ?? true) && Decimal.gte(player.eternity.points,cost)" :bought="bought" @click="purchaseEternityUpgrade(id)">
      <img src="/assets/textures/eternity.png" draggable="false">
      <div v-html="UPG.description"></div>
      <div v-if="hasEffect || !bought">
        <hr class="sub-line">
        <div v-if="hasEffect">Effect: <b>{{ UPG.display?.(temp.eternity.upgrades[id]) }}</b></div>
        <div v-if="!bought">Cost: {{ format(cost,0) }} Eternity Points</div>
      </div>
    </PrimaryButton>
    <PrimaryButton class="maxButton" v-if="'maxButton' in UPG" @click="purchaseEternityUpgrade(id, true)">Buy Max</PrimaryButton>
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
