// src/components/VicatTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  baseVicat: number // °C
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene)', baseVicat: 85 },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', baseVicat: 125 },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseVicat: 110 },
  'pc': { name: 'PC (Polycarbonate)', baseVicat: 145 },
  'nylon': { name: 'Nylon (Polyamide)', baseVicat: 185 },
}

interface RunResults {
  vicatTemp: number
  heatingRate: number
  load: number
}

export function VicatTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('ldpe')
  const [heatingRate, setHeatingRate] = useState(50) // °C/hr
  const [load, setLoad] = useState(10) // N

  const [running, setRunning] = useState(false)
  const [currentTemp, setCurrentTemp] = useState(25)
  const [penetration, setPenetration] = useState(0) // mm (0 to 1.2)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setPenetration(0)
    setCurrentTemp(25)

    const m = MATERIALS[materialKey]
    // Vicat softening point shifts slightly with higher load and heating rate factors
    const rateFactor = heatingRate === 120 ? 1.03 : 1.0
    const loadFactor = load === 50 ? 0.94 : 1.0
    const finalVicat = m.baseVicat * rateFactor * loadFactor

    const steps = 60
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        clearInterval(interval)
        setCurrentTemp(finalVicat)
        setPenetration(1.0)
        
        const finalResults: RunResults = {
          vicatTemp: Number(finalVicat.toFixed(1)),
          heatingRate,
          load
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'vicat-astm-d1525',
            parameters: { material: materialKey, heatingRate, load },
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
      const temp = 25 + t * (finalVicat + 15 - 25)
      setCurrentTemp(temp)

      // Penetration depth vs Temperature sigmoid transition curve
      // Needle sinks quickly as temperature crosses softening threshold
      const expTerm = Math.exp((temp - finalVicat) / 8)
      const depth = (expTerm / (1 + expTerm)) * 1.1
      setPenetration(depth)
    }, 45)
  }

  // Oil bath fluid glow indicator
  const bathColor = `rgba(${Math.min(255, 100 + (currentTemp / 200) * 155)}, 120, 40, 0.4)`

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Standard Softening Penetration</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🌡️ Vicat Softening Point — ASTM D1525</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Polymer Material</label>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Heating Rate</label>
            <select
              disabled={running}
              value={heatingRate}
              onChange={(e) => setHeatingRate(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value={50}>50 °C/hr (Standard)</option>
              <option value={120}>120 °C/hr</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Needle Load (N)</label>
            <select
              disabled={running}
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value={10}>10 N (Rate A)</option>
              <option value={50}>50 N (Rate B)</option>
            </select>
          </div>
        </div>

        {/* Oil bath immersion drawing */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 p-4 flex flex-col items-center justify-center">
          <svg width="220" height="180" viewBox="0 0 220 180" className="overflow-visible bg-white border border-slate-200 rounded-lg">
            
            {/* Oil container bath */}
            <rect x="60" y="80" width="100" height="70" fill={bathColor} stroke="#475569" strokeWidth="2.5" />
            <line x1="60" y1="90" x2="160" y2="90" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" /> {/* oil level line */}
            <text x="110" y="105" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">Silicon Oil Bath</text>

            {/* Specimen block on floor */}
            <rect x="90" y="130" width="40" height="20" fill="#94A3B8" stroke="#475569" strokeWidth="1" />

            {/* Weighted indenter rod & needle tip */}
            <g style={{ transform: `translateY(${penetration * 12}px)`, transition: 'transform 0.1s ease-out' }}>
              {/* Rod */}
              <line x1="110" y1="20" x2="110" y2="130" stroke="#334155" strokeWidth="2" />
              {/* Weighted block */}
              <rect x="95" y="30" width="30" height="15" fill="#475569" rx="1" />
              <text x="110" y="40" textAnchor="middle" className="fill-white font-mono text-[6px] font-black">{load} N</text>
              {/* 1mm2 flat tip */}
              <rect x="109" y="128" width="2" height="2" fill="#E2E8F0" />
            </g>

            {/* Bath Thermometer scale */}
            <rect x="175" y="40" width="12" height="110" fill="#F1F5F9" stroke="#94A3B8" rx="2" />
            {/* Red mercury indicator */}
            <rect 
              x="179" 
              y={`${145 - (currentTemp / 200) * 90}`} 
              width="4" 
              height={`${(currentTemp / 200) * 90}`} 
              fill="#EF4444" 
              rx="1" 
            />
            <text x="170" y="48" className="fill-slate-400 font-mono text-[6px]">Temp</text>
            <text x="170" y="145" className="fill-slate-400 font-mono text-[6px]">25°C</text>

            {/* Dial gauge display */}
            <rect x="15" y="20" width="40" height="24" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" rx="2" />
            <text x="35" y="32" textAnchor="middle" className="fill-slate-800 font-mono text-[8px] font-black">{penetration.toFixed(2)} mm</text>
            <text x="35" y="40" textAnchor="middle" className="fill-slate-400 font-mono text-[5px]">Penetration</text>
          </svg>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-amber-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-amber-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Heating oil bath chamber...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Vicat Test
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
                <CheckCircle className="w-3.5 h-3.5" /> Softening point captured
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Vicat Temp (1mm penetr.)</span>
                <strong className="text-xs text-slate-800">{results.vicatTemp} °C</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Rate / Load Specs</span>
                <strong className="text-xs text-slate-800">{results.heatingRate}°C/hr · {results.load}N</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Start heater bath to capture softening penetration threshold.
          </div>
        )}
      </div>
    </div>
  )
}
