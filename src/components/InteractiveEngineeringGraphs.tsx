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

// ─── 3. Interactive DSC Thermal Analysis Laboratory Graph ──────────────────────

export function InteractiveDSCGraph({ material = 'Polypropylene (PP)' }: { material?: string }) {
  const [heatingRate, setHeatingRate] = useState(10) // °C/min (5 to 40)
  const [purity, setPurity] = useState(98) // % (80 to 100)

  // Real-time DSC thermal transition kinetics
  const telemetry = useMemo(() => {
    // Reference transitions for PP
    const baseTg = 5.0 // °C
    const baseTc = 115.0 // °C
    const baseTm = 165.0 // °C

    // Heating rate kinetic shift (higher rate -> thermal lag shifts peaks to higher temps)
    const rateShift = (heatingRate - 10) * 0.4
    const purityShift = (100 - purity) * 0.5

    const Tg = Math.round((baseTg + rateShift - purityShift) * 10) / 10
    const Tc = Math.round((baseTc - rateShift - purityShift * 1.5) * 10) / 10
    const Tm = Math.round((baseTm + rateShift - purityShift * 0.8) * 10) / 10
    const deltaHm = Math.round((207 * (purity / 100) * (1 - heatingRate / 200)) * 10) / 10
    const crystallinity = Math.round((deltaHm / 207) * 100)

    return { Tg, Tc, Tm, deltaHm, crystallinity }
  }, [heatingRate, purity])

  return (
    <div className="my-8 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-purple-700 uppercase tracking-wider">
              Differential Scanning Calorimetry (ASTM E1356 / ISO 11357)
            </span>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
              DSC Heat Flow vs. Temperature: {material}
            </h3>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">Heating Rate (&beta;):</span>
            <span className="font-bold text-purple-700">{heatingRate} °C/min</span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            step="5"
            value={heatingRate}
            onChange={(e) => setHeatingRate(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">Polymer Purity:</span>
            <span className="font-bold text-emerald-700">{purity} %</span>
          </div>
          <input
            type="range"
            min="80"
            max="100"
            value={purity}
            onChange={(e) => setPurity(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* SVG Plot */}
      <div className="relative rounded-2xl bg-white border border-slate-200 p-2 overflow-hidden mb-4">
        <svg viewBox="0 0 600 280" className="w-full h-auto font-sans">
          {/* Grid lines */}
          <g stroke="#F1F5F9" strokeWidth="1.5">
            {[50, 100, 150, 200, 250].map(y => (
              <line key={y} x1="55" y1={y} x2="565" y2={y} />
            ))}
            {[150, 250, 350, 450, 550].map(x => (
              <line key={x} x1={x} y1="20" x2={x} y2="250" />
            ))}
          </g>

          {/* Axes */}
          <g stroke="#0F172A" strokeWidth="2" strokeLinecap="round">
            <line x1="55" y1="250" x2="575" y2="250" />
            <line x1="55" y1="20" x2="55" y2="250" />
          </g>

          {/* Scale Numbers */}
          <g fontSize="9" fontFamily="monospace" fill="#64748B" textAnchor="middle">
            <text x="55" y="265">-20°C</text>
            <text x="180" y="265">30°C</text>
            <text x="315" y="265">100°C</text>
            <text x="445" y="265">170°C</text>
            <text x="565" y="265">220°C</text>
          </g>

          {/* Axis Titles */}
          <text x="310" y="278" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">TEMPERATURE T (°C)</text>
          <text x="18" y="135" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569" transform="rotate(-90, 18, 135)">HEAT FLOW dH/dt (mW)</text>

          {/* Dynamic DSC Curve */}
          <path
            d={`M 55,140 L 110,140 Q 125,140 135,160 Q 145,180 160,180 L 380,180 Q 420,180 435,70 Q 445,40 455,180 L 565,180`}
            fill="none"
            stroke="#7C3AED"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Annotations */}
          <g fontSize="9" fontFamily="sans-serif" fontWeight="bold">
            <text x="135" y="200" fill="#7C3AED" textAnchor="middle">Glass Transition Tg ({telemetry.Tg}°C)</text>
            <text x="435" y="25" fill="#DC2626" textAnchor="middle">Melting Peak Tm ({telemetry.Tm}°C)</text>
          </g>
        </svg>
      </div>

      {/* Telemetry output */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200">
          <span className="text-[10px] font-mono uppercase text-purple-700 font-bold block">Glass Transition (Tg)</span>
          <span className="font-mono text-base font-bold text-purple-950">{telemetry.Tg} °C</span>
        </div>
        <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200">
          <span className="text-[10px] font-mono uppercase text-red-700 font-bold block">Melting Peak (Tm)</span>
          <span className="font-mono text-base font-bold text-red-950">{telemetry.Tm} °C</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">Enthalpy of Fusion (&Delta;Hm)</span>
          <span className="font-mono text-base font-bold text-amber-950">{telemetry.deltaHm} J/g</span>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">Mass Crystallinity (&chi;c)</span>
          <span className="font-mono text-base font-bold text-emerald-950">{telemetry.crystallinity} %</span>
        </div>
      </div>
    </div>
  )
}

// ─── 4. Interactive TGA Thermogravimetric Analysis Laboratory Graph ───────────

export function InteractiveTGAGraph({ material = 'Compounded Polymer + Filler' }: { material?: string }) {
  const [fillerPercent, setFillerPercent] = useState(25) // % (0 to 50)
  const [atmosphere, setAtmosphere] = useState<'Inert (N2)' | 'Oxidative (Air)'>('Inert (N2)')

  const telemetry = useMemo(() => {
    const T_onset = atmosphere === 'Inert (N2)' ? 385 : 340
    const T_50 = T_onset + 45
    const residualAsh = fillerPercent

    return { T_onset, T_50, residualAsh }
  }, [fillerPercent, atmosphere])

  return (
    <div className="my-8 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Thermogravimetric Analysis (ASTM E1131 / ISO 11358)
            </span>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
              TGA Mass Loss vs. Temperature: {material}
            </h3>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">Inorganic Filler / Fiber (CaCO3/Glass):</span>
            <span className="font-bold text-emerald-700">{fillerPercent} %</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={fillerPercent}
            onChange={(e) => setFillerPercent(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-slate-700">Purge Gas Atmosphere:</span>
            <span className="font-bold text-indigo-700">{atmosphere}</span>
          </div>
          <div className="flex gap-2 pt-1">
            {(['Inert (N2)', 'Oxidative (Air)'] as const).map(atm => (
              <button
                key={atm}
                onClick={() => setAtmosphere(atm)}
                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                  atmosphere === atm
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {atm}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Plot */}
      <div className="relative rounded-2xl bg-white border border-slate-200 p-2 overflow-hidden mb-4">
        <svg viewBox="0 0 600 280" className="w-full h-auto font-sans">
          <g stroke="#F1F5F9" strokeWidth="1.5">
            {[50, 100, 150, 200, 250].map(y => (
              <line key={y} x1="55" y1={y} x2="565" y2={y} />
            ))}
            {[150, 250, 350, 450, 550].map(x => (
              <line key={x} x1={x} y1="20" x2={x} y2="250" />
            ))}
          </g>

          <g stroke="#0F172A" strokeWidth="2" strokeLinecap="round">
            <line x1="55" y1="250" x2="575" y2="250" />
            <line x1="55" y1="20" x2="55" y2="250" />
          </g>

          <g fontSize="9" fontFamily="monospace" fill="#64748B" textAnchor="middle">
            <text x="55" y="265">50°C</text>
            <text x="180" y="265">200°C</text>
            <text x="315" y="265">350°C</text>
            <text x="445" y="265">500°C</text>
            <text x="565" y="265">650°C</text>
          </g>

          <text x="310" y="278" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">TEMPERATURE T (°C)</text>
          <text x="18" y="135" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569" transform="rotate(-90, 18, 135)">SAMPLE MASS (%)</text>

          {/* Dynamic TGA Mass Curve */}
          <path
            d={`M 55,40 L 310,40 Q 380,40 400,${250 - (fillerPercent / 100) * 210 - 40} Q 420,${250 - (fillerPercent / 100) * 210} 565,${250 - (fillerPercent / 100) * 210}`}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <g fontSize="9" fontFamily="sans-serif" fontWeight="bold">
            <text x="340" y="30" fill="#059669">Onset T_onset ({telemetry.T_onset}°C)</text>
            <text x="470" y={240 - (fillerPercent / 100) * 210} fill="#047857">Ash Residue ({fillerPercent}%)</text>
          </g>
        </svg>
      </div>

      {/* Telemetry output */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">Degradation Onset (T_onset)</span>
          <span className="font-mono text-base font-bold text-emerald-950">{telemetry.T_onset} °C</span>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
          <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">50% Mass Loss Temp (T_50%)</span>
          <span className="font-mono text-base font-bold text-blue-950">{telemetry.T_50} °C</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">Inorganic Ash Content</span>
          <span className="font-mono text-base font-bold text-amber-950">{telemetry.residualAsh} %</span>
        </div>
      </div>
    </div>
  )
}

