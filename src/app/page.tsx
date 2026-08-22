'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Brain, Zap,
  Newspaper, BookOpen, Wrench, Scale
} from 'lucide-react'

// ─── Subject data with domain colors ─────────────────────────────────────────

const SUBJECTS = [
  {
    name: 'Polymer Chemistry',
    slug: 'polymer-chemistry',
    lessons: 15,
    color: 'blue',
    bg: '#EFF6FF',
    border: '#1D4ED8',
    shadow: '4px 4px 0px 0px #1D4ED8',
    tag: 'Foundation',
    desc: 'Polymerization, molecular structure, Tg, Tm, degradation',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    wide: true,
  },
  {
    name: 'Polymer Processing',
    slug: 'polymer-processing',
    lessons: 20,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Manufacturing',
    desc: 'Injection moulding, extrusion, blow moulding, defects',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    wide: false,
  },
  {
    name: 'Mould Design',
    slug: 'mould-design',
    lessons: 12,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Engineering',
    desc: 'Gate design, cooling, ejection, CAD/CAE simulation',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
    wide: false,
  },
  {
    name: 'Polymer Testing',
    slug: 'polymer-testing',
    lessons: 10,
    color: 'violet',
    bg: '#F5F3FF',
    border: '#7C3AED',
    shadow: '4px 4px 0px 0px #7C3AED',
    tag: 'QA/QC',
    desc: 'Tensile, impact, DSC, TGA, MFI, Shore hardness',
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
    wide: false,
  },
  {
    name: 'Rubber Technology',
    slug: 'rubber-technology',
    lessons: 9,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Elastomers',
    desc: 'Vulcanization, NR/SBR/EPDM, tyre construction, latex',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    wide: false,
  },
  {
    name: 'Recycling Technology',
    slug: 'recycling-technology',
    lessons: 12,
    color: 'green',
    bg: '#F0FDF4',
    border: '#15803D',
    shadow: '4px 4px 0px 0px #15803D',
    tag: 'Circular Economy',
    desc: 'Mechanical recycling, pyrolysis, PETase enzymes, EPR',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    wide: true,
  },
  {
    name: 'Sustainable Plastics',
    slug: 'sustainable-plastics',
    lessons: 18,
    color: 'green',
    bg: '#F0FDF4',
    border: '#15803D',
    shadow: '4px 4px 0px 0px #15803D',
    tag: 'Bioplastics',
    desc: 'PLA, PHA, bio-PE, mono-material packaging design',
    image: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
    wide: false,
  },
  {
    name: 'Polymer Composites',
    slug: 'polymer-composites',
    lessons: 16,
    color: 'blue',
    bg: '#EFF6FF',
    border: '#1D4ED8',
    shadow: '4px 4px 0px 0px #1D4ED8',
    tag: 'Advanced',
    desc: 'CFRP, GFRP, natural fibre, failure modes, ISRO applications',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    wide: false,
  },
  {
    name: 'Entrepreneurship',
    slug: 'entrepreneurship-plastics',
    lessons: 11,
    color: 'yellow',
    bg: '#FEFCE8',
    border: '#CA8A04',
    shadow: '4px 4px 0px 0px #CA8A04',
    tag: 'Business',
    desc: '₹10L–2Cr startup tiers, BIS certification, EPR, export',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    wide: false,
  },
  {
    name: 'Medical Plastics',
    slug: 'medical-plastics',
    lessons: 12,
    color: 'violet',
    bg: '#F5F3FF',
    border: '#7C3AED',
    shadow: '4px 4px 0px 0px #7C3AED',
    tag: 'Specialised',
    desc: 'ISO 10993, PEEK implants, sterilization, cleanroom moulding',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80',
    wide: false,
  },
  {
    name: 'Polymer Rheology',
    slug: 'polymer-rheology',
    lessons: 9,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Advanced',
    desc: 'Shear-thinning, viscoelasticity, capillary rheometry, melt fracture, WLF equation',
    image: 'https://images.unsplash.com/photo-1544257121-654dbcc18e5e?w=600&q=80',
    wide: false,
  },
  {
    name: 'Additives & Compounding',
    slug: 'additives-compounding',
    lessons: 16,
    color: 'blue',
    bg: '#EFF6FF',
    border: '#1D4ED8',
    shadow: '4px 4px 0px 0px #1D4ED8',
    tag: 'Formulation',
    desc: 'Antioxidants, UV stabilizers, plasticizers, flame retardants, twin-screw compounding',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&q=80',
    wide: false,
  },
  {
    name: 'Plastic Packaging Engineering',
    slug: 'plastic-packaging-engineering',
    lessons: 16,
    color: 'green',
    bg: '#F0FDF4',
    border: '#15803D',
    shadow: '4px 4px 0px 0px #15803D',
    tag: 'Application',
    desc: 'Barrier properties, multilayer films, PET bottles, food contact regulations',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80',
    wide: true,
  },
  {
    name: 'Life Cycle Assessment',
    slug: 'life-cycle-assessment',
    lessons: 8,
    color: 'green',
    bg: '#F0FDF4',
    border: '#15803D',
    shadow: '4px 4px 0px 0px #15803D',
    tag: 'Sustainability',
    desc: 'ISO 14040, carbon footprint, LCA of packaging, GWP calculations, EPR connection',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
    wide: false,
  },
  {
    name: 'Color Science & Masterbatches',
    slug: 'color-science-masterbatches',
    lessons: 8,
    color: 'yellow',
    bg: '#FEFCE8',
    border: '#CA8A04',
    shadow: '4px 4px 0px 0px #CA8A04',
    tag: 'Design',
    desc: 'TiO2, organic pigments, spectrophotometry, Delta E, masterbatch formulation',
    image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=600&q=80',
    wide: false,
  },
  {
    name: 'Polymer Nanotechnology',
    slug: 'polymer-nanotechnology',
    lessons: 6,
    color: 'blue',
    bg: '#EFF6FF',
    border: '#1D4ED8',
    shadow: '4px 4px 0px 0px #1D4ED8',
    tag: 'Nanotech',
    desc: 'Nanocomposites, carbon nanotubes, nanoclay, properties enhancement, characterization',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    wide: false,
  },
  {
    name: 'Bioprocessing & Fermentation',
    slug: 'bioprocessing-fermentation',
    lessons: 6,
    color: 'green',
    bg: '#F0FDF4',
    border: '#15803D',
    shadow: '4px 4px 0px 0px #15803D',
    tag: 'Biotech',
    desc: 'Microbial synthesis of PHA, fermentation parameters, feedstock purification, downstream recovery',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&q=80',
    wide: false,
  },
  {
    name: 'Robotics in Plastics Manufacturing',
    slug: 'robotics-plastics',
    lessons: 6,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Automation',
    desc: 'Part retrieval, degating robots, insert molding automation, cobots in compounding & packaging',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    wide: false,
  },
  {
    name: 'Digital Twins in Polymer Manufacturing',
    slug: 'digital-twins-plastics',
    lessons: 6,
    color: 'yellow',
    bg: '#FEFCE8',
    border: '#CA8A04',
    shadow: '4px 4px 0px 0px #CA8A04',
    tag: 'Industry 4.0',
    desc: 'Real-time cavity pressure matching, machine learning in extrusion, predictive maintenance',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&q=80',
    wide: true,
  },
]

