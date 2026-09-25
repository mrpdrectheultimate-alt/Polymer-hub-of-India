'use client'

import React from 'react'

export type VisualTemplateType = 
  | 'T01' // Policy Announcement
  | 'T02' // Research Paper
  | 'T03' // Market Movement
  | 'T04' // Company Announcement
  | 'T05' // New Material
  | 'T06' // Technology/Process
  | 'T07' // Recycling
  | 'T08' // Bioplastics
  | 'T09' // Industry Event
  | 'T10' // Regulation
  | 'T11' // Patent
  | 'T12' // Education/Career

export interface TemplateProps {
  headline: string
  category: string
  sourceName?: string
  subtitle?: string
  value?: string
  change?: string
  isUp?: boolean
  className?: string
}

// ── Locked Category Color System ───────────────────────────────────────────────
export const LOCKED_CATEGORY_MAP: Record<string, {
  bgColor: string
  border: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
  accentHex: string
  label: string
}> = {
  Policy: {
    bgColor: 'bg-blue-900',
    border: 'border-blue-700',
    badgeBg: 'bg-blue-800/90',
    badgeText: 'text-blue-100',
    badgeBorder: 'border-blue-600',
    accentHex: '#3B82F6',
    label: 'BIS & MOEFCC POLICY'
  },
  Research: {
    bgColor: 'bg-slate-900',
    border: 'border-slate-700',
    badgeBg: 'bg-slate-800/90',
    badgeText: 'text-cyan-200',
    badgeBorder: 'border-cyan-500/50',
    accentHex: '#06B6D4',
    label: 'ADVANCED R&D'
  },
  Market: {
    bgColor: 'bg-emerald-900',
    border: 'border-emerald-700',
    badgeBg: 'bg-emerald-800/90',
    badgeText: 'text-emerald-100',
    badgeBorder: 'border-emerald-600',
    accentHex: '#10B981',
    label: 'PETROCHEM SPOT MARKET'
  },
  India: {
    bgColor: 'bg-orange-900',
    border: 'border-orange-700',
    badgeBg: 'bg-orange-800/90',
    badgeText: 'text-orange-100',
    badgeBorder: 'border-orange-600',
    accentHex: '#F97316',
    label: 'DOMESTIC MFG & CIPET'
  },
  Bioplastics: {
    bgColor: 'bg-green-900',
    border: 'border-green-700',
    badgeBg: 'bg-green-800/90',
    badgeText: 'text-green-100',
    badgeBorder: 'border-green-600',
    accentHex: '#22C55E',
    label: 'BIO-POLYMERS & PHA/PLA'
  },
  Innovation: {
    bgColor: 'bg-indigo-900',
    border: 'border-indigo-700',
    badgeBg: 'bg-indigo-800/90',
    badgeText: 'text-indigo-100',
    badgeBorder: 'border-indigo-600',
    accentHex: '#6366F1',
    label: 'MATERIAL INNOVATION'
  },
  Sustainability: {
    bgColor: 'bg-teal-900',
    border: 'border-teal-700',
    badgeBg: 'bg-teal-800/90',
    badgeText: 'text-teal-100',
    badgeBorder: 'border-teal-600',
    accentHex: '#14B8A6',
    label: 'CIRCULAR ECONOMY'
  },
  Recycling: {
    bgColor: 'bg-teal-950',
    border: 'border-teal-800',
    badgeBg: 'bg-teal-900/90',
    badgeText: 'text-teal-200',
    badgeBorder: 'border-teal-700',
    accentHex: '#0D9488',
    label: 'MECHANICAL & CHEMICAL RECYCLING'
  }
}

// Map categories to default visual templates if visual_type isn't specified
export function getTemplateForCategory(category: string): VisualTemplateType {
  const cat = category.toLowerCase()
  if (cat.includes('policy')) return 'T01'
  if (cat.includes('research')) return 'T02'
  if (cat.includes('market') || cat.includes('price')) return 'T03'
  if (cat.includes('india') || cat.includes('mfg')) return 'T12'
  if (cat.includes('bioplastic') || cat.includes('bio')) return 'T08'
  if (cat.includes('innovation') || cat.includes('material')) return 'T05'
  if (cat.includes('recycle') || cat.includes('sustainability')) return 'T07'
  if (cat.includes('patent')) return 'T11'
  if (cat.includes('event')) return 'T09'
  return 'T06'
}

