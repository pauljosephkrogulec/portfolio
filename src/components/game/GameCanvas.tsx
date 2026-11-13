"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Player, { type Teleport } from "./Player";
import Rooms from "./Rooms";
import { HEADER_PX, MOBILE_BREAKPOINT, PANEL_MAX_PX, ROOM, ROOMS, SHEET_BAR_PX, SHEET_OPEN_RATIO, WALL_H } from "./level";
import { labelState } from "./tracker";

const CAMERA_OFFSET = new THREE.Vector3(0, 11, 9.5);

// Projects each room's name-tag anchor to screen pixels for the HTML overlay
function LabelProjector() {
  const v = useRef(new THREE.Vector3());
  useFrame(({ camera, size }) => {
    camera.updateMatrixWorld();
    for (const room of ROOMS) {
      v.current.set(room.x, WALL_H + 0.7, room.z - ROOM / 2).project(camera);
      const x = (v.current.x * 0.5 + 0.5) * size.width;
      const y = (-v.current.y * 0.5 + 0.5) * size.height;
      const visible = v.current.z < 1 && x > -100 && x < size.width + 100 && y > -50 && y < size.height + 50;
      labelState[room.id] = { x, y, visible };
    }
  });
  return null;
}

function FollowCamera({
  target,
  sheetOpen,
  reducedMotion,
}: {
  target: React.MutableRefObject<THREE.Vector3>;
  sheetOpen: boolean;
  reducedMotion: boolean;
}) {
  const look = useRef<THREE.Vector3 | null>(null);
  const lastOffset = useRef("");

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const { size } = state;
    const p = target.current;

    // Keep the player centred in the area the overlay leaves free
    const mobile = size.width < MOBILE_BREAKPOINT;
    const panelPx = mobile ? 0 : Math.min(PANEL_MAX_PX, size.width * 0.42) + 24;
    const sheetPx = mobile ? (sheetOpen ? size.height * SHEET_OPEN_RATIO : SHEET_BAR_PX) : 0;
    const ox = Math.round(panelPx / 2);
    const oy = Math.round((sheetPx - HEADER_PX) / 2);
    const key = `${size.width}x${size.height}:${ox},${oy}`;
    if (key !== lastOffset.current) {
      lastOffset.current = key;
      camera.setViewOffset(size.width, size.height, ox, oy, size.width, size.height);
      camera.updateProjectionMatrix();
    }

    const desired = p.clone().add(CAMERA_OFFSET);
    const lookAt = new THREE.Vector3(p.x, 0.6, p.z);
    if (!look.current || reducedMotion) {
      camera.position.copy(desired);
      look.current = lookAt;
    } else {
      const k = 1 - Math.exp(-4 * delta);
      camera.position.lerp(desired, k);
      look.current.lerp(lookAt, k);
    }
    camera.lookAt(look.current);
  });

  return null;
}

export default function GameCanvas({
  activeId,
  teleport,
  onEnterRoom,
  sheetOpen,
  reducedMotion,
}: {
  activeId: string;
  teleport: Teleport;
  onEnterRoom: (id: string) => void;
  sheetOpen: boolean;
  reducedMotion: boolean;
}) {
  const playerPos = useRef(new THREE.Vector3());

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 11, 12], fov: 40, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      fallback={
        <div className="flex h-full items-center justify-center p-6 text-center font-body" style={{ color: "var(--text-muted)" }}>
          Votre navigateur ne supporte pas WebGL.&nbsp;
          <a href="/classique" style={{ color: "var(--accent)" }}>
            Voir la version classique →
          </a>
        </div>
      }
    >
      <color attach="background" args={["#080808"]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#8fa6c4", "#1a120a", 0.6]} />
      <directionalLight position={[6, 14, 8]} intensity={0.9} color="#fff1dc" />

      <Rooms activeId={activeId} />
      <Player position={playerPos} teleport={teleport} onEnterRoom={onEnterRoom} reducedMotion={reducedMotion} />
      <FollowCamera target={playerPos} sheetOpen={sheetOpen} reducedMotion={reducedMotion} />
      <LabelProjector />
    </Canvas>
  );
}
