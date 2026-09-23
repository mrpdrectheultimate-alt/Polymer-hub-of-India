'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Layers, CheckCircle2, ChevronRight } from 'lucide-react'

export function LessonReadingProgress({ lessonTitle }: { lessonTitle: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
        setProgress(Math.round(currentProgress))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Fixed Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Reading Progress Indicator Badge */}
      <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        <span>Reading Progress: <strong className="text-blue-600 tabular-nums">{progress}%</strong></span>
      </div>
    </>
  )
}

export default LessonReadingProgress
