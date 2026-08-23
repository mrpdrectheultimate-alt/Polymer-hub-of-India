'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  className?: string
  hover?: boolean
  glowColor?: string
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  glowColor = 'rgba(79, 143, 255, 0.15)',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        'bg-slate-900/60 backdrop-blur-xl',
        'border border-white/10 hover:border-white/25',
        'rounded-2xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.25)]',
        'transition-all duration-300',
        hover && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      {...props}
    >
      {/* Ambient Radial Glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-50"
        style={{ background: glowColor }}
      />
      
      {/* Top Border Glass Light Catch */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      
      {/* Subtle Inner Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
