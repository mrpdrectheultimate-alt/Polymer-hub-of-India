'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Wrench, 
  Copy, 
  Check, 
  GraduationCap, 
  Layers, 
  ExternalLink, 
  HelpCircle, 
  AlertTriangle,
  FileText,
  Calculator
} from 'lucide-react'
import Footer from '@/components/Footer'
import { getFormulaBySlug } from '@/lib/formulas/formulas-search'
import { renderFormulaLatex, getFormulaAccessibleLabel } from '@/lib/formulas/katex-config'
import { useState } from 'react'

export default function FormulaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const formula = getFormulaBySlug(slug)
  const [copied, setCopied] = useState(false)

  if (!formula) {
    notFound()
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(formula.equation_latex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <div className="bg-[#081225] border-b border-slate-800 pt-24 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/formulas"
            className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 font-mono mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Formula Library
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[11px] font-bold px-3 py-0.5 rounded uppercase">
              {formula.type_code} · {formula.type_label}
            </span>
            <span className="bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[11px] font-bold px-3 py-0.5 rounded">
              {formula.subject_name}
            </span>
            {formula.is_gate && (
              <span className="bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                GATE 2026 Syllabus
              </span>
            )}
            {formula.is_shopfloor && (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                Shop-Floor Standard
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{formula.name}</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {formula.description}
          </p>
        </div>
      </div>

      {/* Main Formula Content Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* KaTeX Equation Render Card */}
        <section className="bg-[#081225] border border-blue-900/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Mathematical Canonical Relation
            </span>
            <button
              onClick={handleCopyLatex}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition font-mono"
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
          </div>

          <div className="bg-[#040A17] border border-slate-800 rounded-xl p-6 text-center overflow-x-auto my-2">
            <div
              className="text-2xl sm:text-3xl font-bold text-amber-300 tracking-wide select-all"
              dangerouslySetInnerHTML={{ __html: renderFormulaLatex(formula.equation_latex) }}
            />
          </div>

          <div className="mt-3 text-xs text-slate-400 font-mono text-center">
            Plain Formula: <span className="text-amber-400 font-bold">{formula.equation_display}</span>
          </div>
        </section>

        {/* When to Use & Physical Guidance */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#081225] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              When & Where to Apply
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{formula.when_to_use}</p>
          </div>

          <div className="bg-[#081225] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Common Engineering Pitfalls
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
              {formula.common_mistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Physical Assumptions & Limitations */}
        <section className="bg-[#081225] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Physical Assumptions & Validity Limits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-300">
            {formula.assumptions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Variable Legend & Dimensions Table */}
        <section className="bg-[#081225] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Variable Symbols, SI Units & Dimensional Specifications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-[#040A17] border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                  <th className="p-3 pl-4">Symbol</th>
                  <th className="p-3">Variable Meaning</th>
                  <th className="p-3">SI Unit</th>
                  <th className="p-3 pr-4">Typical Industrial Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {formula.variables.map((v) => (
                  <tr key={v.symbol} className="hover:bg-slate-900/40">
                    <td className="p-3 pl-4 font-bold text-amber-300">{v.symbol}</td>
                    <td className="p-3 text-slate-200 font-sans">{v.meaning}</td>
                    <td className="p-3 text-slate-400">{v.unit}</td>
                    <td className="p-3 pr-4 text-emerald-400">{v.example_value || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-step Solved Industrial Example */}
        {formula.examples && formula.examples.length > 0 && (
          <section className="bg-[#081225] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Worked Industrial Numerical Example: {formula.examples[0].title}
            </h3>

            <div className="bg-[#040A17] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
              <div>
                <span className="font-bold text-amber-400 block mb-1">Problem Statement:</span>
                <p className="text-slate-300 leading-relaxed">{formula.examples[0].problem_statement}</p>
              </div>

              <div>
                <span className="font-bold text-blue-400 block mb-1.5">Step-by-Step Numerical Solution:</span>
                <ol className="list-decimal list-inside space-y-1.5 font-mono text-slate-300 text-[11px]">
                  {formula.examples[0].steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono font-bold text-emerald-400 text-sm">
                <span>Final Answer: {formula.examples[0].final_answer}</span>
              </div>

              <div className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-lg border border-slate-800 font-sans">
                💡 <span className="font-bold text-white">Engineering Interpretation:</span> {formula.examples[0].engineering_interpretation}
              </div>
            </div>
          </section>
        )}

        {/* Literature & Authoritative References */}
        {formula.sources && formula.sources.length > 0 && (
          <section className="bg-[#081225] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Authoritative Technical Reference & Source Provenance
            </h3>
            <div className="space-y-2 text-xs font-mono text-slate-300">
              {formula.sources.map((src, idx) => (
                <div key={idx} className="bg-[#040A17] border border-slate-800 rounded-lg p-3">
                  <span className="text-amber-400 font-bold">{src.title}</span> by {src.author} ({src.publisher}, {src.year}), {src.edition}, Page {src.page}.
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Connected Curriculum Lessons */}
        {formula.lesson_links && formula.lesson_links.length > 0 && (
          <section className="bg-[#081225] border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Connected Curriculum Lesson</span>
              <h4 className="text-base font-bold text-white">{formula.lesson_links[0].lesson_name}</h4>
            </div>
            <Link
              href={`/lessons/${formula.lesson_links[0].lesson_id}`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
            >
              <span>Study Full Lesson</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
