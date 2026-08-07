// src/app/videos/playlist/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, ExternalLink,
  ArrowLeft, Loader2, Heart, CheckCircle2
} from 'lucide-react'
import { VideoRecord } from '@/components/VideoCard'
import { createClient } from '@/lib/supabase/client'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl } from '@/lib/youtube'
import { toast } from '@/hooks/use-toast'
import { getFallbackVideoId } from '@/lib/youtube-replacement'

type PlaylistRecord = {
  id: string
  title: string
  description: string
  slug: string
  subject_slug: string
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
  series_name?: string
  series_order?: number
  embed_status?: string
  source?: string
  status?: string
}

export default function PlaylistPlayerPage() {
  const params = useParams()
  const slug = params.slug as string

  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [playlist, setPlaylist] = useState<PlaylistRecord | null>(null)
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [progress, setProgress] = useState<Record<string, { seconds: number; completed: boolean }>>({})
  const [user, setUser] = useState<{ id: string } | null>(null)

  useEffect(() => {
    async function loadPlaylistData() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          // Load watchlist
          const { data: wlData } = await supabase
            .from('video_watchlist')
            .select('video_id')
            .eq('user_id', session.user.id)
          if (wlData) setWatchlist(wlData.map(w => w.video_id))

          // Load progress
          const { data: progData } = await supabase
            .from('video_watch_progress')
            .select('video_id, progress_seconds, completed')
            .eq('user_id', session.user.id)
          if (progData) {
            const progMap: Record<string, { seconds: number; completed: boolean }> = {}
            progData.forEach(p => {
              progMap[p.video_id] = { seconds: p.progress_seconds, completed: p.completed }
            })
            setProgress(progMap)
          }
        }

        // Fetch playlist details
        const { data: plData, error: plErr } = await supabase
          .from('playlists')
          .select('*')
          .eq('slug', slug)
          .single()

        if (plErr) throw plErr
        setPlaylist(plData)

        // Fetch playlist videos
        const { data: plvData, error: plvErr } = await supabase
          .from('playlist_videos')
          .select('video_id, order_index, videos(*)')
          .eq('playlist_id', plData.id)
          .order('order_index', { ascending: true })

        if (plvErr) throw plvErr

        const mappedVideos = (plvData ?? [])
          .map(item => {
            const v = item.videos as unknown as DBVideo
            if (!v) return null
            const isBroken = ['invalid', 'private', 'restricted', 'removed', 'broken'].includes(v.embed_status || '')
            const resolvedYtId = getFallbackVideoId(
              v.youtube_id || extractYouTubeVideoId(v.youtube_url || ''),
              v.subject_slug,
              isBroken
            )
             const rec: VideoRecord = {
              id: v.id,
              title: v.display_title || v.title,
              youtubeId: resolvedYtId,
              canonicalUrl: v.canonical_url || getYouTubeCanonicalUrl(resolvedYtId),
              channel: v.channel || 'NPTEL / Industry',
              duration: v.duration || '15:00',
              description: v.description || '',
              level: (['Foundation', 'Intermediate', 'Advanced'].includes(v.level || '') ? v.level : 'Foundation') as VideoRecord['level'],
              subject: v.subject_name || 'Polymer Engineering',
              subjectSlug: v.subject_slug || 'polymer-chemistry',
              source: (['NPTEL', 'Industry', 'IIT', 'MIT'].includes(v.source || '') ? v.source : 'Industry') as VideoRecord['source'],
              status: (v.status || 'published') as VideoRecord['status'],
              embedStatus: (v.embed_status === 'blocked') ? 'blocked' : (['invalid', 'private', 'restricted', 'removed', 'broken'].includes(v.embed_status || '') ? 'broken' : 'working')
            }
            return rec
          })
          .filter((v): v is VideoRecord => v !== null)

        setVideos(mappedVideos)
      } catch (err) {
        console.error('Error loading playlist page:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) loadPlaylistData()
  }, [slug, supabase])

  // Watchlist toggle handler
  async function toggleWatchlist(videoId: string) {
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to save videos to your watchlist.',
        variant: 'destructive'
      })
      return
    }

    const inWatchlist = watchlist.includes(videoId)
    try {
      if (inWatchlist) {
        const { error } = await supabase
          .from('video_watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId)
        if (error) throw error
        setWatchlist(prev => prev.filter(id => id !== videoId))
        toast({ title: 'Removed', description: 'Video removed from your watchlist.' })
      } else {
        const { error } = await supabase
          .from('video_watchlist')
          .insert({ user_id: user.id, video_id: videoId })
        if (error) throw error
        setWatchlist(prev => [...prev, videoId])
        toast({ title: 'Added', description: 'Video saved to your watchlist.' })
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err)
    }
  }

  // Handle marking a video completed
  async function markVideoCompleted(videoId: string) {
    if (!user) return
    try {
      const isCompleted = progress[videoId]?.completed
      if (isCompleted) return // already completed

      const { error } = await supabase
        .from('video_watch_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          progress_seconds: 600, // mock duration seconds
          completed: true,
          last_watched_at: new Date().toISOString()
        }, { onConflict: 'user_id,video_id' })

      if (error) throw error

      setProgress(prev => ({
        ...prev,
        [videoId]: { seconds: 600, completed: true }
      }))

      // Non-blocking award XP
      fetch('/api/xp/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lesson_complete', referenceId: videoId })
      }).catch(console.error)

      toast({
        title: '🎉 +15 XP Awarded!',
        description: 'You completed this polymer lecture video!'
      })
    } catch (err) {
      console.error('Error marking video complete:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue animate-spin mb-4" />
        <p className="font-mono text-sm text-ink/60">Loading playlist player...</p>
      </div>
    )
  }

  if (!playlist || videos.length === 0) {
    return (
      <div className="min-h-screen bg-canvas p-8 flex flex-col items-center justify-center text-center">
        <h2 className="font-display text-2xl font-black text-ink mb-2">Playlist not found</h2>
        <p className="font-mono text-xs text-ink/60 mb-6">This playlist may have been retired or holds no audited videos.</p>
        <Link href="/videos" className="cn-btn-blue text-xs flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Video Library
        </Link>
      </div>
    )
  }

  const activeVideo = videos[activeIdx]

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <div className="h-2 bg-blue" />
      
      {/* Navigation / Header */}
      <div className="border-b-4 border-ink bg-canvas px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/videos" className="border-2 border-ink p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 text-ink" />
          </Link>
          <div>
            <span className="font-mono text-[9px] text-blue font-bold uppercase tracking-widest">Playlist Mode</span>
            <h1 className="font-display text-lg font-black text-ink leading-tight">{playlist.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] bg-blue/10 border border-blue text-blue px-2 py-1 font-bold">
            {activeIdx + 1} of {videos.length} videos
          </span>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-ink">
        
        {/* Left Side: Video Player Section */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-canvas">
          <div className="space-y-4">
            {/* Embedded Player */}
            <div className="w-full border-4 border-ink shadow-hard relative aspect-video bg-black">
              {activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white text-center">
                  <p className="font-display text-xl font-bold mb-2">Video playback restricted</p>
                  <a href={activeVideo.canonicalUrl} target="_blank" rel="noopener noreferrer" className="cn-btn-blue text-xs">
                    Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Video Controls & Meta */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 pt-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-[9px] border-2 border-ink px-1.5 py-0.5 font-bold uppercase bg-yellow-bright/10 text-yellow-800">
                    {activeVideo.level}
                  </span>
                  <span className="font-mono text-[9px] border-2 border-blue px-1.5 py-0.5 font-bold uppercase text-blue">
                    {activeVideo.subject.replace('Polymer ', '')}
                  </span>
                </div>
                <h2 className="font-display text-lg font-black text-ink leading-tight mb-1">{activeVideo.title}</h2>
                <p className="font-mono text-[10px] text-ink/50">Channel: {activeVideo.channel} · Duration: {activeVideo.duration}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleWatchlist(activeVideo.id)}
                  className="border-2 border-ink p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-hard-xs flex items-center justify-center"
                  title="Save to watchlist"
                >
                  <Heart className={`w-4 h-4 ${watchlist.includes(activeVideo.id) ? 'fill-red-500 text-red-500' : 'text-ink'}`} />
                </button>
                <button
                  onClick={() => markVideoCompleted(activeVideo.id)}
                  className={`font-mono text-[10px] font-black border-2 border-ink px-3 py-2 uppercase shadow-hard-xs flex items-center gap-1.5 transition-colors ${
                    progress[activeVideo.id]?.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {progress[activeVideo.id]?.completed ? 'Completed' : 'Mark Watched'}
                </button>
              </div>
            </div>

            <p className="font-mono text-xs text-ink/75 leading-relaxed bg-slate-50 dark:bg-zinc-900 border-2 border-ink/10 p-4">
              {activeVideo.description || 'No description provided.'}
            </p>
          </div>

          {/* Previous / Next buttons */}
          <div className="border-t-2 border-ink/10 pt-4 mt-6 flex justify-between gap-4">
            <button
              onClick={() => setActiveIdx(prev => Math.max(0, prev - 1))}
              disabled={activeIdx === 0}
              className="border-2 border-ink px-4 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => {
                if (activeIdx < videos.length - 1) {
                  setActiveIdx(prev => prev + 1)
                } else {
                  toast({ title: 'Completed!', description: 'You finished the entire playlist!' })
                }
              }}
              className="border-2 border-ink px-4 py-2 font-mono text-[10px] font-black uppercase bg-blue text-white hover:bg-blue-600 transition-colors flex items-center gap-1.5"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Playlist Sidebar (Sidebar list) */}
        <div className="w-full lg:w-[350px] bg-slate-50 dark:bg-zinc-900/50 p-4 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-ink/10 pb-3 mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-ink uppercase tracking-wider">Course Syllabus</span>
              <span className="font-mono text-[9px] text-ink/50">{videos.length} Lectures</span>
            </div>

            <div className="space-y-2">
              {videos.map((v, i) => {
                const isActive = i === activeIdx
                const isWatched = progress[v.id]?.completed
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveIdx(i)}
                    className={`w-full border-2 text-left p-3 flex gap-3 transition-colors ${
                      isActive
                        ? 'border-blue bg-blue/5 dark:bg-blue/10'
                        : 'border-ink/10 hover:border-ink/30 bg-canvas'
                    }`}
                  >
                    <span className={`font-mono text-[10px] font-black w-5 flex-shrink-0 flex items-center justify-center h-5 border rounded-full ${
                      isActive
                        ? 'bg-blue text-white border-blue'
                        : isWatched
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-ink/40 border-slate-300'
                    }`}>
                      {isWatched ? '✓' : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-xs font-black text-ink leading-tight truncate">
                        {v.title}
                      </h4>
                      <p className="font-mono text-[9px] text-ink/50 mt-1 truncate">
                        {v.channel} · {v.duration}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-8 border-t-2 border-ink/10 pt-4">
            <div className="border-2 border-ink bg-yellow-bright p-4 text-center">
              <h5 className="font-mono text-[10px] font-black text-ink uppercase tracking-wide mb-1">Playlist Progress</h5>
              <div className="font-display text-2xl font-black text-ink">
                {videos.length > 0 ? Math.round((Object.values(progress).filter(p => p.completed).length / videos.length) * 100) : 0}%
              </div>
              <p className="font-mono text-[8px] text-ink/50 uppercase tracking-widest mt-0.5">Lectures Completed</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
