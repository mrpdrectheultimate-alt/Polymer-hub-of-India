'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Lock, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Database as DBType } from '@/lib/supabase/types'

type Material = DBType['public']['Tables']['materials']['Row']

interface MaterialsClientProps {
  materials: Material[]
  isPremiumUser: boolean
}

const families = [
  'All',
  'Polyolefin',
  'Vinyl',
  'Styrenic',
  'Engineering Thermoplastic',
  'Polyester',
  'Fluoropolymer',
]

export default function MaterialsClient({ materials, isPremiumUser }: MaterialsClientProps) {
  const [search, setSearch] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('All')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  // Filter materials
  const filtered = materials.filter((m) => {
    // 1. Search filter
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.family.toLowerCase().includes(search.toLowerCase()) ||
      m.indian_trade_names?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      
    // 2. Family filter
    const matchesFamily = selectedFamily === 'All' || m.family === selectedFamily
    
    return matchesSearch && matchesFamily
  })

  // We locks 4 advanced engineering polymers for free users
  const lockedMaterialIds = new Set([
    'Polycarbonate (PC)',
    'Polyamide 6 (Nylon 6)',
    'Polyoxymethylene (POM / Acetal)',
    'Polytetrafluoroethylene (PTFE / Teflon)',
  ])

  const checkIsLocked = (m: Material) => {
    return lockedMaterialIds.has(m.name) && !isPremiumUser
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, family, or trade name (e.g. Repol, Relene)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81] rounded-xl text-xs font-medium"
          />
        </div>

        {/* Filter chips scrollbox */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
          {families.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFamily(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                selectedFamily === f
                  ? 'bg-[#0F4C81] text-white border-transparent'
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Polymers List (8/12 width if selected, otherwise full) */}
        <div className={`${selectedMaterial ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm shadow-slate-100/50`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Polymer Spec Name</th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Family</th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Melt Temp</th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Tensile Strength</th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((m) => {
                  const isLocked = checkIsLocked(m)
                  const isSelected = selectedMaterial?.id === m.id

                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMaterial(m)}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/20' : ''
                      } ${isLocked ? 'opacity-50' : ''}`}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                        <div className="text-[10px] text-slate-400 sm:hidden">{m.family}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
                        {m.family}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-medium hidden sm:table-cell">
                        {m.melt_temp || '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-medium hidden md:table-cell">
                        {m.tensile_strength || '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            <Lock className="w-2.5 h-2.5" />
                            Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            View
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 text-xs font-semibold">
                      No matching polymer materials found. Try typing a trade name.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Side Panel (4/12 width) */}
        {selectedMaterial && (
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-lg shadow-slate-100/50 sticky top-24 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-50 pb-4">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Polymer Specs sheet</span>
                <h3 className="font-extrabold text-slate-950 text-base mt-1">{selectedMaterial.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkIsLocked(selectedMaterial) ? (
              /* Locked Content */
              <div className="text-center py-8 px-4 space-y-5">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
                  <Lock className="w-6 h-6 text-[#F97316]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-xs text-slate-800">Advanced Material Properties</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Details for engineering polymers (like Polycarbonate and Nylon 6) are reserved for Premium members.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center gap-1 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-orange-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Upgrade for ₹149/mo
                </Link>
              </div>
            ) : (
              /* Unlocked Spec details */
              <div className="space-y-5 text-xs">
                {/* Specs List */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Density</div>
                    <div className="font-bold text-slate-800 text-xs mt-0.5">{selectedMaterial.density ? `${selectedMaterial.density} g/cm³` : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Melt Temp</div>
                    <div className="font-bold text-slate-800 text-xs mt-0.5">{selectedMaterial.melt_temp || 'N/A'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Tensile Strength</div>
                    <div className="font-bold text-slate-800 text-xs mt-0.5">{selectedMaterial.tensile_strength || 'N/A'}</div>
                  </div>
                </div>

                {/* Applications */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider text-[10px]">Top Industrial Applications</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMaterial.top_applications?.map((app, idx) => (
                      <span key={idx} className="bg-blue-50/50 text-[#0F4C81] border border-blue-50 px-2.5 py-1 rounded-xl text-[10px] font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trade Names */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider text-[10px]">Indian Industry Trade Names</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMaterial.indian_trade_names?.map((trade, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl text-[10px] font-semibold">
                        {trade}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
