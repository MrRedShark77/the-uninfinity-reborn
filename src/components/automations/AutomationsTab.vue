<script setup lang="ts">
import AutomationItem from './AutomationItem.vue';
import AutoGeneratorItem from './AutoGeneratorItem.vue';
import AutoInfinityGeneratorItem from './AutoInfinityGeneratorItem.vue';


</script>

<template>
  <div>
    <div class="table-center">
      <AutomationItem :ID="'generators'">
        <div class="auto-generators">
          <AutoGeneratorItem v-for="x in 10" :key="x" :n="x"/>
        </div>
      </AutomationItem>
      <AutomationItem :ID="'inf-generators'">
        <div class="auto-generators">
          <AutoInfinityGeneratorItem v-for="x in 10" :key="x" :n="x"/>
        </div>
      </AutomationItem>
      <div class="sub-table-center">
        <AutomationItem :ID="'expander'"></AutomationItem>
        <AutomationItem :ID="'refiner'"></AutomationItem>
      </div><div class="sub-table-center">
        <AutomationItem :ID="'infinity'"></AutomationItem>
        <AutomationItem :ID="'eternity'"></AutomationItem>
      </div>
      <AutomationItem :ID="'ip-mult'"></AutomationItem>
      <AutomationItem :ID="'infinity-energy'"></AutomationItem>
    </div>
  </div>
</template>

<style scoped>
.table-center {
  gap: 5px;
  align-items: start;
}

.auto-generators {
  width: 100%;
}

.sub-table-center {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
