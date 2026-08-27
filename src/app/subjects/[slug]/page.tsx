import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Brain,
  BookOpen,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Shield,
  Award,
  Clock,
  Layers,
  GraduationCap,
  CheckCircle2
} from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import Footer from '@/components/Footer'

// ─── Domain & Pedagogical Metadata ──────────────────────────────────────────

interface DomainConfig {
  color: string
  bg: string
  light: string
  label: string
  tag: string
  image: string
  quote: string
  quoteAuthor: string
  prerequisites: string[]
  learningOutcomes: string[]
  aiPrompts: string[]
}

const DOMAIN_DATA: Record<string, DomainConfig> = {
  'polymer-chemistry': {
    color: '#1D4ED8',
    bg: '#EFF6FF',
    light: '#DBEAFE',
    label: 'Chemistry & Science',
    tag: 'Foundation',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    quote: 'Understanding the macromolecule is understanding the material. Everything else is engineering from that physical foundation.',
    quoteAuthor: 'Hermann Staudinger · Nobel Laureate in Chemistry',
    prerequisites: ['Basic Organic Chemistry (Functional groups)', 'Chemical Thermodynamics (Enthalpy & Entropy)', 'Introductory Reaction Kinetics'],
    learningOutcomes: [
      'Master molecular weight averages (Mn, Mw, Mz) and dispersity (PDI)',
      'Differentiate step-growth vs chain-growth polymerization mechanisms',
      'Analyze crystalline spherulite morphology and amorphous glass transitions (Tg)',
      'Interpret spectroscopic characterization techniques (GPC/SEC, FTIR, NMR)'
    ],
    aiPrompts: [
      'Explain the kinetic differences between Free Radical and Anionic polymerization',
      'Why is PET used for beverage bottles while Kevlar forms bulletproof fibers?',
      'How does molecular weight distribution affect melt flow index?'
    ]
  },
  'polymer-processing': {
    color: '#EA580C',
    bg: '#FFF7ED',
    light: '#FED7AA',
    label: 'Processing & Manufacturing',
    tag: 'Manufacturing',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    quote: 'Every finished plastic product is the result of thousands of micro-decisions across temperature, pressure, and flow kinetics.',
    quoteAuthor: 'Modern Plastics Processing & Rheology',
    prerequisites: ['Fluid Dynamics Basics', 'Polymer Melt Rheology', 'Industrial Heat Transfer'],
    learningOutcomes: [
      'Calculate clamping tonnage, screw recovery rates, and plasticizing capacity',
      'Optimize 3-stage injection molding cycles (Fill, Pack, Cool)',
      'Troubleshoot factory defects: sink marks, warpage, weld lines, and flash',
      'Design high-throughput extrusion dies and film blowing chill rings'
    ],
    aiPrompts: [
      'How do you calculate holding pressure to eliminate sink marks?',
      'Explain the causes of melt fracture in blown film extrusion',
      'What is the formula for mold cooling time estimation?'
    ]
  },
  'mould-design': {
    color: '#EA580C',
    bg: '#FFF7ED',
    light: '#FED7AA',
    label: 'Processing & Manufacturing',
    tag: 'Engineering',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=80',
    quote: 'The injection mould is where polymer physics meets precision mechanical tooling. Perfecting the steel geometry saves millions in production.',
    quoteAuthor: 'Tool & Die Engineering Handbook',
    prerequisites: ['Engineering Graphics / CAD (SolidWorks/NX)', 'Material Shrinkage Mechanics', 'Machining & EDM Standards'],
    learningOutcomes: [
      'Design balanced two-plate and three-plate runner feed systems',
      'Calculate cooling channel pitch and Reynolds turbulent flow (>4,000)',
      'Size ejector pins, stripper plates, and hydraulic core-pull side actions',
      'Select P20, H13, and stainless steel tool alloys for wear resistance'
    ],
    aiPrompts: [
      'What are the design criteria for submarine gate sizing in PP parts?',
      'How to balance hot runner manifold pressure drops?',
      'Calculate thermal expansion compensation for core inserts'
    ]
  },
  'polymer-testing': {
    color: '#7C3AED',
    bg: '#F5F3FF',
    light: '#DDD6FE',
    label: 'Testing & QA/QC',
    tag: 'QA / QC',
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=1200&q=80',
    quote: 'A number on a technical datasheet is only as trustworthy as the ASTM/ISO standardized test that produced it.',
    quoteAuthor: 'ASTM International Standards Committee',
    prerequisites: ['Strength of Materials', 'Quality Control & Metrology', 'Basic Statistics (Standard Deviation)'],
    learningOutcomes: [
      'Perform tensile, flexural, and Izod/Charpy impact tests (ASTM D638, D790, D256)',
      'Determine thermal properties via Differential Scanning Calorimetry (DSC) and TGA',
      'Measure Melt Flow Index (MFI) and Melt Volume Rate (MVR) under ASTM D1238',
      'Execute Environmental Stress Crack Resistance (ESCR) benchmarking'
    ],
    aiPrompts: [
      'Explain how DSC thermograms identify polymer blends and crystallinity',
      'What is the difference between ASTM D638 Type I and Type IV specimens?',
      'How to conduct heat deflection temperature (HDT) testing under 1.8 MPa load?'
    ]
  },
  'rubber-technology': {
    color: '#EA580C',
    bg: '#FFF7ED',
    light: '#FED7AA',
    label: 'Processing & Manufacturing',
    tag: 'Elastomers',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    quote: 'Vulcanization turned an unusable raw sap into the crosslinked elastomeric material that put the world on wheels.',
    quoteAuthor: 'Charles Goodyear · Pioneer of Elastomer Science',
    prerequisites: ['Organic Chemistry of Diene Polymers', 'Viscoelasticity Basics', 'Compounding Ingredients'],
    learningOutcomes: [
      'Master sulfur and peroxide vulcanization crosslinking kinetics',
      'Formulate carbon black, silica, and plasticizer masterbatch recipes',
      'Operate internal Banbury mixers and two-roll milling calenders',
      'Analyze Mooney viscosity and Moving Die Rheometer (MDR) cure curves'
    ],
    aiPrompts: [
      'Compare NR, SBR, and EPDM for automotive weatherstrip applications',
      'Explain scorch safety time (ts2) and optimum cure time (tc90) in MDR',
      'How does carbon black structure affect hysteresis and rolling resistance?'
    ]
  },
  'recycling-technology': {
    color: '#15803D',
    bg: '#F0FDF4',
    light: '#BBF7D0',
    label: 'Circular Economy',
    tag: 'Recycling',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80',
    quote: 'The plastics engineer who understands post-consumer polymer separation at the molecular level possesses the most valuable skill in the circular economy.',
    quoteAuthor: 'Plastics Circularity & Sustainability Institute',
    prerequisites: ['Polymer Compatibility & Miscibility', 'Solid Waste Management Basics', 'Extrusion Compounding'],
    learningOutcomes: [
      'Implement NIR optical sorting and sink-float density separation techniques',
      'Mitigate thermo-mechanical degradation and chain scission during re-extrusion',
      'Formulate compatibilizers for immiscible rPET/rHDPE and rPP post-consumer streams',
      'Comply with Indian EPR (Extended Producer Responsibility) regulations 2026'
    ],
    aiPrompts: [
      'How to restore intrinsic viscosity (IV) of recycled PET via solid stating?',
      'What compatibilizers bridge PP and PE contamination in PCR streams?',
      'Explain the key differences between mechanical and chemical pyrolysis recycling'
    ]
  },
  'sustainable-plastics': {
    color: '#15803D',
    bg: '#F0FDF4',
    light: '#BBF7D0',
    label: 'Circular Economy',
    tag: 'Bioplastics',
    image: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=1200&q=80',
    quote: 'Bio-based does not automatically mean biodegradable. True sustainability requires rigorous life-cycle analysis from feedstock to soil.',
    quoteAuthor: 'Bio-based Polymers & Environmental Engineering',
    prerequisites: ['Polymer Synthesis', 'Biodegradation Standards (ISO 17088)', 'Agricultural Biomass Chemistry'],
    learningOutcomes: [
      'Synthesize Polylactic Acid (PLA), Polyhydroxyalkanoates (PHA), and bio-PET',
      'Evaluate enzymatic degradation in industrial composting vs marine environments',
      'Optimize crystallization rates of PLA through nucleating agents',
      'Verify bio-carbon content using ASTM D6866 Carbon-14 radiocarbon dating'
    ],
    aiPrompts: [
      'Why does PLA have low thermal resistance and how can it be nucleated?',
      'Compare PHA bacterial fermentation synthesis against ring-opening polymerization of lactide',
      'What are the regulatory requirements for compostable plastic certification in India?'
    ]
  },
  'polymer-composites': {
    color: '#1D4ED8',
    bg: '#EFF6FF',
    light: '#BFDBFE',
    label: 'Advanced Materials',
    tag: 'Composites',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80',
    quote: 'Fiber-reinforced composites deliver higher specific strength than aerospace alloys at one-fifth the density. That is pure engineering design.',
    quoteAuthor: 'Advanced Composite Materials Handbook',
    prerequisites: ['Anisotropic Mechanics', 'Thermoset Resin Systems', 'Fiber-Matrix Interfacial Chemistry'],
    learningOutcomes: [
      'Calculate laminate stiffness using Classical Lamination Theory (CLT)',
      'Operate Resin Transfer Molding (RTM) and Autoclave Prepreg processing',
      'Design silane coupling agents for glass and carbon fiber interfacial bonding',
      'Predict failure criteria using Tsai-Wu and Hashin damage models'
    ],
    aiPrompts: [
      'How does fiber volume fraction (Vf) affect composite tensile modulus according to the Rule of Mixtures?',
      'Explain void prevention during vacuum assisted resin transfer molding (VARTM)',
      'What are the advantages of thermoplastic composites (PEEK/CF) over epoxy prepregs?'
    ]
  }
}

