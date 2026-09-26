// src/app/legal/page.tsx — Enterprise Legal, Copyright & Academic Provenance Charter
import Link from 'next/link'
import { Scale, ShieldCheck, FileText, CheckCircle2, ArrowLeft, AlertTriangle, BookOpen, ExternalLink, Mail } from 'lucide-react'

export const metadata = {
  title: 'Legal, Copyright & Academic Provenance Charter | PolymerHub',
  description: 'Statutory compliance, educational fair use under Indian Copyright Act 1957 Section 52, IT Act Section 79 Intermediary Safe Harbor, and content provenance framework.',
}

export default function LegalProvenancePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#0A1628] text-white py-16 px-4 sm:px-6 border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-amber-400" /> Statutory Legal &amp; Content Provenance Charter
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Legal Framework &amp; Academic Provenance Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light">
            Governed under the Indian Copyright Act 1957 (Sec 52), IT Act 2000 (Sec 79), and International IP Standards.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-10">
        
        {/* Guiding Guarantee Box */}
        <div className="bg-emerald-50 border-2 border-emerald-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> 100% Legal &amp; Ethical Guarantee
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-emerald-950">
            Airtight Compliance &amp; Institutional Trust
          </h3>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-normal">
            PolymerHub of India (&quot;PolymerHub&quot;) is engineered as a non-commercial educational index, simulation engine, and academic aggregator designed to support B.Tech and Diploma students, researchers, and faculty across India. Every data point, citation, patent summary, news headline, and book reference is cataloged in full compliance with statutory intellectual property laws.
          </p>
        </div>

        {/* Section 1: Educational Fair Dealing (Indian Copyright Act 1957) */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">01.</span> Educational Fair Dealing (Sec 52(1)(i) Copyright Act)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Under <strong>Section 52(1)(i) of the Indian Copyright Act, 1957</strong>, the reproduction of any work by a teacher or a student in the course of instruction, scientific study, or research does not constitute copyright infringement.
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-900">How PolymerHub Enforces Fair Dealing:</p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>No Pirated Full-Text Hosting:</strong> PolymerHub does NOT host or distribute unauthorized PDF downloads of copyrighted textbooks or paid journal articles.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Bibliographic References:</strong> Our Digital Library cites public metadata (Title, Author, Publisher, Year, ISBN) and embeds official publisher purchase links (Wiley, Hanser, Elsevier, Springer, Oxford).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Original Curriculum Summaries:</strong> Course lessons and formula derivations are independently authored by engineering educators for instructional clarity.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Intermediary Safe Harbor & Aggregation Policy */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">02.</span> Intermediary Safe Harbor (Sec 79 IT Act 2000)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PolymerHub operates as an educational intermediary under <strong>Section 79 of the Information Technology Act, 2000</strong> (and the Information Technology Intermediary Guidelines Rules).
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span><strong>Industry News &amp; Events:</strong> News feeds (PlastIndia, DIEMEX 2026, SPE events) summarize public press announcements with direct link attribution to original event organizers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span><strong>Video Lecture Embeds:</strong> Video content is rendered using official standard YouTube iFrame embeds in accordance with YouTube Terms of Service, leaving all view counts and channel credits with the original creators.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Public Patent & Research Data Standards */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">03.</span> Public Patent &amp; Open Research Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Patent documents published by the Indian Patent Office (IPO), World Intellectual Property Organization (WIPO), and USPTO are statutory public domain records.
          </p>
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl text-xs sm:text-sm text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <BookOpen className="w-4 h-4" /> Patent Summaries &amp; Research Indexing
            </p>
            <p className="text-amber-900 leading-relaxed">
              Patent summaries displayed on PolymerHub cite official patent numbers, filing dates, inventors, and assignees for academic discovery. OpenAccess research papers cite OpenAlex / Europe PMC DOIs with direct links to primary publishers.
            </p>
          </div>
        </section>

        {/* Section 4: Trademark & Institutional Disclaimer */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">04.</span> Institutional &amp; Trademark Disclaimers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All registered product names, polymer trademarks (e.g. Teflon&reg;, Kevlar&reg;, Delrin&reg;, Lexan&reg;), standards designations (ASTM, ISO, BIS), and institution names (CIPET, IIT, ICT Mumbai, NCL Pune) belong to their respective trademark holders.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Reference to these names, trademarks, or standards is made purely for academic identification, comparative engineering evaluation, and instructional reference, and does not imply affiliation or endorsement.
          </p>
        </section>

        {/* Section 5: Notice & Expedited Takedown Protocol */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> Formal Notice &amp; Takedown Protocol (48-Hour Guarantee)
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            Copyright Grievance &amp; DMCA Agent
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            PolymerHub respects intellectual property rights. If you are a copyright owner, publisher, or authorized representative and believe that any content on our platform infringes your copyright or trademark, please submit a formal notice to our designated compliance officer.
          </p>
          
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-300 space-y-2 font-mono">
            <p className="text-white font-bold">Required Notice Information:</p>
            <p>1. Identification of the copyrighted work claimed to be infringed.</p>
            <p>2. Exact URL or URL location on PolymerHub.</p>
            <p>3. Proof of ownership or authorization.</p>
            <p>4. Contact email and phone number.</p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300">
            <a 
              href="mailto:legal@polymerhub.in?subject=Formal%20Copyright%20Notice" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-all"
            >
              <Mail className="w-4 h-4" /> Contact Designated Legal Officer (legal@polymerhub.in)
            </a>
            <span className="text-emerald-400 font-bold">✓ Guaranteed Action within 48 Business Hours</span>
          </div>
        </section>

      </div>
    </div>
  )
}
