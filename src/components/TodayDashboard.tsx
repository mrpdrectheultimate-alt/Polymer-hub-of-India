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
  Research:       { badge: 'bg-blue-50 text-[#2563EB] border-blue-200', border: '#2563EB' },
  Market:         { badge: 'bg-amber-50 text-amber-900 border-amber-200', border: '#D97706' },
  India:          { badge: 'bg-orange-50 text-orange-800 border-orange-200', border: '#EA580C' },
  Sustainability: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', border: '#16A34A' },
  Policy:         { badge: 'bg-purple-50 text-purple-800 border-purple-200', border: '#9333EA' },
  Innovation:     { badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', border: '#4F46E5' },
  Recycling:      { badge: 'bg-teal-50 text-teal-800 border-teal-200', border: '#0D9488' },
  Bioplastics:    { badge: 'bg-lime-50 text-lime-900 border-lime-200', border: '#65A30D' },
}

const DEFAULT_IMAGES: Record<string, string> = {
  Research:       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
  Market:         'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
  India:          'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=800&q=80',
  Sustainability: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
  Policy:         'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=80',
  Innovation:     'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
  Recycling:      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
  Bioplastics:    'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=800&q=80',
}

const TRENDING_RESINS = [
  { name: 'Repol PP', change: '+0.8%', tag: 'Reliance' },
  { name: 'Relene HDPE', change: '+0.4%', tag: 'Blow Moulding' },
  { name: 'Finolex PVC', change: '-0.2%', tag: 'Rigid Pipe' },
  { name: 'SABIC Lexan PC', change: '+0.3%', tag: 'Engineering' },
  { name: 'JBF PET', change: '-0.5%', tag: 'Bottle Grade' },
  { name: 'Toray PEEK', change: '+1.2%', tag: 'Aerospace' },
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
    i.category === 'Sustainability' || i.category === 'Recycling' || i.category === 'Bioplastics'
  ).length

  return (
    <div className="space-y-8">
      
      {/* ── Control Bar: Search & Filtering Tabs ── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80 flex-shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search polymer briefings, EPR norms, resins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 font-sans"
          />
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Regions', icon: Globe },
            { id: 'india', label: '🇮🇳 India Focus', icon: Landmark },
            { id: 'global', label: '🌍 Global R&D', icon: LayoutGrid },
          ].map((tab) => {
            const Icon = tab.icon
            const isSelected = selectedRegion === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 font-bold uppercase hidden sm:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Disciplines</option>
            {Object.keys(CATEGORY_STYLES).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* ── Main Layout: Content Grid + Right Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── Left 8 Columns: Stories Stream ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-xs space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-display text-lg font-bold text-slate-900">No matching daily updates found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or selecting &quot;All Disciplines&quot; to view the full intelligence stream.
              </p>
              <button
                onClick={() => {
                  setSelectedRegion('all')
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* 🌟 Prominent Featured Hero Card */}
              {featured && (
                <article className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all duration-300 group">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Visual Card Image with Clean Fallback Pattern (Zero Black Void) */}
                    <div className="md:col-span-5 relative min-h-[220px] md:min-h-full bg-gradient-to-br from-slate-100 to-blue-50/50 overflow-hidden flex items-center justify-center">
                      <img
                        src={featured.image_url || DEFAULT_IMAGES[featured.category] || DEFAULT_IMAGES.Research}
                        alt={featured.headline}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="font-mono text-[10px] font-bold bg-[#2563EB] text-white px-2.5 py-0.5 rounded-lg shadow-xs">
                          ⭐ Featured
                        </span>
                        <span className="font-mono text-[10px] font-bold bg-white/95 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs">
                          {featured.region}
                        </span>
                      </div>

                      {featured.image_credit && (
                        <div className="absolute bottom-2 right-2 bg-slate-900/60 backdrop-blur-xs text-[9px] text-white/90 px-2 py-0.5 rounded font-mono select-none">
                          📸 {featured.image_credit}
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg border uppercase ${
                            CATEGORY_STYLES[featured.category]?.badge || 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}>
                            {featured.category}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-medium">
                            {featured.source_name} &middot; {new Date(featured.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight group-hover:text-[#2563EB] transition-colors">
                          {featured.headline}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                          {featured.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                        {featured.related_lesson_slug && (
                          <Link
                            href={`/lessons/${featured.related_lesson_slug}`}
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-4 py-2 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-[#2563EB] hover:text-white border border-blue-200 transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Connect to Lesson
                          </Link>
                        )}
                        {featured.source_url && (
                          <a
                            href={featured.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all ml-auto"
                          >
                            Source Link <ExternalLink className="w-3.5 h-3.5" />
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
                      className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image / Header Pattern (Zero Black Void) */}
                        <div className="relative h-44 bg-gradient-to-br from-slate-100 to-blue-50/50 overflow-hidden border-b border-slate-100 flex items-center justify-center">
                          <img
                            src={item.image_url || DEFAULT_IMAGES[item.category] || DEFAULT_IMAGES.Research}
                            alt={item.headline}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-lg border uppercase shadow-xs ${catStyle.badge}`}>
                              {item.category}
                            </span>
                            <span className="font-mono text-[9px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs">
                              {item.region}
                            </span>
                          </div>

                          {item.image_credit && (
                            <div className="absolute bottom-2 right-2 bg-slate-900/60 backdrop-blur-xs text-[8px] text-white/90 px-1.5 py-0.5 rounded font-mono select-none">
                              📸 {item.image_credit}
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-medium">
                            <span>{item.source_name}</span>
                            <span>{new Date(item.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                          </div>

                          <h3 className="font-display text-base font-bold text-slate-900 leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">
                            {item.headline}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                        {item.related_lesson_slug ? (
                          <Link
                            href={`/lessons/${item.related_lesson_slug}`}
                            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#2563EB] hover:text-blue-800 uppercase"
                          >
                            <BookOpen className="w-3 h-3" /> Syllabus Link &rarr;
                          </Link>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">Educational Brief</span>
                        )}

                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
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
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Daily Executive Digest
              </span>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-lg border border-blue-200">
                Live Analysis
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-sans">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-900">National Manufacturing:</strong> {indiaCount} reports highlight polyolefin and carbon composite supply chains across India.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-900">EPR &amp; Circularity:</strong> {sustainabilityCount} updates emphasize chemical pyrolysis recycling facilities and MoEFCC EPR norms.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-900">Engineering Resins:</strong> Growing demand for high-heat polyamides and bio-composites across EV components.
                </p>
              </div>
            </div>
          </div>

          {/* 2. On This Day in Polymer History */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-blue-100/70 px-2.5 py-0.5 rounded-lg">
                📜 Milestone ({ON_THIS_DAY.year})
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-slate-900">
              {ON_THIS_DAY.headline}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {ON_THIS_DAY.body}
            </p>
          </div>

          {/* 3. Shop-Floor Quick Tips */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Shop-Floor Quick Tips
              </span>
            </div>

            <div className="space-y-3">
              {SHOP_FLOOR_TIPS.map((tip, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-slate-900">{tip.title}</span>
                    <span className="text-[9px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {tip.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {tip.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Trending Resins Tracker */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Benchmark Resins
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TRENDING_RESINS.map((resin) => (
                <Link
                  key={resin.name}
                  href={`/materials?search=${encodeURIComponent(resin.name.split(' ')[1] || resin.name)}`}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-slate-900 group-hover:text-[#2563EB]">
                      {resin.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                    <span className="text-slate-500">{resin.tag}</span>
                    <span className={resin.change.startsWith('+') ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {resin.change}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 5. AI Tutor Shortcut Widget */}
          <div className="bg-[#1E40AF] text-white border border-blue-300/30 rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" /> AI News Synthesis
            </div>
            <h4 className="font-display font-bold text-base text-white">
              Connect Industry News to Your B.Tech &amp; GATE Exams
            </h4>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              Ask the RAG AI Copilot to summarize today&apos;s polymer briefings and generate practice questions.
            </p>
            <Link
              href={`/ai-tutor?prompt=${encodeURIComponent("Summarize today's polymer headlines and connect them to B.Tech Plastic Processing and Polymer Chemistry concepts.")}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#2563EB] font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-xs"
            >
              Ask AI Copilot &rarr;
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
