'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Award,
  HelpCircle,
  RefreshCw,
  BookOpen,
  Target,
  Lightbulb
} from 'lucide-react'

type Subject = {
  id: string
  name: string
  slug: string
  description: string | null
}

type Question = {
  id: string
  subject_id: string
  question: string
  type: 'mcq' | 'short' | 'numerical'
  options: string[] | null
  correct_answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string | null
  is_gate_relevant: boolean
}

type UserAnswerState = {
  selected: string
  isSubmitted: boolean
  isCorrect: boolean
}

const DIFFICULTY_BADGES = {
  easy: 'border-emerald-200 text-emerald-700 bg-emerald-50',
  medium: 'border-blue-200 text-blue-700 bg-blue-50',
  hard: 'border-rose-200 text-rose-700 bg-rose-50',
}

export default function SubjectPracticePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, UserAnswerState>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [submittingAnswerId, setSubmittingAnswerId] = useState<string | null>(null)
  const [quizFinished, setQuizFinished] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      const { data: currentSubject } = await supabase
        .from('subjects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!currentSubject) {
        router.push('/subjects')
        return
      }
      setSubject(currentSubject)

      const { data: questionList } = await supabase
        .from('practice_questions')
        .select('*')
        .eq('subject_id', currentSubject.id)
        .order('order_index')

      const parsedQuestions: Question[] = (questionList ?? []).map((q) => {
        let opts = q.options
        if (typeof opts === 'string') {
          try {
            opts = JSON.parse(opts)
          } catch {
            opts = []
          }
        }
        return {
          ...q,
          options: opts,
        }
      })

      setQuestions(parsedQuestions)

      if (currentUser && parsedQuestions.length > 0) {
        const { data: existingAnswers } = await supabase
          .from('user_answers')
          .select('question_id, selected_answer, is_correct')
          .eq('user_id', currentUser.id)
          .in('question_id', parsedQuestions.map((q) => q.id))

        if (existingAnswers) {
          const answerMap: Record<string, UserAnswerState> = {}
          existingAnswers.forEach((ans) => {
            answerMap[ans.question_id] = {
              selected: ans.selected_answer,
              isSubmitted: true,
              isCorrect: ans.is_correct,
            }
          })
          setAnswers(answerMap)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [slug, router, supabase])

  const handleSelectOption = (questionId: string, optionChar: string) => {
    if (answers[questionId]?.isSubmitted) return
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selected: optionChar,
        isSubmitted: false,
        isCorrect: false,
      },
    }))
  }

  const handleSubmitAnswer = async (question: Question) => {
    const answerState = answers[question.id]
    if (!answerState || !answerState.selected || answerState.isSubmitted) return

    setSubmittingAnswerId(question.id)
    const isCorrect = answerState.selected === question.correct_answer

    const updatedState = {
      ...answerState,
      isSubmitted: true,
      isCorrect,
    }

    setAnswers((prev) => ({
      ...prev,
      [question.id]: updatedState,
    }))

    if (user) {
      await supabase.from('user_answers').upsert(
        {
          user_id: user.id,
          question_id: question.id,
          selected_answer: answerState.selected,
          is_correct: isCorrect,
          answered_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,question_id' }
      )
    }

    setSubmittingAnswerId(null)
  }

  const restartQuiz = async () => {
    if (user && questions.length > 0) {
      setLoading(true)
      await supabase
        .from('user_answers')
        .delete()
        .eq('user_id', user.id)
        .in('question_id', questions.map((q) => q.id))
      setLoading(false)
    }
    setAnswers({})
    setCurrentIdx(0)
    setQuizFinished(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#2563EB] rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Practice Suite…
        </p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-12 px-6">
        <div className="max-w-xl mx-auto border border-slate-200/90 rounded-3xl p-8 text-center bg-white shadow-xs">
          <HelpCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h2 className="font-display font-bold text-xl text-slate-900 mb-2">
            No Questions Available Yet
          </h2>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-6">
            Subject: {subject?.name}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mb-6 font-sans">
            Practice questions for this domain are currently being peer-reviewed by CIPET and GATE faculties.
          </p>
          <Link
            href={`/subjects/${slug}`}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Subject Curriculum
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const currentAnswer = answers[currentQuestion.id]
  const isLast = currentIdx === questions.length - 1
  const correctCount = Object.values(answers).filter((a) => a.isSubmitted && a.isCorrect).length
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100)

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* ── Header ── */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 sm:px-8 py-8 sm:py-10 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Link
                href={`/subjects/${slug}`}
                className="text-xs font-mono text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{subject?.name}</span>
              </Link>
              <span className="text-slate-500 font-mono">/</span>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                GATE &amp; Exam Practice
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {subject?.name} Practice Suite
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs font-mono text-xs text-white">
              <span className="text-slate-400 uppercase text-[10px] block">Verified Score</span>
              <span className="text-base font-bold text-emerald-400">{correctCount}</span>
              <span className="text-slate-400"> / {questions.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Quiz Container ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!quizFinished ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2563EB] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-mono text-[10px] font-bold border px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${DIFFICULTY_BADGES[currentQuestion.difficulty]}`}>
                  {currentQuestion.difficulty}
                </span>
                {currentQuestion.is_gate_relevant && (
                  <span className="font-mono text-[10px] font-bold border border-amber-200 text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3 h-3 text-amber-600" /> GATE XE-F Relevant
                  </span>
                )}
                {currentQuestion.topic && (
                  <span className="font-mono text-[10px] font-bold border border-slate-200 text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-lg">
                    Topic: {currentQuestion.topic}
                  </span>
                )}
              </div>

              {/* Question Statement */}
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const optionChar = option.trim().charAt(0)
                  const isSelected = currentAnswer?.selected === optionChar
                  const isSubmitted = currentAnswer?.isSubmitted
                  const isCorrectAnswer = currentQuestion.correct_answer === optionChar

                  let optionStyle = 'border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50/40'
                  if (isSelected) {
                    optionStyle = 'border-2 border-[#2563EB] bg-blue-50/80 text-blue-900 shadow-xs'
                  }
                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                    } else if (isSelected) {
                      optionStyle = 'border-2 border-rose-500 bg-rose-50 text-rose-950 font-bold'
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(currentQuestion.id, optionChar)}
                      className={`w-full text-left border rounded-2xl p-4 text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${optionStyle}`}
                    >
                      <span className="font-sans leading-relaxed">{option}</span>
                      {isSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Action Buttons & Instant Verification */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  {!currentAnswer?.isSubmitted ? (
                    <button
                      disabled={!currentAnswer?.selected || submittingAnswerId !== null}
                      onClick={() => handleSubmitAnswer(currentQuestion)}
                      className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Verify Answer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : !isLast ? (
                    <button
                      onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
                      className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setQuizFinished(true)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Complete Assessment</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Technical Reasoning Card */}
              {currentAnswer?.isSubmitted && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 animate-in fade-in-50 duration-200">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E40AF]">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>ENGINEERING REASONING &amp; GOVERNING MECHANISM</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Assessment Summary Screen ── */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase text-[#2563EB] tracking-wider">
                Practice Session Completed
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                {subject?.name} Knowledge Check
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-2">
              <span className="text-xs font-mono text-slate-500 uppercase block">Total Accuracy</span>
              <div className="font-display text-4xl font-extrabold text-[#2563EB]">
                {Math.round((correctCount / questions.length) * 100)}%
              </div>
              <p className="text-xs font-mono text-slate-600">
                {correctCount} correct out of {questions.length} questions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={restartQuiz}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Practice</span>
              </button>

              <Link
                href={`/subjects/${slug}`}
                className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Curriculum Lessons</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
