// src/app/api/leaderboard/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get('scope') || 'global' // global, subject, college
    const period = searchParams.get('period') || 'all' // weekly, monthly, all
    const subjectId = searchParams.get('subjectId')
    const college = searchParams.get('college')

    // 1. Get base profiles (only those with some XP or active)
    if (scope === 'colleges') {
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('college_name, xp_points, total_lessons_completed')
        .not('college_name', 'is', null)

      if (profError) throw profError

      const collegeMap: Record<string, { collegeName: string; totalXP: number; studentCount: number; lessonsCompleted: number }> = {}

      for (const p of (profiles || [])) {
        const name = p.college_name?.trim()
        if (!name) continue

        if (!collegeMap[name]) {
          collegeMap[name] = { collegeName: name, totalXP: 0, studentCount: 0, lessonsCompleted: 0 }
        }
        collegeMap[name].totalXP += p.xp_points || 0
        collegeMap[name].studentCount++
        collegeMap[name].lessonsCompleted += p.total_lessons_completed || 0
      }

      const collegesList = Object.values(collegeMap).map(c => ({
        id: c.collegeName,
        full_name: c.collegeName,
        avatar_url: null,
        college_name: c.collegeName,
        xp_points: Math.round(c.totalXP / c.studentCount),
        total_lessons_completed: Math.round(c.lessonsCompleted / c.studentCount),
        studentCount: c.studentCount,
        totalXP: c.totalXP
      }))

      collegesList.sort((a, b) => b.xp_points - a.xp_points)

      return NextResponse.json({ data: collegesList })
    }

    let profileQuery = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, college_name, xp_points, current_streak, total_lessons_completed, total_quizzes_passed')
      .order('xp_points', { ascending: false })

    if (scope === 'college' && college) {
      profileQuery = profileQuery.eq('college_name', college)
    }

    const { data: profiles, error: profError } = await profileQuery
    if (profError) throw profError

    let filteredProfiles = profiles || []

    // 2. Filter by subject completion if scope is subject
    if (scope === 'subject' && subjectId) {
      // Get lessons in this subject
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('subject_id', subjectId)
      
      const lessonIds = (lessons || []).map(l => l.id)
      
      if (lessonIds.length > 0) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('user_id')
          .in('lesson_id', lessonIds)
          .eq('status', 'completed')
        
        const userIds = new Set((progress || []).map(p => p.user_id))
        filteredProfiles = filteredProfiles.filter(p => userIds.has(p.id))
      } else {
        filteredProfiles = []
      }
    }

    // 3. Aggregate XP if period is weekly or monthly
    if (period === 'weekly' || period === 'monthly') {
      const days = period === 'weekly' ? 7 : 30
      const dateLimit = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

      const { data: logs, error: logError } = await supabase
        .from('xp_log')
        .select('user_id, xp_earned')
        .gte('created_at', dateLimit)

      if (logError) throw logError

      const xpMap: Record<string, number> = {}
      for (const log of (logs || [])) {
        xpMap[log.user_id] = (xpMap[log.user_id] || 0) + log.xp_earned
      }

      // Map profiles with their periodic XP
      filteredProfiles = filteredProfiles.map(p => ({
        ...p,
        // Override xp_points with the periodic XP sum
        xp_points: xpMap[p.id] || 0
      }))

      // Re-sort profiles based on the new periodic XP sum
      filteredProfiles.sort((a, b) => b.xp_points - a.xp_points)
    }

    return NextResponse.json({ data: filteredProfiles })

  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    const errMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}
