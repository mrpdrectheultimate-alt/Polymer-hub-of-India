'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Users, Calendar, MessageCircle, Video, Star, Clock,
  Building2, ChevronRight, CheckCircle, Zap, ArrowRight,
  Mic, BookOpen, Trophy, Globe, Flame, AlertCircle
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommunityEvent {
  id: string
  title: string
  description: string
  speaker: string
  company: string
  event_date: string
  meeting_url: string
  subject_slug: string | null
  is_live: boolean
  tags: string[]
  max_seats: number
  created_at: string
}

interface MentorProfile {
  id: string
  name: string
  company: string
  designation: string
  bio: string
  experience_years: number
  specialization: string
  avatar_initials: string | null
}

type Tab = 'webinars' | 'mentorship' | 'discussion'

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-full mb-1" />
      <div className="h-4 bg-slate-200 rounded w-5/6 mb-4" />
      <div className="h-10 bg-slate-200 rounded w-1/2" />
    </div>
  )
}

// ─── Webinar Card ─────────────────────────────────────────────────────────────

function WebinarCard({ event, onRegister, registered }: {
  event: CommunityEvent
  onRegister: (id: string) => void
  registered: boolean
}) {
  const days = daysUntil(event.event_date)
  const urgency = event.is_live ? 'LIVE NOW' : days <= 3 ? `${days}d left` : null

  return (
    <div className={`border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-150 p-6 flex flex-col gap-4`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {event.is_live && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-black border-2 border-slate-900 animate-pulse">
                <Flame size={10} /> LIVE
              </span>
            )}
            {urgency && !event.is_live && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-slate-900 text-xs font-black border-2 border-slate-900">
                <Clock size={10} /> {urgency}
              </span>
            )}
            {event.subject_slug && (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold border border-indigo-300">
                {event.subject_slug.replace(/-/g, ' ').toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="font-black text-lg text-slate-900 leading-tight">{event.title}</h3>
        </div>
        <div className="shrink-0 w-12 h-12 bg-indigo-100 border-3 border-slate-900 flex items-center justify-center">
          <Video size={22} className="text-indigo-600" />
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{event.description}</p>

      {/* Speaker */}
      <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 border-2 border-slate-200">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm border-2 border-slate-900">
          {event.speaker.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-sm text-slate-900">{event.speaker}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Building2 size={11} />
            {event.company}
          </div>
        </div>
      </div>

      {/* Date / Time */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <Calendar size={14} className="text-indigo-500" />
          {formatDate(event.event_date)}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock size={14} />
          {formatTime(event.event_date)}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {event.tags.slice(0, 4).map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium border border-slate-300">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onRegister(event.id)}
        disabled={registered}
        className={`w-full py-3 font-black text-sm border-3 border-slate-900 transition-all duration-150 flex items-center justify-center gap-2 ${
          registered
            ? 'bg-green-400 text-slate-900 cursor-default shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
        }`}
      >
        {registered ? (
          <><CheckCircle size={16} /> Registered — +10 XP Earned</>
        ) : (
          <><Zap size={16} /> Register Now — +10 XP</>
        )}
      </button>
    </div>
  )
}

// ─── Mentor Card ──────────────────────────────────────────────────────────────

const MENTOR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-amber-100 text-amber-700',
  'bg-green-100 text-green-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
]

function MentorCard({ mentor, idx, onRequest, requested }: {
  mentor: MentorProfile
  idx: number
  onRequest: (id: string) => void
  requested: boolean
}) {
  const colorClass = MENTOR_COLORS[idx % MENTOR_COLORS.length]

  return (
    <div className="border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-150 p-6 flex flex-col gap-4">
      {/* Avatar + name */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-none border-3 border-slate-900 flex items-center justify-center font-black text-xl shrink-0 ${colorClass}`}>
          {mentor.avatar_initials ?? mentor.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-black text-lg text-slate-900 leading-tight">{mentor.name}</h3>
          <div className="text-sm font-bold text-indigo-600">{mentor.designation}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <Building2 size={11} />
            {mentor.company}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3">
        <div className="flex-1 py-2 px-3 bg-amber-50 border-2 border-amber-300 text-center">
          <div className="font-black text-lg text-amber-700">{mentor.experience_years}+</div>
          <div className="text-xs text-amber-600 font-medium">Years Exp.</div>
        </div>
        <div className="flex-2 py-2 px-3 bg-indigo-50 border-2 border-indigo-300 text-center flex-1">
          <div className="font-black text-sm text-indigo-700 leading-tight">{mentor.specialization}</div>
          <div className="text-xs text-indigo-500 font-medium mt-0.5">Specialization</div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{mentor.bio}</p>

      {/* CTA */}
      <button
        onClick={() => onRequest(mentor.id)}
        disabled={requested}
        className={`w-full py-3 font-black text-sm border-3 border-slate-900 transition-all duration-150 flex items-center justify-center gap-2 ${
          requested
            ? 'bg-green-400 text-slate-900 cursor-default shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            : 'bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5'
        }`}
      >
        {requested ? (
          <><CheckCircle size={16} /> Request Sent — +25 XP</>
        ) : (
          <><Star size={16} /> Request Match — +25 XP</>
        )}
      </button>
    </div>
  )
}

// ─── Discussion Tab ───────────────────────────────────────────────────────────

function DiscussionTab() {
  const channels = [
    { title: 'Student Forum', desc: 'Ask classmates anything — polymer chemistry, processing, career advice', href: '/forum', icon: MessageCircle, color: 'bg-violet-100', iconColor: 'text-violet-600', count: '2.1k posts' },
    { title: 'Study Groups', desc: 'Form groups, study together, track collective XP and subject progress', href: '/study-groups', icon: Users, color: 'bg-indigo-100', iconColor: 'text-indigo-600', count: '38 active groups' },
    { title: 'GATE Prep Squad', desc: 'Dedicated space for GATE 2026 aspirants — daily quizzes, mock test discussion', href: '/gate-mock', icon: Trophy, color: 'bg-amber-100', iconColor: 'text-amber-700', count: '440 members' },
    { title: 'Today in Plastics', desc: 'Discuss the latest polymer industry news, price alerts, and sustainability trends', href: '/today', icon: Globe, color: 'bg-green-100', iconColor: 'text-green-600', count: 'Updated daily' },
    { title: 'Reference Library', desc: 'Collaborative reading — highlight sections, share flashcards, bookmark chapters', href: '/library', icon: BookOpen, color: 'bg-rose-100', iconColor: 'text-rose-600', count: '17 books' },
    { title: 'Research Hub', desc: 'Discuss papers, share patent ideas, collaborate on research pitches', href: '/research', icon: Mic, color: 'bg-cyan-100', iconColor: 'text-cyan-600', count: '5 papers, 5 patents' },
  ]

  return (
    <div className="space-y-4">
      <div className="border-4 border-slate-900 bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
        <div className="flex items-center gap-3">
          <AlertCircle size={22} className="text-slate-900" />
          <div>
            <div className="font-black text-slate-900">Real-time Discussion Channels</div>
            <div className="text-sm text-slate-800">Join PolymerHub&apos;s integrated community spaces — all connected to your XP and learning progress.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((ch) => (
          <Link key={ch.href} href={ch.href}>
            <div className="border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-150 p-5 flex items-start gap-4 cursor-pointer">
              <div className={`w-12 h-12 ${ch.color} border-3 border-slate-900 flex items-center justify-center shrink-0`}>
                <ch.icon size={22} className={ch.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-black text-slate-900">{ch.title}</div>
                  <span className="text-xs font-bold text-slate-500 shrink-0">{ch.count}</span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{ch.desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-400 shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('webinars')
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [mentors, setMentors] = useState<MentorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const [requestedMentors, setRequestedMentors] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [evRes, menRes] = await Promise.all([
        fetch('/api/community/events'),
        fetch('/api/community/mentors'),
      ])
      const evJson = await evRes.json()
      const menJson = await menRes.json()
      if (evJson.events) setEvents(evJson.events)
      if (menJson.mentors) setMentors(menJson.mentors)
    } catch {
      // Silently continue — show whatever loaded
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRegister = async (eventId: string) => {
    try {
      const res = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? 'Registration failed', 'error')
        return
      }
      setRegisteredEvents(prev => new Set(Array.from(prev).concat(eventId)))
      showToast(json.message ?? 'Registered! +10 XP', 'success')
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
  }

  const handleMatchRequest = async (mentorId: string) => {
    try {
      const res = await fetch('/api/community/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentor_id: mentorId, message: 'I would love to connect and learn from your experience.' }),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? 'Request failed', 'error')
        return
      }
      setRequestedMentors(prev => new Set(Array.from(prev).concat(mentorId)))
      showToast(json.message ?? 'Match request sent! +25 XP', 'success')
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number | string }[] = [
    { id: 'webinars', label: 'Live Webinars', icon: Video, count: events.length || '5' },
    { id: 'mentorship', label: 'Mentorship Hub', icon: Star, count: mentors.length || '6' },
    { id: 'discussion', label: 'Discussion', icon: MessageCircle },
  ]

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Hero ── */}
        <div className="border-4 border-slate-900 bg-indigo-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white border-4 border-slate-900 flex items-center justify-center shrink-0">
              <Users size={32} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Community & Live Events
              </h1>
              <p className="text-indigo-100 mt-3 text-lg max-w-2xl leading-relaxed">
                Connect with industry experts, attend live webinars, request a mentor match,
                and join study groups — all in one place. Earn XP for every interaction.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="flex items-center gap-2 bg-white/20 text-white font-bold text-sm px-4 py-2 border-2 border-white/40">
                  <Zap size={14} /> Register → +10 XP
                </div>
                <div className="flex items-center gap-2 bg-white/20 text-white font-bold text-sm px-4 py-2 border-2 border-white/40">
                  <Star size={14} /> Mentor Match → +25 XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Upcoming Webinars', value: events.length || 5, color: 'bg-indigo-100 border-indigo-400', textColor: 'text-indigo-700' },
            { label: 'Active Mentors', value: mentors.length || 6, color: 'bg-amber-100 border-amber-400', textColor: 'text-amber-700' },
            { label: 'Study Groups', value: 38, color: 'bg-green-100 border-green-400', textColor: 'text-green-700' },
            { label: 'Forum Posts', value: '2.1k', color: 'bg-violet-100 border-violet-400', textColor: 'text-violet-700' },
          ].map(s => (
            <div key={s.label} className={`border-4 border-slate-900 ${s.color} p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center`}>
              <div className={`text-3xl font-black ${s.textColor}`}>{s.value}</div>
              <div className="text-sm font-bold text-slate-700 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-0 border-4 border-slate-900 overflow-hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 font-black text-sm transition-all duration-150 border-r-4 border-slate-900 last:border-r-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-indigo-50'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 text-xs font-black rounded-none border ${
                  activeTab === tab.id ? 'bg-white text-indigo-700 border-white' : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'webinars' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-slate-900">Upcoming Webinars & Live Sessions</h2>
              <div className="text-sm text-slate-500 font-medium">Register to earn +10 XP each</div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : events.length === 0 ? (
              <div className="border-4 border-slate-900 bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Calendar size={40} className="text-slate-300 mx-auto mb-4" />
                <div className="font-black text-xl text-slate-900 mb-2">No events yet</div>
                <div className="text-slate-500">Check back soon — live webinars are being scheduled.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {events.map(event => (
                  <WebinarCard
                    key={event.id}
                    event={event}
                    onRegister={handleRegister}
                    registered={registeredEvents.has(event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mentorship' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-slate-900">Mentorship Hub</h2>
              <div className="text-sm text-slate-500 font-medium">Request a match to earn +25 XP</div>
            </div>
            <div className="border-4 border-slate-900 bg-amber-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4 mb-5">
              <div className="flex items-start gap-3">
                <Star size={18} className="text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-slate-700">
                  <span className="font-black">How it works:</span> Click &quot;Request Match&quot; on a mentor&apos;s profile.
                  They&apos;ll receive your request and contact you within 48 hours via email.
                  One active request per mentor — you earn +25 XP immediately.
                </div>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : mentors.length === 0 ? (
              <div className="border-4 border-slate-900 bg-white p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Users size={40} className="text-slate-300 mx-auto mb-4" />
                <div className="font-black text-xl text-slate-900 mb-2">No mentors available yet</div>
                <div className="text-slate-500">Mentor profiles are being onboarded.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mentors.map((mentor, idx) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    idx={idx}
                    onRequest={handleMatchRequest}
                    requested={requestedMentors.has(mentor.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discussion' && <DiscussionTab />}

        {/* ── CTA Banner ── */}
        <div className="border-4 border-slate-900 bg-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-black text-white mb-1">Earn XP. Build Your Network.</div>
            <div className="text-slate-300 text-sm max-w-lg">
              Every webinar registration, mentorship match, and forum contribution adds to your PolymerHub XP score.
              Rise on the leaderboard while building real industry connections.
            </div>
          </div>
          <Link href="/leaderboard">
            <div className="flex items-center gap-3 bg-amber-400 text-slate-900 font-black px-6 py-3 border-3 border-amber-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 whitespace-nowrap cursor-pointer">
              <Trophy size={18} />
              View Leaderboard
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>

      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border-4 border-slate-900 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-400 text-slate-900' : 'bg-red-400 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}
    </main>
  )
}
