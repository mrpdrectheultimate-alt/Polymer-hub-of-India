'use client'

import React, { useState } from 'react'
import { NewsVisualTemplateDispatcher, VisualTemplateType } from '@/components/NewsVisualTemplates'

export interface ImageWithFallbackProps {
  src?: string | null
  alt: string
  category: string
  region?: string
  sourceName?: string
  visualType?: VisualTemplateType | string
  imageCredit?: string | null
  isFeatured?: boolean
  className?: string
}

export function CategoryPlaceholder({
  category,
  headline,
  sourceName,
  visualType
}: {
  category: string
  headline: string
  sourceName?: string
  visualType?: VisualTemplateType | string
}) {
  return (
    <NewsVisualTemplateDispatcher
      templateType={visualType as VisualTemplateType}
      headline={headline}
      category={category}
      sourceName={sourceName}
    />
  )
}

export default function ImageWithFallback({
  src,
  alt,
  category,
  region = 'Global',
  sourceName,
  visualType,
  imageCredit,
  isFeatured = false,
  className = ''
}: ImageWithFallbackProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const showFallback = !src || imgError

  return (
    <div className={`relative overflow-hidden w-full ${isFeatured ? 'h-full min-h-[260px]' : 'h-48'} bg-slate-950 ${className}`}>
      {showFallback ? (
        <CategoryPlaceholder
          category={category}
          headline={alt}
          sourceName={sourceName}
          visualType={visualType}
        />
      ) : (
        <>
          {/* Skeleton/Placeholder background while image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-slate-900 animate-pulse z-0 flex items-center justify-center">
              <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">Loading Visual...</span>
            </div>
          )}

          {/* Actual Verified Image */}
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading={isFeatured ? 'eager' : 'lazy'}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 z-10 ${
              imgLoaded ? 'opacity-90' : 'opacity-0'
            }`}
          />

          {/* High-Contrast Editorial Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-20 pointer-events-none" />

          {/* Badges Overlays */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-30">
            <span className="font-mono text-[9px] font-bold bg-slate-900/90 text-white px-2 py-0.5 rounded border border-white/20 uppercase shadow-xs">
              {category}
            </span>
            <span className="font-mono text-[9px] font-bold bg-black/70 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
              {region}
            </span>
          </div>

          {/* Footer Metadata */}
          {imageCredit && (
            <div className="absolute bottom-2 right-3 z-30 font-mono text-[8px] text-white/70 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
              📸 {imageCredit}
            </div>
          )}
        </>
      )}
    </div>
  )
}
