'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Users, Calendar, MessageCircle, Video, Star, Clock,
  Building2, CheckCircle, Zap, CheckSquare,
  Trophy, Sparkles, Brain, MapPin,
  Flame, AlertCircle, X, ExternalLink, Share2, Copy, Check, Send, BookOpen, Compass, CheckCircle2, ArrowRight
} from 'lucide-react'
import {
  IndustryEvent,
  VERIFIED_INDUSTRY_EVENTS,
  computeEventStatus,
  generateEventGoogleCalendarUrl
} from '@/lib/industry_events_data'

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

type Tab = 'exhibitions' | 'webinars' | 'mentorship' | 'discussion'

// ─── City Theme Palette ───────────────────────────────────────────────────────
const CITY_THEMES: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  Vadodara: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', accent: 'from-blue-600 to-indigo-700' },
  Indore:   { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', accent: 'from-amber-600 to-orange-600' },
  Kottayam: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', accent: 'from-purple-600 to-indigo-700' },
  Mumbai:   { bg: 'bg-yellow-50', text: 'text-yellow-950', border: 'border-yellow-300', accent: 'from-amber-500 to-yellow-600' },
  Chennai:  { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', accent: 'from-emerald-600 to-teal-700' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── INDUSTRY EXHIBITION CARD (IN-PLACE EXPANSION) ───────────────────────────

function IndustryEventCard({
  event,
  isExpanded,
  onToggle
}: {
  event: IndustryEvent
  isExpanded: boolean
  onToggle: () => void
}) {
  const statusInfo = useMemo(() => computeEventStatus(event.startDate, event.endDate), [event])
  const gCalUrl = useMemo(() => generateEventGoogleCalendarUrl(event), [event])
  const cityTheme = CITY_THEMES[event.city] || CITY_THEMES.Vadodara

  // Interactive Visit Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    visitorPass: false,
    calendarAdded: false,
    transitNoted: false,
    exhibitorList: false,
    cvPrinted: false
  })

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div
      className={`group bg-white border-2 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden ${
        isExpanded
          ? 'border-blue-600 shadow-2xl ring-2 ring-blue-500/20 col-span-1 md:col-span-2 lg:col-span-3'
          : 'border-slate-200 hover:border-blue-600 hover:shadow-xl'
      }`}
    >
      {/* Top Accent Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${cityTheme.accent}`} />

      <div className="space-y-3.5 pt-1">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg uppercase shadow-xs">
              {event.monthYearBadge}
            </span>
            <span className={`font-mono text-[10px] font-black px-2.5 py-1 rounded-lg uppercase border shadow-xs ${cityTheme.bg} ${cityTheme.text} ${cityTheme.border}`}>
              {event.city}
            </span>
          </div>
          <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${statusInfo.badgeColor}`}>
            {statusInfo.status === 'Upcoming' ? `In ${statusInfo.daysUntil}d` : statusInfo.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-slate-900 text-base sm:text-lg leading-snug group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Venue */}
        <p className="text-xs font-medium text-slate-600 flex items-start gap-1.5 line-clamp-2">
          <MapPin size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <span>{event.venue}</span>
        </p>

        {/* Muted Focus Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.focusTags.slice(0, 3).map(tag => (
            <span key={tag} className="font-mono text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg font-semibold shadow-2xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── IN-PLACE EXPANDED BLUEPRINT & FIELD GUIDE ── */}
      {isExpanded && (
        <div className="pt-4 border-t-2 border-blue-200 space-y-6 animate-in fade-in duration-200 bg-slate-50/70 p-5 rounded-2xl border">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-lg uppercase tracking-wider">
                {event.eventType}
              </span>
              <span className="font-mono text-xs font-bold text-slate-600">
                📅 {event.dateDisplay}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Collapse ✕
            </button>
          </div>

          {/* Core Scope */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase text-blue-700 tracking-wider block">
              Core Industry &amp; Technological Scope
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {event.focus}
            </p>
          </div>

          {/* Target Audience & Floor Walkthrough */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-blue-700" /> 👥 Ideal For
              </h4>
              <div className="space-y-1.5">
                {event.idealFor.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-blue-950 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200 font-medium">
                    <CheckCircle size={13} className="text-blue-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-700" /> 🏭 What You Will Inspect
              </h4>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                {event.whatToSee.map((item) => (
                  <div key={item.step} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                    <span className="font-mono text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded mr-1.5">
                      {item.step}
                    </span>
                    <strong className="text-slate-900">{item.title}:</strong> <span className="text-slate-600">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Field Guide */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🎓</span>
              <h4 className="font-display font-black text-xs text-amber-950 uppercase">Student &amp; Trainee Field Guide</h4>
            </div>
            <p className="text-xs text-amber-900 font-medium leading-relaxed">{event.studentMode.advice}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 text-slate-700">
                <strong className="text-[10px] font-mono uppercase text-amber-800 block">🎯 Must-Visit Pavilions:</strong>
                {event.studentMode.keyPavilions.join(', ')}
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 text-slate-700">
                <strong className="text-[10px] font-mono uppercase text-amber-800 block">💡 Networking Tip:</strong>
                {event.studentMode.networkingTip}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase text-slate-600 block">
              ✅ Pre-Event Student Preparation Checklist
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'visitorPass', label: '1. Register for Free Student / Visitor Pass' },
                { id: 'calendarAdded', label: '2. Add Dates to Google Calendar' },
                { id: 'transitNoted', label: '3. Note Nearest Metro / Station Transit' },
                { id: 'exhibitorList', label: '4. Shortlist Top 5 Machine Booths' },
                { id: 'cvPrinted', label: '5. Carry 5 Hard Copies of Polymer Resume' },
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer text-slate-800 font-medium">
                  <input
                    type="checkbox"
                    checked={checklist[item.id] || false}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all"
            >
              Official Organizer Portal <ExternalLink size={14} />
            </a>
            <button
              type="button"
              onClick={onToggle}
              className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-700 uppercase cursor-pointer"
            >
              Collapse ✕
            </button>
          </div>
        </div>
      )}

      {/* Trust Layer & Action Bar when Collapsed */}
      <div className="space-y-3 border-t border-slate-100 pt-3.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle size={12} className="text-emerald-600" /> Source: {event.sourceName.split('/')[0].trim()}
          </span>
          <span>Verified: {event.lastVerified}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-center shadow-md shadow-blue-600/20 cursor-pointer"
          >
            {isExpanded ? 'Collapse ✕' : 'View Field Guide ↓'}
          </button>
          <a
            href={gCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors shadow-2xs"
            title="Add to Google Calendar"
          >
            <Calendar size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── MASTERCLASS WEBINAR CARD (IN-PLACE EXPANSION) ───────────────────────────

function EventCard({
  event,
  isExpanded,
  onToggle,
  onRegister,
  registered,
}: {
  event: CommunityEvent
  isExpanded: boolean
  onToggle: () => void
  onRegister: (id: string) => void
  registered: boolean
}) {
  const d = daysUntil(event.event_date)
  const isPast = d < 0
  const [copied, setCopied] = useState(false)
  const meetingLink = event.meeting_url || `https://meet.google.com/polymer-hub-${event.id.slice(0, 4)}`

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const googleCalUrl = () => {
    const dt = new Date(event.event_date)
    const start = dt.toISOString().replace(/-|:|\.\d\d\d/g, '')
    const end = new Date(dt.getTime() + 90 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '')
    const title = encodeURIComponent(event.title)
    const details = encodeURIComponent(`${event.description}\n\nSpeaker: ${event.speaker} (${event.company})\nMeeting Link: ${meetingLink}`)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`
  }

  return (
    <div
      className={`bg-white border-2 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 group ${
        isExpanded ? 'border-blue-600 shadow-2xl ring-2 ring-blue-500/20 col-span-1 md:col-span-2 lg:col-span-3' : 'border-slate-200 hover:border-blue-500 hover:shadow-xl'
      }`}
    >
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {event.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-lg shadow-xs"
              >
                {t}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={`p-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isExpanded
                ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isExpanded ? 'Collapse ✕' : 'Details & Schedule ↓'}
          </button>
        </div>

        <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg leading-snug">
          {event.title}
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed font-light">
          {event.description}
        </p>
      </div>

      {/* ── IN-PLACE EXPANDED WEBINAR DRAWER ── */}
      {isExpanded && (
        <div className="pt-4 border-t-2 border-blue-200 space-y-4 animate-in fade-in duration-200 bg-blue-50/40 p-5 rounded-2xl border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {event.is_live ? (
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-mono font-bold rounded-full animate-pulse flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" /> LIVE NOW
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-mono font-bold rounded-full border border-blue-200">
                  In {daysUntil(event.event_date)} Days
                </span>
              )}
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold rounded-full border border-emerald-200">
                +10 XP Included
              </span>
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="text-xs font-mono font-bold text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              Collapse ✕
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              {event.speaker.charAt(0)}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-slate-900">{event.speaker}</div>
              <div className="text-xs text-blue-700 font-semibold">{event.company}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Keynote Speaker &middot; Senior Engineering Specialist</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-900 uppercase">
                🌐 Virtual Meeting Room Link
              </span>
              <span className="text-[10px] font-mono text-blue-600">Google Meet</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={meetingLink}
                className="flex-1 bg-slate-50 border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
              />
              <button
                type="button"
                onClick={copyLink}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {registered ? (
              <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-600 text-emerald-800 font-mono font-bold text-xs uppercase py-3 px-4 rounded-xl">
                <CheckCircle size={16} className="text-emerald-600" />
                Registered &amp; Seat Confirmed (+10 XP)
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onRegister(event.id)}
                disabled={isPast}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                Confirm Registration (Free)
              </button>
            )}

            <a
              href={googleCalUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-colors"
            >
              <Calendar size={16} /> Add to Calendar
            </a>
          </div>
        </div>
      )}

      {/* Bottom Summary Bar when Collapsed */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {event.speaker.charAt(0)}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 block truncate">{event.speaker}</span>
            <span className="text-[10px] text-slate-500 font-mono block truncate">{event.company}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-blue-600" /> {formatDate(event.event_date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-blue-600" /> {formatTime(event.event_date)}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onRegister(event.id)}
            disabled={isPast}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              registered
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : isPast
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
            }`}
          >
            {registered ? (
              <>
                <CheckCircle size={13} /> Registered
              </>
            ) : isPast ? (
              'Completed'
            ) : (
              'Register Free'
            )}
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="px-3.5 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl font-mono text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isExpanded ? 'Collapse ✕' : 'Details ↓'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MENTOR CARD (IN-PLACE EXPANSION) ─────────────────────────────────────────

function MentorCard({
  mentor,
  isExpanded,
  onToggle,
  onSubmitMatch,
  requested,
}: {
  mentor: MentorProfile
  isExpanded: boolean
  onToggle: () => void
  onSubmitMatch: (mentorId: string, customMsg: string) => void
  requested: boolean
}) {
  const [topic, setTopic] = useState('GATE XE-F Exam Strategy & High-Weightage Chapters')
  const [customMsg, setCustomMsg] = useState('')
  const [submitted, setSubmitted] = useState(requested)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullMsg = `[Topic: ${topic}] ${customMsg}`
    onSubmitMatch(mentor.id, fullMsg)
    setSubmitted(true)
  }

  return (
    <div
      className={`bg-white border-2 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 group ${
        isExpanded
          ? 'border-amber-500 shadow-2xl ring-2 ring-amber-400/20 col-span-1 md:col-span-2 lg:col-span-3'
          : 'border-slate-200 hover:border-amber-500 hover:shadow-xl'
      }`}
    >
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3.5">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center font-display font-black text-slate-100 text-lg shrink-0 shadow-md group-hover:scale-105 transition-transform">
              {mentor.avatar_initials || mentor.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors">
                {mentor.name}
              </h3>
              <p className="text-xs text-blue-700 font-semibold truncate">{mentor.designation}</p>
              <p className="text-[11px] text-slate-500 font-mono truncate flex items-center gap-1 mt-0.5">
                <Building2 size={11} /> {mentor.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggle}
              className={`p-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isExpanded ? 'Collapse ✕' : 'Expand Guidance ↓'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg shadow-xs">
            {mentor.experience_years}+ Yrs Experience
          </span>
          <span className="font-mono text-[9px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-lg truncate shadow-xs">
            {mentor.specialization}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-light">
          {mentor.bio}
        </p>
      </div>

      {/* ── IN-PLACE EXPANDED 1-ON-1 GUIDANCE DRAWER ── */}
      {isExpanded && (
        <div className="pt-4 border-t-2 border-amber-200 space-y-4 animate-in fade-in duration-200 bg-amber-50/40 p-5 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-900 uppercase">
              <Star size={14} className="text-amber-500 fill-amber-500" /> Verified Mentor Guidance Form
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="text-xs font-mono font-bold text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              Collapse ✕
            </button>
          </div>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-600 text-center space-y-1.5">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
              <h4 className="font-display font-bold text-emerald-900 text-xs sm:text-sm">Match Request Submitted (+25 XP)</h4>
              <p className="text-xs text-emerald-700">
                {mentor.name} has been notified. You will receive an email and in-app notification when they confirm your slot.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-700 block">
                  What topic do you need guidance on?
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="GATE XE-F Exam Strategy & High-Weightage Chapters">GATE XE-F Exam Strategy &amp; Syllabus</option>
                  <option value="Injection Moulding & Tooling Shop-Floor Defect Solutions">Injection Moulding &amp; Tooling Defects</option>
                  <option value="R&D Formulation & Polyolefin Additives">R&amp;D Formulation &amp; Additives</option>
                  <option value="Placement Prep & Resume Review for Petrochemical Firms">Placement Prep &amp; Resume Review</option>
                  <option value="Recycling, Bioplastics & EPR Compliance Advisory">Recycling &amp; EPR Compliance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-700 block">
                  Personal Message / Specific Question (Optional):
                </label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Hi, I am preparing for polymer plant placements / semester exams and would love your guidance on..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onToggle}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Send size={14} /> Send Request (+25 XP)
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Action footer when collapsed */}
      {!isExpanded && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onToggle}
            className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
              requested
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {requested ? (
              <>
                <CheckCircle size={13} /> Request Sent ✓
              </>
            ) : (
              <>
                <Star size={13} className="text-amber-400 fill-amber-400" /> Request 1-on-1 Advice &darr;
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── DISCUSSION TAB COMPONENT ────────────────────────────────────────────────

function DiscussionTab() {
  const CHANNELS = [
    { title: 'GATE XE-F Discussion Board', desc: 'Strategy, syllabus notes, previous year question walk-throughs & polymer physics calculations.', href: '/forum', tag: 'ACADEMIC', color: 'border-blue-200 bg-blue-50 text-blue-800' },
    { title: 'Industrial Mould & Die Troubleshooting', desc: 'Real shop-floor defect diagnosis: short shots, sink marks, flash, jetting, and barrel thermal profiling.', href: '/troubleshooter', tag: 'SHOP-FLOOR', color: 'border-amber-200 bg-amber-50 text-amber-900' },
    { title: 'Campus Placement & Core Salary Insights', desc: 'Interview experiences for Reliance, IOCL, Supreme, Haldia, SRF & Polymer R&D Trainee roles.', href: '/careers', tag: 'CAREERS', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    { title: 'Biopolymers, Circular Economy & EPR Laws', desc: 'Recycling standards, PLA/PHA biodegradation kinetics, and PWM Rules 2026 compliance discussions.', href: '/forum', tag: 'CIRCULARITY', color: 'border-purple-200 bg-purple-50 text-purple-800' },
  ]

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-200 pb-4">
        <h2 className="font-display text-2xl font-black text-slate-900">
          Dedicated Technical Discussion Hubs
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 font-light">
          Connect with 12,000+ plastic and polymer engineering peers across India. Choose a specialized domain board below:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHANNELS.map((ch) => (
          <Link
            key={ch.title}
            href={ch.href}
            className="group bg-white border-2 border-slate-200 hover:border-slate-900 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${ch.color}`}>
                {ch.tag}
              </span>
              <h3 className="font-display font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                {ch.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                {ch.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-900 group-hover:text-blue-600">
              <span>Enter Channel</span>
              <span>&rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-blue-50 border-2 border-blue-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Users size={24} />
        </div>
        <h3 className="font-display font-bold text-lg text-blue-950">
          Want to start a University Chapter or Study Circle?
        </h3>
        <p className="text-xs text-blue-800 max-w-xl mx-auto leading-relaxed">
          Create student chapters for your institute (CIPET, ICT Mumbai, MIT Pune, LIT Nagpur, LD College) and invite classmates for group study sessions.
        </p>
        <Link
          href="/study-groups"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all"
        >
          Create Study Circle &rarr;
        </Link>
      </div>
    </div>
  )
}

// ─── MAIN COMMUNITY PAGE ─────────────────────────────────────────────────────

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('exhibitions')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [mentors, setMentors] = useState<MentorProfile[]>([])
  const [loading, setLoading] = useState(true)

  // In-Place Expanded Cards
  const [expandedIndustryEventId, setExpandedIndustryEventId] = useState<string | null>(null)
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null)

  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const [requestedMentors, setRequestedMentors] = useState<Set<string>>(new Set())

  // Load backend data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [evRes, mRes] = await Promise.all([
          fetch('/api/community/events'),
          fetch('/api/community/mentors'),
        ])

        if (evRes.ok) {
          const evData = await evRes.json()
          setEvents(evData.events || [])
        }

        if (mRes.ok) {
          const mData = await mRes.json()
          setMentors(mData.mentors || [])
        }
      } catch (err) {
        console.error('Failed to load community data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filtered Industry Events
  const filteredIndustryEvents = useMemo(() => {
    return VERIFIED_INDUSTRY_EVENTS.filter((ev) => {
      const matchCity = selectedCity === 'all' || ev.city.toLowerCase() === selectedCity.toLowerCase()
      const matchType = selectedType === 'all' || (selectedType === 'conference' ? ev.eventType === 'Academic Conference' : ev.eventType === 'Exhibition & Expo')
      return matchCity && matchType
    })
  }, [selectedCity, selectedType])

  // Handle Event Register
  const handleRegister = useCallback(async (eventId: string) => {
    try {
      setRegisteredEvents((prev) => new Set(prev).add(eventId))
      const res = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      })
      if (!res.ok) throw new Error('Registration failed')
    } catch {
      // Fallback state is preserved
    }
  }, [])

  // Handle Mentorship Match Request
  const handleMatchRequest = useCallback(async (mentorId: string, customMsg: string) => {
    try {
      setRequestedMentors((prev) => new Set(prev).add(mentorId))
      const res = await fetch('/api/community/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentor_id: mentorId, message: customMsg }),
      })
      if (!res.ok) throw new Error('Match request failed')
    } catch {
      // Fallback state is preserved
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-slate-900 font-sans">
      
      {/* ── MIDNIGHT NAVY SIGNATURE HERO ── */}
      <section className="bg-[#0A1628] text-white pt-16 pb-24 px-4 sm:px-6 relative overflow-hidden border-b-2 border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-300 bg-blue-900/40 border border-blue-400/30 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            <Compass className="w-3.5 h-3.5 text-blue-400" /> NATIONAL PLASTICS ENGINEERING NETWORK
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            CONNECT. LEARN. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400">
              GROW TOGETHER.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            India&apos;s dedicated student network — connect with plant veterans, explore national trade expos (Plastivision, IPLAS, Plastindia), and join live expert masterclasses.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="font-display font-black text-amber-400 text-xl block">12,000+</span>
              <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">Active Peers</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="font-display font-black text-emerald-400 text-xl block">28+</span>
              <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">Industry Mentors</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="font-display font-black text-blue-400 text-xl block">14+</span>
              <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">Trade Expos Tracked</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="font-display font-black text-purple-400 text-xl block">+10 to +50</span>
              <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">XP per Interaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20 space-y-8">
        
        {/* Navigation Tabs (JetBrains Mono) */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-2 shadow-xl flex flex-wrap gap-2 justify-center sm:justify-start">
          <button
            onClick={() => setActiveTab('exhibitions')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'exhibitions'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 size={15} /> Industry Exhibitions (2026-27)
          </button>

          <button
            onClick={() => setActiveTab('webinars')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'webinars'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Video size={15} /> Live Masterclasses
          </button>

          <button
            onClick={() => setActiveTab('mentorship')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mentorship'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Star size={15} className="text-amber-400 fill-amber-400" /> Find a Mentor (1-on-1)
          </button>

          <button
            onClick={() => setActiveTab('discussion')}
            className={`px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'discussion'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageCircle size={15} /> Topic Channels
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: INDUSTRY EXHIBITIONS & TRADE EXPOS */}
        {/* ============================================================ */}
        {activeTab === 'exhibitions' && (
          <div className="space-y-8">
            {/* Header & City Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-300 mb-2 shadow-xs">
                  <CheckCircle size={13} className="text-emerald-600" /> Verified Industry Foundation &middot; Real-Time Computed
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  Plastics &amp; Polymer Industry Exhibitions (2026 – 2027)
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-light">
                  Hand-curated, verifiable events from official organizers (AIPMA, TAPMA, MG University, IPMA). Every event includes verified venue locations, student field guides, and 1-click Google Calendar integration.
                </p>
              </div>

              {/* City & Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
                >
                  <option value="all">📍 All Cities</option>
                  <option value="vadodara">Vadodara</option>
                  <option value="indore">Indore</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="chennai">Chennai</option>
                  <option value="kottayam">Kottayam (Kerala)</option>
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
                >
                  <option value="all">🏢 All Event Types</option>
                  <option value="expo">Exhibitions &amp; Expos</option>
                  <option value="conference">Academic Conferences</option>
                </select>
              </div>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIndustryEvents.map((ev) => (
                <IndustryEventCard
                  key={ev.id}
                  event={ev}
                  isExpanded={expandedIndustryEventId === ev.id}
                  onToggle={() => setExpandedIndustryEventId(expandedIndustryEventId === ev.id ? null : ev.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LIVE WEBINARS & MASTERCLASSES */}
        {/* ============================================================ */}
        {activeTab === 'webinars' && (
          <div className="space-y-6">
            <div className="border-b-2 border-slate-200 pb-4">
              <h2 className="font-display text-2xl font-black text-slate-900">
                Interactive Technical Webinars &amp; Plant Masterclasses
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 font-light">
                Live technical sessions conducted by senior industry practitioners. Register to receive Google Meet access links and earn +10 XP.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-500">Loading masterclasses...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isExpanded={expandedEventId === event.id}
                    onToggle={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                    onRegister={(id) => handleRegister(id)}
                    registered={registeredEvents.has(event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: 1-ON-1 MENTORSHIP HUB */}
        {/* ============================================================ */}
        {activeTab === 'mentorship' && (
          <div className="space-y-6">
            <div className="border-b-2 border-slate-200 pb-4">
              <h2 className="font-display text-2xl font-black text-slate-900">
                Senior Industry Mentorship Directory
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 font-light">
                Direct 1-on-1 guidance from polymer engineering veterans across Reliance, Tata Motors, Supreme, and CIPET faculty. Select a mentor to submit your inquiry (+25 XP).
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-500">Loading verified mentors...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    isExpanded={expandedMentorId === mentor.id}
                    onToggle={() => setExpandedMentorId(expandedMentorId === mentor.id ? null : mentor.id)}
                    onSubmitMatch={(id, msg) => handleMatchRequest(id, msg)}
                    requested={requestedMentors.has(mentor.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: DISCUSSION & CHANNELS */}
        {/* ============================================================ */}
        {activeTab === 'discussion' && <DiscussionTab />}
      </div>

      {/* ── SIGNATURE MIDNIGHT AI COUNSELOR SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-gradient-to-br from-[#0A1628] via-[#0F223D] to-[#0A1628] text-white border-2 border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-4 py-1.5 rounded-full uppercase tracking-widest relative z-10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Community Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white relative z-10">
            PLANNING YOUR TRIP TO PLASTIVISION OR IPLAS?
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-light relative z-10">
            Let our AI generate a customized 1-day student itinerary with must-visit machinery halls, raw material supplier booths, and networking talk points.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              href="/ai-tutor?prompt=Create%20a%201-day%20student%20itinerary%20and%20booth%20inspection%20checklist%20for%20Plastivision%20India%202027"
              className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> AI Itinerary Generator &rarr;
            </Link>
            <Link
              href="/forum"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-white/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Find Travel Peers on Forum
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
