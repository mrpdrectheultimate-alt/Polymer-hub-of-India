'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search, GraduationCap, Award, MapPin, Clock,
  ExternalLink, Scale, Info,
  LayoutGrid, List, CheckCircle2, ChevronRight
} from 'lucide-react'

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

const DEGREE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'B.Tech': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  'M.Tech': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  'MS':     { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  'M.Sc':   { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
  'Ph.D':   { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  'Diploma':{ bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  'B.Sc':   { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
}

const DEFAULT_CAMPUS_IMAGES: Record<string, string> = {
  'B.Tech': 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  'M.Tech': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  'MS':     'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  'M.Sc':   'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
  'Ph.D':   'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&q=80',
  'Diploma':'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
  'B.Sc':   'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
  'default':'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
}

export default function EducationDashboard({ programs, scholarships }: Props) {
  const [activeTab, setActiveTab] = useState<'programs' | 'scholarships'>('programs')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
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
      
      {/* ── Tabs Selector & Search Toolbar ── */}
      <div className="bg-white border-2 border-slate-900 p-4 sm:p-6 rounded-2xl shadow-xl space-y-6">
        
        {/* Main Tab Switches + Compare Tool Link */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('programs')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === 'programs'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-400" /> Academic Programs ({programs.length})
            </button>
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === 'scholarships'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" /> Scholarships &amp; Fellowships ({scholarships.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              href="/education/compare"
              className="inline-flex items-center justify-center gap-1.5 bg-[#F5C518] hover:bg-amber-400 text-slate-950 border-2 border-slate-900 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <Scale className="w-4 h-4" /> Compare Curriculums
            </Link>

            {activeTab === 'programs' && (
              <div className="hidden sm:flex items-center bg-slate-100 border border-slate-300 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        {activeTab === 'programs' ? (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={progSearch}
                onChange={(e) => setProgSearch(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                placeholder="Search by institute (CIPET, ICT, MIT, RWTH) or city..."
              />
            </div>

            {/* Region Selector */}
            <div className="sm:col-span-3">
              <select
                value={progRegion}
                onChange={(e) => setProgRegion(e.target.value as 'all' | 'india' | 'global')}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none"
              >
                <option value="all">🌍 All Regions (India &amp; Global)</option>
                <option value="india">🇮🇳 Indian Institutes (CIPET, IITs, ICT)</option>
                <option value="global">🌐 Global Universities (US, UK, Germany)</option>
              </select>
            </div>

            {/* Degree Selector */}
            <div className="sm:col-span-3">
              <select
                value={progDegree}
                onChange={(e) => setProgDegree(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none"
              >
                <option value="all">All Degrees (B.Tech to Ph.D)</option>
                <option value="B.Tech">B.Tech (Plastic / Polymer)</option>
                <option value="M.Tech">M.Tech (Advanced Polymers)</option>
                <option value="MS">MS / M.S. (Research)</option>
                <option value="M.Sc">M.Sc (Polymer Science)</option>
                <option value="Ph.D">Ph.D (Doctoral Fellowships)</option>
                <option value="Diploma">Diploma (Polymer Tech)</option>
                <option value="B.Sc">B.Sc (Hons)</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={scholSearch}
                onChange={(e) => setScholSearch(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                placeholder="Search fellowship by name (GATE, ACS, DAAD, Erasmus, DST)..."
              />
            </div>
            <div className="sm:col-span-4">
              <select
                value={scholRegion}
                onChange={(e) => setScholRegion(e.target.value as 'all' | 'india' | 'global')}
                className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none"
              >
                <option value="all">🌍 All Scholarships (India &amp; Global)</option>
                <option value="india">🇮🇳 Indian Funding (GATE, PMRF, DST)</option>
                <option value="global">🌐 International Grants (Fulbright, DAAD)</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* ── Featured Scholarships Callout Banner ── */}
      {activeTab === 'programs' && scholarships.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-2 border-slate-900 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                {scholarships.length} Active Scholarships &amp; Research Fellowships Available
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                PMRF, GATE monthly stipends (₹12,400/mo), and international Erasmus Mundus grants.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('scholarships')}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold uppercase hover:bg-slate-800 transition-all flex items-center gap-1 flex-shrink-0"
          >
            Explore Scholarships &rarr;
          </button>
        </div>
      )}

      {/* ── Results Display: Programs Tab ── */}
      {activeTab === 'programs' && (
        <div>
          {filteredPrograms.length === 0 ? (
            <div className="border-2 border-slate-900 bg-white p-16 text-center rounded-2xl shadow-sm space-y-4">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-display text-xl font-bold text-slate-900">No programs match your filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search query or selecting &quot;All Degrees&quot; and &quot;All Regions&quot;.
              </p>
              <button
                onClick={() => { setProgSearch(''); setProgRegion('all'); setProgDegree('all'); }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold uppercase hover:bg-blue-700 transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredPrograms.map((prog) => {
                const tagStyle = DEGREE_COLORS[prog.degree_type] || DEGREE_COLORS['B.Tech']
                const campusImg = DEFAULT_CAMPUS_IMAGES[prog.degree_type] || DEFAULT_CAMPUS_IMAGES.default

                return (
                  <article
                    key={prog.id}
                    className="border-2 border-slate-900 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Visual Campus Header */}
                    <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden border-b-2 border-slate-200">
                      <img
                        src={campusImg}
                        alt={prog.institution}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border shadow-sm ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`}>
                          {prog.degree_type}
                        </span>
                        <span className="font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-slate-950/80 text-white border border-white/20">
                          {prog.is_indian ? '🇮🇳 India' : '🌐 Global'}
                        </span>
                      </div>

                      {/* Duration & Location at bottom overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono font-bold">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" /> {prog.location}
                        </span>
                        <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
                          <Clock className="w-3 h-3 text-slate-300" /> {prog.duration}
                        </span>
                      </div>
                    </div>

                    {/* Program Information */}
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {prog.institution}
                        </span>

                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                          {prog.name}
                        </h3>

                        {/* Ranking or Accreditation Badge */}
                        {prog.ranking && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{prog.ranking}</span>
                          </div>
                        )}
                      </div>

                      {/* Tuition Fee & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Annual Tuition</span>
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {prog.fees_annual ? `${prog.fees_annual}/yr` : 'Government Subsidized'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {prog.website_url && (
                            <a
                              href={prog.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                              title="Official Institute Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <Link
                            href={`/education/${prog.slug}`}
                            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase transition-all shadow-sm"
                          >
                            Details <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Results Display: Scholarships Tab ── */}
      {activeTab === 'scholarships' && (
        <div>
          {filteredScholarships.length === 0 ? (
            <div className="border-2 border-slate-900 bg-white p-16 text-center rounded-2xl shadow-sm space-y-4">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-display text-xl font-bold text-slate-900">No scholarships match your filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try adjusting keyword strings or select &quot;All Scholarships&quot;.
              </p>
              <button
                onClick={() => { setScholSearch(''); setScholRegion('all'); }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold uppercase hover:bg-blue-700 transition-all shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScholarships.map((schol) => (
                <article
                  key={schol.id}
                  className="border-2 border-slate-900 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
                  style={{ borderLeftColor: schol.is_indian ? '#1D4ED8' : '#7C3AED', borderLeftWidth: '6px' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-700 font-bold uppercase">
                        {schol.is_indian ? '🇮🇳 India Fellowships' : '🌍 International Grant'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 font-medium">
                        Deadline: {schol.deadline}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                        {schol.name}
                      </h3>
                      <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        {schol.provider}
                      </span>
                    </div>

                    <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 font-mono text-xs font-bold rounded-lg">
                      💰 {schol.amount}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {schol.description}
                    </p>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Eligibility</span>
                        <span className="font-medium text-slate-700">{schol.eligibility}</span>
                      </div>
                    </div>
                  </div>

                  {schol.apply_url && (
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <a
                        href={schol.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold border-2 border-slate-900 px-4 py-2 uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-xl shadow-sm"
                      >
                        Apply Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
