'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Brain, ArrowLeft } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Question = {
  id: string
  question_text: string
  options: string[]
  correct_index: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  order_index: number
}

type Quiz = {
  id: string
  lesson_id: string
  title: string
  passing_score: number
}

type Lesson = {
  id: string
  title: string
  slug: string
  order_index: number
  subject_id: string
  subjects: { name: string; slug: string }
}

type NextLesson = {
  id: string
  title: string
  slug: string
  order_index: number
}

const DIFFICULTY_COLORS = {
  easy: { color: '#15803D', bg: '#F0FDF4' },
  medium: { color: '#CA8A04', bg: '#FEFCE8' },
  hard: { color: '#EA580C', bg: '#FFF7ED' },
}

// ─── Result Screen ─────────────────────────────────────────────────────────────

function ResultScreen({
  score, total, passed, passingScore, nextLesson, lessonSlug, onRetry
}: {
  score: number; total: number; passed: boolean
  passingScore: number; nextLesson: NextLesson | null
  lessonSlug: string; onRetry: () => void
}) {
  const pct = Math.round((score / total) * 100)
  const color = passed ? '#15803D' : '#EA580C'

  return (
    <div className="border-4 border-ink overflow-hidden animate-fade-up" style={{ boxShadow: `6px 6px 0px 0px ${color}` }}>
      {/* Header */}
      <div className="border-b-4 border-ink px-6 py-4" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-3">
          {passed ? <Trophy className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
          <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">
            {passed ? 'Quiz Passed — Completion Recorded!' : 'Quiz Not Passed — Try Again'}
          </span>
        </div>
      </div>

      <div className="p-8 bg-canvas text-center">
        {/* Score */}
        <div className="font-display text-7xl font-black mb-2" style={{ color }}>
          {pct}%
        </div>
        <div className="font-mono text-sm text-ink/50 mb-2">{score} correct out of {total} questions</div>
        <div className="font-mono text-[10px] text-ink/40 uppercase tracking-wider mb-6">
          Passing score: {passingScore}%
        </div>

        {/* Progress bar */}
        <div className="border-4 border-ink h-4 mb-8 overflow-hidden">
          <div className="h-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>

        {passed ? (
          <div className="space-y-3">
            <div className="border-4 border-green bg-green/10 p-4 text-left">
              <p className="font-bold text-green mb-1">🎉 Well done! You&apos;ve completed this topic.</p>
              <p className="text-sm text-ink/70">Your score has been logged to your progress dashboard.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.slug}`} className="cn-btn-yellow flex-1 justify-center text-sm">
                  Next Lesson: {nextLesson.title.slice(0, 40)}... <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="border-4 border-green bg-green text-white p-4 text-center flex-1">
                  <p className="font-display font-black text-lg">🏆 Subject Complete!</p>
                  <p className="font-mono text-xs text-white/70 mt-1">You&apos;ve finished all lessons in this subject</p>
                </div>
              )}
              <Link href="/dashboard" className="cn-btn-black flex-1 justify-center text-sm">
                Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border-4 border-orange bg-orange/10 p-4 text-left">
              <p className="font-bold text-orange mb-1">You scored {pct}%. Try aiming for {passingScore}%+!</p>
              <p className="text-sm text-ink/70">
                Review the lesson content and the explanations below, then try again.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onRetry} className="cn-btn-black flex-1 justify-center text-sm">
                <RotateCcw className="w-4 h-4" /> Retake Quiz
              </button>
              <Link href={`/lessons/${lessonSlug}`} className="cn-btn-yellow flex-1 justify-center text-sm">
                Review Lesson
              </Link>
              <Link href="/ai-tutor" className="border-4 border-ink px-4 py-2.5 flex-1 justify-center text-sm font-mono font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-colors flex items-center gap-2">
                <Brain className="w-4 h-4" /> Ask AI Tutor
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuizPage({ params }: { params?: { lessonSlug: string } }) {
  const routeParams = useParams()
  const lessonSlug = (routeParams?.lessonSlug as string) || params?.lessonSlug || ''
  const supabase = createClient()
  const router = useRouter()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // Get lesson
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id, title, slug, order_index, subject_id, subjects(name, slug)')
        .eq('slug', lessonSlug)
        .single()

      if (!lessonData) { setError('Lesson not found'); setLoading(false); return }
      setLesson(lessonData as unknown as Lesson)

      // Get quiz
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonData.id)
        .single()

      if (!quizData) { setError('Quiz not available yet for this lesson. Check back soon.'); setLoading(false); return }
      setQuiz(quizData)

      // Get questions
      const { data: questionsData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizData.id)
        .order('order_index')

      setQuestions((questionsData as Question[]) ?? [])

      // Get next lesson
      const { data: nextLessonData } = await supabase
        .from('lessons')
        .select('id, title, slug, order_index')
        .eq('subject_id', lessonData.subject_id)
        .eq('order_index', lessonData.order_index + 1)
        .single()

      setNextLesson((nextLessonData as NextLesson) ?? null)
      setLoading(false)
    }
    load()
  }, [lessonSlug, router, supabase])

  const handleSelect = (questionId: string, optionIdx: number) => {
    if (submitted) return
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }))
  }

  const handleSubmit = async () => {
    if (!quiz || !lesson) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Calculate score
    let correct = 0
    const wrongQuestions: string[] = []
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_index) {
        correct++
      } else {
        wrongQuestions.push(q.id)
      }
    })

    const scorePct = Math.round((correct / questions.length) * 100)
    const didPass = scorePct >= quiz.passing_score
    const timeTaken = Math.round((Date.now() - startTime) / 1000)

    setScore(correct)
    setPassed(didPass)
    setSubmitted(true)

    // Save attempt to DB
    await supabase.from('quiz_attempts').insert({
      user_id: session.user.id,
      quiz_id: quiz.id,
      lesson_id: lesson.id,
      score_percentage: scorePct,
      passed: didPass,
      answers_given: selectedAnswers,
      wrong_questions: wrongQuestions,
      time_taken_secs: timeTaken,
    })

    if (didPass) {
      try {
        await fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: correct === questions.length ? 'quiz_perfect' : 'quiz_pass',
            reference: lessonSlug,
            quizScore: scorePct
          })
        })
      } catch (err) {
        console.error('Failed to award quiz XP:', err)
      }
    }

    // Update user_progress
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id, quiz_attempts')
      .eq('user_id', session.user.id)
      .eq('lesson_id', lesson.id)
      .single()

    if (existing) {
      await supabase.from('user_progress').update({
        status: didPass ? 'completed' : 'reading',
        quiz_score: scorePct,
        quiz_attempts: (existing.quiz_attempts ?? 0) + 1,
        quiz_passed: didPass,
        completed_at: didPass ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('user_progress').insert({
        user_id: session.user.id,
        lesson_id: lesson.id,
        status: didPass ? 'completed' : 'reading',
        quiz_score: scorePct,
        quiz_attempts: 1,
        quiz_passed: didPass,
        completed_at: didPass ? new Date().toISOString() : null,
        started_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      })
    }
  }

  const handleRetry = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    setScore(0)
    setPassed(false)
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const allAnswered = answeredCount === questions.length

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-xl font-black text-ink animate-pulse">
          Loading quiz...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
        <div className="border-4 border-ink p-8 shadow-hard max-w-md w-full text-center">
          <p className="font-display text-xl font-black text-ink mb-3">{error}</p>
          <Link href={`/lessons/${lessonSlug}`} className="cn-btn-black text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Lesson
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-orange" />

      {/* Header */}
      <div className="border-b-4 border-ink bg-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/lessons/${lessonSlug}`} className="border-2 border-white/30 text-white p-1.5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="font-display text-base font-black text-white leading-tight">{lesson?.title}</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">
              {lesson?.subjects?.name} · Topic Quiz · Recommended target score: {quiz?.passing_score}%
            </div>
          </div>
        </div>
        {!submitted && (
          <div className="font-mono text-[10px] text-white/50 border-2 border-white/20 px-3 py-1.5">
            {answeredCount}/{questions.length} answered
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Quiz intro */}
        {!submitted && (
          <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #EA580C' }}>
            <div className="border-b-4 border-ink px-5 py-3 bg-orange flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">
                Topic Self-Assessment
              </span>
              <span className="font-mono text-[9px] text-white/70 border border-white/30 px-2 py-0.5 uppercase">
                {questions.length} Questions · Target: {quiz?.passing_score}%
              </span>
            </div>
            <div className="px-5 py-3 bg-orange/10">
              <p className="text-sm text-ink font-medium">
                Test your understanding of this topic with a quick 5-question practice quiz (Optional).
              </p>
            </div>
          </div>
        )}

        {/* Questions */}
        {!submitted && questions.map((q, idx) => {
          const diff = DIFFICULTY_COLORS[q.difficulty]
          const isAnswered = selectedAnswers[q.id] !== undefined

          return (
            <div
              key={q.id}
              className="border-4 border-ink overflow-hidden"
              style={{ boxShadow: isAnswered ? '4px 4px 0px 0px #15803D' : '4px 4px 0px 0px #0A0A0A' }}
            >
              {/* Question header */}
              <div className="border-b-4 border-ink px-5 py-3 bg-ink flex items-center justify-between">
                <span className="font-mono text-xs font-black text-yellow-bright">
                  Q{idx + 1} / {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[9px] font-black border-2 px-2 py-0.5 uppercase tracking-wider"
                    style={{ borderColor: diff.color, color: diff.color, backgroundColor: diff.bg }}
                  >
                    {q.difficulty}
                  </span>
                  {isAnswered && <CheckCircle className="w-4 h-4 text-green" />}
                </div>
              </div>

              {/* Question body */}
              <div className="p-5 bg-canvas">
                <p className="font-display text-lg font-black text-ink leading-snug mb-5">{q.question_text}</p>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className="w-full text-left border-4 border-ink p-3 flex items-center gap-3 transition-all"
                        style={{
                          backgroundColor: isSelected ? '#0A0A0A' : 'white',
                          color: isSelected ? 'white' : '#0A0A0A',
                          boxShadow: isSelected ? '3px 3px 0px 0px #1D4ED8' : '2px 2px 0px 0px #0A0A0A',
                          transform: isSelected ? 'translate(-1px, -1px)' : 'none',
                        }}
                      >
                        <span
                          className="font-mono text-xs font-black w-7 h-7 border-2 flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor: isSelected ? 'white' : '#0A0A0A',
                            backgroundColor: isSelected ? 'white' : 'transparent',
                            color: isSelected ? '#0A0A0A' : '#0A0A0A',
                          }}
                        >
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </span>
                        <span className="text-sm font-medium">{option}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {/* Submit button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="cn-btn-black w-full justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allAnswered
              ? `Submit Quiz (${answeredCount}/${questions.length} answered)`
              : `Answer all questions to submit (${answeredCount}/${questions.length} done)`}
          </button>
        )}

        {/* Results */}
        {submitted && (
          <>
            <ResultScreen
              score={score}
              total={questions.length}
              passed={passed}
              passingScore={quiz?.passing_score ?? 70}
              nextLesson={nextLesson}
              lessonSlug={lessonSlug}
              onRetry={handleRetry}
            />

            {/* Answer review */}
            <div className="space-y-3 mt-6">
              <div className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b-4 border-ink pb-3">
                Answer Review — Every Question Explained
              </div>
              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[q.id]
                const isCorrect = userAnswer === q.correct_index
                const borderColor = isCorrect ? '#15803D' : '#EA580C'

                return (
                  <div key={q.id} className="border-4 border-ink overflow-hidden" style={{ boxShadow: `3px 3px 0px 0px ${borderColor}` }}>
                    <div className="border-b-4 border-ink px-4 py-2 flex items-center gap-3" style={{ backgroundColor: borderColor }}>
                      {isCorrect
                        ? <CheckCircle className="w-4 h-4 text-white" />
                        : <XCircle className="w-4 h-4 text-white" />}
                      <span className="font-mono text-[9px] font-black text-white uppercase tracking-wider">
                        Q{idx + 1} — {isCorrect ? 'Correct' : `Incorrect — Correct: ${['A', 'B', 'C', 'D'][q.correct_index]}`}
                      </span>
                    </div>
                    <div className="p-4 bg-canvas">
                      <p className="font-bold text-sm text-ink mb-3">{q.question_text}</p>

                      {/* Show options with correct/wrong highlighting */}
                      <div className="space-y-1.5 mb-3">
                        {q.options.map((opt, optIdx) => {
                          const isCorrectOpt = optIdx === q.correct_index
                          const isUserChoice = optIdx === userAnswer
                          const isWrongChoice = isUserChoice && !isCorrectOpt

                          return (
                            <div
                              key={optIdx}
                              className="flex items-center gap-2 px-3 py-2 border-2"
                              style={{
                                borderColor: isCorrectOpt ? '#15803D' : isWrongChoice ? '#EA580C' : '#D1D5DB',
                                backgroundColor: isCorrectOpt ? '#F0FDF4' : isWrongChoice ? '#FFF7ED' : 'white',
                              }}
                            >
                              <span className="font-mono text-[10px] font-black w-5 flex-shrink-0" style={{ color: isCorrectOpt ? '#15803D' : isWrongChoice ? '#EA580C' : '#9CA3AF' }}>
                                {['A', 'B', 'C', 'D'][optIdx]}
                              </span>
                              <span className="text-xs text-ink flex-1">{opt}</span>
                              {isCorrectOpt && <CheckCircle className="w-3.5 h-3.5 text-green flex-shrink-0" />}
                              {isWrongChoice && <XCircle className="w-3.5 h-3.5 text-orange flex-shrink-0" />}
                            </div>
                          )
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="border-l-4 pl-3 py-1" style={{ borderColor, backgroundColor: isCorrect ? '#F0FDF4' : '#FFF7ED' }}>
                        <p className="font-mono text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: borderColor }}>Explanation</p>
                        <p className="text-sm text-ink leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
