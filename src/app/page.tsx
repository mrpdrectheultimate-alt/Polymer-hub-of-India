'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Play, 
  ChevronRight, 
  Shield, 
  Sparkles, 
  Award
} from 'lucide-react'
import Footer from '@/components/Footer'

// 19 Subjects with clean colors
const SUBJECTS = [
  { 
    id: 'polymer-chemistry',
    name: 'Polymer Chemistry', 
    icon: '🧪', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 15,
    description: 'Synthesis, kinetics, Tg, molecular weight distribution, and applications'
  },
  { 
    id: 'polymer-processing',
    name: 'Polymer Processing', 
    icon: '⚙️', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 20,
    description: 'Extrusion, injection molding, blow molding, and thermoforming'
  },
  { 
    id: 'mould-design',
    name: 'Mould Design', 
    icon: '🔧', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 12,
    description: 'Gate & runner layout, cooling thermodynamics, and CAD simulation'
  },
  { 
    id: 'polymer-testing',
    name: 'Polymer Testing', 
    icon: '📊', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 10,
    description: 'Tensile, impact, DSC, TGA, DMA, and Shore hardness standards'
  },
  { 
    id: 'rubber-technology',
    name: 'Rubber Technology', 
    icon: '⚡', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 9,
    description: 'Vulcanization chemistry, carbon black, and tyre manufacturing'
  },
  { 
    id: 'sustainable-plastics',
    name: 'Sustainable Plastics', 
    icon: '♻️', 
    color: '#16A34A',
    bgColor: '#F0FDF4',
    lessons: 18,
    description: 'PLA, PHA, bio-PE, and circular mono-material barrier formulations'
  },
  { 
    id: 'medical-plastics',
    name: 'Medical Plastics', 
    icon: '🏥', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 12,
    description: 'ISO 10993 biocompatibility, drug delivery, and cleanroom molding'
  },
  { 
    id: 'plastic-packaging-engineering',
    name: 'Plastic Packaging', 
    icon: '📦', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 16,
    description: 'Barrier EVOH co-extrusion, PET bottle blowing, and food contact'
  },
  { 
    id: 'additives-compounding',
    name: 'Additives & Compounding', 
    icon: '🧬', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 16,
    description: 'Antioxidants, UV stabilizers, plasticizers, and twin-screw mixing'
  },
  { 
    id: 'polymer-composites',
    name: 'Composites', 
    icon: '🧪', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 16,
    description: 'Carbon & glass fibre reinforcement, autoclave CFRP, and lightweighting'
  },
  { 
    id: 'polymer-rheology',
    name: 'Rheology & Flow', 
    icon: '🌊', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 9,
    description: 'Non-Newtonian flow, shear-thinning viscosity, and die swell physics'
  },
  { 
    id: 'polymer-nanotechnology',
    name: 'Polymer Nanotechnology', 
    icon: '🔬', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 6,
    description: 'Carbon nanotubes, exfoliated graphene, and nano-barrier enhancement'
  },
  { 
    id: 'bioprocessing-fermentation',
    name: 'Bioprocessing', 
    icon: '🧫', 
    color: '#16A34A',
    bgColor: '#F0FDF4',
    lessons: 6,
    description: 'Microbial fermentation, enzymes, and bio-based polymer production'
  },
  { 
    id: 'robotics-plastics',
    name: 'Robotics in Manufacturing', 
    icon: '🤖', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 6,
    description: 'Cartesian retrieval robots, ultrasonic degating, and plant automation'
  },
  { 
    id: 'digital-twins-plastics',
    name: 'Digital Twins & AI', 
    icon: '💻', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 6,
    description: 'Cavity pressure sensors, 3D printing, and predictive ML maintenance'
  },
  { 
    id: 'color-science-masterbatches',
    name: 'Color Science & Masterbatch', 
    icon: '🎨', 
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 8,
    description: 'CIELAB color space, TiO2 dispersion, and pigment masterbatching'
  },
  { 
    id: 'life-cycle-assessment',
    name: 'Life Cycle Assessment', 
    icon: '🌍', 
    color: '#16A34A',
    bgColor: '#F0FDF4',
    lessons: 8,
    description: 'ISO 14040, cradle-to-grave carbon footprinting, and EPR offsets'
  },
  { 
    id: 'entrepreneurship-plastics',
    name: 'Entrepreneurship', 
    icon: '💼', 
    color: '#F5C518',
    bgColor: '#FFFBEB',
    lessons: 11,
    description: 'Plastics business setup, PMEGP/MUDRA financing, and BIS norms'
  },
  { 
    id: 'recycling-technology',
    name: 'Recycling Technology', 
    icon: '♻️', 
    color: '#16A34A',
    bgColor: '#F0FDF4',
    lessons: 12,
    description: 'NIR optical sorting, chemical pyrolysis, and circular recycling'
  },
]

