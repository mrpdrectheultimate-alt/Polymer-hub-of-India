// src/components/HardnessTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  hardness: number
  scale: 'Shore A' | 'Shore D'
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene)', hardness: 45, scale: 'Shore A' },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', hardness: 65, scale: 'Shore D' },
  'pp': { name: 'PP (Polypropylene Homopolymer)', hardness: 70, scale: 'Shore D' },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', hardness: 85, scale: 'Shore D' },
  'pc': { name: 'PC (Polycarbonate)', hardness: 90, scale: 'Shore D' },
  'silicone': { name: 'Silicone Rubber (PDMS)', hardness: 30, scale: 'Shore A' },
  'rubber': { name: 'Natural Rubber', hardness: 40, scale: 'Shore A' },
}

interface RunResults {
  hardness: number
  scale: string
}

export function HardnessTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [scale, setScale] = useState('Shore D')
  
  const [running, setRunning] = useState(false)
  const [dialValue, setDialValue] = useState(0)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setDialValue(0)

    const m = MATERIALS[materialKey]
    // If user selects wrong scale (A for hard plastic, D for soft rubber), adjust value or give zero
    let targetHardness = m.hardness
    if (scale !== m.scale) {
      if (scale === 'Shore D' && m.scale === 'Shore A') {
        targetHardness = Math.max(5, m.hardness - 30) // Soft materials have very low Shore D
      } else if (scale === 'Shore A' && m.scale === 'Shore D') {
        targetHardness = 95 // Hard materials peg Shore A at max
      }
    }

    const steps = 30
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        clearInterval(interval)
        setDialValue(targetHardness)
        
        const finalResults: RunResults = {
          hardness: targetHardness,
          scale: scale
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'hardness-shore-ad',
            parameters: { material: materialKey, scale },
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

      // Animate dial needle jumping up to target
      const t = step / steps
      setDialValue(targetHardness * Math.sin(t * Math.PI / 2))
    }, 40)
  }

  // Calculate needle angle on the dial (from -135 deg to 135 deg for 0-100 scale)
  const needleAngle = -135 + (dialValue / 100) * 270

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-green-600 uppercase tracking-wider block mb-1">Standard Durometer Test</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">📏 Hardness Testing — Shore A/D</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Durometer Scale</label>
            <select
              disabled={running}
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value="Shore A">Shore A (Soft / Elastomeric)</option>
              <option value="Shore D">Shore D (Hard / Rigid Polymers)</option>
            </select>
          </div>
        </div>

        {/* Durometer needle dial SVG */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-4 flex flex-col items-center justify-center">
          <svg width="200" height="160" viewBox="0 0 200 160" className="overflow-visible bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            
            {/* Durometer Circular Dial face */}
            <circle cx="100" cy="80" r="50" fill="none" stroke="#64748B" strokeWidth="6" />
            <circle cx="100" cy="80" r="47" fill="none" stroke="#CBD5E1" strokeWidth="1" />

            {/* Dial Tick marks */}
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => {
              const angle = -135 + (val / 100) * 270
              const rad = (angle * Math.PI) / 180
              const x1 = 100 + Math.cos(rad) * 40
              const y1 = 80 + Math.sin(rad) * 40
              const x2 = 100 + Math.cos(rad) * 45
              const y2 = 80 + Math.sin(rad) * 45
              return (
                <line key={val} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="1.5" />
              )
            })}

            {/* Scale label text */}
            <text x="100" y="60" textAnchor="middle" className="fill-slate-400 font-mono text-[7px] font-bold">{scale}</text>
            <text x="100" y="115" textAnchor="middle" className="fill-slate-800 dark:fill-slate-200 font-mono text-[10px] font-black">{Math.round(dialValue)}</text>

            {/* Needle indicator pointer */}
            <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 80px', transition: 'transform 0.1s ease-out' }}>
              <line x1="100" y1="80" x2="100" y2="40" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              <circle cx="100" cy="80" r="4" fill="#EF4444" />
            </g>
          </svg>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-green-700 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-green-800 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Pressing indenter tip...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Measure Hardness
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
                <CheckCircle className="w-3.5 h-3.5" /> Measurement logged
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Hardness Value</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.hardness} {results.scale}</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Durometer Calibration</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">ASTM D2240 Compliant</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg dark:bg-slate-900/40">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Apply durometer tip to material to resolve indentation resistance.
          </div>
        )}
      </div>
    </div>
  )
}
