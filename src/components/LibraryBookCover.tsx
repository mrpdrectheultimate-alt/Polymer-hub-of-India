'use client'

import React, { useState } from 'react'
import { Sparkles, Download, ExternalLink, ShieldCheck, BookOpen } from 'lucide-react'

export interface LibraryBookCoverProps {
  id: string
  slug: string
  title: string
  authors: string
  legalClass: 'Class A' | 'Class B' | 'Class C' | 'Class D'
  isbn?: string
  publisher?: string
  publicationYear?: number
  subjectSlugs?: string[]
  coverUrl?: string
  difficulty?: string
  className?: string
  isHero?: boolean
}

// ── Abstract Subject Fallback Themes ──────────────────────────────────────────
const SUBJECT_THEMES: Record<string, {
  gradient: string
  accentHex: string
  badgeText: string
  svgIcon: React.ReactNode
}> = {
  'polymer-rheology': {
    gradient: 'from-cyan-950 via-slate-900 to-blue-950',
    accentHex: '#06B6D4',
    badgeText: '🌊 RHEOLOGY & SHEAR FLOW',
    svgIcon: (
      <svg viewBox="0 0 100 60" className="w-24 h-14 text-cyan-400">
        <path d="M 0,50 Q 25,45 50,25 T 100,5" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 0,50 Q 25,45 50,25 T 100,5 L 100,60 L 0,60 Z" fill="rgba(6,182,212,0.15)" />
        <circle cx="100" cy="5" r="3" fill="#38BDF8" />
      </svg>
    )
  },
  'mould-design': {
    gradient: 'from-slate-950 via-zinc-900 to-blue-950',
    accentHex: '#3B82F6',
    badgeText: '📐 TOOLING & MOULD DESIGN',
    svgIcon: (
      <svg viewBox="0 0 100 60" className="w-24 h-14 text-blue-400">
        <rect x="15" y="10" width="70" height="40" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4,2" />
        <line x1="50" y1="5" x2="50" y2="55" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3,3" />
        <rect x="30" y="20" width="40" height="20" fill="rgba(59,130,246,0.2)" stroke="#93C5FD" strokeWidth="1.5" />
      </svg>
    )
  },
  'polymer-processing': {
    gradient: 'from-amber-950 via-stone-900 to-slate-950',
    accentHex: '#F59E0B',
    badgeText: '⚙️ PLASTIC PROCESSING & EXTRUSION',
    svgIcon: (
      <svg viewBox="0 0 100 60" className="w-24 h-14 text-amber-400">
        <rect x="10" y="25" width="80" height="15" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="2" />
        <polygon points="25,10 40,10 35,25 30,25" fill="#F59E0B" />
        <path d="M 10 32 Q 30 28 50 32 T 90 32" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="5,2" />
      </svg>
    )
  },
  'polymer-testing': {
    gradient: 'from-purple-950 via-slate-900 to-indigo-950',
    accentHex: '#A855F7',
    badgeText: '🔬 MECHANICAL TESTING & QA',
    svgIcon: (
      <svg viewBox="0 0 100 60" className="w-24 h-14 text-purple-400">
        <path d="M 20 15 L 35 15 L 35 30 L 65 30 L 65 15 L 80 15 L 80 45 L 65 45 L 65 30 L 35 30 L 35 45 L 20 45 Z" fill="rgba(168,85,247,0.3)" stroke="#C084FC" strokeWidth="2" />
        <line x1="50" y1="5" x2="50" y2="55" stroke="#E9D5FF" strokeWidth="1.5" strokeDasharray="3,3" />
      </svg>
    )
  },
  'polymer-chemistry': {
    gradient: 'from-blue-950 via-indigo-950 to-slate-950',
    accentHex: '#38BDF8',
    badgeText: '⚗️ SYNTHESIS & REACTION KINETICS',
    svgIcon: (
      <svg viewBox="0 0 100 60" className="w-24 h-14 text-sky-400">
        <polygon points="30,15 50,8 70,15 70,35 50,42 30,35" fill="none" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="50" cy="25" r="10" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="70" y1="15" x2="85" y2="8" stroke="#818CF8" strokeWidth="2" />
      </svg>
    )
  },
  'additives-and-compounding': {
    gradient: 'from-amber-950 via-zinc-900 to-slate-950',
    accentHex: '#D97706',
    badgeText: '🧪 TWIN-SCREW COMPOUNDING',
    svgIcon: (
      <svg viewBox="0 0 100 60" className="w-24 h-14 text-amber-500">
        <circle cx="35" cy="30" r="15" fill="none" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="65" cy="30" r="15" fill="none" stroke="#F59E0B" strokeWidth="2" />
        <line x1="35" y1="15" x2="65" y2="15" stroke="#FBBF24" strokeWidth="2" />
        <line x1="35" y1="45" x2="65" y2="45" stroke="#FBBF24" strokeWidth="2" />
      </svg>
    )
  },
  'sustainable-plastics': {
    gradient: 'from-emerald-950 via-teal-900 to-slate-950',
    accentHex: '#10B981',
    badgeText: '🌱 CIRCULARITY & BIOPOLYMERS',
    svgIcon: (
      <svg viewBox="0 0 100 60" className="w-24 h-14 text-emerald-400">
        <path d="M 50,10 A 25,25 0 0,1 75,35 L 68,35 A 18,18 0 0,0 50,18 Z" fill="#10B981" />
        <path d="M 75,35 A 25,25 0 0,1 35,55 L 39,48 A 18,18 0 0,0 68,35 Z" fill="#059669" />
        <path d="M 35,55 A 25,25 0 0,1 50,10 L 50,18 A 18,18 0 0,0 39,48 Z" fill="#047857" />
      </svg>
    )
  }
}

