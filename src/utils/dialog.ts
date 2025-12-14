import { state } from "@/main";
import { type Component, type CSSProperties } from "vue";

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
