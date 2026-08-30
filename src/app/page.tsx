'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Play,
  ChevronRight, 
  Sparkles, 
  CheckCircle,
  Factory,
  Target,
  Cpu,
  Brain,
  ShieldCheck
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== DATA ====================

const FEATURED_SUBJECTS = [
  { id: 'polymer-chemistry', name: 'Polymer Chemistry', icon: '🧪', lessons: 15, level: 'Foundation', description: 'Synthesis, kinetics, molecular weight distribution, and structure-property relationships' },
  { id: 'polymer-processing', name: 'Polymer Processing', icon: '⚙️', lessons: 20, level: 'Core', description: 'Extrusion, injection molding, blow molding, and thermoforming parameters' },
  { id: 'mould-design', name: 'Mould Design', icon: '🔧', lessons: 12, level: 'Advanced', description: 'Runner systems, gate design, cooling thermodynamics, and CAD simulation' },
  { id: 'polymer-testing', name: 'Polymer Testing', icon: '📊', lessons: 10, level: 'Core', description: 'Tensile, impact, DSC, TGA, DMA, and Shore hardness ASTM standards' },
  { id: 'polymer-composites', name: 'Composites', icon: '🧪', lessons: 16, level: 'Advanced', description: 'CFRP prepregs, carbon fibers, autoclave curing, and lightweighting' },
  { id: 'sustainable-plastics', name: 'Sustainable Plastics', icon: '♻️', lessons: 18, level: 'Advanced', description: 'PLA, PHA, bio-PE, and circular mono-material barrier formulations' },
]

const ALL_SUBJECTS = [
  ...FEATURED_SUBJECTS,
  { id: 'rubber-technology', name: 'Rubber Technology', icon: '⚡', lessons: 9, level: 'Core', description: 'Vulcanization chemistry, elastomers, and tyre manufacturing' },
  { id: 'medical-plastics', name: 'Medical Plastics', icon: '🏥', lessons: 12, level: 'Advanced', description: 'ISO 10993 biocompatibility, drug delivery, and cleanroom molding' },
  { id: 'plastic-packaging-engineering', name: 'Plastic Packaging', icon: '📦', lessons: 16, level: 'Advanced', description: 'Barrier EVOH co-extrusion, PET bottle blowing, and food contact' },
  { id: 'additives-compounding', name: 'Additives & Compounding', icon: '🧬', lessons: 16, level: 'Advanced', description: 'Antioxidants, UV stabilizers, plasticizers, and twin-screw mixing' },
  { id: 'polymer-rheology', name: 'Rheology & Flow', icon: '🌊', lessons: 9, level: 'Core', description: 'Non-Newtonian flow, shear-thinning viscosity, and die swell physics' },
  { id: 'polymer-nanotechnology', name: 'Polymer Nanotech', icon: '🔬', lessons: 6, level: 'Core', description: 'Carbon nanotubes, exfoliated graphene, and nano-barrier enhancement' },
  { id: 'bioprocessing-fermentation', name: 'Bioprocessing', icon: '🧫', lessons: 6, level: 'Core', description: 'Microbial fermentation, enzymes, and bio-based polymer production' },
  { id: 'robotics-plastics', name: 'Robotics in Mfg', icon: '🤖', lessons: 6, level: 'Core', description: 'Cartesian retrieval robots, ultrasonic degating, and plant automation' },
  { id: 'digital-twins-plastics', name: 'Digital Twins & AI', icon: '💻', lessons: 6, level: 'Core', description: 'Cavity pressure sensors, 3D printing, and predictive ML maintenance' },
  { id: 'color-science-masterbatches', name: 'Color Science', icon: '🎨', lessons: 8, level: 'Core', description: 'CIELAB color space, TiO2 dispersion, and pigment masterbatching' },
  { id: 'life-cycle-assessment', name: 'Life Cycle Assessment', icon: '🌍', lessons: 6, level: 'Core', description: 'ISO 14040, cradle-to-grave carbon footprinting, and EPR offsets' },
  { id: 'entrepreneurship-plastics', name: 'Entrepreneurship', icon: '💼', lessons: 11, level: 'Core', description: 'Plastics business setup, PMEGP/MUDRA financing, and BIS norms' },
  { id: 'recycling-technology', name: 'Recycling Technology', icon: '♻️', lessons: 12, level: 'Core', description: 'NIR optical sorting, chemical pyrolysis, and circular recycling' },
]

