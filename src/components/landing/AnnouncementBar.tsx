'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <aside aria-label="Community Announcement" className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white text-xs py-2.5 px-4 sm:px-6 shadow-sm z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
          <p className="font-sans text-[11px] sm:text-xs truncate">
            <strong className="font-semibold">Building India&apos;s Dedicated Polymer Engineering Platform:</strong> Daily morning formulas, spot benchmarks &amp; GATE questions on WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-mono font-bold text-[11px] uppercase tracking-wider transition-all shadow-xs shrink-0"
          >
            <span>Join WhatsApp</span>
            <ArrowRight className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss banner"
            className="text-white/70 hover:text-white transition-colors p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
