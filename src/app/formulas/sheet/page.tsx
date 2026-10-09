'use client'

import Link from 'next/link'
import { Printer, ArrowLeft, BookOpen, Award, FileText } from 'lucide-react'
import Footer from '@/components/Footer'
import { MASTER_CANONICAL_FORMULAS } from '@/lib/formulas/formulas-data'
import { renderFormulaLatex } from '@/lib/formulas/katex-config'

export default function FormulaSheetPage() {
  const gateFormulas = MASTER_CANONICAL_FORMULAS.filter((f) => f.is_gate)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition font-mono uppercase tracking-wider cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Sheet Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-700">
              Total Syllabus Formulas: {MASTER_CANONICAL_FORMULAS.length} ({gateFormulas.length} GATE XE-F Tagged)
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-medium">PolymerHub Official Curriculum Sheet</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase">
                  <th className="p-3 pl-4">ID</th>
                  <th className="p-3">Formula Name</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Canonical Math Equation</th>
                  <th className="p-3 pr-4">Variable Definitions &amp; SI Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {MASTER_CANONICAL_FORMULAS.map((item) => (
                  <tr key={item.formula_id} className="hover:bg-slate-50 transition">
                    <td className="p-3 pl-4 font-mono font-bold text-blue-700 text-[11px]">
                      {item.formula_id}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      <Link href={`/formulas/${item.slug}`} className="hover:text-blue-600 transition">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-3 font-mono text-slate-600 text-[11px]">{item.subject_name}</td>
                    <td className="p-3 font-mono text-purple-700 font-bold text-[11px]">{item.type_code}</td>
                    <td className="p-3 font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      {item.equation_display}
                    </td>
                    <td className="p-3 pr-4 font-mono text-[11px] text-slate-500 max-w-sm">
                      {item.variables.map((v) => `${v.symbol} (${v.unit})`).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