// ── T01: Policy Announcement ──────────────────────────────────────────────────
export function T01_PolicyAnnouncement({ headline, sourceName = 'BIS / MoEFCC India' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      
      {/* Top Header Stamp */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-blue-900/80 border border-blue-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-blue-200">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          OFFICIAL GAZETTE / QUALITY CONTROL ORDER
        </div>
        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold uppercase">
          MANDATORY BIS
        </span>
      </div>

      {/* SVG Emblem & Document Graphic */}
      <div className="my-auto py-2 flex items-center justify-center gap-4 relative z-10">
        <svg viewBox="0 0 120 120" className="w-24 h-24 shrink-0 drop-shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
          {/* Outer Seal */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4,2" />
          <circle cx="60" cy="60" r="48" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2" />
          {/* Document Sheet */}
          <rect x="38" y="30" width="44" height="60" rx="3" fill="#FFFFFF" opacity="0.95" />
          <line x1="46" y1="42" x2="70" y2="42" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" />
          <line x1="46" y1="52" x2="74" y2="52" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="60" x2="74" y2="60" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="68" x2="64" y2="68" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          {/* Check Seal */}
          <circle cx="70" cy="74" r="14" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M64 74 l4 4 l8 -8" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="space-y-1 max-w-[200px]">
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">Regulator: {sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-tight font-display line-clamp-2">{headline}</h4>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="flex items-center justify-between text-[9px] text-blue-300 border-t border-blue-800/60 pt-2 z-10">
        <span>ISO 9001 / IS 15410 COMPLIANCE</span>
        <span className="text-amber-400 font-bold">GOVT. OF INDIA</span>
      </div>
    </div>
  )
}

// ── T02: Research Paper ────────────────────────────────────────────────────────
export function T02_ResearchPaper({ headline, sourceName = 'Polymer Journal R&D' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:18px_18px] opacity-25" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-indigo-900/80 border border-indigo-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-200">
          <span>🔬</span> MOLECULAR &amp; MACROMOLECULAR RESEARCH
        </div>
        <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-2 py-0.5 rounded font-bold">
          PEER REVIEWED
        </span>
      </div>

      {/* Chemical Molecular SVG Graphic */}
      <div className="my-auto py-1 flex items-center justify-center gap-4 z-10">
        <svg viewBox="0 0 140 100" className="w-32 h-20 shrink-0">
          {/* Benzene Ring / Polymer Repeat Unit */}
          <polygon points="40,20 70,10 100,20 100,50 70,60 40,50" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
          <circle cx="70" cy="35" r="16" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3,3" />
          {/* Side Chains */}
          <line x1="100" y1="20" x2="125" y2="10" stroke="#818CF8" strokeWidth="2.5" />
          <text x="127" y="12" fill="#A5B4FC" fontSize="10" fontWeight="bold">CH₃</text>
          <line x1="40" y1="50" x2="15" y2="60" stroke="#818CF8" strokeWidth="2.5" />
          <text x="2" y="65" fill="#A5B4FC" fontSize="10" fontWeight="bold">OH</text>
          <line x1="70" y1="60" x2="70" y2="85" stroke="#34D399" strokeWidth="2.5" />
          <text x="64" y="96" fill="#6EE7B7" fontSize="9" fontWeight="bold">[R]n</text>
        </svg>

        <div className="space-y-1">
          <span className="text-[9px] text-cyan-400 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-slate-100 leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800 pt-2 z-10">
        <span>DOI: 10.1016/j.polym.2026</span>
        <span className="text-cyan-400 font-bold">R&amp;D PAPER</span>
      </div>
    </div>
  )
}

// ── T03: Market Movement ──────────────────────────────────────────────────────
export function T03_MarketMovement({ headline, value = '₹117.90/kg', change = '+2.2%', isUp = true }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-emerald-900/90 border border-emerald-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-100">
          <span>📈</span> PETROCHEM COMMODITY INDEX
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isUp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
          {change} {isUp ? '▲' : '▼'}
        </span>
      </div>

      {/* Price Sparkline & Values */}
      <div className="my-auto flex items-center justify-between gap-4 z-10">
        <div className="space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">SPOT BENCHMARK PRICE</span>
          <div className="text-2xl font-black font-display text-white tracking-tight">{value}</div>
          <p className="text-[11px] text-slate-300 line-clamp-1 font-sans">{headline}</p>
        </div>

        {/* Dynamic Vector Sparkline SVG */}
        <div className="w-28 h-14 shrink-0 bg-slate-900/80 border border-emerald-500/30 rounded-xl p-1.5 flex items-center justify-center">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 0,30 Q 15,25 30,28 T 60,15 T 85,10 L 100,5" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 0,30 Q 15,25 30,28 T 60,15 T 85,10 L 100,5 L 100,40 L 0,40 Z" fill="url(#sparklineGrad)" />
            <circle cx="100" cy="5" r="3.5" fill="#34D399" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="100" cy="5" r="3" fill="#10B981" />
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[9px] text-emerald-300 border-t border-emerald-800/60 pt-2 z-10">
        <span>EX-PLANT INDIA BENCHMARK</span>
        <span className="text-white font-bold">PLATTS / ICIS ALIGNED</span>
      </div>
    </div>
  )
}

