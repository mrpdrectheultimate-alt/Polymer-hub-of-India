import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Newspaper } from 'lucide-react'
import TodayDashboard from '@/components/TodayDashboard'
import MarketSparkline from '@/components/MarketSparkline'
import { TODAY_CURATED_UPDATES } from '@/lib/data/today-updates'

interface DBUpdate {
  id: string
  headline: string
  summary: string
  source_name: string
  source_url: string | null
  image_url: string | null
  image_credit: string | null
  visual_type?: string | null
  rights_class?: string | null
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

export const metadata: Metadata = {
  title: 'Daily Polymer Intelligence & Market Spot Benchmarks | PolymerHub India',
  description: 'Curated daily polymer engineering updates, Indian domestic resin spot prices, BIS quality standards, EPR compliance policies, and bioplastics R&D news.',
  openGraph: {
    title: 'Daily Polymer Intelligence | PolymerHub India',
    description: 'Real-time petrochem spot benchmarks, EPR policies, biopolymers R&D & syllabus-connected industry briefs.',
    url: 'https://polymerhubofindia.com/today',
    siteName: 'PolymerHub India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=630&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Daily Polymer Intelligence & Petrochemical Spot Market',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Polymer Intelligence | PolymerHub India',
    description: 'Curated Indian plastic manufacturing updates, spot benchmarks, and R&D research.',
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=630&auto=format&fit=crop&q=80'],
  },
}

const TICKER_DATA = [
  { name: 'Reliance Repol PP', price: '₹96.60/kg', change: '+0.2%', isUp: true, points: [95.0, 95.4, 95.8, 95.9, 96.1, 96.4, 96.6] },
  { name: 'Reliance Relene HDPE', price: '₹101.50/kg', change: '+0.3%', isUp: true, points: [99.8, 100.1, 100.4, 100.6, 100.8, 101.2, 101.5] },
  { name: 'GAIL G-Lex LLDPE', price: '₹97.60/kg', change: '+0.3%', isUp: true, points: [96.0, 96.4, 96.7, 96.8, 97.0, 97.3, 97.6] },
  { name: 'Finolex PVC K-67', price: '₹79.50/kg', change: '+0.4%', isUp: true, points: [78.2, 78.4, 78.6, 78.7, 78.9, 79.2, 79.5] },
  { name: 'Reliance Relpet PET', price: '₹93.20/kg', change: '+0.3%', isUp: true, points: [91.8, 92.0, 92.3, 92.4, 92.6, 92.9, 93.2] },
  { name: 'SABIC Lexan PC', price: '₹221.00/kg', change: '+0.2%', isUp: true, points: [218.8, 219.2, 219.5, 219.8, 220.0, 220.5, 221.0] },
  { name: 'BASF Ultramid PA6', price: '₹251.00/kg', change: '+0.2%', isUp: true, points: [248.9, 249.4, 249.8, 250.0, 250.2, 250.6, 251.0] },
  { name: 'LG Chem ABS', price: '₹143.40/kg', change: '+0.3%', isUp: true, points: [141.6, 141.9, 142.2, 142.4, 142.6, 143.0, 143.4] },
  { name: 'Circular rPET Flakes', price: '₹77.00/kg', change: '+0.5%', isUp: true, points: [75.1, 75.5, 75.8, 76.0, 76.2, 76.6, 77.0] },
  { name: 'Circular rHDPE Granules', price: '₹73.60/kg', change: '+0.5%', isUp: true, points: [71.8, 72.0, 72.4, 72.6, 72.8, 73.2, 73.6] },
  { name: 'Brent Crude Oil', price: '$78.15/bbl', change: '+0.4%', isUp: true, points: [76.8, 77.0, 77.20, 77.35, 77.45, 77.80, 78.15] },
  { name: 'CPCB EPR Credit (Cat-I)', price: '₹2,840/ton', change: '+1.1%', isUp: true, points: [2710, 2730, 2750, 2765, 2780, 2810, 2840] },
]

function LiveTicker({ dateLabel }: { dateLabel?: string }) {
  const displayDate = dateLabel || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <div className="bg-[#070F1E] border-b-2 border-slate-900 overflow-hidden h-11 flex items-center select-none">
      <div className="bg-[#F5C518] text-slate-950 font-mono text-xs font-black px-4 h-full flex items-center gap-1.5 flex-shrink-0 border-r-2 border-slate-900 uppercase tracking-widest z-10 shadow-md">
        <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
        Indicative Spot Benchmarks ({displayDate})
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap items-center">
          {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
            <div key={i} className="font-mono text-xs text-slate-300 font-medium px-6 border-r border-white/10 flex items-center gap-2">
              <span className="text-white font-bold">{item.name}</span>
              <span className="text-amber-400 font-bold">{item.price}</span>
              <span className={`font-bold text-[10px] ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>{item.change}</span>
              <MarketSparkline isUp={item.isUp} points={item.points} width={64} height={20} />
            </div>
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

  const rawList = (updatesData && updatesData.length > 0)
    ? (updatesData as unknown as DBUpdate[])
    : TODAY_CURATED_UPDATES

  const items = rawList.map((item) => ({
    id: item.id,
    headline: item.headline,
    summary: item.summary,
    source_name: item.source_name,
    source_url: item.source_url,
    image_url: item.image_url,
    image_credit: item.image_credit || null,
    visual_type: item.visual_type || null,
    rights_class: item.rights_class || null,
    category: item.category,
    region: (item.region || 'Global') as 'India' | 'Global' | 'Regional',
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
