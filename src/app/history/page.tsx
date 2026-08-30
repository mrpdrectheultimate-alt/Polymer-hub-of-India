'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Microscope, 
  Award, 
  Clock, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Atom 
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== DATA ====================

const ERAS = [
  {
    id: 'parkesine',
    label: '1862',
    sublabel: 'Cellulose Nitrate',
    year: '1862',
    title: 'Parkesine & Celluloid',
    subtitle: 'The First Semi-Synthetic Plastics',
    category: 'Cellulosic Semi-Synthetic',
    icon: '🧪',
    description: 'Alexander Parkes demonstrates Parkesine at the Great Exhibition in London, followed by John Wesley Hyatt creating Celluloid (nitrocellulose plasticized with camphor) in 1869.',
    insight: 'Demonstrated that naturally abundant polymers (cellulose) could be chemically modified to create thermoplastic materials capable of thermal reformation upon heating.',
    milestones: [
      { year: '1862', text: 'Alexander Parkes demonstrates Parkesine at the Great Exhibition in London' },
      { year: '1869', text: 'John Wesley Hyatt invents Celluloid as an ivory substitute for billiard balls' },
      { year: '1888', text: 'George Eastman uses Celluloid film for photographic cameras, initiating motion pictures' },
    ],
  },
  {
    id: 'bakelite',
    label: '1907',
    sublabel: 'Thermoset Resin',
    year: '1907',
    title: 'Bakelite (Phenol-Formaldehyde)',
    subtitle: 'The First Fully Synthetic Polymer',
    category: 'Thermosetting Network',
    icon: '⚡',
    description: 'Leo Baekeland creates Bakelite via controlled acid/base condensation of phenol and formaldehyde under pressure, forming an irreversibly crosslinked insoluble network.',
    insight: 'The first true synthetic polymer created without natural biological precursors. Its high dielectric strength and heat resistance enabled the electrification and automotive industries.',
    milestones: [
      { year: '1907', text: 'Leo Baekeland files patent for Bakelizer pressure-vessel condensation reaction' },
      { year: '1920s', text: 'Bakelite forms the structural casings of early radios, distributor caps, and telephone receivers' },
    ],
  },
  {
    id: 'staudinger-macromolecule',
    label: '1920',
    sublabel: 'Macromolecular Theory',
    year: '1920',
    title: 'Macromolecular Hypothesis',
    subtitle: 'Hermann Staudinger Proves Covalent Long Chains',
    category: 'Polymer Physics Foundation',
    icon: '📐',
    description: 'Hermann Staudinger publishes his landmark paper "Über Polymerisation," disproving the prevailing colloidal aggregate theory and proving polymers are long covalently-bonded chains.',
    insight: 'Staudinger introduced the concept of molecular weight distributions and chain mechanics, laying the foundational physics that won him the 1953 Nobel Prize in Chemistry.',
    milestones: [
      { year: '1920', text: 'Staudinger proposes that rubber and synthetic polymers consist of >10,000 covalent atoms' },
      { year: '1928', text: 'Meyer and Mark verify long-chain crystal structures using early X-ray diffraction' },
      { year: '1953', text: 'Hermann Staudinger awarded the Nobel Prize in Chemistry' },
    ],
  },
  {
    id: 'nylon-carothers',
    label: '1935',
    sublabel: 'Step-Growth Polyamide',
    year: '1935',
    title: 'Nylon 6,6 & Carothers Kinetics',
    subtitle: 'Mathematical Step-Growth Condensation',
    category: 'Engineering Polyamide',
    icon: '🧵',
    description: 'Wallace Carothers at DuPont synthesizes poly(hexamethylene adipamide) (Nylon 6,6) and formulates the Carothers Equation relating stoichiometric conversion (p) to number-average degree of polymerization (DPn).',
    insight: 'Established that stoichiometric equivalence (r = 1) and high conversion (p > 0.99) are mandatory to achieve high molecular weight in step-growth polycondensation reactions.',
    milestones: [
      { year: '1935', text: 'Wallace Carothers synthesizes high-tenacity Nylon 6,6 in DuPont experimental labs' },
      { year: '1938', text: 'DuPont announces Nylon as the first synthetic fiber stronger than steel' },
      { year: '1940', text: '64 million pairs of Nylon stockings sold in the first year of commercial release' },
    ],
  },
  {
    id: 'ziegler-natta',
    label: '1953',
    sublabel: 'Stereoregular Catalysis',
    year: '1953-54',
    title: 'Ziegler-Natta Coordination Catalysis',
    subtitle: 'High-Density Polyethylene & Isotactic Polypropylene',
    category: 'Organometallic Catalysis',
    icon: '🔬',
    featured: true,
    description: 'Karl Ziegler and Giulio Natta discover coordination catalysts (TiCl₄ + Al(C₂H₅)₃) that polymerize olefins at ambient pressure with strict stereochemical control over tacticity.',
    insight: 'Unlike high-pressure radical branching (LDPE), Ziegler-Natta insertion generates perfectly linear chains (HDPE) and stereoregular isotactic polypropylene (iPP) with high crystallinity (Tm ≈ 165°C).',
    milestones: [
      { year: '1953', text: 'Karl Ziegler synthesizes unbranched linear HDPE at 1 atm using titanium-aluminum catalysts' },
      { year: '1954', text: 'Giulio Natta achieves stereospecific polymerization of isotactic polypropylene' },
      { year: '1956', text: 'William H. Willert patents the reciprocating screw injection unit for consistent plasticizing' },
      { year: '1963', text: 'Ziegler and Natta jointly awarded the Nobel Prize in Chemistry' },
    ],
  },
  {
    id: 'engineering-plastics',
    label: '1970s',
    sublabel: 'High-Performance Resins',
    year: '1970s',
    title: 'Engineering Thermoplastics & Composites',
    subtitle: 'Metal Replacement in Automotive & Aerospace',
    category: 'High-Performance Materials',
    icon: '🚀',
    description: 'Commercial maturation of Polycarbonate (Lexan), PEEK, Polyoxymethylene (POM), and carbon fiber reinforced polymers (CFRP) capable of continuous service >150°C.',
    insight: 'High glass transition temperatures (Tg) and creep resistance enabled thermoplastics to systematically replace structural die-cast aluminum and steel.',
    milestones: [
      { year: '1970s', text: 'Bisphenol-A Polycarbonate achieves optical transparency with extreme Izod impact strength' },
      { year: '1980s', text: 'ICI develops PEEK (Polyetheretherketone) for aerospace and medical spinal implants' },
      { year: '1990s', text: 'Autoclave-cured CFRP composites scale in civil aviation (Boeing 777/787 empennage)' },
    ],
  },
  {
    id: 'circular-smart',
    label: '2020s',
    sublabel: 'Circular & Bio-Polymers',
    year: '2020-2026',
    title: 'Enzymatic Recycling & Vitrimer Chemistry',
    subtitle: 'Closed-Loop Circularity & Reversible Covalent Networks',
    category: 'Sustainable Materials Science',
    icon: '♻️',
    description: 'Engineering engineered PETase enzymes for closed-loop depolymerization, vitrimers with associative bond exchange (transesterification), and bio-based PHA fermentation.',
    insight: 'Vitrimers combine the high mechanical integrity and thermal stability of thermosets with the reprocessability and weldability of thermoplastics via dynamic covalent chemistry.',
    milestones: [
      { year: '2011', text: 'Ludwik Leibler invents vitrimers based on dynamic associative covalent networks' },
      { year: '2020', text: 'Engineered cutinases and PETases achieve 90% PET depolymerization in 10 hours' },
      { year: '2026', text: 'Global EPR mandates and mono-material barrier film co-extrusions scale across supply chains' },
    ],
  },
]

