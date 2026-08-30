import { createClient } from '@/lib/supabase/server'
import { Newspaper, ShieldCheck } from 'lucide-react'
import TodayDashboard from '@/components/TodayDashboard'

interface DBUpdate {
  id: string
  headline: string
  summary: string
  source_name: string
  source_url: string | null
  image_url: string | null
  image_credit: string | null
  category: string
  region: 'India' | 'Global' | 'Regional'
  related_lesson_slug: string | null
  related_subject_slug: string | null
  published_at: string
  publish_date: string
  is_featured: boolean
}

// Revalidate every hour
export const revalidate = 3600

const TICKER_ITEMS = [
  'Repol PP (RIL) ₹94.50/kg ▲0.8%',
  'Relene HDPE ₹101.20/kg ▲0.4%',
  'Finolex PVC ₹88.10/kg ▼0.2%',
  'Brent Crude $78.42/bbl ▲1.1%',
  'SABIC PC ₹218/kg ▲0.3%',
  'JBF PET ₹92/kg ▼0.5%',
  'GAIL LLDPE ₹98.75/kg ▲0.6%',
  'Indian EPR Credit ₹1,850/ton ▲1.2%',
]

function LiveTicker() {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 overflow-hidden h-10 flex items-center select-none">
      <div className="bg-[#2563EB] text-white font-mono text-[11px] font-bold px-4 h-full flex items-center gap-1.5 flex-shrink-0 uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Market Indicative
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-mono text-xs text-slate-300 font-medium px-8 border-r border-white/10">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function TodayPage() {
  const supabase = createClient()

  // Fetch all daily updates that are published
  const { data: updatesData } = await supabase
    .from('daily_updates')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const items = ((updatesData as unknown as DBUpdate[]) || []).map((item) => ({
    id: item.id,
    headline: item.headline,
    summary: item.summary,
    source_name: item.source_name,
    source_url: item.source_url,
    image_url: item.image_url,
    image_credit: item.image_credit || null,
    category: item.category,
    region: item.region || 'Global',
    related_lesson_slug: item.related_lesson_slug,
    related_subject_slug: item.related_subject_slug,
    published_at: item.published_at,
    publish_date: item.publish_date,
    is_featured: item.is_featured
  }))

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      <LiveTicker />

      {/* ── Hero Header: Clean Modern Slate-900 Banner ── */}
      <section className="bg-white border-b border-slate-200/90 py-12 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1 text-xs font-mono font-bold text-[#2563EB]">
              <Newspaper className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Daily Polymer Intelligence &middot; {dateStr}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              What Happened Today in <span className="text-[#2563EB]">Plastics &amp; Polymers</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Curated technical briefings in manufacturing, sustainability policies, and polymer research &mdash; linked to foundational curriculum lessons.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Educational &amp; Industry Briefing Stream. Verified source links provided on each card.</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-stretch md:self-end">
            <div className="bg-slate-50 border border-slate-200/90 px-4 py-2.5 rounded-2xl text-center flex-1 md:flex-initial shadow-xs">
              <span className="font-display text-2xl font-bold text-[#2563EB] block">{items.length}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Stories Live</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/90 px-4 py-2.5 rounded-2xl text-center flex-1 md:flex-initial shadow-xs">
              <span className="font-display text-2xl font-bold text-emerald-600 block">100%</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Syllabus Linked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Dashboard Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 relative z-20">
        <TodayDashboard initialItems={items} />
      </main>
    </div>
  )
}
