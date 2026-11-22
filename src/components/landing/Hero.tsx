'use client'

import Link from 'next/link'
import WaitlistForm from './WaitlistForm'
import { ArrowRight, BookOpen, Calculator, Sparkles, MessageCircle, Trophy, TrendingUp, Atom, Layers, Wrench, ShieldCheck } from 'lucide-react'

export default function Hero() {
  return (
    <section id="waitlist" className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#070A12] text-white border-b border-slate-800/80">
      
      {/* ── Background Architectural Lighting & Radial Gradients ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.25)_0%,_rgba(15,23,42,0)_70%)] blur-2xl" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        {/* Subtle dot matrix pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* ── Floating Atmospheric Concept Badges (Claude / Anthropic Style) ── */}
      <div className="hidden 2xl:block absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
        {/* Badge 1: Top Left */}
        <div className="absolute top-12 left-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-300 shadow-xl opacity-75 transform -rotate-2">
          <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Polymer Kinetics</div>
          <div className="font-bold text-white mt-0.5">p_c = 2 / f_avg</div>
          <div className="text-[10px] text-slate-400">Carothers Gel Point</div>
        </div>

        {/* Badge 2: Top Right */}
        <div className="absolute top-16 right-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-300 shadow-xl opacity-75 transform rotate-3">
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Tooling Mechanics</div>
          <div className="font-bold text-white mt-0.5">F = P_cav &times; A_proj</div>
          <div className="text-[10px] text-slate-400">39.0 Metric Tons Clamp</div>
        </div>

        {/* Badge 3: Bottom Left */}
        <div className="absolute bottom-20 left-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-300 shadow-xl opacity-75 transform rotate-2">
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Domestic Spot Index</div>
          <div className="font-bold text-white mt-0.5">Reliance PP: ₹100.40/kg</div>
          <div className="text-[10px] text-emerald-400 font-semibold">+0.1% Firm Consolidation</div>
        </div>

        {/* Badge 4: Bottom Right */}
        <div className="absolute bottom-24 right-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs font-mono text-slate-300 shadow-xl opacity-75 transform -rotate-1">
          <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">GATE XE-F Engine</div>
          <div className="font-bold text-white mt-0.5">60-Min Timed CBT</div>
          <div className="text-[10px] text-slate-400">+1/+2 &middot; Negative Marking</div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Waitlist Headline & Direct Engine (7 cols) */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold tracking-wider shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Built in India &middot; Launching for Polymer Engineers Worldwide
            </div>

            {/* Giant Editorial Headline */}
            <h1 className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-extrabold text-white leading-[1.06] tracking-tight font-display">
              Master Polymer Engineering.
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent pt-1">
                From Molecules to Manufacturing.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl font-normal">
              One integrated learning and technical resource platform for polymer and plastics engineering students, GATE XE-F aspirants and plant professionals.
            </p>

            {/* Pricing Clarity Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-mono">
              <span className="font-bold text-emerald-400">100% Free Core Access</span>
              <span className="text-slate-600">&middot;</span>
              <span>One ₹149/mo Premium Plan</span>
              <span className="text-slate-600">&middot;</span>
              <span className="text-amber-400 font-semibold">Early-Bird Perks Active</span>
            </div>

            {/* DIRECT WAITLIST CONVERSION ENGINE */}
            <div className="pt-1 max-w-xl">
              <WaitlistForm source="hero_main" />
            </div>

            {/* Secondary Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <a
                href="#interactive-demo"
                className="text-slate-300 hover:text-white hover:underline flex items-center gap-1.5 font-bold"
              >
                <span>Try Live Demos Below</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span>&middot;</span>
              <a
                href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Join Official WhatsApp Channel</span>
              </a>
            </div>

            {/* Verified Scale Proof Badges */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-slate-400">
              <span className="text-slate-200 font-bold">216 Lessons</span>
              <span className="text-slate-700">&middot;</span>
              <span className="text-slate-200 font-bold">19 Subjects</span>
              <span className="text-slate-700">&middot;</span>
              <span className="text-slate-200 font-bold">GATE XE-F Workspace</span>
              <span className="text-slate-700">&middot;</span>
              <span className="text-slate-200 font-bold">8 Engineering Solvers</span>
            </div>

          </div>

          {/* Right Column: High-Fidelity Platform Window Mockup (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glowing Aura behind Window */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 animate-pulse pointer-events-none" />

              {/* Mac-Style Platform Window Frame */}
              <div className="relative bg-[#0B0F19] rounded-2xl border-2 border-slate-800 shadow-2xl overflow-hidden text-slate-200">
                
                {/* Window Title Bar */}
                <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 font-medium">
                    polymerhubofindia.com/workspace
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Live Preview
                  </span>
                </div>

                {/* Window Content Stacks */}
                <div className="p-5 space-y-4">
                  
                  {/* Card 1: Sample Lesson Module */}
                  <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] text-blue-400 font-bold uppercase">Polymer Chemistry</div>
                          <div className="font-display font-bold text-xs text-white">Carothers Gel Point Derivation</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        Unit 1
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300">
                      <div className="text-[10px] text-slate-500 mb-0.5">Degree of Polymerization:</div>
                      <div className="font-bold text-blue-300 text-xs">X_n = 1 / (1 - p) &middot; p_c = 2 / f_avg</div>
                    </div>
                  </div>

                  {/* Card 2: Shop-Floor Clamping Solver */}
                  <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                          <Calculator className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] text-amber-400 font-bold uppercase">Engineering Solver</div>
                          <div className="font-display font-bold text-xs text-white">Press Clamping Force</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        15% Margin
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-800">
                      <span className="font-mono text-xs text-slate-400">Total Force:</span>
                      <span className="font-mono text-base font-bold text-amber-400">382.4 kN (39.0 T)</span>
                    </div>
                  </div>

                  {/* Card 3: Live Petrochem Spot Benchmark */}
                  <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-mono text-[9px] text-slate-400 uppercase">Indicative Benchmark</div>
                        <div className="font-sans text-xs font-bold text-white">Reliance PP Raffia (H030SG)</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-white">₹100.40/kg</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">+0.1% Firm</div>
                    </div>
                  </div>

                  {/* Card 4: GATE XE-F Practice Status */}
                  <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 rounded-xl p-3 border border-blue-500/40 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>GATE XE-F Mock Test CBT Active</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] uppercase font-bold text-white">
                      60-Min Timed
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
