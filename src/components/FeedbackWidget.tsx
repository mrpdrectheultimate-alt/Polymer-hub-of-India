'use client'

// src/components/FeedbackWidget.tsx
// Add to src/app/layout.tsx — appears on every page
// Floating button bottom-right, opens a panel

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquarePlus, X, Send, Star, Bug, Lightbulb, BookOpen, Heart, CheckCircle } from 'lucide-react'

type FeedbackType = 'bug' | 'feature' | 'content' | 'general' | 'praise'

const TYPES: { id: FeedbackType; label: string; icon: React.ElementType; color: string; bg: string; placeholder: string }[] = [
  {
    id: 'bug', label: 'Bug / Problem', icon: Bug, color: '#EA580C', bg: '#FFF7ED',
    placeholder: 'What went wrong? Which page were you on? What did you expect to happen?'
  },
  {
    id: 'feature', label: 'Feature Request', icon: Lightbulb, color: '#CA8A04', bg: '#FEFCE8',
    placeholder: 'What would you like us to build? Describe the problem it would solve for you.'
  },
  {
    id: 'content', label: 'Content Issue', icon: BookOpen, color: '#1D4ED8', bg: '#EFF6FF',
    placeholder: 'Which lesson or subject? What is wrong or missing in the content?'
  },
  {
    id: 'praise', label: 'Something I Love', icon: Heart, color: '#15803D', bg: '#F0FDF4',
    placeholder: 'What\'s working well? What do you love about PolymerHub?'
  },
  {
    id: 'general', label: 'General Feedback', icon: MessageSquarePlus, color: '#2563EB', bg: '#EFF6FF',
    placeholder: 'Anything on your mind — suggestions, opinions, ideas...'
  },
]

const RATING_LABELS = ['', 'Very Poor', 'Poor', 'Okay', 'Good', 'Excellent']

export default function FeedbackWidget() {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('general')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState<{ id: string; email: string; name: string } | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single()
        setUserInfo({ id: session.user.id, email: session.user.email ?? '', name: profile?.full_name ?? '' })
        setEmail(session.user.email ?? '')
      }
    }
    init()
  }, [supabase])

  const selectedType = TYPES.find(t => t.id === type)!

  const handleSubmit = async () => {
    if (!message.trim()) { setError('Please write your feedback before sending.'); return }
    if (message.trim().length < 10) { setError('Please give us a bit more detail — at least 10 characters.'); return }

    setSubmitting(true)
    setError('')

    const { error: err } = await supabase.from('feedback').insert({
      user_id: userInfo?.id ?? null,
      type,
      rating: rating || null,
      message: message.trim(),
      page_url: typeof window !== 'undefined' ? window.location.pathname : '',
      user_email: userInfo?.email || email || null,
      user_name: userInfo?.name || null,
    })

    if (err) {
      setError('Failed to send. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)

    // Reset after 4 seconds
    setTimeout(() => {
      setSubmitted(false)
      setOpen(false)
      setMessage('')
      setRating(0)
      setType('general')
      setError('')
    }, 4000)
  }

  const handleOpen = () => {
    setOpen(true)
    setSubmitted(false)
    setError('')
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-40 border-4 border-ink flex items-center gap-2 px-4 py-3 font-mono text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#2563EB', color: 'white', boxShadow: '4px 4px 0px 0px #0A0A0A' }}
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span className="hidden sm:block">Feedback</span>
        </button>
      )}

      {/* Feedback panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-96 max-h-[90vh] overflow-y-auto border-4 border-ink bg-canvas"
          style={{ boxShadow: '6px 6px 0px 0px #2563EB' }}>

          {/* Header */}
          <div className="border-b-4 border-ink px-5 py-4 flex items-center justify-between bg-[#2563EB]">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-white" />
              <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Share Feedback</span>
            </div>
            <button onClick={() => setOpen(false)}
              className="border-2 border-white/30 text-white w-7 h-7 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            /* Success state */
            <div className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-ink bg-green flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-black text-ink mb-2">Thank you! 🙏</h3>
              <p className="text-sm text-ink/70 leading-relaxed">
                Your feedback goes directly to the founder. We read every single one and use it to improve PolymerHub for students like you.
              </p>
            </div>
          ) : (
            <div className="p-5 space-y-4">

              {/* Type selector */}
              <div>
                <label className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest block mb-2">What kind of feedback?</label>
                <div className="space-y-1.5">
                  {TYPES.map(t => {
                    const Icon = t.icon
                    const isSelected = type === t.id
                    return (
                      <button key={t.id} onClick={() => setType(t.id)}
                        className="w-full text-left border-4 border-ink px-3 py-2.5 flex items-center gap-3 transition-all"
                        style={{
                          backgroundColor: isSelected ? t.color : 'white',
                          color: isSelected ? 'white' : '#0A0A0A',
                          boxShadow: isSelected ? `2px 2px 0px 0px ${t.color}` : '2px 2px 0px 0px #0A0A0A',
                        }}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Star rating */}
              <div>
                <label className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest block mb-2">
                  Overall rating (optional)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="w-9 h-9 border-4 border-ink flex items-center justify-center transition-all"
                      style={{ backgroundColor: star <= (hoverRating || rating) ? '#CA8A04' : 'white' }}>
                      <Star className="w-4 h-4" style={{ color: star <= (hoverRating || rating) ? 'white' : '#D1D5DB', fill: star <= (hoverRating || rating) ? 'white' : 'none' }} />
                    </button>
                  ))}
                  {(hoverRating || rating) > 0 && (
                    <span className="font-mono text-[10px] font-bold text-ink/60 uppercase">{RATING_LABELS[hoverRating || rating]}</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest block mb-2">
                  Your feedback <span className="text-orange">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet resize-none shadow-hard-sm"
                  placeholder={selectedType.placeholder}
                  style={{ backgroundColor: selectedType.bg }}
                />
                <div className="flex items-center justify-between mt-1">
                  {error && <p className="font-mono text-[9px] text-orange">{error}</p>}
                  <span className="font-mono text-[8px] text-ink/30 ml-auto">{message.length} chars</span>
                </div>
              </div>

              {/* Email (only if not logged in) */}
              {!userInfo && (
                <div>
                  <label className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest block mb-2">
                    Your email (optional — so we can reply)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border-4 border-ink px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-violet shadow-hard-sm"
                    placeholder="your@email.com"
                  />
                </div>
              )}

              {/* Page context */}
              <div className="border-4 border-ink/20 px-3 py-2 bg-canvas">
                <p className="font-mono text-[8px] text-ink/40 uppercase tracking-wider">
                  Sending from: {typeof window !== 'undefined' ? window.location.pathname : 'PolymerHub'}
                  {userInfo && ` · Logged in as ${userInfo.name || userInfo.email}`}
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !message.trim()}
                className="cn-btn-black w-full justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: selectedType.color, borderColor: selectedType.color }}
              >
                {submitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Feedback</>}
              </button>

              <p className="font-mono text-[8px] text-ink/30 text-center uppercase tracking-wider">
                Goes directly to the PolymerHub founder · Read within 24 hours
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
