'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Microscope, 
  ArrowRight,
  Award,
  Clock,
  Layers,
  Brain,
  GraduationCap,
  FlaskConical,
  Star,
  Shield
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== DATA ====================

interface EraData {
  id: string
  label: string
  sublabel: string
  year: string
  title: string
  subtitle: string
  image: string
  color: string
  iconSvg: React.ReactNode
  featured?: boolean
  description: string
  insight: string
  milestones: { year: string; text: string }[]
  impact: string
  people: string[]
  events: string[]
}

const ERAS: EraData[] = [
  {
    id: 'foundation',
    label: '1860s',
    sublabel: 'Foundation',
    year: '1862',
    title: 'Parkesine',
    subtitle: 'The First Man-Made Plastic',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    color: '#8B7355',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4L20 20M20 4L4 20" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
    description: 'Alexander Parkes unveils Parkesine, the first semi-synthetic man-made plastic — an organic material derived from cellulose nitrate treated with vegetable oils that could be heated, molded, and retained its shape when cooled.',
    insight: 'This marked the dawn of the macromolecular era. While Parkesine proved fragile commercially, John Wesley Hyatt improved it with camphor plasticization in 1869 to create Celluloid, proving that natural biopolymers could be chemically modified to substitute scarce ivory and tortoiseshell.',
    milestones: [
      { year: '1839', text: 'Charles Goodyear discovers vulcanization by adding sulfur to crosslink natural rubber.' },
      { year: '1862', text: 'Alexander Parkes demonstrates Parkesine at the Great Exhibition in London.' },
      { year: '1869', text: 'John Wesley Hyatt invents Celluloid, the first commercially viable thermoplastic.' },
      { year: '1872', text: 'Hyatt patents the first primitive plunger injection molding apparatus.' },
    ],
    impact: 'Proved synthetic materials could substitute natural commodities with thermal molding.',
    people: ['Alexander Parkes', 'John Wesley Hyatt', 'Charles Goodyear'],
    events: ['First man-made plastic', 'Cellulose nitrate modification', 'Plunger molding born'],
  },
  {
    id: 'bakelite',
    label: '1900s',
    sublabel: 'Synthetic Era',
    year: '1907',
    title: 'Bakelite',
    subtitle: 'The First Fully Synthetic Thermoset',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    color: '#6B4226',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'Belgian-American chemist Leo Baekeland creates Bakelite (polyoxybenzylmethylenglycolanhydride), synthesizing the world\'s first fully synthetic thermosetting resin from phenol and formaldehyde under pressure and heat.',
    insight: 'Bakelite was the first plastic synthesized entirely from petrochemical molecules without biological precursors. Heating triggered an irreversible crosslinked 3D network, providing electrical non-conductivity, solvent resistance, and dimensional stability that powered the global electrical and telephone grid.',
    milestones: [
      { year: '1907', text: 'Leo Baekeland patents Bakelite resin and the pressurized "Bakelizer" autoclave.' },
      { year: '1920', text: 'Hermann Staudinger proposes the groundbreaking Macromolecular Hypothesis.' },
      { year: '1926', text: 'First modern hydraulic injection molding machine patented by Eckert & Ziegler.' },
    ],
    impact: 'Catalyzed modern electronics, radios, automotive distributors, and the telecommunications boom.',
    people: ['Leo Hendrik Baekeland', 'Hermann Staudinger'],
    events: ['First 100% synthetic resin', 'Thermoset crosslinking', 'Electrical revolution'],
  },
  {
    id: 'nylon',
    label: '1930s',
    sublabel: 'Age of Fibers',
    year: '1935',
    title: 'Nylon 6,6',
    subtitle: 'The First Fully Synthetic Engineering Fiber',
    image: 'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1200&q=80',
    color: '#1A365D',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3l18 18M21 3L3 21" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    ),
    description: 'Wallace Carothers and his research team at DuPont develop nylon 6,6 (polyhexamethylene adipamide) — the first fully synthetic commercial polyamide fiber, followed swiftly by Teflon (PTFE) and polystyrene.',
    insight: 'Carothers mathematically proved step-growth polymerization kinetics through the Carothers Equation, showing how stoichiometric balance drives high molecular weight. Cold drawing aligned hydrogen-bonded amide chains, producing exceptional tensile strength superior to silk.',
    milestones: [
      { year: '1933', text: 'ICI chemists Fawcett and Gibson accidentally synthesize low-density polyethylene (LDPE).' },
      { year: '1935', text: 'Wallace Carothers synthesizes nylon 6,6 at DuPont experimental station.' },
      { year: '1938', text: 'Roy Plunkett accidentally discovers polytetrafluoroethylene (PTFE/Teflon).' },
      { year: '1940', text: 'Nylon stockings debut, selling 64 million pairs in their first commercial year.' },
    ],
    impact: 'Launched the synthetic fiber industry, military parachutes, and high-performance engineering plastics.',
    people: ['Wallace Hume Carothers', 'Roy J. Plunkett', 'Eric Fawcett'],
    events: ['Step-growth kinetics', 'High-tensile polyamide', 'Hydrogen-bonded crystal domains'],
  },
  {
    id: 'ziegler-natta',
    label: '1950s',
    sublabel: 'Catalytic Boom',
    year: '1953-54',
    title: 'Ziegler-Natta',
    subtitle: 'Stereospecific Catalysis & The Polyolefin Revolution',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    color: '#1A365D',
    featured: true,
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16M4 12h16" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    description: 'Karl Ziegler in Germany and Giulio Natta in Italy discover coordination catalysts (titanium halides + organoaluminum), enabling stereospecific polymerization of ethylene and propylene at low temperatures and pressures.',
    insight: 'Ziegler-Natta catalysts unlocked coordination insertion polymerization. Unlike free-radical routes that produce branched chains (LDPE), coordination catalysts generate high-density linear polyethylene (HDPE) and isotactic polypropylene (iPP) with controlled tacticity and dense crystalline packing.',
    milestones: [
      { year: '1953', text: 'Karl Ziegler discovers titanium/aluminum catalysts to polymerize ethylene at atmospheric pressure.' },
      { year: '1954', text: 'Giulio Natta uses the catalyst to synthesize stereoregular isotactic polypropylene.' },
      { year: '1956', text: 'William H. Willert patents the reciprocating screw injection unit, revolutionizing melt consistency.' },
      { year: '1963', text: 'Karl Ziegler and Giulio Natta are jointly awarded the Nobel Prize in Chemistry.' },
    ],
    impact: 'Established the modern commodity polyolefin industry (HDPE, LLDPE, PP) representing over 60% of world plastics.',
    people: ['Karl Ziegler', 'Giulio Natta', 'William H. Willert'],
    events: ['Stereoregular polymers', 'Reciprocating screw unit', '1963 Nobel Prize in Chemistry'],
  },
  {
    id: 'engineering',
    label: '1970s',
    sublabel: 'Super Plastics',
    year: '1970s',
    title: 'Engineering Polymers',
    subtitle: 'High-Performance & Metal Replacement Revolution',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    color: '#2C3E50',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
    description: 'Aromatic engineering thermoplastics — Polycarbonate (PC), Polyetheretherketone (PEEK), Polyoxymethylene (POM), and Kevlar aramids — enter large-scale commercial aerospace, automotive, and medical production.',
    insight: 'By incorporating aromatic backbone rings (benzene rings, ether-ketone linkages), polymer chemists dramatically raised glass transition temperatures (Tg) and continuous service limits above 250°C, allowing lightweight plastics to replace aluminum, brass, and steel.',
    milestones: [
      { year: '1971', text: 'Stephanie Kwolek at DuPont commercializes Kevlar (poly-p-phenylene terephthalamide) liquid crystal fiber.' },
      { year: '1977', text: 'ICI develops Polyetheretherketone (PEEK) for ultra-high temperature aerospace and implant applications.' },
      { year: '1982', text: 'General Electric commercializes Ultem (polyetherimide / PEI) amorphous high-heat resin.' },
    ],
    impact: 'Enabled lightweighting in jet fuselages, under-the-hood automotive gears, and autoclave-sterilizable surgical tools.',
    people: ['Stephanie Kwolek', 'Bayer R&D', 'General Electric Plastics', 'ICI Advanced Materials'],
    events: ['Aromatic backbone stiffness', 'Continuous 250°C heat resistance', 'Liquid crystal polymers'],
  },
  {
    id: 'biopolymers',
    label: '1990s',
    sublabel: 'Green Polymers',
    year: '1990s',
    title: 'Biopolymers',
    subtitle: 'Renewable Feedstocks & Industrial Biodegradation',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
    color: '#2D6A4F',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    description: 'Polylactic acid (PLA), Polyhydroxyalkanoates (PHA), and starch-based compounds emerge commercially, decoupling polymer synthesis from fossil fuels and introducing compostable circular lifecycles.',
    insight: 'Ring-opening polymerization of lactide dimers derived from corn/sugarcane starch fermentation produces high-modulus PLA. Microbial fermentation yields intracellular PHA polyesters that biodegrade fully in soil and marine environments without toxic microplastic accumulation.',
    milestones: [
      { year: '1997', text: 'Cargill Dow (NatureWorks) pioneers industrial-scale corn-derived PLA manufacturing.' },
      { year: '2000', text: 'Alan Heeger, Alan MacDiarmid, and Hideki Shirakawa win the Nobel Prize for Conductive Polymers.' },
      { year: '2004', text: 'ISO 17088 and ASTM D6400 industrial compostability standards formalized.' },
    ],
    impact: 'Established the renewable carbon economy for single-use packaging, mulch films, and resorbable sutures.',
    people: ['NatureWorks Engineers', 'Alan J. Heeger', 'Alan G. MacDiarmid', 'Hideki Shirakawa'],
    events: ['Lactide ring-opening', 'Microbial PHA fermentation', 'Marine biodegradability'],
  },
  {
    id: 'future',
    label: '2020s',
    sublabel: 'Smart Frontier',
    year: '2020s',
    title: 'Smart Polymers',
    subtitle: 'Dynamic Covalent Vitrimers & Chemical Upcycling',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&q=80',
    color: '#2563EB',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    description: 'Vitrimers with associative bond exchange, self-healing composites, enzymatic PET depolymerization, and AI-designed molecular architectures redefine circular materials.',
    insight: 'Vitrimers combine the mechanical insolubility of thermosets with the thermal re-processability of thermoplastics via dynamic associative exchange reactions (transesterification). Engineered enzymes (PETase) depolymerize mixed textile waste back to virgin monomers in hours at 65°C.',
    milestones: [
      { year: '2011', text: 'Ludwik Leibler introduces the concept of Vitrimers (dynamic covalent crosslinked networks).' },
      { year: '2020', text: 'Engineered PETase enzymes achieve 90% enzymatic recycling of PET flakes within 10 hours.' },
      { year: '2026', text: 'PolymerHub launches AI-driven formulation and digital twin defect troubleshooting across India.' },
    ],
    impact: 'Closing the loop toward infinite circularity, infinite self-repair, and decarbonized polymer lifecycles.',
    people: ['Ludwik Leibler', 'Carbios Research Team', 'Next-Gen Indian Engineers'],
    events: ['Dynamic covalent vitrimers', 'Enzymatic depolymerization', 'Digital twin formulation'],
  },
]

