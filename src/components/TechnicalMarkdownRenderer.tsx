'use client'

// src/components/TechnicalMarkdownRenderer.tsx
// Renders deep lesson content with:
// - Unboxed, large, centered KaTeX equations
// - Interactive vector graphs (Stress-Strain, DSC, TGA, Rheology)
// - Clean typography (Inter 17px body, Space Grotesk headings, JetBrains Mono data)
// - Validated figure containers

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
  if (h.includes('learning') || h.includes('objective')) return { icon: Target, color: '#2563EB' }
  if (h.includes('mathematical') || h.includes('formula') || h.includes('calculation') || h.includes('equation')) return { icon: Calculator, color: '#2563EB' }
  if (h.includes('case study') || h.includes('industrial') || h.includes('application')) return { icon: FlaskConical, color: '#EA580C' }
  if (h.includes('gate') || h.includes('exam') || h.includes('question')) return { icon: Award, color: '#F59E0B' }
  if (h.includes('mistake') || h.includes('misconception') || h.includes('common')) return { icon: AlertTriangle, color: '#DC2626' }
  if (h.includes('key takeaway') || h.includes('summary')) return { icon: Lightbulb, color: '#15803D' }
  if (h.includes('standard') || h.includes('astm') || h.includes('iso') || h.includes('bis')) return { icon: FileText, color: '#0D9488' }
  return { icon: BookOpen, color: '#2563EB' }
}

