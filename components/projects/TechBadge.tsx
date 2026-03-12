'use client'

import { motion } from 'framer-motion'

export function TechBadge({ tech, index = 0 }: { tech: string, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      className="inline-flex items-center px-3 py-1 rounded-full border border-brand-mid bg-brand-card2 text-xs font-body text-brand-lgray"
    >
      {tech}
    </motion.div>
  )
}
