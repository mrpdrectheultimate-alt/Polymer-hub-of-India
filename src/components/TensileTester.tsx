// src/components/TensileTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

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
  'pmma': { name: 'PMMA (Acrylic Glass)', modulus: 3.0, yield: 70, ultimate: 80, elongation: 5 },
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
  const [materialKey, setMaterialKey] = useState('ldpe')
  const [strainRate, setStrainRate] = useState(5) // mm/min
  const [loadCell, setLoadCell] = useState(5) // kN
  
  const [running, setRunning] = useState(false)
  const [dataPoints, setDataPoints] = useState<ChartPoint[]>([])
  const [results, setResults] = useState<RunResults | null>(null)
  
  // Visual specimen animation state
  const [specimenStrain, setSpecimenStrain] = useState(0) // elongation offset for drawing
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
        
        // Final calculations
        const finalResults: RunResults = {
          modulus: m.modulus,
          yieldStrength: m.yield,
          ultimateStrength: m.ultimate,
          elongation: m.elongation
        }
        setResults(finalResults)
        setRunning(false)
        
        // Log to database and award +15 XP
        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'tensile-astm-d638',
            parameters: { material: materialKey, strainRate, loadCell },
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

      const currentStrain = (stepIndex / steps) * (m.elongation / 100)
      let stress = 0
      const elasticLimit = m.yield / m.modulus // strain at yield

      if (currentStrain <= elasticLimit) {
        stress = currentStrain * m.modulus
      } else if (currentStrain < elasticLimit * 2) {
        // strain hardening
        stress = m.yield + (m.ultimate - m.yield) * ((currentStrain - elasticLimit) / elasticLimit)
      } else {
        // necking and post-ultimate fracture
        stress = m.ultimate * (1 - (currentStrain - elasticLimit * 2) / (m.elongation / 100 - elasticLimit * 2))
        if (stress < 0) stress = 0
      }

      setDataPoints(prev => [...prev, { strain: currentStrain * 100, stress }])
      setSpecimenStrain(currentStrain * 100)
      stepIndex++
    }, 40) // 100 steps * 40ms = 4 seconds simulation run
  }

  // Draw stress-strain SVG curve path
  const width = 340
  const height = 180
  const paddingLeft = 45
  const paddingBottom = 35
  const paddingTop = 10
  const paddingRight = 10

  const maxStrain = Math.max(...Object.values(MATERIALS).map(m => m.elongation), 100)
  const maxStress = 100 // MPa

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
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Standard mechanical evaluation</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🔬 Tensile Tester (ASTM D638)</h2>
        </div>

        {/* Form controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Polymer Material Specimen</label>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Strain Speed (mm/min)</label>
            <select
              disabled={running}
              value={strainRate}
              onChange={(e) => setStrainRate(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value={1}>1 mm/min</option>
              <option value={5}>5 mm/min (Standard)</option>
              <option value={10}>10 mm/min</option>
              <option value={50}>50 mm/min</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Load Cell capacity</label>
            <select
              disabled={running}
              value={loadCell}
              onChange={(e) => setLoadCell(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value={1}>1 kN Cell</option>
              <option value={5}>5 kN Cell</option>
              <option value={10}>10 kN Cell</option>
            </select>
          </div>
        </div>

        {/* Visual Instrument Specimen Necking drawing */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 p-4 flex gap-4 items-center justify-between">
          <div className="text-center space-y-1">
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Universal Grip</span>
            
            {/* Visual dumbbell drawing */}
            <div className="w-14 h-24 bg-slate-200 border-2 border-slate-400 rounded relative flex flex-col items-center justify-between py-2 overflow-hidden mx-auto">
              {/* Upper grip */}
              <div className="w-10 h-3 bg-slate-500 border border-slate-600 rounded-sm" />
              
              {/* Specimen body */}
              <div className="w-4 bg-slate-400 border-x border-slate-500 relative flex items-center justify-center transition-all duration-75"
                   style={{ 
                     height: `${30 + specimenStrain / 15}px`,
                     // simulate necking thinning out width
                     width: `${Math.max(4, 16 - specimenStrain / 50)}px`,
                     backgroundColor: running ? '#3B82F6' : '#94A3B8'
                   }}
              >
                {/* Simulated fracture line */}
                {results && (
                  <div className="absolute w-full h-0.5 bg-red-600 top-1/2 left-0 animate-pulse" />
                )}
              </div>

              {/* Lower grip */}
              <div className="w-10 h-3 bg-slate-500 border border-slate-600 rounded-sm" />
            </div>
            
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Specimen Necking</span>
          </div>

          {/* Graph view */}
          <div className="flex-1 relative border border-slate-200 bg-white p-1 rounded-lg">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
              {/* Grid Lines */}
              {[20, 40, 60, 80, 100].map(val => (
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
              <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-slate-400 font-mono text-[8px] font-bold">Strain (%)</text>
              <text x="10" y={height / 2} textAnchor="middle" transform={`rotate(-90 10 ${height/2})`} className="fill-slate-400 font-mono text-[8px] font-bold">Stress (MPa)</text>

              {/* Axis values */}
              <text x={paddingLeft - 8} y={plotY(0) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">0</text>
              <text x={paddingLeft - 8} y={plotY(50) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">50</text>
              <text x={paddingLeft - 8} y={plotY(100) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">100</text>

              <text x={plotX(maxStrain / 2)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">{Math.round(maxStrain / 2)}%</text>
              <text x={plotX(maxStrain)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">{maxStrain}%</text>

              {/* Plot path */}
              {dataPoints.length > 1 && (
                <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Simulated tensile pull...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run Lab Test
            </>
          )}
        </button>
      </div>

      {/* Numerical Results output */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        {results ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-green-50 p-2.5 rounded-lg border border-green-200">
              <span className="text-[10px] text-green-700 font-bold uppercase flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Specimen Ruptured Successfully
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Elastic Modulus</span>
                <strong className="text-xs text-slate-800">{results.modulus} GPa</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Yield Strength (0.2%)</span>
                <strong className="text-xs text-slate-800">{results.yieldStrength} MPa</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Ultimate Strength (UTS)</span>
                <strong className="text-xs text-slate-800">{results.ultimateStrength} MPa</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Elongation at Break</span>
                <strong className="text-xs text-slate-800">{results.elongation}%</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Start simulation test to view mechanical calculation outputs.
          </div>
        )}
      </div>
    </div>
  )
}
