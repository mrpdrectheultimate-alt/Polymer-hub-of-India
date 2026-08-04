'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { CheckCircle, XCircle, ArrowRight, Brain, BookOpen, RotateCcw, Trophy, Zap } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Question = {
  id: string
  question: string
  type: 'mcq' | 'short' | 'numerical'
  options: string[] | null
  correct_answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string | null
  is_gate_relevant: boolean
  subject_id: string
}

type Subject = {
  id: string
  name: string
  slug: string
}

type AnswerState = {
  selected: string | null
  revealed: boolean
  correct: boolean | null
}

const DIFFICULTY_CONFIG = {
  easy:   { color: '#15803D', bg: '#F0FDF4', label: 'Easy' },
  medium: { color: '#CA8A04', bg: '#FEFCE8', label: 'Medium' },
  hard:   { color: '#EA580C', bg: '#FFF7ED', label: 'Hard' },
}

const SUBJECT_COLORS: Record<string, { color: string; bg: string }> = {
  'polymer-chemistry':        { color: '#1D4ED8', bg: '#EFF6FF' },
  'polymer-processing':       { color: '#EA580C', bg: '#FFF7ED' },
  'mould-design':             { color: '#EA580C', bg: '#FFF7ED' },
  'polymer-testing':          { color: '#7C3AED', bg: '#F5F3FF' },
  'rubber-technology':        { color: '#EA580C', bg: '#FFF7ED' },
  'recycling-technology':     { color: '#15803D', bg: '#F0FDF4' },
  'sustainable-plastics':     { color: '#15803D', bg: '#F0FDF4' },
  'polymer-composites':       { color: '#1D4ED8', bg: '#EFF6FF' },
  'entrepreneurship-plastics':{ color: '#CA8A04', bg: '#FEFCE8' },
  'medical-plastics':         { color: '#7C3AED', bg: '#F5F3FF' },
  'polymer-rheology':         { color: '#EA580C', bg: '#FFF7ED' },
  'additives-compounding':    { color: '#1D4ED8', bg: '#EFF6FF' },
  'plastic-packaging-engineering': { color: '#15803D', bg: '#F0FDF4' },
  'life-cycle-assessment':    { color: '#15803D', bg: '#F0FDF4' },
  'color-science-masterbatches': { color: '#CA8A04', bg: '#FEFCE8' },
}

// ─── Score Card ───────────────────────────────────────────────────────────────

