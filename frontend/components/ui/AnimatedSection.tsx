'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'section' | 'div';
};

export function AnimatedSection({ children, className = '', delay = 0, as = 'section' }: AnimatedSectionProps) {
  const MotionTag = as === 'div' ? motion.div : motion.section;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </MotionTag>
  );
}

