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
      stat: '19 Subjects · 216 Lessons',
      desc: 'Complete progression from step-growth kinetics and rheology to injection moulding, composites, and circular packaging.',
      icon: BookOpen,
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      href: '/subjects',
    },
    {
      title: '3D Molecular & Product Lab',
      summary: 'Visualise molecular and material concepts.',
      stat: '100+ Interactive 3D Models',
      desc: 'Inspect atomic repeat units with CPK rendering, commercial finished plastic components, and heavy processing machinery in 3D.',
      icon: Atom,
      color: '#9333EA',
      bg: '#FAF5FF',
      border: '#E9D5FF',
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
      border: '#A7F3D0',
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
      border: '#FDE68A',
      href: '/calculators',
    },
    {
      title: 'Defect Troubleshooter',
      summary: 'Understand defects, causes and solutions.',
      stat: 'Rosato Handbook Diagnostics',
      desc: 'Diagnostic decision matrices covering 24 injection moulding defects with practical shop-floor parameter adjustments.',
      icon: Wrench,
      color: '#E11D48',
      bg: '#FFF1F2',
      border: '#FECDD3',
      href: '/troubleshooter',
    },
    {
      title: 'Virtual Testing Laboratory',
      summary: 'Simulate standard test procedures.',
      stat: '21 ASTM & ISO Standards',
      desc: 'Simulate tensile testing, flexural modulus, Izod impact, HDT, and Melt Flow Index (MFI) with ASTM/ISO protocols.',
      icon: FlaskConical,
      color: '#0D9488',
      bg: '#F0FDFA',
      border: '#99F6E4',
      href: '/simulations',
    },
    {
      title: 'GATE XE-F Mock Engine',
      summary: 'Official CBT examination practice.',
      stat: '60-Min Timed Simulator',
      desc: 'Simulated examination interface matching official GATE XE-F layout with MCQ, MSQ, NAT questions and marking schemes.',
      icon: Brain,
      color: '#4F46E5',
      bg: '#EEF2FF',
      border: '#C7D2FE',
      href: '/gate-mock',
    },
    {
      title: 'Live Industry Intelligence',
      summary: 'Indian spot benchmarks & daily dispatches.',
      stat: 'Reliance & IOCL Spot Tracking',
      desc: 'Daily plant-gate resin spot prices, CPCB circulars, and polymer processing industry news mapped to relevant academic subjects.',
      icon: TrendingUp,
      color: '#0284C7',
      bg: '#F0F9FF',
      border: '#BAE6FD',
      href: '/today',
    },
  ]

  return (
    <section id="ecosystem" className="py-20 sm:py-24 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-950 tracking-tight">
            A complete polymer engineering ecosystem.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Eight integrated modules built to support every stage of learning, research, exam preparation, and manufacturing engineering.
          </p>
        </div>

        {/* 8-Feature Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: feature.bg, border: `1px solid ${feature.border}` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: feature.color, borderColor: feature.border, backgroundColor: feature.bg }}
                    >
                      {feature.stat.split('·')[0]}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-950 mb-1.5 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  <div className="text-[11px] font-mono text-slate-500 font-semibold mb-3">
                    {feature.stat}
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