export default function TechnicalMarkdownRenderer({ content, domainColor = '#2563EB' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Sanitize raw leaked debug/HTML wrapper tags that damage rendering
  const sanitizedContent = (content || '')
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
              <div className="overflow-x-auto my-6 border border-slate-200/90 rounded-xl bg-white shadow-xs">
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
                const lang = className.replace('language-', '')

                // Stress-Strain Curve Graph
                if (lang === 'graph-stress-strain') {
                  const parts = rawCode.split('|')
                  const material = parts[0] || 'Semi-Crystalline Polymer (PP/HDPE)'
                  return (
                    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                        Stress-Strain Curve (ASTM D638 / ISO 527)
                      </div>
                      <svg viewBox="0 0 600 400" className="w-full h-auto font-sans">
                        <g stroke="#F1F5F9" strokeWidth="1.5">
                          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(y => (
                            <line key={y} x1="55" y1={y} x2="560" y2={y} />
                          ))}
                          {[120, 185, 250, 315, 380, 445, 510].map(x => (
                            <line key={x} x1={x} y1="30" x2={x} y2="360" />
                          ))}
                        </g>
                        <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="55" y1="360" x2="565" y2="360" />
                          <line x1="55" y1="25" x2="55" y2="360" />
                        </g>
                        <text x="310" y="390" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letterSpacing="1">STRAIN &epsilon; (%)</text>
                        <text x="20" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letterSpacing="1" transform="rotate(-90, 20, 195)">STRESS &sigma; (MPa)</text>
                        <line x1="120" y1="30" x2="120" y2="360" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4,4" />
                        <line x1="250" y1="30" x2="250" y2="360" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4,4" />
                        <text x="87" y="45" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748B">Elastic Region</text>
                        <text x="185" y="45" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748B">Necking / Drawing</text>
                        <text x="380" y="45" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748B">Strain Hardening</text>
                        <path
                          d="M 55,360 Q 90,160 120,150 T 200,210 T 350,210 Q 480,180 520,110"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle cx="120" cy="150" r="5" fill="#EA580C" stroke="#FFF" strokeWidth="2" />
                        <text x="128" y="145" fontSize="10" fontWeight="bold" fill="#EA580C">Yield Point (&sigma;y)</text>
                        <circle cx="520" cy="110" r="5" fill="#15803D" stroke="#FFF" strokeWidth="2" />
                        <text x="400" y="105" fontSize="10" fontWeight="bold" fill="#15803D">Ultimate Strength (&sigma;uts)</text>
                      </svg>
                      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
                        Material: <strong>{material}</strong> | Stress-Strain behaviour under uniaxial tensile load.
                      </figcaption>
                    </figure>
                  )
                }

                // DSC Thermogram Graph
                if (lang === 'graph-dsc') {
                  const parts = rawCode.split('|')
                  const material = parts[0] || 'Standard Semicrystalline Polymer (PET)'
                  return (
                    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                        Differential Scanning Calorimetry (DSC) Scan
                      </div>
                      <svg viewBox="0 0 600 400" className="w-full h-auto font-sans">
                        <g stroke="#F1F5F9" strokeWidth="1.5">
                          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(y => (
                            <line key={y} x1="55" y1={y} x2="560" y2={y} />
                          ))}
                          {[120, 190, 260, 330, 400, 470, 540].map(x => (
                            <line key={x} x1={x} y1="30" x2={x} y2="360" />
                          ))}
                        </g>
                        <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="55" y1="360" x2="565" y2="360" />
                          <line x1="55" y1="25" x2="55" y2="360" />
                        </g>
                        <text x="310" y="390" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letterSpacing="1">TEMPERATURE T (&deg;C)</text>
                        <text x="20" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letterSpacing="1" transform="rotate(-90, 20, 195)">HEAT FLOW &rarr; ENDO DOWN (mW)</text>
                        <path
                          d="M 55,100 L 140,100 Q 155,100 165,115 T 180,120 L 220,120 Q 250,120 270,70 T 290,120 L 380,120 Q 420,120 440,290 T 465,120 L 560,120"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle cx="165" cy="110" r="5" fill="#2563EB" stroke="#FFF" strokeWidth="2" />
                        <text x="165" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563EB">Tg (Glass Transition)</text>
                        <circle cx="270" cy="70" r="5" fill="#EA580C" stroke="#FFF" strokeWidth="2" />
                        <text x="270" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#EA580C">Tc (Crystallization Peak)</text>
                        <circle cx="440" cy="290" r="5" fill="#15803D" stroke="#FFF" strokeWidth="2" />
                        <text x="440" y="315" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">Tm (Melting Endotherm)</text>
                      </svg>
                      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
                        Material: <strong>{material}</strong> | DSC trace highlighting characteristic thermodynamic transitions.
                      </figcaption>
                    </figure>
                  )
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
                <div className="text-sm text-slate-800 leading-relaxed font-sans">{children}</div>
              </div>
            ),

            // ── Horizontal rule ────────────────────────────────────────────────
            hr: () => (
              <hr className="my-8 border-t border-slate-200" />
            ),

            // ── Strong/Bold ────────────────────────────────────────────────────
            strong: ({ children }) => (
              <strong className="font-bold text-slate-900">{children}</strong>
            ),

            // ── Em/Italic ──────────────────────────────────────────────────────
            em: ({ children }) => (
              <em className="font-medium text-slate-900 not-italic bg-amber-50 px-1 rounded">{children}</em>
            ),

            // ── Links ──────────────────────────────────────────────────────────
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#2563EB] underline hover:text-blue-800 transition-colors"
              >
                {children}
              </a>
            ),
          }}
        >
          {sanitizedContent}
        </ReactMarkdown>
      </div>

      {/* ─── UNBOXED, LARGE, CENTERED KaTeX FORMULA STYLES ─── */}
      <style jsx global>{`
        .lesson-content .katex-display {
          margin: 1.75rem 0 !important;
          padding: 1rem 0 !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          overflow-x: auto;
          text-align: center;
        }
        .lesson-content .katex-display .katex {
          font-size: 1.35em !important;
          line-height: 2 !important;
          color: #0F172A !important;
        }
        .lesson-content .katex {
          font-size: 1.1em;
          padding: 0 0.2em;
        }
      `}</style>
    </div>
  )
}
