<script setup lang="ts">
import { ICONS, type IconType } from '@/utils/icons';

const { icon } = defineProps<{icon: IconType}>()
</script>

<template>
  <span class="icon" v-html="ICONS[icon]"></span>
</template>
