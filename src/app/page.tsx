'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  ChevronRight, 
  Shield, 
  Sparkles, 
  Award, 
  Heart
} from 'lucide-react'
import Footer from '@/components/Footer'

const SUBJECTS = [
  { id: 'polymer-chemistry', name: 'Polymer Chemistry', icon: '🧪', color: '#4F8FFF', bgColor: '#EFF6FF', lessons: 15, level: 'Advanced', desc: 'Synthesis, kinetics, Tg, and MW distribution' },
  { id: 'polymer-processing', name: 'Polymer Processing', icon: '⚙️', color: '#FF6B35', bgColor: '#FFF7ED', lessons: 20, level: 'Advanced', desc: 'Extrusion, injection, blow molding & thermoforming' },
  { id: 'mould-design', name: 'Mould Design', icon: '🔧', color: '#10B981', bgColor: '#F0FDF4', lessons: 12, level: 'Advanced', desc: 'Runner systems, gate freeze-off & CAD simulation' },
  { id: 'polymer-testing', name: 'Polymer Testing', icon: '📊', color: '#EF4444', bgColor: '#FEF2F2', lessons: 10, level: 'Core', desc: 'Tensile, impact, DSC, TGA, and DMA ASTM standards' },
  { id: 'rubber-technology', name: 'Rubber Technology', icon: '⚡', color: '#8B5CF6', bgColor: '#F5F3FF', lessons: 9, level: 'Core', desc: 'Vulcanization chemistry, elastomers & tyre design' },
  { id: 'sustainable-plastics', name: 'Sustainable Plastics', icon: '♻️', color: '#10B981', bgColor: '#F0FDF4', lessons: 18, level: 'Advanced', desc: 'PLA, PHA, bio-PE & circular mono-material barriers' },
  { id: 'medical-plastics', name: 'Medical Plastics', icon: '🏥', color: '#EC4899', bgColor: '#FDF2F8', lessons: 12, level: 'Advanced', desc: 'ISO 10993 biocompatibility & sterile implants' },
  { id: 'plastic-packaging-engineering', name: 'Plastic Packaging', icon: '📦', color: '#F59E0B', bgColor: '#FFFBEB', lessons: 16, level: 'Advanced', desc: 'Barrier EVOH films, preform blowing & food contact' },
  { id: 'additives-compounding', name: 'Additives & Compounding', icon: '🧬', color: '#6366F1', bgColor: '#EEF2FF', lessons: 16, level: 'Advanced', desc: 'Twin-screw dispersion, stabilizers & masterbatches' },
  { id: 'polymer-composites', name: 'Composites', icon: '🧪', color: '#14B8A6', bgColor: '#F0FDFA', lessons: 16, level: 'Advanced', desc: 'CFRP prepregs, carbon fibers & autoclave curing' },
  { id: 'polymer-rheology', name: 'Rheology & Flow', icon: '🌊', color: '#3B82F6', bgColor: '#EFF6FF', lessons: 9, level: 'Core', desc: 'Viscoelasticity, shear-thinning & die swell physics' },
  { id: 'polymer-nanotechnology', name: 'Polymer Nanotech', icon: '🔬', color: '#8B5CF6', bgColor: '#F5F3FF', lessons: 6, level: 'Core', desc: 'Graphene, CNTs, and nano-barrier enhancement' },
  { id: 'bioprocessing-fermentation', name: 'Bioprocessing', icon: '🧫', color: '#059669', bgColor: '#ECFDF5', lessons: 6, level: 'Core', desc: 'Microbial fermentation & bio-based feedstocks' },
  { id: 'robotics-plastics', name: 'Robotics in Mfg', icon: '🤖', color: '#EF4444', bgColor: '#FEF2F2', lessons: 6, level: 'Core', desc: '6-axis articulated robots & plant automation' },
  { id: 'digital-twins-plastics', name: 'Digital Twins & AI', icon: '💻', color: '#7C3AED', bgColor: '#F5F3FF', lessons: 6, level: 'Core', desc: 'Cavity pressure sensors, ML & 3D additive printing' },
  { id: 'color-science-masterbatches', name: 'Color Science', icon: '🎨', color: '#F43F5E', bgColor: '#FFF1F2', lessons: 8, level: 'Core', desc: 'CIELAB color space, spectrophotometry & pigments' },
  { id: 'life-cycle-assessment', name: 'Life Cycle Assessment', icon: '🌍', color: '#06B6D4', bgColor: '#ECFEFF', lessons: 6, level: 'Core', desc: 'ISO 14040 cradle-to-grave carbon footprinting' },
  { id: 'entrepreneurship-plastics', name: 'Entrepreneurship', icon: '💼', color: '#F5C518', bgColor: '#FFFBEB', lessons: 11, level: 'Core', desc: 'Plastics business setups, PMEGP & BIS compliance' },
  { id: 'recycling-technology', name: 'Recycling Tech', icon: '♻️', color: '#22C55E', bgColor: '#F0FDF4', lessons: 12, level: 'Core', desc: 'NIR optical sorting, chemical pyrolysis & EPR' },
]

