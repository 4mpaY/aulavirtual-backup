'use client'

import { forwardRef, type ReactNode } from 'react'

import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

const AnimatedSection = forwardRef<HTMLDivElement, Props>(({ children, className = '', delay = 0 }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
))

AnimatedSection.displayName = 'AnimatedSection'

export default AnimatedSection
