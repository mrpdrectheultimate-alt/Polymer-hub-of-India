import { Layers, AlertCircle, ArrowRight, CheckCircle2, Split, Database, GraduationCap, Wrench } from 'lucide-react'
import Link from 'next/link'

export default function WhyPolymerHub() {
  const problems = [
    {
      step: 'Problem 01',
      title: 'Fragmented Learning Sources',
      desc: 'Students jump between random YouTube playlists, photocopied class notes, heavy foreign textbooks, and isolated research PDFs without a coherent progression.',
      icon: Split,
      badge: 'Information Chaos',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      step: 'Problem 02',
      title: 'Theory vs. Shop-Floor Disconnect',
      desc: 'Classrooms teach polymer chemical formulas, but lack real machine processing parameters, injection clamp calculations, and defect troubleshooting needed on the plant floor.',
      icon: Wrench,
      badge: 'Skill Gap',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      step: 'Problem 03',
      title: 'Unstructured Exam Preparation',
      desc: 'GATE XE-F (Polymer Science) aspirants lack dedicated numerical practice, formula derivations, and mock test interfaces specifically tailored to Paper F.',
      icon: GraduationCap,
      badge: 'Missing Practice',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ]

  return (
    <section id="why-polymerhub" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Why PolymerHub Exists
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            One field. Too many disconnected resources.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Polymer science and plastics manufacturing should not be scattered across ten tabs. We built PolymerHub to connect the entire learning and engineering journey in one specialized environment.
          </p>
        </div>

        {/* 3 Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {problems.map((prob) => {
            const Icon = prob.icon
            return (
              <div
                key={prob.title}
                className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {prob.step}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${prob.badgeColor}`}>
                      {prob.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                    {prob.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    {prob.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* The PolymerHub Solution Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border-2 border-slate-900 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> The Unified Answer
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                PolymerHub connects the dots.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                From fundamental step-growth kinetics and 3D molecular structures to injection moulding clamp formulas and GATE XE-F mock exams — everything works together in a single, cohesive ecosystem.
              </p>
            </div>

            <Link
              href="/login?mode=signup"
              className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shrink-0"
            >
              <span>Explore The Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
