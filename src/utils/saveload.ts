import { AUTOMATIONS, type Automation, type AutomationListData, type AutomationPromptData, type AutomationSwitchData } from "@/data/automations";
import { InfinityUpgrades } from "@/data/infinity";
import { InfinityEnergy } from "@/data/infinity-energy";
import { checkTab } from "@/data/tabs";
import { player, state } from "@/main";
import { resetTemp, updateTemp } from "@/update";
import type { DecimalSource } from "break_eternity.js"
import { toRaw } from "vue";
import { notify } from "./notify";
import { AchievementKeys, giveAchievement } from "@/data/achievements";

const LOCALSTORAGE_NAME = "uninfinity-reborn-save";
const VERSION = 1;

export type Save = {
  points: DecimalSource;
  generators: {
    amount: DecimalSource;
    bought: DecimalSource;

    additionalCost: DecimalSource;
    additionalBought: DecimalSource;
  }[];
  expanders: DecimalSource;
  refiner: {
    times: number;
    highest: DecimalSource;
  };

  infinity: {
    reached: boolean;
    break: boolean;
    time: number;
    fastest: number;
    times: DecimalSource;
    points: DecimalSource;
    upgrades: Record<string, DecimalSource>;

    passive: number,
    passiveTimes: number,

    last10: {
      time: number,
      amount: DecimalSource,
    }[],

    generators: {
      amount: DecimalSource;
      bought: DecimalSource;
    }[];
    generatorsUnlocked: number;
    power: DecimalSource;

    energy: {
      unlocked: boolean;
      amount: DecimalSource;
      upgrades: DecimalSource[];
    };
  };

  challenges: {
    normal: {
      current: number,
      fastest: number[],
      completedBits: number,

      C1: DecimalSource,
      C2: DecimalSource,
      C10: DecimalSource,
    };
    infinity: {
      unlocked: number,
      current: number,
      fastest: number[],
      completedBits: number,

      C4: number,
    };
  };

  automations: Record<string, Automation>,

  autoGenerators: {
    enabled: boolean, bulk: boolean,
  }[],

  first: {
    infinity: boolean;
  };

  tab: number;
  stab: number[];

  timePlayed: number;
  lastPlayed: number;

  achievements: Record<number, boolean>;
  quotes: string[];

  options: {
    notation: number;
  };

  flux: {
    amount: number;
  };

  _VERSION: number,
}

export function getSaveData(): Save {
  const S: Save = {
    points: 10,
    generators: [],
    expanders: 0,

    refiner: {
      times: 0,
      highest: 1e100,
    },

    infinity: {
      reached: false,
      break: false,

      time: 0,
      fastest: Number.MAX_VALUE,

      times: 0,
      points: 0,
      upgrades: {},

      passive: 0,
      passiveTimes: 0,

      last10: [],

      generators: [],
      generatorsUnlocked: 0,
      power: 0,

      energy: {
        unlocked: false,
        amount: 0,
        upgrades: [],
      },
    },

    challenges: {
      normal: {
        current: 0,
        fastest: new Array(12).fill(Number.MAX_VALUE),
        completedBits: 0,

        C1: 1,
        C2: .01,
        C10: 0,
      },
      infinity: {
        unlocked: 0,
        current: 0,
        fastest: new Array(8).fill(Number.MAX_VALUE),
        completedBits: 0,

        C4: 0,
      },
    },

    first: {
      infinity: false,
    },

    automations: {},
    autoGenerators: [],

    tab: 0,
    stab: [0,0,0,0,0],

    timePlayed: 0,
    lastPlayed: Date.now(),

    achievements: {},
    quotes: [],

    options: {
      notation: 2,
    },

    flux: {
      amount: 0,
    },

    _VERSION: VERSION,
  }

  for (let i = 1; i <= 10; i++) {
    S.generators[i] = { amount: 0, bought: 0, additionalCost: 1, additionalBought: 0, };
    S.infinity.generators[i] = { amount: 0, bought: 0 };

    S.autoGenerators[i] = { enabled: true, bulk: false };
  }
  for (const i in InfinityUpgrades) S.infinity.upgrades[i] = 0;
  for (const i in InfinityEnergy.upgrades) S.infinity.energy.upgrades[i] = 0;

  for (const i of AchievementKeys) S.achievements[i] = false;

  for (const k in AUTOMATIONS) {
    S.automations[k] = {
      enabled: false,
      bulk: false,

      level: 0,
      tick: 0,

      configs: {},
    }

    const A = AUTOMATIONS[k]

    if ('configs' in A) {
      const configs: Record<string, AutomationSwitchData | AutomationPromptData | AutomationListData> = S.automations[k].configs = {};

      for (const C of A.configs!) switch (C.type) {
        case "switch": {
          configs[C.id] = {
            enabled: C.default,
          } as AutomationSwitchData
          break
        }
        case "prompt": {
          configs[C.id] = {
            enabled: C.switchDefault ?? false,
            value: C.default,
          } as AutomationPromptData
          break
        }
        case "list": {
          configs[C.id] = {
            value: C.default,
          } as AutomationListData
          break
        }
      }
    }
  }

  return S
}

