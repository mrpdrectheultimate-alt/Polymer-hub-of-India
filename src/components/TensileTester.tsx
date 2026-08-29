// src/components/TensileTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Activity } from 'lucide-react'

interface MaterialProp {
  name: string
  modulus: number      // GPa
  yield: number        // MPa
  ultimate: number     // MPa
  elongation: number   // %
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene)', modulus: 0.2, yield: 10, ultimate: 15, elongation: 600 },
  'pp': { name: 'PP (Polypropylene Homopolymer)', modulus: 1.5, yield: 30, ultimate: 40, elongation: 400 },
  'pmma': { name: 'PMMA (Acrylic Glass Brittle)', modulus: 3.0, yield: 70, ultimate: 80, elongation: 5 },
  'nylon6': { name: 'Nylon-6 (Polyamide 6)', modulus: 2.5, yield: 50, ultimate: 75, elongation: 300 },
  'pc': { name: 'Polycarbonate (Bisphenol-A PC)', modulus: 2.4, yield: 60, ultimate: 70, elongation: 110 }
}

interface RunResults {
  modulus: number
  yieldStrength: number
  ultimateStrength: number
  elongation: number
}

interface ChartPoint {
  strain: number
  stress: number
}

export function TensileTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [strainRate, setStrainRate] = useState(5) // mm/min
  const [loadCell, setLoadCell] = useState(5) // kN
  
  const [running, setRunning] = useState(false)
  const [dataPoints, setDataPoints] = useState<ChartPoint[]>([])
  const [results, setResults] = useState<RunResults | null>(null)
  
  const [specimenStrain, setSpecimenStrain] = useState(0)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = async () => {
    setRunning(true)
    setXpAwarded(false)
    setDataPoints([])
    setResults(null)
    
    const m = MATERIALS[materialKey]
    const steps = 100
    let stepIndex = 0
    
    const interval = setInterval(() => {
      if (stepIndex > steps) {
        clearInterval(interval)
        
        const finalResults: RunResults = {
          modulus: m.modulus,
          yieldStrength: m.yield,
          ultimateStrength: m.ultimate,
          elongation: m.elongation,
        }
        
        setResults(finalResults)
        setRunning(false)
        
        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'tensile_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))
        
        return
      }

      const strainPercent = (stepIndex / steps) * m.elongation
      setSpecimenStrain(strainPercent)

      let stress = 0
      const yieldStrain = (m.yield / (m.modulus * 1000)) * 100

      if (strainPercent <= yieldStrain) {
        // Linear elastic Hookean region
        stress = (strainPercent / yieldStrain) * m.yield
      } else {
        // Plastic deformation, necking and strain hardening
        const plasticFraction = (strainPercent - yieldStrain) / (m.elongation - yieldStrain)
        
        if (m.elongation < 20) {
          // Brittle fracture
          stress = m.yield + (m.ultimate - m.yield) * Math.pow(plasticFraction, 0.5)
        } else {
          // Ductile polymer with necking dip and strain hardening
          const neckDip = m.yield * 0.85
          if (plasticFraction < 0.3) {
            stress = m.yield - (m.yield - neckDip) * (plasticFraction / 0.3)
          } else {
            const hardeningFraction = (plasticFraction - 0.3) / 0.7
            stress = neckDip + (m.ultimate - neckDip) * Math.pow(hardeningFraction, 1.5)
          }
        }
      }

      setDataPoints(prev => [...prev, { strain: strainPercent, stress }])
      stepIndex++
    }, 30)
  }

  // SVG Chart Coordinate Mapping
  const width = 240
  const height = 140
  const paddingLeft = 32
  const paddingBottom = 22
  const paddingTop = 12
  const paddingRight = 10

  const maxStrain = MATERIALS[materialKey].elongation * 1.1
  const maxStress = 100 // MPa scale

  const plotX = (strainVal: number) => {
    return paddingLeft + (strainVal / maxStrain) * (width - paddingLeft - paddingRight)
  }

  const plotY = (stressVal: number) => {
    return height - paddingBottom - (stressVal / maxStress) * (height - paddingBottom - paddingTop)
  }

  const pathD = dataPoints.reduce((acc, p, idx) => {
    const x = plotX(p.strain)
    const y = plotY(p.stress)
    return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y} `
  }, '')

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#2563EB] tracking-wider block">
                Standard Mechanical Tensile Test (ASTM D638 / ISO 527)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Universal Tensile Testing Machine (UTM) Simulator
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
              Polymer Specimen
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
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Crosshead Speed
            </label>
            <select
              disabled={running}
              value={strainRate}
              onChange={(e) => setStrainRate(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={1}>1 mm/min (Modulus Scan)</option>
              <option value={5}>5 mm/min (Standard ASTM)</option>
              <option value={50}>50 mm/min (High Speed)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Load Cell Capacity
            </label>
            <select
              disabled={running}
              value={loadCell}
              onChange={(e) => setLoadCell(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={1}>1 kN Load Cell</option>
              <option value={5}>5 kN Standard Cell</option>
              <option value={10}>10 kN Heavy Duty Cell</option>
            </select>
          </div>
        </div>

        {/* Visual Specimen Necking & Live Curve Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col sm:flex-row gap-5 items-center justify-between text-white">
          {/* UTM Grips & Dumbbell Bar */}
          <div className="text-center space-y-1.5 flex-shrink-0">
            <span className="font-mono text-[9px] uppercase font-bold text-slate-400 block">UTM Grips</span>
            
            <div className="w-20 h-36 bg-slate-800 border border-slate-700 rounded-2xl relative flex flex-col items-center justify-between py-2 overflow-hidden mx-auto shadow-inner">
              {/* Upper Crosshead Grip */}
              <div className="w-12 h-3.5 bg-blue-600 rounded-md border border-blue-400 shadow-xs" />
              
              {/* Dumbbell Specimen Gauge Body */}
              <div
                className="w-4 relative flex items-center justify-center transition-all duration-75 rounded"
                style={{ 
                  height: `${35 + specimenStrain / 10}px`,
                  width: `${Math.max(4, 16 - specimenStrain / 45)}px`,
                  backgroundColor: running ? '#38BDF8' : '#64748B'
                }}
              >
                {results && (
                  <div className="absolute w-full h-1 bg-red-500 top-1/2 left-0 animate-pulse" />
                )}
              </div>

              {/* Lower Fixed Grip */}
              <div className="w-12 h-3.5 bg-slate-700 rounded-md border border-slate-600" />
            </div>
            
            <span className="font-mono text-[8px] uppercase text-slate-500 block">Gauge Necking</span>
          </div>

          {/* Real-time Stress-Strain Curve Plot */}
          <div className="w-full overflow-hidden flex justify-center">
            <svg width={width} height={height} className="overflow-visible font-mono">
              {/* Grid Lines */}
              {[25, 50, 75].map(val => (
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
              <text x={paddingLeft - 6} y={plotY(50)} textAnchor="end" fill="#94A3B8" fontSize="7">50 MPa</text>
              <text x={paddingLeft - 6} y={plotY(100)} textAnchor="end" fill="#94A3B8" fontSize="7">100 MPa</text>

              <text x={width - paddingRight} y={height - 6} textAnchor="end" fill="#94A3B8" fontSize="7">&epsilon; (%)</text>
              <text x={paddingLeft - 6} y={paddingTop} textAnchor="end" fill="#38BDF8" fontSize="7">&sigma;</text>

              {/* Dynamic Path */}
              {pathD && (
                <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Results Certificate */}
        {results && (
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-900">
              <Award className="w-4 h-4 text-blue-700" />
              <span>OFFICIAL ASTM D638 TENSILE TEST REPORT</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Young&apos;s Modulus (E)</span>
                <span className="font-mono text-base font-bold text-[#2563EB]">{results.modulus} GPa</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Yield Stress (&sigma;y)</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.yieldStrength} MPa</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Tensile Strength (&sigma;b)</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.ultimateStrength} MPa</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Elongation at Break</span>
                <span className="font-mono text-base font-bold text-emerald-700">{results.elongation}%</span>
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
            <span>Straining Specimen ({Math.round(specimenStrain)}%)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run ASTM D638 Tensile Test</span>
          </>
        )}
      </button>
    </div>
  )
}

export default TensileTester
