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
          width={120}
          height={90}
          className="h-11 sm:h-12 w-auto object-contain shrink-0 mix-blend-multiply"
          priority
          unoptimized
        />
      </Link>
    )
  }

  // Full logo — use original official horizontal logo
  const src = theme === 'dark' ? '/logo-white.svg' : '/logo-horizontal.jpg'

  return (
    <Link href="/" className={`flex items-center flex-shrink-0 transition-opacity hover:opacity-90 ${className}`} aria-label="Polymer Hub of India — Home">
      <Image
        src={src}
        alt="Polymer Hub of India"
        width={420}
        height={130}
        className="h-12 sm:h-14 md:h-16 w-auto object-contain shrink-0 mix-blend-multiply"
        priority
        unoptimized
      />
    </Link>
  )
}

export default Logo
