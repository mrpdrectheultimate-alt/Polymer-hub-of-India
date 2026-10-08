'use client'

import Link from 'next/link'
import { Printer, ArrowLeft, BookOpen, Award, FileText } from 'lucide-react'
import Footer from '@/components/Footer'
import { MASTER_CANONICAL_FORMULAS } from '@/lib/formulas/formulas-data'
import { renderFormulaLatex } from '@/lib/formulas/katex-config'

export default function FormulaSheetPage() {
  const gateFormulas = MASTER_CANONICAL_FORMULAS.filter((f) => f.is_gate)

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <div className="bg-[#081225] border-b border-slate-800 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/formulas"
              className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 font-mono mb-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Formula Library
            </Link>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <FileText className="w-7 h-7 text-amber-400" />
              GATE 2026 XE-F & CIPET Master Revision Formula Sheet
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              High-density subject-wise formula cheat sheet for rapid exam revision & shop-floor reference.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg transition"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Sheet Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="bg-[#081225] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400">
              Total Syllabus Formulas: {MASTER_CANONICAL_FORMULAS.length} ({gateFormulas.length} GATE XE-F Tagged)
            </span>
            <span className="text-[11px] font-mono text-slate-400">PolymerHub Official Curriculum Sheet</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-[#040A17] border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="p-3 pl-4">ID</th>
                  <th className="p-3">Formula Name</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Canonical Math Equation</th>
                  <th className="p-3 pr-4">Variable Definitions & SI Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {MASTER_CANONICAL_FORMULAS.map((item) => (
                  <tr key={item.formula_id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 pl-4 font-mono font-bold text-amber-400 text-[11px]">
                      {item.formula_id}
                    </td>
                    <td className="p-3 font-bold text-white">
                      <Link href={`/formulas/${item.slug}`} className="hover:text-amber-300 transition">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-3 font-mono text-blue-400 text-[11px]">{item.subject_name}</td>
                    <td className="p-3 font-mono text-purple-400 font-bold text-[11px]">{item.type_code}</td>
                    <td className="p-3 font-mono font-bold text-amber-300 bg-slate-950/40 rounded">
                      {item.equation_display}
                    </td>
                    <td className="p-3 pr-4 font-mono text-[11px] text-slate-400 max-w-sm">
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
