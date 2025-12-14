import { player, state } from "@/main"
import { icon } from "./icons"

export const QuoteRoles = {
  "infinity": {
    color: "#ff9400",
    name: "Infinity",
    icon: icon('infinity'),
  },
  "eternity": {
    color: "#b341e0",
    name: "Eternity",
    icon: icon('eternity'),
  },
}

type QuoteRole = keyof typeof QuoteRoles

export interface QuoteLine {
  text: string
  role?: QuoteRole
  hide_name?: boolean
}

type QuoteLines = (string | QuoteLine)[]

export class QuoteItem {
  index = 0
  lines: QuoteLines = []
  get length() { return this.lines.length }
  get line() { return this.lines[this.index] }
  default_role: QuoteRole = 'infinity'

  constructor (role: QuoteRole, lines: QuoteLines) {
    this.default_role = role;
    this.lines = lines;
  }
}

interface QuoteData {
  role: QuoteRole
  lines: QuoteLines
}

export const Quotes: Record<string, QuoteData> = {
  test: {
    role: "infinity",
    lines: [
      "Hi",
      "Hii",
      "Hiii",
      "Hiiii",
      "Hiiiii",
      {text: `Stop doing this dude!`, role: "eternity"},
      "Bye",
    ],
  },
  infinity: {
    role: "infinity",
    lines: [
      {text: `Hello.`, hide_name: true},
      {text: `It's me, <b>Infinity</b>.`, hide_name: true},
      `You reached the limit.`,
      `There’s no way to reach beyond the limit.`,
      `But it gives you <b>Infinity Points</b> and benefits that make progression faster.`,
      `The benefits you need to spend <b>Infinity Points</b> to purchase.`,
      `So, there’re challenges you should beat to unlock the <b>Automations</b>.`,
      `Enjoy looping at that point!`,
    ],
  },
  break_infinity: {
    role: "infinity",
    lines: [
      {text: `You have broken <b>Infinity</b>.`, hide_name: true},
      `Oh my god, you did break Infinity, didn’t you?`,
      `Alright, it allows you to reach beyond the limit.`,
      `But those costs are increased significantly above the limit.`,
      `Don’t worry, the more points you have, the more <b>Infinity Points</b> you will earn.`,
      `You should reach points further to unlock something.`,
      `Good luck...`,
    ],
  },
  infinity_gen: {
    role: "infinity",
    lines: [
      {text: `You unlocked a <b>Xenna-Generator</b>.`, hide_name: true},
      `I warn you that there’s not eleventh Generator, but first <b>Infinity Generator</b>.`,
      `It produces <b>Infinity Powers</b> that boost <b>Normal Generators</b>.`,
      `But you must spend Infinity Points on purchasing <b>Infinity Generators</b>.`,
      `A new challenge waits for you...`,
    ],
  },
  ic5: {
    role: "infinity",
    lines: [
      `Is everything ok?`,
      `Did you realize you disabled auto-Generators?`,
      `Fine...`,
      `You were an active player.`,
    ],
  },
  all_ic: {
    role: "infinity",
    lines: [
      `How...`,
      `...did you...`,
      `...achieve...`,
      `...those challenges?`,
      `I would like to stop you progressing further...`,
    ],
  },
  infinity_energy: {
    role: "infinity",
    lines: [
      {text: `You unlocked <b>Infinity Energy</b>.`, hide_name: true},
      `Here you go with the feature...`,
      `<b>Infinity Energy</b> cannot grow exponentially, but it grows polynomially.`,
      {text: `...`, role: "eternity", hide_name: true},
      `Who <i>[swearing]</i> are you?`,
      {text: `You are coming to me...`, role: "eternity", hide_name: true},
      `C’MON, DO NOT`,
      `COME TO THAT GUY!`,
    ],
  },
}

export const Quote = {
  addFromKeys(k: string, debug = false) {
    const Q = Quotes[k]

    if (Q === undefined || !debug && player.quotes.includes(k)) return;

    if (!debug) player.quotes.push(k);

    this.addToQueue(Q)
  },

  addToQueue(data: QuoteData) {
    state.quote.queue.push(new QuoteItem(data.role, data.lines));
    if (state.quote.current === undefined && state.quote.queue.length) state.quote.current = state.quote.queue.shift();
  },

  clearQuote() {
    if (state.quote.current === undefined) return;
    state.quote.current = undefined
    if (state.quote.queue.length) state.quote.current = state.quote.queue.shift();
  }
}