const STATS = [
  { value: '216', unit: 'Lessons', label: 'Across 19 subjects', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: '17', unit: 'Reference Books', label: 'Mapped to your career', color: '#7C3AED', bg: '#F5F3FF' },
  { value: '20+', unit: 'Polymers', label: 'With full property data', color: '#EA580C', bg: '#FFF7ED' },
  { value: '₹0', unit: 'To Start', label: '15 AI queries/day free', color: '#15803D', bg: '#F0FDF4' },
]

const TOOLS = [
  { name: 'Defect Troubleshooter', desc: 'Fix sink marks, warpage, flash — corrective actions from Rosato', href: '/troubleshooter', color: '#EA580C', bg: '#FFF7ED', icon: Wrench },
  { name: 'Property Comparator', desc: 'Compare 20 polymers across 15 properties from Brandrup Handbook', href: '/comparator', color: '#1D4ED8', bg: '#EFF6FF', icon: Scale },
  { name: 'Reference Library', desc: '17 books & original guides that define the global plastics sector — mapped to your subjects', href: '/library', color: '#7C3AED', bg: '#F5F3FF', icon: BookOpen },
  { name: 'AI Tutor', desc: 'Ask anything — grounded in your actual lessons via real RAG pipeline', href: '/ai-tutor', color: '#15803D', bg: '#F0FDF4', icon: Brain },
]

