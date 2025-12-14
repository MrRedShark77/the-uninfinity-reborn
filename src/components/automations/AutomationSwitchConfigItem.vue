<script setup lang="ts">
import type { AutomationConfigType, AutomationSwitchConfig, AutomationSwitchData } from '@/data/automations';
import { player } from '@/main';

const { autoid, data } = defineProps<{ autoid: string, data: AutomationConfigType }>() as { autoid: string, data: AutomationSwitchConfig }

const plr = player.automations[autoid].configs![data.id] as AutomationSwitchData
</script>

<template>
  <div style="width: 100%;">
    <div class="g--automation-switch">
      <div>{{ data.name }}:</div>
      <input type="checkbox" v-model="plr.enabled">
    </div>
  </div>
</template>

<style scoped>

</style>
