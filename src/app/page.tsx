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

// 19 Subjects with unique colors, images, and routes
const SUBJECTS = [
  { 
    id: 'polymer-chemistry',
    name: 'Polymer Chemistry', 
    icon: '🧪', 
    color: '#4F8FFF', 
    bgColor: '#E8F0FE',
    lessons: 15,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    description: 'Polymerization mechanisms, kinetics, and structure-property relationships.'
  },
  { 
    id: 'polymer-processing',
    name: 'Polymer Processing', 
    icon: '⚙️', 
    color: '#FF6B35', 
    bgColor: '#FFF0E8',
    lessons: 20,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    description: 'Extrusion, injection moulding, blow moulding, and thermoforming.'
  },
  { 
    id: 'mould-design',
    name: 'Mould Design', 
    icon: '🔧', 
    color: '#10B981', 
    bgColor: '#E8F8F0',
    lessons: 12,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
    description: 'Die design, cooling systems, CAD/CAM simulation, and runner systems.'
  },
  { 
    id: 'polymer-testing',
    name: 'Polymer Testing', 
    icon: '📊', 
    color: '#EF4444', 
    bgColor: '#FDE8E8',
    lessons: 10,
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
    description: 'Tensile, impact, DSC, TGA, DMA, and Shore hardness testing standards.'
  },
  { 
    id: 'rubber-technology',
    name: 'Rubber Technology', 
    icon: '⚡', 
    color: '#8B5CF6', 
    bgColor: '#F0E8FD',
    lessons: 9,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    description: 'Vulcanization, mechanical properties, and tyre manufacturing processes.'
  },
  { 
    id: 'sustainable-plastics',
    name: 'Sustainable Plastics', 
    icon: '♻️', 
    color: '#10B981', 
    bgColor: '#E8F8F0',
    lessons: 18,
    image: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
    description: 'PLA, PHA, bio-PE, and circular mono-material barrier formulations.'
  },
  { 
    id: 'medical-plastics',
    name: 'Medical Plastics', 
    icon: '🏥', 
    color: '#EC4899', 
    bgColor: '#FDE8F0',
    lessons: 12,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80',
    description: 'Drug delivery systems, ISO 10993 biocompatibility, and cleanrooms.'
  },
  { 
    id: 'plastic-packaging-engineering',
    name: 'Plastic Packaging', 
    icon: '📦', 
    color: '#F59E0B', 
    bgColor: '#FEF3E8',
    lessons: 16,
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80',
    description: 'Barrier properties, EVOH co-extrusion, PET bottles, and food contact.'
  },
  { 
    id: 'additives-compounding',
    name: 'Additives & Compounding', 
    icon: '🧬', 
    color: '#6366F1', 
    bgColor: '#EDE8FD',
    lessons: 16,
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&q=80',
    description: 'Antioxidants, UV stabilizers, plasticizers, and twin-screw mixing.'
  },
  { 
    id: 'polymer-composites',
    name: 'Composites', 
    icon: '🧪', 
    color: '#14B8A6', 
    bgColor: '#E8F8F5',
    lessons: 16,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    description: 'Carbon & glass fibre reinforcement, matrix materials, and aerospace parts.'
  },
  { 
    id: 'polymer-rheology',
    name: 'Rheology & Flow', 
    icon: '🌊', 
    color: '#3B82F6', 
    bgColor: '#E8F0FD',
    lessons: 9,
    image: 'https://images.unsplash.com/photo-1544257121-654dbcc18e5e?w=600&q=80',
    description: 'Non-Newtonian flow, shear-thinning viscosity, and die swell physics.'
  },
  { 
    id: 'polymer-nanotechnology',
    name: 'Polymer Nanotechnology', 
    icon: '🔬', 
    color: '#8B5CF6', 
    bgColor: '#F0E8FD',
    lessons: 6,
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80',
    description: 'Nanoparticles, carbon nanotubes, and nano-barrier enhancement.'
  },
  { 
    id: 'bioprocessing-fermentation',
    name: 'Bioprocessing', 
    icon: '🧫', 
    color: '#059669', 
    bgColor: '#E8F8F0',
    lessons: 6,
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&q=80',
    description: 'Microbial fermentation, enzymes, and bio-based polymer production.'
  },
  { 
    id: 'robotics-plastics',
    name: 'Robotics in Manufacturing', 
    icon: '🤖', 
    color: '#EF4444', 
    bgColor: '#FDE8E8',
    lessons: 6,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    description: '6-axis robotics, Cartesian retrieval, degating, and automation.'
  },
  { 
    id: 'digital-twins-plastics',
    name: 'Digital Twins & AI', 
    icon: '💻', 
    color: '#7C3AED', 
    bgColor: '#F0E8FD',
    lessons: 6,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&q=80',
    description: 'Cavity pressure sensors, 3D printing, and predictive ML maintenance.'
  },
  { 
    id: 'color-science-masterbatches',
    name: 'Color Science & Masterbatch', 
    icon: '🎨', 
    color: '#F43F5E', 
    bgColor: '#FDE8EC',
    lessons: 8,
    image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=600&q=80',
    description: 'CIELAB color space, TiO2 dispersion, and pigment masterbatching.'
  },
  { 
    id: 'life-cycle-assessment',
    name: 'Life Cycle Assessment', 
    icon: '🌍', 
    color: '#06B6D4', 
    bgColor: '#E8F8FA',
    lessons: 8,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
    description: 'ISO 14040, cradle-to-grave carbon footprinting, and EPR offsets.'
  },
  { 
    id: 'entrepreneurship-plastics',
    name: 'Entrepreneurship', 
    icon: '💼', 
    color: '#F59E0B', 
    bgColor: '#FEF3E8',
    lessons: 11,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    description: 'Plastics business setup, PMEGP/MUDRA financing, and BIS norms.'
  },
  { 
    id: 'recycling-technology',
    name: 'Recycling Technology', 
    icon: '♻️', 
    color: '#22C55E', 
    bgColor: '#E8F8E8',
    lessons: 12,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    description: 'NIR optical sorting, chemical pyrolysis, and circular recycling.'
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
    description: 'Diagnose sink marks, warpage, and flash from Rosato Handbook.', 
    href: '/troubleshooter', 
    color: '#EF4444' 
  },
  { 
    name: 'Polymer Comparator', 
    icon: '⚖️', 
    description: 'Compare 35+ base polymers and commercial TDS grades side-by-side.', 
    href: '/comparator', 
    color: '#3B82F6' 
  },
  { 
    name: 'Industrial Calculators', 
    icon: '🧮', 
    description: '8 engineering tools for tonnage, cooling times, and shrinkage.', 
    href: '/calculators', 
    color: '#10B981' 
  },
  { 
    name: 'Materials Database', 
    icon: '📊', 
    description: 'Complete catalog of polymers with Indian trade names (Repol, Relene).', 
    href: '/materials', 
    color: '#8B5CF6' 
  },
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* ── HERO SECTION: Clean Gradient with Tricolor Accent ── */}
      <section className="relative bg-gradient-to-b from-[#F8FAFC] via-white to-white py-20 lg:py-28 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF8A00]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs sm:text-sm font-mono font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              🇮🇳 India&apos;s Premier Polymer Engineering Platform
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-[#111827] leading-[1.08] tracking-tight uppercase">
              Where Polymers <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#2563EB] to-[#10B981]">
                Shape Tomorrow
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed font-normal">
              Master the molecular science, shop-floor manufacturing parameters, and global trade dynamics of plastics, elastomers, and composites — crafted for India&apos;s next generation of engineers.
            </p>

            {/* Quick Stats Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8 py-3 px-6 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-2xl mx-auto shadow-sm"
            >
              {STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-base sm:text-lg font-display font-bold text-slate-900 leading-tight">{stat.value}</p>
                      <p className="text-[10px] font-mono uppercase text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-xl font-display font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 text-sm"
              >
                Start Learning Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/subjects"
                className="px-8 py-3.5 rounded-xl font-display font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-2 text-sm border border-slate-200"
              >
                Explore 19 Subjects
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 19 SUBJECTS GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">Academic Curriculum</span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 uppercase">19 Subjects &middot; 216 Lessons</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Complete polymer engineering curriculum mapped to GATE XE-F and industrial shop-floor needs</p>
            </div>
            <Link 
              href="/subjects" 
              className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wider"
            >
              View Full Syllabus <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SUBJECTS.map((subject, index) => (
            <Link key={subject.id} href={`/subjects/${subject.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer h-full flex flex-col justify-between"
              >
                {/* Subject Image Thumbnail */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Emoji Badge */}
                  <div 
                    className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-sm backdrop-blur-md bg-white/90"
                  >
                    {subject.icon}
                  </div>

                  {/* Lessons Count Pill */}
                  <div 
                    className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-white text-[10px] font-mono font-bold shadow-sm"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.lessons} lessons
                  </div>
                </div>

                {/* Subject Information */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      className="font-display font-bold text-sm truncate"
                      style={{ color: subject.color }}
                    >
                      {subject.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                    <span>Explore syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE ENGINEERING TOOLS ── */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">Power Suite</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 uppercase">Calculate &middot; Diagnose &middot; Compare</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Real-world engineering toolkits calibrated for shop-floor plastics manufacturing</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TOOLS.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-display font-bold text-slate-900 text-base">{tool.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{tool.description}</p>
                </div>
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 mt-4 text-xs font-display font-bold hover:underline"
                  style={{ color: tool.color }}
                >
                  Launch Tool <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TUTOR BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Gemini RAG AI Tutor
              </div>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight">
                Ask Anything. Get Rigorous Polymer Answers.
              </h3>
              <p className="text-sm text-blue-100 font-light leading-relaxed">
                Indexed directly against 216+ curriculum lessons and real-world processing handbooks via our dedicated RAG pipeline.
              </p>
            </div>
            <Link
              href="/ai-tutor"
              className="px-8 py-4 rounded-xl font-display font-bold text-slate-900 bg-white hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap text-sm flex-shrink-0"
            >
              Ask AI Tutor Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── PHILOSOPHICAL QUOTE ── */}
      <section className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-4xl text-slate-300 font-serif leading-none">&ldquo;</span>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-800 font-light leading-relaxed italic -mt-2">
            Plastics are the workhorses of modern civilization &mdash; invisible, indispensable, misunderstood.
          </p>
          <p className="text-slate-400 mt-2 text-xs font-mono tracking-widest uppercase">
            &mdash; Robert F. Browning, Polymeria
          </p>
        </div>
      </section>

      {/* ── TRUST SIGNALS FOOTER ── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-600" />
            DPDP 2023 Compliant
          </span>
          <span className="w-px h-3 bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-600" />
            AES-256 Encrypted
          </span>
          <span className="w-px h-3 bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-blue-600" />
            100% Legal &amp; Academically Audited
          </span>
          <span className="w-px h-3 bg-slate-300" />
          <span>🇮🇳 Made in India for Indian Engineers</span>
        </div>
      </section>
    </div>
  )
}
