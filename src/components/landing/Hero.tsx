'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, MessageCircle, Trophy } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[82vh] flex items-center overflow-hidden bg-white border-b border-slate-200">
      
      {/* Background Architectural Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/hero/students-polymer-lab.jpg"
          alt="Students in a modern polymer science and engineering laboratory"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20 sm:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
        <div className="max-w-3xl space-y-6">
          
          {/* Top Category Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Built in India &middot; Designed for Polymer Learners Everywhere
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-extrabold text-slate-950 leading-[1.08] tracking-tight font-display">
            Master Polymer Engineering.
            <span className="block bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-600 bg-clip-text text-transparent pt-1">
              From Molecules to Manufacturing.
            </span>
          </h1>

          {/* Value Proposition Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-sans max-w-2xl font-normal">
            Building India&apos;s dedicated, integrated learning platform for polymer science and plastics engineering. Master structured curriculum, explore 3D molecular structures, solve shop-floor defects, and prepare systematically for GATE XE-F.
          </p>

          {/* Dual Primary Call-to-Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-xl">
            <Link
              href="/login?mode=signup"
              className="px-8 py-4 rounded-xl font-mono font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider group"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl font-mono font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              <span>Join WhatsApp Channel</span>
            </a>
          </div>

          {/* Secondary Quick Jump */}
          <div className="pt-1 flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Or explore:</span>
            <a href="#gate-xef" className="text-blue-700 hover:underline font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> GATE XE-F Prep &darr;
            </a>
            <span>&middot;</span>
            <a href="#interactive-demo" className="text-slate-700 hover:underline font-medium">
              Try Interactive Demo &darr;
            </a>
          </div>

          {/* Trust & Compliance Micro-Badges */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Free Core Access
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Curriculum Aligned to AICTE &amp; CIPET
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              RAG-Grounded AI Copilot
            </span>
          </div>

        </div>
      </div>

    </section>
  )
}
