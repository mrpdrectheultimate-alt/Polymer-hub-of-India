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
  FileImage,
  ZoomIn,
  Maximize2,
  X,
  Zap,
  Cpu,
  Database,
  FileText,
  Calculator,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  CreditCard,
  QrCode,
  ArrowRight,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Footer from '@/components/Footer'
import RazorpayCheckout from '@/components/RazorpayCheckout'

const PREMIUM_BENEFITS = [
  {
    icon: Cpu,
    title: 'Unlimited AI Tutor Queries',
    desc: 'No daily limits. Instant answers grounded in CIPET & B.Tech PPE curricula.'
  },
  {
    icon: Database,
    title: '1,000+ Polymer TDS & Chemical Charts',
    desc: 'Full access to mechanical, thermal, electrical data and resistance tables.'
  },
  {
    icon: FileText,
    title: 'LaTeX PDF Lesson Downloads',
    desc: 'Download printable offline study guides for all 216 syllabus lessons.'
  },
  {
    icon: Calculator,
    title: '8 Industrial Calculators',
    desc: 'Clamping force, cooling time, shrinkage allowance, and runner pressure drop.'
  },
  {
    icon: FlaskConical,
    title: 'ASTM Virtual Testing Lab',
    desc: 'Simulate Tensile, HDT/Vicat, DSC, MFI, and Izod impact experiments.'
  },
  {
    icon: Zap,
    title: 'GATE XE5 Mock Simulator',
    desc: 'Timed computer-based test platform with negative marking & rankings.'
  }
]

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ subscription_status?: string; subscription_end_date?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [showManualUpi, setShowManualUpi] = useState(false)
  const [isQrExpanded, setIsQrExpanded] = useState(false)
  
  // Manual UPI form states
  const [submitting, setSubmitting] = useState(false)
  const [txnId, setTxnId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [manualSubmitted, setManualSubmitted] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const isAnnual = billingPeriod === 'annual'
  const currentPrice = isAnnual ? 1429 : 149
  const planLabel = isAnnual ? 'Premium Annual' : 'Premium Monthly'

  const upiId = '8125358468@fam'
  const payeeName = 'Chengala Lakshmi Prasanna Kumar Naidu'
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${currentPrice}&cu=INR&tn=${encodeURIComponent(`PolymerHub ${planLabel}`)}`
  const whatsappNumber = '918125358468'

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/upgrade')
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

  const handleSubmitManualRequest = async (e: React.FormEvent) => {
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
        amount: currentPrice,
        screenshot_url: screenshotUrl,
        status: 'pending',
        metadata: {
          utr: txnId,
          user_email: user.email,
          plan: isAnnual ? 'premium_annual' : 'premium_monthly',
          submitted_at: new Date().toISOString()
        }
      })

      setManualSubmitted(true)
      toast({
        title: 'Payment Proof Submitted!',
        description: 'Your request is queued for manual verification.',
      })
    } catch {
      setManualSubmitted(true)
      toast({
        title: 'Payment Proof Received',
        description: 'Thank you. Our team will verify your receipt.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hello PolymerHub Team, I have completed UPI payment for PolymerHub ${planLabel} (₹${currentPrice}).\n\nUTR Number: ${txnId || 'Attached'}\nEmail: ${user?.email || 'Registered User'}\n\nPlease verify and activate my Premium access.`
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Banner / Hero */}
      <div className="bg-[#0B172A] text-white pt-12 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" />
            Official PolymerHub Membership
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Unlock Full Polymer Engineering Power
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Instant 1-click Razorpay activation with UPI, RuPay, Visa, Mastercard, and Net Banking.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 pb-16 w-full relative z-20">
        {isPremium ? (
          /* Already Premium State */
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-emerald-300">
              <Crown className="w-8 h-8 text-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
                ✓ Active Membership
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                You are a Verified Premium Member!
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                You have full, unrestricted access to the complete polymer engineering platform, 1,000+ TDS sheets, and unlimited AI Copilot queries.
              </p>
              {profile?.subscription_end_date && (
                <div className="text-xs font-mono text-slate-500 pt-1">
                  Valid until: <span className="font-bold text-slate-800">{new Date(profile.subscription_end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold py-3 px-6 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/simulations"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                ASTM Testing Lab
              </Link>
              <Link
                href="/ai-tutor"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                AI Copilot
              </Link>
            </div>
          </div>
        ) : (
          /* Free Tier: Upgrade Card */
          <div className="space-y-8">
            
            {/* Plan Card */}
            <div className="bg-white border-2 border-[#2563EB] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
              
              {/* Billing Toggle Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                      Premium Plan
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                      ⭐ Recommended
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
                    Polymer Engineer Pro
                  </h2>
                </div>

                {/* Switcher */}
                <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      billingPeriod === 'monthly'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly (₹149)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('annual')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      billingPeriod === 'annual'
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Annual (₹1,429)
                    <span className="px-1.5 py-0.2 rounded-full bg-[#F5C518] text-[#0A1628] text-[9px] font-mono font-black">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                      ₹{currentPrice}
                    </span>
                    <span className="text-xs font-mono text-slate-500 uppercase">
                      {isAnnual ? '/ year (save ₹359)' : '/ month'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 font-mono font-semibold mt-1">
                    {isAnnual ? '✓ Equivalent to only ₹119 / month' : '✓ Less than ₹5 / day &middot; Cancel anytime'}
                  </p>
                </div>

                {/* Razorpay 1-Click Button */}
                <div className="w-full sm:w-auto sm:min-w-[260px]">
                  <RazorpayCheckout
                    buttonText={isAnnual ? 'Pay ₹1,429 with Razorpay' : 'Pay ₹149 with Razorpay'}
                    buttonClass="w-full py-4 px-6 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    planName={planLabel}
                    amount={currentPrice}
                    isAnnual={isAnnual}
                    onSuccess={() => {
                      toast({
                        title: 'Success!',
                        description: 'Your account has been upgraded to Premium.',
                      })
                      router.push('/payment/success')
                    }}
                  />
                  <div className="mt-2 text-center text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Instant Razorpay activation &middot; 256-Bit SSL
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Everything Included in Your Membership
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PREMIUM_BENEFITS.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Payment Methods Supported */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Accepted: UPI, Cards (RuPay / Visa / Master), Netbanking</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Instant receipt sent to {user?.email}
                </div>
              </div>
            </div>

            {/* Collapsible Manual UPI Fallback Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <button
                type="button"
                onClick={() => setShowManualUpi(!showManualUpi)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Prefer Direct UPI QR Code Transfer?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Scan directly with Google Pay, PhonePe, Paytm, or BHIM and verify manually.
                    </p>
                  </div>
                </div>
                <div className="text-slate-400 p-2">
                  {showManualUpi ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {showManualUpi && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
                  {manualSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h4 className="text-base font-bold text-emerald-950 font-display">
                        Payment Proof Logged Successfully!
                      </h4>
                      <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                        Your transaction reference has been recorded. Our team will verify it and activate your Premium access within 15–30 minutes.
                      </p>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Fast-Track on WhatsApp (+91 98480 22338)
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Scan Official UPI QR Code (₹{currentPrice})
                        </div>
                        
                        {/* QR Code Scanner */}
                        <div 
                          onClick={() => setIsQrExpanded(true)}
                          className="w-40 h-48 bg-white rounded-2xl flex flex-col items-center justify-center border-2 border-slate-200 hover:border-amber-400 relative overflow-hidden p-2 shadow-sm cursor-pointer group transition-all"
                          title="Click to enlarge QR Code"
                        >
                          <div className="relative w-full h-38 rounded-xl overflow-hidden flex items-center justify-center bg-amber-50/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/upi_qr_clean.png"
                              alt="Official UPI QR Scanner"
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 rounded-xl">
                              <Maximize2 className="w-5 h-5 text-amber-400 animate-pulse" />
                              <span className="text-[10px] font-mono font-bold text-amber-300">Tap to Expand</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-1 group-hover:text-amber-600 font-semibold">
                            <ZoomIn className="w-3 h-3" /> Tap to enlarge
                          </span>
                        </div>

                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-1.5">
                            <code className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {upiId}
                            </code>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Copy UPI ID"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Payee: {payeeName} &middot; GPay / PhonePe / Paytm / BHIM
                          </div>
                        </div>

                        <a
                          href={upiLink}
                          className="py-2 px-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-mono font-bold transition-all"
                        >
                          ⚡ Open Directly in UPI App (Mobile)
                        </a>
                      </div>

                      {/* Verification Form */}
                      <form onSubmit={handleSubmitManualRequest} className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Submit Verification Details
                        </div>

                        {/* Screenshot Upload */}
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
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold h-11 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting Details...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Submit Manual Verification Proof
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
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Fullscreen Expanded QR Lightbox */}
      {isQrExpanded && (
        <div 
          onClick={() => setIsQrExpanded(false)}
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200 relative"
          >
            <button
              onClick={() => setIsQrExpanded(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Close expanded QR"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official UPI Scanner
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">Scan with Any UPI App</h3>
              <p className="text-xs text-slate-500 font-sans">GPay, PhonePe, Paytm, BHIM or FamApp</p>
            </div>

            <div className="w-64 h-76 mx-auto bg-amber-50/50 rounded-2xl p-3 border-2 border-amber-300 shadow-md flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/upi_qr_clean.png"
                alt="Official UPI QR Code Expanded"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                <code className="text-xs font-mono font-bold text-blue-700">{upiId}</code>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-mono font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Tap outside or press ✕ to close</p>
            </div>
          </div>
        </div>
      )}

      <Footer showTrustBar />
    </div>
  )
}
