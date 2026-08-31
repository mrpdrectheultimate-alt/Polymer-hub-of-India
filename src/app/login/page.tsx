'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
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
  AlertCircle,
  KeyRound,
  Sparkles,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRedirect = searchParams.get('next') || '/dashboard'

  // Input states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  
  // Auth flow states: 'magic' | 'password' | 'phone'
  const [authMethod, setAuthMethod] = useState<'magic' | 'password' | 'phone'>('magic')
  const [isOtpStep, setIsOtpStep] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setIsLoaded(true)
    // Check if already logged in
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push(nextRedirect)
      }
    }
    checkSession()
  }, [supabase, router, nextRedirect])

  // Handle Magic Link / Password / Phone Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (authMethod === 'magic') {
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          throw new Error('Please enter a valid email address.')
        }

        const { error: authError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextRedirect)}`,
          },
        })

        if (authError) throw new Error(authError.message)

        setSuccessMessage(`Magic sign-in link dispatched to ${cleanEmail}! Click the link in your email to enter.`)
      } 
      else if (authMethod === 'password') {
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail || !cleanEmail.includes('@')) {
          throw new Error('Please enter a valid email address.')
        }
        if (!password || password.length < 6) {
          throw new Error('Please enter your account password (at least 6 characters).')
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        })

        if (authError) {
          // If user doesn't exist yet, attempt automatic sign up
          if (authError.message.toLowerCase().includes('invalid login credentials')) {
            const { error: signUpError } = await supabase.auth.signUp({
              email: cleanEmail,
              password: password,
            })
            if (signUpError) throw new Error(signUpError.message)
            setSuccessMessage('Account created and authenticated successfully! Redirecting...')
            setTimeout(() => router.push(nextRedirect), 1000)
            return
          }
          throw new Error(authError.message)
        }

        setSuccessMessage('Authenticated successfully! Entering platform...')
        router.push(nextRedirect)
      } 
      else if (authMethod === 'phone') {
        const cleanPhone = phone.trim().replace(/\s+/g, '')
        if (cleanPhone.length < 10) {
          throw new Error('Please enter a valid 10-digit mobile number.')
        }

        const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`
        const { error: authError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        })

        if (authError) throw new Error(authError.message)

        setIsOtpStep(true)
        setSuccessMessage(`One-time security code dispatched to ${formattedPhone}.`)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please try again.'
      if (msg.toLowerCase().includes('unsupported phone provider') || msg.toLowerCase().includes('phone provider')) {
        setErrorMessage('SMS service requires a connected SMS Gateway (Twilio). Please sign in using Google, GitHub, Magic Link, or Password.')
      } else {
        setErrorMessage(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP Code Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const cleanPhone = phone.trim().replace(/\s+/g, '')
      const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`
      
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode.trim(),
        type: 'sms',
      })

      if (verifyErr) throw new Error(verifyErr.message)

      setSuccessMessage('Phone verified successfully! Entering platform...')
      router.push(nextRedirect)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid or expired OTP code.')
    } finally {
      setIsLoading(false)
    }
  }

  // Instant 1-Click Guest / Evaluator Pass
  const handleInstantDemoLogin = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('polymerhub_guest_access', 'true')
      }
      router.push(nextRedirect || '/dashboard')
    } catch {
      window.location.href = nextRedirect || '/dashboard'
    } finally {
      setIsLoading(false)
    }
  }

  // OAuth Providers (Google, GitHub)
  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setErrorMessage('')
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextRedirect)}`,
        },
      })
      if (oauthError) setErrorMessage(oauthError.message)
    } catch {
      setErrorMessage(`Failed to initialize ${provider} sign-in.`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900">
      
      {/* Background Grids */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* ===== MAIN AUTH CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
          
          {/* Top Brand Accent */}
          <div className="absolute top-0 left-8 right-8 h-[3px] bg-[#2563EB] rounded-full" />

          {/* Logo */}
          <div className="text-center mb-5">
            <Link href="/" className="inline-flex flex-col items-center">
              <div className="relative h-12 w-48 sm:w-56 mb-1">
                <Image
                  src="/logo-horizontal.jpg"
                  alt="Polymer Hub of India"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-xs text-slate-600 font-mono font-medium">India&apos;s Polymer Engineering Platform</p>
            </Link>
          </div>

          {/* Welcome Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black font-display text-slate-900 tracking-tight">
              Welcome back, engineer.
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-normal">
              Sign in to access accredited lessons, simulators, and AI copilot.
            </p>
          </div>

          {/* Value Highlights */}
          <div className="flex justify-center items-center gap-3 mb-6 text-xs text-slate-700 font-mono font-medium">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
              216 Lessons
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-amber-600" />
              Polymer AI
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-emerald-600" />
              Engineering Hub
            </span>
          </div>

          {/* ─── AUTH METHOD TOGGLE TABS ─── */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => { setAuthMethod('magic'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                authMethod === 'magic' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ✉️ Magic Link
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                authMethod === 'password' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              🔑 Email &amp; Password
            </button>
          </div>

          {/* ─── STEP 1: INITIAL SUBMISSION FORM ─── */}
          {!isOtpStep ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email field (for magic link or password) */}
              {authMethod !== 'phone' && (
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Work or Academic Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                      placeholder="name@company.com or you@institution.ac.in"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password field (only for password method) */}
              {authMethod === 'password' && (
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Mobile Phone field (only for phone method) */}
              {authMethod === 'phone' && (
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Mobile Number (India)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrorMessage(''); }}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Guidance helper */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                <span>
                  {authMethod === 'magic' && "We'll send a secure passwordless sign-in link."}
                  {authMethod === 'password' && "Instant secure authentication with your credentials."}
                  {authMethod === 'phone' && "We'll dispatch a 6-digit one-time security OTP code."}
                </span>
              </div>

              {/* Error Display */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Notification */}
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : authMethod === 'magic' ? (
                  <>
                    <span>Send Secure Sign-In Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : authMethod === 'password' ? (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Send Mobile Security Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ─── STEP 2: OTP VERIFICATION SCREEN ─── */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  autoFocus
                  required
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otpCode.length < 6}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Verifying Code...' : 'Verify & Enter Platform →'}
              </button>

              <button
                type="button"
                onClick={() => { setIsOtpStep(false); setOtpCode(''); setErrorMessage(''); }}
                className="w-full text-center text-xs font-mono text-slate-500 hover:text-[#2563EB] pt-1"
              >
                &larr; Use a different number or login method
              </button>
            </form>
          )}

          {/* ===== 1-CLICK INSTANT DEMO PASS ===== */}
          <div className="mt-5 pt-5 border-t border-slate-200 space-y-3">
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>1-Click Instant Guest / Evaluator Pass</span>
            </button>

            {/* Social Logins */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="flex-1 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-800"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>
              <button 
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="flex-1 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-800"
              >
                <svg className="h-4 w-4 text-slate-700 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* ===== Escape Hatch & Trust Badges ===== */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px]">
                <Shield className="h-3 w-3 text-emerald-600" />
                Passwordless
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px]">
                <Lock className="h-3 w-3 text-[#2563EB]" />
                Encrypted
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px]">
                <CheckCircle2 className="h-3 w-3 text-[#2563EB]" />
                Made in India
              </span>
            </div>

            <div>
              <Link 
                href="/subjects" 
                className="text-xs font-mono text-slate-600 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1 group font-medium"
              >
                <span>Explore PolymerHub without signing in</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ===== Compliance & Trust Strip Box ===== */}
        <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-mono text-slate-900">
            <div className="flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Privacy-First Architecture</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <BookOpen className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>19 Subjects &middot; 216 Lessons</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Layers className="w-4 h-4 text-amber-600 shrink-0" />
              <span>ASTM &amp; ISO Aligned</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-mono text-xs text-slate-500">
          Loading secure engineering sign-in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