const STATS = [
  { value: '216+', label: 'Lessons', icon: BookOpen },
  { value: '19', label: 'Subjects', icon: GraduationCap },
  { value: '357+', label: 'Videos', icon: Play },
  { value: '5,000+', label: 'Engineers', icon: Users },
]

const TOOLS = [
  { 
    name: 'Defect Troubleshooter', 
    icon: '🔧', 
    description: 'Diagnose sink marks, warpage, flash, and voids with root causes from Rosato', 
    href: '/troubleshooter', 
    color: '#2563EB' 
  },
  { 
    name: 'Polymer Comparator', 
    icon: '⚖️', 
    description: 'Compare 35+ polymer systems and 1,000+ TDS grades side-by-side', 
    href: '/comparator', 
    color: '#2563EB' 
  },
  { 
    name: 'Industrial Calculators', 
    icon: '🧮', 
    description: '8 engineering tools for clamping tonnage, cooling cycle time, and shrinkage', 
    href: '/calculators', 
    color: '#2563EB' 
  },
  { 
    name: 'Material Database', 
    icon: '📊', 
    description: '35+ base polymers with complete ASTM properties and Indian brand equivalents', 
    href: '/materials', 
    color: '#2563EB' 
  },
]

const INDUSTRIES = [
  { name: 'Automotive & EV', slug: 'automotive', icon: '🚗', color: '#2563EB', bgColor: '#EFF6FF', desc: 'Under-the-hood PA66, bumper PP compounds, battery flame-retardant blends.' },
  { name: 'Medical Devices', slug: 'medical', icon: '🏥', color: '#2563EB', bgColor: '#EFF6FF', desc: 'ISO 10993 biocompatible PEEK implants, gamma-sterilized syringes.' },
  { name: 'Circular Packaging', slug: 'packaging', icon: '♻️', color: '#16A34A', bgColor: '#F0FDF4', desc: '7-layer EVOH high barrier films and 100% rPET preform blowing.' },
  { name: 'Aerospace Composites', slug: 'aerospace', icon: '🚀', color: '#2563EB', bgColor: '#EFF6FF', desc: 'Autoclave-cured CFRP prepregs for ISRO rocket fairings and fuselages.' },
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image: 3 Students in Polymer Lab */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/students-polymer-lab.jpg"
            alt="Students innovating with polymers in state-of-the-art laboratory"
            fill
            className="object-cover object-center"
            priority
          />
          {/* High-legibility Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/50" />
          {/* Smooth bottom blend */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
        </div>

        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#16A34A]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-mono font-bold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              🔬 India&apos;s Premier Polymer Education Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] tracking-tight"
            >
              Where Polymers{' '}
              <span className="block bg-gradient-to-r from-[#FF8A00] via-white to-[#16A34A] bg-clip-text text-transparent">
                Shape Tomorrow
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-white/85 mt-4 max-w-2xl leading-relaxed font-light"
            >
              Master the molecular science, shop-floor manufacturing parameters, and global trade dynamics 
              of plastics, elastomers, and composites — crafted for India&apos;s next generation of engineers.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 sm:gap-6 mt-8"
            >
              {STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/15 shadow-sm">
                    <span className="text-amber-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-white font-bold text-lg">{stat.value}</p>
                      <p className="text-white/60 text-xs font-mono">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 text-sm"
              >
                Start Learning Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/subjects"
                className="px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/25 transition-all flex items-center gap-2 text-sm"
              >
                Explore 19 Subjects
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 text-xs text-white/70 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#16A34A]" />
                DPDP 2023 Compliant
              </span>
              <span className="w-px h-3.5 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#16A34A]" />
                AES-256 Encrypted
              </span>
              <span className="w-px h-3.5 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#F5C518]" />
                100% Legal &amp; Audited
              </span>
              <span className="w-px h-3.5 bg-white/20" />
              <span className="flex items-center gap-1.5">🇮🇳 Made in India</span>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ==================== SUBJECTS ==================== */}
      <section className="bg-[#FAFAFA] py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Curriculum</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">19 Subjects &middot; 216 Lessons</h2>
                <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Complete polymer engineering curriculum mapped to GATE XE-F and industrial needs</p>
              </div>
              <Link href="/subjects" className="text-xs font-mono font-bold text-[#2563EB] hover:underline flex items-center gap-1 uppercase tracking-wider">
                View All Subjects <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {SUBJECTS.map((subject, index) => (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer h-full flex flex-col justify-between"
                  style={{ borderColor: `${subject.color}30` }}
                >
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
                          style={{ backgroundColor: subject.bgColor }}
                        >
                          {subject.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="font-bold text-sm truncate"
                            style={{ color: subject.color }}
                          >
                            {subject.name}
                          </h3>
                          <p className="text-[#94A3B8] text-[10px] font-mono">{subject.lessons} lessons</p>
                        </div>
                      </div>
                      <p className="text-[#64748B] text-xs line-clamp-2 leading-relaxed">{subject.description}</p>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                      <span 
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"
                        style={{ backgroundColor: `${subject.color}10`, color: subject.color }}
                      >
                        {subject.lessons > 10 ? 'Advanced' : 'Core'}
                      </span>
                      <span className="text-xs text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all">→</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TOOLS ==================== */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-xs font-mono font-bold text-[#F5C518] uppercase tracking-wider">Engineering Tools</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">Calculate &middot; Diagnose &middot; Compare</h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Real-world engineering solutions tailored for shop-floor plastics manufacturing</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TOOLS.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-bold text-[#111827] text-base">{tool.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{tool.description}</p>
                </div>
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-[#2563EB] hover:underline uppercase font-mono tracking-wider"
                >
                  Use Tool <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== INDUSTRIES ==================== */}
      <section className="bg-[#FAFAFA] py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider">Applied Sectors</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">The World of Plastics</h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Explore how polymer engineering shapes global industrial supply chains</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {INDUSTRIES.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all text-center flex flex-col justify-between"
                style={{ borderColor: `${industry.color}30` }}
              >
                <div>
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm"
                    style={{ backgroundColor: industry.bgColor }}
                  >
                    {industry.icon}
                  </div>
                  <h3 className="font-bold text-[#111827] text-base">{industry.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed font-normal">{industry.desc}</p>
                </div>
                <Link
                  href={`/world/${industry.slug}`}
                  className="inline-flex items-center justify-center gap-1 mt-4 text-xs font-mono font-bold text-[#2563EB] hover:underline uppercase tracking-wider"
                >
                  Explore Sector <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AI TUTOR ==================== */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-[#2563EB] via-blue-600 to-[#16A34A] rounded-3xl p-8 sm:p-12 overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="h-3 w-3 text-[#F5C518]" />
                  Gemini RAG AI Tutor
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Ask Anything. Get Rigorous Engineering Answers.
                </h3>
                <p className="text-white/90 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                  Powered by 216+ curriculum lessons via real RAG pipeline. Calibrated for undergraduate &amp; shop-floor problem solving.
                </p>
              </div>
              <Link
                href="/ai-tutor"
                className="px-8 py-3.5 rounded-xl font-bold text-[#111827] bg-white hover:bg-[#F8FAFC] hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg text-sm flex-shrink-0"
              >
                Ask AI Tutor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== QUOTE ==================== */}
      <section className="bg-[#FAFAFA] py-12 border-t border-[#F1F5F9]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl text-[#94A3B8] font-serif leading-none">&ldquo;</span>
            <p className="text-lg sm:text-xl md:text-2xl text-[#111827] font-light leading-relaxed italic -mt-2">
              Polymers are the workhorses of modern civilization &mdash; invisible, indispensable, misunderstood.
            </p>
            <p className="text-[#94A3B8] mt-2 text-xs font-mono uppercase tracking-widest">&mdash; Robert F. Browning, Polymeria</p>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <Footer />
    </div>
  )
}
