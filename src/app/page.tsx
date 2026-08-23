'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users,
  Zap,
  Shield,
  Play,
  ChevronRight,
  Sparkles,
  Globe,
  Brain,
  Wrench,
  Scale,
  Compass
} from 'lucide-react'

// ─── 19 Unique Subjects Data ──────────────────────────────────────────────────
const SUBJECTS = [
  { name: 'Polymer Chemistry', slug: 'polymer-chemistry', icon: '🧪', color: '#2563EB', bg: '#EFF6FF', border: '#1D4ED8', lessons: 15, tag: 'Foundation', desc: 'Polymerization mechanisms, Tg, Tm, molecular weight distributions, degradation kinetics' },
  { name: 'Polymer Processing', slug: 'polymer-processing', icon: '⚙️', color: '#EA580C', bg: '#FFF7ED', border: '#EA580C', lessons: 20, tag: 'Manufacturing', desc: 'Injection moulding, single/twin extrusion, blow moulding, troubleshooting defects' },
  { name: 'Mould Design', slug: 'mould-design', icon: '🔧', color: '#16A34A', bg: '#F0FDF4', border: '#15803D', lessons: 12, tag: 'Engineering', desc: 'Feed systems, cooling layout calculations, ejection mechanics, Moldflow simulation' },
  { name: 'Polymer Testing', slug: 'polymer-testing', icon: '📊', color: '#7C3AED', bg: '#F5F3FF', border: '#7C3AED', lessons: 10, tag: 'QA/QC', desc: 'Tensile, Charpy impact, DSC, TGA, MFI rheology, Shore hardness standards' },
  { name: 'Rubber Technology', slug: 'rubber-technology', icon: '⚡', color: '#CA8A04', bg: '#FEFCE8', border: '#CA8A04', lessons: 9, tag: 'Elastomers', desc: 'Sulfur vulcanization, NR/SBR/EPDM compounding, tyre carcass engineering' },
  { name: 'Sustainable Plastics', slug: 'sustainable-plastics', icon: '🌱', color: '#16A34A', bg: '#F0FDF4', border: '#15803D', lessons: 18, tag: 'Bioplastics', desc: 'PLA, PHA synthesis, bio-PE, mono-material barrier packaging, composting kinetics' },
  { name: 'Recycling Technology', slug: 'recycling-technology', icon: '♻️', color: '#15803D', bg: '#F0FDF4', border: '#15803D', lessons: 12, tag: 'Circular Economy', desc: 'Mechanical sorting, pyrolysis chemical recycling, enzymatic PETase depolymerization' },
  { name: 'Polymer Composites', slug: 'polymer-composites', icon: '🚀', color: '#2563EB', bg: '#EFF6FF', border: '#1D4ED8', lessons: 16, tag: 'High-Tech', desc: 'CFRP aerospace structures, ISRO rocket casings, autoclave curing & vacuum infusion' },
  { name: 'Medical Plastics', slug: 'medical-plastics', icon: '🩺', color: '#7C3AED', bg: '#F5F3FF', border: '#7C3AED', lessons: 12, tag: 'Healthcare', desc: 'ISO 10993 biocompatibility, implantable PEEK, radiation-stable PP, micro-catheters' },
  { name: 'Plastic Packaging Engineering', slug: 'plastic-packaging-engineering', icon: '📦', color: '#EA580C', bg: '#FFF7ED', border: '#EA580C', lessons: 16, tag: 'Packaging', desc: 'Barrier co-extrusion, ISBM bottles, retort pouches, WVTR/OTR permeation testing' },
  { name: 'Additives & Compounding', slug: 'additives-compounding', icon: '🧬', color: '#6366F1', bg: '#EEF2FF', border: '#4F46E5', lessons: 11, tag: 'Formulations', desc: 'Antioxidants, UV stabilizers, flame retardants, twin-screw co-rotating compounding' },
  { name: 'Polymer Rheology', slug: 'polymer-rheology', icon: '🌊', color: '#0284C7', bg: '#F0F9FF', border: '#0284C7', lessons: 8, tag: 'Physics', desc: 'Non-Newtonian shear thinning, melt viscosity curves, die swell, Weissenberg effect' },
  { name: 'Polymer Nanotechnology', slug: 'polymer-nanotechnology', icon: '🔬', color: '#7C3AED', bg: '#F5F3FF', border: '#7C3AED', lessons: 6, tag: 'Nanotech', desc: 'Carbon nanotubes, graphene exfoliated nanocomposites, nanoclay gas barrier coatings' },
  { name: 'Bioprocessing & Fermentation', slug: 'bioprocessing-fermentation', icon: '🧫', color: '#059669', bg: '#ECFDF5', border: '#059669', lessons: 6, tag: 'Biotech', desc: 'Microbial PHA biosynthesis, bioreactor kinetics, downstream polymer extraction' },
  { name: 'Robotics in Manufacturing', slug: 'robotics-plastics', icon: '🤖', color: '#DC2626', bg: '#FEF2F2', border: '#DC2626', lessons: 6, tag: 'Automation', desc: 'EOAT sprue pickers, 6-axis degating robots, in-mould labelling (IML) automation' },
  { name: 'Digital Twins in Plastics', slug: 'digital-twins-plastics', icon: '💻', color: '#7C3AED', bg: '#F5F3FF', border: '#7C3AED', lessons: 6, tag: 'Industry 4.0', desc: 'Cavity pressure closed-loop control, AI predictive maintenance, virtual twins' },
  { name: 'Color Science & Masterbatch', slug: 'color-science', icon: '🎨', color: '#E11D48', bg: '#FFF1F2', border: '#E11D48', lessons: 6, tag: 'Colorimetry', desc: 'CIE L*a*b* spectrophotometry, Delta E matching, pigment dispersion, liquid color' },
  { name: 'Life Cycle Assessment (LCA)', slug: 'lca-plastics', icon: '🌍', color: '#0D9488', bg: '#F0FDFA', border: '#0D9488', lessons: 6, tag: 'Sustainability', desc: 'Cradle-to-grave carbon accounting, ISO 14040/44 LCA methodologies, EPR credits' },
  { name: 'Entrepreneurship in Plastics', slug: 'entrepreneurship-plastics', icon: '💼', color: '#D97706', bg: '#FFFBEB', border: '#D97706', lessons: 8, tag: 'Business', desc: 'Plant CAPEX/OPEX modeling, MSME subsidies, BIS licensing, mould quotation audits' },
]

