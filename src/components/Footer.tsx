'use client';

import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const socialLinks = [
  {
    name: 'X (Twitter)',
    href: 'https://x.com/Paul_josephK',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/pauljosephkrogulec',
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

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--border)]">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[var(--text-secondary)]">
              © {new Date().getFullYear()} Paul-Joseph Krogulec. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label={name}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}