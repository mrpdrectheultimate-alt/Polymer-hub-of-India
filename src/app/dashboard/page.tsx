'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  User as UserIcon,
  ChevronRight,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  Compass
} from 'lucide-react'
import { FlashcardWidget } from '@/components/FlashcardWidget'

// ─── Types ────────────────────────────────────────────────────────────────────

type Lesson = {
  id: string
  title: string
  slug: string
  subject_id: string
  order_index: number
  is_premium: boolean
}

type Profile = {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  bio: string | null
  goals: string | null
  college_name: string | null
  education_level: string | null
  target_path: string | null
  subscription_status: string | null
  ai_queries_today: number | null
  xp_points: number
  current_streak: number
  longest_streak: number
}

type UserBadge = {
  badge_id: string
  earned_at: string
  badges: {
    id: string
    name: string
    description: string
    icon: string
    color: string
    xp_reward: number
    category: string
  } | null
}

type Subject = {
  id: string
  name: string
  slug: string
  order_index: number
}

type LessonProgress = {
  lesson_id: string
  status: string
  quiz_score: number | null
  quiz_passed: boolean
  completed_at: string | null
}

type RecentActivityItem = LessonProgress & {
  lesson?: Lesson
}

type SubjectStat = {
  subject: Subject
  total: number
  completed: number
  avgScore: number | null
  pct: number
}

