"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Mail, MapPin, Phone } from "lucide-react";

const socials = [
  { Icon: Github, label: "GitHub", href: "https://github.com/pauljosephkrogulec", handle: "pauljosephkrogulec" },
  { Icon: Twitter, label: "Twitter / X", href: "http://x.com/Paul_josephK", handle: "@Paul_josephK" },
  { Icon: Mail, label: "Email", href: "mailto:krogulec.work@gmail.com", handle: "krogulec.work@gmail.com" },
];

const info = [
  { Icon: Phone, text: "07 81 81 10 33" },
  { Icon: MapPin, text: "Lambersart, 59130 — France" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-32 px-6" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 border-b pb-8"
          style={{ borderColor: "var(--border-light)" }}
        >
          <p className="section-label mb-3">03 — Contact</p>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Entrons en<br />
            <span style={{ color: "var(--accent)" }}>Contact</span>
          </h2>
        </motion.div>

        <div className="grid gap-20 md:grid-cols-[1.2fr_1fr]">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p
              className="font-body mb-10 max-w-md"
              style={{ color: "var(--text-muted)", fontSize: "1.0625rem", lineHeight: "1.75" }}
            >
              Disponible pour des missions freelance, des opportunités en CDI
              ou simplement échanger autour du développement back-end.
              N'hésitez pas à me contacter.
            </p>

            <a href="mailto:krogulec.work@gmail.com" className="btn-accent">
              Envoyer un message
            </a>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-8"
          >
            {/* Info */}
            <div className="space-y-3">
              {info.map(({ Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 font-body"
                  style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}
                >
                  <Icon size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Socials */}
            <div className="space-y-4">
              {socials.map(({ Icon, label, href, handle }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="group flex items-center justify-between border-b py-3 transition-colors duration-200"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={16}
                      className="transition-colors duration-200"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <span
                      className="font-body transition-colors duration-200 group-hover:text-[var(--accent)]"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {handle}
                    </span>
                  </div>
                  <span
                    className="font-mono-custom text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ color: "var(--accent)" }}
                  >
                    ↗
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 flex items-center justify-between border-t pt-8"
          style={{ borderColor: "var(--border-light)" }}
        >
          <p className="font-mono-custom text-xs" style={{ color: "var(--text-muted)" }}>
            © 2025 Paul-Joseph Krogulec
          </p>
          <p className="font-mono-custom text-xs" style={{ color: "var(--text-muted)" }}>
            Construit avec Next.js + Tailwind
          </p>
        </motion.div>
      </div>
    </section>
  );
}
