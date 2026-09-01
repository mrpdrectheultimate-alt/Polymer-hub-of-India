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
  'Reliance Repol PP ₹94.50/kg ▲0.8%',
  'Reliance Relene HDPE ₹102.80/kg ▲0.4%',
  'GAIL G-Lex LLDPE ₹99.20/kg ▲0.6%',
  'Finolex PVC K-67 ₹89.50/kg ▼0.2%',
  'Reliance Relpet PET ₹93.40/kg ▼0.5%',
  'SABIC Lexan PC ₹224.00/kg ▲0.3%',
  'BASF Ultramid PA6 ₹265.00/kg ▲1.1%',
  'LG Chem ABS ₹148.50/kg ▲0.2%',
  'Circular rPET Flakes ₹68.00/kg ▲1.5%',
  'Brent Crude $78.85/bbl ▲0.9%',
  'Indian EPR Credit ₹1,850/ton ▲1.2%',
]

function LiveTicker() {
  return (
    <div className="bg-[#070F1E] border-b-2 border-slate-900 overflow-hidden h-11 flex items-center select-none">
      <div className="bg-[#F5C518] text-slate-950 font-mono text-xs font-black px-4 h-full flex items-center gap-1.5 flex-shrink-0 border-r-2 border-slate-900 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
        Live Indices
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
  }).toUpperCase()

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20 overflow-x-hidden">
      <LiveTicker />

      {/* ── Hero Header: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-14 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1">
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
                Daily Polymer Intelligence &middot; {dateStr}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight uppercase">
              What Happened Today in <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A] pb-2.5 pt-0.5 leading-[1.15]">
                Plastics &amp; Polymers
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-light">
              Curated daily breakthroughs in Indian manufacturing, EPR policies, biopolymer patents, and global research &mdash; connected directly to your B.Tech syllabus.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-stretch md:self-end">
            <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl text-center flex-1 md:flex-initial">
              <span className="font-display text-2xl font-bold text-amber-400 block">{items.length}</span>
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">Stories Live</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl text-center flex-1 md:flex-initial">
              <span className="font-display text-2xl font-bold text-emerald-400 block">24/7</span>
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">Verified News</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Dashboard Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <TodayDashboard initialItems={items} />
      </main>
    </div>
  )
}
