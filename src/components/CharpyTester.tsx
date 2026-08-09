// src/components/CharpyTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  baseImpact: number // kJ/m²
  fractureType: 'complete' | 'partial' | 'hinge'
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseImpact: 20, fractureType: 'hinge' },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseImpact: 30, fractureType: 'partial' },
  'pc': { name: 'PC (Polycarbonate)', baseImpact: 55, fractureType: 'complete' },
  'nylon': { name: 'Nylon (Polyamide)', baseImpact: 40, fractureType: 'hinge' },
  'pmma': { name: 'PMMA (Acrylic Glass)', baseImpact: 8, fractureType: 'complete' },
}

interface RunResults {
  impactStrength: number // kJ/m²
  fractureType: string
  temperature: number
}

export function CharpyTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [notch, setNotch] = useState('v')
  const [temperature, setTemperature] = useState(23)
  const [running, setRunning] = useState(false)
  const [pendulumAngle, setPendulumAngle] = useState(-90)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setPendulumAngle(-90)

    const m = MATERIALS[materialKey]
    const tempFactor = temperature > 0 ? 1 : 0.5
    const notchFactor = notch === 'v' ? 1 : 1.3
    const finalImpact = m.baseImpact * tempFactor * notchFactor

    let frame = 0
    const totalFrames = 50
    const interval = setInterval(() => {
      frame++
      if (frame >= totalFrames) {
        clearInterval(interval)
        
        const lossFactor = Math.min(0.9, finalImpact / 100)
        const finalSwingAngle = 90 * (1 - lossFactor)
        setPendulumAngle(finalSwingAngle)
        
        const finalResults: RunResults = {
          impactStrength: Number(finalImpact.toFixed(1)),
          fractureType: m.fractureType,
          temperature: temperature
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'charpy-astm-d6110',
            parameters: { material: materialKey, notch, temperature },
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

      const t = frame / totalFrames
      if (t < 0.3) {
        const progress = t / 0.3
        setPendulumAngle(-90 + progress * 90)
      } else {
        const progress = (t - 0.3) / 0.7
        const maxAngle = 90 * (1 - Math.min(0.85, finalImpact / 100))
        setPendulumAngle(maxAngle * Math.sin(progress * Math.PI / 2))
      }
    }, 40)
  }

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-violet-600 uppercase tracking-wider block mb-1">Standard Charpy Pendulum Test</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🔨 Charpy Impact Test — ASTM D6110</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Material</label>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Notch Type</label>
            <select
              disabled={running}
              value={notch}
              onChange={(e) => setNotch(e.target.value)}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            >
              <option value="v">V-notch</option>
              <option value="u">U-notch</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Temp (°C)</label>
            <input
              type="number"
              disabled={running}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-1.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Charpy Swing Animation */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 p-4 flex flex-col items-center justify-center">
          <svg width="240" height="180" viewBox="0 0 240 180" className="overflow-visible bg-white border border-slate-200 rounded-lg">
            <rect x="100" y="10" width="40" height="8" fill="#475569" rx="2" />
            <circle cx="120" cy="14" r="4" fill="#1E293B" />
            <path d="M 80 50 A 50 50 0 0 1 160 50" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="3 3" />

            {/* Horizontal specimen support bridges */}
            <rect x="90" y="140" width="16" height="20" fill="#334155" />
            <rect x="134" y="140" width="16" height="20" fill="#334155" />
            
            {/* Horizontal specimen bar */}
            <rect 
              x="92" 
              y="134" 
              width="56" 
              height="6" 
              fill={results ? '#EF4444' : '#64748B'} 
              style={{
                transform: results && results.fractureType === 'complete' ? 'translateY(12px) rotate(15deg)' : 'none',
                transition: 'transform 0.4s ease-out'
              }}
            />

            {/* Pendulum Arm & Striker */}
            <g style={{ transform: `rotate(${pendulumAngle}deg)`, transformOrigin: '120px 14px', transition: running ? 'none' : 'transform 0.1s ease-out' }}>
              <line x1="120" y1="14" x2="120" y2="135" stroke="#94A3B8" strokeWidth="2.5" />
              <rect x="110" y="125" width="20" height="12" fill="#E2E8F0" stroke="#475569" strokeWidth="2" rx="1" />
            </g>
          </svg>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-violet-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-violet-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Striking specimen...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run Charpy Test
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
                <CheckCircle className="w-3.5 h-3.5" /> Specimen Fractured Successfully
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Impact Strength</span>
                <strong className="text-xs text-slate-800">{results.impactStrength} kJ/m²</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Fracture Mode</span>
                <strong className="text-xs text-slate-800 capitalize">{results.fractureType}</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Temperature</span>
                <strong className="text-xs text-slate-800">{results.temperature}°C</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Start swing test to record Charpy impact strength.
          </div>
        )}
      </div>
    </div>
  )
}
