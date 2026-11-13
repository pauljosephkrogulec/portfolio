"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#c8963e";
const BLUE = "#3d7fa0";

interface HeroSceneProps {
  particleCount?: number;
  reducedMotion?: boolean;
  maxDpr?: number;
}

// A single bar of the "</>" glyph
function Bar({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <RoundedBox args={[0.32, 1.5, 0.32]} radius={0.08} smoothness={4} position={position} rotation={[0, 0, rotation]}>
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
    </RoundedBox>
  );
}

// "</>" built from rounded bars, no font file needed
function CodeGlyph({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const { pointer } = state;
    // Follow the cursor
    const targetY = pointer.x * 0.6 + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.3) * 0.25);
    const targetX = -pointer.y * 0.4;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
  });

  const angle = 0.6;

  return (
    <group ref={group}>
      {/* < */}
      <Bar position={[-1.75, 0.42, 0]} rotation={-angle} />
      <Bar position={[-1.75, -0.42, 0]} rotation={angle} />
      {/* / */}
      <Bar position={[0, 0, 0]} rotation={-0.35} />
      {/* > */}
      <Bar position={[1.75, 0.42, 0]} rotation={angle} />
      <Bar position={[1.75, -0.42, 0]} rotation={-angle} />
    </group>
  );
}

function Particles({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 6 - 1.5,
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: 0.06 + Math.random() * 0.14,
        color: i % 3 === 0 ? BLUE : GOLD,
        cube: i % 2 === 0,
        speed: 0.5 + Math.random() * 1.5,
      })),
    [count]
  );

  return (
    <>
      {items.map((p, i) => (
        <Float
          key={i}
          speed={reducedMotion ? 0 : p.speed}
          rotationIntensity={reducedMotion ? 0 : 1.5}
          floatIntensity={reducedMotion ? 0 : 1.2}
        >
          <mesh position={p.position} rotation={p.rotation} scale={p.scale}>
            {p.cube ? <boxGeometry /> : <octahedronGeometry />}
            <meshStandardMaterial color={p.color} metalness={0.8} roughness={0.3} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Subtle camera parallax toward the cursor
function CameraRig() {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.8, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.5, 2, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ particleCount = 40, reducedMotion = false, maxDpr = 1.75 }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      // Track the pointer on the whole page so the canvas can stay pointer-events: none
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#e8b050" />
      <pointLight position={[-5, -2, -3]} intensity={25} color={BLUE} />

      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.3} floatIntensity={reducedMotion ? 0 : 0.6}>
        <CodeGlyph reducedMotion={reducedMotion} />
      </Float>
      <Particles count={particleCount} reducedMotion={reducedMotion} />
      {!reducedMotion && <CameraRig />}

      {/* Local environment for metallic reflections (no HDR download) */}
      <Environment resolution={256}>
        <Lightformer intensity={2} color="#f0ebe0" position={[0, 5, -5]} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} color={GOLD} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer intensity={1} color={BLUE} position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
      </Environment>
    </Canvas>
  );
}