type DeepObject = { [index: string | number]: unknown }
export function deepAssign(target: DeepObject, data: DeepObject) {
  for (const [k, v] of Object.entries(data)) {
    if (target[k] === undefined) target[k] = v;
    else if (v !== null && typeof v === 'object') deepAssign(target[k] as DeepObject, v as DeepObject);
    else if (v !== undefined) target[k] = v;
  }
}

export function loadSave(): Save {
  const data = localStorage.getItem(LOCALSTORAGE_NAME);

  if (data === null) return getSaveData();
  else {
    try {
      return JSON.parse(atob(data));
    } catch (e) {
      throw e;
    }
  }
}

export function save() {
  localStorage.setItem(LOCALSTORAGE_NAME, btoa(JSON.stringify(toRaw(player))));

  notify("Game Saved!",'success')
}

export function copySave() {
  const str = btoa(JSON.stringify(toRaw(player)))
  const copyText = document.getElementById('copy') as HTMLInputElement
  copyText.value = str
  copyText.style.visibility = "visible"
  copyText.select();
  document.execCommand("copy");
  copyText.style.visibility = "hidden"
}

export function saveFile() {
  const str = btoa(JSON.stringify(toRaw(player)))
  const file = new Blob([str], {type: "text/plain"})
  window.URL = window.URL || window.webkitURL;
  const a = document.createElement("a")
  a.href = window.URL.createObjectURL(file)
  a.download = "DIR - "+new Date().toString()+".txt"
  a.click()
}

function attemptImport(data: string | null) {
  if (data != null) {
    try {
      const new_player = getSaveData()
      deepAssign(new_player, JSON.parse(atob(data)))
      deepAssign(player, new_player);

      checkTab()

      resetTemp()
      for (let i = 0; i < 10; i++) updateTemp();
      state.flux_speed = 1;
    } catch (error) {
      throw error
    }
  }
}

export function importy_file() {
  const a = document.createElement("input")
  a.setAttribute("type","file")
  a.click()
  a.onchange = ()=>{
    const fr = new FileReader();
    fr.onload = () => {
      attemptImport(fr.result as string)
      /*
      if (findNaN(loadgame, true)) {
        error("Error Importing, because it got NaNed")
        return
      }
      */
    }
    fr.readAsText(a.files![0]);
  }
}

export function importy() {
  const data = prompt("Paste in your save");

  attemptImport(data)
}

export function wipe() {
  if(confirm(`Are you sure you want to wipe your save?`)) {
    player.challenges.normal.fastest = new Array(12).fill(Number.MAX_VALUE)
    player.challenges.infinity.fastest = new Array(8).fill(Number.MAX_VALUE)
    state.flux_speed = 1;

    deepAssign(player, getSaveData())
    player.stab = player.stab.map(() => 0)

    checkTab()

    resetTemp()
    for (let i = 0; i < 10; i++) updateTemp();
  }
}

export function checkPlayer() {
  const date = Date.now()
  const offline_time = (date - player.lastPlayed) / 1e3;

  if (offline_time >= 3600 * 8) giveAchievement(38);
  player.flux.amount += offline_time

  player.lastPlayed = date
  player._VERSION = VERSION
}
