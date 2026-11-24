'use client'

import Link from 'next/link'
import WaitlistForm from './WaitlistForm'
import { BookOpen, Calculator, Sparkles, MessageCircle, Trophy, TrendingUp, Atom, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section id="waitlist" className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-white text-slate-900 border-b border-slate-200">
      
      {/* ── Background Architectural Subtle Lighting & Grid Pattern ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.08)_0%,_transparent_70%)] blur-2xl" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Crisp light grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* 1. Top Launch Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold tracking-wider shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          ✨ India&apos;s Dedicated Polymer Engineering Ecosystem &middot; Waitlist Open
        </div>

        {/* 2. Grand Centered Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-950 tracking-tight font-display leading-[1.08] sm:leading-[1.1] max-w-4xl mx-auto">
          Master Polymer Engineering.
          <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent pb-2.5 pt-1">
            From Molecules to Manufacturing.
          </span>
        </h1>

        {/* 3. Centered Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
          One connected digital platform for polymer science students, GATE XE-F aspirants, and plastics manufacturing engineers. 19 subjects, 216 curriculum lessons, shop-floor press solvers, and live petrochem intelligence.
        </p>

        {/* 4. Pricing & Access Clarity Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 shadow-2xs">
          <span className="font-bold text-emerald-700">100% Free Core Access</span>
          <span className="text-slate-300">&middot;</span>
          <span>Single Transparent ₹149/mo Plan</span>
          <span className="text-slate-300">&middot;</span>
          <span className="text-amber-700 font-semibold">Priority Launch Perks Active</span>
        </div>

        {/* 5. Centered Waitlist Intake Form (Front & Center) */}
        <div className="pt-2 max-w-2xl mx-auto">
          <WaitlistForm source="hero_main" centered />
        </div>

        {/* 6. Quick Action Links */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500">
          <a
            href="#interactive-demo"
            className="hover:text-blue-700 hover:underline flex items-center gap-1.5 font-bold text-blue-600"
          >
            <span>Try Live Demos Below</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <span className="text-slate-300">&middot;</span>
          <a
            href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Join WhatsApp Community</span>
          </a>
        </div>

        {/* 7. Centered macOS Window Product Showcase with Floating Badges (Light Clean Theme) */}
        <div className="pt-8 relative max-w-4xl mx-auto">
          
          {/* Subtle Luminous Glow behind Window */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-200/50 via-indigo-200/50 to-emerald-200/50 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

          {/* Floating Callout Badges around Window */}
          <div className="hidden sm:block absolute -top-5 -left-6 z-20 p-3 rounded-2xl bg-white/95 border-2 border-amber-300/80 backdrop-blur-xl shadow-xl text-left transform -rotate-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-200">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-amber-700 font-bold uppercase">Shop-Floor Solver</div>
                <div className="font-mono text-xs font-bold text-slate-900">39.0 Metric Tons Clamping</div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute -top-5 -right-6 z-20 p-3 rounded-2xl bg-white/95 border-2 border-blue-300/80 backdrop-blur-xl shadow-xl text-left transform rotate-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-blue-700 font-bold uppercase">GATE XE-F Engine</div>
                <div className="font-mono text-xs font-bold text-slate-900">Carothers Solved (p_c = 0.833)</div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute -bottom-5 -left-6 z-20 p-3 rounded-2xl bg-white/95 border-2 border-emerald-300/80 backdrop-blur-xl shadow-xl text-left transform rotate-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-emerald-700 font-bold uppercase">Domestic Spot</div>
                <div className="font-mono text-xs font-bold text-slate-900">Reliance PP: ₹101.20/kg (+0.4%)</div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute -bottom-5 -right-6 z-20 p-3 rounded-2xl bg-white/95 border-2 border-purple-300/80 backdrop-blur-xl shadow-xl text-left transform -rotate-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-200">
                <Atom className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-purple-700 font-bold uppercase">3D Molecular Lab</div>
                <div className="font-mono text-xs font-bold text-slate-900">Isotactic Polypropylene</div>
              </div>
            </div>
          </div>

          {/* Actual Mac Window Container */}
          <div className="relative bg-white rounded-2xl border-2 border-slate-200 shadow-2xl overflow-hidden text-left">
            
            {/* Window Title Bar */}
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="font-mono text-[11px] text-slate-600 font-medium">
                polymerhubofindia.com/workspace
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Connected Workspace
              </span>
            </div>

            {/* Window Grid Content: 3 Live Real Feature Panels */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50">
              
              {/* Panel 1: Polymer Chemistry Module */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-blue-600 font-bold uppercase">Chemistry</div>
                      <div className="font-display font-bold text-xs text-slate-900">Carothers Kinetics</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Unit 1
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-0.5">
                  <div className="text-[10px] text-slate-500">Degree of Polymerization:</div>
                  <div className="font-bold text-blue-700 text-xs">X_n = 1 / (1 - p)</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">p_c = 2 / f_avg = 0.833</div>
                </div>
              </div>

              {/* Panel 2: Shop-Floor Press Clamping Solver */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                      <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-amber-700 font-bold uppercase">Press Solver</div>
                      <div className="font-display font-bold text-xs text-slate-900">Clamping Force</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    15% Margin
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-0.5">
                  <div className="text-[10px] text-slate-500">Total Calculated Tonnage:</div>
                  <div className="font-bold text-amber-700 text-sm">382.4 kN (39.0 T)</div>
                  <div className="text-[10px] text-slate-500">P_cav: 350 bar &middot; 4-Cavity</div>
                </div>
              </div>

              {/* Panel 3: Domestic Spot Benchmark */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-emerald-700 font-bold uppercase">Spot Benchmark</div>
                      <div className="font-display font-bold text-xs text-slate-900">Reliance PP Raffia</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    +0.4% Firm
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 space-y-0.5">
                  <div className="text-[10px] text-slate-500">Ex-Works Plant Gate:</div>
                  <div className="font-bold text-slate-900 text-sm">₹100.80/kg</div>
                  <div className="text-[10px] text-slate-500">Grade: H030SG &middot; Hazira</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 8. Integrated Proof Strip at Base of Hero */}
        <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-950">216</span>
            <span className="text-slate-500">Curriculum Lessons</span>
          </div>
          <span className="hidden sm:inline text-slate-300">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-950">19</span>
            <span className="text-slate-500">Academic Subjects</span>
          </div>
          <span className="hidden sm:inline text-slate-300">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-950">8</span>
            <span className="text-slate-500">Industrial Solvers</span>
          </div>
          <span className="hidden sm:inline text-slate-300">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">GATE XE-F</span>
            <span className="text-slate-500">CBT Workspace</span>
          </div>
        </div>

      </div>

    </section>
  )
}
