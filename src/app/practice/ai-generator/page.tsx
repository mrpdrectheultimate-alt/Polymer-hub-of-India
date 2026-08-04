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
        <div className="border-4 border-slate-900 bg-purple-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white border-4 border-slate-900 flex items-center justify-center shrink-0">
              <Brain size={32} className="text-purple-600 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                AI Mock Exam Generator
              </h1>
              <p className="text-purple-100 mt-3 text-lg max-w-2xl leading-relaxed">
                Generate 5 custom, high-fidelity multiple-choice questions on any custom topic. 
                Pass with &ge; 70% to earn up to <span className="font-black text-white bg-slate-950 px-1">+50 XP</span>.
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
              className="bg-purple-600 border-4 border-slate-900 text-white font-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Exam
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
                <h3 className="text-lg font-black text-slate-950 leading-snug">{q.question}</h3>

                <div className="mt-6 space-y-3">
                  {[
                    { key: 'A', value: q.option_a },
                    { key: 'B', value: q.option_b },
                    { key: 'C', value: q.option_c },
                    { key: 'D', value: q.option_d },
                  ].map((opt) => {
                    const isSelected = answers[qIdx] === opt.key
                    const isCorrect = q.correct_option === opt.key
                    
                    let optStyle = 'border-2 border-slate-200 hover:bg-slate-50'
                    let prefixStyle = 'bg-slate-100 text-slate-700'
                    
                    if (isSelected) {
                      optStyle = 'border-slate-900 bg-slate-100'
                      prefixStyle = 'bg-slate-900 text-white'
                    }

                    if (submitted) {
                      if (isCorrect) {
                        optStyle = 'border-green-500 bg-green-50'
                        prefixStyle = 'bg-green-500 text-white'
                      } else if (isSelected) {
                        optStyle = 'border-red-500 bg-red-50'
                        prefixStyle = 'bg-red-500 text-white'
                      } else {
                        optStyle = 'border-slate-200 opacity-60'
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={submitted}
                        onClick={() => handleSelectOption(qIdx, opt.key)}
                        className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${optStyle}`}
                      >
                        <div className={`w-7 h-7 flex items-center justify-center font-mono font-black text-xs ${prefixStyle}`}>
                          {opt.key}
                        </div>
                        <span className="font-bold text-slate-900 text-sm flex-1">{opt.value}</span>
                        {submitted && isSelected && (
                          isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                          )
                        )}
                      </button>
                    )
                  })}
                </div>

                {submitted && (
                  <div className="mt-5 p-4 bg-slate-50 border-2 border-slate-900">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      <HelpCircle className="w-4 h-4 text-purple-600" /> Explanation
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
                className="w-full py-4 bg-purple-600 border-4 border-slate-900 text-white font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Mock Exam
              </button>
            ) : (
              <div className="border-4 border-slate-900 bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
                <Trophy className="w-16 h-16 mx-auto text-amber-500" />
                <h2 className="text-3xl font-black text-slate-950">Mock Exam Complete!</h2>
                <div className="text-4xl font-black text-purple-600 mt-2">{score}%</div>
                <p className="text-slate-500 font-bold max-w-md mx-auto">
                  {score! >= 70 
                    ? 'Excellent job! You passed the AI exam and proved your comprehension.' 
                    : 'Study this topic further and review the explanations above before testing yourself again.'}
                </p>

                {xpEarned && (
                  <div className="bg-purple-100 border-2 border-purple-500 py-3 px-6 max-w-xs mx-auto font-black text-purple-800">
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
                    className="cn-btn-purple py-3 px-6 text-sm"
                  >
                    Take New Exam
                  </button>
                  <Link href="/practice" className="cn-btn-black py-3 px-6 text-sm">
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
