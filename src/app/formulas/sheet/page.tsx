'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Printer, ArrowLeft, BookOpen, Award, FileText, Filter } from 'lucide-react'
import Footer from '@/components/Footer'
import { MASTER_CANONICAL_FORMULAS } from '@/lib/formulas/formulas-data'
import { renderFormulaLatex } from '@/lib/formulas/katex-config'

export default function FormulaSheetPage() {
  const [filterGateOnly, setFilterGateOnly] = useState(false)
  const gateCount = MASTER_CANONICAL_FORMULAS.filter((f) => f.is_gate).length
  const displayFormulas = filterGateOnly
    ? MASTER_CANONICAL_FORMULAS.filter((f) => f.is_gate)
    : MASTER_CANONICAL_FORMULAS

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white print:bg-white print:p-0">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-8 px-4 sm:px-6 lg:px-8 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/formulas"
              className="inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-mono mb-2 transition font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Formula Library
            </Link>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 font-display">
              <FileText className="w-7 h-7 text-blue-600" />
              GATE 2026 XE-F &amp; CIPET Master Revision Formula Sheet
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              High-density subject-wise formula cheat sheet for rapid exam revision &amp; shop-floor reference.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterGateOnly(!filterGateOnly)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                filterGateOnly
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
              }`}
            >
              <Award className="w-4 h-4 text-purple-600" />
              <span>{filterGateOnly ? 'Showing GATE Only' : 'Filter GATE XE-F'} ({gateCount})</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition font-mono uppercase tracking-wider cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Sheet Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8 print:max-w-full print:p-0 print:m-0">
        <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm print:border-none print:shadow-none">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:bg-white print:border-b-2 print:border-slate-900">
            <span className="text-xs font-mono font-bold text-blue-700 print:text-slate-900">
              Showing {displayFormulas.length} Formulas {filterGateOnly ? '(GATE XE-F Syllabus Filter)' : `(${gateCount} GATE XE-F Tagged)`}
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-medium print:text-slate-700">PolymerHub Official Curriculum Sheet</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase print:bg-slate-100 print:text-slate-900">
                  <th className="p-3 pl-4">ID</th>
                  <th className="p-3">Formula Name</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-center">Canonical Math Equation</th>
                  <th className="p-3 pr-4">Variable Definitions &amp; SI Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {displayFormulas.map((item) => (
                  <tr key={item.formula_id} className="hover:bg-slate-50 transition print:break-inside-avoid">
                    <td className="p-3 pl-4 font-mono font-bold text-blue-700 text-[11px]">
                      {item.formula_id}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      <Link href={`/formulas/${item.slug}`} className="hover:text-blue-600 transition print:no-underline">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-3 font-mono text-slate-600 text-[11px]">{item.subject_name}</td>
                    <td className="p-3 font-mono text-purple-700 font-bold text-[11px]">{item.type_code}</td>
                    <td className="p-3 bg-slate-50/70 border border-slate-200 rounded px-3 py-2 text-center min-w-[220px]">
                      <div
                        className="text-xs sm:text-sm font-semibold text-slate-900 select-all overflow-x-auto py-1"
                        dangerouslySetInnerHTML={{ __html: renderFormulaLatex(item.equation_latex) }}
                      />
                    </td>
                    <td className="p-3 pr-4 font-mono text-[11px] text-slate-600 max-w-sm">
                      {item.variables.map((v) => `${v.symbol} (${v.unit})`).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
