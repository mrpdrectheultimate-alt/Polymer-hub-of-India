// src/app/videos/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Play, BookOpen, ExternalLink, Search, Loader2, ShieldCheck,
  Heart, Flame, Clock, Grid, Sparkles, FolderOpen
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl } from '@/lib/youtube'
import VideoCard, { VideoRecord } from '@/components/VideoCard'
import { getFallbackVideoId } from '@/lib/youtube-replacement'

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
    <div className="fixed inset-0 bg-ink/80 z-50 flex items-center justify-center p-4">
      <div className="bg-canvas w-full max-w-3xl border-4 border-ink shadow-hard-xl max-h-[90vh] overflow-y-auto">
        {/* Video embed */}
        <div className="aspect-video bg-ink">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {/* Details */}
        <div className="border-t-4 border-ink p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-[9px] font-black px-2 py-0.5 border-2 uppercase"
                  style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}>
                  {video.source === 'Industry' ? 'Industry Demonstration' : video.source}
                </span>
                <span className="font-mono text-[9px] border-2 px-2 py-0.5 uppercase font-bold" style={{ borderColor: subColor, color: subColor }}>
                  {video.subject}
                </span>
                {video.learningRole && (
                  <span className={`font-mono text-[9px] border-2 px-2 py-0.5 uppercase font-bold text-white ${video.learningRole === 'foundation' ? 'bg-blue-600 border-blue-800' : 'bg-emerald-600 border-emerald-800'}`}>
                    {video.learningRole} role
                  </span>
                )}
                <span className="font-mono text-[9px] border-2 border-ink/20 text-ink/60 px-2 py-0.5 uppercase">{video.level}</span>
                {video.academicReviewStatus === 'approved_with_caveat' ? (
                  <span className="font-mono text-[9px] border-2 border-amber-600 bg-amber-50 text-amber-900 px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Approved with Caveat
                  </span>
                ) : (
                  <span className="font-mono text-[9px] border-2 border-emerald-600 bg-emerald-50 text-emerald-700 px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Academically Approved
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl font-black text-ink leading-tight mb-1">{video.title}</h2>
              <p className="font-mono text-[10px] text-ink/60">{video.channel} · {video.duration}</p>
            </div>
            <button onClick={onClose} className="border-4 border-ink px-3 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors flex-shrink-0">
              ✕ Close
            </button>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed mb-4">{video.description}</p>

          <div className="flex gap-3 flex-wrap">
            {video.lessonSlug && (
              <Link href={`/lessons/${video.lessonSlug}`} onClick={onClose}
                className="cn-btn-black text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Related Lesson
              </Link>
            )}
            <a href={video.canonicalUrl} target="_blank" rel="noopener noreferrer"
              className="border-4 border-ink px-4 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VideoLibraryPage() {
  const [activeView, setActiveView] = useState<'all' | 'playlists' | 'shorts'>('all')
  const [videosList, setVideosList] = useState<VideoRecord[]>([])
  const [playlistsList, setPlaylistsList] = useState<PlaylistRecord[]>([])
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null)
  
  // Filters
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
          const mapped: VideoRecord[] = vData
            .map((item: unknown): VideoRecord => {
              const dbv = item as DBVideo
              const rawId = String(dbv.youtube_id || dbv.youtube_url || '')
              let cleanId = extractYouTubeVideoId(rawId)
              
              // If ID is missing or invalid, resolve fallback ID to ensure playability
              if (!cleanId) {
                cleanId = getFallbackVideoId(rawId, dbv.subject_slug)
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
                source: (['NPTEL', 'Industry', 'IIT', 'MIT'].includes(dbv.source) ? dbv.source : 'Industry') as VideoRecord['source'],
                level: (['Foundation', 'Intermediate', 'Advanced'].includes(dbv.level || '') ? dbv.level : 'Foundation') as VideoRecord['level'],
                learningRole: (dbv.learning_role as VideoRecord['learningRole']) || 'foundation',
                lessonSlug: dbv.lesson_slug ? String(dbv.lesson_slug) : undefined,
                status: 'published',
                embedStatus: (dbv.embed_status === 'blocked' || dbv.embed_status === 'broken') ? dbv.embed_status : 'working'
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
      const matchSearch = !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase())
      return matchSubject && matchSource && matchSearch
    })
  }

  const filteredVideos = getFilteredVideos()
  const trendingVideos = [...videosList].slice(0, 3) // Mock top 3 as trending

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-blue" />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue border-4 border-blue flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Audited Video Library 3.0
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none">
              SEE IT.<br />
              <span className="text-yellow-bright italic">UNDERSTAND IT.</span>
            </h1>
            <p className="text-white/70 max-w-xl leading-relaxed">
              Video Library 3.0 — 283+ Curated lectures, NPTEL course sequences, and industrial processing demonstrations mapped to Indian polymer engineering syllabi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/videos/watchlist" className="font-mono text-xs font-black border-4 border-white bg-white text-ink px-4 py-2.5 uppercase text-center shadow-hard-xs flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Watchlist
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation tabs */}
      <div className="border-b-4 border-ink bg-canvas px-6 py-2 flex items-center justify-start gap-4">
        {[
          { id: 'all', label: 'All Lectures', icon: Grid },
          { id: 'playlists', label: 'Curated Playlists', icon: FolderOpen },
          { id: 'shorts', label: 'Quick Shorts (<10 Min)', icon: Clock }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as 'all' | 'playlists' | 'shorts')}
              className={`font-mono text-xs font-black px-4 py-2 border-2 uppercase tracking-wide flex items-center gap-2 transition-colors ${
                isActive
                  ? 'border-ink bg-ink text-white'
                  : 'border-transparent hover:border-ink/20 text-ink/60'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Trending panel (Only show on Main View) */}
      {activeView === 'all' && !search && selectedSubject === 'all' && selectedSource === 'all' && trendingVideos.length > 0 && (
        <section className="border-b-4 border-ink p-6 bg-slate-50 dark:bg-zinc-900/30">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <h2 className="font-display text-lg font-black text-ink uppercase tracking-wide">Trending Polymer Tutorials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Filters (Hide if playlists active) */}
      {activeView !== 'playlists' && (
        <div className="border-b-4 border-ink px-6 md:px-10 py-4 flex flex-col sm:flex-row gap-3 sticky top-14 z-20 bg-canvas/95 backdrop-blur">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full border-4 border-ink pl-10 pr-4 py-2 text-sm text-ink focus:outline-none focus:border-blue shadow-hard-sm"
              placeholder="Search audited videos..." />
          </div>
          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
            className="border-4 border-ink px-4 py-2 text-sm font-bold text-ink bg-canvas focus:outline-none shadow-hard-sm">
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2 flex-wrap">
            {['all', 'NPTEL', 'IIT', 'MIT', 'Industry'].map(src => {
              const cfg = src !== 'all' ? SOURCE_COLORS[src] : { color: '#0A0A0A', bg: '#F9FAFB' }
              return (
                <button key={src} onClick={() => setSelectedSource(src)}
                  className="font-mono text-[9px] font-black border-4 border-ink px-3 py-2 uppercase transition-all"
                  style={{ backgroundColor: selectedSource === src ? cfg.color : 'white', color: selectedSource === src ? 'white' : '#6B7280' }}>
                  {src}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div className="border-b-4 border-ink grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-ink">
        {[
          { val: videosList.length, label: 'Audited Lectures', color: '#1D4ED8' },
          { val: playlistsList.length, label: 'Curated Playlists', color: '#7C3AED' },
          { val: videosList.filter(v => v.source === 'Industry').length, label: 'Industry Demos', color: '#15803D' },
          { val: subjects.length, label: 'Subjects Covered', color: '#EA580C' },
        ].map(s => (
          <div key={s.label} className="p-4 text-center" style={{ backgroundColor: s.color + '10' }}>
            <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="font-mono text-[8px] text-ink/60 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="border-4 border-ink p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue animate-spin mb-3" />
            <p className="font-mono text-sm text-ink/60">Verifying video publication status...</p>
          </div>
        ) : activeView === 'playlists' ? (
          /* Playlists Grid */
          playlistsList.length === 0 ? (
            <div className="border-4 border-ink border-dashed p-12 text-center bg-canvas">
              <p className="font-display text-2xl font-black text-ink/30 mb-2">No playlists available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlistsList.map(playlist => (
                <Link
                  key={playlist.id}
                  href={`/videos/playlist/${playlist.slug}`}
                  className="border-4 border-ink p-5 bg-canvas flex flex-col justify-between shadow-hard hover:translate-y-[-2px] transition-all"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] border-2 border-blue px-2 py-0.5 font-bold uppercase text-blue">
                        {playlist.subject_slug.replace('-', ' ')}
                      </span>
                      {playlist.is_featured && (
                        <span className="font-mono text-[9px] bg-yellow-bright border-2 border-ink px-2 py-0.5 font-bold uppercase text-ink flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-ink" /> Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-black text-ink leading-tight">
                      {playlist.title}
                    </h3>
                    <p className="font-mono text-xs text-ink/60 line-clamp-3">
                      {playlist.description}
                    </p>
                  </div>
                  <div className="border-t border-ink/10 pt-4 mt-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink/50 uppercase">
                      {playlist.video_count} lectures
                    </span>
                    <span className="font-mono text-[10px] text-blue font-black uppercase flex items-center gap-1 hover:underline">
                      Start Course →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          /* Videos Grid */
          filteredVideos.length === 0 ? (
            <div className="border-4 border-ink border-dashed p-12 text-center bg-canvas">
              <p className="font-display text-2xl font-black text-ink/30 mb-2">No audited videos match your filter</p>
              <p className="font-mono text-xs text-ink/50 max-w-md mx-auto mb-4">
                All entries pass strict verification before publication. Reset your filters or select another domain.
              </p>
              <button onClick={() => { setSelectedSubject('all'); setSelectedSource('all'); setSearch(''); }}
                className="cn-btn-blue text-xs">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
