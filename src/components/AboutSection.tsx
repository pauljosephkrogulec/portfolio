import { motion } from "framer-motion";
import { Code, Database, Globe, Shield, Wrench, TestTube, Mail, Phone, MapPin, Briefcase, GraduationCap } from "lucide-react";

const skills = [
  {
    icon: Code,
    title: "Backend",
    description: "PHP, Symfony, API Platform",
  },
  {
    icon: Globe,
    title: "Frontend",
    description: "JavaScript, React, jQuery",
  },
  {
    icon: Wrench,
    title: "DevOps",
    description: "Git, Docker, Bash, CI/CD",
  },
  {
    icon: Database,
    title: "Base de Données",
    description: "MySQL, PostgreSQL",
  },
  {
    icon: TestTube,
    title: "Tests",
    description: "PHP Unit, Playwright",
  },
  {
    icon: Shield,
    title: "Qualité",
    description: "Bonnes pratiques, sécurité, RGPD",
  },
];

const experiences = [
  {
    company: "SOGEC MARKETING",
    position: "Développeur Back-End",
    period: "Février 2024 – Octobre 2024",
    tasks: [
      "Ajout des Taches Asynchrone (Messenger sur toutes les plateformes)",
      "Sécurisation du projet (gestion d'accès aux données, gestion de la RGPD, gestion et vérification des fichiers entrant)",
      "Optimisation des requêtes SQL"
    ]
  },
  {
    company: "LES-TILLEULS",
    position: "Développeur Back-End",
    period: "Août 2021 – Décembre 2023",
    tasks: [
      "Projet Asn téléservices : Application pour entreprises avec matériel nucléaire, déclarations d'accidents",
      "Intervention sur du code legacy, recherche et résolution de bug",
      "Création d'API avec webservices",
      "Projet eTools : Outil d'administration pour boulangeries industrielles",
      "TMA sur CMS multisites réseau d'autopartage avec Symfony et Sonata Page"
    ]
  }
];

const education = [
  {
    institution: "Faculté de Lens",
    degree: "Licence Informatique",
    period: "2019 - 2021"
  },
  {
    institution: "Lycée Andrée Malraux",
    degree: "BTS SIO option SLAM",
    period: "2017 - 2019"
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="relative min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-primary">
            À Propos
          </p>
          <h1 className="font-display text-4xl font-light md:text-5xl lg:text-6xl mb-4">
            Paul-Joseph <span className="text-gradient-sakura">Krogulec</span>
          </h1>
          <h2 className="font-display text-2xl font-medium text-muted-foreground mb-8">
            Développeur Back-End
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-display text-xl font-medium mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact
              </h3>
              <div className="space-y-2 font-body text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  krogulec.work@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  07 81 81 10 33
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Rue Flament reboux, 59130 Lambersart
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-medium mb-4">Présentation</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Développeur ayant fait ses armes chez LesTilleuls.coop. 
                Connaissances de Symfony, Api-Platform et des bonnes pratiques. 
                Soucieux de la qualité et en constante veille.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-3xl font-light text-center mb-12">
            <span className="text-gradient-sakura">Compétences</span>
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card group p-6 transition-all duration-500 hover:glow-sakura"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
                  <skill.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2 font-display text-xl font-medium text-foreground">
                  {skill.title}
                </h4>
                <p className="font-body text-muted-foreground text-sm">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="font-display text-3xl font-light text-center mb-12">
            <span className="text-gradient-sakura">Expérience</span>
          </h3>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h4 className="font-display text-2xl font-medium text-foreground flex items-center gap-2">
                      <Briefcase className="h-6 w-6 text-primary" />
                      {exp.position}
                    </h4>
                    <p className="font-body text-lg text-primary mt-1">{exp.company}</p>
                  </div>
                  <p className="font-body text-muted-foreground mt-2 md:mt-0">{exp.period}</p>
                </div>
                <ul className="space-y-2">
                  {exp.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="font-body text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="font-display text-3xl font-light text-center mb-12">
            <span className="text-gradient-sakura">Formation</span>
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {education.map((edu, index) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <h4 className="font-display text-xl font-medium text-foreground flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {edu.degree}
                </h4>
                <p className="font-body text-primary mt-1">{edu.institution}</p>
                <p className="font-body text-muted-foreground text-sm mt-2">{edu.period}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
