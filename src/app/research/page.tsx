// src/app/research/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { 
  BookOpen, 
  Award, 
  FileText, 
  Users, 
  Search, 
  Plus, 
  Loader2, 
  Trash2, 
  Send, 
  Target,
  Sparkles,
  Brain,
  Compass,
  CheckCircle2
} from 'lucide-react'

interface Paper {
  id: string
  title: string
  authors: string
  journal: string
  publication_year: number
  doi: string
  abstract: string
  subject_slug: string
}

interface Patent {
  id: string
  patent_number: string
  title: string
  inventors: string
  assignee: string
  filing_date: string
  publication_date: string
  status: 'pending' | 'published' | 'granted'
  abstract: string
  claims: string[]
  jurisdiction: 'India' | 'US' | 'PCT'
  subject_slug: string
}

interface Pitch {
  id: string
  title: string
  description: string
  subject_slug: string
  contact_info: string
  status: 'open' | 'closed'
  created_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
    college_name: string | null
  } | null
}

interface Draft {
  id: string
  title: string
  status: 'draft' | 'submitted'
  updated_at: string
}

const SUBJECT_LABELS: Record<string, string> = {
  'polymer-chemistry': 'Polymer Chemistry',
  'polymer-processing': 'Polymer Processing',
  'mould-design': 'Mould Design',
  'polymer-testing': 'Polymer Testing',
  'rubber-technology': 'Rubber Technology',
  'recycling-technology': 'Recycling Technology',
  'sustainable-plastics': 'Sustainable Plastics',
  'polymer-composites': 'Polymer Composites',
  'entrepreneurship-plastics': 'Entrepreneurship',
  'medical-plastics': 'Medical Plastics & Biomaterials',
  'polymer-rheology': 'Polymer Rheology',
  'additives-compounding': 'Additives & Compounding',
  'plastic-packaging-engineering': 'Packaging Engineering',
  'life-cycle-assessment': 'Life Cycle Assessment',
  'color-science-masterbatches': 'Color Science',
  'polymer-nanotechnology': 'Polymer Nanotechnology',
  'bioprocessing-fermentation': 'Bioprocessing',
  'robotics-plastics': 'Robotics in Manufacturing',
  'digital-twins-plastics': 'Digital Twins'
}

