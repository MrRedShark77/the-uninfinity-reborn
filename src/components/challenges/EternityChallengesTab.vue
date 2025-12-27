<script setup lang="ts">
import EternityChallengeItem from './EternityChallengeItem.vue';


</script>

<template>
  <div>
    <div>
      Complete Eternity Challenges again for a bigger reward, maximum of 5 times.<br>
      The rewards are applied permanently with no need to have the respective Eternity Challenge Time Study purchased.<br>
      When you respec out of an unlocked Eternity Challenge, you don't need to redo the secondary requirement<br>
      in order to unlock it again until you complete it; only the Time Theorems are required.
    </div>
    <div class="table-center">
      <EternityChallengeItem v-for="x in 12" :key="x" :ID="x" />
    </div>
  </div>
</template>

<style scoped>
.table-center {
  margin-top: 30px;
  gap: 20px 10px;
}
</style>
