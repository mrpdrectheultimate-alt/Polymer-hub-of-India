'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Stethoscope, 
  Rocket, 
  Car, 
  Cpu, 
  Shirt, 
  Building2,
  TrendingUp,
  Award,
  Globe,
  Factory,
  Clock,
  Microscope,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== DATA ====================

const INDUSTRIES = [
  {
    id: 'packaging',
    name: 'Packaging & Barrier Tech',
    code: 'PACK-01',
    icon: Package,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 16,
    description: 'Multi-layer barrier co-extrusions, aseptic containers, and mono-material food preservation',
    keyFacts: [
      'Multi-layer co-extrusion incorporates micro-thin EVOH barrier cores blocking >99.9% oxygen transmission',
      'Single-resin oriented BOPP/MDO-PE pouches enable 100% mechanical recyclability under circular EPR mandates',
      'Aseptic PET preforms with light-blocking TiO2 masterbatches extend dairy and pharma shelf life by 6+ months'
    ],
    indianContext: 'Uflex, Manjushree Technopack, and Cosmo First anchor high-barrier flexible packaging, supplying food and pharmaceutical supply chains across India.',
    lessonLink: 'Plastic Packaging Engineering · 16 Modules',
    href: '/subjects/plastic-packaging-engineering',
    materials: ['mLLDPE', 'EVOH Core', 'BOPP', 'PET', 'HDPE'],
    processes: ['7-Layer Blown Film Co-Extrusion', 'Injection Stretch Blow Molding (ISBM)', 'Cast Film'],
  },
  {
    id: 'medical',
    name: 'Medical & Healthcare Devices',
    code: 'MED-02',
    icon: Stethoscope,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 12,
    description: 'ISO 10993 biocompatible polymers making sterile healthcare, catheters, and implants possible',
    keyFacts: [
      'Medical-grade Radiation-Sterilizable PP enables single-use auto-disable safety syringes',
      'Implantable PEEK and crosslinked UHMWPE replace titanium in spinal cages and acetabular hip cups',
      'Plasticized non-DEHP medical PVC and silicone form sterile hemodialysis lines and IV infusion cassettes'
    ],
    indianContext: 'Hindustan Syringes (HMD) in Faridabad and Poly Medicure produce billions of sterile disposable medical devices and precision IV cannulas annually.',
    lessonLink: 'Medical Plastics · 12 Modules',
    href: '/subjects/medical-plastics',
    materials: ['PEEK Optima', 'UHMWPE', 'Medical PVC', 'USP Class VI Silicone'],
    processes: ['Class 10,000 Cleanroom Molding', 'Precision Micro-Extrusion', 'EtO / Gamma Sterilization'],
  },
  {
    id: 'aerospace',
    name: 'Aerospace & Carbon Composites',
    code: 'AERO-03',
    icon: Rocket,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 12,
    description: 'High-modulus carbon fiber reinforced polymers taking satellites and defense airframes to flight',
    keyFacts: [
      'Carbon-fiber reinforced polymers (CFRP) deliver 5x higher specific strength than aerospace-grade aluminum',
      'Ablative phenolic-carbon composites withstand re-entry heat fluxes exceeding 3,000°C',
      'Thermoplastic PEEK-carbon prepregs allow out-of-autoclave rapid induction welding of aircraft ribs'
    ],
    indianContext: 'Tata Advanced Materials and Godrej Aerospace manufacture structural CFRP fairings and motor casings for ISRO launch vehicles.',
    lessonLink: 'Composites · 12 Modules',
    href: '/subjects/polymer-composites',
    materials: ['Toray T800 Carbon Fiber', 'Aerospace Epoxy', 'Polyimide Resins', 'PEEK Prepreg'],
    processes: ['Autoclave Curing (7 bar / 180°C)', 'Automated Fiber Placement (AFP)', 'Resin Transfer Molding (RTM)'],
  },
  {
    id: 'automotive',
    name: 'Automotive & Electric Mobility',
    code: 'AUTO-04',
    icon: Car,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 10,
    description: 'Structural lightweighting, elastomeric bumpers, and UL94 V-0 flame-retardant EV battery packs',
    keyFacts: [
      'Engineering polymers account for 15% of modern vehicle weight, reducing overall curb mass by over 180 kg',
      'Impact-modified PP/EPDM reactor compounds absorb 15 km/h low-speed crash energy elastically without permanent damage',
      'Halogen-free PA66-GF30 and PBT compounds ensure dielectric isolation and thermal runaway containment in EV battery enclosures'
    ],
    indianContext: 'Motherson Sumi and Tata AutoComp supply engineered polymer modules and instrument panels to Tata Motors, Mahindra, and Maruti EV platforms.',
    lessonLink: 'Polymer Processing · 10 Modules',
    href: '/subjects/polymer-processing',
    materials: ['PP/EPDM TPO', 'PA66-GF30', 'PC/ABS Blends', 'Flame-Retardant PBT'],
    processes: ['High-Tonnage Injection Molding', 'Sequential Valve Gate Hot Runners', 'Structural Foam Molding'],
  },
  {
    id: 'electronics',
    name: 'Electronics & Semiconductor Tech',
    code: 'ELEC-05',
    icon: Cpu,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 12,
    description: 'High-dielectric insulators, epoxy transfer molding encapsulation, and flexible polyimide circuits',
    keyFacts: [
      'Epoxy Novolac Molding Compounds (EMC) with fused silica fillers protect microchips from ionic moisture ingress',
      'Ultra-thin flexible Polyimide (Kapton) and Liquid Crystal Polymer (LCP) films enable 5G millimeter-wave antenna arrays',
      'Polyphenylene Sulfide (PPS) and High-CTI Polyamides maintain dielectric integrity in micro-connectors at 260°C reflow soldering'
    ],
    indianContext: 'Domestic semiconductor packaging and PCB assembly facilities are expanding local demand for precision engineered encapsulation resins and underfill polymers.',
    lessonLink: 'Additives & Compounding · 12 Modules',
    href: '/subjects/additives-compounding',
    materials: ['Epoxy Novolac (EMC)', 'Liquid Crystal Polymer (LCP)', 'Polyimide (PI)', 'PPS'],
    processes: ['Transfer Molding Encapsulation', 'Spin Coating Dielectrics', 'Vacuum Potting'],
  },
  {
    id: 'textiles',
    name: 'Technical Textiles & Geotextiles',
    code: 'TEXT-06',
    icon: Shirt,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 12,
    description: 'High-tenacity synthetic filaments, ballistic aramid weaves, and non-woven civil engineering fabrics',
    keyFacts: [
      'Over 60% of all global industrial textiles are melt-spun from Polyethylene Terephthalate (PET) and Polyamide 6,6',
      'Para-aramid fibers (Kevlar) utilize rigid-rod liquid crystalline alignment to achieve tensile tenacity >23 cN/dtex for body armor',
      'Needle-punched Polypropylene needle-punched geotextiles provide soil filtration, sub-base separation, and erosion control on highways'
    ],
    indianContext: 'Reliance Industries (Recron) and SRF Limited operate world-scale spinning plants for industrial tyre cord and high-tenacity technical yarns.',
    lessonLink: 'Polymer Chemistry · 12 Modules',
    href: '/subjects/polymer-chemistry',
    materials: ['High-Tenacity PET', 'Nylon 6,6 Filament', 'Para-Aramids', 'Spunbond PP'],
    processes: ['High-Speed Melt Spinning (6000 m/min)', 'Spunbond / Meltblown Non-Wovens', 'Draw-Texturing (DTY)'],
  },
  {
    id: 'construction',
    name: 'Infrastructure & Piping Systems',
    code: 'CONS-07',
    icon: Building2,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 10,
    description: 'Corrosion-free pressure piping, multi-chamber uPVC architectural profiles, and elastomeric seals',
    keyFacts: [
      'PE100 High-Density Polyethylene pressure pipes withstand 16 bar for 50+ year design lifetimes without corrosion or tuberculation',
      'Chlorinated Polyvinyl Chloride (CPVC) maintains ductile pressure containment for domestic hot-water plumbing up to 93°C',
      'Co-extruded multi-chamber uPVC window profiles with EPDM gaskets cut HVAC thermal conductivity by >40% versus aluminum'
    ],
    indianContext: 'Astral Pipes, Supreme Industries, and Finolex supply certified piping across nationwide infrastructure programs including the Jal Jeevan Mission.',
    lessonLink: 'Polymer Processing · 10 Modules',
    href: '/subjects/polymer-processing',
    materials: ['PE100 Bimodal HDPE', 'CPVC Compound', 'Rigid uPVC', 'EPDM Weatherstrips'],
    processes: ['Twin-Screw Pipe Extrusion', 'Continuous Profile Co-Extrusion', 'Butt-Fusion Welding'],
  },
]

