'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wrench, Calculator, Trophy, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Sparkles, RotateCcw } from 'lucide-react'

// ─── 1. DEFECT DATA ────────────────────────────────────────────────────────────
const DEMO_DEFECTS = [
  {
    id: 'sink-marks',
    name: 'Sink Marks',
    severity: 'Moderate',
    process: 'Injection Moulding',
    cause: 'Insufficient holding pressure or premature gate freeze-off causing the molten core to contract away from cavity walls.',
    fix: 'Increase holding pressure by 10–15% and extend hold time by 1.5 seconds until gate freeze-off is confirmed by part weight.',
    source: 'Rosato Injection Molding Handbook & SPI Standards',
  },
  {
    id: 'short-shots',
    name: 'Short Shots',
    severity: 'Critical',
    process: 'Injection Moulding',
    cause: 'Inadequate injection pressure, low melt temperature, or inadequate mold venting causing incomplete cavity fill.',
    fix: 'Increase injection speed/pressure, check barrel heating zones, and verify cavity parting line vent depth (0.02–0.04 mm for PP).',
    source: 'ASTM D3641 Guidelines',
  },
  {
    id: 'warpage',
    name: 'Part Warpage',
    severity: 'Moderate',
    process: 'Mould Cooling',
    cause: 'Non-uniform cooling rates between core and cavity sides or differential crystallization shrinkage.',
    fix: 'Equalize core/cavity water circuit temperatures and ensure cooling channel pitch-to-depth ratio is within 2.0 to 2.5× diameter.',
    source: 'Ballman-Dutton Cooling Equations',
  },
  {
    id: 'flash',
    name: 'Parting Line Flash',
    severity: 'Minor / Moderate',
    process: 'Clamping System',
    cause: 'Cavity pressure exceeds machine clamping tonnage across total projected area, forcing mould halves apart.',
    fix: 'Reduce injection peak pressure or transfer part to a higher clamp-tonnage injection press with higher platen rigidity.',
    source: 'Euromap 12 Machine Standards',
  },
]

// ─── 2. CALCULATOR DATA ────────────────────────────────────────────────────────
// Clamping Tonnage: F = (Area * Pressure / 1000) * SafetyFactor
function calculateClamp(areaCm2: number, cavities: number, pressureBar: number) {
  const totalArea = areaCm2 * cavities
  const tonnage = (totalArea * pressureBar) / 1000 * 1.15 // 15% safety factor
  return Math.round(tonnage * 10) / 10
}

