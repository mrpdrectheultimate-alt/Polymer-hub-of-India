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
  ChevronRight,
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'
import Footer from '@/components/Footer'

// Technical SVG Diagram Component for Packaging Barrier Film
function PackagingBarrierDiagram() {
  return (
    <div className="w-full bg-[#091322] p-4 sm:p-5 rounded-2xl border border-blue-500/30 text-white font-mono shadow-inner my-4">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <span className="text-blue-400 text-xs font-bold flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-400" />
          5-Layer Co-extrusion Barrier Cross-Section (30µm)
        </span>
        <span className="text-[10px] text-slate-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
          ASTM F1927 O₂ Permeability &lt; 0.1 cc/m²/day
        </span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="h-7 bg-blue-600/25 border border-blue-500/40 rounded-lg flex items-center justify-between px-3 text-[11px]">
          <span className="font-bold text-blue-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Layer 1 (Outer Print Layer): LLDPE / BOPP
          </span>
          <span className="text-slate-400 text-[10px]">10µm &middot; Puncture &amp; Friction Resistance</span>
        </div>
        <div className="h-5 bg-amber-500/15 border border-amber-500/30 rounded-lg flex items-center justify-between px-3 text-[10px]">
          <span className="text-amber-300 font-medium">Layer 2: Maleic Anhydride Grafted PE Tie Layer</span>
          <span className="text-slate-400 text-[9px]">2.5µm &middot; Polymer Compatibilizer</span>
        </div>
        <div className="h-9 bg-emerald-500/25 border-2 border-emerald-400/80 rounded-lg flex items-center justify-between px-3 text-[11px] shadow-sm">
          <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Layer 3 (CORE BARRIER): EVOH (38 mol% Ethylene)
          </span>
          <span className="text-emerald-200 text-[10px] font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
            5µm &middot; 99.9% Oxygen &amp; Aroma Block
          </span>
        </div>
        <div className="h-5 bg-amber-500/15 border border-amber-500/30 rounded-lg flex items-center justify-between px-3 text-[10px]">
          <span className="text-amber-300 font-medium">Layer 4: Maleic Anhydride Grafted PE Tie Layer</span>
          <span className="text-slate-400 text-[9px]">2.5µm &middot; Interlayer Bonding</span>
        </div>
        <div className="h-7 bg-indigo-600/25 border border-indigo-500/40 rounded-lg flex items-center justify-between px-3 text-[11px]">
          <span className="font-bold text-indigo-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Layer 5 (Food Contact Sealant): Metallocene LLDPE
          </span>
          <span className="text-slate-400 text-[10px]">10µm &middot; Hermetic Heat Sealability (110°C)</span>
        </div>
      </div>
    </div>
  )
}

// ==================== DATA ====================

