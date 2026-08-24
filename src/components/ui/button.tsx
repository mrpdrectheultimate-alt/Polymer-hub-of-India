'use client'

import React, { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:-translate-y-0.5 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0A1628]',
        secondary: 'bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0A1628] hover:bg-slate-900 hover:text-white hover:-translate-y-0.5',
        premium: 'bg-[#F5C518] text-slate-950 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0A1628] hover:bg-amber-400 hover:-translate-y-0.5',
        emerald: 'bg-[#16A34A] text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0A1628] hover:bg-emerald-700 hover:-translate-y-0.5',
        glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40',
        ghost: 'hover:bg-slate-100 text-slate-900 hover:text-blue-600 border border-transparent',
      },
      size: {
        sm: 'px-4 py-2 text-[10px]',
        md: 'px-6 py-3 text-xs',
        lg: 'px-8 py-3.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant, 
  size, 
  children, 
  ...props 
}) => {
  return (
    <motion.button
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
