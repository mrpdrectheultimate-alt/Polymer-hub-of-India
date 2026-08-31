'use client'

import { useState } from 'react'
import { Brain, Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, HelpCircle, Trophy } from 'lucide-react'

import Link from 'next/link'

type Question = {
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

export default function AIGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [xpEarned, setXpEarned] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setQuestions([])
    setAnswers({})
    setScore(null)
    setSubmitted(false)
    setXpEarned(null)

    try {
      const res = await fetch('/api/ai-generator/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.questions) {
        setQuestions(data.questions)
      } else {
        alert(data.error || 'Failed to generate quiz. Try again.')
      }
    } catch {
      alert('Network error generating quiz.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_option) {
        correct++
      }
    })

    const finalPct = Math.round((correct / questions.length) * 100)
    setScore(finalPct)
    setSubmitted(true)

    // Call XP award
    const action = finalPct === 100 ? 'quiz_perfect' : finalPct >= 70 ? 'quiz_pass' : null
    if (action) {
      try {
        const res = await fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, reference: `ai-quiz-${topic.slice(0, 15)}` }),
        })
        const data = await res.json()
        if (res.ok && data.xp_points) {
          setXpEarned(finalPct === 100 ? 50 : 30)
        }
      } catch (e) {
        console.log('XP award error:', e)
      }
    }
  }

  const handleSelectOption = (qIdx: number, opt: string) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: opt }))
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Link href="/practice" className="hover:text-slate-900">Practice Hub</Link>
          <ArrowRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">AI Exam Generator</span>
        </div>

        {/* Hero banner */}
        <div className="border-4 border-slate-900 bg-[#2563EB] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white border-4 border-slate-900 flex items-center justify-center shrink-0">
              <Brain size={32} className="text-[#2563EB] animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight font-display">
                AI Mock Exam Generator
              </h1>
              <p className="text-blue-100 mt-3 text-base md:text-lg max-w-2xl leading-relaxed">
                Generate 5 custom, high-fidelity multiple-choice questions on any custom topic. 
                Pass with &ge; 70% to earn up to <span className="font-black text-slate-900 bg-amber-400 px-1.5 py-0.5 rounded-sm">+50 XP</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <label className="block text-lg font-black text-slate-900 mb-3">
            What topic do you want to practice?
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              disabled={loading}
              className="flex-1 border-4 border-slate-900 p-4 font-bold text-slate-900 rounded-none bg-slate-50 text-base placeholder-slate-400"
              placeholder="e.g. Blown film extrusion defects, ISO 178 flexural testing, PET recycling degradation..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="bg-[#F59E0B] hover:bg-[#D97706] border-4 border-slate-900 text-slate-950 font-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-900" /> Generate Exam
                </>
              )}
            </button>
          </div>
        </div>

        {/* Questions list */}
        {questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="border-4 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-1">Q {qIdx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-6 leading-snug">{q.question}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'A', value: q.option_a },
                    { key: 'B', value: q.option_b },
                    { key: 'C', value: q.option_c },
                    { key: 'D', value: q.option_d },
                  ].map((opt) => {
                    const isSelected = answers[qIdx] === opt.key
                    const isCorrect = q.correct_option === opt.key
                    
                    let optStyle = 'border-2 border-slate-900 bg-slate-50 hover:bg-slate-100 text-slate-900'
                    if (submitted) {
                      if (isCorrect) {
                        optStyle = 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      } else if (isSelected && !isCorrect) {
                        optStyle = 'border-2 border-rose-600 bg-rose-50 text-rose-950 font-bold'
                      }
                    } else if (isSelected) {
                      optStyle = 'border-2 border-[#2563EB] bg-blue-50 text-[#1E40AF] font-bold ring-2 ring-blue-400/40'
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={submitted}
                        onClick={() => handleSelectOption(qIdx, opt.key)}
                        className={`p-4 text-left font-medium text-sm flex items-start gap-3 transition-colors ${optStyle} cursor-pointer`}
                      >
                        <span className="font-mono font-bold text-xs uppercase opacity-75">
                          {opt.key}.
                        </span>
                        <span className="flex-1 font-bold text-slate-900 text-sm">{opt.value}</span>
                        {submitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {submitted && (
                  <div className="mt-5 p-4 bg-slate-50 border-2 border-slate-900">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      <HelpCircle className="w-4 h-4 text-[#2563EB]" /> Explanation
                    </div>
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Submit Block */}
            {!submitted ? (
              <button
                disabled={Object.keys(answers).length < questions.length}
                onClick={handleSubmit}
                className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] border-4 border-slate-900 text-white font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Submit Mock Exam
              </button>
            ) : (
              <div className="border-4 border-slate-900 bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
                <Trophy className="w-16 h-16 mx-auto text-[#F59E0B]" />
                <h2 className="text-3xl font-black text-slate-950 font-display">Mock Exam Complete!</h2>
                <div className="text-4xl font-black text-[#2563EB] mt-2 font-mono">{score}%</div>
                <p className="text-slate-500 font-bold max-w-md mx-auto">
                  {score! >= 70 
                    ? 'Excellent job! You passed the AI exam and proved your comprehension.' 
                    : 'Study this topic further and review the explanations above before testing yourself again.'}
                </p>

                {xpEarned && (
                  <div className="bg-amber-100 border-2 border-amber-500 py-3 px-6 max-w-xs mx-auto font-black text-amber-900">
                    🎉 +{xpEarned} XP Earned!
                  </div>
                )}

                <div className="pt-4 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setQuestions([])
                      setAnswers({})
                      setScore(null)
                      setSubmitted(false)
                      setXpEarned(null)
                    }}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-4 border-slate-900 font-black py-3 px-6 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    Take New Exam
                  </button>
                  <Link href="/practice" className="bg-slate-900 hover:bg-slate-800 text-white border-4 border-slate-900 font-black py-3 px-6 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Back to Practice Hub
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
