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
      color: '#2563EB',
      bg: '#EFF6FF',
      href: '/subjects',
    },
    {
      title: '3D Molecular & Product Lab',
      summary: 'Visualise molecular and material concepts.',
      stat: '100+ Interactive 3D Models',
      desc: 'Inspect atomic repeat units with CPK rendering, commercial finished plastic components, and heavy processing machinery in 3D.',
      icon: Atom,
      color: '#7C3AED',
      bg: '#F5F3FF',
      href: '/materials',
    },
    {
      title: 'Formula Library',
      summary: 'Technical formulas and quick references.',
      stat: '98 Canonical Equations',
      desc: 'Mathematical formulas formatted in LaTeX KaTeX, with dimensional checks, variable bounds, and worked engineering examples.',
      icon: Scale,
      color: '#059669',
      bg: '#ECFDF5',
      href: '/formulas',
    },
    {
      title: 'Engineering Calculators',
      summary: 'Practical calculations for engineering work.',
      stat: '8 Industrial Solvers',
      desc: 'Calculate press clamping force, mould cooling cycle times, cavity shrinkage sizing, and extruder shear rates in seconds.',
      icon: Calculator,
      color: '#D97706',
      bg: '#FFFBEB',
      href: '/calculators',
    },
    {
      title: 'Defect Troubleshooter',
      summary: 'Understand defects, causes and solutions.',
      stat: 'Rosato Handbook Diagnostics',
      desc: 'Shop-floor diagnostic rules for sink marks, splay, short shots, flash, and warpage with exact machine parameter adjustments.',
      icon: Wrench,
      color: '#DC2626',
      bg: '#FEF2F2',
      href: '/troubleshooter',
    },
    {
      title: 'Virtual Lab Simulations',
      summary: 'Learn through interactive technical concepts.',
      stat: '21 ASTM & ISO Simulators',
      desc: 'Perform virtual tensile stress-strain pull tests, Izod/Charpy impact fracturing, and Melt Flow Index (MFI) barrel extrusions.',
      icon: FlaskConical,
      color: '#0891B2',
      bg: '#ECFEFF',
      href: '/simulations',
    },
    {
      title: 'AI Polymer Copilot',
      summary: 'AI-assisted study and technical learning support.',
      stat: 'RAG Grounded in Curriculum',
      desc: 'Ask complex technical queries and get accurate answers grounded strictly in PolymerHub lessons with cited sources and formulas.',
      icon: Brain,
      color: '#15803D',
      bg: '#F0FDF4',
      href: '/ai-tutor',
    },
    {
      title: 'Daily Industry Intelligence',
      summary: 'Industry updates, news and market information.',
      stat: 'Domestic Spot Benchmarks',
      desc: 'Track daily domestic ex-plant resin spot prices (PP, PE, PVC, PET, PC, ABS) and verified Indian petrochemical R&D news.',
      icon: TrendingUp,
      color: '#4F46E5',
      bg: '#EEF2FF',
      href: '/today',
    },
  ]

  return (
    <section id="ecosystem" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            The PolymerHub ecosystem.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
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
                className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col justify-between hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs"
                      style={{ backgroundColor: feat.bg, borderColor: `${feat.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feat.color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {feat.stat}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>

                  <div className="text-xs font-sans font-medium text-blue-700 mt-1 mb-2.5">
                    {feat.summary}
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 group-hover:text-blue-700 transition-colors"
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