function ScoreCard({ score, total, onRetry, onNext }: {
  score: number; total: number; onRetry: () => void; onNext: () => void
}) {
  const pct = Math.round((score / total) * 100)
  const color = pct >= 80 ? '#15803D' : pct >= 50 ? '#CA8A04' : '#EA580C'
  const grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Keep Practising' : 'Review the Lessons'

  return (
    <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: `6px 6px 0px 0px ${color}` }}>
      <div className="border-b-4 border-ink px-6 py-4" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-white" />
          <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Quiz Complete</span>
        </div>
      </div>
      <div className="p-8 text-center bg-canvas">
        <div className="font-display text-7xl font-black mb-2" style={{ color }}>
          {pct}%
        </div>
        <div className="font-display text-2xl font-black text-ink mb-1">{grade}</div>
        <div className="font-mono text-sm text-ink/50 mb-6">{score} correct out of {total} questions</div>

        {/* Score bar */}
        <div className="border-4 border-ink h-4 mb-8 overflow-hidden">
          <div className="h-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>

        {pct < 80 && (
          <div className="border-4 border-ink p-4 mb-6 text-left" style={{ backgroundColor: color + '15' }}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color }}>Recommendation</p>
            <p className="text-sm text-ink">
              {pct < 40
                ? 'Review the lesson content before attempting again. The AI Tutor can explain any concept you found difficult.'
                : 'You\'re getting there. Focus on the questions you got wrong — the explanations show exactly where the concept is applied.'}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={onRetry} className="cn-btn-black text-sm">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button onClick={onNext} className="cn-btn text-sm bg-white border-ink text-ink">
            Change Filters
          </button>
          <Link href="/ai-tutor" className="cn-btn-yellow text-sm">
            <Brain className="w-4 h-4" /> Ask AI Tutor
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question, index, total, answerState, onAnswer, onReveal
}: {
  question: Question
  index: number
  total: number
  answerState: AnswerState
  onAnswer: (answer: string) => void
  onReveal: () => void
}) {
  const diff = DIFFICULTY_CONFIG[question.difficulty]

  return (
    <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
      {/* Card header */}
      <div className="border-b-4 border-ink px-5 py-3 flex items-center justify-between bg-ink">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-black text-yellow-bright">Q{index + 1}/{total}</span>
          <span className="font-mono text-[9px] font-black border border-yellow-bright text-yellow-bright px-2 py-0.5 uppercase tracking-wider">
            {question.type.toUpperCase()}
          </span>
          {question.is_gate_relevant && (
            <span className="font-mono text-[9px] font-black border border-violet-600 text-violet-400 px-2 py-0.5 uppercase tracking-wider">
              GATE
            </span>
          )}
        </div>
        <span
          className="font-mono text-[9px] font-black border-2 px-2 py-0.5 uppercase tracking-wider"
          style={{ borderColor: diff.color, color: diff.color, backgroundColor: diff.bg }}
        >
          {diff.label}
        </span>
      </div>

      {/* Question */}
      <div className="p-6 bg-canvas">
        {question.topic && (
          <div className="font-mono text-[9px] text-ink/40 uppercase tracking-widest mb-2">{question.topic}</div>
        )}
        <p className="font-display text-lg font-black text-ink leading-snug mb-5">{question.question}</p>

        {/* MCQ Options */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, i) => {
              const letter = ['A', 'B', 'C', 'D'][i]
              const isSelected = answerState.selected === letter
              const isCorrect = answerState.revealed && letter === question.correct_answer
              const isWrong = answerState.revealed && isSelected && letter !== question.correct_answer

              let borderColor = '#0A0A0A'
              let bgColor = '#FFFFFF'

              if (isCorrect) { borderColor = '#15803D'; bgColor = '#F0FDF4' }
              else if (isWrong) { borderColor = '#EA580C'; bgColor = '#FFF7ED' }
              else if (isSelected && !answerState.revealed) { borderColor = '#1D4ED8'; bgColor = '#EFF6FF' }

              return (
                <button
                  key={letter}
                  onClick={() => !answerState.revealed && onAnswer(letter)}
                  disabled={answerState.revealed}
                  className="w-full text-left border-4 p-3 flex items-start gap-3 transition-all disabled:cursor-default"
                  style={{
                    borderColor,
                    backgroundColor: bgColor,
                    boxShadow: isSelected || isCorrect ? `3px 3px 0px 0px ${borderColor}` : '2px 2px 0px 0px #0A0A0A',
                  }}
                >
                  <span
                    className="font-mono text-xs font-black w-7 h-7 flex-shrink-0 flex items-center justify-center border-2"
                    style={{ borderColor, color: isSelected || isCorrect ? 'white' : borderColor, backgroundColor: isSelected || isCorrect ? borderColor : 'transparent' }}
                  >
                    {letter}
                  </span>
                  <span className="text-sm text-ink font-medium leading-relaxed pt-0.5">
                    {option.replace(/^[A-D]\) /, '')}
                  </span>
                  {isCorrect && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5 ml-auto" />}
                  {isWrong && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5 ml-auto" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Reveal button */}
        {answerState.selected && !answerState.revealed && (
          <button onClick={onReveal} className="cn-btn-black w-full justify-center mt-4 text-sm">
            Check Answer
          </button>
        )}

        {/* Explanation */}
        {answerState.revealed && (
          <div className="mt-4 border-l-4 pl-4 py-3 animate-fade-up"
            style={{ borderColor: answerState.correct ? '#15803D' : '#EA580C', backgroundColor: answerState.correct ? '#F0FDF4' : '#FFF7ED' }}>
            <div className="flex items-center gap-2 mb-2">
              {answerState.correct
                ? <CheckCircle className="w-4 h-4 text-green-700" />
                : <XCircle className="w-4 h-4 text-rose-700" />}
              <span className="font-mono text-[10px] font-black uppercase tracking-wider"
                style={{ color: answerState.correct ? '#15803D' : '#EA580C' }}>
                {answerState.correct ? 'Correct!' : `Incorrect — Correct answer: ${question.correct_answer}`}
              </span>
            </div>
            <p className="text-sm text-ink leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const supabase = createClient()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [gateOnly, setGateOnly] = useState(false)
  const [difficulty, setDifficulty] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [quizComplete, setQuizComplete] = useState(false)

  useEffect(() => {
    const loadSubjects = async () => {
      const { data } = await supabase.from('subjects').select('id, name, slug').order('order_index')
      if (data) setSubjects(data)
    }
    loadSubjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    let query = supabase
      .from('practice_questions')
      .select('*')
      .eq('is_active', true)
      .limit(10)

    if (selectedSubject !== 'all') {
      const subject = subjects.find((s) => s.slug === selectedSubject)
      if (subject) query = query.eq('subject_id', subject.id)
    }
    if (gateOnly) query = query.eq('is_gate_relevant', true)
    if (difficulty !== 'all') query = query.eq('difficulty', difficulty)

    const { data } = await query.order('order_index')
    
    // Parse options if they are stored as JSONB
    const parsedQuestions: Question[] = (data ?? []).map((q) => {
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

    const shuffled = parsedQuestions.sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setAnswers(shuffled.map(() => ({ selected: null, revealed: false, correct: null })))
    setCurrentIndex(0)
    setQuizComplete(false)
    setStarted(true)
    setLoading(false)
  }

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => prev.map((a, i) => i === currentIndex ? { ...a, selected: answer } : a))
  }

  const handleReveal = () => {
    const q = questions[currentIndex]
    const isCorrect = answers[currentIndex].selected === q.correct_answer
    setAnswers((prev) => prev.map((a, i) => i === currentIndex ? { ...a, revealed: true, correct: isCorrect } : a))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRetry = () => {
    setAnswers(questions.map(() => ({ selected: null, revealed: false, correct: null })))
    setCurrentIndex(0)
    setQuizComplete(false)
  }

  const score = answers.filter((a) => a.correct === true).length
  const currentAnswer = answers[currentIndex]
  const currentSubjectSlug = started && questions[currentIndex]
    ? subjects.find((s) => s.id === questions[currentIndex].subject_id)?.slug ?? ''
    : ''
  const domainColor = SUBJECT_COLORS[currentSubjectSlug]?.color ?? '#1D4ED8'

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2" style={{ backgroundColor: domainColor }} />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
              <Zap className="w-5 h-5 text-ink" />
            </div>
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">
              Practice Questions
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
            TEST YOURSELF.<br />
            <span className="text-yellow-bright italic">GATE-READY QUESTIONS</span><br />
            ACROSS ALL 15 SUBJECTS.
          </h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            MCQ questions mapped to your lessons. Each wrong answer shows exactly why — tied back to the concept in the lesson.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Setup panel */}
        {!started && (
          <div className="space-y-4">
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright">
                <h2 className="font-display text-xl font-black text-ink uppercase">Configure Your Quiz</h2>
              </div>
              <div className="p-5 space-y-5 bg-canvas">

                {/* Subject */}
                <div>
                  <div className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest mb-2">Subject</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedSubject('all')}
                      className="border-4 border-ink p-3 text-left transition-all"
                      style={{
                        backgroundColor: selectedSubject === 'all' ? '#0A0A0A' : 'white',
                        color: selectedSubject === 'all' ? 'white' : '#0A0A0A',
                        boxShadow: '2px 2px 0px 0px #0A0A0A',
                      }}
                    >
                      <div className="font-mono text-[9px] font-black uppercase tracking-wider">All Subjects</div>
                    </button>
                    {subjects.map((s) => {
                      const dc = SUBJECT_COLORS[s.slug] ?? { color: '#1D4ED8', bg: '#EFF6FF' }
                      const isActive = selectedSubject === s.slug
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSubject(s.slug)}
                          className="border-4 border-ink p-3 text-left transition-all"
                          style={{
                            backgroundColor: isActive ? dc.color : 'white',
                            color: isActive ? 'white' : '#0A0A0A',
                            boxShadow: `2px 2px 0px 0px ${dc.color}`,
                          }}
                        >
                          <div className="font-mono text-[9px] font-black uppercase tracking-wider leading-snug">
                            {s.name.replace('Polymer ', '').replace(' & Bioplastics', '').replace(' in Plastics', '')}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <div className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest mb-2">Difficulty</div>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'easy', 'medium', 'hard'].map((d) => {
                      const dc = d === 'all' 
                        ? { color: '#0A0A0A', bg: '#F9FAFB', label: 'All Levels' } 
                        : DIFFICULTY_CONFIG[d as keyof typeof DIFFICULTY_CONFIG]
                      const isActive = difficulty === d
                      return (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className="font-mono text-[10px] font-black border-4 border-ink px-4 py-2 uppercase tracking-wider transition-all"
                          style={{
                            backgroundColor: isActive ? dc.color : 'white',
                            color: isActive ? 'white' : '#0A0A0A',
                            boxShadow: `2px 2px 0px 0px ${dc.color}`,
                          }}
                        >
                          {dc.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* GATE filter */}
                <label className="flex items-center gap-3 border-4 border-ink p-4 cursor-pointer hover:bg-violet-600/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={gateOnly}
                    onChange={(e) => setGateOnly(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-mono text-xs font-black text-ink uppercase tracking-wider">GATE-Relevant Questions Only</div>
                    <div className="font-mono text-[9px] text-ink/50 mt-0.5">Filter to questions mapped to GATE Polymer Science paper</div>
                  </div>
                  <span className="font-mono text-[9px] font-black border-2 border-violet-600 text-violet-600 px-2 py-0.5 ml-auto uppercase">GATE</span>
                </label>

                <button
                  onClick={loadQuestions}
                  disabled={loading}
                  className="cn-btn-black w-full justify-center text-sm disabled:opacity-50"
                >
                  {loading ? 'Loading questions...' : <><Zap className="w-4 h-4" /> Start Practice Quiz</>}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '50+', label: 'Questions', color: '#1D4ED8' },
                { val: '15', label: 'Subjects', color: '#EA580C' },
                { val: 'GATE', label: 'Mapped', color: '#7C3AED' },
              ].map((s) => (
                <div key={s.label} className="border-4 border-ink p-4 text-center shadow-hard-sm" style={{ backgroundColor: s.color + '12' }}>
                  <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Sponsored Challenges Promo */}
            <div className="border-4 border-ink bg-blue-50/50 p-5 shadow-hard flex flex-col sm:flex-row items-center gap-4 justify-between" style={{ borderColor: '#2563EB' }}>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-blue-700">
                  <Trophy className="w-4 h-4" />
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider">Industry Sponsored Challenges</span>
                </div>
                <h3 className="font-display text-base font-black text-ink">Solve Industry Cases & Earn Up to +250 XP</h3>
                <p className="font-mono text-[9px] text-slate-400">Get hired directly by companies like Reliance & Supreme.</p>
              </div>
              <Link href="/practice/challenges"
                className="border-4 border-ink bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-mono text-[9px] font-black uppercase shadow-hard-sm transition-all flex items-center gap-1 flex-shrink-0">
                View Challenges <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Quiz in progress */}
        {started && !quizComplete && questions.length > 0 && (
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="border-4 border-ink h-3 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, backgroundColor: domainColor }}
              />
            </div>

            {/* Score tracker */}
            <div className="flex items-center justify-between font-mono text-[10px] text-ink/50 uppercase tracking-wider">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="flex items-center gap-2">
                <span className="text-green-700 font-black">{answers.filter((a) => a.correct === true).length} correct</span>
                <span>·</span>
                <span className="text-rose-700 font-black">{answers.filter((a) => a.correct === false).length} wrong</span>
              </span>
            </div>

            <QuestionCard
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              answerState={currentAnswer}
              onAnswer={handleAnswer}
              onReveal={handleReveal}
            />

            {/* Next button */}
            {currentAnswer.revealed && (
              <button
                onClick={handleNext}
                className="cn-btn-black w-full justify-center text-sm animate-fade-up"
              >
                {currentIndex < questions.length - 1 ? (
                  <>Next Question <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>See Results <Trophy className="w-4 h-4" /></>
                )}
              </button>
            )}

            {/* Exit */}
            <button
              onClick={() => setStarted(false)}
              className="w-full font-mono text-[10px] text-ink/40 hover:text-ink uppercase tracking-wider text-center py-2 transition-colors"
            >
              ← Change Subject / Filters
            </button>
          </div>
        )}

        {/* No questions found */}
        {started && !quizComplete && questions.length === 0 && (
          <div className="border-4 border-ink p-12 text-center shadow-hard">
            <div className="font-display text-2xl font-black text-ink mb-2">No questions found</div>
            <p className="text-ink/60 text-sm mb-4">Try different filters — more questions are being added regularly.</p>
            <button onClick={() => setStarted(false)} className="cn-btn-black text-sm">
              Change Filters
            </button>
          </div>
        )}

        {/* Results */}
        {quizComplete && (
          <div className="animate-fade-up">
            <ScoreCard
              score={score}
              total={questions.length}
              onRetry={handleRetry}
              onNext={() => setStarted(false)}
            />

            {/* Wrong answers review */}
            {answers.some((a) => a.correct === false) && (
              <div className="mt-6 space-y-3">
                <div className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b-4 border-ink pb-2">
                  Review — Questions You Got Wrong
                </div>
                {questions.map((q, i) => {
                  if (answers[i].correct !== false) return null
                  return (
                    <div key={q.id} className="border-4 border-ink overflow-hidden shadow-hard-sm" style={{ borderColor: '#EA580C' }}>
                      <div className="border-b-4 border-ink px-4 py-2 bg-orange-600 text-white font-mono text-[9px] font-black uppercase">
                        Q{i + 1} — {q.topic || 'General'}
                      </div>
                      <div className="p-4 bg-canvas">
                        <p className="font-bold text-sm text-ink mb-3">{q.question}</p>
                        <div className="border-l-4 border-green-600 pl-3 py-1" style={{ backgroundColor: '#F0FDF4' }}>
                          <p className="font-mono text-[9px] text-green-700 font-black uppercase mb-1">Correct answer: {q.correct_answer}</p>
                          <p className="text-xs text-ink leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <section className="border-t-4 border-ink bg-ink px-6 md:px-12 py-10 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[9px] text-yellow-bright uppercase tracking-widest mb-1">Go deeper</div>
            <p className="font-display text-xl font-black text-white">The AI Tutor explains any concept you&apos;re struggling with.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/ai-tutor" className="cn-btn-yellow text-sm">
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
            <Link href="/subjects" className="cn-btn-white text-sm">
              <BookOpen className="w-4 h-4" /> Study Lessons
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