// ─── 3. GATE QUESTION DATA ─────────────────────────────────────────────────────
const DEMO_GATE_QUESTION = {
  question: 'In step-growth (condensation) polymerization of Nylon 6,6 from stoichiometric equimolar monomers (f_avg = 2.0), according to the Carothers equation, what extent of reaction (p) is required to achieve a number-average degree of polymerization (Xn) of 100?',
  options: [
    { label: 'A. 0.900 (90% conversion)', isCorrect: false },
    { label: 'B. 0.950 (95% conversion)', isCorrect: false },
    { label: 'C. 0.990 (99% conversion)', isCorrect: true },
    { label: 'D. 0.999 (99.9% conversion)', isCorrect: false },
  ],
  derivation: 'Carothers Equation for equimolar stoichiometric bifunctional monomers: Xn = 1 / (1 - p). Rearranging for p: 1 - p = 1 / 100 = 0.01 ⇒ p = 0.99 (99% conversion). This mathematically proves why step-growth polycondensations require near-total conversion (>99%) to achieve structural molecular weights.',
}

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'defect' | 'calc' | 'gate'>('defect')

  // Defect state
  const [selectedDefect, setSelectedDefect] = useState(DEMO_DEFECTS[0])

  // Calc state
  const [area, setArea] = useState(120)
  const [cavities, setCavities] = useState(4)
  const [pressure, setPressure] = useState(400)

  // GATE question state
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const computedTonnage = calculateClamp(area, cavities, pressure)

  return (
    <section id="interactive-demo" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Interactive Aha Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            Try PolymerHub right now. No signup required.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-sans">
            Test real engineering diagnostics, interactive calculations, or GATE problem-solving before creating an account.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1 max-w-xl w-full justify-center">
            <button
              onClick={() => setActiveTab('defect')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'defect'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>1. Defect Troubleshooter</span>
            </button>

            <button
              onClick={() => setActiveTab('calc')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calc'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>2. Clamp Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('gate')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'gate'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>3. GATE Question</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Window */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border-2 border-slate-800 shadow-2xl max-w-4xl mx-auto">
          
          {/* TAB 1: DEFECT TROUBLESHOOTER */}
          {activeTab === 'defect' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    Select a Shop-Floor Moulding Defect:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_DEFECTS.map((defect) => (
                      <button
                        key={defect.id}
                        onClick={() => setSelectedDefect(defect)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedDefect.id === defect.id
                            ? 'bg-blue-500 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {defect.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Standard Reference</span>
                  <span className="text-xs font-mono font-bold text-slate-200">Rosato Guidelines</span>
                </div>
              </div>

              {/* Defect Output Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                      Process: {selectedDefect.process}
                    </span>
                    <span className="text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                      {selectedDefect.severity} Severity
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {selectedDefect.name}
                  </h3>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong className="text-slate-100 font-bold block mb-1">Root Engineering Cause:</strong>
                    {selectedDefect.cause}
                  </div>
                </div>

                <div className="space-y-3 bg-blue-950/40 p-4 rounded-xl border border-blue-900/40 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Recommended Parameter Adjustment:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                      {selectedDefect.fix}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-blue-900/60 text-[10px] font-mono text-slate-400">
                    Source: {selectedDefect.source}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs font-mono">
                <span className="text-slate-400">Want to diagnose flash, splay, jetting, or knit lines?</span>
                <Link href="/troubleshooter" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                  Open Full Troubleshooter &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: CLAMP CALCULATOR */}
          {activeTab === 'calc' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  ASTM D3641 / ISO 294 Clamping Tonnage Formula:
                </span>
                <p className="text-xs text-slate-400 font-mono">
                  Formula: Clamp (Tons) = (Projected Area cm² × Cavities × Cavity Pressure bar / 1000) × 1.15 Safety Factor
                </p>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Part Area (cm²):</span>
                    <strong className="text-white">{area} cm²</strong>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={10}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-500 block">Single part projected area</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Mould Cavities:</span>
                    <strong className="text-white">{cavities} Cavities</strong>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={16}
                    step={1}
                    value={cavities}
                    onChange={(e) => setCavities(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-500 block">Number of tool cavities</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Cavity Pressure:</span>
                    <strong className="text-white">{pressure} bar</strong>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={800}
                    step={25}
                    value={pressure}
                    onChange={(e) => setPressure(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-500 block">Typical for PP/HDPE</span>
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-6 rounded-2xl border border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-blue-300 uppercase tracking-wider block mb-1">
                    Minimum Required Machine Clamp:
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    {computedTonnage} <span className="text-lg font-sans font-normal text-slate-300">Metric Tons</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                    Recommended Machine Class: {Math.ceil(computedTonnage / 25) * 25} Ton Press
                  </span>
                </div>

                <Link
                  href="/calculators"
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Explore All 8 Solvers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: GATE QUESTION */}
          {activeTab === 'gate' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  GATE XE-F Practice &middot; Condensation Kinetics (2 Marks)
                </span>
                {revealed && (
                  <button
                    onClick={() => { setSelectedOption(null); setRevealed(false) }}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
                {DEMO_GATE_QUESTION.question}
              </p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_GATE_QUESTION.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx
                  let btnColor = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-600'
                  if (revealed) {
                    if (opt.isCorrect) btnColor = 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                    else if (isChosen && !opt.isCorrect) btnColor = 'bg-rose-950/70 border-rose-500 text-rose-200'
                  } else if (isChosen) {
                    btnColor = 'bg-blue-950 border-blue-500 text-white'
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={revealed}
                      onClick={() => {
                        setSelectedOption(idx)
                        setRevealed(true)
                      }}
                      className={`p-3.5 rounded-xl border text-left text-xs font-mono font-semibold transition-all cursor-pointer ${btnColor}`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>

              {/* Derivation reveal */}
              {revealed && (
                <div className="p-5 rounded-2xl bg-blue-950/50 border border-blue-800/80 space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    {selectedOption === 2 ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer: Option C (99%)
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect. Correct Answer is Option C (99%)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed pt-1">
                    <strong className="text-white block mb-0.5 font-bold">Step-by-Step Derivation:</strong>
                    {DEMO_GATE_QUESTION.derivation}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 text-xs font-mono">
                <span className="text-slate-400">Ready to practice more syllabus-mapped questions?</span>
                <Link href="/gate-mock" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                  Take Full 60-Min Mock &rarr;
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  )
}
