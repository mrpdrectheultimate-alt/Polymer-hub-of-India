'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
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
  ChevronRight
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
    description: 'The reason food, medicine, and products reach 1.4 billion people safely',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=1200&q=80',
    keyFacts: [
      'PET and EVOH barrier films extend food shelf life by weeks without artificial preservatives',
      'A single 50g PP woven sack reliably transports 50kg of grain across thousands of kilometres',
      'Multi-layer barrier pouches use micro-thin films to block 99.9% of oxygen and moisture'
    ],
    indianContext: 'Manjushree Technopack and Uflex produce billions of multi-layer barrier containers and flexible pouches annually, keeping FMCG goods fresh from factory to remote villages across India.',
    lessonLink: 'Plastic Packaging Engineering · 16 Modules',
    href: '/subjects/plastic-packaging-engineering',
    materials: ['PET', 'EVOH', 'BOPP', 'LLDPE'],
    processes: ['Co-extrusion', 'ISBM', 'Blown Film'],
  },
  {
    id: 'medical',
    name: 'Medical & Healthcare Devices',
    code: 'MED-02',
    icon: Stethoscope,
    color: '#EC4899',
    bgColor: '#FDE8F0',
    borderColor: '#EC4899',
    lessons: 12,
    description: 'Biocompatible polymers making modern sterile healthcare and implants possible',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80',
    keyFacts: [
      'Single-use auto-disable syringes drastically reduced hospital-acquired bloodborne infections',
      'PEEK and UHMWPE implants replace metal in orthopaedic surgeries with zero tissue rejection',
      'Medical-grade PVC and silicone enable dialysis cassettes and life-saving catheter lines'
    ],
    indianContext: "India's medical device industry is growing at 15% CAGR, with HMD producing 2.5 billion auto-disable syringes annually in Faridabad and Poly Medicure leading in precision IV cannulas.",
    lessonLink: 'Medical Plastics · 12 Modules',
    href: '/subjects/medical-plastics',
    materials: ['PEEK', 'UHMWPE', 'Medical PVC', 'Silicone'],
    processes: ['Cleanroom Injection Molding', 'Precision Extrusion', 'ETO Sterilization'],
  },
  {
    id: 'aerospace',
    name: 'Aerospace, Defense & Rockets',
    code: 'AERO-03',
    icon: Rocket,
    color: '#7C3AED',
    bgColor: '#F0E8FD',
    borderColor: '#7C3AED',
    lessons: 12,
    description: 'Ultra-light carbon composites taking satellites and defense systems to orbit',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80',
    keyFacts: [
      'Carbon-fiber reinforced polymers (CFRP) are 5x stronger than steel at one-fifth the weight',
      'Polyimides and ablative phenolics withstand 300°C+ during atmospheric re-entry',
      'Aerospace composites reduce aircraft structural weight by 20-30%, slashing fuel burn'
    ],
    indianContext: "Tata Advanced Materials and Godrej Aerospace manufacture precision CFRP structures for ISRO's GSLV/PSLV rockets and DRDO aerospace defense platforms.",
    lessonLink: 'Composites · 12 Modules',
    href: '/subjects/polymer-composites',
    materials: ['CFRP', 'PEEK', 'Polyimide', 'Epoxy Resins'],
    processes: ['Autoclave Curing', 'Filament Winding', 'Resin Transfer Molding (RTM)'],
  },
  {
    id: 'automotive',
    name: 'Automotive & Electric Mobility',
    code: 'AUTO-04',
    icon: Car,
    color: '#F59E0B',
    bgColor: '#FEF3E8',
    borderColor: '#F59E0B',
    lessons: 10,
    description: 'Lightweighting, crash-absorbing bumpers, and flame-retardant EV battery enclosures',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=80',
    keyFacts: [
      'Modern passenger vehicles are 12-15% polymer by weight, cutting vehicle mass by 150-200kg',
      'Impact-modified PP/EPDM bumpers absorb low-speed collisions elastically without sheet deformation',
      'PA66-GF30 and UL94 V-0 flame-retardant thermoplastics enclose high-voltage EV battery modules'
    ],
    indianContext: 'Motherson Sumi, Supreme Industries, and Tata AutoComp supply engineered plastic modules to Tata Motors, Maruti Suzuki, and Mahindra EV assembly lines across India.',
    lessonLink: 'Polymer Processing · 10 Modules',
    href: '/subjects/polymer-processing',
    materials: ['PP Compounds', 'PA66-GF', 'PC/ABS', 'TPU'],
    processes: ['Injection Molding', 'Gas-Assisted Molding', 'Structural Foam Molding'],
  },
  {
    id: 'electronics',
    name: 'Electronics & Semiconductor Tech',
    code: 'ELEC-05',
    icon: Cpu,
    color: '#06B6D4',
    bgColor: '#E8F8FA',
    borderColor: '#06B6D4',
    lessons: 12,
    description: 'The dielectric insulators, encapsulation resins, and flexible films powering digital life',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    keyFacts: [
      'Every silicon semiconductor chip package relies on epoxy novolac transfer molding encapsulation',
      'Ultra-thin flexible polyimide and LCP films enable high-frequency 5G antennas and folding displays',
      'Bakelite and polyphenylene sulfide (PPS) maintain high dielectric strength up to 200°C'
    ],
    indianContext: "India's electronics manufacturing expansion is driving local compounding demand for high-dielectric epoxy molding compounds and flame-retardant connectors under the Make in India initiative.",
    lessonLink: 'Advanced Materials · 12 Modules',
    href: '/subjects/additives-compounding',
    materials: ['Epoxy Novolac', 'LCP', 'Polyimide', 'PPS'],
    processes: ['Transfer Molding', 'Potting & Encapsulation', 'Photolithography'],
  },
  {
    id: 'textiles',
    name: 'Technical Textiles & Apparel',
    code: 'TEXT-06',
    icon: Shirt,
    color: '#8B5CF6',
    bgColor: '#F0E8FD',
    borderColor: '#8B5CF6',
    lessons: 12,
    description: 'High-performance synthetic fibers, moisture-wicking yarns, and geotextiles',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
    keyFacts: [
      'Over 60% of all global apparel is spun from synthetic polymers (PET, Nylon, and Elastane)',
      'Aramid fibers (Kevlar) offer 5x the tensile strength of steel for ballistic protection vests',
      'High-tenacity PP and PET non-woven geotextiles stabilize national highway embankments'
    ],
    indianContext: "Reliance Industries (Recron) and SRF Limited lead India's synthetic staple fiber and industrial tyre-cord spinning, driving massive growth in technical textiles.",
    lessonLink: 'Polymer Chemistry · 12 Modules',
    href: '/subjects/polymer-chemistry',
    materials: ['PET Polyester', 'Nylon 6,6', 'Aramids', 'Spandex/Elastane'],
    processes: ['High-Speed Melt Spinning', 'Solution Wet Spinning', 'Electrospinning'],
  },
  {
    id: 'construction',
    name: 'Infrastructure & Construction',
    code: 'CONS-07',
    icon: Building2,
    color: '#10B981',
    bgColor: '#E8F8F0',
    borderColor: '#10B981',
    lessons: 10,
    description: 'Corrosion-proof water piping, weather-resistant window profiles, and waterproofing seals',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1200&q=80',
    keyFacts: [
      'HDPE and CPVC piping systems transport drinking water for 50+ years with zero rust or scaling',
      'Multi-chambered uPVC profiles cut household air-conditioning energy consumption by over 30%',
      'EPDM elastomeric weather-stripping seals structural glass curtain walls against torrential monsoons'
    ],
    indianContext: 'Astral Pipes, Finolex Industries, and Supreme Industries anchor national water delivery, with the Jal Jeevan Mission deploying millions of kilometers of certified HDPE/CPVC piping.',
    lessonLink: 'Infrastructure Materials · 10 Modules',
    href: '/subjects/polymer-processing',
    materials: ['PE100 HDPE', 'CPVC', 'Rigid uPVC', 'EPDM Rubber'],
    processes: ['Twin-Screw Pipe Extrusion', 'Profile Co-extrusion', 'Continuous Pultrusion'],
  },
]