// ─── Components ───────────────────────────────────────────────────────────────

function HeroTicker() {
  const items = [
    '🔥 Carbios opens world\'s first enzymatic PET recycling plant',
    '📊 Reliance Repol PP: ₹94.50/kg ▲0.8%',
    '🏭 India processes 20M+ tonnes of polymer annually',
    '🚀 ISRO PSLV uses CFRP composite structures',
    '♻️ EU PPWR mandates 30% recycled content in bottles by 2030',
    '🇮🇳 India\'s medical device market growing at 15-18% CAGR',
  ]

  return (
    <div className="bg-yellow-bright border-y-4 border-ink overflow-hidden h-10 flex items-center">
      <div className="bg-ink text-yellow-bright font-mono text-xs font-bold px-4 h-full flex items-center flex-shrink-0 border-r-4 border-ink uppercase tracking-widest">
        Live
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="font-mono text-xs font-semibold text-ink px-8 border-r-2 border-ink/20">
              {item}
            </span>
          ))}
        </div>
      </div>
      <Link href="/today" className="bg-ink text-yellow-bright font-mono text-xs font-bold px-4 h-full flex items-center flex-shrink-0 border-l-4 border-ink uppercase tracking-wider hover:bg-blue transition-colors">
        Daily Pulse →
      </Link>
    </div>
  )
}

