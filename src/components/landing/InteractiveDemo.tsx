'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Calculator, Wrench, ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react'

// ─── 1. DEFECT DATA ────────────────────────────────────────────────────────────
const DEMO_DEFECTS = [
  {
    id: 'sink-marks',
    name: 'Sink Marks',
    severity: 'Moderate',
    process: 'Injection Moulding',
    cause: 'Insufficient holding pressure or premature gate freeze-off causing the molten core to contract away from cavity walls during cooling.',
    fix: 'Increase holding pressure by 10–15% and extend hold time by 1.5 seconds until gate freeze-off is confirmed by part weight measurement.',
    source: 'Rosato Injection Molding Handbook & SPI Standards',
  },
  {
    id: 'short-shots',
    name: 'Short Shots',
    severity: 'Critical',
    process: 'Injection Moulding',
    cause: 'Inadequate injection pressure, low melt temperature, or blocked mould venting causing incomplete cavity fill before freeze-off.',
    fix: 'Increase injection speed/pressure, check barrel heating band zones, and verify cavity parting line vent depth (0.02–0.04 mm for PP).',
    source: 'ASTM D3641 Guidelines',
  },
  {
    id: 'warpage',
    name: 'Part Warpage',
    severity: 'Moderate',
    process: 'Mould Cooling',
    cause: 'Non-uniform cooling rates between core and cavity mould halves, creating differential volumetric crystallization shrinkage.',
    fix: 'Equalize core/cavity water circuit temperatures and ensure cooling channel pitch-to-depth ratio is maintained within 2.0 to 2.5× diameter.',
    source: 'Ballman-Dutton Cooling Equations',
  },
  {
    id: 'flash',
    name: 'Parting Line Flash',
    severity: 'Moderate',
    process: 'Clamping System',
    cause: 'Peak cavity pressure exceeds machine clamping tonnage across total projected area, forcing mould parting faces apart.',
    fix: 'Reduce peak injection packing pressure or transfer production to a higher clamp-tonnage machine with greater platen rigidity.',
    source: 'Euromap 12 Machine Standards',
  },
]

// ─── 2. CALCULATOR FORMULA ─────────────────────────────────────────────────────
function calculateClamp(areaCm2: number, cavities: number, pressureBar: number) {
  const totalArea = areaCm2 * cavities
  const tonnage = (totalArea * pressureBar) / 1000 * 1.15 // 15% safety factor
  const forceKn = totalArea * (pressureBar / 10) * 1.15
  return {
    tonnage: Math.round(tonnage * 10) / 10,
    forceKn: Math.round(forceKn),
    totalArea,
  }
}

