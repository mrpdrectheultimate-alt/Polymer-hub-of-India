'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, TrendingUp, AlertTriangle, BookOpen, Star,
  BarChart2, Award, ArrowLeft,
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
  if (score === null) return <span className="font-mono text-[10px] text-slate-400">No data</span>
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-[10px] font-bold w-8 text-right" style={{ color }}>{score}%</span>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="border border-slate-200/90 rounded-2xl bg-white shadow-xs p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-bold">{label}</div>
        <div className="font-display text-2xl font-bold text-slate-900 leading-tight">{value}</div>
        {sub && <div className="font-mono text-[10px] text-slate-400">{sub}</div>}
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-4 border-slate-200 border-t-[#2563EB] w-10 h-10 rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Loading Analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-slate-200/90 rounded-3xl p-8 bg-white shadow-xs text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/profile" className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-mono text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs">
              Go to Profile
            </Link>
            <Link href="/hod-dashboard" className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl font-mono text-xs font-bold hover:bg-slate-50 transition-colors">
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/hod-dashboard" className="flex items-center gap-1 font-mono text-[10px] text-blue-400 uppercase tracking-wider hover:underline mb-2">
              <ArrowLeft className="w-3 h-3" /> Seat Dashboard
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">📊 Department Analytics &amp; Insights</h1>
            <p className="font-mono text-xs text-slate-400 mt-1">Institution-level performance intelligence</p>
          </div>
          <button onClick={load}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Total Students" value={summary.totalStudents} sub="in your institution" color="#2563EB" />
          <StatCard icon={Star} label="Avg XP / Student" value={summary.avgXP.toLocaleString()} sub={`${summary.totalXP.toLocaleString()} total`} color="#D97706" />
          <StatCard icon={BookOpen} label="Avg Lessons" value={summary.avgLessons} sub="completed per student" color="#4F46E5" />
          <StatCard icon={TrendingUp} label="Avg Quiz Score" value={summary.avgQuizScore > 0 ? `${summary.avgQuizScore}%` : 'N/A'} sub="across all attempts" color="#059669" />
          <StatCard icon={AlertTriangle} label="Content Gaps" value={contentGaps.length} sub="topics below 70%" color="#DC2626" />
        </div>

        {/* Navigation Tabs & Main Container */}
        <div className="border border-slate-200/90 rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="flex border-b border-slate-100 bg-slate-50">
            {([
              { id: 'overview', label: '🏆 Overview', icon: BarChart2 },
              { id: 'subjects', label: '📚 Subject Stats', icon: BookOpen },
              { id: 'gaps', label: '⚠️ Content Gaps', icon: AlertTriangle },
              { id: 'students', label: '👥 Student Roster', icon: Users },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3.5 font-mono text-xs font-bold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#2563EB] text-[#2563EB] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}>
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
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase">Top Performing Subjects</h3>
                </div>
                <div className="space-y-3">
                  {topSubjects.length === 0 && (
                    <p className="font-mono text-xs text-slate-400 text-center py-4">No quiz data yet.</p>
                  )}
                  {topSubjects.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 border border-slate-200 rounded-2xl p-3.5 hover:border-slate-300 transition-colors">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">{s.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{s.completed} completions</div>
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
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase">Subjects Needing Attention</h3>
                </div>
                <div className="space-y-3">
                  {weakSubjects.length === 0 && (
                    <p className="font-mono text-xs text-slate-400 text-center py-4">All subjects performing well! 🎉</p>
                  )}
                  {weakSubjects.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 border border-slate-200 rounded-2xl p-3.5 hover:border-slate-300 transition-colors">
                      <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">{s.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{s.completed} completions</div>
                      </div>
                      <div className="w-28 flex-shrink-0">
                        <ScoreBar score={s.avgScore} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── Subject Stats Tab ── */}
          {activeTab === 'subjects' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectStats.map(s => (
                  <div key={s.id} className="border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-[#2563EB] transition-all">
                    <div className="font-bold text-sm text-slate-900">{s.name}</div>
                    <div className="flex justify-between text-xs font-mono text-slate-500">
                      <span>Completions:</span>
                      <span className="font-bold text-slate-900">{s.completed}</span>
                    </div>
                    <div className="pt-2">
                      <ScoreBar score={s.avgScore} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Content Gaps Tab ── */}
          {activeTab === 'gaps' && (
            <div className="p-6">
              {contentGaps.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-bold text-sm text-slate-800">No Critical Content Gaps Detected</p>
                  <p className="text-xs text-slate-500">All topics are averaging above 70% retention.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contentGaps.map((gap, i) => (
                    <div key={gap.lessonId || i} className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{gap.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">{gap.subjectName} · {gap.attempts} attempts</div>
                      </div>
                      <div className="w-32">
                        <ScoreBar score={gap.avgScore} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Student Roster Tab ── */}
          {activeTab === 'students' && (
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Search students in roster..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 font-mono text-[10px] text-slate-500 uppercase tracking-wider text-left">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">XP Points</th>
                      <th className="px-4 py-3">Lessons Done</th>
                      <th className="px-4 py-3">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans text-xs sm:text-sm text-slate-800">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{s.full_name || 'Unnamed'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.email}</td>
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">{s.xp_points.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono">{s.total_lessons_completed}</td>
                        <td className="px-4 py-3 font-mono text-orange-600">{s.current_streak}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
