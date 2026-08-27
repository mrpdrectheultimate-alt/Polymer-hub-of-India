'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AlertCircle, RefreshCw, ExternalLink, ShieldCheck, Video } from 'lucide-react'
import { getFallbackVideo } from '@/lib/youtube-replacement'

export interface VideoSourceItem {
  type: 'youtube' | 'vimeo' | 'direct' | 'archive'
  url: string
  embedUrl: string
  label?: string
  priority?: number
}

export interface VideoPlayerData {
  id: string
  title: string
  channel?: string
  duration?: string
  views?: string
  level?: string
  subjectSlug?: string
  lessonSlug?: string
  youtubeId?: string
  sources?: VideoSourceItem[]
}

interface VideoPlayerProps {
  video: VideoPlayerData
  autoplay?: boolean
  className?: string
}

export function VideoPlayer({ video, autoplay = true, className = '' }: VideoPlayerProps) {
  const primaryId = video.youtubeId || 'RMjtmsr3CqA'
  const fallbackId = getFallbackVideo(primaryId, video.lessonSlug, video.subjectSlug)

  // Build high-compatibility sources array
  const sources: VideoSourceItem[] = [
    {
      type: 'youtube',
      url: `https://www.youtube.com/watch?v=${primaryId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${primaryId}?autoplay=${autoplay ? 1 : 0}&enablejsapi=1&rel=0&modestbranding=1`,
      label: 'Primary HD Stream'
    },
    {
      type: 'youtube',
      url: `https://www.youtube.com/watch?v=${fallbackId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${fallbackId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`,
      label: 'Verified Academic Mirror'
    },
    {
      type: 'youtube',
      url: `https://www.youtube.com/watch?v=RMjtmsr3CqA`,
      embedUrl: `https://www.youtube-nocookie.com/embed/RMjtmsr3CqA?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`,
      label: 'Polymer Engineering Core'
    }
  ]

  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentSource = sources[currentSourceIndex] || sources[0]

  useEffect(() => {
    setCurrentSourceIndex(0)
    setIsLoading(true)
    setHasError(false)
    setErrorMessage('')
  }, [video.id, video.youtubeId])

  const switchToNextSource = useCallback(() => {
    if (currentSourceIndex < sources.length - 1) {
      setCurrentSourceIndex(prev => prev + 1)
      setIsLoading(true)
      setHasError(false)
    } else {
      setHasError(true)
      setErrorMessage('Direct embed restricted by provider. Click below to view officially on YouTube.')
    }
  }, [currentSourceIndex, sources.length])

  // Listen for YouTube Iframe API error events sent via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data)
          // Only switch source if explicit onError event occurs
          if (data.event === 'onError' || data.type === 'error') {
            switchToNextSource()
          }
        }
      } catch {
        // Non-JSON message from other extensions, ignore
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [switchToNextSource])

  const handleIframeError = () => {
    switchToNextSource()
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setErrorMessage('')
    setCurrentSourceIndex(0)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${className}`}>
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-300 text-xs font-mono font-medium mt-3">Connecting lecture stream...</p>
        </div>
      )}

      {/* Error / Fallback State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm z-20 p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h4 className="text-white font-display font-bold text-base mb-1">
            {errorMessage || 'Switching to verified mirror stream...'}
          </h4>
          <p className="text-slate-400 text-xs max-w-md mb-4 leading-relaxed font-light">
            Some academic institutions restrict embedded playback outside YouTube. You can watch the verified lecture directly on YouTube or retry.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Player
            </button>
            <a
              href={currentSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/15"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open in YouTube
            </a>
          </div>
        </div>
      )}

      {/* Video Iframe with security and privacy parameters */}
      <div className="aspect-video w-full bg-black">
        <iframe
          ref={iframeRef}
          key={currentSource?.embedUrl}
          src={currentSource?.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={video.title}
        />
      </div>

      {/* Verified Education Badge & Stream Selector */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium font-mono text-[11px]">
          <ShieldCheck className="w-4 h-4" /> Verified Academic Source &middot; {currentSource.label}
        </span>
        <div className="flex items-center gap-3">
          {sources.length > 1 && (
            <button
              type="button"
              onClick={switchToNextSource}
              className="text-slate-400 hover:text-white font-mono text-[10px] uppercase flex items-center gap-1 transition-colors"
              title="Switch to backup stream"
            >
              <Video className="w-3 h-3 text-amber-400" /> Switch Mirror
            </button>
          )}
          <a
            href={currentSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors flex items-center gap-1 text-[11px]"
          >
            Open YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