const STATS = [
  { value: '20M+ Tonnes', label: 'Processed Annually in India', icon: Factory, growth: '8.2% CAGR Growth' },
  { value: '7 Pillars', label: 'Core Infrastructure Sectors', icon: Globe, growth: 'Zero modern industries survive without it' },
  { value: '160+ Years', label: 'Of Industrial Innovation', icon: Clock, growth: '1862 Parkesine → 2026 AI' },
  { value: '₹20T+ Market', label: 'Indian Plastics Economy by 2030', icon: TrendingUp, growth: '30,000+ manufacturing units' },
]

// ==================== COMPONENT ====================

export default function WorldAtlasPage() {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Dark Industrial with Tricolor Glow */}
      {/* ============================================================ */}
      <section className="relative bg-[#0B172A] overflow-hidden py-16 lg:py-24 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1600&q=80"
            alt="World atlas - polymer industries"
            fill
            className="object-cover opacity-15 filter contrast-125"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B172A] via-[#0B172A]/85 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              🌍 Global Industrial Atlas
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Without Polymer Engineering,
              <span className="block bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                Modern Civilization Stops.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              Packaging &middot; Healthcare &middot; Rockets &middot; Automotive &middot; Electronics &middot; Technical Textiles &middot; Infrastructure. 
              Tap any sector below to inspect the exact polymer chemistry, processing machines, and Indian benchmarks powering the economy.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                      <StatIcon className="h-4 w-4" />
                      <span className="text-[10px] font-mono text-slate-400 truncate">{stat.growth}</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white font-mono leading-none">{stat.value}</p>
                    <p className="text-xs text-slate-300 font-mono mt-1">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#industries"
                className="px-6 py-3 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all flex items-center gap-2 text-xs sm:text-sm shadow-md"
              >
                Explore 7 Industrial Sectors
                <ChevronRight className="h-4 w-4" />
              </a>
              <Link
                href="/materials"
                className="px-6 py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-xs sm:text-sm"
              >
                Materials Database (50+ Resins)
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Tricolor Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* INDUSTRY INTERACTIVE ATLAS GRID (7 Cards) */}
      {/* ============================================================ */}
      <section id="industries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Interactive Industrial Taxonomy</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">7 Pillars Powered by Polymers</h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">Select any industrial pillar below to inspect chemistry, processing methods &amp; Indian factory case studies</p>
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
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`
                  text-left bg-white rounded-2xl border-2 p-4 transition-all flex items-center justify-between shadow-2xs
                  ${isSelected 
                    ? 'shadow-[0_8px_24px_rgba(0,0,0,0.08)] bg-slate-50/50' 
                    : 'hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
                  }
                `}
                style={{
                  borderColor: isSelected ? industry.color : '#E2E8F0'
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${industry.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: industry.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#111827] text-sm truncate">{industry.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[#64748B] text-xs font-mono">{industry.lessons} lessons</span>
                      <span 
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-white uppercase"
                        style={{ backgroundColor: industry.color }}
                      >
                        {industry.code}
                      </span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div 
                    className="w-2.5 h-2.5 rounded-full shrink-0 ml-2"
                    style={{ backgroundColor: industry.color }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* INDUSTRY DEEP-DIVE WORKSPACE */}
      {/* ============================================================ */}
      <section className="bg-white py-14 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndustry.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
            >
              {/* Left: Industrial Photography Card */}
              <div className="relative rounded-3xl overflow-hidden h-80 lg:h-[460px] bg-[#0B172A] shadow-lg">
                <Image
                  src={selectedIndustry.image}
                  alt={selectedIndustry.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white/70 text-xs font-mono font-bold">{selectedIndustry.code}</span>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: selectedIndustry.color }}
                    >
                      Infrastructure Pillar
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedIndustry.name}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 font-light leading-relaxed">{selectedIndustry.description}</p>
                </div>
              </div>

              {/* Right: Technical Breakdown */}
              <div className="space-y-5">
                {/* Key Polymers & Processing */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="mb-3">
                    <p className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider mb-2">Core Engineering Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedIndustry.materials.map((material) => (
                        <span 
                          key={material} 
                          className="px-3 py-1 rounded-full text-xs font-mono font-bold text-white shadow-2xs"
                          style={{ backgroundColor: selectedIndustry.color }}
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider mb-1.5">Dominant Manufacturing Processes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIndustry.processes.map((proc) => (
                        <span key={proc} className="px-2.5 py-0.5 rounded-lg bg-white border border-[#CBD5E1] text-[#334155] text-xs font-mono">
                          {proc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Technical Facts */}
                <div className="space-y-2.5">
                  {selectedIndustry.keyFacts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${selectedIndustry.color}15` }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedIndustry.color }} />
                      </div>
                      <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>

                {/* Indian Factory Benchmark */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider">Indian Industrial Benchmark</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{selectedIndustry.indianContext}</p>
                </div>

                {/* Subject Syllabus Link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Master The Science</p>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">{selectedIndustry.lessonLink}</p>
                  </div>
                  <Link
                    href={selectedIndustry.href}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all"
                    style={{ color: selectedIndustry.color }}
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
      {/* AI INDUSTRY SPECIALIST — Seamless Integration */}
      {/* ============================================================ */}
      <section className="bg-[#0B172A] py-14 border-t border-[#1A2E4A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Microscope className="h-3.5 w-3.5 text-[#F5C518]" />
                AI Industry Specialist
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Wondering how your target industry actually works?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our RAG-grounded AI Tutor about resin formulations, cycle times, 
                or factory setups for any of the 7 global infrastructure sectors.
              </p>
            </div>
            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask AI Specialist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}
