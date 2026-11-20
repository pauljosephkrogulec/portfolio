"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { education, experiences, profile, projects, skills, socials } from "@/data/portfolio";
import type { ObjKey, PanelId, RoomHandle } from "./scene";
import "./room.css";

const BAR: { key: ObjKey; panel: PanelId; label: string }[] = [
  { key: "laptop", panel: "projets", label: "Projets" },
  { key: "mangas", panel: "parcours", label: "Parcours" },
  { key: "clavier", panel: "competences", label: "Compétences" },
  { key: "lego", panel: "apropos", label: "À propos" },
  { key: "katana", panel: "opensource", label: "Open source" },
  { key: "telephone", panel: "contact", label: "Contact" },
];

const SKILL_ICONS: Record<string, string> = {
  Backend: "{ }",
  Frontend: "</>",
  DevOps: "$_",
  Databases: "DB",
  Tests: "✓",
  Qualité: "★",
};

const phoneHref = "tel:+33" + profile.phone.replace(/\s/g, "").replace(/^0/, "");

function Panel({ id, open, kicker, title, onClose, children }: { id: PanelId; open: boolean; kicker: string; title: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!open) return;
    if (ref.current) ref.current.scrollTop = 0;
    h2.current?.focus({ preventScroll: true });
  }, [open]);
  return (
    <section ref={ref} className={`panel${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open} aria-labelledby={`t-${id}`}>
      <button className="back" type="button" onClick={onClose}>
        ← retour à la chambre
      </button>
      <p className="kicker mono">{kicker}</p>
      <h2 id={`t-${id}`} ref={h2} tabIndex={-1}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function RoomExperience({ className = "", font, monoFont }: { className?: string; font: string; monoFont: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<RoomHandle | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [gl, setGl] = useState<"loading" | "ok" | "none">("loading");
  const [hot, setHot] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [hintGone, setHintGone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let handle: RoomHandle | null = null;
    // three.js n'est chargé que côté client, après le premier rendu
    import("./scene").then(({ createRoom }) => {
      if (cancelled || !canvasRef.current || !labelRef.current) return;
      handle = createRoom({
        canvas: canvasRef.current,
        label: labelRef.current,
        font,
        monoFont,
        ownerName: profile.firstName,
        onHover: setHot,
        onOpen: (p) => setPanel(p),
        onFocusStart: () => {
          openerRef.current = document.activeElement as HTMLElement;
          setHintGone(true);
        },
      });
      roomRef.current = handle;
      setGl(handle ? "ok" : "none");
    });
    return () => {
      cancelled = true;
      handle?.dispose();
      roomRef.current = null;
    };
  }, [font, monoFont]);

  const open = (key: ObjKey, id: PanelId) => {
    if (panel) return;
    if (roomRef.current) roomRef.current.go(key);
    else {
      openerRef.current = document.activeElement as HTMLElement;
      setPanel(id);
    }
  };

  const panelRef = useRef<PanelId | null>(null);
  panelRef.current = panel;
  const close = useCallback(() => {
    if (!panelRef.current) return;
    panelRef.current = null;
    setPanel(null);
    roomRef.current?.close();
    const opener = openerRef.current;
    if (opener && document.contains(opener)) requestAnimationFrame(() => opener.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [close]);

  const inert = panel ? true : undefined;
  const P = (id: PanelId) => ({ id, open: panel === id, onClose: close });

  return (
    <div className={`room ${className}${panel ? " panel-open" : ""}${gl === "none" ? " nogl" : ""}`}>
      <header id="hud" inert={inert}>
        <div className="who">
          <b>
            {profile.firstName} {profile.lastName}
          </b>
          <span>{profile.roles.join(" · ")}</span>
        </div>
        <p className={`hint mono${hintGone ? " gone" : ""}`}>clique sur les objets ✦</p>
        <a className="cv" href={profile.cvUrl} target="_blank" rel="noopener">
          CV ↓
        </a>
      </header>

      <canvas id="scene" ref={canvasRef} aria-hidden="true" inert={inert} hidden={gl === "none"} />
      <div id="label" ref={labelRef} className="mono" aria-hidden="true" />
      {gl === "none" && <p id="fallback" className="mono">Version simple : la 3D n&apos;est pas disponible sur cet appareil.</p>}

      <nav id="objbar" aria-label="Objets de la chambre" inert={inert}>
        {BAR.map((b) => (
          <button key={b.key} type="button" className={hot === b.key ? "hot" : ""} onClick={() => open(b.key, b.panel)}>
            {b.label}
          </button>
        ))}
      </nav>

      <div id="backdrop" onClick={close} />

      <Panel {...P("projets")} kicker="// l'écran du laptop" title={<>Projets <em>récents</em></>}>
        <div className="projects">
          {projects.map((p) => (
            <div key={p.title} className="proj featured">
              <div className="txt">
                {p.status && <span className="badge badge-dev">● {p.status}</span>}
                <small className="mono">{p.tech.slice(0, 4).join(" · ").toUpperCase()}</small>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="chips">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="contact-row">
                  <a href={p.githubUrl} target="_blank" rel="noopener">
                    Code sur GitHub ↗
                  </a>
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener">
                      Voir en ligne ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          <a className="proj more" href={profile.githubUrl} target="_blank" rel="noopener">
            <div className="txt">
              <small className="mono">GITHUB</small>
              <h3>Tous mes dépôts</h3>
              <span className="go">github.com/pauljosephkrogulec ↗</span>
            </div>
          </a>
        </div>
      </Panel>

      <Panel {...P("parcours")} kicker="// la pile de mangas · un tome par étape" title={<>Expériences &amp; <em>formation</em></>}>
        <div className="timeline">
          {[...experiences].reverse().map((e) => (
            <div key={e.company} className="tl-item">
              <div className="tl-date mono">{e.period.toUpperCase()}</div>
              <div>
                <h3>{e.position}</h3>
                <div className="co">{e.company}</div>
                <ul>
                  {e.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {education.map((e) => (
            <div key={e.degree} className="tl-item">
              <div className="tl-date mono">{e.period}</div>
              <div>
                <h3>{e.degree}</h3>
                <div className="co">{e.institution}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel {...P("competences")} kicker="// le clavier 60 %" title={<>Ma <em>stack</em></>}>
        <div className="skills-grid">
          {skills.map((s) => (
            <div key={s.category} className="card3d">
              <div className="ico mono">{SKILL_ICONS[s.category] ?? s.category.slice(0, 2)}</div>
              <h3>{s.category}</h3>
              <div className="chips">
                {s.items.map((i) => (
                  <span key={i}>{i}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel {...P("apropos")} kicker="// le samouraï en Lego" title={<>Propre, <em>robuste</em>, bien testé.</>}>
        <p className="lead">
          Développeur <strong>back-end</strong> spécialisé en <strong>Symfony</strong> et <strong>API Platform</strong>. {profile.tagline}
        </p>
        <p className="tag mono">● {profile.location}</p>
        <div className="stats">
          <div className="stat">
            <b>{experiences.length}</b>
            <span>entreprises</span>
          </div>
          <div className="stat">
            <b>{skills.length}</b>
            <span>domaines de compétences</span>
          </div>
          <div className="stat">
            <b>OSS</b>
            <span>contributeur API Platform</span>
          </div>
        </div>
        <p className="likes mono">Sur le bureau : PHP 8.4 · Symfony · API Platform · Docker · un bol de ramen · des Lego</p>
      </Panel>

      <Panel {...P("opensource")} kicker="// le katana" title={<>Open <em>source</em></>}>
        <p className="lead">
          Je contribue à <strong>API Platform</strong> et je partage mes projets sur GitHub.
        </p>
        <div className="certs">
          {socials
            .filter((s) => !s.href.startsWith("mailto:"))
            .map(({ Icon, label, href, handle }) => (
              <a key={label} className="cert" href={href} target="_blank" rel="noopener">
                <div className="big">
                  <Icon size={34} />
                </div>
                <h3>{label}</h3>
                <span>{handle}</span>
              </a>
            ))}
        </div>
      </Panel>

      <Panel {...P("contact")} kicker="// le téléphone" title={<>Travaillons <em>ensemble.</em></>}>
        <a className="btn" href={profile.cvUrl} target="_blank" rel="noopener">
          Télécharger mon CV ↓
        </a>
        <div className="contact-row">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={phoneHref}>{profile.phone}</a>
          <a href={profile.githubUrl} target="_blank" rel="noopener">
            GitHub ↗
          </a>
        </div>
        <p className="foot mono">
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName} · {profile.location.split(",")[0]} ·{" "}
          <a href="/classique">version classique</a>
        </p>
      </Panel>
    </div>
  );
}
