// src/components/IzodTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Zap, Shield, Thermometer } from 'lucide-react'

interface MaterialProp {
  name: string
  baseImpact: number // J/m
  fractureType: 'complete' | 'partial' | 'hinge'
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseImpact: 30, fractureType: 'hinge' },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseImpact: 150, fractureType: 'partial' },
  'pc': { name: 'PC (Polycarbonate High Impact)', baseImpact: 650, fractureType: 'complete' },
  'nylon6': { name: 'Nylon-6 (Polyamide 6 Conditioned)', baseImpact: 60, fractureType: 'hinge' },
  'pmma': { name: 'PMMA (Acrylic Glass Brittle)', baseImpact: 20, fractureType: 'complete' },
}

interface RunResults {
  impactStrength: number // J/m
  fractureType: string
  absorbedEnergy: number // J
}

export function IzodTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [notch, setNotch] = useState('v')
  const [temperature, setTemperature] = useState(23)
  const [pendulumEnergy, setPendulumEnergy] = useState(5.5)

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
    const tempFactor = temperature < 0 ? 0.4 + (temperature + 20) * 0.01 : 1 + (temperature - 23) * 0.005
    const notchFactor = notch === 'u' ? 1.4 : 1.0
    const finalImpact = m.baseImpact * tempFactor * notchFactor
    const absorbed = finalImpact * 0.0032

    let frame = 0
    const totalFrames = 50
    const interval = setInterval(() => {
      frame++
      if (frame >= totalFrames) {
        clearInterval(interval)
        
        const lossRatio = Math.min(0.85, absorbed / pendulumEnergy)
        const finalSwingAngle = 90 * (1 - lossRatio)
        setPendulumAngle(finalSwingAngle)
        
        const finalResults: RunResults = {
          impactStrength: Number(finalImpact.toFixed(1)),
          fractureType: m.fractureType,
          absorbedEnergy: Number(absorbed.toFixed(3)),
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'izod_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      const t = (frame / totalFrames)
      if (t < 0.3) {
        const progress = t / 0.3
        setPendulumAngle(-90 + progress * 90)
      } else {
        const progress = (t - 0.3) / 0.7
        const maxAngle = 90 * (1 - Math.min(0.85, absorbed / pendulumEnergy))
        setPendulumAngle(maxAngle * Math.sin(progress * Math.PI / 2))
      }
    }, 30)
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-violet-600 tracking-wider block">
                Cantilever Impact Toughness (ASTM D256 / ISO 180)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Izod Pendulum Impact Testing Simulator
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
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Polymer Specimen
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
              <Shield className="w-3 h-3 text-blue-500" /> Notch Profile
            </label>
            <select
              disabled={running}
              value={notch}
              onChange={(e) => setNotch(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value="v">Standard V-Notch (45°, r=0.25mm)</option>
              <option value="u">U-Notch (Round Root, r=1.0mm)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-red-500" /> Specimen Temp (°C)
            </label>
            <input
              type="number"
              disabled={running}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Hammer Capacity (Potential Energy)
            </label>
            <select
              disabled={running}
              value={pendulumEnergy}
              onChange={(e) => setPendulumEnergy(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={2.75}>2.75 J Hammer</option>
              <option value={5.5}>5.5 J Standard Hammer</option>
              <option value={11.0}>11.0 J Heavy Hammer</option>
              <option value={22.0}>22.0 J High-Capacity Hammer</option>
            </select>
          </div>
        </div>

        {/* Pendulum Animation View Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col items-center justify-center text-white">
          <svg width="260" height="190" viewBox="0 0 260 190" className="overflow-visible">
            {/* Upper Frame Mount */}
            <rect x="110" y="10" width="40" height="10" fill="#334155" rx="3" />
            <circle cx="130" cy="15" r="5" fill="#A78BFA" />

            {/* Dial Scale */}
            <path d="M 80 60 A 60 60 0 0 1 180 60" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="3 3" />
            <text x="130" y="48" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">Dial Energy Scale (Joules)</text>

            {/* Cantilever Vise Anvil */}
            <rect x="115" y="130" width="30" height="35" rx="3" fill="#475569" />
            
            {/* Clamped Vertical Cantilever Specimen */}
            <rect 
              x="127" 
              y="108" 
              width="6" 
              height="26" 
              rx="1"
              fill={results ? '#EF4444' : '#A78BFA'} 
              className="origin-bottom"
              style={{
                transform: results && results.fractureType === 'complete' ? 'translate(10px, -12px) rotate(45deg)' : 'none',
                transition: 'transform 0.5s ease-out'
              }}
            />

            {/* Pendulum Arm & Striker */}
            <g style={{ transform: `rotate(${pendulumAngle}deg)`, transformOrigin: '130px 15px', transition: running ? 'none' : 'transform 0.1s ease-out' }}>
              <line x1="130" y1="15" x2="130" y2="135" stroke="#94A3B8" strokeWidth="3" />
              <polygon points="120,125 140,125 130,140" fill="#8B5CF6" stroke="#7C3AED" />
            </g>

            {/* Specimen Info */}
            <text x="130" y="178" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">
              Cantilever Impact Line • Striking Edge r = 0.8 mm
            </text>
          </svg>
        </div>

        {/* Results Certificate */}
        {results && (
          <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-violet-900">
              <Award className="w-4 h-4 text-violet-700" />
              <span>OFFICIAL ASTM D256 IZOD IMPACT CERTIFICATE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-violet-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Izod Impact Strength</span>
                <span className="font-mono text-base font-bold text-violet-700">{results.impactStrength} J/m</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-violet-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Fracture Mode</span>
                <span className="font-mono text-base font-bold uppercase text-slate-800">{results.fractureType}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-violet-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Absorbed Energy</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.absorbedEnergy} Joules</span>
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
            <span>Striking Specimen…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Release Izod Hammer (ASTM D256)</span>
          </>
        )}
      </button>
    </div>
  )
}

export default IzodTester
