// src/app/legal/page.tsx — Enterprise Legal, Copyright & Academic Provenance Charter
import Link from 'next/link'
import { Scale, ShieldCheck, CheckCircle2, ArrowLeft, AlertTriangle, BookOpen, Mail, Share2, Database, Calculator, GraduationCap, Users, Cpu } from 'lucide-react'

export const metadata = {
  title: 'Legal, Copyright & Academic Provenance Charter | PolymerHub',
  description: 'Statutory compliance, educational fair use under Indian Copyright Act 1957 Section 52, IT Act Section 79 Intermediary Safe Harbor, WhatsApp integration policy, and materials database provenance.',
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
            Governed under the Indian Copyright Act 1957 (Sec 52), IT Act 2000 (Sec 79), Trade Marks Act 1999 (Sec 30), and International IP Standards.
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
            PolymerHub of India (&quot;PolymerHub&quot;) is engineered as a non-commercial educational index, simulation engine, and academic aggregator designed to support B.Tech and Diploma students, researchers, and faculty across India. Every feature, database, WhatsApp share action, calculation algorithm, and college fee reference is cataloged in full compliance with statutory intellectual property laws.
          </p>
        </div>

        {/* Section 1: Educational Fair Dealing */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-blue-600 font-mono text-base">01.</span> Educational Fair Dealing (Sec 52(1)(i) Copyright Act 1957)
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

        {/* Section 2: WhatsApp Integration & Messaging Compliance */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            <span className="text-blue-600 font-mono text-base">02.</span> WhatsApp Integration &amp; Messaging Policy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PolymerHub provides direct <strong>WhatsApp Share</strong> buttons and student study group links. All messaging capabilities comply strictly with official platform policies:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>User-Initiated Deep Linking:</strong> Sharing is executed strictly via standard URI protocols (`wa.me` / `api.whatsapp.com`) triggered manually by the user.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Zero Automated Spam:</strong> PolymerHub does NOT deploy unauthorized scraping bots or send unsolicited commercial messaging (UCC) in accordance with TRAI and Meta Developer API Guidelines.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Voluntary Study Groups:</strong> Community links connect students to voluntary educational discussion channels moderated for academic decorum.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Materials Database, ASTM/ISO Properties & Nominative Trade Name Fair Use */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-mono text-base">03.</span> Materials Database &amp; Nominative Trade Name Rights
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our Materials Database &amp; Property Comparator catalogs physical properties for 35+ commercial polymers alongside Indian trade designations (e.g. Repol&reg;, Relene&reg;, Induran&reg;):
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
            <p className="font-bold text-slate-900">Statutory Legal Protections:</p>
            <p className="text-slate-600 leading-relaxed">
              &bull; <strong>Uncopyrightable Physical Constants:</strong> Material density, glass transition temperature ($T_g$), tensile strength, and Melt Flow Index (MFI) values are fundamental scientific facts and physical constants, which cannot be copyrighted under global intellectual property law.
            </p>
            <p className="text-slate-600 leading-relaxed">
              &bull; <strong>Nominative Fair Use (Sec 30(1) Trade Marks Act 1999):</strong> Reference to commercial trade names is made exclusively for non-commercial educational identification, material comparison, and engineering selection. PolymerHub claims no ownership or commercial affiliation with trademark owners.
            </p>
          </div>
        </section>

        {/* Section 4: Engineering Calculators, Troubleshooting & 3D Virtual Labs */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600" />
            <span className="text-blue-600 font-mono text-base">04.</span> Calculators, Rosato Troubleshooter &amp; 3D Virtual Labs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All engineering solvers (clamping tonnage $F = P \cdot A$, cooling time $t_c$, shrinkage estimators), defect troubleshooting matrices (Rosato methodology), and 3D laboratory visualizers operate under explicit legal software rights:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span><strong>Public Domain Mathematics:</strong> Engineering formulas derived from fluid mechanics, heat transfer, and rheology are public domain mathematical algorithms taught in standard university curricula.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span><strong>Original Parametric Code:</strong> 3D interactive WebGL/Canvas visualizers and calculator codebases are custom software works independently authored and owned by PolymerHub.</span>
            </li>
          </ul>
        </section>

        {/* Section 5: Education Hub (Colleges, Scholarships & Fees Data) */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <span className="text-blue-600 font-mono text-base">05.</span> Education Hub, College Data, Fees &amp; Scholarships
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our Education Hub catalogs 84 degree/diploma programs across institutions (CIPET, ICT Mumbai, IIT Delhi, Anna University) alongside 17 verified government and private scholarship opportunities:
          </p>
          <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl text-xs sm:text-sm text-purple-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-purple-900">
              <BookOpen className="w-4 h-4" /> Transparency &amp; Public Records Exemption
            </p>
            <p className="text-purple-950 leading-relaxed">
              Institutional fee structures, NIRF rankings, AICTE approvals, and scholarship criteria (e.g. AICTE Pragati, Post-Matric, PMSS) are public domain government disclosures under the Right to Information Act (RTI) and official university prospectuses. PolymerHub compiles this data strictly for non-commercial student career transparency and academic guidance.
            </p>
          </div>
        </section>

        {/* Section 6: User-Generated Content & Student Forums */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-blue-600 font-mono text-base">06.</span> User-Generated Content &amp; Intermediary Protection (Sec 79 IT Act)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Student forum posts, study group notes, project submissions, and company challenge solutions are user-generated content (UGC) governed under <strong>Section 79 of the Information Technology Act, 2000</strong>:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>User Copyright Retention:</strong> Students retain full ownership of their original project uploads while granting PolymerHub a non-exclusive license to display them for educational peer review.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Strict Moderation:</strong> Plagiarism, commercial advertising, or illegal content is prohibited and subject to immediate removal under our 48-hour takedown protocol.</span>
            </li>
          </ul>
        </section>

        {/* Section 7: Notice & Expedited Takedown Protocol */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> Formal Notice &amp; Takedown Protocol (48-Hour Guarantee)
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            Copyright Grievance &amp; DMCA Agent
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            PolymerHub respects intellectual property rights. If you are a copyright owner, publisher, or authorized institutional representative and believe that any content on our platform infringes your rights, please submit a formal notice to our designated compliance officer.
          </p>
          
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-300 space-y-2 font-mono">
            <p className="text-white font-bold">Required Notice Information:</p>
            <p>1. Identification of the copyrighted work or trademark claimed to be infringed.</p>
            <p>2. Exact URL or URL location on PolymerHub.</p>
            <p>3. Proof of ownership or institutional authorization.</p>
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
