// src/components/FlexuralTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Activity, Shield } from 'lucide-react'

interface MaterialProp {
  name: string
  flexModulus: number // GPa
  flexStrength: number // MPa
  maxStrain: number // %
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', flexModulus: 1.4, flexStrength: 45, maxStrain: 8 },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', flexModulus: 1.0, flexStrength: 30, maxStrain: 10 },
  'pc': { name: 'PC (Polycarbonate High Rigidity)', flexModulus: 2.3, flexStrength: 90, maxStrain: 6 },
  'nylon66': { name: 'Nylon-6,6 (Polyamide 6,6 Glass Filled)', flexModulus: 2.8, flexStrength: 85, maxStrain: 5 },
}

interface RunResults {
  flexModulus: number
  flexStrength: number
  maxDeflection: number
}

interface ChartPoint {
  deflection: number
  load: number
}

export function FlexuralTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [spanRatio, setSpanRatio] = useState(16)
  const [thickness, setThickness] = useState(3.2)

  const [running, setRunning] = useState(false)
  const [dataPoints, setDataPoints] = useState<ChartPoint[]>([])
  const [currentDeflection, setCurrentDeflection] = useState(0)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setDataPoints([])
    setResults(null)

    const m = MATERIALS[materialKey]
    const L = thickness * spanRatio
    const maxDeflectionVal = (m.maxStrain / 100 * Math.pow(L, 2)) / (6 * thickness)

    const steps = 60
    let step = 0

    const interval = setInterval(() => {
      if (step > steps) {
        clearInterval(interval)
        
        const finalResults: RunResults = {
          flexModulus: m.flexModulus,
          flexStrength: m.flexStrength,
          maxDeflection: Number(maxDeflectionVal.toFixed(2))
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'flexural_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      const def = (step / steps) * maxDeflectionVal
      setCurrentDeflection(def)

      // Calculate Bending Load (N) = (4 * b * d^2 * Stress) / (6 * L)
      const b = 12.7 // width in mm
      const frac = step / steps
      const stress = m.flexStrength * Math.sin((frac * Math.PI) / 2)
      const loadVal = (2 * b * Math.pow(thickness, 2) * stress) / (3 * L)

      setDataPoints(prev => [...prev, { deflection: def, load: loadVal }])
      step++
    }, 40)
  }

  // SVG dimensions
  const width = 240
  const height = 140
  const paddingLeft = 35
  const paddingBottom = 22
  const paddingTop = 12
  const paddingRight = 10

  const maxDefScale = 12 // mm
  const maxLoadScale = 150 // N

  const plotX = (defVal: number) => {
    return paddingLeft + (defVal / maxDefScale) * (width - paddingLeft - paddingRight)
  }

  const plotY = (loadVal: number) => {
    return height - paddingBottom - (loadVal / maxLoadScale) * (height - paddingBottom - paddingTop)
  }

  const pathD = dataPoints.reduce((acc, p, idx) => {
    const x = plotX(p.deflection)
    const y = plotY(p.load)
    return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y} `
  }, '')

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600 tracking-wider block">
                3-Point Bending Flexural Properties (ASTM D790 / ISO 178)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Flexural Testing &amp; Bending Modulus Bench
              </h3>
            </div>
          </div>
          {xpAwarded && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> +25 XP Earned
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Material Specimen
            </label>
            <select
              disabled={running}
              value={materialKey}
              onChange={(e) => setMaterialKey(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              {Object.entries(MATERIALS).map(([k, m]) => (
                <option key={k} value={k}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-500" /> Span/Depth Ratio
            </label>
            <select
              disabled={running}
              value={spanRatio}
              onChange={(e) => setSpanRatio(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={16}>16:1 (Standard Procedure A)</option>
              <option value={32}>32:1 (High Deflection B)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Thickness (mm)
            </label>
            <input
              type="number"
              disabled={running}
              step="0.1"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Visual Animation + Real-time Curve Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col sm:flex-row gap-5 items-center justify-between text-white">
          {/* Specimen 3-Point Bending Fixture */}
          <div className="text-center space-y-1.5 flex-shrink-0">
            <span className="font-mono text-[9px] uppercase font-bold text-slate-400 block">3-Point Fixture</span>
            
            <div className="w-24 h-32 bg-slate-800 border border-slate-700 rounded-2xl relative flex flex-col items-center justify-end pb-3 overflow-hidden mx-auto shadow-inner">
              {/* Center Loading Nose */}
              <div 
                className="w-3.5 h-10 bg-amber-500 border border-amber-400 absolute transition-all"
                style={{
                  top: `${12 + currentDeflection * 2.2}px`,
                  left: '42px',
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                }}
              />

              {/* Bending Specimen Bar */}
              <svg width="80" height="40" className="absolute top-[52px] left-[8px]">
                <path 
                  d={`M 5 10 Q 40 ${10 + currentDeflection * 2.8} 75 10`}
                  fill="none" 
                  stroke={running ? '#F59E0B' : '#38BDF8'} 
                  strokeWidth="4.5" 
                  strokeLinecap="round"
                />
              </svg>

              {/* Two Support Anvils */}
              <div className="flex gap-11 z-10">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-300 shadow-xs" />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-400 border border-slate-300 shadow-xs" />
              </div>
            </div>
            
            <span className="font-mono text-[8px] uppercase text-slate-500 block">Deflection ({currentDeflection.toFixed(2)} mm)</span>
          </div>

          {/* Real-time Load-Deflection Curve */}
          <div className="w-full overflow-hidden flex justify-center">
            <svg width={width} height={height} className="overflow-visible font-mono">
              {/* Grid Lines */}
              {[50, 100].map(val => (
                <line 
                  key={val} 
                  x1={paddingLeft} 
                  y1={plotY(val)} 
                  x2={width - paddingRight} 
                  y2={plotY(val)} 
                  stroke="#334155" 
                  strokeWidth="0.5" 
                  strokeDasharray="2 2"
                />
              ))}

              {/* Axes */}
              <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#94A3B8" strokeWidth="1.5" />
              <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#94A3B8" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x={paddingLeft - 6} y={plotY(50)} textAnchor="end" fill="#94A3B8" fontSize="7">50 N</text>
              <text x={paddingLeft - 6} y={plotY(100)} textAnchor="end" fill="#94A3B8" fontSize="7">100 N</text>

              <text x={width - paddingRight} y={height - 6} textAnchor="end" fill="#94A3B8" fontSize="7">Defl (mm)</text>
              <text x={paddingLeft - 6} y={paddingTop} textAnchor="end" fill="#F59E0B" fontSize="7">Load</text>

              {/* Dynamic Path */}
              {pathD && (
                <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Results Certificate */}
        {results && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-700" />
              <span>OFFICIAL ASTM D790 FLEXURAL TEST REPORT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Flexural Modulus (EB)</span>
                <span className="font-mono text-base font-bold text-amber-700">{results.flexModulus} GPa</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Flexural Strength (&sigma;fM)</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.flexStrength} MPa</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Max Deflection (D)</span>
                <span className="font-mono text-base font-bold text-emerald-700">{results.maxDeflection} mm</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        disabled={running}
        onClick={handleRunTest}
        className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
      >
        {running ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Applying 3-Point Load ({currentDeflection.toFixed(2)} mm)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run ASTM D790 Flexural Test</span>
          </>
        )}
      </button>
    </div>
  )
}

export default FlexuralTester
