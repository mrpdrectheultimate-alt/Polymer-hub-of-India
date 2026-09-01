'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  MessageSquarePlus, 
  X, 
  Send, 
  Star, 
  Bug, 
  Lightbulb, 
  BookOpen, 
  Heart, 
  CheckCircle,
  MessageSquare,
  Sparkles
} from 'lucide-react'

type FeedbackType = 'bug' | 'feature' | 'content' | 'general' | 'praise'

const TYPES: { id: FeedbackType; label: string; icon: React.ElementType; emoji: string; placeholder: string }[] = [
  {
    id: 'bug', 
    label: 'Bug', 
    emoji: '🐞',
    icon: Bug,
    placeholder: 'What went wrong? Which page were you on? What did you expect to happen?'
  },
  {
    id: 'feature', 
    label: 'Feature', 
    emoji: '⭐',
    icon: Lightbulb,
    placeholder: 'What would you like us to build? Describe the tool or feature that would help you.'
  },
  {
    id: 'content', 
    label: 'Content', 
    emoji: '📖',
    icon: BookOpen,
    placeholder: 'Which lesson, formula, or subject? What needs improvement in the curriculum?'
  },
  {
    id: 'praise', 
    label: 'Love', 
    emoji: '❤️',
    icon: Heart,
    placeholder: "What's working well? What do you love most about PolymerHub?"
  },
  {
    id: 'general', 
    label: 'General', 
    emoji: '💬',
    icon: MessageSquare,
    placeholder: 'Share your feedback, ideas, or suggestions with the PolymerHub team...'
  },
]

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function FeedbackWidget() {
  const pathname = usePathname()
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

  const isAiTutorPage = pathname === '/ai-tutor'
  const isLessonPage = pathname.startsWith('/lessons/')

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single()
          setUserInfo({ id: session.user.id, email: session.user.email ?? '', name: profile?.full_name ?? '' })
          setEmail(session.user.email ?? '')
        }
      } catch {
        // Fallback for unauthenticated guests
      }
    }
    init()
  }, [supabase])

  const selectedType = TYPES.find(t => t.id === type)!

  const handleSubmit = async () => {
    if (!message.trim()) { 
      setError('Please write your feedback before sending.')
      return 
    }
    if (message.trim().length < 5) { 
      setError('Please provide at least a few words so we can help.')
      return 
    }

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

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setOpen(false)
      setMessage('')
      setRating(0)
      setType('general')
      setError('')
    }, 3000)
  }

  const handleOpen = () => {
    setOpen(true)
    setSubmitted(false)
    setError('')
  }

  if (isAiTutorPage) return null

  return (
    <>
      {/* Floating Trigger Button: PolymerHub Blue */}
      {!open && (
        <button
          onClick={handleOpen}
          className={`fixed z-40 bg-[#2563EB] hover:bg-[#1D4ED8] text-white items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full font-mono text-xs font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
            isAiTutorPage 
              ? 'hidden md:flex bottom-6 right-6' 
              : isLessonPage
              ? 'flex bottom-4 left-4 sm:bottom-6 sm:left-6'
              : 'flex bottom-4 right-4 sm:bottom-6 sm:right-6'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Feedback</span>
        </button>
      )}

      {/* Modern Feedback Modal */}
      {open && (
        <div className={`fixed z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[85vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-5 duration-200 font-sans ${
          isLessonPage
            ? 'bottom-4 left-4 sm:bottom-6 sm:left-6'
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
        }`}>

          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between bg-[#2563EB] text-white rounded-t-3xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-display font-bold text-sm">Share Your Feedback</span>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close feedback window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            /* Success state */
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">Thank You! 🙏</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Your feedback has been delivered directly to our engineering team. We review every note to improve PolymerHub.
              </p>
            </div>
          ) : (
            <div className="p-5 space-y-4">

              {/* Feedback Type Selector Pills */}
              <div>
                <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Feedback Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map(t => {
                    const isSelected = type === t.id
                    return (
                      <button 
                        key={t.id} 
                        onClick={() => setType(t.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                        }`}
                      >
                        <span>{t.emoji}</span>
                        <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Star rating */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Experience Rating
                  </label>
                  {(hoverRating || rating) > 0 && (
                    <span className="font-mono text-[10px] font-bold text-[#2563EB]">
                      {RATING_LABELS[hoverRating || rating]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => {
                    const isActive = star <= (hoverRating || rating)
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        <Star 
                          className={`w-5 h-5 transition-colors ${
                            isActive 
                              ? 'text-[#F59E0B] fill-[#F59E0B]' 
                              : 'text-slate-300 fill-none'
                          }`} 
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Your Thoughts &amp; Suggestions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 resize-none font-sans bg-slate-50/50"
                  placeholder={selectedType.placeholder}
                />
                <div className="flex items-center justify-between mt-1">
                  {error && <p className="font-mono text-[10px] text-rose-600 font-bold">{error}</p>}
                  <span className="font-mono text-[10px] text-slate-400 ml-auto tabular-nums">{message.length} chars</span>
                </div>
              </div>

              {/* Email (only if guest) */}
              {!userInfo && (
                <div>
                  <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Your Email (Optional &mdash; for replies)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 font-sans bg-slate-50/50"
                    placeholder="your@email.com"
                  />
                </div>
              )}

              {/* Submit CTA */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !message.trim()}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>

              {/* Trust Footer */}
              <p className="text-[11px] text-slate-400 font-sans text-center">
                Sent directly to the PolymerHub team &middot; Reviewed within 24 hours
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
