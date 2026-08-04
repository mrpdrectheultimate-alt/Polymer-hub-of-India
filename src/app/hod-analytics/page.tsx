'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, TrendingUp, AlertTriangle, BookOpen, Star,
  BarChart2, Award, ChevronRight, ArrowLeft,

  CheckCircle, RefreshCw, ShieldAlert
} from 'lucide-react'

/* ─── Types ───────────────────────────────────────────────────────────── */
type Summary = {
  totalStudents: number
  totalXP: number
  avgXP: number
  avgLessons: number
  avgQuizScore: number
}

type SubjectStat = {
  id: string
  name: string
  slug: string
  completed: number
  avgScore: number | null
}

type ContentGap = {
  lessonId: string
  title: string
  subjectName: string
  avgScore: number | null
  attempts: number
}

type Student = {
  id: string
  full_name: string | null
  email: string
  subscription_status: string | null
  xp_points: number
  current_streak: number
  total_lessons_completed: number
  total_quizzes_passed: number
}

type AnalyticsData = {
  summary: Summary
  subjectStats: SubjectStat[]
  contentGaps: ContentGap[]
  students: Student[]
}

/* ─── Small Components ────────────────────────────────────────────────── */
function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span className="font-mono text-[9px] text-slate-400">No data</span>
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-[9px] font-black w-7 text-right" style={{ color }}>{score}%</span>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="border-4 border-ink bg-white shadow-hard p-5 flex items-center gap-4">
      <div className="w-12 h-12 border-4 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="font-mono text-[8px] text-slate-400 uppercase tracking-widest font-black">{label}</div>
        <div className="font-display text-2xl font-black text-ink leading-tight">{value}</div>
        {sub && <div className="font-mono text-[9px] text-slate-400">{sub}</div>}
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function HODAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'gaps' | 'students'>('overview')
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/hod/analytics')
      if (res.status === 403) {
        setError('HOD Access Denied. Enable HOD mode in your Profile settings to view analytics.')
        setLoading(false)
        return
      }
      const json = await res.json()
      if (json.error) {
        setError(json.error)
      } else {
        setData(json)
      }
    } catch {
      setError('Failed to connect to analytics service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-4 border-ink w-12 h-12 border-t-yellow-bright animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink">Loading Analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full border-4 border-ink p-8 bg-white shadow-hard text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-black text-ink mb-2">Access Restricted</h2>
          <p className="text-sm text-ink/70 leading-relaxed mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/profile" className="border-4 border-ink bg-yellow-bright px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              Go to Profile
            </Link>
            <Link href="/hod-dashboard" className="border-4 border-ink bg-white px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              Seat Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { summary, subjectStats, contentGaps, students } = data

  const filteredStudents = students.filter(s =>
    !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  )

  const topSubjects = [...subjectStats].sort((a, b) => (b.avgScore ?? -1) - (a.avgScore ?? -1)).slice(0, 5)
  const weakSubjects = [...subjectStats].sort((a, b) => (a.avgScore ?? 101) - (b.avgScore ?? 101)).filter(s => s.avgScore !== null).slice(0, 5)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="border-b-4 border-ink bg-ink text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/hod-dashboard" className="flex items-center gap-1 font-mono text-[9px] text-yellow-bright uppercase tracking-widest hover:opacity-80 mb-2">
              <ArrowLeft className="w-3 h-3" /> Seat Dashboard
            </Link>
            <h1 className="font-display text-2xl font-black text-white">📊 Analytics & Insights</h1>
            <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Institution-level performance intelligence</p>
          </div>
          <button onClick={load}
            className="flex items-center gap-2 border-4 border-yellow-bright bg-yellow-bright text-ink px-4 py-2 font-mono text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(250,204,21,0.5)] hover:-translate-y-0.5 transition-transform">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Total Students" value={summary.totalStudents} sub="in your institution" color="#6D28D9" />
          <StatCard icon={Star} label="Avg XP / Student" value={summary.avgXP.toLocaleString()} sub={`${summary.totalXP.toLocaleString()} total`} color="#CA8A04" />
          <StatCard icon={BookOpen} label="Avg Lessons" value={summary.avgLessons} sub="completed per student" color="#1D4ED8" />
          <StatCard icon={TrendingUp} label="Avg Quiz Score" value={summary.avgQuizScore > 0 ? `${summary.avgQuizScore}%` : 'N/A'} sub="across all attempts" color="#047857" />
          <StatCard icon={AlertTriangle} label="Content Gaps" value={contentGaps.length} sub="topics below 70%" color="#DC2626" />
        </div>

        {/* Navigation Tabs */}
        <div className="border-4 border-ink overflow-hidden bg-white shadow-hard">
          <div className="flex border-b-4 border-ink">
            {([
              { id: 'overview', label: '🏆 Overview', icon: BarChart2 },
              { id: 'subjects', label: '📚 Subject Stats', icon: BookOpen },
              { id: 'gaps', label: '⚠️ Content Gaps', icon: AlertTriangle },
              { id: 'students', label: '👥 Student Roster', icon: Users },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 px-4 py-3 font-mono text-[9px] font-black uppercase tracking-widest border-r-4 border-ink last:border-r-0 transition-colors"
                style={{ backgroundColor: activeTab === tab.id ? '#0A0A0A' : 'white', color: activeTab === tab.id ? '#FACC15' : '#6B7280' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="p-6 grid lg:grid-cols-2 gap-6">

              {/* Top Performing Subjects */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-green-600" />
                  <h3 className="font-display font-black text-sm text-ink uppercase">Top Performing Subjects</h3>
                </div>
                <div className="space-y-3">
                  {topSubjects.length === 0 && (
                    <p className="font-mono text-[10px] text-slate-400 text-center py-4">No quiz data yet.</p>
                  )}
                  {topSubjects.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 border-2 border-ink p-3">
                      <div className="w-6 h-6 border-2 border-ink bg-green-100 flex items-center justify-center font-mono text-[9px] font-black text-green-700 flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-ink truncate">{s.name}</div>
                        <div className="font-mono text-[9px] text-slate-400">{s.completed} completions</div>
                      </div>
                      <div className="w-28 flex-shrink-0">
                        <ScoreBar score={s.avgScore} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Subjects */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h3 className="font-display font-black text-sm text-ink uppercase">Subjects Needing Attention</h3>
                </div>
                <div className="space-y-3">
                  {weakSubjects.length === 0 && (
                    <p className="font-mono text-[10px] text-slate-400 text-center py-4">All subjects performing well! 🎉</p>
                  )}
                  {weakSubjects.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 border-2 border-ink p-3">
                      <div className="w-6 h-6 border-2 border-ink bg-red-50 flex items-center justify-center font-mono text-[9px] font-black text-red-600 flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-ink truncate">{s.name}</div>
                        <div className="font-mono text-[9px] text-slate-400">{s.completed} completions</div>
                      </div>
                      <div className="w-28 flex-shrink-0">
                        <ScoreBar score={s.avgScore} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action Links */}
              <div className="lg:col-span-2 border-4 border-ink bg-yellow-bright p-5">
                <h3 className="font-display font-black text-sm text-ink uppercase mb-3">🚀 Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Link href="/hod-dashboard" className="flex items-center gap-2 border-4 border-ink bg-white px-4 py-2 font-mono text-[9px] font-black uppercase shadow-hard-sm hover:-translate-y-0.5 transition-transform">
                    <Users className="w-3.5 h-3.5" /> Manage Seats <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/leaderboard?tab=leaderboard" className="flex items-center gap-2 border-4 border-ink bg-white px-4 py-2 font-mono text-[9px] font-black uppercase shadow-hard-sm hover:-translate-y-0.5 transition-transform">
                    <BarChart2 className="w-3.5 h-3.5" /> Institution Leaderboard <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/subjects" className="flex items-center gap-2 border-4 border-ink bg-white px-4 py-2 font-mono text-[9px] font-black uppercase shadow-hard-sm hover:-translate-y-0.5 transition-transform">
                    <BookOpen className="w-3.5 h-3.5" /> View Curriculum <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Subject Stats Tab ── */}
          {activeTab === 'subjects' && (
            <div className="divide-y-2 divide-ink/10">
              <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-slate-50 border-b-2 border-ink/10">
                <span className="font-mono text-[8px] text-slate-400 uppercase font-black">Subject</span>
                <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-center">Completions</span>
                <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-center">Avg Quiz Score</span>
                <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-right">Action</span>
              </div>
              {subjectStats.length === 0 && (
                <div className="p-12 text-center">
                  <p className="font-display text-xl font-black text-slate-300">No subject data yet.</p>
                </div>
              )}
              {subjectStats.map(s => (
                <div key={s.id} className="grid grid-cols-4 gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-sm text-ink">{s.name}</span>
                  <div className="text-center">
                    <span className="font-mono text-sm font-black text-blue-600">{s.completed}</span>
                    <div className="font-mono text-[8px] text-slate-400">completions</div>
                  </div>
                  <div>
                    <ScoreBar score={s.avgScore} />
                  </div>
                  <div className="text-right">
                    <Link href={`/subjects/${s.slug}`} className="border-2 border-ink px-2 py-1 font-mono text-[8px] font-black uppercase hover:bg-ink hover:text-white transition-colors">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Content Gaps Tab ── */}
          {activeTab === 'gaps' && (
            <div>
              <div className="px-6 py-4 bg-red-50 border-b-4 border-ink flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-mono text-[9px] font-black text-red-700 uppercase tracking-widest">Content Gap Heatmap</p>
                  <p className="font-mono text-[9px] text-red-600 mt-0.5">These lessons have average quiz scores below 70%. Review content and consider extra sessions.</p>
                </div>
              </div>
              <div className="divide-y-2 divide-ink/10">
                <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-slate-50 border-b-2 border-ink/10">
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black col-span-2">Lesson</span>
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black">Subject</span>
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-center">Attempts</span>
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-right">Avg Score</span>
                </div>
                {contentGaps.length === 0 && (
                  <div className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="font-display text-xl font-black text-slate-300 mb-1">All Clear!</p>
                    <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">No lessons below 70% average score.</p>
                  </div>
                )}
                {contentGaps.map((gap) => {
                  const score = gap.avgScore ?? 0
                  const severity = score < 40 ? 'bg-red-100 border-l-4 border-red-500' : score < 60 ? 'bg-orange-50 border-l-4 border-orange-400' : 'bg-yellow-50 border-l-4 border-yellow-400'
                  return (
                    <div key={gap.lessonId} className={`grid grid-cols-5 gap-4 items-center px-6 py-4 ${severity}`}>
                      <span className="font-bold text-sm text-ink col-span-2 truncate">{gap.title}</span>
                      <span className="font-mono text-[9px] text-slate-500">{gap.subjectName}</span>
                      <span className="font-mono text-xs font-black text-slate-600 text-center">{gap.attempts}</span>
                      <div className="text-right">
                        <span className="font-mono text-sm font-black" style={{ color: score < 50 ? '#dc2626' : '#ca8a04' }}>
                          {score}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Student Roster Tab ── */}
          {activeTab === 'students' && (
            <div>
              <div className="px-6 py-4 border-b-4 border-ink flex items-center gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="flex-1 border-4 border-ink px-3 py-2 font-mono text-xs bg-white focus:outline-none focus:border-yellow-bright"
                />
                <span className="font-mono text-[9px] text-slate-400 whitespace-nowrap">{filteredStudents.length} of {students.length}</span>
              </div>
              <div className="divide-y-2 divide-ink/10">
                <div className="grid grid-cols-6 gap-2 px-6 py-3 bg-slate-50 border-b-2 border-ink/10">
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black col-span-2">Student</span>
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-center">XP</span>
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-center">Streak</span>
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-center">Lessons</span>
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black text-right">Status</span>
                </div>
                {filteredStudents.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="font-display text-xl font-black text-slate-300">No students found.</p>
                  </div>
                )}
                {filteredStudents.map(s => {
                  const isPremium = s.subscription_status === 'premium'
                  return (
                    <div key={s.id} className="grid grid-cols-6 gap-2 items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="col-span-2 min-w-0">
                        <div className="font-bold text-sm text-ink truncate">{s.full_name ?? 'Unnamed Student'}</div>
                        <div className="font-mono text-[9px] text-slate-400 truncate">{s.email}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 text-yellow-600" />
                          <span className="font-mono text-xs font-black text-ink">{s.xp_points.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="font-mono text-xs font-black text-orange-600">{s.current_streak} 🔥</span>
                      </div>
                      <div className="text-center">
                        <span className="font-mono text-xs font-black text-blue-600">{s.total_lessons_completed}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-[8px] font-black px-2 py-1 border-2 ${isPremium ? 'border-violet-600 text-violet-600 bg-violet-50' : 'border-slate-300 text-slate-400 bg-slate-50'}`}>
                          {isPremium ? 'Premium' : 'Free'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400 uppercase">
          <Link href="/dashboard" className="hover:text-ink">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/hod-dashboard" className="hover:text-ink">HOD Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink font-black">Analytics</span>
        </div>

      </div>
    </div>
  )
}
