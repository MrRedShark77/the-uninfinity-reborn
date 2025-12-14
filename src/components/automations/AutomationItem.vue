<script setup lang="ts">
import { AutomationConfigComponents, AUTOMATIONS } from '@/data/automations';
import PrimaryButton from '@/components/PrimaryButton.vue';
import { format, formatTime } from '@/utils/formats';
import { computed } from 'vue';
import { CURRENCIES } from '@/data/currencies';
import { player } from '@/main';
import Decimal from 'break_eternity.js';

const { ID } = defineProps<{ ID: string }>();
const AUTO = AUTOMATIONS[ID];
const DATA = player.automations[ID];

const F = (x: number) => x > .1 ? formatTime(x) : "Instant";
const T = (x : number) => AUTO.interval * Math.pow(AUTO.decrease, x);
const INTERVAL = computed(() => {
  const current = T(DATA.level)

  if (current <= .1) return "Instant"

  return formatTime(current) + " ➜ " + F(T(DATA.level + 1));
})

const C = CURRENCIES[AUTO.currency];

function upgradeAutomation() {
  const cost = AUTO.cost(DATA.level)

  if (Decimal.gte(C.amount, cost)) {
    C.amount = Decimal.sub(C.amount, cost).max(0)
    DATA.level++
  }
}
const bought = computed(() => T(DATA.level) <= .1)
</script>

<template>
  <div v-if="AUTO.unl()" class="g--automation" :class="{short: bought}">
    <div><h4>{{ AUTO.name }}</h4></div>
    <div>
      <slot/>
      <div class="configs">
        <component v-for="config in AUTO.configs" :key="config.id" :is="AutomationConfigComponents[config.type]" :autoid="ID" :data="config"/>
      </div>
    </div>
    <div>{{ INTERVAL }}</div>
    <div class="switch-buttons">
      <PrimaryButton @click="DATA.enabled = !DATA.enabled">{{ DATA.enabled ? "Enabled" : "Disabled" }}</PrimaryButton>
      <PrimaryButton v-if="AUTO.bulkOption" @click="DATA.bulk = !DATA.bulk">{{ DATA.bulk ? "Buy Max" : "Buy Once" }}</PrimaryButton>
    </div>
    <PrimaryButton v-if="!bought" :enabled="Decimal.gte(C.amount, AUTO.cost(DATA.level))" @click="upgradeAutomation">Cost: {{ format(AUTO.cost(DATA.level),0) }} {{ C.name }}</PrimaryButton>
  </div>
</template>

<style scoped>
.short {
  grid-template-rows: auto minmax(40px, auto) auto 30px;
}

.switch-buttons {
  display: flex;
}
.switch-buttons > button {
  width: 100%;
}

button {
  padding: 0px;
  margin: 0px;
}

.configs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
