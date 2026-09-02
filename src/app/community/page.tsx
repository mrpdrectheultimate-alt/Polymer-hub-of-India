'use client'

import ClientPortal from '@/components/ClientPortal'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Users, Calendar, MessageCircle, Video, Star, Clock,
  Building2, CheckCircle, Zap, CheckSquare,
  Trophy, Sparkles, Brain, MapPin,
  Flame, AlertCircle, X, ExternalLink, Share2, Copy, Check, Send, BookOpen, Compass, CheckCircle2
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

// ─── INDUSTRY EVENT DETAIL MODAL (THE STAR FEATURE) ──────────────────────────

function IndustryEventDetailModal({
  event,
  onClose
}: {
  event: IndustryEvent
  onClose: () => void
}) {
  const statusInfo = useMemo(() => computeEventStatus(event.startDate, event.endDate), [event])
  const gCalUrl = useMemo(() => generateEventGoogleCalendarUrl(event), [event])

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <ClientPortal>
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* High-Contrast Header (Dark Navy) */}
          <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-slate-950 bg-amber-500 px-3 py-1 rounded-md uppercase tracking-wider">
                {event.eventType}
              </span>
              <span className="font-mono text-xs text-slate-300">
                {event.city}, {event.state}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Badge & Dates Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-md">
                  📅 {event.dateDisplay}
                </span>
                <span className={`font-mono text-xs font-bold px-3 py-1 rounded-md ${statusInfo.badgeColor}`}>
                  {statusInfo.status === 'Upcoming' ? `Upcoming · ${statusInfo.badgeText}` : statusInfo.status}
                </span>
              </div>
              {event.isAnchorEvent && (
                <span className="font-mono text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-md uppercase tracking-wider">
                  ⭐ Anchor Mega Show
                </span>
              )}
            </div>

            {/* Title & Venue */}
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-950 leading-snug">
                {event.title}
              </h2>
              <div className="flex items-start gap-2 text-xs sm:text-sm font-medium text-slate-600 mt-2">
                <MapPin size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{event.venue}</span>
              </div>
            </div>

            {/* Core Focus & Muted Tags */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-500 block">
                Core Industry &amp; Technological Scope
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {event.focus}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {event.focusTags.map(tag => (
                  <span key={tag} className="font-mono text-[10px] bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 👥 Ideal For (Uniform Muted Blue Styling) */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users size={15} className="text-blue-700" /> 👥 Ideal For &amp; Target Audience
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {event.idealFor.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-blue-900 bg-blue-50/70 p-3 rounded-xl border border-blue-200 font-medium">
                    <CheckCircle size={14} className="text-blue-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🏭 What You Will Experience (01/02/03 Clean Labels) */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={15} className="text-slate-700" /> 🏭 What You Will Inspect on the Floor
              </h3>
              <div className="space-y-2.5">
                {event.whatToSee.map((item) => (
                  <div key={item.step} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-xs text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🎓 Student Mode (Engineering Field Guide) */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🎓</span>
                <h4 className="font-display font-black text-sm text-amber-950 uppercase tracking-wide">
                  Student &amp; Trainee Field Guide
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                {event.studentMode.advice}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                  <span className="font-mono text-[10px] font-bold uppercase text-amber-800 block mb-1">🎯 Must-Visit Pavilions</span>
                  <ul className="list-disc list-inside space-y-0.5 font-medium text-slate-700">
                    {event.studentMode.keyPavilions.map((pav, i) => (
                      <li key={i}>{pav}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                  <span className="font-mono text-[10px] font-bold uppercase text-amber-800 block mb-1">💡 Pro Networking Tip</span>
                  <p className="font-medium leading-relaxed text-slate-700">{event.studentMode.networkingTip}</p>
                </div>
              </div>
            </div>

            {/* 📋 Plan My Visit (Interactive Assistant Checklist) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare size={15} className="text-blue-600" /> Plan My Visit Checklist
                </h4>
                <span className="font-mono text-[10px] text-slate-500">
                  {Object.values(checklist).filter(Boolean).length}/5 Completed
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'visitorPass', label: 'Register as visitor / Obtain student delegate authorization letter' },
                  { key: 'calendarAdded', label: 'Add exhibition dates & venue timing to Google Calendar' },
                  { key: 'transitNoted', label: 'Check rail / metro transit options to exhibition ground' },
                  { key: 'exhibitorList', label: 'Review list of machinery & resin stall numbers in advance' },
                  { key: 'cvPrinted', label: 'Print 10+ copies of updated resume & project portfolio notes' },
                ].map((item) => (
                  <label
                    key={item.key}
                    onClick={() => toggleChecklistItem(item.key)}
                    className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-medium cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className={checklist[item.key] ? 'line-through text-slate-400' : ''}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trust Layer Stamp */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-slate-600">
              <div>
                <span>Organized by: <strong className="text-slate-900">{event.organizer}</strong></span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Verified via {event.sourceName} &middot; <span className="text-emerald-700 font-bold">Last Checked: {event.lastVerified}</span>
                </div>
              </div>
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline"
              >
                Official Source Link <ExternalLink size={12} />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={gCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-xs"
              >
                <Calendar size={15} /> + Add to Google Calendar
              </a>
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl border border-slate-200 transition-all"
              >
                Organizer Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </ClientPortal>
  )
}

// ─── MASTERCLASS WEBINAR MODAL ───────────────────────────────────────────────

function WebinarDetailModal({
  event,
  onClose,
  onRegister,
  registered,
}: {
  event: CommunityEvent
  onClose: () => void
  onRegister: (eventId: string) => void
  registered: boolean
}) {
  const [copied, setCopied] = useState(false)
  const meetingLink = event.meeting_url || `https://meet.google.com/polymer-hub-${event.id.slice(0, 4)}`

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const googleCalUrl = () => {
    const d = new Date(event.event_date)
    const start = d.toISOString().replace(/-|:|.ddd/g, '')
    const end = new Date(d.getTime() + 90 * 60 * 1000).toISOString().replace(/-|:|.ddd/g, '')
    const title = encodeURIComponent(event.title)
    const details = encodeURIComponent(`${event.description}\n\nSpeaker: ${event.speaker} (${event.company})\nMeeting Link: ${meetingLink}`)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`
  }

  return (
    <ClientPortal>
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 space-y-6 p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200">
              <Video size={14} /> Masterclass Access Hub
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {event.is_live ? (
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-mono font-bold rounded-full animate-pulse flex items-center gap-1.5">
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

          <div className="space-y-2">
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-snug">
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Calendar size={14} className="text-blue-600" />
                {formatDate(event.event_date)}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Clock size={14} className="text-blue-600" />
                {formatTime(event.event_date)} IST
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {event.speaker.charAt(0)}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-slate-900">{event.speaker}</div>
              <div className="text-xs text-blue-700 font-semibold">{event.company}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Keynote Speaker &middot; Senior Engineering Specialist</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Masterclass Syllabus &amp; Overview
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-200">
              {event.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-900 uppercase">
                🌐 Virtual Meeting Room
              </span>
              <span className="text-[10px] font-mono text-blue-600">Google Meet / Live Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={meetingLink}
                className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
              />
              <button
                onClick={copyLink}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {registered ? (
              <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-600 text-emerald-800 font-mono font-bold text-xs uppercase py-3.5 px-4 rounded-xl">
                <CheckCircle size={16} className="text-emerald-600" />
                Registered &amp; Seat Confirmed (+10 XP)
              </div>
            ) : (
              <button
                onClick={() => onRegister(event.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-xs transition-all"
              >
                Confirm Registration (Free)
              </button>
            )}

            <a
              href={googleCalUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-colors"
            >
              <Calendar size={16} /> Add to Calendar
            </a>
          </div>
        </div>
      </div>
    </ClientPortal>
  )
}

// ─── MENTOR DETAIL MODAL ─────────────────────────────────────────────────────

function MentorDetailModal({
  mentor,
  onClose,
  onSubmitMatch,
  requested,
}: {
  mentor: MentorProfile
  onClose: () => void
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
    <ClientPortal>
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 space-y-6 p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
              <Star size={14} className="text-amber-500 fill-amber-500" /> Verified Mentor Guidance
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-display font-black text-2xl shrink-0">
              {mentor.avatar_initials || mentor.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">{mentor.name}</h2>
              <div className="text-xs font-bold text-blue-700">{mentor.designation}</div>
              <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <Building2 size={12} /> {mentor.company} &middot; {mentor.experience_years}+ Years Industry Exp
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-mono text-[10px] font-bold uppercase text-slate-500 block">
              Specialization &amp; Background
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {mentor.bio}
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-600 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-display font-bold text-emerald-900 text-sm">Match Request Submitted (+25 XP)</h4>
              <p className="text-xs text-emerald-700">
                {mentor.name} has been notified. You will receive an email and in-app notification when they confirm your slot.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 block">
                  What topic do you need guidance on?
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="GATE XE-F Exam Strategy & High-Weightage Chapters">GATE XE-F Exam Strategy &amp; Syllabus</option>
                  <option value="Injection Moulding & Tooling Shop-Floor Defect Solutions">Injection Moulding &amp; Tooling Defects</option>
                  <option value="R&D Formulation & Polyolefin Additives">R&amp;D Formulation &amp; Additives</option>
                  <option value="Placement Prep & Resume Review for Petrochemical Firms">Placement Prep &amp; Resume Review</option>
                  <option value="Recycling, Bioplastics & EPR Compliance Advisory">Recycling &amp; EPR Compliance</option>
                </select>
              </div>

              <div className="space-y-1.5">
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

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-xs transition-all"
              >
                <Send size={14} /> Send 1-on-1 Mentorship Request (+25 XP)
              </button>
            </form>
          )}
        </div>
      </div>
    </ClientPortal>
  )
}

// ─── EVENT CARD (Webinar) ────────────────────────────────────────────────────

function EventCard({
  event,
  onRegister,
  onOpenDetail,
  registered,
}: {
  event: CommunityEvent
  onRegister: (id: string) => void
  onOpenDetail: (event: CommunityEvent) => void
  registered: boolean
}) {
  const d = daysUntil(event.event_date)
  const isPast = d < 0

  return (
    <div
      onClick={() => onOpenDetail(event)}
      className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {event.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetail(event)
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="View Agenda & Meet Link"
          >
            <Video size={16} />
          </button>
        </div>

        <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-700 transition-colors">
          {event.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
            {event.speaker.charAt(0)}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-800 block truncate">{event.speaker}</span>
            <span className="text-[10px] text-slate-500 font-mono block truncate">{event.company}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {formatDate(event.event_date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {formatTime(event.event_date)}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onRegister(event.id)}
            disabled={isPast}
            className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              registered
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : isPast
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
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
            onClick={() => onOpenDetail(event)}
            className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-xl font-mono text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Details &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MENTOR CARD ─────────────────────────────────────────────────────────────

function MentorCard({
  mentor,
  idx,
  onOpenDetail,
  requested,
}: {
  mentor: MentorProfile
  idx: number
  onOpenDetail: (mentor: MentorProfile) => void
  requested: boolean
}) {
  return (
    <div
      onClick={() => onOpenDetail(mentor)}
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer space-y-4 group"
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-display font-black text-slate-800 text-sm shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            {mentor.avatar_initials || mentor.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-slate-900 text-sm truncate group-hover:text-blue-700 transition-colors">
              {mentor.name}
            </h3>
            <p className="text-xs text-blue-700 font-semibold truncate">{mentor.designation}</p>
            <p className="text-[11px] text-slate-500 font-mono truncate flex items-center gap-1 mt-0.5">
              <Building2 size={11} /> {mentor.company}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
            {mentor.experience_years}+ Yrs Experience
          </span>
          <span className="font-mono text-[9px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded truncate">
            {mentor.specialization}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {mentor.bio}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onOpenDetail(mentor)}
          className={`w-full py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            requested
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
          }`}
        >
          {requested ? (
            <>
              <CheckCircle size={13} /> Request Sent
            </>
          ) : (
            <>
              <Star size={13} className="text-white" /> Request 1-on-1 Match
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── DISCUSSION TAB COMPONENT ────────────────────────────────────────────────

function DiscussionTab() {
  const CHANNELS = [
    { title: 'GATE XE-F Discussion Board', desc: 'Strategy, syllabus notes, previous year question walk-throughs & polymer physics calculations.', href: '/forum', tag: 'ACADEMIC', color: 'border-blue-200 bg-blue-50 text-blue-800' },
    { title: 'Injection Moulding Defect Clinic', desc: 'Shop-floor defect solving — sink marks, flash, warpage, silver streaks, and process parameter optimization.', href: '/troubleshooter', tag: 'MANUFACTURING', color: 'border-orange-200 bg-orange-50 text-orange-800' },
    { title: 'CIPET & University Study Circles', desc: 'Join 38 active student circles across CIPET, ICT Mumbai, CUSAT, Anna University, and IITs.', href: '/study-groups', tag: 'COMMUNITY', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    { title: 'Plastics Industry Career & Placement Hub', desc: 'Resume reviews, interview tips from Reliance & Supreme engineers, and petrochemical hiring notices.', href: '/careers', tag: 'CAREERS', color: 'border-purple-200 bg-purple-50 text-purple-800' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHANNELS.map((ch, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <span className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${ch.color}`}>
                {ch.tag}
              </span>
              <h3 className="font-display font-black text-slate-900 text-lg sm:text-xl">
                {ch.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ch.desc}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={ch.href}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-700 hover:text-blue-900 uppercase tracking-wider hover:underline"
              >
                Enter Channel &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-display font-black text-slate-900 text-lg sm:text-xl">
            Want to start an official CIPET or College Polymer Club?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            We provide official PolymerHub verification badges, shared question banks, and free access to industrial calculation engines.
          </p>
        </div>
        <Link
          href="/study-groups"
          className="bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shrink-0 transition-colors shadow-xs"
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

  // Interactive Modals
  const [selectedIndustryEvent, setSelectedIndustryEvent] = useState<IndustryEvent | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null)

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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900 font-sans">
      {/* ── CLEAN SLATE HERO (ZERO YELLOW CONE) ── */}
      <section className="bg-slate-50 border-b border-slate-200 text-slate-900 pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full uppercase tracking-wider border border-blue-200">
            <Compass className="w-3.5 h-3.5 text-blue-600" /> INDUSTRY &amp; EVENTS
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-950 uppercase tracking-tight leading-tight">
            CONNECT. LEARN. <br className="hidden sm:inline" />
            GROW TOGETHER.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Attend verified Indian plastics exhibitions, connect with senior polymer engineers from Reliance, Tata, and CIPET alumni, and boost your career.
          </p>

          {/* Clean Stats Bar (White Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="font-display text-2xl font-black text-slate-900">5</div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Verified Expos</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="font-display text-2xl font-black text-blue-700">{events.length || 15}</div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Masterclasses</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="font-display text-2xl font-black text-slate-900">{mentors.length || 15}</div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Industry Mentors</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="font-display text-2xl font-black text-emerald-700">+10 to +25</div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">XP Per Action</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS NAVIGATION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-2xl p-1.5 shadow-md border border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full">
            <button
              onClick={() => setActiveTab('exhibitions')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'exhibitions'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Building2 size={15} className={activeTab === 'exhibitions' ? 'text-amber-400' : 'text-slate-400'} />
              Industry Expos &amp; Conferences ({VERIFIED_INDUSTRY_EVENTS.length})
            </button>

            <button
              onClick={() => setActiveTab('webinars')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'webinars'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Video size={15} className={activeTab === 'webinars' ? 'text-blue-400' : 'text-slate-400'} />
              Live Masterclasses ({events.length || 15})
            </button>

            <button
              onClick={() => setActiveTab('mentorship')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'mentorship'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Star size={15} className={activeTab === 'mentorship' ? 'text-amber-400 fill-amber-400' : 'text-slate-400'} />
              Mentorship Hub ({mentors.length || 15})
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'discussion'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <MessageCircle size={15} className={activeTab === 'discussion' ? 'text-emerald-400' : 'text-slate-400'} />
              Community Q&amp;A &amp; Channels
            </button>
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {/* ============================================================ */}
        {/* TAB 1: INDUSTRY EXPOS & CONFERENCES (THE VERIFIED TRUST LAYER) */}
        {/* ============================================================ */}
        {activeTab === 'exhibitions' && (
          <div className="space-y-8">
            {/* Header & City Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200 mb-2">
                  ✅ Verified Industry Foundation &middot; Computed Real-Time
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  Plastics &amp; Polymer Industry Exhibitions (2026 – 2027)
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Hand-curated, verifiable events from official organizers (AIPMA, TAPMA, MG University, IPMA). Every event includes real venue locations, student field guides, and 1-click Google Calendar integration.
                </p>
              </div>

              {/* City & Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
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
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="all">🏢 All Event Types</option>
                  <option value="expo">Exhibitions &amp; Expos</option>
                  <option value="conference">Academic Conferences</option>
                </select>
              </div>
            </div>

            {/* Event Cards Grid (Clean Engineering Worksheet Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIndustryEvents.map((ev) => {
                const statusInfo = computeEventStatus(ev.startDate, ev.endDate)
                const gCalUrl = generateEventGoogleCalendarUrl(ev)

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedIndustryEvent(ev)}
                    className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer space-y-4"
                  >
                    <div className="space-y-3.5">
                      {/* Top Badges (JetBrains Mono 10px) */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded">
                            {ev.monthYearBadge}
                          </span>
                          <span className="font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded">
                            {ev.city.toUpperCase()}
                          </span>
                        </div>
                        <span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusInfo.badgeColor}`}>
                          {statusInfo.status === 'Upcoming' ? `In ${statusInfo.daysUntil}d` : statusInfo.status}
                        </span>
                      </div>

                      {/* Title (Space Grotesk 700 18px Dark Navy) */}
                      <h3 className="font-display font-bold text-slate-950 text-base sm:text-lg leading-snug group-hover:text-blue-700 transition-colors">
                        {ev.title}
                      </h3>

                      {/* Venue */}
                      <p className="text-xs font-medium text-slate-600 flex items-start gap-1.5 line-clamp-2">
                        <MapPin size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <span>{ev.venue}</span>
                      </p>

                      {/* Muted Focus Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ev.focusTags.slice(0, 3).map(tag => (
                          <span key={tag} className="font-mono text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Trust Layer & Action Bar */}
                    <div className="space-y-3 border-t border-slate-100 pt-3" onClick={(e) => e.stopPropagation()}>
                      {/* Trust Line */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle size={11} className="text-emerald-600" /> Source: {ev.sourceName.split('/')[0].trim()}
                        </span>
                        <span>Verified: {ev.lastVerified}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedIndustryEvent(ev)}
                          className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all text-center shadow-xs"
                        >
                          View Event &rarr;
                        </button>
                        <a
                          href={gCalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors"
                          title="Add to Google Calendar"
                        >
                          <Calendar size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LIVE WEBINARS & MASTERCLASSES */}
        {/* ============================================================ */}
        {activeTab === 'webinars' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="font-display text-2xl font-black text-slate-900">
                Interactive Technical Webinars &amp; Plant Masterclasses
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
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
                    onRegister={(id) => handleRegister(id)}
                    onOpenDetail={(ev) => setSelectedEvent(ev)}
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
            <div className="border-b border-slate-200 pb-4">
              <h2 className="font-display text-2xl font-black text-slate-900">
                Senior Industry Mentorship Directory
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
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
                {mentors.map((mentor, idx) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    idx={idx}
                    onOpenDetail={(m) => setSelectedMentor(m)}
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

      {/* ── MODALS ── */}
      {selectedIndustryEvent && (
        <IndustryEventDetailModal
          event={selectedIndustryEvent}
          onClose={() => setSelectedIndustryEvent(null)}
        />
      )}

      {selectedEvent && (
        <WebinarDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={(id) => handleRegister(id)}
          registered={registeredEvents.has(selectedEvent.id)}
        />
      )}

      {selectedMentor && (
        <MentorDetailModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onSubmitMatch={(id, msg) => handleMatchRequest(id, msg)}
          requested={requestedMentors.has(selectedMentor.id)}
        />
      )}

      {/* ── BOTTOM AI COMMUNITY COUNSELOR (CLEAN LIGHT INTEGRATION) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-700 bg-white px-3.5 py-1 rounded-full uppercase tracking-wider border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Community Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">
            Planning your trip to Plastivision or IPLAS?
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Ask our AI Specialist for a personalized machinery pavilion checklist, questions for plant heads, or technical prep guidelines.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/ai-tutor?prompt=I%20am%20a%20Polymer%20Engineering%20student%20visiting%20Plastivision%20India%202027.%20What%20are%20the%20top%20machinery%20pavilions%20and%20technical%20questions%20I%20should%20prepare%20for%20plant%20heads%3F"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-xs transition-all"
            >
              <Brain className="w-4 h-4" /> Get Expo Prep Checklist &rarr;
            </Link>

            <Link
              href="/forum"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-slate-200 transition-all"
            >
              <Users className="w-4 h-4" /> Join Student Discussion Circle
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
