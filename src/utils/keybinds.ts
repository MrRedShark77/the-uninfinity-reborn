export const pressedKeys = new Set<string>();

export function setupKeybinds() {
  document.addEventListener('keydown', event => {
    pressedKeys.add(event.key.toUpperCase())
  })

  document.addEventListener('keyup', event => {
    pressedKeys.delete(event.key.toUpperCase())
  })
}

export function keyPressed(key: string): boolean { return pressedKeys.has(key) }
