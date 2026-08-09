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
  Target
} from 'lucide-react'

// Interfaces
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
    <div className="min-h-screen bg-canvas text-slate-900 pb-20">
      <div className="h-2 bg-blue-600" />
      
      {/* Top Banner */}
      <section className="border-b-4 border-slate-900 bg-slate-900 text-white px-6 py-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-6 flex-wrap">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold block mb-1">R&amp;D Workspace</span>
            <h1 className="font-display text-3xl font-black tracking-tight leading-none uppercase">
              🔬 Research &amp; Patent Hub
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
              Explore academic publications, check patent registries, draft your complete technical specifications, or pitch research collaboration proposals.
            </p>
          </div>

          {session && (
            <button
              onClick={handleCreateDraft}
              disabled={draftCreating}
              className="cn-btn-yellow text-xs flex items-center gap-1"
            >
              {draftCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create Patent Draft
            </button>
          )}
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Workspace Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Tabs Row */}
            <div className="border-4 border-slate-900 flex bg-white rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {([
                { id: 'publications', label: 'Publications', icon: BookOpen },
                { id: 'patents', label: 'Patent Registry', icon: Award },
                { id: 'ipo', label: 'IPO Filing Guide', icon: Target },
                { id: 'pitches', label: 'Pitches Board', icon: Users }
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
                    className={`flex-1 font-mono text-[10px] font-black uppercase tracking-wider py-3 border-r-4 border-slate-900 last:border-r-0 flex items-center justify-center gap-1.5 transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-transparent text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Filters / Search Bar (Not visible for IPO Guide) */}
            {activeTab !== 'ipo' && (
              <div className="flex gap-3 flex-wrap">
                {/* Search query input */}
                {(activeTab === 'publications' || activeTab === 'patents') && (
                  <div className="flex-1 min-w-[200px] border-4 border-slate-900 bg-white rounded-xl flex items-center px-3 gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={activeTab === 'publications' ? "Search title, abstracts, author..." : "Search patent no, claims..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 bg-transparent text-xs outline-none"
                    />
                  </div>
                )}

                {/* Subject filter (for Publications and pitches) */}
                {(activeTab === 'publications' || activeTab === 'pitches') && (
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="border-4 border-slate-900 p-2 text-xs font-bold uppercase rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
                  >
                    <option value="all">All Subjects</option>
                    {Object.entries(SUBJECT_LABELS).map(([slug, name]) => (
                      <option key={slug} value={slug}>{name}</option>
                    ))}
                  </select>
                )}

                {/* Jurisdiction filter (for Patents) */}
                {activeTab === 'patents' && (
                  <select
                    value={selectedJurisdiction}
                    onChange={(e) => setSelectedJurisdiction(e.target.value)}
                    className="border-4 border-slate-900 p-2 text-xs font-bold uppercase rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
                  >
                    <option value="all">All Jurisdictions</option>
                    <option value="India">India</option>
                    <option value="US">US Patents</option>
                    <option value="PCT">PCT International</option>
                  </select>
                )}
              </div>
            )}

            {/* TAB CONTENT */}
            {loading && activeTab !== 'ipo' ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="font-mono text-xs text-slate-500">Searching registry records...</p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1. Academic Publications Tab */}
                {activeTab === 'publications' && (
                  <>
                    {papers.length === 0 ? (
                      <p className="text-center font-mono text-xs text-slate-400 py-10">No matching research articles discovered.</p>
                    ) : (
                      papers.map(p => (
                        <div key={p.id} className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h2 className="font-display font-black text-sm uppercase tracking-tight text-slate-950 leading-tight">
                              {p.title}
                            </h2>
                            <span className="shrink-0 font-mono text-[9px] font-bold border-2 border-slate-900 px-2 py-0.5 rounded uppercase tracking-wider bg-slate-50">
                              {p.publication_year}
                            </span>
                          </div>
                          
                          <p className="font-mono text-[10px] text-slate-400 mb-3">
                            By {p.authors} · <span className="italic">{p.journal}</span>
                          </p>

                          <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            {p.abstract}
                          </p>

                          <div className="flex items-center justify-between gap-4 flex-wrap pt-3 border-t border-slate-100">
                            {p.subject_slug && (
                              <span className="font-mono text-[9px] font-black text-blue-600 uppercase tracking-wide">
                                {SUBJECT_LABELS[p.subject_slug] || p.subject_slug}
                              </span>
                            )}
                            {p.doi && (
                              <span className="font-mono text-[9px] text-slate-400">
                                DOI: {p.doi}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* 2. Patent Registry Tab */}
                {activeTab === 'patents' && (
                  <>
                    {patents.length === 0 ? (
                      <p className="text-center font-mono text-xs text-slate-400 py-10">No matching patents matched in registry.</p>
                    ) : (
                      patents.map(pat => (
                        <div key={pat.id} className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <span className="font-mono text-[9px] font-bold text-blue-600 tracking-wider block mb-1">
                                {pat.patent_number} ({pat.jurisdiction})
                              </span>
                              <h2 className="font-display font-black text-sm uppercase tracking-tight text-slate-950 leading-tight">
                                {pat.title}
                              </h2>
                            </div>
                            <span className={`shrink-0 font-mono text-[8px] font-black uppercase px-2 py-0.5 border-2 ${
                              pat.status === 'granted' 
                                ? 'border-green-600 text-green-600 bg-green-50/10' 
                                : 'border-amber-600 text-amber-600 bg-amber-50/10'
                            }`}>
                              {pat.status}
                            </span>
                          </div>
                          
                          <p className="font-mono text-[10px] text-slate-400 mb-3">
                            Inventors: {pat.inventors} {pat.assignee && `· Assignee: ${pat.assignee}`}
                          </p>

                          <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            {pat.abstract}
                          </p>

                          {/* Claims index list toggle */}
                          <div className="pt-3 border-t border-slate-100 space-y-2">
                            <span className="font-mono text-[9px] uppercase font-black text-slate-400 block">Independent Claims ({pat.claims.length})</span>
                            <ol className="list-decimal pl-4 space-y-1">
                              {pat.claims.map((claim, idx) => (
                                <li key={idx} className="text-[10px] text-slate-500 leading-relaxed">{claim}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* 3. IPO Filing Guide Tab */}
                {activeTab === 'ipo' && (
                  <div className="border-4 border-slate-900 rounded-xl p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <div>
                      <h2 className="font-display font-black text-lg uppercase mb-1">🏛️ Indian Patent Office (IPO) Filing Workflow</h2>
                      <p className="text-xs text-slate-500">Official protocol sequence for filing polymer and engineering patents in India.</p>
                    </div>

                    {/* Step-by-step roadmap timeline */}
                    <div className="relative border-l-4 border-slate-900 pl-6 space-y-8 ml-2 pt-2">
                      {[
                        { step: 'Step 1', title: 'Prior Art Search (2-3 weeks)', desc: 'Examine existing papers and worldwide patent catalogs to verify novelty and avoid rejection.' },
                        { step: 'Step 2', title: 'Draft Specification (Form 2)', desc: 'Write detailed description, drawings, and numbered claims outlining the bounds of protected invention.' },
                        { step: 'Step 3', title: 'File Forms (Form 1 + Form 2 + Form 5)', desc: 'Submit application (Form 1) with specifications (Form 2) and Declaration of Inventorship (Form 5).' },
                        { step: 'Step 4', title: 'Publication (18 months or early request Form 9)', desc: 'IPO publishes application automatically after 18 months. File Form 9 for early 1-month publication.' },
                        { step: 'Step 5', title: 'Request Examination (Form 18)', desc: 'Must request examination (Form 18) within 48 months of filing to initiate academic review.' },
                        { step: 'Step 6', title: 'First Examination Report (FER) & Response', desc: 'IPO controller issues examination audit report. Draft responses and clear caveats within 6 months.' },
                        { step: 'Step 7', title: 'Grant decision & Maintenance', desc: 'Patent receives final certificate. Pay annual maintenance fees to sustain validity.' }
                      ].map((item, index) => (
                        <div key={index} className="relative">
                          {/* Dot marker */}
                          <div className="absolute -left-[32px] top-0.5 w-4 h-4 rounded-full border-4 border-slate-900 bg-yellow-400" />
                          <h3 className="font-display font-black text-xs uppercase text-blue-600">{item.step}: {item.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 max-w-xl">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Collaboration Pitches Tab */}
                {activeTab === 'pitches' && (
                  <div className="space-y-4">
                    
                    {/* Search strip header */}
                    <div className="flex justify-between items-center gap-4 bg-slate-50 p-4 border-4 border-slate-900 rounded-xl">
                      <div>
                        <h3 className="font-bold text-xs uppercase">Research Collaboration Board</h3>
                        <p className="text-[10px] text-slate-500">Post project specs to recruit student partners or college thesis advisors.</p>
                      </div>
                      {session && (
                        <button
                          onClick={() => setShowPitchModal(true)}
                          className="bg-slate-900 text-white text-[10px] uppercase font-black px-4 py-2 border-2 border-slate-900 shadow-hard-sm hover:bg-slate-800 shrink-0"
                        >
                          + Post Pitch Proposal
                        </button>
                      )}
                    </div>

                    {/* Pitches listing grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pitches.length === 0 ? (
                        <p className="col-span-full text-center font-mono text-xs text-slate-400 py-10">No active collaboration proposals posted in this category.</p>
                      ) : (
                        pitches.map(p => (
                          <div key={p.id} className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-3">
                                <span className="font-mono text-[9px] font-black text-blue-600 uppercase">
                                  {SUBJECT_LABELS[p.subject_slug || ''] || p.subject_slug}
                                </span>
                                <span className="text-[8px] font-black uppercase text-green-600 border border-green-600 px-1.5 py-0.5 rounded">
                                  {p.status}
                                </span>
                              </div>
                              <h3 className="font-display font-black text-sm uppercase leading-tight text-slate-950 line-clamp-2">
                                {p.title}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed">
                                {p.description}
                              </p>
                            </div>

                            <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between gap-3">
                              <div>
                                <span className="block font-bold text-[10px] text-slate-800">
                                  {p.profiles?.full_name || 'Anonymous Researcher'}
                                </span>
                                <span className="block font-mono text-[8px] text-slate-400 truncate max-w-[150px]">
                                  {p.profiles?.college_name || 'Affiliation Pending'}
                                </span>
                              </div>

                              <a
                                href={`mailto:${p.contact_info}`}
                                className="inline-flex items-center gap-1 font-mono text-[9px] font-black uppercase bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 transition-colors"
                              >
                                <Send className="w-3 h-3" /> Contact
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right Sidebar - Drafting Spec History */}
          <div className="space-y-6">
            {session ? (
              <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-violet-600" /> Patent Drafts ({drafts.length})
                  </h3>
                </div>

                {drafts.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-400 italic">No patent drafts created yet.</p>
                    <button
                      onClick={handleCreateDraft}
                      className="text-[9px] font-black uppercase text-blue-600 hover:underline mt-2 inline-block"
                    >
                      + Create first draft
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {drafts.map(d => (
                      <div 
                        key={d.id}
                        className="group flex items-center justify-between gap-3 p-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-all cursor-pointer"
                        onClick={() => window.location.href = `/research/draft/${d.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="block font-bold text-[11px] truncate text-slate-800 group-hover:text-blue-600">
                            {d.title}
                          </span>
                          <span className="block text-[8px] font-mono text-slate-400 uppercase">
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
              <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                <span className="text-2xl block mb-1">🔒</span>
                <h4 className="font-display font-black text-xs uppercase mb-1">Filing Workspace</h4>
                <p className="text-[10px] text-slate-400 leading-normal mb-3">Login to save your patent specifications drafts.</p>
                <Link href="/login" className="inline-block bg-slate-900 text-white font-mono text-[9px] font-black uppercase px-4 py-2 border-2 border-slate-900 shadow-hard-sm hover:bg-slate-800">
                  Authenticate →
                </Link>
              </div>
            )}

            {/* Checklist guide */}
            <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <h4 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                📋 IPO Submission Checklist
              </h4>
              <ul className="space-y-2 font-mono text-[10px] text-slate-500">
                <li className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" /> Form 1: Patent Application
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" /> Form 2: Specification Document
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" /> Form 3: Statement &amp; Undertaking
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" /> Form 5: Declaration of Inventorship
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" /> Form 9: Early Publication request
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" /> Form 18: Examination Request
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Collaboration Pitch submission Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-900 border-4 border-slate-900 rounded-xl max-w-md w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-display font-black text-sm uppercase tracking-wide mb-3">📢 Post Pitch Proposal</h3>
            
            <form onSubmit={handlePitchSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biodegradable PLA/Starch Compounds"
                  value={newPitch.title}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Subject domain</label>
                <select
                  value={newPitch.subject_slug}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, subject_slug: e.target.value }))}
                  className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                >
                  {Object.entries(SUBJECT_LABELS).map(([slug, name]) => (
                    <option key={slug} value={slug}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Technical details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your research proposal, novelty points, and what kind of collaborator profiles you are looking to recruit..."
                  value={newPitch.description}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Contact Email / Info</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. researcher@college.edu"
                  value={newPitch.contact_info}
                  onChange={(e) => setNewPitch(prev => ({ ...prev, contact_info: e.target.value }))}
                  className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowPitchModal(false)}
                  className="px-4 py-2 border-2 border-slate-200 text-xs font-mono font-bold uppercase rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pitchSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-mono font-bold uppercase rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                >
                  {pitchSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit proposal (+10 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
