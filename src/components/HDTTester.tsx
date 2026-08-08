// src/components/HDTTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  baseHdt: number // °C
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseHdt: 100 },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', baseHdt: 75 },
  'abs': { name: 'ABS (Acrylonitrile Butadiene)', baseHdt: 95 },
  'pc': { name: 'PC (Polycarbonate)', baseHdt: 135 },
  'nylon': { name: 'Nylon (Polyamide)', baseHdt: 160 },
  'pmma': { name: 'PMMA (Acrylic Glass)', baseHdt: 90 },
}

interface RunResults {
  hdtTemp: number
  stress: number
  heatingRate: number
}

export function HDTTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pc')
  const [stress, setStress] = useState(0.45) // MPa
  const [heatingRate, setHeatingRate] = useState(120) // °C/hr

  const [running, setRunning] = useState(false)
  const [currentTemp, setCurrentTemp] = useState(25)
  const [deflection, setDeflection] = useState(0) // mm (0 to 0.30)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setDeflection(0)
    setCurrentTemp(25)

    const m = MATERIALS[materialKey]
    // HDT drops with higher stress and increases with faster heating rate
    const stressFactor = stress === 1.82 ? 0.85 : 1.0
    const rateFactor = heatingRate === 120 ? 1.02 : 1.0
    const finalHdt = m.baseHdt * stressFactor * rateFactor

    const steps = 60
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        clearInterval(interval)
        setCurrentTemp(finalHdt)
        setDeflection(0.25)
        
        const finalResults: RunResults = {
          hdtTemp: Number(finalHdt.toFixed(1)),
          stress,
          heatingRate
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'hdt-astm-d648',
            parameters: { material: materialKey, stress, heatingRate },
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
      const temp = 25 + t * (finalHdt + 15 - 25)
      setCurrentTemp(temp)

      // Deflection curve modeling elastic transition
      const expTerm = Math.exp((temp - finalHdt) / 10)
      const defl = (expTerm / (1 + expTerm)) * 0.28
      setDeflection(defl)
    }, 45)
  }

  const bathColor = `rgba(${Math.min(255, 90 + (currentTemp / 180) * 165)}, 110, 50, 0.4)`

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Standard Deflection Under Load</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🔥 Heat Deflection Temperature (HDT) — ASTM D648</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Polymer Material</label>
            <select
              disabled={running}
              value={materialKey}
              onChange={(e) => setMaterialKey(e.target.value)}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              {Object.entries(MATERIALS).map(([k, m]) => (
                <option key={k} value={k}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Bending Stress</label>
            <select
              disabled={running}
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={0.45}>0.45 MPa (Low Load)</option>
              <option value={1.82}>1.82 MPa (High Load)</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Heating Rate</label>
            <select
              disabled={running}
              value={heatingRate}
              onChange={(e) => setHeatingRate(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={50}>50 °C/hr</option>
              <option value={120}>120 °C/hr (Standard)</option>
            </select>
          </div>
        </div>

        {/* Oil bath deflection drawing */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-4 flex flex-col items-center justify-center">
          <svg width="220" height="180" viewBox="0 0 220 180" className="overflow-visible bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            
            {/* Oil container bath */}
            <rect x="50" y="80" width="120" height="70" fill={bathColor} stroke="#475569" strokeWidth="2.5" />
            <line x1="50" y1="90" x2="170" y2="90" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
            <text x="110" y="105" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">Silicon Oil Bath</text>

            {/* Supports for bending */}
            <rect x="75" y="140" width="10" height="10" fill="#334155" />
            <rect x="135" y="140" width="10" height="10" fill="#334155" />

            {/* Bending specimen bar */}
            <svg width="70" height="30" className="absolute top-[125px] left-[73px]">
              <path 
                d={`M 5 10 Q 35 ${10 + deflection * 35} 65 10`}
                fill="none" 
                stroke={running ? '#EA580C' : '#94A3B8'} 
                strokeWidth="4.5" 
                strokeLinecap="round"
              />
            </svg>

            {/* Center weighted loading nose */}
            <g style={{ transform: `translateY(${deflection * 30}px)`, transition: 'transform 0.1s ease-out' }}>
              <rect x="108" y="20" width="4" height="110" fill="#475569" />
              {/* Load weight block */}
              <rect x="95" y="30" width="30" height="15" fill="#334155" rx="1" />
              <text x="110" y="40" textAnchor="middle" className="fill-white font-mono text-[5px] font-black">{stress} MPa</text>
              {/* Wedge tip */}
              <polygon points="106,128 114,128 110,132" fill="#334155" />
            </g>

            {/* Bath Thermometer */}
            <rect x="180" y="40" width="12" height="110" fill="#F1F5F9" stroke="#94A3B8" rx="2" />
            <rect 
              x="184" 
              y={`${145 - (currentTemp / 200) * 90}`} 
              width="4" 
              height={`${(currentTemp / 200) * 90}`} 
              fill="#EF4444" 
              rx="1" 
            />
            <text x="180" y="32" className="fill-slate-400 font-mono text-[5px]">Temp</text>
            <text x="195" y="145" className="fill-slate-400 font-mono text-[5px]">25°C</text>

            {/* Dial gauge display */}
            <rect x="15" y="20" width="40" height="24" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" rx="2" />
            <text x="35" y="32" textAnchor="middle" className="fill-slate-800 dark:fill-slate-200 font-mono text-[8px] font-black">{deflection.toFixed(3)} mm</text>
            <text x="35" y="40" textAnchor="middle" className="fill-slate-400 font-mono text-[5px]">Deflection</text>
          </svg>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-amber-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-amber-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Immersive heating cycle...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start HDT Test
            </>
          )}
        </button>
      </div>

      {/* Results output */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {results ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-green-50 dark:bg-green-950/20 p-2.5 rounded-lg border border-green-200 dark:border-green-900">
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Deflection point registered
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Deflection Temp (0.25mm)</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.hdtTemp} °C</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Applied Fiber Stress</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.stress} MPa (Standard)</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg dark:bg-slate-900/40">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Start HDT bend cycle to capture 0.25 mm deflection limit temperature.
          </div>
        )}
      </div>
    </div>
  )
}
