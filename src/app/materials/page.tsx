'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter, Lock, ChevronDown, ChevronUp, ArrowRight, Database } from 'lucide-react'
import { ThreeDViewer } from '@/components/ThreeDViewer'
import { Database as DB } from '@/lib/supabase/types'

type ThreeDModel = DB['public']['Tables']['three_d_models']['Row']

type Material = {
  id: string
  name: string
  family: string
  density: number | null
  melt_temp: string | null
  tensile_strength: string | null
  top_applications: string[] | null
  indian_trade_names: string[] | null
  is_premium: boolean
}

const FAMILIES = ['All', 'Polyolefin', 'Vinyl', 'Styrenic', 'Engineering Thermoplastic', 'Polyester', 'Fluoropolymer', 'Elastomer', 'Bioplastic']

const FAMILY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Polyolefin': { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
  'Vinyl': { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
  'Styrenic': { bg: '#F5F3FF', text: '#7C3AED', border: '#7C3AED' },
  'Engineering Thermoplastic': { bg: '#EFF6FF', text: '#1D4ED8', border: '#1D4ED8' },
  'Polyester': { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
  'Fluoropolymer': { bg: '#FFF1F2', text: '#E11D48', border: '#E11D48' },
  'Elastomer': { bg: '#FEF2F2', text: '#DC2626', border: '#DC2626' },
  'Bioplastic': { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
}

function MaterialRow({ material, expanded, onToggle }: {
  material: Material
  expanded: boolean
  onToggle: () => void
}) {
  const fc = FAMILY_COLORS[material.family] ?? { bg: '#F8FAFC', text: '#0A0A0A', border: '#0A0A0A' }

  if (material.is_premium) {
    return (
      <div className="bg-amber-50 border-2 border-ink p-4 flex items-center justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(26,28,32,1)]">
        <div className="flex items-center gap-3 min-w-0">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="min-w-0">
            <span className="font-display font-black text-ink/40 text-base line-through mr-2">{material.name}</span>
            <span className="text-[9px] font-mono font-black bg-amber-200 text-amber-800 border border-amber-300 px-2 py-0.5 uppercase tracking-wider">Premium Grade</span>
          </div>
        </div>
        <Link href="/pricing" className="font-mono text-[10px] font-black border-2 border-ink bg-yellow-bright text-ink px-3 py-1.5 uppercase hover:bg-ink hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex-shrink-0">
          Unlock specs
        </Link>
      </div>
    )
  }

  return (
    <div
      className="bg-white border-2 border-ink transition-all shadow-[2px_2px_0px_0px_rgba(26,28,32,1)]"
      style={{ transform: expanded ? 'translate(-2px, -2px)' : 'none', boxShadow: expanded ? '4px 4px 0px 0px #1A1C20' : '2px 2px 0px 0px #1A1C20' }}
    >
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h3 className="font-display font-black text-ink text-lg leading-tight">{material.name}</h3>
            <span
              className="text-[9px] font-mono font-black border px-2 py-0.5 uppercase tracking-wider"
              style={{ backgroundColor: fc.bg, color: fc.text, borderColor: fc.border }}
            >
              {material.family}
            </span>
          </div>
          {/* Quick specs row */}
          <div className="flex flex-wrap gap-4 text-[10px] text-ink/50 font-mono font-bold uppercase">
            {material.density && <span>⚖️ Density: {material.density} g/cm³</span>}
            {material.melt_temp && <span>🔥 Tm: {material.melt_temp}</span>}
            {material.tensile_strength && <span>💪 Tensile: {material.tensile_strength}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 border-2 border-ink p-1 bg-white">
          {expanded ? <ChevronUp className="w-4 h-4 text-ink" /> : <ChevronDown className="w-4 h-4 text-ink" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t-4 border-ink p-5 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Properties */}
          <div className="border-2 border-ink p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-3">{"// Spec Constants"}</p>
            <div className="space-y-2">
              {([
                ['Density', material.density ? `${material.density} g/cm³` : '—'],
                ['Melt Temp', material.melt_temp ?? '—'],
                ['Tensile Strength', material.tensile_strength ?? '—'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-xs text-ink/60 font-bold">{label}</span>
                  <span className="text-xs font-mono font-black text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div className="border-2 border-ink p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-3">{"// Applications"}</p>
            <div className="space-y-1.5">
              {(material.top_applications ?? []).map((app) => (
                <div key={app} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-none bg-ink mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-ink/80 font-bold">{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Indian trade names */}
          <div className="border-2 border-ink p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-3">{"// Indian Trade Brands"}</p>
            <div className="flex flex-wrap gap-1.5">
              {(material.indian_trade_names ?? []).map((tradeName) => (
                <span
                  key={tradeName}
                  className="text-xs px-2.5 py-1 border-2 border-ink font-mono font-black uppercase tracking-wider"
                  style={{ backgroundColor: fc.bg, color: fc.text, borderColor: fc.border }}
                >
                  {tradeName}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const [viewMode, setViewMode] = useState<'table' | '3d'>('table')
  const [threeDModels, setThreeDModels] = useState<ThreeDModel[]>([])

  useEffect(() => {
    async function fetchMaterials() {
      const supabase = createClient()
      setLoading(true)
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('name')
      setMaterials(data ?? [])

      const { data: models } = await supabase
        .from('three_d_models')
        .select('*')
        .order('name')
      setThreeDModels(models ?? [])

      setLoading(false)
    }
    fetchMaterials()
  }, [])

  const filtered = materials.filter((m) => {
    const matchSearch =
      search.trim() === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.family.toLowerCase().includes(search.toLowerCase()) ||
      (m.indian_trade_names ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchFamily = selectedFamily === 'All' || m.family === selectedFamily
    return matchSearch && matchFamily
  })

  return (
    <div className="min-h-screen bg-canvas pb-16">

      {/* Hero */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-2 border-ink flex items-center justify-center">
                <Database className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                Materials
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                DATABASE
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              POLYMER MATERIALS<br />
              <span className="italic">SPECIFICATIONS AND BRANDS</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm font-bold text-ink/70 leading-relaxed">
              Properties, applications, and Indian trade names for {materials.length}+ polymers. The only database built for Indian PPE students.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter tools */}
      <div className="sticky top-16 z-30 bg-canvas/95 backdrop-blur border-b-4 border-ink py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, family, or trade name..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border-2 border-ink placeholder:text-ink/40 font-bold focus:outline-none"
            />
          </div>
          <div className="relative flex-shrink-0">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink pointer-events-none" />
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="pl-10 pr-8 py-2.5 border-2 border-ink text-xs font-bold text-ink focus:outline-none bg-white appearance-none cursor-pointer min-w-[180px]"
            >
              {FAMILIES.map((f) => (
                <option key={f} value={f}>{f === 'All' ? 'All Families' : f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* View Mode Toggle */}
        <div className="flex gap-3 mb-6 border-b-4 border-ink pb-4">
          <button
            onClick={() => setViewMode('table')}
            className={`font-display text-xs font-black px-4 py-2 border-2 border-ink uppercase tracking-wider transition-all shadow-hard-xs ${
              viewMode === 'table'
                ? 'bg-ink text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-ink hover:bg-slate-50'
            }`}
          >
            📊 Specs Database Table
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`font-display text-xs font-black px-4 py-2 border-2 border-ink uppercase tracking-wider transition-all shadow-hard-xs ${
              viewMode === '3d'
                ? 'bg-ink text-yellow-bright shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-ink hover:bg-slate-50'
            }`}
          >
            🧊 3D Molecule & Product Models
          </button>
        </div>

        {/* Specs specific tabs and counts */}
        {viewMode === 'table' && (
          <>
            {/* Family tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {FAMILIES.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFamily(f)}
                  className={`font-mono text-[9px] font-black px-3.5 py-1.5 border-2 border-ink whitespace-nowrap uppercase tracking-wider transition-all ${
                    selectedFamily === f
                      ? 'bg-yellow-bright text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-ink/60 hover:text-ink'
                  }`}
                >
                  {f === 'All' ? `All (${materials.length})` : f}
                </button>
              ))}
            </div>

            {/* Count details */}
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-4">
              Showing {filtered.length} of {materials.length} polymers
              {search && ` matching "${search}"`}
            </p>
          </>
        )}

        {viewMode === '3d' && (
          <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-6">
            Showing {threeDModels.length} interactive 3D structures (Rotate with mouse drag, zoom with scroll wheel)
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-2 border-ink p-5 bg-white shadow-[2px_2px_0px_0px_rgba(26,28,32,1)] animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-48 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-64" />
              </div>
            ))}
          </div>
        )}

        {/* Materials List */}
        {!loading && viewMode === 'table' && (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="border-2 border-ink p-12 text-center shadow-hard bg-white">
                <Database className="w-10 h-10 mx-auto mb-4 text-ink/40" />
                <div className="font-display text-2xl font-black text-ink mb-2">No polymers matched</div>
                <p className="text-ink/60 max-w-sm mx-auto font-mono text-xs">
                  Try another keyword or change your family filter settings.
                </p>
              </div>
            ) : (
              filtered.map((material) => (
                <MaterialRow
                  key={material.id}
                  material={material}
                  expanded={expandedId === material.id}
                  onToggle={() => setExpandedId(expandedId === material.id ? null : material.id)}
                />
              ))
            )}
          </div>
        )}

        {/* 3D view mode list */}
        {!loading && viewMode === '3d' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threeDModels.map((model) => (
              <div key={model.id} className="bg-white border-2 border-ink p-5 shadow-hard flex flex-col justify-between">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-black border-2 border-ink px-2 py-0.5 uppercase tracking-wider bg-purple-50 text-purple-700 border-purple-300">
                      {model.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-black text-ink text-base uppercase leading-tight">{model.name}</h3>
                    <p className="font-mono text-[10px] text-ink/60 mt-1 leading-normal uppercase">{model.description}</p>
                  </div>
                </div>
                <div>
                  <ThreeDViewer modelType={model.model_type} name={model.name} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Premium Upgrade alert */}
        <div className="mt-10 border-2 border-ink p-6 shadow-hard" style={{ backgroundColor: '#FEFCE8', boxShadow: '2px 2px 0px 0px #EA580C' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-orange flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-black text-ink text-lg uppercase tracking-tight mb-1">
                  Unlock Chemical Resistance and Processing Data
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed font-bold">
                  Premium membership includes complete chemical resistance tables, processing parameters, and trade details for specialized materials (PTFE, PEEK, elastomers, biopolymers).
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="cn-btn-orange text-center text-xs py-3 px-6 flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              Unlock Premium <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
