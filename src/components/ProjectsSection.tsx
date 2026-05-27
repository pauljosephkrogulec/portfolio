"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, AlertTriangle } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "MangaDex",
    status: "En développement",
    description:
      "Plateforme de lecture de manga full-stack. Frontend PWA avec Next.js 15 et React 19, backend API robuste avec Symfony 7.2 et API Platform. Mises à jour en temps réel, interface d'administration automatique, support REST, GraphQL et Hydra.",
    tech: ["PHP 8.4", "Symfony 7.2", "API Platform", "Next.js 15", "React 19", "TypeScript", "PostgreSQL", "Docker", "Kubernetes", "Tailwind CSS"],
    githubUrl: "https://github.com/pauljosephkrogulec/mangadex",
    liveUrl: null,
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-32 px-6"
      style={{ background: "var(--surface)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex items-end justify-between border-b pb-8"
          style={{ borderColor: "var(--border-light)" }}
        >
          <div>
            <p className="section-label mb-3">02 — Projets</p>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1 }}
            >
              Réalisations
            </h2>
          </div>
        </motion.div>

        {/* Projects list */}
        <div className="space-y-0">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative border-b py-14"
              style={{ borderColor: "var(--border-light)" }}
            >
              {/* Large background number */}
              <span
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display leading-none opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]"
                style={{ fontSize: "12rem", color: "var(--accent)" }}
                aria-hidden
              >
                {project.number}
              </span>

              <div className="relative grid gap-10 md:grid-cols-[1fr_1.6fr]">
                {/* Left column */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-mono-custom text-xs tracking-widest"
                      style={{ color: "var(--accent)" }}
                    >
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

                  <h3
                    className="font-display mb-6 transition-colors duration-300 group-hover:text-[var(--accent-bright)]"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, color: "var(--text)" }}
                  >
                    {project.title}
                  </h3>

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
                </div>

                {/* Right column */}
                <div>
                  <p
                    className="font-body mb-8"
                    style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: "1.75" }}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* More projects CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/pauljosephkrogulec"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <Github size={14} />
            Voir tous les projets sur GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
