'use client'

// src/components/TechnicalMarkdownRenderer.tsx
// Renders deep lesson content with:
// - Unboxed, large, centered KaTeX equations
// - Interactive vector graphs (Stress-Strain, DSC, TGA, Rheology)
// - Dynamic 8-Layer Visual Renderer (Visual Mechanisms, Photos, PFDs, Blueprints)
// - Clean typography (Inter 17px body, Space Grotesk headings, JetBrains Mono data)
// - Validated figure containers

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Copy, Check, BookOpen, Target, Calculator, FlaskConical, Lightbulb, Award, FileText, AlertTriangle } from 'lucide-react'
import DynamicVisualRenderer from '@/components/DynamicVisualRenderer'
import { VisualMechanismDispatcher } from '@/components/VisualMechanismPrimitives'
import { InteractiveStressStrainGraph, InteractiveRheologyGraph } from '@/components/InteractiveEngineeringGraphs'

type Props = {
  content: string
  domainColor?: string
  domainBg?: string
}

// ─── Section icon mapping ──────────────────────────────────────────────────────
function getSectionIcon(heading: string) {
  const h = heading.toLowerCase()
  if (h.includes('learning') || h.includes('objective')) return { icon: Target, color: '#2563EB' }
  if (h.includes('mathematical') || h.includes('formula') || h.includes('calculation') || h.includes('equation')) return { icon: Calculator, color: '#2563EB' }
  if (h.includes('case study') || h.includes('industrial') || h.includes('application')) return { icon: FlaskConical, color: '#EA580C' }
  if (h.includes('gate') || h.includes('exam') || h.includes('question')) return { icon: Award, color: '#F59E0B' }
  if (h.includes('mistake') || h.includes('misconception') || h.includes('common')) return { icon: AlertTriangle, color: '#DC2626' }
  if (h.includes('key takeaway') || h.includes('summary')) return { icon: Lightbulb, color: '#15803D' }
  if (h.includes('standard') || h.includes('astm') || h.includes('iso') || h.includes('bis')) return { icon: FileText, color: '#0D9488' }
  return { icon: BookOpen, color: '#2563EB' }
}

export function sanitizeLatex(text: string): string {
  if (!text) return ''

  let str = text
    .replace(/\x0C/g, '\\f')
    .replace(/\x0D/g, '\\r')
    .replace(/\x08/g, '\\b')
    .replace(/\x0B/g, '\\v')

  // Target inline math ($...$) and display math ($$...$$) blocks
  // Pre-process math blocks to double-escape single backslashes so ReactMarkdown preserves single backslashes for KaTeX
  str = str.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (mathBlock) => {
    return mathBlock
      .replace(/\\/g, '\\\\')
      .replace(/\\\\\\\\/g, '\\\\')
  })

  return str
}