// ─── 3. SAMPLE LESSON DATA ─────────────────────────────────────────────────────
const DEMO_QUIZ = {
  question: 'In the step-growth polymerization of Nylon 6,6 from stoichiometric equimolar monomers (f_avg = 2.0), according to the Carothers equation, what extent of reaction (p) is required to achieve a number-average degree of polymerization (Xn) of 100?',
  options: [
    { label: 'A. 0.900 (90% conversion)', isCorrect: false },
    { label: 'B. 0.950 (95% conversion)', isCorrect: false },
    { label: 'C. 0.990 (99% conversion)', isCorrect: true },
    { label: 'D. 0.999 (99.9% conversion)', isCorrect: false },
  ],
  derivation: 'Carothers Equation: Xn = 1 / (1 - p). Rearranging for p: 1 - p = 1 / 100 = 0.01 ⇒ p = 0.99 (99% conversion). This mathematically proves why step-growth condensation polymerizations require near-total conversion (>99%) to achieve usable structural molecular weight.',
}

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'learn' | 'calculate' | 'troubleshoot'>('learn')

  // Calculator state
  const [area, setArea] = useState(120)
  const [cavities, setCavities] = useState(4)
  const [pressure, setPressure] = useState(400)

  // Defect state
  const [selectedDefect, setSelectedDefect] = useState(DEMO_DEFECTS[0])

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const calcResult = calculateClamp(area, cavities, pressure)

  return (
    <section id="interactive-demo" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Interactive Platform Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            Explore PolymerHub before signing up.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-sans">
            Try an actual sample lesson, run a live engineering calculation, or troubleshoot a factory defect. No account or payment required.
          </p>
        </div>

        {/* 3 Interactive Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1 max-w-2xl w-full justify-center">
            
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-white text-blue-600 shadow-md shadow-slate-200 border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Learn (Technical Lesson)</span>
            </button>

            <button
              onClick={() => setActiveTab('calculate')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calculate'
                  ? 'bg-white text-blue-600 shadow-md shadow-slate-200 border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>2. Calculate (Live Solver)</span>
            </button>

            <button
              onClick={() => setActiveTab('troubleshoot')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'troubleshoot'
                  ? 'bg-white text-blue-600 shadow-md shadow-slate-200 border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>3. Troubleshoot (Defect Fixer)</span>
            </button>

          </div>
        </div>

        {/* Interactive Working Container */}
        <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-2xl">
          
          {/* TAB 1: LEARN (Sample Technical Lesson) */}
          {activeTab === 'learn' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                    Polymer Chemistry &middot; Lesson 4
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-950 mt-1">
                    Carothers Equation &amp; Molecular Weight Growth
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                  Curriculum Sample
                </span>
              </div>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 font-sans leading-relaxed space-y-3">
                <p>
                  In step-growth polycondensation (e.g., Nylon 6,6, PET polyesters), polymer chains grow through stepwise condensation of functional end-groups. Unlike chain-growth addition polymerizations where high molecular weight polymers form almost instantaneously, step-growth requires exceptionally high functional group conversion ($p &gt; 98\%$) to reach commercial mechanical properties.
                </p>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
                  <div className="text-blue-600 font-bold text-xs uppercase">Canonical Carothers Derivation:</div>
                  <div className="text-sm font-bold text-slate-950 bg-white p-2.5 rounded-lg border border-slate-200">
                    X_n = 1 / (1 - p) &emsp; &middot; &emsp; p_c = 2 / f_avg
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Where <code className="text-amber-700 font-bold">X_n</code> is the number-average degree of polymerization, <code className="text-amber-700 font-bold">p</code> is the extent of reaction, and <code className="text-amber-700 font-bold">p_c</code> is the critical gel conversion for multifunctional systems.
                  </div>
                </div>
              </div>

              {/* In-Lesson Interactive Quiz */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                    Interactive Knowledge Check:
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-sans mb-4">
                  {DEMO_QUIZ.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {DEMO_QUIZ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx
                    let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    if (revealed) {
                      if (opt.isCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      else if (isSelected) btnStyle = 'bg-rose-50 border-rose-300 text-rose-800'
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-600 border-blue-500 text-white font-bold'
                    }

                    return (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setSelectedOption(idx)
                          setRevealed(true)
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt.label}</span>
                        {revealed && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {revealed && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {revealed && (
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-sans text-slate-800 leading-relaxed space-y-2">
                    <div className="font-mono text-emerald-800 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mathematical Derivation:
                    </div>
                    <div>{DEMO_QUIZ.derivation}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CALCULATE (Live Engineering Solver) */}
          {activeTab === 'calculate' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider">
                    Tooling &amp; Machinery &middot; Industrial Solver
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-950 mt-1">
                    Injection Mould Clamping Tonnage Solver
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
                  Working Tool
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Input 1: Projected Area */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-700">
                    <span>Part Projected Area:</span>
                    <span className="font-bold text-amber-700">{area} cm&sup2;</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>20 cm&sup2;</span>
                    <span>500 cm&sup2;</span>
                  </div>
                </div>

                {/* Input 2: Cavity Count */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-700">
                    <span>Cavity Multiplier:</span>
                    <span className="font-bold text-amber-700">{cavities} Cavities</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={cavities}
                    onChange={(e) => setCavities(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>1 Cavity</span>
                    <span>16 Cavities</span>
                  </div>
                </div>

                {/* Input 3: Cavity Pressure */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-700">
                    <span>Cavity Pressure:</span>
                    <span className="font-bold text-amber-700">{pressure} bar</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    step="25"
                    value={pressure}
                    onChange={(e) => setPressure(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>200 bar (PE/PP)</span>
                    <span>800 bar (PC/PA)</span>
                  </div>
                </div>

              </div>

              {/* Real-Time Calculation Output Box */}
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono uppercase text-amber-800 font-bold">
                    Calculated Machine Requirement (15% Safety Margin):
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-950 mt-1">
                    {calcResult.tonnage} Metric Tons
                  </div>
                  <div className="text-xs font-mono text-slate-600 mt-1">
                    Total Clamping Force: <strong className="text-slate-900">{calcResult.forceKn} kN</strong> across {calcResult.totalArea} cm&sup2; projected area.
                  </div>
                </div>

                <Link
                  href="/calculators"
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <span>All 8 Calculators</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: TROUBLESHOOT (Injection Moulding Defect Fixer) */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                    Shop-Floor Processing &middot; Defect Diagnostics
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-950 mt-1">
                    Injection Moulding Troubleshooting Engine
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                  Rosato Grounded
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DEMO_DEFECTS.map((defect) => {
                  const isSelected = selectedDefect.id === defect.id
                  return (
                    <button
                      key={defect.id}
                      onClick={() => setSelectedDefect(defect)}
                      className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="truncate">{defect.name}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">{defect.severity}</div>
                    </button>
                  )
                })}
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase">Selected Defect:</span>
                    <h4 className="text-xl font-bold font-display text-slate-950">{selectedDefect.name}</h4>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-amber-700 font-bold">
                    {selectedDefect.process}
                  </span>
                </div>

                <div className="space-y-3 font-sans text-xs sm:text-sm">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-rose-700 uppercase block mb-1">
                      Physical Root Cause:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedDefect.cause}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                      Shop-Floor Recommended Parameter Fix:
                    </span>
                    <p className="text-emerald-950 leading-relaxed font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      {selectedDefect.fix}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-slate-500">
                    Source: {selectedDefect.source}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Bottom Conversion Prompt */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-600">
              Ready to access all 216 lessons, 8 industrial solvers &amp; GATE XE-F mocks?
            </span>
            <Link
              href="/login?mode=signup"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
