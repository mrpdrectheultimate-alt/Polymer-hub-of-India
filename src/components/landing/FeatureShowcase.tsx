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
  Sparkles,
  Layers,
  FileText
} from 'lucide-react'

export default function FeatureShowcase() {
  const features = [
    {
      title: 'Structured Curriculum',
      stat: '19 Subjects · 216 Lessons',
      desc: 'Complete progression from Step-Growth Kinetics and Rheology to Injection Moulding, Composites, and Circular Packaging.',
      icon: BookOpen,
      color: '#2563EB',
      bg: '#EFF6FF',
      href: '/subjects',
      badge: 'Curriculum Core',
    },
    {
      title: '3D Molecular & Product Lab',
      stat: '100+ Interactive Models',
      desc: 'Inspect real 3D atomic repeat units with CPK element rendering, alongside finished commercial parts and heavy processing machines.',
      icon: Atom,
      color: '#7C3AED',
      bg: '#F5F3FF',
      href: '/materials',
      badge: '3D Interactive',
    },
    {
      title: 'Master Formula Library',
      stat: '98 Canonical Equations',
      desc: 'Formulas with LaTeX KaTeX formatting, dimensional analysis, variable bounds, and worked step-by-step engineering examples.',
      icon: Scale,
      color: '#059669',
      bg: '#ECFDF5',
      href: '/formulas',
      badge: 'GATE & Industry',
    },
    {
      title: '8 Industrial Calculators',
      stat: 'ASTM / ISO Solvers',
      desc: 'Calculate press clamping force, mold cooling cycle times, cavity shrinkage sizing, and extruder screw shear rates in seconds.',
      icon: Calculator,
      color: '#D97706',
      bg: '#FFFBEB',
      href: '/calculators',
      badge: 'Plant Solvers',
    },
    {
      title: 'Defect Troubleshooter',
      stat: 'Rosato Handbook Standard',
      desc: 'Diagnose sink marks, short shots, warpage, and flash with machine parameter adjustments, test protocols, and root causes.',
      icon: Wrench,
      color: '#EA580C',
      bg: '#FFF7ED',
      href: '/troubleshooter',
      badge: 'Diagnostics',
    },
    {
      title: '21 Virtual Lab Simulators',
      stat: 'ASTM / ISO Test Benches',
      desc: 'Simulate Tensile tests (ASTM D638), Melt Flow Index (D1238), DSC thermal transitions, and Izod impact resistance in the browser.',
      icon: FlaskConical,
      color: '#0284C7',
      bg: '#F0F9FF',
      href: '/simulations',
      badge: 'Virtual Lab',
    },
    {
      title: 'RAG AI Polymer Copilot',
      stat: 'Grounded in Curriculum',
      desc: 'Ask complex technical queries and get accurate answers grounded strictly in PolymerHub lessons with cited sources and formulas.',
      icon: Brain,
      color: '#15803D',
      bg: '#F0FDF4',
      href: '/ai-tutor',
      badge: 'AI Copilot',
    },
    {
      title: 'Daily Industry Intelligence',
      stat: 'Live Spot Benchmarks',
      desc: 'Track daily domestic ex-plant resin spot prices (PP, PE, PVC, PET, PC, ABS) and verified Indian petrochemical R&D news.',
      icon: TrendingUp,
      color: '#4F46E5',
      bg: '#EEF2FF',
      href: '/today',
      badge: 'Daily Intelligence',
    },
  ]

  return (
    <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            A complete polymer engineering ecosystem.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-sans">
            Every feature connects directly to the underlying knowledge base &mdash; built for rigorous academic mastery and real factory utility.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col justify-between hover:border-blue-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs"
                      style={{ backgroundColor: feat.bg, borderColor: `${feat.color}40` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: feat.color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>

                  <div className="text-xs font-mono font-bold text-slate-500 mt-0.5 mb-2">
                    {feat.stat}
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span>Launch Module</span>
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
