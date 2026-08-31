'use client'

import Link from 'next/link'
import { Shield, BookOpen, Layers, CheckCircle2 } from 'lucide-react'
import { Logo } from './Logo'

interface FooterProps {
  showTrustBar?: boolean
}

export default function Footer({ showTrustBar = false }: FooterProps) {
  return (
    <footer className="bg-white text-slate-700 text-xs border-t border-slate-200 font-sans">
      
      {/* ── Top Compliance & Trust Bar (High-Contrast & Honest Claims) ── */}
      {showTrustBar && (
        <div className="bg-slate-50 border-b border-slate-200 py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2.5 gap-x-6 text-xs font-mono font-medium">
            <div className="flex items-center gap-2 text-slate-900">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Privacy-First Architecture</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900">
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span>19 Subjects &middot; 216 Curriculum Lessons</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>ASTM &amp; ISO Standard Aligned</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
              <span>Made in India for Global Engineers</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Footer Links ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Description Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="mb-2">
              <Logo variant="full" theme="light" />
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm font-normal">
              India&apos;s dedicated Plastic Polymer Engineering knowledge platform for B.Tech &amp; Diploma students, faculty, and industry professionals.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Twitter"
                className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all shadow-xs"
              >
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all shadow-xs"
              >
                <span className="font-bold text-xs font-mono">in</span>
              </a>
            </div>
          </div>

          {/* Column 2: LEARN */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
              LEARN
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/subjects" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  All 19 Subjects
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Materials Database
                </Link>
              </li>
              <li>
                <Link href="/ai-tutor" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  AI Polymer Copilot
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Reading Room &amp; Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: EXPLORE */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/world" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  The World of Plastic
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  164 Years History
                </Link>
              </li>
              <li>
                <Link href="/today" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Daily Industry News
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  SPE Career Pathways
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: TOOLS & LEGAL */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
              TOOLS &amp; LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/troubleshooter" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Defect Troubleshooter
                </Link>
              </li>
              <li>
                <Link href="/comparator" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Polymer Comparator
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Copyright & Dot Matrix Bar ── */}
      <div className="bg-slate-50 border-t border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600 font-medium">
          <p>
            &copy; 2026 PolymerHub &middot; Precision Knowledge Platform for Polymer Science &amp; Engineering
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B132B]" title="Deep Navy" />
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" title="PolymerHub Blue" />
            <span className="w-2 h-2 rounded-full bg-[#FF8A00]" title="Indian Saffron" />
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" title="Indian Green" />
            <span className="w-2 h-2 rounded-full bg-[#F5C518]" title="Gold Accent" />
          </div>
        </div>
      </div>

    </footer>
  )
}