// ── TIER 1: Class A Original Visual Covers ─────────────────────────────────────
function ClassAOriginalCover({ slug, title, authors }: { slug: string; title: string; authors: string }) {
  if (slug === 'practical-polymer-rheology-guide') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0A1628] via-[#0284C7] to-[#0A1628] p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
        
        {/* Top Header Badge — POLYMERHUB ACADEMIC BOARD */}
        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 fill-slate-950" /> POLYMERHUB ACADEMIC BOARD &middot; ORIGINAL
          </span>
          <span className="text-[9px] font-bold text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded uppercase">
            MASTER GUIDE
          </span>
        </div>

        {/* Center Rheology Shear-Thinning SVG */}
        <div className="my-auto py-2 z-10 space-y-3">
          <div className="flex justify-center">
            <svg viewBox="0 0 180 80" className="w-40 h-20 overflow-visible">
              <defs>
                <linearGradient id="rheoGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
              </defs>
              <line x1="15" y1="70" x2="165" y2="70" stroke="#64748B" strokeWidth="1.5" />
              <line x1="15" y1="10" x2="15" y2="70" stroke="#64748B" strokeWidth="1.5" />
              <text x="165" y="78" fill="#94A3B8" fontSize="8" textAnchor="end">Shear Rate (γ̇)</text>
              <text x="8" y="10" fill="#94A3B8" fontSize="8">Viscosity (η)</text>
              <path d="M 15,18 C 50,18 70,55 160,62" fill="none" stroke="url(#rheoGrad)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="160" cy="62" r="4" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="160" cy="62" r="3" fill="#818CF8" />
            </svg>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-display font-black text-lg text-white leading-tight uppercase tracking-tight">{title}</h3>
            <p className="text-[11px] text-cyan-200 font-sans font-medium">{authors}</p>
          </div>
        </div>

        {/* Bottom Spec Footer */}
        <div className="border-t border-cyan-500/30 pt-2 flex items-center justify-between text-[8px] text-cyan-300 font-bold z-10 uppercase">
          <span>VISCOELASTIC KINETICS &amp; SAOS</span>
          <span className="text-amber-400">100% VERIFIED FULL TEXT</span>
        </div>
      </div>
    )
  }

  if (slug === 'injection-moulding-defect-elimination') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#064E3B] via-[#0F172A] to-[#022C22] p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966915_1px,transparent_1px),linear-gradient(to_bottom,#05966915_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 fill-slate-950" /> POLYMERHUB ACADEMIC BOARD &middot; ORIGINAL
          </span>
          <span className="text-[9px] font-bold text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded uppercase">
            TOOLROOM HANDBOOK
          </span>
        </div>

        <div className="my-auto py-2 z-10 space-y-3">
          <div className="flex justify-center">
            <svg viewBox="0 0 160 80" className="w-36 h-18 text-emerald-400">
              <rect x="20" y="15" width="120" height="50" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4,2" />
              <line x1="80" y1="10" x2="80" y2="70" stroke="#059669" strokeWidth="1.5" strokeDasharray="3,3" />
              <rect x="40" y="25" width="35" height="30" fill="rgba(16,185,129,0.2)" stroke="#34D399" strokeWidth="1.5" />
              <rect x="85" y="25" width="35" height="30" fill="rgba(16,185,129,0.2)" stroke="#34D399" strokeWidth="1.5" />
              <circle cx="57" cy="40" r="8" fill="none" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="2,2" />
              <circle cx="102" cy="40" r="8" fill="none" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="2,2" />
            </svg>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-display font-black text-lg text-white leading-tight uppercase tracking-tight">{title}</h3>
            <p className="text-[11px] text-emerald-200 font-sans font-medium">{authors}</p>
          </div>
        </div>

        <div className="border-t border-emerald-600/40 pt-2 flex items-center justify-between text-[8px] text-emerald-300 font-bold z-10 uppercase">
          <span>CAVITY WARPAGE &amp; SINK MARKS</span>
          <span className="text-amber-400">FULL INTERACTIVE HANDBOOK</span>
        </div>
      </div>
    )
  }

  if (slug === 'polymer-testing-qc-master-guide') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#0F172A] p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden relative shadow-2xl">
        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 fill-slate-950" /> POLYMERHUB ACADEMIC BOARD &middot; ORIGINAL
          </span>
          <span className="text-[9px] font-bold text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded uppercase">
            ASTM / ISO STANDARD
          </span>
        </div>

        <div className="my-auto py-2 z-10 space-y-3">
          <div className="flex justify-center">
            <svg viewBox="0 0 160 70" className="w-36 h-16 text-purple-300">
              <path d="M 30 15 L 50 15 L 50 30 L 110 30 L 110 15 L 130 15 L 130 55 L 110 55 L 110 40 L 50 40 L 50 55 L 30 55 Z" fill="rgba(168,85,247,0.3)" stroke="#C084FC" strokeWidth="2" />
              <line x1="80" y1="10" x2="80" y2="60" stroke="#E9D5FF" strokeWidth="1.5" strokeDasharray="3,3" />
            </svg>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-display font-black text-lg text-white leading-tight uppercase tracking-tight">{title}</h3>
            <p className="text-[11px] text-purple-200 font-sans font-medium">{authors}</p>
          </div>
        </div>

        <div className="border-t border-purple-500/30 pt-2 flex items-center justify-between text-[8px] text-purple-300 font-bold z-10 uppercase">
          <span>ISO 527 / ASTM D638 / ISO 178</span>
          <span className="text-amber-400">QC MASTER LAB MANUAL</span>
        </div>
      </div>
    )
  }

  if (slug === 'applied-polymer-chemistry-kinetics') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0C4A6E] via-[#0369A1] to-[#0F172A] p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden relative shadow-2xl">
        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 fill-slate-950" /> POLYMERHUB ACADEMIC BOARD &middot; ORIGINAL
          </span>
          <span className="text-[9px] font-bold text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded uppercase">
            KINETICS HANDBOOK
          </span>
        </div>

        <div className="my-auto py-2 z-10 space-y-3">
          <div className="flex justify-center">
            <svg viewBox="0 0 160 70" className="w-36 h-16 text-sky-300">
              <polygon points="40,15 65,5 90,15 90,40 65,50 40,40" fill="none" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="65" cy="27" r="12" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="90" y1="15" x2="115" y2="5" stroke="#7DD3FC" strokeWidth="2.5" />
              <line x1="40" y1="40" x2="15" y2="50" stroke="#7DD3FC" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-display font-black text-lg text-white leading-tight uppercase tracking-tight">{title}</h3>
            <p className="text-[11px] text-sky-200 font-sans font-medium">{authors}</p>
          </div>
        </div>

        <div className="border-t border-sky-500/30 pt-2 flex items-center justify-between text-[8px] text-sky-300 font-bold z-10 uppercase">
          <span>FREE RADICAL &amp; STEP-GROWTH</span>
          <span className="text-amber-400">FULL INTERACTIVE GUIDE</span>
        </div>
      </div>
    )
  }

  // Fallback for Plastics Compounding & Additives or default Class A
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#451A03] via-[#78350F] to-[#0F172A] p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden relative shadow-2xl">
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3 fill-slate-950" /> POLYMERHUB ACADEMIC BOARD &middot; ORIGINAL
        </span>
        <span className="text-[9px] font-bold text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded uppercase">
          COMPOUNDING GUIDE
        </span>
      </div>

      <div className="my-auto py-2 z-10 space-y-3">
        <div className="flex justify-center">
          <svg viewBox="0 0 160 70" className="w-36 h-16 text-amber-400">
            <circle cx="55" cy="35" r="18" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="95" cy="35" r="18" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <line x1="55" y1="17" x2="95" y2="17" stroke="#FBBF24" strokeWidth="2" />
            <line x1="55" y1="53" x2="95" y2="53" stroke="#FBBF24" strokeWidth="2" />
          </svg>
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-display font-black text-lg text-white leading-tight uppercase tracking-tight">{title}</h3>
          <p className="text-[11px] text-amber-200 font-sans font-medium">{authors}</p>
        </div>
      </div>

      <div className="border-t border-amber-500/30 pt-2 flex items-center justify-between text-[8px] text-amber-300 font-bold z-10 uppercase">
        <span>TWIN-SCREW MASTERBATCH &amp; FILLERS</span>
        <span className="text-amber-400">FULL INTERACTIVE HANDBOOK</span>
      </div>
    </div>
  )
}

