'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Menu, X, ArrowRight, BookOpen, Calculator, Trophy, Users, ShieldCheck } from 'lucide-react'

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Platform', href: '#why-polymerhub' },
    { label: 'Live Demo', href: '#interactive-demo' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'GATE XE-F', href: '#gate-xef' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Community', href: '#community' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo variant="full" />
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Engineering Ecosystem
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-bold tracking-wider text-slate-700 uppercase">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-600 transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
          >
            Sign In
          </Link>
          <Link
            href="/login?mode=signup"
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 hover:shadow-md"
          >
            Start Free
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/login?mode=signup"
            className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-blue-600 shadow-xs"
          >
            Start Free
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <Link
              href="/login?mode=signup"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-2"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 rounded-xl bg-slate-100 text-slate-800 font-mono font-bold text-xs uppercase tracking-wider text-center"
              >
                Sign In
              </Link>
              <a
                href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
