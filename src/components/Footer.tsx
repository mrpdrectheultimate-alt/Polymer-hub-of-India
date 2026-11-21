'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, BookOpen, Layers, CheckCircle2, Send, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { Logo } from './Logo'
import { InlineContactComposer } from './InlineContactComposer'
import { ContactChannel } from '@/lib/contact'

interface FooterProps {
  showTrustBar?: boolean
}

export default function Footer({ showTrustBar = false }: FooterProps) {
  const [activeChannel, setActiveChannel] = useState<ContactChannel | null>(null)

  const toggleChannel = (channel: ContactChannel) => {
    setActiveChannel((current) => (current === channel ? null : channel))
  }

  return (
    <footer className="bg-white text-slate-700 text-xs border-t border-slate-200 font-sans">
      
      {/* ── Top Compliance & Trust Bar (High-Contrast & Honest Claims) ── */}
      {showTrustBar && (
        <div className="bg-slate-50 border-b border-slate-200 py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1850px] 4xl:max-w-[2400px] mx-auto flex flex-wrap items-center justify-between gap-y-2.5 gap-x-6 text-xs font-mono font-medium">
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
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1850px] 4xl:max-w-[2400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Description Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="mb-2">
              <Logo variant="full" theme="light" />
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm font-normal">
              India&apos;s dedicated Plastic Polymer Engineering knowledge platform for B.Tech &amp; Diploma students, faculty, and industry professionals.
            </p>

            {/* Interactive In-App Contact Gateway Channels (Expand Inline in Footer) */}
            <div id="footer-contact-channels" className="pt-1 space-y-2.5 text-xs">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Instant In-App Contact Channels:
              </span>

              {/* Support Channel */}
              <div className="space-y-2">
                <div
                  onClick={() => toggleChannel('support')}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group ${
                    activeChannel === 'support'
                      ? 'bg-blue-50/80 border-2 border-blue-500 shadow-sm'
                      : 'bg-slate-50 border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-mono text-[9px] font-bold text-blue-700 bg-blue-100/80 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Support
                    </span>
                    <span className="text-slate-700 font-mono text-[11px] truncate">
                      support@polymerhubofindia.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleChannel('support')
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all shadow-2xs flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeChannel === 'support'
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-white group-hover:bg-[#2563EB] text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-[#2563EB]'
                    }`}
                  >
                    {activeChannel === 'support' ? (
                      <>
                        <X className="w-2.5 h-2.5 text-white" />
                        <span>Close</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-2.5 h-2.5 text-amber-500 group-hover:text-amber-300" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {activeChannel === 'support' && (
                    <InlineContactComposer
                      channel="support"
                      onClose={() => setActiveChannel(null)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Inquiries Channel */}
              <div className="space-y-2">
                <div
                  onClick={() => toggleChannel('inquiries')}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group ${
                    activeChannel === 'inquiries'
                      ? 'bg-emerald-50/80 border-2 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-mono text-[9px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Inquiries
                    </span>
                    <span className="text-slate-700 font-mono text-[11px] truncate">
                      hello@polymerhubofindia.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleChannel('inquiries')
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all shadow-2xs flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeChannel === 'inquiries'
                        ? 'bg-emerald-600 text-white border border-emerald-600'
                        : 'bg-white group-hover:bg-emerald-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-emerald-600'
                    }`}
                  >
                    {activeChannel === 'inquiries' ? (
                      <>
                        <X className="w-2.5 h-2.5 text-white" />
                        <span>Close</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-2.5 h-2.5 text-emerald-600 group-hover:text-emerald-200" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {activeChannel === 'inquiries' && (
                    <InlineContactComposer
                      channel="inquiries"
                      onClose={() => setActiveChannel(null)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Founder Channel */}
              <div className="space-y-2">
                <div
                  onClick={() => toggleChannel('founder')}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group ${
                    activeChannel === 'founder'
                      ? 'bg-amber-50/80 border-2 border-amber-500 shadow-sm'
                      : 'bg-slate-50 border border-slate-200/80 hover:border-amber-400 hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-mono text-[9px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Founder
                    </span>
                    <span className="text-slate-700 font-mono text-[11px] truncate">
                      founder@polymerhubofindia.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleChannel('founder')
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase transition-all shadow-2xs flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeChannel === 'founder'
                        ? 'bg-amber-600 text-white border border-amber-600'
                        : 'bg-white group-hover:bg-amber-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-amber-600'
                    }`}
                  >
                    {activeChannel === 'founder' ? (
                      <>
                        <X className="w-2.5 h-2.5 text-white" />
                        <span>Close</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-2.5 h-2.5 text-amber-600 group-hover:text-amber-200" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {activeChannel === 'founder' && (
                    <InlineContactComposer
                      channel="founder"
                      onClose={() => setActiveChannel(null)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Channel"
                title="Join PolymerHub Official WhatsApp Channel"
                className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.668-.699c.969.54 1.769.816 2.792.817h.005c3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.767-5.768-5.767zm3.393 8.163c-.144.405-.837.774-1.17.824-.311.045-.694.072-2.127-.518-1.748-.72-2.883-2.483-2.971-2.599-.088-.116-.708-.941-.708-1.794 0-.853.447-1.273.607-1.446.16-.174.348-.217.464-.217.116 0 .232.001.333.006.107.005.25-.041.391.297.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.059.116-.088.188-.175.29-.087.102-.183.228-.261.306-.087.087-.179.182-.077.356.101.174.45 1.742 1.488 2.665.342.304.629.499.845.568.216.069.412.06.567.037.174-.026.536-.219.611-.431.076-.212.076-.393.053-.431-.022-.038-.088-.06-.188-.11zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.637 0-3.161-.462-4.457-1.261l-.32-.198-2.956.775.789-2.882-.218-.346A8.209 8.209 0 013.75 12c0-4.549 3.701-8.25 8.25-8.25 4.549 0 8.25 3.701 8.25 8.25 0 4.549-3.701 8.25-8.25 8.25z"/>
                </svg>
              </a>
              <a
                href="https://t.me/polymerhubofindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Channel"
                title="Join PolymerHub Official Telegram Channel"
                className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z"/>
                </svg>
              </a>
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
                <Link href="/students" className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors flex items-center gap-1.5">
                  🎓 Campus &amp; Students Hub
                </Link>
              </li>
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
                  Plastics Career Pathways
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
                <Link href="/formulas" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Master Formula Library
                </Link>
              </li>
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
                <Link href="/legal" className="text-amber-700 hover:text-amber-900 font-bold transition-colors">
                  Legal &amp; Provenance Charter
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
              <li>
                <Link href="/refund" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors flex items-center justify-between">
                  <span>Cancellation &amp; Refund</span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">7-Day</span>
                </Link>
              </li>
              <li>
                <Link href="/.well-known/security.txt" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors">
                  Security Disclosure (RFC 9116)
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors flex items-center justify-between">
                  <span>Share Feedback / Report Bug</span>
                  <span className="text-[10px] text-amber-700 font-mono font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">Feedback</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    toggleChannel('support')
                    const elem = document.getElementById('footer-contact-channels')
                    if (elem) {
                      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }
                  }}
                  className="text-slate-700 hover:text-[#2563EB] font-medium transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Contact &amp; Support Desk</span>
                  <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">Instant</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Fair Dealing Disclaimer Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 text-[11px] text-slate-500 font-sans leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-800 font-semibold">Statutory Academic &amp; Legal Notice:</strong> PolymerHub of India (NextGen India) is an educational knowledge platform and engineering learning resource. All trademarks, brand names, ISBNs, patent numbers, standards designations (ASTM/ISO), and university titles referenced herein belong to their respective owners and are cited under fair dealing provisions of <strong className="text-slate-700">Section 52 of the Indian Copyright Act 1957</strong> and <strong className="text-slate-700">Section 79 of the Information Technology Act 2000</strong> for academic research, instruction, and educational indexing.
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Compliant with DPDP Act 2023 &middot; Consumer Protection (E-Commerce) Rules 2020 &middot; Statutory Grievance Redressal: <a href="mailto:grievance@polymerhubofindia.com" className="text-blue-600 underline">grievance@polymerhubofindia.com</a> (Acknowledgment within 24h &middot; Resolution within 15d).
          </p>
        </div>

      </div>

      {/* ── Bottom Copyright & Dot Matrix Bar ── */}
      <div className="bg-slate-50 border-t border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1850px] 4xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600 font-medium">
          <p>
            &copy; 2026 PolymerHub &middot; Precision Knowledge Platform for Polymer Science &amp; Engineering &middot; <Link href="/legal" className="text-[#2563EB] hover:underline">Legal &amp; Provenance</Link> &middot; <Link href="/admin/feedback" className="text-slate-500 hover:text-slate-800 transition-colors">Admin Desk</Link>
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
