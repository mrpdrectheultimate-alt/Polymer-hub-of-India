'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isUserAdmin } from '@/lib/admin'
import {
  MessageSquarePlus,
  Calendar,
  BarChart3,
  Video,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Users,
  Database,
  ArrowLeft,
  Building2,
  CreditCard
} from 'lucide-react'

export default function AdminHubPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [stats, setStats] = useState({
    feedbackTotal: 0,
    feedbackNew: 0,
    updatesTotal: 0,
    profilesTotal: 0,
    eventsTotal: 26,
    subscribersTotal: 0,
    pendingPaymentsTotal: 0,
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        setUserEmail(session.user.email ?? null)

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        const hasAdminClearance = isUserAdmin(session.user, profile)
        setIsAdmin(hasAdminClearance)

        if (hasAdminClearance) {
          // Fetch quick counts for the hub
          const [
            { count: fbCount },
            { count: fbNewCount },
            { count: updCount },
            { count: profCount },
            { count: premCount },
            { count: pendPayCount },
            evRes
          ] = await Promise.all([
            supabase.from('feedback').select('*', { count: 'exact', head: true }),
            supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'new'),
            supabase.from('daily_updates').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'premium'),
            supabase.from('payment_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            fetch('/api/community/industry-events').catch(() => null)
          ])

          let eventsCount = 26
          if (evRes && evRes.ok) {
            const evData = await evRes.json()
            eventsCount = evData.stats?.total || evData.events?.length || 26
          }

          setStats({
            feedbackTotal: fbCount ?? 0,
            feedbackNew: fbNewCount ?? 0,
            updatesTotal: updCount ?? 0,
            profilesTotal: profCount ?? 0,
            eventsTotal: eventsCount,
            subscribersTotal: premCount ?? 0,
            pendingPaymentsTotal: pendPayCount ?? 0,
          })
        }
      } catch (err) {
        console.error('Error verifying admin authorization:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          Verifying administrative clearance...
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="max-w-md w-full border-4 border-ink p-8 bg-white shadow-hard text-center">
          <ShieldAlert className="w-14 h-14 text-rose-600 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-black text-ink uppercase tracking-tight mb-2">
            Admin Clearance Required
          </h2>
          <p className="text-xs text-ink/70 leading-relaxed mb-6 font-mono">
            {userEmail
              ? `Signed in as ${userEmail}. This account does not possess administrative privileges.`
              : 'Please sign in with an authorized administrator account to access the control center.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="cn-btn-black text-xs">
              Sign In
            </Link>
            <Link href="/" className="cn-btn-white text-xs">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const ADMIN_MODULES = [
    {
      title: 'Exhibitions & Industry Events Desk',
      desc: 'Govern national trade expos (Plastivision, Indplas, PackPlus, PLASTFOCUS), adjust rescheduled dates, and add newly announced expos.',
      href: '/admin/events',
      icon: Building2,
      color: '#0D9488',
      bg: '#F0FDFA',
      badge: `${stats.eventsTotal} Tracked`,
      badgeColor: 'bg-teal-100 text-teal-900 border border-teal-300',
      actionText: 'Manage Exhibitions'
    },
    {
      title: 'Feedback & Inquiries Desk',
      desc: 'Inspect incoming bug reports, feature suggestions, curriculum notes, and user praise with status workflows.',
      href: '/admin/feedback',
      icon: MessageSquarePlus,
      color: '#EA580C',
      bg: '#FFF7ED',
      badge: `${stats.feedbackNew} New`,
      badgeColor: 'bg-amber-400 text-slate-950',
      actionText: 'Review Feedback'
    },
    {
      title: 'Daily News & Spot Prices',
      desc: 'Curate daily verified engineering headlines, polymer market spot benchmarks, and trigger database updates.',
      href: '/admin/today',
      icon: Calendar,
      color: '#2563EB',
      bg: '#EFF6FF',
      badge: `${stats.updatesTotal} Published`,
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-300',
      actionText: 'Manage Daily Desk'
    },
    {
      title: 'Analytics & Student Metrics',
      desc: 'Track lesson engagement, reading velocity, GATE XE5 mock test attempts, streaks, and user acquisition.',
      href: '/admin/analytics',
      icon: BarChart3,
      color: '#16A34A',
      bg: '#F0FDF4',
      badge: `${stats.profilesTotal} Registered`,
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      actionText: 'View Analytics'
    },
    {
      title: 'Video Library & Health',
      desc: 'Audit NPTEL course lecture playlists, verify embed stream health, and update technical masterclasses.',
      href: '/admin/videos',
      icon: Video,
      color: '#7C3AED',
      bg: '#F5F3FF',
      badge: 'Video Audit',
      badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300',
      actionText: 'Inspect Videos'
    },
    {
      title: 'Payments & Subscriptions Desk',
      desc: 'Govern Razorpay transaction orders, verify manual UPI screenshot receipts, and issue instant premium access overrides.',
      href: '/admin/payments',
      icon: CreditCard,
      color: '#2563EB',
      bg: '#EFF6FF',
      badge: `${stats.subscribersTotal} Premium Members`,
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      actionText: 'Manage Payments'
    },
  ]

  return (
    <div className="min-h-screen bg-canvas p-6 md:p-12 text-ink">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b-4 border-ink pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-sm inline-flex mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Administrative Command Center
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-ink uppercase tracking-tight">
              PolymerHub Control Desk
            </h1>
            <p className="font-mono text-xs text-ink/60 mt-1">
              Authorized admin: <span className="font-bold text-ink">{userEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="cn-btn-white text-xs flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Student Dashboard
            </Link>
            <Link href="/" className="cn-btn-black text-xs flex items-center gap-1.5">
              Live Site <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Executive Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider">Total Feedback</div>
            <div className="font-display text-3xl font-black text-ink mt-1">{stats.feedbackTotal}</div>
            <div className="text-[10px] font-mono text-amber-600 font-bold mt-1">
              {stats.feedbackNew} pending review
            </div>
          </div>
          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider">Daily Updates</div>
            <div className="font-display text-3xl font-black text-ink mt-1">{stats.updatesTotal}</div>
            <div className="text-[10px] font-mono text-blue-600 font-bold mt-1">
              Live in Supabase
            </div>
          </div>
          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider">Total Profiles</div>
            <div className="font-display text-3xl font-black text-ink mt-1">{stats.profilesTotal}</div>
            <div className="text-[10px] font-mono text-emerald-600 font-bold mt-1">
              Registered users
            </div>
          </div>
          <div className="border-4 border-ink p-4 bg-amber-50 shadow-hard-sm">
            <div className="font-mono text-[9px] text-amber-800 uppercase tracking-wider font-bold">Admin Clearance</div>
            <div className="font-display text-xl font-black text-amber-950 mt-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Full Access
            </div>
            <div className="text-[10px] font-mono text-amber-800 mt-1">Superuser clearance</div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-black uppercase tracking-widest text-ink/60">
              Operational Management Consoles
            </h2>
            <span className="font-mono text-[10px] text-slate-500">6 Operational Consoles Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADMIN_MODULES.map((mod) => {
              const Icon = mod.icon
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="group block border-4 border-ink p-6 bg-white hover:bg-slate-50 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-black"
                      style={{ backgroundColor: mod.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: mod.color }} />
                    </div>
                    <span className={`font-mono text-[10px] font-black px-2.5 py-1 uppercase rounded-xs ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black text-ink uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-ink/70 leading-relaxed font-sans mt-2 mb-6">
                    {mod.desc}
                  </p>

                  <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider group-hover:underline">
                      {mod.actionText}
                    </span>
                    <ArrowRight className="w-4 h-4 text-ink group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Instructions & Direct Links */}
        <div className="border-4 border-black bg-slate-900 text-white p-6 md:p-8" style={{ boxShadow: '4px 4px 0px 0px #F5C518' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-400 text-black rounded-lg font-black shrink-0">
              ⚡
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg font-black uppercase tracking-tight text-white">
                Direct Administrator Shortcuts
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Bookmark these direct URLs for immediate access anytime:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-mono">
                <Link href="/admin/feedback" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-sm flex items-center justify-between border border-white/15">
                  <span className="text-amber-400 font-bold">/admin/feedback</span>
                  <span className="text-white/60 text-[10px]">User Feedback Desk &rarr;</span>
                </Link>
                <Link href="/admin/today" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-sm flex items-center justify-between border border-white/15">
                  <span className="text-blue-400 font-bold">/admin/today</span>
                  <span className="text-white/60 text-[10px]">Daily News Editor &rarr;</span>
                </Link>
                <Link href="/admin/analytics" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-sm flex items-center justify-between border border-white/15">
                  <span className="text-emerald-400 font-bold">/admin/analytics</span>
                  <span className="text-white/60 text-[10px]">Platform Metrics &rarr;</span>
                </Link>
                <Link href="/admin/videos" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-sm flex items-center justify-between border border-white/15">
                  <span className="text-purple-400 font-bold">/admin/videos</span>
                  <span className="text-white/60 text-[10px]">Video Library &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

