'use client'

import Link from 'next/link'
import WaitlistForm from './WaitlistForm'
import { BookOpen, Calculator, Sparkles, MessageCircle, Trophy, TrendingUp, Atom, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section id="waitlist" className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#0A122A] via-[#0D1C44] to-[#0A122A] text-white border-b border-slate-800">
      
      {/* ── Background Architectural Lighting & Radial Gradients (AgentHub Style) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.35)_0%,_rgba(15,23,42,0)_70%)] blur-2xl" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* 1. Top Launch Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/90 border border-blue-400/40 text-blue-200 text-xs font-mono font-bold tracking-wider shadow-lg shadow-blue-950/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ✨ India&apos;s Dedicated Polymer Engineering Ecosystem &middot; Waitlist Open
        </div>

        {/* 2. Grand Centered Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight font-display leading-[1.08] max-w-4xl mx-auto">
          Master Polymer Engineering.
          <span className="block bg-gradient-to-r from-blue-300 via-indigo-200 to-emerald-300 bg-clip-text text-transparent mt-2">
            From Molecules to Manufacturing.
          </span>
        </h1>

        {/* 3. Centered Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
          One connected digital platform for polymer science students, GATE XE-F aspirants, and plastics manufacturing engineers. 19 subjects, 216 curriculum lessons, shop-floor press solvers, and live petrochem intelligence.
        </p>

        {/* 4. Pricing & Access Clarity Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-md">
          <span className="font-bold text-emerald-400">100% Free Core Access</span>
          <span className="text-slate-600">&middot;</span>
          <span>Single Transparent ₹149/mo Plan</span>
          <span className="text-slate-600">&middot;</span>
          <span className="text-amber-400 font-semibold">Priority Launch Perks Active</span>
        </div>

        {/* 5. Centered Waitlist Intake Form (Front & Center) */}
        <div className="pt-2 max-w-2xl mx-auto">
          <WaitlistForm source="hero_main" centered />
        </div>

        {/* 6. Quick Action Links */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-300">
          <a
            href="#interactive-demo"
            className="hover:text-white hover:underline flex items-center gap-1.5 font-bold text-blue-300"
          >
            <span>Try Live Demos Below</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <span className="text-slate-600">&middot;</span>
          <a
            href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Join WhatsApp Community</span>
          </a>
        </div>

        {/* 7. Centered macOS Window Product Showcase with Floating Badges (AgentHub Style) */}
        <div className="pt-8 relative max-w-4xl mx-auto">
          
          {/* Luminous Glow behind Window */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-3xl blur-2xl opacity-30 pointer-events-none" />

          {/* Floating Callout Badges around Window */}
          <div className="hidden sm:block absolute -top-5 -left-6 z-20 p-3 rounded-2xl bg-slate-900/95 border-2 border-amber-500/50 backdrop-blur-xl shadow-2xl text-left transform -rotate-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-amber-400 font-bold uppercase">Shop-Floor Solver</div>
                <div className="font-mono text-xs font-bold text-white">39.0 Metric Tons Clamping</div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute -top-5 -right-6 z-20 p-3 rounded-2xl bg-slate-900/95 border-2 border-blue-500/50 backdrop-blur-xl shadow-2xl text-left transform rotate-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-blue-400 font-bold uppercase">GATE XE-F Engine</div>
                <div className="font-mono text-xs font-bold text-white">Carothers Solved (p_c = 0.833)</div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute -bottom-5 -left-6 z-20 p-3 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/50 backdrop-blur-xl shadow-2xl text-left transform rotate-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-emerald-400 font-bold uppercase">Domestic Spot</div>
                <div className="font-mono text-xs font-bold text-white">Reliance PP: ₹100.40/kg (+0.1%)</div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute -bottom-5 -right-6 z-20 p-3 rounded-2xl bg-slate-900/95 border-2 border-purple-500/50 backdrop-blur-xl shadow-2xl text-left transform -rotate-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                <Atom className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-purple-400 font-bold uppercase">3D Molecular Lab</div>
                <div className="font-mono text-xs font-bold text-white">Isotactic Polypropylene</div>
              </div>
            </div>
          </div>

          {/* Actual Mac Window Container */}
          <div className="relative bg-[#0E1528] rounded-2xl border-2 border-slate-700/90 shadow-2xl overflow-hidden text-left">
            
            {/* Window Title Bar */}
            <div className="px-4 py-3 bg-[#090E1C] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
              </div>
              <div className="font-mono text-[11px] text-slate-400 font-medium">
                polymerhubofindia.com/workspace
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Connected Workspace
              </span>
            </div>

            {/* Window Grid Content: 3 Live Real Feature Panels */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Panel 1: Polymer Chemistry Module */}
              <div className="bg-[#131D36] rounded-xl border border-slate-700/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-blue-400 font-bold uppercase">Chemistry</div>
                      <div className="font-display font-bold text-xs text-white">Carothers Kinetics</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Unit 1
                  </span>
                </div>
                <div className="p-2.5 bg-[#090E1C] rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-0.5">
                  <div className="text-[10px] text-slate-500">Degree of Polymerization:</div>
                  <div className="font-bold text-blue-300 text-xs">X_n = 1 / (1 - p)</div>
                  <div className="text-[10px] text-emerald-400">p_c = 2 / f_avg = 0.833</div>
                </div>
              </div>

              {/* Panel 2: Shop-Floor Press Clamping Solver */}
              <div className="bg-[#131D36] rounded-xl border border-slate-700/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                      <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-amber-400 font-bold uppercase">Press Solver</div>
                      <div className="font-display font-bold text-xs text-white">Clamping Force</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    15% Margin
                  </span>
                </div>
                <div className="p-2.5 bg-[#090E1C] rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-0.5">
                  <div className="text-[10px] text-slate-500">Total Calculated Tonnage:</div>
                  <div className="font-bold text-amber-400 text-sm">382.4 kN (39.0 T)</div>
                  <div className="text-[10px] text-slate-400">P_cav: 350 bar &middot; 4-Cavity</div>
                </div>
              </div>

              {/* Panel 3: Domestic Spot Benchmark */}
              <div className="bg-[#131D36] rounded-xl border border-slate-700/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-emerald-400 font-bold uppercase">Spot Benchmark</div>
                      <div className="font-display font-bold text-xs text-white">Reliance PP Raffia</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    +0.1% Firm
                  </span>
                </div>
                <div className="p-2.5 bg-[#090E1C] rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-0.5">
                  <div className="text-[10px] text-slate-500">Ex-Works Plant Gate:</div>
                  <div className="font-bold text-white text-sm">₹100.40/kg</div>
                  <div className="text-[10px] text-slate-400">Grade: H030SG &middot; Hazira</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 8. Integrated Proof Strip at Base of Hero */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">216</span>
            <span className="text-slate-400">Curriculum Lessons</span>
          </div>
          <span className="hidden sm:inline text-slate-600">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">19</span>
            <span className="text-slate-400">Academic Subjects</span>
          </div>
          <span className="hidden sm:inline text-slate-600">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">8</span>
            <span className="text-slate-400">Industrial Solvers</span>
          </div>
          <span className="hidden sm:inline text-slate-600">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">GATE XE-F</span>
            <span className="text-slate-400">CBT Workspace</span>
          </div>
        </div>

      </div>

    </section>
  )
}
