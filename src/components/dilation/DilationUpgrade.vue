<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
import { computed } from 'vue';
import { player } from '@/main';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/formats';
import { TimeDilation } from '@/data/dilation';

const { n } = defineProps<{ n: number }>()
const UPG = TimeDilation.upgrades[n]

const hasEffect = UPG.effect
const bought = computed(() => Decimal.gte(player.eternity.dilation.upgrades[n], UPG.max))
const cost = computed(() => UPG.cost(player.eternity.dilation.upgrades[n]))

const classObject = computed(() => {
  return {
    [n < 4 ? "g--rep-dilation-button" : "g--dilation-button"]: true,
  }
})
</script>

<template>
  <PrimaryButton class="upgrade" :type="'glowing'" :class="classObject" @click="TimeDilation.purchaseUpgrade(n)"
  :enabled="UPG.condition() && Decimal.gte(player.eternity.dilation.dilatedTime,cost)" :bought="bought">
    <img src="/assets/textures/dilation.png" draggable="false">
    <div v-html="UPG.description"></div>
    <div v-if="hasEffect || !bought">
      <hr class="sub-line">
      <div v-if="hasEffect?.[2]">Effect: <b>{{ hasEffect[2](hasEffect[0](player.eternity.dilation.upgrades[n])) }}</b></div>
      <div v-if="!bought">Cost: {{ format(cost,0) }} Dilated Time</div>
    </div>
  </PrimaryButton>
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
</style>
