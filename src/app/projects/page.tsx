'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Plus, ArrowRight, User } from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string
  category: 'research' | 'design' | 'processing' | 'recycling' | 'product'
  image_url: string | null
  github_url: string | null
  team_members: string[] | null
  guide_name: string | null
  guide_org: string | null
  tags: string[] | null
  upvotes: number
  views: number
  created_at: string
  profiles?: {
    id: string
    full_name: string | null
    email: string
  } | null
}

const CATEGORIES = [
  { value: 'all', label: 'All Projects', icon: '🌍' },
  { value: 'research', label: '🔬 Research', icon: '🔬' },
  { value: 'design', label: '🎨 Mold Design', icon: '🎨' },
  { value: 'processing', label: '🏭 Processing', icon: '🏭' },
  { value: 'recycling', label: '♻️ Recycling', icon: '♻️' },
  { value: 'product', label: '📦 Product Dev', icon: '📦' }
]

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'research': { bg: '#EFF6FF', text: '#1D4ED8', border: '#1D4ED8' },
  'design': { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
  'processing': { bg: '#F5F3FF', text: '#7C3AED', border: '#7C3AED' },
  'recycling': { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
  'product': { bg: '#FFF1F2', text: '#E11D48', border: '#E11D48' }
}

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchProjects = async (category: string) => {
    setLoading(true)
    try {
      const url = category === 'all' ? '/api/projects' : `/api/projects?category=${category}`
      const res = await fetch(url)
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects(selectedCategory)
  }, [selectedCategory])

  const filtered = projects.filter(p => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      (p.tags || []).some(t => t.toLowerCase().includes(query)) ||
      (p.profiles?.full_name || '').toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-canvas pb-16">
      {/* Hero Header */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                PORTFOLIOS
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                PROJECTS HUB
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              STUDENT PROJECTS<br />
              <span className="italic">& RESEARCH CASES</span>
            </h1>
          </div>
          <div>
            <Link
              href="/projects/new"
              className="border-4 border-ink bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display text-xs font-black uppercase px-6 py-3.5 shadow-hard flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
            >
              <Plus className="w-4 h-4" /> Submit Your Project
            </Link>
          </div>
        </div>
      </section>

      {/* Toolbar Search & Filter */}
      <div className="sticky top-16 z-30 bg-canvas/95 backdrop-blur border-b-4 border-ink py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project titles, descriptions, tags, authors..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border-2 border-ink placeholder:text-ink/40 font-bold focus:outline-none"
            />
          </div>

          {/* Categories select fallback for mobile */}
          <div className="sm:hidden w-full">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 border-2 border-ink text-xs font-bold text-ink focus:outline-none bg-white px-3"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Pills (Desktop) */}
        <div className="hidden sm:flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`font-mono text-[9px] font-black px-4 py-2 border-2 border-ink uppercase tracking-wider transition-all ${
                selectedCategory === cat.value
                  ? 'bg-yellow-bright text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-ink/60 hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mb-4">
          Showing {filtered.length} of {projects.length} project submissions
        </p>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-4 border-ink p-5 bg-white shadow-hard animate-pulse space-y-4">
                <div className="h-28 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Project Grid */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="border-4 border-ink p-12 text-center shadow-hard bg-white">
                <BookOpen className="w-10 h-10 mx-auto mb-4 text-ink/40" />
                <div className="font-display text-2xl font-black text-ink mb-2">No projects found</div>
                <p className="text-ink/60 max-w-sm mx-auto font-mono text-xs">
                  Be the first to submit a case study or research portfolio in this category!
                </p>
                <Link
                  href="/projects/new"
                  className="mt-4 inline-flex border-2 border-ink bg-yellow-bright px-4 py-2 font-mono text-[10px] font-black uppercase shadow-hard-xs hover:bg-ink hover:text-white transition-colors"
                >
                  Submit Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project) => {
                  const cc = CATEGORY_COLORS[project.category] || { bg: '#F8FAFC', text: '#000', border: '#000' }
                  return (
                    <div
                      key={project.id}
                      className="bg-white border-4 border-ink shadow-hard flex flex-col justify-between hover:-translate-y-1 transition-transform"
                    >
                      <div>
                        {/* Project Card Image or fallback */}
                        {project.image_url ? (
                          <div className="border-b-4 border-ink h-40 overflow-hidden relative bg-slate-100">
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="border-b-4 border-ink h-40 bg-slate-100 flex items-center justify-center">
                            <span className="text-4xl">{CATEGORIES.find(c => c.value === project.category)?.icon || '📚'}</span>
                          </div>
                        )}

                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className="text-[8px] font-mono font-black border px-2 py-0.5 uppercase tracking-wider"
                              style={{ backgroundColor: cc.bg, color: cc.text, borderColor: cc.border }}
                            >
                              {project.category}
                            </span>
                            <span className="font-mono text-[9px] text-slate-500 uppercase">
                              ⭐ {project.upvotes} Upvotes
                            </span>
                          </div>

                          <h3 className="font-display font-black text-ink text-base uppercase leading-tight line-clamp-1">
                            {project.title}
                          </h3>
                          
                          <p className="text-[11px] text-ink/70 font-sans font-semibold leading-relaxed line-clamp-3">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {(project.tags || []).slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[8px] font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 uppercase">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="border-t-2 border-ink p-4 bg-slate-50 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-ink/60">
                        <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                          <User className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                          <span className="truncate font-black">{project.profiles?.full_name || 'Anonymous Engineer'}</span>
                        </div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0"
                        >
                          View case <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