const STATS = [
  { value: '~20M Tonnes', label: 'Indicative Annual Consumption', icon: Factory, growth: 'PlastIndia / Industry Estimates' },
  { value: '7 Pillars', label: 'Core Infrastructure Sectors', icon: Globe, growth: 'Comprehensive Industrial Atlas' },
  { value: '1862 → 2026', label: '164 Years of Innovation', icon: Clock, growth: 'Parkesine to High-Barrier Co-Extrusion' },
  { value: '216 Lessons', label: 'Structured Curriculum', icon: TrendingUp, growth: 'Grounded B.Tech & GATE Syllabus' },
]

function MultiLayerBarrierFilmDiagram() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between h-full min-h-[360px]">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="font-mono text-xs font-bold uppercase text-blue-400">7-Layer Co-Extruded Barrier Film Cross-Section</span>
          </div>
          <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
            Food &amp; Medical Grade
          </span>
        </div>

        {/* Schematic Layers */}
        <div className="my-5 space-y-1.5 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-blue-600/90 text-white flex items-center justify-between shadow-2xs">
            <span className="font-bold">Layer 1 (Outer Print/Puncture): BOPP / LLDPE (25 µm)</span>
            <span className="text-[10px] opacity-80">Abrasion Barrier</span>
          </div>
          <div className="p-1.5 rounded bg-slate-700 text-slate-300 flex items-center justify-between text-[11px]">
            <span>Layer 2 (Adhesive Tie): Maleic Anhydride PE (5 µm)</span>
            <span className="text-[10px] text-amber-400">Grafted Adhesion</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-between shadow-xs">
            <span>Layer 3 (Active Core): EVOH Oxygen Barrier (5 µm)</span>
            <span className="text-[10px] bg-slate-950 text-emerald-300 px-1.5 py-0.5 rounded">OTR &lt; 0.5 cc/m²/day</span>
          </div>
          <div className="p-1.5 rounded bg-slate-700 text-slate-300 flex items-center justify-between text-[11px]">
            <span>Layer 4 (Adhesive Tie): Maleic Anhydride PE (5 µm)</span>
            <span className="text-[10px] text-amber-400">Grafted Adhesion</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/90 text-white flex items-center justify-between shadow-2xs">
            <span className="font-bold">Layer 5 (Inner Sealant): Metallocene mLLDPE (30 µm)</span>
            <span className="text-[10px] opacity-80">Food Contact / Low SIT</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
        <span>Moisture Vapor Barrier: WVTR &lt; 2.0 g/m²/day</span>
        <span className="text-emerald-400 font-bold">100% Food-Safe Contact</span>
      </div>
    </div>
  )
}

