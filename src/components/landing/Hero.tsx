'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, MessageCircle, Trophy, Calculator, BookOpen, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white border-b border-slate-200">
      
      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/70 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Conversion Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Built in India &middot; Designed for Polymer Learners Everywhere
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold text-slate-950 leading-[1.08] tracking-tight font-display">
              Master Polymer Engineering.
              <span className="block bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-600 bg-clip-text text-transparent pt-1">
                From Molecules to Manufacturing.
              </span>
            </h1>

            {/* Two-sentence value proposition */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans max-w-2xl font-normal">
              One integrated learning and technical resource platform for polymer and plastics engineering students, GATE XE-F aspirants and industry professionals.
            </p>

            {/* Price Clarity Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
              <span className="font-bold text-slate-900">Free learning access</span>
              <span>&middot;</span>
              <span>One Premium plan &middot; ₹149/mo</span>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-xl">
              <Link
                href="/login?mode=signup"
                className="px-8 py-4 rounded-xl font-mono font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider group"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#interactive-demo"
                className="px-6 py-4 rounded-xl font-mono font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <span>Try Live Demos &darr;</span>
              </a>
            </div>

            {/* WhatsApp Community Direct Link */}
            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-slate-600">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Or join the official</span>
              <a
                href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold"
              >
                PolymerHub WhatsApp Channel &rarr;
              </a>
            </div>

            {/* Honest Scale Line Underneath */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 font-mono">
              <span className="font-bold text-slate-900">216 Lessons</span>
              <span>&middot;</span>
              <span className="font-bold text-slate-900">19 Subjects</span>
              <span>&middot;</span>
              <span className="font-bold text-slate-900">GATE XE-F Preparation</span>
              <span>&middot;</span>
              <span className="font-bold text-slate-900">8 Engineering Solvers</span>
            </div>

          </div>

          {/* Right Column: PolymerHub Product UI Showcase Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
              
              {/* Product Card 1: Sample Technical Lesson */}
              <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-lg relative transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-blue-600 font-bold uppercase">Lesson Module &middot; Step-Growth</div>
                      <div className="font-display font-bold text-sm text-slate-900">Carothers Gel Point Derivation</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">Verified</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  <div className="text-[11px] text-slate-500 mb-1">Key Equation:</div>
                  <div className="font-bold text-blue-950 text-sm">p_c = 2 / f_avg = 1 / (X_n - 1)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Predicts critical conversion before crosslinking gelation occurs.</div>
                </div>
              </div>

              {/* Product Card 2: Live Engineering Solver Badge */}
              <div className="bg-slate-900 text-white rounded-2xl border-2 border-slate-800 p-5 shadow-xl relative transform lg:translate-x-4 hover:translate-x-5 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-amber-400 font-bold uppercase">Engineering Solver</div>
                      <div className="font-display font-bold text-sm text-white">Press Clamping Force</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">Active</span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                  <span className="font-mono text-xs text-slate-400">Total Projected Force:</span>
                  <span className="font-mono text-lg font-bold text-amber-400">382.4 kN (39.0 T)</span>
                </div>
              </div>

              {/* Product Card 3: Daily Resin Spot Benchmark */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-md flex items-center justify-between hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-slate-500 uppercase">Live Spot Index</div>
                    <div className="font-sans text-xs font-bold text-slate-900">Reliance PP Raffia (H030SG)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-900">₹100.40/kg</div>
                  <div className="font-mono text-[10px] text-emerald-600 font-bold">+0.1% Firm</div>
                </div>
              </div>

              {/* Product Floating Pill: GATE XE-F CBT Engine */}
              <div className="bg-blue-600 text-white rounded-xl px-4 py-2.5 shadow-lg flex items-center justify-between text-xs font-mono font-bold">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>GATE XE-F Mock Test: 60-Min CBT Active</span>
                </div>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase">Timed</span>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
