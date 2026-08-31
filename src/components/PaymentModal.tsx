'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  Upload, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Loader2,
  FileImage
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planName?: string
  amount?: number
  isAnnual?: boolean
  onSuccess?: () => void
}

export default function PaymentModal({
  isOpen,
  onClose,
  planName = 'Premium Engineer',
  amount = 149,
  isAnnual = false,
  onSuccess
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false)
  const [utr, setUtr] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Real UPI details provided by Founder
  const upiId = '8125358468@fam'
  const payeeName = 'Chengala Lakshmi Prasanna Kumar Naidu'
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(planName + ' Plan')}`
  const whatsappNumber = '918125358468'

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Screenshot size must be under 5 MB')
        return
      }
      setSelectedFile(file)
      setErrorMessage(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!utr && !selectedFile) {
      setErrorMessage('Please provide either the 12-digit UTR number or attach a payment screenshot.')
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      let screenshotUrl = 'submitted_manual_verification'
      if (selectedFile && user) {
        try {
          const fileExt = selectedFile.name.split('.').pop()
          const fileName = `${user.id}_${Date.now()}.${fileExt}`
          const { error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(fileName, selectedFile, { upsert: true })

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('receipts')
              .getPublicUrl(fileName)
            screenshotUrl = publicUrlData.publicUrl
          }
        } catch {
          screenshotUrl = `attachment:${selectedFile.name}`
        }
      }

      if (user) {
        await supabase.from('payment_requests').insert({
          user_id: user.id,
          amount: amount,
          screenshot_url: screenshotUrl,
          status: 'pending',
          metadata: {
            utr,
            contact_info: contactInfo || user.email,
            plan_name: planName,
            is_annual: isAnnual,
            submitted_at: new Date().toISOString()
          }
        })
      }

      setIsSubmitted(true)
      onSuccess?.()
    } catch {
      setIsSubmitted(true)
      onSuccess?.()
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hello PolymerHub Team, I have completed UPI payment for ${planName} (₹${amount}).\n\nUPI ID Paid: ${upiId}\nUTR Number: ${utr || 'Attached Screenshot'}\nEmail/Phone: ${contactInfo || 'User Account'}\n\nPlease verify and activate my Premium access.`
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white font-display">Upgrade to {planName}</h3>
                <p className="text-[11px] text-slate-400 font-mono">Official Scanner &middot; Instant Verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            {!isSubmitted ? (
              <>
                {/* Amount Banner */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">Payable Amount</span>
                    <div className="text-2xl font-extrabold text-blue-900">₹{amount} <span className="text-xs text-blue-600 font-normal">/ {isAnnual ? 'year' : 'month'}</span></div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Instant Review Queue
                    </span>
                  </div>
                </div>

                {/* Step 1: Scan & Pay */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      Step 1: Scan QR or Pay via UPI ID
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">FamApp &middot; GPay &middot; PhonePe &middot; Paytm</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    {/* User's Real QR Scanner Image */}
                    <div className="w-36 h-48 bg-white p-1 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                      <div className="relative w-full h-full rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src="/upi_scanner.jpg" 
                          alt="Official UPI QR Scanner" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* UPI Copy Box & App Link */}
                    <div className="flex-1 w-full space-y-2.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Official UPI ID:</span>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-2">
                          <code className="text-xs font-mono font-bold text-blue-700 flex-1 truncate">{upiId}</code>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-mono font-semibold transition-colors flex items-center gap-1"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono">
                        <span className="font-semibold text-slate-700">Payee:</span> {payeeName}
                      </div>

                      <a
                        href={upiLink}
                        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold text-center block transition-all shadow-xs"
                      >
                        ⚡ Open Directly in UPI App
                      </a>
                    </div>
                  </div>
                </div>

                {/* Step 2: Upload Screenshot or Enter UTR */}
                <form onSubmit={handleSubmitProof} className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    Step 2: Attach Payment Screenshot / Ref
                  </h4>

                  {/* File Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      selectedFile
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {previewUrl ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white border border-emerald-200 overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={previewUrl} alt="Receipt preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-emerald-900 truncate max-w-[200px]">{selectedFile?.name}</p>
                          <p className="text-[10px] text-emerald-700 font-mono">{(selectedFile!.size / 1024).toFixed(1)} KB &middot; Tap to replace</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FileImage className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Attach Payment Screenshot</p>
                          <p className="text-[10px] text-slate-500 font-mono">Tap to select receipt image (PNG, JPG up to 5MB)</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 12-Digit UTR Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                      12-Digit UPI Ref / UTR Number (Optional if screenshot attached)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423518920194"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-mono text-slate-800"
                    />
                  </div>

                  {/* Contact Phone / Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                      Registered Email or Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="name@example.com or 8125358468"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs font-mono text-slate-800"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs font-mono text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      {errorMessage}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Proof...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Submit Payment Proof
                        </>
                      )}
                    </button>

                    {/* WhatsApp Quick Verification Link */}
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send Screenshot on WhatsApp (+91 81253 58468)
                    </a>
                  </div>
                </form>
              </>
            ) : (
              /* Success Confirmation State */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xl font-bold font-display text-slate-900">Payment Proof Received!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you! Your payment verification request for <strong>{planName} (₹{amount})</strong> has been received and queued.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Paid to UPI:</span>
                    <span className="font-bold text-slate-900">{upiId}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>UTR / Screenshot:</span>
                    <span className="font-bold text-slate-900">{utr || 'Attached via Screenshot'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Expected Turnaround:</span>
                    <span className="font-bold text-emerald-700">15 &ndash; 30 Minutes</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Ping on WhatsApp for Instant Activation
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-mono text-xs text-slate-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
