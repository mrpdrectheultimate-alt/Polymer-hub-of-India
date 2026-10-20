'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MessageSquarePlus, Star, Bug, Lightbulb, BookOpen, Heart, CheckCircle, Eye, ShieldAlert, ArrowLeft } from 'lucide-react'

type Feedback = {
  id: string
  type: string
  rating: number | null
  message: string
  page_url: string | null
  user_email: string | null
  user_name: string | null
  status: string
  admin_note: string | null
  created_at: string
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  bug:     { label: 'Bug',     icon: Bug,                color: '#EA580C', bg: '#FFF7ED' },
  feature: { label: 'Feature', icon: Lightbulb,          color: '#CA8A04', bg: '#FEFCE8' },
  content: { label: 'Content', icon: BookOpen,           color: '#1D4ED8', bg: '#EFF6FF' },
  praise:  { label: 'Praise',  icon: Heart,              color: '#15803D', bg: '#F0FDF4' },
  general: { label: 'General', icon: MessageSquarePlus,  color: '#7C3AED', bg: '#F5F3FF' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:       { label: 'New',       color: '#EA580C' },
  reviewing: { label: 'Reviewing', color: '#CA8A04' },
  planned:   { label: 'Planned',   color: '#1D4ED8' },
  resolved:  { label: 'Resolved',  color: '#15803D' },
}

const RATING_LABELS = ['', 'Very Poor', 'Poor', 'Okay', 'Good', 'Excellent']

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const loadFeedback = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterType !== 'all') params.set('type', filterType)
      if (filterStatus !== 'all') params.set('status', filterStatus)

      const res = await fetch(`/api/admin/feedback?${params.toString()}`)
      if (res.status === 401 || res.status === 403) {
        setError('Forbidden: Administrative access required to view feedback submissions.')
        setLoading(false)
        return
      }

      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setFeedback(data.feedback ?? [])
      }
    } catch (err) {
      console.error('Failed to load admin feedback:', err)
      setError('An error occurred connecting to the admin feedback service.')
    } finally {
      setLoading(false)
    }
  }, [filterType, filterStatus])

  useEffect(() => { loadFeedback() }, [loadFeedback])

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (res.ok) {
        setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f))
        if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, status } : null)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const saveNote = async () => {
    if (!selectedItem) return
    setSavingNote(true)
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedItem.id, adminNote })
      })

      if (res.ok) {
        setFeedback(prev => prev.map(f => f.id === selectedItem.id ? { ...f, admin_note: adminNote } : f))
      }
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setSavingNote(false)
    }
  }

  const counts = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    bugs: feedback.filter(f => f.type === 'bug').length,
    features: feedback.filter(f => f.type === 'feature').length,
    praise: feedback.filter(f => f.type === 'praise').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">Loading feedback records...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="max-w-md w-full border-4 border-ink p-8 bg-white shadow-hard text-center">
          <ShieldAlert className="w-12 h-12 text-crimson mx-auto mb-4" />
          <h2 className="font-display text-xl font-black text-ink uppercase mb-2">Access Restricted</h2>
          <p className="text-xs text-ink/70 leading-relaxed mb-6 font-mono">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="cn-btn-black text-xs">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas p-6 md:p-10 text-ink">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b-4 border-ink pb-6">
          <div>
            <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest">Administrative Control</div>
            <h1 className="font-display text-2xl md:text-3xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
              <span>📋</span> User Feedback &amp; Issues Desk
            </h1>
            <p className="font-mono text-xs text-ink/60 mt-1">Real-time incoming bug reports, feature requests, and inquiries</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/analytics" className="cn-btn-white text-xs">Analytics</Link>
            <Link href="/admin/today" className="cn-btn-white text-xs">Daily News Editor</Link>
            <Link href="/admin/videos" className="cn-btn-white text-xs">Videos</Link>
            <Link href="/dashboard" className="cn-btn-black text-xs flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider">Total Submissions</div>
            <div className="font-display text-2xl font-black text-ink mt-1">{counts.total}</div>
          </div>
          <div className="border-4 border-ink p-4 bg-amber-50 shadow-hard-sm">
            <div className="font-mono text-[9px] text-amber-800 uppercase tracking-wider font-bold">New / Unreviewed</div>
            <div className="font-display text-2xl font-black text-amber-900 mt-1">{counts.new}</div>
          </div>
          <div className="border-4 border-ink p-4 bg-orange-50 shadow-hard-sm">
            <div className="font-mono text-[9px] text-orange-800 uppercase tracking-wider font-bold">Bugs</div>
            <div className="font-display text-2xl font-black text-orange-900 mt-1">{counts.bugs}</div>
          </div>
          <div className="border-4 border-ink p-4 bg-yellow-50 shadow-hard-sm">
            <div className="font-mono text-[9px] text-yellow-800 uppercase tracking-wider font-bold">Feature Requests</div>
            <div className="font-display text-2xl font-black text-yellow-900 mt-1">{counts.features}</div>
          </div>
          <div className="border-4 border-ink p-4 bg-emerald-50 shadow-hard-sm">
            <div className="font-mono text-[9px] text-emerald-800 uppercase tracking-wider font-bold">Love / Praise</div>
            <div className="font-display text-2xl font-black text-emerald-900 mt-1">{counts.praise}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest">Filter Type:</span>
          {['all', 'bug', 'feature', 'content', 'praise', 'general'].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`font-mono text-[10px] font-bold px-3 py-1 border-2 border-ink uppercase tracking-wider transition-all ${filterType === t ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-canvas'}`}>
              {t}
            </button>
          ))}
          <span className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest ml-4">Status:</span>
          {['all', 'new', 'reviewing', 'planned', 'resolved'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`font-mono text-[10px] font-bold px-3 py-1 border-2 border-ink uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-canvas'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* List column */}
          <div className="space-y-3">
            {feedback.length === 0 ? (
              <div className="border-4 border-ink border-dashed p-12 text-center bg-white">
                <p className="font-display text-lg font-black text-ink/30">No feedback matching filters</p>
              </div>
            ) : (
              feedback.map(item => {
                const typeCfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.general
                const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.new
                const isSelected = selectedItem?.id === item.id

                return (
                  <div key={item.id} onClick={() => { setSelectedItem(item); setAdminNote(item.admin_note ?? '') }}
                    className={`border-4 border-ink p-4 bg-white cursor-pointer transition-all shadow-hard-sm hover:shadow-hard ${isSelected ? 'ring-4 ring-blue' : ''}`}>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] font-black border-2 border-ink px-2 py-0.5 uppercase tracking-wider"
                          style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}>
                          {typeCfg.label}
                        </span>
                        <span className="font-mono text-[9px] font-bold text-white px-2 py-0.5 uppercase"
                          style={{ backgroundColor: statusCfg.color }}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-ink/40">{new Date(item.created_at).toLocaleDateString('en-IN')}</span>
                    </div>

                    <p className="text-xs text-ink font-medium line-clamp-2 leading-relaxed">{item.message}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t-2 border-ink/10 text-[10px] font-mono text-ink/50">
                      <span>{item.user_name || item.user_email || 'Anonymous Student'}</span>
                      {item.rating && (
                        <span className="flex items-center gap-0.5 font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {item.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Detail panel */}
          {selectedItem ? (
            <div className="border-4 border-ink p-6 bg-white shadow-hard space-y-5 sticky top-6">
              <div className="flex items-center justify-between border-b-2 border-ink/20 pb-4">
                <div>
                  <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest">Detail View</div>
                  <h3 className="font-display text-lg font-black text-ink uppercase">Feedback Item</h3>
                </div>
                <button onClick={() => setSelectedItem(null)} className="font-mono text-xs text-ink/50 hover:text-ink">✕ Close</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-4 border-ink p-3 bg-canvas">
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Category</div>
                    <div className="font-mono text-sm font-black" style={{ color: TYPE_CONFIG[selectedItem.type]?.color }}>
                      {TYPE_CONFIG[selectedItem.type]?.label}
                    </div>
                  </div>
                  <div className="border-4 border-ink p-3 bg-canvas">
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Rating</div>
                    <div className="font-mono text-sm font-black text-ink">{selectedItem.rating ? `${selectedItem.rating}/5 (${RATING_LABELS[selectedItem.rating]})` : 'Not rated'}</div>
                  </div>
                  {selectedItem.user_name && (
                    <div className="border-4 border-ink p-3 bg-canvas">
                      <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Student</div>
                      <div className="font-mono text-xs font-bold text-ink">{selectedItem.user_name}</div>
                    </div>
                  )}
                  {selectedItem.user_email && (
                    <div className="border-4 border-ink p-3 bg-canvas">
                      <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Email</div>
                      <a href={`mailto:${selectedItem.user_email}`} className="font-mono text-xs font-bold text-blue hover:underline truncate block">{selectedItem.user_email}</a>
                    </div>
                  )}
                  {selectedItem.page_url && (
                    <div className="border-4 border-ink p-3 col-span-2 bg-canvas">
                      <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Sent from page</div>
                      <div className="font-mono text-xs font-bold text-ink break-all">{selectedItem.page_url}</div>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="border-4 border-ink p-4" style={{ backgroundColor: TYPE_CONFIG[selectedItem.type]?.bg }}>
                  <div className="font-mono text-[8px] text-ink/50 uppercase tracking-wider mb-2">Message</div>
                  <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{selectedItem.message}</p>
                </div>

                {/* Status control */}
                <div>
                  <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Update Status</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => (
                      <button key={statusKey} onClick={() => updateStatus(selectedItem.id, statusKey)}
                        className="font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase tracking-wider transition-all"
                        style={{
                          backgroundColor: selectedItem.status === statusKey ? cfg.color : 'white',
                          color: selectedItem.status === statusKey ? 'white' : '#6B7280',
                        }}>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin note */}
                <div>
                  <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Internal Note</div>
                  <textarea
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    rows={3}
                    className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet resize-none shadow-hard-sm bg-canvas"
                    placeholder="Add a note for yourself — what action you took, what you planned..."
                  />
                  <button onClick={saveNote} disabled={savingNote}
                    className="cn-btn-black text-xs mt-2 disabled:opacity-50">
                    {savingNote ? 'Saving...' : <><CheckCircle className="w-3.5 h-3.5" /> Save Note</>}
                  </button>
                </div>

                <div className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">
                  Received: {new Date(selectedItem.created_at).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ) : (
            <div className="border-4 border-ink border-dashed p-12 text-center flex flex-col items-center justify-center bg-white h-64">
              <Eye className="w-10 h-10 text-ink/20 mb-3" />
              <p className="font-display text-lg font-black text-ink/30">Select a feedback item</p>
              <p className="font-mono text-[9px] text-ink/20 uppercase tracking-wider mt-1">Click any item to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
