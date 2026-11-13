import { education, experiences, projects, skills } from "@/data/portfolio";

// Level dimensions (world units ≈ metres). Rooms sit on a grid, linked by corridors.
export const ROOM = 9;
export const PITCH = 13;
export const WALL_T = 0.3;
export const WALL_H = 2.6;
export const LOW_WALL_H = 0.5;
export const DOOR = 2.4;
export const CORRIDOR_WALL_H = 1.1;
export const PLAYER_RADIUS = 0.35;
const COLUMNS = 3;

export type RoomKind = "hall" | "studies" | "workshop" | "experience" | "projects" | "contact";
export type Side = "n" | "s" | "e" | "w";

export interface Rect {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}

export interface Room {
  id: string;
  kind: RoomKind;
  label: string;
  order: number;
  col: number;
  row: number;
  x: number;
  z: number;
  doors: Side[];
  // Index into `experiences` for experience rooms
  index?: number;
}

export interface Corridor {
  id: string;
  axis: "x" | "z";
  rect: Rect;
}

const DEFS: { id: string; kind: RoomKind; label: string; index?: number }[] = [
  { id: "entree", kind: "hall", label: "Entrée" },
  { id: "etudes", kind: "studies", label: "Études" },
  { id: "atelier", kind: "workshop", label: "Atelier" },
  ...experiences.map((exp, i) => ({ id: `experience-${i + 1}`, kind: "experience" as const, label: exp.company, index: i })),
  { id: "projets", kind: "projects", label: "Projets" },
  { id: "contact", kind: "contact", label: "Contact" },
];

// Snake layout: left→right on even rows, right→left on odd rows
const cell = (i: number) => {
  const row = Math.floor(i / COLUMNS);
  const col = row % 2 === 0 ? i % COLUMNS : COLUMNS - 1 - (i % COLUMNS);
  return { row, col };
};

function sideTowards(a: { row: number; col: number }, b: { row: number; col: number }): Side {
  if (b.row > a.row) return "s";
  if (b.row < a.row) return "n";
  return b.col > a.col ? "e" : "w";
}

export const ROOMS: Room[] = DEFS.map((def, i) => {
  const here = cell(i);
  const doors: Side[] = [];
  if (i > 0) doors.push(sideTowards(here, cell(i - 1)));
  if (i < DEFS.length - 1) doors.push(sideTowards(here, cell(i + 1)));
  return { ...def, order: i, ...here, x: here.col * PITCH, z: here.row * PITCH, doors };
});

export const CORRIDORS: Corridor[] = ROOMS.slice(1).map((b, i) => {
  const a = ROOMS[i];
  // Corridors reach 1.5 into each room so walkable areas overlap at the doorways
  const reach = ROOM / 2 - 1.5;
  if (a.row === b.row) {
    const [l, r] = a.x < b.x ? [a, b] : [b, a];
    return { id: `${a.id}-${b.id}`, axis: "x", rect: { x0: l.x + reach, x1: r.x - reach, z0: a.z - DOOR / 2, z1: a.z + DOOR / 2 } };
  }
  const [t, btm] = a.z < b.z ? [a, b] : [b, a];
  return { id: `${a.id}-${b.id}`, axis: "z", rect: { x0: a.x - DOOR / 2, x1: a.x + DOOR / 2, z0: t.z + reach, z1: btm.z - reach } };
});