const INDUSTRIES = [
  {
    id: 'packaging',
    name: 'Packaging & Barrier Tech',
    code: 'PACK-01',
    shortDomain: 'Packaging',
    icon: Package,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#2563EB',
    lessons: 16,
    description: 'The reason food, medicine, and consumer products reach 1.4 billion people safely without spoilage.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
    engineeringChain: [
      {
        step: '01 MATERIAL',
        title: 'Polymer Selection',
        desc: 'PET and EVOH barrier films extend food shelf life by weeks without chemical preservatives.',
        tag: 'PET + EVOH'
      },
      {
        step: '02 ENGINEERING',
        title: 'Co-Extrusion Architecture',
        desc: 'Multi-layer barrier pouches use micro-thin films (5-7 layers) to block 99.9% of oxygen and moisture.',
        tag: 'Co-extrusion'
      },
      {
        step: '03 APPLICATION',
        title: 'High-Load Transport',
        desc: 'A single 50g PP woven sack reliably transports 50kg of agricultural grain across thousands of kilometres.',
        tag: '50kg Grain Sack'
      }
    ],
    indianContext: 'Manjushree Technopack, UFlex, Supreme Industries & Huhtamaki India produce billions of multi-layer barrier containers and flexible pouches annually, keeping FMCG goods fresh from factory to remote villages.',
    aiPrompts: [
      'How does EVOH block 99.9% oxygen in 5-layer co-extrusion packaging?',
      'What is the ISBM process cycle time for 500ml PET beverage bottles?',
      'How does UFlex manufacture high-barrier flexible food pouches?'
    ],
    lessonLink: 'Plastic Packaging Engineering · 16 Modules',
    href: '/subjects/plastic-packaging-engineering',
    materials: ['PET', 'EVOH', 'BOPP', 'LLDPE'],
    processes: ['Co-extrusion', 'ISBM', 'Blown Film'],
  },
  {
    id: 'medical',
    name: 'Medical & Healthcare Devices',
    code: 'MED-02',
    shortDomain: 'Medical',
    icon: Stethoscope,
    color: '#EC4899',
    bgColor: '#FDE8F0',
    borderColor: '#EC4899',
    lessons: 12,
    description: 'Biocompatible polymer formulations making sterile modern healthcare, catheters, and implants possible.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80',
    engineeringChain: [
      {
        step: '01 MATERIAL',
        title: 'Biocompatible Resins',
        desc: 'PEEK, UHMWPE, and medical PVC meet ISO 10993 cytotoxicity and hemocompatibility standards.',
        tag: 'PEEK + UHMWPE'
      },
      {
        step: '02 ENGINEERING',
        title: 'Cleanroom Processing',
        desc: 'Class 10,000 cleanroom injection molding ensures zero particulate contamination in IV cannulas.',
        tag: 'Class 10K Cleanroom'
      },
      {
        step: '03 APPLICATION',
        title: 'Life-Saving Hardware',
        desc: 'Single-use auto-disable syringes drastically reduced hospital-acquired bloodborne infections globally.',
        tag: 'Auto-Disable Syringe'
      }
    ],
    indianContext: "HMD (Hindustan Syringes & Medical Devices) produces 2.5 billion auto-disable syringes annually in Faridabad, while Poly Medicure and Trivitron Healthcare lead precision catheter and IV line manufacturing.",
    aiPrompts: [
      'What makes PEEK biocompatible for orthopedic spinal implants?',
      'How are Class 10,000 cleanrooms maintained for medical molding in India?',
      'Why is UHMWPE chosen for knee replacement bearing liners?'
    ],
    lessonLink: 'Medical Plastics · 12 Modules',
    href: '/subjects/medical-plastics',
    materials: ['PEEK', 'UHMWPE', 'Medical PVC', 'Silicone'],
    processes: ['Cleanroom Injection Molding', 'Precision Extrusion', 'ETO Sterilization'],
  },
  {
    id: 'aerospace',
    name: 'Aerospace, Defense & Rockets',
    code: 'AERO-03',
    shortDomain: 'Aerospace',
    icon: Rocket,
    color: '#7C3AED',
    bgColor: '#F0E8FD',
    borderColor: '#7C3AED',
    lessons: 12,
    description: 'Ultra-light carbon composites taking satellites, defense payloads, and aircraft to extreme speeds.',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80',
    engineeringChain: [
      {
        step: '01 MATERIAL',
        title: 'Advanced Carbon Fibers',
        desc: 'Carbon-fiber reinforced polymers (CFRP) are 5x stronger than structural steel at one-fifth the density.',
        tag: 'T800 CFRP + Epoxy'
      },
      {
        step: '02 ENGINEERING',
        title: 'Autoclave & Winding',
        desc: 'Precision filament winding and 180°C autoclave curing yield defect-free composite rocket motor casings.',
        tag: 'Autoclave Curing'
      },
      {
        step: '03 APPLICATION',
        title: 'Orbital & Defense Payload',
        desc: 'Aerospace composites reduce aircraft structural weight by 25-30%, dramatically slashing jet fuel consumption.',
        tag: 'ISRO GSLV Payload'
      }
    ],
    indianContext: "Tata Advanced Materials, Godrej Aerospace, and HAL Composites Division manufacture high-precision CFRP rocket motor cases and heat shields for ISRO's GSLV/PSLV and DRDO defense platforms.",
    aiPrompts: [
      'How does filament winding work for composite rocket motor casings?',
      'What resin matrices withstand 300°C re-entry temperatures in aerospace?',
      'How does Tata Advanced Materials manufacture carbon fiber components?'
    ],
    lessonLink: 'Composites · 12 Modules',
    href: '/subjects/polymer-composites',
    materials: ['CFRP', 'PEEK', 'Polyimide', 'Epoxy Resins'],
    processes: ['Autoclave Curing', 'Filament Winding', 'Resin Transfer Molding (RTM)'],
  },
  {
    id: 'automotive',
    name: 'Automotive & Electric Mobility',
    code: 'AUTO-04',
    shortDomain: 'Automotive',
    icon: Car,
    color: '#F59E0B',
    bgColor: '#FEF3E8',
    borderColor: '#F59E0B',
    lessons: 10,
    description: 'Vehicle lightweighting, elastomeric energy-absorbing bumpers, and flame-retardant EV battery packs.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=80',
    engineeringChain: [
      {
        step: '01 MATERIAL',
        title: 'Engineered Compounds',
        desc: 'PA66-GF30 and UL94 V-0 flame-retardant thermoplastics encapsulate high-voltage EV battery cells safely.',
        tag: 'PA66-GF30 + PP/EPDM'
      },
      {
        step: '02 ENGINEERING',
        title: 'Structural Moldings',
        desc: 'Gas-assisted injection molding produces void-free, lightweight structural dash frames and intake manifolds.',
        tag: 'Gas-Assisted Molding'
      },
      {
        step: '03 APPLICATION',
        title: 'Mass Reduction & Safety',
        desc: 'Modern EVs are 15% polymer by weight, shedding 200kg to boost battery range and absorb impact energy.',
        tag: '200kg Weight Reduction'
      }
    ],
    indianContext: 'Motherson Sumi, Supreme Industries, Tata AutoComp & Automotive Stampings supply engineered plastic modules to Tata Motors EV, Maruti Suzuki, and Mahindra manufacturing lines across India.',
    aiPrompts: [
      'Why is PA66-GF30 specified for EV battery module housings?',
      'How do PP/EPDM bumpers absorb low-speed collisions elastically?',
      'What polymers cut 200kg off Indian electric vehicles to boost range?'
    ],
    lessonLink: 'Polymer Processing · 10 Modules',
    href: '/subjects/polymer-processing',
    materials: ['PP Compounds', 'PA66-GF', 'PC/ABS', 'TPU'],
    processes: ['Injection Molding', 'Gas-Assisted Molding', 'Structural Foam Molding'],
  },
  {
    id: 'electronics',
    name: 'Electronics & Semiconductor Tech',
    code: 'ELEC-05',
    shortDomain: 'Electronics',
    icon: Cpu,
    color: '#06B6D4',
    bgColor: '#E8F8FA',
    borderColor: '#06B6D4',
    lessons: 12,
    description: 'High-dielectric insulators, epoxy encapsulation resins, and flexible polyimide substrates powering silicon.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    engineeringChain: [
      {
        step: '01 MATERIAL',
        title: 'Dielectric Encapsulants',
        desc: 'Epoxy novolac molding compounds provide &gt;15 kV/mm dielectric strength and zero moisture absorption.',
        tag: 'Epoxy Novolac + LCP'
      },
      {
        step: '02 ENGINEERING',
        title: 'Transfer Molding',
        desc: 'Micro-precision semiconductor transfer molding encapsulates sub-micron silicon wire bonds safely.',
        tag: 'Transfer Molding'
      },
      {
        step: '03 APPLICATION',
        title: '5G & Micro-Electronics',
        desc: 'Ultra-thin flexible polyimide and LCP films enable high-frequency 5G mmWave antennas and folding screens.',
        tag: '5G Flexible Substrates'
      }
    ],
    indianContext: "India's semiconductor packaging expansion (driven by Dixon Technologies, Amber Enterprises & Syrma SGS) is accelerating demand for high-dielectric epoxy molding compounds under Make in India.",
    aiPrompts: [
      'How does epoxy novolac encapsulate microchips during transfer molding?',
      'Why are liquid crystal polymers (LCP) essential for 5G antennas?',
      'What dielectric properties prevent electrical breakdown in electronics?'
    ],
    lessonLink: 'Advanced Materials · 12 Modules',
    href: '/subjects/additives-compounding',
    materials: ['Epoxy Novolac', 'LCP', 'Polyimide', 'PPS'],
    processes: ['Transfer Molding', 'Potting & Encapsulation', 'Photolithography'],
  },
  {
    id: 'textiles',
    name: 'Technical Textiles & Apparel',
    code: 'TEXT-06',
    shortDomain: 'Textiles',
    icon: Shirt,
    color: '#8B5CF6',
    bgColor: '#F0E8FD',
    borderColor: '#8B5CF6',
    lessons: 12,
    description: 'High-tenacity synthetic fibers, moisture-wicking yarns, geotextiles, and ballistic protective weaves.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
    engineeringChain: [
      {
        step: '01 MATERIAL',
        title: 'Synthetic Polymers',
        desc: 'PET polyester, Nylon 6,6, and Aramid polymers account for over 60% of all global industrial textile fiber.',
        tag: 'PET + Nylon 6,6'
      },
      {
        step: '02 ENGINEERING',
        title: 'High-Speed Melt Spinning',
        desc: 'Melt spinning at 6,000 m/min aligns molecular chains to achieve tenacity &gt;8.5 g/denier for tire cord.',
        tag: 'Melt Spinning'
      },
      {
        step: '03 APPLICATION',
        title: 'Infrastructure Geotextiles',
        desc: 'Non-woven PP and PET geotextiles stabilize soil embankments across national highway and railway projects.',
        tag: 'Highway Geotextiles'
      }
    ],
    indianContext: "Reliance Industries (Recron), SRF Limited & Sutlej Textiles lead India's synthetic staple fiber, industrial tire cord, and non-woven geotextile manufacturing across national infrastructure projects.",
    aiPrompts: [
      'How does high-speed melt spinning orient polymer chains for high tenacity?',
      'What makes Aramid (Kevlar) 5x stronger than steel in ballistic vests?',
      'How do non-woven geotextiles prevent soil erosion on Indian highways?'
    ],
    lessonLink: 'Polymer Chemistry · 12 Modules',
    href: '/subjects/polymer-chemistry',
    materials: ['PET Polyester', 'Nylon 6,6', 'Aramids', 'Spandex/Elastane'],
    processes: ['High-Speed Melt Spinning', 'Solution Wet Spinning', 'Electrospinning'],
  },
  {
    id: 'construction',
    name: 'Infrastructure & Construction',
    code: 'CONS-07',
    shortDomain: 'Infrastructure',
    icon: Building2,
    color: '#10B981',
    bgColor: '#E8F8F0',
    borderColor: '#10B981',
    lessons: 10,
    description: 'Corrosion-proof drinking water pipelines, thermal uPVC window profiles, and elastomeric seals.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1200&q=80',
    engineeringChain: [
      {
        step: '01 MATERIAL',
        title: 'Resin Formulations',
        desc: 'PE100 HDPE and CPVC provide 50+ year service life with zero internal scaling or metal corrosion.',
        tag: 'PE100 HDPE + CPVC'
      },
      {
        step: '02 ENGINEERING',
        title: 'Twin-Screw Extrusion',
        desc: 'Continuous twin-screw pipe extrusion ensures uniform wall thickness and MRS 10.0 MPa hoop strength.',
        tag: 'Twin-Screw Pipe Line'
      },
      {
        step: '03 APPLICATION',
        title: 'Clean Water Delivery',
        desc: 'Multi-chambered uPVC window profiles slash household cooling energy load by over 30% under intense sun.',
        tag: 'Jal Jeevan Water Grid'
      }
    ],
    indianContext: 'Astral Pipes, Finolex Industries, Supreme Industries & Supreme Petrochem anchor national water grids, with the Jal Jeevan Mission deploying millions of kilometers of certified HDPE/CPVC piping.',
    aiPrompts: [
      'Why does PE100 HDPE pipe last 50+ years without corrosion in soil?',
      'How does CPVC withstand hot water up to 93°C compared to standard PVC?',
      'How does twin-screw extrusion maintain uniform pipe wall thickness?'
    ],
    lessonLink: 'Infrastructure Materials · 10 Modules',
    href: '/subjects/polymer-processing',
    materials: ['PE100 HDPE', 'CPVC', 'Rigid uPVC', 'EPDM Rubber'],
    processes: ['Twin-Screw Pipe Extrusion', 'Profile Co-extrusion', 'Continuous Pultrusion'],
  },
]

