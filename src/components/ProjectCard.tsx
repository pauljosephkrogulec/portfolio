'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  image,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6 border border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
    >
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] mb-4">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-[var(--bg)] text-sm rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-3">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
          >
            <Github size={16} />
            Code
          </a>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
          >
            <ExternalLink size={16} />
            Live Demo
          </a>
        )}
      </div>
    </motion.div>
  );
}