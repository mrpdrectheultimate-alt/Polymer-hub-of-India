'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Brain, BookOpen, Globe, Landmark, LayoutGrid, Calendar } from 'lucide-react'

interface NewsItem {
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

const CATEGORY_CONFIG: Record<string, { color: string; bg: string }> = {
  Research:      { color: '#1D4ED8', bg: '#EFF6FF' },
  Market:        { color: '#CA8A04', bg: '#FEFCE8' },
  India:         { color: '#1D4ED8', bg: '#EFF6FF' },
  Sustainability:{ color: '#15803D', bg: '#F0FDF4' },
  Policy:        { color: '#7C3AED', bg: '#F5F3FF' },
  Innovation:    { color: '#EA580C', bg: '#FFF7ED' },
  Recycling:     { color: '#15803D', bg: '#F0FDF4' },
  Bioplastics:   { color: '#15803D', bg: '#F0FDF4' },
}

const DEFAULT_IMAGES: Record<string, string> = {
  Research:       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
  Market:         'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  India:          'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=600&q=80',
  Sustainability: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
  Policy:         'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
  Innovation:     'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  Recycling:      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
  Bioplastics:    'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
}

const TRENDING = ['PP', 'HDPE', 'PET', 'ABS', 'Nylon 6', 'PEEK']

const ON_THIS_DAY = {
  year: '1935',
  headline: 'DuPont patents Nylon 6,6',
  body: 'Wallace Carothers patents the first fully synthetic fiber — used in WWII parachutes and today in every tyre cord and engineering gear in your syllabus.',
  color: '#7C3AED',
}

const QUOTES = [
  'Plastics are the workhorses of modern civilization — invisible, indispensable, misunderstood.',
  'The next great polymer solving ocean waste is being designed right now. Will it be you?',
  'Every PPE engineer working today was once a student who chose to understand what most people ignore.',
  'A material that lasts 500 years should be designed to be recovered, not discarded.',
]

export default function TodayDashboard({ initialItems }: { initialItems: NewsItem[] }) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter items based on active tabs
  const filteredItems = initialItems.filter(item => {
    const matchesRegion = selectedRegion === 'all' || item.region?.toLowerCase() === selectedRegion.toLowerCase()
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesRegion && matchesCategory
  })

  // Extract featured and standard items
  const featured = filteredItems.find(i => i.is_featured)
  const standardItems = filteredItems.filter(i => !i.is_featured || i.id !== featured?.id)

