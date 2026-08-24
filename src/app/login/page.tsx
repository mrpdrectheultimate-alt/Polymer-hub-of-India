'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  Lock, 
  Phone,
  ArrowRight,
  BookOpen,
  Cpu,
  Users,
  AlertCircle
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      if (authMethod === 'email') {
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          throw new Error('Please enter a valid email address')
        }

        const { error: authError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (authError) {
          throw new Error(authError.message)
        }
      } else {
        const cleanPhone = phone.trim().replace(/\s+/g, '')
        if (cleanPhone.length < 10) {
          throw new Error('Please enter a valid 10-digit mobile number')
        }

        const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`
        const { error: authError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        })

        if (authError) {
          throw new Error(authError.message)
        }
      }

      setIsSuccess(true)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setErrorMessage('')
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (oauthError) setErrorMessage(oauthError.message)
    } catch {
      setErrorMessage(`Failed to initialize ${provider} sign-in.`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ===== BACKGROUND: Molecular Pattern & Dynamic Nodes ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Molecular Grid SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full opacity-[0.035]" viewBox="0 0 800 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="molGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#F5C518" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
            </defs>
            {[...Array(8)].map((_, row) => (
              <g key={row} transform={`translate(0, ${row * 75 + 30})`}>
                {[...Array(10)].map((_, col) => (
                  <g key={col} transform={`translate(${col * 80 + 40}, 0)`}>
                    <circle cx="0" cy="0" r="4" fill="url(#molGrad)" />
                    <line x1="0" y1="0" x2="0" y2="30" stroke="url(#molGrad)" strokeWidth="1.5" />
                    <circle cx="0" cy="30" r="4" fill="url(#molGrad)" />
                    <line x1="0" y1="30" x2="40" y2="30" stroke="url(#molGrad)" strokeWidth="1.5" />
                    <line x1="0" y1="30" x2="0" y2="60" stroke="url(#molGrad)" strokeWidth="1.5" />
                    <circle cx="0" cy="60" r="4" fill="url(#molGrad)" />
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </div>

        {/* Ambient Radial Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Particulates */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? '#2563EB' : i % 3 === 1 ? '#F5C518' : '#16A34A',
              opacity: 0.12,
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.06, 0.18, 0.06],
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ===== MAIN AUTH CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
          
          {/* Indian Tricolor Accent Bar */}
          <div className="absolute top-0 left-8 right-8 h-[2.5px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full" />

          {/* ===== Logo ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-6"
          >
            <Link href="/" className="inline-flex flex-col items-center group">
              <div className="inline-flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-105">
                  P
                </div>
                <span className="text-xl font-bold text-[#111827]">PolymerHub</span>
              </div>
              <p className="text-xs text-[#64748B] tracking-wide font-mono">India&apos;s Polymer Engineering Platform</p>
            </Link>
          </motion.div>

          {/* ===== Welcome Header ===== */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Sign in to access courses, tools &amp; AI tutor
            </p>
          </motion.div>

          {/* ===== Value Proposition Bar ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center gap-4 mb-6 text-xs text-[#64748B] font-mono"
          >
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-[#2563EB]" />
              216+ Lessons
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-[#F5C518]" />
              AI Tutor
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-[#16A34A]" />
              5K+ Engineers
            </span>
          </motion.div>

          {/* ===== Auth Method Selector ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex bg-[#F1F5F9] rounded-xl p-1 mb-6"
          >
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email')
                setErrorMessage('')
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                authMethod === 'email' 
                  ? 'bg-white text-[#111827] shadow-sm' 
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              📧 Email Link
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone')
                setErrorMessage('')
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                authMethod === 'phone' 
                  ? 'bg-white text-[#111827] shadow-sm' 
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              📱 Mobile OTP
            </button>
          </motion.div>

          {/* ===== Form ===== */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                {authMethod === 'email' ? 'Email address' : 'Mobile number'}
              </label>
              <div className="relative">
                {authMethod === 'email' ? (
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                ) : (
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                )}
                <input
                  type={authMethod === 'email' ? 'email' : 'tel'}
                  value={authMethod === 'email' ? email : phone}
                  onChange={(e) => {
                    if (authMethod === 'email') {
                      setEmail(e.target.value)
                    } else {
                      setPhone(e.target.value)
                    }
                    setErrorMessage('')
                  }}
                  placeholder={authMethod === 'email' ? 'you@college.edu.in' : '9876543210'}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-xl bg-white/95 focus:ring-2 transition-all text-[#111827] placeholder:text-[#94A3B8] text-sm
                    ${errorMessage 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
                    }
                  `}
                  required
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Lock className="h-3 w-3 text-[#94A3B8]" />
                <p className="text-xs text-[#94A3B8]">
                  {authMethod === 'email' 
                    ? 'We will send a secure one-time sign-in link to your inbox' 
                    : 'We will send a secure one-time OTP to your mobile phone'}
                </p>
              </div>
              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 mt-2 flex items-center gap-1.5"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  {errorMessage}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`
                w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-sm shadow-sm
                ${isLoading || isSuccess
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] hover:shadow-[0_4px_24px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-[0.98]'
                }
              `}
              whileHover={!isLoading && !isSuccess ? { y: -2 } : {}}
              whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending verification...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-300" />
                  Sent Successfully ✓
                </>
              ) : (
                'Continue with Passwordless Access'
              )}
            </motion.button>
          </motion.form>

          {/* ===== Divider ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex items-center gap-4 my-6"
          >
            <span className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8] font-mono">or social sign-in</span>
            <span className="flex-1 h-px bg-[#E2E8F0]" />
          </motion.div>

          {/* ===== Social Login ===== */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex gap-3"
          >
            <button 
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs font-semibold text-[#111827] group bg-white shadow-2xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleOAuthLogin('github')}
              className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs font-semibold text-[#111827] group bg-white shadow-2xs"
            >
              <svg className="h-4 w-4 text-[#64748B] group-hover:text-[#111827] transition-colors fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </motion.div>

          {/* ===== Auto Account Creation Notice ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="text-center mt-6"
          >
            <p className="text-xs text-[#64748B]">
              New to PolymerHub?{' '}
              <span className="text-[#2563EB] font-medium">
                Your free account is initialized instantly upon sign-in.
              </span>
            </p>
          </motion.div>

          {/* ===== Trust Badges ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-6 pt-6 border-t border-[#E2E8F0]"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5F9] font-mono text-[11px]">
                <Shield className="h-3 w-3 text-[#16A34A]" />
                Passwordless
              </span>
              <span className="w-px h-3.5 bg-[#E2E8F0]" />
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5F9] font-mono text-[11px]">
                <Lock className="h-3 w-3 text-[#2563EB]" />
                1-Click Access
              </span>
              <span className="w-px h-3.5 bg-[#E2E8F0]" />
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5F9] font-mono text-[11px]">
                🇮🇳 Built in India
              </span>
            </div>
          </motion.div>

          {/* ===== Escape Hatch Link ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mt-4 text-center"
          >
            <Link 
              href="/subjects" 
              className="text-xs font-mono text-[#94A3B8] hover:text-[#2563EB] transition-colors inline-flex items-center gap-1 group"
            >
              Browse 19 subjects curriculum first
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* ===== Success Notification ===== */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  {authMethod === 'email' ? 'Magic sign-in link dispatched!' : 'One-Time Password dispatched!'}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Check your {authMethod === 'email' ? 'email inbox' : 'mobile SMS'} to sign in instantly.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ===== Footer Compliance Notice ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="absolute bottom-4 left-0 right-0 text-center pointer-events-none"
      >
        <p className="text-[10px] text-[#94A3B8] font-mono">
          Secured with 256-bit encryption &middot; Digital Personal Data Protection (DPDP) Act 2023 Compliant
        </p>
      </motion.div>
    </div>
  )
}
