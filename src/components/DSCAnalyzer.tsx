// src/components/DSCAnalyzer.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Flame, Activity } from 'lucide-react'

interface MaterialProp {
  name: string
  tg: number // °C
  tc: number // °C
  tm: number // °C
  crystallinity: number // %
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene)', tg: -120, tc: 95, tm: 110, crystallinity: 45 },
  'pp': { name: 'PP (Polypropylene Homopolymer)', tg: -10, tc: 120, tm: 165, crystallinity: 55 },
  'pet': { name: 'PET (Polyethylene Terephthalate)', tg: 75, tc: 140, tm: 250, crystallinity: 35 },
  'nylon66': { name: 'Nylon-6,6 (Polyamide 6,6)', tg: 50, tc: 210, tm: 265, crystallinity: 40 },
}

interface RunResults {
  tg: number
  tc: number
  tm: number
  crystallinity: number
}

interface ChartPoint {
  temp: number
  heatFlow: number
}

export function DSCAnalyzer({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [heatingRate, setHeatingRate] = useState(10) // °C/min
  
  const [running, setRunning] = useState(false)
  const [dataPoints, setDataPoints] = useState<ChartPoint[]>([])
  const [currentTemp, setCurrentTemp] = useState(25)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setDataPoints([])
    setResults(null)

    const m = MATERIALS[materialKey]
    const startTemp = 20
    const endTemp = 300
    const steps = 80
    let step = 0

    const interval = setInterval(() => {
      if (step > steps) {
        clearInterval(interval)
        
        const finalResults: RunResults = {
          tg: m.tg,
          tc: m.tc,
          tm: m.tm,
          crystallinity: m.crystallinity
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'dsc_analyzer' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      const temp = startTemp + (step / steps) * (endTemp - startTemp)
      setCurrentTemp(temp)

      // Compute standard DSC heat flow response
      let hf = 0.2 + (temp / 300) * 0.1 // Baseline slope

      // Glass Transition (Tg) Step Change
      if (Math.abs(temp - m.tg) < 15) {
        hf += 0.2 / (1 + Math.exp(-(temp - m.tg) / 3))
      } else if (temp > m.tg) {
        hf += 0.2
      }

      // Cold Crystallization (Tc) Exothermic Dip
      if (m.tc > 0 && Math.abs(temp - m.tc) < 20) {
        const dist = Math.abs(temp - m.tc)
        hf -= 0.8 * Math.exp(-(dist * dist) / 40)
      }

      // Melting (Tm) Endothermic Peak
      if (Math.abs(temp - m.tm) < 25) {
        const dist = Math.abs(temp - m.tm)
        hf += 2.0 * Math.exp(-(dist * dist) / 60)
      }

      setDataPoints(prev => [...prev, { temp, heatFlow: hf }])
      step++
    }, 40)
  }

  // SVG Chart Plotting dimensions
  const width = 280
  const height = 150
  const paddingLeft = 35
  const paddingBottom = 25
  const paddingTop = 15
  const paddingRight = 10

  const plotX = (tempVal: number) => {
    return paddingLeft + (tempVal / 300) * (width - paddingLeft - paddingRight)
  }

  const plotY = (hfVal: number) => {
    const minHF = -1.0
    const maxHF = 3.0
    return height - paddingBottom - ((hfVal - minHF) / (maxHF - minHF)) * (height - paddingBottom - paddingTop)
  }

  const pathD = dataPoints.reduce((acc, p, idx) => {
    const x = plotX(p.temp)
    const y = plotY(p.heatFlow)
    return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y} `
  }, '')

  const heatColor = `rgb(${Math.min(255, 60 + (currentTemp / 300) * 195)}, 80, ${Math.max(50, 240 - (currentTemp / 300) * 190)})`

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-red-600 tracking-wider block">
                Differential Scanning Calorimetry (ASTM D3418 / ISO 11357)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                DSC Thermal Analyzer &amp; Thermogram Scan
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
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Polymer Sample
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
              <Flame className="w-3 h-3 text-orange-500" /> Heating Rate
            </label>
            <select
              disabled={running}
              value={heatingRate}
              onChange={(e) => setHeatingRate(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={5}>5 °C/min (High Res)</option>
              <option value={10}>10 °C/min (Standard)</option>
              <option value={20}>20 °C/min (Rapid)</option>
            </select>
          </div>
        </div>

        {/* Visual Animation & Thermogram Plot */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col sm:flex-row gap-4 items-center justify-between text-white">
          {/* Calorimeter Oven view */}
          <div className="text-center space-y-1.5 flex-shrink-0">
            <span className="font-mono text-[9px] uppercase font-bold text-slate-400 block">Furnace Cell</span>
            
            <div className="w-24 h-28 bg-slate-800 border border-slate-700 rounded-2xl relative flex flex-col items-center justify-center overflow-hidden mx-auto p-2">
              <div 
                className="w-14 h-14 rounded-full border-2 border-slate-600 flex items-center justify-center transition-colors duration-100 shadow-inner"
                style={{ backgroundColor: heatColor }}
              >
                <div className="flex gap-1.5">
                  <div className="w-4 h-4 bg-slate-200 rounded-sm flex items-center justify-center text-[7px] font-black text-slate-900" title="Reference Pan">R</div>
                  <div className="w-4 h-4 bg-amber-400 rounded-sm flex items-center justify-center text-[7px] font-black text-slate-900" title="Sample Pan">S</div>
                </div>
              </div>

              <div className="mt-2 font-mono text-[10px] font-bold text-amber-400">
                {Math.round(currentTemp)} °C
              </div>
            </div>
            
            <span className="font-mono text-[8px] uppercase text-slate-500 block">N₂ Purge (50 mL/min)</span>
          </div>

          {/* Real-time DSC Curve Plot */}
          <div className="w-full overflow-hidden flex justify-center">
            <svg width={width} height={height} className="overflow-visible font-mono">
              <g stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3">
                <line x1={plotX(0)} y1={plotY(0)} x2={plotX(300)} y2={plotY(0)} />
                <line x1={plotX(100)} y1={paddingTop} x2={plotX(100)} y2={height - paddingBottom} />
                <line x1={plotX(200)} y1={paddingTop} x2={plotX(200)} y2={height - paddingBottom} />
              </g>

              {/* Axes */}
              <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#94A3B8" strokeWidth="1.5" />
              <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#94A3B8" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x={paddingLeft - 5} y={paddingTop + 10} textAnchor="end" fill="#94A3B8" fontSize="7">Endo ↑</text>
              <text x={paddingLeft - 5} y={height - paddingBottom} textAnchor="end" fill="#94A3B8" fontSize="7">Exo ↓</text>

              <text x={plotX(100)} y={height - paddingBottom + 12} textAnchor="middle" fill="#94A3B8" fontSize="7">100°C</text>
              <text x={plotX(200)} y={height - paddingBottom + 12} textAnchor="middle" fill="#94A3B8" fontSize="7">200°C</text>

              {/* Dynamic Path */}
              {pathD && (
                <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Results Box */}
        {results && (
          <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-900">
              <Award className="w-4 h-4 text-red-700" />
              <span>OFFICIAL ASTM D3418 DSC TEST CERTIFICATE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-red-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Glass Transition (Tg)</span>
                <span className="font-mono text-base font-bold text-blue-600">{results.tg} °C</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-red-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Crystallization (Tc)</span>
                <span className="font-mono text-base font-bold text-emerald-600">{results.tc} °C</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-red-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Melting Peak (Tm)</span>
                <span className="font-mono text-base font-bold text-red-600">{results.tm} °C</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-red-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Crystallinity (χc)</span>
                <span className="font-mono text-base font-bold text-purple-600">{results.crystallinity}%</span>
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
            <span>Scanning Furnace ({Math.round(currentTemp)} °C)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run ASTM D3418 DSC Thermal Scan</span>
          </>
        )}
      </button>
    </div>
  )
}

export default DSCAnalyzer
