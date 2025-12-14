<script setup lang="ts">
import type { AutomationConfigType, AutomationListConfig, AutomationListData } from '@/data/automations';
import { player } from '@/main';

const { autoid, data } = defineProps<{ autoid: string, data: AutomationConfigType }>() as { autoid: string, data: AutomationListConfig }

const plr = player.automations[autoid].configs![data.id] as AutomationListData
</script>

<template>
  <div v-if="data.condition()" style="width: 100%;">
    <div class="g--automation-switch">{{ data.name }}:</div>
    <select v-model="plr.value">
      <div v-for="x in data.list" :key="x[0]"><option :value="x[0]" v-if="x[2]()">{{ x[1] }}</option></div>
    </select>
  </div>
</template>

<style scoped>
.g--automation-switch {
  grid-template-columns: 1fr;
  text-align: left;
}

select {
  margin-top: 4px;
  width: 100%;
}
option {
  text-align: left;
}
</style>
