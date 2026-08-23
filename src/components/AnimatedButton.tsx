// src/components/AnimatedButton.tsx — Spring Press & 3D Tactile Button
'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function AnimatedButton({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={!disabled ? {
        scale: 1.02,
        y: -1.5,
      } : {}}
      whileTap={!disabled ? {
        scale: 0.97,
        y: 1,
      } : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20,
      }}
    >
      {children}
    </motion.button>
  )
}
