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
      <Link href="/" className={`flex items-center flex-shrink-0 ${className}`} aria-label="Polymer Hub of India — Home">
        <Image
          src="/logo-icon.jpg"
          alt="Polymer Hub of India"
          width={52}
          height={52}
          className="h-11 w-auto object-contain"
          priority
        />
      </Link>
    )
  }

  // Full logo — use SVG for perfect scaling; fall back to JPG on error
  const src = theme === 'dark' ? '/logo-white.svg' : '/logo-banner.jpg'

  return (
    <Link href="/" className={`flex items-center flex-shrink-0 ${className}`} aria-label="Polymer Hub of India — Home">
      <Image
        src={src}
        alt="Polymer Hub of India"
        width={220}
        height={48}
        className="h-11 w-auto object-contain"
        priority
      />
    </Link>
  )
}

export default Logo
