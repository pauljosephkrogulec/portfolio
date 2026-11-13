"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type V3 = [number, number, number];

export const C = {
  wood: "#5a3d26",
  darkWood: "#2e2016",
  metal: "#8a8f96",
  gold: "#c8963e",
  goldBright: "#e8b050",
  blue: "#3d7fa0",
  cream: "#f0ebe0",
  leaf: "#1f3324",
  night: "#0f1a2a",
  red: "#7a2e2e",
};

// Small box helper, most props are made of these
export function B({
  s,
  p,
  c,
  r,
  e,
  ei = 1,
  m = 0.1,
  ro = 0.8,
}: {
  s: V3;
  p: V3;
  c: string;
  r?: V3;
  e?: string;
  ei?: number;
  m?: number;
  ro?: number;
}) {
  return (
    <mesh position={p} rotation={r}>
      <boxGeometry args={s} />
      <meshStandardMaterial
        color={c}
        emissive={e ?? "#000000"}
        emissiveIntensity={e ? ei : 0}
        metalness={m}
        roughness={ro}
      />
    </mesh>
  );
}

export function Desk({ p, w = 1.6 }: { p: V3; w?: number }) {
  return (
    <group position={p}>
      <B s={[w, 0.06, 0.7]} p={[0, 0.75, 0]} c={C.wood} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <B key={`${sx}${sz}`} s={[0.05, 0.75, 0.05]} p={[sx * (w / 2 - 0.06), 0.375, sz * 0.29]} c={C.darkWood} />
        ))
      )}
    </group>
  );
}

export function Chair({ p, r = 0 }: { p: V3; r?: number }) {
  return (
    <group position={p} rotation={[0, r, 0]}>
      <B s={[0.5, 0.06, 0.5]} p={[0, 0.48, 0]} c={C.darkWood} />
      <B s={[0.5, 0.55, 0.05]} p={[0, 0.78, 0.23]} c={C.darkWood} />
      <B s={[0.05, 0.48, 0.05]} p={[0, 0.24, 0]} c={C.metal} m={0.8} ro={0.3} />
    </group>
  );
}

export function Monitor({ p, color }: { p: V3; color: string }) {
  return (
    <group position={p}>
      <B s={[0.75, 0.45, 0.04]} p={[0, 0.32, 0]} c="#111111" />
      <B s={[0.68, 0.38, 0.01]} p={[0, 0.32, 0.025]} c={color} e={color} ei={1.6} />
      <B s={[0.05, 0.12, 0.05]} p={[0, 0.06, 0]} c={C.metal} m={0.8} />
    </group>
  );
}

