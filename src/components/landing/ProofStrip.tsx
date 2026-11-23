import Link from 'next/link'
import { BookOpen, GraduationCap, Calculator, Trophy, ArrowRight } from 'lucide-react'

export default function ProofStrip() {
  const stats = [
    {
      value: '216',
      label: 'Lessons',
      supporting: 'Structured Learning Content',
      detail: 'Comprehensive curriculum from step-growth kinetics to injection mould design & rheology.',
      icon: BookOpen,
      color: '#2563EB',
      href: '/subjects',
    },
    {
      value: '19',
      label: 'Subjects',
      supporting: 'Breadth of Polymer Education',
      detail: 'Covers synthesis, characterization, testing standards, composites & recycling.',
      icon: GraduationCap,
      color: '#059669',
      href: '/subjects',
    },
    {
      value: '8',
      label: 'Calculators',
      supporting: 'Practical Engineering Tools',
      detail: 'Standard clamping force, cooling time, shrinkage & shear rate solvers.',
      icon: Calculator,
      color: '#D97706',
      href: '/calculators',
    },
    {
      value: 'GATE XE-F',
      label: 'Preparation',
      supporting: 'Dedicated Examination Focus',
      detail: 'Polymer science syllabus breakdown, derivations & timed CBT practice mocks.',
      icon: Trophy,
      color: '#7C3AED',
      href: '/gate-xe-f',
    },
  ]

  return (
    <section className="bg-white text-slate-900 py-14 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}35` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors font-bold flex items-center gap-1">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1.5 font-sans">
                    {stat.label}
                  </div>
                  <div className="text-xs font-mono text-blue-600 mt-0.5 font-semibold">
                    {stat.supporting}
                  </div>
                  <div className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                    {stat.detail}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center text-xs font-mono text-slate-500">
          <span>Structured university curriculum, industrial standards &amp; dedicated GATE XE-F workspace &middot; Open to all learners</span>
        </div>

      </div>
    </section>
  )
}
