import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  AlertCircle, 
  Sparkles, 
  Scale, 
  FileText, 
  Download, 
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  Award,
  HelpCircle,
  Check
} from 'lucide-react'
import { GATE_CONFIG } from '@/lib/config/gate-config'
import { 
  GATE_PYQ_ARCHIVE, 
  GATE_XE_SECTIONS_2027, 
  GATE_PSYCHOMETRICS_GUIDE, 
  GATE_LEGAL_COMPLIANCE, 
  GATE_ADMISSIONS_DIRECTORY, 
  GATE_PSU_RECRUITERS 
} from '@/lib/data/gate-knowledge-data'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'GATE Polymer Science & Engineering (XE5 / XE-F) National Knowledge Hub | PolymerHub India',
  description: 'Complete 11-year previous year question papers (2016-2026), official IIT answer keys, syllabus breakdown, formula derivations, scoring psychometrics, and simulated mock exams for GATE Engineering Sciences.',
  openGraph: {
    title: 'GATE XE5 / XE-F Polymer Science & Engineering Preparation Portal',
    description: '11-Year PYQ archive (2016-2026), official answer keys, syllabus mapping, scoring formulas, and simulated mock tests aligned with IIT Madras GATE 2027.',
    url: 'https://polymerhubofindia.com/gate-xe-f',
  },
}

const SYLLABUS_SECTIONS = [
  {
    unit: 'Section 1',
    title: 'Chemistry of High Polymers',
    topics: [
      'Monomers, functionality, and degree of polymerization',
      'Step-growth (condensation) polymerization kinetics & Carothers equation',
      'Chain-growth addition polymerization: Free radical, ionic (cationic, anionic) & coordination (Ziegler-Natta)',
      'Living polymerization and narrow molecular weight distributions',
      'Copolymerization kinetics, Mayo-Lewis equation & reactivity ratios (r1, r2)',
      'Block, graft, random, and alternating copolymer architectures',
      'Polymer degradation: Thermal, photo-oxidative, and chemical stabilization mechanisms'
    ]
  },
  {
    unit: 'Section 2',
    title: 'Polymer Characterization & Morphology',
    topics: [
      'Molecular weight averages (Mn, Mw, Mz, Mv) and Polydispersity Index (PDI)',
      'Measurement techniques: End-group analysis, Osmometry, Light scattering, Viscometry & GPC/SEC',
      'Glass transition temperature (Tg) thermodynamics: Free volume theory, Fox equation & Gordon-Taylor',
      'Crystalline melting transition (Tm) and factors affecting crystallinity',
      'Spherulite morphology, lamellar crystallization & Avrami kinetics',
      'Spectroscopic & thermal analysis: DSC, TGA, DMA, TMA, FTIR, and 1H/13C NMR'
    ]
  },
  {
    unit: 'Section 3',
    title: 'Synthesis, Manufacturing & Properties of Polymers',
    topics: [
      'Commodity Thermoplastics: PE (LDPE, LLDPE, HDPE), PP (homo/random/impact), PVC, PS',
      'Engineering Thermoplastics: Polyamides (PA6, PA66), PET, PBT, Polycarbonate, POM (Polyacetal)',
      'High-Performance Polymers: PEEK, PPS, Polysulfone, Fluoropolymers (PTFE, PVDF)',
      'Thermosetting Resins: Epoxy, Phenol-formaldehyde (Bakelite), Unsaturated polyester, Polyurethanes',
      'Elastomers: Natural rubber (cis-1,4-polyisoprene), SBR, NBR, EPDM, Butyl rubber & Silicone'
    ]
  },
  {
    unit: 'Section 4',
    title: 'Polymer Blends & Advanced Composites',
    topics: [
      'Thermodynamics of polymer mixing: Flory-Huggins lattice theory & Hildebrand solubility parameters',
      'Phase morphology of immiscible blends and compatibilization mechanisms',
      'Reinforcements: Continuous and chopped glass fibers, carbon fibers, aramid (Kevlar)',
      'Composite micromechanics: Voigt (iso-strain) & Reuss (iso-stress) Rule of Mixtures',
      'Halpin-Tsai semi-empirical equations and critical fiber aspect ratio (lc/d)',
      'Manufacturing: Hand lay-up, vacuum bagging, resin transfer moulding (RTM) & pultrusion'
    ]
  },
  {
    unit: 'Section 5',
    title: 'Polymer Rheology & Processing Technology',
    topics: [
      'Non-Newtonian melt rheology: Pseudoplastic shear-thinning & Ostwald-de Waele power-law model',
      'Viscoelasticity: Maxwell and Kelvin-Voigt constitutive models, creep & stress relaxation',
      'Single-screw and twin-screw extrusion: Drag flow, pressure flow, and die characteristic operating curves',
      'Injection moulding: 4-stage cycle, PVT diagram, clamp force calculations & defect diagnostics',
      'Blow moulding (extrusion blow & stretch blow) and Thermoforming fundamentals'
    ]
  },
  {
    unit: 'Section 6',
    title: 'Polymer Testing, Standards & Quality Control',
    topics: [
      'Mechanical testing: Tensile (ASTM D638 / ISO 527), Flexural (ASTM D790), Compressive modulus',
      'Impact resistance: Notched Izod (ASTM D256) and Charpy (ISO 179) fracture toughness',
      'Thermal properties: Heat Deflection Temperature (HDT, ASTM D648) & Vicat softening point',
      'Melt Flow Index (MFI, ASTM D1238) and capillary rheometry',
      'Electrical & optical properties: Dielectric breakdown, surface resistivity, and luminous haze (ASTM D1003)'
    ]
  }
]