export function Lamp({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <B s={[0.16, 0.03, 0.16]} p={[0, 0.015, 0]} c={C.metal} m={0.8} />
      <B s={[0.03, 0.4, 0.03]} p={[0, 0.2, 0]} c={C.metal} m={0.8} />
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={C.goldBright} emissive={C.goldBright} emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

export function FloorLamp({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <B s={[0.3, 0.04, 0.3]} p={[0, 0.02, 0]} c="#111111" m={0.6} />
      <B s={[0.05, 1.6, 0.05]} p={[0, 0.8, 0]} c="#111111" m={0.6} />
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.3, 16, 1, true]} />
        <meshStandardMaterial color={C.cream} emissive={C.goldBright} emissiveIntensity={1.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Plant({ p, scale = 1 }: { p: V3; scale?: number }) {
  return (
    <group position={p} scale={scale}>
      <B s={[0.3, 0.35, 0.3]} p={[0, 0.175, 0]} c="#6b4a33" />
      <mesh position={[0, 0.65, 0]}>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color={C.leaf} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

export function Bookshelf({ p, w = 1.4, h = 2.2, seed = 1, r = 0 }: { p: V3; w?: number; h?: number; seed?: number; r?: number }) {
  const shelves = 4;
  const books = useMemo(() => {
    const colors = [C.gold, C.blue, C.red, C.cream, "#4a5a3a"];
    const list: { x: number; y: number; h: number; c: string }[] = [];
    let n = seed;
    const rand = () => (n = (n * 9301 + 49297) % 233280) / 233280;
    for (let s = 0; s < shelves; s++) {
      let x = -w / 2 + 0.1;
      while (x < w / 2 - 0.15) {
        const bh = Math.min(0.25 + rand() * 0.15, h / shelves - 0.08);
        list.push({ x, y: (s * h) / shelves + 0.05 + bh / 2, h: bh, c: colors[Math.floor(rand() * colors.length)] });
        x += 0.08 + rand() * 0.04;
      }
    }
    return list;
  }, [w, h, seed]);

  return (
    <group position={p} rotation={[0, r, 0]}>
      <B s={[w, h, 0.04]} p={[0, h / 2, -0.18]} c={C.darkWood} />
      {[-1, 1].map((sx) => (
        <B key={sx} s={[0.04, h, 0.4]} p={[(sx * w) / 2, h / 2, 0]} c={C.darkWood} />
      ))}
      {Array.from({ length: shelves + 1 }, (_, s) => (
        <B key={s} s={[w, 0.04, 0.4]} p={[0, (s * h) / shelves + 0.02, 0]} c={C.darkWood} />
      ))}
      {books.map((b, i) => (
        <B key={i} s={[0.06, b.h, 0.28]} p={[b.x, b.y, 0]} c={b.c} />
      ))}
    </group>
  );
}

export function Frame({ p, w, h, inner = C.cream, glow = false }: { p: V3; w: number; h: number; inner?: string; glow?: boolean }) {
  return (
    <group position={p}>
      <B s={[w, h, 0.04]} p={[0, 0, 0]} c={C.gold} m={0.8} ro={0.3} />
      <B s={[w - 0.08, h - 0.08, 0.01]} p={[0, 0, 0.025]} c={inner} e={glow ? inner : undefined} ei={0.6} />
    </group>
  );
}

export function Rug({ p, w, d, c }: { p: V3; w: number; d: number; c: string }) {
  return <B s={[w, 0.02, d]} p={p} c={c} ro={1} />;
}

export function Crate({ p, r = 0, s = 0.6 }: { p: V3; r?: number; s?: number }) {
  return (
    <group position={p} rotation={[0, r, 0]}>
      <B s={[s, s, s]} p={[0, s / 2, 0]} c={C.wood} />
      <B s={[s + 0.02, 0.06, s + 0.02]} p={[0, s * 0.8, 0]} c={C.darkWood} />
      <B s={[s + 0.02, 0.06, s + 0.02]} p={[0, s * 0.2, 0]} c={C.darkWood} />
    </group>
  );
}

export function Tree({ p, scale = 1 }: { p: V3; scale?: number }) {
  return (
    <group position={p} scale={scale}>
      <B s={[0.3, 1.6, 0.3]} p={[0, 0.8, 0]} c="#3a2a1d" />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 1.9 + i * 0.85, 0]}>
          <coneGeometry args={[1.5 - i * 0.35, 1.6, 7]} />
          <meshStandardMaterial color={C.leaf} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// The "</>" logo made of rounded bars, slowly spinning
export function Glyph({ p, scale = 1, spin = true }: { p: V3; scale?: number; spin?: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current && spin) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.6;
  });
  const bar = (pos: V3, rot: number, key: string) => (
    <RoundedBox key={key} args={[0.32, 1.5, 0.32]} radius={0.08} smoothness={4} position={pos} rotation={[0, 0, rot]}>
      <meshStandardMaterial color={C.gold} metalness={0.9} roughness={0.25} emissive={C.gold} emissiveIntensity={0.15} />
    </RoundedBox>
  );
  return (
    <group ref={group} position={p} scale={scale}>
      {bar([-1.75, 0.42, 0], -0.6, "a")}
      {bar([-1.75, -0.42, 0], 0.6, "b")}
      {bar([0, 0, 0], -0.35, "c")}
      {bar([1.75, 0.42, 0], 0.6, "d")}
      {bar([1.75, -0.42, 0], -0.6, "e")}
    </group>
  );
}
