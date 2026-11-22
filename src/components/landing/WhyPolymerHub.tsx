import { Layers, ArrowRight, CheckCircle2, Split, GraduationCap, Wrench } from 'lucide-react'
import Link from 'next/link'

export default function WhyPolymerHub() {
  const problems = [
    {
      num: '01',
      domain: 'Learning',
      title: 'Scattered learning resources',
      desc: 'Students search across videos, PDFs, books and websites just to understand one subject.',
      icon: Split,
      badge: 'Fragmented Sources',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      num: '02',
      domain: 'Practical knowledge',
      title: 'Theory without practical connection',
      desc: 'Understanding processing, testing, defects and manufacturing requires more than reading theory.',
      icon: Wrench,
      badge: 'Application Gap',
      badgeColor: 'text-rose-800 bg-rose-50 border-rose-200',
    },
    {
      num: '03',
      domain: 'Preparation',
      title: 'Disconnected exam preparation',
      desc: 'GATE preparation, formulas, practice questions and technical references are often spread across different resources.',
      icon: GraduationCap,
      badge: 'Unstructured Prep',
      badgeColor: 'text-purple-800 bg-purple-50 border-purple-200',
    },
  ]

  return (
    <section id="why-polymerhub" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> The Problem in Polymer Education
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            One field. Too many disconnected resources.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Polymer engineering knowledge is scattered across YouTube channels, textbooks, research portals, and random formula sheets. PolymerHub brings every part of that learning journey together in one dedicated environment.
          </p>
        </div>

        {/* 3 Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {problems.map((prob) => {
            const Icon = prob.icon
            return (
              <div
                key={prob.title}
                className="bg-white rounded-2xl p-7 border-2 border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {prob.num} &middot; {prob.domain}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${prob.badgeColor}`}>
                      {prob.badge}
                    </span>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
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
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> The Connected Answer
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white">
                PolymerHub connects the dots.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                From core university polymer theory to 3D molecular structures, machine processing parameters, and dedicated GATE XE-F test series &mdash; everything works together in a single, cohesive engineering environment.
              </p>
            </div>

            <Link
              href="#ecosystem"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shrink-0"
            >
              <span>Explore Platform Ecosystem</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
