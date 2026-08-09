// src/components/FlexuralTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  flexModulus: number // GPa
  flexStrength: number // MPa
  maxStrain: number // % (elongation limit before break)
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', flexModulus: 1.4, flexStrength: 45, maxStrain: 8 },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', flexModulus: 1.0, flexStrength: 30, maxStrain: 10 },
  'pc': { name: 'PC (Polycarbonate)', flexModulus: 2.3, flexStrength: 90, maxStrain: 6 },
  'nylon66': { name: 'Nylon-6,6 (Polyamide 6,6)', flexModulus: 2.8, flexStrength: 85, maxStrain: 5 },
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
  const [spanRatio, setSpanRatio] = useState(16) // 16 or 32
  const [thickness, setThickness] = useState(3.2) // mm

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
    // Max deflection (mm) = (r * L^2) / (6 * d) where r = strain, L = span length, d = thickness
    // Standard span L = thickness * spanRatio
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

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'flexural-astm-d790',
            parameters: { material: materialKey, spanRatio, thickness },
            results: finalResults
          })
        }).then((res) => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      const t = step / steps
      const deflection = t * maxDeflectionVal
      
      // Calculate Load (Newtons) based on flexural bending mechanics
      // Force F = (Sigma * 2 * w * d^2) / (3 * L)
      // Sigma = Modulus * Strain
      const strain = (6 * deflection * thickness) / Math.pow(L, 2)
      let stress = 0
      if (strain < m.flexStrength / (m.flexModulus * 1000)) {
        stress = strain * m.flexModulus * 1000 // linear elastic region
      } else {
        // Plastic bending curve
        const yieldStrain = m.flexStrength / (m.flexModulus * 1000)
        stress = m.flexStrength - (m.flexStrength * 0.1) * Math.pow((strain - yieldStrain) / (m.maxStrain / 100 - yieldStrain), 2)
      }
      
      // Assume standard specimen width w = 12.7 mm
      const load = (stress * 2 * 12.7 * Math.pow(thickness, 2)) / (3 * L)

      setDataPoints(prev => [...prev, { deflection, load }])
      setCurrentDeflection(deflection)
      step++
    }, 50)
  }

  // Draw bending plot SVG curve
  const width = 340
  const height = 180
  const paddingLeft = 45
  const paddingBottom = 35
  const paddingTop = 10
  const paddingRight = 10

  const maxPlotDeflection = 12 // mm
  const maxPlotLoad = 120 // Newtons

  const plotX = (defVal: number) => {
    return paddingLeft + (defVal / maxPlotDeflection) * (width - paddingLeft - paddingRight)
  }

  const plotY = (loadVal: number) => {
    return height - paddingBottom - (loadVal / maxPlotLoad) * (height - paddingBottom - paddingTop)
  }

  const pathD = dataPoints.reduce((acc, p, idx) => {
    const x = plotX(p.deflection)
    const y = plotY(p.load)
    return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y} `
  }, '')

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Standard 3-Point Bending Method</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">📐 Flexural Testing — ASTM D790</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Material Specimen</label>
            <select
              disabled={running}
              value={materialKey}
              onChange={(e) => setMaterialKey(e.target.value)}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              {Object.entries(MATERIALS).map(([k, m]) => (
                <option key={k} value={k}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Span/Depth Ratio</label>
            <select
              disabled={running}
              value={spanRatio}
              onChange={(e) => setSpanRatio(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value={16}>16:1 (Standard)</option>
              <option value={32}>32:1 (High Elongation)</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Thickness (mm)</label>
            <input
              type="number"
              disabled={running}
              step="0.1"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-full p-1.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Visual Animation + Plot */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 p-4 flex gap-4 items-center justify-between">
          
          {/* Specimen bending animation */}
          <div className="text-center space-y-1">
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">3-Point Fixture</span>
            
            <div className="w-20 h-28 bg-white border border-slate-200 rounded relative flex flex-col items-center justify-end pb-4 overflow-hidden mx-auto">
              
              {/* Center loading nose */}
              <div 
                className="w-3 h-10 bg-slate-600 border border-slate-700 absolute"
                style={{
                  top: `${15 + currentDeflection * 1.8}px`,
                  left: '38px',
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                }}
              />

              {/* Bending specimen bar */}
              <svg width="70" height="40" className="absolute top-[48px] left-[5px]">
                <path 
                  d={`M 5 10 Q 35 ${10 + currentDeflection * 2.2} 65 10`}
                  fill="none" 
                  stroke={running ? '#EA580C' : '#94A3B8'} 
                  strokeWidth="4" 
                  strokeLinecap="round"
                />
              </svg>

              {/* Two support rollers */}
              <div className="flex gap-10 z-10">
                <circle cx="8" cy="8" r="6" fill="#475569" className="relative left-1" />
                <circle cx="8" cy="8" r="6" fill="#475569" className="relative right-1" />
              </div>
            </div>
            
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Specimen Deflection</span>
          </div>

          {/* Graph view */}
          <div className="flex-1 relative border border-slate-200 bg-white p-1 rounded-lg">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
              {/* Grid Lines */}
              {[25, 50, 75, 100].map(val => (
                <line 
                  key={val} 
                  x1={paddingLeft} 
                  y1={plotY(val)} 
                  x2={width - paddingRight} 
                  y2={plotY(val)} 
                  stroke="#E2E8F0" 
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className=""
                />
              ))}

              {/* Axes */}
              <line x1={paddingLeft} y1={plotY(0)} x2={width - paddingRight} y2={plotY(0)} stroke="#0f172a" strokeWidth="2" className="" />
              <line x1={paddingLeft} y1={plotY(0)} x2={paddingLeft} y2={paddingTop} stroke="#0f172a" strokeWidth="2" className="" />

              {/* Axes labels */}
              <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-slate-400 font-mono text-[8px] font-bold">Deflection (mm)</text>
              <text x="10" y={height / 2} textAnchor="middle" transform={`rotate(-90 10 ${height/2})`} className="fill-slate-400 font-mono text-[8px] font-bold">Load (N)</text>

              {/* Axis values */}
              <text x={paddingLeft - 8} y={plotY(0) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">0</text>
              <text x={paddingLeft - 8} y={plotY(50) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">50</text>
              <text x={paddingLeft - 8} y={plotY(100) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">100</text>

              <text x={plotX(6)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">6</text>
              <text x={plotX(12)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">12</text>

              {/* Plot path */}
              {dataPoints.length > 1 && (
                <path d={pathD} fill="none" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-amber-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-amber-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Moving Loading Nose...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run Flexural test
            </>
          )}
        </button>
      </div>

      {/* Results output */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        {results ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-green-50 p-2.5 rounded-lg border border-green-200">
              <span className="text-[10px] text-green-700 font-bold uppercase flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Bending scan completed
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Flexural Modulus</span>
                <strong className="text-xs text-slate-800">{results.flexModulus} GPa</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Flexural Strength</span>
                <strong className="text-xs text-slate-800">{results.flexStrength} MPa</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Max Deflection</span>
                <strong className="text-xs text-slate-800">{results.maxDeflection} mm</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Start three-point flex test to view calculation outputs.
          </div>
        )}
      </div>
    </div>
  )
}
