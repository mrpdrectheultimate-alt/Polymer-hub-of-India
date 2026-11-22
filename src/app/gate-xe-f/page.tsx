import { Metadata } from 'next'
import Link from 'next/link'
import { Trophy, Clock, Target, CheckCircle2, ArrowRight, ArrowLeft, BookOpen, AlertCircle, Sparkles, Scale, FileText, Download } from 'lucide-react'
import { GATE_CONFIG } from '@/lib/config/gate-config'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'GATE XE-F (Polymer Science & Engineering) Preparation Portal | PolymerHub India',
  description: 'Complete syllabus breakdown, topic-wise formula derivations, numerical question practice, and simulated mock exams for GATE Engineering Sciences Paper F.',
  openGraph: {
    title: 'GATE XE-F Polymer Science & Engineering Preparation',
    description: 'Syllabus, formulas, derivations, and mock tests aligned with IIT Madras GATE 2027.',
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      
      {/* Top Breadcrumb Header */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            GATE {GATE_CONFIG.year} &middot; Paper Code {GATE_CONFIG.paperCode} (XE-F)
          </span>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-slate-900">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" /> Dedicated GATE XE-F Preparation Master Hub
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            GATE Polymer Science &amp; Engineering (XE-F)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl font-light leading-relaxed">
            Paper F of Engineering Sciences (XE) is one of the most scoring and predictable sections for chemical, plastics, and polymer students. PolymerHub connects the official syllabus with numerical derivations, master formula sheets, and simulated mock exams.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/gate-mock"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Launch 60-Minute Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/formulas"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Explore Master Formula Library</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Section Weightage</div>
            <div className="text-2xl font-black font-display text-slate-900 mt-1">35 Marks</div>
            <div className="text-xs text-slate-600 mt-1">22 questions (9 of 1 mark, 13 of 2 marks)</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Negative Marking</div>
            <div className="text-2xl font-black font-display text-rose-600 mt-1">-0.33 / -0.66</div>
            <div className="text-xs text-slate-600 mt-1">MCQ only; zero penalty for NAT &amp; MSQ</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Exam Window</div>
            <div className="text-lg font-bold font-display text-slate-900 mt-1">{GATE_CONFIG.examDatesFormatted}</div>
            <div className="text-xs text-slate-600 mt-1">Organized by {GATE_CONFIG.organizingInstitute}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Syllabus Scope</div>
            <div className="text-2xl font-black font-display text-blue-600 mt-1">6 Core Units</div>
            <div className="text-xs text-slate-600 mt-1">Covering chemistry, testing &amp; rheology</div>
          </div>
        </div>

        {/* Detailed Syllabus Units */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Complete Official Syllabus Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every topic is mapped directly to lessons and formulas in PolymerHub.
            </p>
          </div>

          <div className="space-y-4">
            {SYLLABUS_SECTIONS.map((sec) => (
              <div
                key={sec.unit}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    {sec.unit}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {sec.title}
                  </h3>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-700 font-sans">
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

        {/* Action Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border-2 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Ready to test your GATE XE-F knowledge?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Take our simulated 60-minute mock examination with strict countdown timer, virtual calculator, and full mathematical explanations.
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
