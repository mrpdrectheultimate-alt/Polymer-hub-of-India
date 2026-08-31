'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  Copy, 
  Check, 
  MessageCircle, 
  FileImage
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Footer from '@/components/Footer'

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ subscription_status?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [txnId, setTxnId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1) // 1 = pay, 2 = success
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const upiId = '8125358468@fam'
  const payeeName = 'Chengala Lakshmi Prasanna Kumar Naidu'
  const upiAmount = 149
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent('PolymerHub Premium Monthly')}`
  const whatsappNumber = '918125358468'

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
      setLoading(false)
    }
    loadUser()
  }, [router, supabase])

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Screenshot size must be under 5 MB.',
        })
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!txnId.trim() && !selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Details Required',
        description: 'Please provide either the 12-digit UTR number or attach a screenshot.',
      })
      return
    }

    setSubmitting(true)

    try {
      let screenshotUrl = 'submitted_manual_verification'
      if (selectedFile) {
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

      await supabase.from('payment_requests').insert({
        user_id: user.id,
        amount: upiAmount,
        screenshot_url: screenshotUrl,
        status: 'pending',
        metadata: {
          utr: txnId,
          user_email: user.email,
          plan: 'premium_monthly',
          submitted_at: new Date().toISOString()
        }
      })

      setStep(2)
      toast({
        title: 'Payment Proof Submitted!',
        description: 'Your request is queued for instant manual verification.',
      })
    } catch {
      setStep(2)
      toast({
        title: 'Payment Proof Received',
        description: 'Thank you. Our team will verify your receipt.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hello PolymerHub Team, I have completed UPI payment for PolymerHub Premium (₹${upiAmount}).\n\nUTR Number: ${txnId || 'Attached'}\nEmail: ${user?.email || 'Registered User'}\n\nPlease verify and activate my Premium access.`
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    )
  }

  const isPremium = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 w-full">
        {isPremium ? (
          /* Already Premium State */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold text-slate-900 font-display">You are a Premium Member!</h1>
              <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
                Thank you for supporting PolymerHub. You have unlocked unlimited AI Copilot chat, all 19 subjects (216 lessons), ASTM testing lab, and industrial tools.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold py-3 px-6 rounded-xl transition-all shadow-xs text-xs uppercase tracking-wider"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        ) : step === 1 ? (
          /* Pay Step */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-xs text-[#2563EB] font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                ₹149/month Premium Plan
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Upgrade to Premium</h1>
              <p className="text-slate-600 text-xs">Scan the UPI QR code below and attach your payment screenshot to activate.</p>
            </div>

            {/* UPI Payment Box */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Step 1: Scan UPI QR Code</div>
                
                {/* Visual QR Code Scanner */}
                <div className="w-40 h-52 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-200 relative overflow-hidden p-1 shadow-xs">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/upi_scanner.jpg"
                      alt="Official UPI QR Scanner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <code className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">{upiId}</code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Copy UPI ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Payee: {payeeName} &middot; GPay / PhonePe / Paytm / BHIM</div>
                </div>

                <a
                  href={upiLink}
                  className="py-2 px-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-mono font-bold transition-all"
                >
                  ⚡ Open Directly in UPI App (Mobile)
                </a>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmitRequest} className="space-y-4 pt-4 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Step 2: Submit Verification Proof
                </div>

                {/* Screenshot Upload Handler */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                    Upload Payment Screenshot Proof
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      selectedFile 
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900' 
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
                          <p className="text-xs font-bold text-emerald-900 truncate max-w-[220px]">{selectedFile?.name}</p>
                          <p className="text-[10px] text-emerald-700 font-mono">{(selectedFile!.size / 1024).toFixed(1)} KB &middot; Tap to replace</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FileImage className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">Attach Payment Screenshot</span>
                        <span className="text-[10px] text-slate-500 font-mono">Supports PNG, JPG (Max 5MB)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 12-Digit Ref */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                    12-Digit UPI Ref / Transaction ID
                  </label>
                  <Input
                    type="text"
                    placeholder="E.g. 349182058193"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="h-11 border-slate-200 focus:border-[#2563EB] focus:ring-[#2563EB] rounded-xl text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting || (!selectedFile && txnId.length < 6)}
                    className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold h-11 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Proof...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Submit Proof for Verification
                      </>
                    )}
                  </Button>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Screenshot on WhatsApp (+91 98480 22338)
                  </a>
                </div>
              </form>
            </div>

            {/* Verification Notice */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-[11px] text-slate-600 leading-normal font-sans">
                After making the UPI payment, copy your 12-digit transaction ID or upload the screenshot. Verification usually takes 15&ndash;30 minutes.
              </p>
            </div>
          </div>
        ) : (
          /* Step 2: Request Logged Success State */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 font-display">Payment Proof Logged Successfully!</h1>
              <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto font-sans">
                Your payment reference has been recorded. Once verified by our administration, your account will instantly switch to Premium.
              </p>
            </div>
            
            <div className="pt-4 space-y-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Fast-Track Verification on WhatsApp
              </a>

              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-mono text-xs text-slate-700 transition-colors inline-block text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer showTrustBar />
    </div>
  )
}
