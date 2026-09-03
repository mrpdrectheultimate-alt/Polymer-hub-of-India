'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from './Logo'

import {
  Menu, X, ChevronDown, BookOpen, Brain, Zap, Trophy,
  MessageCircle, Calculator, Play, FlaskConical, ArrowRight,
  Scale, Wrench, User, Star, Flame, GraduationCap, Users, Building
} from 'lucide-react'

const NAV = [
  {
    label: 'Explore',
    items: [
      { label: 'Today in Plastics', href: '/today', icon: Flame, desc: 'Daily industry news & updates', color: '#EA580C' },
      { label: 'History of Plastics', href: '/history', icon: BookOpen, desc: '162 years that remade civilization', color: '#1D4ED8' },
      { label: 'World of Plastic', href: '/world', icon: FlaskConical, desc: '7 industries that run on polymers', color: '#15803D' },
      { label: 'Video Library', href: '/videos', icon: Play, desc: 'NPTEL + industry videos mapped to lessons', color: '#1D4ED8' },
      { label: 'Education Hub', href: '/education', icon: GraduationCap, desc: '84 programs & 17 scholarships', color: '#7C3AED' },
      { label: 'Research Hub', href: '/research', icon: FlaskConical, desc: 'Academic papers & patent filing', color: '#1D4ED8' },
      { label: 'Virtual Labs', href: '/simulations', icon: Zap, desc: 'Interactive polymer 3D simulations', color: '#CA8A04' },
    ]
  },
  {
    label: 'Learn',
    items: [
      { label: 'All Subjects', href: '/subjects', icon: BookOpen, desc: '19 subjects · 216 lessons', color: '#1D4ED8' },
      { label: 'AI Tutor', href: '/ai-tutor', icon: Brain, desc: 'Ask anything — grounded in your lessons', color: '#15803D' },
      { label: 'Practice Questions', href: '/practice', icon: Zap, desc: '50+ MCQs across all subjects', color: '#CA8A04' },
      { label: 'GATE Mock Test', href: '/gate-mock', icon: Trophy, desc: '30 questions · 60 min · negative marking', color: '#7C3AED' },
      { label: 'Student Forum', href: '/forum', icon: MessageCircle, desc: 'Ask classmates, get answers', color: '#7C3AED' },
      { label: 'Study Groups', href: '/study-groups', icon: Users, desc: 'Form groups, track progress', color: '#1D4ED8' },
      { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, desc: 'Compare XP rankings & streaks', color: '#CA8A04' },
      { label: 'Reference Library', href: '/library', icon: BookOpen, desc: '50 specialized engineering volumes', color: '#1D4ED8' },
      { label: 'Community & Events', href: '/community', icon: Users, desc: 'Webinars, mentorship & live events', color: '#EA580C' },
      { label: 'Company Challenges', href: '/practice/challenges', icon: Trophy, desc: 'Solve industry cases for XP', color: '#7C3AED' },
      { label: 'Student Projects', href: '/projects', icon: BookOpen, desc: 'Case studies & engineering portfolios', color: '#1D4ED8' },
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Engineering Calculators', href: '/calculators', icon: Calculator, desc: 'Tonnage, cooling, shrinkage & more', color: '#CA8A04' },
      { label: 'Defect Troubleshooter', href: '/troubleshooter', icon: Wrench, desc: 'Fix injection & extrusion defects', color: '#EA580C' },
      { label: 'Property Comparator', href: '/comparator', icon: Scale, desc: 'Compare 12 polymers · 15 properties', color: '#1D4ED8' },
      { label: 'Careers', href: '/careers', icon: Trophy, desc: '6 career tracks · ₹4–40 LPA', color: '#15803D' },
      { label: 'Materials Database', href: '/materials', icon: FlaskConical, desc: 'Polymer properties & Indian industry', color: '#7C3AED' },
      { label: 'Enterprise Portal', href: '/enterprise', icon: Building, desc: 'Corporate training & solutions', color: '#15803D' },
    ]
  },
]

