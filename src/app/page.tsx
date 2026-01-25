
'use client';

import { motion } from 'framer-motion';
import { Code, Database, Server, Globe, Smartphone, Zap, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Section from '@/components/Section';
import SkillCard from '@/components/SkillCard';
import Footer from '@/components/Footer';

const skills = [
  {
    title: "Framework Symfony",
    level: 5,
    description: "Expert en développement Symfony, incluant la maintenance du code legacy et les meilleures pratiques modernes",
    icon: <Server size={24} />
  },
  {
    title: "API Platform",
    level: 5,
    description: "Spécialisé dans la construction d'API RESTful et de points de terminaison GraphQL avec API Platform",
    icon: <Globe size={24} />
  },
  {
    title: "Gestion de Base de Données",
    level: 4,
    description: "Compétent en MySQL et PostgreSQL avec expertise en optimisation de requêtes",
    icon: <Database size={24} />
  },
  {
    title: "Tests & Assurance Qualité",
    level: 4,
    description: "Expérimenté avec PHPUnit et Playwright pour des tests complets",
    icon: <Zap size={24} />
  },
  {
    title: "Pratiques DevOps",
    level: 3,
    description: "Workflow Git, conteneurisation Docker, et gestion de pipelines CI/CD",
    icon: <Smartphone size={24} />
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      
      {/* Hero Section */}
      <Section id="home" className="pt-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Paul-Joseph Krogulec
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8"
          >
            Développeur backend spécialisé en Symfony et API Platform. Expérimenté dans la création d&apos;applications web robustes avec du code propre et efficace suivant les meilleures pratiques.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-2 text-sm">
              <Code size={18} />
              <span>Spécialiste Symfony</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Server size={18} />
              <span>Expert API Platform</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap size={18} />
              <span>Développeur Axé Qualité</span>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* About Section */}
      <Section id="about" title="À Propos de Moi" className="bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-6">
              Bonjour ! Je suis Paul-Joseph, un développeur backend dédié qui a perfectionné mes compétences chez LesTilleuls.coop. Je me spécialise dans le développement Symfony et API Platform, avec un fort accent sur la qualité du code et les meilleures pratiques.
            </p>
            
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-6">
              Mon parcours dans le développement logiciel a commencé par une passion pour comprendre comment les systèmes fonctionnent sous le capot. Pendant mon passage chez LesTilleuls.coop, j&apos;ai développé une expertise approfondie dans le framework Symfony, API Platform, et le développement backend de niveau entreprise. J&apos;ai travaillé sur des applications critiques desservant des clients de l&apos;industrie nucléaire et des boulangeries industrielles, en me concentrant sur la maintenance du code legacy, la résolution de bugs, et la construction de solutions API robustes.
            </p>
            
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-6">
              Quand je ne code pas, je reste engagé avec la communauté des développeurs grâce à l&apos;apprentissage continu et en suivant les meilleures pratiques de l&apos;industrie. Je suis particulièrement passionné par les avancées de l&apos;écosystème Symfony et les approches de développement centrées sur les API.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Ce Que Je Fais</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Développement avec le framework Symfony
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Implémentation API Platform
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Maintenance et refonte du code legacy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Développement d&apos;applications de niveau entreprise
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Mon Approche</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Développement axé sur la qualité
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Sécurité et conformité RGPD
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Gestion des tâches asynchrones
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Optimisation des requêtes SQL
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Skills Section */}
      <Section id="skills" title="Compétences & Expertise">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.title}
              title={skill.title}
              level={skill.level}
              description={skill.description}
              icon={skill.icon}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-semibold mb-4">Technologies avec lesquelles je travaille</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["PHP", "Symfony", "API Platform", "MySQL", "PostgreSQL", "JavaScript", "React", "jQuery", "Git", "Docker", "Bash", "PHPUnit", "Playwright", "Messenger", "Sonata Admin"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white border border-[var(--border)] rounded-full text-sm hover:border-[var(--accent)] transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Portfolio Section */}
      <Section id="portfolio" title="Mon Portfolio" className="bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-6">
              Bienvenue sur mon portfolio professionnel ! Ici, vous découvrirez mon parcours, mes compétences techniques et mon approche du développement backend.
            </p>
            
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-6">
              En tant que développeur spécialisé en Symfony et API Platform, je m&apos;engage à créer des applications web robustes, sécurisées et évolutives. Mon expertise s&apos;appuie sur plusieurs années d&apos;expérience dans le développement d&apos;applications d&apos;entreprise pour des secteurs critiques comme l&apos;industrie nucléaire et la boulangerie industrielle.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Expertise Technique</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Architecture d&apos;applications Symfony
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Développement d&apos;API RESTful et GraphQL
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Intégration de services web sécurisés
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Maintenance et modernisation du code legacy
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Valeurs</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Qualité et excellence du code
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Sécurité et conformité RGPD
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Collaboration et communication
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    Veille technologique continue
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-[var(--border)]">
              <h3 className="text-xl font-semibold mb-4">Approche de Travail</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Je combine une solide expertise technique avec une approche méthodique et rigoureuse. Chaque projet commence par une analyse approfondie des besoins, suivie d&apos;une conception architecturale réfléchie et d&apos;un développement itératif avec des tests automatisés.
              </p>
              <p className="text-[var(--text-secondary)]">
                Mon objectif est de livrer des solutions qui ne répondent pas seulement aux exigences actuelles, mais qui sont également évolutives et maintenables à long terme.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" title="Contactez-Moi">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-[var(--text-secondary)] mb-8"
          >
            Vous avez un projet en tête ou souhaitez collaborer ? N&apos;hésitez pas à me contacter !
            Je suis toujours intéressé par de nouvelles opportunités et défis.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <a
              href="mailto:krogulec.work@gmail.com"
              className="flex items-center gap-3 px-6 py-3 bg-white border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            >
              <Mail size={20} />
              <span>M&apos;Envoyer un Email</span>
            </a>
            <a
              href="https://linkedin.com/in/paul-joseph-krogulec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-white border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            >
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/paul-joseph-krogulec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-white border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            >
              <span>GitHub</span>
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-8 border border-[var(--border)]"
          >
            <h3 className="text-xl font-semibold mb-4">Restons Connectés</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Que vous ayez une idée de projet, besoin de consultation technique, ou simplement envie de discuter technologie, j&apos;aimerais beaucoup avoir de vos nouvelles.
            </p>
            <p className="text-[var(--text-secondary)]">
              Disponible pour du travail à temps plein.
            </p>
          </motion.div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
