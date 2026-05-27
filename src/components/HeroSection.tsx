"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Mail } from "lucide-react";

const roles = ["Développeur Back-End", "Symfony Expert", "API Platform"];

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const current = roles[roleIndex];

    if (typing) {
      if (displayed.length < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 60);
      } else {
        timeoutRef.current = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 35);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, typing, roleIndex]);

  return (
    <section className="relative flex h-screen flex-col justify-center overflow-hidden grid-bg px-6">
      {/* Background big text */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display text-[22vw] leading-none opacity-[0.025]"
        style={{ color: "var(--accent)" }}
        aria-hidden
      >
        {"</>"}
      </div>

      {/* Decorative vertical line */}
      <div
        className="absolute left-6 top-0 bottom-0 w-px"
        style={{ background: "var(--border-light)" }}
      />

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 section-label"
        >
          {"// Portfolio — 2025"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display leading-none"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
        >
          Paul-Joseph
          <br />
          <span style={{ color: "var(--accent)" }}>Krogulec</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex items-center gap-2 font-mono-custom"
          style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", color: "var(--text-muted)" }}
        >
          <span style={{ color: "var(--accent)" }}>$</span>
          <span>{displayed}</span>
          <span className="cursor-blink" style={{ color: "var(--accent)" }}>▋</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 max-w-xl font-body"
          style={{ color: "var(--text-muted)", fontSize: "1.0625rem", lineHeight: "1.7" }}
        >
          Développeur ayant fait ses armes chez{" "}
          <span style={{ color: "var(--text)" }}>Les-Tilleuls.coop</span>.
          Spécialisé en{" "}
          <span style={{ color: "var(--text)" }}>Symfony</span> et{" "}
          <span style={{ color: "var(--text)" }}>API Platform</span>, soucieux
          de la qualité et en constante veille.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#projects" className="btn-accent">
            Voir mes projets
          </a>
          <a href="#contact" className="btn-outline">
            Me contacter
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12 flex items-center gap-5"
        >
          {[
            { Icon: Github, href: "https://github.com/pauljosephkrogulec", label: "GitHub" },
            { Icon: Twitter, href: "http://x.com/Paul_josephK", label: "Twitter" },
            { Icon: Mail, href: "mailto:krogulec.work@gmail.com", label: "Email" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-accent transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-6 flex flex-col items-center gap-3"
      >
        <span className="section-label" style={{ writingMode: "vertical-rl", letterSpacing: "0.15em" }}>
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px"
          style={{ height: "48px", background: "linear-gradient(to bottom, var(--accent), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
