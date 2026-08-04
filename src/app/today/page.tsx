import { createClient } from '@/lib/supabase/server'
import { Newspaper } from 'lucide-react'
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
]

function LiveTicker() {
  return (
    <div className="bg-slate-900 border-b-4 border-slate-900 overflow-hidden h-10 flex items-center select-none">
      <div className="bg-yellow-400 text-slate-900 font-mono text-[10px] font-black px-4 h-full flex items-center flex-shrink-0 border-r-4 border-slate-900 uppercase tracking-widest">
        Live
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-mono text-[10px] text-white/70 px-8 border-r border-white/10">
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

  // Fetch all daily updates that are published (we filter dynamically on the client)
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
  }).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <LiveTicker />

      {/* Hero Header */}
      <section className="border-b-4 border-slate-900 bg-yellow-400 px-6 md:px-12 py-10 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-900 border-4 border-slate-900 flex items-center justify-center rounded">
                <Newspaper className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="font-mono text-[10px] font-black text-slate-900 border-2 border-slate-900 px-3 py-1 uppercase tracking-widest rounded bg-white">
                Daily Pulse
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-slate-900 bg-slate-900 text-yellow-400 px-3 py-1 uppercase tracking-widest rounded">
                {items.length} STORIES LIVE
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-slate-950 leading-none">
              WHAT HAPPENED<br />
              <span className="italic text-slate-900">TODAY IN PLASTICS</span>
            </h1>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-mono text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Edition</div>
            <div className="font-mono text-sm font-black text-slate-900">{dateStr}</div>
          </div>
        </div>
      </section>

      {/* Main Feed Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <TodayDashboard initialItems={items} />
      </div>
    </div>
  )
}
