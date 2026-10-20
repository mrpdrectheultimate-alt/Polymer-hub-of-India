'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, Loader2, X, ExternalLink, ShieldCheck, Mail } from 'lucide-react'
import { CONTACT_CHANNELS, ContactChannel, USER_ROLES, UserRole } from '@/lib/contact'
import { createClient } from '@/lib/supabase/client'

interface InlineContactComposerProps {
  channel: ContactChannel
  onClose: () => void
}

export function InlineContactComposer({ channel, onClose }: InlineContactComposerProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(USER_ROLES[0])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const meta = CONTACT_CHANNELS[channel]

  // Auto-fill user metadata from Supabase session if authenticated
  useEffect(() => {
    const supabase = createClient()
    setSubject(meta.defaultSubject)
    setStatus('idle')
    setErrorMessage(null)

    async function loadUserProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setEmail(session.user.email || '')
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single()

          if (profile?.full_name) {
            setName(profile.full_name)
          }
        }
      } catch (err) {
        console.warn('Could not auto-populate user metadata:', err)
      }
    }

    loadUserProfile()
  }, [channel, meta.defaultSubject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    if (message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters long.')
      return
    }

    setStatus('sending')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          subject: subject.trim(),
          message: message.trim(),
          channel: meta.channel,
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
          website_hp: honeypot
        })
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to dispatch message.')
      }

      setStatus('success')
    } catch (err: unknown) {
      console.error('Contact submission error:', err)
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again or use the email link below.')
    }
  }

  const handleReset = () => {
    setMessage('')
    setStatus('idle')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden mt-2"
    >
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        
        {/* Header Bar right where clicked */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: meta.accentColor }}
            />
            <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
              Compose to {meta.badgeLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close composer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center space-y-3"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display text-base font-bold text-slate-900 uppercase">
                Message Dispatched!
              </h4>
              <p className="text-[11px] text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your communication has been routed directly to{' '}
                <strong className="text-slate-900 font-mono">{meta.email}</strong>.
              </p>
              <p className="text-[10px] text-slate-500">
                We will reply to <strong className="text-slate-800">{email}</strong> within 24–48 hours.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 bg-[#0A1628] hover:bg-slate-800 text-white font-mono text-[11px] font-bold uppercase rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Recipient locked indicator */}
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono">
              <span className="text-slate-500 font-bold uppercase text-[9px]">To:</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Mail className="w-3 h-3 text-[#2563EB]" />
                <span>{meta.email}</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-1.5 text-[11px] text-red-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-700 mb-0.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-[#2563EB] rounded-lg text-xs text-slate-900 font-medium outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-700 mb-0.5">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-[#2563EB] rounded-lg text-xs text-slate-900 font-medium outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Academic Role Selector */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-700 mb-0.5">
                Your Academic / Professional Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-[#2563EB] rounded-lg text-xs text-slate-900 font-medium outline-hidden transition-all"
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-700 mb-0.5">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief subject..."
                className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-[#2563EB] rounded-lg text-xs text-slate-900 font-medium outline-hidden transition-all"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <span className="text-[9px] font-mono text-slate-400">
                  {message.length} chars
                </span>
              </div>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-[#2563EB] rounded-lg text-xs text-slate-900 font-normal outline-hidden transition-all resize-none leading-relaxed placeholder:text-slate-400"
              />
            </div>

            {/* Submit & Secondary Options */}
            <div className="pt-1 space-y-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-2.5 bg-[#0A1628] hover:bg-[#1E293B] text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Message Directly</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Encrypted In-App Gateway</span>
                </span>
                <a
                  href={`mailto:${meta.email}?subject=${encodeURIComponent(subject || meta.defaultSubject)}&body=${encodeURIComponent(message)}`}
                  className="inline-flex items-center gap-1 hover:text-[#2563EB] transition-colors"
                >
                  <span>Open in external mail app</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  )
}