export default function GateXeFPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans pb-20">
      
      {/* ─── Top Breadcrumb Header ─── */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <Link
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              11-Year PYQ Archive (2016–2026) Verified
            </span>
            <span className="text-[11px] font-mono text-blue-800 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              GATE {GATE_CONFIG.year} &middot; Paper Code {GATE_CONFIG.paperCode} (formerly {GATE_CONFIG.previousPaperCode})
            </span>
          </div>
        </div>
      </nav>

      {/* ─── Hero Banner ─── */}
      <header className="bg-gradient-to-r from-slate-950 via-[#0A1628] to-slate-900 text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" /> National GATE XE5 / XE-F Knowledge &amp; Examination Engine
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight uppercase">
            GATE Polymer Science &amp; Engineering <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A] pb-2 pt-0.5 leading-[1.15]">
              Master Preparation Hub
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl font-light leading-relaxed">
            Paper F of Engineering Sciences (re-codified as <strong>XE5</strong> for GATE 2027 by {GATE_CONFIG.organizingInstitute}) is the premier gateway for PSU recruitment (IOCL, GAIL, HPCL, DRDO) and M.Tech admissions at premier IITs. PolymerHub unifies 11 years of official papers, question keys, mathematical derivations, and simulated CBT exams.
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/gate-mock"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Launch 60-Minute Mock Test Arena</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#pyq-archive"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Explore 11-Year PYQ Archive</span>
            </a>
            <Link
              href="/formulas"
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>28 GATE Formulas</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Anchor Sub-Navigation ─── */}
      <div className="bg-white border-b border-slate-200 sticky top-12 z-20 shadow-2xs overflow-x-auto whitespace-nowrap">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4 text-xs font-mono font-bold py-2.5 text-slate-600">
          <a href="#quick-facts" className="hover:text-blue-600 transition-colors">Quick Facts</a>
          <span className="text-slate-300">&bull;</span>
          <a href="#pyq-archive" className="hover:text-blue-600 transition-colors text-blue-600 font-black">11-Year PYQs (2016-2026)</a>
          <span className="text-slate-300">&bull;</span>
          <a href="#code-matrix" className="hover:text-blue-600 transition-colors">2027 XE Codes (XE0-XE9)</a>
          <span className="text-slate-300">&bull;</span>
          <a href="#syllabus" className="hover:text-blue-600 transition-colors">Syllabus Breakdown</a>
          <span className="text-slate-300">&bull;</span>
          <a href="#psychometrics" className="hover:text-blue-600 transition-colors">Score Psychometrics</a>
          <span className="text-slate-300">&bull;</span>
          <a href="#admissions-psu" className="hover:text-blue-600 transition-colors">Admissions &amp; PSUs</a>
          <span className="text-slate-300">&bull;</span>
          <a href="#legal-framework" className="hover:text-blue-600 transition-colors">Legal Framework</a>
        </div>
      </div>

      {/* ─── Main Content Container ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        
        {/* ─── 1. Quick Facts Grid ─── */}
        <section id="quick-facts" className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Examination Parameters &middot; {GATE_CONFIG.year} Cycle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Section Weightage</div>
              <div className="text-2xl font-black font-display text-slate-900 mt-1">35 Marks</div>
              <div className="text-xs text-slate-600 mt-1">22 questions (9 of 1 mark, 13 of 2 marks)</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Negative Marking</div>
              <div className="text-2xl font-black font-display text-rose-600 mt-1">-0.33 / -0.66</div>
              <div className="text-xs text-slate-600 mt-1">MCQ only; zero penalty for NAT &amp; MSQ</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Exam Window</div>
              <div className="text-base font-bold font-display text-slate-900 mt-1">{GATE_CONFIG.examDatesFormatted}</div>
              <div className="text-xs text-slate-600 mt-1">Organized by {GATE_CONFIG.organizingInstitute}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Score Validity</div>
              <div className="text-2xl font-black font-display text-emerald-600 mt-1">3 Years</div>
              <div className="text-xs text-slate-600 mt-1">Valid till March 2030 for GATE 2027</div>
            </div>
          </div>
        </section>

        {/* ─── 2. 11-Year PYQ Archive (2016-2026) ─── */}
        <section id="pyq-archive" className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mb-1">
                <Check className="w-3 h-3 text-blue-600" /> Official Repository Ingestion
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 uppercase">
                11-Year Previous Question Papers &amp; Master Keys (2016–2026)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">
              Adheres strictly to Option A Canonical Outbound Links
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-4xl">
            In compliance with Indian intellectual property guidelines, PolymerHub provides direct canonical links to official IIT repositories for authentic PDF downloads, while maintaining 100% original, verified step-by-step mathematical derivations inside our learning engine.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GATE_PYQ_ARCHIVE.map((pyq) => (
              <div
                key={pyq.year}
                className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-xl text-slate-900">
                      GATE {pyq.year}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-300">
                      OI: {pyq.organizingInstitute}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                    <span className="text-slate-500">{pyq.legacySectionCode}</span>
                    <span className="text-slate-300">&rarr;</span>
                    <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {pyq.canonicalSectionCode}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Core Examination Topics Tested:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {pyq.keyFocusAreas.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">&bull;</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono font-bold">
                  <span className="text-slate-500">
                    {pyq.questionsCount} Questions &middot; {pyq.marksTotal} Marks
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={pyq.officialQuestionPaperPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3 h-3 text-slate-600" /> Paper PDF
                    </a>
                    <a
                      href={pyq.officialAnswerKeyPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Answer Key
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 3. Re-Codification Matrix: 2026 vs 2027 XE Sections ─── */}
        <section id="code-matrix" className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 uppercase">
              GATE 2027 Engineering Sciences (XE) Sectional Structure
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              IIT Madras has restructured Section codes from alphabetical (XE-A..XE-I) to numeric (XE0..XE9), integrating Textile Engineering (TF) as XE9.
            </p>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#0A1628] text-white font-mono uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5">2027 Code</th>
                    <th className="p-3.5">Legacy Code</th>
                    <th className="p-3.5">Discipline Name</th>
                    <th className="p-3.5">Marks</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {GATE_XE_SECTIONS_2027.map((sec) => (
                    <tr 
                      key={sec.code2027}
                      className={sec.code2027 === 'XE5' ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50 transition-colors'}
                    >
                      <td className="p-3.5 font-mono font-black text-blue-700">
                        {sec.code2027}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">
                        {sec.legacyCode}
                      </td>
                      <td className="p-3.5 font-display font-bold text-slate-900">
                        {sec.name}
                        {sec.code2027 === 'XE5' && (
                          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 bg-amber-400 text-slate-950 rounded-full font-bold uppercase">
                            PolymerHub Primary
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">
                        {sec.marks} Marks
                      </td>
                      <td className="p-3.5 font-mono">
                        {sec.isCompulsory ? (
                          <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Compulsory
                          </span>
                        ) : (
                          <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Optional (Choose 2)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 text-[11px] leading-relaxed max-w-xs">
                        {sec.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── 4. Detailed 6-Unit Official Syllabus ─── */}
        <section id="syllabus" className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 uppercase">
              Official Syllabus Breakdown (6 Core Units)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every topic is mapped directly to lessons and formulas in PolymerHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SYLLABUS_SECTIONS.map((sec) => (
              <div
                key={sec.unit}
                className="bg-white rounded-2xl border-2 border-slate-900 p-6 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    {sec.unit}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    {sec.title}
                  </h3>
                </div>

                <ul className="space-y-1.5 pt-1 text-xs text-slate-700 font-sans">
                  {sec.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">&bull;</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. Marks, Normalization & Scoring Psychometrics ─── */}
        <section id="psychometrics" className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 uppercase">
              Marks, Cutoffs &amp; Standardized Scoring Psychometrics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Understanding the official mathematical formulations behind raw marks, qualifying thresholds, and the 1000-point GATE score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Qualifying Cutoff Formula */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-3">
              <span className="font-mono text-xs font-bold text-blue-700 uppercase tracking-wide block">
                1. General Qualifying Marks (Mq)
              </span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-xs font-bold text-slate-900">
                Mq = max(25, min(40, &mu; + &sigma;))
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {GATE_PSYCHOMETRICS_GUIDE.qualifyingMarksGeneral.explanation}
              </p>
            </div>

            {/* Reserved Category Quota */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-3">
              <span className="font-mono text-xs font-bold text-purple-700 uppercase tracking-wide block">
                2. Category Adjustments
              </span>
              <div className="space-y-1 text-center font-mono text-xs font-bold">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                  OBC-NCL / EWS = 0.90 &times; Mq
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                  SC / ST / PwD = 0.67 &times; Mq
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {GATE_PSYCHOMETRICS_GUIDE.qualifyingMarksReserved.explanation}
              </p>
            </div>

            {/* 1000-Point GATE Score */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-3">
              <span className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wide block">
                3. Standardized Score (S)
              </span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-xs font-bold text-slate-900">
                S = Sq + (St - Sq) &times; [(M - Mq) / (Mt - Mq)]
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Sq = 350, St = 900. Score is computed out of 1000 and valid for <strong>3 years</strong> from result announcement.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 6. Admissions Matrix & PSU Recruitment Guide ─── */}
        <section id="admissions-psu" className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 uppercase">
              Postgraduate Admissions &amp; PSU Career Gateways
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Where your GATE XE5 / XE-F qualification opens doors for M.Tech admissions and Maharatna public sector recruitment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Academic Admissions */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-lg text-slate-900 uppercase">
                  Premier M.Tech Programs (IITs &amp; ICT)
                </h3>
              </div>

              <div className="space-y-3">
                {GATE_ADMISSIONS_DIRECTORY.map((adm) => (
                  <div key={adm.institute} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-display text-slate-900">{adm.institute}</strong>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {adm.monthlyStipend}
                      </span>
                    </div>
                    <div className="text-xs text-blue-700 font-medium">{adm.programName} ({adm.degree})</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Accepted: {adm.acceptedGatePapers.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PSU Recruitment */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h3 className="font-display font-bold text-lg text-slate-900 uppercase">
                  PSU &amp; Strategic Defense Employers
                </h3>
              </div>

              <div className="space-y-3">
                {GATE_PSU_RECRUITERS.map((psu) => (
                  <div key={psu.shortName} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-display text-slate-900">{psu.organization} ({psu.shortName})</strong>
                      <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {psu.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium">{psu.roleTitle}</div>
                    <div className="text-[11px] text-slate-500 font-sans italic">
                      {psu.advisoryNote}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. Legal & Statutory Compliance Position ─── */}
        <section id="legal-framework" className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Statutory Compliance &amp; Educational Fair Dealing Doctrine
            </h2>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <strong className="text-sm text-slate-900 font-bold block">
                  {GATE_LEGAL_COMPLIANCE.publicExaminationsAct.title}
                </strong>
                <p>
                  Enacted on June 21, 2024 and amended on July 31, 2026, the Public Examinations Act establishes strict statutory penalties for question paper leaks, system hacking, and unfair means in public entrance examinations. PolymerHub operates purely as an open academic learning platform adhering strictly to ethical education guidelines.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium">
                  <strong>Copyright Act, 1957 Policy:</strong> PolymerHub respects the intellectual property rights of NCB-GATE and the Indian Institutes of Technology. PolymerHub DOES NOT re-host, mirror, or sell original question paper PDFs. We provide verified canonical links to official government repositories while publishing 100% original, copyrighted step-by-step mathematical derivations, free-body diagrams, and interactive test simulators.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. Action Banner ─── */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border-2 border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Ready to test your GATE XE5 knowledge?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Take our simulated 60-minute mock examination with strict countdown timer, authentic negative marking (-1/3 &amp; -2/3), and full mathematical explanations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/gate-mock"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Start Practice Mock</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://t.me/polymerhubofindia"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Telegram Group 🎯</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </main>

      <div className="mt-16">
        <Footer showTrustBar />
      </div>

    </div>
  )
}
