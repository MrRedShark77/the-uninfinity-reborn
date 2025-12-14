<script setup lang="ts">
import { state } from '@/main';
import SIcon from './SIcon.vue';
import { Quote, QuoteRoles, type QuoteLine } from '@/utils/quote';
import { computed } from 'vue';

const Q = state.quote

const text = computed<string>(() => {
  const l = Q.current!.line

  if (typeof l == 'string') return l;

  return l.text;
})
const role = computed(() => {
  const l = Q.current!.line
  let r;

  if (typeof l == 'object' && l.role) r = l.role;
  else r = Q.current!.default_role

  return QuoteRoles[r];
})
</script>

<template>
  <div v-if="Q.current !== undefined" class="modal-overlay">
    <div class="modal-div" :style="{'--o-color': role.color}">
      <div class="modal-symbol" v-html="role.icon"></div>
      <div class="modal-name" v-if="!((Q.current!.line as QuoteLine)?.hide_name ?? false)" v-html="role.name"></div>
      <div class="modal-quote"><div v-html="text"></div></div>
      <div class="modal-border-shadow"></div>

      <button class="modal-button right" :class="{invisible: Q.current.index == Q.current.length - 1}"
      @click="Q.current.index++">
        <SIcon icon="right-arrow"/>
      </button>
      <button class="modal-button left" :class="{invisible: Q.current.index == 0}"
      @click="Q.current.index--">
        <SIcon icon="left-arrow"/>
      </button>
      <button class="modal-button bottom" :class="{invisible: Q.current.index < Q.current.length - 1}"
      @click="Quote.clearQuote()">
        <SIcon icon="checkmark"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  animation: fade 1s linear 0s 1 forwards;
}

@keyframes fade {
  from {
    background-color: transparent;
  }
  to {
    background-color: #0008;
  }
}

.modal-div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 300px;
  height: 300px;
  --o-color: #ff9400;
  background: color-mix(in srgb, var(--o-color) 5%, black);
  border-radius: 20px;
  transition: background .5s;
}

.modal-name {
  position: absolute;
  top: 12px;
  width: 100%;
  font-size: 16px;
  text-align: center;
  color: var(--o-color);
  z-index: 1;
  font-weight: bold;
  transition: color .5s;
}

.modal-quote {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  left: 0px;
  width: calc(100% - 100px);
  height: calc(100% - 100px);
  padding: 50px;
  font-size: 14px;
  text-align: center;
  color: color-mix(in srgb, var(--o-color) 90%, black);
  z-index: 1;
  transition: color .5s;
}

.modal-border-shadow {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  box-shadow: inset 0px 0px 10px var(--o-color), 0px 0px 10px var(--o-color);
  z-index: 1;
  pointer-events: none;
  transition: box-shadow .5s;
}

.modal-symbol {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  font-size: 200px;
  opacity: .1;
  color: var(--o-color);
  transition: color .5s;
}

.modal-button {
  color: black;
  padding: 0px;
  width: 25px;
  height: 25px;
  font-size: 16px;
  border-radius: 50%;
  font-weight: bold;
  border: none;
  background: var(--o-color);
  cursor: pointer;
  position: absolute;
  z-index: 1;
  transition: background .5s;
}

.modal-button.right {
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}
.modal-button.left {
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}
.modal-button.bottom {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.modal-button.invisible {
  opacity: 0;
  pointer-events: none;
}
</style>
