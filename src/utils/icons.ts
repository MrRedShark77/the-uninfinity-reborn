export const ICONS = {
  'star': '&#xe000;',
  'infinity': '&#xe001;',
  'cross': '&#xe002;',
  'checkmark': '&#xe003;',
  'up-arrow': '&#xe004;',
  'right-arrow': '&#xe005;',
  'left-arrow': '&#xe006;',
  'down-arrow': '&#xe007;',
  'eternity': '&#xe008;',
} as const
export type IconType = keyof typeof ICONS
export function icon(id: IconType) { return `<span class='icon'>${ICONS[id]}</span>` }
