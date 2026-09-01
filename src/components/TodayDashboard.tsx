'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  ExternalLink, 
  Brain, 
  BookOpen, 
  Globe, 
  Landmark, 
  LayoutGrid, 
  Search, 
  Calendar, 
  Sparkles,
  TrendingUp,
  Lightbulb
} from 'lucide-react'

export interface NewsItem {
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

const CATEGORY_STYLES: Record<string, { badge: string; border: string }> = {
  Research:       { badge: 'bg-blue-100 text-blue-800 border-blue-200', border: '#2563EB' },
  Market:         { badge: 'bg-amber-100 text-amber-900 border-amber-200', border: '#D97706' },
  India:          { badge: 'bg-orange-100 text-orange-800 border-orange-200', border: '#EA580C' },
  Sustainability: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', border: '#16A34A' },
  Policy:         { badge: 'bg-purple-100 text-purple-800 border-purple-200', border: '#9333EA' },
  Innovation:     { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', border: '#4F46E5' },
  Recycling:      { badge: 'bg-teal-100 text-teal-800 border-teal-200', border: '#0D9488' },
  Bioplastics:    { badge: 'bg-lime-100 text-lime-900 border-lime-200', border: '#65A30D' },
}

const CATEGORY_THEMES: Record<string, { gradient: string; icon: string; tag: string }> = {
  Research: {
    gradient: 'from-blue-900 via-indigo-950 to-slate-950',
    icon: '🔬',
    tag: 'R&D / Molecular Lab'
  },
  Market: {
    gradient: 'from-amber-900 via-stone-900 to-slate-950',
    icon: '📈',
    tag: 'Petrochem Price Index'
  },
  India: {
    gradient: 'from-orange-900 via-slate-900 to-slate-950',
    icon: '🇮🇳',
    tag: 'CIPET & Domestic Mfg'
  },
  Sustainability: {
    gradient: 'from-emerald-900 via-teal-950 to-slate-950',
    icon: '♻️',
    tag: 'Circular Monomaterials'
  },
  Policy: {
    gradient: 'from-purple-900 via-indigo-950 to-slate-950',
    icon: '📜',
    tag: 'BIS Standards & Norms'
  },
  Innovation: {
    gradient: 'from-violet-900 via-blue-950 to-slate-950',
    icon: '🚀',
    tag: 'Advanced Composites'
  },
  Recycling: {
    gradient: 'from-teal-900 via-emerald-950 to-slate-950',
    icon: '🔄',
    tag: 'Mechanical Flake Recycling'
  },
  Bioplastics: {
    gradient: 'from-lime-900 via-green-950 to-slate-950',
    icon: '🌱',
    tag: 'PLA & Bio-Polymers'
  },
}

const DEFAULT_IMAGES: Record<string, string> = {
  Research:       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
  Market:         'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
  India:          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
  Sustainability: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
  Policy:         'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&auto=format&fit=crop&q=80',
  Innovation:     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  Recycling:      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80',
  Bioplastics:    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
}

function NewsVisualHeader({
  imageUrl,
  headline,
  category,
  region,
  imageCredit,
  isFeatured = false
}: {
  imageUrl?: string | null
  headline: string
  category: string
  region: string
  imageCredit?: string | null
  isFeatured?: boolean
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.Research
  const fallbackUrl = DEFAULT_IMAGES[category] || DEFAULT_IMAGES.Research
  const displayUrl = imageUrl || fallbackUrl

  return (
    <div className={`relative overflow-hidden ${isFeatured ? 'min-h-[260px] md:min-h-full' : 'h-48'} bg-gradient-to-br ${theme.gradient}`}>
      {/* Visual Engineering Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Decorative Technical Watermark */}
      <div className="absolute -right-3 -bottom-4 text-7xl select-none opacity-20 pointer-events-none filter blur-[0.5px]">
        {theme.icon}
      </div>

      {/* Real High-Res Photo with Instant CSS Background Fallback */}
      {!imgError && (
        <img
          src={displayUrl}
          alt={headline}
          referrerPolicy="no-referrer"
          loading={isFeatured ? 'eager' : 'lazy'}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-85' : 'opacity-0'}`}
        />
      )}

      {/* High-Contrast Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

      {/* Top Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase shadow-sm ${CATEGORY_STYLES[category]?.badge || 'bg-white/90 text-slate-900 border-white/20'}`}>
          {theme.icon} {category}
        </span>
        <span className="font-mono text-[9px] font-bold bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded border border-white/15 uppercase">
          {region}
        </span>
      </div>

      {/* Bottom Technical Tag */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-white/80 z-10">
        <span className="truncate max-w-[70%] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
          ⚡ {theme.tag}
        </span>
        {imageCredit && (
          <span className="text-[8px] text-white/60 bg-black/60 px-1.5 py-0.5 rounded">
            📸 {imageCredit}
          </span>
        )}
      </div>
    </div>
  )
}

export interface PolymerPriceIndex {
  polymer: string
  grade: string
  producer: string
  price: string
  unit: string
  change: string
  isUp: boolean
  location: string
}

export const INDIAN_POLYMER_PRICES: PolymerPriceIndex[] = [
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹94.50', unit: '/kg', change: '+0.8%', isUp: true, location: 'Hazira/Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹102.80', unit: '/kg', change: '+0.4%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹99.20', unit: '/kg', change: '+0.6%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹89.50', unit: '/kg', change: '-0.2%', isUp: false, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹93.40', unit: '/kg', change: '-0.5%', isUp: false, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹224.00', unit: '/kg', change: '+0.3%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹265.00', unit: '/kg', change: '+1.1%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹148.50', unit: '/kg', change: '+0.2%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹68.00', unit: '/kg', change: '+1.5%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹62.50', unit: '/kg', change: '+0.8%', isUp: true, location: 'Ahmedabad' },
]

const SHOP_FLOOR_TIPS = [
  {
    title: 'Clamping Tonnage Formula',
    tip: 'Clamp (Ton) = Projected Area (cm²) × Cavity Pressure (bar) / 1000. Add 15% safety factor for high-speed cycles.',
    tag: 'Injection Moulding',
  },
  {
    title: 'MFI vs. Shear Viscosity',
    tip: 'MFI measures single-point low-shear flow. Under high shear rates in mould gates, pseudo-plastic polymers thin non-linearly.',
    tag: 'Rheology',
  },
  {
    title: 'Hygroscopic Resin Drying',
    tip: 'Nylon, PET, and Polycarbonate MUST be dried with desiccant dryers (-40°C dew point) to prevent hydrolytic degradation.',
    tag: 'Materials',
  },
]

const ON_THIS_DAY = {
  year: '1935',
  headline: 'DuPont Patents Nylon 6,6',
  body: 'Wallace Carothers patents the first fully synthetic commercial polyamide fiber — originally used in WWII parachutes and today found in automotive engine covers, gears, and tire cord.',
}

export default function TodayDashboard({ initialItems }: { initialItems: NewsItem[] }) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter items based on active tabs & search
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesRegion = selectedRegion === 'all' || item.region?.toLowerCase() === selectedRegion.toLowerCase()
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesSearch = searchQuery.trim() === '' || 
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source_name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesRegion && matchesCategory && matchesSearch
    })
  }, [initialItems, selectedRegion, selectedCategory, searchQuery])

  // Extract featured and standard items
  const featured = useMemo(() => {
    return filteredItems.find((i) => i.is_featured) || filteredItems[0]
  }, [filteredItems])

  const standardItems = useMemo(() => {
    return filteredItems.filter((i) => i.id !== featured?.id)
  }, [filteredItems, featured])

  // Compute insights
  const indiaCount = initialItems.filter((i) => i.region === 'India').length
  const sustainabilityCount = initialItems.filter((i) => 
    i.category === 'Recycling' || i.category === 'Bioplastics' || i.category === 'Sustainability'
  ).length

  return (
    <div className="space-y-8">
      
      {/* ── Filter & Search Control Toolbar ── */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Region Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRegion === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> All Regions
          </button>
          <button
            onClick={() => setSelectedRegion('india')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRegion === 'india'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-amber-400" /> India Focus
          </button>
          <button
            onClick={() => setSelectedRegion('global')}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRegion === 'global'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" /> Global
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1 md:justify-end">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search polymer news..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:border-slate-900 transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Research">Research &amp; R&amp;D</option>
              <option value="Market">Market &amp; Prices</option>
              <option value="India">Indian Manufacturing</option>
              <option value="Sustainability">Sustainability &amp; Circularity</option>
              <option value="Policy">Policy &amp; EPR</option>
              <option value="Innovation">Material Innovation</option>
              <option value="Recycling">Mechanical &amp; Chemical Recycling</option>
              <option value="Bioplastics">Bioplastics &amp; PHA/PLA</option>
            </select>
          </div>

        </div>

      </div>

      {/* ── Main Layout: Content Grid + Right Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── Left 8 Columns: Stories Stream ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {filteredItems.length === 0 ? (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-12 text-center shadow-lg space-y-4">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-display text-xl font-bold text-slate-900">No matching daily updates found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or selecting &quot;All Categories&quot; to view today&apos;s latest intelligence stream.
              </p>
              <button
                onClick={() => {
                  setSelectedRegion('all')
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* 🌟 Prominent Featured Hero Card */}
              {featured && (
                <article className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Visual Polymer Header */}
                    <div className="md:col-span-5 relative">
                      <NewsVisualHeader
                        imageUrl={featured.image_url}
                        headline={featured.headline}
                        category={featured.category}
                        region={featured.region}
                        imageCredit={featured.image_credit}
                        isFeatured={true}
                      />
                    </div>

                    {/* Content Details */}
                    <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                            CATEGORY_STYLES[featured.category]?.badge || 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}>
                            {featured.category}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-medium">
                            {featured.source_name} &middot; {new Date(featured.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                          </span>
                        </div>

                        <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {featured.headline}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          {featured.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                        {featured.related_lesson_slug && (
                          <Link
                            href={`/lessons/${featured.related_lesson_slug}`}
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Connect to Lesson
                          </Link>
                        )}
                        {featured.source_url && (
                          <a
                            href={featured.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all ml-auto"
                          >
                            Read Full Source <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                    </div>

                  </div>
                </article>
              )}

              {/* 📰 Standard Stories Grid (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {standardItems.map((item) => {
                  const catStyle = CATEGORY_STYLES[item.category] || { badge: 'bg-slate-100 text-slate-800 border-slate-200', border: '#0F172A' }
                  return (
                    <article
                      key={item.id}
                      className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Visual Polymer Header */}
                        <NewsVisualHeader
                          imageUrl={item.image_url}
                          headline={item.headline}
                          category={item.category}
                          region={item.region}
                          imageCredit={item.image_credit}
                          isFeatured={false}
                        />

                        {/* Text */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-medium">
                            <span>{item.source_name}</span>
                            <span>{new Date(item.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                          </div>

                          <h3 className="font-display text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.headline}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                        {item.related_lesson_slug ? (
                          <Link
                            href={`/lessons/${item.related_lesson_slug}`}
                            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-blue-700 hover:text-blue-900 uppercase"
                          >
                            <BookOpen className="w-3 h-3" /> Syllabus Link &rarr;
                          </Link>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">Industry Brief</span>
                        )}

                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Source <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                    </article>
                  )
                })}
              </div>

            </div>
          )}

        </div>

        {/* ── Right 4 Columns: Intelligence Sidebar ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Weekly Takeaways Digest */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Daily Executive Digest
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Live Analysis
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-900">India Expansion:</strong> {indiaCount} reports highlight Reliance, GAIL, and ISRO carbon composite &amp; PP infrastructure investments.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-900">EPR &amp; Circularity:</strong> {sustainabilityCount} updates emphasize chemical pyrolysis recycling facilities and strict MoEFCC EPR credit mandates.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-900">Engineering Grades:</strong> Growing demand for high-heat automotive polyamides and bioplastics across EV battery packs.
                </p>
              </div>
            </div>
          </div>

          {/* 2. On This Day in Polymer History */}
          <div className="bg-[#FAF5FF] border-2 border-purple-300 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                📜 On This Day ({ON_THIS_DAY.year})
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-slate-900">
              {ON_THIS_DAY.headline}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {ON_THIS_DAY.body}
            </p>
          </div>

          {/* 3. Shop-Floor Quick Tips */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Shop-Floor Quick Tips
              </span>
            </div>

            <div className="space-y-3">
              {SHOP_FLOOR_TIPS.map((tip, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-slate-900">{tip.title}</span>
                    <span className="text-[9px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {tip.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {tip.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Live Indian Domestic Polymer Spot Prices */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> India Polymer Spot Index
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">Ex-Plant / Spot Rates (Hazira / Mumbai)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                Live 2026
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {INDIAN_POLYMER_PRICES.map((p) => (
                <div
                  key={p.polymer}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-400 transition-all text-xs font-sans space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 leading-tight">{p.polymer}</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{p.price}<span className="text-[10px] font-normal text-slate-500">{p.unit}</span></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span>{p.producer} · {p.grade}</span>
                    <span className={`font-bold ${p.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {p.change}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    📍 {p.location}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-center pt-1 border-t border-slate-100">
              Prices updated daily aligned with Platts, ICIS &amp; RIL/GAIL circulars.
            </div>
          </div>

          {/* 5. AI Tutor Shortcut Widget */}
          <div className="bg-[#0A1628] text-white border-2 border-slate-900 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" /> AI News Synthesis
            </div>
            <h4 className="font-display font-bold text-base text-white">
              Connect Today&apos;s News to Your GATE &amp; B.Tech Exams
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Ask the RAG AI Tutor to summarize today&apos;s headlines and generate 3 practice numericals.
            </p>
            <Link
              href={`/ai-tutor?prompt=${encodeURIComponent("Summarize today's polymer headlines and connect them to B.Tech Plastic Processing and Polymer Chemistry concepts.")}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-xl border-2 border-slate-900 transition-all shadow-[3px_3px_0px_0px_#000]"
            >
              Ask AI Tutor &rarr;
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
