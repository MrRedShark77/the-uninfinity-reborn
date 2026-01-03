<script setup lang="ts">
import { TimeDilation } from '@/data/dilation';
import PrimaryButton from '../PrimaryButton.vue';
import { computed } from 'vue';
import Decimal from 'break_eternity.js';
import { player, temp } from '@/main';
import { format, formatGain, formatMult } from '@/utils/formats';
import DilationUpgrade from './DilationUpgrade.vue';

const req = computed(()=>TimeDilation.pointRequirement)

const UPGS_ORDER = [
  0,  1,  2,  3,
  4,  5,  6,  7,
  8,  9,  10, 11
]
</script>

<template>
  <p>You have <span class="g--dilation">{{ format(player.eternity.dilation.tachyonParticles,0) }}</span> Tachyon Particles.</p>
  <PrimaryButton class="g--dilation-button" id="time-dilation" :type="'glowing'" @click="TimeDilation.run(true)">
    <template v-if="TimeDilation.active">
      <template v-if="Decimal.gte(player.points, req)">
        Gain <b style="color: white;">{{ format(TimeDilation.pendingTP, 0) }}</b> Tachyon Particles.
      </template><template v-else>
        Reach <b style="color: white;">{{ format(req) }}</b> points or exit dilating.
      </template>
    </template><template v-else>
      Dilate Time
    </template>
  </PrimaryButton>
  <div class="subtitle">
    During <b>Time Dilation</b>, the exponent of Normal, Infinity and Time Generators are raised to the 0.75th power and the reduction of multiplier per OoMs of each of them starts immediately and is stronger. <b>Tachyon Particles</b> are earned by performing an Eternity with enough Points while Dilated, and they're generating <b>Dilated Time</b>.
  </div>
  <p>You have <span class="g--dilation">{{ format(player.eternity.dilation.dilatedTime,0) }}</span> {{ formatGain(player.eternity.dilation.dilatedTime,temp.currencies['dilated-time']) }} Dilated Time, translated to a <span class="g--dilation">{{ formatMult(temp.eternity.dilation.effect,3) }}</span> multiplier per OoMs of Generators.</p>
  <div class="dilation-upgrades">
    <DilationUpgrade v-for="x in UPGS_ORDER" :key="'u'+x" :n="x"/>
    <DilationUpgrade id="dil-12" :n="12"/>
  </div>
</template>

<style>
#time-dilation {
  width: 200px;
  height: 120px;
  color: #64dd17;
}

.g--dilation {
  font-size: 20px;
}

.subtitle {
  max-width: 600px;
}

.dilation-upgrades {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, 200px);
  grid-auto-rows: minmax(120px, auto);
  gap: 5px;
  margin-top: 5px;
}

#dil-12 {
  grid-column: 1 / 5;
}
</style>