// ── T04: Company Announcement ────────────────────────────────────────────────
export function T04_CompanyAnnouncement({ headline, sourceName = 'Reliance / GAIL / IPCL' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-blue-900/80 border border-blue-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-200">
          <span>🏢</span> CORPORATE &amp; EXPANSION NEWS
        </div>
        <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded font-bold">
          INDUSTRY CAPEX
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0 text-blue-400">
          <path d="M20 90 L20 40 L50 20 L80 40 L80 90 Z" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
          <rect x="35" y="50" width="10" height="15" fill="#3B82F6" />
          <rect x="55" y="50" width="10" height="15" fill="#3B82F6" />
          <rect x="42" y="70" width="16" height="20" fill="#93C5FD" />
          <line x1="10" y1="90" x2="90" y2="90" stroke="#60A5FA" strokeWidth="3" />
        </svg>

        <div className="space-y-1">
          <span className="text-[10px] text-blue-400 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800 pt-2 z-10">
        <span>PETROCHEMICAL COMPLEX</span>
        <span className="text-blue-400 font-bold">CAPEX STATEMENT</span>
      </div>
    </div>
  )
}

// ── T05: New Material ─────────────────────────────────────────────────────────
export function T05_NewMaterial({ headline, sourceName = 'High-Heat PEEK / Polyimide' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-indigo-900/80 border border-indigo-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-200">
          <span>💎</span> NOVEL POLYMER GRADE
        </div>
        <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-700/60 px-2 py-0.5 rounded font-bold">
          HIGH PERFORMANCE
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0">
          <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" fill="rgba(99,102,241,0.2)" stroke="#818CF8" strokeWidth="2.5" />
          <line x1="50" y1="15" x2="50" y2="95" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="15" y1="35" x2="85" y2="75" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3,3" />
          <circle cx="50" cy="55" r="8" fill="#C084FC" />
        </svg>

        <div className="space-y-1">
          <span className="text-[10px] text-purple-300 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-indigo-300 border-t border-indigo-800/60 pt-2 z-10">
        <span>THERMAL &amp; MECHANICAL GRADE</span>
        <span className="text-purple-400 font-bold">SPECS VERIFIED</span>
      </div>
    </div>
  )
}

// ── T06: Technology Process ───────────────────────────────────────────────────
export function T06_TechnologyProcess({ headline, sourceName = 'Processing Unit Operations' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200">
          <span>⚙️</span> PROCESS ENGINEERING &amp; TOOLING
        </div>
        <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-bold">
          UNIT OPERATION
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <svg viewBox="0 0 120 80" className="w-24 h-16 shrink-0 text-amber-400">
          {/* Extruder Barrel & Hopper */}
          <rect x="20" y="35" width="80" height="20" fill="rgba(217,119,6,0.2)" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="35,15 50,15 45,35 40,35" fill="#F59E0B" />
          <path d="M 20 45 Q 40 40 60 45 T 100 45" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="6,3" />
          <circle cx="105" cy="45" r="4" fill="#EF4444" />
        </svg>

        <div className="space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800 pt-2 z-10">
        <span>INJECTION / EXTRUSION FLOW</span>
        <span className="text-amber-400 font-bold">CAD BLUEPRINT</span>
      </div>
    </div>
  )
}

