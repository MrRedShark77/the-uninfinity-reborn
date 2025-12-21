<script setup lang="ts">
import { ETERNITY } from '@/data/eternity';
import { player } from '@/main';
import { format } from '@/utils/formats';
import SIcon from '../SIcon.vue';
import Decimal from 'break_eternity.js';
</script>

<template>
  <p>You have eternitied <span class="g--eternity">{{ format(player.eternity.times, 0) }}</span> times.</p>
  <div class="g--e-milestones">
    <div v-for="(M,i) in ETERNITY.milestones" :key="i" class="o-simple-frame g--e-milestone" :class="{completed: Decimal.gte(player.eternity.times, M.count)}">
      <div class="g--e-milestone-count">{{ format(M.count,0) }}<SIcon icon="eternity" /><hr class="sub-line" /></div>
      <div class="g--e-milestone-description"><div v-html="M.description"></div></div>
    </div>
  </div>
</template>

<style scoped>
.g--eternity {
  font-size: 16px;
}

.g--e-milestones {
  display: grid;
  grid-template-columns: repeat(4, 200px);
  grid-auto-rows: 120px;
  justify-content: center;
  gap: 10px;
}

.g--e-milestone {
  display: grid;
  grid-template-rows: 1fr 4fr;
  padding: 5px;

  --frame-color: red;
}
.g--e-milestone.completed {
  --frame-color: #b341e0;
}

.g--e-milestone-count {
  font-weight: bold;
  font-size: 16px;
}
.g--e-milestone-description {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>
