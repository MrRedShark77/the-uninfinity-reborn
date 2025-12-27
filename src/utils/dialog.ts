import TimeStudyPresets from "@/components/time-study/TimeStudyPresets.vue";
import { state } from "@/main";
import { markRaw, type Component, type CSSProperties } from "vue";

export interface DialogContent {
  title: string
  id?: string

  style?: CSSProperties
  config: Record<string, unknown>

  buttons: [string, VoidFunction?][]

  html?: string
  app?: Component
}

export function checkDialogsByID(id: string) {
  const n = state.dialog.recent.findIndex(x => x.id === id);
  if (n >= 0) state.dialog.recent.splice(n,1);
}

export function createSimpleDialog(id: string, title: string, html: string, style?: CSSProperties) {
  checkDialogsByID(id);

  const D: DialogContent = {
    id,
    title,
    html,
    style: style ?? {},
    config: {},
    buttons: [],
  };

  state.dialog.recent.push(D)
  state.dialog.current = D
}

export function createSimpleDialogConfirmation(id: string, title: string, html: string, buttons: [string, VoidFunction?][], style?: CSSProperties) {
  checkDialogsByID(id);

  const D: DialogContent = {
    id,
    title,
    html,
    style: style ?? {},
    config: {},
    buttons,
  };

  state.dialog.recent.push(D)
  state.dialog.current = D
}

const APP = {
  "ts-presets": {
    name: "Time Study Presets",
    component: markRaw(TimeStudyPresets),
  },
}

export function createDialogComponent(id: keyof typeof APP) {
  if (state.dialog.recent.some(x => x.id === id)) return;

  const A = APP[id];

  const D: DialogContent = {
    id,
    title: A.name,
    app: A.component,
    config: {},
    buttons: [],
  };

  state.dialog.recent.push(D)
  state.dialog.current = D
}
