'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, 
  Search, 
  BookOpen, 
  Sparkles, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ArrowRight, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Award,
  Wrench,
  Printer,
  Bookmark,
  Filter,
  RefreshCw
} from 'lucide-react'
import Footer from '@/components/Footer'
import { FormulaCard } from '@/components/formulas/FormulaCard'
import { MASTER_CANONICAL_FORMULAS } from '@/lib/formulas/formulas-data'
import { filterFormulas } from '@/lib/formulas/formulas-search'
import { FormulaType, FormulaDifficulty } from '@/types/formulas'

const SUBJECT_OPTIONS = [
  { slug: 'all', name: 'All 19 Subjects' },
  { slug: 'polymer-chemistry', name: 'Polymer Chemistry' },
  { slug: 'polymer-processing', name: 'Polymer Processing' },
  { slug: 'polymer-testing', name: 'Polymer Testing & Characterization' },
  { slug: 'mould-design', name: 'Mould & Die Design' },
  { slug: 'rubber-technology', name: 'Rubber & Elastomer Technology' },
  { slug: 'plastic-packaging', name: 'Plastic Packaging Technology' },
  { slug: 'polymer-composites', name: 'Polymer Composites & Fiber Engineering' },
  { slug: 'sustainable-plastics', name: 'Sustainable Plastics & Circular Economy' },
  { slug: 'color-science-masterbatch', name: 'Color Science & Spectrophotometry' },
  { slug: 'entrepreneurship-plastics', name: 'Entrepreneurship & Factory Setup' },
  { slug: 'polymer-rheology', name: 'Polymer Rheology & Melt Flow' },
  { slug: 'bioprocessing-biopolymers', name: 'Bioprocessing & Biopolymers' }
]

const TAXONOMY_TYPES: { code: FormulaType | 'ALL'; name: string }[] = [
  { code: 'ALL', name: 'All Types (T1–T12)' },
  { code: 'T1', name: 'T1 · Definition / Identity' },
  { code: 'T2', name: 'T2 · Thermodynamics' },
  { code: 'T3', name: 'T3 · Kinetics / Rate' },
  { code: 'T4', name: 'T4 · Rheology / Flow' },
  { code: 'T5', name: 'T5 · Processing / Machine' },
  { code: 'T6', name: 'T6 · Mechanics / Strength' },
  { code: 'T7', name: 'T7 · Transport / Barrier' },
  { code: 'T8', name: 'T8 · Composites' },
  { code: 'T9', name: 'T9 · Testing / Standards' },
  { code: 'T10', name: 'T10 · Statistics / Quality' },
  { code: 'T11', name: 'T11 · Sustainability / LCA' },
  { code: 'T12', name: 'T12 · Control / Automation' }
]

const DIFFICULTY_LEVELS: { code: FormulaDifficulty | 'ALL'; name: string }[] = [
  { code: 'ALL', name: 'All Levels' },
  { code: 'foundation', name: '🟢 Foundation' },
  { code: 'intermediate', name: '🔵 Intermediate' },
  { code: 'advanced', name: '🟠 Advanced' },
  { code: 'research', name: '🔴 Research / Professional' }
]

