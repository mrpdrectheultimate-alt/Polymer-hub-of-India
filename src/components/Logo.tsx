'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  /** 'full' = horizontal logo with text  |  'icon' = icon-only mark */
  variant?: 'full' | 'icon'
  /** 'light' = dark ink on white bg  |  'dark' = white on dark bg */
  theme?: 'light' | 'dark'
  className?: string
}

export function Logo({ variant = 'full', theme = 'light', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <Link href="/" className={`flex items-center flex-shrink-0 transition-opacity hover:opacity-90 ${className}`} aria-label="Polymer Hub of India — Home">
        <Image
          src="/logo-icon.jpg"
          alt="Polymer Hub of India"
          width={416}
          height={400}
          className="h-10 sm:h-12 w-auto object-contain shrink-0 mix-blend-multiply"
          priority
          unoptimized
        />
      </Link>
    )
  }

  // Full logo — use original official trimmed horizontal logo
  const src = theme === 'dark' ? '/logo-white.svg' : '/logo-horizontal.jpg'

  return (
    <Link href="/" className={`flex items-center flex-shrink-0 transition-opacity hover:opacity-90 ${className}`} aria-label="Polymer Hub of India — Home">
      <Image
        src={src}
        alt="Polymer Hub of India"
        width={894}
        height={268}
        className="h-10 sm:h-12 md:h-14 max-h-[44px] sm:max-h-[50px] w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[280px] object-contain shrink-0 mix-blend-multiply"
        priority
        unoptimized
      />
    </Link>
  )
}

export default Logo
