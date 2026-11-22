import Link from 'next/link'
import { 
  BookOpen, 
  Atom, 
  Scale, 
  Calculator, 
  Wrench, 
  FlaskConical, 
  Brain, 
  TrendingUp, 
  ArrowRight, 
  Layers
} from 'lucide-react'

export default function FeatureShowcase() {
  const features = [
    {
      title: 'Structured Curriculum',
      summary: 'Organised lessons and subject-wise learning.',
      stat: '19 Subjects &middot; 216 Lessons',
      desc: 'Complete progression from step-growth kinetics and rheology to injection moulding, composites, and circular packaging.',
      icon: BookOpen,
      color: '#3B82F6',
      bg: '#1E3A8A',
      href: '/subjects',
    },
    {
      title: '3D Molecular & Product Lab',
      summary: 'Visualise molecular and material concepts.',
      stat: '100+ Interactive 3D Models',
      desc: 'Inspect atomic repeat units with CPK rendering, commercial finished plastic components, and heavy processing machinery in 3D.',
      icon: Atom,
      color: '#A855F7',
      bg: '#581C87',
      href: '/materials',
    },
    {
      title: 'Formula Library',
      summary: 'Technical formulas and quick references.',
      stat: '98 Canonical Equations',
      desc: 'Mathematical formulas formatted in LaTeX KaTeX, with dimensional checks, variable bounds, and worked engineering examples.',
      icon: Scale,
      color: '#10B981',
      bg: '#064E3B',
      href: '/formulas',
    },
    {
      title: 'Engineering Calculators',
      summary: 'Practical calculations for engineering work.',
      stat: '8 Industrial Solvers',
      desc: 'Calculate press clamping force, mould cooling cycle times, cavity shrinkage sizing, and extruder shear rates in seconds.',
      icon: Calculator,
      color: '#F59E0B',
      bg: '#78350F',
      href: '/calculators',
    },
    {
      title: 'Defect Troubleshooter',
      summary: 'Understand defects, causes and solutions.',
      stat: 'Rosato Handbook Diagnostics',
      desc: 'Shop-floor diagnostic rules for sink marks, splay, short shots, flash, and warpage with exact machine parameter adjustments.',
      icon: Wrench,
      color: '#EF4444',
      bg: '#7F1D1D',
      href: '/troubleshooter',
    },
    {
      title: 'Virtual Lab Simulations',
      summary: 'Learn through interactive technical concepts.',
      stat: '21 ASTM & ISO Simulators',
      desc: 'Perform virtual tensile stress-strain pull tests, Izod/Charpy impact fracturing, and Melt Flow Index (MFI) barrel extrusions.',
      icon: FlaskConical,
      color: '#06B6D4',
      bg: '#164E63',
      href: '/simulations',
    },
    {
      title: 'AI Polymer Copilot',
      summary: 'AI-assisted study and technical learning support.',
      stat: 'RAG Grounded in Curriculum',
      desc: 'Ask complex technical queries and get accurate answers grounded strictly in PolymerHub lessons with cited sources and formulas.',
      icon: Brain,
      color: '#22C55E',
      bg: '#14532D',
      href: '/ai-tutor',
    },
    {
      title: 'Daily Industry Intelligence',
      summary: 'Industry updates, news and market information.',
      stat: 'Domestic Spot Benchmarks',
      desc: 'Track daily domestic ex-plant resin spot prices (PP, PE, PVC, PET, PC, ABS) and verified Indian petrochemical R&D news.',
      icon: TrendingUp,
      color: '#6366F1',
      bg: '#312E81',
      href: '/today',
    },
  ]

  return (
    <section id="ecosystem" className="py-20 sm:py-24 bg-[#0B101D] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            The PolymerHub ecosystem.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Eight integrated technical capabilities connecting university classroom theory directly to factory-floor reality.
          </p>
        </div>

        {/* 8 Feature Cards Grid with Generous Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs"
                      style={{ backgroundColor: `${feat.color}15`, borderColor: `${feat.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feat.color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {feat.stat}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>

                  <div className="text-xs font-sans font-medium text-blue-400 mt-1 mb-2.5">
                    {feat.summary}
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-400 group-hover:text-blue-300 transition-colors"
                  >
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
