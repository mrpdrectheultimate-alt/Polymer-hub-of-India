'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Program } from './EducationDashboard'
import { Scale, RotateCcw, MapPin, DollarSign, Clock, ListChecks, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react'

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

  // Initialize selected programs from URL query parameters
  useEffect(() => {
    if (prefA) {
      const match = programs.find(p => p.slug === prefA)
      if (match) setPolyA(match)
    }
    if (prefB) {
      const match = programs.find(p => p.slug === prefB)
      if (match) setPolyB(match)
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

  const reset = () => {
    setPolyA(null)
    setPolyB(null)
    router.replace('/education/compare')
  }

  // Filter options to exclude currently selected program in the other slot
  const optionsA = programs.filter(p => !polyB || p.id !== polyB.id)
  const optionsB = programs.filter(p => !polyA || p.id !== polyA.id)

  return (
    <div className="space-y-8">
      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border-4 border-slate-900 p-6 rounded-xl shadow-[4px_4px_0px_0px_#000]">
        
        {/* Selector Program A */}
        <div className="space-y-2">
          <label className="font-mono text-[9px] font-black text-slate-500 uppercase tracking-widest block">
            Select Program A
          </label>
          <select
            value={polyA?.id || ''}
            onChange={(e) => {
              const match = programs.find(p => p.id === e.target.value)
              if (match) handleSelectA(match)
            }}
            className="w-full border-2 border-slate-900 rounded-lg p-3.5 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">-- Choose Program A --</option>
            {optionsA.map(p => (
              <option key={p.id} value={p.id}>{p.institution} — {p.name} ({p.degree_type})</option>
            ))}
          </select>
        </div>

        {/* Selector Program B */}
        <div className="space-y-2">
          <label className="font-mono text-[9px] font-black text-slate-500 uppercase tracking-widest block">
            Select Program B
          </label>
          <select
            value={polyB?.id || ''}
            onChange={(e) => {
              const match = programs.find(p => p.id === e.target.value)
              if (match) handleSelectB(match)
            }}
            className="w-full border-2 border-slate-900 rounded-lg p-3.5 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">-- Choose Program B --</option>
            {optionsB.map(p => (
              <option key={p.id} value={p.id}>{p.institution} — {p.name} ({p.degree_type})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Comparison Layout */}
      {!polyA && !polyB ? (
        <div className="border-4 border-slate-900 bg-white p-12 text-center rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <Scale className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-black text-slate-800 mb-2">Compare Polymer Programs</h3>
          <p className="text-slate-500 font-mono text-xs max-w-md mx-auto">
            Choose two academic degrees in the select dropdowns above to compare tuition fees, ranking metrics, eligibility, and core processing curriculum highlights.
          </p>
        </div>
      ) : (
        <div className="border-4 border-slate-900 bg-white rounded-xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          
          {/* Comparison Table Header */}
          <div className="grid grid-cols-12 border-b-4 border-slate-900 bg-slate-900 text-white font-mono text-xs uppercase font-black tracking-wider text-center py-4 px-4 divide-x-2 divide-white/10 hidden md:grid">
            <div className="col-span-4 text-left pl-2">Feature / Metric</div>
            <div className="col-span-4">{polyA?.institution || 'Slot A Empty'}</div>
            <div className="col-span-4">{polyB?.institution || 'Slot B Empty'}</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y-2 divide-slate-200">
            
            {/* Row 1: Program Name */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                🎓 Program Title
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 font-display font-black text-slate-850 text-sm">
                {polyA ? (
                  <div>
                    <div className="font-bold text-slate-800">{polyA.name}</div>
                    <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono mt-1 inline-block">
                      {polyA.degree_type}
                    </span>
                  </div>
                ) : <span className="text-slate-400 font-mono">No Selection</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 font-display font-black text-slate-850 text-sm">
                {polyB ? (
                  <div>
                    <div className="font-bold text-slate-800">{polyB.name}</div>
                    <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono mt-1 inline-block">
                      {polyB.degree_type}
                    </span>
                  </div>
                ) : <span className="text-slate-400 font-mono">No Selection</span>}
              </div>
            </div>

            {/* Row 2: Location */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Location
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs font-semibold text-slate-700">
                {polyA ? `${polyA.location}, ${polyA.country}` : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs font-semibold text-slate-700">
                {polyB ? `${polyB.location}, ${polyB.country}` : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 3: Duration */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" /> Duration
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs font-semibold text-slate-700 font-mono">
                {polyA ? polyA.duration : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs font-semibold text-slate-700 font-mono">
                {polyB ? polyB.duration : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 4: Annual Fees */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1" /> Annual Tuition Fees
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs font-black text-slate-800 font-mono">
                {polyA ? `${polyA.fees_annual}` : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs font-black text-slate-800 font-mono">
                {polyB ? `${polyB.fees_annual}` : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 5: Rankings */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                ⭐ Rankings & Authority
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs text-slate-600 font-semibold leading-relaxed">
                {polyA?.ranking || <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs text-slate-600 font-semibold leading-relaxed">
                {polyB?.ranking || <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 6: Admission process */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <ListChecks className="w-3.5 h-3.5 mr-1" /> Admission Path
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs text-slate-600 leading-relaxed font-semibold">
                {polyA?.admission_process || <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs text-slate-600 leading-relaxed font-semibold">
                {polyB?.admission_process || <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 7: Eligibility */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Academic Eligibility
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs text-slate-600 leading-relaxed font-semibold">
                {polyA?.eligibility || <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 text-xs text-slate-600 leading-relaxed font-semibold">
                {polyB?.eligibility || <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 8: Curriculum */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                📚 Curriculum Highlights
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 space-y-1.5">
                {polyA?.curriculum_highlights ? polyA.curriculum_highlights.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-600 font-semibold">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                )) : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 space-y-1.5">
                {polyB?.curriculum_highlights ? polyB.curriculum_highlights.map((h, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-600 font-semibold">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                )) : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

            {/* Row 9: Actions */}
            <div className="grid grid-cols-12 py-4 px-4 divide-y-2 divide-slate-100 md:divide-y-0 md:divide-x-2 md:divide-slate-200 bg-slate-50/50">
              <div className="col-span-12 md:col-span-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                🔗 Options
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 flex gap-2">
                {polyA ? (
                  <>
                    <Link
                      href={`/education/${polyA.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1 font-mono text-[9px] font-black border-2 border-slate-900 px-3 py-1.5 uppercase bg-white hover:bg-slate-900 hover:text-white transition-all rounded-lg"
                    >
                      Dossier <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {polyA.website_url && (
                      <a
                        href={polyA.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center border-2 border-slate-900 p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </>
                ) : <span className="text-slate-400 font-mono">--</span>}
              </div>
              <div className="col-span-12 md:col-span-4 py-2 md:py-0 md:px-4 flex gap-2">
                {polyB ? (
                  <>
                    <Link
                      href={`/education/${polyB.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1 font-mono text-[9px] font-black border-2 border-slate-900 px-3 py-1.5 uppercase bg-white hover:bg-slate-900 hover:text-white transition-all rounded-lg"
                    >
                      Dossier <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {polyB.website_url && (
                      <a
                        href={polyB.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center border-2 border-slate-900 p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </>
                ) : <span className="text-slate-400 font-mono">--</span>}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Reset panel toolbar */}
      {(polyA || polyB) && (
        <div className="flex justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black border-2 border-slate-900 px-4 py-2.5 uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-lg shadow-[2px_2px_0px_0px_#000]"
          >
            <RotateCcw className="w-4 h-4" /> Reset Comparison
          </button>
        </div>
      )}

    </div>
  )
}
