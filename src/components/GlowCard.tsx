// src/components/GlowCard.tsx — Light Sweep & Hover Glow Card
'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
}

export function GlowCard({ children, className = '' }: GlowCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover={{
        y: -4,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none -translate-x-full"
        whileHover={{
          translateX: '200%',
        }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />
      {children}
    </motion.div>
  )
}
