<script setup lang="ts">
import { getAchievementTooltip } from '@/data/achievements';
import { player } from '@/main';
import { ref } from 'vue';

const { n } = defineProps<{n : number}>()

const isMouseOver = ref(false)
const mouseOverInterval = ref(-1)

function onMouseEnter() {
  clearTimeout(mouseOverInterval.value);
  isMouseOver.value = true;
}

function onMouseLeave() {
  mouseOverInterval.value = setTimeout(() => isMouseOver.value = false, 300);
}

</script>

<template>
  <div class="o-achievement--cell"
  :class="{unlocked: player.achievements[n]}"
  :style="{'background-position': `-${(n - 1) % 10 * 125}px -${Math.floor(n / 10 - 1) * 125}px`}" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="o-achievement--tooltip">
      <div class="o-achievement--tooltip-text" v-if="isMouseOver" v-html="getAchievementTooltip(n)"></div>
    </div>
  </div>
</template>

<style>
.o-achievement--tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;

  pointer-events: none;
  z-index: 2;

  padding: 5px 10px;
  border: solid 1px white;
  border-radius: 5px;
  width: 250px;
  background-color: #000e;

  opacity: 0;
  transform: translate(-50%, 20px);

  transition: opacity 0.3s, transform 0.3s;
}
.o-achievement--tooltip::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  width: 20px;
  height: 20px;
  background-color: white;
  clip-path: polygon(50% 50%, 0% 0%, 100% 0%);
  transform: translateX(-50%);
}
.o-achievement--cell:hover > .o-achievement--tooltip {
  opacity: 1;
  transform: translate(-50%, 0px);
}

.o-achievement--tooltip-text {
  color: white;

  text-align: center;
  font-size: 12px;
}
</style>
