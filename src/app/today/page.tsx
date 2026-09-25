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
  { name: 'Reliance Repol PP', price: '₹111.80/kg', change: '+2.2%', isUp: true, points: [108, 109, 109.5, 110, 110.8, 111.2, 111.8] },
  { name: 'Reliance Relene HDPE', price: '₹117.90/kg', change: '+2.2%', isUp: true, points: [114, 115, 115.5, 116, 116.8, 117.2, 117.9] },
  { name: 'GAIL G-Lex LLDPE', price: '₹114.20/kg', change: '+2.1%', isUp: true, points: [111, 112, 112.5, 113, 113.5, 113.8, 114.2] },
  { name: 'Finolex PVC K-67', price: '₹102.00/kg', change: '+1.9%', isUp: true, points: [99, 100, 100.2, 100.8, 101.2, 101.5, 102.0] },
  { name: 'Reliance Relpet PET', price: '₹107.00/kg', change: '+2.2%', isUp: true, points: [104, 104.5, 105, 105.8, 106.2, 106.5, 107.0] },
  { name: 'SABIC Lexan PC', price: '₹248.00/kg', change: '+1.6%', isUp: true, points: [242, 243, 244, 245, 246, 247, 248] },
  { name: 'BASF Ultramid PA6', price: '₹292.00/kg', change: '+1.6%', isUp: true, points: [286, 287, 288, 289, 290, 291, 292] },
  { name: 'LG Chem ABS', price: '₹166.80/kg', change: '+1.9%', isUp: true, points: [162, 163, 164, 165, 165.5, 166, 166.8] },
  { name: 'Circular rPET Flakes', price: '₹84.20/kg', change: '+2.4%', isUp: true, points: [81, 82, 82.5, 83, 83.5, 83.9, 84.2] },
  { name: 'Brent Crude Oil', price: '$88.30/bbl', change: '+1.8%', isUp: true, points: [85, 86, 86.5, 87, 87.4, 87.8, 88.3] },
  { name: 'Indian EPR Credit (Rigid)', price: '₹2,490/ton', change: '+1.7%', isUp: true, points: [2430, 2440, 2450, 2465, 2475, 2480, 2490] },
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
