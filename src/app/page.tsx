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
  Star,
  Target,
  Cpu,
  Brain,
  Lightbulb
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== DATA ====================

const FEATURED_SUBJECTS = [
  { id: 'polymer-chemistry', name: 'Polymer Chemistry', icon: '🧪', color: '#4F8FFF', lessons: 15, level: 'Foundation', description: 'Synthesis, kinetics, molecular weight distribution, and structure-property relationships' },
  { id: 'polymer-processing', name: 'Polymer Processing', icon: '⚙️', color: '#FF6B35', lessons: 20, level: 'Core', description: 'Extrusion, injection molding, blow molding, and thermoforming parameters' },
  { id: 'mould-design', name: 'Mould Design', icon: '🔧', color: '#10B981', lessons: 12, level: 'Advanced', description: 'Runner systems, gate design, cooling thermodynamics, and CAD simulation' },
  { id: 'polymer-testing', name: 'Polymer Testing', icon: '📊', color: '#EF4444', lessons: 10, level: 'Core', description: 'Tensile, impact, DSC, TGA, DMA, and Shore hardness ASTM standards' },
  { id: 'polymer-composites', name: 'Composites', icon: '🧪', color: '#14B8A6', lessons: 16, level: 'Advanced', description: 'CFRP prepregs, carbon fibers, autoclave curing, and lightweighting' },
  { id: 'sustainable-plastics', name: 'Sustainable Plastics', icon: '♻️', color: '#10B981', lessons: 18, level: 'Advanced', description: 'PLA, PHA, bio-PE, and circular mono-material barrier formulations' },
]

const ALL_SUBJECTS = [
  ...FEATURED_SUBJECTS,
  { id: 'rubber-technology', name: 'Rubber Technology', icon: '⚡', color: '#8B5CF6', lessons: 9, level: 'Core', description: 'Vulcanization chemistry, elastomers, and tyre manufacturing' },
  { id: 'medical-plastics', name: 'Medical Plastics', icon: '🏥', color: '#EC4899', lessons: 12, level: 'Advanced', description: 'ISO 10993 biocompatibility, drug delivery, and cleanroom molding' },
  { id: 'plastic-packaging-engineering', name: 'Plastic Packaging', icon: '📦', color: '#F59E0B', lessons: 16, level: 'Advanced', description: 'Barrier EVOH co-extrusion, PET bottle blowing, and food contact' },
  { id: 'additives-compounding', name: 'Additives & Compounding', icon: '🧬', color: '#6366F1', lessons: 16, level: 'Advanced', description: 'Antioxidants, UV stabilizers, plasticizers, and twin-screw mixing' },
  { id: 'polymer-rheology', name: 'Rheology & Flow', icon: '🌊', color: '#3B82F6', lessons: 9, level: 'Core', description: 'Non-Newtonian flow, shear-thinning viscosity, and die swell physics' },
  { id: 'polymer-nanotechnology', name: 'Polymer Nanotech', icon: '🔬', color: '#8B5CF6', lessons: 6, level: 'Core', description: 'Carbon nanotubes, exfoliated graphene, and nano-barrier enhancement' },
  { id: 'bioprocessing-fermentation', name: 'Bioprocessing', icon: '🧫', color: '#059669', lessons: 6, level: 'Core', description: 'Microbial fermentation, enzymes, and bio-based polymer production' },
  { id: 'robotics-plastics', name: 'Robotics in Mfg', icon: '🤖', color: '#EF4444', lessons: 6, level: 'Core', description: 'Cartesian retrieval robots, ultrasonic degating, and plant automation' },
  { id: 'digital-twins-plastics', name: 'Digital Twins & AI', icon: '💻', color: '#7C3AED', lessons: 6, level: 'Core', description: 'Cavity pressure sensors, 3D printing, and predictive ML maintenance' },
  { id: 'color-science-masterbatches', name: 'Color Science', icon: '🎨', color: '#F43F5E', lessons: 8, level: 'Core', description: 'CIELAB color space, TiO2 dispersion, and pigment masterbatching' },
  { id: 'life-cycle-assessment', name: 'Life Cycle Assessment', icon: '🌍', color: '#06B6D4', lessons: 6, level: 'Core', description: 'ISO 14040, cradle-to-grave carbon footprinting, and EPR offsets' },
  { id: 'entrepreneurship-plastics', name: 'Entrepreneurship', icon: '💼', color: '#F5C518', lessons: 11, level: 'Core', description: 'Plastics business setup, PMEGP/MUDRA financing, and BIS norms' },
  { id: 'recycling-technology', name: 'Recycling Technology', icon: '♻️', color: '#22C55E', lessons: 12, level: 'Core', description: 'NIR optical sorting, chemical pyrolysis, and circular recycling' },
]

