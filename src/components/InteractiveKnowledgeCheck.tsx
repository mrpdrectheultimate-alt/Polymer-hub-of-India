'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, HelpCircle, RefreshCw, Award } from 'lucide-react'

type Props = {
  lessonSlug: string
  quizPassed?: boolean
  quizScore?: number | null
}

const SAMPLE_KNOWLEDGE_QUESTIONS: Record<string, {
  question: string
  options: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
}> = {
  default: {
    question: 'In polymer science and processing thermodynamics, which factor most directly controls the critical transition temperature?',
    options: [
      { id: 'A', text: 'Chain backbone flexibility, steric hindrance, and intermolecular cohesive energy', isCorrect: true },
      { id: 'B', text: 'Only the pigment concentration in the masterbatch dosing unit', isCorrect: false },
      { id: 'C', text: 'Atmospheric relative humidity inside the mold storage room', isCorrect: false },
      { id: 'D', text: 'The rotation speed of the cooling water pump impeller', isCorrect: false },
    ],
    explanation: 'Glass transition (Tg) and melting point (Tm) are governed intrinsically by polymer chain stiffness, rotational barriers around sigma bonds, bulky side groups, and intermolecular hydrogen bonding or dipole interactions.'
  }
}

export default function InteractiveKnowledgeCheck({
  lessonSlug,
  quizPassed = false,
  quizScore = null,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const questionData = SAMPLE_KNOWLEDGE_QUESTIONS[lessonSlug] || SAMPLE_KNOWLEDGE_QUESTIONS.default
  const selectedIsCorrect = questionData.options.find(o => o.id === selectedOption)?.isCorrect ?? false

  const handleSelect = (id: string) => {
    if (hasSubmitted) return
    setSelectedOption(id)
    setHasSubmitted(true)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setHasSubmitted(false)
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
              Section 05 · Knowledge Check
            </span>
            <h3 className="font-display text-base font-bold text-slate-900">
              Test Your Conceptual Understanding
            </h3>
          </div>
        </div>

        {quizPassed && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Passed ({quizScore || 100}%)</span>
          </span>
        )}
      </div>

      {/* Question */}
      <p className="font-sans text-sm sm:text-base font-semibold text-slate-900 mb-5 leading-relaxed">
        {questionData.question}
      </p>

      {/* Option Cards */}
      <div className="space-y-2.5 mb-6">
        {questionData.options.map((option) => {
          const isSelected = selectedOption === option.id
          let cardStyle = 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 text-slate-800'

          if (hasSubmitted) {
            if (option.isCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-500/20'
            } else if (isSelected && !option.isCorrect) {
              cardStyle = 'border-red-400 bg-red-50/70 text-red-900 font-semibold'
            } else {
              cardStyle = 'border-slate-200 opacity-50 text-slate-500'
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={hasSubmitted}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 ${cardStyle}`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5 ${
                hasSubmitted && option.isCorrect
                  ? 'bg-emerald-600 text-white'
                  : hasSubmitted && isSelected && !option.isCorrect
                  ? 'bg-red-600 text-white'
                  : isSelected
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {option.id}
              </span>
              <span className="text-xs sm:text-sm leading-relaxed flex-1">
                {option.text}
              </span>
              {hasSubmitted && option.isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              )}
              {hasSubmitted && isSelected && !option.isCorrect && (
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation Box upon submit */}
      {hasSubmitted && (
        <div className={`p-4 rounded-xl border mb-5 text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${
          selectedIsCorrect
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-1.5 font-bold mb-1 font-mono text-xs uppercase tracking-wider">
            {selectedIsCorrect ? (
              <span className="text-emerald-700">✓ Correct Analysis!</span>
            ) : (
              <span className="text-amber-800">⚠ Conceptual Note:</span>
            )}
          </div>
          <p>{questionData.explanation}</p>
        </div>
      )}

      {/* Bottom CTA Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-100">
        {hasSubmitted ? (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        ) : (
          <span className="text-[11px] font-mono text-slate-400">Select the correct option to verify</span>
        )}

        <Link
          href={`/quiz/${lessonSlug}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs"
        >
          <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Take Complete Topic Assessment →</span>
        </Link>
      </div>
    </div>
  )
}