// Furniture footprints in room-local coordinates; must match the props placed in Rooms.tsx
const BLOCKERS: Record<RoomKind, Rect[]> = {
  hall: [
    { x0: -3.4, x1: -1.8, z0: -4.2, z1: -3.6 }, // console
    { x0: 1.3, x1: 2.3, z0: -3.7, z1: -2.7 }, // glyph pedestal
    { x0: -4.0, x1: -3.4, z0: 3.2, z1: 3.8 }, // coat rack
    { x0: 3.4, x1: 4.0, z0: 3.3, z1: 3.9 }, // plant
  ],
  studies: [
    { x0: -3.2, x1: -1.2, z0: -4.2, z1: -3.3 }, // desk
    { x0: -2.5, x1: -1.9, z0: -3.1, z1: -2.5 }, // chair
    { x0: 1.3, x1: 3.5, z0: -4.2, z1: -3.6 }, // bookshelf
    { x0: 2.8, x1: 3.8, z0: 2.5, z1: 3.5 }, // armchair
  ],
  workshop: [
    { x0: -1.8, x1: 1.8, z0: -4.2, z1: -3.2 }, // workbench
    { x0: 3.2, x1: 4.0, z0: -4.0, z1: -3.4 }, // toolbox
    { x0: -3.9, x1: -2.9, z0: -4.2, z1: -3.7 }, // shelf
    { x0: 3.1, x1: 4.0, z0: 3.0, z1: 3.9 }, // crates
  ],
  experience: [
    { x0: -3.7, x1: -1.5, z0: -4.2, z1: -3.3 }, // desk
    { x0: -2.9, x1: -2.3, z0: -3.1, z1: -2.5 }, // chair
    { x0: 3.5, x1: 4.1, z0: -4.1, z1: -3.5 }, // plant
    { x0: 3.6, x1: 4.2, z0: 2.4, z1: 3.6 }, // bookshelf
  ],
  projects: [
    { x0: -4.0, x1: -2.6, z0: -4.0, z1: -3.2 }, // crates
    { x0: 3.1, x1: 3.9, z0: -3.8, z1: -3.0 }, // telescope
    { x0: 3.1, x1: 4.0, z0: 3.0, z1: 3.9 }, // crate
    ...projects.map((_, i) => {
      const x = easelX(i);
      return { x0: x - 0.7, x1: x + 0.7, z0: -3.0, z1: -2.2 };
    }),
  ],
  contact: [
    { x0: 1.9, x1: 2.5, z0: -2.4, z1: -1.6 }, // mailbox
    { x0: -2.7, x1: -2.3, z0: -2.7, z1: -2.3 }, // lamp post
    { x0: -3.9, x1: -3.1, z0: 3.0, z1: 3.8 }, // tree
    { x0: 3.1, x1: 3.9, z0: 3.0, z1: 3.8 }, // tree
    { x0: -1.0, x1: 1.0, z0: 3.4, z1: 3.9 }, // bench
  ],
};

export function easelX(i: number) {
  return -((projects.length - 1) * 2.4) / 2 + i * 2.4;
}

const inner = ROOM / 2 - WALL_T;

const WALKABLE: Rect[] = [
  ...ROOMS.map((r) => ({ x0: r.x - inner, x1: r.x + inner, z0: r.z - inner, z1: r.z + inner })),
  ...CORRIDORS.map((c) => c.rect),
];

export const OBSTACLES: Rect[] = ROOMS.flatMap((r) =>
  BLOCKERS[r.kind].map((b) => ({ x0: r.x + b.x0, x1: r.x + b.x1, z0: r.z + b.z0, z1: r.z + b.z1 }))
);

const inside = (x: number, z: number, r: Rect, pad: number) =>
  x >= r.x0 + pad && x <= r.x1 - pad && z >= r.z0 + pad && z <= r.z1 - pad;

// Can the player stand here?
export function isWalkable(x: number, z: number) {
  return WALKABLE.some((r) => inside(x, z, r, PLAYER_RADIUS)) && !OBSTACLES.some((r) => inside(x, z, r, -PLAYER_RADIUS));
}

export function roomAt(x: number, z: number): Room | undefined {
  return ROOMS.find((r) => Math.abs(x - r.x) <= ROOM / 2 && Math.abs(z - r.z) <= ROOM / 2);
}

export function spawnPoint(room: Room): [number, number] {
  return [room.x, room.z + 1];
}

export const GRID = {
  columns: COLUMNS,
  rows: Math.max(...ROOMS.map((r) => r.row)) + 1,
};

// Counts used to dress the rooms
export const COUNTS = {
  diplomas: education.length,
  skillGroups: skills.length,
  projects: projects.length,
};

// Overlay layout, shared by the camera framing and the HTML panels
export const MOBILE_BREAKPOINT = 768;
export const HEADER_PX = 64;
export const PANEL_MAX_PX = 440;
export const SHEET_BAR_PX = 52;
export const SHEET_OPEN_RATIO = 0.55;
