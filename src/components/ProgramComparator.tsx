'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Program } from './EducationDashboard'
import {
  Scale, RotateCcw, MapPin, DollarSign, Clock,
  ListChecks, CheckCircle, ExternalLink, ArrowRight,
  ArrowLeftRight, Sparkles, Award, Compass,
  Building2, GraduationCap, FileText
} from 'lucide-react'

interface Props {
  programs: Program[]
}

export default function ProgramComparator({ programs }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const prefA = searchParams.get('prefA')
  const prefB = searchParams.get('prefB')

  const [polyA, setPolyA] = useState<Program | null>(null)
  const [polyB, setPolyB] = useState<Program | null>(null)

  // Initialize selected programs from URL query parameters or default to top 2 programs
  useEffect(() => {
    if (prefA) {
      const match = programs.find(p => p.slug === prefA)
      if (match) setPolyA(match)
    } else if (programs.length > 0 && !polyA) {
      setPolyA(programs[0])
    }

    if (prefB) {
      const match = programs.find(p => p.slug === prefB)
      if (match) setPolyB(match)
    } else if (programs.length > 1 && !polyB) {
      setPolyB(programs[1])
    }
  }, [prefA, prefB, programs])

  // Update query parameters when selection changes
  const updateUrlParams = (newPolyA: Program | null, newPolyB: Program | null) => {
    const params = new URLSearchParams()
    if (newPolyA) params.set('prefA', newPolyA.slug)
    if (newPolyB) params.set('prefB', newPolyB.slug)
    router.replace(`/education/compare?${params.toString()}`)
  }

  const handleSelectA = (prog: Program) => {
    setPolyA(prog)
    updateUrlParams(prog, polyB)
  }

  const handleSelectB = (prog: Program) => {
    setPolyB(prog)
    updateUrlParams(polyA, prog)
  }

  const handleSwap = () => {
    const tempA = polyA
    const tempB = polyB
    setPolyA(tempB)
    setPolyB(tempA)
    updateUrlParams(tempB, tempA)
  }

  const reset = () => {
    setPolyA(null)
    setPolyB(null)
    router.replace('/education/compare')
  }

  // Filter options
  const optionsA = programs.filter(p => !polyB || p.id !== polyB.id)
  const optionsB = programs.filter(p => !polyA || p.id !== polyA.id)

  // Derive Notable Strength vs Academic Ranking
  const getRankAndStrength = (p: Program | null) => {
    if (!p) return { rank: '--', strength: '--' }
    const isRankNumeric = p.ranking && (p.ranking.toLowerCase().includes('rank') || p.ranking.toLowerCase().includes('nirf') || p.ranking.toLowerCase().includes('#') || p.ranking.toLowerCase().includes('top'))
    if (isRankNumeric) {
      return {
        rank: p.ranking,
        strength: p.degree_type === 'B.Tech'
          ? 'Comprehensive Engineering Foundation, GATE XE-F Preparation & Higher Studies (M.Tech/MS)'
          : p.degree_type === 'Diploma'
          ? 'Industrial Shop-Floor Tooling, CAD/CAM Mould Design & Direct Plant Placements'
          : 'Advanced Material Synthesis & Polymer R&D Laboratory Practice'
      }
    }
    return {
      rank: 'Category Benchmarked (Specialized Technical Institute / Autonomous Center)',
      strength: p.ranking || 'Hands-on Processing & Tooling Apprenticeship'
    }
  }

  const rankA = getRankAndStrength(polyA)
  const rankB = getRankAndStrength(polyB)

  return (
    <div className="space-y-8">
      
      {/* ── 1. PROGRAM SELECTOR BAR (Clean White / Slate-200) ── */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Selector Program A */}
          <div className="flex-1 w-full space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Program A (Reference)
              </label>
              {polyA && (
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {polyA.degree_type}
                </span>
              )}
            </div>
            <select
              value={polyA?.id || ''}
              onChange={(e) => {
                const match = programs.find(p => p.id === e.target.value)
                if (match) handleSelectA(match)
              }}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-xs"
            >
              <option value="">-- Choose First Program --</option>
              {optionsA.map(p => (
                <option key={p.id} value={p.id}>{p.institution} — {p.name} ({p.degree_type})</option>
              ))}
            </select>
          </div>

          {/* ⇄ Swap Button */}
          <div className="flex items-center justify-center pt-2 md:pt-5">
            <button
              onClick={handleSwap}
              disabled={!polyA && !polyB}
              title="Swap Program A and Program B"
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 rounded-xl transition-all shadow-xs hover:rotate-180 duration-300 cursor-pointer disabled:opacity-40"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Selector Program B */}
          <div className="flex-1 w-full space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Program B (Comparison)
              </label>
              {polyB && (
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  {polyB.degree_type}
                </span>
              )}
            </div>
            <select
              value={polyB?.id || ''}
              onChange={(e) => {
                const match = programs.find(p => p.id === e.target.value)
                if (match) handleSelectB(match)
              }}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all shadow-xs"
            >
              <option value="">-- Choose Second Program --</option>
              {optionsB.map(p => (
                <option key={p.id} value={p.id}>{p.institution} — {p.name} ({p.degree_type})</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ── 2. DECISION SNAPSHOT & HELP ME CHOOSE PANEL ── */}
      {polyA && polyB && (
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 border border-blue-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Executive Decision Snapshot &amp; Recommendation
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase">
              Comparative Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
            {/* Structural Differences */}
            <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-2">
              <span className="font-mono font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-600" /> Key Structural Differences
              </span>
              <ul className="space-y-1.5 text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">{polyA.institution}:</strong> {polyA.duration} {polyA.degree_type} degree with annual fee of <strong className="text-slate-900">{polyA.fees_annual}</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">{polyB.institution}:</strong> {polyB.duration} {polyB.degree_type} degree with annual fee of <strong className="text-slate-900">{polyB.fees_annual}</strong>.
                  </span>
                </li>
              </ul>
            </div>

            {/* Help Me Choose */}
            <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-xs space-y-2">
              <span className="font-mono font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Which One Should You Choose?
              </span>
              <p className="text-slate-700 font-medium leading-relaxed">
                {polyA.degree_type === 'B.Tech' ? (
                  <>If you want a <strong>4-year engineering foundation</strong> for GATE XE-F, R&amp;D careers, or global masters (MS), choose <strong>{polyA.institution}</strong>. If you want <strong>hands-on factory toolroom training &amp; rapid placement</strong>, choose <strong>{polyB.institution}</strong>.</>
                ) : (
                  <>Choose <strong>{polyA.institution}</strong> for specialized regional manufacturing expertise, or <strong>{polyB.institution}</strong> for broader technical and academic flexibility.</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. COMPARISON TABLE (Clean Engineering Worksheet Layout) ── */}
      {!polyA && !polyB ? (
        <div className="border border-slate-200 bg-white p-12 text-center rounded-2xl shadow-sm">
          <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold text-slate-800 mb-2">Select Two Programs to Compare</h3>
          <p className="text-slate-500 font-mono text-xs max-w-md mx-auto">
            Choose two academic degrees in the dropdowns above to compare tuition fees, ranking metrics, eligibility, and core processing curriculum highlights.
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
          
          {/* Table Header Row (Dark Navy Banner) */}
          <div className="grid grid-cols-12 bg-[#0A1628] text-white font-mono text-xs uppercase font-bold tracking-wider text-center py-4 px-4 divide-x divide-white/10 hidden md:grid">
            <div className="col-span-4 text-left pl-3 text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" /> Metric / Criterion
            </div>
            <div className="col-span-4 px-2 font-display text-sm font-bold text-white">
              {polyA?.institution || 'Slot A Empty'}
            </div>
            <div className="col-span-4 px-2 font-display text-sm font-bold text-white">
              {polyB?.institution || 'Slot B Empty'}
            </div>
          </div>

          {/* Table Rows (Clean Slate-50 / White Dividers) */}
          <div className="divide-y divide-slate-100">
            
            {/* Row 1: Program Title */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                🎓 Program Title
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5">
                {polyA ? (
                  <div className="space-y-1">
                    <div className="font-display font-bold text-slate-900 text-sm leading-snug">{polyA.name}</div>
                    <span className="text-[11px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-blue-800 font-mono font-bold inline-block">
                      {polyA.degree_type} Degree
                    </span>
                  </div>
                ) : <span className="text-slate-400 font-mono text-xs">No Selection</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5">
                {polyB ? (
                  <div className="space-y-1">
                    <div className="font-display font-bold text-slate-900 text-sm leading-snug">{polyB.name}</div>
                    <span className="text-[11px] bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md text-indigo-800 font-mono font-bold inline-block">
                      {polyB.degree_type} Degree
                    </span>
                  </div>
                ) : <span className="text-slate-400 font-mono text-xs">No Selection</span>}
              </div>
            </div>

            {/* Row 2: Location */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Campus Location
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs font-medium text-slate-700">
                {polyA ? `${polyA.location}, ${polyA.country}` : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs font-medium text-slate-700">
                {polyB ? `${polyB.location}, ${polyB.country}` : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 3: Duration */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Course Duration
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs font-bold text-slate-900 font-mono">
                {polyA ? polyA.duration : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs font-bold text-slate-900 font-mono">
                {polyB ? polyB.duration : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 4: Annual Fees */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Annual Tuition Fees
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5">
                {polyA ? (
                  <div className="text-sm font-black text-slate-950 font-mono">
                    {polyA.fees_annual}
                    <span className="text-[10px] font-normal text-slate-500 block">Tuition per academic year</span>
                  </div>
                ) : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5">
                {polyB ? (
                  <div className="text-sm font-black text-slate-950 font-mono">
                    {polyB.fees_annual}
                    <span className="text-[10px] font-normal text-slate-500 block">Tuition per academic year</span>
                  </div>
                ) : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 5A: National Ranking (Numeric Benchmark) */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                🏆 National Benchmark / NIRF
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 font-semibold leading-relaxed">
                {rankA.rank}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 font-semibold leading-relaxed">
                {rankB.rank}
              </div>
            </div>

            {/* Row 5B: Notable Institutional Strength (Qualitative) */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                🎯 Notable Domain Strength
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 font-medium leading-relaxed">
                {rankA.strength}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 font-medium leading-relaxed">
                {rankB.strength}
              </div>
            </div>

            {/* Row 6: Admission Process */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                <ListChecks className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Admission Pathway
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 leading-relaxed font-semibold">
                {polyA?.admission_process || <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 leading-relaxed font-semibold">
                {polyB?.admission_process || <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 7: Eligibility */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Academic Eligibility
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 leading-relaxed font-medium">
                {polyA?.eligibility || <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 text-xs text-slate-700 leading-relaxed font-medium">
                {polyB?.eligibility || <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 8: Curriculum Highlights */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                📚 Curriculum Highlights
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 space-y-1.5">
                {polyA?.curriculum_highlights ? polyA.curriculum_highlights.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                )) : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 space-y-1.5">
                {polyB?.curriculum_highlights ? polyB.curriculum_highlights.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                )) : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 9: Actions & Trust Metadata */}
            <div className="grid grid-cols-12 py-5 px-4 divide-y divide-slate-100 md:divide-y-0 md:divide-x md:divide-slate-100 bg-slate-50/80">
              <div className="col-span-12 md:col-span-4 font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex flex-col justify-center space-y-1 bg-slate-100 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none">
                <span>🔗 Program Action</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">Data verified: Sept 2026</span>
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 flex flex-col sm:flex-row gap-2">
                {polyA ? (
                  <>
                    <Link
                      href={`/education/${polyA.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold border border-slate-900 px-4 py-2.5 uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-xl shadow-xs"
                    >
                      View Program <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {polyA.website_url && (
                      <a
                        href={polyA.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 border border-slate-300 px-3 py-2.5 rounded-xl bg-white text-slate-700 hover:text-slate-950 hover:border-slate-400 transition-colors font-mono text-xs"
                        title="Visit Official Institution Website"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </>
                ) : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-5 flex flex-col sm:flex-row gap-2">
                {polyB ? (
                  <>
                    <Link
                      href={`/education/${polyB.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold border border-slate-900 px-4 py-2.5 uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-xl shadow-xs"
                    >
                      View Program <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {polyB.website_url && (
                      <a
                        href={polyB.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 border border-slate-300 px-3 py-2.5 rounded-xl bg-white text-slate-700 hover:text-slate-950 hover:border-slate-400 transition-colors font-mono text-xs"
                        title="Visit Official Institution Website"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </>
                ) : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Reset Toolbar */}
      {(polyA || polyB) && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold border border-slate-300 px-5 py-2.5 uppercase bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-all rounded-xl shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset Comparison
          </button>
        </div>
      )}

    </div>
  )
}
