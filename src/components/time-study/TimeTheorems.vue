<script setup lang="ts">
import { format } from '@/utils/formats';
import PrimaryButton from '../PrimaryButton.vue';
import { player } from '@/main';
import { purchaseTimeTheorem, TimeTheorems } from '@/data/timestudies';
import { CURRENCIES, Currency } from '@/data/currencies';
import Decimal from 'break_eternity.js';
import { DC } from '@/utils/decimal';
import { createDialogComponent } from '@/utils/dialog';

function buyMaxTheorems() {
  for (let i = 0; i < 3; i++) purchaseTimeTheorem(i, true);
}
</script>

<template>
  <div class="g--time-theorems o-simple-frame opaque">
    <div class="time-theorem-top">
      <div>
        <div><b>{{ format(player.eternity.timestudy.theorems, 0) }}</b> Time Theorems</div>
        <div style="font-size: 12px;">({{ format(player.eternity.timestudy.p_theorems.reduce((a,b) => Decimal.add(a,b), DC.D0), 0) }} total)</div>
      </div>
      <PrimaryButton class="time-theorem-button" @click="createDialogComponent('ts-presets')">Presets</PrimaryButton>
    </div>
    <hr class="sub-line">
    <div class="time-theorem-buttons">
      <PrimaryButton v-for="(TT, i) in TimeTheorems" :key="'tt-'+i" @click="purchaseTimeTheorem(i, true)"
      :enabled="Decimal.gte(CURRENCIES[TT.currency as Currency].amount, TT.cost(player.eternity.timestudy.p_theorems[i]))">
        {{ format(TT.cost(player.eternity.timestudy.p_theorems[i]), 0) }} {{ ["Points","IP","EP"][i] }}
      </PrimaryButton>
      <PrimaryButton @click="buyMaxTheorems">Buy Max</PrimaryButton>
    </div>
  </div>
</template>

<style>
.g--time-theorems {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
}
.time-theorem-top {
  display: grid;
  grid-template-columns: 1fr 100px;
  height: 40px;
  align-items: center;
}
.time-theorem-button {
  height: 100%;
}
.time-theorem-buttons {
  display: grid;
  grid-template-columns: repeat(3, 180px) 50px;
  grid-auto-rows: 50px;
}
</style>
