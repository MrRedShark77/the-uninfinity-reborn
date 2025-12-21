<script setup lang="ts">
import { format } from '@/utils/formats';
import PrimaryButton from '../PrimaryButton.vue';
import { player } from '@/main';
import { purchaseTimeTheorem, TimeTheorems } from '@/data/timestudies';
import { CURRENCIES, Currency } from '@/data/currencies';
import Decimal from 'break_eternity.js';
import { DC } from '@/utils/decimal';

</script>

<template>
  <div class="g--time-theorems o-simple-frame opaque">
    <p>You have <b>{{ format(player.eternity.timestudy.theorems, 0) }} / {{ format(player.eternity.timestudy.p_theorems.reduce((a,b) => Decimal.add(a,b), DC.D0), 0) }}</b> Time Theorems</p>
    <div class="table-center">
      <PrimaryButton class="time-theorem-button" v-for="(TT, i) in TimeTheorems" :key="'tt-'+i" @click="purchaseTimeTheorem(i, true)"
      :enabled="Decimal.gte(CURRENCIES[TT.currency as Currency].amount, TT.cost(player.eternity.timestudy.p_theorems[i]))">
        <div>Buy Time Theorem</div>
        <hr class="sub-line" />
        <div>Cost: {{ format(TT.cost(player.eternity.timestudy.p_theorems[i]), 0) }} {{ CURRENCIES[TT.currency as Currency].name }}</div>
      </PrimaryButton>
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
.time-theorem-button {
  width: 200px;
  height: 100px;
}
</style>
