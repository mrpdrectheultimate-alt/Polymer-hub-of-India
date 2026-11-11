'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  Calendar,
  MapPin,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Tag,
  Clock,
  ShieldCheck,
  Filter
} from 'lucide-react'
import { IndustryEvent, computeEventStatus } from '@/lib/industry_events_data'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<IndustryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'all' | 'upcoming' | 'live' | 'concluded'>('upcoming')
  const [cityFilter, setCityFilter] = useState('all')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<IndustryEvent | null>(null)

  // Edit Date & Venue Form State
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [editDateDisplay, setEditDateDisplay] = useState('')
  const [editVenue, setEditVenue] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // Add Form State
  const [newTitle, setNewTitle] = useState('')
  const [newShortTitle, setNewShortTitle] = useState('')
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [newDateDisplay, setNewDateDisplay] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newState, setNewState] = useState('')
  const [newVenue, setNewVenue] = useState('')
  const [newFocus, setNewFocus] = useState('')
  const [newOrganizer, setNewOrganizer] = useState('')
  const [newSourceUrl, setNewSourceUrl] = useState('')
  const [newFocusTags, setNewFocusTags] = useState('')
  const [newPriorityBadge, setNewPriorityBadge] = useState<'P0 Flagship' | 'P1 Regional' | 'P1 Research'>('P1 Regional')
  const [newEventType, setNewEventType] = useState<'Exhibition & Expo' | 'Academic Conference' | 'Industry Summit'>('Exhibition & Expo')
  const [addSaving, setAddSaving] = useState(false)

  // Fetch events
  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/community/industry-events')
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Administrative access required to manage industry exhibitions.')
          setLoading(false)
          return
        }
        throw new Error('Failed to retrieve events')
      }
      const data = await res.json()
      setEvents(data.events || [])
    } catch (err) {
      console.error('Failed to load events:', err)
      setError('An error occurred connecting to the industry events service.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Flash notification helper
  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  // Populate Edit Modal
  const openEditModal = (ev: IndustryEvent) => {
    setEditingEvent(ev)
    setEditStartDate(ev.startDate)
    setEditEndDate(ev.endDate)
    setEditDateDisplay(ev.dateDisplay)
    setEditVenue(ev.venue)
    setEditCity(ev.city)
  }

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return
    setEditSaving(true)

    try {
      const res = await fetch('/api/community/industry-events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          slug: editingEvent.slug,
          updates: {
            startDate: editStartDate,
            endDate: editEndDate,
            dateDisplay: editDateDisplay,
            venue: editVenue,
            city: editCity
          }
        })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to update event')
      }

      showToast('success', `Updated dates & venue for "${editingEvent.shortTitle}"`)
      setEditingEvent(null)
      loadEvents()
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update event')
    } finally {
      setEditSaving(false)
    }
  }

  // Save New Exhibition
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddSaving(true)

    try {
      const tagsArray = newFocusTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: newTitle,
        shortTitle: newShortTitle || newTitle,
        startDate: newStartDate,
        endDate: newEndDate,
        dateDisplay: newDateDisplay || `${newStartDate} to ${newEndDate}`,
        city: newCity,
        state: newState || 'India',
        venue: newVenue,
        focus: newFocus,
        focusTags: tagsArray.length ? tagsArray : ['Polymer Exhibition', newCity],
        organizer: newOrganizer,
        sourceUrl: newSourceUrl,
        sourceName: `${newOrganizer} Official Portal`,
        eventType: newEventType,
        priorityBadge: newPriorityBadge,
        isAnchorEvent: newPriorityBadge === 'P0 Flagship'
      }

      const res = await fetch('/api/community/industry-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to publish event')
      }

      showToast('success', `Exhibition "${newShortTitle || newTitle}" successfully published!`)
      setShowAddModal(false)

      // Reset form
      setNewTitle('')
      setNewShortTitle('')
      setNewStartDate('')
      setNewEndDate('')
      setNewDateDisplay('')
      setNewCity('')
      setNewState('')
      setNewVenue('')
      setNewFocus('')
      setNewOrganizer('')
      setNewSourceUrl('')
      setNewFocusTags('')

      loadEvents()
    } catch (err: any) {
      showToast('error', err.message || 'Failed to publish exhibition')
    } finally {
      setAddSaving(false)
    }
  }

  // Handle Delete/Archive
  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the active feed?`)) {
      return
    }

    try {
      const res = await fetch(`/api/community/industry-events?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete event')
      showToast('success', `Removed "${title}" from feed.`)
      loadEvents()
    } catch (err: any) {
      showToast('error', err.message || 'Failed to remove event')
    }
  }

  // Dynamic Partitioning & Stats
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const stats = useMemo(() => {
    let upcoming = 0
    let live = 0
    let concluded = 0

    events.forEach((e) => {
      if (e.startDate <= todayStr && e.endDate >= todayStr) {
        live++
        upcoming++
      } else if (e.endDate >= todayStr) {
        upcoming++
      } else {
        concluded++
      }
    })

    return { total: events.length, upcoming, live, concluded }
  }, [events, todayStr])

  // Unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>()
    events.forEach((e) => {
      if (e.city) cities.add(e.city)
    })
    return Array.from(cities).sort()
  }, [events])

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Search
      const q = searchQuery.toLowerCase()
      const matchQuery =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.shortTitle.toLowerCase().includes(q) ||
        ev.city.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.organizer.toLowerCase().includes(q) ||
        ev.focusTags.some((t) => t.toLowerCase().includes(q))

      // View mode
      let matchMode = true
      if (viewMode === 'upcoming') {
        matchMode = ev.endDate >= todayStr
      } else if (viewMode === 'live') {
        matchMode = ev.startDate <= todayStr && ev.endDate >= todayStr
      } else if (viewMode === 'concluded') {
        matchMode = ev.endDate < todayStr
      }

      // City
      const matchCity = cityFilter === 'all' || ev.city.toLowerCase() === cityFilter.toLowerCase()

      return matchQuery && matchMode && matchCity
    }).sort((a, b) => {
      if (viewMode === 'concluded') {
        return b.endDate.localeCompare(a.endDate) // Most recent past first
      }
      return a.startDate.localeCompare(b.startDate) // Nearest upcoming first
    })
  }, [events, searchQuery, viewMode, cityFilter, todayStr])

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-12 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b-4 border-slate-900 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-sm inline-flex mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Administrative Operations Console
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Exhibitions &amp; Industry Events Desk
            </h1>
            <p className="font-mono text-xs text-slate-600 mt-1">
              National trade expos &middot; Real-time schedule governance &middot; Dynamic auto-archiving
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2.5 bg-white border-2 border-slate-900 hover:bg-slate-100 text-slate-900 font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin Hub
            </Link>
            <Link
              href="/community"
              target="_blank"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              Live Calendar <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Exhibition
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`p-4 rounded-xl font-mono text-xs font-bold border-2 flex items-center justify-between transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                : 'bg-red-50 text-red-900 border-red-500'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-500 hover:text-slate-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border-2 border-red-500 text-red-900 font-mono text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-4 border-slate-900 p-4 bg-white shadow-[4px_4px_0px_0px_#0A0A0A] rounded-xl">
            <div className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Total Tracked</div>
            <div className="font-display text-3xl font-black text-slate-900 mt-1">{stats.total}</div>
            <div className="text-[10px] font-mono text-slate-500 font-medium mt-1">
              Verified 2026–2027 calendar
            </div>
          </div>

          <div className="border-4 border-slate-900 p-4 bg-blue-50 shadow-[4px_4px_0px_0px_#0A0A0A] rounded-xl">
            <div className="font-mono text-[9px] text-blue-800 uppercase tracking-wider font-bold">Upcoming Active</div>
            <div className="font-display text-3xl font-black text-blue-950 mt-1">{stats.upcoming}</div>
            <div className="text-[10px] font-mono text-blue-700 font-medium mt-1">
              Scheduled ahead
            </div>
          </div>

          <div className="border-4 border-slate-900 p-4 bg-emerald-50 shadow-[4px_4px_0px_0px_#0A0A0A] rounded-xl">
            <div className="font-mono text-[9px] text-emerald-800 uppercase tracking-wider font-bold">Live Today</div>
            <div className="font-display text-3xl font-black text-emerald-950 mt-1">{stats.live}</div>
            <div className="text-[10px] font-mono text-emerald-700 font-medium mt-1">
              Ongoing today
            </div>
          </div>

          <div className="border-4 border-slate-900 p-4 bg-slate-100 shadow-[4px_4px_0px_0px_#0A0A0A] rounded-xl">
            <div className="font-mono text-[9px] text-slate-600 uppercase tracking-wider">Archived Concluded</div>
            <div className="font-display text-3xl font-black text-slate-800 mt-1">{stats.concluded}</div>
            <div className="text-[10px] font-mono text-slate-500 font-medium mt-1">
              Auto-archived historical
            </div>
          </div>
        </div>

        {/* Toolbar: Search, View Mode Tabs & City Filter */}
        <div className="bg-white border-4 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300">
              <button
                type="button"
                onClick={() => setViewMode('upcoming')}
                className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'upcoming'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                📅 Upcoming ({stats.upcoming})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('concluded')}
                className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'concluded'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                🏛️ Archived ({stats.concluded})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                All ({stats.total})
              </button>
            </div>

            {/* Search & City Filter */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search exhibitions, city, organizer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-white border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none cursor-pointer"
              >
                <option value="all">📍 All Cities</option>
                {uniqueCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exhibitions List */}
        {loading ? (
          <div className="text-center py-20 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
              Loading verified exhibitions registry...
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="font-mono text-sm text-slate-600 font-bold">No exhibitions match current filter.</p>
            <p className="text-xs text-slate-400">Try changing your search terms or view mode.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const statusInfo = computeEventStatus(ev.startDate, ev.endDate)
              return (
                <div
                  key={ev.id}
                  className="bg-white border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-md">
                        {ev.monthYearBadge}
                      </span>
                      <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full ${statusInfo.badgeColor}`}>
                        {statusInfo.badgeText}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-black text-slate-900 text-base leading-snug">
                      {ev.title}
                    </h3>

                    {/* Venue & City */}
                    <p className="text-xs text-slate-600 flex items-start gap-1.5 font-medium line-clamp-2">
                      <MapPin size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>{ev.venue}</span>
                    </p>

                    {/* Dates Display */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-bold flex items-center gap-1">
                          <Calendar size={12} className="text-blue-600" /> {ev.dateDisplay}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {ev.city}, {ev.state}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        Organizer: <span className="font-semibold text-slate-800">{ev.organizer}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {ev.focusTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(ev)}
                      className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit Dates/Venue
                    </button>

                    <a
                      href={ev.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                      title="Visit official portal"
                    >
                      <ExternalLink size={14} />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(ev.id, ev.shortTitle)}
                      className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                      title="Archive or remove exhibition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── MODAL 1: EDIT DATES & VENUE ── */}
        {editingEvent && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-[8px_8px_0px_0px_#0A0A0A] space-y-5 animate-in fade-in duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                    Schedule Governance
                  </span>
                  <h3 className="font-display font-black text-lg text-slate-900 mt-1">
                    Edit Dates &amp; Venue
                  </h3>
                  <p className="font-mono text-xs text-slate-500 truncate max-w-md">
                    {editingEvent.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Start Date</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">End Date</label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Date Display Text</label>
                  <input
                    type="text"
                    value={editDateDisplay}
                    onChange={(e) => setEditDateDisplay(e.target.value)}
                    required
                    placeholder="e.g. November 27 – 30, 2026"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Venue</label>
                    <input
                      type="text"
                      value={editVenue}
                      onChange={(e) => setEditVenue(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSaving}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold uppercase transition-all shadow-md disabled:opacity-50"
                  >
                    {editSaving ? 'Saving...' : 'Save & Publish Overrides'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL 2: ADD NEW EXHIBITION ── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border-4 border-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-[8px_8px_0px_0px_#0A0A0A] space-y-5 animate-in fade-in duration-200 my-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-md">
                    National Event Publisher
                  </span>
                  <h3 className="font-display font-black text-xl text-slate-900 mt-1">
                    Add New Industry Exhibition
                  </h3>
                  <p className="font-mono text-xs text-slate-500">
                    Publish an official trade expo or technical conference to the national calendar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Full Exhibition Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. Plastindia 2029 — 13th International Plastics Exhibition"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Short Title</label>
                    <input
                      type="text"
                      value={newShortTitle}
                      onChange={(e) => setNewShortTitle(e.target.value)}
                      placeholder="e.g. Plastindia 2029 Delhi"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Organizer Name</label>
                    <input
                      type="text"
                      value={newOrganizer}
                      onChange={(e) => setNewOrganizer(e.target.value)}
                      required
                      placeholder="e.g. Plastindia Foundation"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Start Date</label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">End Date</label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Display Dates</label>
                    <input
                      type="text"
                      value={newDateDisplay}
                      onChange={(e) => setNewDateDisplay(e.target.value)}
                      placeholder="e.g. Feb 8 – 13, 2029"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      required
                      placeholder="e.g. New Delhi"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">State</label>
                    <input
                      type="text"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="e.g. Delhi NCR"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Priority Tier</label>
                    <select
                      value={newPriorityBadge}
                      onChange={(e: any) => setNewPriorityBadge(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="P0 Flagship">P0 Flagship</option>
                      <option value="P1 Regional">P1 Regional</option>
                      <option value="P1 Research">P1 Research</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Venue Full Address</label>
                  <input
                    type="text"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    required
                    placeholder="e.g. Bharat Mandapam, Pragati Maidan, New Delhi 110001"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Core Scope &amp; Focus</label>
                  <textarea
                    rows={2}
                    value={newFocus}
                    onChange={(e) => setNewFocus(e.target.value)}
                    placeholder="Plastics raw materials, injection moulding machinery, masterbatches, EPR circularity..."
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Official Portal URL</label>
                    <input
                      type="url"
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-slate-700">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newFocusTags}
                      onChange={(e) => setNewFocusTags(e.target.value)}
                      placeholder="e.g. Raw Materials, Blow Moulding, EPR"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addSaving}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold uppercase transition-all shadow-md disabled:opacity-50"
                  >
                    {addSaving ? 'Publishing...' : 'Publish to National Calendar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
