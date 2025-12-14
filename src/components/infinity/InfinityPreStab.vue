<script setup lang="ts">
import { player } from '@/main';
import { format } from '@/utils/formats';
</script>

<template>
  <p>You have <span class="g--infinity">{{ format(player.infinity.points, 0) }}</span> Infinity Points.</p>
</template>

<style scoped>
.g--infinity {
  font-size: 16px;
}
</style>
