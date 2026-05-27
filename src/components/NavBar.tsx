"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "À Propos", href: "#about" },
  { label: "Projets", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,8,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a
          href="#"
          className="font-display text-xl tracking-wider"
          style={{ color: "var(--accent)" }}
        >
          PJK
        </a>

        <nav className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono-custom hover-accent"
              style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            className="btn-outline"
            style={{ padding: "0.5rem 1.25rem" }}
          >
            CV
          </a>
        </nav>
      </div>
    </header>
  );
}