function ZieglerNattaSchematic() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="font-mono text-xs font-bold uppercase text-blue-400">Cossee-Arlman Active Center</span>
        </div>
        <span className="text-[10px] font-mono bg-blue-900/60 text-blue-200 border border-blue-700 px-2 py-0.5 rounded">
          TiCl₄ + AlEt₃
        </span>
      </div>

      <div className="my-5 bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Catalyst Coordination Mechanism</span>
          <span className="text-emerald-400 font-bold">1 atm / 60°C</span>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl text-center font-bold text-amber-300 border border-amber-500/20 text-xs">
          [Ti]—CH₂—CH₂—P + CH₂=CH₂ ⟶ [Ti]—(CH₂—CH₂)₂—P
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          Monomer coordinates at the vacant octahedral site of Ti³⁺, undergoing cis-migratory insertion into the titanium-carbon polymer bond with 99%+ stereochemical retention.
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
        <span>Structure: Linear HDPE / Isotactic PP</span>
        <span className="text-emerald-400 font-bold">Nobel Prize 1963</span>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [currentEra, setCurrentEra] = useState(4) // Default to Ziegler-Natta
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const totalEras = ERAS.length
  const era = ERAS[currentEra]

  const goToEra = (index: number) => {
    if (index >= 0 && index < totalEras) setCurrentEra(index)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Clean, Modern White/Slate Header */}
      {/* ============================================================ */}
      <section className="relative bg-white border-b border-slate-200/90 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              Historical &amp; Mechanistic Archive
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight font-display">
              164 Years of Polymer Science.
              <span className="block text-[#2563EB]">From Parkesine to Modern Catalysis.</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-4 max-w-2xl leading-relaxed font-sans">
              From Alexander Parkes in 1862 to Ziegler-Natta stereospecific catalysis and 2026 enzymatic recycling &mdash; 
              explore the chemical and thermodynamic milestones that engineered the modern world.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
              {[
                { value: '1862 → 2026', label: '164 Years of Science', icon: <Clock className="h-4 w-4 text-[#2563EB]" /> },
                { value: '7', label: 'Transformative Eras', icon: <Layers className="h-4 w-4 text-[#2563EB]" /> },
                { value: '216', label: 'Connected Lessons', icon: <BookOpen className="h-4 w-4 text-[#2563EB]" /> },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-xs">
                  {stat.icon}
                  <div>
                    <p className="text-slate-900 font-extrabold text-sm sm:text-base font-mono leading-none">{stat.value}</p>
                    <p className="text-slate-500 text-[10px] sm:text-xs font-mono uppercase mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TIMELINE + ERA INTERACTIVE MODULE */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 md:p-8">
          
          {/* Timeline Navigation Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Select Chronological Epoch</span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                Era {String(currentEra + 1).padStart(2, '0')} of {String(totalEras).padStart(2, '0')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {ERAS.map((e, index) => {
                const isActive = index === currentEra
                return (
                  <button
                    key={e.id}
                    onClick={() => goToEra(index)}
                    className={`
                      flex flex-col items-start text-left p-3 rounded-2xl border transition-all
                      ${isActive 
                        ? 'bg-blue-50/80 border-[#2563EB] shadow-xs' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#2563EB]' : 'text-slate-900'}`}>
                        {e.year}
                      </span>
                      <span className="text-sm">{e.icon}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 line-clamp-1 font-display">
                      {e.title.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono line-clamp-1 mt-0.5">
                      {e.sublabel}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Prev/Next Controls */}
          <div className="flex items-center justify-between gap-4 mb-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => goToEra(currentEra - 1)}
              disabled={currentEra === 0}
              className={`
                px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5
                ${currentEra === 0 
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Epoch
            </button>

            <button
              onClick={() => goToEra(currentEra + 1)}
              disabled={currentEra === totalEras - 1}
              className={`
                px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs
                ${currentEra === totalEras - 1 
                  ? 'border border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' 
                  : 'bg-[#2563EB] hover:bg-blue-700 text-white'
                }
              `}
            >
              Next Epoch
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Era Content Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={era.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2"
            >
              {/* Left Column: Mechanism / Schematic */}
              <div className="lg:col-span-5">
                {era.id === 'ziegler-natta' ? (
                  <ZieglerNattaSchematic />
                ) : (
                  <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between min-h-[320px]">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="font-mono text-xs font-bold text-blue-400 uppercase">Chemical Classification</span>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {era.category}
                        </span>
                      </div>
                      <div className="mt-6 text-4xl mb-3">{era.icon}</div>
                      <h3 className="text-xl font-bold font-display text-white">{era.title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">{era.subtitle}</p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Historical Year: {era.year}</span>
                      <span className="text-blue-400 font-bold">Epoch {currentEra + 1} of 7</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Context, Mechanisms & Milestones */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                      {era.category}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {era.year}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
                    {era.title}
                  </h2>
                </div>

                {/* Historical Context */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    <BookOpen className="h-4 w-4 text-[#2563EB]" />
                    <span>Historical Context</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">{era.description}</p>
                </div>

                {/* Engineering Insight */}
                <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">
                    <Microscope className="h-4 w-4 text-[#2563EB]" />
                    <span>Engineering &amp; Chemical Mechanism</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">{era.insight}</p>
                </div>

                {/* Milestones */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>Key Chronological Milestones</span>
                  </div>
                  <ul className="space-y-1.5">
                    {era.milestones.map((milestone, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-sans">
                        <span className="text-[#2563EB] font-mono font-bold shrink-0 mt-0.5">{milestone.year} &rarr;</span>
                        <span className="leading-relaxed">{milestone.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* ============================================================ */}
      {/* CURRICULUM SYNERGY CTA */}
      {/* ============================================================ */}
      <section className="bg-white py-16 border-t border-slate-200/90">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">From Historical Milestones to Classroom Mastery</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Master the Principles Behind the Discoveries
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto font-sans leading-relaxed">
            Every historical breakthrough &mdash; from Carothers condensation to Ziegler-Natta stereoregularity &mdash; is fully integrated with step-by-step mathematical derivations in our 216 curriculum lessons.
          </p>
          <div className="mt-6">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-xs transition-all"
            >
              Explore 216 Curriculum Lessons
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SOURCES & PROVENANCE CITATIONS */}
      {/* ============================================================ */}
      <section className="bg-slate-50 py-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
              Sources: Nobel Foundation &middot; ACS Publications &middot; IUPAC Macromolecular Division
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Curriculum-reviewed engineering archive &middot; Sources verified against established literature
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1.5">🇮🇳 Built in India</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* GLOBAL FOOTER */}
      {/* ============================================================ */}
      <Footer />

    </div>
  )
}
