// src/app/videos/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Play, BookOpen, ExternalLink, Search, Loader2,
  Heart, Flame, Clock, Grid, Sparkles, FolderOpen, Calculator,
  Compass, Brain, LayoutGrid, List
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl } from '@/lib/youtube'
import VideoCard, { VideoRecord } from '@/components/VideoCard'
import { getFallbackVideoId } from '@/lib/youtube-replacement'
import { screencasts, ScreencastItem } from '@/lib/screencasts'
import { ScreencastPlayer } from '@/components/ScreencastPlayer'
import { VideoPlayer } from '@/components/video/VideoPlayer'

type PlaylistRecord = {
  id: string
  title: string
  description: string
  slug: string
  subject_slug: string
  video_count: number
  is_featured: boolean
}

type WatchProgress = {
  video_id: string
  progress_seconds: number
  completed: boolean
}

interface DBVideo {
  id: string
  title: string
  display_title?: string
  youtube_id?: string
  youtube_url?: string
  canonical_url?: string
  channel?: string
  duration?: string
  description?: string
  level?: string
  subject_name?: string
  subject_slug?: string
  source: string
  status?: string
  embed_status?: string
  learning_role?: 'foundation' | 'applied' | 'case_study' | 'future_research'
  lesson_slug?: string
}

const SOURCE_COLORS: Record<string, { color: string; bg: string }> = {
  NPTEL:    { color: '#1D4ED8', bg: '#EFF6FF' },
  IIT:      { color: '#7C3AED', bg: '#F5F3FF' },
  MIT:      { color: '#EA580C', bg: '#FFF7ED' },
  Industry: { color: '#15803D', bg: '#F0FDF4' },
}

const SUBJECT_COLORS: Record<string, string> = {
  'polymer-chemistry': '#1D4ED8',
  'polymer-processing': '#EA580C',
  'mould-design': '#EA580C',
  'polymer-testing': '#7C3AED',
  'polymer-rheology': '#2563EB',
  'polymer-composites': '#0284C7',
  'additives-compounding': '#D97706',
  'rubber-technology': '#DC2626',
  'medical-plastics-biomaterials': '#059669',
  'recycling-technology': '#16A34A',
  'sustainable-plastics-bioplastics': '#15803D',
  'plastic-packaging-engineering': '#9333EA',
  'life-cycle-assessment': '#4F46E5',
  'entrepreneurship-in-plastics': '#CA8A04',
  'color-science-masterbatches': '#DB2777'
}

