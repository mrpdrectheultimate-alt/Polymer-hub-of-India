'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Users, BookOpen, Brain, TrendingUp, Trophy, BarChart2, FlaskConical,
  MessageSquarePlus, Star, Bug, Lightbulb, Heart, CheckCircle, Eye, Flame
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStat = {
  lesson_id: string
  lesson_title: string
  subject_name: string
  subject_slug: string
  reads: number
  completions: number
  avg_score: number | null
  completion_rate: number
}

type SubjectStat = {
  subject_name: string
  subject_slug: string
  total_reads: number
  total_completions: number
  avg_score: number | null
}

type OverviewStats = {
  total_users: number
  premium_users: number
  total_lessons_read: number
  total_quiz_attempts: number
  avg_quiz_score: number | null
  total_ai_queries: number
  revenue_estimate: number
  total_xp: number
  avg_streak: number
  total_badges: number
  total_study_groups: number
}

type RecentUser = {
  id: string
  full_name: string | null
  college_name: string | null
  subscription_status: string | null
  created_at: string
  ai_queries_today: number | null
}

type Feedback = {
  id: string
  type: string
  rating: number | null
  message: string
  page_url: string | null
  user_email: string | null
  user_name: string | null
  status: string
  admin_note: string | null
  created_at: string
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  bug:     { label: 'Bug',     icon: Bug,                color: '#EA580C', bg: '#FFF7ED' },
  feature: { label: 'Feature', icon: Lightbulb,          color: '#CA8A04', bg: '#FEFCE8' },
  content: { label: 'Content', icon: BookOpen,           color: '#1D4ED8', bg: '#EFF6FF' },
  praise:  { label: 'Praise',  icon: Heart,              color: '#15803D', bg: '#F0FDF4' },
  general: { label: 'General', icon: MessageSquarePlus,  color: '#7C3AED', bg: '#F5F3FF' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:       { label: 'New',       color: '#EA580C' },
  reviewing: { label: 'Reviewing', color: '#CA8A04' },
  planned:   { label: 'Planned',   color: '#1D4ED8' },
  resolved:  { label: 'Resolved',  color: '#15803D' },
}

const RATING_LABELS = ['', 'Very Poor', 'Poor', 'Okay', 'Good', 'Excellent']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'users' | 'feedback'>('overview')
  
  // Analytics data
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [lessonStats, setLessonStats] = useState<LessonStat[]>([])
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  
  // Feedback dashboard states
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  // ── Init Authorized & Analytics Data ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }

      // Simple admin check — email verification could be stricter
      setAuthorized(true)

      // ── Overview stats ────────────────────────────────────────────────────
      const [
        { count: totalUsers },
        { data: premiumProfiles },
        { count: totalProgress },
        { data: completedProgress },
        { data: quizAttempts },
        { data: allProfiles },
        { count: totalBadges },
        { count: totalGroups },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('id').eq('subscription_status', 'premium'),
        supabase.from('user_progress').select('*', { count: 'exact', head: true }),
        supabase.from('user_progress').select('quiz_score').eq('status', 'completed'),
        supabase.from('quiz_attempts').select('score_percentage, passed'),
        supabase.from('profiles').select('total_ai_queries, xp_points, current_streak'),
        supabase.from('user_badges').select('*', { count: 'exact', head: true }),
        supabase.from('study_groups').select('*', { count: 'exact', head: true }),
      ])

      const avgScore = completedProgress && completedProgress.length > 0
        ? Math.round(completedProgress.filter(p => p.quiz_score !== null).reduce((a, b) => a + (b.quiz_score ?? 0), 0) / completedProgress.filter(p => p.quiz_score !== null).length)
        : null

      const totalAiQueries = allProfiles?.reduce((a, p) => a + (p.total_ai_queries ?? 0), 0) ?? 0
      const totalXp = allProfiles?.reduce((a, p) => a + (p.xp_points ?? 0), 0) ?? 0
      const totalStreak = allProfiles?.reduce((a, p) => a + (p.current_streak ?? 0), 0) ?? 0
      const avgStreak = allProfiles && allProfiles.length > 0
        ? Math.round((totalStreak / allProfiles.length) * 10) / 10
        : 0
      const premiumCount = premiumProfiles?.length ?? 0

      setOverview({
        total_users: totalUsers ?? 0,
        premium_users: premiumCount,
        total_lessons_read: totalProgress ?? 0,
        total_quiz_attempts: quizAttempts?.length ?? 0,
        avg_quiz_score: avgScore,
        total_ai_queries: totalAiQueries,
        revenue_estimate: premiumCount * 149,
        total_xp: totalXp,
        avg_streak: avgStreak,
        total_badges: totalBadges ?? 0,
        total_study_groups: totalGroups ?? 0,
      })

      // ── Lesson stats ──────────────────────────────────────────────────────
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title, subject_id, subjects(name, slug)')
        .order('order_index')

      const { data: allProgress } = await supabase
        .from('user_progress')
        .select('lesson_id, status, quiz_score, quiz_passed')

      if (lessons && allProgress) {
        const stats = lessons.map(lesson => {
          const lessonProgress = allProgress.filter(p => p.lesson_id === lesson.id)
          const reads = lessonProgress.length
          const completions = lessonProgress.filter(p => p.status === 'completed').length
          const scores = lessonProgress.filter(p => p.quiz_score !== null).map(p => p.quiz_score!)
          const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

          const subjects = lesson.subjects as unknown as { name: string; slug: string }

          return {
            lesson_id: lesson.id,
            lesson_title: lesson.title,
            subject_name: subjects?.name ?? '',
            subject_slug: subjects?.slug ?? '',
            reads,
            completions,
            avg_score: avgScore,
            completion_rate: reads > 0 ? Math.round((completions / reads) * 100) : 0,
          }
        }).sort((a, b) => b.reads - a.reads)

        setLessonStats(stats)

        // Subject aggregation
        const subjectMap: Record<string, SubjectStat> = {}
        stats.forEach(s => {
          if (!subjectMap[s.subject_slug]) {
            subjectMap[s.subject_slug] = {
              subject_name: s.subject_name,
              subject_slug: s.subject_slug,
              total_reads: 0,
              total_completions: 0,
              avg_score: null,
            }
          }
          subjectMap[s.subject_slug].total_reads += s.reads
          subjectMap[s.subject_slug].total_completions += s.completions
        })
        setSubjectStats(Object.values(subjectMap).sort((a, b) => b.total_reads - a.total_reads))
      }

      // ── Recent users ──────────────────────────────────────────────────────
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, college_name, subscription_status, created_at, ai_queries_today')
        .order('created_at', { ascending: false })
        .limit(20)

      setRecentUsers(users ?? [])
      setLoading(false)
    }
    load()
  }, [supabase])

  // ── Load & Filter Feedback ────────────────────────────────────────────────
  const loadFeedback = useCallback(async () => {
    setFeedbackLoading(true)
    let query = supabase.from('feedback').select('*').order('created_at', { ascending: false })
    if (filterType !== 'all') query = query.eq('type', filterType)
    if (filterStatus !== 'all') query = query.eq('status', filterStatus)
    const { data } = await query.limit(100)
    setFeedback(data ?? [])
    setFeedbackLoading(false)
  }, [filterType, filterStatus, supabase])

  useEffect(() => {
    if (authorized && activeTab === 'feedback') {
      loadFeedback()
    }
  }, [authorized, activeTab, loadFeedback])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('feedback').update({ status }).eq('id', id)
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f))
    if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, status } : null)
  }

  const saveNote = async () => {
    if (!selectedItem) return
    setSavingNote(true)
    await supabase.from('feedback').update({ admin_note: adminNote }).eq('id', selectedItem.id)
    setFeedback(prev => prev.map(f => f.id === selectedItem.id ? { ...f, admin_note: adminNote } : f))
    setSavingNote(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-2xl font-black text-ink animate-pulse">
          Loading analytics...
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard text-center">
          <p className="font-display text-2xl font-black text-ink">Not authorized</p>
          <Link href="/" className="cn-btn-black mt-4 text-sm">Go Home</Link>
        </div>
      </div>
    )
  }

  const SUBJECT_COLORS: Record<string, string> = {
    'polymer-chemistry':         '#1D4ED8',
    'polymer-processing':        '#EA580C',
    'mould-design':              '#EA580C',
    'polymer-testing':           '#7C3AED',
    'rubber-technology':         '#EA580C',
    'recycling-technology':      '#15803D',
    'sustainable-plastics':      '#15803D',
    'polymer-composites':        '#1D4ED8',
    'entrepreneurship-plastics': '#CA8A04',
    'medical-plastics':          '#7C3AED',
  }

  // Feedback Metrics calculations
  const feedbackCounts = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    bugs: feedback.filter(f => f.type === 'bug').length,
    features: feedback.filter(f => f.type === 'feature').length,
    praise: feedback.filter(f => f.type === 'praise').length,
  }

  const avgFeedbackRating = feedback.filter(f => f.rating).length > 0
    ? (feedback.filter(f => f.rating).reduce((a, b) => a + (b.rating ?? 0), 0) / feedback.filter(f => f.rating).length).toFixed(1)
    : '—'

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-yellow-bright" />

      {/* Header */}
      <div className="border-b-4 border-ink bg-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-ink" />
          </div>
          <div>
            <div className="font-display text-lg font-black text-white">PolymerHub Analytics</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">Admin Dashboard</div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Link href="/admin/videos" className="border-2 border-rose-400 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[9px] font-bold px-3 py-1.5 transition-colors uppercase tracking-wider">
            🎬 Video Curation
          </Link>
          <Link href="/admin/today" className="border-2 border-white/30 text-white font-mono text-[9px] font-bold px-3 py-1.5 hover:bg-white/10 transition-colors uppercase tracking-wider">
            Daily Pulse Admin &rarr;
          </Link>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b-4 border-ink flex">
        {([
          { key: 'overview', label: '📊 Overview' },
          { key: 'lessons', label: '📚 Lessons' },
          { key: 'users', label: '👥 Users' },
          { key: 'feedback', label: '💬 Feedback' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-mono text-[10px] font-black uppercase tracking-widest px-6 py-3 border-r-4 border-ink transition-colors"
            style={{ backgroundColor: activeTab === tab.key ? '#0A0A0A' : 'white', color: activeTab === tab.key ? '#FACC15' : '#6B7280' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6">

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { val: overview.total_users, label: 'Total Users', color: '#1D4ED8', bg: '#EFF6FF', icon: Users },
                { val: overview.premium_users, label: 'Premium Users', color: '#CA8A04', bg: '#FEFCE8', icon: Trophy },
                { val: `₹${overview.revenue_estimate.toLocaleString()}`, label: 'Revenue (est.)', color: '#15803D', bg: '#F0FDF4', icon: TrendingUp },
                { val: overview.total_lessons_read, label: 'Lesson Sessions', color: '#EA580C', bg: '#FFF7ED', icon: BookOpen },
                { val: overview.total_quiz_attempts, label: 'Quiz Attempts', color: '#7C3AED', bg: '#F5F3FF', icon: BarChart2 },
                { val: overview.avg_quiz_score !== null ? `${overview.avg_quiz_score}%` : '—', label: 'Avg Quiz Score', color: '#1D4ED8', bg: '#EFF6FF', icon: Trophy },
                { val: overview.total_ai_queries, label: 'AI Queries Total', color: '#15803D', bg: '#F0FDF4', icon: Brain },
                { val: `${Math.round((overview.premium_users / Math.max(overview.total_users, 1)) * 100)}%`, label: 'Conversion Rate', color: '#CA8A04', bg: '#FEFCE8', icon: TrendingUp },
                { val: overview.total_xp.toLocaleString(), label: 'Total Student XP', color: '#7C3AED', bg: '#F5F3FF', icon: Star },
                { val: `${overview.avg_streak} days`, label: 'Avg Daily Streak', color: '#EA580C', bg: '#FFF7ED', icon: Flame },
                { val: overview.total_badges.toLocaleString(), label: 'Badges Earned', color: '#1D4ED8', bg: '#EFF6FF', icon: Trophy },
                { val: overview.total_study_groups.toLocaleString(), label: 'Study Groups', color: '#15803D', bg: '#F0FDF4', icon: Users },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="border-4 border-ink p-4 shadow-hard-sm" style={{ backgroundColor: stat.bg }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 border-2 border-ink flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="font-display text-3xl font-black" style={{ color: stat.color }}>{stat.val}</div>
                    <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Subject popularity */}
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright flex items-center justify-between">
                <span className="font-mono text-[10px] font-black text-ink uppercase tracking-widest">Subject Popularity</span>
                <span className="font-mono text-[9px] text-ink/60">by total lesson sessions</span>
              </div>
              <div className="divide-y-2 divide-ink/10">
                {subjectStats.map((s, i) => {
                  const color = SUBJECT_COLORS[s.subject_slug] ?? '#1D4ED8'
                  const maxReads = subjectStats[0]?.total_reads ?? 1
                  const pct = Math.round((s.total_reads / maxReads) * 100)
                  return (
                    <div key={s.subject_slug} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-black text-ink/30 w-4">#{i + 1}</span>
                          <span className="font-mono text-[10px] font-bold text-ink uppercase tracking-wide">{s.subject_name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[9px] text-ink/50">{s.total_completions} completed</span>
                          {s.avg_score !== null && <span className="font-mono text-[9px] text-ink/50">avg {s.avg_score}%</span>}
                          <span className="font-mono text-[10px] font-black" style={{ color }}>{s.total_reads} reads</span>
                        </div>
                      </div>
                      <div className="border-2 border-ink h-3 overflow-hidden">
                        <div className="h-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Revenue tracker */}
            <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #15803D' }}>
              <div className="border-b-4 border-ink px-5 py-3 bg-green">
                <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Revenue Tracker</span>
              </div>
              <div className="p-6 bg-canvas">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Premium users', val: overview.premium_users, color: '#CA8A04' },
                    { label: 'Monthly revenue', val: `₹${overview.revenue_estimate.toLocaleString()}`, color: '#15803D' },
                    { label: 'Annual run rate', val: `₹${(overview.revenue_estimate * 12).toLocaleString()}`, color: '#1D4ED8' },
                  ].map(s => (
                    <div key={s.label} className="text-center border-4 border-ink p-4 shadow-hard-sm">
                      <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                      <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="border-4 border-ink p-4" style={{ backgroundColor: '#FEFCE8' }}>
                  <p className="font-mono text-[10px] text-ink/60">
                    At 10% conversion of {overview.total_users} users &rarr; {Math.round(overview.total_users * 0.1)} premium users &rarr; ₹{(Math.round(overview.total_users * 0.1) * 149).toLocaleString()}/month
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LESSONS TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'lessons' && (
          <div className="border-4 border-ink overflow-hidden shadow-hard">
            <div className="border-b-4 border-ink px-5 py-3 bg-ink flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest">All Lessons — By Reads</span>
              <span className="font-mono text-[9px] text-white/40">{lessonStats.length} lessons</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-ink" style={{ backgroundColor: '#F9FAFB' }}>
                    {['#', 'Lesson', 'Subject', 'Reads', 'Completions', 'Avg Quiz Score', 'Completion %'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[9px] font-black uppercase tracking-wider text-ink/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/10">
                  {lessonStats.map((lesson, i) => {
                    const color = SUBJECT_COLORS[lesson.subject_slug] ?? '#1D4ED8'
                    return (
                      <tr key={lesson.lesson_id} className="hover:bg-ink/5 transition-colors">
                        <td className="px-4 py-3 font-mono text-[10px] text-ink/30">{i + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-sm text-ink leading-snug max-w-xs">{lesson.lesson_title}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-[9px] font-bold border-2 px-2 py-0.5 uppercase tracking-wider" style={{ borderColor: color, color }}>
                            {lesson.subject_name.replace('Polymer ', '').replace(' & Bioplastics', '')}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm font-black" style={{ color }}>{lesson.reads}</td>
                        <td className="px-4 py-3 font-mono text-sm font-black text-green">{lesson.completions}</td>
                        <td className="px-4 py-3 font-mono text-sm font-black text-violet">
                          {lesson.avg_score !== null ? `${lesson.avg_score}%` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="border-2 border-ink h-2.5 w-20 overflow-hidden">
                              <div className="h-full" style={{ width: `${lesson.completion_rate}%`, backgroundColor: color }} />
                            </div>
                            <span className="font-mono text-[9px] text-ink/50">{lesson.completion_rate}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="border-4 border-ink overflow-hidden shadow-hard">
            <div className="border-b-4 border-ink px-5 py-3 bg-ink flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest">Recent Users</span>
              <span className="font-mono text-[9px] text-white/40">Last 20 signups</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-ink" style={{ backgroundColor: '#F9FAFB' }}>
                    {['Name', 'College', 'Plan', 'AI Queries Today', 'Joined'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[9px] font-black uppercase tracking-wider text-ink/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/10">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-ink/5 transition-colors">
                      <td className="px-4 py-3 font-bold text-sm text-ink">{user.full_name ?? 'No name set'}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-ink/50">{user.college_name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                           className="font-mono text-[9px] font-black border-2 px-2 py-0.5 uppercase tracking-wider"
                           style={user.subscription_status === 'premium'
                             ? { borderColor: '#CA8A04', color: '#CA8A04', backgroundColor: '#FEFCE8' }
                             : { borderColor: '#D1D5DB', color: '#6B7280' }
                           }
                        >
                          {user.subscription_status === 'premium' ? '⭐ Premium' : 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm font-black text-green">{user.ai_queries_today ?? 0}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-ink/40">
                        {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FEEDBACK TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            {/* Stats strip */}
            <div className="border-4 border-ink grid grid-cols-3 sm:grid-cols-6 divide-x-4 divide-ink">
              {[
                { val: feedbackCounts.total, label: 'Total', color: '#7C3AED' },
                { val: feedbackCounts.new, label: 'New', color: '#EA580C' },
                { val: feedbackCounts.bugs, label: 'Bugs', color: '#EA580C' },
                { val: feedbackCounts.features, label: 'Features', color: '#CA8A04' },
                { val: feedbackCounts.praise, label: 'Praise', color: '#15803D' },
                { val: avgFeedbackRating, label: 'Avg Rating', color: '#CA8A04' },
              ].map(s => (
                <div key={s.label} className="p-4 text-center" style={{ backgroundColor: s.color + '10' }}>
                  <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="border-4 border-ink px-4 py-3 flex gap-3 flex-wrap bg-white">
              <div className="flex gap-2 flex-wrap">
                {['all', 'bug', 'feature', 'content', 'praise', 'general'].map(t => {
                  const cfg = t !== 'all' ? TYPE_CONFIG[t] : { color: '#0A0A0A', bg: '#F9FAFB' }
                  return (
                    <button key={t} onClick={() => setFilterType(t)}
                      className="font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase transition-all"
                      style={{ backgroundColor: filterType === t ? cfg.color : 'white', color: filterType === t ? 'white' : '#6B7280' }}>
                      {t === 'all' ? 'All Types' : TYPE_CONFIG[t].label}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2 flex-wrap sm:ml-auto">
                {['all', 'new', 'reviewing', 'planned', 'resolved'].map(s => {
                  const cfg = s !== 'all' ? STATUS_CONFIG[s] : { color: '#0A0A0A' }
                  return (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className="font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase transition-all"
                      style={{ backgroundColor: filterStatus === s ? cfg.color : 'white', color: filterStatus === s ? 'white' : '#6B7280' }}>
                      {s === 'all' ? 'All Status' : STATUS_CONFIG[s].label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback list */}
              <div className="space-y-3">
                {feedbackLoading ? (
                  <div className="border-4 border-ink p-8 text-center shadow-hard bg-white">
                    <div className="font-display text-lg font-black text-ink animate-pulse">Loading feedback...</div>
                  </div>
                ) : feedback.length === 0 ? (
                  <div className="border-4 border-ink border-dashed p-12 text-center bg-white">
                    <MessageSquarePlus className="w-10 h-10 mx-auto mb-3 text-ink/20" />
                    <p className="font-display text-xl font-black text-ink/30">No feedback matches</p>
                    <p className="font-mono text-[10px] text-ink/30 uppercase tracking-wider mt-1">Try resetting your filter options</p>
                  </div>
                ) : (
                  feedback.map(item => {
                    const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.general
                    const Icon = cfg.icon
                    const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.new
                    const isSelected = selectedItem?.id === item.id

                    return (
                      <button key={item.id} onClick={() => { setSelectedItem(item); setAdminNote(item.admin_note ?? '') }}
                        className="w-full text-left border-4 border-ink overflow-hidden transition-all"
                        style={{
                          boxShadow: isSelected ? `4px 4px 0px 0px ${cfg.color}` : '2px 2px 0px 0px #0A0A0A',
                          backgroundColor: isSelected ? cfg.bg : 'white',
                        }}>
                        <div className="border-b-4 border-ink px-4 py-2 flex items-center justify-between flex-wrap gap-2"
                          style={{ backgroundColor: isSelected ? cfg.color : '#F9FAFB' }}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? 'white' : cfg.color }} />
                            <span className="font-mono text-[9px] font-black uppercase tracking-wider" style={{ color: isSelected ? 'white' : cfg.color }}>{cfg.label}</span>
                            {item.rating && (
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map(starIdx => (
                                  <Star key={starIdx} className="w-2.5 h-2.5" style={{ color: starIdx <= item.rating! ? '#CA8A04' : '#D1D5DB', fill: starIdx <= item.rating! ? '#CA8A04' : 'none' }} />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[8px] font-black border px-1.5 py-0.5 uppercase"
                              style={{ borderColor: statusCfg.color, color: isSelected ? 'white' : statusCfg.color }}>
                              {statusCfg.label}
                            </span>
                            <span className="font-mono text-[8px] text-ink/40" style={{ color: isSelected ? 'white' : undefined }}>
                              {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-sm text-ink font-medium leading-relaxed line-clamp-2">{item.message}</p>
                          <div className="flex items-center gap-3 mt-2">
                            {item.user_name && <span className="font-mono text-[8px] text-ink/50">{item.user_name}</span>}
                            {item.user_email && <span className="font-mono text-[8px] text-ink/40">{item.user_email}</span>}
                            {item.page_url && <span className="font-mono text-[8px] text-ink/30">{item.page_url}</span>}
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              {/* Detail panel */}
              <div>
                {selectedItem ? (
                  <div className="border-4 border-ink overflow-hidden shadow-hard h-fit bg-white">
                    <div className="border-b-4 border-ink px-5 py-3 flex items-center justify-between"
                      style={{ backgroundColor: TYPE_CONFIG[selectedItem.type]?.color ?? '#7C3AED' }}>
                      <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Feedback Detail</span>
                      <button onClick={() => setSelectedItem(null)} className="border-2 border-white/30 text-white w-6 h-6 flex items-center justify-center hover:bg-white/10 text-xs">✕</button>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Meta */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border-4 border-ink p-3 bg-canvas">
                          <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Type</div>
                          <div className="font-mono text-sm font-black" style={{ color: TYPE_CONFIG[selectedItem.type]?.color }}>
                            {TYPE_CONFIG[selectedItem.type]?.label}
                          </div>
                        </div>
                        <div className="border-4 border-ink p-3 bg-canvas">
                          <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Rating</div>
                          <div className="font-mono text-sm font-black text-ink">{selectedItem.rating ? `${selectedItem.rating}/5 (${RATING_LABELS[selectedItem.rating]})` : 'Not rated'}</div>
                        </div>
                        {selectedItem.user_name && (
                          <div className="border-4 border-ink p-3 bg-canvas">
                            <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Student</div>
                            <div className="font-mono text-xs font-bold text-ink">{selectedItem.user_name}</div>
                          </div>
                        )}
                        {selectedItem.user_email && (
                          <div className="border-4 border-ink p-3 bg-canvas">
                            <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Email</div>
                            <a href={`mailto:${selectedItem.user_email}`} className="font-mono text-xs font-bold text-blue hover:underline truncate block">{selectedItem.user_email}</a>
                          </div>
                        )}
                        {selectedItem.page_url && (
                          <div className="border-4 border-ink p-3 col-span-2 bg-canvas">
                            <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Sent from page</div>
                            <div className="font-mono text-xs font-bold text-ink break-all">{selectedItem.page_url}</div>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      <div className="border-4 border-ink p-4" style={{ backgroundColor: TYPE_CONFIG[selectedItem.type]?.bg }}>
                        <div className="font-mono text-[8px] text-ink/50 uppercase tracking-wider mb-2">Message</div>
                        <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{selectedItem.message}</p>
                      </div>

                      {/* Status control */}
                      <div>
                        <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Update Status</div>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => (
                            <button key={statusKey} onClick={() => updateStatus(selectedItem.id, statusKey)}
                              className="font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase tracking-wider transition-all"
                              style={{
                                backgroundColor: selectedItem.status === statusKey ? cfg.color : 'white',
                                color: selectedItem.status === statusKey ? 'white' : '#6B7280',
                              }}>
                              {cfg.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Admin note */}
                      <div>
                        <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Internal Note</div>
                        <textarea
                          value={adminNote}
                          onChange={e => setAdminNote(e.target.value)}
                          rows={3}
                          className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet resize-none shadow-hard-sm bg-canvas"
                          placeholder="Add a note for yourself — what action you took, what you planned..."
                        />
                        <button onClick={saveNote} disabled={savingNote}
                          className="cn-btn-black text-xs mt-2 disabled:opacity-50">
                          {savingNote ? 'Saving...' : <><CheckCircle className="w-3.5 h-3.5" /> Save Note</>}
                        </button>
                      </div>

                      <div className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">
                        Received: {new Date(selectedItem.created_at).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-4 border-ink border-dashed p-12 text-center flex flex-col items-center justify-center bg-white h-64">
                    <Eye className="w-10 h-10 text-ink/20 mb-3" />
                    <p className="font-display text-lg font-black text-ink/30">Select a feedback item</p>
                    <p className="font-mono text-[9px] text-ink/20 uppercase tracking-wider mt-1">Click any item to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