const TOOLS = [
  { name: 'Defect Troubleshooter', icon: '🔧', desc: 'Diagnose sink marks, warpage, flash, and voids from Rosato Handbook', href: '/troubleshooter', color: '#EF4444' },
  { name: 'Polymer Comparator', icon: '⚖️', desc: 'Compare 35+ polymer systems and 1,000+ TDS grades side-by-side', href: '/comparator', color: '#3B82F6' },
  { name: 'Industrial Calculators', icon: '🧮', desc: '8 tools for clamping tonnage, cooling cycle time, and shrinkage', href: '/calculators', color: '#10B981' },
  { name: 'Material Database', icon: '📊', desc: '35+ base polymers with complete ASTM properties and Indian brands', href: '/materials', color: '#8B5CF6' },
]

const INDUSTRIES = [
  { name: 'Automotive & EV', slug: 'automotive', icon: '🚗', desc: 'Under-the-hood PA66, bumper PP compounds, and battery flame retardants', color: '#2563EB' },
  { name: 'Medical Devices', slug: 'medical', icon: '🏥', desc: 'ISO 10993 biocompatible PEEK implants & gamma-sterilized syringes', color: '#EC4899' },
  { name: 'Circular Packaging', slug: 'packaging', icon: '♻️', desc: '7-layer EVOH high barrier films and 100% rPET preform blowing', color: '#10B981' },
  { name: 'Aerospace Composites', slug: 'aerospace', icon: '🚀', desc: 'Autoclave-cured CFRP prepregs for ISRO rocket fairings and fuselages', color: '#7C3AED' },
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0B172A] via-[#1A2E4A] to-[#0B172A]">
        
        {/* Background Image with 3D Depth */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        >
          <Image
            src="/images/hero/students-polymer-lab.jpg"
            alt="Students innovating with polymers in modern laboratory"
            fill
            className="object-cover object-center opacity-45"
            priority
          />
          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B172A] via-[#0B172A]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-transparent to-black/40" />
          {/* Seamless Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </motion.div>

        {/* Ambient Radial Energy */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#16A34A]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 3 === 0 ? '#2563EB' : i % 3 === 1 ? '#F5C518' : '#16A34A',
                opacity: 0.2,
                left: `${(i * 19) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.35, 0.1],
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 lg:py-28">
          <motion.div
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
            }}
            className="max-w-3xl"
          >
            {/* Animated Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-mono font-bold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              🔬 India&apos;s Premier Polymer Education Platform
            </motion.div>

            {/* Headline with Tricolor Kinetic Gradient */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] tracking-tight"
            >
              Where Polymers{' '}
              <span className="block bg-gradient-to-r from-[#FF8A00] via-white to-[#16A34A] bg-clip-text text-transparent">
                Shape Tomorrow
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-white/85 mt-4 max-w-2xl leading-relaxed font-light"
            >
              Master the molecular science, shop-floor manufacturing parameters, and global trade dynamics 
              of plastics, elastomers, and composites — crafted for India&apos;s next generation of engineers.
            </motion.p>

            {/* Stats with Float Micro-Animations */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 sm:gap-6 mt-8"
            >
              {[
                { value: '216+', label: 'Lessons', icon: '📚', color: '#38BDF8' },
                { value: '19', label: 'Subjects', icon: '🎓', color: '#F5C518' },
                { value: '357+', label: 'Videos', icon: '🎬', color: '#4ADE80' },
                { value: '5,000+', label: 'Engineers', icon: '👨‍🔬', color: '#F472B6' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/15 shadow-sm"
                  whileHover={{ y: -4, scale: 1.02 }}
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{ duration: 3, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-white/70 text-lg">{stat.icon}</span>
                  <div>
                    <p className="text-white font-bold text-lg" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-white/60 text-xs font-mono">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs with Magnetic Spring Lift */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 text-sm"
                >
                  Start Learning Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/subjects"
                  className="px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/25 transition-all flex items-center gap-2 text-sm"
                >
                  Explore 19 Subjects
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
              <span className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-[#EC4899]" />
                Made in India
              </span>
            </motion.div>

          </motion.div>
        </div>

        {/* Subtle Bottom Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30 z-20 pointer-events-none"
        >
          <span className="text-[9px] font-mono uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-0.5 h-6 bg-white/30 rounded-full"
          />
        </motion.div>
      </section>

      {/* ==================== 19 SUBJECTS ==================== */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Curriculum</span>
                <Sparkles className="h-3.5 w-3.5 text-[#F5C518]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">19 Subjects &middot; 216 Lessons</h2>
              <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Complete polymer engineering curriculum mapped to GATE XE-F and industrial needs</p>
            </div>
            <Link href="/subjects" className="text-xs font-mono font-bold text-[#2563EB] hover:underline flex items-center gap-1 uppercase tracking-wider group">
              View All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {SUBJECTS.map((subject, index) => (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer h-full flex flex-col justify-between"
                  style={{ borderColor: `${subject.color}35` }}
                >
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
                          style={{ backgroundColor: subject.bgColor }}
                          whileHover={{ rotate: 12, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          {subject.icon}
                        </motion.div>
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
                      <p className="text-[#64748B] text-xs line-clamp-2 leading-relaxed">{subject.desc}</p>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                      <span 
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full font-mono"
                        style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                      >
                        {subject.level}
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

      {/* ==================== ENGINEERING TOOLS ==================== */}
      <section className="bg-gradient-to-b from-[#F8FAFC] to-white py-16 border-t border-[#F1F5F9]">
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
            <p className="text-[#64748B] text-xs sm:text-sm mt-0.5">Real-world engineering solutions for shop-floor plastics manufacturing</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TOOLS.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
                style={{ borderColor: `${tool.color}35` }}
              >
                <div>
                  <motion.div 
                    className="text-3xl mb-3"
                    whileHover={{ rotate: 15, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {tool.icon}
                  </motion.div>
                  <h3 className="font-bold text-base" style={{ color: tool.color }}>{tool.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{tool.desc}</p>
                </div>
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 mt-4 text-xs font-bold hover:underline uppercase font-mono tracking-wider group"
                  style={{ color: tool.color }}
                >
                  Use Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== APPLIED SECTORS ==================== */}
      <section className="bg-white py-16 border-t border-[#F1F5F9]">
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
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all text-center flex flex-col justify-between"
                style={{ borderColor: `${industry.color}35` }}
              >
                <div>
                  <motion.div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm bg-white"
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {industry.icon}
                  </motion.div>
                  <h3 className="font-bold text-[#111827] text-base">{industry.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed font-normal">{industry.desc}</p>
                </div>
                <Link
                  href={`/world/${industry.slug}`}
                  className="inline-flex items-center justify-center gap-1 mt-4 text-xs font-mono font-bold hover:underline uppercase tracking-wider group"
                  style={{ color: industry.color }}
                >
                  Explore Sector <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AI TUTOR ==================== */}
      <section className="bg-gradient-to-r from-[#2563EB] via-blue-600 to-[#16A34A] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3 w-3 text-[#F5C518]" />
                Gemini RAG AI Tutor
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Ask Anything. Get Rigorous Engineering Answers.
              </h3>
              <p className="text-white/90 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Powered by 216+ curriculum lessons via real RAG pipeline. Calibrated for undergraduate &amp; shop-floor problem solving.
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex-shrink-0"
            >
              <Link
                href="/ai-tutor"
                className="px-8 py-3.5 rounded-xl font-bold text-[#111827] bg-white hover:bg-[#F8FAFC] transition-all flex items-center gap-2 shadow-lg text-sm"
              >
                Ask AI Tutor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
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
            <motion.span 
              className="text-4xl text-[#94A3B8] font-serif leading-none inline-block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              &ldquo;
            </motion.span>
            <p className="text-lg sm:text-xl md:text-2xl text-[#111827] font-light leading-relaxed italic -mt-2">
              Polymers are the workhorses of modern civilization &mdash; invisible, indispensable, misunderstood.
            </p>
            <p className="text-[#94A3B8] mt-2 text-xs font-mono uppercase tracking-widest">&mdash; Robert F. Browning, Polymeria</p>
          </motion.div>
        </div>
      </section>

      {/* ==================== CLEAN WHITE FOOTER ==================== */}
      <Footer />

    </div>
  )
}
