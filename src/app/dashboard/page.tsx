'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRight, Brain, Zap, User, Trophy, Target, ChevronRight, CheckCircle, Clock, Users } from 'lucide-react'
import RecommendationsWidget from '@/components/RecommendationsWidget'
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

type RecentActivityItem = LessonProgress & {
  lesson?: Lesson
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

type SubjectStat = {
  subject: Subject
  total: number
  completed: number
  avgScore: number | null
  pct: number
}

const SUBJECT_COLORS: Record<string, { color: string; bg: string }> = {
  'polymer-chemistry':             { color: '#1D4ED8', bg: '#EFF6FF' },
  'polymer-processing':            { color: '#EA580C', bg: '#FFF7ED' },
  'mould-design':                  { color: '#EA580C', bg: '#FFF7ED' },
  'polymer-testing':               { color: '#7C3AED', bg: '#F5F3FF' },
  'rubber-technology':             { color: '#EA580C', bg: '#FFF7ED' },
  'recycling-technology':          { color: '#15803D', bg: '#F0FDF4' },
  'sustainable-plastics':          { color: '#15803D', bg: '#F0FDF4' },
  'polymer-composites':            { color: '#1D4ED8', bg: '#EFF6FF' },
  'entrepreneurship-plastics':     { color: '#CA8A04', bg: '#FEFCE8' },
  'medical-plastics':              { color: '#7C3AED', bg: '#F5F3FF' },
  'polymer-rheology':              { color: '#EA580C', bg: '#FFF7ED' },
  'additives-compounding':         { color: '#1D4ED8', bg: '#EFF6FF' },
  'plastic-packaging-engineering': { color: '#15803D', bg: '#F0FDF4' },
  'life-cycle-assessment':         { color: '#15803D', bg: '#F0FDF4' },
  'color-science-masterbatches':   { color: '#CA8A04', bg: '#FEFCE8' },
  'polymer-nanotechnology':        { color: '#1D4ED8', bg: '#EFF6FF' },
  'bioprocessing-fermentation':    { color: '#15803D', bg: '#F0FDF4' },
  'robotics-plastics':              { color: '#EA580C', bg: '#FFF7ED' },
  'digital-twins-plastics':         { color: '#CA8A04', bg: '#FEFCE8' },
}

const TARGET_LABELS: Record<string, string> = {
  job: '🏭 Industry Job',
  gate: '📝 GATE / PSU',
  business: '🏗️ Start Business',
  rnd: '🔬 R&D Career',
  industry: '⚙️ Skill Building',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<LessonProgress[]>([])
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([])
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects'>('overview')

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }

      const [
        { data: prof },
        { data: subs },
        { data: lessons },
        { data: prog },
        { data: badgesData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('subjects').select('id, name, slug, order_index').order('order_index'),
        supabase.from('lessons').select('id, title, slug, subject_id, order_index, is_premium').order('order_index'),
        supabase.from('user_progress').select('*').eq('user_id', session.user.id),
        supabase.from('user_badges').select('badge_id, earned_at, badges(*)').eq('user_id', session.user.id),
      ])

      let activeProfile = prof
      if (!activeProfile) {
        const defaultName = session.user.email ? session.user.email.split('@')[0] : 'Student'
        const { data: newProf } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            full_name: defaultName,
            subscription_status: 'free',
            ai_queries_today: 0,
            avatar_url: null,
            bio: null,
            goals: null,
            college_name: null,
            education_level: null,
            branch: 'B.Tech Plastic Polymer Engineering',
            graduation_year: null,
            target_path: null,
            xp_points: 0,
            current_streak: 0,
            longest_streak: 0,
          })
          .select()
          .single()

        if (newProf) {
          activeProfile = newProf
        }
      }

      if (activeProfile) {
        setProfile({ ...activeProfile, email: session.user.email ?? '' })
      }
      if (subs) setSubjects(subs)
      if (lessons) setAllLessons(lessons)
      if (prog) setProgress(prog)
      if (badgesData) setEarnedBadges(badgesData as unknown as UserBadge[])

      // Calculate subject stats
      if (subs && lessons && prog) {
        const stats = subs.map(sub => {
          const subLessons = lessons.filter(l => l.subject_id === sub.id)
          const subProgress = prog.filter(p => subLessons.some(l => l.id === p.lesson_id))
          const completed = subProgress.filter(p => p.status === 'completed').length
          const scores = subProgress.filter(p => p.quiz_score !== null).map(p => p.quiz_score!)
          const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

          return {
            subject: sub,
            total: subLessons.length,
            completed,
            avgScore,
            pct: subLessons.length > 0 ? Math.round((completed / subLessons.length) * 100) : 0,
          }
        })
        setSubjectStats(stats)
      }

      // Recent activity (last completed lessons)
      if (prog && lessons) {
        const recent = prog
          .filter(p => p.completed_at)
          .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
          .slice(0, 5)
          .map(p => ({
            ...p,
            lesson: lessons.find(l => l.id === p.lesson_id),
          }))
        setRecentActivity(recent)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-2xl font-black text-ink animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    )
  }

  if (!profile) return null

  const isPremium = profile.subscription_status === 'premium'
  const totalCompleted = progress.filter(p => p.status === 'completed').length
  const totalLessons = allLessons.length
  const avgScore = progress.filter(p => p.quiz_score !== null).length > 0
    ? Math.round(progress.filter(p => p.quiz_score !== null).reduce((a, b) => a + (b.quiz_score ?? 0), 0) / progress.filter(p => p.quiz_score !== null).length)
    : null
  const quizzesPassed = progress.filter(p => p.quiz_passed).length
  const aiQueriesLeft = Math.max(0, (isPremium ? 999 : 15) - (profile.ai_queries_today ?? 0))



  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-blue" />

      {/* Hero header */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-10 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 border-4 border-yellow-bright flex-shrink-0 overflow-hidden bg-violet/20 flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white/40" />
              )}
            </div>
            <div>
              <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">Student Dashboard</div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white leading-tight">
                {profile.full_name || 'Welcome back'}
              </h1>
              {profile.college_name && (
                <p className="font-mono text-[10px] text-white/50 mt-0.5">
                  {profile.college_name}
                  {profile.education_level && ` · ${profile.education_level}`}
                </p>
              )}
              {profile.target_path && (
                <span className="font-mono text-[9px] font-bold border-2 border-yellow-bright text-yellow-bright px-2 py-0.5 mt-2 inline-block uppercase tracking-wider">
                  {TARGET_LABELS[profile.target_path] ?? profile.target_path}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile" className="border-4 border-white/30 text-white font-mono text-[10px] font-bold px-4 py-2 hover:bg-white/10 transition-colors uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Edit Profile
            </Link>
            {!isPremium && (
              <Link href="/pricing" className="cn-btn-yellow text-xs">
                Upgrade ₹149/mo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div className="border-b-4 border-ink flex">
        {(['overview', 'subjects'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="font-mono text-[10px] font-black uppercase tracking-widest px-6 py-3 border-r-4 border-ink transition-colors"
            style={{
              backgroundColor: activeTab === tab ? '#0A0A0A' : 'white',
              color: activeTab === tab ? '#FACC15' : '#6B7280',
            }}
          >
            {tab === 'overview' ? '📊 Overview' : '📚 All Subjects'}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── MAIN COLUMN ─────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Gamification Streak & XP Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-5 border-4 border-ink shadow-hard flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 border-2 border-white flex items-center justify-center text-2xl animate-pulse">
                    🔥
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-white/70 uppercase font-black tracking-wider">Habit Streak</span>
                    <h2 className="font-display text-2xl font-black leading-none mt-0.5">{profile.current_streak} days active</h2>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="font-mono text-[8px] text-white/70 uppercase font-black tracking-wider">Total XP</span>
                    <h2 className="font-display text-2xl font-black leading-none mt-0.5">{profile.xp_points.toLocaleString()}</h2>
                  </div>
                  <Link href="/leaderboard" className="border-2 border-white px-3 py-1 font-mono text-[9px] font-black uppercase hover:bg-white hover:text-ink transition-all">
                    Leaderboard →
                  </Link>
                </div>
              </div>

              {/* AI Mock Exam Promotional CTA */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 border-4 border-ink shadow-hard flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white border-2 border-slate-900 flex items-center justify-center text-2xl shrink-0">
                    🧠
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-white/70 uppercase font-black tracking-wider">NEW FEATURE</span>
                    <h2 className="font-display text-lg font-black leading-tight mt-0.5">Generate Custom AI Mock Exams</h2>
                    <p className="text-xs text-white/80 font-semibold mt-0.5">Test yourself on any polymer topic with instant grading and explanations.</p>
                  </div>
                </div>
                <Link
                  href="/practice/ai-generator"
                  className="bg-white border-2 border-slate-900 text-indigo-600 px-4 py-2 font-mono text-[10px] font-black uppercase hover:bg-slate-100 transition-all flex items-center gap-1 shrink-0"
                  style={{ boxShadow: '2px 2px 0px 0px #000' }}
                >
                  Generate Quiz <Zap className="w-3 h-3 text-amber-500 fill-current" />
                </Link>
              </div>


              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { val: `${totalCompleted}/${totalLessons}`, label: 'Lessons Done', color: '#1D4ED8', bg: '#EFF6FF' },
                  { val: avgScore !== null ? `${avgScore}%` : '—', label: 'Avg Quiz Score', color: '#7C3AED', bg: '#F5F3FF' },
                  { val: `${quizzesPassed}`, label: 'Quizzes Passed', color: '#15803D', bg: '#F0FDF4' },
                  { val: isPremium ? '∞' : `${aiQueriesLeft}`, label: 'AI Queries Left', color: '#EA580C', bg: '#FFF7ED' },
                ].map(s => (
                  <div key={s.label} className="border-4 border-ink p-4 text-center shadow-hard-sm" style={{ backgroundColor: s.bg }}>
                    <div className="font-display text-2xl md:text-3xl font-black" style={{ color: s.color }}>{s.val}</div>
                    <div className="font-mono text-[8px] text-ink/50 uppercase tracking-wider mt-1 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recommended for You Widget */}
              <RecommendationsWidget />

              {totalCompleted === totalLessons && (
                <div className="border-4 border-ink bg-green p-6 text-center shadow-hard">
                  <div className="font-display text-2xl font-black text-white mb-1">🏆 All lessons complete!</div>
                  <p className="text-white/80 text-sm">You&apos;ve finished the entire curriculum. Impressive.</p>
                </div>
              )}

              {/* Subject progress bars */}
              <div className="border-4 border-ink overflow-hidden shadow-hard">
                <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright flex items-center justify-between">
                  <span className="font-mono text-[9px] font-black text-ink uppercase tracking-widest">Subject Progress</span>
                  <button onClick={() => setActiveTab('subjects')} className="font-mono text-[9px] text-ink/60 hover:text-ink uppercase tracking-wider">
                    View All →
                  </button>
                </div>
                <div className="divide-y-2 divide-ink/10">
                  {subjectStats.map(stat => {
                    const dc = SUBJECT_COLORS[stat.subject.slug] ?? { color: '#1D4ED8', bg: '#EFF6FF' }
                    return (
                      <div key={stat.subject.id} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 border-2 border-ink flex-shrink-0" style={{ backgroundColor: dc.color }} />
                            <span className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider">{stat.subject.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {stat.avgScore !== null && (
                              <span className="font-mono text-[9px] text-ink/50">Quiz avg: {stat.avgScore}%</span>
                            )}
                            <span className="font-mono text-[10px] font-bold" style={{ color: dc.color }}>
                              {stat.completed}/{stat.total}
                            </span>
                          </div>
                        </div>
                        <div className="border-2 border-ink h-3 overflow-hidden">
                          <div
                            className="h-full transition-all duration-700"
                            style={{ width: `${stat.pct}%`, backgroundColor: dc.color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent activity */}
              {recentActivity.length > 0 && (
                <div className="border-4 border-ink overflow-hidden shadow-hard">
                  <div className="border-b-4 border-ink px-5 py-3 bg-ink">
                    <span className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Recent Completions
                    </span>
                  </div>
                  <div className="divide-y-2 divide-ink/10">
                    {recentActivity.map((item, i) => {
                      const lesson = item.lesson
                      if (!lesson) return null
                      const sub = subjects.find(s => s.id === lesson.subject_id)
                      const dc = SUBJECT_COLORS[sub?.slug ?? ''] ?? { color: '#1D4ED8', bg: '#EFF6FF' }
                      return (
                        <div key={i} className="flex items-center gap-3 px-5 py-3">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: dc.color }} />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-ink truncate">{lesson.title}</div>
                            <div className="font-mono text-[9px] text-ink/40 uppercase tracking-wider">
                              {sub?.name} · Score: {item.quiz_score ?? '—'}%
                            </div>
                          </div>
                          <Link href={`/quiz/${lesson.slug}`} className="font-mono text-[9px] border-2 border-ink text-ink px-2 py-1 hover:bg-ink hover:text-white transition-colors uppercase flex-shrink-0">
                            Retake
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── SIDEBAR ──────────────────────────────────── */}
            <div className="space-y-4">

              {/* Goals */}
              {profile.goals && (
                <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #15803D' }}>
                  <div className="border-b-4 border-ink px-4 py-3 bg-green">
                    <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" /> Your Goals
                    </span>
                  </div>
                  <div className="p-4 bg-green/5">
                    <p className="text-sm text-ink leading-relaxed italic">&quot;{profile.goals}&quot;</p>
                  </div>
                </div>
              )}

              {/* Flashcards study deck */}
              <FlashcardWidget />

              {/* Badges Widget */}
              <div className="border-4 border-ink overflow-hidden bg-white" style={{ boxShadow: '4px 4px 0px 0px #7C3AED' }}>
                <div className="border-b-4 border-ink px-4 py-3 bg-violet-600 text-white flex items-center justify-between">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest">Earned Badges ({earnedBadges.length})</span>
                  <Link href="/leaderboard" className="font-mono text-[8px] text-white/80 hover:text-white uppercase font-bold">
                    View All →
                  </Link>
                </div>
                <div className="p-4 grid grid-cols-4 gap-2">
                  {earnedBadges.slice(0, 8).map(ub => (
                    <div key={ub.badge_id} className="text-center" title={ub.badges?.description}>
                      <div className="w-10 h-10 bg-slate-50 border-2 border-ink rounded-lg flex items-center justify-center text-xl mx-auto">
                        {ub.badges?.icon || '🏅'}
                      </div>
                      <div className="text-[7px] font-bold mt-1 truncate max-w-full text-slate-700 leading-tight">{ub.badges?.name}</div>
                    </div>
                  ))}
                  {earnedBadges.length === 0 && (
                    <div className="col-span-full py-4 text-center font-mono text-[9px] text-slate-400 uppercase tracking-wide">
                      No badges earned yet
                    </div>
                  )}
                </div>
              </div>

              {/* Quick links */}
              <div className="border-4 border-ink overflow-hidden shadow-hard">
                <div className="border-b-4 border-ink px-4 py-3 bg-ink">
                  <span className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest">Quick Access</span>
                </div>
                {[
                  { label: 'AI Tutor', href: '/ai-tutor', icon: Brain, color: '#15803D' },
                  { label: 'Practice Quiz', href: '/practice', icon: Zap, color: '#CA8A04' },
                  { label: 'Study Groups', href: '/study-groups', icon: Users, color: '#1D4ED8' },
                  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, color: '#7C3AED' },
                ].map(link => {
                  const Icon = link.icon
                  return (
                    <Link key={link.href} href={link.href}
                      className="flex items-center gap-3 px-4 py-3 border-b-2 border-ink/10 last:border-0 hover:bg-ink hover:text-white group transition-colors"
                    >
                      <div className="w-7 h-7 border-2 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: link.color }}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink group-hover:text-white">{link.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-ink/30 group-hover:text-white/60 ml-auto" />
                    </Link>
                  )
                })}
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="border-4 border-ink p-4 shadow-hard-sm" style={{ backgroundColor: '#F5F3FF' }}>
                  <div className="font-mono text-[9px] font-bold text-violet uppercase tracking-widest mb-2">About You</div>
                  <p className="text-sm text-ink leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* No profile setup */}
              {!profile.college_name && !profile.bio && (
                <Link href="/profile" className="border-4 border-ink p-5 block hover:bg-ink hover:text-white group transition-colors shadow-hard" style={{ backgroundColor: '#FEFCE8' }}>
                  <div className="font-mono text-[9px] font-bold text-yellow uppercase tracking-widest mb-1" style={{ color: '#CA8A04' }}>Complete Your Profile</div>
                  <p className="font-display text-base font-black text-ink group-hover:text-white mb-2">Add your college, goals, and photo</p>
                  <span className="font-mono text-[9px] text-ink/50 group-hover:text-white/60 flex items-center gap-1">
                    Set up profile <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              )}

              {!isPremium && (
                <Link href="/pricing" className="border-4 border-ink overflow-hidden block" style={{ boxShadow: '4px 4px 0px 0px #CA8A04' }}>
                  <div className="border-b-4 border-ink px-4 py-3 bg-yellow-bright">
                    <span className="font-mono text-[9px] font-black text-ink uppercase tracking-widest">⭐ Go Premium</span>
                  </div>
                  <div className="p-4 bg-canvas">
                    <div className="font-display text-2xl font-black text-ink mb-1">₹149<span className="text-sm font-sans text-ink/50">/month</span></div>
                    <p className="text-xs text-ink/60 mb-3">All 216 lessons · Unlimited AI · Cancel anytime</p>
                    <div className="cn-btn-black w-full justify-center text-xs">Upgrade Now <ArrowRight className="w-3.5 h-3.5" /></div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="space-y-4">
            {subjectStats.map(stat => {
              const dc = SUBJECT_COLORS[stat.subject.slug] ?? { color: '#1D4ED8', bg: '#EFF6FF' }
              const subLessons = allLessons.filter(l => l.subject_id === stat.subject.id).sort((a, b) => a.order_index - b.order_index)

              return (
                <div key={stat.subject.id} className="border-4 border-ink overflow-hidden" style={{ boxShadow: `4px 4px 0px 0px ${dc.color}` }}>
                  <div className="border-b-4 border-ink px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: dc.bg }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 border-2 border-ink" style={{ backgroundColor: dc.color }} />
                      <span className="font-display text-lg font-black text-ink">{stat.subject.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-ink/50">{stat.completed}/{stat.total} lessons</span>
                      {stat.avgScore !== null && (
                        <span className="font-mono text-[10px] font-bold" style={{ color: dc.color }}>Avg: {stat.avgScore}%</span>
                      )}
                      <span className="font-mono text-[10px] font-black border-2 border-ink px-2 py-0.5" style={{ color: dc.color }}>
                        {stat.pct}% complete
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="border-b-4 border-ink h-2">
                    <div className="h-full" style={{ width: `${stat.pct}%`, backgroundColor: dc.color }} />
                  </div>

                  {/* Lessons */}
                  <div className="divide-y-2 divide-ink/10 bg-canvas">
                    {subLessons.map(lesson => {
                      const prog = progress.find(p => p.lesson_id === lesson.id)
                      const isComplete = prog?.quiz_passed === true
                      const hasStarted = prog?.status === 'reading'

                      return (
                        <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                            {isComplete
                              ? <CheckCircle className="w-5 h-5" style={{ color: dc.color }} />
                              : <div className="w-4 h-4 border-2 border-ink/30" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/lessons/${lesson.slug}`}
                              className="font-bold text-sm text-ink hover:underline truncate block"
                              style={{ textDecorationColor: dc.color }}
                            >
                              {lesson.order_index}. {lesson.title}
                            </Link>
                            {prog?.quiz_score !== null && prog?.quiz_score !== undefined && (
                              <span className="font-mono text-[9px] text-ink/40">Quiz: {prog.quiz_score}%</span>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Link href={`/lessons/${lesson.slug}`}
                              className="font-mono text-[9px] border-2 border-ink px-2 py-1 hover:bg-ink hover:text-white transition-colors uppercase"
                            >
                              {isComplete ? 'Review' : hasStarted ? 'Continue' : 'Start'}
                            </Link>
                            {isComplete && (
                              <Link href={`/quiz/${lesson.slug}`}
                                className="font-mono text-[9px] border-2 px-2 py-1 transition-colors uppercase"
                                style={{ borderColor: dc.color, color: dc.color }}
                              >
                                Retake Quiz
                              </Link>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t-4 border-ink px-5 py-3" style={{ backgroundColor: dc.bg }}>
                    <Link href={`/subjects/${stat.subject.slug}`} className="font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline" style={{ color: dc.color }}>
                      View subject page <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
