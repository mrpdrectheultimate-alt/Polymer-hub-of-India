'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ShieldCheck, MessageCircle, Send, Mail, ArrowUpRight, Scale } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-700 text-xs font-sans">
      
      {/* ── Top Focused Trust Strip ── */}
      <div className="border-b border-slate-200/80 bg-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] font-mono font-medium text-slate-600">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDPA 2023 &amp; ISO 27001 Privacy Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>19 Subjects &middot; 216 Curriculum Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>ASTM &amp; ISO Industrial Testing Aligned</span>
          </div>
          <div className="flex items-center gap-2 text-slate-800">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Sec 52 Fair Dealing Academic Platform</span>
          </div>
        </div>
      </div>

      {/* ── Main Focused Landing Footer Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Direct Connect (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="full" theme="light" href="/launch" />
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md font-sans">
              India&apos;s dedicated digital learning and engineering ecosystem for polymer science, plastics manufacturing technology, practical shop-floor solvers, and GATE XE-F preparation.
            </p>

            {/* Direct Contact Pills */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <a
                href="mailto:hello@polymerhubofindia.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-mono font-medium shadow-2xs hover:text-blue-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>hello@polymerhubofindia.com</span>
              </a>
              <a
                href="mailto:founder@polymerhubofindia.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-mono font-medium shadow-2xs hover:text-amber-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>founder@polymerhubofindia.com</span>
              </a>
            </div>

            {/* Community Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 shadow-2xs transition-all flex items-center gap-1.5 text-xs font-mono font-bold"
                aria-label="Join Official WhatsApp Channel"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/10" />
                <span>WhatsApp Channel</span>
              </a>
              <a
                href="https://t.me/polymerhubofindia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-700 shadow-2xs transition-all flex items-center gap-1.5 text-xs font-mono font-bold"
                aria-label="Join Telegram Mastermind"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>Telegram Mastermind</span>
              </a>
            </div>
          </div>

          {/* Column 2: Landing Page Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform &middot; Launch
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="#why-polymerhub" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Why PolymerHub
                </a>
              </li>
              <li>
                <a href="#interactive-demo" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Interactive Live Demos
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Ecosystem Modules
                </a>
              </li>
              <li>
                <a href="#gate-xef" className="text-slate-600 hover:text-blue-600 transition-colors">
                  GATE XE-F Preparation
                </a>
              </li>
              <li>
                <a href="#comparison" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Objective Comparison
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Transparent Pricing
                </a>
              </li>
              <li>
                <a href="#waitlist" className="text-blue-600 font-bold hover:underline">
                  Join Priority Waitlist &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal, Terms & Policies (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Terms, Policies &amp; Governance
            </h4>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              All policies apply equally to our landing page, early-bird waitlist program, and full platform modules.
            </p>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-between group">
                  <span>Terms of Service &amp; Waitlist Agreement</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-between group">
                  <span>Privacy Policy &amp; Cookie Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-between group">
                  <span>Cancellation &amp; 7-Day Refund Policy</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-between group">
                  <span>Academic Provenance &amp; Legal Notice</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </Link>
              </li>
              <li>
                <a href="mailto:grievance@polymerhubofindia.com" className="text-slate-500 hover:text-amber-700 transition-colors text-[11px] block pt-1">
                  Statutory Grievance Desk: grievance@polymerhubofindia.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Compact Bottom Bar ── */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>
            &copy; 2026 PolymerHub of India (NextGen India). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>DPDPA 2023 Compliant</span>
            <span>&bull;</span>
            <span>Consumer Protection Rules 2020</span>
            <span>&bull;</span>
            <Link href="/login" className="hover:text-slate-900 transition-colors font-bold text-slate-700">
              Sign In
            </Link>
          </div>
        </div>

      </div>

    </footer>
  )
}
