'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Check, AlertCircle, Trash2, Eye, FlaskConical, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

type Category = 'Research' | 'Market' | 'India' | 'Sustainability' | 'Policy' | 'Innovation' | 'Recycling' | 'Bioplastics'
type Region = 'India' | 'Global' | 'Regional'
type EditorialStatus = 'draft' | 'source_checked' | 'image_rights_verified' | 'reviewed' | 'published'

type FormData = {
  headline: string
  summary: string
  source_name: string
  source_url: string
  image_url: string
  image_credit: string
  category: Category
  region: Region
  related_lesson_slug: string
  related_subject_slug: string
  is_featured: boolean
  publish_date: string
  editorial_status: EditorialStatus
}

interface RecentEntry {
  id: string
  headline: string
  category: Category
  region: Region
  is_featured: boolean
  publish_date: string
  source_name: string
  editorial_status: EditorialStatus
}

const EMPTY_FORM: FormData = {
  headline: '',
  summary: '',
  source_name: '',
  source_url: '',
  image_url: '',
  image_credit: '',
  category: 'Research',
  region: 'Global',
  related_lesson_slug: '',
  related_subject_slug: '',
  is_featured: false,
  publish_date: new Date().toISOString().split('T')[0],
  editorial_status: 'draft',
}

const CATEGORIES: { value: Category; color: string; bg: string }[] = [
  { value: 'Research', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: 'Market', color: '#CA8A04', bg: '#FEFCE8' },
  { value: 'India', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: 'Sustainability', color: '#15803D', bg: '#F0FDF4' },
  { value: 'Policy', color: '#7C3AED', bg: '#F5F3FF' },
  { value: 'Innovation', color: '#EA580C', bg: '#FFF7ED' },
  { value: 'Recycling', color: '#15803D', bg: '#F0FDF4' },
  { value: 'Bioplastics', color: '#15803D', bg: '#F0FDF4' },
]

const REGIONS: Region[] = ['India', 'Global', 'Regional']

const WORKFLOW_STEPS: { status: EditorialStatus; label: string; desc: string }[] = [
  { status: 'draft', label: 'Draft', desc: 'Initial submission' },
  { status: 'source_checked', label: 'Source Checked', desc: 'Source link verified' },
  { status: 'image_rights_verified', label: 'Image Rights', desc: 'Image credit checked' },
  { status: 'reviewed', label: 'Reviewed', desc: 'Editorial review done' },
  { status: 'published', label: 'Published', desc: 'Live on Daily Pulse' },
]

const SUBJECT_SLUGS = [
  'polymer-chemistry', 'polymer-processing', 'mould-design',
  'polymer-testing', 'rubber-technology', 'recycling-technology',
  'sustainable-plastics', 'polymer-composites', 'entrepreneurship-plastics', 'medical-plastics',
]

const QUICK_SOURCES = [
  { name: 'Plastics News', url: 'https://www.plasticsnews.com' },
  { name: 'PlasticsToday', url: 'https://www.plasticstoday.com' },
  { name: 'Plastics Technology', url: 'https://www.ptonline.com' },
  { name: 'Chemical Weekly India', url: 'https://www.chemicalweekly.com' },
  { name: 'Sustainable Plastics', url: 'https://www.sustainableplastics.com' },
  { name: 'CIPET Press Office', url: 'https://www.cipet.gov.in' },
  { name: 'Business Standard', url: 'https://www.business-standard.com' },
  { name: 'The Hindu BusinessLine', url: 'https://www.thehindubusinessline.com' },
]

