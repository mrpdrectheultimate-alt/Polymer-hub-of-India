// src/app/privacy/page.tsx — Enterprise Privacy Policy & Data Protection Charter
import Link from 'next/link'
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy & Data Security Charter | PolymerHub',
  description: 'Enterprise privacy and data security policies of PolymerHub, compliant with India DPDP Act 2023 and GDPR standards.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#0A1628] text-white py-16 px-4 sm:px-6 border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> DPDP Act 2023 &middot; ISO 27001 Aligned
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Privacy Policy &amp; Data Security Charter
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light">
            Last Updated: August 2026 &middot; Version 2.4 &middot; Governed under the laws of the Republic of India.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-12">
        
        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base mb-1">Encrypted by Design</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All student data is encrypted at rest (AES-256) and in transit (TLS 1.3).
            </p>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base mb-1">Zero Third-Party Ads</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We never sell your contact info or search history to advertiser data brokers.
            </p>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base mb-1">Student Data Ownership</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Export your certificates, quiz notes, and portfolio anytime with one click.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">01.</span> Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We collect the minimum amount of personal data necessary to deliver your polymer engineering curriculum, verify certificates, and provide AI Tutor services:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Account Credentials:</strong> Email address, name, college affiliation (e.g. CIPET, IIT, ICT Mumbai), and graduation year.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Learning Analytics:</strong> Lesson completion timestamps, quiz scores, formula bookmarking, and simulator parameters.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Billing Data:</strong> Transaction tokens processed via RBI-authorized payment gateways (Razorpay). PolymerHub does not store credit/debit card numbers on its servers.</span>
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">02.</span> How We Use and Protect Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Data collected is used exclusively for providing educational content, calculating GATE rank readiness, and rendering AI explanations grounded in actual course lessons.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2">
            <p className="font-bold text-slate-800">Security Safeguards Implemented:</p>
            <p className="text-slate-600">&bull; Row-Level Security (RLS) policies on all database tables enforcing strict user-boundary isolation.</p>
            <p className="text-slate-600">&bull; Automated rate limiting on AI Tutor endpoints to prevent abusive querying.</p>
            <p className="text-slate-600">&bull; Strict Transport Security (HSTS) with mandatory TLS 1.3 cryptographic transport.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">03.</span> Student Rights &amp; Data Erasure (DPDP Compliance)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Under India&apos;s Digital Personal Data Protection Act (DPDP Act 2023), you hold complete rights over your educational records:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span><strong>Right to Correction:</strong> Edit or update your college affiliation, profile name, and portfolio projects at any time from your profile dashboard.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span><strong>Right to Erasure:</strong> Request permanent deletion of your account and personal identifiers by contacting our data protection officer.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span><strong>Right to Data Portability:</strong> Request an export of your learning trajectory and course certificates in machine-readable JSON format.</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl space-y-3">
          <h3 className="font-display text-xl font-bold text-amber-400">Data Protection Officer &amp; Grievance Redressal</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            In compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules and DPDP 2023:
          </p>
          <div className="pt-2 text-xs font-mono text-slate-300 space-y-1">
            <p><strong>Platform:</strong> Polymer Hub of India</p>
            <p><strong>Grievance Email:</strong> <a href="mailto:privacy@polymerhub.in" className="text-blue-400 hover:underline">privacy@polymerhub.in</a></p>
            <p><strong>Response Timeline:</strong> Within 48 business hours.</p>
          </div>
        </section>

      </div>
    </div>
  )
}
