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

  // Exact original official logo — trimmed and scaled so "KNOWLEDGE • INNOVATION • FUTURE" is prominent & crystal-clear
  const src = theme === 'dark' ? '/logo-white.svg' : '/logo-official.png'

  return (
    <Link href="/" className={`flex items-center flex-shrink-0 transition-opacity hover:opacity-90 ${className}`} aria-label="Polymer Hub of India — Home">
      <img
        src={src}
        alt="Polymer Hub of India — Knowledge • Innovation • Future"
        className="h-12 sm:h-14 md:h-[58px] 2xl:h-[68px] w-auto max-w-[240px] sm:max-w-[290px] md:max-w-[340px] 2xl:max-w-[400px] object-contain shrink-0 mix-blend-multiply"
        loading="eager"
      />
    </Link>
  )
}

export default Logo
