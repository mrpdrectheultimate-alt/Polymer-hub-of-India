import Link from 'next/link'
import { GraduationCap, Trophy, Factory, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function AudienceCards() {
  const tracks = [
    {
      title: 'College & CIPET Students',
      badge: 'Academics & Semester Exams',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      icon: GraduationCap,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
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
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      icon: Trophy,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/30',
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
      badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      icon: Factory,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/30',
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
    <section id="audience" className="py-20 sm:py-24 bg-[#0A0E1A] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            Targeted Learning Tracks
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Where do you want to start?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 font-sans">
            PolymerHub adapts directly to your current professional or academic milestone.
          </p>
        </div>

        {/* 3 Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track) => {
            const Icon = track.icon
            return (
              <div
                key={track.title}
                className="bg-slate-900/80 rounded-3xl border border-slate-800 p-7 flex flex-col justify-between hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group"
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

                  <h3 className="font-display font-bold text-xl text-white mb-4">
                    {track.title}
                  </h3>

                  <div className="space-y-3 pt-3 border-t border-slate-800 mb-8">
                    {track.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={track.href}
                  className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 border border-slate-700 hover:border-blue-500 shadow-md group"
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
