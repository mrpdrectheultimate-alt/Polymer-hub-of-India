// src/components/DSCAnalyzer.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

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

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'dsc-astm-d3418',
            parameters: { material: materialKey, heatingRate },
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

      // Calculate simulated Heat Flow (mW/mg)
      // Exothermic crystallization peak pointing down, endothermic melting peak pointing up
      let baseHeatFlow = 0.5 + temp * 0.001 // steady baseline slope
      
      // Glass transition step (Tg)
      if (temp > m.tg - 10 && temp < m.tg + 10) {
        const stepProgress = (temp - (m.tg - 10)) / 20
        baseHeatFlow -= stepProgress * 0.15
      } else if (temp >= m.tg + 10) {
        baseHeatFlow -= 0.15
      }

      // Crystallization peak (Tc) - Exothermic (dip downwards)
      if (temp > m.tc - 20 && temp < m.tc + 20) {
        const width = 20
        const dist = Math.abs(temp - m.tc)
        const peakHeight = 0.8 * (heatingRate / 10)
        baseHeatFlow -= Math.max(0, peakHeight * (1 - Math.pow(dist / width, 2)))
      }

      // Melting peak (Tm) - Endothermic (spike upwards)
      if (temp > m.tm - 25 && temp < m.tm + 25) {
        const width = 25
        const dist = Math.abs(temp - m.tm)
        const peakHeight = 1.8 * (heatingRate / 10)
        baseHeatFlow += Math.max(0, peakHeight * (1 - Math.pow(dist / width, 2)))
      }

      setDataPoints(prev => [...prev, { temp, heatFlow: baseHeatFlow }])
      step++
    }, 45)
  }

  // Draw thermal curve SVG
  const width = 340
  const height = 180
  const paddingLeft = 45
  const paddingBottom = 35
  const paddingTop = 10
  const paddingRight = 10

  const plotX = (tempVal: number) => {
    return paddingLeft + (tempVal / 300) * (width - paddingLeft - paddingRight)
  }

  // Y-axis spans from -1.0 (exothermic) to 3.0 (endothermic)
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

  // Color gradient for heater block animation
  const heatColor = `rgb(${Math.min(255, 60 + (currentTemp / 300) * 195)}, 80, ${Math.max(50, 240 - (currentTemp / 300) * 190)})`

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-red-600 uppercase tracking-wider block mb-1">Standard DSC Thermal Scan</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🌡️ DSC Analysis — ASTM D3418</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Material Sample</label>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Heating Rate (°C/min)</label>
            <select
              disabled={running}
              value={heatingRate}
              onChange={(e) => setHeatingRate(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value={5}>5 °C/min</option>
              <option value={10}>10 °C/min (Standard)</option>
              <option value={20}>20 °C/min</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Cell Purge Gas</label>
            <select
              disabled={running}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option>Nitrogen (99.99%)</option>
              <option disabled>Helium (Ultra Pure)</option>
            </select>
          </div>
        </div>

        {/* Visual Animation & Thermogram Plot */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 p-4 flex gap-4 items-center justify-between">
          
          {/* Calorimeter Oven view */}
          <div className="text-center space-y-1">
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">DSC Cell</span>
            
            <div className="w-20 h-28 bg-white border border-slate-200 rounded relative flex flex-col items-center justify-center overflow-hidden mx-auto">
              
              {/* Crucible Heater furnace block */}
              <div 
                className="w-14 h-14 rounded-full border-4 border-slate-700 flex items-center justify-center transition-colors duration-100"
                style={{ backgroundColor: heatColor }}
              >
                {/* Reference & Sample Pans */}
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-slate-300 border border-slate-500 rounded-sm flex items-center justify-center text-[5px] font-black" title="Reference Pan">R</div>
                  <div className="w-4 h-4 bg-slate-100 border border-slate-500 rounded-sm flex items-center justify-center text-[5px] font-black" title="Sample Pan">S</div>
                </div>
              </div>

              {/* Temperature display */}
              <div className="mt-3 font-mono text-[8px] font-black text-slate-800 bg-slate-100 px-1 rounded border">
                {Math.round(currentTemp)}°C
              </div>
            </div>
            
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Furnace Glow</span>
          </div>

          {/* Graph view */}
          <div className="flex-1 relative border border-slate-200 bg-white p-1 rounded-lg">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
              {/* Grid Lines */}
              {[0, 1, 2].map(val => (
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
              <line x1={paddingLeft} y1={plotY(-1)} x2={width - paddingRight} y2={plotY(-1)} stroke="#0f172a" strokeWidth="2" className="" />
              <line x1={paddingLeft} y1={plotY(-1)} x2={paddingLeft} y2={paddingTop} stroke="#0f172a" strokeWidth="2" className="" />

              {/* Axes labels */}
              <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-slate-400 font-mono text-[8px] font-bold">Temperature (°C)</text>
              <text x="10" y={height / 2} textAnchor="middle" transform={`rotate(-90 10 ${height/2})`} className="fill-slate-400 font-mono text-[8px] font-bold">Heat Flow (Exo ↓)</text>

              {/* Axis values */}
              <text x={paddingLeft - 8} y={plotY(0) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">0.0</text>
              <text x={paddingLeft - 8} y={plotY(2) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[7px]">2.0</text>

              <text x={plotX(100)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">100</text>
              <text x={plotX(200)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">200</text>
              <text x={plotX(300)} y={height - 22} textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">300</text>

              {/* Plot path */}
              {dataPoints.length > 1 && (
                <path d={pathD} fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-red-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Thermocouple Scanning...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run DSC Scan
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
                <CheckCircle className="w-3.5 h-3.5" /> Thermogram Resolved
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Tg (Glass)</span>
                <strong className="text-xs text-slate-800">{results.tg}°C</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Tc (Cryst)</span>
                <strong className="text-xs text-slate-800">{results.tc === 0 ? '—' : `${results.tc}°C`}</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Tm (Melting)</span>
                <strong className="text-xs text-slate-800">{results.tm}°C</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Crystallinity</span>
                <strong className="text-xs text-slate-800">{results.crystallinity}%</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Start DSC heating cycle to capture thermal transition states.
          </div>
        )}
      </div>
    </div>
  )
}
