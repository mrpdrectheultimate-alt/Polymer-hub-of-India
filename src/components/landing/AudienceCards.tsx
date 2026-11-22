import Link from 'next/link'
import { GraduationCap, Trophy, Factory, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function AudienceCards() {
  const tracks = [
    {
      title: 'College & CIPET Students',
      badge: 'Academics & Semester Exams',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: GraduationCap,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200',
      benefits: [
        '19 Semester subjects & 216 structured university lessons',
        'Laboratory viva manuals, testing standards & 3D models',
        'Master formula library with step-by-step derivations',
        'Student project ideas & technical career roadmaps',
      ],
      href: '/subjects',
      cta: 'Explore Student Resources',
    },
    {
      title: 'GATE XE-F Aspirants',
      badge: 'Competitive Exam Focus',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Trophy,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 border-purple-200',
      benefits: [
        'Dedicated Engineering Sciences (Paper F) syllabus coverage',
        'Daily morning numerical practice questions & formulas',
        'Timed 60-minute simulated CBT mock examination',
        'Dedicated peer study mastermind community on Telegram',
      ],
      href: '/gate-xe-f',
      cta: 'Explore GATE Preparation',
    },
    {
      title: 'Plant & Process Engineers',
      badge: 'Shop-Floor Manufacturing',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: Factory,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200',
      benefits: [
        '8 Shop-floor engineering calculators (tonnage, cooling, shrinkage)',
        'Rosato-grounded injection & extrusion defect troubleshooter',
        'Daily domestic polymer spot price benchmarks (PP, PE, PVC, PET)',
        'ASTM/ISO resin comparator & material property datasheets',
      ],
      href: '/calculators',
      cta: 'Explore Engineering Tools',
    },
  ]

  return (
    <section id="audience" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            Choose Your Learning Pathway
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-950 tracking-tight">
            Where do you want to start?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Select the pathway that matches your immediate goal. Everything connects under your unified PolymerHub account.
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track) => {
            const Icon = track.icon
            return (
              <div
                key={track.title}
                className="bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${track.iconBg} border flex items-center justify-center ${track.iconColor} group-hover:scale-105 transition-transform shadow-xs`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${track.badgeColor}`}>
                      {track.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-950 mb-4 group-hover:text-blue-600 transition-colors">
                    {track.title}
                  </h3>

                  <ul className="space-y-3 mb-8">
                    {track.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-sans leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={track.href}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{track.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