type Profile = {
  full_name: string | null
  avatar_url: string | null
  subscription_status: string | null
  xp_points: number
  current_streak: number
  is_recruiter?: boolean | null
}

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, subscription_status, xp_points, current_streak, is_recruiter')
          .eq('id', session.user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session) {
        const { data } = await supabase.from('profiles')
          .select('full_name, avatar_url, subscription_status, xp_points, current_streak, is_recruiter')
          .eq('id', session.user.id).single()
        if (data) setProfile(data)
      } else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-navbar]')) setActiveDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isPremium = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active'

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────────────────────────
          position: sticky, top: 0, z-index: 50
          Height is fixed at 56px desktop / 52px mobile
          Page content starts BELOW this — never underneath it
      ──────────────────────────────────────────────────────────────────────── */}
      <nav
        data-navbar
        className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xs h-[68px] 2xl:h-[76px]"
      >
        <div className="h-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 2xl:px-8 flex items-center justify-between gap-4 2xl:gap-8">

          {/* Logo — full horizontal logo for maximum brand prominence */}
          <div className="flex items-center shrink-0">
            <Logo variant="full" theme="light" />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center" data-navbar>
            {NAV.map(section => (
              <div key={section.label} className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === section.label ? null : section.label)}
                  className="flex items-center gap-1.5 px-3.5 2xl:px-4 py-2 rounded-xl font-mono text-xs 2xl:text-sm font-black uppercase tracking-wider text-slate-800 hover:bg-slate-900 hover:text-white transition-all shadow-2xs"
                  style={{
                    backgroundColor: activeDropdown === section.label ? '#0A0A0A' : undefined,
                    color: activeDropdown === section.label ? 'white' : undefined,
                  }}
                >
                  {section.label}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === section.label ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === section.label && (
                  <div className="absolute top-full left-0 mt-1.5 w-80 2xl:w-96 rounded-2xl border-2 border-slate-900 bg-white z-50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
                    {section.items.map(item => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link key={item.href} href={item.href}
                          className="flex items-center gap-3.5 p-3.5 2xl:p-4 border-b border-slate-100 last:border-0 hover:bg-slate-900 hover:text-white group transition-all"
                          style={{ backgroundColor: isActive ? '#0A0A0A' : undefined, color: isActive ? 'white' : undefined }}>
                          <div className="w-9 h-9 2xl:w-10 2xl:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: item.color }}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-wider">{item.label}</div>
                            <div className={`font-mono text-[11px] 2xl:text-xs mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-300'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {session ? (
              <>
                {profile && profile.current_streak > 0 && (
                  <Link href="/leaderboard"
                    className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 rounded-xl px-3 py-1.5 hover:border-slate-900 transition-all text-xs font-mono font-bold shadow-xs"
                    title="Your streak">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="font-mono text-xs font-black">{profile.current_streak}</span>
                  </Link>
                )}
                {profile && (
                  <Link href="/leaderboard"
                    className="flex items-center gap-1.5 border border-amber-200 bg-amber-50 rounded-xl px-3 py-1.5 hover:border-amber-400 transition-all text-xs font-mono font-bold text-amber-900 shadow-xs"
                    title="Your XP">
                    <Star className="w-3.5 h-3.5 text-yellow-600" />
                    <span className="font-mono text-xs font-black">{(profile.xp_points ?? 0).toLocaleString()}</span>
                  </Link>
                )}
                {isPremium && (
                  <span className="font-mono text-[8px] font-black border-2 px-2 py-0.5 uppercase"
                    style={{ borderColor: '#CA8A04', color: '#CA8A04' }}>
                    ⭐ Premium
                  </span>
                )}
                {profile?.is_recruiter && (
                  <Link href="/recruiter"
                    className="font-mono text-[8px] font-black border-2 px-2 py-0.5 uppercase bg-blue-50 border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors">
                    💼 Recruiter Portal
                  </Link>
                )}
                <Link href="/dashboard"
                  className="flex items-center gap-2 border-4 border-black px-3 py-1 hover:bg-black hover:text-white group transition-colors"
                  style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-5 h-5 object-cover border border-black" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
                    {profile?.full_name?.split(' ')[0] ?? 'Dashboard'}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="font-mono text-[10px] font-bold px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors uppercase tracking-wider">
                  Sign In
                </Link>
                <Link href="/pricing"
                  className="font-mono text-[10px] font-bold px-4 py-1.5 border-4 border-black bg-yellow-400 hover:bg-yellow-300 transition-colors uppercase tracking-wider flex items-center gap-1.5"
                  style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}>
                  ₹149/MO <ArrowRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden border-4 border-black w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ───────────────────────────────────────────────────────
          Fixed overlay — sits on top of everything
          Does NOT push page content down
      ──────────────────────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ top: '68px' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="absolute top-0 left-0 right-0 bg-white border-b-4 border-black max-h-[calc(100vh-68px)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">

            {/* Auth section */}
            {session ? (
              <div className="border-b-4 border-black px-4 py-3 flex items-center gap-3 bg-black">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar"
                    className="w-9 h-9 object-cover border-2 border-yellow-400 flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 bg-violet-700 border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white truncate">{profile?.full_name ?? 'Student'}</div>
                  <div className="flex items-center gap-2">
                    {isPremium && <span className="font-mono text-[8px] text-yellow-400 uppercase">⭐ Premium</span>}
                    {profile && <span className="font-mono text-[8px] text-white/40">{profile.xp_points} XP</span>}
                    {profile && profile.current_streak > 0 && (
                      <span className="font-mono text-[8px] text-orange-400">🔥 {profile.current_streak}</span>
                    )}
                  </div>
                </div>
                <Link href="/dashboard"
                  className="font-mono text-[9px] font-bold border-2 border-yellow-400 text-yellow-400 px-2 py-1 uppercase">
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="border-b-4 border-black px-4 py-3 flex gap-3">
                <Link href="/login"
                  className="flex-1 font-mono text-[10px] font-bold border-4 border-black px-3 py-2 text-center uppercase hover:bg-black hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/pricing"
                  className="flex-1 font-mono text-[10px] font-bold border-4 border-black bg-yellow-400 px-3 py-2 text-center uppercase"
                  style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}>
                  ₹149/MO
                </Link>
              </div>
            )}

            {/* Nav sections */}
            {NAV.map(section => (
              <div key={section.label} className="border-b-4 border-black">
                <div className="px-4 py-2 bg-black">
                  <span className="font-mono text-[9px] font-black text-yellow-400 uppercase tracking-widest">
                    {section.label}
                  </span>
                </div>
                {section.items.map(item => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-3 px-4 py-3 border-b-2 border-black/10 last:border-0 transition-colors"
                      style={{ backgroundColor: isActive ? '#0A0A0A' : undefined, color: isActive ? 'white' : undefined }}>
                      <div className="w-7 h-7 border-2 border-black flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.color }}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-wider">{item.label}</div>
                        <div className="font-mono text-[8px] text-black/40">{item.desc}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ))}

            {/* Bottom links */}
            <div className="border-b-4 border-black">
              {[
                { label: 'Achievements & Badges', href: '/achievements', icon: Trophy },
                { label: 'Profile Settings', href: '/profile', icon: User },
              ].map(item => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-4 py-3 border-b-2 border-black/10 last:border-0 hover:bg-black/5 transition-colors">
                    <Icon className="w-4 h-4 text-black/50" />
                    <span className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-wider">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {session && (
              <div className="px-4 py-3">
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
                  className="w-full font-mono text-[9px] font-bold text-black/40 uppercase tracking-wider border-2 border-black/20 py-2 hover:bg-black hover:text-white hover:border-black transition-colors">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
