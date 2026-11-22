import Link from 'next/link'
import { GraduationCap, Trophy, Factory, ArrowRight, BookOpen, Wrench, FileText, CheckCircle2 } from 'lucide-react'

export default function AudienceCards() {
  const tracks = [
    {
      title: 'College & CIPET Students',
      badge: 'Academics & Semester Exams',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: GraduationCap,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200',
      desc: 'Master fundamentals with 216 lessons across 19 subjects aligned with AICTE and CIPET syllabi. Prepare for semester exams, laboratory vivas, and campus placement interviews.',
      highlights: [
        'Curriculum-mapped notes & diagrams',
        'End-of-lesson knowledge checks & XP',
        '3D molecular models & CPK structures',
      ],
      href: '/students',
      cta: 'Explore Student Hub',
    },
    {
      title: 'GATE XE-F Aspirants',
      badge: 'Competitive Exam Focus',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Trophy,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 border-purple-200',
      desc: 'Build dedicated polymer preparation for GATE Engineering Sciences (XE Paper F). Master formula derivations, solve numericals, and take simulated 60-minute mock exams.',
      highlights: [
        'Official XE5/XE-F syllabus alignment',
        'Formula library with step-by-step derivations',
        'Simulated mock tests with negative marking',
      ],
      href: '#gate-xef',
      cta: 'Explore GATE Preparation',
    },
    {
      title: 'Plant & Process Engineers',
      badge: 'Shop-Floor Manufacturing',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: Factory,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200',
      desc: 'Solve real production challenges on the factory floor. Diagnose moulding defects with Rosato protocols, calculate clamp tonnages, and track daily domestic polymer spot benchmarks.',
      highlights: [
        '8 industrial engineering solvers',
        'Rosato-calibrated defect diagnostics',
        'Daily Indian resin spot benchmarks',
      ],
      href: '/calculators',
      cta: 'Explore Engineering Tools',
    },
  ]

  return (
    <section id="audience" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            Targeted Learning Tracks
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            Where do you want to start?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-sans">
            PolymerHub adapts to your goals &mdash; whether you are an undergraduate student, GATE aspirant, or shop-floor manufacturing professional.
          </p>
        </div>

        {/* 3 Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track) => {
            const Icon = track.icon
            return (
              <div
                key={track.title}
                className="bg-slate-50 rounded-3xl border-2 border-slate-200 p-7 flex flex-col justify-between hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${track.iconBg}`}>
                      <Icon className={`w-6 h-6 ${track.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${track.badgeColor}`}>
                      {track.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2.5">
                    {track.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mb-6">
                    {track.desc}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-200/80 mb-6">
                    {track.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-700 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={track.href}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-900 text-slate-900 hover:text-white border-2 border-slate-900 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{track.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
