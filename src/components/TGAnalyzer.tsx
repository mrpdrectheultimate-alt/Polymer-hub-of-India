// src/components/TGAnalyzer.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Flame, Wind, Activity } from 'lucide-react'

interface MaterialProp {
  name: string
  onsetTemp: number // °C
  peakRateTemp: number // °C
  residue: number // %
}

const MATERIALS: Record<string, MaterialProp> = {
  'pe': { name: 'PE (Polyethylene Homopolymer)', onsetTemp: 410, peakRateTemp: 445, residue: 0.1 },
  'pvc': { name: 'PVC (Polyvinyl Chloride Multi-step)', onsetTemp: 270, peakRateTemp: 290, residue: 12.5 },
  'pmma': { name: 'PMMA (Acrylic Glass Depolymerization)', onsetTemp: 320, peakRateTemp: 365, residue: 0.2 },
  'ptfe': { name: 'PTFE (Teflon High Heat Stability)', onsetTemp: 520, peakRateTemp: 560, residue: 0.1 },
}

interface RunResults {
  onsetTemp: number
  peakRateTemp: number
  ashResidue: number
}

interface ChartPoint {
  temp: number
  weight: number
}

export function TGAnalyzer({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pe')
  const [heatingRate, setHeatingRate] = useState(20) // °C/min
  const [gasAtmosphere, setGasAtmosphere] = useState('nitrogen')

  const [running, setRunning] = useState(false)
  const [dataPoints, setDataPoints] = useState<ChartPoint[]>([])
  const [currentTemp, setCurrentTemp] = useState(100)
  const [currentWeight, setCurrentWeight] = useState(100)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setDataPoints([])
    setResults(null)

    const m = MATERIALS[materialKey]
    const startTemp = 100
    const endTemp = 650
    const steps = 80
    let step = 0

    const interval = setInterval(() => {
      if (step > steps) {
        clearInterval(interval)
        
        const finalResults: RunResults = {
          onsetTemp: m.onsetTemp,
          peakRateTemp: m.peakRateTemp,
          ashResidue: m.residue
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'tga_analyzer' })
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

      let wt = 100
      if (materialKey === 'pvc') {
        // Two-step decomposition for PVC (dehydrochlorination then backbone cracking)
        if (temp > 240 && temp <= 380) {
          const frac1 = (temp - 240) / 140
          wt = 100 - frac1 * 60
        } else if (temp > 380 && temp <= 520) {
          const frac2 = (temp - 380) / 140
          wt = 40 - frac2 * 27.5
        } else if (temp > 520) {
          wt = m.residue
        }
      } else {
        // Single-step sigmoidal decomposition curve
        if (temp > m.onsetTemp - 40) {
          const k = 0.05
          const lossFrac = 1 / (1 + Math.exp(-k * (temp - m.peakRateTemp)))
          wt = 100 - lossFrac * (100 - m.residue)
        }
      }

      wt = Math.max(m.residue, Math.min(100, wt))
      setCurrentWeight(wt)

      setDataPoints(prev => [...prev, { temp, weight: wt }])
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

  const plotX = (tempVal: number) => {
    return paddingLeft + ((tempVal - 100) / 550) * (width - paddingLeft - paddingRight)
  }

  const plotY = (wVal: number) => {
    return height - paddingBottom - (wVal / 100) * (height - paddingBottom - paddingTop)
  }

  const pathD = dataPoints.reduce((acc, p, idx) => {
    const x = plotX(p.temp)
    const y = plotY(p.weight)
    return acc + `${idx === 0 ? 'M' : 'L'} ${x} ${y} `
  }, '')

  const furnaceColor = `rgb(${Math.min(255, 40 + (currentTemp / 650) * 215)}, 50, 50)`

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-orange-600 tracking-wider block">
                Thermogravimetric Decomposition (ASTM E1131 / ISO 11358)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                TGA Pyrolysis &amp; Proximate Composition Analyzer
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
              <Wind className="w-3 h-3 text-blue-500" /> Atmosphere Gas
            </label>
            <select
              disabled={running}
              value={gasAtmosphere}
              onChange={(e) => setGasAtmosphere(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value="nitrogen">Nitrogen N₂ (Pyrolysis)</option>
              <option value="air">Air (Oxidative Degradation)</option>
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
              <option value={10}>10 °C/min</option>
              <option value={20}>20 °C/min (Standard ASTM)</option>
              <option value={50}>50 °C/min (Rapid Scan)</option>
            </select>
          </div>
        </div>

        {/* Visual Animation & Thermogram Plot Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col sm:flex-row gap-5 items-center justify-between text-white">
          {/* Microbalance Furnace Column */}
          <div className="text-center space-y-1.5 flex-shrink-0">
            <span className="font-mono text-[9px] uppercase font-bold text-slate-400 block">Balance Cell</span>
            
            <div className="w-24 h-32 bg-slate-800 border border-slate-700 rounded-2xl relative flex flex-col items-center justify-between py-2 overflow-hidden mx-auto shadow-inner">
              {/* Hangdown Wire */}
              <div className="w-0.5 h-12 bg-slate-400" />

              {/* Furnace Tube Glowing */}
              <div 
                className="w-10 h-16 border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center transition-colors duration-100"
                style={{ backgroundColor: furnaceColor }}
              >
                {/* Sample Pan hanging on wire */}
                <div 
                  className="w-5 h-2 bg-amber-400 border border-amber-500 rounded-t-sm shadow-md"
                  style={{
                    transform: `scale(${Math.max(0.2, currentWeight / 100)})`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              </div>

              <div className="font-mono text-[10px] font-bold text-orange-400 mt-1">
                {Math.round(currentTemp)} °C
              </div>
            </div>
            
            <span className="font-mono text-[8px] uppercase text-slate-500 block">Mass: {currentWeight.toFixed(1)}%</span>
          </div>

          {/* Real-time TGA Mass Loss Curve */}
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
              <text x={paddingLeft - 6} y={plotY(50)} textAnchor="end" fill="#94A3B8" fontSize="7">50%</text>
              <text x={paddingLeft - 6} y={plotY(100)} textAnchor="end" fill="#94A3B8" fontSize="7">100%</text>

              <text x={width - paddingRight} y={height - 6} textAnchor="end" fill="#94A3B8" fontSize="7">Temp (°C)</text>
              <text x={paddingLeft - 6} y={paddingTop} textAnchor="end" fill="#F59E0B" fontSize="7">Wt%</text>

              {/* Dynamic Path */}
              {pathD && (
                <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Results Certificate */}
        {results && (
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-900">
              <Award className="w-4 h-4 text-orange-700" />
              <span>OFFICIAL ASTM E1131 TGA THERMAL REPORT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-orange-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Onset Degradation (Tonset)</span>
                <span className="font-mono text-base font-bold text-orange-700">{results.onsetTemp} °C</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-orange-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Peak DTG Rate (Tmax)</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.peakRateTemp} °C</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-orange-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Inert Ash Residue</span>
                <span className="font-mono text-base font-bold text-emerald-700">{results.ashResidue}%</span>
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
            <span>Pyrolyzing Sample ({Math.round(currentTemp)}°C / Mass: {currentWeight.toFixed(1)}%)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run ASTM E1131 TGA Pyrolysis Scan</span>
          </>
        )}
      </button>
    </div>
  )
}

export default TGAnalyzer
