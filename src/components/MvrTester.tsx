// src/components/MvrTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  baseMfr: number // g/10min
  baseMvr: number // cm³/10min
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene)', baseMfr: 2.0, baseMvr: 2.2 },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', baseMfr: 0.5, baseMvr: 0.6 },
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseMfr: 1.5, baseMvr: 1.7 },
  'ps': { name: 'PS (Polystyrene)', baseMfr: 7.0, baseMvr: 8.0 },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseMfr: 2.0, baseMvr: 2.3 },
}

interface RunResults {
  mfr: number
  mvr: number
  temperature: number
  load: number
}

export function MvrTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [temperature, setTemperature] = useState(230) // °C
  const [load, setLoad] = useState(2.16) // kg

  const [running, setRunning] = useState(false)
  const [pistonY, setPistonY] = useState(0) // offset down (0 to 40)
  const [strandLength, setStrandLength] = useState(0) // offset length down (0 to 50)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setPistonY(0)
    setStrandLength(0)

    const m = MATERIALS[materialKey]
    // MFI rate expands with temperature and load weight
    const tempFactor = temperature / 230
    const loadFactor = load / 2.16
    const finalMfr = m.baseMfr * tempFactor * loadFactor
    const finalMvr = m.baseMvr * tempFactor * loadFactor

    const steps = 50
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        clearInterval(interval)
        setPistonY(35)
        setStrandLength(45)
        
        const finalResults: RunResults = {
          mfr: Number(finalMfr.toFixed(2)),
          mvr: Number(finalMvr.toFixed(2)),
          temperature,
          load
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'mvr-iso-1133',
            parameters: { material: materialKey, temperature, load },
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
      setPistonY(t * 35)
      setStrandLength(t * 45)
    }, 50)
  }

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-orange-600 uppercase tracking-wider block mb-1">Standard Capillary Rheometry</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🔥 MFR/MVR Melt Volume Rate Test — ISO 1133</h2>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Barrel Temp (°C)</label>
            <select
              disabled={running}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={190}>190°C</option>
              <option value={230}>230°C (Standard)</option>
              <option value={250}>250°C</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Test Load Weight</label>
            <select
              disabled={running}
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={2.16}>2.16 kg (Standard)</option>
              <option value={5.0}>5.0 kg</option>
              <option value={10.0}>10.0 kg</option>
            </select>
          </div>
        </div>

        {/* Piston chamber extrusion drawing */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-4 flex flex-col items-center justify-center">
          <svg width="220" height="180" viewBox="0 0 220 180" className="overflow-visible bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            
            {/* Extrusion Barrel Cylindrical tube */}
            <rect x="95" y="40" width="30" height="80" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
            <rect x="104" y="40" width="12" height="78" fill="#F8FAFC" /> {/* Bore cylinder cavity */}
            <line x1="104" y1="118" x2="116" y2="118" stroke="#1E293B" strokeWidth="2" /> {/* Die land orifice */}

            {/* Piston rod shaft with weight assembly platform */}
            <g style={{ transform: `translateY(${pistonY}px)`, transition: 'transform 0.1s ease-out' }}>
              <rect x="105" y="2" width="10" height="40" fill="#64748B" />
              <rect x="90" y="0" width="40" height="5" fill="#475569" />
              {/* Load weight block */}
              <rect x="98" y="-12" width="24" height="12" fill="#334155" rx="1" />
              <text x="110" y="-4" textAnchor="middle" className="fill-white font-mono text-[6px] font-black">{load}kg</text>
            </g>

            {/* Extruded polymer strand strand hanging from the bottom orifice */}
            {strandLength > 0 && (
              <line 
                x1="110" 
                y1="120" 
                x2="110" 
                y2={`${120 + strandLength}`} 
                stroke="#EA580C" 
                strokeWidth="2" 
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}

            {/* Heater band rings */}
            <rect x="92" y="60" width="4" height="12" fill="#EF4444" rx="1" />
            <rect x="124" y="60" width="4" height="12" fill="#EF4444" rx="1" />
            <rect x="92" y="90" width="4" height="12" fill="#EF4444" rx="1" />
            <rect x="124" y="90" width="4" height="12" fill="#EF4444" rx="1" />
          </svg>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-orange-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-orange-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Extruding polymer melt...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Extrusion
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
                <CheckCircle className="w-3.5 h-3.5" /> Extrusion cycle completed
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Melt Flow Rate (MFR)</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.mfr} g/10 min</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Melt Volume Rate (MVR)</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.mvr} cm³/10 min</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg dark:bg-slate-900/40">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Apply weight and trigger extrusion flow to record volume rates.
          </div>
        )}
      </div>
    </div>
  )
}
