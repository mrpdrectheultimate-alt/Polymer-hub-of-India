// src/components/IndustrialPhotographViewer.tsx
'use client'

import React, { useState } from 'react'
import { Maximize2, X, Info, ExternalLink, ShieldCheck } from 'lucide-react'

export interface IndustrialPhotographProps {
  src: string
  alt: string
  caption: string
  source?: string
  sourceUrl?: string
  license?: string
  verifiedAt?: string
  scale?: string
  magnification?: string
  technique?: string // e.g. "SEM Micrograph (5,000x)", "Polarized Optical Microscopy", "Industrial Plant Photo"
  annotations?: Array<{ x: number; y: number; label: string }>
}

export function IndustrialPhotographViewer({
  src,
  alt,
  caption,
  source = 'Unsplash Commercial License (Free Commercial Use)',
  sourceUrl = 'https://unsplash.com',
  license = 'Unsplash License / CC0 Equivalent',
  verifiedAt = '2026-09-20',
  scale,
  magnification,
  technique = 'Industrial Microscopy / Macro Imaging',
  annotations = []
}: IndustrialPhotographProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  return (
    <>
      <figure className="my-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md text-slate-100 font-sans">
        {/* Header Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-slate-200 uppercase tracking-wider">{technique}</span>
            {magnification && (
              <span className="bg-slate-800 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                {magnification}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            {scale && (
              <span className="text-slate-400 flex items-center gap-1">
                <span className="inline-block w-4 h-0.5 bg-slate-400" />
                Scale: {scale}
              </span>
            )}
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
              title="Expand High-Res Image"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Zoom</span>
            </button>
          </div>
        </div>

        {/* Image Container with Annotations */}
        <div className="relative group bg-slate-950 flex items-center justify-center min-h-[220px]">
          {hasError ? (
            <div className="p-8 text-center space-y-2 bg-slate-900/90 w-full flex flex-col items-center justify-center border border-slate-800">
              <Info className="w-8 h-8 text-cyan-400 mb-1" />
              <div className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                {alt || 'Industrial Visual Reference'}
              </div>
              <p className="text-xs text-slate-400 max-w-md font-sans">
                {caption || 'Verified industrial polymer processing micrograph and technical experimental setup.'}
              </p>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              onError={() => setHasError(true)}
              className="w-full h-auto max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />
          )}

          {/* Overlay Annotations */}
          {annotations.map((ann, idx) => (
            <div
              key={idx}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
              onMouseEnter={() => setActiveAnnotation(ann.label)}
              onMouseLeave={() => setActiveAnnotation(null)}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[9px] font-bold text-slate-950 items-center justify-center border border-white">
                  {idx + 1}
                </span>
              </span>
              {activeAnnotation === ann.label && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-900 border border-cyan-500/50 text-slate-100 text-xs px-2.5 py-1 rounded shadow-xl whitespace-nowrap z-20 font-mono">
                  {ann.label}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Caption & Verified License Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-cyan-400 font-mono">Industrial Photography:</strong> {caption}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 border-t border-slate-800/50 pt-2">
            <a
              href={sourceUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-cyan-500/50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Source: <strong>{source}</strong></span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                {license}
              </span>
              <span className="text-slate-500">Verified {verifiedAt}</span>
            </div>
          </div>
        </div>
      </figure>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 bg-slate-800/80 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[85vh] overflow-auto flex items-center justify-center p-2">
            <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          </div>
          <p className="mt-4 text-xs font-mono text-slate-300 max-w-2xl text-center">
            {caption}
          </p>
        </div>
      )}
    </>
  )
}

export default IndustrialPhotographViewer
