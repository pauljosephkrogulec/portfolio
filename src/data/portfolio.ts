import { Github, Twitter, Mail, Award, type LucideIcon } from "lucide-react";

export const profile = {
  firstName: "Paul-Joseph",
  lastName: "Krogulec",
  roles: ["Développeur Back-End", "Symfony Expert", "API Platform"],
  tagline: "Développeur back-end passionné par l'architecture propre, la performance et les bonnes pratiques.",
  email: "krogulec.work@gmail.com",
  phone: "07 81 81 10 33",
  location: "Lambersart, 59130 — France",
  githubUrl: "https://github.com/pauljosephkrogulec",
  contributorUrl: "https://api-platform.com/community/contributors/pauljosephkrogulec/",
  cvUrl: "/cv.pdf",
};

export const skills = [
  { category: "Backend", items: ["PHP 8.4", "Symfony", "API Platform", "Messenger", "Doctrine"] },
  { category: "Frontend", items: ["JavaScript", "TypeScript", "React", "jQuery"] },
  { category: "DevOps", items: ["Git", "Docker", "CI/CD", "Bash"] },
  { category: "Databases", items: ["MySQL", "PostgreSQL"] },
  { category: "Tests", items: ["PHPUnit", "Playwright"] },
  { category: "Qualité", items: ["SOLID", "RGPD", "Sécurité", "Code Review"] },
];

export const experiences = [
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
];

export const education = [
  { institution: "Faculté de Lens", degree: "Licence Informatique", period: "2019 — 2021" },
  { institution: "Lycée André Malraux", degree: "BTS SIO option SLAM", period: "2017 — 2019" },
];

export interface Project {
  number: string;
  title: string;
  status: string | null;
  description: string;
  tech: string[];
  githubUrl: string;
  liveUrl: string | null;
}

export const projects: Project[] = [
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

export const socials: { Icon: LucideIcon; label: string; href: string; handle: string }[] = [
  { Icon: Github, label: "GitHub", href: profile.githubUrl, handle: "pauljosephkrogulec" },
  { Icon: Twitter, label: "Twitter / X", href: "http://x.com/Paul_josephK", handle: "@Paul_josephK" },
  { Icon: Award, label: "API Platform", href: profile.contributorUrl, handle: "Contributor" },
  { Icon: Mail, label: "Email", href: `mailto:${profile.email}`, handle: profile.email },
];