export default function ResearchHubPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [activeTab, setActiveTab] = useState<'publications' | 'patents' | 'ipo' | 'pitches'>('publications')
  
  // Data lists
  const [papers, setPapers] = useState<Paper[]>([])
  const [patents, setPatents] = useState<Patent[]>([])
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all')
  
  // Loading
  const [loading, setLoading] = useState(true)
  const [pitchSubmitting, setPitchSubmitting] = useState(false)
  const [draftCreating, setDraftCreating] = useState(false)

  // Modals
  const [showPitchModal, setShowPitchModal] = useState(false)
  const [newPitch, setNewPitch] = useState({
    title: '',
    description: '',
    subject_slug: 'polymer-chemistry',
    contact_info: ''
  })

  // 1. Fetch Session
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  // 2. Fetch Data according to activeTab
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        if (activeTab === 'publications') {
          const res = await fetch(`/api/research/papers?q=${searchQuery}&subject=${selectedSubject}`)
          if (res.ok) setPapers(await res.json())
        } else if (activeTab === 'patents') {
          const res = await fetch(`/api/research/patents?q=${searchQuery}&jurisdiction=${selectedJurisdiction}`)
          if (res.ok) setPatents(await res.json())
        } else if (activeTab === 'pitches') {
          const res = await fetch(`/api/research/pitches?subject=${selectedSubject}`)
          if (res.ok) setPitches(await res.json())
        }
      } catch (err) {
        console.error('Failed to load research hub data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeTab, searchQuery, selectedSubject, selectedJurisdiction])

  // 3. Load Drafts separately if authenticated
  useEffect(() => {
    if (!session) return
    async function loadDrafts() {
      try {
        const res = await fetch('/api/research/drafts')
        if (res.ok) setDrafts(await res.json())
      } catch (err) {
        console.error('Failed to load drafts:', err)
      }
    }
    loadDrafts()
  }, [session, draftCreating])

  // 4. Create blank patent draft
  const handleCreateDraft = async () => {
    if (!session) return
    setDraftCreating(true)
    try {
      const res = await fetch('/api/research/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Polymer Invention Specification' })
      })
      if (res.ok) {
        const draft = await res.json()
        window.location.href = `/research/draft/${draft.id}`
      }
    } catch (err) {
      console.error('Failed to create draft:', err)
    } finally {
      setDraftCreating(false)
    }
  }

  // 5. Delete draft
  const handleDeleteDraft = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this draft?')) return
    try {
      const res = await fetch(`/api/research/drafts?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setDrafts(prev => prev.filter(d => d.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete draft:', err)
    }
  }

  // 6. Submit Collaboration Pitch
  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPitch.title || !newPitch.description || !newPitch.contact_info) return
    setPitchSubmitting(true)
    try {
      const res = await fetch('/api/research/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPitch)
      })
      if (res.ok) {
        const pitch = await res.json()
        setPitches(prev => [pitch, ...prev])
        setShowPitchModal(false)
        setNewPitch({ title: '', description: '', subject_slug: 'polymer-chemistry', contact_info: '' })
      }
    } catch (err) {
      console.error('Failed to submit research pitch:', err)
    } finally {
      setPitchSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              R&amp;D Workspace &middot; Publications &middot; Indian Patent Office (IPO) &middot; Collaboration Pitches
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Research, Innovation &amp; <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              IP Protection
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Explore peer-reviewed publications, search Indian and international patent registries, draft Form 1/Form 2 patent specifications, or recruit student co-researchers.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">25+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Patent Topics</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">100%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Peer-Reviewed</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">IPO + PCT</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Jurisdictions Mapped</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Workspace ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-4 border-b border-slate-100">
            
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
              {([
                { id: 'publications', label: 'Academic Publications', icon: BookOpen },
                { id: 'patents', label: 'Patent Registry', icon: Award },
                { id: 'ipo', label: 'IPO Filing Guide', icon: Target },
                { id: 'pitches', label: 'Collaboration Pitches', icon: Users }
              ] as const).map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setSearchQuery('')
                    }}
                    className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 flex-shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {tab.label}
                  </button>
                )
              })}
            </div>

            {session && (
              <button
                onClick={handleCreateDraft}
                disabled={draftCreating}
                className="inline-flex items-center gap-1.5 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase px-4 py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                {draftCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                + New Patent Draft
              </button>
            )}

          </div>

          {/* Search and Filters Strip */}
          {activeTab !== 'ipo' && (
            <div className="flex flex-col sm:flex-row gap-3">
              {(activeTab === 'publications' || activeTab === 'patents') && (
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={activeTab === 'publications' ? "Search publication title, abstract, or author..." : "Search patent number, claims, or assignee..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              )}

              {(activeTab === 'publications' || activeTab === 'pitches') && (
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none"
                >
                  <option value="all">All 19 Subjects</option>
                  {Object.entries(SUBJECT_LABELS).map(([slug, name]) => (
                    <option key={slug} value={slug}>{name}</option>
                  ))}
                </select>
              )}

              {activeTab === 'patents' && (
                <select
                  value={selectedJurisdiction}
                  onChange={(e) => setSelectedJurisdiction(e.target.value)}
                  className="border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none"
                >
                  <option value="all">All Jurisdictions (India, US, PCT)</option>
                  <option value="India">🇮🇳 Indian Patent Office (IPO)</option>
                  <option value="US">🇺🇸 USPTO Patents</option>
                  <option value="PCT">🌐 PCT International</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* ── Main Content Grid with Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Main List (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            
            {loading && activeTab !== 'ipo' ? (
              <div className="border-2 border-slate-900 bg-white rounded-2xl p-16 text-center space-y-3 shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Querying Research &amp; Patent Registries...
                </p>
              </div>
            ) : activeTab === 'publications' ? (
              /* Academic Publications */
              papers.length === 0 ? (
                <div className="border-2 border-slate-900 bg-white p-12 text-center rounded-2xl shadow-sm space-y-2">
                  <span className="text-4xl block">📚</span>
                  <h3 className="font-display font-bold text-lg text-slate-900">No matching research articles discovered</h3>
                  <p className="text-xs text-slate-500">Try adjusting your search query or subject filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {papers.map(p => (
                    <article key={p.id} className="border-2 border-slate-900 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug">
                          {p.title}
                        </h2>
                        <span className="font-mono text-xs font-bold bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-lg text-slate-700 flex-shrink-0">
                          {p.publication_year}
                        </span>
                      </div>

                      <p className="font-mono text-xs text-slate-400">
                        By {p.authors} &middot; <span className="italic text-slate-600 font-bold">{p.journal}</span>
                      </p>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {p.abstract}
                      </p>

                      <div className="flex items-center justify-between gap-4 flex-wrap pt-3 border-t border-slate-100">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                          {SUBJECT_LABELS[p.subject_slug] || p.subject_slug}
                        </span>
                        {p.doi && (
                          <span className="font-mono text-xs text-slate-400">
                            DOI: <span className="text-slate-600 font-bold">{p.doi}</span>
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )
            ) : activeTab === 'patents' ? (
              /* Patent Registry */
              patents.length === 0 ? (
                <div className="border-2 border-slate-900 bg-white p-12 text-center rounded-2xl shadow-sm space-y-2">
                  <span className="text-4xl block">⚖️</span>
                  <h3 className="font-display font-bold text-lg text-slate-900">No matching patents found in registry</h3>
                  <p className="text-xs text-slate-500">Try searching with broader technical terms or select all jurisdictions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patents.map(pat => (
                    <article key={pat.id} className="border-2 border-slate-900 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600 tracking-wider block mb-1">
                            {pat.patent_number} ({pat.jurisdiction})
                          </span>
                          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug">
                            {pat.title}
                          </h2>
                        </div>
                        <span className={`font-mono text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                          pat.status === 'granted'
                            ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                            : 'border-amber-300 text-amber-800 bg-amber-50'
                        }`}>
                          {pat.status}
                        </span>
                      </div>

                      <p className="font-mono text-xs text-slate-400">
                        Inventors: <span className="text-slate-700">{pat.inventors}</span> {pat.assignee && `· Assignee: ${pat.assignee}`}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {pat.abstract}
                      </p>

                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 block">
                          Independent Claims ({pat.claims.length})
                        </span>
                        <ol className="list-decimal pl-4 space-y-1">
                          {pat.claims.map((claim, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium">{claim}</li>
                          ))}
                        </ol>
                      </div>
                    </article>
                  ))}
                </div>
              )
            ) : activeTab === 'ipo' ? (
              /* IPO Filing Guide */
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <h2 className="font-display font-bold text-xl uppercase text-slate-900 flex items-center gap-2">
                    🏛️ Indian Patent Office (IPO) Complete Filing Protocol
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
                    Official statutory sequence for filing polymer composition, additive formulation, and processing machinery patents in India.
                  </p>
                </div>

                <div className="relative border-l-2 border-slate-900 pl-6 space-y-6 ml-2 pt-2">
                  {[
                    { step: 'Step 1', title: 'Prior Art & Novelty Search (2–3 weeks)', desc: 'Examine published patents on InPASS and Google Patents to ensure your polymer chemical formulation is novel and non-obvious.' },
                    { step: 'Step 2', title: 'Draft Provisional or Complete Specification (Form 2)', desc: 'Draft full chemical reaction schemes, processing temperature windows, extruder parameters, and numbered claims.' },
                    { step: 'Step 3', title: 'Filing Application (Form 1 + Form 2 + Form 5)', desc: 'Submit application on the official IPO IP India portal with Declaration of Inventorship.' },
                    { step: 'Step 4', title: 'Publication in Patent Journal (18 Months or Form 9)', desc: 'IPO publishes your application automatically after 18 months, or within 1 month if expedited via Form 9.' },
                    { step: 'Step 5', title: 'Request for Examination (Form 18)', desc: 'Request formal examination by an IPO technical controller to initiate scientific review.' },
                    { step: 'Step 6', title: 'First Examination Report (FER) Response', desc: 'Answer objections and clarify prior art differentiation with your registered patent attorney.' },
                    { step: 'Step 7', title: 'Grant Decision & Certificate Issuance', desc: 'Patent receives 20-year legal grant certificate. Pay annual annuities to sustain protection.' }
                  ].map((item, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-[#F5C518]" />
                      <h3 className="font-display font-bold text-sm text-blue-700">{item.step}: {item.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Pitches Board */
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border-2 border-slate-900 shadow-md">
                  <div>
                    <h3 className="font-display font-bold text-base">Research Collaboration Board</h3>
                    <p className="text-xs text-slate-300 font-light mt-0.5">Post project specs to recruit student partners or college thesis advisors.</p>
                  </div>
                  {session && (
                    <button
                      onClick={() => setShowPitchModal(true)}
                      className="bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase px-4 py-2.5 rounded-xl border border-slate-900 shadow-sm flex-shrink-0"
                    >
                      + Post Pitch
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pitches.length === 0 ? (
                    <p className="col-span-full text-center font-mono text-xs text-slate-400 py-10">No active collaboration proposals posted in this category.</p>
                  ) : (
                    pitches.map(p => (
                      <article key={p.id} className="border-2 border-slate-900 rounded-2xl p-5 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-3">
                            <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                              {SUBJECT_LABELS[p.subject_slug || ''] || p.subject_slug}
                            </span>
                            <span className="font-mono text-[9px] font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {p.status}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                            {p.title}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                            {p.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
                          <div>
                            <span className="block font-bold text-xs text-slate-900">
                              {p.profiles?.full_name || 'Anonymous Researcher'}
                            </span>
                            <span className="block font-mono text-[9px] text-slate-400 truncate max-w-[150px]">
                              {p.profiles?.college_name || 'Affiliation Pending'}
                            </span>
                          </div>

                          <a
                            href={`mailto:${p.contact_info}`}
                            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase bg-slate-900 text-white hover:bg-blue-600 px-3 py-1.5 rounded-xl transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" /> Contact
                          </a>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Patent Drafts Workspace (1 Column) */}
          <div className="space-y-6">
            {session ? (
              <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white shadow-md space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
                    <FileText className="w-4 h-4 text-blue-600" /> My Patent Drafts ({drafts.length})
                  </h3>
                </div>

                {drafts.length === 0 ? (
                  <div className="py-4 text-center space-y-2">
                    <p className="text-xs text-slate-400 italic">No patent drafts created yet.</p>
                    <button
                      onClick={handleCreateDraft}
                      className="text-xs font-mono font-bold uppercase text-blue-600 hover:underline"
                    >
                      + Create First Draft
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {drafts.map(d => (
                      <div 
                        key={d.id}
                        className="group flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all cursor-pointer"
                        onClick={() => window.location.href = `/research/draft/${d.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="block font-bold text-xs truncate text-slate-800 group-hover:text-blue-600">
                            {d.title}
                          </span>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase">
                            Last edited: {new Date(d.updated_at).toLocaleDateString()}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleDeleteDraft(d.id, e)}
                          className="text-slate-300 hover:text-red-600 p-1"
                          title="Delete draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white shadow-md text-center space-y-3">
                <span className="text-2xl block">🔒</span>
                <h4 className="font-display font-bold text-xs uppercase text-slate-900">Patent Drafting Workspace</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Sign in to draft and save your Form 2 specifications.</p>
                <Link href="/login" className="inline-block bg-slate-900 text-white font-mono text-xs font-bold uppercase px-4 py-2 rounded-xl border border-slate-900 shadow-sm">
                  Sign In &rarr;
                </Link>
              </div>
            )}

            {/* Checklist guide */}
            <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white shadow-md space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> IPO Form Checklist
              </h4>
              <ul className="space-y-2 font-mono text-[11px] text-slate-600">
                <li>&bull; Form 1: Patent Application</li>
                <li>&bull; Form 2: Complete Specification</li>
                <li>&bull; Form 3: Statement &amp; Undertaking</li>
                <li>&bull; Form 5: Declaration of Inventorship</li>
                <li>&bull; Form 9: Early Publication (Optional)</li>
                <li>&bull; Form 18: Request for Examination</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* ── BOTTOM AI IP SPECIALIST CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI IP Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Need help drafting your patent claims? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Patent Specialist.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Generate prior art search keywords, verify claim scope boundaries, or assess novelty against published polymer literature.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=How%20do%20I%20draft%20independent%20claims%20for%20a%20novel%20biodegradable%20polymer%20composite%20under%20Indian%20Patent%20Law"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask IP Specialist &rarr;
            </Link>

            <Link
              href="/subjects/entrepreneurship-plastics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Plastics Entrepreneurship
            </Link>
          </div>
        </div>
      </section>

      {/* Collaboration Pitch submission Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display font-bold text-base uppercase tracking-wide mb-4">📢 Post Pitch Proposal</h3>
            
            <form onSubmit={handlePitchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biodegradable PLA/Starch Compounds"
                  value={newPitch.title}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Subject Domain</label>
                <select
                  value={newPitch.subject_slug}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, subject_slug: e.target.value }))}
                  className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-bold"
                >
                  {Object.entries(SUBJECT_LABELS).map(([slug, name]) => (
                    <option key={slug} value={slug}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Technical Details &amp; Pitch</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your research proposal, novelty points, and what kind of collaborator profiles you are looking to recruit..."
                  value={newPitch.description}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Contact Email / Info</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. researcher@college.edu"
                  value={newPitch.contact_info}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, contact_info: e.target.value }))}
                  className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowPitchModal(false)}
                  className="px-4 py-2 border-2 border-slate-200 text-xs font-mono font-bold uppercase rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pitchSubmitting}
                  className="px-5 py-2 bg-blue-600 text-white text-xs font-mono font-bold uppercase rounded-xl hover:bg-blue-700 flex items-center gap-1.5 shadow-sm"
                >
                  {pitchSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Proposal (+10 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