export default function TechnicalMarkdownRenderer({ content, domainColor = '#2563EB' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Sanitize raw leaked debug/HTML wrapper tags and fix KaTeX LaTeX backslashes
  const sanitizedContent = sanitizeLatex(content || '')
    .replace(/<div className=["']problem-statement["']>/gi, '')
    .replace(/<div class=["']problem-statement["']>/gi, '')
    .replace(/<div className=["'][^"']*["']>/gi, '')
    .replace(/<\/div>/gi, '')

  return (
    <div className="lesson-content space-y-6">
      {/* Copy quick action */}
      <div className="flex justify-end -mb-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all shadow-xs"
        >
          {copied ? <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Text</> : <><Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Text</>}
        </button>
      </div>

      <div className="prose prose-sm max-w-none text-slate-800 leading-[1.75]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{

            // ── Headings ───────────────────────────────────────────────────────
            h1: ({ children }) => (
              <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-5 mt-6 border-b border-slate-200 pb-3">
                {children}
              </h1>
            ),

            h2: ({ children }) => {
              const text = String(children)
              const { icon: Icon, color } = getSectionIcon(text)
              return (
                <div className="mt-10 mb-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h2 className="font-display text-lg md:text-xl font-bold text-slate-900 leading-tight m-0">
                      {children}
                    </h2>
                  </div>
                </div>
              )
            },

            h3: ({ children }) => (
              <h3 className="font-display text-base font-bold text-slate-900 mt-6 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: domainColor }} />
                <span>{children}</span>
              </h3>
            ),

            h4: ({ children }) => (
              <h4 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">
                {children}
              </h4>
            ),

            // ── Paragraphs ─────────────────────────────────────────────────────
            p: ({ children }) => {
              const hasMath = React.Children.toArray(children).some(child => 
                typeof child === 'string' && (child.includes('$') || child.includes('\\('))
              )
              if (hasMath) {
                return <div className="math-paragraph my-3">{children}</div>
              }
              return <p className="text-slate-700 leading-[1.75] mb-4 text-[16px] font-sans">{children}</p>
            },

            // ── Tables ─────────────────────────────────────────────────────────
            table: ({ children }) => (
              <div className="overflow-x-auto mobile-touch-scroll my-6 border border-slate-200/90 rounded-xl bg-white shadow-xs">
                <table className="w-full border-collapse font-sans text-xs sm:text-sm tech-table">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left font-mono font-bold text-slate-900 text-xs uppercase tracking-wider border-r border-slate-200 last:border-r-0">
                {children}
              </th>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors last:border-b-0">{children}</tr>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-slate-700 border-r border-slate-100 last:border-r-0 align-top font-sans">{children}</td>
            ),

            // ── Images ─────────────────────────────────────────────────────────
            img: ({ src, alt }) => (
              <figure className="my-6 border border-slate-200 bg-white p-3 rounded-2xl shadow-xs">
                <div className="w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt || 'Polymer Engineering Diagram'}
                    className="max-h-[360px] w-auto object-contain hover:scale-[1.01] transition-transform duration-200"
                  />
                </div>
                {alt && (
                  <figcaption className="mt-2 font-mono text-[11px] font-bold text-slate-500 text-center tracking-wide border-t border-slate-100 pt-2">
                    {alt}
                  </figcaption>
                )}
              </figure>
            ),

            // ── Code blocks & Dynamic Vector Engineering Graphs ─────────────────
            code: ({ className, children }) => {
              const isBlock = className?.includes('language-')
              const rawCode = String(children).trim()
              const isMath = className?.includes('math') || className?.includes('katex')

              if (isMath) {
                return (
                  <div className="formula-block my-4">
                    <div className="katex-display-wrapper text-center">
                      {children}
                    </div>
                  </div>
                )
              }

              if (isBlock && className) {
                const lang = className.replace('language-', '').trim()

                // Dynamic 8-Layer Visual Renderer (Visual 1, 2, 3, 4 standard code blocks)
                if (
                  lang === 'visual-mechanism' ||
                  lang === 'industrial-photograph' ||
                  lang === 'process-flow' ||
                  lang === 'industrial-blueprint' ||
                  lang.startsWith('visual-') ||
                  lang.startsWith('industrial-') ||
                  lang.startsWith('process-')
                ) {
                  return <DynamicVisualRenderer type={lang} data={rawCode} />
                }

                // Interactive Stress-Strain Laboratory Graph (ASTM D638 / ISO 527)
                if (lang === 'graph-stress-strain') {
                  const parts = rawCode.split('|')
                  const material = parts[0] || 'Semi-Crystalline Polymer (PP/HDPE)'
                  return <InteractiveStressStrainGraph material={material} />
                }

                // Interactive Melt Rheology Graph
                if (lang === 'graph-viscosity' || lang === 'graph-rheology') {
                  return <InteractiveRheologyGraph />
                }

                // Mechanism & Chemical SVGs
                if (lang.startsWith('mechanism') || lang.startsWith('diagram') || lang.startsWith('primitive')) {
                  return <VisualMechanismDispatcher mechanism={lang} />
                }

                return (
                  <div className="my-4 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-100">
                    <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/80 border-b border-slate-700 text-[11px] font-mono text-slate-400">
                      <span>{lang}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto font-mono text-xs text-slate-200">
                      <code>{children}</code>
                    </pre>
                  </div>
                )
              }

              return (
                <code className="font-mono text-xs font-bold text-[#2563EB] bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200/60">
                  {children}
                </code>
              )
            },

            // ── Lists ──────────────────────────────────────────────────────────
            ul: ({ children }) => (
              <ul className="my-4 space-y-2 pl-2 list-none">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 space-y-2 pl-2 list-decimal list-inside">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2.5 text-slate-700 text-[16px] leading-[1.75]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2.5 flex-shrink-0" />
                <span className="flex-1">{children}</span>
              </li>
            ),

            // ── Blockquotes ────────────────────────────────────────────────────
            blockquote: ({ children }) => (
              <div className="my-5 p-4 rounded-xl border-l-4 border-l-[#2563EB] bg-blue-50/60 border border-slate-200/70">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2563EB] mb-1">
                  Core Engineering Takeaway
                </div>
                <div className="text-xs sm:text-sm text-slate-800 font-sans italic">{children}</div>
              </div>
            )
          }}
        >
          {sanitizedContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}
