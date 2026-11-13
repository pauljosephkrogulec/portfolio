"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { experiences } from "@/data/portfolio";
import {
  B,
  Bookshelf,
  C,
  Chair,
  Crate,
  Desk,
  FloorLamp,
  Frame,
  Glyph,
  Lamp,
  Monitor,
  Plant,
  Rug,
  Tree,
} from "./Furniture";
import {
  CORRIDORS,
  CORRIDOR_WALL_H,
  COUNTS,
  DOOR,
  LOW_WALL_H,
  ROOM,
  ROOMS,
  WALL_H,
  WALL_T,
  easelX,
  type Room,
  type RoomKind,
  type Side,
} from "./level";

const NORTH = -ROOM / 2 + WALL_T; // inner face of the north wall
const WALL_Z = NORTH + 0.03; // things hung on the north wall

const THEME: Record<RoomKind, { floor: string; wall: string }> = {
  hall: { floor: "#3a2a1d", wall: "#3b322a" },
  studies: { floor: "#2c2a33", wall: "#2e3442" },
  workshop: { floor: "#33302b", wall: "#3a352e" },
  experience: { floor: "#2a2f36", wall: "#2b3640" },
  projects: { floor: "#2e241c", wall: "#33291f" },
  contact: { floor: "#1d2b1c", wall: C.leaf },
};

// ─── Walls ────────────────────────────────────────────────────

function Wall({ side, door, color }: { side: Side; door: boolean; color: string }) {
  const height = side === "s" ? LOW_WALL_H : WALL_H;
  const along = side === "n" || side === "s" ? "x" : "z";
  const offset = ROOM / 2 - WALL_T / 2;
  const fixed = { n: -offset, s: offset, e: offset, w: -offset }[side];

  const segments: { center: number; length: number }[] = door
    ? [-1, 1].map((sign) => ({ center: sign * (DOOR / 2 + (ROOM - DOOR) / 4), length: (ROOM - DOOR) / 2 }))
    : [{ center: 0, length: ROOM }];

  return (
    <>
      {segments.map(({ center, length }) => {
        const pos: [number, number, number] =
          along === "x" ? [center, height / 2, fixed] : [fixed, height / 2, center];
        const size: [number, number, number] = along === "x" ? [length, height, WALL_T] : [WALL_T, height, length];
        return <B key={center} s={size} p={pos} c={color} ro={0.9} />;
      })}
      {/* Gold lintel over doorways in tall walls */}
      {door && side !== "s" && (
        <B
          s={along === "x" ? [DOOR + 0.2, 0.15, WALL_T + 0.04] : [WALL_T + 0.04, 0.15, DOOR + 0.2]}
          p={along === "x" ? [0, 2.2, fixed] : [fixed, 2.2, 0]}
          c={C.gold}
          m={0.8}
          ro={0.3}
          e={C.gold}
          ei={0.3}
        />
      )}
    </>
  );
}

// ─── Room dressings (positions match BLOCKERS in level.ts) ───

function HallProps() {
  return (
    <>
      <Rug p={[0, 0.01, 0.5]} w={4} d={3} c="#5a2a22" />
      <B s={[1.6, 0.05, 0.45]} p={[-2.6, 0.85, -3.9]} c={C.wood} />
      <B s={[1.5, 0.8, 0.04]} p={[-2.6, 0.42, -4.05]} c={C.darkWood} />
      <Lamp p={[-3.1, 0.88, -3.9]} />
      <Frame p={[-2.6, 1.9, WALL_Z]} w={1.2} h={1.0} inner={C.blue} glow />
      {/* Logo on a pedestal */}
      <B s={[0.8, 0.6, 0.8]} p={[1.8, 0.3, -3.2]} c="#1c1a17" m={0.4} />
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.4}>
        <Glyph p={[1.8, 1.35, -3.2]} scale={0.32} />
      </Float>
      <group position={[-3.7, 0, 3.5]}>
        <B s={[0.05, 1.8, 0.05]} p={[0, 0.9, 0]} c={C.darkWood} />
        <B s={[0.4, 0.04, 0.4]} p={[0, 0.02, 0]} c={C.darkWood} />
        <B s={[0.3, 0.6, 0.15]} p={[0.1, 1.4, 0]} c={C.blue} />
      </group>
      <Plant p={[3.7, 0, 3.6]} />
    </>
  );
}

