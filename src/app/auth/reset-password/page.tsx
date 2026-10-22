'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  RefreshCw
} from 'lucide-react'

function ResetPasswordContent() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingSession, setIsVerifyingSession] = useState(true)
  const [hasValidSession, setHasValidSession] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function verifyRecoverySession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          setHasValidSession(false)
        } else {
          setHasValidSession(true)
        }
      } catch {
        setHasValidSession(false)
      } finally {
        setIsVerifyingSession(false)
      }
    }

    verifyRecoverySession()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.')
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match. Please re-enter.')
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw new Error(error.message)
      }

      setSuccessMessage('Password successfully updated! Redirecting to your dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifyingSession) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-foreground/60 font-medium">Verifying reset authorization...</p>
      </div>
    )
  }

  if (!hasValidSession) {
    return (
      <div className="w-full max-w-md p-8 bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Session Expired</h2>
          <p className="text-sm text-foreground/60 leading-relaxed">
            The password reset link is invalid or has expired. Please request a new recovery link from the sign-in page.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <span>Back to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl shadow-2xl space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Set New Password</h2>
        <p className="text-sm text-foreground/60">
          Enter and confirm your new secure credentials below.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-foreground/40 mt-1.5 pl-1">
            Minimum 8 characters with letters, numbers, or symbols.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <ShieldCheck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || Boolean(successMessage)}
          className="w-full py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="text-xs font-medium text-foreground/60 hover:text-foreground transition-colors"
        >
          Cancel and return to sign in
        </Link>
      </div>
    </motion.div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-9 h-9" />
          <span className="font-bold text-lg tracking-tight">NextGen<span className="text-primary font-normal">Academy</span></span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <Suspense fallback={
          <div className="flex items-center justify-center p-12">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-foreground/40 z-10 border-t border-border/20">
        &copy; {new Date().getFullYear()} NextGen Polymer Academy. All rights reserved.
      </footer>
    </div>
  )
}
