'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  FlaskConical, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Brain, 
  Database, 
  TrendingUp,
  Star,
  Lock
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF8F5]">
      
      {/* ── LEFT: Cinematic Split-Screen Brand Story (Desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A1628] text-white overflow-hidden flex-col justify-between p-12 lg:p-16 border-r-2 border-slate-900">
        
        {/* Background Visual with Subtle Vignette */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1200&q=80"
            alt="Polymer Engineering Innovation"
            className="w-full h-full object-cover opacity-25 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1628] via-[#0A1628]/85 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Top Header / Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF8A00] via-white to-[#16A34A] flex items-center justify-center shadow-lg border border-white/20">
              <FlaskConical className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tight text-white block">
                PolymerHub
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                India&apos;s Knowledge Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            India&apos;s Premier Polymer Engineering Hub
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight tracking-tight text-white uppercase">
            Welcome to the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Polymer Revolution
            </span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed font-light">
            Master 19 subjects, test with 225+ practice questions, query our RAG AI Specialist, and access the 50 Materials Database — all from one unified student portal.
          </p>

          {/* Social Proof Stats */}
          <div className="pt-4 flex items-center gap-6 border-t border-white/10">
            <div>
              <p className="font-display text-2xl font-black text-white">2,000+</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Active Students</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="font-display text-2xl font-black text-amber-400 flex items-center gap-1">
                4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Platform Rating</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="font-display text-2xl font-black text-emerald-400">19</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Core Subjects</p>
            </div>
          </div>
        </div>

        {/* Bottom Footnote */}
        <div className="relative z-10 flex items-center gap-2 text-xs font-mono text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Passwordless · Zero credential leaks · DPDP 2023 Compliant</span>
        </div>

      </div>

      {/* ── RIGHT: Interactive Sign-In Card Container ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 mb-8 self-start">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8A00] via-white to-[#16A34A] flex items-center justify-center shadow-md">
              <FlaskConical className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-display font-black text-xl text-slate-900">PolymerHub</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          
          {!sent ? (
            /* ── Sign-in Form Card ── */
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-xl p-8 sm:p-10 space-y-6">
              
              {/* Card Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> No Password Required
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Sign In Securely
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Enter your email to receive a secure instant magic link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block font-mono text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu.in"
                      required
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-900 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-white shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> We&apos;ll send an encrypted one-time login link
                  </p>
                </div>

                {error && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 text-xs text-rose-800 font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-900 transition-all shadow-[4px_4px_0px_0px_#0A1628] hover:shadow-[2px_2px_0px_0px_#0A1628] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Magic Link...
                    </>
                  ) : (
                    <>
                      Send Magic Link <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* What You Get Features Grid */}
              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
                  Included Free with PolymerHub
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: BookOpen, text: 'All 19 Subjects', color: '#2563EB' },
                    { icon: Brain, text: '15 AI Queries/Day', color: '#EA580C' },
                    { icon: Database, text: '50 Materials DB', color: '#15803D' },
                    { icon: TrendingUp, text: 'GATE Analytics', color: '#7C3AED' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.text} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                        <span className="text-xs font-bold text-slate-800">{item.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Quick Links */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-medium">
                <Link href="/subjects" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  Browse syllabus &rarr;
                </Link>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click
                  </span>
                  <span className="w-px h-3 bg-slate-200" />
                  <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                    Privacy
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            /* ── Success State Card ── */
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-xl p-8 sm:p-10 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div>
                <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight mb-1">
                  Check Your Inbox
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  We sent an encrypted sign-in link to:
                </p>
                <div className="mt-2 font-mono font-bold text-sm text-slate-900 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg inline-block">
                  {email}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Click the magic link in your email to sign in instantly. The link remains valid for 1 hour.
              </p>

              {/* Promotion Banner */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> First 50 Signups Perk
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Enter coupon code <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-blue-300 text-blue-800">PIIU2025</span> at checkout for 3 months complimentary Premium access.
                </p>
              </div>

              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="font-mono text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-500 px-4 py-2 rounded-xl transition-colors"
              >
                Use a different email address
              </button>
            </div>
          )}

          {/* Trust Footnote */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] font-mono font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> DPDP 2023
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span>🔒 AES-256</span>
              <span className="w-px h-3 bg-slate-200" />
              <span>🇮🇳 Made in India</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
