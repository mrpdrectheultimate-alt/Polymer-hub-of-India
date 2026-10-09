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
  { slug: 'mould-design', name: 'Mould & Die Design' },
  { slug: 'polymer-rheology', name: 'Polymer Rheology & Melt Flow' },
  { slug: 'polymer-testing', name: 'Polymer Testing & Quality Control' },
  { slug: 'plastic-packaging-engineering', name: 'Plastic Packaging Engineering' },
  { slug: 'sustainable-plastics', name: 'Sustainable Plastics & Circular Economy' },
  { slug: 'recycling-technology', name: 'Recycling Technology & Processing' },
  { slug: 'rubber-technology', name: 'Rubber & Elastomer Technology' },
  { slug: 'polymer-composites', name: 'Polymer Composites & Fiber Engineering' },
  { slug: 'additives-compounding', name: 'Additives & Compounding Technology' },
  { slug: 'life-cycle-assessment', name: 'Life Cycle Assessment (LCA)' },
  { slug: 'color-science-masterbatches', name: 'Color Science & Masterbatch Technology' },
  { slug: 'entrepreneurship-plastics', name: 'Plastics Entrepreneurship & Factory Setup' },
  { slug: 'medical-plastics', name: 'Medical Plastics & Biocompatibility' },
  { slug: 'digital-twins-plastics', name: 'Digital Twins, Industry 4.0 & AI' },
  { slug: 'bioprocessing-fermentation', name: 'Bioprocessing & Microbial Fermentation' },
  { slug: 'robotics-plastics', name: 'Robotics & Automation in Plastics' },
  { slug: 'polymer-nanotechnology', name: 'Polymer Nanotechnology & Nanocomposites' }
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner & Hero Header */}
      <section className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-5 uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            PolymerHub Engineering Knowledge Layer · GATE 2026 Ready
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4 font-display">
            Master Polymer Science &amp; Engineering <br />
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 bg-clip-text text-transparent">
              Canonical Formula Library &amp; Solvers
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed mb-8 font-normal">
            Every mathematical relation, kinetic equation, rheological model, and shop-floor parameter mapped across all 216 curriculum lessons. KaTeX rendered, dimensionally verified, and backed by industrial worked examples.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-3xl font-black text-blue-700 font-display">19</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">Curriculum Subjects</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-3xl font-black text-emerald-700 font-display">216</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">Mapped Lessons</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-3xl font-black text-purple-700 font-display">GATE</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">XE-F Syllabus Aligned</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-xs">
              <div className="text-3xl font-black text-amber-700 font-display">100%</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">Worked Shop Examples</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Search & Multi-Filter Panel */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm space-y-5">
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search formulas, LaTeX symbols (e.g., Xn, Tg, OTR, tau), keywords, or lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 transition shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1.5 w-full md:w-auto justify-center">
              <button
                onClick={() => setActiveView('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeView === 'cards'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Formula Cards
              </button>
              <button
                onClick={() => setActiveView('calculators')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeView === 'calculators'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                Interactive Solvers
              </button>
              <button
                onClick={() => setActiveView('cheatsheet')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeView === 'cheatsheet'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                GATE Cheat Sheet
              </button>
            </div>
          </div>

          {/* Secondary Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-200 text-xs">
            {/* Subject Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Subject ({SUBJECT_OPTIONS.length - 1})
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Taxonomy Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as FormulaType | 'ALL')}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Difficulty Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as FormulaDifficulty | 'ALL')}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                {DIFFICULTY_LEVELS.map((lvl) => (
                  <option key={lvl.code} value={lvl.code}>
                    {lvl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GATE Toggle */}
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="gateToggle"
                checked={isGateOnly}
                onChange={(e) => setIsGateOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="gateToggle" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-600" /> GATE 2026 Only
              </label>
            </div>

            {/* Shopfloor Toggle */}
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="shopfloorToggle"
                checked={isShopfloorOnly}
                onChange={(e) => setIsShopfloorOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="shopfloorToggle" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" /> Shop-Floor Only
              </label>
            </div>
          </div>
        </div>

        {/* Results Header Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-600 font-medium">
          <div>
            Showing <span className="font-extrabold text-blue-700 font-mono text-sm">{filteredFormulas.length}</span> verified formulas
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
              className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
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
          <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 font-display">
                  <FileText className="w-5 h-5 text-blue-600" />
                  GATE 2026 XE-F &amp; CIPET Master Revision Matrix
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  High-density formula cheat sheet for rapid exam revision and plant floor reference.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase">
                    <th className="p-3 pl-4">ID</th>
                    <th className="p-3">Formula Name</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Equation</th>
                    <th className="p-3">Key Variables</th>
                    <th className="p-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredFormulas.map((item) => (
                    <tr key={item.formula_id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 pl-4 font-mono font-bold text-blue-700 text-[11px]">
                        {item.formula_id}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3 font-mono text-slate-600 font-medium">{item.subject_name}</td>
                      <td className="p-3 font-mono text-purple-700 font-bold">{item.type_code}</td>
                      <td className="p-3 font-mono font-bold text-slate-900 bg-slate-50 rounded">
                        {item.equation_display}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500 max-w-xs">
                        {item.variables.map((v) => `${v.symbol} (${v.unit})`).join(', ')}
                      </td>
                      <td className="p-3 pr-4">
                        <Link
                          href={`/formulas/${item.slug}`}
                          className="text-blue-600 hover:underline font-mono text-[11px] font-bold"
                        >
                          Detail &rarr;
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