function StudiesProps() {
  return (
    <>
      <Rug p={[0, 0.01, 0.5]} w={3.5} d={2.5} c="#2c3a4a" />
      <Desk p={[-2.2, 0, -3.65]} w={2} />
      <Chair p={[-2.2, 0, -2.8]} />
      <Lamp p={[-3.0, 0.78, -3.8]} />
      <B s={[0.4, 0.02, 0.3]} p={[-2.0, 0.79, -3.6]} c={C.cream} r={[0, 0.2, 0]} />
      <Bookshelf p={[2.4, 0, -3.95]} w={2.2} seed={3} />
      {/* One framed diploma per education entry */}
      {Array.from({ length: COUNTS.diplomas }, (_, i) => (
        <Frame key={i} p={[-2.8 + i * 1.0, 1.85, WALL_Z]} w={0.75} h={0.55} />
      ))}
      <group position={[3.3, 0, 3.0]}>
        <B s={[1.0, 0.45, 0.9]} p={[0, 0.225, 0]} c={C.red} />
        <B s={[1.0, 0.6, 0.2]} p={[0, 0.7, 0.35]} c={C.red} />
      </group>
      <FloorLamp p={[3.9, 0, 3.9]} />
    </>
  );
}

function WorkshopProps({ active }: { active: boolean }) {
  const n = COUNTS.skillGroups;
  return (
    <>
      <B s={[3.6, 0.08, 0.8]} p={[0, 0.9, -3.65]} c={C.wood} />
      {[-1.6, 1.6].map((x) => (
        <B key={x} s={[0.08, 0.9, 0.7]} p={[x, 0.45, -3.65]} c={C.darkWood} />
      ))}
      <B s={[3.8, 1.2, 0.04]} p={[0, 1.95, WALL_Z]} c="#3b3128" />
      {Array.from({ length: 9 }, (_, i) => (
        <B
          key={i}
          s={[0.06, 0.35 + (i % 3) * 0.12, 0.04]}
          p={[-1.6 + i * 0.4, 1.95, WALL_Z + 0.05]}
          c={i % 2 ? C.metal : C.gold}
          m={0.8}
          ro={0.3}
          r={[0, 0, (i % 2 ? 1 : -1) * 0.15]}
        />
      ))}
      {/* One floating cube per skill group */}
      {Array.from({ length: n }, (_, i) => (
        <Float key={i} speed={active ? 2.5 : 1} rotationIntensity={1.5} floatIntensity={0.5}>
          <mesh position={[-((n - 1) * 0.55) / 2 + i * 0.55, 1.35, -3.65]}>
            <boxGeometry args={[0.28, 0.28, 0.28]} />
            <meshStandardMaterial
              color={i % 2 ? C.blue : C.gold}
              emissive={i % 2 ? C.blue : C.gold}
              emissiveIntensity={active ? 0.7 : 0.2}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
      <B s={[0.7, 0.4, 0.5]} p={[3.6, 0.2, -3.7]} c={C.red} m={0.5} />
      <Bookshelf p={[-3.4, 0, -3.95]} w={1.0} h={1.6} seed={11} />
      <Crate p={[3.4, 0, 3.4]} />
      <Crate p={[3.5, 0.6, 3.5]} r={0.4} s={0.5} />
    </>
  );
}

function ExperienceProps({ index }: { index: number }) {
  const accent = index % 2 ? C.gold : C.blue;
  const tasks = experiences[index]?.tasks.length ?? 0;
  return (
    <>
      <Rug p={[0, 0.01, 0.3]} w={3.5} d={2.6} c={index % 2 ? "#3a2e22" : "#22303a"} />
      <Desk p={[-2.6, 0, -3.65]} w={2.2} />
      <Monitor p={[-3.1, 0.78, -3.8]} color={accent} />
      <Monitor p={[-2.1, 0.78, -3.8]} color={accent} />
      <Chair p={[-2.6, 0, -2.8]} />
      <Plant p={[3.8, 0, -3.8]} />
      {/* Task board: one sticky note per task */}
      <group position={[2.4, 1.7, WALL_Z]}>
        <B s={[1.6, 1.0, 0.03]} p={[0, 0, 0]} c={C.cream} ro={0.6} />
        {Array.from({ length: tasks }, (_, i) => (
          <B
            key={i}
            s={[0.26, 0.26, 0.01]}
            p={[-0.5 + (i % 4) * 0.34, 0.2 - Math.floor(i / 4) * 0.38, 0.025]}
            c={i % 2 ? C.goldBright : "#7fb7d4"}
            r={[0, 0, ((i % 3) - 1) * 0.08]}
          />
        ))}
      </group>
      <Bookshelf p={[3.9, 0, 3.0]} w={1.2} h={1.4} seed={index + 7} r={-Math.PI / 2} />
    </>
  );
}

function ProjectsProps() {
  return (
    <>
      {/* Easel per project */}
      {Array.from({ length: COUNTS.projects }, (_, i) => (
        <group key={i} position={[easelX(i), 0, -2.6]}>
          <B s={[0.06, 1.8, 0.06]} p={[-0.5, 0.9, 0]} c={C.wood} r={[0.1, 0, 0.12]} />
          <B s={[0.06, 1.8, 0.06]} p={[0.5, 0.9, 0]} c={C.wood} r={[0.1, 0, -0.12]} />
          <B s={[0.06, 1.7, 0.06]} p={[0, 0.85, -0.35]} c={C.wood} r={[-0.25, 0, 0]} />
          <group position={[0, 1.3, 0.08]} rotation={[-0.1, 0, 0]}>
            <B s={[1.3, 0.9, 0.05]} p={[0, 0, 0]} c={C.gold} m={0.8} ro={0.3} />
            <B s={[1.2, 0.8, 0.01]} p={[0, 0, 0.03]} c={C.blue} e={C.blue} ei={1.2} />
          </group>
        </group>
      ))}
      <Frame p={[-3.0, 1.8, WALL_Z]} w={1.0} h={0.8} inner={C.gold} glow />
      <Frame p={[3.0, 1.8, WALL_Z]} w={1.0} h={0.8} inner={C.blue} glow />
      <Crate p={[-3.6, 0, -3.6]} />
      <Crate p={[-3.0, 0, -3.6]} r={0.3} s={0.5} />
      <Crate p={[-3.5, 0.6, -3.6]} r={0.6} s={0.45} />
      <Crate p={[3.5, 0, 3.4]} r={0.2} />
      <group position={[3.5, 0, -3.4]}>
        {[-0.2, 0.2].map((x) => (
          <B key={x} s={[0.04, 1, 0.04]} p={[x, 0.5, 0]} c={C.metal} r={[0, 0, x > 0 ? -0.2 : 0.2]} m={0.8} />
        ))}
        <mesh position={[0.15, 1.1, 0]} rotation={[0, 0, -0.9]}>
          <cylinderGeometry args={[0.08, 0.11, 1.1, 16]} />
          <meshStandardMaterial color={C.gold} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </>
  );
}

function ContactProps({ active }: { active: boolean }) {
  const flag = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!flag.current) return;
    flag.current.rotation.z = THREE.MathUtils.damp(flag.current.rotation.z, active ? 0 : -Math.PI / 2, 4, delta);
  });

  return (
    <>
      {/* Mailbox: its flag goes up when you're here */}
      <group position={[2.2, 0, -2.0]}>
        <B s={[0.1, 1.1, 0.1]} p={[0, 0.55, 0]} c={C.darkWood} />
        <B s={[0.45, 0.4, 0.7]} p={[0, 1.3, 0]} c={C.blue} m={0.6} ro={0.4} />
        <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.225, 0.225, 0.7, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={C.blue} metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <B s={[0.3, 0.04, 0.02]} p={[0, 1.3, 0.36]} c="#111111" />
        <group ref={flag} position={[0.25, 1.3, -0.2]}>
          <B s={[0.03, 0.5, 0.03]} p={[0, 0.25, 0]} c={C.metal} />
          <B s={[0.03, 0.15, 0.22]} p={[0, 0.42, 0.11]} c={C.gold} e={C.gold} ei={0.5} />
        </group>
      </group>
      {/* Garden lamp */}
      <group position={[-2.5, 0, -2.5]}>
        <B s={[0.08, 2.2, 0.08]} p={[0, 1.1, 0]} c="#111111" m={0.6} />
        <mesh position={[0, 2.25, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={C.goldBright} emissive={C.goldBright} emissiveIntensity={3} />
        </mesh>
      </group>
      <Tree p={[-3.5, 0, 3.4]} scale={0.7} />
      <Tree p={[3.5, 0, 3.4]} scale={0.7} />
      <group position={[0, 0, 3.65]}>
        <B s={[2, 0.08, 0.45]} p={[0, 0.45, 0]} c={C.wood} />
        {[-0.85, 0.85].map((x) => (
          <B key={x} s={[0.08, 0.45, 0.4]} p={[x, 0.225, 0]} c="#111111" />
        ))}
      </group>
      <Sparkles count={30} scale={[7, 2, 7]} position={[0, 1.2, 0]} size={3} speed={0.3} color={C.goldBright} />
    </>
  );
}

// ─── Room ─────────────────────────────────────────────────────

function RoomView({ room, active }: { room: Room; active: boolean }) {
  const light = useRef<THREE.PointLight>(null);
  const theme = THEME[room.kind];
  const wallColor = room.kind === "experience" && (room.index ?? 0) % 2 ? "#3a3026" : theme.wall;

  useFrame((_, delta) => {
    if (!light.current) return;
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, active ? 28 : 10, 3, delta);
  });

  return (
    <group position={[room.x, 0, room.z]}>
      <B s={[ROOM, 0.2, ROOM]} p={[0, -0.1, 0]} c={theme.floor} ro={0.85} />
      {(["n", "s", "e", "w"] as Side[]).map((side) => (
        <Wall key={side} side={side} door={room.doors.includes(side)} color={wallColor} />
      ))}
      <pointLight ref={light} position={[0, 3.4, 0.5]} color="#ffcf8a" intensity={10} distance={12} decay={1.5} />

      {room.kind === "hall" && <HallProps />}
      {room.kind === "studies" && <StudiesProps />}
      {room.kind === "workshop" && <WorkshopProps active={active} />}
      {room.kind === "experience" && <ExperienceProps index={room.index ?? 0} />}
      {room.kind === "projects" && <ProjectsProps />}
      {room.kind === "contact" && <ContactProps active={active} />}
    </group>
  );
}

function CorridorView({ axis, rect }: { axis: "x" | "z"; rect: { x0: number; x1: number; z0: number; z1: number } }) {
  // The walkable rect reaches 1.5 into each room; only draw the part between them
  const trim = 1.5;
  const x0 = axis === "x" ? rect.x0 + trim : rect.x0;
  const x1 = axis === "x" ? rect.x1 - trim : rect.x1;
  const z0 = axis === "z" ? rect.z0 + trim : rect.z0;
  const z1 = axis === "z" ? rect.z1 - trim : rect.z1;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const w = x1 - x0;
  const d = z1 - z0;

  return (
    <group>
      <B s={[w, 0.2, d]} p={[cx, -0.1, cz]} c="#24201c" ro={0.9} />
      {/* Gold guide line on the floor */}
      <B s={axis === "x" ? [w, 0.01, 0.06] : [0.06, 0.01, d]} p={[cx, 0.005, cz]} c={C.gold} e={C.gold} ei={0.6} />
      {axis === "x"
        ? [-1, 1].map((s) => (
            <B key={s} s={[w, CORRIDOR_WALL_H, WALL_T]} p={[cx, CORRIDOR_WALL_H / 2, cz + s * (DOOR / 2 + WALL_T / 2)]} c="#2a2520" />
          ))
        : [-1, 1].map((s) => (
            <B key={s} s={[WALL_T, CORRIDOR_WALL_H, d]} p={[cx + s * (DOOR / 2 + WALL_T / 2), CORRIDOR_WALL_H / 2, cz]} c="#2a2520" />
          ))}
    </group>
  );
}

export default function Rooms({ activeId }: { activeId: string }) {
  return (
    <>
      {ROOMS.map((room) => (
        <RoomView key={room.id} room={room} active={room.id === activeId} />
      ))}
      {CORRIDORS.map((c) => (
        <CorridorView key={c.id} axis={c.axis} rect={c.rect} />
      ))}
    </>
  );
}