// ── TIER 2: Class B Open Access Branded Covers ────────────────────────────────
function ClassBOpenAccessCover({ title, authors, publisher }: { title: string; authors: string; publisher?: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#064E3B] via-[#022C22] to-[#0F172A] p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden relative shadow-xl">
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Download className="w-3 h-3" /> POLYMERHUB ACADEMIC BOARD &middot; OPEN ACCESS
        </span>
        <span className="text-[8px] font-bold text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded uppercase">
          PUBLIC DOMAIN / CC
        </span>
      </div>

      <div className="my-auto py-2 z-10 space-y-2">
        <div className="flex justify-center">
          <svg viewBox="0 0 100 60" className="w-20 h-12 text-emerald-400">
            <path d="M 50,10 A 25,25 0 0,1 75,35 L 68,35 A 18,18 0 0,0 50,18 Z" fill="#10B981" />
            <path d="M 75,35 A 25,25 0 0,1 35,55 L 39,48 A 18,18 0 0,0 68,35 Z" fill="#059669" />
            <path d="M 35,55 A 25,25 0 0,1 50,10 L 50,18 A 18,18 0 0,0 39,48 Z" fill="#047857" />
          </svg>
        </div>

        <div className="text-center space-y-1">
          <h4 className="font-display font-bold text-sm text-white leading-snug line-clamp-2">{title}</h4>
          <p className="text-[10px] text-emerald-200 font-sans">{authors}</p>
        </div>
      </div>

      <div className="border-t border-emerald-800/60 pt-2 flex items-center justify-between text-[8px] text-emerald-300 font-bold z-10 uppercase">
        <span>SOURCE: {publisher || 'OPEN TECHNICAL REPORT'}</span>
        <span className="text-white">FULL VERIFIED PDF</span>
      </div>
    </div>
  )
}

