'use client';

import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ id, title, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="container">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mb-12 text-center"
          >
            {title}
          </motion.h2>
        )}
        {children}
      </div>
    </section>
  );
}