const STATS = [
  { value: '216+', label: 'Lessons', icon: <BookOpen className="h-5 w-5" />, color: '#38BDF8' },
  { value: '19', label: 'Subjects', icon: <GraduationCap className="h-5 w-5" />, color: '#F5C518' },
  { value: '357+', label: 'Videos', icon: <Play className="h-5 w-5" />, color: '#4ADE80' },
  { value: '5,000+', label: 'Engineers', icon: <Users className="h-5 w-5" />, color: '#F472B6' },
]

const TOOLS = [
  { name: 'Defect Troubleshooter', icon: '🔧', description: 'Diagnose sink marks, warpage, flash, and voids with root causes from Rosato', href: '/troubleshooter', color: '#EF4444' },
  { name: 'Polymer Comparator', icon: '⚖️', description: 'Compare 35+ polymer systems and 1,000+ TDS grades side-by-side', href: '/comparator', color: '#3B82F6' },
  { name: 'Industrial Calculators', icon: '🧮', description: '8 engineering tools for clamping tonnage, cooling cycle time, and shrinkage', href: '/calculators', color: '#10B981' },
  { name: 'Material Database', icon: '📊', description: '35+ base polymers with complete ASTM properties and Indian brand equivalents', href: '/materials', color: '#8B5CF6' },
]

const INDUSTRIES = [
  { name: 'Automotive & EV', slug: 'automotive', icon: '🚗', description: 'Under-the-hood PA66, bumper PP compounds, and battery flame retardants', color: '#2563EB' },
  { name: 'Medical Devices', slug: 'medical', icon: '🏥', description: 'ISO 10993 biocompatible PEEK implants & gamma-sterilized syringes', color: '#EC4899' },
  { name: 'Circular Packaging', slug: 'packaging', icon: '♻️', description: '7-layer EVOH high barrier films and 100% rPET preform blowing', color: '#10B981' },
  { name: 'Aerospace Composites', slug: 'aerospace', icon: '🚀', description: 'Autoclave-cured CFRP prepregs for ISRO rocket fairings and fuselages', color: '#7C3AED' },
]

