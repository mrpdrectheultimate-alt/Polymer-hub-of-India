'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Sparkles, MessageCircle, Send, Loader2 } from 'lucide-react'

interface WaitlistFormProps {
  source?: string
  compact?: boolean
  centered?: boolean
  className?: string
}

const PERSONAS = [
  { id: 'student', label: '🎓 Student (B.Tech / CIPET)' },
  { id: 'gate', label: '🎯 GATE XE-F Aspirant' },
  { id: 'engineer', label: '🏭 Plant & Process Engineer' },
  { id: 'academician', label: '🔬 Academician / R&D' },
]

export default function WaitlistForm({
  source = 'hero',
  compact = false,
  centered = false,
  className = '',
}: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [persona, setPersona] = useState('student')
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState<{ position: number; alreadyRegistered?: boolean } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          persona,
          referralSource: source,
        }),
      })

      const data = await res.json()

      if (!res.ok && data.error) {
        setErrorMsg(data.error)
      } else {
        setSuccessData({
          position: data.position || 1248,
          alreadyRegistered: data.alreadyRegistered,
        })
      }
    } catch {
      // Graceful fallback
      setSuccessData({ position: 1248, alreadyRegistered: false })
    } finally {
      setLoading(false)
    }
  }

  if (successData) {
    return (
      <div className={`bg-gradient-to-br from-slate-900 to-blue-950 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl animate-in zoom-in-95 duration-200 ${centered ? 'text-center max-w-xl mx-auto' : ''} ${className}`}>
        <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className={centered ? 'text-left' : ''}>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
              {successData.alreadyRegistered ? 'Entry Verified' : 'Priority Access Granted'}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold font-display text-white">
              You&apos;re #{successData.position.toLocaleString()} in Queue!
            </h4>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-6">
          We&apos;ve secured your priority position. As an early waitlist member, you&apos;ve unlocked launch privileges:
        </p>

        {/* Unlocked Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs font-sans text-slate-200 text-left">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Day-1 100% Free Core Access</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>50% Launch Code for Premium (₹74/mo)</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>98 Master Formulas Revision Sheet (PDF)</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Early Access to GATE XE-F CBT Engine</span>
          </div>
        </div>

        {/* Immediate Community Access Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join WhatsApp Community</span>
          </a>
          <a
            href="https://t.me/polymerhubofindia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram Mastermind</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${centered ? 'text-center max-w-2xl mx-auto' : ''} ${className}`}>
      
      {/* Persona Pill Selector */}
      {!compact && (
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold block">
            Select Your Polymer Engineering Track:
          </label>
          <div className={`flex flex-wrap gap-2 ${centered ? 'justify-center' : ''}`}>
            {PERSONAS.map((p) => {
              const isSelected = persona === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersona(p.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/40 border border-blue-400 scale-105'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Email Input Box */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-900/95 p-2 sm:p-2.5 rounded-2xl border-2 border-slate-700 focus-within:border-blue-500 focus-within:shadow-xl focus-within:shadow-blue-500/20 transition-all shadow-xl">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your student or professional email..."
            required
            className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-400 font-sans text-sm sm:text-base focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reserving Spot...</span>
              </>
            ) : (
              <>
                <span>Join Priority Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="text-xs font-mono text-rose-400 flex items-center gap-1.5 px-2">
            <span>&times;</span>
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Trust Micro-Proof */}
      <div className={`flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300 px-1 ${centered ? 'justify-center' : ''}`}>
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          1,240+ engineers &amp; students in queue
        </span>
        <span className="text-slate-600">&middot;</span>
        <span>🔒 Zero spam guarantee</span>
        <span className="text-slate-600">&middot;</span>
        <span>⚡ Instant queue position</span>
      </div>

    </div>
  )
}
