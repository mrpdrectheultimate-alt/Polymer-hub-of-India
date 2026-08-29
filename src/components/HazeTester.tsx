// src/components/HazeTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Sun, Shield } from 'lucide-react'

interface MaterialProp {
  name: string
  baseHaze: number // %
  baseTransmittance: number // %
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene Film)', baseHaze: 15, baseTransmittance: 85 },
  'pp': { name: 'PP (Polypropylene Cast Film)', baseHaze: 25, baseTransmittance: 75 },
  'pc': { name: 'PC (Polycarbonate Optical Sheet)', baseHaze: 5, baseTransmittance: 90 },
  'pet': { name: 'PET (Polyethylene Terephthalate Glass Clear)', baseHaze: 3, baseTransmittance: 92 },
  'pmma': { name: 'PMMA (Acrylic Optical Grade)', baseHaze: 2, baseTransmittance: 93 },
}

interface RunResults {
  haze: number
  transmittance: number
  materialName: string
}

export function HazeTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pet')
  const [thickness, setThickness] = useState(1.0) // mm
  
  const [running, setRunning] = useState(false)
  const [laserIntensity, setLaserIntensity] = useState(0) // 0 to 1
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setLaserIntensity(0)

    const m = MATERIALS[materialKey]
    const finalHaze = Math.min(99.9, m.baseHaze * thickness)
    const finalTransmittance = Math.max(5.0, m.baseTransmittance * Math.exp(-0.04 * (thickness - 1.0)))

    const steps = 25
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        clearInterval(interval)
        setLaserIntensity(1)
        
        const finalResults: RunResults = {
          haze: Number(finalHaze.toFixed(1)),
          transmittance: Number(finalTransmittance.toFixed(1)),
          materialName: m.name
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'haze_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      setLaserIntensity(step / steps)
    }, 40)
  }

  const laserOpacity = running ? laserIntensity : results ? 1 : 0
  const scatterCount = results ? Math.max(2, Math.round(results.haze / 10)) : 0

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600 tracking-wider block">
                Optical Clarity &amp; Wide-Angle Light Scatter (ASTM D1003 / ISO 14782)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Haze &amp; Luminous Transmittance Photometer Bench
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
              Polymer Material Film / Sheet
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
              <Shield className="w-3 h-3 text-blue-500" /> Specimen Thickness (mm)
            </label>
            <input
              type="number"
              disabled={running}
              step="0.5"
              min="0.5"
              max="5.0"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Light path animation view Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col items-center justify-center text-white">
          <svg width="260" height="130" viewBox="0 0 260 130" className="overflow-visible font-mono">
            {/* Light emitter source */}
            <rect x="10" y="45" width="28" height="36" rx="4" fill="#1E293B" stroke="#475569" />
            <circle cx="38" cy="63" r="5" fill="#F59E0B" />
            <text x="24" y="93" textAnchor="middle" fill="#94A3B8" fontSize="7">CIE Illuminant C</text>

            {/* Film specimen sample block */}
            <rect 
              x="110" 
              y="25" 
              width={`${6 + thickness * 4}`} 
              height="76" 
              rx="2"
              fill="rgba(56, 189, 248, 0.2)" 
              stroke="#38BDF8" 
              strokeWidth="1.5" 
            />
            <text x="115" y="18" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="bold">Sample ({thickness}mm)</text>

            {/* Integrating Sphere Photometer */}
            <circle cx="215" cy="63" r="22" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
            <circle cx="215" cy="63" r="8" fill="#0F172A" />
            <text x="215" y="96" textAnchor="middle" fill="#94A3B8" fontSize="7">Integrating Sphere</text>

            {/* Incident Light Beam */}
            <line 
              x1="38" 
              y1="63" 
              x2="110" 
              y2="63" 
              stroke="#F59E0B" 
              strokeWidth="4" 
              style={{ opacity: laserOpacity, transition: 'opacity 0.1s' }} 
            />

            {/* Transmitted Direct Beam */}
            {results && (
              <line 
                x1="118" 
                y1="63" 
                x2="195" 
                y2="63" 
                stroke="#F59E0B" 
                strokeWidth={`${Math.max(1, 4 * (results.transmittance / 100))}`} 
                style={{ opacity: laserOpacity }} 
              />
            )}

            {/* Scattered Haze Ray Lines (>2.5° deviation) */}
            {results && Array.from({ length: scatterCount }).map((_, i) => {
              const spread = -18 + (i / (scatterCount - 1 || 1)) * 36
              return (
                <line 
                  key={i}
                  x1="118" 
                  y1="63" 
                  x2="180" 
                  y2={`${63 + spread}`} 
                  stroke="#FDE68A" 
                  strokeWidth="1.2" 
                  strokeDasharray="2 2"
                  style={{ opacity: laserOpacity * 0.8 }}
                />
              )
            })}
          </svg>
        </div>

        {/* Results Certificate */}
        {results && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-700" />
              <span>OFFICIAL ASTM D1003 HAZE &amp; TRANSMITTANCE REPORT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Wide-Angle Haze (%)</span>
                <span className="font-mono text-base font-bold text-amber-700">{results.haze}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Total Luminous Transmittance (Tt)</span>
                <span className="font-mono text-base font-bold text-blue-700">{results.transmittance}%</span>
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
            <span>Measuring Light Scatter ({Math.round(laserIntensity * 100)}%)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Measure Haze &amp; Transmittance (ASTM D1003)</span>
          </>
        )}
      </button>
    </div>
  )
}

export default HazeTester
