'use client'

import React, { useState, useMemo } from 'react'
import { Sliders, RotateCcw, Activity, Gauge, Flame, Shield } from 'lucide-react'

// ─── 1. Interactive Stress-Strain Laboratory Graph ────────────────────────────

export function InteractiveStressStrainGraph({
  material = 'Semi-Crystalline Thermoplastic (PP / HDPE)'
}: {
  material?: string
}) {
  const [temperature, setTemperature] = useState(23) // °C (-20 to 100)
  const [crystallinity, setCrystallinity] = useState(55) // % (20 to 80)
  const [strainRate, setStrainRate] = useState(50) // mm/min (1 to 500)

  // Real-time Physics Engine: Polymer Viscoelastic Mechanics
  const telemetry = useMemo(() => {
    // Reference parameters at 23°C, 50% crystallinity
    const baseE = 1450 // MPa (Modulus)
    const baseSigmaY = 32 // MPa (Yield Stress)
    const baseEpsBreak = 350 // % (Elongation at Break)

    // Temperature factor (Arrhenius / WLF softening)
    const tempDelta = temperature - 23
    const tempFactor = Math.exp(-0.012 * tempDelta)
    
    // Crystallinity factor (Crystals act as physical crosslinks & reinforcement)
    const crystFactor = 0.5 + (crystallinity / 100)

    // Strain rate factor (Eyring rate process: higher speed -> higher apparent modulus & yield)
    const rateFactor = 1 + 0.08 * Math.log10(strainRate / 50 + 0.1)

    const modulus = Math.round(baseE * tempFactor * crystFactor * rateFactor)
    const yieldStress = Math.round(Math.max(5, baseSigmaY * tempFactor * crystFactor * rateFactor))
    
    // Ductility vs Brittleness
    let elongationBreak = Math.round(baseEpsBreak * (1 + 0.02 * tempDelta) * (1.2 - crystallinity / 150))
    if (temperature < 0) elongationBreak = Math.round(Math.max(12, 40 * (1 + temperature / 30)))

    // Failure mode classification
    let mode = 'Ductile Yielding with Cold-Drawing & Strain Hardening'
    if (temperature < 0) mode = 'Brittle Glassy Cleavage Fracture (T < Tg)'
    else if (temperature > 70) mode = 'Rubber-like Viscous Extension (Near Tm)'

    return { modulus, yieldStress, elongationBreak, mode }
  }, [temperature, crystallinity, strainRate])

  // Generate dynamic SVG curve coordinates based on physics
  const curvePath = useMemo(() => {
    // Canvas bounds: x: 55 to 565 (Strain 0% to 500%), y: 360 to 50 (Stress 0 to 80 MPa)
    const strainToX = (eps: number) => 55 + (Math.min(500, eps) / 500) * 500
    const stressToY = (sig: number) => 360 - (Math.min(75, sig) / 75) * 310

    if (temperature < 0) {
      // Brittle: Steep linear elastic line up to fracture point with zero drawing
      const xf = strainToX(telemetry.elongationBreak)
      const yf = stressToY(telemetry.yieldStress * 1.3)
      return `M 55,360 L ${xf},${yf}`
    }

    const xy = strainToX(15) // Yield strain around 10-15%
    const yy = stressToY(telemetry.yieldStress)

    const xDraw1 = strainToX(60)
    const yDraw1 = stressToY(telemetry.yieldStress * 0.75) // Cold drawing dip

    const xDraw2 = strainToX(Math.min(320, telemetry.elongationBreak * 0.7))
    const yDraw2 = stressToY(telemetry.yieldStress * 0.8) // Necking plateau

    const xBreak = strainToX(telemetry.elongationBreak)
    const yBreak = stressToY(telemetry.yieldStress * 1.15) // Strain hardening peak

    return `M 55,360 Q 75,${yy + 30} ${xy},${yy} Q ${xy + 20},${yDraw1 - 10} ${xDraw1},${yDraw1} L ${xDraw2},${yDraw2} Q ${(xDraw2 + xBreak) / 2},${yDraw2} ${xBreak},${yBreak}`
  }, [temperature, telemetry])

  const handleReset = () => {
    setTemperature(23)
    setCrystallinity(55)
    setStrainRate(50)
  }

  return (
    <div className="my-8 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
      {/* Header & Mode */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
              Interactive Viscoelastic Laboratory (ASTM D638 / ISO 527)
            </span>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
              Tensile Stress-Strain Response: {material}
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg border border-slate-200"
          title="Reset Parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* ── Interactive Sliders Control Panel ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
        {/* Slider 1: Temperature */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Temperature:
            </span>
            <span className="font-bold text-[#2563EB]">{temperature} °C</span>
          </div>
          <input
            type="range"
            min="-20"
            max="100"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full accent-[#2563EB] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>-20°C (Glassy)</span>
            <span>23°C (RT)</span>
            <span>100°C (Soft)</span>
          </div>
        </div>

        {/* Slider 2: Crystallinity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-600" /> Crystallinity (&chi;c):
            </span>
            <span className="font-bold text-emerald-700">{crystallinity} %</span>
          </div>
          <input
            type="range"
            min="15"
            max="80"
            value={crystallinity}
            onChange={(e) => setCrystallinity(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>15% (Amorphous)</span>
            <span>50%</span>
            <span>80% (High Density)</span>
          </div>
        </div>

        {/* Slider 3: Strain Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-indigo-600" /> Test Speed:
            </span>
            <span className="font-bold text-indigo-700">{strainRate} mm/min</span>
          </div>
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={strainRate}
            onChange={(e) => setStrainRate(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>5 mm/min (Creep)</span>
            <span>50 mm/min</span>
            <span>500 mm/min (Impact)</span>
          </div>
        </div>
      </div>

      {/* ── Dynamic Live SVG Graph ── */}
      <div className="relative rounded-2xl bg-white border border-slate-200 p-2 overflow-hidden">
        <svg viewBox="0 0 600 390" className="w-full h-auto font-sans">
          {/* Grid lines */}
          <g stroke="#F1F5F9" strokeWidth="1.5">
            {[60, 110, 160, 210, 260, 310, 360].map(y => (
              <line key={y} x1="55" y1={y} x2="565" y2={y} />
            ))}
            {[105, 155, 205, 255, 305, 355, 405, 455, 505, 555].map(x => (
              <line key={x} x1={x} y1="30" x2={x} y2="360" />
            ))}
          </g>

          {/* Axes */}
          <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round">
            <line x1="55" y1="360" x2="575" y2="360" />
            <line x1="55" y1="20" x2="55" y2="360" />
          </g>

          {/* Scale Numbers (JetBrains Mono) */}
          <g fontSize="9" fontFamily="monospace" fill="#64748B" textAnchor="end">
            <text x="48" y="364">0</text>
            <text x="48" y="284">20</text>
            <text x="48" y="204">40</text>
            <text x="48" y="124">60</text>
            <text x="48" y="44">80</text>
          </g>
          <g fontSize="9" fontFamily="monospace" fill="#64748B" textAnchor="middle">
            <text x="155" y="376">100%</text>
            <text x="255" y="376">200%</text>
            <text x="355" y="376">300%</text>
            <text x="455" y="376">400%</text>
            <text x="555" y="376">500%</text>
          </g>

          {/* Axis Titles */}
          <text x="310" y="388" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569" letterSpacing="0.5">ENGINEERING STRAIN &epsilon; (%)</text>
          <text x="18" y="195" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569" letterSpacing="0.5" transform="rotate(-90, 18, 195)">TENSILE STRESS &sigma; (MPa)</text>

          {/* Live Reactive Stress-Strain Curve */}
          <path
            d={curvePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-150"
          />

          {/* Real-time yield marker */}
          {temperature >= 0 && (
            <g transform={`translate(${55 + (15 / 500) * 500}, ${360 - (telemetry.yieldStress / 75) * 310})`}>
              <circle cx="0" cy="0" r="5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
              <text x="8" y="-4" fontSize="10" fontWeight="bold" fill="#EA580C">Yield Point ({telemetry.yieldStress} MPa)</text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Real-Time Telemetry Readouts ── */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
          <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">Young&apos;s Modulus (E)</span>
          <span className="font-mono text-base font-bold text-blue-900">{telemetry.modulus} MPa</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">Yield Strength (&sigma;y)</span>
          <span className="font-mono text-base font-bold text-amber-950">{telemetry.yieldStress} MPa</span>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">Elongation at Break</span>
          <span className="font-mono text-base font-bold text-emerald-950">{telemetry.elongationBreak} %</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Deformation Regime</span>
          <span className="font-sans text-xs font-bold text-slate-800 line-clamp-1">{telemetry.mode}</span>
        </div>
      </div>

      {/* Educational Engineering Disclaimer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500 flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span>Educational constitutive model approximation. Not for certified laboratory sign-off or structural compliance.</span>
        </span>
        <span className="font-bold text-slate-400">ASTM D638 / ISO 527 Reference</span>
      </div>
    </div>
  )
}

// ─── 2. Interactive Non-Newtonian Rheology Viscosity Lab ──────────────────────

export function InteractiveRheologyGraph() {
  const [temp, setTemp] = useState(200) // °C
  const [powerLawN, setPowerLawN] = useState(0.35) // Pseudoplastic n
  const [mw, setMw] = useState(150) // kg/mol (Weight-average MW)

  // Real-time rheology physics calculations
  const { eta0, etaInjection } = useMemo(() => {
    // Fox-Flory MW scaling: eta0 ~ Mw^3.4
    const baseEta = 3200 // Pa.s at 200°C, 150 kg/mol
    const mwFactor = Math.pow(mw / 150, 3.4)
    const tempFactor = Math.exp(2800 * (1 / (temp + 273.15) - 1 / 473.15))
    
    const eta0Calc = Math.round(baseEta * mwFactor * tempFactor)
    // Carreau-Yasuda viscosity at injection shear rate 1000 s^-1
    const gammaDot = 1000
    const relaxationTime = 0.05 * (mw / 150)
    const etaInjectionCalc = Math.round(eta0Calc / Math.pow(1 + Math.pow(relaxationTime * gammaDot, 2), (1 - powerLawN) / 2))

    return { eta0: eta0Calc, etaInjection: etaInjectionCalc }
  }, [temp, powerLawN, mw])

  return (
    <div className="my-8 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-[#EA580C] uppercase tracking-wider">
              Melt Rheology Laboratory (Ostwald-de Waele Model)
            </span>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
              Shear-Thinning Viscosity vs. Shear Rate Flow Curve
            </h3>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">Melt Temp:</span>
            <span className="font-bold text-[#EA580C]">{temp} °C</span>
          </div>
          <input
            type="range"
            min="170"
            max="260"
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full accent-[#EA580C] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">Power Law Index (n):</span>
            <span className="font-bold text-blue-700">{powerLawN.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.15"
            max="1.0"
            step="0.05"
            value={powerLawN}
            onChange={(e) => setPowerLawN(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">Mol Wt (Mw):</span>
            <span className="font-bold text-emerald-700">{mw} kg/mol</span>
          </div>
          <input
            type="range"
            min="80"
            max="300"
            value={mw}
            onChange={(e) => setMw(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Telemetry output */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl">
          <span className="text-[10px] font-mono font-bold uppercase text-orange-800 block">Zero-Shear Newtonian Plateau (&eta;0)</span>
          <span className="font-mono text-lg font-bold text-orange-950">{eta0.toLocaleString()} Pa&bull;s</span>
        </div>
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
          <span className="text-[10px] font-mono font-bold uppercase text-blue-800 block">Viscosity at Injection Gate (1000 s&macr;&sup1;)</span>
          <span className="font-mono text-lg font-bold text-blue-950">{etaInjection.toLocaleString()} Pa&bull;s</span>
        </div>
      </div>

      {/* Educational Engineering Disclaimer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500 flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span>Educational pseudoplastic rheological model. Not for certified laboratory compliance.</span>
        </span>
        <span className="font-bold text-slate-400">Carreau-Yasuda Reference</span>
      </div>
    </div>
  )
}