// ─── Interactive Tools Data ───────────────────────────────────────────────────
const TOOLS = [
  { name: 'Defect Diagnostic Engine', icon: '🔧', description: 'Diagnose 12 industrial injection/extrusion defects with root causes from Rosato Handbook.', href: '/troubleshooter', color: '#EA580C', bg: '#FFF7ED', iconComponent: Wrench },
  { name: 'Polymer Comparator', icon: '⚖️', description: 'Compare 35+ base polymers and commercial TDS grades across 16 ASTM/ISO properties.', href: '/comparator', color: '#2563EB', bg: '#EFF6FF', iconComponent: Scale },
  { name: 'Industrial Calculators', icon: '🧮', description: '8 engineering tools for clamping tonnage, cooling cycle times, shrinkage, and shear rates.', href: '/calculators', color: '#16A34A', bg: '#F0FDF4', iconComponent: Zap },
  { name: 'Materials Database', icon: '📊', description: 'Complete catalog of 35+ polymers, 100+ 3D models, and Indian brand equivalents (Repol, Relene).', href: '/materials', color: '#7C3AED', bg: '#F5F3FF', iconComponent: Compass },
]

// ─── Stats Strip ──────────────────────────────────────────────────────────────
const STATS = [
  { value: '216+', label: 'Curated Lessons', sub: 'Across 19 subjects', icon: <BookOpen className="h-5 w-5 text-blue-400" /> },
  { value: '19', label: 'B.Tech Subjects', sub: 'GATE & Industry Mapped', icon: <GraduationCap className="h-5 w-5 text-amber-400" /> },
  { value: '357+', label: 'Video Lectures', sub: 'Audited & Timestamped', icon: <Play className="h-5 w-5 text-emerald-400" /> },
  { value: '5,000+', label: 'Engineers & Students', sub: 'Pan-India Community', icon: <Users className="h-5 w-5 text-purple-400" /> },
]