// ── T07: Recycling ────────────────────────────────────────────────────────────
export function T07_Recycling({ headline, sourceName = 'Mechanical & Pyrolysis Recycling' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-teal-950 via-slate-950 to-emerald-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-teal-900/90 border border-teal-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-teal-100">
          <span>♻️</span> CIRCULAR RECYCLING STREAM
        </div>
        <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded font-bold">
          rPET #1 / rHDPE #2
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0">
          <path d="M 50,15 A 35,35 0 0,1 85,50 L 75,50 A 25,25 0 0,0 50,25 Z" fill="#14B8A6" />
          <path d="M 85,50 A 35,35 0 0,1 30,80 L 35,70 A 25,25 0 0,0 75,50 Z" fill="#0D9488" />
          <path d="M 30,80 A 35,35 0 0,1 50,15 L 50,25 A 25,25 0 0,0 35,70 Z" fill="#059669" />
          <text x="50" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold font-mono">rPET</text>
        </svg>

        <div className="space-y-1">
          <span className="text-[10px] text-teal-300 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-teal-300 border-t border-teal-800/60 pt-2 z-10">
        <span>FOOD-CONTACT REGRIND FLAKES</span>
        <span className="text-emerald-400 font-bold">CIRCULARITY CERTIFIED</span>
      </div>
    </div>
  )
}

// ── T08: Bioplastics ──────────────────────────────────────────────────────────
export function T08_Bioplastics({ headline, sourceName = 'Bio-Polymers PLA / PHA / PBS' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-green-950 via-slate-950 to-lime-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-green-900/90 border border-green-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-green-100">
          <span>🌱</span> BIO-BASED &amp; COMPOSTABLE
        </div>
        <span className="text-[9px] bg-lime-950 text-lime-300 border border-lime-700/60 px-2 py-0.5 rounded font-bold">
          100% COMPOSTABLE
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0">
          <path d="M 50 15 C 20 40 20 80 50 90 C 80 80 80 40 50 15 Z" fill="rgba(34,197,94,0.25)" stroke="#4ADE80" strokeWidth="2.5" />
          <path d="M 50 90 L 50 40 C 40 50 30 50 25 45" fill="none" stroke="#22C55E" strokeWidth="2" />
        </svg>

        <div className="space-y-1">
          <span className="text-[10px] text-green-300 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-green-300 border-t border-green-800/60 pt-2 z-10">
        <span>ISO 17088 / EN 13432 CERTIFIED</span>
        <span className="text-lime-400 font-bold">ZERO FOSSIL</span>
      </div>
    </div>
  )
}

// ── T09: Industry Event ───────────────────────────────────────────────────────
export function T09_IndustryEvent({ headline, sourceName = 'PlastIndia / AIPMA / CIPET Expo' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-amber-950 via-slate-950 to-orange-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-amber-900/90 border border-amber-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-100">
          <span>📅</span> GLOBAL PLASTICS EXPO &amp; SUMMIT
        </div>
        <span className="text-[9px] bg-orange-950 text-orange-300 border border-orange-700/60 px-2 py-0.5 rounded font-bold">
          EXHIBITION
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 shadow-lg border-2 border-amber-300">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-800">SUMMIT</span>
          <span className="text-xl font-black font-display">2026</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-amber-300 border-t border-amber-800/60 pt-2 z-10">
        <span>B2B MANUFACTURER MEET</span>
        <span className="text-white font-bold">NEW DELHI / MUMBAI</span>
      </div>
    </div>
  )
}

// ── T10: Regulation ───────────────────────────────────────────────────────────
export function T10_Regulation({ headline, sourceName = 'Gazette of India & CPCB' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-blue-900/90 border border-blue-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-100">
          <span>🏛️</span> STATUTORY REGULATION &amp; GAZETTE
        </div>
        <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded font-bold">
          STATUTORY RULE
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0 text-blue-300">
          <path d="M 10 85 L 90 85 M 20 85 L 20 40 M 40 85 L 40 40 M 60 85 L 60 40 M 80 85 L 80 40 M 10 40 L 90 40 M 50 15 L 10 40 L 90 40 Z" fill="none" stroke="#93C5FD" strokeWidth="2.5" />
        </svg>

        <div className="space-y-1">
          <span className="text-[10px] text-blue-300 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-blue-300 border-t border-blue-800/60 pt-2 z-10">
        <span>NOTIFICATION NO: CPCB/EPR/2026</span>
        <span className="text-white font-bold">LAW &amp; PENALTY</span>
      </div>
    </div>
  )
}

