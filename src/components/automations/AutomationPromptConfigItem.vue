<script setup lang="ts">
import { type AutomationConfigType, type AutomationPromptConfig, type AutomationPromptData } from '@/data/automations';
import { player } from '@/main';
import { D } from '@/utils/decimal';
import { format } from '@/utils/formats';
import Decimal from 'break_eternity.js';

const { autoid, data } = defineProps<{ autoid: string, data: AutomationConfigType }>() as { autoid: string, data: AutomationPromptConfig }

const plr = player.automations[autoid].configs![data.id] as AutomationPromptData

const onchange = (e: Event) => {
  const target = e.target as HTMLInputElement, value = Math.max(data.minimum, target.valueAsNumber)
  target.valueAsNumber = (plr.value = isNaN(value) ? data.minimum : value)
}
const ondecimalchange = (e: Event) => {
  const value = D((e.target as HTMLInputElement).value);
  if (Decimal.isNaN(value)) plr.value = data.minimum;
  plr.value = value.max(data.minimum);
}
</script>

<template>
  <div v-if="data.condition()" style="width: 100%;">
    <div class="g--automation-switch" :class="{'non-switchable': !data.canSwitch}">
      <div>{{ data.name }}:</div>
      <input v-if="data.canSwitch" type="checkbox" v-model="plr.enabled">
    </div>
    <input v-if="data.isDecimal" type="text" :value="format(plr.value)" @change="ondecimalchange">
    <input v-else type="number" :min="data.minimum" :value="plr.value" @change="onchange">
  </div>
</template>

<style scoped>
.non-switchable {
  grid-template-columns: 1fr;
}

input[type='number'], input[type='text'] {
  margin-top: 4px;
  width: calc(100% - 8px);
  text-align: left;
}
</style>
