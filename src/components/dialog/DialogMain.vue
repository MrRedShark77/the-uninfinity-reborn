<script setup lang="ts">
import { state } from '@/main';

function closeDialog() {
  const L = state.dialog.recent.length

  if (L) {
    state.dialog.recent.pop()
    state.dialog.current = state.dialog.recent[L-1];
  }
}

function activateDialog(func?: VoidFunction) {
  func?.()
  closeDialog()
}
</script>

<template>
  <div id="dialog" :class="{footer: state.dialog.current.buttons.length}" v-if="state.dialog.current">
    <div id="dialog-header">
      <div></div>
      <div id="dialog-title" v-html="state.dialog.current.title"></div>
      <div id="dialog-close" @click="closeDialog()"><img src="/assets/textures/black_cross.png"></div>
    </div>
    <hr class="line">
    <div id="dialog-content">
      <div id="dialog-html" v-html="state.dialog.current.html"></div>
      <component :is="state.dialog.current.app" :config="state.dialog.current.config" />
    </div>
    <div id="dialog-footer">
      <hr class="line">
      <div id="dialog-buttons">
        <button v-for="(b, i) in state.dialog.current.buttons" :key="i" v-html="b[0]" @click="activateDialog(b[1]!)"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 50px));

  max-width: calc(100% - 40px);
  max-height: calc(100% - 160px);

  border: solid 2px #aaa;
  background: #181818;
  border-radius: 5px;
  padding: 5px;
}

#dialog-footer {
  display: none;
}
.footer #dialog-footer {
  display: block;
}

#dialog-header {
  display: grid;
  width: 100%;
  height: 40px;

  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 5px;
}
#dialog-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

#dialog-close {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-size: 30px;
}
.footer #dialog-close {
  display: none;
}

#dialog-content {
  overflow-y: auto;
  max-height: calc(100% - 54px);
}
.footer #dialog-content {
  height: calc(100% - 98px);
}

#dialog-footer {
  display: none;
}
.footer #dialog-footer {
  display: block;
}

#dialog-buttons {
  display: flex;

  width: 100%;
  height: 30px;

  gap: 5px;
}
#dialog-buttons > button {
  width: 100%;
  padding: 0px;
  margin: 0px;

  border: none;
  border-radius: 5px;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>
