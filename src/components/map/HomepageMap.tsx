'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  BookOpen, 
  Wrench, 
  MessageCircle, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Flame, 
  Calculator, 
  Layers, 
  Compass, 
  Brain,
  MapPin,
  ExternalLink
} from 'lucide-react'
import { HOMEPAGE_MAP_CARDS } from '@/lib/map/map-data'
import { searchPlatformMap, MapSearchResult } from '@/lib/map/map-utils'

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
  Wrench,
  MessageCircle,
  Calculator,
  Brain,
  Compass
}

export default function HomepageMap() {
  const [searchQuery, setSearchQuery] = useState('')
  const searchResults = searchPlatformMap(searchQuery)

  return (
    <section id="platform-map" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#040A17] border-y border-slate-800 relative overflow-hidden">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            PolymerHub GPS & Student Orientation Map
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Where Would You Like to Start Today?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            PolymerHub connects 19 subjects, 216 curriculum lessons, 280+ formulas, 12 live solvers, and 50 textbooks into one structured engineering learning platform. Choose your objective below:
          </p>
        </div>

        {/* Live Sitemap Search Escape Hatch Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search any topic, formula, tool, or subject (e.g., clamping tonnage, Carothers, rPET)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#081225] border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-xl transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown */}
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#081225] border border-slate-700 rounded-xl p-3 shadow-2xl z-50 space-y-2 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((res, idx) => (
                  <Link
                    key={idx}
                    href={res.link}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#040A17] hover:bg-slate-800/80 text-xs transition group"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-amber-400 block mb-0.5">
                        {res.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">{res.description}</span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      {res.category}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching platform routes found for &quot;{searchQuery}&quot;. Try &quot;formulas&quot;, &quot;calculators&quot;, or &quot;subjects&quot;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4-Pillar Interactive Core Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HOMEPAGE_MAP_CARDS.map((card) => {
            const IconComponent = ICON_MAP[card.icon] || BookOpen

            return (
              <div
                key={card.id}
                className="bg-[#081225] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between transition group relative overflow-hidden"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner"
                      style={{
                        backgroundColor: card.bgColor,
                        borderColor: card.borderColor,
                        color: card.color
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                      {card.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-amber-400 transition">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* Secondary Quick Access Links */}
                  <div className="space-y-2 mb-8">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Quick Platform Routes:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {card.secondaryLinks.map((sec, idx) => (
                        <Link
                          key={idx}
                          href={sec.link}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#040A17] hover:bg-slate-800/80 border border-slate-800 text-slate-200 hover:text-white transition font-medium"
                        >
                          <span className="truncate pr-2">{sec.label}</span>
                          {sec.badge && (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60 flex-shrink-0">
                              {sec.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Card CTA */}
                <Link
                  href={card.primaryCta.link}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition shadow-lg"
                >
                  <span>{card.primaryCta.label}</span>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Bottom Platform Map Bar & Link to Full Map */}
        <div className="bg-[#081225] border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Need a Complete 19-Subject & GATE XE-F Section Map?
            </h4>
            <p className="text-xs text-slate-300">
              Explore the full interactive sitemap directory, 7-day beginner onboarding guide, and GATE 9-section matrix.
            </p>
          </div>

          <Link
            href="/start"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl border border-slate-700 transition flex-shrink-0"
          >
            <span>Open Full Interactive Map (/start)</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </section>
  )
}
