'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, GraduationCap, Award, Landmark, MapPin, Clock, DollarSign, ExternalLink, ArrowRight, Scale, Info } from 'lucide-react'

export interface Program {
  id: string
  slug: string
  name: string
  institution: string
  location: string
  country: string
  degree_type: 'B.Tech' | 'M.Tech' | 'M.Sc' | 'MS' | 'Ph.D' | 'Diploma' | 'B.Sc'
  duration: string
  fees_annual: string
  ranking: string | null
  admission_process: string
  eligibility: string
  curriculum_highlights: string[]
  website_url: string | null
  is_indian: boolean
}

export interface Scholarship {
  id: string
  name: string
  provider: string
  amount: string
  eligibility: string
  deadline: string
  apply_url: string | null
  description: string
  is_indian: boolean
}

interface Props {
  programs: Program[]
  scholarships: Scholarship[]
}

const DEGREE_COLORS: Record<string, string> = {
  'B.Tech': '#1D4ED8', // blue
  'M.Tech': '#EA580C', // orange
  'MS': '#7C3AED',     // purple
  'M.Sc': '#0891B2',   // cyan
  'Ph.D': '#BE185D',   // pink
  'Diploma': '#0D9488', // teal
  'B.Sc': '#4F46E5',   // indigo
}

export default function EducationDashboard({ programs, scholarships }: Props) {
  const [activeTab, setActiveTab] = useState<'programs' | 'scholarships'>('programs')
  
  // Program filter states
  const [progSearch, setProgSearch] = useState('')
  const [progRegion, setProgRegion] = useState<'all' | 'india' | 'global'>('all')
  const [progDegree, setProgDegree] = useState<string>('all')

  // Scholarship filter states
  const [scholSearch, setScholSearch] = useState('')
  const [scholRegion, setScholRegion] = useState<'all' | 'india' | 'global'>('all')

  // Filter logic: Programs
  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(progSearch.toLowerCase()) ||
                          p.institution.toLowerCase().includes(progSearch.toLowerCase()) ||
                          p.location.toLowerCase().includes(progSearch.toLowerCase())
    const matchesRegion = progRegion === 'all' || 
                          (progRegion === 'india' && p.is_indian) || 
                          (progRegion === 'global' && !p.is_indian)
    const matchesDegree = progDegree === 'all' || p.degree_type === progDegree
    return matchesSearch && matchesRegion && matchesDegree
  })

  // Filter logic: Scholarships
  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(scholSearch.toLowerCase()) ||
                          s.provider.toLowerCase().includes(scholSearch.toLowerCase()) ||
                          s.description.toLowerCase().includes(scholSearch.toLowerCase())
    const matchesRegion = scholRegion === 'all' ||
                          (scholRegion === 'india' && s.is_indian) ||
                          (scholRegion === 'global' && !s.is_indian)
    return matchesSearch && matchesRegion
  })

  return (
    <div className="space-y-8">
      {/* ── Tabs Selector Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border-4 border-slate-900 p-5 rounded-xl shadow-[4px_4px_0px_0px_#000]">
        
        {/* Main Tabs switcher */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border-2 border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-md text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'programs'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Academic Programs ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-md text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'scholarships'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Award className="w-4 h-4" /> Polymer Scholarships ({scholarships.length})
          </button>
        </div>

        {/* Compare quick link */}
        <Link
          href="/education/compare"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 border-2 border-slate-900 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors shadow-[2px_2px_0px_0px_#000]"
        >
          <Scale className="w-4 h-4" /> Compare Programs
        </Link>
      </div>

      {/* ── Programs Tab Layout ── */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Filters Column */}
          <div className="border-4 border-slate-900 bg-white p-5 rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-5">
            <h3 className="font-mono text-xs font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-200 pb-2">
              Filter Programs
            </h3>
            
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] font-bold text-slate-500 uppercase">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={progSearch}
                  onChange={(e) => setProgSearch(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  placeholder="CIPET, Anna, Aachen..."
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Region Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] font-bold text-slate-500 uppercase block">Institution Region</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg border-2 border-slate-200">
                {(['all', 'india', 'global'] as const).map(reg => (
                  <button
                    key={reg}
                    onClick={() => setProgRegion(reg)}
                    className={`py-1 text-[10px] font-bold uppercase rounded transition-all ${
                      progRegion === reg
                        ? 'bg-slate-900 text-white shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Degree Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] font-bold text-slate-500 uppercase block">Degree Level</label>
              <select
                value={progDegree}
                onChange={(e) => setProgDegree(e.target.value)}
                className="w-full border-2 border-slate-900 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="all">All Degrees</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MS">M.S. / MS</option>
                <option value="M.Sc">M.Sc</option>
                <option value="Ph.D">Ph.D</option>
                <option value="Diploma">Diploma</option>
                <option value="B.Sc">B.Sc</option>
              </select>
            </div>
            
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Showing:</span>
              <span className="font-bold text-slate-700">{filteredPrograms.length} programs</span>
            </div>
          </div>

          {/* Results Grid Column */}
          <div className="lg:col-span-3 space-y-4">
            {filteredPrograms.length === 0 ? (
              <div className="border-4 border-slate-900 bg-white p-12 text-center rounded-xl shadow-[4px_4px_0px_0px_#000]">
                <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-display text-lg font-black text-slate-800 mb-2">No programs match filters</h3>
                <p className="text-slate-500 font-mono text-xs max-w-md mx-auto">
                  Try adjusting region, degree types, or search query to discover engineering pathways.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrograms.map((prog) => {
                  const tagColor = DEGREE_COLORS[prog.degree_type] || '#0F172A'
                  return (
                    <article
                      key={prog.id}
                      className="border-4 border-slate-900 bg-white rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between group"
                    >
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span
                            className="font-mono text-[9px] font-black border-2 px-2 py-0.5 uppercase rounded-md text-white"
                            style={{ backgroundColor: tagColor, borderColor: tagColor }}
                          >
                            {prog.degree_type}
                          </span>
                          <span className="font-mono text-[9px] font-bold text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {prog.location}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {prog.name}
                          </h3>
                          <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-wider block mt-1">
                            {prog.institution}
                          </span>
                        </div>

                        {/* Program attributes list */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-mono">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {prog.duration}
                          </div>
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {prog.fees_annual}/yr
                          </div>
                        </div>

                        {prog.ranking && (
                          <div className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                            <Info className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{prog.ranking}</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t-2 border-slate-900 p-4 bg-slate-50/50 flex gap-2 rounded-b-lg">
                        <Link
                          href={`/education/${prog.slug}`}
                          className="w-full inline-flex items-center justify-center gap-1 font-mono text-[9px] font-black border-2 border-slate-900 px-3 py-2 uppercase bg-white hover:bg-slate-900 hover:text-white transition-all rounded-lg"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        {prog.website_url && (
                          <a
                            href={prog.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center border-2 border-slate-900 hover:border-slate-900 bg-slate-900 text-white hover:bg-slate-800 p-2 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Scholarships Tab Layout ── */}
      {activeTab === 'scholarships' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Filters Column */}
          <div className="border-4 border-slate-900 bg-white p-5 rounded-xl shadow-[4px_4px_0px_0px_#000] space-y-5">
            <h3 className="font-mono text-xs font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-200 pb-2">
              Filter Scholarships
            </h3>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] font-bold text-slate-500 uppercase">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  value={scholSearch}
                  onChange={(e) => setScholSearch(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  placeholder="GATE, ACS, Erasmus..."
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Region Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] font-bold text-slate-500 uppercase block">Scholarship Region</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg border-2 border-slate-200">
                {(['all', 'india', 'global'] as const).map(reg => (
                  <button
                    key={reg}
                    onClick={() => setScholRegion(reg)}
                    className={`py-1 text-[10px] font-bold uppercase rounded transition-all ${
                      scholRegion === reg
                        ? 'bg-slate-900 text-white shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Showing:</span>
              <span className="font-bold text-slate-700">{filteredScholarships.length} schemes</span>
            </div>
          </div>

          {/* Results Grid Column */}
          <div className="lg:col-span-3 space-y-4">
            {filteredScholarships.length === 0 ? (
              <div className="border-4 border-slate-900 bg-white p-12 text-center rounded-xl shadow-[4px_4px_0px_0px_#000]">
                <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-display text-lg font-black text-slate-800 mb-2">No matching fellowships</h3>
                <p className="text-slate-500 font-mono text-xs max-w-md mx-auto">
                  Try adjusting region tabs or keyword strings.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredScholarships.map((schol) => (
                  <article
                    key={schol.id}
                    className="border-4 border-slate-900 bg-white rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-300 transform hover:-translate-y-0.5"
                    style={{ borderLeftColor: schol.is_indian ? '#1D4ED8' : '#7C3AED', borderLeftWidth: '8px' }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-mono text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold uppercase">
                              {schol.is_indian ? '🇮🇳 India Scheme' : '🌍 Global Funding'}
                            </span>
                            <span className="font-mono text-[9px] text-slate-400">
                              Deadline: {schol.deadline}
                            </span>
                          </div>
                          <h3 className="font-display font-extrabold text-lg text-slate-900 leading-tight">
                            {schol.name}
                          </h3>
                          <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                            Provider: {schol.provider}
                          </span>
                        </div>
                        <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-500 px-4 py-2 font-mono text-sm font-black uppercase tracking-wider rounded-lg shrink-0">
                          {schol.amount}
                        </div>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                        <p>{schol.description}</p>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-2">
                          <Landmark className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Eligibility Criteria</span>
                            <span className="font-medium text-slate-700">{schol.eligibility}</span>
                          </div>
                        </div>
                      </div>

                      {schol.apply_url && (
                        <div className="flex justify-end mt-5">
                          <a
                            href={schol.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black border-2 border-slate-900 px-3.5 py-2 uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-lg shadow-[2px_2px_0px_0px_#000]"
                          >
                            Apply Now <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
