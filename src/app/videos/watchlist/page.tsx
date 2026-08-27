// src/app/videos/watchlist/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import VideoCard, { VideoRecord } from '@/components/VideoCard'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl } from '@/lib/youtube'
import { getFallbackVideoId } from '@/lib/youtube-replacement'

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
}

export default function WatchlistPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [watchlistVideos, setWatchlistVideos] = useState<VideoRecord[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [user, setUser] = useState<{ id: string } | null>(null)

  useEffect(() => {
    async function loadWatchlist() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          setLoading(false)
          return
        }
        setUser(session.user)

        // 1. Fetch watchlist items
        const { data: wlData, error: wlErr } = await supabase
          .from('video_watchlist')
          .select('video_id, videos(*)')
          .eq('user_id', session.user.id)

        if (wlErr) throw wlErr

        // 2. Fetch watch progress
        const { data: progData } = await supabase
          .from('video_watch_progress')
          .select('video_id, progress_seconds, completed')
          .eq('user_id', session.user.id)

        const pm: Record<string, number> = {}
        if (progData) {
          progData.forEach((p: WatchProgress) => {
            pm[p.video_id] = p.completed ? 100 : Math.min(Math.round((p.progress_seconds / 600) * 100), 99)
          })
          setProgressMap(pm)
        }

        const mapped: VideoRecord[] = (wlData ?? [])
          .map(item => {
            const v = item.videos as unknown as DBVideo
            if (!v) return null
            
            const isBroken = ['invalid', 'private', 'restricted', 'removed', 'broken'].includes(v.embed_status || '')
            const rawYtId = v.youtube_id || extractYouTubeVideoId(v.youtube_url || '') || ''
            const resolvedYtId = getFallbackVideoId(rawYtId, v.subject_slug, isBroken)

            const cleanTitle = (v.display_title || v.title || '')
              .replace(/â€”/g, '—')
              .replace(/â€“/g, '–')
              .replace(/â€™/g, "'")
              .replace(/â€œ/g, '"')
              .replace(/â€ /g, '"')
              .replace(/Ã—/g, '×')
              .replace(/Â/g, '')
              .trim()

            return {
              id: v.id,
              title: cleanTitle,
              youtubeId: resolvedYtId,
              canonicalUrl: v.canonical_url || getYouTubeCanonicalUrl(resolvedYtId),
              channel: v.channel || 'NPTEL / Industry',
              duration: v.duration || '15:00',
              description: (v.description || '').replace(/â€”/g, '—').replace(/â€“/g, '–'),
              level: (['Foundation', 'Intermediate', 'Advanced'].includes(v.level || '') ? v.level : 'Foundation') as VideoRecord['level'],
              subject: v.subject_name || 'Polymer Engineering',
              subjectSlug: v.subject_slug || 'polymer-chemistry',
              source: (['NPTEL', 'Industry', 'IIT', 'MIT'].includes(v.source) ? v.source : 'Industry') as VideoRecord['source'],
              status: (v.status || 'published') as VideoRecord['status'],
              embedStatus: (v.embed_status === 'blocked') ? 'blocked' : (isBroken ? 'broken' : 'working')
            }
          })
          .filter((v): v is VideoRecord => v !== null)

        setWatchlistVideos(mapped)
      } catch (err) {
        console.error('Error loading watchlist page:', err)
      } finally {
        setLoading(false)
      }
    }

    loadWatchlist()
  }, [supabase])

  function handleWatchlistChange(videoId: string, inWatchlist: boolean) {
    if (!inWatchlist) {
      setWatchlistVideos(prev => prev.filter(v => v.id !== videoId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue animate-spin mb-4" />
        <p className="font-mono text-sm text-ink/60">Loading your saved watchlist...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-canvas p-8 flex flex-col items-center justify-center text-center">
        <Heart className="w-12 h-12 text-ink/30 mb-4" />
        <h2 className="font-display text-2xl font-black text-ink mb-2">Sign in to view your watchlist</h2>
        <p className="font-mono text-xs text-ink/50 max-w-sm mb-6">
          Your saved videos, watch progress, and custom play queues are synced across devices.
        </p>
        <Link href="/login" className="cn-btn-blue text-xs">
          Sign In Now
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-blue" />
      
      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link href="/videos" className="border-2 border-white/20 p-1.5 hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4 text-white" />
              </Link>
              <span className="font-mono text-[9px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">
                My watch queue
              </span>
            </div>
            <h1 className="font-display text-3xl font-black text-white leading-none mb-2">
              ❤️ MY SAVED WATCHLIST
            </h1>
            <p className="text-white/60 font-mono text-xs">
              Manage your saved polymer science lectures and processing tutorials.
            </p>
          </div>
          <span className="font-mono text-[10px] bg-white text-ink border-4 border-white font-black px-4 py-2 uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            {watchlistVideos.length} saved lectures
          </span>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {watchlistVideos.length === 0 ? (
          <div className="border-4 border-ink border-dashed p-12 text-center bg-canvas max-w-2xl mx-auto mt-6">
            <Heart className="w-12 h-12 text-ink/20 mx-auto mb-4" />
            <p className="font-display text-xl font-black text-ink/75 mb-2">Your watchlist is empty</p>
            <p className="font-mono text-xs text-ink/50 max-w-md mx-auto mb-6">
              When browsing our 1000+ audited videos, click the heart icon on any card to save it here for offline revision or later study sessions.
            </p>
            <Link href="/videos" className="cn-btn-blue text-xs">
              Browse Videos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                isSaved={true}
                watchedPercent={progressMap[video.id] ?? 0}
                onWatchlistChange={handleWatchlistChange}
                onClick={() => {}} // modal view handled in playlist or lists
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
