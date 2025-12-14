import type { DecimalSource } from "break_eternity.js"
import Decimal from "break_eternity.js"
import { Currency } from "./currencies"
import { REFINER, GENERATOR, EXPANDER } from "./generators/normal-generators";
import { player, temp } from "@/main";
import { inNormalChallenge, isNCBeaten } from "./challenges/normal-challenges";
import AutomationPromptConfigItem from "@/components/automations/AutomationPromptConfigItem.vue";
import AutomationSwitchConfigItem from "@/components/automations/AutomationSwitchConfigItem.vue";
import AutomationListConfigItem from "@/components/automations/AutomationListConfigItem.vue";
import { hasInfinityUpgrade, INFINITY, InfinityUpgrade } from "./infinity";

export type AutomationSwitchData = {
  enabled: boolean,
}
export type AutomationPromptData = {
  enabled: boolean,
  value: DecimalSource,
}
export type AutomationListData = {
  value: string,
}
type AutomationConfigData = AutomationSwitchData | AutomationPromptData | AutomationListData
type AutomationConfigs = Record<string, AutomationConfigData>
export type Automation = {
  enabled: boolean,
  bulk: boolean,

  level: number,
  tick: number,

  configs: AutomationConfigs,
}

type AutomationConfig = {
  id: string,
  name: string,
  default: unknown,
  condition(): boolean,
}
export type AutomationSwitchConfig = AutomationConfig & {
  type: "switch",
}
export type AutomationPromptConfig = AutomationConfig & {
  type: "prompt",

  isDecimal: boolean,
  minimum: number,
  canSwitch: boolean,
  switchDefault?: boolean,
}
export type AutomationListConfig = AutomationConfig & {
  type: "list",

  list: [string, string, () => boolean][],
}
export type AutomationConfigType = AutomationSwitchConfig | AutomationPromptConfig | AutomationListConfig;

export const AutomationConfigComponents = {
  'switch': AutomationSwitchConfigItem,
  'prompt': AutomationPromptConfigItem,
  'list': AutomationListConfigItem,
}

export function getAutomationConfigValue(autoid: string, id: string) {
  const C = player.automations[autoid].configs[id]

  return 'value' in C ? C.value : C.enabled
}

export const AUTO_TIMEOUTS: Record<string,{
  time: number,
  interval: number,
  tick: () => void,
  willReset: () => boolean,
  willReject: () => boolean,
}> = {}
function setupAutomationTimeout(id: string, time: number, f: () => void, reset: () => boolean, reject: () => boolean) {
  if (id in AUTO_TIMEOUTS) AUTO_TIMEOUTS[id].interval = time;
  else {
    AUTO_TIMEOUTS[id] = {
      time: 0,
      interval: time,
      tick: f, willReset: reset, willReject: reject,
    }
  }
}