function VideoModal({ video, onClose }: { video: VideoRecord; onClose: () => void }) {
  const src = SOURCE_COLORS[video.source] || SOURCE_COLORS.Industry
  const subColor = SUBJECT_COLORS[video.subjectSlug] ?? '#1D4ED8'

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl border-2 border-slate-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto overflow-hidden">
        {/* Upgraded Multi-Source Cascade Video Player */}
        <VideoPlayer
          video={{
            id: video.id,
            title: video.title,
            youtubeId: video.youtubeId,
            channel: video.channel,
            duration: video.duration,
            level: video.level,
            subjectSlug: video.subjectSlug,
            lessonSlug: video.lessonSlug
          }}
          autoplay={true}
        />
        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border"
                  style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}
                >
                  {video.source === 'Industry' ? 'Industry Demonstration' : video.source}
                </span>
                <span
                  className="font-mono text-[9px] border px-2.5 py-0.5 rounded-full uppercase font-bold"
                  style={{ borderColor: subColor, color: subColor }}
                >
                  {video.subject}
                </span>
                {video.learningRole && (
                  <span className={`font-mono text-[9px] px-2.5 py-0.5 rounded-full uppercase font-bold text-white ${video.learningRole === 'foundation' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                    {video.learningRole}
                  </span>
                )}
                <span className="font-mono text-[9px] border border-slate-300 text-slate-600 px-2 py-0.5 rounded-full uppercase font-medium">
                  {video.level}
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {video.title}
              </h2>
              <p className="font-mono text-xs text-slate-400 font-medium">
                {video.channel} &middot; {video.duration}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border-2 border-slate-900 font-mono text-xs font-bold hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {video.description}
          </p>

          <div className="flex gap-3 flex-wrap pt-2 border-t border-slate-100">
            {video.lessonSlug && (
              <Link
                href={`/lessons/${video.lessonSlug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold hover:bg-slate-800 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" /> Read Related Lesson
              </Link>
            )}
            <a
              href={video.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-mono font-bold text-slate-900 hover:bg-slate-50 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const CATEGORIES = [
  { id: 'all', label: 'All Videos', icon: '🎬' },
  { id: 'nptel', label: 'NPTEL / IIT Courses', icon: '🎓' },
  { id: 'industry', label: 'Industry & Processing', icon: '🏭' },
  { id: 'lab', label: 'Lab & Polymer Testing', icon: '🔬' },
  { id: 'troubleshooting', label: 'Defect Diagnostics', icon: '🔧' },
  { id: 'career', label: 'Career & Entrepreneurship', icon: '📈' },
  { id: 'sustainability', label: 'Recycling & Bio-Plastics', icon: '♻️' },
  { id: 'research', label: 'Nanotech & Research', icon: '🚀' },
]

function classifyCategory(title: string, channel: string): string {
  const t = title.toLowerCase()
  const c = channel.toLowerCase()
  if (c.includes('nptel') || c.includes('iit') || t.includes('iit') || t.includes('nptel') || c.includes('mit') || t.includes('mit')) {
    return 'nptel'
  }
  if (t.includes('recycle') || t.includes('bioplastic') || t.includes('circular economy') || t.includes('sustainable') || t.includes('epr') || t.includes('green') || c.includes('ellen macarthur')) {
    return 'sustainability'
  }
  if (t.includes('career') || t.includes('startup') || t.includes('business') || t.includes('cipet') || c.includes('cipet') || t.includes('entrepreneurship')) {
    return 'career'
  }
  if (t.includes('test') || t.includes('dsc') || t.includes('mfi') || t.includes('tga') || t.includes('izod') || t.includes('charpy') || c.includes('instron') || c.includes('ta instruments')) {
    return 'lab'
  }
  if (t.includes('defect') || t.includes('trouble') || t.includes('sink mark') || t.includes('weld line') || t.includes('solve')) {
    return 'troubleshooting'
  }
  if (t.includes('process') || t.includes('molding') || t.includes('extrusion') || t.includes('forming') || c.includes('paulson') || c.includes('routsis') || c.includes('coperion')) {
    return 'industry'
  }
  if (t.includes('research') || t.includes('graphene') || t.includes('nano') || t.includes('smart polymer')) {
    return 'research'
  }
  return 'industry'
}

type VideoRecordWithCategory = VideoRecord & {
  category: string
}

export default function VideoLibraryPage() {
  const [activeView, setActiveView] = useState<'all' | 'screencasts' | 'playlists' | 'shorts'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [videosList, setVideosList] = useState<VideoRecordWithCategory[]>([])
  const [playlistsList, setPlaylistsList] = useState<PlaylistRecord[]>([])
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null)
  const [activeScreencast, setActiveScreencast] = useState<ScreencastItem | null>(null)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [search, setSearch] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    async function loadLibraryData() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        // 1. Fetch user data (watchlist + progress)
        if (session?.user) {
          const [{ data: wlData }, { data: progData }] = await Promise.all([
            supabase.from('video_watchlist').select('video_id').eq('user_id', session.user.id),
            supabase.from('video_watch_progress').select('video_id, progress_seconds, completed').eq('user_id', session.user.id)
          ])

          if (wlData) setWatchlist(wlData.map(w => w.video_id))
          
          const pm: Record<string, number> = {}
          if (progData) {
            progData.forEach((p: WatchProgress) => {
              pm[p.video_id] = p.completed ? 100 : Math.min(Math.round((p.progress_seconds / 600) * 100), 99)
            })
            setProgressMap(pm)
          }
        }

        // 2. Fetch playlists
        const { data: plData } = await supabase
          .from('playlists')
          .select('*')
          .order('is_featured', { ascending: false })
        if (plData) setPlaylistsList(plData)

        // 3. Fetch all videos
        const { data: vData, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (vData) {
          const mapped: VideoRecordWithCategory[] = vData
            .map((item: unknown): VideoRecordWithCategory => {
              const dbv = item as DBVideo
              const rawId = String(dbv.youtube_id || dbv.youtube_url || '')
              let cleanId = extractYouTubeVideoId(rawId)
              const isBroken = ['invalid', 'private', 'restricted', 'removed', 'broken'].includes(dbv.embed_status || '')
              
              if (!cleanId || isBroken) {
                cleanId = getFallbackVideoId(cleanId || rawId, dbv.subject_slug, isBroken)
              }

              const channelName = String(dbv.channel || '').toLowerCase()
              const titleStr = String(dbv.title || '').toLowerCase()

              let resolvedSource: VideoRecord['source'] = 'Industry'
              if (channelName.includes('nptel') || titleStr.includes('nptel')) {
                resolvedSource = 'NPTEL'
              } else if (channelName.includes('iit') || titleStr.includes('iit')) {
                resolvedSource = 'IIT'
              } else if (channelName.includes('mit') || titleStr.includes('mit')) {
                resolvedSource = 'MIT'
              } else if (['NPTEL', 'Industry', 'IIT', 'MIT'].includes(dbv.source)) {
                resolvedSource = dbv.source as VideoRecord['source']
              }

              return {
                id: String(dbv.id),
                title: String(dbv.display_title || dbv.title || 'Polymer Engineering Video'),
                channel: String(dbv.channel || 'NPTEL / Industry'),
                duration: String(dbv.duration || '15:00'),
                subject: String(dbv.subject_name || 'Polymer Engineering'),
                subjectSlug: String(dbv.subject_slug || 'polymer-chemistry'),
                youtubeId: cleanId,
                canonicalUrl: String(dbv.canonical_url || getYouTubeCanonicalUrl(cleanId)),
                description: String(dbv.description || ''),
                source: resolvedSource,
                level: (['Foundation', 'Intermediate', 'Advanced'].includes(dbv.level || '') ? dbv.level : 'Foundation') as VideoRecord['level'],
                learningRole: (dbv.learning_role as VideoRecord['learningRole']) || 'foundation',
                lessonSlug: dbv.lesson_slug ? String(dbv.lesson_slug) : undefined,
                status: 'published',
                embedStatus: (dbv.embed_status === 'blocked') ? 'blocked' : (['invalid', 'private', 'restricted', 'removed', 'broken'].includes(dbv.embed_status || '') ? 'broken' : 'working'),
                category: classifyCategory(dbv.title || '', dbv.channel || '')
              }
            })

          setVideosList(mapped)
        }
      } catch (err) {
        console.error('Error loading videos library:', err)
      } finally {
        setLoading(false)
      }
    }

    loadLibraryData()
  }, [supabase])

  const subjects = Array.from(new Set(videosList.map(v => v.subject)))

  // Filter lists based on active tab selection
  const getFilteredVideos = () => {
    let base = videosList
    if (activeView === 'shorts') {
      base = videosList.filter(v => {
        const mins = parseInt(v.duration.split(':')[0]) || 0
        return mins < 10
      })
    }

    return base.filter(v => {
      const matchSubject = selectedSubject === 'all' || v.subject === selectedSubject
      const matchSource = selectedSource === 'all' || v.source === selectedSource
      const matchCategory = selectedCategory === 'all' || v.category === selectedCategory
      const matchSearch = !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase())
      return matchSubject && matchSource && matchCategory && matchSearch
    })
  }

  const filteredVideos = getFilteredVideos()
  const trendingVideos = [...videosList].slice(0, 3)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Video Library 3.0 &middot; Audited NPTEL &middot; IITs &middot; Industry Demos
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Learn From <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              357+ Curated Video Lectures
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Full-semester NPTEL university sequences, industrial factory extrusion lines, and companion calculation engines mapped directly to your curriculum.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">357+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Audited Lectures</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">{screencasts.length}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Companion Solvers</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">{playlistsList.length || 42}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Curated Playlists</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">19</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Subjects Covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIEW TABS BAR ── */}
      <section className="bg-white border-b-2 border-slate-900 px-4 sm:px-8 py-3 sticky top-14 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'all', label: 'All Lectures', icon: Grid },
              { id: 'screencasts', label: '🎓 Interactive Solvers', icon: Calculator },
              { id: 'playlists', label: 'Curated Courses', icon: FolderOpen },
              { id: 'shorts', label: 'Shorts (<10 min)', icon: Clock }
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeView === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as 'all' | 'screencasts' | 'playlists' | 'shorts')}
                  className={`font-mono text-xs font-bold px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 flex-shrink-0 ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/videos/watchlist"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 font-mono text-xs font-bold text-slate-900 transition-all shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Watchlist ({watchlist.length})
            </Link>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 border border-slate-300 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & CATEGORY FILTER TOOLBAR ── */}
      {activeView !== 'playlists' && activeView !== 'screencasts' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 font-mono text-xs font-bold px-3.5 py-1.5 rounded-xl border-2 transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Search + Subject + Source Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-all"
                  placeholder="Search 357+ videos by topic, equation, or speaker..."
                />
              </div>

              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none"
              >
                <option value="all">All 19 Subjects</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <div className="flex gap-1.5 flex-wrap">
                {['all', 'NPTEL', 'IIT', 'MIT', 'Industry'].map(src => {
                  const isActive = selectedSource === src
                  return (
                    <button
                      key={src}
                      onClick={() => setSelectedSource(src)}
                      className={`font-mono text-[11px] font-bold border-2 rounded-xl px-3 py-2 uppercase transition-all ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {src}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── TRENDING PANEL (Only on main view without active query) ── */}
      {activeView === 'all' && !search && selectedSubject === 'all' && selectedCategory === 'all' && trendingVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border-2 border-slate-900 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">
                🔥 Trending Polymer Masterclasses
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {trendingVideos.map(video => (
                <VideoCard
                  key={`trending-${video.id}`}
                  video={video}
                  isSaved={watchlist.includes(video.id)}
                  watchedPercent={progressMap[video.id] ?? 0}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT DISPLAY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="border-2 border-slate-900 bg-white rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-3 shadow-md">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Auditing 357+ Video Embed Statuses...
            </p>
          </div>
        ) : activeView === 'screencasts' ? (
          /* Screencasts & Companion Solvers */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white border-2 border-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase bg-white/20 text-white px-3 py-1 rounded-full">
                  LearnChemE Interactive Companion
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight">
                  🎓 Interactive Screencasts &amp; Problem Solvers
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-light">
                  5–15 minute video walkthroughs paired with live calculation engines. Tweak polymer parameters in real time to master the math.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {screencasts.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setActiveScreencast(sc)}
                  className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group select-none"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
                        {sc.subject}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {sc.duration}
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {sc.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {sc.description}
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="text-[9px] font-mono font-bold uppercase text-slate-400">Core Equation</div>
                      <div className="font-mono text-xs font-bold text-blue-700 truncate">{sc.formula}</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700 flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5" /> Companion Solver
                    </span>
                    <span className="font-mono text-xs font-bold uppercase text-slate-950 bg-[#F5C518] hover:bg-amber-400 px-3 py-1.5 rounded-lg border border-slate-900 shadow-sm transition-all">
                      Open Solver &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeView === 'playlists' ? (
          /* Curated Courses & Playlists Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlistsList.map(playlist => (
              <Link
                key={playlist.id}
                href={`/videos/playlist/${playlist.slug}`}
                className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      {playlist.subject_slug.replace('-', ' ')}
                    </span>
                    {playlist.is_featured && (
                      <span className="font-mono text-[10px] bg-[#F5C518] border border-slate-900 px-2.5 py-0.5 rounded-full font-bold text-slate-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-slate-900" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {playlist.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">
                    {playlist.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400 font-bold uppercase">
                    {playlist.video_count} lectures
                  </span>
                  <span className="font-mono text-xs text-blue-600 font-bold uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Start Course &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* All Audited Videos Grid */
          filteredVideos.length === 0 ? (
            <div className="border-2 border-slate-900 bg-white rounded-2xl p-16 text-center shadow-sm space-y-4">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-display text-xl font-bold text-slate-900">No videos match your filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try resetting your search term or select another category from the toolbar above.
              </p>
              <button
                onClick={() => { setSelectedSubject('all'); setSelectedSource('all'); setSelectedCategory('all'); setSearch(''); }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold uppercase hover:bg-blue-700 transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isSaved={watchlist.includes(video.id)}
                  watchedPercent={progressMap[video.id] ?? 0}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* ── BOTTOM AI TUTOR CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Video Assistant &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Confused by an equation in a video? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Tutor.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Ask for step-by-step derivations, industrial significance, or GATE practice problems grounded in all 216 syllabus lessons.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Explain%20the%20mathematical%20derivation%20of%20the%20Carothers%20Equation%20from%20the%20polymer%20chemistry%20video%20lecture"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask AI Specialist &rarr;
            </Link>

            <Link
              href="/subjects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Explore 19 Subjects
            </Link>
          </div>
        </div>
      </section>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      {activeScreencast && <ScreencastPlayer screencast={activeScreencast} onClose={() => setActiveScreencast(null)} />}
    </div>
  )
}
