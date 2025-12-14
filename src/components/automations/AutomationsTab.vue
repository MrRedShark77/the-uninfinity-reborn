<script setup lang="ts">
import AutomationItem from './AutomationItem.vue';
import AutoGeneratorItem from './AutoGeneratorItem.vue';


</script>

<template>
  <div>
    <div class="table-center">
      <AutomationItem :ID="'generators'">
        <div class="auto-generators">
          <AutoGeneratorItem v-for="x in 10" :key="x" :n="x"/>
        </div>
      </AutomationItem>
      <AutomationItem :ID="'expander'"></AutomationItem>
      <AutomationItem :ID="'refiner'"></AutomationItem>
      <AutomationItem :ID="'infinity'"></AutomationItem>
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
</style>
