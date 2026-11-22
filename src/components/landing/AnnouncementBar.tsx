'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <aside aria-label="Community Announcement" className="relative bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white text-xs py-2.5 px-4 sm:px-6 border-b border-blue-900/40 shadow-sm z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Launch Waitlist Live
          </span>
          <p className="font-sans text-[11px] sm:text-xs text-slate-300 truncate">
            <strong className="font-semibold text-white">Join India&apos;s Dedicated Polymer Engineering Platform:</strong> Exclusive Day-1 perks, GATE XE-F vault &amp; priority access.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-[11px] uppercase tracking-wider transition-all shadow-xs shrink-0"
          >
            <span>Claim Priority Spot</span>
            <ArrowRight className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss banner"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
