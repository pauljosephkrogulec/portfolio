"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { C } from "./Furniture";
import { readInput } from "./input";
import { ROOMS, isWalkable, roomAt, spawnPoint } from "./level";
import { playerState } from "./tracker";

const SPEED = 4.5;

export interface Teleport {
  id: string;
  n: number;
}

export default function Player({
  position,
  teleport,
  onEnterRoom,
  reducedMotion,
}: {
  position: MutableRefObject<THREE.Vector3>;
  teleport: Teleport;
  onEnterRoom: (id: string) => void;
  reducedMotion: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const currentRoom = useRef<string | null>(null);
  const walkTime = useRef(0);

  // Jump to a room (start, floor plan, prev/next buttons)
  useEffect(() => {
    const room = ROOMS.find((r) => r.id === teleport.id) ?? ROOMS[0];
    const [x, z] = spawnPoint(room);
    position.current.set(x, 0, z);
    if (root.current) root.current.rotation.y = 0;
  }, [teleport, position]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const pos = position.current;
    const { x: dx, z: dz } = readInput();
    const moving = dx !== 0 || dz !== 0;

    if (moving) {
      // Move each axis separately so the player slides along walls
      const nx = pos.x + dx * SPEED * delta;
      if (isWalkable(nx, pos.z)) pos.x = nx;
      const nz = pos.z + dz * SPEED * delta;
      if (isWalkable(pos.x, nz)) pos.z = nz;
    }

    if (root.current) {
      root.current.position.set(pos.x, 0, pos.z);
      if (moving) {
        const target = Math.atan2(dx, dz);
        let diff = target - root.current.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        root.current.rotation.y += diff * Math.min(1, delta * 12);
      }
    }

    // Little walk bob
    if (body.current) {
      walkTime.current = moving ? walkTime.current + delta : 0;
      const bob = moving && !reducedMotion ? Math.abs(Math.sin(walkTime.current * 11)) * 0.09 : 0;
      body.current.position.y = THREE.MathUtils.damp(body.current.position.y, bob, 20, delta);
      body.current.rotation.x = THREE.MathUtils.damp(body.current.rotation.x, moving ? 0.12 : 0, 10, delta);
    }

    playerState.x = pos.x;
    playerState.z = pos.z;
    playerState.angle = root.current?.rotation.y ?? 0;

    const room = roomAt(pos.x, pos.z);
    if (room && room.id !== currentRoom.current) {
      currentRoom.current = room.id;
      onEnterRoom(room.id);
    }
  });

  return (
    <group ref={root}>
      {/* Blob shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} depthWrite={false} />
      </mesh>
      <group ref={body}>
        {/* Legs */}
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.2, 0]}>
            <capsuleGeometry args={[0.08, 0.22, 4, 8]} />
            <meshStandardMaterial color="#1c1c22" />
          </mesh>
        ))}
        {/* Hoodie */}
        <mesh position={[0, 0.68, 0]}>
          <capsuleGeometry args={[0.26, 0.38, 6, 16]} />
          <meshStandardMaterial color={C.gold} roughness={0.7} />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 0.72, -0.25]}>
          <boxGeometry args={[0.36, 0.42, 0.16]} />
          <meshStandardMaterial color={C.blue} roughness={0.7} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color="#e8c39e" roughness={0.8} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.3, -0.03]} scale={[1, 0.7, 1]}>
          <sphereGeometry args={[0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2a1c12" roughness={0.9} />
        </mesh>
        {/* Eyes */}
        {[-0.08, 0.08].map((x) => (
          <mesh key={x} position={[x, 1.22, 0.21]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
