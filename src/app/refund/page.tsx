// src/app/refund/page.tsx — Enterprise Cancellation, Refund & Digital Delivery Policy
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, RefreshCw, Clock, CheckCircle2, AlertCircle, CreditCard, Mail, Sparkles, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Cancellation, Refund & Digital Delivery Policy | PolymerHub',
  description: 'Official Cancellation, Refund, and Digital Fulfillment Policy for PolymerHub subscriptions under the Consumer Protection (E-Commerce) Rules, 2020 and RBI Payment Aggregator Guidelines.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#0A1628] text-white py-16 px-4 sm:px-6 border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Consumer Protection &middot; 7-Day Guarantee
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Cancellation, Refund &amp; Digital Fulfillment Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light">
            Effective Date: August 2026 &middot; Compliant with the Consumer Protection (E-Commerce) Rules, 2020 and RBI Guidelines for Payment Aggregators (Razorpay).
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-10">
        
        {/* Quick Highlights Summary Card */}
        <div className="bg-emerald-50 border-2 border-emerald-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Student &amp; Professional Satisfaction Promise
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-emerald-950">
            100% Risk-Free 7-Day Money-Back Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-normal">
            At PolymerHub of India, we are committed to providing the highest quality engineering education. If you subscribe to our Premium Monthly (₹149) or Premium Annual (₹1,429) plan and feel the platform does not meet your academic or professional expectations, you are entitled to a full, no-questions-asked refund within <strong>7 calendar days</strong> from the transaction date.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-0.5">Eligibility Window:</span>
              <span className="text-emerald-800">Within 7 days of initial payment</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-0.5">Turnaround Time:</span>
              <span className="text-emerald-800">Initiated in 24–48 hours</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-0.5">Refund Method:</span>
              <span className="text-emerald-800">Original payment source</span>
            </div>
          </div>
        </div>

        {/* Section 1: Digital Delivery Policy (Shipping Exemption) */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">01.</span> Digital Delivery &amp; Shipping Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PolymerHub of India operates exclusively as an online educational technology and digital knowledge platform.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Instant Digital Provisioning:</strong> There are NO physical shipments or courier deliveries. Upon successful payment verification via our RBI-authorized gateway (Razorpay), your account is upgraded instantaneously via automated server webhooks.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Accessible Features:</strong> Instant access to unlimited AI Polymer Copilot queries, downloadable offline PDF study packs, interactive simulator calculators, and verified completion certificates.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Delivery Confirmation:</strong> A digital transaction invoice and confirmation receipt are transmitted immediately to your registered account email.</span>
            </li>
          </ul>
        </section>

        {/* Section 2: Cancellation Policy */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">02.</span> Subscription Cancellation Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You maintain full autonomy over your subscription and can cancel recurring renewals at any time:
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Cancel Anytime from Profile:</strong>
                <p className="text-slate-600 mt-0.5">
                  Navigate to your <Link href="/profile" className="text-blue-600 underline font-semibold">Profile Settings</Link> or contact our billing desk to cancel recurring renewal.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Access Retention Through Billing Period:</strong>
                <p className="text-slate-600 mt-0.5">
                  When you cancel, your premium privileges remain completely active until the end of your prepaid billing period (end of the monthly or annual cycle). You will never be billed again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Refund Claims & Settlement Timelines */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">03.</span> Refund Claim Process &amp; Settlement Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To request a refund within the 7-day guarantee window, follow these straightforward steps:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Submit Refund Request:</strong>
                <span className="text-slate-600">
                  Email <a href="mailto:support@polymerhubofindia.com" className="text-blue-600 font-semibold underline">support@polymerhubofindia.com</a> or use the In-App Support Desk in the footer. Mention your registered account email and Razorpay Order ID (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">order_...</code> or <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">pay_...</code>).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Review &amp; Gateway Approval (24–48 Hours):</strong>
                <span className="text-slate-600">
                  Our billing team validates the transaction timestamp and issues the refund directly via the Razorpay payment gateway dashboard within 24 to 48 business hours.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Banking Settlement (5–7 Business Days):</strong>
                <span className="text-slate-600">
                  In accordance with standard Indian banking settlement cycles (UPI, IMPS, NEFT, RuPay, Visa, Mastercard), funds will reflect in your bank account or payment card within <strong>5 to 7 business days</strong> from the date of issuance.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Exclusions & Fair Use */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">04.</span> Exclusions &amp; Anti-Abuse Safeguards
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To prevent fraud, automated abuse, and intellectual property scraping:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span><strong>Excessive Bulk Downloads:</strong> Accounts that systematically scrape or bulk-download all 216 curriculum lesson PDFs or proprietary simulator assets before filing a claim may be subject to review.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span><strong>B2B Institutional Seat Licenses:</strong> Enterprise college campus licenses negotiated via bespoke institutional contracts with Department Heads (HODs) are governed by individual master service agreements (MSAs).</span>
            </li>
          </ul>
        </section>

        {/* Section 5: Billing Desk & Grievance Contact */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl space-y-4">
          <h3 className="font-display text-xl font-bold text-amber-400">
            Billing Support &amp; Grievance Redressal
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            If you have questions regarding an existing transaction, need assistance with invoice generation, or wish to follow up on a pending refund:
          </p>
          <div className="pt-2 text-xs font-mono text-slate-300 space-y-1.5 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <p><strong>Platform:</strong> Polymer Hub of India (NextGen India)</p>
            <p><strong>Billing Support Email:</strong> <a href="mailto:support@polymerhubofindia.com" className="text-blue-400 hover:underline">support@polymerhubofindia.com</a></p>
            <p><strong>Escalation / Grievance Officer:</strong> <a href="mailto:grievance@polymerhubofindia.com" className="text-amber-400 hover:underline">grievance@polymerhubofindia.com</a></p>
            <p><strong>Nodal Office:</strong> Technology Hub, Visakhapatnam, Andhra Pradesh – 530003, India</p>
            <p><strong>Support Desk Hours:</strong> 09:30 AM to 06:30 PM IST (Monday to Friday)</p>
          </div>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <Link href="/terms" className="text-blue-400 hover:underline">
              Terms of Service &rarr;
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy &rarr;
            </Link>
            <span>&bull;</span>
            <Link href="/legal" className="text-amber-400 hover:underline">
              Legal &amp; Provenance Charter &rarr;
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
