'use client'

import { useEffect } from 'react'

export function measurePerformance(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

  try {
    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Core Web Vitals] LCP: ${Math.round(lastEntry.startTime)}ms`)
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    // Monitor Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShift = entry as unknown as { hadRecentInput?: boolean; value: number }
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Core Web Vitals] CLS: ${clsValue.toFixed(3)}`)
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
  } catch {
    // Graceful degradation on unsupported browsers
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    measurePerformance()
  }, [])

  return null
}