export default function HistoryPage() {
  const [currentEra, setCurrentEra] = useState(3) // Ziegler-Natta as default
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const totalEras = ERAS.length
  const era = ERAS[currentEra]

  const goToEra = (index: number) => {
    if (index >= 0 && index < totalEras) {
      setCurrentEra(index)
    }
  }

  const goNext = () => goToEra(currentEra + 1)
  const goPrev = () => goToEra(currentEra - 1)

  return (
    <div className="min-h-screen bg-[#FDF8F0] overflow-x-hidden text-slate-900 font-sans" ref={containerRef}>
      
      {/* ============================================================ */}
      {/* HERO SECTION — Unified Amber / Gold Vintage Aesthetic */}
      {/* ============================================================ */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-[#0B172A]">
        {/* Background Image with Vintage Gradient Scrim */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1600&q=80"
            alt="History of polymers in laboratory"
            fill
            className="object-cover opacity-20 filter sepia contrast-125"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B172A] via-[#0B172A]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8F0] via-transparent to-transparent opacity-80" />
        </motion.div>

        {/* Tricolor Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#F5C518] text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              📜 Historical Archives &middot; 162 Years of Innovation
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              <span className="text-xs sm:text-sm font-mono font-bold text-[#C9A84C] tracking-[0.25em] uppercase block mb-2">
                Macromolecular Heritage
              </span>
              The Materials That
              <span className="block bg-gradient-to-r from-[#C9A84C] via-[#F5C518] to-[#FF9933] bg-clip-text text-transparent">
                Remade Human Civilization
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              From Parkesine in 1862 to Ziegler-Natta stereoregular catalysis and 2026 enzymatic recycling &mdash; explore the breakthroughs that shaped modern industrial engineering.
            </p>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              {[
                { value: '162', label: 'Years of History', icon: <Clock className="h-4 w-4 text-[#F5C518]" /> },
                { value: '7', label: 'Epochal Chapters', icon: <Layers className="h-4 w-4 text-[#F5C518]" /> },
                { value: '216+', label: 'Connected Lessons', icon: <BookOpen className="h-4 w-4 text-[#F5C518]" /> },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15 shadow-sm">
                  {stat.icon}
                  <div>
                    <p className="text-white font-bold text-base sm:text-lg font-mono leading-none">{stat.value}</p>
                    <p className="text-white/60 text-[10px] sm:text-xs font-mono uppercase mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TIMELINE INTERACTIVE WORKSPACE */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#C9A84C]/30 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8 relative"
        >
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[#FF9933] via-[#C9A84C] to-[#138808] rounded-full opacity-60" />

          <div className="relative z-10 pt-2">
            
            {/* ===== TIMELINE NODE TRACK ===== */}
            <div className="relative mb-8 pt-4">
              <div className="absolute top-[38px] left-0 right-0 h-0.5 bg-[#E2E8F0] -translate-y-1/2 hidden md:block" />
              <div 
                className="absolute top-[38px] left-0 h-0.5 bg-gradient-to-r from-[#C9A84C] to-[#F5C518] -translate-y-1/2 transition-all duration-500 hidden md:block"
                style={{ width: `${(currentEra / (totalEras - 1)) * 100}%` }}
              />

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 relative">
                {ERAS.map((e, index) => {
                  const isActive = index === currentEra
                  return (
                    <button
                      key={e.id}
                      onClick={() => goToEra(index)}
                      className={`
                        flex flex-col items-center gap-1 group relative z-10 p-1.5 rounded-xl transition-all
                        ${isActive ? 'scale-105' : 'hover:scale-102 opacity-75 hover:opacity-100'}
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-mono font-bold
                        border-2 transition-all duration-300 shadow-xs
                        ${isActive 
                          ? 'bg-[#C9A84C] border-[#C9A84C] text-slate-950 shadow-[0_0_16px_rgba(201,168,76,0.4)]' 
                          : 'bg-[#FDF8F0] border-[#E2E8F0] text-[#64748B] group-hover:border-[#C9A84C]'
                        }
                      `}>
                        {e.year.replace(/s$/, '').replace('-', '').slice(-2)}
                      </div>

                      <span className={`text-[11px] font-bold font-mono transition-colors text-center ${isActive ? 'text-[#C9A84C]' : 'text-slate-700'}`}>
                        {e.label}
                      </span>
                      <span className="text-[9px] text-[#94A3B8] font-mono truncate max-w-[80px]">
                        {e.sublabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ===== PREV / NEXT CONTROLS ===== */}
            <div className="flex items-center justify-between gap-4 mb-8 pt-2 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentEra === 0}
                className={`
                  px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5
                  ${currentEra === 0 
                    ? 'border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed bg-slate-50' 
                    : 'border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-slate-950'
                  }
                `}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Epoch
              </button>

              <span className="text-xs font-mono font-bold text-[#C9A84C]">
                ERA {String(currentEra + 1).padStart(2, '0')} OF {String(totalEras).padStart(2, '0')} &middot; {era.year}
              </span>

              <button
                type="button"
                onClick={goNext}
                disabled={currentEra === totalEras - 1}
                className={`
                  px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5
                  ${currentEra === totalEras - 1 
                    ? 'border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed bg-slate-50' 
                    : 'border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-slate-950'
                  }
                `}
              >
                Next Epoch
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* ===== ACTIVE ERA CONTENT ===== */}
            <AnimatePresence mode="wait">
              <motion.div
                key={era.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-8"
              >
                {/* Left Column (2/5): Media & Fast Facts */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 lg:h-80 bg-slate-950 shadow-md">
                    <Image
                      src={era.image}
                      alt={era.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[#F5C518] p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/20">
                          {era.iconSvg}
                        </span>
                        <div>
                          <p className="text-amber-400 text-xs font-mono font-bold">{era.year}</p>
                          <p className="text-white font-bold text-base">{era.title}</p>
                        </div>
                      </div>
                    </div>

                    {era.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F5C518] text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Star className="h-3 w-3 fill-slate-950" />
                        Nobel Landmark
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {era.events.map((event, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-[#FDF8F0] border border-[#C9A84C]/25 text-[#475569] text-xs font-mono">
                        {event}
                      </span>
                    ))}
                  </div>

                  {/* Key Figures */}
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                    <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider font-bold">Key Pioneer Scientists</p>
                    <p className="text-xs font-bold text-[#111827] mt-1 font-mono">{era.people.join(' · ')}</p>
                  </div>

                  {/* Industrial Impact */}
                  <div className="p-3.5 bg-[#FDF8F0] border border-[#C9A84C]/30 rounded-2xl">
                    <p className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-wider font-bold">Industrial Transformation</p>
                    <p className="text-xs text-[#111827] mt-1 font-medium leading-relaxed">{era.impact}</p>
                  </div>
                </div>

                {/* Right Column (3/5): Deep Technical Insights */}
                <div className="lg:col-span-3 space-y-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                      {era.subtitle}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-xs font-mono font-bold text-[#64748B]">{era.year} Epoch</span>
                    </div>
                  </div>

                  {/* Historical Narrative */}
                  <div className="p-5 bg-[#FDF8F0] rounded-2xl border border-[#C9A84C]/25 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-xs font-mono font-bold text-[#C9A84C] uppercase tracking-wider">Historical Context</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">{era.description}</p>
                  </div>

                  {/* Engineering & Chemistry Mechanism */}
                  <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200/80 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Microscope className="h-4 w-4 text-[#2563EB]" />
                      <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Engineering &amp; Chemical Mechanism</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">{era.insight}</p>
                  </div>

                  {/* Timeline Milestones */}
                  <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4 text-[#F5C518]" />
                      <span className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider">Key Chronological Milestones</span>
                    </div>
                    <ul className="space-y-2.5">
                      {era.milestones.map((milestone, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475569]">
                          <span className="text-[#C9A84C] font-mono font-bold text-xs shrink-0 mt-0.5">{milestone.year} &rarr;</span>
                          <span className="leading-relaxed">{milestone.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* "THE NEXT CHAPTER" SECTION */}
      {/* ============================================================ */}
      <section className="bg-[#0B172A] py-20 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#F5C518] text-xs font-mono font-bold tracking-[0.25em] uppercase block mb-2">The Story Continues</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The Next Chapter Is Yours
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-light leading-relaxed">
              Vitrimers, self-healing polymers, enzymatic depolymerization loops &mdash; the next industrial breakthroughs will be authored by Indian engineers mastering the science right here.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <GraduationCap className="h-7 w-7 text-[#F5C518]" />,
                title: '19 Core Subjects',
                subtitle: 'Master The Foundations',
                description: 'Explore step-growth kinetics, rheology, and injection thermodynamics.',
                href: '/subjects',
              },
              {
                icon: <FlaskConical className="h-7 w-7 text-[#38BDF8]" />,
                title: 'Materials Database',
                subtitle: '50+ Resin Grades',
                description: 'Inspect ASTM mechanical tensile, flexural, and melt flow properties.',
                href: '/materials',
              },
              {
                icon: <Brain className="h-7 w-7 text-[#4ADE80]" />,
                title: 'AI Tutor Specialist',
                subtitle: 'Grounded RAG Intelligence',
                description: 'Get instant derivations and defect root-cause explanations on demand.',
                href: '/ai-tutor',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 text-center hover:bg-white/15 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/10 border border-white/15">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-[#C9A84C] text-xs font-mono mt-0.5 font-bold">{item.subtitle}</p>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed font-light">{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center justify-center gap-1 mt-6 text-xs font-mono font-bold uppercase tracking-wider text-[#F5C518] hover:underline"
                >
                  Explore Now
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-slate-400 text-xs sm:text-sm mb-4 font-mono">
              &ldquo;What will you engineer next in polymer science?&rdquo;
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(245,197,24,0.35)] transition-all text-sm font-mono uppercase tracking-wider"
            >
              Start Your Journey Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SOURCES & ACADEMIC CITATIONS BAR */}
      {/* ============================================================ */}
      <section className="bg-[#FDF8F0] py-6 border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#C9A84C]" />
              Sources: Nobel Foundation &middot; ACS Publications &middot; IUPAC Macromolecular Division
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#16A34A]" />
              Peer-Reviewed for Engineering Education
            </span>
          </div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}
