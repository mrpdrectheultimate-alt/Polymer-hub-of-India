'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Mail, Shield, CheckCircle, Lock } from 'lucide-react'

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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-105">
                P
              </div>
              <span className="text-xl font-bold text-[#111827]">PolymerHub</span>
            </div>
            <p className="text-sm text-[#64748B]">India&apos;s Knowledge Platform</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#F1F5F9] p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Sign in to continue your polymer journey
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Magic Link Sent State */}
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Check Your Inbox</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We sent a secure magic sign-in link to <span className="font-semibold text-emerald-700">{email}</span>. Click the link in your email to log in instantly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-semibold text-[#2563EB] hover:underline pt-2 block mx-auto"
              >
                Use a different email address
              </button>
            </motion.div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu.in"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl bg-[#FAFAFA] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all text-[#111827] placeholder:text-[#94A3B8] text-sm outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-[#94A3B8] mt-1.5 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Encrypted one-time magic link
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full py-2.5 rounded-xl font-semibold text-white transition-all text-sm
                  ${isLoading 
                    ? 'bg-[#94A3B8] cursor-not-allowed' 
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)] active:scale-[0.98]'
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending magic link...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">or</span>
            <span className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-2 text-sm font-medium text-[#111827]"
            >
              <span className="text-sm font-bold">G</span>
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleOAuthLogin('github')}
              className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-2 text-sm font-medium text-[#111827]"
            >
              <span className="text-sm font-bold">⌘</span>
              GitHub
            </button>
          </div>

          {/* Sign up note */}
          <p className="text-center text-xs text-[#64748B] mt-6">
            New here? Enter your email above for instant 1-click access.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            Passwordless
          </span>
          <span className="w-px h-3 bg-[#E2E8F0]" />
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            DPDP 2023
          </span>
          <span className="w-px h-3 bg-[#E2E8F0]" />
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            AES-256
          </span>
          <span className="w-px h-3 bg-[#E2E8F0]" />
          <span className="flex items-center gap-1.5">🇮🇳 Made in India</span>
        </div>

        {/* Footer link */}
        <div className="text-center mt-4">
          <Link href="/subjects" className="text-xs text-[#94A3B8] hover:text-[#2563EB] transition-colors">
            Browse syllabus →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
