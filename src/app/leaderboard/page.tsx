'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Flame, Star, Lock, BookOpen, GraduationCap } from 'lucide-react'

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
  learning:  { label: 'Learning',  color: '#1D4ED8', bg: '#EFF6FF' },
  quiz:      { label: 'Quizzes',   color: '#15803D', bg: '#F0FDF4' },
  streak:    { label: 'Streaks',   color: '#EA580C', bg: '#FFF7ED' },
  community: { label: 'Community', color: '#7C3AED', bg: '#F5F3FF' },
  special:   { label: 'Special',   color: '#CA8A04', bg: '#FEFCE8' },
}

function Avatar({ name, avatarUrl, size = 10 }: { name: string | null; avatarUrl: string | null; size?: number }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'
  
  const sizeMap: Record<number, string> = {
    8: 'w-8 h-8',
    9: 'w-9 h-9',
    10: 'w-10 h-10',
    12: 'w-12 h-12',
  }
  const sizeClass = sizeMap[size] ?? 'w-10 h-10'

  return avatarUrl ? (
    <img src={avatarUrl} alt={name ?? ''} className={`${sizeClass} border-2 border-ink object-cover flex-shrink-0`} />
  ) : (
    <div className={`${sizeClass} border-2 border-ink bg-violet flex items-center justify-center font-mono text-xs font-black text-white flex-shrink-0`}>
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

        const [
          { data: allBadges },
          { data: allSubjects },
          { data: allProfiles }
        ] = await Promise.all([
          supabase.from('badges').select('*').order('category').order('xp_reward'),
          supabase.from('subjects').select('id, name, slug').order('order_index'),
          supabase.from('profiles').select('college_name')
        ])

        if (allBadges) setBadges(allBadges)
        if (allSubjects) setSubjects(allSubjects)
        
        // Extract unique colleges list
        const uniqueColleges = Array.from(
          new Set((allProfiles || []).map(p => p.college_name).filter(Boolean))
        ) as string[]
        setColleges(uniqueColleges)

        if (session) {
          const [{ data: prof }, { data: earned }] = await Promise.all([
            supabase
              .from('profiles')
              .select('id, full_name, avatar_url, xp_points, current_streak, longest_streak, total_lessons_completed, total_quizzes_passed, college_name')
              .eq('id', session.user.id)
              .single(),
            supabase
              .from('user_badges')
              .select('badge_id, earned_at')
              .eq('user_id', session.user.id)
          ])
          
          if (prof) {
            setProfile(prof)
            // Pre-select college filter to user's college if filtering by college
            if (prof.college_name) {
              setSelectedCollege(prof.college_name)
            }
          }
          if (earned) setUserBadges(earned)
        }
      } catch (err) {
        console.error('Failed to load achievements init:', err)
      } finally {
        setLoading(false)
      }
    }
    loadInit()
  }, [supabase])

  // Load leaderboard when filters change
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLeaderboardLoading(true)
      try {
        let url = `/api/leaderboard?scope=${scope}&period=${period}`
        if (scope === 'subject' && selectedSubjectId) {
          url += `&subjectId=${selectedSubjectId}`
        }
        if (scope === 'college' && selectedCollege) {
          url += `&college=${encodeURIComponent(selectedCollege)}`
        }

        const res = await fetch(url)
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

    if (!loading) {
      fetchLeaderboard()
    }
  }, [scope, period, selectedSubjectId, selectedCollege, loading])

  const earnedIds = new Set(userBadges.map(b => b.badge_id))
  const earnedCount = userBadges.length
  const totalBadges = badges.length

  const filteredBadges = activeCategory === 'all' ? badges : badges.filter(b => b.category === activeCategory)
  const userRank = profile ? leaderboard.findIndex(e => e.id === profile.id) + 1 : null

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-2xl font-black text-ink animate-pulse bg-white">
          Loading achievements...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-yellow-bright" />

      {/* Hero Header */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
                <Trophy className="w-5 h-5 text-ink" />
              </div>
              <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Achievements</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
              BADGES. STREAKS.<br />
              <span className="text-yellow-bright italic">LEADERBOARD.</span>
            </h1>
            <p className="text-white/70 max-w-lg">{totalBadges} badges to earn. {earnedCount} earned so far. Keep learning to unlock them all.</p>
          </div>

          {/* Profile Card */}
          {profile && (
            <div className="border-4 border-yellow-bright p-5 flex-shrink-0 bg-yellow-bright/10">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} size={12} />
                <div>
                  <div className="font-display text-lg font-black text-white">{profile.full_name ?? 'Student'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3.5 h-3.5 text-yellow-bright" />
                    <span className="font-mono text-sm font-black text-yellow-bright">{profile.xp_points.toLocaleString()} XP</span>
                    {userRank && userRank > 0 && (
                      <span className="font-mono text-[9px] text-white/50 border border-white/20 px-2 py-0.5">Rank #{userRank}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { val: profile.current_streak, label: 'Day streak', icon: '🔥' },
                  { val: profile.total_lessons_completed, label: 'Lessons', icon: '📚' },
                  { val: earnedCount, label: 'Badges', icon: '🏅' },
                ].map(s => (
                  <div key={s.label} className="border-2 border-yellow-bright/30 px-2 py-2">
                    <div className="font-display text-xl font-black text-yellow-bright">{s.val}</div>
                    <div className="font-mono text-[8px] text-white/40 uppercase">{s.icon} {s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Primary Tab Switch */}
      <div className="border-b-4 border-ink flex">
        {(['badges', 'leaderboard'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="font-mono text-[10px] font-black uppercase tracking-widest px-6 py-3 border-r-4 border-ink transition-colors"
            style={{ backgroundColor: activeTab === tab ? '#0A0A0A' : 'white', color: activeTab === tab ? '#FACC15' : '#6B7280' }}>
            {tab === 'badges' ? `🏅 Badges (${earnedCount}/${totalBadges})` : '🏆 Leaderboards'}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setActiveCategory('all')}
                className="font-mono text-[10px] font-black border-4 border-ink px-4 py-2 uppercase tracking-wider transition-all"
                style={{ backgroundColor: activeCategory === 'all' ? '#0A0A0A' : 'white', color: activeCategory === 'all' ? 'white' : '#6B7280' }}>
                All ({badges.length})
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                const count = badges.filter(b => b.category === key).length
                const earnedInCat = badges.filter(b => b.category === key && earnedIds.has(b.id)).length
                return (
                  <button key={key} onClick={() => setActiveCategory(key)}
                    className="font-mono text-[10px] font-black border-4 border-ink px-4 py-2 uppercase tracking-wider transition-all"
                    style={{
                      backgroundColor: activeCategory === key ? cfg.color : 'white',
                      color: activeCategory === key ? 'white' : '#6B7280',
                      boxShadow: `2px 2px 0px 0px ${cfg.color}`,
                    }}>
                    {cfg.label} ({earnedInCat}/{count})
                  </button>
                )
              })}
            </div>

            {/* Streak Milestone visual tracking path */}
            {profile && (
              <div className="border-4 border-ink overflow-hidden bg-white" style={{ boxShadow: '4px 4px 0px 0px #EA580C' }}>
                <div className="border-b-4 border-ink px-5 py-3 bg-orange-600 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-white animate-bounce" />
                    <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Habit Engine Streak Tracker</span>
                  </div>
                  <span className="font-mono text-[9px] text-white/70">Milestones automatically award badges & bonus XP!</span>
                </div>
                <div className="p-5 flex items-center gap-6 flex-wrap" style={{ backgroundColor: '#FFF7ED' }}>
                  <div className="font-display text-6xl font-black text-orange-600">{profile.current_streak}</div>
                  <div>
                    <div className="font-bold text-ink mb-1 text-lg">days in a row 🔥</div>
                    <div className="font-mono text-[10px] text-slate-500">Longest streak: {profile.longest_streak} days</div>
                    <div className="font-mono text-[10px] text-slate-500 mt-0.5">Come back tomorrow to secure your daily active streak bonus!</div>
                  </div>
                  {/* Streak milestones progress tracking path */}
                  <div className="flex gap-3 ml-auto flex-wrap items-center">
                    {[3, 7, 14, 30, 60, 90].map(milestone => {
                      const completed = profile.current_streak >= milestone
                      return (
                        <div key={milestone} className="flex items-center gap-1">
                          <div className={`border-4 border-ink w-14 h-14 flex flex-col items-center justify-center shadow-sm relative ${completed ? 'bg-orange-500 text-white' : 'bg-white text-slate-400'}`}>
                            <div className="font-mono text-xs font-black">{milestone}</div>
                            <div className="text-[7px] uppercase font-bold">Days</div>
                            {completed && <span className="absolute -top-1.5 -right-1.5 text-xs">✓</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map(badge => {
                const isEarned = earnedIds.has(badge.id)
                const earnedDate = userBadges.find(ub => ub.badge_id === badge.id)?.earned_at
                const cfg = CATEGORY_CONFIG[badge.category] || { label: 'Badge', color: '#6B7280', bg: '#F3F4F6' }

                return (
                  <div key={badge.id}
                    className="border-4 border-ink bg-white overflow-hidden transition-all"
                    style={{
                      boxShadow: isEarned ? `4px 4px 0px 0px ${badge.color}` : '2px 2px 0px 0px #D1D5DB',
                      opacity: isEarned ? 1 : 0.6,
                    }}>
                    <div className="border-b-4 border-ink px-4 py-3 flex items-center justify-between"
                      style={{ backgroundColor: isEarned ? badge.color : '#F3F4F6' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{badge.icon}</span>
                        <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border"
                          style={isEarned
                            ? { borderColor: 'rgba(255,255,255,0.4)', color: 'white' }
                            : { borderColor: '#D1D5DB', color: '#6B7280' }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" style={{ color: isEarned ? 'white' : '#9CA3AF' }} />
                        <span className="font-mono text-[10px] font-black" style={{ color: isEarned ? 'white' : '#9CA3AF' }}>+{badge.xp_reward} XP</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-base font-black text-ink leading-tight">{badge.name}</h3>
                        {!isEarned && <Lock className="w-4 h-4 text-ink/30 flex-shrink-0 mt-0.5" />}
                        {isEarned && <span className="text-emerald-700 font-mono text-[9px] font-bold border border-emerald-600 bg-emerald-50 px-1.5 py-0.5 uppercase flex-shrink-0">Earned ✓</span>}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">{badge.description}</p>
                      <div className="font-mono text-[8px] text-slate-400 uppercase tracking-wider border-t border-ink/10 pt-2">
                        {isEarned && earnedDate
                          ? `Earned ${new Date(earnedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : badge.condition}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            {/* Filter controls */}
            <div className="bg-white border-4 border-ink p-4 flex flex-wrap gap-4 items-center justify-between shadow-hard">
              
              <div className="flex items-center gap-4 flex-wrap">
                {/* Scope selector */}
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[8px] text-slate-400 uppercase font-black">Rank Scope</span>
                  <div className="flex border-2 border-ink rounded-lg overflow-hidden">
                    {[
                      { val: 'global', label: 'Global', icon: Trophy },
                      { val: 'subject', label: 'By Subject', icon: BookOpen },
                      { val: 'college', label: 'By College', icon: GraduationCap },
                      { val: 'colleges', label: 'Institutions', icon: GraduationCap }
                    ].map(s => {
                      const Icon = s.icon
                      const selected = scope === s.val
                      return (
                        <button key={s.val} onClick={() => setScope(s.val)}
                          className="px-3 py-1.5 font-mono text-[9px] font-bold uppercase transition-all flex items-center gap-1"
                          style={{ backgroundColor: selected ? '#0A0A0A' : 'white', color: selected ? '#FACC15' : '#6B7280' }}>
                          <Icon className="w-3.5 h-3.5" />
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Scope specifics */}
                {scope === 'subject' && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] text-slate-400 uppercase font-black">Select Subject</span>
                    <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="border-2 border-ink p-1 bg-white font-mono text-[9px] font-bold h-8 rounded-lg max-w-[200px]">
                      <option value="">-- Choose Subject --</option>
                      {subjects.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {scope === 'college' && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] text-slate-400 uppercase font-black">Select College</span>
                    <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}
                      className="border-2 border-ink p-1 bg-white font-mono text-[9px] font-bold h-8 rounded-lg max-w-[200px]">
                      <option value="">-- Choose College --</option>
                      {colleges.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Time Period Selector */}
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] text-slate-400 uppercase font-black">Time Period</span>
                <div className="flex border-2 border-ink rounded-lg overflow-hidden">
                  {[
                    { val: 'all', label: 'All-Time' },
                    { val: 'weekly', label: 'Weekly' },
                    { val: 'monthly', label: 'Monthly' }
                  ].map(p => {
                    const selected = period === p.val
                    return (
                      <button key={p.val} onClick={() => setPeriod(p.val)}
                        className="px-3 py-1.5 font-mono text-[9px] font-bold uppercase transition-all"
                        style={{ backgroundColor: selected ? '#0A0A0A' : 'white', color: selected ? '#FACC15' : '#6B7280' }}>
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Leaderboard Table Container */}
            <div className="border-4 border-ink overflow-hidden shadow-hard bg-white relative min-h-[300px]">
              
              {leaderboardLoading && (
                <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
                  <div className="border-4 border-ink p-4 font-mono text-xs font-black animate-spin bg-yellow-bright">XP</div>
                </div>
              )}

              <div className="border-b-4 border-ink px-5 py-3 bg-ink flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-bright" />
                  <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest">
                    Rankings: {scope} ({period})
                  </span>
                </div>
                <span className="font-mono text-[8px] text-white/50 uppercase">Updated real-time</span>
              </div>

              {/* Top 3 podium styling if there are at least 3 entries */}
              {leaderboard.length >= 3 && scope === 'global' && period === 'all' && (
                <div className="border-b-4 border-ink grid grid-cols-3 gap-0">
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => {
                    if (!entry) return null
                    const rank = idx === 1 ? 1 : idx === 0 ? 2 : 3
                    const colors = ['#C0C0C0', '#CA8A04', '#CD7F32']
                    const color = colors[rank - 1]
                    const heights = ['h-28', 'h-36', 'h-24']
                    const height = heights[idx]
                    return (
                      <div key={entry.id}
                        className={`border-r-4 border-ink last:border-r-0 flex flex-col items-center justify-end pb-4 pt-4 ${height}`}
                        style={{ backgroundColor: color + '15' }}>
                        <Avatar name={entry.full_name} avatarUrl={entry.avatar_url} size={10} />
                        <div className="font-display text-2xl font-black mt-1" style={{ color }}>#{rank}</div>
                        <div className="font-bold text-xs text-ink text-center px-2 leading-tight truncate max-w-full">{entry.full_name ?? 'Student'}</div>
                        <div className="font-mono text-[9px] font-black" style={{ color }}>{entry.xp_points.toLocaleString()} XP</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Leaderboard rows */}
              <div className="divide-y-2 divide-ink/10">
                {leaderboard.map((entry, i) => {
                  const isMe = profile?.id === entry.id
                  const rankColors = ['#CA8A04', '#C0C0C0', '#CD7F32']
                  const rankColor = i < 3 ? rankColors[i] : '#9CA3AF'
                  // For 'colleges' scope the API returns extra fields
                  const collegeEntry = entry as typeof entry & { studentCount?: number; totalXP?: number }

                  if (scope === 'colleges') {
                    return (
                      <div key={entry.id}
                        className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                        <div className="w-8 h-8 border-4 border-ink flex items-center justify-center font-mono font-black text-sm flex-shrink-0"
                          style={{ backgroundColor: i < 3 ? rankColor : 'white', color: i < 3 ? 'white' : '#9CA3AF' }}>
                          {i + 1}
                        </div>
                        <div className="w-9 h-9 border-2 border-ink bg-violet flex items-center justify-center font-mono text-xs font-black text-white flex-shrink-0">
                          🏛️
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-ink truncate">{entry.full_name}</div>
                          <div className="font-mono text-[9px] text-slate-400">{collegeEntry.studentCount ?? 0} students enrolled</div>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-center flex-shrink-0">
                          <div>
                            <div className="font-mono text-xs font-black text-blue-600">{entry.total_lessons_completed}</div>
                            <div className="font-mono text-[8px] text-slate-400">avg lessons</div>
                          </div>
                          <div>
                            <div className="font-mono text-xs font-black text-violet-600">{(collegeEntry.totalXP ?? 0).toLocaleString()}</div>
                            <div className="font-mono text-[8px] text-slate-400">total XP</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3.5 h-3.5 text-yellow-600" />
                          <div className="text-right">
                            <div className="font-mono text-sm font-black text-ink">{entry.xp_points.toLocaleString()}</div>
                            <div className="font-mono text-[8px] text-slate-400">avg XP</div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={entry.id}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                      style={{ backgroundColor: isMe ? '#FEFCE8' : 'transparent' }}>
                      <div className="w-8 h-8 border-4 border-ink flex items-center justify-center font-mono font-black text-sm flex-shrink-0"
                        style={{ backgroundColor: i < 3 ? rankColor : 'white', color: i < 3 ? 'white' : '#9CA3AF' }}>
                        {i + 1}
                      </div>
                      <Avatar name={entry.full_name} avatarUrl={entry.avatar_url} size={9} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-ink truncate">{entry.full_name ?? 'Student'}</span>
                          {isMe && <span className="font-mono text-[8px] border border-yellow bg-yellow-light px-1.5 py-0.5 uppercase" style={{ borderColor: '#CA8A04', color: '#CA8A04', backgroundColor: '#FEFCE8' }}>You</span>}
                        </div>
                        {entry.college_name && <div className="font-mono text-[9px] text-slate-400">{entry.college_name}</div>}
                      </div>

                      {/* Performance Indicators */}
                      <div className="hidden sm:flex items-center gap-4 text-center flex-shrink-0">
                        <div>
                          <div className="font-mono text-xs font-black text-orange-600">{entry.current_streak}🔥</div>
                          <div className="font-mono text-[8px] text-slate-400">streak</div>
                        </div>
                        <div>
                          <div className="font-mono text-xs font-black text-blue-600">{entry.total_lessons_completed}</div>
                          <div className="font-mono text-[8px] text-slate-400">lessons</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 text-yellow-600" />
                        <span className="font-mono text-sm font-black text-ink">
                          {entry.xp_points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {leaderboard.length === 0 && !leaderboardLoading && (
                  <div className="p-12 text-center">
                    <p className="font-display text-xl font-black text-slate-300 mb-2">No rankings match these criteria</p>
                    <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Start learning to trigger logs!</p>
                  </div>
                )}
              </div>

            </div>

            {/* How XP is earned detail card */}
            <div className="border-4 border-ink overflow-hidden bg-white shadow-hard">
              <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright">
                <span className="font-mono text-[10px] font-black text-ink uppercase tracking-widest">XP Distribution Matrix</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x-2 divide-y-2 divide-ink/10">
                {[
                  { action: 'Complete a lesson', xp: 25, icon: '📚' },
                  { action: 'Pass a quiz', xp: 30, icon: '✅' },
                  { action: 'Perfect quiz score', xp: 50, icon: '💯' },
                  { action: 'Daily active streak', xp: 10, icon: '🔥' },
                  { action: 'Video watch time', xp: 5, icon: '📺' },
                  { action: 'Forum answer accepted', xp: 20, icon: '💬' },
                  { action: 'Join a study group', xp: 10, icon: '👥' },
                  { action: 'Streak bonus milestones', xp: '20–500', icon: '🏆' },
                ].map(item => (
                  <div key={item.action} className="p-4 text-center bg-white">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 leading-tight">{item.action}</div>
                    <div className="font-display text-base font-black text-yellow-600">+{item.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
