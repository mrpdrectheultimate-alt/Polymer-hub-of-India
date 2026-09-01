'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  ArrowRight
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== DATA ====================

const ERAS = [
  {
    id: 'parkesine',
    label: '1862',
    sublabel: 'Foundation',
    year: '1862',
    title: 'Parkesine',
    subtitle: 'The First Man-Made Plastic',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    color: '#8B7355',
    icon: '🧪',
    description: 'Alexander Parkes unveils Parkesine, the first man-made plastic — an organic material derived from cellulose that could be heated, molded, and retained its shape when cooled.',
    insight: 'This marked the beginning of the polymer age. Parkesine proved that synthetic materials could replace natural ones, opening the door to a new era of material science.',
    milestones: [
      { year: '1862', text: 'Alexander Parkes demonstrates Parkesine at the Great Exhibition in London' },
      { year: '1869', text: 'John Wesley Hyatt creates Celluloid, the first commercially successful plastic' },
    ],
  },
  {
    id: 'bakelite',
    label: '1907',
    sublabel: 'Synthetic Era',
    year: '1907',
    title: 'Bakelite',
    subtitle: 'The First Fully Synthetic Plastic',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    color: '#6B4226',
    icon: '⚡',
    description: 'Leo Baekeland creates Bakelite, the first fully synthetic plastic — a phenol-formaldehyde resin that was heat-resistant, non-conductive, and could be mass-produced.',
    insight: 'Bakelite was the first plastic made entirely from synthetic molecules. It revolutionized the electrical and automotive industries, replacing expensive natural materials.',
    milestones: [
      { year: '1907', text: 'Leo Baekeland patents Bakelite, creating the first fully synthetic polymer' },
      { year: '1920s', text: 'Bakelite becomes ubiquitous in radios, telephones, and automotive parts' },
    ],
  },
  {
    id: 'nylon',
    label: '1935',
    sublabel: 'Age of Fibers',
    year: '1935',
    title: 'Nylon 6,6',
    subtitle: 'The First Fully Synthetic Fiber',
    image: 'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1200&q=80',
    color: '#1A365D',
    icon: '🧵',
    description: 'Wallace Carothers at DuPont develops the first fully synthetic fiber — nylon 6,6 — used in WWII parachutes, tyre cords, and engineering gears.',
    insight: 'Nylon demonstrated that polymers could be engineered at the molecular level. This launched the synthetic fiber industry and forever changed the textile world.',
    milestones: [
      { year: '1935', text: 'Wallace Carothers invents nylon 6,6 at DuPont' },
      { year: '1940', text: 'Nylon stockings debut, selling 64 million pairs in one year' },
      { year: '1941-45', text: 'Nylon used extensively in WWII parachutes, ropes, and tires' },
    ],
  },
  {
    id: 'ziegler-natta',
    label: '1953-54',
    sublabel: 'Super Plastic',
    year: '1953-54',
    title: 'Ziegler-Natta',
    subtitle: 'Stereospecific Catalysis & Polyolefin Revolution',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    color: '#1A365D',
    icon: '🔬',
    featured: true,
    description: 'Karl Ziegler and Giulio Natta discover coordination catalysts enabling stereospecific polymerization of ethylene and propylene at low temperatures and pressures.',
    insight: 'Unlike free-radical processes that produce branched polymers (LDPE), Ziegler-Natta catalysts generate high-density linear polyethylene (HDPE) and isotactic polypropylene (iPP) with controlled tacticity and dense crystalline packing.',
    milestones: [
      { year: '1953', text: 'Karl Ziegler discovers titanium/aluminum catalysts to polymerize ethylene at atmospheric pressure' },
      { year: '1954', text: 'Giulio Natta uses the catalyst to synthesize stereoregular isotactic polypropylene' },
      { year: '1956', text: 'William H. Willert patents the reciprocating screw injection unit, revolutionizing melt consistency' },
      { year: '1963', text: 'Karl Ziegler and Giulio Natta are jointly awarded the Nobel Prize in Chemistry' },
    ],
  },
  {
    id: 'engineering',
    label: '1970s',
    sublabel: 'Green Polymer',
    year: '1970s',
    title: 'Engineering Plastics',
    subtitle: 'The Performance Revolution',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    color: '#2C3E50',
    icon: '🏗️',
    description: 'Polycarbonate (PC), POM, and PBT enter the market — enabling high-performance automotive, electronics, and medical applications.',
    insight: 'Engineering plastics offered strength, heat resistance, and dimensional stability that commodity plastics couldn\'t match, opening new markets in automotive, aerospace, and electronics.',
    milestones: [
      { year: '1970s', text: 'Polycarbonate (PC) becomes widely used in automotive and electronics' },
      { year: '1980s', text: 'Engineering plastics replace metals in countless applications' },
    ],
  },
  {
    id: 'biopolymers',
    label: '1990s',
    sublabel: 'Smart Plastic',
    year: '1990s',
    title: 'Biopolymers',
    subtitle: 'The Sustainability Era',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
    color: '#2D6A4F',
    icon: '🌱',
    description: 'PLA, PHA, and starch-based polymers emerge as the first wave of sustainable alternatives to fossil-fuel plastics.',
    insight: 'The shift toward sustainability began with bio-based feedstocks and biodegradable polymers, now one of the fastest-growing segments of the polymer industry.',
    milestones: [
      { year: '1990s', text: 'PLA and PHA begin commercial production' },
      { year: '2000s', text: 'Starch-based polymers enter packaging and agricultural markets' },
    ],
  },
  {
    id: 'future',
    label: '2020s',
    sublabel: 'Next Epoch',
    year: '2020s',
    title: 'Smart Polymers',
    subtitle: 'Circularity & Self-Healing Materials',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&q=80',
    color: '#2563EB',
    icon: '♻️',
    description: 'Vitrimers, self-healing composites, enzymatic depolymerization, and chemical recycling — the next chapter of polymer science.',
    insight: 'The future lies in circularity and functionality. Smart polymers that respond to stimuli, self-healing materials, and fully recyclable thermosets are reshaping the industry.',
    milestones: [
      { year: '2010s', text: 'Vitrimers and self-healing polymers emerge' },
      { year: '2020s', text: 'Enzymatic depolymerization and advanced chemical recycling scale up' },
    ],
  },
]

