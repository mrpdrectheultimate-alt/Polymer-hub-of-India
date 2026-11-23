'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Platform', href: '#why-polymerhub' },
    { label: 'Live Demo', href: '#interactive-demo' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'GATE XE-F', href: '#gate-xef' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Voices', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Real and Main Official Logo with Light Theme */}
        <div className="flex items-center gap-3">
          <Logo variant="full" theme="light" href="/launch" />
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Launch Waitlist Active
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-bold tracking-wider text-slate-600 uppercase">
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
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all border border-slate-300"
          >
            Sign In
          </Link>
          <a
            href="#waitlist"
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5 hover:shadow-lg"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <a
            href="#waitlist"
            className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-blue-600 shadow-xs"
          >
            Waitlist
          </a>
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 uppercase hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-xl border border-slate-200 font-mono font-bold text-xs uppercase tracking-wider text-center text-slate-700 hover:bg-slate-50"
            >
              Sign In
            </Link>
            <a
              href="#waitlist"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3.5 rounded-xl bg-blue-600 font-mono font-bold text-xs uppercase tracking-wider text-center text-white shadow-md hover:bg-blue-700"
            >
              Join Priority Waitlist &rarr;
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
