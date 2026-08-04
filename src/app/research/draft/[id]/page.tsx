// src/app/research/draft/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Loader2, 
  Target, 
  CheckCircle,
  FileCheck
} from 'lucide-react'

export default function PatentDraftingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  
  // Draft Data States
  const [title, setTitle] = useState('')
  const [fieldOfInvention, setFieldOfInvention] = useState('')
  const [abstract, setAbstract] = useState('')
  const [description, setDescription] = useState('')
  const [claims, setClaims] = useState<string[]>([])
  const [status, setStatus] = useState<'draft' | 'submitted'>('draft')

  // UI States
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newClaimText, setNewClaimText] = useState('')
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    form1: true,
    form2: true,
    form5: false,
    form9: false,
    form18: false
  })

  // 1. Get Auth Session
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  // 2. Fetch existing Draft spec
  useEffect(() => {
    if (!session?.user?.id || !id) return
    const userId = session.user.id
    async function loadDraft() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('patent_drafts')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single()

        if (error) throw error
        if (data) {
          setTitle(data.title || 'Untitled Patent Draft')
          setFieldOfInvention(data.field_of_invention || '')
          setAbstract(data.abstract || '')
          setDescription(data.description || '')
          setStatus(data.status || 'draft')
          
          // Parse claims jsonb
          if (data.claims) {
            try {
              const parsed = typeof data.claims === 'string' ? JSON.parse(data.claims) : data.claims
              if (Array.isArray(parsed)) {
                setClaims(parsed)
              }
            } catch {
              setClaims([])
            }
          }
        }
      } catch (err) {
        console.error('Failed to load patent draft spec:', err)
        router.push('/research')
      } finally {
        setLoading(false)
      }
    }
    loadDraft()
  }, [session, id, router])

  // 3. Save Draft
  const handleSave = async (silent = false) => {
    if (!session || !id) return
    if (!silent) setSaving(true)
    try {
      const res = await fetch('/api/research/drafts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          field_of_invention: fieldOfInvention,
          abstract,
          description,
          claims, // gets stringified inside the route handler
          status
        })
      })
      if (!res.ok) throw new Error('Save failed')
    } catch (err) {
      console.error('Failed to save patent draft:', err)
      if (!silent) alert('Failed to save specifications. Please try again.')
    } finally {
      if (!silent) setSaving(false)
    }
  }

  // 4. Add Claim
  const handleAddClaim = () => {
    if (!newClaimText.trim()) return
    setClaims(prev => [...prev, newClaimText.trim()])
    setNewClaimText('')
  }

  // 5. Remove Claim
  const handleRemoveClaim = (idx: number) => {
    setClaims(prev => prev.filter((_, i) => i !== idx))
  }

  // 6. Submit Specification
  const handleSubmitSpecification = async () => {
    if (!confirm('Are you ready to submit this Complete Specification for examiner review? This locks editing.')) return
    setStatus('submitted')
    // Save draft after updating state
    setTimeout(() => handleSave(true), 200)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Entering drafting workspace...</p>
      </div>
    )
  }

  const isLocked = status === 'submitted'

  return (
    <div className="min-h-screen bg-canvas text-slate-900 pb-20 dark:text-slate-100">
      <div className="h-2 bg-blue-600" />

      {/* Top Header */}
      <section className="border-b-4 border-slate-900 bg-slate-900 text-white px-6 py-6 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/research"
              className="p-1.5 border-2 border-white/20 rounded hover:bg-white/10 text-white transition-colors"
              title="Back to Research Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold block mb-0.5">Patent Specification Workspace</span>
              <h1 className="font-display text-lg font-black uppercase tracking-tight truncate max-w-md">
                {title || 'Untitled Draft'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isLocked && (
              <>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="cn-btn-yellow text-xs flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Draft
                </button>
                <button
                  onClick={handleSubmitSpecification}
                  className="bg-green-600 border-2 border-slate-900 text-white font-mono text-[10px] font-black uppercase tracking-wider px-4 py-2 hover:bg-green-700 shadow-hard-sm"
                >
                  Submit Spec
                </button>
              </>
            )}
            {isLocked && (
              <span className="font-mono text-xs font-black uppercase text-green-500 border-2 border-green-500 bg-green-50/10 px-3 py-1.5 rounded flex items-center gap-1">
                <FileCheck className="w-4 h-4" /> Submitted (Locked)
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Editor Layout Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Editing Panels (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Basic Specifications Details card */}
            <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Invention Title</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter clear, concise title of the polymer/plastic invention..."
                  className="w-full p-2.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Field of Invention (Technical Scope)</label>
                <textarea
                  rows={3}
                  disabled={isLocked}
                  value={fieldOfInvention}
                  onChange={(e) => setFieldOfInvention(e.target.value)}
                  placeholder="e.g. This invention relates to multi-layer plastic packaging films, specifically to formulations displaying oxygen-scavenging barrier actions..."
                  className="w-full p-2.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Abstract Summary</label>
                <textarea
                  rows={3}
                  disabled={isLocked}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Provide a brief technical summary of disclosure (max 150 words)..."
                  className="w-full p-2.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-black uppercase text-slate-400 mb-1">Detailed Description (Prior Art &amp; Embodiments)</label>
                <textarea
                  rows={8}
                  disabled={isLocked}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Elaborate on background prior art, technical problems solved, and detail working embodiments with processing conditions (extrusion heats, compounding ratios, etc.)."
                  className="w-full p-2.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
                />
              </div>
            </div>

            {/* 2. Structured Claims Editor card */}
            <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none space-y-4">
              <div>
                <h3 className="font-display font-black text-sm uppercase mb-1">Numbered Claims Definition</h3>
                <p className="text-[10px] text-slate-500">Add precise legal clauses defining the novelty bounds of protection.</p>
              </div>

              {!isLocked && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newClaimText}
                    onChange={(e) => setNewClaimText(e.target.value)}
                    placeholder="Enter claim text (e.g. A polymeric blend comprising 10-20% bio-sulfur...)"
                    className="flex-1 p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddClaim() }}
                  />
                  <button
                    onClick={handleAddClaim}
                    className="bg-slate-900 text-white text-xs font-mono font-black px-4 py-2 border-2 border-slate-900 shadow-hard-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-800 uppercase flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              )}

              {claims.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No claims defined. Add at least one independent claim above.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {claims.map((claim, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-2 text-xs leading-relaxed">
                        <span className="font-bold text-blue-600 font-mono select-none">{idx + 1}.</span>
                        <span className="text-slate-700 dark:text-slate-300">{claim}</span>
                      </div>
                      
                      {!isLocked && (
                        <button
                          onClick={() => handleRemoveClaim(idx)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Remove claim"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Checklist Sidebar (Right Column) */}
          <div className="space-y-6">
            
            {/* Checklist form tracker */}
            <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none space-y-4">
              <div>
                <h3 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-600" /> IPO Filing Progress Checklist
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">Review the legal documents required to file this patent application.</p>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'form1', label: 'Form 1 — Application for Patent', desc: 'Indicates basic details of inventor/assignee.' },
                  { key: 'form2', label: 'Form 2 — Specifications Document', desc: 'Provisional or Complete specification drafted here.' },
                  { key: 'form5', label: 'Form 5 — Declaration of Inventorship', desc: 'Required declaration within 1 month of filing.' },
                  { key: 'form9', label: 'Form 9 — Request for Early Publication', desc: 'Optional early 1-month publication fee request.' },
                  { key: 'form18', label: 'Form 18 — Request for Examination', desc: 'Mandatory command to start intellectual review.' }
                ].map(item => (
                  <div 
                    key={item.key} 
                    className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    onClick={() => {
                      if (isLocked) return
                      setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))
                    }}
                  >
                    <input
                      type="checkbox"
                      disabled={isLocked}
                      checked={checklist[item.key] || false}
                      onChange={() => {}} // handled by click
                      className="mt-0.5 rounded cursor-pointer border-2 border-slate-900 dark:border-slate-800"
                    />
                    <div>
                      <span className={`block font-bold text-[10px] uppercase leading-tight ${
                        checklist[item.key] ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {item.label}
                      </span>
                      <span className="block text-[8px] text-slate-400 leading-snug">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IP Drafting Guide advice */}
            <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none space-y-3">
              <h4 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" /> Writing Guidelines
              </h4>
              <ul className="space-y-2 font-mono text-[9px] text-slate-500 leading-normal">
                <li>
                  <strong>1. Claim Structure:</strong> Begin Claim 1 as a generic category (e.g. &quot;A polymeric composite composition comprising...&quot;). Maintain logical hierarchy.
                </li>
                <li>
                  <strong>2. Detailed Description:</strong> Mention specific polymer ratios, extruder thermal temperatures, injection pressure bars, and curing cycle times for reproducibility.
                </li>
                <li>
                  <strong>3. Prior Art Contrast:</strong> Clearly highlight in description why this chemical matrix or physical design offers unexpected properties compared to standard options.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