function HeroTicker() {
  const items = [
    '🔥 Reliance Repol PP: ₹94.50/kg ▲0.8%',
    '🏭 India processes 20M+ tonnes of polymer annually',
    '🚀 ISRO PSLV relies on CFRP high-modulus composite fairings',
    '♻️ Carbios pilots world\'s first enzymatic PET recycling plant',
    '🇮🇳 India Medical Device market growing at 15.2% CAGR',
    '📦 Multi-layer EVOH films block 99.9% atmospheric oxygen'
  ]

  return (
    <div className="bg-[#F5C518] border-y-2 border-slate-900 overflow-hidden h-11 flex items-center shadow-inner">
      <div className="bg-slate-950 text-[#F5C518] font-mono text-xs font-bold px-4 h-full flex items-center flex-shrink-0 border-r-2 border-slate-900 uppercase tracking-widest">
        Live Ticker
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="font-mono text-xs font-bold text-slate-950 px-8 border-r border-slate-950/20">
              {item}
            </span>
          ))}
        </div>
      </div>
      <Link href="/today" className="bg-slate-950 text-[#F5C518] font-mono text-xs font-bold px-4 h-full flex items-center flex-shrink-0 border-l-2 border-slate-900 uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-colors">
        Daily Pulse &rarr;
      </Link>
    </div>
  )
}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 60fps Canvas Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = []
    const colors = ['#3B82F6', '#F97316', '#22C55E', '#A855F7', '#EAB308']

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: 2 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animationId: number

    const draw = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.2, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      )
      gradient.addColorStop(0, '#0E213A')
      gradient.addColorStop(0.5, '#071120')
      gradient.addColorStop(1, '#040912')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '40'
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900">

      {/* ── 1. HERO SECTION: Midnight Navy & Indian Tricolor Gradient ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b-2 border-slate-900 bg-[#040912] py-16">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040912] via-[#040912]/80 to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column */}
          <div className="max-w-3xl flex-1 space-y-6">
            
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-white/90 tracking-widest uppercase font-mono">
                🇮🇳 India&apos;s #1 Polymer Engineering Education Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight uppercase">
              Where <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
                Polymer Science
              </span>
              <br />
              Meets the Future
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-light">
              Master the science. Understand industrial shop-floor operations. Explore the formulations, processing machines, and materials shaping the modern plastics economy.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-xl">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    {s.icon}
                    <span className="font-display text-lg font-bold text-white">{s.value}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-tight">{s.label}</p>
                    <p className="text-[9px] text-slate-400 truncate">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl border border-blue-400 shadow-[4px_4px_0px_0px_rgba(37,99,235,0.4)] hover:shadow-[2px_2px_0px_0px_rgba(37,99,235,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl border border-white/30 hover:border-white transition-all"
              >
                Explore 19 Subjects <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Right Hero Visual Card */}
          <div className="hidden lg:block w-[420px] h-[500px] relative z-10 flex-shrink-0">
            <div className="absolute inset-0 border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Polymer science research"
                fill
                sizes="420px"
                className="object-cover object-center opacity-70 hover:opacity-90 transition-opacity duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040912] via-[#040912]/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-black/60 px-2.5 py-1 rounded border border-white/20 inline-block">
                  GATE &amp; Industrial Benchmark
                </span>
                <h3 className="font-display text-xl font-bold">From Macromolecules to Shop Floor</h3>
                <p className="text-xs text-slate-300 font-light">Complete curriculum mapped with textbooks by Brandrup, Rosato, and Morton-Jones.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. LIVE COMMODITY & INDUSTRY TICKER ── */}
      <HeroTicker />

      {/* ── 3. 19 UNIQUE SUBJECTS GRID SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="border-b-2 border-slate-900 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2">
              📚 Curriculum
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              19 Subjects &middot; 216 Lessons
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Complete polymer engineering curriculum aligned with B.Tech, Diploma, and GATE Chemical / Polymer standards.
            </p>
          </div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 hover:text-blue-800 uppercase"
          >
            View Full Curriculum <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 19 Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SUBJECTS.map((sub) => (
            <Link
              key={sub.slug}
              href={`/subjects/${sub.slug}`}
              className="group bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: sub.bg }}>
                    {sub.icon}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border" style={{ borderColor: sub.border, color: sub.border, backgroundColor: sub.bg }}>
                    {sub.tag}
                  </span>
                </div>
                <h3 className="font-display font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2 font-medium">
                  {sub.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-500">{sub.lessons} Lessons</span>
                <span className="font-bold flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. INTERACTIVE POWER TOOLS SECTION ── */}
      <section className="bg-white border-y-2 border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="border-b-2 border-slate-900 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2">
                🔧 Interactive Engineering Power Tools
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">
                Calculate. Diagnose. Compare.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Real-world simulation tools built with empirical formulas from Rosato, Brandrup, and ASTM standards.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
              100% Free Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group border-2 border-slate-900 rounded-2xl p-6 bg-[#FAF8F5] hover:bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-4 p-3 rounded-xl w-fit border border-slate-200 shadow-sm" style={{ backgroundColor: tool.bg }}>
                    {tool.icon}
                  </div>
                  <h3 className="font-display font-black text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
                    Launch Tool <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. EXPLORE PORTALS STRIP (World Atlas, History, Careers, Simulations) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* History */}
          <Link
            href="/history"
            className="group relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 p-6 flex flex-col justify-end min-h-[280px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3),transparent)]" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] font-mono font-bold bg-blue-600 px-2.5 py-1 rounded text-white uppercase tracking-widest">
                1862 &rarr; 2026
              </span>
              <h3 className="font-display text-2xl font-black">History of Polymers</h3>
              <p className="text-xs text-slate-300 font-light">162-year interactive timeline from Parkesine and Bakelite to high-temperature Vitrimers.</p>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 pt-2">
                Explore Timeline <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* World Atlas */}
          <Link
            href="/world"
            className="group relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 p-6 flex flex-col justify-end min-h-[280px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.3),transparent)]" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] font-mono font-bold bg-orange-600 px-2.5 py-1 rounded text-white uppercase tracking-widest">
                7 Core Pillars
              </span>
              <h3 className="font-display text-2xl font-black">World Atlas &amp; Industries</h3>
              <p className="text-xs text-slate-300 font-light">Deep engineering breakdowns for Packaging, Healthcare, Aerospace, Auto, and Construction.</p>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 pt-2">
                Open Deep-Dives <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Industry Careers */}
          <Link
            href="/careers"
            className="group relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 p-6 flex flex-col justify-end min-h-[280px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,0.3),transparent)]" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] font-mono font-bold bg-emerald-600 px-2.5 py-1 rounded text-white uppercase tracking-widest">
                SPE Careers Hub
              </span>
              <h3 className="font-display text-2xl font-black">Industry Career Pathways</h3>
              <p className="text-xs text-slate-300 font-light">SPE division tracks, ATS resume builder, and ₹4–28 LPA Indian compensation benchmarks.</p>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 pt-2">
                Explore Careers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* ── 6. QUOTE BREAKER ── */}
      <section className="bg-[#0A1628] text-white py-16 px-4 border-y-2 border-slate-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 leading-tight">
            &ldquo;Plastics are the workhorses of modern civilization — invisible, indispensable, misunderstood.&rdquo;
          </p>
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest pt-2">
            &mdash; Industry Perspective &middot; PolymerHub
          </p>
        </div>
      </section>

      {/* ── 7. AI TUTOR HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1628] via-[#0F284D] to-[#0A1628] border-2 border-slate-900 shadow-2xl p-8 sm:p-12 text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1">
                <Brain className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-200">
                  AI Tutor &middot; Grounded in 216 Lessons
                </span>
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                Ask Anything. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-orange-400">
                  Get Rigorous Engineering Answers.
                </span>
              </h2>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
                Not a generic chatbot. PolymerHub AI Tutor uses real vector similarity search across all 216 lessons — citing actual equations, ASTM standards, and textbook data.
              </p>
              
              {/* Question Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'What is the difference between Izod & Charpy impact?',
                  'How does vulcanization cure kinetics work?',
                  'Calculate cooling time for 3mm PP wall'
                ].map((q) => (
                  <Link
                    key={q}
                    href={`/ai-tutor?prompt=${encodeURIComponent(q)}`}
                    className="text-xs font-mono text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg transition-all"
                  >
                    &ldquo;{q}&rdquo;
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <Link 
                  href="/ai-tutor" 
                  className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider px-7 py-3.5 rounded-xl border-2 border-slate-900 transition-all shadow-[4px_4px_0px_0px_#000]"
                >
                  <Sparkles className="w-4 h-4" /> Launch AI Tutor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Live Simulation Bubble */}
            <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-slate-300">Live &middot; 15 Free Queries/Day</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded">
                  Gemini RAG Pipeline
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <p className="text-[10px] font-mono text-slate-400 mb-1">Student asked:</p>
                  <p className="text-slate-200 font-medium">&ldquo;Why does PP become brittle after gamma sterilization?&rdquo;</p>
                </div>
                <div className="bg-blue-950/40 border border-blue-500/30 p-3.5 rounded-xl text-slate-300 leading-relaxed">
                  <p className="text-[10px] font-mono text-emerald-400 mb-1 font-bold">AI Tutor (Citing Lesson 4: Medical Plastics):</p>
                  <p className="text-slate-200">
                    Standard PP undergoes free-radical chain scission under high-energy gamma radiation. Radiation-stabilised grades with specialized HALS antioxidants are required to prevent post-irradiation embrittlement.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. TRUST BADGES STRIP ── */}
      <section className="bg-white border-t-2 border-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-600" />
              India DPDP Act 2023 Compliant
            </span>
            <span className="w-px h-4 bg-slate-300 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-600" />
              100% Legally &amp; Academically Audited
            </span>
            <span className="w-px h-4 bg-slate-300 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-amber-600" />
              19 Subjects &middot; 216 Lessons Mapped
            </span>
            <span className="w-px h-4 bg-slate-300 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              🇮🇳 Made in India for Global Engineers
            </span>
          </div>
        </div>
      </section>

      {/* ── 9. PLATFORM FOOTER ── */}
      <footer className="bg-[#0A1628] text-white border-t-2 border-slate-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1 space-y-4">
              <div className="font-display text-2xl font-black tracking-tight">
                Polymer<span className="text-amber-400">Hub</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                India&apos;s first Plastic Polymer Engineering knowledge platform for B.Tech &amp; Diploma students, faculty, and industry professionals.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="https://twitter.com/polymerhub_" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="X (Twitter)">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/lpk-naidu-3414153b2" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {[
              { title: 'Learn', links: [{ label: 'All 19 Subjects', href: '/subjects' }, { label: 'Materials Database', href: '/materials' }, { label: 'AI Polymer Tutor', href: '/ai-tutor' }, { label: 'Reading Room', href: '/library' }] },
              { title: 'Explore', links: [{ label: 'The World of Plastic', href: '/world' }, { label: '162 Years History', href: '/history' }, { label: 'Daily News Pulse', href: '/today' }, { label: 'SPE Career Tracks', href: '/careers' }] },
              { title: 'Tools & Legal', links: [{ label: 'Defect Troubleshooter', href: '/troubleshooter' }, { label: 'Polymer Comparator', href: '/comparator' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wider text-center md:text-left">
              &copy; 2026 PolymerHub &middot; India&apos;s #1 Plastic Polymer Engineering Knowledge Platform
            </p>
            <div className="flex gap-2">
              {['#2563EB', '#EA580C', '#15803D', '#CA8A04', '#7C3AED'].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
