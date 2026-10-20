import { SupabaseClient } from '@supabase/supabase-js'

export const XP_VALUES: Record<string, number> = {
  lesson_start:     5,
  lesson_complete:  25,
  quiz_pass:        30,
  quiz_perfect:     50,
  simulation_run:   15,
  video_watch:      5,
  video_complete:   15,
  streak_day:       10,
  forum_question:   5,
  forum_answer:     10,
  accepted_answer:  25,
  profile_complete: 25,
  gate_pass:        100,
  gate_top:         250,
  study_group_join: 10,
}

export interface AwardXPParams {
  userId: string
  action: string
  reference?: string | null
}

export interface AwardXPResult {
  success: boolean
  xp_earned: number
  total_xp: number
  new_badges: string[]
  streak: number
  error?: string
}

export async function awardUserXP(
  supabase: SupabaseClient,
  { userId, action, reference }: AwardXPParams
): Promise<AwardXPResult> {
  const xp = XP_VALUES[action] ?? 0
  if (xp === 0) {
    return {
      success: false,
      xp_earned: 0,
      total_xp: 0,
      new_badges: [],
      streak: 0,
      error: `Unknown or unconfigured XP action: "${action}"`
    }
  }

  // 1. Award XP log entry
  await supabase.from('xp_log').insert({
    user_id: userId,
    action,
    xp_earned: xp,
    reference: reference ?? null
  })

  // 2. Fetch current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp_points, current_streak, longest_streak, total_lessons_completed, total_quizzes_passed, last_active_date')
    .eq('id', userId)
    .single()

  if (!profile) {
    return {
      success: false,
      xp_earned: xp,
      total_xp: 0,
      new_badges: [],
      streak: 0,
      error: 'Profile not found'
    }
  }

  const updates: {
    xp_points: number
    total_lessons_completed?: number
    total_quizzes_passed?: number
    current_streak?: number
    last_active_date?: string
    longest_streak?: number
  } = { xp_points: (profile.xp_points ?? 0) + xp }

  if (action === 'lesson_complete') {
    updates.total_lessons_completed = (profile.total_lessons_completed ?? 0) + 1
  }
  if (action === 'quiz_pass' || action === 'quiz_perfect') {
    updates.total_quizzes_passed = (profile.total_quizzes_passed ?? 0) + 1
  }

  // 3. Streak calculation logic
  const today = new Date().toISOString().split('T')[0]
  const lastActive = profile.last_active_date
  let newStreak = profile.current_streak ?? 0

  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    newStreak = lastActive === yesterday ? newStreak + 1 : 1
    updates.current_streak = newStreak
    updates.last_active_date = today
    updates.longest_streak = Math.max(profile.longest_streak ?? 0, newStreak)
    updates.xp_points = updates.xp_points + XP_VALUES.streak_day

    await supabase.from('xp_log').insert({
      user_id: userId,
      action: 'streak_day',
      xp_earned: XP_VALUES.streak_day,
      reference: today
    })
  }

  await supabase.from('profiles').update(updates).eq('id', userId)

  // 4. Badges verification
  const newBadges: string[] = []
  const { data: allBadges } = await supabase.from('badges').select('*')
  const { data: earnedBadges } = await supabase.from('user_badges').select('badge_id').eq('user_id', userId)
  const earnedIds = new Set((earnedBadges ?? []).map((b: { badge_id: string }) => b.badge_id))

  const lessonsCompleted = updates.total_lessons_completed ?? profile.total_lessons_completed ?? 0
  const quizzesPassed = updates.total_quizzes_passed ?? profile.total_quizzes_passed ?? 0
  const currentStreak = updates.current_streak ?? newStreak

  const badgeConditions: Record<string, boolean> = {
    'first_lesson':        lessonsCompleted >= 1,
    'five_lessons':        lessonsCompleted >= 5,
    'ten_lessons':         lessonsCompleted >= 10,
    'twenty_five_lessons': lessonsCompleted >= 25,
    'fifty_lessons':       lessonsCompleted >= 50,
    'all_lessons':         lessonsCompleted >= 216, // Full syllabus alignment
    'first_quiz':          quizzesPassed >= 1,
    'ten_quizzes':         quizzesPassed >= 10,
    'perfect_score':       action === 'quiz_perfect',
    'streak_3':            currentStreak >= 3,
    'streak_7':            currentStreak >= 7,
    'streak_14':           currentStreak >= 14,
    'streak_30':           currentStreak >= 30,
    'gate_warrior':        action === 'gate_pass',
    'gate_topper':         action === 'gate_top',
    'first_question':      action === 'forum_question',
    'first_answer':        action === 'forum_answer',
    'accepted_answer':     action === 'accepted_answer',
    'profile_complete':    action === 'profile_complete',
  }

  for (const badge of (allBadges ?? [])) {
    if (earnedIds.has(badge.id)) continue
    if (!badgeConditions[badge.slug]) continue

    const { error } = await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge.id })
    if (!error) {
      newBadges.push(badge.name)
      await supabase.from('xp_log').insert({
        user_id: userId,
        action: 'badge_earned',
        xp_earned: badge.xp_reward,
        reference: badge.slug
      })
      await supabase.from('profiles').update({ xp_points: updates.xp_points + badge.xp_reward }).eq('id', userId)
      updates.xp_points += badge.xp_reward
    }
  }

  return {
    success: true,
    xp_earned: xp,
    total_xp: updates.xp_points,
    new_badges: newBadges,
    streak: currentStreak
  }
}
