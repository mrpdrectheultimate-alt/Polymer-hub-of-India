'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FlaskConical, Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-yellow-light flex flex-col justify-center items-center px-4 py-12 relative animate-soft-fade">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {!sent ? (
          /* ── Login Form ── */
          <div className="bg-canvas border-4 border-ink p-8 md:p-10 shadow-hard" style={{ boxShadow: '6px 6px 0px 0px #1A1C20' }}>
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-yellow-bright border-4 border-ink flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <FlaskConical className="w-7 h-7 text-ink" />
              </div>
              <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight mb-2">Welcome to PolymerHub</h1>
              <p className="text-ink/60 text-xs font-bold leading-relaxed">
                Enter your email address to receive a secure sign-in magic link.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block font-mono text-[10px] font-black text-ink uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu.in"
                    required
                    className="w-full pl-10 pr-4 py-3 border-4 border-ink text-ink font-bold placeholder:text-ink/30 text-sm focus:outline-none focus:bg-slate-50 transition-all bg-white"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border-2 border-rose-400 p-3 text-xs text-rose-900 font-bold font-mono">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 border-4 border-ink bg-ink text-white font-mono font-black text-xs py-3.5 uppercase tracking-widest hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(254,240,138,1)] transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    Send magic link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-ink/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-canvas px-3 font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest">What you get</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2.5">
              {[
                'Free access to all core lessons',
                '15 AI tutor queries per day',
                'Polymer materials database',
                'Track your learning progress',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2.5 text-xs text-ink/75 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            <p className="text-[10px] text-center text-ink/40 font-mono mt-6 uppercase tracking-wider">
              No password required · Expiring link
            </p>
          </div>

        ) : (
          /* ── Success State ── */
          <div className="bg-canvas border-4 border-ink p-8 md:p-10 text-center shadow-hard" style={{ boxShadow: '6px 6px 0px 0px #1A1C20' }}>
            <div className="w-16 h-16 bg-emerald-50 border-4 border-ink flex items-center justify-center mx-auto mb-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="font-display font-black text-2xl text-ink uppercase tracking-tight mb-3">Check your inbox</h2>
            <p className="text-ink/60 text-xs font-bold mb-2">
              We sent a secure magic link to
            </p>
            <p className="font-mono font-black text-ink bg-yellow-bright border-2 border-ink px-3 py-1 inline-block mb-5 text-sm">{email}</p>
            <p className="text-ink/65 text-xs font-bold leading-relaxed mb-6">
              Click the link in the email to sign in instantly. The link remains valid for 1 hour.
            </p>

            <div className="border-4 border-ink p-4 mb-6 text-left bg-blue/5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-mono text-[9px] font-black text-blue uppercase tracking-widest mb-1">First 50 signups promotion</p>
                  <p className="text-xs text-ink/70 font-bold leading-normal">
                    Enter code <span className="font-mono font-black bg-yellow-bright border border-ink px-1 py-0.5">PIIU2025</span> inside the checkout flow to get 3 months Premium free.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="font-mono text-[10px] font-black border-2 border-ink bg-white text-ink px-3 py-1.5 uppercase hover:bg-ink hover:text-white transition-colors"
            >
              Use a different email
            </button>
          </div>
        )}

        <p className="text-center text-ink text-xs mt-6 font-bold">
          <Link href="/subjects" className="hover:underline underline-offset-2 flex items-center justify-center gap-1">
            Browse syllabus without signing in <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </div>
  )
}
