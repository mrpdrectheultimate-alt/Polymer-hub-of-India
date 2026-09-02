'use client'

import { useEffect, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export default function ClientPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  if (!mounted || typeof document === 'undefined') return null
  return createPortal(children, document.body)
}
