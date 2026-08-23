'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Trophy, 
  Star, 
  Lock, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Brain, 
  Compass, 
  CheckCircle2,
  Medal,
  Award
} from 'lucide-react'

type Badge = {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  xp_reward: number
  category: string
  condition: string
}

type UserBadge = { badge_id: string; earned_at: string }

type LeaderboardEntry = {
  id: string
  full_name: string | null
  avatar_url: string | null
  college_name: string | null
  xp_points: number
  current_streak: number
  total_lessons_completed: number
  badges_earned?: number
}

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  xp_points: number
  current_streak: number
  longest_streak: number
  total_lessons_completed: number
  total_quizzes_passed: number
  college_name: string | null
}

type Subject = {
  id: string
  name: string
  slug: string
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  learning:  { label: 'Learning',  color: '#2563EB', bg: '#EFF6FF' },
  quiz:      { label: 'Quizzes',   color: '#16A34A', bg: '#F0FDF4' },
  streak:    { label: 'Streaks',   color: '#EA580C', bg: '#FFF7ED' },
  community: { label: 'Community', color: '#7C3AED', bg: '#F5F3FF' },
  special:   { label: 'Special',   color: '#D97706', bg: '#FEFCE8' },
}

function Avatar({ name, avatarUrl, size = 10 }: { name: string | null; avatarUrl: string | null; size?: number }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'
  
  const sizeMap: Record<number, string> = {
    8: 'w-8 h-8 text-xs',
    9: 'w-9 h-9 text-xs',
    10: 'w-10 h-10 text-sm',
    12: 'w-12 h-12 text-base',
  }
  const sizeClass = sizeMap[size] ?? 'w-10 h-10 text-sm'

  return avatarUrl ? (
    <img src={avatarUrl} alt={name ?? ''} className={`${sizeClass} rounded-xl border-2 border-slate-900 object-cover flex-shrink-0`} />
  ) : (
    <div className={`${sizeClass} rounded-xl border-2 border-slate-900 bg-slate-900 flex items-center justify-center font-mono font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  )
}

export default function AchievementsPage() {
  const supabase = createClient()
  const [badges, setBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [colleges, setColleges] = useState<string[]>([])
  
  const [loading, setLoading] = useState(true)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges')
  const [activeCategory, setActiveCategory] = useState('all')

  // Leaderboard filters
  const [scope, setScope] = useState<string>('global')
  const [period, setPeriod] = useState<string>('all')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedCollege, setSelectedCollege] = useState<string>('')

  // Load initial static data & user profile
  useEffect(() => {
    const loadInit = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        // 1. Fetch Badges Master
        const { data: badgeData } = await supabase
          .from('badges')
          .select('*')
          .order('xp_reward', { ascending: true })
        if (badgeData) setBadges(badgeData)

        // 2. Fetch Subjects for filters
        const { data: subData } = await supabase
          .from('subjects')
          .select('id, name, slug')
          .order('order_index')
        if (subData) setSubjects(subData)

        // 3. If User logged in, fetch Profile & Earned Badges
        if (session) {
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (profData) setProfile(profData)

          const { data: ubData } = await supabase
            .from('user_badges')
            .select('badge_id, earned_at')
            .eq('user_id', session.user.id)
          if (ubData) setUserBadges(ubData)
        }

        // 4. Fetch Colleges list for filter
        const { data: collegeData } = await supabase
          .from('profiles')
          .select('college_name')
          .not('college_name', 'is', null)
        if (collegeData) {
          const uniqueColleges = Array.from(new Set(collegeData.map(c => c.college_name).filter(Boolean))) as string[]
          setColleges(uniqueColleges)
        }

      } catch (err) {
        console.error('Failed to load achievements init:', err)
      } finally {
        setLoading(false)
      }
    }
    loadInit()
  }, [supabase])

  // Load dynamic leaderboard data based on filters
  useEffect(() => {
    const loadLeaderboard = async () => {
      setLeaderboardLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('scope', scope)
        params.set('period', period)
        if (scope === 'subject' && selectedSubjectId) params.set('subjectId', selectedSubjectId)
        if (scope === 'college' && selectedCollege) params.set('college', selectedCollege)

        const res = await fetch(`/api/leaderboard?${params.toString()}`)
        const json = await res.json()
        if (json.data) {
          setLeaderboard(json.data)
        }
      } catch (err) {
        console.error('Failed to load leaderboard data:', err)
      } finally {
        setLeaderboardLoading(false)
      }
    }
    loadLeaderboard()
  }, [scope, period, selectedSubjectId, selectedCollege])

  const earnedIds = new Set(userBadges.map(ub => ub.badge_id))
  const earnedCount = earnedIds.size
  const totalBadges = badges.length || 18

  const filteredBadges = activeCategory === 'all'
    ? badges
    : badges.filter(b => b.category === activeCategory)

  // Find User's Rank in current leaderboard
  const userRank = profile ? leaderboard.findIndex(u => u.id === profile.id) + 1 : null

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              National Leaderboard &middot; Badges &middot; Daily Streaks &middot; XP Rewards
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Badges. Streaks. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              National Leaderboard.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Earn official competence badges, build unbroken study streaks, and climb the national plastics engineering leaderboard across colleges.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">{totalBadges}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Badges</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">{earnedCount}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Badges Earned</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">{profile?.current_streak || 0}🔥</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Daily Streak</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">
                {userRank ? `#${userRank}` : 'Top Tier'}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">National Rank</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Workspace ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Primary Tab Switcher */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === 'badges'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Award className="w-4 h-4" /> Competence Badges ({earnedCount}/{totalBadges})
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Trophy className="w-4 h-4" /> National Leaderboard
            </button>
          </div>

          {profile && (
            <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-2">
              <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} size={8} />
              <div>
                <div className="font-display font-bold text-xs text-slate-900">{profile.full_name ?? 'Student'}</div>
                <div className="text-[10px] font-mono font-bold text-amber-700">{profile.xp_points.toLocaleString()} XP</div>
              </div>
            </div>
          )}
        </div>

        {/* ── TAB 1: COMPETENCE BADGES ── */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            
            {/* Category Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all border-2 ${
                  activeCategory === 'all'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                All ({badges.length})
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                const count = badges.filter(b => b.category === key).length
                const earnedInCat = badges.filter(b => b.category === key && earnedIds.has(b.id)).length
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all border-2 ${
                      activeCategory === key
                        ? 'border-slate-900 bg-blue-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cfg.label} ({earnedInCat}/{count})
                  </button>
                )
              })}
            </div>

            {/* Streak Habit Tracker Card */}
            {profile && (
              <div className="border-2 border-slate-900 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-md">
                    {profile.current_streak}🔥
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      Unbroken Daily Streak &mdash; {profile.current_streak} Days
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Longest record: <strong>{profile.longest_streak} days</strong>. Log in and complete a lesson daily to unlock streak bonuses!
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  {[3, 7, 14, 30, 60, 90].map(milestone => {
                    const completed = profile.current_streak >= milestone
                    return (
                      <div 
                        key={milestone}
                        className={`w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center text-center ${
                          completed 
                            ? 'border-orange-600 bg-orange-600 text-white shadow-sm' 
                            : 'border-slate-300 bg-white text-slate-400'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold">{milestone}d</span>
                        {completed && <span className="text-[9px] font-bold">&check;</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Badges Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="border-2 border-slate-200 bg-white rounded-2xl p-6 animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBadges.map(badge => {
                  const isEarned = earnedIds.has(badge.id)
                  const cfg = CATEGORY_CONFIG[badge.category] || { label: 'Badge', color: '#2563EB', bg: '#EFF6FF' }

                  return (
                    <article
                      key={badge.id}
                      className={`border-2 rounded-2xl p-5 shadow-sm transition-all duration-300 flex flex-col justify-between space-y-4 ${
                        isEarned 
                          ? 'border-slate-900 bg-white hover:shadow-xl hover:-translate-y-0.5' 
                          : 'border-slate-200 bg-slate-50/70 opacity-60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-slate-900 flex items-center justify-center text-2xl shrink-0">
                            {badge.icon}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-mono font-bold rounded-full uppercase border border-blue-200">
                              {cfg.label}
                            </span>
                            <span className="font-mono text-xs font-bold text-amber-600 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> +{badge.xp_reward} XP
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-display font-bold text-base text-slate-900 leading-snug">{badge.name}</h3>
                            {isEarned ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{badge.description}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                        {isEarned ? 'Earned & Verified ✓' : badge.condition}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

          </div>
        )}

        {/* ── TAB 2: NATIONAL LEADERBOARD ── */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            
            {/* Filter Toolbar */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-wrap gap-4 items-center justify-between">
              
              <div className="flex items-center gap-3 flex-wrap">
                {/* Scope selector */}
                <div className="flex border-2 border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                  {[
                    { val: 'global', label: 'Global Ranking', icon: Trophy },
                    { val: 'subject', label: 'By Subject', icon: BookOpen },
                    { val: 'college', label: 'By College', icon: GraduationCap },
                    { val: 'colleges', label: 'Institutions', icon: Medal }
                  ].map(s => {
                    const Icon = s.icon
                    const selected = scope === s.val
                    return (
                      <button
                        key={s.val}
                        onClick={() => setScope(s.val)}
                        className={`px-3 py-1.5 font-mono text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 ${
                          selected ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-950'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                    )
                  })}
                </div>

                {scope === 'subject' && (
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                )}

                {scope === 'college' && (
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="">-- Choose College --</option>
                    {colleges.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Time Period */}
              <div className="flex border-2 border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                {[
                  { val: 'all', label: 'All-Time' },
                  { val: 'weekly', label: 'This Week' },
                  { val: 'monthly', label: 'This Month' }
                ].map(p => {
                  const selected = period === p.val
                  return (
                    <button
                      key={p.val}
                      onClick={() => setPeriod(p.val)}
                      className={`px-3 py-1.5 font-mono text-xs font-bold uppercase rounded-lg transition-all ${
                        selected ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>

            </div>

            {/* Leaderboard Table Container */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-xl overflow-hidden">
              
              <div className="border-b-2 border-slate-100 p-4 sm:p-5 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Official National Standing ({period})
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 uppercase">Live Real-time</span>
              </div>

              {leaderboardLoading ? (
                <div className="p-16 text-center text-xs font-mono text-slate-400">Loading standings...</div>
              ) : leaderboard.length === 0 ? (
                <div className="p-16 text-center space-y-2">
                  <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-display font-bold text-base text-slate-900">No student rankings recorded under this filter</p>
                  <p className="text-xs text-slate-500">Complete lessons and practice quizzes to appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {leaderboard.map((entry, i) => {
                    const isMe = profile?.id === entry.id
                    const rankColors = ['bg-amber-400 text-slate-950', 'bg-slate-300 text-slate-950', 'bg-amber-700 text-white']
                    const badgeColor = i < 3 ? rankColors[i] : 'bg-slate-100 text-slate-700'

                    return (
                      <div 
                        key={entry.id}
                        className={`flex items-center gap-4 p-4 sm:p-5 transition-colors hover:bg-slate-50 ${
                          isMe ? 'bg-amber-50/70' : 'bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 ${badgeColor}`}>
                          #{i + 1}
                        </div>

                        <Avatar name={entry.full_name} avatarUrl={entry.avatar_url} size={9} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {entry.full_name ?? 'Student'}
                            </span>
                            {isMe && (
                              <span className="px-2 py-0.5 bg-amber-200 text-amber-950 font-mono text-[9px] font-bold rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          {entry.college_name && (
                            <div className="font-mono text-[10px] text-slate-400 truncate">{entry.college_name}</div>
                          )}
                        </div>

                        <div className="hidden sm:flex items-center gap-4 text-center shrink-0">
                          <div>
                            <div className="font-mono text-xs font-bold text-orange-600">{entry.current_streak}🔥</div>
                            <div className="font-mono text-[9px] text-slate-400 uppercase">Streak</div>
                          </div>
                          <div>
                            <div className="font-mono text-xs font-bold text-blue-600">{entry.total_lessons_completed}</div>
                            <div className="font-mono text-[9px] text-slate-400 uppercase">Lessons</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 text-right">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {entry.xp_points.toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

            </div>

            {/* XP Distribution Breakdown */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-display font-bold text-base uppercase text-slate-900">
                ⚡ XP Scoring Matrix
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { action: 'Complete a Lesson', xp: '+25 XP', icon: '📚' },
                  { action: 'Pass Subject Quiz', xp: '+30 XP', icon: '✅' },
                  { action: 'Perfect 100% Score', xp: '+50 XP', icon: '💯' },
                  { action: 'Daily Active Streak', xp: '+10 XP', icon: '🔥' },
                  { action: 'Virtual Lab Run', xp: '+15 XP', icon: '🧪' },
                  { action: 'Webinar Registration', xp: '+10 XP', icon: '📺' },
                  { action: '1-on-1 Mentor Match', xp: '+25 XP', icon: '⭐' },
                  { action: 'Post Research Pitch', xp: '+10 XP', icon: '📢' },
                ].map(item => (
                  <div key={item.action} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                    <div className="text-xl">{item.icon}</div>
                    <div className="font-mono text-[10px] font-bold text-slate-500 uppercase">{item.action}</div>
                    <div className="font-display font-bold text-sm text-blue-700">{item.xp}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── BOTTOM AI GAMIFICATION COACH CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Gamification Coach &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Want to accelerate your rank on the leaderboard? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Learning Coach.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Discover the fastest learning quests and high-yield quiz challenges to reach the National Top 10.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Give%20me%20a%20personalized%20weekly%20XP%20plan%20to%20complete%205%20Polymer%20Engineering%20lessons%20and%20earn%20the%20Rheologist%20badge"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Learning Coach &rarr;
            </Link>

            <Link
              href="/subjects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> 19 Subjects Curriculum
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
