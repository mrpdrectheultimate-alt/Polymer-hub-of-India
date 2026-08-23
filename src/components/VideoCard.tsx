// src/components/VideoCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Play, ExternalLink, Heart, Clock } from 'lucide-react'
import { getYouTubeThumbnailUrl } from '@/lib/youtube'
import { toast } from '@/hooks/use-toast'
import { getFallbackVideoId } from '@/lib/youtube-replacement'

export type VideoRecord = {
  id: string
  title: string
  displayTitle?: string
  sourceTitle?: string
  channel: string
  duration: string
  subject: string
  subjectSlug: string
  youtubeId: string
  canonicalUrl: string
  thumbnailUrl?: string
  description: string
  source: 'NPTEL' | 'Industry' | 'IIT' | 'MIT'
  level: 'Foundation' | 'Intermediate' | 'Advanced'
  learningRole?: 'foundation' | 'applied' | 'case_study' | 'future_research'
  lessonSlug?: string
  status: 'published' | 'draft' | 'review' | 'archived'
  embedStatus: 'working' | 'blocked' | 'removed' | 'invalid' | 'broken'
  manualPlaybackVerified?: boolean
  verifiedBy?: string
  academicReviewStatus?: 'approved' | 'approved_with_caveat' | 'pending' | 'remap_required'
  mappingLevel?: 'subject' | 'module' | 'lesson'
  mappingConfidence?: 'high' | 'medium' | 'low' | 'unreviewed'
  academicReviewNotes?: string
}

const SOURCE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  NPTEL:    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  IIT:      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  MIT:      { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  Industry: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
}

const DEFAULT_SUBJECT_IMAGES: Record<string, string> = {
  'polymer-chemistry': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
  'polymer-processing': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  'mould-design': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
  'polymer-testing': 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
  'rubber-technology': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'recycling-technology': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
  'sustainable-plastics-bioplastics': 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
  'polymer-composites': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  'medical-plastics-biomaterials': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80',
  'plastic-packaging-engineering': 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80',
  'default': 'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=600&q=80',
}

interface VideoCardProps {
  video: VideoRecord
  onClick: () => void
  onWatchlistChange?: (videoId: string, inWatchlist: boolean) => void
  isSaved?: boolean
  watchedPercent?: number
}

export default function VideoCard({
  video,
  onClick,
  onWatchlistChange,
  isSaved = false,
  watchedPercent = 0
}: VideoCardProps) {
  const [saved, setSaved] = useState(isSaved)
  const [imgSrc, setImgSrc] = useState<string>('')
  
  const isBroken = video.embedStatus === 'broken'
  const activeYoutubeId = getFallbackVideoId(video.youtubeId, video.subjectSlug, isBroken)
  const canEmbed = (video.embedStatus === 'working' || video.embedStatus === 'broken') && Boolean(activeYoutubeId)

  useEffect(() => {
    setSaved(isSaved)
  }, [isSaved])

  useEffect(() => {
    if (activeYoutubeId) {
      setImgSrc(getYouTubeThumbnailUrl(activeYoutubeId))
    } else {
      setImgSrc(DEFAULT_SUBJECT_IMAGES[video.subjectSlug] || DEFAULT_SUBJECT_IMAGES.default)
    }
  }, [activeYoutubeId, video.subjectSlug])

  const srcBadge = SOURCE_STYLES[video.source] || SOURCE_STYLES.Industry

  async function handleWatchlistClick(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    
    try {
      const response = await fetch('/api/videos/watchlist', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id })
      })
      const result = await response.json()
      if (result.success) {
        const nextSaved = !saved
        setSaved(nextSaved)
        if (onWatchlistChange) {
          onWatchlistChange(video.id, nextSaved)
        }
        toast({
          title: nextSaved ? '❤️ Saved' : 'Removed',
          description: nextSaved ? 'Video added to your watchlist.' : 'Video removed from watchlist.'
        })
      } else {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to manage your watchlist.',
          variant: 'destructive'
        })
      }
    } catch (err) {
      console.error('Error updating watchlist:', err)
    }
  }

  const handleImageError = () => {
    // Fallback to crisp domain Unsplash photo if YouTube thumbnail fails to load
    setImgSrc(DEFAULT_SUBJECT_IMAGES[video.subjectSlug] || DEFAULT_SUBJECT_IMAGES.default)
  }

  return (
    <div
      onClick={canEmbed ? onClick : undefined}
      className="group flex flex-col h-full bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none"
    >
      {/* ── Video Thumbnail Header ── */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden border-b-2 border-slate-200">
        <img
          src={imgSrc || DEFAULT_SUBJECT_IMAGES[video.subjectSlug] || DEFAULT_SUBJECT_IMAGES.default}
          alt={video.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Subtle Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Source & Subject Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap z-10">
          <span className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border shadow-sm ${srcBadge.bg} ${srcBadge.text} ${srcBadge.border}`}>
            {video.source === 'Industry' ? 'Industry Demo' : video.source}
          </span>
          {video.learningRole && (
            <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-900/80 text-white border border-white/20 shadow-sm">
              {video.learningRole}
            </span>
          )}
        </div>

        {/* Watchlist Heart Button */}
        <button
          onClick={handleWatchlistClick}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full border border-slate-300 flex items-center justify-center hover:scale-110 hover:bg-white transition-all shadow-sm"
          title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
        </button>

        {/* Center Play Button Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-slate-950/70 backdrop-blur-sm border-2 border-white/80 flex items-center justify-center group-hover:scale-115 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all shadow-lg">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 backdrop-blur-sm font-mono text-[10px] text-white px-2 py-0.5 rounded-md font-bold border border-white/20 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {video.duration || '10:00'}
        </div>
      </div>

      {/* ── Card Content & Metadata ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white space-y-3">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 font-bold">
            <span className="text-blue-700 uppercase">{video.subject.replace('Polymer ', '')}</span>
            <span>&middot;</span>
            <span className="uppercase text-slate-400">{video.level}</span>
          </div>

          <h3 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {video.title}
          </h3>

          <p className="text-[11px] font-mono text-slate-400 font-medium truncate">
            {video.channel}
          </p>
        </div>

        {/* Footer Actions & Progress Bar */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {canEmbed ? (
            <span className="font-mono text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Watch Lecture &rarr;
            </span>
          ) : (
            <a
              href={video.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-slate-700 hover:text-slate-950 uppercase"
            >
              YouTube Link <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {watchedPercent > 0 && (
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {watchedPercent >= 100 ? 'Watched' : `${Math.round(watchedPercent)}%`}
            </span>
          )}
        </div>

      </div>
    </div>
  )
}