const STATS = [
  { value: '20.9M Tonnes', label: 'Indian Plastic Demand (2021-22)', icon: Factory, growth: 'CPCB & CPMA Official Data' },
  { value: '7 Domains', label: 'Core Infrastructure Sectors', icon: Globe, growth: 'Essential Economic Taxonomy' },
  { value: '164 Years', label: 'Of Industrial Innovation', icon: Clock, growth: '1862 Parkesine → 2026 AI' },
  { value: '30,000+', label: 'Manufacturing Units in India', icon: TrendingUp, growth: '8.2% CAGR National Growth' },
]

// ==================== COMPONENT ====================

export default function WorldAtlasPage() {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0])

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
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                🌍 Global Industrial Atlas
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Last Verified: Sep 2026 &middot; CPCB &amp; CPMA Data</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] pb-1 tracking-tight">
              Without Polymer Engineering,
              <span className="block bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent pb-3 pt-1 leading-[1.15]">
                Modern Civilization Stops.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              Packaging &middot; Healthcare &middot; Rockets &middot; Automotive &middot; Electronics &middot; Technical Textiles &middot; Infrastructure. 
              Select any domain below to inspect resin formulations, processing machinery, and Indian factory benchmarks.
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
                      <span className="text-[10px] font-mono text-slate-300 truncate font-medium">{stat.growth}</span>
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
                Explore 7 Industrial Domains
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Globe className="h-3.5 w-3.5" />
              Interactive Industrial Taxonomy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              7 Industrial Domains Powered by Polymers
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
              Select any domain below to inspect resin formulations, processing machinery &amp; Indian manufacturing case studies.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono font-bold text-xs shadow-md shrink-0">
            <span>Select a Domain to Explore</span>
            <ChevronRight className="h-4 w-4 animate-pulse" />
          </div>
        </div>

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
                  text-left bg-white rounded-2xl border-2 p-4 transition-all flex items-center justify-between shadow-2xs cursor-pointer
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
                    className="w-3 h-3 rounded-full shrink-0 ml-2 animate-ping"
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
              {/* Left: Industrial Photography & Visual Card */}
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden h-72 lg:h-[380px] bg-[#0B172A] shadow-lg border border-slate-200">
                  <Image
                    src={selectedIndustry.image}
                    alt={selectedIndustry.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-sm"
                        style={{ backgroundColor: selectedIndustry.color }}
                      >
                        {selectedIndustry.code} &middot; {selectedIndustry.shortDomain}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/15 text-white/90 text-[10px] font-mono font-medium backdrop-blur-xs">
                        Industrial Domain
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedIndustry.name}</h3>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1 font-light leading-relaxed">{selectedIndustry.description}</p>
                  </div>
                </div>

                {/* Technical SVG Barrier Diagram for Packaging Domain */}
                {selectedIndustry.id === 'packaging' && (
                  <PackagingBarrierDiagram />
                )}
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
                        <span key={proc} className="px-2.5 py-0.5 rounded-lg bg-white border border-[#CBD5E1] text-[#334155] text-xs font-mono font-medium">
                          {proc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Engineering Chain Sequence */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                      Industrial Engineering Chain
                    </p>
                    <span className="text-[10px] font-mono text-blue-600 font-semibold">3-Step Value Sequence</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedIndustry.engineeringChain.map((chainItem, i) => (
                      <div 
                        key={i} 
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span 
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold text-white uppercase tracking-wider shadow-2xs"
                            style={{ backgroundColor: selectedIndustry.color }}
                          >
                            {chainItem.step}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs font-bold text-slate-900">{chainItem.title}</span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                              {chainItem.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{chainItem.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indian Factory Benchmark */}
                <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider">Indian Industrial Benchmark</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">{selectedIndustry.indianContext}</p>
                </div>

                {/* Subject Syllabus Link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold">Master The Science</p>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">{selectedIndustry.lessonLink}</p>
                  </div>
                  <Link
                    href={selectedIndustry.href}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all hover:translate-x-1"
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
      {/* AI INDUSTRY SPECIALIST — Dynamic & Contextual */}
      {/* ============================================================ */}
      <section className="bg-[#0B172A] py-14 border-t border-[#1A2E4A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  <Microscope className="h-3.5 w-3.5 text-[#F5C518]" />
                  AI Industry Specialist &middot; Grounded RAG Engine
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Wondering how <span style={{ color: selectedIndustry.color }}>{selectedIndustry.name}</span> works in India?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl font-light leading-relaxed">
                  Ask our AI Tutor about <span className="text-white font-mono font-bold">{selectedIndustry.materials.slice(0, 3).join(', ')}</span> resin formulations, <span className="text-white font-mono font-bold">{selectedIndustry.processes[0]}</span> processing, or Indian factory setups.
                </p>
              </div>
              <Link
                href="/ai-tutor"
                className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider self-start lg:self-center"
              >
                Ask AI Specialist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Domain-specific prompt pills */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Suggested Technical Queries for {selectedIndustry.shortDomain}:</p>
              <div className="flex flex-wrap gap-2">
                {selectedIndustry.aiPrompts.map((prompt, idx) => (
                  <Link
                    key={idx}
                    href={`/ai-tutor?prompt=${encodeURIComponent(prompt)}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-800 text-xs text-slate-200 transition-all flex items-center gap-2 group"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>&ldquo;{prompt}&rdquo;</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}