// ── T11: Patent ───────────────────────────────────────────────────────────────
export function T11_Patent({ headline, sourceName = 'Indian Patent Office / WIPO' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-indigo-900/90 border border-indigo-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-100">
          <span>📜</span> INTELLECTUAL PROPERTY &amp; PATENT
        </div>
        <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded font-bold">
          PATENT GRANTED
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-400 bg-indigo-900 flex items-center justify-center text-indigo-200 font-bold text-2xl font-mono shrink-0 shadow-lg">
          IP
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-indigo-300 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-indigo-300 border-t border-indigo-800/60 pt-2 z-10">
        <span>PATENT NO: IN-2026/894012</span>
        <span className="text-white font-bold">IP INDIA</span>
      </div>
    </div>
  )
}

// ── T12: Education / Career ───────────────────────────────────────────────────
export function T12_EducationCareer({ headline, sourceName = 'CIPET / ICT Mumbai / IIT' }: TemplateProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-orange-950 via-slate-950 to-amber-950 p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-orange-900/90 border border-orange-600/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-100">
          <span>🎓</span> CIPET ADMISSIONS &amp; ACADEMICS
        </div>
        <span className="text-[9px] bg-orange-950 text-orange-300 border border-orange-700/60 px-2 py-0.5 rounded font-bold">
          GATE &amp; B.TECH
        </span>
      </div>

      <div className="my-auto py-1 flex items-center gap-4 z-10">
        <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0 text-orange-400">
          <path d="M 10 40 L 50 20 L 90 40 L 50 60 Z" fill="#F97316" stroke="#FFEDD5" strokeWidth="2" />
          <path d="M 25 48 L 25 70 C 25 75 75 75 75 70 L 75 48" fill="none" stroke="#F97316" strokeWidth="2.5" />
          <line x1="85" y1="42" x2="85" y2="75" stroke="#FDBA74" strokeWidth="3" />
          <circle cx="85" cy="78" r="4" fill="#FDBA74" />
        </svg>

        <div className="space-y-1">
          <span className="text-[10px] text-orange-300 font-bold uppercase block">{sourceName}</span>
          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{headline}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-orange-300 border-t border-orange-800/60 pt-2 z-10">
        <span>PLASTIC ENGINEERING ACADEMICS</span>
        <span className="text-white font-bold">MINISTRY OF CHEMICALS</span>
      </div>
    </div>
  )
}

// ── Dispatcher Component for 12 Templates ─────────────────────────────────────
export function NewsVisualTemplateDispatcher({
  templateType,
  headline,
  category,
  sourceName,
  subtitle,
  value,
  change,
  isUp
}: {
  templateType?: VisualTemplateType
  headline: string
  category: string
  sourceName?: string
  subtitle?: string
  value?: string
  change?: string
  isUp?: boolean
}) {
  const selectedTemplate = templateType || getTemplateForCategory(category)

  switch (selectedTemplate) {
    case 'T01':
      return <T01_PolicyAnnouncement headline={headline} category={category} sourceName={sourceName} />
    case 'T02':
      return <T02_ResearchPaper headline={headline} category={category} sourceName={sourceName} />
    case 'T03':
      return <T03_MarketMovement headline={headline} category={category} sourceName={sourceName} value={value} change={change} isUp={isUp} />
    case 'T04':
      return <T04_CompanyAnnouncement headline={headline} category={category} sourceName={sourceName} />
    case 'T05':
      return <T05_NewMaterial headline={headline} category={category} sourceName={sourceName} />
    case 'T06':
      return <T06_TechnologyProcess headline={headline} category={category} sourceName={sourceName} />
    case 'T07':
      return <T07_Recycling headline={headline} category={category} sourceName={sourceName} />
    case 'T08':
      return <T08_Bioplastics headline={headline} category={category} sourceName={sourceName} />
    case 'T09':
      return <T09_IndustryEvent headline={headline} category={category} sourceName={sourceName} />
    case 'T10':
      return <T10_Regulation headline={headline} category={category} sourceName={sourceName} />
    case 'T11':
      return <T11_Patent headline={headline} category={category} sourceName={sourceName} />
    case 'T12':
      return <T12_EducationCareer headline={headline} category={category} sourceName={sourceName} />
    default:
      return <T06_TechnologyProcess headline={headline} category={category} sourceName={sourceName} />
  }
}
