import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // 1. Auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { quizId, lessonId, answers, timeTakenSecs, submissionId } = body

    if (!quizId || !lessonId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 2. Fetch the quiz and its questions to grade securely on the server
    const [
      { data: quiz, error: quizError },
      { data: questions, error: qError }
    ] = await Promise.all([
      supabase.from('quizzes').select('*').eq('id', quizId).single(),
      supabase.from('quiz_questions').select('*').eq('quiz_id', quizId)
    ])

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }
    if (qError || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Questions not found' }, { status: 404 })
    }

    // 3. Grade the answers server-side
    let correctCount = 0
    const wrongQuestions: string[] = []

    questions.forEach((q) => {
      const selectedIndex = answers[q.id]
      if (selectedIndex === q.correct_index) {
        correctCount++
      } else {
        wrongQuestions.push(q.id)
      }
    })

    const totalQuestions = questions.length
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100)
    const passed = scorePercentage >= (quiz.passing_score ?? 70)

    // 4. Save the attempt with submissionId idempotency check
    const attemptPayload = {
      user_id: session.user.id,
      quiz_id: quizId,
      lesson_id: lessonId,
      score_percentage: scorePercentage,
      passed,
      answers_given: answers,
      wrong_questions: wrongQuestions,
      time_taken_secs: timeTakenSecs || null,
      ...(submissionId ? { submission_id: submissionId } : {})
    }

    const { error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert(attemptPayload)

    if (attemptError) {
      // If error is unique constraint on submission_id, return existing result idempotently
      if (attemptError.code === '23505' && submissionId) {
        return NextResponse.json({
          scorePercentage,
          passed,
          correctCount,
          totalQuestions,
          wrongQuestions,
          duplicateSubmission: true
        })
      }
      console.error('Quiz attempt save error:', attemptError)
      return NextResponse.json({ error: 'Failed to log attempt' }, { status: 500 })
    }

    // 5. Update user progress
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('lesson_id', lessonId)
      .single()

    const newAttemptsCount = (existingProgress?.quiz_attempts ?? 0) + 1
    const highestScore = Math.max(existingProgress?.quiz_score ?? 0, scorePercentage)
    const alreadyPassed = existingProgress?.quiz_passed === true
    const newPassed = alreadyPassed || passed

    const progressUpdate: {
      user_id: string
      lesson_id: string
      quiz_attempts: number
      quiz_score: number
      quiz_passed: boolean
      last_active_at: string
      status: string
      completed_at?: string
    } = {
      user_id: session.user.id,
      lesson_id: lessonId,
      quiz_attempts: newAttemptsCount,
      quiz_score: highestScore,
      quiz_passed: newPassed,
      last_active_at: new Date().toISOString(),
      status: newPassed ? 'completed' : (existingProgress?.status ?? 'reading')
    }

    if (newPassed && !existingProgress?.completed_at) {
      progressUpdate.completed_at = new Date().toISOString()
    }

    await supabase
      .from('user_progress')
      .upsert(progressUpdate, { onConflict: 'user_id,lesson_id' })

    return NextResponse.json({
      scorePercentage,
      passed,
      correctCount,
      totalQuestions,
      wrongQuestions
    })

  } catch (error: unknown) {
    console.error('Quiz submit error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
