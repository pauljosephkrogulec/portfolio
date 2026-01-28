"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Code, Database, AlertTriangle } from "lucide-react";

const projects = [
  {
    title: "MangaDex Frontend",
    description: "Application frontend moderne pour parcourir et lire des mangas. Construite avec React et offrant un design responsive pour une visualisation optimale sur tous les appareils.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/pauljosephkrogulec/mangadex-frontend",
    liveUrl: null,
    icon: <Code className="h-6 w-6" />,
    inDevelopment: true
  },
  {
    title: "MangaDex Backend",
    description: "API backend robuste servant des données de mangas avec une gestion efficace des données et des endpoints RESTful. Construite avec Symfony API Platform pour des performances optimales.",
    tech: ["PHP", "Symfony", "API Platform", "SQLite"],
    githubUrl: "https://github.com/pauljosephkrogulec/mangadex-backend",
    liveUrl: null,
    icon: <Database className="h-6 w-6" />,
    inDevelopment: true
  }
];

export default function ProjectsSection() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Projets Vedettes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Voici quelques-uns de mes projets récents qui mettent en valeur mes compétences en développement full-stack
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {project.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    {project.inDevelopment && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        En développement
                      </div>
                    )}
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="group/btn flex-1"
                  >
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Github className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      Voir le code
                    </a>
                  </Button>
                  
                  {project.liveUrl && (
                    <Button 
                      size="sm" 
                      asChild
                      className="group/btn flex-1"
                    >
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Démo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
