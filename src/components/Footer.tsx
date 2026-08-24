'use client'

import Link from 'next/link'
import { Shield, Globe, GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0A0E1A] text-slate-400 text-xs border-t border-slate-800">
      
      {/* ── Top Compliance & Trust Bar ── */}
      <div className="border-b border-slate-800/80 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>India DPDP Act 2023 Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <Globe className="w-3.5 h-3.5" />
            <span>100% Legally &amp; Academically Audited</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>19 Subjects &middot; 216 Lessons Mapped</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>🇮🇳 Made in India for Global Engineers</span>
          </div>
        </div>
      </div>

      {/* ── Main Footer Links ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Description Column (2 cols wide on md+) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="font-display font-black text-2xl text-white tracking-tight">
                Polymer<span className="text-[#FF8A00]">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-normal">
              India&apos;s first Plastic Polymer Engineering knowledge platform for B.Tech &amp; Diploma students, faculty, and industry professionals.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Twitter"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <span className="font-bold text-xs font-mono">in</span>
              </a>
            </div>
          </div>

          {/* Column 2: LEARN */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-amber-500 uppercase tracking-widest">
              LEARN
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/subjects" className="hover:text-white transition-colors">
                  All 19 Subjects
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-white transition-colors">
                  Materials Database
                </Link>
              </li>
              <li>
                <Link href="/ai-tutor" className="hover:text-white transition-colors">
                  AI Polymer Tutor
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-white transition-colors">
                  Reading Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: EXPLORE */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-amber-500 uppercase tracking-widest">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/world" className="hover:text-white transition-colors">
                  The World of Plastic
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-white transition-colors">
                  162 Years History
                </Link>
              </li>
              <li>
                <Link href="/today" className="hover:text-white transition-colors">
                  Daily News Pulse
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  SPE Career Tracks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: TOOLS & LEGAL */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-amber-500 uppercase tracking-widest">
              TOOLS &amp; LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/troubleshooter" className="hover:text-white transition-colors">
                  Defect Troubleshooter
                </Link>
              </li>
              <li>
                <Link href="/comparator" className="hover:text-white transition-colors">
                  Polymer Comparator
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Copyright & Dot Matrix Bar ── */}
      <div className="border-t border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <p>
            &copy; 2026 POLYMERHUB &middot; INDIA&apos;S #1 PLASTIC POLYMER ENGINEERING KNOWLEDGE PLATFORM
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="w-2 h-2 rounded-full bg-[#FF8A00]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
        </div>
      </div>

    </footer>
  )
}
