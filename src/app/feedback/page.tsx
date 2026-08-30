'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, AlertTriangle, Lightbulb, Heart, CheckCircle2, Send, Sparkles } from 'lucide-react'

type FeedbackType = 'bug' | 'feature' | 'content' | 'general' | 'praise'

export default function FeedbackPage() {
  const supabase = createClient()

  // Form states
  const [type, setType] = useState<FeedbackType>('general')
  const [rating, setRating] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pageUrl, setPageUrl] = useState('')

  // App states
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUserId(session.user.id)
          setEmail(session.user.email ?? '')
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single()
          
          if (profile?.full_name) {
            setName(profile.full_name)
          }
        }
        setPageUrl(document.referrer || window.location.origin)
      } catch (err) {
        console.warn('Failed to pre-fill user metadata:', err)
      }
    }
    loadUser()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setErrorMsg('Please enter a feedback message')
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: userId,
        type,
        rating,
        message,
        page_url: pageUrl || window.location.href,
        user_email: email || null,
        user_name: name || null,
        status: 'new'
      })

      if (error) throw error

      setSuccess(true)
      setMessage('')
      setRating(null)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      setErrorMsg('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const TYPE_OPTIONS = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare, color: '#2563EB', bg: '#EFF6FF' },
    { value: 'bug', label: 'Report a Bug', icon: AlertTriangle, color: '#EA580C', bg: '#FFF7ED' },
    { value: 'feature', label: 'Request Feature', icon: Lightbulb, color: '#D97706', bg: '#FEFCE8' },
    { value: 'content', label: 'Curriculum Note', icon: Sparkles, color: '#2563EB', bg: '#EFF6FF' },
    { value: 'praise', label: 'Send Praise', icon: Heart, color: '#059669', bg: '#ECFDF5' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#38BDF8] tracking-wider block">
                Platform Continuous Improvement
              </span>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                Send Engineering Feedback
              </h1>
            </div>
          </div>
          <Link
            href="/forum"
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors"
          >
            Community Forum →
          </Link>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          {success ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in-50">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Thank You!</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Your feedback has been logged successfully. The PolymerHub engineering team reviews all student and researcher submissions.
              </p>
              <div className="pt-4 flex gap-3 justify-center">
                <button
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Submit More Feedback
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-mono font-bold hover:bg-blue-700 transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 mb-1">Share Your Insights</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Encountered a defect calculation issue? Have an idea for a virtual testing simulator? Let us know below.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-mono font-bold text-red-700">
                  ⚠️ Error: {errorMsg}
                </div>
              )}

              {/* Feedback Category */}
              <div className="space-y-2">
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Feedback Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TYPE_OPTIONS.map(opt => {
                    const Icon = opt.icon
                    const isSelected = type === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value as FeedbackType)}
                        className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                          isSelected
                            ? 'border-[#2563EB] bg-blue-50/60 ring-2 ring-blue-500/20'
                            : 'border-slate-200/90 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-[#2563EB]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {opt.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Rating 1-5 */}
              <div className="space-y-2">
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Rate Your Experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`w-11 h-11 rounded-xl border font-mono text-sm font-bold transition-all ${
                        rating === num
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Detailed Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the issue, standard formula suggestion, or feature request..."
                  className="w-full border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 resize-none font-sans"
                />
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@institute.edu"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Feedback…' : 'Submit Feedback'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