function SubjectCard({ subject }: { subject: typeof SUBJECTS[0] }) {
  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="group block border-4 bg-canvas overflow-hidden"
      style={{ borderColor: subject.border, boxShadow: subject.shadow, transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(-3px, -3px)'
        el.style.boxShadow = subject.shadow.replace('4px 4px', '7px 7px')
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(0, 0)'
        el.style.boxShadow = subject.shadow
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: subject.wide ? '200px' : '160px' }}>
        <img
          src={subject.image}
          alt={subject.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0" style={{ background: `${subject.border}CC` }} />
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[10px] font-bold text-white border-2 border-white px-2 py-0.5 uppercase tracking-wider bg-transparent">
            {subject.tag}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[10px] font-bold text-white border-2 border-white px-2 py-0.5">
          {subject.lessons} LESSONS
        </div>
      </div>

      {/* Content */}
      <div className="p-4" style={{ backgroundColor: subject.bg }}>
        <h3
          className="font-display text-lg font-black text-ink mb-1 leading-tight group-hover:underline"
          style={{ textDecorationColor: subject.border }}
        >
          {subject.name}
        </h3>
        <p className="text-xs text-ink/70 leading-relaxed">{subject.desc}</p>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated polymer chain background
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

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; }[] = []
    const colors = ['#1D4ED8', '#EA580C', '#15803D', '#7C3AED', '#CA8A04']

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animationId: number

    const draw = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Ambient radial dark gradient
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.2, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      )
      gradient.addColorStop(0, '#0E213A')
      gradient.addColorStop(0.5, '#071120')
      gradient.addColorStop(1, '#040912')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw connection lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '30'
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

  const floatingPolymers = [
    { label: 'PE', name: 'Polyethylene', x: '82%', y: '12%', color: '#3B82F6', delay: '0s' },
    { label: 'PET', name: 'Polyethylene Terephthalate', x: '45%', y: '15%', color: '#F97316', delay: '1.5s' },
    { label: 'PVC', name: 'Polyvinyl Chloride', x: '50%', y: '32%', color: '#22C55E', delay: '3.0s' },
    { label: 'PP', name: 'Polypropylene', x: '74%', y: '24%', color: '#A855F7', delay: '4.5s' },
    { label: 'PLA', name: 'Polylactic Acid', x: '42%', y: '48%', color: '#EAB308', delay: '6.0s' },
    { label: 'PS', name: 'Polystyrene', x: '92%', y: '34%', color: '#EC4899', delay: '7.5s' },
  ]

  return (
    <div className="min-h-screen bg-canvas">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden border-b-4 border-slate-900 bg-[#040912] py-16">
        
        {/* Animated Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040912] via-[#040912]/80 to-transparent z-10" />

        {/* Floating Hexagonal Polymer Badges */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block">
          {floatingPolymers.map((p) => (
            <div
              key={p.label}
              className="absolute animate-float-slow p-2.5 rounded-xl border-2 bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl"
              style={{
                left: p.x,
                top: p.y,
                borderColor: `${p.color}40`,
                animationDelay: p.delay,
                transform: 'translate(-50%, -50%)',
                minWidth: '100px'
              }}
            >
              <span className="font-display font-black text-xs uppercase" style={{ color: p.color }}>{p.label}</span>
              <span className="text-[8px] text-white/50 leading-none mt-0.5 tracking-tight font-medium max-w-[80px] truncate">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Column Content */}
          <div className="max-w-3xl flex-1 space-y-6">
            
            {/* Brand Logo Badge */}
            <div className="inline-block bg-white border-4 border-slate-900 p-2.5 rounded-xl shadow-[4px_4px_0px_0px_#EAB308]">
              <Image
                src="/logo-vertical.jpg"
                alt="Polymer Hub of India"
                width={150}
                height={100}
                className="object-contain"
                priority
              />
            </div>

            {/* Sub-label Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black text-white/90 tracking-widest uppercase font-mono">
                India&apos;s #1 Polymer Engineering Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight uppercase">
              Where
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500">
                Polymer Science
              </span>
              <br />
              Meets the Future
            </h1>

            {/* Sub-description */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-light">
              Learn the science. Understand the industry. Explore the materials, 
              processes, and engineering technologies shaping the world of plastics.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white border-2 border-slate-950 font-black px-6 py-3.5 rounded-xl transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 text-xs font-mono tracking-wider uppercase"
              >
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/comparator"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-black px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 text-xs font-mono tracking-wider uppercase"
              >
                Compare Materials
              </Link>
            </div>

            {/* Blockquote Quote */}
            <div className="border-l-4 border-[#F97316] pl-4 py-1">
              <p className="text-xs text-white/50 italic font-light">
                &quot;The future isn&apos;t made from one material. It&apos;s engineered from many.&quot;
              </p>
            </div>

            {/* Integrated Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <p className="text-xl md:text-2xl font-black text-white">216+</p>
                <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Lessons Live</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-black text-white">357+</p>
                <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Videos Mapped</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-black text-white">50</p>
                <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Curated Books</p>
              </div>
            </div>

          </div>

          {/* Right Column Graphic */}
          <div className="hidden lg:block w-[400px] h-[480px] relative z-10 flex-shrink-0">
            <div className="absolute inset-0 border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(34,197,94,0.3)] bg-slate-950">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Engineering collaboration"
                fill
                sizes="400px"
                className="object-cover object-center opacity-65 hover:opacity-90 transition-opacity duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040912] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040912]/40 via-transparent to-transparent" />
            </div>
            
            {/* Glowing Accent Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* ── LIVE TICKER ──────────────────────────────────────── */}
      <HeroTicker />

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-ink border-ink">
          {STATS.map((stat) => (
            <div key={stat.value} className="p-6 md:p-8 text-center" style={{ backgroundColor: stat.bg }}>
              <div className="font-display text-4xl md:text-5xl font-black mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-ink border-b-2 border-ink inline-block mb-1">
                {stat.unit}
              </div>
              <div className="text-xs text-ink/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS GRID ────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        {/* Section header */}
        <div className="border-b-4 border-ink px-6 md:px-12 py-5 flex items-center justify-between bg-ink">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                19 Subjects · 216 Lessons
              </h2>
              <p className="font-mono text-xs text-white/60 uppercase tracking-wider">The complete PPE curriculum</p>
            </div>
          </div>
          <Link href="/subjects" className="cn-btn-yellow text-sm hidden md:inline-flex">
            All Subjects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric grid */}
        <div className="p-6 md:p-8">
          {/* Row 1: 2-wide + 2-standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[0]} />
            </div>
            <div className="flex flex-col gap-4">
              <SubjectCard subject={SUBJECTS[1]} />
            </div>
          </div>

          {/* Row 2: 3 standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <SubjectCard subject={SUBJECTS[2]} />
            <SubjectCard subject={SUBJECTS[3]} />
            <SubjectCard subject={SUBJECTS[4]} />
          </div>

          {/* Row 3: 2-wide + 1 standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[5]} />
            </div>
            <SubjectCard subject={SUBJECTS[6]} />
          </div>

          {/* Row 4: 3 standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <SubjectCard subject={SUBJECTS[7]} />
            <SubjectCard subject={SUBJECTS[8]} />
            <SubjectCard subject={SUBJECTS[9]} />
          </div>

          {/* Row 5: 2-wide + 1 standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[12]} />
            </div>
            <SubjectCard subject={SUBJECTS[10]} />
          </div>

          {/* Row 6: 3 standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <SubjectCard subject={SUBJECTS[11]} />
            <SubjectCard subject={SUBJECTS[13]} />
            <SubjectCard subject={SUBJECTS[14]} />
          </div>

          {/* Row 7: 2-wide + 1 standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[15]} />
            </div>
            <SubjectCard subject={SUBJECTS[16]} />
          </div>

          {/* Row 8: 2-wide + 1 standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[18]} />
            </div>
            <SubjectCard subject={SUBJECTS[17]} />
          </div>
        </div>
      </section>

      {/* ── QUOTE BREAKER 1 ──────────────────────────────────── */}
      <section className="cn-quote border-y-4 border-ink">
        <div className="max-w-4xl mx-auto">
          <p className="cn-quote-text text-yellow-bright mb-4">
            &quot;Plastics are the workhorses of modern civilization — invisible, indispensable, misunderstood.&quot;
          </p>
          <p className="font-mono text-sm text-white/50 uppercase tracking-widest">
            — Industry Perspective · PolymerHub
          </p>
        </div>
      </section>

      {/* ── TOOLS SECTION ────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="border-b-4 border-ink px-6 md:px-12 py-5 bg-violet flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-canvas border-4 border-canvas flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                Interactive Tools
              </h2>
              <p className="font-mono text-xs text-white/60 uppercase tracking-wider">No textbook has these</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-ink">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="group border-4 border-ink p-6 md:p-8 block"
                style={{
                  backgroundColor: tool.bg,
                  borderColor: '#0A0A0A',
                  marginTop: i < 2 ? 0 : '-4px',
                  marginLeft: i % 2 === 1 ? '-4px' : 0,
                }}
              >
                <div
                  className="w-12 h-12 border-4 border-ink flex items-center justify-center mb-4"
                  style={{ backgroundColor: tool.color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-black text-ink mb-2 group-hover:underline" style={{ textDecorationColor: tool.color }}>
                  {tool.name}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed mb-4">{tool.desc}</p>
                <span
                  className="font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 border-b-2 pb-0.5"
                  style={{ color: tool.color, borderColor: tool.color }}
                >
                  Open Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── EXPLORE STRIP ────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-ink">

          {/* History */}
          <Link href="/history" className="group relative overflow-hidden block border-ink" style={{ minHeight: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
              alt="History of plastics"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-blue/80" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <div className="cn-label border-white text-white text-[10px] mb-3 w-fit">History</div>
              <h3 className="font-display text-2xl font-black text-white leading-tight mb-2">
                162 Years of a Material That Remade Civilization
              </h3>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider flex items-center gap-1">
                Explore Timeline <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* World */}
          <Link href="/world" className="group relative overflow-hidden block" style={{ minHeight: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=600&q=80"
              alt="World of plastic"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-orange/80" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <div className="cn-label border-white text-white text-[10px] mb-3 w-fit">World</div>
              <h3 className="font-display text-2xl font-black text-white leading-tight mb-2">
                Without Polymer Engineering, Modern Life Stops
              </h3>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider flex items-center gap-1">
                7 Industries <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Careers */}
          <Link href="/careers" className="group relative overflow-hidden block" style={{ minHeight: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80"
              alt="Careers in plastics"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-green/80" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <div className="cn-label border-white text-white text-[10px] mb-3 w-fit">Careers</div>
              <h3 className="font-display text-2xl font-black text-white leading-tight mb-2">
                6 Career Tracks. ₹4–40 LPA Range. Your Choice.
              </h3>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider flex items-center gap-1">
                Career Hub <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── AI TUTOR SECTION ─────────────────────────────────── */}
      <section className="border-b-4 border-ink bg-green">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="cn-label border-white text-white text-[10px] mb-4 w-fit bg-white/20">
              AI Tutor — Powered by Gemini
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Ask Anything.<br />Get Answers Grounded<br />in Your Lessons.
            </h2>
            <p className="text-white/80 text-base leading-relaxed mb-6">
              Not a generic chatbot. The PolymerHub AI Tutor uses real pgvector similarity search across all 216 lessons — so every answer cites actual lesson content.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['What is the difference between Izod and Charpy testing?', 'How does vulcanization work?', 'Which career suits me?'].map((q) => (
                <span key={q} className="font-mono text-xs border-2 border-white text-white px-3 py-1.5 bg-white/10">
                  {q}
                </span>
              ))}
            </div>
            <Link href="/ai-tutor" className="cn-btn bg-white text-green border-white font-black">
              Ask the AI Tutor <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="border-4 border-white bg-white/10 p-6 w-full md:w-80 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-yellow-bright animate-pulse" />
              <span className="font-mono text-xs font-bold text-white/80 uppercase tracking-wider">Live · 15 free queries/day</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/20 border-2 border-white/30 p-3">
                <p className="font-mono text-xs text-white/70 mb-1">Student asks:</p>
                <p className="text-sm text-white font-medium">&quot;Why does PP become brittle after gamma sterilization?&quot;</p>
              </div>
              <div className="bg-white border-2 border-white p-3">
                <p className="font-mono text-xs text-green mb-1">AI Tutor answers from Lesson 4:</p>
                <p className="text-sm text-ink">Standard PP undergoes chain scission under gamma radiation — radiation-stabilised grades with HALS antioxidants are required for medical devices...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE BREAKER 2 ──────────────────────────────────── */}
      <section className="cn-quote">
        <div className="max-w-4xl mx-auto">
          <p className="cn-quote-text text-orange mb-4">
            &quot;The next great polymer solving ocean waste is being designed right now.&quot;
          </p>
          <p className="font-display text-3xl md:text-4xl font-black text-white mt-3">
            Will it be you?
          </p>
          <div className="mt-8">
            <Link href="/login" className="cn-btn-yellow text-base">
              Start for Free — No Credit Card <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DAILY PULSE TEASER ───────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="border-b-4 border-ink px-6 md:px-12 py-5 bg-yellow-bright flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-ink" />
            <h2 className="font-display text-2xl font-black text-ink uppercase">Daily Pulse</h2>
            <span className="font-mono text-xs font-bold border-2 border-ink px-2 py-0.5 bg-ink text-yellow-bright">LIVE</span>
          </div>
          <Link href="/today" className="cn-btn-black text-sm">
            Full Feed <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-ink">
          {[
            { tag: 'Research', color: '#1D4ED8', bg: '#EFF6FF', headline: 'MIT Engineers Synthesize Self-Healing Biopolymer From Marine Chitin', time: 'Today, 05:45 AM IST' },
            { tag: 'Market', color: '#EA580C', bg: '#FFF7ED', headline: 'Reliance Adjusts Repol PP Pricing Across Gujarat Distribution Hubs', time: 'Today, 08:15 AM IST' },
            { tag: 'Sustainability', color: '#15803D', bg: '#F0FDF4', headline: 'PETase Enzyme Trial Enters Pilot Scale at Carbios — PET Recycling Milestone', time: 'Today, 09:30 AM IST' },
          ].map((item) => (
            <div key={item.headline} className="p-6 md:p-8" style={{ backgroundColor: item.bg }}>
              <span
                className="font-mono text-[10px] font-bold border-2 border-ink px-2 py-0.5 uppercase tracking-wider mb-3 inline-block"
                style={{ borderColor: item.color, color: item.color }}
              >
                {item.tag}
              </span>
              <h3 className="font-display text-lg font-black text-ink leading-tight mb-3">
                {item.headline}
              </h3>
              <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">{item.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-ink border-t-4 border-ink">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              {/* Official Brand Logo in Footer */}
              <div className="mb-4">
                <a href="/" aria-label="Polymer Hub of India">
                  <img
                    src="/logo-white.svg"
                    alt="Polymer Hub of India"
                    width={220}
                    height={50}
                    style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement
                      t.src = '/logo-banner.jpg'
                      t.style.filter = 'brightness(0) invert(1)'
                    }}
                  />
                </a>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                India&apos;s first Plastic Polymer Engineering knowledge platform for B.Tech students.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="https://twitter.com/polymerhub_" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors" title="X (Twitter)">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/lpk-naidu-3414153b2" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors" title="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://t.me/PolymerHub" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors" title="Telegram Channel">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>

            {[
              { title: 'Learn', links: [{ label: 'All Subjects', href: '/subjects' }, { label: 'Materials DB', href: '/materials' }, { label: 'AI Tutor', href: '/ai-tutor' }, { label: 'Reference Library', href: '/library' }] },
              { title: 'Explore', links: [{ label: 'World of Plastic', href: '/world' }, { label: 'History', href: '/history' }, { label: 'Daily Pulse', href: '/today' }, { label: 'Careers', href: '/careers' }] },
              { title: 'Tools', links: [{ label: 'Defect Troubleshooter', href: '/troubleshooter' }, { label: 'Property Comparator', href: '/comparator' }, { label: 'Pricing — ₹149/mo', href: '/pricing' }, { label: 'Sign In', href: '/login' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-xs font-bold text-yellow-bright uppercase tracking-widest mb-4 border-b-2 border-yellow-bright pb-2">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-white/60 hover:text-white hover:underline transition-colors font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t-4 border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
              © 2026 PolymerHub · India&apos;s First PPE Knowledge Platform
            </p>
            <div className="flex gap-4">
              {['#1D4ED8', '#EA580C', '#15803D', '#CA8A04', '#7C3AED'].map((c) => (
                <div key={c} className="w-4 h-4 border-2 border-white/20" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
