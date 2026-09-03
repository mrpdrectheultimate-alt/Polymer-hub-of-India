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

  // Full logo — use official SVG vector logo to guarantee crystal-clear tagline rendering
  const src = theme === 'dark' ? '/logo-white.svg' : '/logo-full.svg'

  return (
    <Link href="/" className={`flex items-center flex-shrink-0 transition-opacity hover:opacity-90 ${className}`} aria-label="Polymer Hub of India — Home">
      <img
        src={src}
        alt="Polymer Hub of India — Knowledge • Innovation • Future"
        className="h-11 sm:h-13 md:h-14 w-auto max-w-[220px] sm:max-w-[270px] md:max-w-[310px] object-contain shrink-0 drop-shadow-2xs"
        loading="eager"
      />
    </Link>
  )
}

export default Logo
