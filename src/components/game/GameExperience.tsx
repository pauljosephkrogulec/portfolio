"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Map as MapIcon, X } from "lucide-react";
import { profile } from "@/data/portfolio";
import { bindKeyboard, press, release, type Dir } from "./input";
import { ROOMS } from "./level";
import MiniMap from "./MiniMap";
import type { Teleport } from "./Player";
import RoomLabels from "./RoomLabels";
import RoomPanel from "./RoomPanel";

// three.js is client-only and heavy: keep it out of SSR and the initial bundle
const GameCanvas = dynamic(() => import("./GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p className="section-label animate-pulse">Chargement du niveau…</p>
    </div>
  ),
});

function PadButton({ dir, label, children, className }: { dir: Dir; label: string; children: React.ReactNode; className: string }) {
  const start = (e: PointerEvent) => {
    e.preventDefault();
    press(dir);
  };
  const end = () => release(dir);
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={end}
      onPointerCancel={end}
      onContextMenu={(e) => e.preventDefault()}
      className={`flex h-12 w-12 select-none items-center justify-center border active:bg-[var(--accent)] active:text-[var(--bg)] ${className}`}
      style={{ background: "rgba(8,8,8,0.75)", borderColor: "var(--border-light)", color: "var(--text)", touchAction: "none" }}
    >
      {children}
    </button>
  );
}

export default function GameExperience() {
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [teleport, setTeleport] = useState<Teleport>({ id: ROOMS[0].id, n: 0 });
  const [mapOpen, setMapOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const bannerTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];

  const goTo = useCallback((id: string) => {
    setTeleport((t) => ({ id, n: t.n + 1 }));
    setMapOpen(false);
  }, []);

  const onEnterRoom = useCallback((id: string) => {
    setRoomId(id);
    const label = ROOMS.find((r) => r.id === id)?.label ?? null;
    setBanner(label);
    clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 1600);
  }, []);

  useEffect(() => bindKeyboard(), []);
  useEffect(() => () => clearTimeout(bannerTimer.current), []);

  // Deep link: #etudes, #experience-1, ...
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (ROOMS.some((r) => r.id === id)) goTo(id);
  }, [goTo]);

  useEffect(() => {
    const url = roomId === ROOMS[0].id ? window.location.pathname : `#${roomId}`;
    window.history.replaceState(null, "", url);
  }, [roomId]);

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0">
        <GameCanvas
          activeId={roomId}
          teleport={teleport}
          onEnterRoom={onEnterRoom}
          sheetOpen={sheetOpen}
          reducedMotion={!!reducedMotion}
        />
        <RoomLabels activeId={roomId} />
      </div>

      {/* Header */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between px-4 md:px-6"
        style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.9), transparent)" }}
      >
        <button
          type="button"
          onClick={() => goTo(ROOMS[0].id)}
          className="font-display text-xl tracking-wider"
          style={{ color: "var(--accent)" }}
        >
          {profile.firstName} {profile.lastName}
        </button>
        <div className="flex items-center gap-3 md:gap-6">
          <a
            href="/classique"
            className="hidden font-mono-custom hover-accent sm:inline"
            style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}
          >
            Version classique
          </a>
          <button
            type="button"
            onClick={() => setMapOpen((o) => !o)}
            aria-expanded={mapOpen}
            aria-label="Carte des pièces"
            className="btn-outline flex items-center gap-2 md:hidden"
            style={{ padding: "0.5rem 0.9rem" }}
          >
            {mapOpen ? <X size={14} /> : <MapIcon size={14} />}
            Carte
          </button>
          <a href={profile.cvUrl} className="btn-outline" style={{ padding: "0.5rem 1.25rem" }}>
            CV
          </a>
        </div>
      </header>

      {/* Room name when entering */}
      <AnimatePresence>
        {banner && (
          <motion.div
            key={banner}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed left-0 right-0 top-20 z-30 flex justify-center md:right-[calc(min(440px,42vw)+24px)]"
          >
            <p
              className="font-display"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--accent-bright)", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
            >
              {banner}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map: always visible on desktop, toggled on mobile */}
      <div className="fixed bottom-6 left-6 z-30 hidden md:block">
        <MiniMap activeId={roomId} onGo={goTo} />
        <p className="mt-4 font-mono-custom" style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Flèches · WASD · ZQSD pour marcher
        </p>
      </div>
      <AnimatePresence>
        {mapOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed right-4 top-16 z-40 border p-4 md:hidden"
            style={{ background: "rgba(8,8,8,0.95)", borderColor: "var(--border-light)" }}
          >
            <MiniMap activeId={roomId} onGo={goTo} />
            <a
              href="/classique"
              className="mt-4 block font-mono-custom hover-accent"
              style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}
            >
              Version classique →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Touch pad (mobile), hidden while reading */}
      {!sheetOpen && (
        <div className="fixed bottom-[68px] left-4 z-30 grid grid-cols-3 gap-1 md:hidden">
          <PadButton dir="up" label="Haut" className="col-start-2">
            <ChevronUp size={20} />
          </PadButton>
          <PadButton dir="left" label="Gauche" className="col-start-1 row-start-2">
            <ChevronLeft size={20} />
          </PadButton>
          <PadButton dir="down" label="Bas" className="col-start-2 row-start-2">
            <ChevronDown size={20} />
          </PadButton>
          <PadButton dir="right" label="Droite" className="col-start-3 row-start-2">
            <ChevronRight size={20} />
          </PadButton>
        </div>
      )}

      <RoomPanel room={room} open={sheetOpen} onToggle={() => setSheetOpen((o) => !o)} onGo={goTo} />
    </main>
  );
}
