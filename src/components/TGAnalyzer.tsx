// src/components/TGAnalyzer.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  onsetTemp: number // °C
  peakRateTemp: number // °C
  residue: number // %
}

const MATERIALS: Record<string, MaterialProp> = {
  'pe': { name: 'PE (Polyethylene Homopolymer)', onsetTemp: 410, peakRateTemp: 445, residue: 0.1 },
  'pvc': { name: 'PVC (Polyvinyl Chloride)', onsetTemp: 270, peakRateTemp: 290, residue: 12.5 }, // multi-step HCl release
  'pmma': { name: 'PMMA (Acrylic Glass)', onsetTemp: 320, peakRateTemp: 365, residue: 0.2 },
  'ptfe': { name: 'PTFE (Teflon / Fluoropolymer)', onsetTemp: 520, peakRateTemp: 560, residue: 0.1 },
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
  const [gasAtmosphere, setGasAtmosphere] = useState('nitrogen') // nitrogen or air

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

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'tga-astm-e1131',
            parameters: { material: materialKey, heatingRate, gasAtmosphere },
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
      const temp = startTemp + t * (endTemp - startTemp)
      setCurrentTemp(temp)

      // Calculate weight degradation curve
      let weight = 100
      
      if (materialKey === 'pvc') {
        // Double step decomposition for PVC (270°C and 450°C)
        if (temp < 250) {
          weight = 100
        } else if (temp >= 250 && temp < 350) {
          const degT = (temp - 250) / 100
          weight = 100 - degT * 55 // Lose ~55% weight as HCl gas
        } else if (temp >= 350 && temp < 430) {
          weight = 45
        } else {
          const degT = Math.min(1.0, (temp - 430) / 120)
          weight = 45 - degT * (45 - m.residue) // carbon residue remaining
        }
      } else {
        // Single step decomposition (PE, PMMA, PTFE)
        if (temp < m.onsetTemp) {
          weight = 100
        } else if (temp >= m.onsetTemp && temp < m.peakRateTemp + 50) {
          const width = 80
          const progress = (temp - m.onsetTemp) / width
          weight = 100 - Math.min(1.0, progress) * (100 - m.residue)
        } else {
          weight = m.residue
        }
      }

      // Air atmosphere causes complete oxidation (combustion) reducing residue to nearly 0%
      if (gasAtmosphere === 'air' && temp > 500) {
        weight = Math.max(0, weight * 0.1)
      }

      setCurrentWeight(weight)
      setDataPoints(prev => [...prev, { temp, weight }])
      step++
    }, 45)
  }

  // Draw Weight vs Temp plot
  const width = 340
  const height = 180
  const paddingLeft = 45
  const paddingBottom = 35
  const paddingTop = 10
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

  // Color gradient for furnace glow tube
  const furnaceColor = `rgb(${Math.min(255, 40 + (currentTemp / 650) * 215)}, 50, 50)`

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-orange-600 uppercase tracking-wider block mb-1">Standard Decomposition Analysis</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🔥 TGA Analysis — ASTM E1131</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Polymer Sample</label>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Purge Atmosphere</label>
            <select
              disabled={running}
              value={gasAtmosphere}
              onChange={(e) => setGasAtmosphere(e.target.value)}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value="nitrogen">Nitrogen (Pyrolysis)</option>
              <option value="air">Air (Oxidative Degradation)</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Heating Rate</label>
            <select
              disabled={running}
              value={heatingRate}
              onChange={(e) => setHeatingRate(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value={10}>10 °C/min</option>
              <option value={20}>20 °C/min (Standard)</option>
              <option value={50}>50 °C/min</option>
            </select>
          </div>
        </div>

        {/* Visual Animation & Thermogram Plot */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 p-4 flex gap-4 items-center justify-between">
          
          {/* Hang-down microbalance furnace tube animation */}
          <div className="text-center space-y-1">
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Balance Furnace</span>
            
            <div className="w-20 h-28 bg-white border border-slate-200 rounded relative flex flex-col items-center justify-between py-2 overflow-hidden mx-auto">
              
              {/* Microbalance wire hanging down */}
              <line x1="40" y1="0" x2="40" y2="60" stroke="#94A3B8" strokeWidth="1" className="absolute left-[39px] top-0" />

              {/* Furnace Heating Tube */}
              <div 
                className="w-8 h-20 border-x-4 border-slate-700 absolute top-[40px] left-[26px] flex flex-col items-center justify-end pb-3 transition-colors duration-100"
                style={{ backgroundColor: furnaceColor }}
              >
                {/* Sample Pan hanging on wire */}
                <div 
                  className="w-5 h-2 bg-yellow-bright border border-amber-600 rounded-t-sm shadow-md"
                  style={{
                    transform: `scale(${Math.max(0.2, currentWeight / 100)})`,
                    opacity: running ? 0.8 : 1,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              </div>

              {/* Temperature display */}
              <div className="mt-auto font-mono text-[8px] font-black text-slate-800 bg-slate-100 px-1 rounded border z-10">
                {Math.round(currentTemp)}°C
              </div>
            </div>
            
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Mass: {currentWeight.toFixed(1)}%</span>
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
              <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-slate-400 font-mono text-[8px] font-bold">Temperature (°C)</text>
              <text x="10" y={height / 2} textAnchor="middle" transform={`rotate(-90 10 ${height/2})`} className="fill-slate-400 font-mono text-[8px] font-bold">Weight Remaining (%)</text>

              {/* Axis values */}
              <text x={paddingLeft - 8} y={plotY(0) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">0</text>
              <text x={paddingLeft - 8} y={plotY(50) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">50</text>
              <text x={paddingLeft - 8} y={plotY(100) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">100</text>

              <text x={plotX(200)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">200</text>
              <text x={plotX(400)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">400</text>
              <text x={plotX(600)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">600</text>

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
          className="w-full bg-orange-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-orange-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Thermogravimetric Pyrolysis...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run TGA Scan
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
                <CheckCircle className="w-3.5 h-3.5" /> Thermal Decomposition Completed
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Onset Temp (Td)</span>
                <strong className="text-xs text-slate-800">{results.onsetTemp}°C</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Inflection Temp</span>
                <strong className="text-xs text-slate-800">{results.peakRateTemp}°C</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Residue (Ash)</span>
                <strong className="text-xs text-slate-800">{results.ashResidue}%</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Heat the microbalance chamber to record decomposition profiles.
          </div>
        )}
      </div>
    </div>
  )
}
