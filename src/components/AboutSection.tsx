"use client";

import { motion } from "framer-motion";

const skills = [
  { category: "Backend", items: ["PHP 8.4", "Symfony", "API Platform", "Messenger", "Doctrine"] },
  { category: "Frontend", items: ["JavaScript", "TypeScript", "React", "jQuery"] },
  { category: "DevOps", items: ["Git", "Docker", "CI/CD", "Bash"] },
  { category: "Databases", items: ["MySQL", "PostgreSQL"] },
  { category: "Tests", items: ["PHPUnit", "Playwright"] },
  { category: "Qualité", items: ["SOLID", "RGPD", "Sécurité", "Code Review"] },
];

const experiences = [
  {
    company: "SOGEC MARKETING",
    position: "Développeur Back-End",
    period: "Fév. 2024 — Oct. 2024",
    tasks: [
      "Intégration de tâches asynchrones via Symfony Messenger sur toutes les plateformes",
      "Sécurisation du projet : gestion d'accès, RGPD, vérification des fichiers entrants",
      "Optimisation des requêtes SQL",
    ],
  },
  {
    company: "LES-TILLEULS.COOP",
    position: "Développeur Back-End",
    period: "Août 2021 — Déc. 2023",
    tasks: [
      "ASN Téléservices : application pour entreprises avec matériel nucléaire, déclarations d'accidents",
      "Résolution de bugs sur code legacy, création d'API et webservices",
      "eTools : outil d'administration pour boulangeries industrielles",
      "TMA sur CMS multisites réseau d'autopartage (Symfony + Sonata Page)",
    ],
  },
];

const education = [
  { institution: "Faculté de Lens", degree: "Licence Informatique", period: "2019 — 2021" },
  { institution: "Lycée André Malraux", degree: "BTS SIO option SLAM", period: "2017 — 2019" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-6" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeUp}
          className="mb-20 flex items-end justify-between border-b pb-8"
          style={{ borderColor: "var(--border-light)" }}
        >
          <div>
            <p className="section-label mb-3">01 — À Propos</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1 }}>
              Profil
            </h2>
          </div>
          <p
            className="hidden max-w-sm font-body md:block"
            style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: "1.7" }}
          >
            Développeur back-end passionné par l'architecture propre,{" "}
            la performance et les bonnes pratiques.
          </p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          variants={fadeUp}
          className="mb-24"
        >
          <p className="section-label mb-8">Compétences</p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <p
                  className="font-mono-custom mb-4 text-xs tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeUp}
          className="mb-24"
        >
          <p className="section-label mb-8">Expérience</p>
          <div className="space-y-0">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group grid gap-4 border-t py-10 md:grid-cols-[1fr_2fr]"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div>
                  <p
                    className="font-mono-custom text-xs tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {exp.period}
                  </p>
                  <p
                    className="font-display text-xl"
                    style={{ color: "var(--accent)", letterSpacing: "0.04em" }}
                  >
                    {exp.company}
                  </p>
                  <p className="font-body mt-1" style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    {exp.position}
                  </p>
                </div>
                <ul className="space-y-2 self-start pt-1">
                  {exp.tasks.map((task, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 font-body"
                      style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: "1.65" }}
                    >
                      <span style={{ color: "var(--accent)", marginTop: "0.35em", flexShrink: 0 }}>→</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeUp}
        >
          <p className="section-label mb-8">Formation</p>
          <div className="grid gap-0 md:grid-cols-2">
            {education.map((edu, i) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-t py-8 pr-8"
                style={{ borderColor: "var(--border-light)" }}
              >
                <p
                  className="font-mono-custom text-xs tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {edu.period}
                </p>
                <p className="font-display text-2xl" style={{ letterSpacing: "0.04em" }}>
                  {edu.degree}
                </p>
                <p className="font-body mt-1" style={{ color: "var(--accent)", fontSize: "0.875rem" }}>
                  {edu.institution}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