const STATS = [
  { value: '216', label: 'Lessons', icon: <BookOpen className="h-5 w-5" /> },
  { value: '19', label: 'Subjects', icon: <GraduationCap className="h-5 w-5" /> },
  { value: '357+', label: 'Videos', icon: <Play className="h-5 w-5" /> },
  { value: '5,000+', label: 'Community Learners', icon: <Users className="h-5 w-5" /> },
]

const TOOLS = [
  { name: 'Defect Troubleshooter', icon: '🔧', description: 'Diagnose sink marks, warpage, flash, and voids with root causes from Rosato', href: '/troubleshooter' },
  { name: 'Polymer Comparator', icon: '⚖️', description: 'Compare 35+ polymer systems and 1,000+ TDS grades side-by-side', href: '/comparator' },
  { name: 'Industrial Calculators', icon: '🧮', description: '8 engineering tools for clamping tonnage, cooling cycle time, and shrinkage', href: '/calculators' },
  { name: 'Material Database', icon: '📊', description: '35+ base polymers with complete ASTM properties and Indian brand equivalents', href: '/materials' },
]

const INDUSTRIES = [
  { name: 'Automotive & EV', slug: 'automotive', icon: '🚗', description: 'Under-the-hood PA66, bumper PP compounds, and battery flame retardants' },
  { name: 'Medical Devices', slug: 'medical', icon: '🏥', description: 'ISO 10993 biocompatible PEEK implants & gamma-sterilized syringes' },
  { name: 'Circular Packaging', slug: 'packaging', icon: '♻️', description: '7-layer EVOH high barrier films and 100% rPET preform blowing' },
  { name: 'Aerospace Composites', slug: 'aerospace', icon: '🚀', description: 'Autoclave-cured CFRP prepregs for ISRO rocket fairings and fuselages' },
]

