// src/components/CharpyTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Zap, Thermometer, Shield } from 'lucide-react'

interface MaterialProp {
  name: string
  baseImpact: number // kJ/m²
  fractureType: 'complete' | 'partial' | 'hinge'
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseImpact: 20, fractureType: 'hinge' },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseImpact: 30, fractureType: 'partial' },
  'pc': { name: 'PC (Polycarbonate High Toughness)', baseImpact: 55, fractureType: 'complete' },
  'nylon': { name: 'Nylon 6,6 (Dry As Molded)', baseImpact: 40, fractureType: 'hinge' },
  'pmma': { name: 'PMMA (Acrylic Glass Brittle)', baseImpact: 8, fractureType: 'complete' },
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
          temperature,
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'charpy_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      // Smooth pendulum swing motion
      const currentAngle = -90 + (frame / totalFrames) * 160
      setPendulumAngle(currentAngle)
    }, 20)
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-purple-600 tracking-wider block">
                Impact Toughness &amp; Fracture Dynamics (ASTM D6110 / ISO 179)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Charpy Pendulum Impact Test Simulator
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
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
              <Shield className="w-3 h-3 text-blue-500" /> Notch Geometry
            </label>
            <select
              disabled={running}
              value={notch}
              onChange={(e) => setNotch(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value="v">Type A: 45° V-Notch (r=0.25mm)</option>
              <option value="u">Type B: U-Notch (r=1.0mm)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-red-500" /> Test Temp (°C)
            </label>
            <input
              type="number"
              disabled={running}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Charpy Swing Animation Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col items-center justify-center text-white">
          <svg width="260" height="190" viewBox="0 0 260 190" className="overflow-visible">
            {/* Top Pivot Bearing */}
            <rect x="110" y="10" width="40" height="10" fill="#334155" rx="3" />
            <circle cx="130" cy="15" r="5" fill="#38BDF8" />
            <path d="M 80 60 A 60 60 0 0 1 180 60" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="3 3" />

            {/* Horizontal Specimen Anvil Supports */}
            <rect x="100" y="145" width="16" height="20" rx="2" fill="#64748B" />
            <rect x="144" y="145" width="16" height="20" rx="2" fill="#64748B" />
            
            {/* Horizontal Specimen Bar */}
            <rect 
              x="102" 
              y="139" 
              width="56" 
              height="6" 
              rx="1"
              fill={results ? '#EF4444' : '#38BDF8'} 
              style={{
                transform: results && results.fractureType === 'complete' ? 'translateY(12px) rotate(15deg)' : 'none',
                transition: 'transform 0.4s ease-out'
              }}
            />

            {/* Pendulum Arm & Striker */}
            <g style={{ transform: `rotate(${pendulumAngle}deg)`, transformOrigin: '130px 15px', transition: running ? 'none' : 'transform 0.1s ease-out' }}>
              <line x1="130" y1="15" x2="130" y2="135" stroke="#94A3B8" strokeWidth="3" />
              <polygon points="120,125 140,125 130,140" fill="#F59E0B" stroke="#D97706" />
            </g>

            {/* Angular scale dial */}
            <text x="130" y="178" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">
              Strike Velocity: 2.9 m/s • Potential Energy: 15.0 J
            </text>
          </svg>
        </div>

        {/* Results Box */}
        {results && (
          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-900">
              <Award className="w-4 h-4 text-purple-700" />
              <span>OFFICIAL ASTM D6110 CHARPY IMPACT CERTIFICATE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-purple-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Charpy Impact Strength</span>
                <span className="font-mono text-base font-bold text-purple-700">{results.impactStrength} kJ/m²</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-purple-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Fracture Morphology</span>
                <span className="font-mono text-base font-bold uppercase text-slate-800">{results.fractureType}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-purple-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Conditioning Temp</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.temperature} °C</span>
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
            <span>Swinging Pendulum Hammer…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Release Pendulum Hammer (ASTM D6110)</span>
          </>
        )}
      </button>
    </div>
  )
}

export default CharpyTester
