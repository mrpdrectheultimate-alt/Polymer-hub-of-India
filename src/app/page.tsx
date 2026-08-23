'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Shield, 
  ChevronRight, 
  Sparkles, 
  Globe, 
  Brain, 
  Wrench, 
  Scale, 
  Compass,
  Zap
} from 'lucide-react'
import { Hero3D } from '@/components/Hero3D'
import { FloatingSubjects } from '@/components/FloatingSubjects'
import { GlassCard } from '@/components/ui/GlassCard'

// ─── Interactive Tools Data ───────────────────────────────────────────────────
const TOOLS = [
  { 
    name: 'Defect Diagnostic Engine', 
    icon: '🔧', 
    description: 'Diagnose 12 industrial injection/extrusion defects with root causes from Rosato Handbook.', 
    href: '/troubleshooter', 
    color: '#EA580C', 
    iconComponent: Wrench,
    badge: 'Shop-Floor QA'
  },
  { 
    name: 'Polymer Comparator', 
    icon: '⚖️', 
    description: 'Compare 35+ base polymers and commercial TDS grades across 16 ASTM/ISO properties.', 
    href: '/comparator', 
    color: '#4F8FFF', 
    iconComponent: Scale,
    badge: 'TDS Benchmarking'
  },
  { 
    name: 'Industrial Calculators', 
    icon: '🧮', 
    description: '8 engineering tools for clamping tonnage, cooling cycle times, shrinkage, and shear rates.', 
    href: '/calculators', 
    color: '#10B981', 
    iconComponent: Zap,
    badge: '8 Processing Solvers'
  },
  { 
    name: 'Materials Database', 
    icon: '📊', 
    description: 'Complete catalog of 35+ polymers, 100+ 3D models, and Indian brand equivalents (Repol, Relene).', 
    href: '/materials', 
    color: '#EC4899', 
    iconComponent: Compass,
    badge: '35+ CAMPUS Polymers'
  },
]

