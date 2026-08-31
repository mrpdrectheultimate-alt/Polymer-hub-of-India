// src/app/api/recommendations/route.ts
// Analyzes student performance and returns personalized next steps
// Called from dashboard to show "Recommended for You"

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const userId = session.user.id

    // ── Fetch all data in parallel ────────────────────────────────────────────
    const [
      { data: subjects },
      { data: lessons },
      { data: progress },
      { data: quizAttempts },
      { data: profile },
    ] = await Promise.all([
      supabase.from('subjects').select('id, name, slug, order_index').order('order_index'),
      supabase.from('lessons').select('id, title, slug, subject_id, order_index, is_premium').order('order_index'),
      supabase.from('user_progress').select('*').eq('user_id', userId),
      supabase.from('quiz_attempts').select('lesson_id, score_percentage, passed, attempted_at').eq('user_id', userId).order('attempted_at', { ascending: false }),
      supabase.from('profiles').select('subscription_status, target_path, xp_points, current_streak').eq('id', userId).single(),
    ])

    if (!subjects || !lessons) return NextResponse.json({ recommendations: [] })

    const isPremium = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active'
    const completedIds = new Set((progress ?? []).filter(p => p.quiz_passed).map(p => p.lesson_id))

    // ── Subject performance analysis ──────────────────────────────────────────
    const subjectPerformance = subjects.map(subject => {
      const subLessons = lessons.filter(l => l.subject_id === subject.id)
      const subProgress = (progress ?? []).filter(p => subLessons.some(l => l.id === p.lesson_id))
      const completed = subProgress.filter(p => p.quiz_passed).length
      const scores = subProgress.filter(p => p.quiz_score !== null).map(p => p.quiz_score!)
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
      const pct = subLessons.length > 0 ? (completed / subLessons.length) * 100 : 0

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectSlug: subject.slug,
        totalLessons: subLessons.length,
        completed,
        avgScore,
        pct,
        isStarted: completed > 0 || subProgress.length > 0,
        isComplete: pct === 100,
      }
    })

    // ── Find weak subjects (started but avg score < 70%) ──────────────────────
    const weakSubjects = subjectPerformance
      .filter(s => s.isStarted && !s.isComplete && s.avgScore !== null && s.avgScore < 70)
      .sort((a, b) => (a.avgScore ?? 100) - (b.avgScore ?? 100))

    // ── Find next unfinished lesson in each subject ───────────────────────────
    const findNextLesson = (subjectId: string) => {
      const subLessons = lessons
        .filter(l => l.subject_id === subjectId)
        .sort((a, b) => a.order_index - b.order_index)
      return subLessons.find(l => !completedIds.has(l.id) && (isPremium || !l.is_premium))
    }

    // ── Build recommendations ─────────────────────────────────────────────────
    const recommendations: {
      type: string
      priority: number
      title: string
      description: string
      lessonSlug?: string
      lessonTitle?: string
      subjectSlug?: string
      subjectName?: string
      score?: number
    }[] = []

    // 1. HIGHEST PRIORITY: Weak subject — retry or continue
    if (weakSubjects.length > 0) {
      const weakest = weakSubjects[0]
      const nextLesson = findNextLesson(weakest.subjectId)
      if (nextLesson) {
        recommendations.push({
          type: 'weak_subject',
          priority: 1,
          title: `Strengthen ${weakest.subjectName}`,
          description: `Your average quiz score in ${weakest.subjectName} is ${Math.round(weakest.avgScore!)}%. Practice more to improve before moving on.`,
          lessonSlug: nextLesson.slug,
          lessonTitle: nextLesson.title,
          subjectSlug: weakest.subjectSlug,
          subjectName: weakest.subjectName,
          score: Math.round(weakest.avgScore!),
        })
      }
    }

    // 2. Continue an in-progress subject
    const inProgress = subjectPerformance
      .filter(s => s.isStarted && !s.isComplete && (weakSubjects.length === 0 || s.subjectId !== weakSubjects[0]?.subjectId))
      .sort((a, b) => b.pct - a.pct)

    if (inProgress.length > 0) {
      const cont = inProgress[0]
      const nextLesson = findNextLesson(cont.subjectId)
      if (nextLesson) {
        recommendations.push({
          type: 'continue',
          priority: 2,
          title: `Continue ${cont.subjectName}`,
          description: `You're ${Math.round(cont.pct)}% through ${cont.subjectName}. Keep going — you're making great progress!`,
          lessonSlug: nextLesson.slug,
          lessonTitle: nextLesson.title,
          subjectSlug: cont.subjectSlug,
          subjectName: cont.subjectName,
        })
      }
    }

    // 3. Start a new subject (alphabetical by order)
    const notStarted = subjectPerformance.filter(s => !s.isStarted && !s.isComplete)
    if (notStarted.length > 0) {
      const next = notStarted[0]
      const firstLesson = lessons
        .filter(l => l.subject_id === next.subjectId)
        .sort((a, b) => a.order_index - b.order_index)[0]
      if (firstLesson) {
        recommendations.push({
          type: 'new_subject',
          priority: 3,
          title: `Start ${next.subjectName}`,
          description: `You haven't explored ${next.subjectName} yet. Start Lesson 1 to expand your polymer engineering knowledge.`,
          lessonSlug: firstLesson.slug,
          lessonTitle: firstLesson.title,
          subjectSlug: next.subjectSlug,
          subjectName: next.subjectName,
        })
      }
    }

    // 4. Practice recommendation if quiz scores are mixed
    const recentAttempts = (quizAttempts ?? []).slice(0, 10)
    const recentAvg = recentAttempts.length > 0
      ? recentAttempts.reduce((a, b) => a + b.score_percentage, 0) / recentAttempts.length
      : null

    if (recentAvg !== null && recentAvg < 75) {
      recommendations.push({
        type: 'practice',
        priority: 4,
        title: 'Practice MCQs to Boost Your Score',
        description: `Your recent quiz average is ${Math.round(recentAvg)}%. Practice questions will help identify and fix gaps.`,
        lessonSlug: undefined,
        subjectSlug: 'practice',
      })
    }

    // 5. GATE recommendation for GATE-targeted students
    if (profile?.target_path === 'gate' && completedIds.size >= 10) {
      recommendations.push({
        type: 'gate',
        priority: 5,
        title: 'Take the GATE Mock Test',
        description: `You've completed ${completedIds.size} lessons. Time to test yourself under exam conditions with the full GATE mock test.`,
        subjectSlug: 'gate-mock',
      })
    }

    // 6. Streak recovery
    if ((profile?.current_streak ?? 0) === 0 && (profile?.xp_points ?? 0) > 0) {
      recommendations.push({
        type: 'streak',
        priority: 6,
        title: 'Restart Your Learning Streak',
        description: `You've earned ${profile?.xp_points} XP before. Come back daily to build your streak and climb the leaderboard.`,
        subjectSlug: 'subjects',
      })
    }

    // ── Summary stats for dashboard ───────────────────────────────────────────
    const overallAvg = (() => {
      const scores = (progress ?? []).filter(p => p.quiz_score !== null).map(p => p.quiz_score!)
      return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
    })()

    const strongSubjects = subjectPerformance
      .filter(s => s.isStarted && s.avgScore !== null && s.avgScore >= 80)
      .sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0))
      .slice(0, 2)

    return NextResponse.json({
      recommendations: recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4),
      stats: {
        totalCompleted: completedIds.size,
        totalLessons: lessons.length,
        overallAvg,
        weakSubjects: weakSubjects.slice(0, 2).map(s => ({ name: s.subjectName, slug: s.subjectSlug, score: Math.round(s.avgScore ?? 0) })),
        strongSubjects: strongSubjects.map(s => ({ name: s.subjectName, slug: s.subjectSlug, score: Math.round(s.avgScore ?? 0) })),
        subjectProgress: subjectPerformance.map(s => ({ name: s.subjectName, slug: s.subjectSlug, pct: Math.round(s.pct), avgScore: s.avgScore !== null ? Math.round(s.avgScore) : null })),
      }
    })

  } catch (error: unknown) {
    console.error('Recommendations error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
