'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  variant?: 'standard' | 'hero' | 'glass' | 'gradient'
  hover?: boolean
  className?: string
  onClick?: () => void
}

export function Card({
  children,
  variant = 'standard',
  hover = true,
  className,
  onClick,
}: CardProps) {
  const variants = {
    standard: 'bg-white border-2 border-slate-900 shadow-sm hover:shadow-xl',
    hero: 'bg-white border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0A1628]',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white',
    gradient: 'bg-gradient-to-br from-[#0A1628] to-[#1A2E4A] border-2 border-slate-900 text-white',
  }

  return (
    <motion.div
      className={cn(
        'rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300',
        variants[variant],
        hover && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { y: -4 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
