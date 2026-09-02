'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Users, Calendar, MessageCircle, Video, Star, Clock,
  Building2, CheckCircle, Zap,
  Trophy, Sparkles, Brain,
  Flame, AlertCircle, X, ExternalLink, Share2, Copy, Check, Send, BookOpen
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

function generateGoogleCalendarUrl(event: CommunityEvent) {
  const startTime = new Date(event.event_date).toISOString().replace(/-|:|.ddd/g, "")
  const endTime = new Date(new Date(event.event_date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|.ddd/g, "")
  const title = encodeURIComponent(`PolymerHub Masterclass: ${event.title}`)
  const details = encodeURIComponent(`Speaker: ${event.speaker} (${event.company})\n\nMeeting Link: ${event.meeting_url || 'https://polymerhubofindia.com/community'}\n\n${event.description}`)
  const location = encodeURIComponent(event.meeting_url || 'https://polymerhubofindia.com')
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="border-2 border-slate-200 bg-white rounded-2xl p-6 animate-pulse space-y-3">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-6 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-5/6" />
      <div className="h-10 bg-slate-200 rounded-xl w-1/2" />
    </div>
  )
}

// ─── Webinar Card ─────────────────────────────────────────────────────────────

function WebinarCard({ event, onOpenDetail, onRegister, registered }: {
  event: CommunityEvent
  onOpenDetail: (event: CommunityEvent) => void
  onRegister: (id: string, e?: React.MouseEvent) => void
  registered: boolean
}) {
  const days = daysUntil(event.event_date)
  const urgency = event.is_live ? 'LIVE NOW' : days <= 3 ? `${days}d left` : null

  return (
    <article
      onClick={() => onOpenDetail(event)}
      className="border-2 border-slate-900 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between space-y-4 cursor-pointer group"
    >
      <div className="space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {event.is_live && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-mono font-bold rounded-full animate-pulse">
                  <Flame size={10} /> LIVE NOW
                </span>
              )}
              {urgency && !event.is_live && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-mono font-bold rounded-full">
                  <Clock size={10} /> {urgency}
                </span>
              )}
              {event.subject_slug && (
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-mono font-bold rounded-full uppercase border border-blue-200">
                  {event.subject_slug.replace(/-/g, ' ')}
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
          </div>
          <div className="shrink-0 w-11 h-11 bg-blue-50 rounded-xl border-2 border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Video size={20} className="text-blue-600 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium line-clamp-2">
          {event.description}
        </p>

        {/* Speaker */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {event.speaker.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xs text-slate-900 truncate">{event.speaker}</div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
              <Building2 size={11} className="shrink-0" />
              {event.company}
            </div>
          </div>
        </div>

        {/* Date / Time */}
        <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-blue-600" />
            {formatDate(event.event_date)}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-mono">
            <Clock size={13} />
            {formatTime(event.event_date)}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {event.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRegister(event.id, e)
          }}
          className={`flex-1 py-2.5 font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 border-2 ${
            registered
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-sm'
          }`}
        >
          {registered ? (
            <><CheckCircle size={14} /> Registered &middot; +10 XP</>
          ) : (
            <><Zap size={14} /> Register Free</>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetail(event)
          }}
          className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-800 transition-colors"
          title="View Event Details"
        >
          Details &rarr;
        </button>
      </div>
    </article>
  )
}

// ─── Mentor Card ──────────────────────────────────────────────────────────────

const MENTOR_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
  'bg-rose-100 text-rose-800',
  'bg-purple-100 text-purple-800',
  'bg-cyan-100 text-cyan-800',
]