const PILLARS = [
  {
    title: 'GATE XE-F & CIPET Syllabus',
    desc: 'Structured across 19 subjects covering step-growth kinetics, rheology, viscoelastic constitutive models, and mould design.',
    icon: '🎓'
  },
  {
    title: 'ASTM / ISO Virtual Test Benches',
    desc: 'Interactive stress-strain tensile curves, non-Newtonian melt rheology models, and mold cooling cycle calculators.',
    icon: '📊'
  },
  {
    title: 'RAG-Grounded AI Engineering Tutor',
    desc: 'Instant step-by-step mathematical derivations and troubleshooting advice grounded exclusively in the curriculum.',
    icon: '🧠'
  }
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAllSubjects, setShowAllSubjects] = useState(false)
  const [demoQuestion, setDemoQuestion] = useState('')

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const displayedSubjects = showAllSubjects ? ALL_SUBJECTS : FEATURED_SUBJECTS

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* HERO SECTION — CLEAN WHITE THEME & ULTRA PUNCHY HEADLINE */}
      {/* ============================================================ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/students-polymer-lab.jpg"
            alt="Students innovating with polymers in a modern laboratory"
            fill
            className="object-cover object-center opacity-85"
            priority
            sizes="100vw"
          />
          {/* Subtle White Gradient for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40" />
          {/* Smooth Bottom Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
          <motion.div
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
            }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E2E8F0] text-[#2563EB] text-xs sm:text-sm font-mono font-bold mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              🇮🇳 India&apos;s Premier Polymer Engineering Learning Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#111827] leading-[1.05] tracking-tight font-display"
            >
              Master Polymer Engineering.
              <span className="block bg-gradient-to-r from-[#2563EB] via-blue-700 to-[#16A34A] bg-clip-text text-transparent">
                From Molecules to Manufacturing.
              </span>
            </motion.h1>

            {/* Subtext — Shortened to 12 Words for High Impact */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-base sm:text-lg md:text-xl text-[#334155] max-w-2xl mt-4 leading-relaxed font-normal"
            >
              Master polymer science with structured lessons, engineering tools, and an AI copilot.
            </motion.p>

            {/* Stats Cards with Glassmorphism */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 max-w-2xl"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-4 rounded-2xl shadow-xs"
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{ duration: 3, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] font-display">{stat.value}</div>
                  <div className="text-xs text-[#64748B] mt-0.5 font-mono font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-xl font-mono font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-md transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
                >
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/subjects"
                  className="px-8 py-3.5 rounded-xl font-mono font-bold text-[#111827] bg-white/95 hover:bg-white border border-[#CBD5E1] transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-xs"
                >
                  Explore 19 Subjects
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Pills */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="flex flex-wrap items-center gap-3 mt-6 text-xs text-[#475569] font-medium"
            >
              <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs">
                <CheckCircle className="h-3.5 w-3.5 text-[#16A34A]" />
                Built in India
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs">
                <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
                Curriculum inspired by CIPET &amp; IIT syllabi
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs">
                <Cpu className="h-3.5 w-3.5 text-[#2563EB]" />
                Polymer AI Copilot
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#94A3B8] z-20 pointer-events-none"
        >
          <span className="text-[9px] font-mono uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 h-5 bg-[#94A3B8]/60 rounded-full"
          />
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* LEARNING PATHS: CHOOSE YOUR STARTING POINT */}
      {/* ============================================================ */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Choose Your Path</span>
            <h2 className="text-3xl font-bold font-display text-[#111827] mt-2">Where should you start?</h2>
            <p className="text-[#64748B] text-sm mt-1 max-w-2xl mx-auto">PolymerHub adapts to your goals &mdash; whether you are an undergraduate student, shop-floor professional, or GATE aspirant.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <GraduationCap className="h-7 w-7 text-[#2563EB]" />,
                title: '🎓 B.Tech & Diploma Student',
                description: 'Build fundamentals from scratch. Master core polymer chemistry, structure, and processing equations.',
                path: '/subjects'
              },
              {
                icon: <Factory className="h-7 w-7 text-[#2563EB]" />,
                title: '🏭 Industry Process Engineer',
                description: 'Solve real manufacturing defects on the shop floor with Rosato diagnostics and clamp tonnage calculators.',
                path: '/troubleshooter'
              },
              {
                icon: <Target className="h-7 w-7 text-[#2563EB]" />,
                title: '🎯 GATE XE-F Aspirant',
                description: 'Prepare systematically with topic-wise quizzes, formula flashcards, and full-length simulated mock tests.',
                path: '/gate-mock'
              }
            ].map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-6 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                    {path.icon}
                  </div>
                  <h3 className="text-lg font-bold font-display text-[#111827]">{path.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed font-sans">{path.description}</p>
                </div>
                <Link href={path.path} className="inline-flex items-center gap-1.5 mt-6 text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-700 transition-all group">
                  Start Path
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED & ALL SUBJECTS (WITH TOGGLE) */}
      {/* ============================================================ */}
      <section className="bg-[#FAFAFA] py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Curriculum Matrix</span>
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111827]">
                {showAllSubjects ? 'All 19 Polymer Subjects' : 'Featured Core Subjects'}
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">The core of polymer engineering &mdash; structured for deep conceptual clarity</p>
            </div>
            
            <button
              onClick={() => setShowAllSubjects(!showAllSubjects)}
              className="px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#2563EB] hover:bg-blue-50 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-xs"
            >
              {showAllSubjects ? 'Show Featured 6' : 'View All 19 Subjects (216 Lessons)'}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAllSubjects ? 'rotate-90' : ''}`} />
            </button>
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {displayedSubjects.map((subject) => (
                <motion.div
                  key={subject.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <Link href={`/subjects/${subject.id}`} className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                          {subject.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-[#111827] group-hover:text-[#2563EB] transition-colors font-display">
                            {subject.name}
                          </h3>
                          <p className="text-[#94A3B8] text-xs font-mono">{subject.lessons} lessons</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 leading-relaxed font-sans">{subject.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F1F5F9]">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200">
                        {subject.level}
                      </span>
                      <span className="text-xs font-mono text-[#2563EB] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* AI TUTOR: UNIFIED BLUE BACKGROUND */}
      {/* ============================================================ */}
      <section className="bg-[#1E40AF] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-8"
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Brain className="h-3.5 w-3.5 text-amber-300" />
                AI Tutor &middot; Powered by Your Curriculum
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-white leading-tight">
                Your Polymer Engineering Copilot
              </h2>
              <p className="text-white/85 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask technical questions and get answers grounded in PolymerHub&apos;s 216 curriculum lessons &mdash; 
                engineering-specific intelligence calibrated for exams and shop-floor diagnostics.
              </p>
              
              {/* Interactive Demo Chat Box */}
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 max-w-xl shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-400 flex items-center justify-center text-xs font-bold text-slate-950 font-mono">
                    AI
                  </div>
                  <span className="text-white text-xs font-mono font-bold">PolymerHub AI Specialist</span>
                  <span className="text-emerald-300 text-[10px] font-mono">● Online</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 mb-3 border border-white/10">
                  <p className="text-white/90 text-xs sm:text-sm">
                    <span className="text-amber-300 font-bold font-mono">You:</span> Why does increasing injection pressure sometimes cause flash?
                  </p>
                  <p className="text-white/90 text-xs sm:text-sm mt-2 leading-relaxed">
                    <span className="text-emerald-300 font-bold font-mono">AI:</span> Flash occurs when injection pressure exceeds the effective clamp tonnage across the projected area, forcing molten polymer into the parting line.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-white/60 font-mono">
                    <span>📘 Source:</span>
                    <span>Polymer Processing &middot; Lesson 12</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={demoQuestion}
                    onChange={(e) => setDemoQuestion(e.target.value)}
                    placeholder="Ask any polymer question (e.g. Carothers equation, MFI)..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300 font-sans"
                  />
                  <Link
                    href={`/ai-tutor?prompt=${encodeURIComponent(demoQuestion || 'Explain the Carothers equation for step-growth polymerization')}`}
                    className="px-4 py-2.5 rounded-xl bg-white text-[#2563EB] hover:bg-slate-100 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    Ask <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/ai-tutor"
                className="px-8 py-4 rounded-2xl font-mono font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all flex items-center gap-2 shadow-xl text-xs uppercase tracking-wider"
              >
                Launch AI Tutor Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ENGINEERING TOOLS: WITH PREVIEWS */}
      {/* ============================================================ */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Engineering Tools</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111827]">Calculate &middot; Diagnose &middot; Compare</h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Do not just learn theory &mdash; use it. These tools turn engineering calculations into actionable plant decisions.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TOOLS.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-6 hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{tool.icon}</div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-slate-600">
                      Standards-Based Model
                    </span>
                  </div>
                  <h3 className="font-bold font-display text-[#111827] text-base mt-3">{tool.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed font-sans">{tool.description}</p>
                </div>
                
                <div>
                  <div className="mt-4 p-2.5 bg-white rounded-xl border border-[#E2E8F0] text-[10px] font-mono text-[#64748B] flex items-center justify-between shadow-2xs">
                    <span>Interactive Solver Ready</span>
                    <span className="text-[#2563EB] font-bold">&rarr;</span>
                  </div>
                  
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-700 transition-colors group"
                  >
                    Launch Tool
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* APPLIED SECTORS: DEEP INDUSTRIAL CONTEXT */}
      {/* ============================================================ */}
      <section className="bg-[#FAFAFA] py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Applied Sectors</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111827]">See Polymers in Action</h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Connect classroom chemistry to modern automotive, biomedical, and aerospace supply chains.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {INDUSTRIES.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] p-6 hover:border-[#2563EB] hover:shadow-md transition-all text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl mx-auto mb-3 shadow-2xs">
                    {industry.icon}
                  </div>
                  <h3 className="font-bold font-display text-[#111827] text-base">{industry.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed font-sans">{industry.description}</p>
                </div>
                <Link
                  href={`/world/${industry.slug}`}
                  className="inline-flex items-center justify-center gap-1 mt-4 text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-700 transition-colors group"
                >
                  Explore Sector
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CURRICULUM PILLARS */}
      {/* ============================================================ */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Built for Technical Excellence</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111827] mt-2">The PolymerHub Engineering Standard</h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Engineered specifically for undergraduate exams, GATE XE-F preparation, and plastics manufacturing.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="font-bold font-display text-base text-[#111827] mb-2">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-sans">{pillar.desc}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center gap-1.5 text-emerald-700 text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4" /> Verified Coverage
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CALL TO ACTION */}
      {/* ============================================================ */}
      <section className="bg-slate-900 py-20 text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white">
              Your polymer engineering journey starts here
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-4 max-w-2xl mx-auto font-normal leading-relaxed">
              Join thousands of students and engineers mastering polymer science and manufacturing parameters. Start learning today &mdash; it is completely free.
            </p>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="mt-8"
            >
              <Link
                href="/login"
                className="px-10 py-4 rounded-xl font-mono font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-lg transition-all inline-flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                Start Learning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-mono text-slate-400">
              <span>📚 216 Lessons</span>
              <span className="w-px h-4 bg-white/20" />
              <span>🎓 19 Subjects</span>
              <span className="w-px h-4 bg-white/20" />
              <span>🔧 4 Engineering Tools</span>
              <span className="w-px h-4 bg-white/20" />
              <span>🧠 Polymer AI Copilot</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CLEAN GLOBAL FOOTER */}
      {/* ============================================================ */}
      <Footer />

    </div>
  )
}