export const AUTOMATIONS: Record<string,{
  name: string,
  unl(): boolean,

  interval: number,
  decrease: number,

  cost: (x: number) => DecimalSource,
  currency: Currency,

  bulkOption: boolean,
  tick: (data: Automation) => void;

  configs?: AutomationConfigType[],
}> = {
  'generators': {
    unl: () => player.first.infinity,
    name: "Generators Autobuyer",

    interval: 1,
    decrease: 0.6,

    cost: x => Decimal.pow(2, x),
    currency: Currency.InfinityPoints,

    bulkOption: true,
    tick(data) {
      const b = data.bulk

      for (let i = 1; i <= 10; i++) {
        const G = GENERATOR(i)

        if (G.autoUnlocked && player.autoGenerators[i].enabled) G.purchase(b && player.autoGenerators[i].bulk);
      };
    },
  },
  'expander': {
    unl: () => isNCBeaten(10),
    name: "Generator Expander Autobuyer",

    interval: 5,
    decrease: 0.6,

    cost: x => Decimal.pow(2, x),
    currency: Currency.InfinityPoints,

    get bulkOption() { return hasInfinityUpgrade(InfinityUpgrade.ExpanderBulk) },
    tick(data) {
      const configs = data.configs, limit = configs.limit as AutomationPromptData, amount = configs.amount as AutomationPromptData

      if ((!limit.enabled || Decimal.lt(player.expanders, limit.value))
        && (!this.bulkOption || !data.bulk || !amount.enabled || Decimal.lt(player.expanders, inNormalChallenge(9) ? 4 : 6) || Decimal.sub(EXPANDER.bulk, player.expanders).gte(amount.value)))
        EXPANDER.expand(this.bulkOption && data.bulk);
    },

    configs: [
      {
        id: "limit",
        type: "prompt",

        condition: () => true,
        name: `Limit Generator Expanders`,
        default: 6,

        isDecimal: false,
        minimum: 0,
        canSwitch: true,
      },{
        id: "amount",
        type: "prompt",

        condition: () => hasInfinityUpgrade(InfinityUpgrade.ExpanderBulk),
        name: `Expand for at least X Generator Expanders`,
        default: 1,

        isDecimal: false,
        minimum: 1,
        canSwitch: true,
      },
    ],
  },
  'refiner': {
    unl: () => isNCBeaten(11),
    name: "Generator Refiner Autobuyer",

    interval: 25,
    decrease: 0.6,

    cost: x => Decimal.pow(2, x),
    currency: Currency.InfinityPoints,

    bulkOption: false,
    tick(data) {
      if (Decimal.lte(player.points, player.refiner.highest)) return;

      const configs = data.configs, mult = configs.mult as AutomationPromptData, time = configs.time as AutomationPromptData;

      if (time.enabled) {
        setupAutomationTimeout('refiner', time.value as number, ()=>REFINER.refine(), ()=>mult.enabled && Decimal.lt(temp.refiner_boost_increase, mult.value), ()=>player.infinity.reached || !time.enabled)
        return
      } else if (mult.enabled) {
        if (Decimal.gte(temp.refiner_boost_increase, mult.value)) REFINER.refine();
        return
      }

      REFINER.refine()
    },

    configs: [
      {
        id: "mult",
        type: "prompt",

        condition: () => true,
        name: `Multiplier last refiner`,
        default: 10,

        isDecimal: true,
        minimum: 1,
        canSwitch: true,
        switchDefault: true,
      },{
        id: "time",
        type: "prompt",

        condition: () => true,
        name: `Seconds between refiners`,
        default: 1,

        isDecimal: false,
        minimum: 0,
        canSwitch: true,
      },
    ],
  },
  'infinity': {
    unl: () => isNCBeaten(12),
    name: "Infinity Autobuyer",

    interval: 125,
    decrease: 0.6,

    cost: x => Decimal.pow(2, x),
    currency: Currency.InfinityPoints,

    bulkOption: false,
    tick(data) {
      if (!INFINITY.reached) return;

      const configs = data.configs, mode = configs.mode as AutomationListData

      if (player.infinity.break) switch (mode.value) {
        case "amount": {
          if (Decimal.gte(temp.currencies.infinity, (configs.amount as AutomationPromptData).value)) INFINITY.crunch();
          return
        }
        case "time": {
          setupAutomationTimeout('infinity', (configs.time as AutomationPromptData).value as number, ()=>INFINITY.crunch(), ()=>!INFINITY.reached, ()=>mode.value!=="time")
          return
        }
      }
      else INFINITY.crunch()
    },

    configs: [
      {
        id: "mode",
        type: "list",

        condition: () => player.infinity.break,
        name: `Big Crunch Mode`,
        default: 'amount',

        list: [
          ['amount','Amount',()=>true],
          ['time','Time',()=>true],
        ],
      },{
        id: "amount",
        type: "prompt",

        condition: () => player.infinity.break && getAutomationConfigValue('infinity','mode') == 'amount',
        name: `Big Crunch at X IP`,
        default: 1,

        isDecimal: true,
        minimum: 1,
        canSwitch: false,
      },{
        id: "time",
        type: "prompt",

        condition: () => player.infinity.break && getAutomationConfigValue('infinity','mode') == 'time',
        name: `Seconds between Big Crunches`,
        default: 1,

        isDecimal: false,
        minimum: 0,
        canSwitch: false,
      },
    ],
  },
}
