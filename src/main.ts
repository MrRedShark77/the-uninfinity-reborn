import './assets/main.css'

import { createApp, reactive } from 'vue'
import App from './App.vue'

import { checkPlayer, deepAssign, getSaveData, loadSave, save, type Save } from './utils/saveload';
import { getTempData, loop, updateTemp, type TempData } from './update';
import { checkTab } from './data/tabs';
import { getStateData, type StateData } from './utils/state';
import { setupKeybinds } from './utils/keybinds';

export const player: Save = reactive(getSaveData())
export const temp: TempData = reactive(getTempData());
export const state: StateData = reactive(getStateData());
export const FPS = 30;

export function load() {
  deepAssign(player, loadSave());
  checkPlayer();

  for (let i = 0; i < 10; i++) updateTemp();

  console.log("Hello, World!")

  checkTab()
  setupKeybinds()

  setInterval(() => {
    loop();
  }, 1000 / FPS)

  setInterval(save, 60000)

  // createSimpleDialog("hi","HI!","Hello, World!")
  // createSimpleDialogConfirmation("hi","HI!","Hello, World!",[["Yes"],["No"]])

  // Quote.addToQueue(Quotes.test);
}

try {
  createApp(App).mount('#app')
} catch (error) {
  console.error(error)
}
