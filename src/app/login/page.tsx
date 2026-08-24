'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  Sparkles,
  Lock,
  ArrowRight
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
      setError('An unexpected authentication error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setError('')
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (oauthError) setError(oauthError.message)
    } catch {
      setError(`Failed to sign in with ${provider}.`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-900">
      
      {/* ── Classic Ornamental Watermark Background ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] select-none">
        <div className="absolute top-10 right-12 text-9xl font-serif text-[#8B6914]">✧</div>
        <div className="absolute bottom-10 left-12 text-9xl font-serif text-[#8B6914]">✧</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-2 border-[#8B6914] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-dashed border-[#8B6914] rounded-full" />
      </div>

      {/* ── Main Classic Prestigious Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-[460px] bg-white rounded-3xl shadow-[0_25px_60px_rgba(40,25,10,0.12)] p-8 sm:p-10 relative z-10 border border-[#E8E3DE]"
      >
        {/* Decorative Top Gold Bar */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#8B6914] via-[#C9A84C] to-[#8B6914] mx-auto mb-6 rounded-full" />

        {/* Heraldic Logo Mark */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8B6914] via-[#C9A84C] to-[#8B6914] text-3xl font-serif font-black text-white shadow-xl mb-3 relative border-2 border-amber-200 transition-transform group-hover:scale-105">
              <span className="absolute -top-1 -right-1 text-xs text-amber-200">✦</span>
              <span className="absolute -bottom-1 -left-1 text-xs text-amber-200">✦</span>
              P
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              PolymerHub
            </h1>
            <p className="text-[11px] text-[#8B8B8B] font-mono uppercase tracking-widest mt-1">
              India&apos;s Knowledge Platform &middot; EST. 2024
            </p>
          </Link>
        </div>

        {/* Decorative Ornamental Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-10 h-px bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs">✦</span>
          <span className="w-10 h-px bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </div>

        {/* Eyebrow Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300/40 text-amber-900 text-xs font-serif italic">
            <Sparkles className="h-3 w-3 text-[#C9A84C]" />
            India&apos;s Premier Polymer Engineering Institution
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-serif text-[#1A1A1A] leading-relaxed">
            Welcome to the
            <span className="block text-2xl font-serif font-bold bg-gradient-to-r from-[#8B6914] via-[#C9A84C] to-[#8B6914] bg-clip-text text-transparent mt-0.5">
              Polymer Revolution
            </span>
          </h2>
          <p className="text-xs text-[#8B8B8B] mt-1 font-light">
            Sign in to access 19 subjects, AI tutor, and virtual laboratory simulations
          </p>
        </div>

        {/* Stats with Classic Styling */}
        <div className="flex justify-center items-center gap-6 mb-6 py-3 px-4 rounded-2xl bg-[#F8F6F4] border border-[#E8E3DE]">
          {[
            { value: '5,000+', label: 'Engineers' },
            { value: '4.9 ★', label: 'Rating' },
            { value: '19', label: 'Subjects' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A]">{stat.value}</p>
              <p className="text-[10px] text-[#8B8B8B] tracking-wider uppercase font-mono">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Magic Link Sent State */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3 mb-6"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-[#8B6914] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Check Your Inbox</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              We have dispatched an encrypted one-time magic link to <span className="font-mono text-[#8B6914] font-bold">{email}</span>. Click the link in your email to enter immediately.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs font-medium text-[#8B6914] hover:text-[#C9A84C] underline pt-2 block mx-auto"
            >
              Use a different email address
            </button>
          </motion.div>
        ) : (
          /* Sign-in Form */
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-[11px] font-serif font-semibold text-[#8B8B8B] tracking-wider uppercase mb-1.5">
                Institutional / Personal Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C9A84C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu.in"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F8F6F4] border border-[#E8E3DE] rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all text-[#1A1A1A] placeholder:text-[#B8B0A8] text-sm outline-none font-light"
                  required
                />
              </div>
              <p className="text-[11px] text-[#B8B0A8] mt-1.5 flex items-center gap-1.5 font-light">
                <Shield className="h-3 w-3 text-[#C9A84C] shrink-0" />
                We&apos;ll send an encrypted one-time magic link. No passwords needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3.5 rounded-xl font-serif font-bold text-white text-sm transition-all shadow-md
                ${isLoading 
                  ? 'bg-[#B8B0A8] cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#8B6914] via-[#C9A84C] to-[#8B6914] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin text-amber-200">✦</span>
                  Dispatching Magic Link...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        )}

        {/* Divider with "or" */}
        <div className="flex items-center gap-4 my-5">
          <span className="flex-1 h-px bg-[#E8E3DE]" />
          <span className="text-[10px] text-[#B8B0A8] tracking-widest uppercase font-light font-mono">or</span>
          <span className="flex-1 h-px bg-[#E8E3DE]" />
        </div>

        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="py-2.5 px-4 rounded-xl border border-[#E8E3DE] bg-[#F8F6F4] hover:bg-white hover:border-[#C9A84C] hover:shadow-sm transition-all flex items-center justify-center gap-2 text-xs font-serif font-medium text-[#1A1A1A]"
          >
            <span className="font-bold text-sm">G</span> Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            className="py-2.5 px-4 rounded-xl border border-[#E8E3DE] bg-[#F8F6F4] hover:bg-white hover:border-[#C9A84C] hover:shadow-sm transition-all flex items-center justify-center gap-2 text-xs font-serif font-medium text-[#1A1A1A]"
          >
            <span className="font-bold text-sm">⌘</span> GitHub
          </button>
        </div>

        {/* Features Grid with Classic Icons */}
        <div className="pt-5 border-t border-[#E8E3DE]">
          <p className="text-[10px] text-[#B8B0A8] tracking-widest uppercase text-center font-light mb-3 font-mono">
            Included Free with PolymerHub
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '📜', text: '19 Subjects' },
              { icon: '🧠', text: '15 AI Queries' },
              { icon: '📊', text: '50 Materials DB' },
              { icon: '🎯', text: 'GATE Analytics' },
            ].map((item) => (
              <div 
                key={item.text} 
                className="flex items-center gap-2 p-2.5 bg-[#F8F6F4] rounded-xl border border-[#E8E3DE]"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs font-medium text-[#1A1A1A]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-5 flex items-center justify-between text-xs text-[#B8B0A8] pt-3 border-t border-[#E8E3DE]">
          <Link href="/subjects" className="hover:text-[#8B6914] transition-colors flex items-center gap-1 font-light">
            Browse syllabus <span className="text-[#C9A84C]">→</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#8B6914] font-serif">
              <CheckCircle className="h-3 w-3 text-[#C9A84C]" /> 1-Click
            </span>
            <span className="w-px h-3 bg-[#E8E3DE]" />
            <Link href="/privacy" className="hover:text-[#8B6914] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Trust Seals */}
        <div className="mt-5 pt-4 border-t border-[#E8E3DE]">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-[#8B8B8B] font-light tracking-wide">
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✦</span> Passwordless
            </span>
            <span className="text-slate-300">&middot;</span>
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✦</span> Zero credential leaks
            </span>
            <span className="text-slate-300">&middot;</span>
            <span className="flex items-center gap-1 text-[#8B6914] font-medium">
              <span className="text-[#C9A84C]">✦</span> DPDP 2023 Compliant
            </span>
            <span className="text-slate-300">&middot;</span>
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✦</span> AES-256
            </span>
            <span className="text-slate-300">&middot;</span>
            <span className="flex items-center gap-1">
              <span className="text-[#C9A84C]">✦</span> Made in India
            </span>
          </div>
        </div>

        {/* Bottom Decorative Gold Line */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#C9A84C] via-[#8B6914] to-[#C9A84C] mx-auto mt-6 rounded-full" />
      </motion.div>
    </div>
  )
}
