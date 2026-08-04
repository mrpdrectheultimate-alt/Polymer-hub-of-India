import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify HOD status
    const { data: profile } = await supabase
      .from('profiles')
      .select('college_name, is_hod')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_hod || !profile.college_name) {
      return NextResponse.json({ error: 'Unauthorized: HOD access required' }, { status: 403 })
    }

    // 1. Get all students from this college
    const { data: students } = await supabase
      .from('profiles')
      .select('id, full_name, email, subscription_status, xp_points, current_streak, total_lessons_completed, total_quizzes_passed')
      .eq('college_name', profile.college_name)
      .neq('id', user.id)

    const studentIds = (students || []).map(s => s.id)

    if (studentIds.length === 0) {
      return NextResponse.json({
        summary: { totalStudents: 0, totalXP: 0, avgXP: 0, avgLessons: 0, avgQuizScore: 0 },
        subjectStats: [],
        contentGaps: [],
        students: []
      })
    }

    // 2. Fetch progress and attempts for all students of this college (separate awaits for correct type inference)
    const { data: progress } = await supabase
      .from('user_progress')
      .select('user_id, lesson_id, quiz_score, quiz_passed, status')
      .in('user_id', studentIds)

    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, name, slug')
      .order('order_index')

    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, slug, subject_id, order_index')

    if (!subjects || !lessons) {
      return NextResponse.json({ error: 'Data unavailable' }, { status: 500 })
    }


    // Calculate aggregated metrics
    const totalStudents = studentIds.length
    const totalXP = (students || []).reduce((sum, s) => sum + (s.xp_points || 0), 0)
    const avgXP = Math.round(totalXP / totalStudents)
    
    const lessonsCompleted = (progress || []).filter(p => p.status === 'completed').length
    const avgLessons = Math.round(lessonsCompleted / totalStudents)

    const quizScores = (progress || []).filter(p => p.quiz_score !== null).map(p => p.quiz_score!)
    const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0

    // 3. Subject-wise analytics
    const subjectStats = subjects.map(sub => {
      const subLessons = lessons.filter(l => l.subject_id === sub.id)
      const subLessonIds = subLessons.map(l => l.id)
      const subProgress = (progress || []).filter(p => subLessonIds.includes(p.lesson_id))

      const completed = subProgress.filter(p => p.status === 'completed').length
      const scores = subProgress.filter(p => p.quiz_score !== null).map(p => p.quiz_score!)
      const subAvg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

      return {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        completed,
        avgScore: subAvg
      }
    })

    // 4. Content Gap Heatmaps (lessons where average quiz score is < 70%)
    // Group progress by lesson
    const lessonScores: Record<string, { total: number; count: number; title: string; subjectName: string }> = {};
    
    lessons.forEach(l => {
      const sub = subjects.find(s => s.id === l.subject_id);
      lessonScores[l.id] = { total: 0, count: 0, title: l.title, subjectName: sub?.name || 'Unknown' };
    });

    const progressList = progress || [];
    progressList.forEach(p => {
      if (p.quiz_score !== null && lessonScores[p.lesson_id]) {
        lessonScores[p.lesson_id].total += p.quiz_score;
        lessonScores[p.lesson_id].count++;
      }
    });

    const contentGaps = Object.entries(lessonScores)
      .map(([lessonId, item]) => {
        const avg = item.count > 0 ? Math.round(item.total / item.count) : null
        return {
          lessonId,
          title: item.title,
          subjectName: item.subjectName,
          avgScore: avg,
          attempts: item.count
        }
      })
      .filter(g => g.avgScore !== null && g.avgScore < 70 && g.attempts >= 1) // At least 1 attempt to be statistically present
      .sort((a, b) => (a.avgScore ?? 100) - (b.avgScore ?? 100))
      .slice(0, 10) // Top 10 worst performing topics/lessons

    return NextResponse.json({
      summary: { totalStudents, totalXP, avgXP, avgLessons, avgQuizScore },
      subjectStats,
      contentGaps,
      students: students || []
    })

  } catch (error) {
    console.error('HOD analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
