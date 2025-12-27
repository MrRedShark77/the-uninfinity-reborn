<script setup lang="ts">
import { format, formatGain, formatMult } from '@/utils/formats';
import PrimaryButton from '../PrimaryButton.vue';
import Decimal from 'break_eternity.js';
import { FPS, player, temp } from '@/main';
import { InfinityEnergy } from '@/data/infinity-energy';
import InfinityEnergyUpgrade from './InfinityEnergyUpgrade.vue';
import { inEternitychallenge } from '@/data/challenges/eternity-challenges';

const energy = player.infinity.energy

const UPGS_ORDER = [
  0, 1, 2,
  3, 4, 5,
]
</script>

<template>
  <div v-if="energy.unlocked">
    <p>You have <span class="g--energy">{{ format(energy.amount, 0) }}</span> {{ formatGain(energy.amount, InfinityEnergy.calc(energy.amount, Decimal.div(InfinityEnergy.base, FPS)).sub(energy.amount).mul(FPS)) }} Infinity Energy<sup class="g--energy">{{ format(InfinityEnergy.exponent,3) }}</sup>, translated to a <span class="g--energy">{{ formatMult(temp.infinity.energy.effect.mult) }}</span> multiplier on all Infinity Generators.</p>
    <p v-if="inEternitychallenge(8)">You have <b>{{ player.challenges.eternity.C8[1] }}</b> purchases left.</p>
    <div class="energy-upgrades">
      <InfinityEnergyUpgrade v-for="x in UPGS_ORDER" :key="x" :n="x" />
    </div>
  </div>
  <div v-else>
    <PrimaryButton class="g--infinity-button break-infinity" :enabled="Decimal.gte(player.infinity.points, InfinityEnergy.requirement)" @click="InfinityEnergy.unlock()">Unlock Infinity Energy<br>Require: {{ format(InfinityEnergy.requirement) }} IP</PrimaryButton>
  </div>
</template>

<style scoped>
.break-infinity {
  width: 200px;
  height: 120px;
  font-family: 24px;
}

.g--energy {
  font-size: 20px;
}
sup.g--energy {
  font-size: 15px !important;
}

.energy-upgrades {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(3, 160px);
  grid-auto-rows: minmax(160px, auto);
  gap: 5px;
  margin-top: 5px;
}
</style>
