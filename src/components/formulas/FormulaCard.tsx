'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Copy, 
  Check, 
  BookOpen, 
  GraduationCap, 
  Calculator, 
  Layers, 
  ArrowRight,
  Bookmark,
  Wrench,
  Award,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  FileText,
  Sparkles
} from 'lucide-react'
import { Formula } from '@/types/formulas'
import { renderFormulaLatex, getFormulaAccessibleLabel } from '@/lib/formulas/katex-config'

interface FormulaCardProps {
  formula: Formula
  onSaveToggle?: (id: string) => void
  isSaved?: boolean
  defaultTab?: 'variables' | 'solver' | 'example' | 'theory'
}

// Subject color accent mapping
const SUBJECT_ACCENTS: Record<string, { badgeBg: string; badgeText: string; border: string }> = {
  'polymer-chemistry': { badgeBg: 'bg-blue-50', badgeText: 'text-blue-800', border: 'border-blue-200' },
  'polymer-processing': { badgeBg: 'bg-amber-50', badgeText: 'text-amber-800', border: 'border-amber-200' },
  'mould-design': { badgeBg: 'bg-orange-50', badgeText: 'text-orange-800', border: 'border-orange-200' },
  'polymer-rheology': { badgeBg: 'bg-purple-50', badgeText: 'text-purple-800', border: 'border-purple-200' },
  'polymer-testing': { badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-800', border: 'border-indigo-200' },
  'plastic-packaging-engineering': { badgeBg: 'bg-cyan-50', badgeText: 'text-cyan-800', border: 'border-cyan-200' },
  'sustainable-plastics': { badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-800', border: 'border-emerald-200' },
  'recycling-technology': { badgeBg: 'bg-teal-50', badgeText: 'text-teal-800', border: 'border-teal-200' },
  'rubber-technology': { badgeBg: 'bg-rose-50', badgeText: 'text-rose-800', border: 'border-rose-200' },
  'polymer-composites': { badgeBg: 'bg-violet-50', badgeText: 'text-violet-800', border: 'border-violet-200' },
  'additives-compounding': { badgeBg: 'bg-yellow-50', badgeText: 'text-yellow-900', border: 'border-yellow-200' },
  'life-cycle-assessment': { badgeBg: 'bg-green-50', badgeText: 'text-green-800', border: 'border-green-200' },
  'color-science-masterbatches': { badgeBg: 'bg-fuchsia-50', badgeText: 'text-fuchsia-800', border: 'border-fuchsia-200' },
  'entrepreneurship-plastics': { badgeBg: 'bg-amber-50', badgeText: 'text-amber-900', border: 'border-amber-200' },
  'medical-plastics': { badgeBg: 'bg-sky-50', badgeText: 'text-sky-800', border: 'border-sky-200' },
  'digital-twins-plastics': { badgeBg: 'bg-slate-100', badgeText: 'text-slate-800', border: 'border-slate-300' },
  'bioprocessing-fermentation': { badgeBg: 'bg-lime-50', badgeText: 'text-lime-800', border: 'border-lime-200' },
  'robotics-plastics': { badgeBg: 'bg-zinc-100', badgeText: 'text-zinc-800', border: 'border-zinc-300' },
  'polymer-nanotechnology': { badgeBg: 'bg-purple-50', badgeText: 'text-purple-900', border: 'border-purple-200' }
}

export function FormulaCard({ 
  formula, 
  onSaveToggle, 
  isSaved = false,
  defaultTab = 'variables' 
}: FormulaCardProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'variables' | 'solver' | 'example' | 'theory'>(defaultTab)
  
  const [calcInputs, setCalcInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    if (formula.calc_config) {
      formula.calc_config.inputs.forEach((inp) => {
        initial[inp.symbol] = inp.defaultVal
      })
    }
    return initial
  })

  const handleCopyLatex = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(formula.equation_latex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCalcChange = (symbol: string, val: number) => {
    setCalcInputs((prev) => ({ ...prev, [symbol]: val }))
  }

  const calcResult = formula.calc_config ? formula.calc_config.calculate(calcInputs) : null
  const accent = SUBJECT_ACCENTS[formula.subject_id] || { badgeBg: 'bg-blue-50', badgeText: 'text-blue-800', border: 'border-blue-200' }

  return (
    <article
      className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
      aria-label={getFormulaAccessibleLabel(formula)}
    >
      {/* Top Subtle Gradient Edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 opacity-80" />

      <div>
        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-100 text-slate-800 border border-slate-300 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              {formula.type_code} · {formula.type_label}
            </span>

            <span className={`${accent.badgeBg} ${accent.badgeText} border ${accent.border} font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs`}>
              {formula.subject_name}
            </span>

            {formula.is_gate && (
              <span className="bg-purple-50 text-purple-800 border border-purple-200 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Award className="w-3 h-3 text-purple-600" />
                GATE 2026
              </span>
            )}

            {formula.is_shopfloor && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Wrench className="w-3 h-3 text-emerald-600" />
                Shop-Floor
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLatex}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-500 hover:text-slate-900 transition flex items-center gap-1 text-[11px] font-mono cursor-pointer"
              title="Copy LaTeX Equation"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">LaTeX</span>
                </>
              )}
            </button>

            <button
              onClick={() => onSaveToggle?.(formula.formula_id)}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Formula'}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition font-display tracking-tight">
          <Link href={`/formulas/${formula.slug}`}>{formula.name}</Link>
        </h3>
        
        <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
          {formula.description}
        </p>

        {/* KaTeX Math Equation Render Box */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/20 border-2 border-slate-200 rounded-2xl p-5 my-3.5 text-center overflow-x-auto shadow-xs text-slate-900 relative">
          <span className="absolute top-2 left-3 font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
            Canonical Formula
          </span>
          <div
            className="katex-rendered text-xl sm:text-2xl font-black tracking-wide text-slate-900 select-all pt-2 pb-1"
            dangerouslySetInnerHTML={{ __html: renderFormulaLatex(formula.equation_latex) }}
          />
        </div>

        {/* When to Use Callout Banner */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 my-3 text-xs flex items-start gap-2.5">
          <span className="text-blue-600 text-sm flex-shrink-0 mt-0.5">💡</span>
          <div>
            <span className="font-bold text-blue-950 block mb-0.5">When to Use:</span>
            <p className="text-slate-700 leading-relaxed font-sans">{formula.when_to_use}</p>
          </div>
        </div>

        {/* Interactive Segmented Tabs Navigation */}
        <div className="mt-4 mb-3">
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('variables')}
              className={`flex-1 min-w-[110px] py-1.5 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'variables'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Variables ({formula.variables.length})</span>
            </button>

            {formula.calc_config && (
              <button
                onClick={() => setActiveTab('solver')}
                className={`flex-1 min-w-[100px] py-1.5 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'solver'
                    ? 'bg-white text-amber-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                <span>Live Solver</span>
              </button>
            )}

            {formula.examples && formula.examples.length > 0 && (
              <button
                onClick={() => setActiveTab('example')}
                className={`flex-1 min-w-[110px] py-1.5 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'example'
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Solved Example</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('theory')}
              className={`flex-1 min-w-[95px] py-1.5 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-white text-purple-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>Theory &amp; Traps</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Variables & SI Units Table */}
        {activeTab === 'variables' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs shadow-2xs mb-4">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-2">Physical Meaning</th>
                  <th className="py-2.5 px-2">SI Unit</th>
                  <th className="py-2.5 px-3 text-right">Typical Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                {formula.variables.map((v) => (
                  <tr key={v.symbol} className="hover:bg-blue-50/40 transition">
                    <td className="py-2 px-3 font-bold text-blue-700">{v.symbol}</td>
                    <td className="py-2 px-2 text-slate-800 font-sans">{v.meaning}</td>
                    <td className="py-2 px-2">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-200">
                        {v.unit}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold font-mono">
                      {v.example_value || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Live Parameter Solver */}
        {activeTab === 'solver' && formula.calc_config && calcResult && (
          <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 mb-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 font-mono">
                <Calculator className="w-3.5 h-3.5 text-amber-700" />
                Live Parameter Solver (Real-Time Reactive)
              </h4>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-extrabold">
                Active Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {formula.calc_config.inputs.map((inp) => (
                <div key={inp.symbol}>
                  <label className="block text-[11px] text-slate-700 font-mono mb-1 font-semibold truncate">
                    {inp.name} <span className="text-slate-500 font-normal">({inp.unit})</span>
                  </label>
                  <input
                    type="number"
                    step={inp.step || 0.1}
                    min={inp.min}
                    max={inp.max}
                    value={calcInputs[inp.symbol] ?? inp.defaultVal}
                    onChange={(e) => handleCalcChange(inp.symbol, parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
                  />
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-amber-300 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">
                  Instant Output
                </span>
                <span className="text-base sm:text-lg font-black text-amber-900 font-mono">
                  {calcResult.formatted}
                </span>
              </div>
              {calcResult.note && (
                <div className="text-[11px] text-slate-600 sm:max-w-[240px] sm:text-right font-sans font-medium">
                  {calcResult.note}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Solved Industrial Example */}
        {activeTab === 'example' && formula.examples && formula.examples.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-3 mb-4 shadow-2xs">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-900 font-display text-xs">
                {formula.examples[0].title}
              </h4>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Problem Statement:</span>
              <p className="text-slate-700 leading-relaxed font-sans">{formula.examples[0].problem_statement}</p>
            </div>

            <div>
              <span className="font-bold text-blue-700 block mb-1">Step-by-Step Numerical Breakdown:</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-800 font-mono text-[11px]">
                {formula.examples[0].steps.map((step, idx) => (
                  <li key={idx} className="leading-snug">{step}</li>
                ))}
              </ol>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono font-bold text-emerald-700">
              <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                Final Result: {formula.examples[0].final_answer}
              </span>
            </div>

            <div className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              💡 <span className="font-bold text-slate-900">Engineering Takeaway:</span> {formula.examples[0].engineering_interpretation}
            </div>
          </div>
        )}

        {/* Tab 4: Theory, Assumptions & Traps */}
        {activeTab === 'theory' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-3 mb-4 shadow-2xs">
            <div>
              <span className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Physical Assumptions:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {formula.assumptions.map((assump, idx) => (
                  <li key={idx}>{assump}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Exam &amp; Shop-Floor Traps to Avoid:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {formula.common_mistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>

            {formula.sources && formula.sources.length > 0 && (
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                📚 Verified Source: <span className="text-slate-800 font-bold">{formula.sources[0].title}</span> by {formula.sources[0].author} ({formula.sources[0].edition}, Page {formula.sources[0].page}).
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3.5 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
        <Link
          href={`/formulas/${formula.slug}`}
          className="text-slate-700 hover:text-blue-600 font-bold transition flex items-center gap-1"
        >
          <span>Full Theory &amp; Notes</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        {formula.lesson_links && formula.lesson_links.length > 0 && (
          <Link
            href={`/lessons/${formula.lesson_links[0].lesson_id}`}
            className="flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg transition shadow-2xs"
          >
            <span>Curriculum Lesson</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>
    </article>
  )
}
