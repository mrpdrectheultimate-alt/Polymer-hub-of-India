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
              <div className="overflow-x-auto my-6 border-4 border-ink shadow-hard rounded-xl bg-white">
                <table className="w-full border-collapse font-sans text-sm tech-table">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{ backgroundColor: domainColor }} className="border-b-4 border-ink">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-5 py-4 text-left font-black text-white text-xs uppercase tracking-wider border-r-2 border-white/20 last:border-r-0">
                {children}
              </th>
            ),
            tr: ({ children }) => (
              <tr className="border-b-2 border-ink/10 hover:bg-slate-50 transition-colors last:border-b-0">{children}</tr>
            ),
            td: ({ children }) => (
              <td className="px-5 py-3.5 text-ink border-r border-ink/10 last:border-r-0 align-top">{children}</td>
            ),

            // ── Images ─────────────────────────────────────────────────────────
            img: ({ src, alt }) => (
              <figure className="my-8 border-4 border-ink bg-white p-4 shadow-hard rounded-2xl">
                <div className="w-full overflow-hidden rounded-xl bg-slate-50 border-2 border-ink/15 p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt || 'Polymer Engineering Illustration'}
                    className="max-h-[380px] w-auto object-contain hover:scale-[1.02] transition-transform duration-350"
                  />
                </div>
                {alt && (
                  <figcaption className="mt-3 font-sans text-xs font-bold text-ink-muted text-center tracking-wide border-t-2 border-ink/10 pt-2.5">
                    💡 {alt}
                  </figcaption>
                )}
              </figure>
            ),

            // ── Code blocks ────────────────────────────────────────────────────
            code: ({ className, children, ...props }) => {
              const isBlock = className?.includes('language-')
              const rawCode = String(children).trim()

              if (isBlock && className) {
                const lang = className.replace('language-', '')

                // Stress-Strain Curve Graph
                if (lang === 'graph-stress-strain') {
                  const parts = rawCode.split('|')
                  const material = parts[0] || 'Semi-Crystalline Polymer (PP/HDPE)'
                  return (
                    <figure className="my-8 bg-white border-4 border-ink rounded-2xl p-6 shadow-hard">
                      <div className="font-sans text-sm font-black uppercase text-ink tracking-wider mb-4 flex items-center gap-2 border-b-2 border-ink/10 pb-2">
                        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                        Stress-Strain Curve (ASTM D638 / ISO 527)
                      </div>
                      <svg viewBox="0 0 600 400" className="w-full h-auto font-sans">
                        {/* Grid Lines */}
                        <g stroke="#F1F5F9" strokeWidth="1.5">
                          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(y => (
                            <line key={y} x1="55" y1={y} x2="560" y2={y} />
                          ))}
                          {[120, 185, 250, 315, 380, 445, 510].map(x => (
                            <line key={x} x1={x} y1="30" x2={x} y2="360" />
                          ))}
                        </g>

                        {/* Axes */}
                        <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="55" y1="360" x2="565" y2="360" /> {/* X axis */}
                          <line x1="55" y1="25" x2="55" y2="360" />  {/* Y axis */}
                        </g>

                        {/* Axis Labels */}
                        <text x="310" y="390" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1">STRAIN &epsilon; (%)</text>
                        <text x="20" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1" transform="rotate(-90, 20, 195)">STRESS &sigma; (MPa)</text>

                        {/* Region Dividers */}
                        <line x1="120" y1="30" x2="120" y2="360" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4,4" />
                        <line x1="250" y1="30" x2="250" y2="360" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4,4" />
                        <text x="87" y="45" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94A3B8">Elastic Region</text>
                        <text x="185" y="45" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94A3B8">Necking / Drawing</text>
                        <text x="380" y="45" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94A3B8">Strain Hardening</text>

                        {/* Stress-Strain curve path */}
                        <path
                          d="M 55,360 Q 90,160 120,150 T 200,210 T 350,210 Q 480,180 520,110"
                          fill="none"
                          stroke="#1D4ED8"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* Interactive Markers */}
                        {/* 1. Yield Point */}
                        <circle cx="120" cy="150" r="6" fill="#EA580C" stroke="#FFF" strokeWidth="2" />
                        <text x="128" y="145" fontSize="10" fontWeight="bold" fill="#EA580C">Yield Point (&sigma;y)</text>
                        <line x1="55" y1="150" x2="120" y2="150" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="2,2" />

                        {/* 2. Ultimate Tensile Strength */}
                        <circle cx="520" cy="110" r="6" fill="#15803D" stroke="#FFF" strokeWidth="2" />
                        <text x="400" y="105" fontSize="10" fontWeight="bold" fill="#15803D">Ultimate Strength (&sigma;uts)</text>
                        <line x1="55" y1="110" x2="520" y2="110" stroke="#15803D" strokeWidth="1.5" strokeDasharray="2,2" />

                        {/* 3. Fracture/Break Point */}
                        <circle cx="520" cy="110" r="6" fill="#DC2626" stroke="#FFF" strokeWidth="2" />
                        <text x="528" y="125" fontSize="10" fontWeight="bold" fill="#DC2626">Fracture Point</text>
                      </svg>
                      <figcaption className="mt-4 text-xs font-sans text-slate-500 text-center">
                        📈 Material: <strong>{material}</strong> | Stress-Strain behaviour under uniaxial tension showing distinct yield, drawing and strain-hardening phases.
                      </figcaption>
                    </figure>
                  )
                }

                // DSC Thermogram Graph
                if (lang === 'graph-dsc') {
                  const parts = rawCode.split('|')
                  const material = parts[0] || 'Standard Semicrystalline Polymer (PET)'
                  return (
                    <figure className="my-8 bg-white border-4 border-ink rounded-2xl p-6 shadow-hard">
                      <div className="font-sans text-sm font-black uppercase text-ink tracking-wider mb-4 flex items-center gap-2 border-b-2 border-ink/10 pb-2">
                        <span className="w-2.5 h-2.5 bg-violet-600 rounded-full" />
                        Differential Scanning Calorimetry (DSC) Scan
                      </div>
                      <svg viewBox="0 0 600 400" className="w-full h-auto font-sans">
                        {/* Grid Lines */}
                        <g stroke="#F1F5F9" strokeWidth="1.5">
                          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(y => (
                            <line key={y} x1="55" y1={y} x2="560" y2={y} />
                          ))}
                          {[120, 190, 260, 330, 400, 470, 540].map(x => (
                            <line key={x} x1={x} y1="30" x2={x} y2="360" />
                          ))}
                        </g>

                        {/* Axes */}
                        <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="55" y1="360" x2="565" y2="360" /> {/* X axis */}
                          <line x1="55" y1="25" x2="55" y2="360" />  {/* Y axis */}
                        </g>

                        {/* Axis Labels */}
                        <text x="310" y="390" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1">TEMPERATURE T (&deg;C)</text>
                        <text x="20" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1" transform="rotate(-90, 20, 195)">HEAT FLOW &rarr; ENDO DOWN (mW)</text>

                        {/* DSC curve path */}
                        <path
                          d="M 55,100 L 140,100 Q 155,100 165,115 T 180,120 L 220,120 Q 250,120 270,70 T 290,120 L 380,120 Q 420,120 440,290 T 465,120 L 560,120"
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* 1. Glass Transition (Tg) */}
                        <circle cx="165" cy="110" r="6" fill="#1D4ED8" stroke="#FFF" strokeWidth="2" />
                        <text x="165" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D4ED8">Tg (Glass Transition)</text>

                        {/* 2. Crystallization (Tc) */}
                        <circle cx="270" cy="70" r="6" fill="#EA580C" stroke="#FFF" strokeWidth="2" />
                        <text x="270" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#EA580C">Tc (Exothermic Crystallization)</text>

                        {/* 3. Melting (Tm) */}
                        <circle cx="440" cy="290" r="6" fill="#15803D" stroke="#FFF" strokeWidth="2" />
                        <text x="440" y="315" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">Tm (Endothermic Melting)</text>
                      </svg>
                      <figcaption className="mt-4 text-xs font-sans text-slate-500 text-center">
                        📈 Material: <strong>{material}</strong> | DSC thermogram showing key transitions: Glass Transition (step change), Crystallization (exothermic peak), and Melting (endothermic peak).
                      </figcaption>
                    </figure>
                  )
                }

                // TGA Thermogram Graph
                if (lang === 'graph-tga') {
                  const parts = rawCode.split('|')
                  const material = parts[0] || 'Standard Thermoplastic (Nylon / ABS)'
                  return (
                    <figure className="my-8 bg-white border-4 border-ink rounded-2xl p-6 shadow-hard">
                      <div className="font-sans text-sm font-black uppercase text-ink tracking-wider mb-4 flex items-center gap-2 border-b-2 border-ink/10 pb-2">
                        <span className="w-2.5 h-2.5 bg-green-600 rounded-full" />
                        Thermogravimetric Analysis (TGA) Curve
                      </div>
                      <svg viewBox="0 0 600 400" className="w-full h-auto font-sans">
                        {/* Grid Lines */}
                        <g stroke="#F1F5F9" strokeWidth="1.5">
                          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(y => (
                            <line key={y} x1="55" y1={y} x2="560" y2={y} />
                          ))}
                          {[120, 190, 260, 330, 400, 470, 540].map(x => (
                            <line key={x} x1={x} y1="30" x2={x} y2="360" />
                          ))}
                        </g>

                        {/* Axes */}
                        <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="55" y1="360" x2="565" y2="360" /> {/* X axis */}
                          <line x1="55" y1="25" x2="55" y2="360" />  {/* Y axis */}
                        </g>

                        {/* Axis Labels */}
                        <text x="310" y="390" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1">TEMPERATURE T (&deg;C)</text>
                        <text x="20" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1" transform="rotate(-90, 20, 195)">WEIGHT CONTENT (%)</text>

                        {/* TGA weight loss curve path */}
                        <path
                          d="M 55,60 L 260,60 Q 300,60 330,120 T 380,300 L 560,300"
                          fill="none"
                          stroke="#15803D"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* 1. Onset Temperature */}
                        <circle cx="300" cy="60" r="6" fill="#EA580C" stroke="#FFF" strokeWidth="2" />
                        <text x="300" y="45" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#EA580C">Td Onset (Thermal Degradation)</text>

                        {/* 2. Maximum Rate Point (Inflection) */}
                        <circle cx="345" cy="180" r="6" fill="#1D4ED8" stroke="#FFF" strokeWidth="2" />
                        <text x="355" y="175" fontSize="10" fontWeight="bold" fill="#1D4ED8">DTG Max Peak</text>

                        {/* 3. Ash/Residue */}
                        <line x1="380" y1="300" x2="560" y2="300" stroke="#CA8A04" strokeWidth="2" strokeDasharray="3,3" />
                        <text x="470" y="285" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#CA8A04">Ash Residue (e.g. Carbon Black/Glass)</text>
                      </svg>
                      <figcaption className="mt-4 text-xs font-sans text-slate-500 text-center">
                        📈 Material: <strong>{material}</strong> | TGA trace plotting weight retention percentage against rising thermal exposure to determine decomposition onset and final mineral filler content.
                      </figcaption>
                    </figure>
                  )
                }

                // Rheology Viscosity Graph
                if (lang === 'graph-viscosity') {
                  const parts = rawCode.split('|')
                  const material = parts[0] || 'Polymer Melt (e.g., LLDPE / HDPE)'
                  return (
                    <figure className="my-8 bg-white border-4 border-ink rounded-2xl p-6 shadow-hard">
                      <div className="font-sans text-sm font-black uppercase text-ink tracking-wider mb-4 flex items-center gap-2 border-b-2 border-ink/10 pb-2">
                        <span className="w-2.5 h-2.5 bg-orange-600 rounded-full" />
                        Melt Rheology: Viscosity vs. Shear Rate (Log-Log)
                      </div>
                      <svg viewBox="0 0 600 400" className="w-full h-auto font-sans">
                        {/* Grid Lines */}
                        <g stroke="#F1F5F9" strokeWidth="1.5">
                          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(y => (
                            <line key={y} x1="55" y1={y} x2="560" y2={y} />
                          ))}
                          {[120, 190, 260, 330, 400, 470, 540].map(x => (
                            <line key={x} x1={x} y1="30" x2={x} y2="360" />
                          ))}
                        </g>

                        {/* Axes */}
                        <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="55" y1="360" x2="565" y2="360" /> {/* X axis */}
                          <line x1="55" y1="25" x2="55" y2="360" />  {/* Y axis */}
                        </g>

                        {/* Axis Labels */}
                        <text x="310" y="390" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1">LOG SHEAR RATE &gamma;&bull; (s&macr;&sup1;)</text>
                        <text x="20" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letter-spacing="1" transform="rotate(-90, 20, 195)">LOG SHEAR VISCOSITY &eta; (Pa&bull;s)</text>

                        {/* Rheology curve path */}
                        <path
                          d="M 55,60 L 180,60 Q 240,60 300,120 L 520,320"
                          fill="none"
                          stroke="#EA580C"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* 1. Zero Shear Viscosity */}
                        <circle cx="120" cy="60" r="6" fill="#1D4ED8" stroke="#FFF" strokeWidth="2" />
                        <text x="128" y="52" fontSize="10" fontWeight="bold" fill="#1D4ED8">Zero-Shear Newtonian Plateau (&eta;0)</text>

                        {/* 2. Shear Thinning onset */}
                        <circle cx="245" cy="70" r="6" fill="#CA8A04" stroke="#FFF" strokeWidth="2" />
                        <text x="255" y="85" fontSize="10" fontWeight="bold" fill="#CA8A04">Critical Shear Rate (&gamma;&bull;c)</text>

                        {/* 3. Power Law (pseudoplastic) region */}
                        <text x="420" y="210" fontSize="11" fontWeight="bold" fill="#EA580C" transform="rotate(40, 420, 210)">Power Law Region (Shear Thinning)</text>
                      </svg>
                      <figcaption className="mt-4 text-xs font-sans text-slate-500 text-center">
                        📈 Material: <strong>{material}</strong> | Viscosity plot illustrating non-Newtonian pseudoplastic melt behavior. Apparent viscosity drops dramatically at elevated processing shear rates.
                      </figcaption>
                    </figure>
                  )
                }

                // Fallback to standard pre block
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
