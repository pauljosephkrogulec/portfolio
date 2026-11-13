"use client";

import { useEffect, useRef } from "react";
import { CORRIDORS, DOOR, GRID, OBSTACLES, PITCH, ROOM, ROOMS, WALL_T } from "./level";
import { playerState } from "./tracker";

// Level bounds in world units, with a small margin
const PAD = 0.8;
const MIN_X = -ROOM / 2 - PAD;
const MIN_Z = -ROOM / 2 - PAD;
const WIDTH = (GRID.columns - 1) * PITCH + ROOM + PAD * 2;
const HEIGHT = (GRID.rows - 1) * PITCH + ROOM + PAD * 2;

// Corridors drawn between rooms, slightly overlapping the walls to open the doorways
const corridorShapes = CORRIDORS.map(({ id, axis, rect }) => {
  const trim = 1.5 - WALL_T - 0.05;
  return axis === "x"
    ? { id, x: rect.x0 + trim, y: rect.z0, w: rect.x1 - rect.x0 - trim * 2, h: DOOR }
    : { id, x: rect.x0, y: rect.z0 + trim, w: DOOR, h: rect.z1 - rect.z0 - trim * 2 };
});

// Top-down plan of the level, with the player at their exact position
export default function MiniMap({ activeId, onGo }: { activeId: string; onGo: (id: string) => void }) {
  const marker = useRef<SVGGElement>(null);
  const active = ROOMS.find((r) => r.id === activeId);

  // Follow the player every frame without re-rendering React
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const { x, z, angle } = playerState;
      marker.current?.setAttribute("transform", `translate(${x.toFixed(2)} ${z.toFixed(2)}) rotate(${((-angle * 180) / Math.PI).toFixed(1)})`);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <nav aria-label="Carte des pièces" className="w-[260px]">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="section-label">Carte</p>
        <p className="font-mono-custom" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          Tu es ici : <span style={{ color: "var(--accent)" }}>{active?.label}</span>
        </p>
      </div>

      <svg
        viewBox={`${MIN_X} ${MIN_Z} ${WIDTH} ${HEIGHT}`}
        className="block w-full border"
        style={{ background: "rgba(8,8,8,0.85)", borderColor: "var(--border-light)", aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        role="img"
        aria-label={`Plan du niveau. Position actuelle : ${active?.label ?? ""}`}
      >
        {/* Rooms */}
        {ROOMS.map((room) => {
          const isActive = room.id === activeId;
          return (
            <g key={room.id} onClick={() => onGo(room.id)} style={{ cursor: "pointer" }}>
              <title>{`Aller à ${room.label}`}</title>
              <rect
                x={room.x - ROOM / 2 + WALL_T / 2}
                y={room.z - ROOM / 2 + WALL_T / 2}
                width={ROOM - WALL_T}
                height={ROOM - WALL_T}
                fill={isActive ? "rgba(200,150,62,0.16)" : "#161412"}
                stroke={isActive ? "#c8963e" : "#3a342d"}
                strokeWidth={WALL_T}
              />
              <text
                x={room.x}
                y={room.z + ROOM / 2 - 1.1}
                textAnchor="middle"
                fontSize={0.95}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing={0.05}
                fill={isActive ? "#e8b050" : "#6b6560"}
                textLength={room.label.length > 11 ? ROOM - 1.6 : undefined}
                lengthAdjust="spacingAndGlyphs"
                style={{ textTransform: "uppercase", pointerEvents: "none" }}
              >
                {room.label}
              </text>
            </g>
          );
        })}

        {/* Corridors and the gold guide line */}
        {corridorShapes.map((c) => (
          <g key={c.id} style={{ pointerEvents: "none" }}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="#161412" />
            <line
              x1={c.w > c.h ? c.x : c.x + c.w / 2}
              y1={c.w > c.h ? c.y + c.h / 2 : c.y}
              x2={c.w > c.h ? c.x + c.w : c.x + c.w / 2}
              y2={c.w > c.h ? c.y + c.h / 2 : c.y + c.h}
              stroke="#c8963e"
              strokeWidth={0.12}
              strokeDasharray="0.5 0.4"
              opacity={0.7}
            />
          </g>
        ))}

        {/* Furniture */}
        {OBSTACLES.map((o, i) => (
          <rect
            key={i}
            x={o.x0}
            y={o.z0}
            width={o.x1 - o.x0}
            height={o.z1 - o.z0}
            fill="#2c2722"
            style={{ pointerEvents: "none" }}
          />
        ))}

        {/* Player: pulse, facing cone, dot */}
        <g ref={marker} style={{ pointerEvents: "none" }}>
          <circle r={0.6} fill="none" stroke="#e8b050" strokeWidth={0.12}>
            <animate attributeName="r" values="0.6;1.6" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <path d="M0 0 L-1.1 2.2 A2.4 2.4 0 0 0 1.1 2.2 Z" fill="#e8b050" opacity={0.3} />
          <circle r={0.5} fill="#e8b050" stroke="#080808" strokeWidth={0.15} />
        </g>
      </svg>

      <p className="mt-2 font-mono-custom" style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
        Clique sur une pièce pour t&apos;y téléporter
      </p>
    </nav>
  );
}
