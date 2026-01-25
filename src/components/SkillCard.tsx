'use client';

import { motion } from 'framer-motion';

interface SkillCardProps {
  title: string;
  level: number; // 1-5 scale
  description?: string;
  icon?: React.ReactNode;
}

export default function SkillCard({ title, level, description, icon }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6 border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="text-[var(--accent)] mt-1">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-[var(--text-secondary)] text-sm mb-3">
              {description}
            </p>
          )}
          
          {/* Skill Level Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Proficiency</span>
              <span>{level}/5</span>
            </div>
            <div className="w-full bg-[var(--bg)] rounded-full h-2">
              <div
                className="bg-[var(--accent)] h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(level / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}