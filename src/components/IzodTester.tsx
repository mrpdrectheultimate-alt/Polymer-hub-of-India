// src/components/IzodTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  baseImpact: number // J/m
  fractureType: 'complete' | 'partial' | 'hinge'
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseImpact: 30, fractureType: 'hinge' },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseImpact: 150, fractureType: 'partial' },
  'pc': { name: 'PC (Polycarbonate)', baseImpact: 650, fractureType: 'complete' },
  'nylon6': { name: 'Nylon-6 (Polyamide 6)', baseImpact: 60, fractureType: 'hinge' },
  'pmma': { name: 'PMMA (Acrylic Glass)', baseImpact: 20, fractureType: 'complete' },
}

interface RunResults {
  impactStrength: number // J/m
  fractureType: string
  absorbedEnergy: number // J
}

export function IzodTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [notch, setNotch] = useState('v') // v or u
  const [temperature, setTemperature] = useState(23) // °C
  const [pendulumEnergy, setPendulumEnergy] = useState(5.5) // Joules

  const [running, setRunning] = useState(false)
  const [pendulumAngle, setPendulumAngle] = useState(-90) // starting angle (90 deg left)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setPendulumAngle(-90)

    const m = MATERIALS[materialKey]
    // Temperature effect: lower temp = more brittle = lower impact
    const tempFactor = temperature < 0 ? 0.4 + (temperature + 20) * 0.01 : 1 + (temperature - 23) * 0.005
    // Notch effect: U-notch has higher stress concentration resistance = higher impact rating
    const notchFactor = notch === 'u' ? 1.4 : 1.0
    const finalImpact = m.baseImpact * tempFactor * notchFactor
    
    // Absorbed energy: impact strength is in J/m of notch width. Standard specimen width is 3.2 mm (0.0032 m).
    // E = Impact Strength * 0.0032
    const absorbed = (finalImpact * 0.0032)

    let frame = 0
    const totalFrames = 50
    const interval = setInterval(() => {
      frame++
      if (frame >= totalFrames) {
        clearInterval(interval)
        
        // Final swing position: swings up on the right side.
        // If absorbed energy is high, pendulum swings up less.
        const lossFactor = Math.min(0.9, absorbed / pendulumEnergy)
        const finalSwingAngle = 90 * (1 - lossFactor)
        setPendulumAngle(finalSwingAngle)
        
        const finalResults: RunResults = {
          impactStrength: Number(finalImpact.toFixed(1)),
          fractureType: m.fractureType,
          absorbedEnergy: Number(absorbed.toFixed(3))
        }
        setResults(finalResults)
        setRunning(false)

        // Save session
        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'izod-astm-d256',
            parameters: { material: materialKey, notch, temperature, pendulumEnergy },
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

      // Procedural swing animation
      // Swing down from -90 to 0, then swing up to final target
      const t = frame / totalFrames
      if (t < 0.3) {
        // Swing down
        const progress = t / 0.3
        setPendulumAngle(-90 + progress * 90)
      } else {
        // Swing up on right
        const progress = (t - 0.3) / 0.7
        const maxAngle = 90 * (1 - Math.min(0.85, absorbed / pendulumEnergy))
        // Dampened sinusoid swing up
        setPendulumAngle(maxAngle * Math.sin(progress * Math.PI / 2))
      }
    }, 40)
  }

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-violet-600 uppercase tracking-wider block mb-1">Standard Izod Pendulum Test</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🔨 Impact Testing (Izod) — ASTM D256</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Polymer Specimen</label>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Notch Profile</label>
            <select
              disabled={running}
              value={notch}
              onChange={(e) => setNotch(e.target.value)}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value="v">V-Notch (Standard)</option>
              <option value="u">U-Notch</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Specimen Temp (°C)</label>
            <input
              type="number"
              disabled={running}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-1.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Hammer Capacity (Joules)</label>
            <select
              disabled={running}
              value={pendulumEnergy}
              onChange={(e) => setPendulumEnergy(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={2.75}>2.75 J Hammer</option>
              <option value={5.5}>5.5 J Hammer (Standard)</option>
              <option value={11.0}>11.0 J Hammer</option>
              <option value={22.0}>22.0 J Hammer</option>
            </select>
          </div>
        </div>

        {/* Pendulum Animation View */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-4 flex flex-col items-center justify-center">
          <svg width="240" height="180" viewBox="0 0 240 180" className="overflow-visible bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            {/* Upper frame mount */}
            <rect x="100" y="10" width="40" height="8" fill="#475569" rx="2" />
            <circle cx="120" cy="14" r="4" fill="#1E293B" />

            {/* Dial scale */}
            <path d="M 80 50 A 50 50 0 0 1 160 50" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="3 3" />
            <text x="120" y="45" textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">Dial Energy Scale</text>

            {/* Specimen support blocks */}
            <rect x="110" y="130" width="20" height="30" fill="#334155" />
            
            {/* Clamped specimen */}
            <rect 
              x="117" 
              y="110" 
              width="6" 
              height="24" 
              fill={results ? '#EF4444' : '#64748B'} 
              className="origin-bottom"
              style={{
                transform: results && results.fractureType === 'complete' ? 'translate(8px, -12px) rotate(45deg)' : 'none',
                transition: 'transform 0.5s ease-out'
              }}
            />
            {/* V-Notch indicator */}
            {!results && <polygon points="117,122 119,122 117,120" fill="#F8FAFC" />}

            {/* Pendulum Arm & Hammer */}
            <g style={{ transform: `rotate(${pendulumAngle}deg)`, transformOrigin: '120px 14px', transition: running ? 'none' : 'transform 0.1s ease-out' }}>
              {/* Rod */}
              <line x1="120" y1="14" x2="120" y2="125" stroke="#94A3B8" strokeWidth="2.5" />
              {/* Hammer striker mass */}
              <circle cx="120" cy="120" r="12" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
              <circle cx="120" cy="120" r="3" fill="#475569" />
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
              <Loader2 className="w-4 h-4 animate-spin" /> Simulating striker drop...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Release Hammer
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
                <CheckCircle className="w-3.5 h-3.5" /> Fracture Logged successfully
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Impact Strength</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.impactStrength} J/m</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Fracture Mode</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100 capitalize">{results.fractureType}</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Absorbed Energy</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.absorbedEnergy} J</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg dark:bg-slate-900/40">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Cock the hammer and press Release to test toughness.
          </div>
        )}
      </div>
    </div>
  )
}
