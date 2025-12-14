<script setup lang="ts">
import { player } from '@/main';
import { copySave, importy, importy_file, save, saveFile, wipe } from '@/utils/saveload';

const options = player.options
</script>

<template>
  <div>
    <div class="o-options-grid">
      <button class="o-primary-btn" style="grid-row: 1 / 3; grid-column: 1 / 3;" @click="save">Save</button>
      <button class="o-primary-btn" style="grid-row: 1 / 2; grid-column: 3 / 5;" @click="saveFile">Export as file</button>
      <button class="o-primary-btn" style="grid-row: 1 / 2; grid-column: 5 / 7;" @click="copySave">Export to clipboard</button>
      <button class="o-primary-btn" style="grid-row: 2 / 3; grid-column: 3 / 5;" @click="importy_file">Import from file</button>
      <button class="o-primary-btn" style="grid-row: 2 / 3; grid-column: 5 / 7;" @click="importy">Import from prompt</button>
      <button class="o-primary-btn" style="grid-row: 1 / 3; grid-column: 7 / 9; --button-color: darkred" @click="wipe">WIPE!!!</button>
      <button class="o-primary-btn no-active" style="grid-row: 3 / 4; grid-column: 1 / 5;">
        Notation:<br><select class="o-options-select" v-model="options.notation">
          <optGroup style="color:green" label="Serious">
            <option value=0 style="color:green">Scientific</option>
            <option value=1 style="color:green">Standard</option>
            <option value=2 style="color:green">Default (Mixed-Scientific)</option>
          </optGroup>
        </select>
      </button><button class="o-primary-btn no-active" style="grid-row: 3 / 4; grid-column: 5 / 9;">

      </button>
    </div><div style="margin: 10px 0;">
      <div>The Uninfinity: Reborn - Made by MrRedShark77</div>
    </div>
  </div>
</template>
<style scoped>
.o-options-grid {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(8, 80px);
  grid-template-rows: repeat(3, 80px);
  grid-gap: 5px;
}

.o-options-select {
  width: calc(100% - 10px);
}
.o-options-select option, .o-options-select optGroup {
  text-align: left;
}
</style>