  // Compute insights for Weekly Digest section
  const indiaCount = initialItems.filter(i => i.region === 'India').length
  const globalCount = initialItems.filter(i => i.region === 'Global').length
  const recyclingCount = initialItems.filter(i => i.category === 'Recycling' || i.category === 'Bioplastics' || i.category === 'Sustainability').length

  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. News Feed & Filter Panel */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Region & Category Filter Toolbar */}
        <div className="bg-white rounded-xl border-4 border-slate-900 p-5 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[4px_4px_0px_0px_#000]">
          {/* Region Tabs */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border-2 border-slate-200">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                selectedRegion === 'all'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> All Regions
            </button>
            <button
              onClick={() => setSelectedRegion('india')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                selectedRegion === 'india'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" /> India Focus
            </button>
            <button
              onClick={() => setSelectedRegion('global')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                selectedRegion === 'global'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Global
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto border-2 border-slate-900 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Categories</option>
              <option value="Research">Research</option>
              <option value="Market">Market</option>
              <option value="India">India</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Policy">Policy</option>
              <option value="Innovation">Innovation</option>
              <option value="Recycling">Recycling</option>
              <option value="Bioplastics">Bioplastics</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="border-4 border-slate-900 bg-white p-12 text-center rounded-xl shadow-[4px_4px_0px_0px_#000]">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-display text-lg font-black text-slate-800 mb-2">No matching updates found</h3>
            <p className="text-slate-500 font-mono text-xs max-w-md mx-auto">
              There are no daily updates matching your active region or category filters today. Try broadening your keywords.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured Item */}
            {featured && (
              <article
                className="border-4 border-slate-900 rounded-xl overflow-hidden bg-white shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-300 transform hover:-translate-y-1 group"
                style={{
                  borderLeftColor: CATEGORY_CONFIG[featured.category]?.color || '#000',
                  borderLeftWidth: '8px'
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto overflow-hidden bg-slate-900 border-r-0 md:border-r-4 border-slate-900">
                    <img
                      src={featured.image_url || DEFAULT_IMAGES[featured.category]}
                      alt={featured.headline}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="font-mono text-[9px] font-black bg-amber-400 text-slate-950 border-2 border-slate-900 px-2 py-0.5 uppercase tracking-widest rounded shadow-[2px_2px_0px_0px_#000]">
                        ⭐ Featured
                      </span>
                      <span className="font-mono text-[9px] font-black bg-white text-slate-900 border-2 border-slate-900 px-2 py-0.5 uppercase tracking-wider rounded">
                        {featured.region}
                      </span>
                    </div>

                    {/* Image Credit Overlay */}
                    {featured.image_credit && (
                      <div className="absolute bottom-3 right-3 bg-black/40 text-[9px] text-white/95 px-2.5 py-0.5 rounded font-mono select-none pointer-events-none">
                        📸 {featured.image_credit}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-2 items-center mb-3">
                        <span className="font-mono text-[10px] bg-slate-100 border-2 border-slate-900 px-2.5 py-0.5 rounded font-bold text-slate-700">
                          {featured.category}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {new Date(featured.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-black text-slate-900 leading-tight mb-3">
                        {featured.headline}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {featured.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                      {featured.related_lesson_slug && (
                        <Link
                          href={`/lessons/${featured.related_lesson_slug}`}
                          className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black border-2 border-slate-900 px-3 py-1.5 uppercase bg-blue-50 text-blue-700 hover:bg-slate-900 hover:text-white transition-all rounded-lg"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Related Lesson
                        </Link>
                      )}
                      {featured.source_url && (
                        <a
                          href={featured.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black border-2 border-slate-900 px-3 py-1.5 uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-lg"
                        >
                          Read Full Article <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Standard News Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {standardItems.map((item) => {
                const cat = CATEGORY_CONFIG[item.category] ?? { color: '#0F172A', bg: '#F8FAFC' }
                return (
                  <article
                    key={item.id}
                    className="border-4 border-slate-900 bg-white rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between group"
                    style={{
                      borderTopColor: cat.color,
                      borderTopWidth: '8px'
                    }}
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden border-b-2 border-slate-200">
                        <img
                          src={item.image_url || DEFAULT_IMAGES[item.category]}
                          alt={item.headline}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Tags */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="font-mono text-[8px] font-black bg-white text-slate-900 border border-slate-900 px-2 py-0.5 uppercase tracking-wide rounded shadow-[1px_1px_0px_0px_#000]">
                            {item.category}
                          </span>
                          <span className="font-mono text-[8px] font-black bg-slate-900 text-white border border-slate-900 px-2 py-0.5 uppercase tracking-wide rounded">
                            {item.region}
                          </span>
                        </div>

                        {/* Image Credit */}
                        {item.image_credit && (
                          <div className="absolute bottom-2 right-2 bg-black/40 text-[8px] text-white/95 px-1.5 py-0.5 rounded font-mono select-none pointer-events-none">
                            📸 {item.image_credit}
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="p-5">
                        <span className="font-mono text-[9px] text-slate-400 block mb-2">
                          {item.source_name} · {new Date(item.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                        </span>
                        <h3 className="font-display font-extrabold text-base text-slate-900 leading-snug line-clamp-2 mb-2">
                          {item.headline}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex gap-2">
                      {item.related_lesson_slug && (
                        <Link
                          href={`/lessons/${item.related_lesson_slug}`}
                          className="w-full inline-flex items-center justify-center gap-1 font-mono text-[8px] font-black border-2 border-slate-900 px-2 py-2 uppercase bg-slate-50 text-slate-800 hover:bg-slate-900 hover:text-white transition-all rounded-lg"
                        >
                          <BookOpen className="w-3 h-3" /> Related Lesson
                        </Link>
                      )}
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1 font-mono text-[8px] font-black border-2 border-slate-900 px-2 py-2 uppercase bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-lg"
                        >
                          Read Full <ExternalLink className="w-2.5 h-2.5" />
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

      {/* 2. Visual sidebar */}
      <div className="space-y-6">
        
        {/* Weekly Digest summary */}
        <div className="border-4 border-slate-900 bg-white rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
          <div className="border-b-4 border-slate-900 px-4 py-3 bg-slate-900 text-white">
            <h3 className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest">
              {"// WEEK IN PLASTICS DIGEST"}
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <h4 className="font-display font-black text-slate-900 text-base">
              Key Insights Summary
            </h4>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                <span>**Local Moats**: India focus remains strong with {indiaCount} updates detailing ISRO carbon composites, Reliance PP formulations, and agricultural policy transitions.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                <span>**Sustainability Drivers**: {recyclingCount} updates highlight bioplastics, chemical pyrolysis recycling scaleups, and EU mandates reshaping domestic supply chains.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                <span>**Global Innovation**: {globalCount} global engineering research updates highlight self-healing resins and advanced testing protocols.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* On This Day */}
        <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <div className="border-b-4 border-slate-900 px-4 py-3 bg-slate-900">
            <div className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest">{"// On This Day in Plastics"}</div>
          </div>
          <div className="p-5" style={{ backgroundColor: '#F5F3FF' }}>
            <div className="font-display text-5xl font-black mb-2" style={{ color: ON_THIS_DAY.color }}>{ON_THIS_DAY.year}</div>
            <h3 className="font-display text-lg font-black text-slate-900 mb-2">{ON_THIS_DAY.headline}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{ON_THIS_DAY.body}</p>
          </div>
        </div>

        {/* Trending polymers */}
        <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <div className="border-b-4 border-slate-900 px-4 py-3 bg-yellow-bright">
            <div className="font-mono text-[9px] font-black text-slate-900 uppercase tracking-widest">{"// Trending This Week"}</div>
          </div>
          <div className="p-4 bg-white grid grid-cols-3 gap-2">
            {TRENDING.map((mat, i) => (
              <Link
                key={mat}
                href={`/materials?search=${mat}`}
                className="border-2 border-slate-900 p-2.5 text-center hover:bg-slate-900 hover:text-white transition-colors group rounded-lg"
              >
                <div className="font-mono text-xs font-black text-slate-900 group-hover:text-white">{mat}</div>
                <div className="font-mono text-[8px] text-slate-400 group-hover:text-slate-300">#{i + 1}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="border-4 border-slate-900 bg-slate-900 p-5 rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <div className="font-mono text-[9px] text-yellow-bright uppercase tracking-widest mb-3">{"// Quote of the Day"}</div>
          <p className="font-display text-base font-black italic text-white leading-snug mb-2">&ldquo;{quote}&rdquo;</p>
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider">— PolymerHub</p>
        </div>

        {/* AI Tutor */}
        <div className="border-4 border-slate-900 overflow-hidden rounded-xl" style={{ backgroundColor: '#F0FDF4', boxShadow: '4px 4px 0px 0px #15803D' }}>
          <div className="border-b-4 border-slate-900 px-4 py-3 bg-green-600">
            <div className="font-mono text-[9px] font-black text-white uppercase tracking-widest">{"// AI Tutor"}</div>
          </div>
          <div className="p-5">
            <p className="font-bold text-sm text-slate-900 mb-3 leading-snug">Curious about today&apos;s news? Ask the AI Tutor how it connects to your lessons.</p>
            <Link href="/ai-tutor" className="inline-flex items-center justify-center gap-1.5 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors">
              <Brain className="w-3.5 h-3.5" /> Ask Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
