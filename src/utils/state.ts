import type { DialogContent } from "./dialog";
import type { QuoteItem } from "./quote";

export type StateData = {
  dialog: {
    recent: DialogContent[]
    current?: DialogContent
  }

  quote: {
    queue: QuoteItem[]
    current?: QuoteItem
  },

  time: number,
  flux_speed: number,
}

export function getStateData(): StateData {
  const S: StateData = {
    dialog: {
      recent: [],
      current: undefined,
    },

    quote: {
      queue: [],
      current: undefined,
    },

    time: 1,
    flux_speed: 1,
  };

  return S
}