function HeroTicker() {
  const items = [
    '🔥 Reliance Repol PP: ₹94.50/kg ▲0.8%',
    '🏭 India processes 20M+ tonnes of polymer annually',
    '🚀 ISRO PSLV relies on CFRP high-modulus composite fairings',
    '♻️ Carbios pilots world\'s first enzymatic PET recycling plant',
    '🇮🇳 India Medical Device market growing at 15.2% CAGR',
    '📦 Multi-layer EVOH films block 99.9% atmospheric oxygen'
  ]

  return (
    <div className="bg-[#0A0E1A] border-y border-white/10 overflow-hidden py-3 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400 flex-shrink-0 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          Live Industry Pulse
        </div>
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="inline-block animate-marquee text-slate-300 space-x-8">
            {items.concat(items).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span>{item}</span>
                <span className="text-white/20">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      
      {/* ── 1. 3D INTERACTIVE MOLECULAR HERO ── */}
      <Hero3D />

      {/* ── 2. LIVE COMMODITY & INDUSTRY TICKER ── */}
      <HeroTicker />

      {/* ── 3. 19 UNIQUE SUBJECTS FLOATING GRID SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="border-b border-white/10 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
              <BookOpen className="w-3.5 h-3.5" /> Core Curriculum
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              19 Subjects &middot; 216 Lessons
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 max-w-2xl">
              Complete polymer engineering curriculum aligned with B.Tech, Diploma, and GATE Chemical / Polymer standards.
            </p>
          </div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider group"
          >
            View Full Curriculum <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 19 Subject Cards Floating Grid */}
        <FloatingSubjects />
      </section>

      {/* ── 4. POWER TOOLS SECTION (GLASSMORPHISM) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
            <Zap className="w-3.5 h-3.5" /> Interactive Power Tools
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Calculate. Diagnose. Compare.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Production-grade engineering tools built for plant managers, mold designers, and QA/QC specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((tool) => {
            const Icon = tool.iconComponent
            return (
              <GlassCard key={tool.name} glowColor={tool.color}>
                <div className="p-6 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/15"
                        style={{ backgroundColor: `${tool.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: tool.color }} />
                      </div>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                        {tool.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white tracking-tight mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 group"
                    >
                      Launch Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* ── 5. DEEP DIVE PORTALS (LUXURY GLASS GRADIENTS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* History Portal */}
          <GlassCard glowColor="#3B82F6">
            <div className="p-8 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block mb-3">
                  1862 &rarr; 2026
                </span>
                <h3 className="font-display text-2xl font-black text-white mb-2">
                  History of Polymers
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Explore 162 years of macromolecular science, from Alexander Parkes to Ziegler-Natta catalysts and circular vitrimers.
                </p>
              </div>
              <Link 
                href="/history"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 group"
              >
                Explore Timeline <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </GlassCard>

          {/* World Atlas Portal */}
          <GlassCard glowColor="#FF7722">
            <div className="p-8 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block mb-3">
                  7 Core Sectors
                </span>
                <h3 className="font-display text-2xl font-black text-white mb-2">
                  World Atlas &amp; Industries
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Packaging, healthcare, automotive, aerospace, electronics, textiles, and construction deep-dives with mapped Indian plants.
                </p>
              </div>
              <Link 
                href="/world"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 group"
              >
                Open Deep Dives <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </GlassCard>

          {/* Career Portal */}
          <GlassCard glowColor="#10B981">
            <div className="p-8 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-3">
                  SPE Tracks &middot; 4-28 LPA
                </span>
                <h3 className="font-display text-2xl font-black text-white mb-2">
                  Industry Career Pathways
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Explore 20+ specialized roles across Reliance, Supreme, Tata, and SABIC with salary benchmarking and skill roadmaps.
                </p>
              </div>
              <Link 
                href="/careers"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 group"
              >
                Explore Careers <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </GlassCard>

        </div>
      </section>

      {/* ── 6. EDITORIAL QUOTE BANNER ── */}
      <section className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-950 border-y border-white/10 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-display text-xl sm:text-2xl md:text-3xl font-black text-amber-300 italic leading-snug">
            &ldquo;Plastics are the workhorses of modern civilization — invisible, indispensable, misunderstood.&rdquo;
          </p>
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest pt-2">
            &mdash; Industry Perspective &middot; PolymerHub
          </p>
        </div>
      </section>

      {/* ── 7. AI TUTOR HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl p-8 sm:p-12 text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full px-3.5 py-1">
                <Brain className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-300">
                  AI Tutor &middot; Grounded in 216 Lessons
                </span>
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                Ask Anything. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-orange-400">
                  Get Rigorous Engineering Answers.
                </span>
              </h2>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
                Not a generic chatbot. PolymerHub AI Tutor uses real vector similarity search across all 216 lessons — citing actual equations, ASTM standards, and textbook data.
              </p>
              
              {/* Question Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'What is the difference between Izod & Charpy impact?',
                  'How does vulcanization cure kinetics work?',
                  'Calculate cooling time for 3mm PP wall'
                ].map((q) => (
                  <Link
                    key={q}
                    href={`/ai-tutor?prompt=${encodeURIComponent(q)}`}
                    className="text-xs font-mono text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg transition-all"
                  >
                    &ldquo;{q}&rdquo;
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <Link 
                  href="/ai-tutor" 
                  className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider px-8 py-4 rounded-xl border border-amber-300 transition-all shadow-[0_8px_24px_rgba(245,197,24,0.3)] hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" /> Launch AI Tutor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Live Simulation Bubble */}
            <div className="lg:col-span-5 bg-slate-950/80 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-slate-300">Live &middot; 15 Free Queries/Day</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded">
                  Gemini RAG Pipeline
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <p className="text-[10px] font-mono text-slate-400 mb-1">Student asked:</p>
                  <p className="text-slate-200 font-medium">&ldquo;Why does PP become brittle after gamma sterilization?&rdquo;</p>
                </div>
                <div className="bg-blue-950/40 border border-blue-500/30 p-3.5 rounded-xl text-slate-300 leading-relaxed">
                  <p className="text-[10px] font-mono text-emerald-400 mb-1 font-bold">AI Tutor (Citing Lesson 4: Medical Plastics):</p>
                  <p className="text-slate-200">
                    Standard PP undergoes free-radical chain scission under high-energy gamma radiation. Radiation-stabilised grades with specialized HALS antioxidants are required to prevent post-irradiation embrittlement.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. TRUST BADGES STRIP ── */}
      <section className="bg-[#0A0E1A] border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              India DPDP Act 2023 Compliant
            </span>
            <span className="w-px h-4 bg-white/10 hidden sm:inline-block" />
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-400" />
              100% Legally &amp; Academically Audited
            </span>
            <span className="w-px h-4 bg-white/10 hidden sm:inline-block" />
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-amber-400" />
              19 Subjects &middot; 216 Lessons Mapped
            </span>
            <span className="w-px h-4 bg-white/10 hidden sm:inline-block" />
            <span className="flex items-center gap-2 text-white/90">
              🇮🇳 Made in India for Global Engineers
            </span>
          </div>
        </div>
      </section>

      {/* ── 9. PLATFORM FOOTER ── */}
      <footer className="bg-[#050811] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1 space-y-4">
              <div className="font-display text-2xl font-black tracking-tight">
                Polymer<span className="text-amber-400">Hub</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                India&apos;s first Plastic Polymer Engineering knowledge platform for B.Tech &amp; Diploma students, faculty, and industry professionals.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="https://twitter.com/polymerhub_" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="X (Twitter)">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/lpk-naidu-3414153b2" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {[
              { title: 'Learn', links: [{ label: 'All 19 Subjects', href: '/subjects' }, { label: 'Materials Database', href: '/materials' }, { label: 'AI Polymer Tutor', href: '/ai-tutor' }, { label: 'Reading Room', href: '/library' }] },
              { title: 'Explore', links: [{ label: 'The World of Plastic', href: '/world' }, { label: '162 Years History', href: '/history' }, { label: 'Daily News Pulse', href: '/today' }, { label: 'SPE Career Tracks', href: '/careers' }] },
              { title: 'Tools & Legal', links: [{ label: 'Defect Troubleshooter', href: '/troubleshooter' }, { label: 'Polymer Comparator', href: '/comparator' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wider text-center md:text-left">
              &copy; 2026 PolymerHub &middot; India&apos;s #1 Plastic Polymer Engineering Knowledge Platform
            </p>
            <div className="flex gap-2">
              {['#2563EB', '#EA580C', '#15803D', '#CA8A04', '#7C3AED'].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
