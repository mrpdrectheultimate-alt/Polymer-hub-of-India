'use client'

import Link from 'next/link'
import { Shield, Globe, GraduationCap } from 'lucide-react'
import { Logo } from './Logo'

interface FooterProps {
  showTrustBar?: boolean
}

export default function Footer({ showTrustBar = false }: FooterProps) {
  return (
    <footer className="bg-white text-[#64748B] text-xs border-t border-[#E2E8F0]">
      
      {/* ── Top Compliance & Trust Bar (Only displayed on Homepage when showTrustBar={true}) ── */}
      {showTrustBar && (
        <div className="bg-[#FAFAFA] border-b border-[#F1F5F9] py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-[#16A34A] font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>India DPDP Act 2023 Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-[#2563EB] font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>100% Legally &amp; Academically Audited</span>
            </div>
            <div className="flex items-center gap-2 text-[#CA8A04] font-medium">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>19 Subjects &middot; 216 Lessons Mapped</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#111827] font-medium">
              <span>🇮🇳 Made in India for Global Engineers</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Footer Links ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Description Column (2 cols wide on md+) */}
          <div className="md:col-span-2 space-y-4">
            <div className="mb-2">
              <Logo variant="full" theme="light" />
            </div>
            <p className="text-[#64748B] text-xs leading-relaxed max-w-sm font-normal">
              India&apos;s first Plastic Polymer Engineering knowledge platform for B.Tech &amp; Diploma students, faculty, and industry professionals.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Twitter"
                className="w-8 h-8 rounded-lg bg-[#FAFAFA] border border-[#E2E8F0] flex items-center justify-center text-[#111827] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all"
              >
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-[#FAFAFA] border border-[#E2E8F0] flex items-center justify-center text-[#111827] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all"
              >
                <span className="font-bold text-xs font-mono">in</span>
              </a>
            </div>
          </div>

          {/* Column 2: LEARN */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-[#111827] uppercase tracking-widest">
              LEARN
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/subjects" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  All 19 Subjects
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  Materials Database
                </Link>
              </li>
              <li>
                <Link href="/ai-tutor" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  AI Polymer Tutor
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  Reading Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: EXPLORE */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-[#111827] uppercase tracking-widest">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/world" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  The World of Plastic
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  164 Years History
                </Link>
              </li>
              <li>
                <Link href="/today" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  Daily News Pulse
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  SPE Career Tracks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: TOOLS & LEGAL */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold text-[#111827] uppercase tracking-widest">
              TOOLS &amp; LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/troubleshooter" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  Defect Troubleshooter
                </Link>
              </li>
              <li>
                <Link href="/comparator" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  Polymer Comparator
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#64748B] hover:text-[#2563EB] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Copyright & Dot Matrix Bar ── */}
      <div className="bg-[#FAFAFA] border-t border-[#F1F5F9] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#94A3B8]">
          <p>
            &copy; 2026 POLYMERHUB &middot; INDIA&apos;S #1 PLASTIC POLYMER ENGINEERING KNOWLEDGE PLATFORM
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="w-2 h-2 rounded-full bg-[#FF8A00]" />
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="w-2 h-2 rounded-full bg-[#F5C518]" />
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          </div>
        </div>
      </div>

    </footer>
  )
}
