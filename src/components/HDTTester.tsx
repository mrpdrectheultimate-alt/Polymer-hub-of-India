// src/components/HDTTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Flame, Weight, Award, Gauge } from 'lucide-react'

interface MaterialProp {
  name: string
  baseHdt: number // °C
}

const MATERIALS: Record<string, MaterialProp> = {
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseHdt: 100 },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', baseHdt: 75 },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseHdt: 95 },
  'pc': { name: 'PC (Polycarbonate Optical Grade)', baseHdt: 135 },
  'nylon': { name: 'Nylon 6,6 (Polyamide)', baseHdt: 160 },
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
          heatingRate,
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'hdt_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      // Linear temp rise
      const tempProg = 25 + (step / steps) * (finalHdt - 25)
      setCurrentTemp(tempProg)

      // Exponential deflection curve near HDT point
      const progress = step / steps
      const def = Math.pow(progress, 3) * 0.25
      setDeflection(def)
    }, 50)
  }

  const bathColor = currentTemp > 100 
    ? 'rgba(239, 68, 68, 0.15)' 
    : currentTemp > 60 
    ? 'rgba(245, 158, 11, 0.15)' 
    : 'rgba(59, 130, 246, 0.1)'

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600 tracking-wider block">
                Thermal Deflection Evaluation (ASTM D648 / ISO 75)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Heat Deflection Temperature (HDT) Oil Bath Simulator
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
              <Weight className="w-3 h-3 text-blue-500" /> Bending Stress
            </label>
            <select
              disabled={running}
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={0.45}>0.45 MPa (Method B - Low Load)</option>
              <option value={1.82}>1.82 MPa (Method A - High Load)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> Heating Rate
            </label>
            <select
              disabled={running}
              value={heatingRate}
              onChange={(e) => setHeatingRate(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={50}>50 °C/hr (Slow Ramp)</option>
              <option value={120}>120 °C/hr (Standard ASTM)</option>
            </select>
          </div>
        </div>

        {/* Oil bath deflection instrument diagram */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col items-center justify-center text-white">
          <svg width="280" height="190" viewBox="0 0 280 190" className="overflow-visible">
            {/* Oil container bath */}
            <rect x="40" y="80" width="180" height="80" rx="8" fill={bathColor} stroke="#334155" strokeWidth="2" />
            <line x1="40" y1="95" x2="220" y2="95" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <text x="130" y="110" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">Circulating Silicone Oil Bath</text>

            {/* Span Supports (100 mm span) */}
            <rect x="65" y="145" width="12" height="15" rx="2" fill="#64748B" />
            <rect x="183" y="145" width="12" height="15" rx="2" fill="#64748B" />

            {/* Bending Specimen Bar */}
            <path
              d={`M 70 145 Q 130 ${145 + deflection * 90} 190 145`}
              fill="none"
              stroke={running ? '#F59E0B' : '#38BDF8'}
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Center weighted loading nose */}
            <g style={{ transform: `translateY(${deflection * 75}px)`, transition: 'transform 0.1s ease-out' }}>
              <rect x="128" y="25" width="4" height="115" fill="#94A3B8" />
              <rect x="110" y="35" width="40" height="18" rx="4" fill="#2563EB" stroke="#60A5FA" />
              <text x="130" y="47" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="monospace">{stress} MPa</text>
              <polygon points="126,140 134,140 130,146" fill="#64748B" />
            </g>

            {/* Bath Thermometer */}
            <g transform="translate(235, 30)">
              <rect x="0" y="0" width="12" height="130" rx="4" fill="#1E293B" stroke="#475569" />
              <rect
                x="3"
                y={`${125 - Math.min(120, (currentTemp / 180) * 120)}`}
                width="6"
                height={`${Math.min(120, (currentTemp / 180) * 120)}`}
                rx="2"
                fill="#EF4444"
              />
              <text x="6" y="-6" textAnchor="middle" fill="#F87171" fontSize="7" fontWeight="bold" fontFamily="monospace">
                {Math.round(currentTemp)}°C
              </text>
            </g>

            {/* Dial Gauge Readout */}
            <g transform="translate(10, 25)">
              <rect x="0" y="0" width="55" height="30" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="27" y="15" textAnchor="middle" fill="#38BDF8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                {deflection.toFixed(3)} mm
              </text>
              <text x="27" y="24" textAnchor="middle" fill="#94A3B8" fontSize="6" fontFamily="monospace">
                Deflection (0.25mm)
              </text>
            </g>
          </svg>
        </div>

        {/* Results Box */}
        {results && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-700" />
              <span>OFFICIAL ASTM D648 HDT TEST REPORT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">HDT Endpoint Temp</span>
                <span className="font-mono text-base font-bold text-amber-700">{results.hdtTemp} °C</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Applied Surface Stress</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.stress} MPa</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Standard Heating Ramp</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.heatingRate} °C/hr</span>
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
            <span>Heating Bath ({Math.round(currentTemp)}°C / Deflection: {deflection.toFixed(3)}mm)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run ASTM D648 HDT Test</span>
          </>
        )}
      </button>
    </div>
  )
}

export default HDTTester
