<script setup lang="ts">
import { AchievementKeys, calcCompletedAchievements } from '@/data/achievements';
import AchievementItem from './AchievementItem.vue';
</script>

<template>
  <p>You have got <b>{{ calcCompletedAchievements() }} / {{ AchievementKeys.length }}</b> Achievements.</p>
  <div class="o-achievements-grid">
    <AchievementItem v-for="x in AchievementKeys" :key="x" :n="x" />
  </div>
</template>

<style>

</style>
