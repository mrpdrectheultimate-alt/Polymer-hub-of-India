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
            <span className="text-blue-600 font-mono text-base">04.</span> Subscriptions, Payments &amp; Cancellation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All core curriculum lessons remain permanently free. Premium subscriptions (₹149/mo or ₹1,429/yr) unlock unlimited AI tutoring, downloadable offline PDF study packs, and verified completion certificates.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4" /> 7-Day Money-Back Guarantee &amp; Cancellation Policy
            </p>
            <p className="text-emerald-900 leading-relaxed">
              If you are unsatisfied with your Premium subscription for any reason within 7 days of initial purchase, contact support@polymerhubofindia.com for a full, no-questions-asked refund processed via Razorpay. For detailed claim steps, bank turnaround times, and cancellation rules, review our dedicated policy:
            </p>
            <Link
              href="/refund"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-800 underline hover:text-emerald-950 font-mono text-xs pt-1"
            >
              View Complete Cancellation, Refund &amp; Digital Fulfillment Policy &rarr;
            </Link>
          </div>
        </section>

        {/* Section 5: Academic & Examination Disclaimers (GATE XE-F) */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">05.</span> Examination Non-Affiliation Disclaimer (GATE XE-F)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PolymerHub of India provides practice mock exams, question sets, and syllabus guidance for competitive examinations including <strong>GATE XE-F (Polymer Science and Engineering)</strong>.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1.5">
            <p className="font-bold text-slate-900">Nominative Fair Use Notice:</p>
            <p className="text-slate-600 leading-relaxed">
              The Graduate Aptitude Test in Engineering (GATE) is an official national examination conducted jointly by the Indian Institute of Science (IISc Bangalore) and seven Indian Institutes of Technology (IIT Bombay, IIT Delhi, IIT Guwahati, IIT Kanpur, IIT Kharagpur, IIT Madras, IIT Roorkee) on behalf of the National Coordination Board (NCB)-GATE, Department of Higher Education, Ministry of Education, Government of India.
            </p>
            <p className="text-slate-600 leading-relaxed">
              PolymerHub of India is an independent academic resource. It is <strong>NOT affiliated with, authorized by, sponsored by, or endorsed by IITs, IISc, or the Ministry of Education</strong>. The acronym &quot;GATE&quot; and related subject codes are referenced strictly nominatively under Section 30 of the Trade Marks Act 1999 to identify relevant curriculum study material.
            </p>
          </div>
        </section>

        {/* Section 6: AI Tutor & Engineering Calculations Safe Harbor */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">06.</span> Engineering Solvers &amp; AI Safety Safe Harbor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Calculations generated by our engineering solvers (tonnage, cooling time, shrinkage, rheology) and AI Tutor responses are intended strictly for educational study, academic revision, and preliminary technical estimation:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span><strong>No Industrial Warranty:</strong> PolymerHub disclaims all liability for real-world tooling damages, part shrinkage failures, machine mechanical errors, or commercial manufacturing defects resulting from reliance on theoretical calculator outputs.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span><strong>Critical Applications:</strong> In safety-critical sectors (aerospace, medical polymers, automotive structural components), formulas must be validated by certified laboratory testing under ASTM/ISO standards and licensed professional engineering personnel.</span>
            </li>
          </ul>
        </section>

        {/* Section 7: Legal Jurisdiction & Statutory Grievance Redressal */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl space-y-4">
          <h3 className="font-display text-xl font-bold text-amber-400">Jurisdiction &amp; Statutory Grievance Redressal</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            These Terms are governed by the laws of India, including the Indian Copyright Act 1957 (Sec 52 Fair Dealing), Information Technology Act 2000 (Sec 79 Intermediary Protection), and DPDP Act 2023. Any dispute shall be subject to the exclusive jurisdiction of the competent courts of India.
          </p>
          
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 space-y-1">
            <p className="text-amber-400 font-bold uppercase text-[10px]">Statutory Grievance Officer (IT Rules 2021):</p>
            <p><strong>Officer Name:</strong> Mr. L.P.K. Naidu (Director &amp; Designated Compliance Officer)</p>
            <p><strong>Nodal Office:</strong> Technology Hub, Visakhapatnam, Andhra Pradesh – 530003, India</p>
            <p><strong>Grievance Email:</strong> <a href="mailto:grievance@polymerhubofindia.com" className="text-blue-400 hover:underline">grievance@polymerhubofindia.com</a></p>
            <p><strong>Response Timelines:</strong> Acknowledgment within 24 hours &middot; Final resolution within 15 working days.</p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <Link href="/refund" className="text-emerald-400 font-bold hover:underline">
              Cancellation &amp; Refund Policy &rarr;
            </Link>
            <span>&bull;</span>
            <Link href="/legal" className="text-amber-400 font-bold hover:underline">
              Legal &amp; Provenance Charter &rarr;
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="text-blue-400 hover:underline">
              View Privacy Policy &rarr;
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
