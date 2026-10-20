'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle2, AlertCircle, Loader2, Mail, ExternalLink, ShieldCheck } from 'lucide-react'
import { CONTACT_CHANNELS, ContactChannel, USER_ROLES, UserRole } from '@/lib/contact'
import { createClient } from '@/lib/supabase/client'

interface ContactModalProps {
  channel: ContactChannel | null
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ channel, isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(USER_ROLES[0])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const meta = channel ? CONTACT_CHANNELS[channel] : null

  // Pre-fill user data from Supabase session if authenticated
  useEffect(() => {
    if (!isOpen || !channel) return

    const supabase = createClient()
    setSubject(CONTACT_CHANNELS[channel].defaultSubject)
    setStatus('idle')
    setErrorMessage(null)

    async function loadUserProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setEmail(session.user.email || '')
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, target_path')
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
  }, [isOpen, channel])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !meta) return null

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

  const handleResetAndClose = () => {
    setMessage('')
    setStatus('idle')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs select-none">
        
        {/* Backdrop click dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl border-2 border-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* ── Modal Header: Midnight Navy Theme ── */}
          <div className="bg-[#0A1628] text-white p-5 sm:p-6 border-b-2 border-slate-900 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 bg-white/10">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
                <span>{meta.badgeLabel}</span>
              </div>
              <h2 id="contact-modal-title" className="font-display text-xl sm:text-2xl font-black tracking-tight uppercase">
                {meta.title}
              </h2>
              <p className="text-xs text-slate-300 font-light leading-relaxed max-w-md">
                {meta.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Modal Content: Form or Success Card ── */}
          <div className="p-5 sm:p-6 overflow-y-auto">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-2xl font-black text-slate-900 uppercase">
                    Message Dispatched!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your message has been securely routed to <strong className="text-slate-900 font-mono">{meta.email}</strong>.
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    We will reply directly to <strong className="text-slate-800">{email}</strong> within 24–48 business hours.
                  </p>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-8 py-3 bg-[#0A1628] hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Done &amp; Return
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 select-text">
                {/* Locked Recipient Badge */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Recipient:</span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{meta.email}</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Honeypot field (hidden from real users) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave empty</label>
                  <input
                    type="text"
                    id="website_hp"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs text-slate-900 font-medium outline-hidden transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. anand@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs text-slate-900 font-medium outline-hidden transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Academic / Industry Role Selector */}
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Your Academic / Professional Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs text-slate-900 font-medium outline-hidden transition-all"
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
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your message..."
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs text-slate-900 font-medium outline-hidden transition-all"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono font-bold uppercase text-slate-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {message.length} characters
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your detailed query, feedback, or requirements..."
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs text-slate-900 font-normal outline-hidden transition-all resize-none leading-relaxed placeholder:text-slate-400"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-3.5 bg-[#0A1628] hover:bg-[#1E293B] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Dispatching Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400" />
                        <span>Send Message Directly</span>
                      </>
                    )}
                  </button>

                  {/* Fallback Option */}
                  <div className="text-center pt-1">
                    <a
                      href={`mailto:${meta.email}?subject=${encodeURIComponent(subject || meta.defaultSubject)}&body=${encodeURIComponent(message)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-[#2563EB] transition-colors"
                    >
                      <span>Prefer your system email client? Open in Mail App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* ── Modal Footer Bar ── */}
          <div className="bg-slate-50 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSL Encrypted &amp; Privacy-First</span>
            </span>
            <span>PolymerHub Communication Gateway</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}
