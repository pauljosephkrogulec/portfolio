"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, ExternalLink, Github, MapPin, Phone } from "lucide-react";
import { education, experiences, profile, projects, skills, socials } from "@/data/portfolio";
import { ROOMS, type Room } from "./level";

function Heading({ room, title }: { room: Room; title: React.ReactNode }) {
  return (
    <div className="mb-6 border-b pb-5" style={{ borderColor: "var(--border-light)" }}>
      <p className="section-label mb-2">
        Pièce {room.order + 1} — {room.label}
      </p>
      <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}>
        {title}
      </h2>
    </div>
  );
}

const muted = { color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.7 } as const;

function Socials() {
  return (
    <div className="flex items-center gap-5">
      {socials.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="hover-accent"
          style={{ color: "var(--text-muted)" }}
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="inline-flex min-w-[1.6rem] items-center justify-center border px-1.5 py-0.5 font-mono-custom"
      style={{ fontSize: "0.7rem", borderColor: "var(--border-light)", color: "var(--text)", background: "var(--surface-2)" }}
    >
      {children}
    </kbd>
  );
}

function Hall() {
  return (
    <>
      <p className="section-label mb-4">{"// Portfolio — 2026"}</p>
      <h1 className="font-display leading-none" style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)" }}>
        {profile.firstName}
        <br />
        <span style={{ color: "var(--accent)" }}>{profile.lastName}</span>
      </h1>
      <p className="mt-4 font-mono-custom" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        <span style={{ color: "var(--accent)" }}>$ </span>
        {profile.roles.join(" · ")}
      </p>

      <div className="mt-6 border p-4" style={{ borderColor: "var(--border-light)", background: "rgba(200,150,62,0.05)" }}>
        <p className="section-label mb-3">Comment jouer</p>
        <div className="flex flex-wrap items-center gap-1.5 font-body" style={muted}>
          <Key>↑</Key>
          <Key>←</Key>
          <Key>↓</Key>
          <Key>→</Key>
          <span className="mx-1">ou</span>
          <Key>W</Key>
          <Key>A</Key>
          <Key>S</Key>
          <Key>D</Key>
          <span className="mx-1">/</span>
          <Key>Z</Key>
          <Key>Q</Key>
          <Key>S</Key>
          <Key>D</Key>
        </div>
        <p className="mt-3 font-body" style={{ ...muted, fontSize: "0.85rem" }}>
          Promène-toi de pièce en pièce : chaque salle raconte une partie de mon parcours. Suis la ligne dorée.
        </p>
      </div>

      <p className="mt-6 font-body" style={muted}>
        Développeur ayant fait ses armes chez <span style={{ color: "var(--text)" }}>Les-Tilleuls.coop</span>.
        Spécialisé en <span style={{ color: "var(--text)" }}>Symfony</span> et{" "}
        <span style={{ color: "var(--text)" }}>API Platform</span>, soucieux de la qualité et en constante veille.
      </p>
      <a
        href={profile.contributorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block font-body hover-accent"
        style={{ color: "var(--accent)" }}
      >
        Contributeur officiel API Platform ↗
      </a>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <a href={profile.cvUrl} className="btn-outline">
          Télécharger le CV
        </a>
        <Socials />
      </div>
    </>
  );
}


function Studies({ room }: { room: Room }) {
  return (
    <>
      <Heading room={room} title="Formation" />
      <div className="space-y-0">
        {education.map((edu) => (
          <div key={edu.institution} className="border-b py-5" style={{ borderColor: "var(--border-light)" }}>
            <p className="mb-2 font-mono-custom text-xs tracking-widest" style={{ color: "var(--text-muted)" }}>
              {edu.period}
            </p>
            <p className="font-display text-2xl" style={{ letterSpacing: "0.04em" }}>
              {edu.degree}
            </p>
            <p className="mt-1 font-body" style={{ color: "var(--accent)", fontSize: "0.875rem" }}>
              {edu.institution}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function Workshop({ room }: { room: Room }) {
  return (
    <>
      <Heading room={room} title="Compétences" />
      <div className="space-y-6">
        {skills.map((group) => (
          <div key={group.category}>
            <p className="mb-3 font-mono-custom text-xs tracking-widest" style={{ color: "var(--accent)" }}>
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Experience({ room }: { room: Room }) {
  const exp = experiences[room.index ?? 0];
  return (
    <>
      <Heading room={room} title={<span style={{ color: "var(--accent)" }}>{exp.company}</span>} />
      <p className="mb-1 font-mono-custom text-xs tracking-widest" style={{ color: "var(--text-muted)" }}>
        {exp.period}
      </p>
      <p className="mb-6 font-body" style={{ color: "var(--text)", fontSize: "1rem" }}>
        {exp.position}
      </p>
      <ul className="space-y-3">
        {exp.tasks.map((task) => (
          <li key={task} className="flex items-start gap-3 font-body" style={muted}>
            <span style={{ color: "var(--accent)", marginTop: "0.1em", flexShrink: 0 }}>→</span>
            {task}
          </li>
        ))}
      </ul>
    </>
  );
}

function Projects({ room }: { room: Room }) {
  return (
    <>
      <Heading room={room} title="Réalisations" />
      <div className="space-y-8">
        {projects.map((project) => (
          <article key={project.title}>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono-custom text-xs tracking-widest" style={{ color: "var(--accent)" }}>
                {project.number}
              </span>
              {project.status && (
                <span
                  className="flex items-center gap-1 font-mono-custom"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#b8933a",
                    background: "rgba(200,150,62,0.1)",
                    border: "1px solid rgba(200,150,62,0.25)",
                    padding: "0.25rem 0.6rem",
                  }}
                >
                  <AlertTriangle size={10} />
                  {project.status}
                </span>
              )}
            </div>
            <h3 className="mb-3 font-display" style={{ fontSize: "2.25rem", lineHeight: 1 }}>
              {project.title}
            </h3>
            <p className="mb-4 font-body" style={muted}>
              {project.description}
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2"
                style={{ padding: "0.6rem 1.25rem" }}
              >
                <Github size={14} />
                Code
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent flex items-center gap-2"
                  style={{ padding: "0.6rem 1.25rem" }}
                >
                  <ExternalLink size={14} />
                  Démo
                </a>
              )}
            </div>
          </article>
        ))}
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body hover-accent"
          style={{ color: "var(--accent)", fontSize: "0.875rem" }}
        >
          Voir tous les projets sur GitHub ↗
        </a>
      </div>
    </>
  );
}

function Contact({ room }: { room: Room }) {
  return (
    <>
      <Heading room={room} title={<>Entrons en <span style={{ color: "var(--accent)" }}>contact</span></>} />
      <p className="mb-8 font-body" style={muted}>
        Disponible pour des missions freelance, des opportunités en CDI ou simplement échanger autour du
        développement back-end. N&apos;hésitez pas à me contacter.
      </p>
      <a href={`mailto:${profile.email}`} className="btn-accent">
        Envoyer un message
      </a>
      <div className="mt-8 space-y-3">
        {[
          { Icon: Phone, text: profile.phone },
          { Icon: MapPin, text: profile.location },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-3 font-body" style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <Icon size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
            {text}
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Socials />
      </div>
    </>
  );
}

const navButton = { fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" } as const;

export default function RoomPanel({
  room,
  open,
  onToggle,
  onGo,
}: {
  room: Room;
  // Mobile only: the sheet is collapsed to a bar until opened
  open: boolean;
  onToggle: () => void;
  onGo: (id: string) => void;
}) {
  const prev = ROOMS[room.order - 1];
  const next = ROOMS[room.order + 1];

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col border-t md:inset-x-auto md:bottom-6 md:right-6 md:top-[88px] md:w-[min(440px,42vw)] md:border"
      style={{
        background: "rgba(8,8,8,0.88)",
        borderColor: "var(--border-light)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        className={`${open ? "block" : "hidden"} h-[calc(55vh-52px)] overflow-y-auto px-6 pb-4 pt-6 md:block md:h-auto md:min-h-0 md:flex-1 md:px-8 md:pt-8`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {room.kind === "hall" && <Hall />}
            {room.kind === "studies" && <Studies room={room} />}
            {room.kind === "workshop" && <Workshop room={room} />}
            {room.kind === "experience" && <Experience room={room} />}
            {room.kind === "projects" && <Projects room={room} />}
            {room.kind === "contact" && <Contact room={room} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bar: room name + shortcuts to the neighbouring rooms */}
      <nav
        className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-t px-4 md:px-8"
        style={{ borderColor: "var(--border-light)" }}
        aria-label="Navigation entre les pièces"
      >
        <button
          type="button"
          onClick={() => prev && onGo(prev.id)}
          disabled={!prev}
          aria-label={prev ? `Aller à ${prev.label}` : undefined}
          className="flex min-w-0 flex-1 items-center gap-2 font-mono-custom hover-accent disabled:opacity-0"
          style={navButton}
        >
          <ArrowLeft size={14} className="shrink-0" />
          <span className="hidden truncate md:inline">{prev?.label}</span>
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex shrink-0 items-center gap-2 font-mono-custom md:pointer-events-none"
          style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}
        >
          {room.order + 1} / {ROOMS.length}
          <span className="md:hidden">· {room.label}</span>
          <span className="md:hidden">{open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}</span>
        </button>

        <button
          type="button"
          onClick={() => next && onGo(next.id)}
          disabled={!next}
          aria-label={next ? `Aller à ${next.label}` : undefined}
          className="flex min-w-0 flex-1 items-center justify-end gap-2 font-mono-custom hover-accent disabled:opacity-0"
          style={navButton}
        >
          <span className="hidden truncate md:inline">{next?.label}</span>
          <ArrowRight size={14} className="shrink-0" />
        </button>
      </nav>
    </aside>
  );
}
