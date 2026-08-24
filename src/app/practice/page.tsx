'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { CheckCircle2, XCircle, ArrowRight, Brain, RotateCcw, Trophy, Zap, Sparkles, Filter } from 'lucide-react'

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

// ─── Score Card ───────────────────────────────────────────────────────────────

function ScoreCard({ score, total, onRetry, onNext }: {
  score: number; total: number; onRetry: () => void; onNext: () => void
}) {
  const pct = Math.round((score / total) * 100)
  const color = pct >= 80 ? '#15803D' : pct >= 50 ? '#CA8A04' : '#EA580C'
  const grade = pct >= 80 ? 'Excellent Mastery' : pct >= 60 ? 'Good Progress' : pct >= 40 ? 'Keep Practising' : 'Review Core Lessons'

  return (
    <div className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-xl">
      <div className="p-6 text-white text-center" style={{ backgroundColor: color }}>
        <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-4 h-4 text-yellow-300" /> Assessment Complete
        </div>
        <div className="font-display text-6xl sm:text-7xl font-black mb-1">
          {pct}%
        </div>
        <div className="font-display text-2xl font-bold">{grade}</div>
        <div className="text-xs font-mono text-white/80 mt-1">{score} correct out of {total} questions</div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Score bar */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>

        {pct < 80 && (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <p className="font-mono text-xs font-bold uppercase tracking-wider mb-1" style={{ color }}>Learning Recommendation</p>
            {pct < 40
              ? 'Review the relevant subject modules before reattempting. You can ask our AI Tutor to clarify any tricky thermodynamic or rheology formulas.'
              : 'You are close! Focus specifically on the wrong answers below — the detailed explanations break down the underlying chemistry and standards.'}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button 
            onClick={onRetry} 
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button 
            onClick={onNext} 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-colors shadow-md shadow-blue-900/30"
          >
            Choose Another Subject <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Question Card ────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  total,
  answerState,
  onAnswer,
  onReveal,
}: {
  question: Question
  index: number
  total: number
  answerState: AnswerState
  onAnswer: (val: string) => void
  onReveal: () => void
}) {
  const [typedAnswer, setTypedAnswer] = useState('')
  const isSelected = !!answerState.selected
  const isRevealed = answerState.revealed

  const difficultyConf = DIFFICULTY_CONFIG[question.difficulty] ?? DIFFICULTY_CONFIG.medium

  return (
    <div className="border-2 border-slate-900 rounded-2xl bg-white shadow-sm overflow-hidden animate-in fade-in duration-200">
      
      {/* Header Badges */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
            Q{index + 1} / {total}
          </span>
          <span
            className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border"
            style={{ backgroundColor: difficultyConf.bg, color: difficultyConf.color, borderColor: difficultyConf.color + '40' }}
          >
            {difficultyConf.label}
          </span>
          {question.is_gate_relevant && (
            <span className="font-mono text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-300 px-2 py-0.5 rounded uppercase">
              🎯 GATE Relevant
            </span>
          )}
        </div>
        {question.topic && (
          <span className="text-[11px] font-mono font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
            {question.topic}
          </span>
        )}
      </div>

      {/* Question Body */}
      <div className="p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {question.question}
        </h3>

        {/* Options: MCQ */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const optKey = ['A', 'B', 'C', 'D'][i] || String(i + 1)
              const isOptionSelected = answerState.selected === opt
              const isCorrectOption = opt === question.correct_answer

              let buttonStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50'
              if (isRevealed) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                } else if (isOptionSelected && !isCorrectOption) {
                  buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through'
                } else {
                  buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }
              } else if (isOptionSelected) {
                buttonStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-sm'
              }

              return (
                <button
                  key={i}
                  disabled={isRevealed}
                  onClick={() => onAnswer(opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${buttonStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5 ${
                    isOptionSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {optKey}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt}</span>
                  {isRevealed && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto flex-shrink-0 mt-0.5" />
                  )}
                  {isRevealed && isOptionSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-600 ml-auto flex-shrink-0 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Short / Numerical Answer */}
        {question.type !== 'mcq' && (
          <div className="space-y-3">
            <input
              type="text"
              disabled={isRevealed}
              value={typedAnswer}
              onChange={(e) => {
                setTypedAnswer(e.target.value)
                onAnswer(e.target.value)
              }}
              placeholder="Type your numerical or short answer..."
              className="w-full p-4 border-2 border-slate-900 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>
        )}

        {/* Check Answer CTA */}
        {!isRevealed && (
          <button
            onClick={onReveal}
            disabled={!isSelected}
            className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Check Answer
          </button>
        )}

        {/* Answer Explanation Box */}
        {isRevealed && (
          <div className={`p-4 sm:p-5 rounded-xl border-2 space-y-2 animate-in fade-in duration-300 ${
            answerState.correct ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {answerState.correct ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-800 uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct Answer
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-800 uppercase">
                  <XCircle className="w-4 h-4 text-rose-600" /> Incorrect Answer
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-slate-800 font-bold">
              Correct: <span className="text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">{question.correct_answer}</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-1 border-t border-slate-200/60">
              {question.explanation}
            </p>
          </div>
        )}

      </div>

    </div>
  )
}

// ─── Main Practice Page ───────────────────────────────────────────────────────

export default function PracticePage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [gateOnly, setGateOnly] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [started, setStarted] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadSubjects() {
      const { data } = await supabase
        .from('subjects')
        .select('id, name, slug')
        .order('order_index', { ascending: true })
      if (data) setSubjects(data)
    }
    loadSubjects()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    let query = supabase.from('practice_questions').select('*')

    if (selectedSubject !== 'all') {
      const sub = subjects.find((s) => s.slug === selectedSubject)
      if (sub) query = query.eq('subject_id', sub.id)
    }

    if (difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
    }

    if (gateOnly) {
      query = query.eq('is_gate_relevant', true)
    }

    const { data } = await query.limit(20)

    if (data && data.length > 0) {
      const shuffled = [...data].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
      setAnswers(shuffled.map(() => ({ selected: null, revealed: false, correct: null })))
      setCurrentIndex(0)
      setStarted(true)
      setQuizComplete(false)
    } else {
      setQuestions([])
      setStarted(true)
      setQuizComplete(false)
    }
    setLoading(false)
  }

  const handleAnswer = (val: string) => {
    setAnswers((prev) => prev.map((a, i) => i === currentIndex ? { ...a, selected: val } : a))
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

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-900 pb-20">

      {/* ── Top Header Bar: Orange ── */}
      <div className="bg-[#D97706] border-b-4 border-[#F59E0B]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#FEF08A] text-xs font-mono font-bold uppercase tracking-wider">Practice Engine</span>
              <div className="flex flex-wrap gap-4 mt-1 text-white text-xs font-mono">
                <span>{questions.length || '225+'} <span className="text-[#FEF08A]">Questions</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>19 <span className="text-[#FEF08A]">Subjects</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>GATE <span className="text-[#FEF08A]">Pattern</span></span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#FEF08A] text-xs font-mono font-bold">30 Q &middot; 60 Min</p>
              <p className="text-white/60 text-[10px] font-mono">-1/3 Negative Marking</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Section: Orange Gradient ── */}
      <section className="bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Zap className="w-4 h-4 text-yellow-200 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              GATE 2026 Preparation &middot; 19 Subjects
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase">
            Test Yourself. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEF08A] via-[#FFFFFF] to-[#FDE047]">
              GATE-Ready Questions
            </span>
            <br />
            Across All 19 Subjects.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            MCQ, MSQ, and numerical practice questions mapped directly to your lessons. Every wrong answer breaks down the exact polymer chemistry or processing equation.
          </p>

        </div>
      </section>

      {/* ── Main Interactive Assessment Container ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Setup panel */}
        {!started && (
          <div className="space-y-6">
            
            {/* Filter Configuration Card */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-black text-slate-900">Configure Your Quiz</h2>
                    <p className="text-xs text-slate-500 font-medium">Select subject, difficulty, or GATE filter</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {subjects.length || 19} Subjects Available
                </span>
              </div>

              {/* Subject Selection Pills */}
              <div>
                <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  1. Select Subject (19 Available)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => setSelectedSubject('all')}
                    className={`p-2.5 rounded-xl border-2 font-mono text-xs font-bold uppercase tracking-wider text-left transition-all ${
                      selectedSubject === 'all'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    All 19 Subjects
                  </button>
                  {subjects.map((s) => {
                    const isActive = selectedSubject === s.slug
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSubject(s.slug)}
                        className={`p-2.5 rounded-xl border-2 font-mono text-[11px] font-bold text-left transition-all truncate ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                        title={s.name}
                      >
                        {s.name.replace('Polymer ', '').replace('Plastic ', '')}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Difficulty & GATE Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                <div>
                  <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    2. Difficulty Level
                  </div>
                  <div className="flex gap-2">
                    {['all', 'easy', 'medium', 'hard'].map((d) => {
                      const isActive = difficulty === d
                      return (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                            isActive
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    3. Exam Focus
                  </div>
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={gateOnly}
                      onChange={(e) => setGateOnly(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      🎯 GATE Polymer Science Questions Only
                    </span>
                  </label>
                </div>

              </div>

              {/* Start Quiz CTA */}
              <button
                onClick={loadQuestions}
                disabled={loading}
                className="w-full py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0A1628] hover:shadow-[2px_2px_0px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading Questions...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Start Practice Quiz &rarr;
                  </>
                )}
              </button>

            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { val: '225+', label: 'Practice Questions', sub: 'Across all modules', color: '#2563EB' },
                { val: '19', label: 'Subjects Covered', sub: 'Complete B.Tech syllabus', color: '#15803D' },
                { val: 'GATE', label: 'Pattern Matched', sub: 'Calculators & numericals', color: '#7C3AED' },
              ].map((s) => (
                <div key={s.label} className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-sm text-center">
                  <div className="font-display text-3xl font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">{s.label}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Sponsored Challenges Promo */}
            <div className="bg-gradient-to-r from-[#0A1628] to-[#142642] text-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  <Trophy className="w-4 h-4" /> Industry Challenges
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                  Solve Real Polymer Industrial Problems &amp; Earn XP
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light">
                  Direct recruitment radar from Reliance, Supreme Industries, and Astral Pipes.
                </p>
              </div>
              <Link 
                href="/practice/challenges"
                className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border-2 border-slate-900 transition-all shadow-[3px_3px_0px_0px_#000] flex-shrink-0"
              >
                View Challenges <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

        {/* Quiz In Progress */}
        {started && !quizComplete && questions.length > 0 && (
          <div className="space-y-6">
            
            {/* Progress & Tracker Bar */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-600">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span className="flex items-center gap-3">
                  <span className="text-emerald-600 font-bold">{answers.filter((a) => a.correct === true).length} Correct</span>
                  <span>&middot;</span>
                  <span className="text-rose-600 font-bold">{answers.filter((a) => a.correct === false).length} Wrong</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <QuestionCard
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              answerState={currentAnswer}
              onAnswer={handleAnswer}
              onReveal={handleReveal}
            />

            {/* Next / Result Action Button */}
            {currentAnswer.revealed && (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {currentIndex < questions.length - 1 ? (
                  <>Next Question <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>See Final Score &amp; Analysis <Trophy className="w-4 h-4" /></>
                )}
              </button>
            )}

            {/* Exit Option */}
            <button
              onClick={() => setStarted(false)}
              className="w-full font-mono text-xs text-slate-500 hover:text-slate-900 uppercase tracking-wider text-center py-2 transition-colors"
            >
              &larr; Exit to Subject Configuration
            </button>

          </div>
        )}

        {/* No Questions Found Fallback */}
        {started && !quizComplete && questions.length === 0 && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-12 text-center shadow-xl space-y-4">
            <h3 className="font-display text-2xl font-black text-slate-900">No Questions Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              No questions matched your exact filter combination. Try resetting the GATE filter or selecting &quot;All 19 Subjects&quot;.
            </p>
            <button 
              onClick={() => setStarted(false)} 
              className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Results Screen */}
        {quizComplete && (
          <div className="space-y-6">
            <ScoreCard
              score={score}
              total={questions.length}
              onRetry={handleRetry}
              onNext={() => setStarted(false)}
            />

            {/* Wrong Answers Detailed Review */}
            {answers.some((a) => a.correct === false) && (
              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">
                  Review &middot; Questions You Got Wrong
                </h4>
                {questions.map((q, i) => {
                  if (answers[i].correct !== false) return null
                  return (
                    <div key={q.id} className="bg-white border-2 border-rose-300 rounded-2xl p-6 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded uppercase">
                          Q{i + 1} &middot; {q.topic || 'General'}
                        </span>
                      </div>
                      <p className="font-display font-bold text-sm text-slate-900">{q.question}</p>
                      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1">
                        <p className="font-mono text-xs font-bold text-emerald-800 uppercase">
                          Correct Answer: {q.correct_answer}
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── AI Tutor Footer Banner ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-2xl border-2 border-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="font-mono text-[10px] text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Grounded in 216 Lessons
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              Struggling with a difficult question or equation?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ask our RAG AI Tutor for instant step-by-step mathematical derivations.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link 
              href="/ai-tutor" 
              className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl border-2 border-slate-900 transition-all shadow-[3px_3px_0px_0px_#000]"
            >
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
