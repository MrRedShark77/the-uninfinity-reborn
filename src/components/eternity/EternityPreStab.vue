<script setup lang="ts">
import { player } from '@/main';
import { format } from '@/utils/formats';
</script>

<template>
  <p>You have <span class="g--eternity">{{ format(player.eternity.points, 0) }}</span> Eternity Points.</p>
</template>

<style scoped>
.g--eternity {
  font-size: 16px;
}
</style>
