'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  X, 
  Globe, 
  Brain, 
  Package, 
  HeartPulse, 
  Rocket, 
  Car, 
  Cpu, 
  Shirt, 
  Building2,
  Sparkles,
  CheckCircle2,
  Factory
} from 'lucide-react'

const INDUSTRIES = [
  {
    id: 'packaging', 
    name: 'Packaging & Barrier Tech', 
    color: '#15803D', 
    bg: '#F0FDF4',
    icon: Package,
    tagline: 'The reason food, medicine, and products reach 1.4 billion people safely',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80',
    facts: [
      'PET and EVOH barrier films extend food shelf life by weeks without artificial preservatives or refrigeration.',
      'A single 50g PP woven sack reliably transports 50kg of grain across thousands of kilometres without tearing.',
      'Multi-layer barrier pouches use micro-thin polymer films (thinner than human hair) to block 99.9% of oxygen and moisture.',
    ],
    example: 'Manjushree Technopack and Uflex produce billions of multi-layer barrier containers and flexible pouches annually, keeping FMCG goods fresh from factory to remote villages across India.',
    subject: { name: 'Plastic Packaging Engineering', slug: 'plastic-packaging-engineering', lessons: 16 },
  },
  {
    id: 'medicine', 
    name: 'Medical & Healthcare Devices', 
    color: '#7C3AED', 
    bg: '#F5F3FF',
    icon: HeartPulse,
    tagline: 'Biocompatible polymers making modern sterile healthcare and implants possible',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
    facts: [
      'Single-use auto-disable syringes drastically reduced hospital-acquired bloodborne infections worldwide.',
      'Medical-grade silicone and PEEK implants remain in human bodies for decades with zero tissue rejection.',
      'IV fluid bags, dialyzers, blood storage bags, and surgical PPE require strict ISO 10993 polymer biocompatibility.',
    ],
    example: 'HMD (Hindustan Syringes) manufactures over 2.5 billion auto-disable syringes annually in Faridabad — running the largest single-location syringe manufacturing facility on the planet.',
    subject: { name: 'Medical Plastics & Biomaterials', slug: 'medical-plastics', lessons: 12 },
  },
  {
    id: 'aerospace', 
    name: 'Aerospace, Defense & Rockets', 
    color: '#EA580C', 
    bg: '#FFF7ED',
    icon: Rocket,
    tagline: 'Ultra-light carbon composites taking satellites and defense systems to orbit',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80',
    facts: [
      'Carbon-fibre reinforced polymers (CFRP) are 5x stronger than steel at one-fifth the weight.',
      'Every single kilogram saved in a launch vehicle structural mass directly increases payload orbit capacity.',
      'ISRO PSLV and GSLV rocket motor casings and satellite payload fairings rely extensively on advanced CFRP composites.',
    ],
    example: 'Tata Advanced Materials and Godrej Aerospace engineer precision CFRP composite structures for ISRO launch vehicles and IAF aerospace defense platforms.',
    subject: { name: 'Polymer Composites', slug: 'polymer-composites', lessons: 12 },
  },
  {
    id: 'automotive', 
    name: 'Automotive & Electric Mobility', 
    color: '#2563EB', 
    bg: '#EFF6FF',
    icon: Car,
    tagline: 'Lightweighting, crash-absorbing bumpers, and flame-retardant EV battery enclosures',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    facts: [
      'Modern passenger vehicles are 12–15% polymer by weight, cutting vehicle mass by over 200 kg to slash emissions.',
      'PP/EPDM blend bumper fascias absorb low-speed collisions elastically without permanent sheet metal deformation.',
      'EV battery tray modules use UL94 V-0 flame-retardant engineering thermoplastics for electrical isolation and thermal runaway containment.',
    ],
    example: 'Motherson Sumi and Supreme Industries supply injection-moulded exterior and interior modules to Maruti Suzuki, Tata Motors, and Hyundai across India.',
    subject: { name: 'Mould Design', slug: 'mould-design', lessons: 10 },
  },
  {
    id: 'electronics', 
    name: 'Electronics & Semiconductor Tech', 
    color: '#7C3AED', 
    bg: '#F5F3FF',
    icon: Cpu,
    tagline: 'The dielectric insulators, encapsulation resins, and flexible films powering digital life',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    facts: [
      'Every smartphone motherboard, silicon chip package, and charger relies on dielectric epoxy and polyimide insulation.',
      'Ultra-thin flexible polyimide substrate films enable foldable displays and micro-flex PCB circuits.',
      'Flame-retardant polycarbonate/ABS blends provide shockproof, drop-resistant structural housings for consumer electronics.',
    ],
    example: 'Bakelite (phenolic resin), invented in 1907, remains the global gold-standard heat-resistant insulator for heavy-duty electrical switchgear and railway electrification across India.',
    subject: { name: 'Polymer Chemistry', slug: 'polymer-chemistry', lessons: 12 },
  },
  {
    id: 'textiles', 
    name: 'Technical Textiles & Apparel', 
    color: '#CA8A04', 
    bg: '#FEFCE8',
    icon: Shirt,
    tagline: 'High-performance synthetic fibers, moisture-wicking yarns, and geotextiles',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    facts: [
      'Over 60% of all clothing produced globally is spun from engineered synthetic polymers (Polyester, Nylon, Spandex).',
      'Micro-filament polyester yarns engineered with non-circular cross-sections provide capillary moisture management in activewear.',
      'PP non-woven geotextiles reinforce roadbeds, prevent soil erosion, and line national highway construction projects.',
    ],
    example: 'Rubfila International in Kerala operates one of the world\'s largest continuous latex rubber thread lines, supplying elastic cores to garment manufacturers across 30+ countries.',
    subject: { name: 'Rubber Technology', slug: 'rubber-technology', lessons: 12 },
  },
  {
    id: 'construction', 
    name: 'Infrastructure & Construction', 
    color: '#15803D', 
    bg: '#F0FDF4',
    icon: Building2,
    tagline: 'Corrosion-proof water piping, weather-resistant window profiles, and waterproofing seals',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200&q=80',
    facts: [
      'High-Density Polyethylene (HDPE) and CPVC pipes transport drinking water for 50+ years without internal corrosion or scale buildup.',
      'Rigid uPVC window and door profiles outlast traditional wood without rotting, termite damage, or repainting.',
      'Crosslinked elastomeric membranes (EPDM) provide multi-decade UV resistance and waterproofing for high-rise roofs and tunnels.',
    ],
    example: 'Astral Pipes, Finolex, and Supreme Industries supply millions of meters of engineered piping for the Government of India\'s Jal Jeevan Mission, bringing tap water to rural households.',
    subject: { name: 'Polymer Testing', slug: 'polymer-testing', lessons: 10 },
  },
]

