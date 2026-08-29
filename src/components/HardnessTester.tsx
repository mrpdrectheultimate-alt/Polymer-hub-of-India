// src/components/HardnessTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Gauge, Shield } from 'lucide-react'

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
  'pc': { name: 'PC (Polycarbonate High Rigidity)', hardness: 90, scale: 'Shore D' },
  'silicone': { name: 'Silicone Rubber (PDMS Elastomer)', hardness: 30, scale: 'Shore A' },
  'rubber': { name: 'Natural Vulcanized Rubber', hardness: 40, scale: 'Shore A' },
}

interface RunResults {
  hardness: number
  scale: string
}

export function HardnessTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [scale, setScale] = useState<'Shore A' | 'Shore D'>('Shore D')
  
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
    let targetHardness = m.hardness
    if (scale !== m.scale) {
      if (scale === 'Shore D' && m.scale === 'Shore A') {
        targetHardness = Math.max(5, m.hardness - 30)
      } else if (scale === 'Shore A' && m.scale === 'Shore D') {
        targetHardness = 95
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

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'hardness_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      setDialValue(Math.round((step / steps) * targetHardness))
    }, 35)
  }

  const needleAngle = -135 + (dialValue / 100) * 270

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider block">
                Durometer Indentation Hardness (ASTM D2240 / ISO 868)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Shore Durometer Hardness Bench (Type A &amp; D)
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Polymer Material
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
              <Shield className="w-3 h-3 text-blue-500" /> Durometer Scale Type
            </label>
            <select
              disabled={running}
              value={scale}
              onChange={(e) => setScale(e.target.value as 'Shore A' | 'Shore D')}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value="Shore A">Shore A (Blunt Cone - Rubbers &amp; Elastomers)</option>
              <option value="Shore D">Shore D (Sharp Pin - Rigid Thermoplastics)</option>
            </select>
          </div>
        </div>

        {/* Durometer needle dial SVG Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col items-center justify-center text-white">
          <svg width="220" height="170" viewBox="0 0 220 170" className="overflow-visible font-mono">
            {/* Outer dial housing */}
            <circle cx="110" cy="85" r="60" fill="#1E293B" stroke="#334155" strokeWidth="6" />
            <circle cx="110" cy="85" r="54" fill="#0F172A" stroke="#475569" strokeWidth="1" />

            {/* Dial Tick Marks */}
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val => {
              const angle = -135 + (val / 100) * 270
              const rad = (angle * Math.PI) / 180
              const x1 = 110 + Math.cos(rad) * 44
              const y1 = 85 + Math.sin(rad) * 44
              const x2 = 110 + Math.cos(rad) * 50
              const y2 = 85 + Math.sin(rad) * 50
              return (
                <line key={val} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth="1.5" />
              )
            })}

            {/* Scale Label */}
            <text x="110" y="62" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="bold">
              {scale}
            </text>
            <text x="110" y="125" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="bold">
              {Math.round(dialValue)}
            </text>

            {/* Needle Pointer */}
            <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '110px 85px', transition: 'transform 0.1s ease-out' }}>
              <line x1="110" y1="85" x2="110" y2="40" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="110" cy="85" r="4.5" fill="#EF4444" stroke="#F87171" />
            </g>
          </svg>
        </div>

        {/* Results Certificate */}
        {results && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-900">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>OFFICIAL ASTM D2240 DUROMETER CERTIFICATE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-emerald-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Indentation Hardness</span>
                <span className="font-mono text-base font-bold text-emerald-700">{results.hardness}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Official Durometer Scale</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.scale}</span>
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
            <span>Pressing Indenter Tip ({dialValue})…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Measure Durometer Hardness (ASTM D2240)</span>
          </>
        )}
      </button>
    </div>
  )
}

export default HardnessTester
