'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider rounded-full border px-3 py-1 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-800 border-slate-300',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        orange: 'bg-orange-50 text-orange-700 border-orange-200',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        amber: 'bg-amber-50 text-amber-800 border-amber-300',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        dark: 'bg-[#0A1628] text-white border-white/20',
        glass: 'bg-white/10 backdrop-blur-md text-white border-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode
}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}