const TESTIMONIALS = [
  { name: 'Dr. Rajesh Kumar', role: 'Professor, Polymer Science Dept, IIT Bombay', quote: 'PolymerHub provides the most comprehensive polymer engineering curriculum I have seen. My students love the interactive tools.' },
  { name: 'Priya Sharma', role: 'R&D Process Engineer, Reliance Industries', quote: 'The defect troubleshooting engine saved us hours of plant downtime. It is like having a senior technical fellow on call.' },
  { name: 'Amit Patel', role: 'B.Tech Polymer Technology, CIPET Ahmedabad', quote: 'I cleared GATE with a 98 percentile using PolymerHub. The structured curriculum and AI tutor derivations were game-changers.' },
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
      {/* HERO SECTION: CINEMATIC WITH 3 STUDENTS IN LAB */}
      {/* ============================================================ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0B172A]">
        {/* Background Image with 3D Depth */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        >
          <Image
            src="/images/hero/students-polymer-lab.jpg"
            alt="Students innovating with polymers in state-of-the-art laboratory"
            fill
            className="object-cover object-center opacity-35"
            priority
            sizes="100vw"
          />
          {/* Sophisticated Dual Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B172A] via-[#0B172A]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-transparent to-black/40" />
          {/* Seamless Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </motion.div>

        {/* Ambient Radial Energy */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#16A34A]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Molecular Particulate Flow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 3 === 0 ? '#2563EB' : i % 3 === 1 ? '#F5C518' : '#16A34A',
                opacity: 0.15,
                left: `${(i * 19) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.08, 0.25, 0.08],
              }}
              transition={{
                duration: 6 + (i % 5),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
          <motion.div
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-md text-white/90 text-xs sm:text-sm font-mono font-bold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              🔬 India&apos;s Premier Polymer Engineering Platform
            </motion.div>

            {/* Headline — Sharp & Commanding */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight"
            >
              Master Polymer Engineering.
              <span className="block bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent drop-shadow-sm">
                From Molecules to Manufacturing.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mt-4 leading-relaxed font-light"
            >
              Learn polymer chemistry, processing, testing, mould design, composites, and 
              sustainable materials through structured lessons, engineering tools, and AI-powered learning.
            </motion.p>

            {/* Stats Grid */}
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
                  className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-sm"
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{ duration: 3, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-0.5 font-mono">{stat.label}</div>
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
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_24px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 text-sm"
                >
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/subjects"
                  className="px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2 text-sm"
                >
                  Explore 19 Subjects
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 text-xs text-white/60 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#16A34A]" />
                Built in India &middot; CIPET &amp; IIT Aligned
              </span>
              <span className="w-px h-3.5 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#F5C518]" />
                216+ Rigorous Engineering Lessons
              </span>
              <span className="w-px h-3.5 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-[#38BDF8]" />
                Gemini RAG AI Powered
              </span>
            </motion.div>
          </motion.div>
        </div>
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
            <h2 className="text-3xl font-bold text-[#111827] mt-2">Where should you start?</h2>
            <p className="text-[#64748B] text-sm mt-1 max-w-2xl mx-auto">PolymerHub adapts to your goals &mdash; whether you are an undergraduate student, shop-floor professional, or GATE aspirant.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: '🎓 B.Tech & Diploma Student',
                description: 'Build fundamentals from scratch. Master core polymer chemistry, structure, and processing equations.',
                color: '#2563EB',
                path: '/subjects'
              },
              {
                icon: <Factory className="h-8 w-8" />,
                title: '🏭 Industry Process Engineer',
                description: 'Solve real manufacturing defects on the shop floor with Rosato diagnostics and clamp tonnage calculators.',
                color: '#F59E0B',
                path: '/troubleshooter'
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: '🎯 GATE XE-F Aspirant',
                description: 'Prepare systematically with topic-wise quizzes, formula flashcards, and full-length simulated mock tests.',
                color: '#16A34A',
                path: '/gate-mock'
              }
            ].map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${path.color}15`, color: path.color }}
                  >
                    {path.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#111827]">{path.title}</h3>
                  <p className="text-sm text-[#64748B] mt-2 leading-relaxed">{path.description}</p>
                </div>
                <Link href={path.path} className="inline-flex items-center gap-1 mt-6 text-sm font-semibold transition-all group" style={{ color: path.color }}>
                  Start Path
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                <Sparkles className="h-3.5 w-3.5 text-[#F5C518]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                {showAllSubjects ? 'All 19 Polymer Subjects' : 'Featured Core Subjects'}
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">The core of polymer engineering &mdash; structured for deep conceptual clarity</p>
            </div>
            
            <button
              onClick={() => setShowAllSubjects(!showAllSubjects)}
              className="px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#2563EB] hover:bg-blue-50 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
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
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
                  style={{ borderColor: `${subject.color}35` }}
                >
                  <Link href={`/subjects/${subject.id}`} className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: `${subject.color}15` }}
                        >
                          {subject.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-[#111827] group-hover:text-[#2563EB] transition-colors" style={{ color: subject.color }}>
                            {subject.name}
                          </h3>
                          <p className="text-[#94A3B8] text-xs font-mono">{subject.lessons} lessons</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 leading-relaxed">{subject.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F1F5F9]">
                      <span 
                        className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${subject.color}10`, color: subject.color }}
                      >
                        {subject.level}
                      </span>
                      <span className="text-xs text-[#2563EB] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
      {/* AI TUTOR: INTERACTIVE DEMO PROMPT LAUNCHER */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#2563EB] via-blue-600 to-[#16A34A] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-8"
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Brain className="h-3.5 w-3.5 text-[#F5C518]" />
                AI Tutor &middot; Powered by Your Curriculum
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Your Polymer Engineering Copilot
              </h2>
              <p className="text-white/85 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask technical questions and get answers grounded in PolymerHub&apos;s 216+ curriculum lessons &mdash; 
                engineering-specific intelligence calibrated for exams and shop-floor diagnostics.
              </p>
              
              {/* Interactive Demo Chat Box */}
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 max-w-xl shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#F5C518] flex items-center justify-center text-xs font-bold text-slate-950">
                    AI
                  </div>
                  <span className="text-white text-xs font-mono font-bold">PolymerHub AI Specialist</span>
                  <span className="text-emerald-300 text-[10px] font-mono">● Online</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 mb-3 border border-white/10">
                  <p className="text-white/90 text-xs sm:text-sm">
                    <span className="text-[#F5C518] font-bold font-mono">You:</span> Why does increasing injection pressure sometimes cause flash?
                  </p>
                  <p className="text-white/90 text-xs sm:text-sm mt-2 leading-relaxed">
                    <span className="text-emerald-300 font-bold font-mono">AI:</span> Flash occurs when injection pressure exceeds the effective clamp tonnage across the projected area, forcing molten polymer into the parting line.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-white/50 font-mono">
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
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <Link
                    href={`/ai-tutor?prompt=${encodeURIComponent(demoQuestion || 'Explain the Carothers equation for step-growth polymerization')}`}
                    className="px-4 py-2.5 rounded-xl bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    Ask <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/ai-tutor"
                className="px-8 py-4 rounded-xl font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all flex items-center gap-2 shadow-2xl text-sm"
              >
                Launch AI Tutor Full Workspace
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
            <span className="text-xs font-mono font-bold text-[#F5C518] uppercase tracking-wider">Engineering Tools</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">Calculate &middot; Diagnose &middot; Compare</h2>
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
                whileHover={{ y: -6 }}
                className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
                style={{ borderColor: `${tool.color}30` }}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{tool.icon}</div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#E2E8F0] text-[#64748B]">
                      Verified Tool
                    </span>
                  </div>
                  <h3 className="font-bold text-[#111827] text-base mt-3" style={{ color: tool.color }}>{tool.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{tool.description}</p>
                </div>
                
                <div>
                  <div className="mt-4 p-2.5 bg-white rounded-xl border border-[#E2E8F0] text-[10px] font-mono text-[#64748B] flex items-center justify-between shadow-sm">
                    <span>Interactive Solver Ready</span>
                    <span className="text-[#2563EB] font-bold">&rarr;</span>
                  </div>
                  
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-mono font-bold uppercase tracking-wider group"
                    style={{ color: tool.color }}
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
            <span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider">Applied Sectors</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">See Polymers in Action</h2>
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
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all text-center flex flex-col justify-between"
                style={{ borderColor: `${industry.color}30` }}
              >
                <div>
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm"
                    style={{ backgroundColor: `${industry.color}15` }}
                  >
                    {industry.icon}
                  </div>
                  <h3 className="font-bold text-[#111827] text-base">{industry.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{industry.description}</p>
                </div>
                <Link
                  href={`/world/${industry.slug}`}
                  className="inline-flex items-center justify-center gap-1 mt-4 text-xs font-mono font-bold uppercase tracking-wider group"
                  style={{ color: industry.color }}
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
      {/* TESTIMONIALS: REAL ACADEMIC & INDUSTRIAL PROOF */}
      {/* ============================================================ */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-mono font-bold text-[#F5C518] uppercase tracking-wider">Social Proof</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-2">What Polymer Engineers Say</h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Real feedback from students, professors, and industry professionals across India.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#F5C518] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F5C518]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#111827] leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <p className="font-bold text-[#111827] text-sm">{testimonial.name}</p>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WHY POLYMERHUB: 4 PILLARS */}
      {/* ============================================================ */}
      <section className="bg-[#F8FAFC] py-16 border-t border-[#F1F5F9]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <Lightbulb className="h-3.5 w-3.5" />
              Why PolymerHub
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827]">Everything you need to understand polymers &mdash; in one place</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="text-3xl mb-2">📚</div>
                <p className="font-bold text-sm text-[#111827]">Structured Syllabus</p>
                <p className="text-xs text-[#64748B] mt-1 font-light">Mapped to GATE XE-F &amp; CIPET</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="text-3xl mb-2">🔧</div>
                <p className="font-bold text-sm text-[#111827]">Engineering Tools</p>
                <p className="text-xs text-[#64748B] mt-1 font-light">Calculators &amp; Troubleshooters</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="text-3xl mb-2">🧠</div>
                <p className="font-bold text-sm text-[#111827]">AI Tutor RAG</p>
                <p className="text-xs text-[#64748B] mt-1 font-light">Curriculum-grounded derivations</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="text-3xl mb-2">🏭</div>
                <p className="font-bold text-sm text-[#111827]">Industrial Context</p>
                <p className="text-xs text-[#64748B] mt-1 font-light">Real-world factory supply chains</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CALL TO ACTION */}
      {/* ============================================================ */}
      <section className="bg-[#0B172A] py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Your polymer engineering journey starts here
            </h2>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands of engineers mastering polymer science and manufacturing parameters. Start learning today &mdash; it is completely free.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="mt-8"
            >
              <Link
                href="/login"
                className="px-10 py-4 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_24px_rgba(37,99,235,0.4)] transition-all inline-flex items-center gap-2 text-sm"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-mono text-slate-400">
              <span>📚 216+ Lessons</span>
              <span className="w-px h-4 bg-white/20" />
              <span>🎓 19 Subjects</span>
              <span className="w-px h-4 bg-white/20" />
              <span>🔧 4 Engineering Tools</span>
              <span className="w-px h-4 bg-white/20" />
              <span>🧠 Gemini AI Tutor</span>
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