export default function HistoryPage() {
  const [currentEra, setCurrentEra] = useState(3)
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
    <div className="min-h-screen bg-[#FDF8F0] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Clean, Cinematic Vintage */}
      {/* ============================================================ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[#0B172A]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1600&q=80"
            alt="History of polymers"
            fill
            className="object-cover opacity-20 filter sepia contrast-125"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B172A] via-[#0B172A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8F0] via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-[#8B6914]/10 mix-blend-overlay" />
        </motion.div>

        {/* Tricolor Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#F5C518] text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              📜 Historical Archive
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
              The Materials That
              <span className="block bg-gradient-to-r from-[#C9A84C] via-[#F5C518] to-[#FF9933] bg-clip-text text-transparent pb-3 pt-1 leading-[1.15]">
                Remade Human Civilization
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              From Parkesine in 1862 to Ziegler-Natta stereoregular catalysis and 2026 enzymatic recycling — 
              explore the breakthroughs that shaped modern industrial engineering.
            </p>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              {[
                { value: '162', label: 'Years of History', icon: <Clock className="h-4 w-4 text-[#F5C518]" /> },
                { value: '7', label: 'Eras', icon: <Layers className="h-4 w-4 text-[#F5C518]" /> },
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
      {/* TIMELINE + ERA CONTENT */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-16">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#C9A84C]/30 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-6 md:p-8 relative"
        >
          {/* Tricolor Accent */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[#FF9933] via-[#C9A84C] to-[#138808] opacity-60 rounded-full" />

          <div className="relative z-10 pt-2">
            
            {/* Timeline Navigation Bar */}
            <div className="relative mb-8 pt-4">
              <div className="absolute top-[34px] left-0 right-0 h-0.5 bg-[#E2E8F0] -translate-y-1/2 hidden md:block" />
              <div 
                className="absolute top-[34px] left-0 h-0.5 bg-gradient-to-r from-[#C9A84C] to-[#F5C518] -translate-y-1/2 transition-all duration-500 hidden md:block"
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
                        w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-mono font-bold
                        border-2 transition-all duration-300 shadow-xs
                        ${isActive 
                          ? 'bg-[#C9A84C] border-[#C9A84C] text-slate-950 shadow-[0_0_20px_rgba(201,168,76,0.4)]' 
                          : 'bg-[#FDF8F0] border-[#E2E8F0] text-[#94A3B8] group-hover:border-[#C9A84C] group-hover:text-[#C9A84C]'
                        }
                      `}>
                        {e.label.replace(/s$/, '').replace('-', '').slice(-2)}
                      </div>
                      <span className={`
                        text-[10px] font-bold font-mono transition-colors text-center
                        ${isActive ? 'text-[#C9A84C]' : 'text-[#64748B] group-hover:text-[#C9A84C]'}
                      `}>
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

            {/* Prev/Next Controls */}
            <div className="flex items-center justify-between gap-4 mb-6 pt-2 border-t border-[#F1F5F9]">
              <button
                onClick={() => goToEra(currentEra - 1)}
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
                Previous
              </button>
              <span className="text-xs text-[#94A3B8] font-mono">
                {String(currentEra + 1).padStart(2, '0')} / {String(totalEras).padStart(2, '0')}
              </span>
              <button
                onClick={() => goToEra(currentEra + 1)}
                disabled={currentEra === totalEras - 1}
                className={`
                  px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5
                  ${currentEra === totalEras - 1 
                    ? 'border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed bg-slate-50' 
                    : 'border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-slate-950'
                  }
                `}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Era Content Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={era.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-8"
              >
                {/* Left: Image (2/5) */}
                <div className="lg:col-span-2">
                  <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 lg:h-80 bg-[#0B172A] shadow-md">
                    <Image
                      src={era.image}
                      alt={era.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-amber-400 text-xs font-mono font-bold">{era.year}</p>
                      <p className="text-white font-bold text-base">{era.subtitle}</p>
                    </div>
                    {era.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F5C518] text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                        ⭐ Featured Landmark
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Content (3/5) */}
                <div className="lg:col-span-3 space-y-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                      {era.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-xs text-[#64748B] font-mono font-bold">{era.year}</span>
                    </div>
                  </div>

                  {/* Historical Context */}
                  <div className="p-4 bg-[#FDF8F0] rounded-2xl border border-[#C9A84C]/25 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-xs font-mono font-bold text-[#C9A84C] uppercase tracking-wider">Historical Context</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">{era.description}</p>
                  </div>

                  {/* Engineering Insight */}
                  <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Microscope className="h-4 w-4 text-[#2563EB]" />
                      <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Engineering &amp; Chemical Mechanism</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{era.insight}</p>
                  </div>

                  {/* Milestones */}
                  <div className="p-4 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-[#F5C518]" />
                      <span className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider">Key Chronological Milestones</span>
                    </div>
                    <ul className="space-y-2">
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
      {/* QUOTE / INSPIRATION — Clean, No Distracting Boxes */}
      {/* ============================================================ */}
      <section className="bg-[#0B172A] py-20 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-5xl text-[#C9A84C] leading-none block mb-4 font-mono">&ldquo;</span>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light leading-relaxed italic max-w-2xl mx-auto">
              The next chapters &mdash; vitrimers, self-healing polymers, enzymatic depolymerization loops &mdash; 
              will be written by engineers starting right here.
            </p>
            <p className="text-[#C9A84C] mt-4 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
              &mdash; PolymerHub Historical Archive
            </p>

            <div className="mt-8">
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#F5C518] transition-colors text-xs sm:text-sm font-mono font-bold uppercase tracking-wider"
              >
                Explore the curriculum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* GLOBAL FOOTER */}
      {/* ============================================================ */}
      <Footer />

    </div>
  )
}
