'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Twitter, Menu, X } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Accueil', href: '#home' },
  { name: 'À Propos', href: '#about' },
  { name: 'Compétences', href: '#skills' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  {
    name: 'X (Twitter)',
    href: 'https://x.com/Paul_josephK',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/paul-joseph-krogulec',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/paul-joseph-krogulec',
    icon: Linkedin,
  },
  {
    name: 'Email',
    href: 'mailto:krogulec.work@gmail.com',
    icon: Mail,
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--bg)]/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container flex justify-between items-center">
        <Link href="#home" className="text-xl font-semibold">
          Paul-Joseph Krogulec
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:opacity-70 transition-opacity text-sm"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Social Links - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {socialLinks.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label={name}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--bg)] border-t border-[var(--border)]">
          <div className="container py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:opacity-70 transition-opacity py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label={name}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}