// ─── Default fallback config ────────────────────────────────────────────────

const DEFAULT_CONFIG: DomainConfig = {
  color: '#1D4ED8',
  bg: '#EFF6FF',
  light: '#DBEAFE',
  label: 'Polymer Engineering',
  tag: 'Curriculum',
  image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
  quote: 'The fundamental physical laws of polymer science and processing technology empower modern industrial manufacturing.',
  quoteAuthor: 'PolymerHub Academic Advisory Board',
  prerequisites: ['Undergraduate Science / Chemistry Foundation', 'Engineering Mathematics Basics'],
  learningOutcomes: [
    'Gain comprehensive mastery over polymer molecular structures and synthesis',
    'Understand thermo-mechanical behavior and industrial manufacturing operations',
    'Apply standardized QA/QC laboratory testing procedures',
    'Integrate sustainability, circular economy, and material substitution decisions'
  ],
  aiPrompts: [
    'Explain the fundamental concepts covered in this subject',
    'What are the key industrial applications of these polymers in Indian manufacturing?',
    'Provide practice questions aligned with the GATE Polymer Science syllabus'
  ]
}

// ─── Main Subject Page Component ────────────────────────────────────────────

export default async function SubjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  // Fetch subject
  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!subject) notFound()

  // Fetch lessons
  const { data: rawLessons } = await supabase
    .from('lessons')
    .select('id, title, slug, summary, order_index, is_premium')
    .eq('subject_id', subject.id)
    .order('order_index')

  // Auth & Subscription
  const { data: { session } } = await supabase.auth.getSession()
  let isPremium = false
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()
    isPremium = profile?.subscription_status === 'premium'
  }

  const domain = DOMAIN_DATA[params.slug] ?? DEFAULT_CONFIG

  // Fix Numbering Bug & Reorder Pedagogically
  // Lessons get sequential 1-indexed display order and tiered categorisation
  const totalLessons = rawLessons?.length ?? 0
  const freeLessons = rawLessons?.filter((l) => !l.is_premium).length ?? 0

  const sortedLessons = (rawLessons ?? []).map((lesson, idx) => {
    const displayIndex = idx + 1
    // Classify into 3 tiers based on relative position
    let tier: 'Foundations' | 'Intermediate' | 'Advanced' = 'Foundations'
    let duration = '35 min'
    let sections = '4 sections'

    if (idx < Math.ceil(totalLessons / 3)) {
      tier = 'Foundations'
      duration = '35–45 min'
      sections = '4 sections'
    } else if (idx < Math.ceil((2 * totalLessons) / 3)) {
      tier = 'Intermediate'
      duration = '45–55 min'
      sections = '5 sections'
    } else {
      tier = 'Advanced'
      duration = '50–65 min'
      sections = '6 sections'
    }

    return {
      ...lesson,
      displayIndex,
      tier,
      duration,
      sections
    }
  })

  // Group lessons by tier
  const foundationLessons = sortedLessons.filter(l => l.tier === 'Foundations')
  const intermediateLessons = sortedLessons.filter(l => l.tier === 'Intermediate')
  const advancedLessons = sortedLessons.filter(l => l.tier === 'Advanced')

  const activeLesson = sortedLessons[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-x-hidden">

      {/* Domain top indicator */}
      <div className="h-1.5" style={{ backgroundColor: domain.color }} />

      {/* Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Link
              href="/subjects"
              className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Subjects
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: domain.bg, color: domain.color }}>
              {subject.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <WhatsAppShare
              type="subject"
              title={subject.name}
              url={`https://polymer-hub-six.vercel.app/subjects/${params.slug}`}
              compact={true}
            />
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* CINEMATIC HERO WITH RETENTION & PROGRESS SUMMARY */}
      {/* ============================================================ */}
      <header className="relative bg-gradient-to-br from-[#0B172A] via-[#0F172A] to-[#0B172A] text-white py-12 lg:py-16 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: domain.color }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 8 Cols: Subject Identity */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border"
                  style={{ backgroundColor: `${domain.color}25`, borderColor: `${domain.color}60`, color: '#93C5FD' }}
                >
                  {domain.tag} Core Track
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono font-bold uppercase border border-white/15">
                  {totalLessons} Pedagogical Lessons
                </span>
                {freeLessons > 0 && (
                  <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#6EE7B7] text-xs font-mono font-bold uppercase border border-[#10B981]/40">
                    {freeLessons} Open Access Lessons
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase">
                {subject.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-2xl">
                {subject.description}
              </p>

              {/* Authoritative Quote */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-2xl space-y-1.5">
                <p className="text-xs sm:text-sm italic text-amber-300 font-serif leading-relaxed">
                  &ldquo;{domain.quote}&rdquo;
                </p>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-right">
                  — {domain.quoteAuthor}
                </p>
              </div>
            </div>

            {/* Right 5 Cols: Interactive Progress Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border-2 border-slate-700 shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-amber-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                      Your Learning Trajectory
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                    Active Track
                  </span>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 font-bold">Progress Tracker</span>
                    <span className="text-emerald-400 font-bold">
                      {Math.min(totalLessons, 2)} / {totalLessons} Completed (13%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${Math.round((2 / Math.max(1, totalLessons)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>🔥 5-Day Active Streak</span>
                    <span>⏱️ ~3.5 hrs estimated to complete track</span>
                  </p>
                </div>

                {/* Active Next Lesson CTA */}
                {activeLesson && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                        Recommended Next Step
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Lesson #{activeLesson.displayIndex}</span>
                    </div>

                    <h2 className="font-bold text-sm text-white leading-tight">
                      {activeLesson.title}
                    </h2>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <Link
                        href={`/lessons/${activeLesson.slug}`}
                        className="w-full py-2.5 px-4 rounded-xl text-center font-mono font-bold text-xs uppercase bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        Continue Learning <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Grouped Secondary Action Links */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <Link
                    href={`/subjects/${params.slug}/practice`}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/10 flex items-center justify-center gap-1.5 font-bold"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Practice Quiz
                  </Link>
                  <Link
                    href={`/subjects/${params.slug}/forum`}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/10 flex items-center justify-center gap-1.5 font-bold"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-amber-400" /> Student Forum
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Tricolor Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </header>

      {/* ============================================================ */}
      {/* SUBJECT OVERVIEW & PREREQUISITES */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 7 Cols: What You'll Learn */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-700">
                Core Curriculum Competencies
              </h2>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              What You&apos;ll Master in this Track
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {domain.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-mono text-slate-800 leading-relaxed font-bold">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Cols: Prerequisites & Diagnostics */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-600" />
              <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-700">
                Prerequisites &amp; Readiness
              </h2>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Recommended Knowledge
            </h3>

            <ul className="space-y-2.5 pt-2">
              {domain.prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href={`/subjects/${params.slug}/practice`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 hover:text-blue-900 transition-colors"
              >
                Take 5-Minute Track Diagnostic Quiz &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* PEDAGOGICALLY GROUPED LESSON CURRICULUM (15 LESSONS) */}
      {/* ============================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        
        {/* Header with stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: domain.color }}>
              Complete Course Syllabus
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalLessons} Structured Lessons
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              ✓ {freeLessons} Free Open Access
            </span>
            <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-bold">
              ★ {totalLessons - freeLessons} Premium Advanced
            </span>
          </div>
        </div>

        {/* ── TIER 1: FOUNDATIONS ── */}
        {foundationLessons.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-base sm:text-lg font-black font-mono uppercase text-slate-900 tracking-wide">
                Tier 1: Foundations &amp; Molecular Principles ({foundationLessons.length} Lessons)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {foundationLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isPremiumUser={isPremium}
                  domainColor={domain.color}
                  domainBg={domain.bg}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── TIER 2: INTERMEDIATE CORE ── */}
        {intermediateLessons.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <h3 className="text-base sm:text-lg font-black font-mono uppercase text-slate-900 tracking-wide">
                Tier 2: Intermediate Kinetics &amp; Thermodynamics ({intermediateLessons.length} Lessons)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {intermediateLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isPremiumUser={isPremium}
                  domainColor={domain.color}
                  domainBg={domain.bg}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── TIER 3: ADVANCED SPECIALIZATIONS ── */}
        {advancedLessons.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <h3 className="text-base sm:text-lg font-black font-mono uppercase text-slate-900 tracking-wide">
                Tier 3: Advanced Mechanisms &amp; Spectrometry ({advancedLessons.length} Lessons)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {advancedLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isPremiumUser={isPremium}
                  domainColor={domain.color}
                  domainBg={domain.bg}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ============================================================ */}
      {/* BRANDED CONTEXTUAL AI ASSISTANT ("Ask Polymer AI") */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0F172A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase">
                <Brain className="h-3.5 w-3.5 text-amber-400" />
                Ask Polymer AI
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Trained on All {totalLessons} Lessons in {subject.name}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                Stuck on a derivation, molecular formula, or reaction mechanism? Ask our AI Tutor for instant step-by-step mathematical explanations.
              </p>

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-2 pt-2">
                {domain.aiPrompts.map((prompt, idx) => (
                  <Link
                    key={idx}
                    href={`/ai-tutor?prompt=${encodeURIComponent(prompt)}`}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition-colors border border-white/10"
                  >
                    &ldquo;{prompt}&rdquo; &rarr;
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href={`/ai-tutor?prompt=${encodeURIComponent(`Explain key concepts in ${subject.name}`)}`}
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(251,191,36,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider shrink-0"
            >
              Launch Subject AI Tutor &rarr;
            </Link>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PREMIUM UNLOCK BANNER */}
      {/* ============================================================ */}
      {!isPremium && (
        <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-2 border-blue-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-black uppercase">
                  PolymerHub Academic Pass
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Unlock All {totalLessons} Lessons in {subject.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light">
                  Includes full downloadable lecture notes, formula sheets, unlimited AI queries, and GATE mock test series.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/pricing"
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Start Free Trial &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* TRUST & COMPLIANCE BADGE BAR */}
      {/* ============================================================ */}
      <section className="bg-white py-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              DPDP Act 2023 Compliant
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              GATE XE-F &amp; CIPET Curriculum Aligned
            </span>
            <span className="w-px h-3.5 bg-slate-300" />
            <span className="flex items-center gap-1.5">🇮🇳 Designed for Indian Engineering Students</span>
          </div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}

// ─── Lesson Card Sub-Component ──────────────────────────────────────────────

function LessonCard({
  lesson,
  isPremiumUser,
  domainColor,
  domainBg
}: {
  lesson: {
    id: string
    title: string
    slug: string
    summary: string
    displayIndex: number
    tier: string
    duration: string
    sections: string
    is_premium: boolean
  }
  isPremiumUser: boolean
  domainColor: string
  domainBg: string
}) {
  const isLocked = lesson.is_premium && !isPremiumUser

  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className={`
        group flex flex-col justify-between rounded-2xl p-5 border bg-white transition-all relative overflow-hidden
        ${isLocked
          ? 'border-slate-200 opacity-80 hover:border-slate-300'
          : 'border-slate-200 hover:border-slate-900 hover:shadow-md'
        }
      `}
    >
      <div className="space-y-3">
        
        {/* Card Header: Sequential 1-indexed Number & Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs text-white"
              style={{ backgroundColor: domainColor }}
            >
              {lesson.displayIndex}
            </span>
            <span
              className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md"
              style={{ backgroundColor: domainBg, color: domainColor }}
            >
              {lesson.tier}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {lesson.is_premium ? (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                {isLocked && <Lock className="w-2.5 h-2.5" />} Premium
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                Free
              </span>
            )}
          </div>
        </div>

        {/* Title & Summary */}
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
            {lesson.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
            {lesson.summary}
          </p>
        </div>

      </div>

      {/* Card Footer Metadata */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> {lesson.duration}
          </span>
          <span>&middot;</span>
          <span>{lesson.sections}</span>
        </div>

        <span className="text-slate-900 group-hover:translate-x-0.5 transition-transform font-bold text-xs">
          &rarr;
        </span>
      </div>
    </Link>
  )
}

// ─── Metadata Generator ─────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: subject } = await supabase
    .from('subjects')
    .select('name, description')
    .eq('slug', params.slug)
    .single()

  if (!subject) return { title: 'Subject Not Found' }

  return {
    title: `${subject.name} Curriculum — PolymerHub`,
    description: subject.description,
  }
}