export default function WorldAtlasPage() {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Clean Modern White/Slate Layout */}
      {/* ============================================================ */}
      <section className="relative bg-white border-b border-slate-200/90 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Global Industrial Atlas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight font-display">
              Without Polymer Engineering,
              <span className="block text-[#2563EB]">Modern Manufacturing Stops.</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-4 max-w-2xl leading-relaxed font-sans">
              High-Barrier Packaging &middot; Medical Devices &middot; Carbon Aerospace &middot; Automotive &middot; Semiconductor Insulation &middot; Technical Textiles &middot; Infrastructure. 
              Explore the constitutive chemistry, processing machines, and Indian benchmarks powering the economy.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.08 * index }}
                    className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-xs"
                  >
                    <div className="flex items-center gap-1.5 text-[#2563EB] mb-1">
                      <StatIcon className="h-4 w-4" />
                      <span className="text-[10px] font-mono text-slate-500 truncate">{stat.growth}</span>
                    </div>
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono leading-none">{stat.value}</p>
                    <p className="text-xs text-slate-600 font-mono mt-1">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#industries"
                className="px-6 py-3 rounded-xl font-mono font-bold text-white bg-[#2563EB] hover:bg-blue-700 transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-xs"
              >
                Explore 7 Industrial Sectors
                <ChevronRight className="h-4 w-4" />
              </a>
              <Link
                href="/materials"
                className="px-6 py-3 rounded-xl font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-xs uppercase tracking-wider shadow-xs"
              >
                Materials Database (50+ Resins)
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* INDUSTRY INTERACTIVE ATLAS GRID (7 Cards) */}
      {/* ============================================================ */}
      <section id="industries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Industrial Taxonomy Matrix</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">7 Pillars Powered by Polymers</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Select any industrial pillar below to inspect chemistry, processing methods &amp; Indian factory case studies</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((industry, index) => {
            const Icon = industry.icon
            const isSelected = selectedIndustry.id === industry.id

            return (
              <motion.button
                key={industry.id}
                type="button"
                onClick={() => setSelectedIndustry(industry)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`
                  text-left bg-white rounded-3xl border p-4 transition-all flex items-center justify-between shadow-xs
                  ${isSelected 
                    ? 'border-[#2563EB] bg-blue-50/40 shadow-sm' 
                    : 'border-slate-200/90 hover:border-slate-300'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
                    <Icon className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 font-display">{industry.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-500 text-[11px] font-mono">{industry.lessons} lessons</span>
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-blue-100 text-[#2563EB] uppercase">
                        {industry.code}
                      </span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 ml-2 bg-[#2563EB]" />
                )}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* INDUSTRY DEEP-DIVE WORKSPACE */}
      {/* ============================================================ */}
      <section className="bg-slate-50/50 py-14 border-t border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndustry.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left: Scientific Visual / Diagram Card */}
              <div className="lg:col-span-5">
                {selectedIndustry.id === 'packaging' ? (
                  <MultiLayerBarrierFilmDiagram />
                ) : (
                  <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between min-h-[360px]">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <selectedIndustry.icon className="w-5 h-5 text-blue-400" />
                          <span className="font-mono text-xs font-bold uppercase text-blue-400">{selectedIndustry.code}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                          Industrial Sector
                        </span>
                      </div>

                      <div className="my-6 space-y-2">
                        <h3 className="text-2xl font-bold font-display text-white">{selectedIndustry.name}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed font-sans">{selectedIndustry.description}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Benchmark Resins</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedIndustry.materials.map((mat) => (
                            <span key={mat} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-blue-300">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Curriculum Modules: {selectedIndustry.lessons}</span>
                      <span className="text-emerald-400 font-bold">100% Syllabus Linked</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Technical Breakdown */}
              <div className="lg:col-span-7 space-y-4">
                {/* Key Polymers & Processing */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Core Engineering Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedIndustry.materials.map((material) => (
                        <span 
                          key={material} 
                          className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-50 text-[#2563EB] border border-blue-200 shadow-2xs"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dominant Manufacturing Processes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIndustry.processes.map((proc) => (
                        <span key={proc} className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono">
                          {proc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Technical Facts */}
                <div className="space-y-2">
                  {selectedIndustry.keyFacts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">{fact}</p>
                    </div>
                  ))}
                </div>

                {/* Indian Factory Benchmark */}
                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-[#2563EB]" />
                    <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Indian Industrial Benchmark</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">{selectedIndustry.indianContext}</p>
                </div>

                {/* Subject Syllabus Link */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Master The Science</p>
                    <p className="text-xs sm:text-sm font-bold font-display text-slate-900">{selectedIndustry.lessonLink}</p>
                  </div>
                  <Link
                    href={selectedIndustry.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-700 transition-all"
                  >
                    Open Curriculum
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================ */}
      {/* AI INDUSTRY SPECIALIST — Unified Blue Banner */}
      {/* ============================================================ */}
      <section className="bg-[#1E40AF] py-14 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Microscope className="h-3.5 w-3.5 text-amber-300" />
                AI Industry Specialist
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                Wondering how your target industry actually works?
              </h3>
              <p className="text-white/85 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our RAG-grounded AI Copilot about resin formulations, cycle times, 
                or factory setups for any of the 7 global infrastructure sectors.
              </p>
            </div>
            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-mono font-bold text-[#2563EB] bg-white hover:bg-slate-100 transition-all shadow-md flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-wider"
            >
              Ask AI Specialist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* COMPLIANCE & LEGAL TRUST BAR */}
      {/* ============================================================ */}
      <section className="bg-white py-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Curriculum-aligned industrial atlas
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <Factory className="h-3.5 w-3.5 text-[#2563EB]" />
              Industry indicative benchmarks
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-600" />
              Privacy-first platform
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1.5">🇮🇳 Built in India</span>
          </div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}
