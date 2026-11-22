import { BookOpen, GraduationCap, Calculator, Trophy } from 'lucide-react'

export default function ProofStrip() {
  const stats = [
    {
      value: '216',
      label: 'Lessons',
      detail: 'Structured syllabus from synthesis to rheology',
      icon: BookOpen,
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      value: '19',
      label: 'Subjects',
      detail: 'Covering chemistry, testing, processing & mould design',
      icon: GraduationCap,
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      value: '8',
      label: 'Calculators',
      detail: 'Standards-based clamping, cooling & shrinkage solvers',
      icon: Calculator,
      color: '#D97706',
      bg: '#FFFBEB',
    },
    {
      value: 'GATE XE-F',
      label: 'Preparation',
      detail: 'Polymer science paper syllabus & mock assessments',
      icon: Trophy,
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
  ]

  return (
    <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-600 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: `${stat.color}30`, border: `1px solid ${stat.color}60` }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Verified
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-200 mt-1 font-sans">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                    {stat.detail}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center text-xs font-mono text-slate-400">
          <span>Curriculum aligned with AICTE Model Guidelines &amp; CIPET Academic Syllabi &middot; Open to all learners</span>
        </div>

      </div>
    </section>
  )
}
