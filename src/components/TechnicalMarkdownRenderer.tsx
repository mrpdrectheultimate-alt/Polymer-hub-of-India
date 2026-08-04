'use client'

// src/components/TechnicalMarkdownRenderer.tsx
// Renders deep lesson content with:
// - KaTeX math equations (inline $...$ and block $$...$$)
// - GFM tables, code blocks
// - CN-industrial styling
// - Copy button
// Install: npm install react-markdown remark-gfm remark-math rehype-katex katex

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Copy, Check, BookOpen, Target, Calculator, FlaskConical, Lightbulb, Award, FileText, AlertTriangle } from 'lucide-react'

type Props = {
  content: string
  domainColor?: string
  domainBg?: string
}

// ─── Section icon mapping ──────────────────────────────────────────────────────
function getSectionIcon(heading: string) {
  const h = heading.toLowerCase()
  if (h.includes('learning') || h.includes('objective')) return { icon: Target, color: '#1D4ED8' }
  if (h.includes('mathematical') || h.includes('formula') || h.includes('calculation') || h.includes('equation')) return { icon: Calculator, color: '#7C3AED' }
  if (h.includes('case study') || h.includes('industrial') || h.includes('application')) return { icon: FlaskConical, color: '#EA580C' }
  if (h.includes('gate') || h.includes('exam') || h.includes('question')) return { icon: Award, color: '#7C3AED' }
  if (h.includes('mistake') || h.includes('misconception') || h.includes('common')) return { icon: AlertTriangle, color: '#EA580C' }
  if (h.includes('key takeaway') || h.includes('summary')) return { icon: Lightbulb, color: '#CA8A04' }
  if (h.includes('standard') || h.includes('astm') || h.includes('iso') || h.includes('bis')) return { icon: FileText, color: '#15803D' }
  return { icon: BookOpen, color: '#1D4ED8' }
}

export default function TechnicalMarkdownRenderer({ content, domainColor = '#1D4ED8', domainBg = '#EFF6FF' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="lesson-content">
      {/* Copy button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 border-4 border-ink px-4 py-2 font-mono text-[10px] font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-all shadow-hard-sm"
        >
          {copied ? <><Check className="w-3.5 h-3.5 text-green" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Lesson</>}
        </button>
      </div>

      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{

            // ── Headings ───────────────────────────────────────────────────────
            h1: ({ children }) => (
              <h1 className="font-display text-3xl md:text-4xl font-black text-ink leading-tight mb-6 mt-2">
                {children}
              </h1>
            ),

            h2: ({ children }) => {
              const text = String(children)
              const { icon: Icon, color } = getSectionIcon(text)
              return (
                <div className="mt-10 mb-4">
                  <div className="flex items-center gap-3 border-b-4 border-ink pb-3">
                    <div className="w-8 h-8 border-2 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="font-display text-xl font-black text-ink leading-tight">{children}</h2>
                  </div>
                </div>
              )
            },

            h3: ({ children }) => (
              <h3 className="font-display text-lg font-black text-ink mt-6 mb-3 flex items-center gap-2">
                <span className="w-2 h-5 flex-shrink-0" style={{ backgroundColor: domainColor }} />
                {children}
              </h3>
            ),

            h4: ({ children }) => (
              <h4 className="font-mono text-sm font-black text-ink/70 uppercase tracking-wider mt-4 mb-2">{children}</h4>
            ),

            // ── Paragraphs ─────────────────────────────────────────────────────
            p: ({ children }) => (
              <p className="text-ink/80 leading-[1.8] mb-4 text-base">{children}</p>
            ),

            // ── Tables ─────────────────────────────────────────────────────────
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 border-2 border-ink shadow-hard">
                <table className="w-full border-collapse font-mono text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{ backgroundColor: domainColor }}>{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left font-black text-white text-xs uppercase tracking-wider border-r-2 border-white/20 last:border-r-0">
                {children}
              </th>
            ),
            tr: ({ children }) => (
              <tr className="border-b-2 border-ink/10 hover:bg-ink/5 transition-colors">{children}</tr>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2.5 text-ink border-r border-ink/10 last:border-r-0">{children}</td>
            ),

            // ── Code blocks ────────────────────────────────────────────────────
            code: ({ className, children, ...props }) => {
              const isBlock = className?.includes('language-')
              if (isBlock) {
                return (
                  <pre className="border-2 border-ink bg-ink text-green-400 font-mono text-sm p-5 overflow-x-auto my-6 shadow-hard">
                    <code>{children}</code>
                  </pre>
                )
              }
              return (
                <code
                  className="font-mono text-xs font-bold px-2 py-0.5 border-2 border-ink rounded-none"
                  style={{ backgroundColor: domainBg, color: domainColor }}
                  {...props}
                >
                  {children}
                </code>
              )
            },

            // ── Lists ──────────────────────────────────────────────────────────
            ul: ({ children }) => (
              <ul className="space-y-2 my-4 ml-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2 my-4 ml-0 list-none counter-reset-item">{children}</ol>
            ),
            li: ({ children }: React.ComponentPropsWithoutRef<'li'>) => (
              <li className="flex items-start gap-3">
                <span
                  className="w-3 h-3 border-2 border-ink flex-shrink-0 mt-1.5"
                  style={{ backgroundColor: domainColor }}
                />
                <span className="text-ink/80 leading-[1.8] flex-1">{children}</span>
              </li>
            ),

            // ── Blockquotes (used for important callouts) ───────────────────────
            blockquote: ({ children }) => (
              <div
                className="border-l-4 pl-5 py-3 my-6 border-4 border-l-4"
                style={{ borderLeftColor: domainColor, backgroundColor: domainBg, borderColor: domainColor + '40', borderLeftWidth: '6px' }}
              >
                <div className="font-mono text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: domainColor }}>
                  Key Note
                </div>
                <div className="text-sm text-ink leading-relaxed">{children}</div>
              </div>
            ),

            // ── Horizontal rule (section divider) ──────────────────────────────
            hr: () => (
              <div className="border-t-4 border-ink my-8" />
            ),

            // ── Strong/Bold ────────────────────────────────────────────────────
            strong: ({ children }) => (
              <strong className="font-black text-ink">{children}</strong>
            ),

            // ── Em/Italic (used for formulas and special terms) ─────────────────
            em: ({ children }) => (
              <em className="not-italic font-bold" style={{ color: domainColor }}>{children}</em>
            ),

            // ── Links ──────────────────────────────────────────────────────────
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:no-underline transition-all"
                style={{ color: domainColor, textDecorationColor: domainColor }}
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* KaTeX overrides for CN-industrial style */}
      <style jsx global>{`
        .lesson-content .katex-display {
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          border: 4px solid #0A0A0A;
          background: ${domainBg};
          box-shadow: 4px 4px 0px 0px ${domainColor};
          overflow-x: auto;
        }
        .lesson-content .katex {
          font-size: 1.1em;
        }
        .lesson-content .katex-display .katex {
          font-size: 1.2em;
        }
      `}</style>
    </div>
  )
}
