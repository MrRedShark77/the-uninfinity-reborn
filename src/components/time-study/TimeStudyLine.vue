<script setup lang="ts">
import { TimeStudies, type TimeStudy } from '@/data/timestudies';
import { FPS } from '@/main';
import { onMounted, reactive } from 'vue';

const { n } = defineProps<{'n' : [number, number]}>()

const TS1 = TimeStudies[n[0]] as TimeStudy, TS2 = TimeStudies[n[1]] as TimeStudy;

const data = reactive({
  active: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
})

onMounted(() => {
  setInterval(() => {
    data.active = false

    const unlock = TS1.condition!() && TS2.condition!()

    if (!unlock) return;

    const e1 = document.getElementById('time-study-'+n[0]), e2 = document.getElementById('time-study-'+n[1]);

    if (e1 && e2)  {
      data.active = true

      data.x1 = e1.offsetLeft + e1.offsetWidth / 2
      data.y1 = e1.offsetTop + e1.offsetHeight / 2

      data.x2 = e2.offsetLeft + e2.offsetWidth / 2
      data.y2 = e2.offsetTop + e2.offsetHeight / 2
    }
  }, 1000 / FPS);
})
</script>

<template>
  <line v-if="data.active" :x1="data.x1" :y1="data.y1" :x2="data.x2" :y2="data.y2" :stroke="'#ccc'" :stroke-width="16" />
</template>
