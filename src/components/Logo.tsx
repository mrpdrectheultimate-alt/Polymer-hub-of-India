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
          src="/logo-icon.svg"
          alt="Polymer Hub of India"
          width={64}
          height={40}
          className="h-10 sm:h-11 w-auto object-contain shrink-0"
          priority
          unoptimized
        />
      </Link>
    )
  }

  // Full logo — use official vector SVG
  const src = theme === 'dark' ? '/logo-white.svg' : '/logo-full.svg'

  return (
    <Link href="/" className={`flex items-center flex-shrink-0 transition-opacity hover:opacity-90 ${className}`} aria-label="Polymer Hub of India — Home">
      <Image
        src={src}
        alt="Polymer Hub of India"
        width={300}
        height={65}
        className="h-12 sm:h-13 md:h-14 w-auto object-contain shrink-0"
        priority
        unoptimized
      />
    </Link>
  )
}

export default Logo
