'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowRight, 
  Mail, 
  Shield, 
  CheckCircle, 
  Sparkles,
  BookOpen,
  Brain,
  Database,
  TrendingUp,
  Lock
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
      } else {
        setSent(true)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-100">
      
      {/* ── Subtle Background Polymer Chain Canvas Grid ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7722" />
              <stop offset="50%" stopColor="#4F8FFF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, row) => (
            <g key={row} transform={`translate(0, ${row * 110 + 40})`}>
              {[...Array(10)].map((_, col) => (
                <g key={col} transform={`translate(${col * 110 + 35}, 0)`}>
                  <circle cx="0" cy="0" r="5" fill="url(#chainGrad)" opacity="0.8" />
                  <line x1="0" y1="0" x2="0" y2="45" stroke="url(#chainGrad)" strokeWidth="1.5" opacity="0.4" />
                  <circle cx="0" cy="45" r="5" fill="url(#chainGrad)" opacity="0.8" />
                  <line x1="0" y1="45" x2="55" y2="45" stroke="url(#chainGrad)" strokeWidth="1.5" opacity="0.4" />
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Ambient Radial Glow Halos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Main Centered Standout Glass Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-7 sm:p-9 relative z-10"
      >
        {/* Brand Mark & Title */}
        <div className="text-center mb-5">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7722] via-white to-[#10B981] flex items-center justify-center text-2xl font-black text-[#0B172A] shadow-xl mb-3 border border-white/20 transition-transform group-hover:scale-105">
              P
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">PolymerHub</h1>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mt-0.5">
              India&apos;s Knowledge Platform
            </p>
          </Link>
        </div>

        {/* Top Eyebrow Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-medium tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            India&apos;s Premier Polymer Engineering Hub
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight uppercase">
            Welcome to the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7722] via-[#FFFFFF] to-[#10B981]">
              Polymer Revolution
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
            Sign in to access 19 subjects, AI tutor, and lab simulations
          </p>
        </div>

        {/* Quick Social Proof Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6 py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/5">
          {[
            { value: '5,000+', label: 'Engineers' },
            { value: '4.9 ★', label: 'Rating' },
            { value: '19', label: 'Subjects' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-base sm:text-lg font-display font-bold text-white leading-tight">{stat.value}</p>
              <p className="text-[10px] font-mono uppercase text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Magic Link Sent State */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 mb-6"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Check Your Inbox</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We have sent an encrypted magic sign-in link to <span className="font-mono text-emerald-300 font-bold">{email}</span>. Click the link in your email to log in instantly.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs font-bold text-slate-400 hover:text-white underline pt-2"
            >
              Use a different email address
            </button>
          </motion.div>
        ) : (
          /* Sign-in Form */
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu.in"
                  className="w-full pl-10 pr-4 py-3.5 border border-white/15 rounded-xl bg-slate-950/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder:text-slate-500 text-sm outline-none font-medium"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-emerald-400 shrink-0" />
                We&apos;ll send an encrypted one-time magic link. No passwords needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3.5 rounded-xl font-display font-bold text-white text-sm transition-all flex items-center justify-center gap-2 shadow-lg
                ${isLoading 
                  ? 'bg-blue-600/50 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.99] shadow-blue-500/25 hover:shadow-blue-500/40'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Magic Link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Magic Link <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        )}

        {/* Features Grid */}
        <div className="pt-5 border-t border-white/10">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
            Included Free with PolymerHub
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: BookOpen, text: 'All 19 Subjects', color: 'text-blue-400' },
              { icon: Brain, text: '15 AI Queries/Day', color: 'text-purple-400' },
              { icon: Database, text: '50 Materials DB', color: 'text-emerald-400' },
              { icon: TrendingUp, text: 'GATE Analytics', color: 'text-amber-400' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div 
                  key={item.text} 
                  className="flex items-center gap-2.5 p-2.5 bg-white/[0.03] rounded-xl border border-white/5"
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs font-medium text-slate-200">{item.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-5 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5">
          <Link href="/subjects" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            Browse syllabus <ArrowRight className="h-3 w-3" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="h-3 w-3" /> 1-Click
            </span>
            <span className="w-px h-3 bg-white/10" />
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Security & DPDP Compliance Trust Badges */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-slate-300" /> Passwordless
            </span>
            <span className="text-white/20">&middot;</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="h-3 w-3" /> Zero leaks
            </span>
            <span className="text-white/20">&middot;</span>
            <span className="text-emerald-400 font-medium">
              🇮🇳 DPDP 2023
            </span>
            <span className="text-white/20">&middot;</span>
            <span>🔐 AES-256</span>
            <span className="text-white/20">&middot;</span>
            <span>🇮🇳 Made in India</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
