import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Newspaper } from 'lucide-react'
import TodayDashboard from '@/components/TodayDashboard'
import MarketSparkline from '@/components/MarketSparkline'

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
    url: 'https://polymerhub.in/today',
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
  { name: 'Reliance Repol PP', price: '₹114.80/kg', change: '+0.5%', isUp: true, points: [110.8, 111.8, 112.4, 113.1, 113.8, 114.2, 114.8] },
  { name: 'Reliance Relene HDPE', price: '₹121.00/kg', change: '+0.5%', isUp: true, points: [116.8, 117.9, 118.5, 119.2, 119.8, 120.4, 121.0] },
  { name: 'GAIL G-Lex LLDPE', price: '₹117.00/kg', change: '+0.4%', isUp: true, points: [113.5, 114.2, 114.8, 115.4, 116.0, 116.5, 117.0] },
  { name: 'Finolex PVC K-67', price: '₹104.40/kg', change: '+0.4%', isUp: true, points: [101.2, 102.0, 102.8, 103.2, 103.6, 104.0, 104.4] },
  { name: 'Reliance Relpet PET', price: '₹109.60/kg', change: '+0.4%', isUp: true, points: [106.2, 107.0, 107.5, 108.2, 108.8, 109.2, 109.6] },
  { name: 'SABIC Lexan PC', price: '₹252.40/kg', change: '+0.2%', isUp: true, points: [246, 248, 249.2, 250.5, 251.2, 251.8, 252.4] },
  { name: 'BASF Ultramid PA6', price: '₹296.80/kg', change: '+0.2%', isUp: true, points: [290, 292, 293.5, 294.8, 295.6, 296.2, 296.8] },
  { name: 'LG Chem ABS', price: '₹170.00/kg', change: '+0.4%', isUp: true, points: [165.5, 166.8, 167.5, 168.2, 168.8, 169.4, 170.0] },
  { name: 'Circular rPET Flakes', price: '₹87.40/kg', change: '+0.7%', isUp: true, points: [83.5, 84.2, 85.0, 85.6, 86.2, 86.8, 87.4] },
  { name: 'Brent Crude Oil', price: '$89.80/bbl', change: '+0.3%', isUp: true, points: [87.4, 88.3, 88.6, 88.9, 89.2, 89.5, 89.8] },
  { name: 'Indian EPR Credit (Rigid)', price: '₹2,590/ton', change: '+0.8%', isUp: true, points: [2475, 2490, 2510, 2530, 2550, 2570, 2590] },
]

function LiveTicker() {
  return (
    <div className="bg-[#070F1E] border-b-2 border-slate-900 overflow-hidden h-11 flex items-center select-none">
      <div className="bg-[#F5C518] text-slate-950 font-mono text-xs font-black px-4 h-full flex items-center gap-1.5 flex-shrink-0 border-r-2 border-slate-900 uppercase tracking-widest z-10 shadow-md">
        <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
        Indicative Spot Benchmarks
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap items-center">
          {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
            <div key={i} className="font-mono text-xs text-slate-300 font-medium px-6 border-r border-white/10 flex items-center gap-2">
              <span className="text-white font-bold">{item.name}</span>
              <span className="text-amber-400 font-bold">{item.price}</span>
              <span className="text-emerald-400 font-bold text-[10px]">{item.change}</span>
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

  const items = ((updatesData as unknown as DBUpdate[]) || []).map((item) => ({
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