// ── TIER 3: Class D Abstract Subject Fallback Cover ───────────────────────────
function ClassDAbstractFallbackCover({
  title,
  authors,
  publisher,
  isbn,
  subjectSlug
}: {
  title: string
  authors: string
  publisher?: string
  isbn?: string
  subjectSlug: string
}) {
  const theme = SUBJECT_THEMES[subjectSlug] || SUBJECT_THEMES['polymer-chemistry']

  return (
    <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} p-5 flex flex-col justify-between text-white font-mono select-none overflow-hidden relative shadow-lg`}>
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <ExternalLink className="w-3 h-3 text-amber-400" /> POLYMERHUB ACADEMIC BOARD &middot; CATALOG
        </span>
        <span className="text-[8px] font-bold text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded uppercase">
          COMMERCIAL REF
        </span>
      </div>

      <div className="my-auto py-2 z-10 space-y-2">
        <div className="flex justify-center">{theme.svgIcon}</div>

        <div className="text-center space-y-1">
          <span className="text-[8px] font-bold text-amber-400 uppercase tracking-widest block">{theme.badgeText}</span>
          <h4 className="font-display font-bold text-sm text-white leading-snug line-clamp-2">{title}</h4>
          <p className="text-[10px] text-slate-300 font-sans line-clamp-1">{authors}</p>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[8px] text-slate-400 font-bold z-10 uppercase">
        <span>{publisher || 'COMMERCIAL PUBLISHER'}</span>
        <span className="text-amber-400">{isbn ? `ISBN ${isbn}` : 'BIBLIOGRAPHIC CARD'}</span>
      </div>
    </div>
  )
}

// ── MAIN LIBRARY BOOK COVER COMPONENT ──────────────────────────────────────────
export default function LibraryBookCover({
  slug,
  title,
  authors,
  legalClass,
  isbn,
  publisher,
  subjectSlugs = [],
  coverUrl,
  className = '',
  isHero = false
}: LibraryBookCoverProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const primarySubject = subjectSlugs[0] || 'polymer-chemistry'

  // Open Library API ISBN Lookup URL for Class D commercial reference cards
  const openLibraryCoverUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null
  const displayCoverUrl = coverUrl || openLibraryCoverUrl

  // 1. Class A: Render Custom SVG Original Cover
  if (legalClass === 'Class A') {
    return (
      <div className={`w-full overflow-hidden ${isHero ? 'h-full min-h-[260px]' : 'h-52'} ${className}`}>
        <ClassAOriginalCover slug={slug} title={title} authors={authors} />
      </div>
    )
  }

  // 2. Class B: Render Branded Open Access Cover Template
  if (legalClass === 'Class B') {
    return (
      <div className={`w-full overflow-hidden ${isHero ? 'h-full min-h-[260px]' : 'h-52'} ${className}`}>
        <ClassBOpenAccessCover title={title} authors={authors} publisher={publisher} />
      </div>
    )
  }

  // 3. Class D: Attempt Open Library ISBN Image Lookup, fallback to Abstract Cover
  const showFallback = !displayCoverUrl || imgError

  return (
    <div className={`relative w-full overflow-hidden ${isHero ? 'h-full min-h-[260px]' : 'h-52'} bg-slate-950 ${className}`}>
      {showFallback ? (
        <ClassDAbstractFallbackCover
          title={title}
          authors={authors}
          publisher={publisher}
          isbn={isbn}
          subjectSlug={primarySubject}
        />
      ) : (
        <>
          {/* Skeleton Background while loading Open Library Cover */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-slate-900 animate-pulse z-0 flex items-center justify-center">
              <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">Loading ISBN Cover...</span>
            </div>
          )}

          {/* Open Library / Custom Cover Image */}
          <img
            src={displayCoverUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 z-10 ${
              imgLoaded ? 'opacity-90' : 'opacity-0'
            }`}
          />

          {/* High-Contrast Editorial Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-20 pointer-events-none" />

          {/* Class D Badge */}
          <div className="absolute top-3 left-3 z-30">
            <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700 text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <ExternalLink className="w-3 h-3 text-amber-400" /> POLYMERHUB ACADEMIC BOARD &middot; CATALOG
            </span>
          </div>

          {/* Bottom ISBN Label */}
          {isbn && (
            <div className="absolute bottom-2 right-3 z-30 font-mono text-[8px] font-bold text-amber-300 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
              ISBN: {isbn}
            </div>
          )}
        </>
      )}
    </div>
  )
}
