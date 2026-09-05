// src/app/terms/page.tsx — Enterprise Terms of Service & Educational Use Agreement
import Link from 'next/link'
import { ShieldCheck, Scale, CheckCircle2, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service & User Agreement | PolymerHub',
  description: 'Terms of Service, educational licensing, user policies, and legal framework of Polymer Hub of India.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#0A1628] text-white py-16 px-4 sm:px-6 border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" /> Legal &middot; Terms of Service
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Terms of Service &amp; User Agreement
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light">
            Effective Date: August 2026 &middot; Governed under the Information Technology Act, 2000 and the Laws of India.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-10">
        
        {/* Quick Highlights Summary */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-500" /> Summary for Students &amp; Faculty
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            Welcome to Polymer Hub of India (&quot;PolymerHub&quot;)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            By accessing or using our website, AI Tutor, calculation engines, or course materials, you agree to comply with and be bound by the following terms. If you do not agree to these terms, please do not use the platform.
          </p>
        </div>

        {/* Section 1: Educational License & Use */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">01.</span> Educational License &amp; Permitted Use
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PolymerHub grants registered users a non-exclusive, non-transferable, revocable license to access polymer engineering lessons, interactive calculators, reference library materials, and practice exams solely for academic, research, and professional learning purposes.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Allowed:</strong> Studying course modules, saving formula notes, sharing verified project links, and taking practice GATE mock exams.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span><strong>Prohibited:</strong> Scraping or mass-downloading database assets, republishing course notes behind a paywall, or reverse-engineering proprietary CAE simulation algorithms.</span>
            </li>
          </ul>
        </section>

        {/* Section 2: Intellectual Property */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">02.</span> Intellectual Property Rights
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All original course lesson texts, diagrams, simulation calculators, brand assets, and user interface designs are the intellectual property of Polymer Hub of India. Indian and international copyright laws protect this content.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
            <p className="font-bold text-slate-900 mb-1">Third-Party Citations &amp; Standards:</p>
            <p className="text-slate-600 leading-relaxed">
              Industrial formulas, ASTM/ISO standard designations, and Brandrup polymer database references cited within our platform are referenced under academic fair-use for instructional clarity and engineering reference.
            </p>
          </div>
        </section>

        {/* Section 3: AI Tutor Fair Use Policy */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">03.</span> AI Tutor &amp; Interactive Tools Fair Use
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our AI Tutor utilizes retrieval-augmented generation (RAG) to ground answers in verified polymer science literature. Users agree to use the AI Tutor responsibly:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Each free account receives up to 15 AI queries per day to guarantee server availability for all students.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Automated bot querying, script injection, or abuse of the LLM pipeline will result in instant API token throttling or account suspension.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Subscriptions, Payments & Refunds */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">04.</span> Subscriptions, Pricing &amp; Refund Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All core curriculum lessons remain permanently free. Premium subscriptions (₹149/mo or ₹1,429/yr) unlock unlimited AI tutoring, downloadable offline PDF study packs, and verified completion certificates.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4" /> 7-Day Money-Back Guarantee
            </p>
            <p className="text-emerald-900 leading-relaxed">
              If you are unsatisfied with your Premium subscription for any reason within 7 days of initial purchase, contact support@polymerhub.in for a full, no-questions-asked refund processed via Razorpay.
            </p>
          </div>
        </section>

        {/* Section 5: Legal Jurisdiction */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl space-y-3">
          <h3 className="font-display text-xl font-bold text-amber-400">Jurisdiction &amp; Dispute Resolution</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts of India.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <Link href="/privacy" className="text-blue-400 hover:underline">
              View Privacy Policy &rarr;
            </Link>
            <span>&bull;</span>
            <a href="mailto:support@polymerhub.in" className="text-blue-400 hover:underline">
              Contact Legal Support &rarr;
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}
