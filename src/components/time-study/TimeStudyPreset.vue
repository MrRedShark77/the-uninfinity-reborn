<script setup lang="ts">
import { buyAllTimeStudies, filterTimeStudyPreset, isTimeStudyEmpty, respecTimeStudies, TimeStudies, TimeStudiesIndex } from '@/data/timestudies';
import { player } from '@/main';
import { DC } from '@/utils/decimal';
import { format } from '@/utils/formats';
import { computed } from 'vue';
import PrimaryButton from '../PrimaryButton.vue';
import { notify } from '@/utils/notify';
import { createSimpleDialogConfirmation } from '@/utils/dialog';
import { inEternitychallenge } from '@/data/challenges/eternity-challenges';

const { index } = defineProps<{ index: number }>()

const P = player.eternity.timestudy.presets[index];

const onchange = (e: Event) => {
  P.value = filterTimeStudyPreset((e.target as HTMLInputElement).value.split(",").map(x => Number(x)))
}

const cost = computed(() => {
  let x = DC.D0;
  for (const id of P.value) if (id in TimeStudiesIndex) {
    const TS = TimeStudies[TimeStudiesIndex[id]]
    if (TS.type === 'invisible' || TS.type === 'EC') continue;
    x = x.add(TS.cost)
  }
  return x
})

function saveP() {
  if (isTimeStudyEmpty()) return;

  P.value = filterTimeStudyPreset(player.eternity.timestudy.purchased.map(x => Number(x)));

  notify("Preset is saved!","success")
}

function loadP() {
  buyAllTimeStudies(P.value)
  notify("Preset Loaded!","success")
}

function loadPRespec() {
  if (!inEternitychallenge(0)) {
    notify("You cannot respec Time Studies!","error")
    return
  }

  respecTimeStudies()
  buyAllTimeStudies(P.value)
  notify("Preset Loaded!","success")
}

function renameP() {
  const r = prompt("Input the new name for this preset. It is recommended you rename the preset based on what studies you have selected.")

  if (r !== null && r !== '') P.id = r;
}

function deleteP() {
  createSimpleDialogConfirmation("tsp-delete", `Delete Preset`, `Are you sure you want to delete this Time Study preset?`, [
    ["Yes", () => {
      player.eternity.timestudy.presets.splice(index,1);
      notify("Preset Deleted!","success")
    }],
    ["No"]
  ])
}
</script>

<template>
  <div class="g--time-study-preset">
    <div>{{ P.id }}</div>
    <div>
      <input type="text" class="g--time-study-preset-input" :value="P.value.join(', ')" @change="onchange">
    </div>
    <div>Total: <b>{{ format(cost, 0) }}</b> Time Theorems</div>
    <div class="g--time-study-preset-buttons">
      <PrimaryButton @click="saveP">Save</PrimaryButton>
      <PrimaryButton @click="loadP">Load</PrimaryButton>
      <PrimaryButton @click="loadPRespec">Respec & Load</PrimaryButton>
      <PrimaryButton @click="renameP">Rename</PrimaryButton>
      <PrimaryButton @click="deleteP">Delete</PrimaryButton>
    </div>
  </div>
</template>