export default function FormulasMasterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedType, setSelectedType] = useState<FormulaType | 'ALL'>('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState<FormulaDifficulty | 'ALL'>('ALL')
  const [isGateOnly, setIsGateOnly] = useState(false)
  const [isShopfloorOnly, setIsShopfloorOnly] = useState(false)
  const [activeView, setActiveView] = useState<'cards' | 'calculators' | 'cheatsheet'>('cards')
  const [savedFormulaIds, setSavedFormulaIds] = useState<string[]>([])

  // Filtered Formulas using Search Engine
  const filteredFormulas = useMemo(() => {
    return filterFormulas({
      query: searchQuery,
      subjectId: selectedSubject,
      typeCode: selectedType,
      difficulty: selectedDifficulty,
      isGateOnly,
      isShopfloorOnly
    })
  }, [searchQuery, selectedSubject, selectedType, selectedDifficulty, isGateOnly, isShopfloorOnly])

  const toggleSaveFormula = (id: string) => {
    setSavedFormulaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner & Hero Header */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-[#091327] via-[#050C1A] to-[#030712] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold mb-6 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            PolymerHub Engineering Knowledge Layer · GATE 2026 Ready
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Master Polymer Science & Engineering <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Canonical Formula Library & Solvers
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Every mathematical relation, kinetic equation, rheological model, and shop-floor parameter mapped across all 216 curriculum lessons. KaTeX rendered, dimensionally verified, and backed by industrial worked examples.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
            <div className="bg-[#0B172E]/80 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-amber-400 font-mono">19</div>
              <div className="text-xs text-slate-400 font-medium">Curriculum Subjects</div>
            </div>
            <div className="bg-[#0B172E]/80 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-blue-400 font-mono">216</div>
              <div className="text-xs text-slate-400 font-medium">Mapped Lessons</div>
            </div>
            <div className="bg-[#0B172E]/80 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-purple-400 font-mono">GATE</div>
              <div className="text-xs text-slate-400 font-medium">XE-F Syllabus Aligned</div>
            </div>
            <div className="bg-[#0B172E]/80 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 font-medium">Worked Shop Examples</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Search & Multi-Filter Panel */}
        <div className="bg-[#081225] border border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 shadow-xl space-y-5">
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search formulas, LaTeX symbols (e.g., Xn, Tg, OTR, tau), keywords, or lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#040A17] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#040A17] border border-slate-800 rounded-xl p-1.5 w-full md:w-auto justify-center">
              <button
                onClick={() => setActiveView('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeView === 'cards'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Formula Cards
              </button>
              <button
                onClick={() => setActiveView('calculators')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeView === 'calculators'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Interactive Solvers
              </button>
              <button
                onClick={() => setActiveView('cheatsheet')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeView === 'cheatsheet'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                GATE Cheat Sheet
              </button>
            </div>
          </div>

          {/* Secondary Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            {/* Subject Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-[#040A17] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type T1-T12 */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Taxonomy Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as FormulaType | 'ALL')}
                className="w-full bg-[#040A17] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {TAXONOMY_TYPES.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as FormulaDifficulty | 'ALL')}
                className="w-full bg-[#040A17] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {DIFFICULTY_LEVELS.map((lvl) => (
                  <option key={lvl.code} value={lvl.code}>
                    {lvl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GATE Toggle */}
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="gateToggle"
                checked={isGateOnly}
                onChange={(e) => setIsGateOnly(e.target.checked)}
                className="rounded border-slate-700 bg-[#040A17] text-amber-400 focus:ring-amber-400"
              />
              <label htmlFor="gateToggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
                GATE 2026 Only
              </label>
            </div>

            {/* Shopfloor Toggle */}
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="shopfloorToggle"
                checked={isShopfloorOnly}
                onChange={(e) => setIsShopfloorOnly(e.target.checked)}
                className="rounded border-slate-700 bg-[#040A17] text-emerald-400 focus:ring-emerald-400"
              />
              <label htmlFor="shopfloorToggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Shop-Floor Only
              </label>
            </div>
          </div>
        </div>

        {/* Results Header Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <div>
            Showing <span className="font-bold text-amber-400 font-mono">{filteredFormulas.length}</span> formulas
          </div>

          {(selectedSubject !== 'all' || selectedType !== 'ALL' || selectedDifficulty !== 'ALL' || isGateOnly || isShopfloorOnly || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedSubject('all')
                setSelectedType('ALL')
                setSelectedDifficulty('ALL')
                setIsGateOnly(false)
                setIsShopfloorOnly(false)
              }}
              className="text-amber-400 hover:text-amber-300 underline font-medium"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* ================= VIEW 1: FORMULA CARDS ================= */}
        {activeView === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFormulas.map((formula) => (
              <FormulaCard
                key={formula.formula_id}
                formula={formula}
                onSaveToggle={toggleSaveFormula}
                isSaved={savedFormulaIds.includes(formula.formula_id)}
              />
            ))}
          </div>
        )}

        {/* ================= VIEW 2: INTERACTIVE SOLVERS SUITE ================= */}
        {activeView === 'calculators' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFormulas
              .filter((f) => f.calc_config)
              .map((formula) => (
                <FormulaCard
                  key={formula.formula_id}
                  formula={formula}
                  onSaveToggle={toggleSaveFormula}
                  isSaved={savedFormulaIds.includes(formula.formula_id)}
                />
              ))}
          </div>
        )}

        {/* ================= VIEW 3: GATE REVISION CHEAT SHEET ================= */}
        {activeView === 'cheatsheet' && (
          <div className="bg-[#081225] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  GATE 2026 XE-F & CIPET Master Revision Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  High-density formula cheat sheet for rapid exam revision and plant floor reference.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white px-4 py-2 rounded-lg border border-slate-700 transition"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-[#040A17] border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="p-3 pl-4">ID</th>
                    <th className="p-3">Formula Name</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Equation</th>
                    <th className="p-3">Key Variables</th>
                    <th className="p-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredFormulas.map((item) => (
                    <tr key={item.formula_id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 pl-4 font-mono font-bold text-amber-400 text-[11px]">
                        {item.formula_id}
                      </td>
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3 font-mono text-blue-400">{item.subject_name}</td>
                      <td className="p-3 font-mono text-purple-400 font-bold">{item.type_code}</td>
                      <td className="p-3 font-mono font-bold text-amber-300 bg-slate-950/40 rounded">
                        {item.equation_display}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400 max-w-xs">
                        {item.variables.map((v) => `${v.symbol} (${v.unit})`).join(', ')}
                      </td>
                      <td className="p-3 pr-4">
                        <Link
                          href={`/formulas/${item.slug}`}
                          className="text-amber-400 hover:underline font-mono text-[11px]"
                        >
                          Detail →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
