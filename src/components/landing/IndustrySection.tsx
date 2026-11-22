import Link from 'next/link'
import { Flame, TrendingUp, ArrowRight, ShieldCheck, ExternalLink, Calendar, MapPin } from 'lucide-react'
import { INDIAN_POLYMER_PRICES, TODAY_CURATED_UPDATES } from '@/lib/data/today-updates'

export default function IndustrySection() {
  const featuredNews = TODAY_CURATED_UPDATES.slice(0, 3)
  const topPrices = INDIAN_POLYMER_PRICES.slice(0, 6)

  return (
    <section id="industry" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-rose-600" /> Real-Time Industry Intelligence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
              Live Petrochem Spot Benchmarks &amp; Daily News
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-sans max-w-2xl">
              Engineering does not happen in a vacuum. Track daily plant-gate resin prices, CPCB EPR policies, and Indian petrochemical trial runs.
            </p>
          </div>

          <Link
            href="/today"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-sm transition-all self-start md:self-auto shrink-0"
          >
            <span>Full Today Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Column Grid: Left Spot Prices, Right Latest Briefs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Indicative Spot Benchmarks (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Domestic Spot Benchmarks
              </span>
              <span className="text-[10px] font-mono text-slate-500">Ex-Works / Plant Gate</span>
            </div>

            <div className="divide-y divide-slate-200">
              {topPrices.map((item) => (
                <div key={item.polymer} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-sans font-bold text-xs text-slate-900">
                      {item.producer}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {item.polymer} &middot; {item.grade.split(' ')[0]}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-slate-950">
                      {item.price}{item.unit}
                    </div>
                    <span className="inline-block text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/today"
                className="text-xs font-mono font-bold text-blue-600 hover:underline"
              >
                View all 12 benchmarks including Brent Crude &amp; EPR Credits &rarr;
              </Link>
            </div>
          </div>

          {/* Right: Curated Daily News (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                Today&apos;s Verified Industry Briefs
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Curriculum Mapped
              </span>
            </div>

            <div className="space-y-3.5">
              {featuredNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-blue-600 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {news.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Source: {news.source_name.split('&')[0]}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-950 group-hover:text-blue-600 transition-colors leading-snug">
                    {news.headline}
                  </h3>

                  <p className="text-xs text-slate-600 font-sans mt-2 line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">
                      Lesson Link: {news.related_subject_slug ?? 'polymer-processing'}
                    </span>
                    <Link href="/today" className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                      Read Dispatch &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
