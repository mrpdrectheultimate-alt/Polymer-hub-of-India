'use client'

import { useState, useMemo } from 'react'
import {
  Activity,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  XCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react'

export type RunnerLayout = 'h_pattern' | 'radial' | 'fishbone' | 'artificially_balanced'

export default function InteractiveRunnerSimulator() {
  // Runner Simulation Parameters (Power-Law Rheology)
  const [layout, setLayout] = useState<RunnerLayout>('h_pattern')
  const [runnerRadius, setRunnerRadius] = useState<number>(3.5) // mm
  const [flowRate, setFlowRate] = useState<number>(45) // cm³/s
  const [runnerLength, setRunnerLength] = useState<number>(120) // mm
  const [powerLawIndex, setPowerLawIndex] = useState<number>(0.35) // n for shear-thinning PP/HDPE
  const [consistencyIndex, setConsistencyIndex] = useState<number>(8500) // K in Pa·s^n

  // Decision scenario state
  const [selectedScenarioChoice, setSelectedScenarioChoice] = useState<number | null>(null)
  const [showScenarioFeedback, setShowScenarioFeedback] = useState(false)

  // Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Active step in interactive worked example
  const [workedStep, setWorkedStep] = useState<number>(1)
  const [studentInputRatio, setStudentInputRatio] = useState<string>('')
  const [ratioFeedback, setRatioFeedback] = useState<'correct' | 'incorrect' | null>(null)

  // Physics calculation: Power-law pressure drop in circular runner
  // ΔP = (2 * K * L / R) * ((3n + 1) * Q / (pi * n * R^3))^n
  const { pressureDropBar, cavityFills, balanceScore, isBalanced } = useMemo(() => {
    // Radius in meters
    const R_m = runnerRadius / 1000
    // Length in meters
    const L_m = runnerLength / 1000
    // Flow rate in m³/s
    const Q_m3s = (flowRate * 1e-6) / 4 // 4 cavities

    const n = powerLawIndex
    const K = consistencyIndex

    const apparentShearRate = ((3 * n + 1) * Q_m3s) / (Math.PI * n * Math.pow(R_m, 3))
    const wallShearStress = K * Math.pow(Math.max(1, apparentShearRate), n)
    const deltaP_Pa = (2 * L_m * wallShearStress) / R_m
    const deltaP_Bar = Math.round(deltaP_Pa / 100000)

    // Calculate cavity fill percentage based on layout
    let c1 = 100
    let c2 = 100
    let c3 = 100
    let c4 = 100

    if (layout === 'h_pattern') {
      // Naturally geometrically balanced
      c1 = 100
      c2 = 100
      c3 = 100
      c4 = 100
    } else if (layout === 'radial') {
      // Star balanced
      c1 = 100
      c2 = 100
      c3 = 100
      c4 = 100
    } else if (layout === 'fishbone') {
      // Unbalanced branching: inner cavities fill first, outer starve
      c1 = 100
      c2 = 100
      c3 = 84
      c4 = 82
    } else if (layout === 'artificially_balanced') {
      // Artificially adjusted secondary diameters
      c1 = 99
      c2 = 100
      c3 = 98
      c4 = 99
    }

    const avgFill = (c1 + c2 + c3 + c4) / 4
    const maxDiff = Math.max(Math.abs(c1 - avgFill), Math.abs(c2 - avgFill), Math.abs(c3 - avgFill), Math.abs(c4 - avgFill))
    const score = Math.max(0, Math.round(100 - maxDiff * 4))

    return {
      pressureDropBar: deltaP_Bar,
      cavityFills: [c1, c2, c3, c4],
      balanceScore: score,
      isBalanced: score >= 95
    }
  }, [runnerRadius, runnerLength, flowRate, powerLawIndex, consistencyIndex, layout])

  return (
    <div className="space-y-12 my-10 font-sans">

      {/* ============================================================ */}
      {/* 1. SIGNATURE INTERACTIVE RUNNER SIMULATOR LAB */}
      {/* ============================================================ */}
      <section className="bg-slate-950 text-white rounded-3xl border-2 border-slate-800 shadow-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
        
        {/* Lab Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[11px] font-mono font-bold uppercase">
              <Activity className="h-3.5 w-3.5 text-blue-400" />
              Interactive Injection Mold Rheology Lab
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              4-Cavity Runner Pressure &amp; Fill Simulator
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Non-Newtonian Ostwald-de Waele Power-Law Fluid Dynamics Model
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLayout('h_pattern')
              setRunnerRadius(3.5)
              setFlowRate(45)
              setRunnerLength(120)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-mono transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Parameters
          </button>
        </div>

        {/* Layout Selector Pills */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-slate-400 font-bold block">
            Select Runner Delivery Architecture:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'h_pattern', name: 'Naturally Balanced H-Pattern', sub: 'Equal Path Length (L1 = L2)' },
              { id: 'radial', name: 'Radial Star Layout', sub: 'Circular Symmetry' },
              { id: 'fishbone', name: 'Standard Fishbone Branch', sub: 'Unequal Flow Resistance ✕' },
              { id: 'artificially_balanced', name: 'Artificially Sized Restrictors', sub: 'Compensated Secondary Diams' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLayout(item.id as RunnerLayout)}
                className={`
                  p-3 rounded-2xl text-left border transition-all flex flex-col justify-between
                  ${layout === item.id
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg ring-2 ring-blue-500/30'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }
                `}
              >
                <span className="font-mono font-bold text-xs leading-tight">{item.name}</span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Lab Workspace: Sliders + Live SVG Fill Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Slider 1: Runner Radius */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold">Runner Radius (R)</span>
                <span className="text-amber-400 font-bold">{runnerRadius} mm (Ø {(runnerRadius * 2).toFixed(1)} mm)</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="6.0"
                step="0.1"
                value={runnerRadius}
                onChange={(e) => setRunnerRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <p className="text-[10px] font-mono text-slate-400">Pressure drop scales inversely with R^(3n+1)</p>
            </div>

            {/* Slider 2: Flow Rate Q */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold">Volumetric Injection Rate (Q)</span>
                <span className="text-blue-400 font-bold">{flowRate} cm³/s</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={flowRate}
                onChange={(e) => setFlowRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            {/* Slider 3: Primary Runner Length */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold">Primary Runner Length (L)</span>
                <span className="text-emerald-400 font-bold">{runnerLength} mm</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={runnerLength}
                onChange={(e) => setRunnerLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Resin Rheology Preset */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 block">Resin Shear-Thinning (n Index)</span>
              <div className="flex gap-2">
                {[
                  { name: 'PP (n=0.35)', n: 0.35, k: 8500 },
                  { name: 'HDPE (n=0.40)', n: 0.40, k: 9200 },
                  { name: 'PC (n=0.65)', n: 0.65, k: 14000 },
                ].map((resin) => (
                  <button
                    key={resin.name}
                    type="button"
                    onClick={() => {
                      setPowerLawIndex(resin.n)
                      setConsistencyIndex(resin.k)
                    }}
                    className={`
                      px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-colors
                      ${powerLawIndex === resin.n ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-transparent text-slate-300 border-white/20'}
                    `}
                  >
                    {resin.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Mold SVG Visualizer & Cavity Fill State (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-between space-y-6">
            
            <div className="w-full flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">4-Cavity Tool Layout View</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${isBalanced ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                  {isBalanced ? '✓ Geometrically Balanced' : '✕ Unbalanced (Hesitation & Flash Risk)'}
                </span>
                <span className="font-bold text-amber-400">Score: {balanceScore}/100</span>
              </div>
            </div>

            {/* SVG Interactive Mold Blueprint */}
            <div className="w-full max-w-md h-56 relative flex items-center justify-center bg-slate-950 rounded-2xl border border-white/10 p-4">
              <svg viewBox="0 0 320 200" className="w-full h-full">
                {/* Sprue Center */}
                <circle cx="160" cy="100" r="10" fill="#F59E0B" stroke="#FBBF24" strokeWidth="2" />
                <text x="160" y="104" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#000">SPRUE</text>

                {layout === 'h_pattern' && (
                  <g>
                    {/* Primary horizontal branches */}
                    <line x1="160" y1="100" x2="90" y2="100" stroke="#3B82F6" strokeWidth={runnerRadius * 1.5} strokeLinecap="round" />
                    <line x1="160" y1="100" x2="230" y2="100" stroke="#3B82F6" strokeWidth={runnerRadius * 1.5} strokeLinecap="round" />
                    {/* Secondary vertical branches */}
                    <line x1="90" y1="100" x2="90" y2="45" stroke="#3B82F6" strokeWidth={runnerRadius * 1.2} strokeLinecap="round" />
                    <line x1="90" y1="100" x2="90" y2="155" stroke="#3B82F6" strokeWidth={runnerRadius * 1.2} strokeLinecap="round" />
                    <line x1="230" y1="100" x2="230" y2="45" stroke="#3B82F6" strokeWidth={runnerRadius * 1.2} strokeLinecap="round" />
                    <line x1="230" y1="100" x2="230" y2="155" stroke="#3B82F6" strokeWidth={runnerRadius * 1.2} strokeLinecap="round" />
                  </g>
                )}

                {layout === 'radial' && (
                  <g>
                    <line x1="160" y1="100" x2="90" y2="45" stroke="#3B82F6" strokeWidth={runnerRadius * 1.4} strokeLinecap="round" />
                    <line x1="160" y1="100" x2="90" y2="155" stroke="#3B82F6" strokeWidth={runnerRadius * 1.4} strokeLinecap="round" />
                    <line x1="160" y1="100" x2="230" y2="45" stroke="#3B82F6" strokeWidth={runnerRadius * 1.4} strokeLinecap="round" />
                    <line x1="160" y1="100" x2="230" y2="155" stroke="#3B82F6" strokeWidth={runnerRadius * 1.4} strokeLinecap="round" />
                  </g>
                )}

                {layout === 'fishbone' && (
                  <g>
                    {/* Main spine */}
                    <line x1="160" y1="100" x2="60" y2="100" stroke="#EF4444" strokeWidth={runnerRadius * 1.5} />
                    <line x1="160" y1="100" x2="260" y2="100" stroke="#EF4444" strokeWidth={runnerRadius * 1.5} />
                    {/* Inner runners */}
                    <line x1="120" y1="100" x2="120" y2="50" stroke="#10B981" strokeWidth={runnerRadius * 1.2} />
                    <line x1="200" y1="100" x2="200" y2="50" stroke="#10B981" strokeWidth={runnerRadius * 1.2} />
                    {/* Outer runners with longer path */}
                    <line x1="70" y1="100" x2="70" y2="150" stroke="#F59E0B" strokeWidth={runnerRadius * 1.2} />
                    <line x1="250" y1="100" x2="250" y2="150" stroke="#F59E0B" strokeWidth={runnerRadius * 1.2} />
                  </g>
                )}

                {layout === 'artificially_balanced' && (
                  <g>
                    <line x1="160" y1="100" x2="60" y2="100" stroke="#3B82F6" strokeWidth={runnerRadius * 1.6} />
                    <line x1="160" y1="100" x2="260" y2="100" stroke="#3B82F6" strokeWidth={runnerRadius * 1.6} />
                    {/* Restricted inner gate */}
                    <line x1="120" y1="100" x2="120" y2="50" stroke="#3B82F6" strokeWidth={runnerRadius * 0.9} />
                    <line x1="200" y1="100" x2="200" y2="50" stroke="#3B82F6" strokeWidth={runnerRadius * 0.9} />
                    {/* Enlarged outer runner */}
                    <line x1="70" y1="100" x2="70" y2="150" stroke="#3B82F6" strokeWidth={runnerRadius * 1.4} />
                    <line x1="250" y1="100" x2="250" y2="150" stroke="#3B82F6" strokeWidth={runnerRadius * 1.4} />
                  </g>
                )}

                {/* 4 Cavities with Fill Bars */}
                {/* Cavity 1 (Top Left) */}
                <rect x="65" y="20" width="50" height="30" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                <rect x="65" y="20" width={50 * (cavityFills[0] / 100)} height="30" rx="4" fill={cavityFills[0] >= 98 ? '#10B981' : '#F59E0B'} opacity="0.8" />
                <text x="90" y="38" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFF">C1: {cavityFills[0]}%</text>

                {/* Cavity 2 (Top Right) */}
                <rect x="205" y="20" width="50" height="30" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                <rect x="205" y="20" width={50 * (cavityFills[1] / 100)} height="30" rx="4" fill={cavityFills[1] >= 98 ? '#10B981' : '#F59E0B'} opacity="0.8" />
                <text x="230" y="38" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFF">C2: {cavityFills[1]}%</text>

                {/* Cavity 3 (Bottom Left) */}
                <rect x="65" y="150" width="50" height="30" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                <rect x="65" y="150" width={50 * (cavityFills[2] / 100)} height="30" rx="4" fill={cavityFills[2] >= 98 ? '#10B981' : '#EF4444'} opacity="0.8" />
                <text x="90" y="168" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFF">C3: {cavityFills[2]}%</text>

                {/* Cavity 4 (Bottom Right) */}
                <rect x="205" y="150" width="50" height="30" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                <rect x="205" y="150" width={50 * (cavityFills[3] / 100)} height="30" rx="4" fill={cavityFills[3] >= 98 ? '#10B981' : '#EF4444'} opacity="0.8" />
                <text x="230" y="168" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFF">C4: {cavityFills[3]}%</text>
              </svg>
            </div>

            {/* Calculated Pressure Drop Indicator */}
            <div className="w-full grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Runner Delta P</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400">{pressureDropBar} bar</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Flow Imbalance</span>
                <span className={`text-2xl sm:text-3xl font-black ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {100 - balanceScore}%
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. GUIDED WORKED EXAMPLE: STEP-BY-STEP CALCULATION */}
      {/* ============================================================ */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
              Interactive Worked Example
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Balancing a 4-Cavity Unbalanced Branching Runner
            </h3>
          </div>
        </div>

        {/* Problem Statement Box */}
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 text-sm leading-relaxed text-slate-800 space-y-2">
          <p className="font-bold text-blue-900">
            Problem Scenario:
          </p>
          <p>
            An injection mould for automotive connectors uses polypropylene (n = 0.35). The primary runner branch to Cavity 1 has length L1 = 60 mm with radius R1 = 3.0 mm. The outer branch to Cavity 4 has length L4 = 120 mm.
          </p>
          <p className="font-bold text-slate-900">
            Task: Calculate the required secondary runner radius R4 such that both branches experience identical pressure drop (&Delta;P1 = &Delta;P4) at equal flow rates (Q1 = Q4).
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(step => (
              <button
                key={step}
                type="button"
                onClick={() => setWorkedStep(step)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all
                  ${workedStep === step ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                Step {step}: {step === 1 ? 'Governing Formula' : step === 2 ? 'Solve for R4/R1' : 'Final Numerical Radius'}
              </button>
            ))}
          </div>

          {workedStep === 1 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Step 1: Power-Law Runner Pressure Equation</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                For an Ostwald-de Waele power law fluid:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center font-mono text-sm font-bold text-blue-900">
                &Delta;P = [2 &middot; K &middot; L / R] &middot; [(3n + 1) &middot; Q / (&pi; &middot; n &middot; R&sup3;)]ⁿ = 2 &middot; K &middot; L &middot; [(3n + 1)Q / (&pi;n)]ⁿ &middot; R⁻⁽³ⁿ⁺¹⁾
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Therefore, for equal flow rate Q, &Delta;P is proportional to L &middot; R⁻⁽³ⁿ⁺¹⁾.
              </p>
            </div>
          )}

          {workedStep === 2 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Step 2: Equating Pressure Drops (&Delta;P1 = &Delta;P4)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setting L1 &middot; R1⁻⁽³ⁿ⁺¹⁾ = L4 &middot; R4⁻⁽³ⁿ⁺¹⁾ yields the balancing radius ratio:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center font-mono text-sm font-bold text-purple-900">
                R4 / R1 = (L4 / L1) ^ [1 / (3n + 1)] = (120 / 60) ^ [1 / (3(0.35) + 1)] = (2.0) ^ (1 / 2.05)
              </div>

              {/* Student Check Box */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <label className="text-xs font-mono font-bold text-slate-700 block">
                  Calculate the ratio (2.0)^(1 / 2.05) (Enter value between 1.30 and 1.50):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1.40"
                    value={studentInputRatio}
                    onChange={(e) => setStudentInputRatio(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono border rounded-lg w-36"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = parseFloat(studentInputRatio)
                      if (val >= 1.39 && val <= 1.42) {
                        setRatioFeedback('correct')
                      } else {
                        setRatioFeedback('incorrect')
                      }
                    }}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-mono font-bold"
                  >
                    Check
                  </button>
                </div>

                {ratioFeedback === 'correct' && (
                  <p className="text-xs text-emerald-600 font-mono font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Correct! (2.0)^0.4878 = 1.402
                  </p>
                )}
                {ratioFeedback === 'incorrect' && (
                  <p className="text-xs text-rose-500 font-mono font-bold flex items-center gap-1 mt-1">
                    <XCircle className="h-3.5 w-3.5" /> Close! (2.0)^(1/2.05) = 1.402. Try again!
                  </p>
                )}
              </div>
            </div>
          )}

          {workedStep === 3 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Step 3: Final Compensated Radius</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applying the 1.402 multiplier to the base radius R1 = 3.0 mm:
              </p>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center font-mono text-base font-bold text-emerald-900">
                R4 = 1.402 &times; 3.0 mm = 4.21 mm &nbsp; (Diameter Ø4 = 8.42 mm)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                ✓ With R4 = 4.21 mm, the outer cavity receives identical volumetric flow rate Q at exactly equal pressure drop.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INSTANT KNOWLEDGE CHECK */}
      {/* ============================================================ */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          <div>
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
              Instant Knowledge Check
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Shear-Thinning Sensitivity in Runner Sizing
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          For a Newtonian fluid (n = 1), doubling the flow rate through a circular runner increases the pressure drop by 2^1 = 2&times;. For a highly shear-thinning polypropylene (n = 0.35), how much does the pressure drop increase when flow rate Q is doubled?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 0, text: 'A) 2.00× (Same as Newtonian)' },
            { id: 1, text: 'B) 1.27× [2^0.35 = 1.27] (Correct: shear-thinning buffers ΔP)' },
            { id: 2, text: 'C) 4.00× (Proportional to velocity squared)' },
            { id: 3, text: 'D) 0.50× (Viscosity drops in half)' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setQuizAnswer(opt.id)
                setQuizSubmitted(true)
              }}
              className={`
                p-3.5 rounded-2xl border text-left text-xs font-mono transition-all
                ${quizAnswer === opt.id
                  ? opt.id === 1
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                    : 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {quizSubmitted && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono leading-relaxed">
            {quizAnswer === 1 ? (
              <span className="text-emerald-700 font-bold">
                ✓ Correct! Because &Delta;P is proportional to Qⁿ, when Q doubles, &Delta;P only increases by 2^0.35 &asymp; 1.27&times;. This pseudoplastic behavior is why injection molders can inject at very high speeds without exponential pressure spikes.
              </span>
            ) : (
              <span className="text-rose-600 font-bold">
                ✕ Not quite. Remember that for an Ostwald-de Waele fluid, &Delta;P is proportional to Qⁿ. For n = 0.35, 2^0.35 &asymp; 1.27&times;.
              </span>
            )}
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 4. REAL-WORLD ENGINEERING DECISION SCENARIO */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl border-2 border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Tooling Engineer Decision Scenario
            </span>
            <h3 className="text-xl font-black text-white">
              Troubleshooting Mold Imbalance on the Shop Floor
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          <strong>Shop Floor Report:</strong> An 8-cavity geometrically balanced &apos;H&apos; mold for thin-wall polypropylene caps is showing a 15% weight difference between inner and outer cavities, causing flash on inner caps and short shots on outer caps. What is the root cause and primary corrective tooling decision?
        </p>

        <div className="space-y-3">
          {[
            {
              id: 0,
              title: 'A) Shear-Induced Melt Imbalance (Beaumont Effect)',
              explanation: 'High-shear melt laminates along runner walls and peels unevenly into branches. Solution: Install a MeltFlipper® or rotate runner split 90°.'
            },
            {
              id: 1,
              title: 'B) Increase injection speed to overcome cooling',
              explanation: 'Increasing injection speed will actually intensify wall shear friction, making melt thermal imbalance worse.'
            },
            {
              id: 2,
              title: 'C) Machine the outer gates 30% larger without analyzing shear history',
              explanation: 'Modifying gates directly is irreversible and only fixes flow at one injection speed; any change in processing speed destroys the balance again.'
            }
          ].map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => {
                setSelectedScenarioChoice(choice.id)
                setShowScenarioFeedback(true)
              }}
              className={`
                w-full p-4 rounded-2xl text-left border text-xs font-mono transition-all
                ${selectedScenarioChoice === choice.id
                  ? choice.id === 0
                    ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                    : 'bg-rose-500/20 border-rose-400 text-white font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }
              `}
            >
              <div className="font-bold text-sm mb-1">{choice.title}</div>
              {showScenarioFeedback && selectedScenarioChoice === choice.id && (
                <div className={`text-xs mt-2 pt-2 border-t border-white/10 ${choice.id === 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {choice.explanation}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. AUTHORITATIVE TEXTBOOK REFERENCES */}
      {/* ============================================================ */}
      <section className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs font-mono space-y-2">
        <span className="font-bold uppercase tracking-wider text-slate-700 block">
          📚 Engineering Standards &amp; Textbook Citations
        </span>
        <ul className="space-y-1.5 text-slate-600">
          <li>&bull; Beaumont, J. — <em>Runner and Gating Design Handbook</em>, 3rd Edition, Hanser Publications, Chapter 4 (Runner Balancing &amp; Shear-Induced Flow Imbalance).</li>
          <li>&bull; Menges, G., Michaeli, W., &amp; Mohren, P. — <em>How to Make Injection Molds</em>, 3rd Ed., Hanser, Section 7.3.</li>
          <li>&bull; Osswald, T. A., Turng, L. S., &amp; Gramann, P. J. — <em>Injection Molding Handbook</em>, Hanser Gardner Publications.</li>
        </ul>
      </section>

    </div>
  )
}