export default function AdminTodayPage() {
  const supabase = createClient()
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [todayCount, setTodayCount] = useState<number | null>(null)
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  const loadRecent = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('daily_updates')
      .select('id, headline, category, region, is_featured, publish_date, source_name, editorial_status')
      .eq('publish_date', today)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRecentEntries(data as RecentEntry[])
      setTodayCount(data.length)
    }
    setLoaded(true)
  }

  if (!loaded) loadRecent()

  const handleSubmit = async () => {
    if (!form.headline.trim() || !form.summary.trim() || !form.source_name.trim()) {
      setErrorMsg('Headline, summary, and source name are required.')
      setStatus('error')
      return
    }

    setStatus('saving')
    setErrorMsg('')

    const { error } = await supabase
      .from('daily_updates')
      .insert({
        headline: form.headline.trim(),
        summary: form.summary.trim(),
        source_name: form.source_name.trim(),
        source_url: form.source_url.trim() || null,
        image_url: form.image_url.trim() || null,
        image_credit: form.image_credit.trim() || null,
        category: form.category,
        region: form.region,
        related_lesson_slug: form.related_lesson_slug.trim() || null,
        related_subject_slug: form.related_subject_slug.trim() || null,
        is_featured: form.is_featured,
        publish_date: form.publish_date,
        editorial_status: form.editorial_status,
        is_published: form.editorial_status === 'published',
      })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('success')
      setForm({ ...EMPTY_FORM, publish_date: form.publish_date })
      loadRecent()
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('daily_updates').delete().eq('id', id)
    loadRecent()
  }

  const setQuickSource = (src: { name: string; url: string }) => {
    setForm((f) => ({ ...f, source_name: src.name, source_url: src.url }))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="border-b-4 border-slate-900 bg-slate-900 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-400 border-4 border-yellow-400 flex items-center justify-center rounded">
            <FlaskConical className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <div className="font-display text-lg font-black text-white">Daily Pulse Admin</div>
            <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Content Engine · PolymerHub</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {todayCount !== null && (
            <div className="border-2 border-yellow-400 px-3 py-1 rounded bg-yellow-400/5">
              <span className="font-mono text-xs font-black text-yellow-400">{todayCount} stories today</span>
            </div>
          )}
          <Link href="/today" className="border-2 border-white/20 text-white font-mono text-xs font-bold px-3 py-2 hover:bg-white/10 transition-colors flex items-center gap-1.5 rounded-lg">
            <Eye className="w-3.5 h-3.5" /> Preview /today
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ADD STORY FORM */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_#000] bg-white rounded-xl">
              <div className="border-b-4 border-slate-900 px-5 py-4 bg-yellow-400 flex items-center justify-between">
                <h2 className="font-display text-lg font-black text-slate-950 uppercase tracking-wide">Add Daily update</h2>
                <div className="font-mono text-[9px] font-bold text-slate-900 border-2 border-slate-900 px-2 py-0.5 uppercase tracking-wider rounded bg-white">
                  {form.publish_date}
                </div>
              </div>

              <div className="p-6 space-y-5">

                {/* Workflow Status Tracker */}
                <div className="border-2 border-slate-200 bg-slate-50 p-4 rounded-xl">
                  <span className="font-mono text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">
                    Editorial Workflow Tracker
                  </span>
                  
                  {/* Visual tracker chain */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                    {WORKFLOW_STEPS.map((step, idx) => {
                      const isActive = form.editorial_status === step.status
                      const isCompleted = WORKFLOW_STEPS.findIndex(s => s.status === form.editorial_status) >= idx
                      
                      return (
                        <button
                          key={step.status}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, editorial_status: step.status }))}
                          className="flex items-center gap-2 group text-left w-full sm:w-auto"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100'
                              : isCompleted
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white border-slate-300 text-slate-400 group-hover:border-slate-400'
                          }`}>
                            {isCompleted && !isActive ? '✓' : idx + 1}
                          </div>
                          <div>
                            <span className={`text-xs font-bold block ${
                              isActive ? 'text-blue-600 font-extrabold' : isCompleted ? 'text-emerald-600' : 'text-slate-500'
                            }`}>
                              {step.label}
                            </span>
                            <span className="text-[9px] text-slate-400 block sm:hidden md:block">
                              {step.desc}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.headline}
                    onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                    className="w-full border-2 border-slate-900 rounded-lg p-3 font-bold text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    rows={2}
                    placeholder="MIT Engineers Synthesize Self-Healing Biopolymer..."
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Summary (2–3 sentences) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.summary}
                    onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                    className="w-full border-2 border-slate-900 rounded-lg p-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    rows={3}
                    placeholder="Key finding, why it matters, India connection..."
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Source & Links <span className="text-red-500">*</span>
                  </label>
                  {/* Quick source buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {QUICK_SOURCES.map((src) => (
                      <button
                        key={src.name}
                        type="button"
                        onClick={() => setQuickSource(src)}
                        className={`font-mono text-[9px] font-bold border-2 px-2.5 py-1 rounded-md uppercase tracking-wider transition-colors ${
                          form.source_name === src.name
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 bg-slate-55'
                        }`}
                      >
                        {src.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={form.source_name}
                      onChange={(e) => setForm((f) => ({ ...f, source_name: e.target.value }))}
                      className="border-2 border-slate-900 rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Source name"
                    />
                    <input
                      value={form.source_url}
                      onChange={(e) => setForm((f) => ({ ...f, source_url: e.target.value }))}
                      className="border-2 border-slate-900 rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="https://source.com/article"
                    />
                  </div>
                </div>

                {/* Image URL & Credit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Image URL (Unsplash)
                    </label>
                    <input
                      value={form.image_url}
                      onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                      className="w-full border-2 border-slate-900 rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Image Credit / License
                    </label>
                    <input
                      value={form.image_credit}
                      onChange={(e) => setForm((f) => ({ ...f, image_credit: e.target.value }))}
                      className="w-full border-2 border-slate-900 rounded-lg p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Photo by John Doe on Unsplash"
                    />
                  </div>
                </div>

                {form.image_url && (
                  <div className="relative mt-1 border-2 border-slate-900 rounded-lg overflow-hidden h-24">
                    <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                    {form.image_credit && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-[8px] text-white px-2 py-0.5 rounded font-mono">
                        📸 {form.image_credit}
                      </span>
                    )}
                  </div>
                )}

                {/* Category & Region */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                          className={`font-mono text-[9px] font-black border-2 px-2.5 py-1.5 uppercase tracking-wider rounded-lg transition-all ${
                            form.category === cat.value
                              ? 'text-white border-current'
                              : 'border-slate-200 text-slate-500 hover:border-slate-950'
                          }`}
                          style={form.category === cat.value ? { backgroundColor: cat.color, borderColor: cat.color } : { color: cat.color }}
                        >
                          {cat.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Region</label>
                    <div className="flex gap-2">
                      {REGIONS.map((reg) => {
                        const isSel = form.region === reg
                        return (
                          <button
                            key={reg}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, region: reg }))}
                            className={`w-full py-2 border-2 text-xs font-bold rounded-lg uppercase transition-all ${
                              isSel
                                ? 'bg-slate-900 text-white border-slate-900 shadow'
                                : 'border-slate-200 text-slate-600 hover:border-slate-900'
                            }`}
                          >
                            {reg}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Featured Checkbox & Publish Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Publish Date</label>
                    <input
                      type="date"
                      value={form.publish_date}
                      onChange={(e) => setForm((f) => ({ ...f, publish_date: e.target.value }))}
                      className="w-full border-2 border-slate-900 rounded-lg p-3 text-sm text-slate-800 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer border-2 border-slate-900 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider">⭐ Featured on /today</span>
                    </label>
                  </div>
                </div>

                {/* Lesson linkage */}
                <div className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="font-mono text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                    🔗 Related Lesson Linkage (Optional)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Subject Slug</label>
                      <select
                        value={form.related_subject_slug}
                        onChange={(e) => setForm((f) => ({ ...f, related_subject_slug: e.target.value }))}
                        className="w-full border-2 border-slate-900 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:outline-none bg-white"
                      >
                        <option value="">No subject</option>
                        {SUBJECT_SLUGS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Lesson Slug</label>
                      <input
                        value={form.related_lesson_slug}
                        onChange={(e) => setForm((f) => ({ ...f, related_lesson_slug: e.target.value }))}
                        className="w-full border-2 border-slate-900 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
                        placeholder="lesson-slug-here"
                      />
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {status === 'success' && (
                  <div className="border-2 border-emerald-500 bg-emerald-50 p-3 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wider">Story saved successfully!</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="border-2 border-red-500 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-xs font-bold text-red-600">{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === 'saving'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs py-3.5 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
                >
                  {status === 'saving' ? (
                    <>Saving...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Save Update</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* TODAY'S STORIES SIDEBAR */}
          <div className="space-y-6">
            <div className="border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_#000] bg-white rounded-xl">
              <div className="border-b-4 border-slate-900 px-4 py-4 bg-slate-900 text-white">
                <div className="font-mono text-[9px] font-bold text-yellow-bright uppercase tracking-widest mb-0.5">Today&apos;s Stories</div>
                <div className="font-display text-lg font-black">
                  {todayCount ?? '...'} / 8 targets
                </div>
              </div>

              {/* Progress bar */}
              <div className="border-b-4 border-slate-900 h-3 bg-slate-100">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${Math.min(((todayCount ?? 0) / 8) * 100, 100)}%` }}
                />
              </div>

              <div className="divide-y-2 divide-slate-100">
                {recentEntries.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-wider">No updates today yet</p>
                  </div>
                ) : (
                  recentEntries.map((entry) => {
                    const cat = CATEGORIES.find((c) => c.value === entry.category)
                    return (
                      <div key={entry.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap gap-1 items-center">
                            {entry.is_featured && (
                              <span className="font-mono text-[8px] font-black border border-yellow-600 bg-yellow-50 text-yellow-700 px-1 rounded">
                                ⭐ Featured
                              </span>
                            )}
                            <span
                              className="font-mono text-[8px] font-black border px-1 rounded"
                              style={{ borderColor: cat?.color, color: cat?.color, backgroundColor: cat?.bg }}
                            >
                              {entry.category}
                            </span>
                            <span className="font-mono text-[8px] bg-slate-100 px-1 rounded text-slate-600 border border-slate-200 uppercase">
                              {entry.region}
                            </span>
                            <span className="font-mono text-[8px] bg-blue-50 text-blue-700 border border-blue-100 px-1 rounded uppercase">
                              {entry.editorial_status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 font-semibold leading-snug line-clamp-2">{entry.headline}</p>
                          <p className="font-mono text-[9px] text-slate-400">{entry.source_name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="border border-red-200 rounded p-1 text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Editorial Quick Tips */}
            <div className="border-4 border-slate-900 p-4 bg-emerald-50/20 rounded-xl shadow-[4px_4px_0px_0px_#0A0A0A] flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Editorial Pipeline Guideline</h4>
                <div className="space-y-1 text-[9px] text-slate-500 font-mono leading-relaxed">
                  <p>1. Check your source fact metrics (Source Check).</p>
                  <p>2. Credit photographer and check visual rights (Image Rights).</p>
                  <p>3. Complete secondary peer editor review (Reviewed).</p>
                  <p>4. Save state as &quot;Published&quot; to push story live.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