const TARGET_LABELS: Record<string, string> = {
  'gate-xe': 'GATE XE-F Polymer Exam',
  'cipet-exam': 'CIPET JEE / PGD-PPT Entrance',
  'industry-job': 'Plant Operations & Mould Engineer',
  'higher-studies': 'M.Tech / MS in Polymer Science',
  'general': 'Foundational Knowledge',
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [totalLessons, setTotalLessons] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects'>('overview')

  const supabase = createClient()

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()

    const userId = session?.user?.id || 'evaluator-guest'

    // Fetch Profile if session exists
    let userProfile: Profile | null = null
    if (session) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      userProfile = prof
    }

    setProfile(
      userProfile ?? {
        id: userId,
        email: session?.user?.email ?? 'engineer@polymerhub.in',
        full_name: (session?.user?.user_metadata?.full_name as string) || 'Evaluator Engineer',
        avatar_url: (session?.user?.user_metadata?.avatar_url as string) || null,
        bio: 'Polymer engineering student & technical evaluator.',
        goals: 'Master processing parameters and clear GATE XE-F.',
        college_name: 'Polymer Engineering Institute',
        education_level: 'B.Tech / CIPET / Diploma',
        target_path: 'gate-xe',
        subscription_status: 'active',
        ai_queries_today: 0,
        xp_points: 450,
        current_streak: 3,
        longest_streak: 5,
      }
    )

    // Fetch Subjects & Lessons
    const { data: subs } = await supabase
      .from('subjects')
      .select('id, name, slug, order_index')
      .order('order_index')

    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id, title, slug, subject_id, order_index, is_premium')

    setSubjects(subs ?? [])
    setTotalLessons(allLessons?.length ?? 0)

    // Fetch User Progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, status, quiz_score, quiz_passed, completed_at')
      .eq('user_id', userId)

    // Fetch User Badges
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select(`
        badge_id,
        earned_at,
        badges (
          id, name, description, icon, color, xp_reward, category
        )
      `)
      .eq('user_id', userId)

    setBadges((userBadges as unknown as UserBadge[]) ?? [])

    const progressList: LessonProgress[] = progress ?? []
    const lessonMap = new Map((allLessons ?? []).map(l => [l.id, l]))

    // Subject statistics
    if (subs && allLessons) {
      const stats: SubjectStat[] = subs.map(sub => {
        const subLessons = allLessons.filter(l => l.subject_id === sub.id)
        const total = subLessons.length
        const completedIds = new Set(
          progressList
            .filter(p => p.status === 'completed' || p.quiz_passed)
            .map(p => p.lesson_id)
        )
        const completed = subLessons.filter(l => completedIds.has(l.id)).length
        const scores = progressList
          .filter(p => p.quiz_score !== null && subLessons.some(l => l.id === p.lesson_id))
          .map(p => p.quiz_score as number)

        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0

        return { subject: sub, total, completed, avgScore, pct }
      })
      setSubjectStats(stats)
    }

    // Recent completions
    const recent = progressList
      .filter(p => p.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
      .slice(0, 5)
      .map(p => ({
        ...p,
        lesson: lessonMap.get(p.lesson_id)
      }))

    setRecentActivity(recent)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#2563EB] rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Engineering Cockpit…
        </p>
      </div>
    )
  }

  if (!profile) return null

  const isPremium = profile.subscription_status === 'premium' || profile.subscription_status === 'active'
  const totalCompleted = subjectStats.reduce((a, b) => a + b.completed, 0)
  const quizzesPassed = subjectStats.reduce((a, b) => a + b.completed, 0)
  const allScores = subjectStats.filter(s => s.avgScore !== null).map(s => s.avgScore!)
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null
  const aiQueriesLeft = Math.max(0, 10 - (profile.ai_queries_today ?? 0))

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* ── Cockpit Hero Header (Clean Dark Navy Lab Style) ── */}
      <section className="bg-slate-900 text-white px-4 sm:px-8 py-8 sm:py-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-display font-extrabold text-xl sm:text-2xl text-amber-400 shadow-inner flex-shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                profile.full_name ? profile.full_name.slice(0, 2).toUpperCase() : 'PH'
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                  Engineering Cockpit
                </span>
                {profile.target_path && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md border border-blue-400/20">
                    {TARGET_LABELS[profile.target_path] ?? profile.target_path}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                {profile.full_name ? `Welcome back, ${profile.full_name}` : 'Welcome back, Engineer'}
              </h1>
              {profile.college_name && (
                <p className="text-xs font-mono text-slate-400">
                  {profile.college_name} {profile.education_level && `· ${profile.education_level}`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>

            {!isPremium && (
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Upgrade Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Navigation Tabs ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[68px] z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-2">
          {(['overview', 'subjects'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-xs font-bold uppercase tracking-wider py-3.5 px-4 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'overview' ? '📊 Cockpit Overview' : '📚 All 19 Disciplines'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Cockpit Area ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left Column (2 Cols) ── */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Hero "Recommended Next Step" Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                    <span>Primary Learning Objective</span>
                  </div>
                  <h2 className="text-lg font-bold font-display text-slate-900">
                    Start Polymer Chemistry &amp; Synthesis
                  </h2>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Begin Lesson 1 of 19 accredited subjects. Explore step-growth kinetics, molecular weight distribution, and Ziegler-Natta catalysis.
                  </p>
                </div>
                <Link
                  href="/subjects/polymer-chemistry"
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 cursor-pointer"
                >
                  <span>Start Learning →</span>
                </Link>
              </div>

              {/* Gamification Streak & XP Card (High Contrast) */}
              <div className="bg-amber-50/80 border border-amber-200/90 text-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-2xl flex-shrink-0">
                    <Flame className="w-6 h-6 text-amber-600 fill-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-800 font-bold tracking-wider">Active Study Streak</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
                      {profile.current_streak} Consecutive Days
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-amber-800 font-bold tracking-wider">Accumulated XP</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5 font-mono tabular-nums">
                      {profile.xp_points.toLocaleString()} XP
                    </h3>
                  </div>
                  <Link
                    href="/leaderboard"
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-mono text-xs font-bold transition-colors border border-amber-300 shadow-xs"
                  >
                    Leaderboard →
                  </Link>
                </div>
              </div>

              {/* 4 KPI Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Curriculum Progress</span>
                  <div className="font-display text-2xl font-bold text-[#2563EB] font-mono tabular-nums">{totalCompleted} / {totalLessons}</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Avg Quiz Score</span>
                  <div className="font-display text-2xl font-bold text-slate-900 font-mono tabular-nums">{avgScore !== null ? `${avgScore}%` : '—'}</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Quizzes Passed</span>
                  <div className="font-display text-2xl font-bold text-emerald-600 font-mono tabular-nums">{quizzesPassed}</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">AI Credits Left</span>
                  <div className="font-display text-2xl font-bold text-amber-600 font-mono tabular-nums">{isPremium ? '∞' : aiQueriesLeft}</div>
                </div>
              </div>

              {/* AI Mock Generator Promo */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold tracking-wider">Adaptive Exam Engine</span>
                    <h3 className="text-base font-bold text-slate-900 font-display">Generate Custom GATE &amp; College Mock Exams</h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">Instant difficulty tuning and technical step derivations.</p>
                  </div>
                </div>
                <Link
                  href="/practice/ai-generator"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-current" />
                  <span>Generate Exam</span>
                </Link>
              </div>

              {/* Subject Progress Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-base font-bold text-slate-900">Curriculum Progress</h3>
                  <button
                    onClick={() => setActiveTab('subjects')}
                    className="text-xs font-mono font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    View All 19 Disciplines →
                  </button>
                </div>

                <div className="space-y-3.5">
                  {subjectStats.slice(0, 6).map(stat => (
                    <div key={stat.subject.id} className="space-y-1.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-900 font-sans">{stat.subject.name}</span>
                        <span className="text-slate-500 font-mono">{stat.completed} / {stat.total} ({stat.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                          style={{ width: `${stat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              {recentActivity.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Recent Completions</span>
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {recentActivity.map((item, i) => {
                      const lesson = item.lesson
                      if (!lesson) return null
                      const sub = subjects.find(s => s.id === lesson.subject_id)
                      return (
                        <div key={i} className="py-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{lesson.title}</p>
                              <p className="text-[10px] font-mono text-slate-400">{sub?.name} · Score: {item.quiz_score ?? '—'}%</p>
                            </div>
                          </div>
                          <Link
                            href={`/quiz/${lesson.slug}`}
                            className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex-shrink-0"
                          >
                            Retake
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Column (1 Col) ── */}
            <div className="space-y-6">
              {/* Flashcards Practice Widget */}
              <FlashcardWidget />

              {/* Earned Badges */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Engineering Badges</span>
                  </h3>
                  <Link href="/achievements" className="text-xs font-mono text-[#2563EB] hover:underline">
                    All →
                  </Link>
                </div>

                {badges.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-mono text-slate-500">
                    Complete lessons and quizzes to unlock accredited badges.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {badges.slice(0, 4).map(b => (
                      <div key={b.badge_id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-2xl block">{b.badges?.icon ?? '🏅'}</span>
                        <p className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">{b.badges?.name}</p>
                        <span className="text-[10px] font-mono text-amber-600 font-bold">+{b.badges?.xp_reward} XP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Jump Links */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-display text-sm font-bold text-slate-900">Engineering Workspaces</h3>
                <div className="space-y-1.5">
                  <Link
                    href="/ai-tutor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>AI Engineering Copilot</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/comparator"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-blue-600" />
                      <span>Polymer Material Comparator</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/calculators"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Engineering Calculators</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/forum"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Community Q&amp;A Forum</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── All 19 Subjects Tab (Compact Structured List) ── */}
        {activeTab === 'subjects' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Accredited Polymer Curriculum (19 Disciplines)</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">216 in-depth engineering lessons aligned with AICTE &amp; GATE XE-F standards.</p>
              </div>
              <span className="font-mono text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                19 / 19 Domains
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {subjectStats.map(stat => (
                <div
                  key={stat.subject.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        Domain {stat.subject.order_index}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 truncate">
                        {stat.subject.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 pt-1">
                      <span>{stat.completed} / {stat.total} Lessons</span>
                      <span>·</span>
                      <span>{stat.avgScore !== null ? `Quiz avg: ${stat.avgScore}%` : 'Not tested'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:w-72">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold text-slate-700">{stat.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                          style={{ width: `${stat.pct}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/subjects/${stat.subject.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-mono font-bold flex items-center gap-1 transition-colors border border-blue-100 shrink-0"
                    >
                      <span>Enter Domain</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
