// src/components/VideoCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Play, ExternalLink, Heart } from 'lucide-react'
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
  
  useEffect(() => {
    setSaved(isSaved)
  }, [isSaved])

  const src = SOURCE_COLORS[video.source] || SOURCE_COLORS.Industry
  const subColor = SUBJECT_COLORS[video.subjectSlug] ?? '#1D4ED8'
  
  // Resolve active YouTube ID to fallback if database contains broken/mock ID references
  const activeYoutubeId = getFallbackVideoId(video.youtubeId, video.subjectSlug)
  const canEmbed = (video.embedStatus === 'working' || video.embedStatus === 'broken') && Boolean(activeYoutubeId)
  const thumbnailUrl = getYouTubeThumbnailUrl(activeYoutubeId)

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
          description: nextSaved ? 'Video added to watchlist.' : 'Video removed from watchlist.'
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

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!canEmbed) {
      return (
        <a
          href={video.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-left border-4 border-ink overflow-hidden group transition-all bg-canvas flex flex-col justify-between"
          style={{ boxShadow: `3px 3px 0px 0px ${subColor}` }}
        >
          {children}
        </a>
      )
    }
    return (
      <button
        onClick={onClick}
        className="w-full text-left border-4 border-ink overflow-hidden group transition-all bg-canvas flex flex-col justify-between relative"
        style={{ boxShadow: `3px 3px 0px 0px ${subColor}` }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translate(-2px,-2px)'
          el.style.boxShadow = `5px 5px 0px 0px ${subColor}`
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translate(0,0)'
          el.style.boxShadow = `3px 3px 0px 0px ${subColor}`
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <CardWrapper>
      {/* Thumbnail */}
      <div className="relative bg-ink/90 aspect-video flex items-center justify-center overflow-hidden w-full">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Watchlist Heart Button */}
        <button
          onClick={handleWatchlistClick}
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-white dark:bg-canvas border-2 border-ink flex items-center justify-center hover:scale-110 transition-transform shadow-hard-xs"
          title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-red-500 text-red-500' : 'text-ink'}`} />
        </button>

        {canEmbed ? (
          <div className="relative w-12 h-12 border-4 border-white bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        ) : (
          <div className="relative border-2 border-white bg-black/70 px-3 py-1.5 font-mono text-[9px] font-bold text-white flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-ink/90 font-mono text-[9px] text-white px-2 py-0.5 font-bold border border-white/20">
          {video.duration}
        </div>
        
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          <span
            className="font-mono text-[8px] font-black px-2 py-0.5 border-2 uppercase"
            style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}
          >
            {video.source === 'Industry' ? 'Industry Demo' : video.source}
          </span>
          {video.learningRole && (
            <span
              className={`font-mono text-[8px] font-black px-2 py-0.5 border-2 uppercase ${
                video.learningRole === 'foundation'
                  ? 'bg-blue-600 text-white border-blue-800'
                  : 'bg-emerald-600 text-white border-emerald-800'
              }`}
            >
              {video.learningRole}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-canvas border-t-2 border-ink flex-1 flex flex-col justify-between w-full">
        <div>
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span
              className="font-mono text-[8px] border-2 px-1.5 py-0.5 uppercase font-bold"
              style={{ borderColor: subColor, color: subColor }}
            >
              {video.subject.replace('Polymer ', '')}
            </span>
            <span className="font-mono text-[8px] border-2 border-ink/20 text-ink/60 px-1.5 py-0.5 uppercase">
              {video.level}
            </span>
            {!canEmbed && (
              <span className="font-mono text-[8px] border-2 border-yellow-bright bg-yellow-bright/10 text-yellow-800 px-1.5 py-0.5 uppercase font-bold">
                External Only
              </span>
            )}
          </div>
          <h3
            className="font-display text-sm font-black text-ink leading-tight mb-1 group-hover:underline"
            style={{ textDecorationColor: subColor }}
          >
            {video.title}
          </h3>
          <p className="font-mono text-[9px] text-ink/60 mb-2">{video.channel}</p>
        </div>

        {/* Progress indicator */}
        {watchedPercent > 0 && (
          <div className="mt-3 w-full bg-slate-100 dark:bg-zinc-800 h-2 border border-ink/10 relative overflow-hidden">
            <div
              className={`h-full ${watchedPercent >= 100 ? 'bg-emerald-500' : 'bg-blue'}`}
              style={{ width: `${Math.min(watchedPercent, 100)}%` }}
            />
            {watchedPercent >= 100 && (
              <span className="absolute right-1 top-0 font-mono text-[7px] text-emerald-800 font-bold">
                WATCHED
              </span>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}