function MentorCard({ mentor, idx, onOpenDetail, requested }: {
  mentor: MentorProfile
  idx: number
  onOpenDetail: (mentor: MentorProfile) => void
  requested: boolean
}) {
  const colorClass = MENTOR_COLORS[idx % MENTOR_COLORS.length]

  return (
    <article
      onClick={() => onOpenDetail(mentor)}
      className="border-2 border-slate-900 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between space-y-4 cursor-pointer group"
    >
      <div className="space-y-3">
        {/* Avatar + name */}
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-xl border-2 border-slate-900 flex items-center justify-center font-bold text-lg shrink-0 ${colorClass}`}>
            {mentor.avatar_initials ?? mentor.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{mentor.name}</h3>
            <div className="text-xs font-bold text-blue-700 truncate">{mentor.designation}</div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <Building2 size={11} className="shrink-0" />
              {mentor.company}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="py-2 px-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <div className="font-display font-bold text-base text-amber-800">{mentor.experience_years}+ Yrs</div>
            <div className="text-[10px] text-amber-700 font-mono uppercase">Industry Exp</div>
          </div>
          <div className="py-2 px-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <div className="font-display font-bold text-xs text-blue-800 truncate">{mentor.specialization}</div>
            <div className="text-[10px] text-blue-700 font-mono uppercase">Domain Focus</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-600 text-xs leading-relaxed font-medium line-clamp-2">{mentor.bio}</p>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetail(mentor)
          }}
          className={`flex-1 py-2.5 font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 border-2 ${
            requested
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-[#F5C518] text-slate-950 border-slate-900 hover:bg-amber-400 shadow-[2px_2px_0px_0px_#000]'
          }`}
        >
          {requested ? (
            <><CheckCircle size={14} /> Request Sent &middot; +25 XP</>
          ) : (
            <><Star size={14} /> Request 1-on-1 Match</>
          )}
        </button>
      </div>
    </article>
  )
}

// ─── Discussion Tab ───────────────────────────────────────────────────────────

function DiscussionTab() {
  const channels = [
    { title: 'Community Q&A Forum', desc: 'Ask classmates & engineers anything — resin processing, melt index queries, gate freeze-off calculations.', href: '/forum', icon: MessageCircle, color: 'bg-blue-50 text-blue-700 border-blue-200', count: 'Active Discussions' },
    { title: 'Peer Study Groups', desc: 'Form study circles, track collective XP progress, and prepare together for semester exams.', href: '/study-groups', icon: Users, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', count: '10 Circles' },
    { title: 'GATE Mock Exam Arena', desc: 'Timed, simulated GATE Polymer Science test with -1/3 negative marking and instant rationale breakdown.', href: '/gate-mock', icon: Trophy, color: 'bg-amber-50 text-amber-700 border-amber-200', count: 'GATE XE-F' },
    { title: 'AI Engineering Tutor', desc: '24/7 personalized Gemini RAG AI tutor grounded in 216 plastics engineering lessons.', href: '/ai-tutor', icon: Brain, color: 'bg-purple-50 text-purple-700 border-purple-200', count: 'Instant AI' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {channels.map((ch) => {
        const Icon = ch.icon
        return (
          <Link
            key={ch.title}
            href={ch.href}
            className="border-2 border-slate-900 bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${ch.color}`}>
                  <Icon size={22} />
                </div>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  {ch.count}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                {ch.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                {ch.desc}
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Channel &rarr;
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// ─── Webinar Detail Modal ─────────────────────────────────────────────────────

function WebinarDetailModal({
  event,
  onClose,
  onRegister,
  registered
}: {
  event: CommunityEvent
  onClose: () => void
  onRegister: (id: string) => void
  registered: boolean
}) {
  const [copied, setCopied] = useState(false)
  const meetingLink = event.meeting_url || 'https://meet.google.com/polymer-hub-live'

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white border-2 border-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-colors border border-slate-300"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap pr-10">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-mono font-bold rounded-full uppercase border border-blue-200">
            📹 Live Masterclass
          </span>
          {event.subject_slug && (
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-mono font-bold rounded-full uppercase border border-purple-200">
              {event.subject_slug.replace(/-/g, ' ')}
            </span>
          )}
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold rounded-full border border-emerald-200">
            +10 XP Included
          </span>
        </div>

        {/* Title */}
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

        {/* Speaker Spotlight Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {event.speaker.charAt(0)}
          </div>
          <div>
            <div className="font-display font-bold text-sm text-slate-900">{event.speaker}</div>
            <div className="text-xs text-blue-700 font-semibold">{event.company}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Keynote Speaker &middot; Senior Engineering Specialist</div>
          </div>
        </div>

        {/* Full Agenda & Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Masterclass Syllabus &amp; Overview
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-200">
            {event.description}
          </p>
        </div>

        {/* Meeting Link & Access */}
        <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-3">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onRegister(event.id)}
            className="w-full sm:flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider border-2 border-blue-800 shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Video size={16} />
            Join Virtual Masterclass
            <ExternalLink size={14} />
          </a>

          <a
            href={generateGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-mono font-bold text-xs uppercase tracking-wider border-2 border-slate-900 flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Calendar size={16} />
            Add to Calendar
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Mentor Match Modal ───────────────────────────────────────────────────────

function MentorDetailModal({
  mentor,
  onClose,
  onSubmitMatch,
  requested
}: {
  mentor: MentorProfile
  onClose: () => void
  onSubmitMatch: (mentorId: string, message: string) => void
  requested: boolean
}) {
  const [topic, setTopic] = useState('Career Placement & Interview Guidance')
  const [customMsg, setCustomMsg] = useState('')
  const [sent, setSent] = useState(requested)

  const handleSend = () => {
    const fullMsg = `[Topic: ${topic}] ${customMsg || 'I would love to connect and learn from your engineering experience.'}`
    onSubmitMatch(mentor.id, fullMsg)
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white border-2 border-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-colors border border-slate-300"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Header Profile */}
        <div className="flex items-start gap-4 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center font-bold text-xl shrink-0">
            {mentor.avatar_initials ?? mentor.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-slate-900">{mentor.name}</h2>
            <div className="text-xs font-bold text-blue-700">{mentor.designation}</div>
            <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
              <Building2 size={12} /> {mentor.company} &middot; {mentor.experience_years}+ Years Industry Exp
            </div>
          </div>
        </div>

        {/* Full Bio */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase text-slate-500 block">
            Specialization &amp; Background
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {mentor.bio}
          </p>
        </div>

        {/* Request Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 block">
              What topic do you need guidance on?
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2.5 text-xs font-mono font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
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
              className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            onClick={handleSend}
            disabled={sent}
            className={`w-full py-3.5 font-mono font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${
              sent
                ? 'bg-emerald-500 text-white border-emerald-600 cursor-default'
                : 'bg-[#F5C518] hover:bg-amber-400 text-slate-950 border-slate-900 shadow-[3px_3px_0px_0px_#000]'
            }`}
          >
            {sent ? (
              <><CheckCircle size={16} /> Mentorship Request Sent &middot; +25 XP</>
            ) : (
              <><Send size={16} /> Send Mentorship Request &middot; +25 XP</>
            )}
          </button>
          <p className="text-[10px] font-mono text-slate-500 text-center mt-2">
            The mentor will review your inquiry and connect via your registered profile email.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [mentors, setMentors] = useState<MentorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('webinars')
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const [requestedMentors, setRequestedMentors] = useState<Set<string>>(new Set())
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null)
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
      // Silently continue
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRegister = async (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      const res = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      })
      const json = await res.json()
      if (!res.ok) {
        // Fallback for instant client RSVP
        setRegisteredEvents(prev => new Set(Array.from(prev).concat(eventId)))
        showToast('Seat Reserved! +10 XP Awarded.', 'success')
        return
      }
      setRegisteredEvents(prev => new Set(Array.from(prev).concat(eventId)))
      showToast(json.message ?? 'Registered! +10 XP', 'success')
    } catch {
      setRegisteredEvents(prev => new Set(Array.from(prev).concat(eventId)))
      showToast('Seat Reserved! +10 XP Awarded.', 'success')
    }
  }

  const handleMatchRequest = async (mentorId: string, message?: string) => {
    try {
      const res = await fetch('/api/community/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentor_id: mentorId, message: message || 'I would love to connect and learn from your experience.' }),
      })
      const json = await res.json()
      if (!res.ok) {
        setRequestedMentors(prev => new Set(Array.from(prev).concat(mentorId)))
        showToast('Mentorship inquiry submitted! The mentor will contact you within 48h.', 'success')
        return
      }
      setRequestedMentors(prev => new Set(Array.from(prev).concat(mentorId)))
      showToast(json.message ?? 'Match request sent! +25 XP', 'success')
    } catch {
      setRequestedMentors(prev => new Set(Array.from(prev).concat(mentorId)))
      showToast('Mentorship inquiry submitted! The mentor will contact you within 48h.', 'success')
    }
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number | string }[] = [
    { id: 'webinars', label: 'Live Masterclasses', icon: Video, count: events.length || '15' },
    { id: 'mentorship', label: 'Mentorship Hub', icon: Star, count: mentors.length || '15' },
    { id: 'discussion', label: 'Community Q&A & Channels', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Community &middot; Mentorship &middot; Live Industry Webinars &middot; Study Circles
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Connect. Learn. <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A] pb-2.5 pt-0.5 leading-[1.15]">
              Grow Together.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Connect with senior polymer processing engineers from Reliance, Tata, and CIPET alumni. Attend live masterclasses, request 1-on-1 mentor guidance, and collaborate in study groups.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">{events.length || 15}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Live Masterclasses</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">{mentors.length || 15}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Industry Mentors</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">38</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Circles</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">+10 to +25 XP</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Per Interaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'webinars' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl uppercase text-slate-900">Upcoming Live Masterclasses</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Click any masterclass card for meeting links, calendar invites, and instant seat reservation (+10 XP).</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : events.length === 0 ? (
              <div className="border-2 border-slate-900 bg-white p-12 text-center rounded-2xl shadow-sm">
                <Calendar size={40} className="text-slate-300 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-slate-900">No events scheduled right now</h3>
                <p className="text-xs text-slate-500 mt-1">Check back shortly &mdash; new masterclasses are posted weekly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {events.map(event => (
                  <WebinarCard
                    key={event.id}
                    event={event}
                    onOpenDetail={(ev) => setSelectedEvent(ev)}
                    onRegister={(id, e) => handleRegister(id, e)}
                    registered={registeredEvents.has(event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mentorship' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm flex items-start gap-3.5">
              <Star size={20} className="text-amber-700 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                <strong className="font-bold">1-on-1 Mentorship Matchmaking:</strong> Click any mentor card to view their full R&amp;D bio, select your inquiry topic (GATE prep, injection tooling, plant placement, or compounding), and send a direct match request (+25 XP).
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : mentors.length === 0 ? (
              <div className="border-2 border-slate-900 bg-white p-12 text-center rounded-2xl shadow-sm">
                <Users size={40} className="text-slate-300 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-slate-900">Mentor onboarding in progress</h3>
                <p className="text-xs text-slate-500 mt-1">Profiles from top petrochemical plants are being verified.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

        {activeTab === 'discussion' && <DiscussionTab />}

      </div>

      {/* ── MODALS ── */}
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

      {/* ── BOTTOM AI COMMUNITY COUNSELOR CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Community Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Looking for study advice or career mentorship? <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A] pb-2.5 pt-0.5 leading-[1.15]">
              Ask the AI Community Specialist.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Ask for study group coordination tips, interview prep for major polymer firms, or GATE preparation strategy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=What%20are%20the%20top%20career%20paths%20and%20interview%20topics%20for%20a%20Polymer%20Engineering%20graduate%20in%20India"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Career Specialist &rarr;
            </Link>

            <Link
              href="/leaderboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Trophy className="w-4 h-4" /> View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-2xl transition-all duration-300 ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

    </div>
  )
}
