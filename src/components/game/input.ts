// Movement input shared by the keyboard, the on-screen pad and the player.
// Letters cover both QWERTY (WASD) and AZERTY (ZQSD) layouts.

type Dir = "up" | "down" | "left" | "right";

const KEYS: Record<string, Dir> = {
  arrowup: "up",
  w: "up",
  z: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  q: "left",
  arrowright: "right",
  d: "right",
};

const held = new Set<Dir>();

export function press(dir: Dir) {
  held.add(dir);
}

export function release(dir: Dir) {
  held.delete(dir);
}

// Normalised direction on the ground plane (z grows towards the camera)
export function readInput() {
  const x = (held.has("right") ? 1 : 0) - (held.has("left") ? 1 : 0);
  const z = (held.has("down") ? 1 : 0) - (held.has("up") ? 1 : 0);
  const len = Math.hypot(x, z) || 1;
  return { x: x / len, z: z / len };
}

export function bindKeyboard() {
  const isTyping = (e: KeyboardEvent) =>
    e.target instanceof HTMLElement && !!e.target.closest("input, textarea, select, [contenteditable]");

  const down = (e: KeyboardEvent) => {
    const dir = KEYS[e.key.toLowerCase()];
    if (!dir || isTyping(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    held.add(dir);
  };
  const up = (e: KeyboardEvent) => {
    const dir = KEYS[e.key.toLowerCase()];
    if (dir) held.delete(dir);
  };
  const clear = () => held.clear();

  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", clear);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", clear);
    held.clear();
  };
}

export type { Dir };