const STATS = [
  { value: '20M+', unit: 'Tonnes/yr', label: 'Polymers Processed in India', sub: 'Growing at 8.2% CAGR', color: '#2563EB', bg: '#EFF6FF' },
  { value: '7', unit: 'Core Pillars', label: 'Global Infrastructure Sectors', sub: 'Zero modern industries survive without it', color: '#EA580C', bg: '#FFF7ED' },
  { value: '160+', unit: 'Years', label: 'Synthetic Polymer Evolution', sub: 'From Parkesine (1862) to Smart Polymers', color: '#15803D', bg: '#F0FDF4' },
  { value: '₹20T+', unit: 'Market Value', label: 'Indian Plastics Economy by 2030', sub: '30,000+ processing units nationwide', color: '#7C3AED', bg: '#F5F3FF' },
]

function IndustryCard({ 
  industry, 
  onClick, 
  isFeatured = false 
}: { 
  industry: typeof INDUSTRIES[0]; 
  onClick: () => void; 
  isFeatured?: boolean 
}) {
  const Icon = industry.icon

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer border-2 border-slate-900 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
        isFeatured ? 'lg:col-span-3 md:flex-row' : ''
      }`}
    >
      {/* Visual Image Header — Full Visibility with Clean Bottom Vignette */}
      <div className={`relative overflow-hidden ${isFeatured ? 'md:w-1/2 min-h-[240px] md:min-h-[300px]' : 'h-52'}`}>
        <img
          src={industry.image}
          alt={industry.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Subtle gradient vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: industry.color }} />

        {/* Pillar Icon Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg border border-white/20"
            style={{ backgroundColor: industry.color }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 uppercase tracking-widest">
            Core Pillar
          </span>
        </div>

        {/* Name on image */}
        <div className="absolute bottom-3.5 left-4 right-4">
          <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
            {industry.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className={`p-5 flex flex-col justify-between flex-1 ${isFeatured ? 'md:w-1/2' : ''}`}>
        <div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
            {industry.tagline}
          </p>

          {/* Key Engineering Highlights Preview */}
          <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{industry.facts[0]}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: industry.color }}>
            Explore Engineering Breakdown <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            {industry.subject.lessons} Lessons
          </span>
        </div>
      </div>
    </div>
  )
}

function IndustryModal({ industry, onClose }: { industry: typeof INDUSTRIES[0]; onClose: () => void }) {
  const Icon = industry.icon

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-up">
      <div className="bg-white w-full max-w-2xl rounded-2xl border-2 border-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 text-white relative overflow-hidden flex-shrink-0" style={{ backgroundColor: industry.color }}>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/80">Industrial Deep Dive</span>
                <h2 className="font-display text-2xl sm:text-3xl font-black">{industry.name}</h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="bg-black/30 hover:bg-black/50 text-white rounded-lg p-2 transition-colors border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/90 text-xs sm:text-sm mt-3 max-w-xl font-light">
            {industry.tagline}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Engineering Facts */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              How Polymer Science Enables This Sector
            </h4>
            <div className="space-y-3">
              {industry.facts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Industry Case Study */}
          <div className="p-4 rounded-xl border-2 border-slate-200" style={{ backgroundColor: industry.bg }}>
            <div className="font-mono text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: industry.color }}>
              <Factory className="w-4 h-4" /> 🇮🇳 Indian Industrial Benchmark
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {industry.example}
            </p>
          </div>

          {/* Course Gateway CTA */}
          <Link
            href={`/subjects/${industry.subject.slug}`}
            onClick={onClose}
            className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-slate-900 text-white hover:bg-blue-600 hover:border-blue-600 transition-all group shadow-md"
          >
            <div>
              <div className="font-mono text-[10px] text-slate-400 group-hover:text-blue-100 uppercase tracking-widest mb-0.5">
                Master the Science & Curated Lessons
              </div>
              <div className="font-display text-base sm:text-lg font-black">
                {industry.subject.name} &middot; {industry.subject.lessons} Modules
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

      </div>
    </div>
  )
}

export default function WorldPage() {
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900">
      
      {/* ─── Hero Section: Deep Midnight & Indian Tricolor ─── */}
      <section className="relative bg-[#0A1628] text-white py-16 md:py-24 px-4 sm:px-6 overflow-hidden border-b-2 border-slate-900">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0A1628] to-[#0A1628] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Globe className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '20s' }} />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              The World of Plastic &middot; 7 Core Pillars
            </span>
          </div>

          {/* Headline with Tricolor Gradient */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight uppercase mb-6">
            Without <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Polymer Engineering,
            </span>
            <br />
            Modern Life Stops.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-8">
            Packaging. Healthcare. Rockets. Automotive. Electronics. Textiles. Construction. 
            Tap any industry below to explore the exact chemistry and machines keeping modern civilization alive.
          </p>

          {/* Quick Jump Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="#industries"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase font-mono tracking-wider px-6 py-3 rounded-xl border border-blue-400 transition-all shadow-lg hover:shadow-blue-500/25"
            >
              Explore 7 Industries <ArrowRight className="w-4 h-4" />
            </a>
            <Link 
              href="/materials"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono tracking-wider px-6 py-3 rounded-xl border border-white/20 transition-all"
            >
              Materials Database
            </Link>
          </div>

        </div>

      </section>

      {/* ─── Integrated Stats Grid ─── */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div 
              key={s.label} 
              className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl sm:text-4xl font-black" style={{ color: s.color }}>
                    {s.value}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{s.unit}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">{s.label}</h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7 Core Industries Grid ─── */}
      <section id="industries" className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Section Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">Interactive Engineering Atlas</span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              7 Pillars Powered by Polymers
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-200/70 px-3 py-1 rounded-full w-fit">
            Click any card to inspect science & case studies
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((ind, idx) => (
            <IndustryCard 
              key={ind.id} 
              industry={ind} 
              onClick={() => setSelected(ind)}
              isFeatured={idx === 6} 
            />
          ))}
        </div>

      </section>

      {/* ─── Reality Check Philosophy Banner ─── */}
      <section className="bg-[#0A1628] text-white py-16 px-4 border-y-2 border-slate-900">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="font-display text-3xl sm:text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 leading-tight">
            &ldquo;This isn&apos;t a niche field.&rdquo;
          </p>
          <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
            It is the molecular infrastructure layer of modern civilization.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link 
              href="/history"
              className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider px-6 py-3.5 rounded-xl border-2 border-slate-900 transition-all shadow-[3px_3px_0px_0px_#000]"
            >
              See How We Got Here (History) <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/subjects"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase font-mono tracking-wider px-6 py-3.5 rounded-xl border border-white/20 transition-all"
            >
              Start 19 Subjects Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AI Tutor & Career Assistance Banner ─── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-3xl p-8 md:p-10 border-2 border-slate-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-orange-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> AI Polymer Specialist
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black">
              Wondering how your target industry actually works?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
              Ask our RAG-grounded AI Tutor about resin formulations, cycle times, or factory setups for any of the 7 industries.
            </p>
          </div>
          <Link
            href="/ai-tutor"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-orange-700 font-black text-xs uppercase font-mono tracking-wider px-6 py-3.5 rounded-xl border-2 border-slate-900 transition-all shadow-[4px_4px_0px_0px_#000] flex-shrink-0"
          >
            <Brain className="w-4 h-4 text-orange-600" /> Ask AI Tutor &rarr;
          </Link>
        </div>
      </section>

      {/* ─── Interactive Deep Dive Modal ─── */}
      {selected && <IndustryModal industry={selected} onClose={() => setSelected(null)} />}

    </div>
  )
}
