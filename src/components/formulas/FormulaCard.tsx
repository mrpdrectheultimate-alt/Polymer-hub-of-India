'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Copy, 
  Check, 
  BookOpen, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  Layers, 
  ArrowRight,
  Sparkles,
  Bookmark,
  Wrench,
  Award,
  ExternalLink
} from 'lucide-react'
import { Formula } from '@/types/formulas'
import { renderFormulaLatex, getFormulaAccessibleLabel } from '@/lib/formulas/katex-config'

interface FormulaCardProps {
  formula: Formula
  onSaveToggle?: (id: string) => void
  isSaved?: boolean
}

export function FormulaCard({ formula, onSaveToggle, isSaved = false }: FormulaCardProps) {
  const [copied, setCopied] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [calcInputs, setCalcInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    if (formula.calc_config) {
      formula.calc_config.inputs.forEach((inp) => {
        initial[inp.symbol] = inp.defaultVal
      })
    }
    return initial
  })

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(formula.equation_latex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCalcChange = (symbol: string, val: number) => {
    setCalcInputs((prev) => ({ ...prev, [symbol]: val }))
  }

  const calcResult = formula.calc_config ? formula.calc_config.calculate(calcInputs) : null

  return (
    <article
      className="bg-[#081225] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition group relative"
      aria-label={getFormulaAccessibleLabel(formula)}
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-950/80 text-amber-300 border border-amber-800/80 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
              {formula.type_code} · {formula.type_label}
            </span>
            <span className="bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded">
              {formula.subject_name}
            </span>
            {formula.is_gate && (
              <span className="bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-400" />
                GATE 2026
              </span>
            )}
            {formula.is_shopfloor && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Wrench className="w-3 h-3 text-emerald-400" />
                Shop-Floor
              </span>
            )}
          </div>

          <button
            onClick={() => onSaveToggle?.(formula.formula_id)}
            className={`p-1.5 rounded-lg border transition ${
              isSaved
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Formula'}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
          <Link href={`/formulas/${formula.slug}`}>{formula.name}</Link>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {formula.description}
        </p>

        {/* KaTeX Math Equation Render Box */}
        <div className="bg-[#040A17] border border-blue-900/60 rounded-xl p-4 my-3 text-center overflow-x-auto shadow-inner">
          <div
            className="katex-rendered text-lg sm:text-xl font-bold tracking-wide text-amber-300 select-all"
            dangerouslySetInnerHTML={{ __html: renderFormulaLatex(formula.equation_latex) }}
          />
        </div>

        {/* When to Use */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 my-3 text-xs">
          <span className="font-bold text-slate-200 block mb-1">💡 When to Use:</span>
          <p className="text-slate-300 leading-relaxed">{formula.when_to_use}</p>
        </div>

        {/* Variables Table */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Variable Symbols & SI Units
          </h4>
          <div className="bg-[#040A17] border border-slate-800/80 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="p-2 pl-3">Symbol</th>
                  <th className="p-2">Variable Meaning</th>
                  <th className="p-2 pr-3">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                {formula.variables.map((v) => (
                  <tr key={v.symbol} className="hover:bg-slate-900/40">
                    <td className="p-2 pl-3 font-bold text-amber-300">{v.symbol}</td>
                    <td className="p-2 text-slate-200 font-sans">{v.meaning}</td>
                    <td className="p-2 pr-3 text-slate-400">{v.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Calculator Drawer (if configured) */}
        {formula.calc_config && calcResult && (
          <div className="bg-[#050E1F] border border-amber-500/30 rounded-xl p-4 mb-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                Live Parameter Solver
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                Executable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {formula.calc_config.inputs.map((inp) => (
                <div key={inp.symbol}>
                  <label className="block text-[11px] text-slate-300 font-mono mb-1">
                    {inp.name} ({inp.unit})
                  </label>
                  <input
                    type="number"
                    step={inp.step || 0.1}
                    min={inp.min}
                    max={inp.max}
                    value={calcInputs[inp.symbol] ?? inp.defaultVal}
                    onChange={(e) => handleCalcChange(inp.symbol, parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#020612] border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              ))}
            </div>

            <div className="bg-[#020612] border border-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Computed Result</span>
                <span className="text-base font-extrabold text-amber-300 font-mono">
                  {calcResult.formatted}
                </span>
              </div>
              {calcResult.note && (
                <div className="text-[10px] text-slate-300 max-w-[200px] text-right font-sans">
                  {calcResult.note}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Worked Example Accordion */}
        {formula.examples && formula.examples.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden mb-4">
            <button
              onClick={() => setShowExample(!showExample)}
              className="w-full bg-slate-900/60 hover:bg-slate-800/80 px-4 py-2.5 text-left text-xs font-bold text-slate-200 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Solved Industrial Example: {formula.examples[0].title}
              </span>
              {showExample ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showExample && (
              <div className="p-4 bg-[#040A17] text-xs space-y-3 border-t border-slate-800">
                <div>
                  <span className="font-bold text-amber-400 block mb-1">Problem Statement:</span>
                  <p className="text-slate-300 leading-relaxed">{formula.examples[0].problem_statement}</p>
                </div>

                <div>
                  <span className="font-bold text-blue-400 block mb-1">Step-by-Step Solution:</span>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                    {formula.examples[0].steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono font-bold text-emerald-400">
                  <span>Answer: {formula.examples[0].final_answer}</span>
                </div>

                <div className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2.5 rounded border border-slate-800">
                  💡 <span className="font-bold text-slate-300">Engineering Interpretation:</span> {formula.examples[0].engineering_interpretation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={handleCopyLatex}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-mono"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy LaTeX</span>
            </>
          )}
        </button>

        {formula.lesson_links && formula.lesson_links.length > 0 && (
          <Link
            href={`/lessons/${formula.lesson_links[0].lesson_id}`}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            <span>Open Lesson</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </article>
  )
}
