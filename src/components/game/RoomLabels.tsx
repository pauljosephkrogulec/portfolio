"use client";

import { useEffect, useRef } from "react";
import { ROOMS } from "./level";
import { labelState } from "./tracker";

// Room names floating above each back wall. Positions come from the 3D scene (see LabelProjector).
export default function RoomLabels({ activeId }: { activeId: string }) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      for (const room of ROOMS) {
        const el = refs.current[room.id];
        const pos = labelState[room.id];
        if (!el) continue;
        if (!pos?.visible) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";
        el.style.transform = `translate(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      {ROOMS.map((room) => (
        <div
          key={room.id}
          ref={(el) => {
            refs.current[room.id] = el;
          }}
          className="absolute left-0 top-0 whitespace-nowrap font-display"
          style={{
            visibility: "hidden",
            fontSize: "1.6rem",
            letterSpacing: "0.06em",
            color: room.id === activeId ? "var(--accent-bright)" : "var(--text-muted)",
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            transition: "color 0.3s",
          }}
        >
          {room.label}
        </div>
      ))}
    </div>
  );
}
