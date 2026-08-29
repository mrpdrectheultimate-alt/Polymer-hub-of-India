// src/components/VicatTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Award, Flame, Weight, Gauge } from 'lucide-react'

interface MaterialProp {
  name: string
  baseVicat: number // °C
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene)', baseVicat: 85 },
  'hdpe': { name: 'HDPE (High-Density Polyethylene)', baseVicat: 125 },
  'abs': { name: 'ABS (Acrylonitrile Butadiene Styrene)', baseVicat: 110 },
  'pc': { name: 'PC (Polycarbonate High Heat)', baseVicat: 145 },
  'nylon': { name: 'Nylon 6,6 (Polyamide)', baseVicat: 185 },
}

interface RunResults {
  vicatTemp: number
  heatingRate: number
  load: number
}

export function VicatTester({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('ldpe')
  const [heatingRate, setHeatingRate] = useState(50) // °C/hr
  const [load, setLoad] = useState(10) // N

  const [running, setRunning] = useState(false)
  const [currentTemp, setCurrentTemp] = useState(25)
  const [penetration, setPenetration] = useState(0) // mm (0 to 1.0)
  const [results, setResults] = useState<RunResults | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setPenetration(0)
    setCurrentTemp(25)

    const m = MATERIALS[materialKey]
    const rateFactor = heatingRate === 120 ? 1.03 : 1.0
    const loadFactor = load === 50 ? 0.94 : 1.0
    const finalVicat = m.baseVicat * rateFactor * loadFactor

    const steps = 60
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        clearInterval(interval)
        setCurrentTemp(finalVicat)
        setPenetration(1.0)
        
        const finalResults: RunResults = {
          vicatTemp: Number(finalVicat.toFixed(1)),
          heatingRate,
          load,
        }
        setResults(finalResults)
        setRunning(false)

        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'vicat_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      // Linear temp ramp
      const tempProg = 25 + (step / steps) * (finalVicat - 25)
      setCurrentTemp(tempProg)

      // Steep exponential penetration at softening threshold (1mm target)
      const progress = step / steps
      const pen = Math.pow(progress, 4) * 1.0
      setPenetration(pen)
    }, 45)
  }

  const bathColor = currentTemp > 120 
    ? 'rgba(239, 68, 68, 0.15)' 
    : currentTemp > 70 
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
                Standard Softening Penetration (ASTM D1525 / ISO 306)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Vicat Softening Temperature (VST) Oil Bath Simulator
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
              <Flame className="w-3 h-3 text-orange-500" /> Heating Rate
            </label>
            <select
              disabled={running}
              value={heatingRate}
              onChange={(e) => setHeatingRate(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={50}>50 °C/hr (Method 50)</option>
              <option value={120}>120 °C/hr (Method 120)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Weight className="w-3 h-3 text-blue-500" /> Needle Load (N)
            </label>
            <select
              disabled={running}
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={10}>10 N (Procedure A)</option>
              <option value={50}>50 N (Procedure B)</option>
            </select>
          </div>
        </div>

        {/* Oil bath immersion drawing bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex flex-col items-center justify-center text-white">
          <svg width="280" height="190" viewBox="0 0 280 190" className="overflow-visible">
            {/* Oil container bath */}
            <rect x="40" y="80" width="180" height="80" rx="8" fill={bathColor} stroke="#334155" strokeWidth="2" />
            <line x1="40" y1="95" x2="220" y2="95" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
            <text x="130" y="110" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">Silicone Oil Bath (Stirred)</text>

            {/* Specimen block on floor */}
            <rect x="95" y="140" width="70" height="20" rx="2" fill="#64748B" stroke="#475569" strokeWidth="1" />

            {/* Weighted indenter rod & 1 mm² flat needle tip */}
            <g style={{ transform: `translateY(${penetration * 20}px)`, transition: 'transform 0.1s ease-out' }}>
              <line x1="130" y1="25" x2="130" y2="140" stroke="#94A3B8" strokeWidth="3" />
              <rect x="110" y="35" width="40" height="18" rx="4" fill="#2563EB" stroke="#60A5FA" />
              <text x="130" y="47" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="monospace">{load} N</text>
              <rect x="129" y="138" width="2" height="4" fill="#F8FAFC" />
            </g>

            {/* Thermometer */}
            <g transform="translate(235, 30)">
              <rect x="0" y="0" width="12" height="130" rx="4" fill="#1E293B" stroke="#475569" />
              <rect
                x="3"
                y={`${125 - Math.min(120, (currentTemp / 200) * 120)}`}
                width="6"
                height={`${Math.min(120, (currentTemp / 200) * 120)}`}
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
                {penetration.toFixed(2)} mm
              </text>
              <text x="27" y="24" textAnchor="middle" fill="#94A3B8" fontSize="6" fontFamily="monospace">
                Penetration (1.0mm)
              </text>
            </g>
          </svg>
        </div>

        {/* Results Certificate */}
        {results && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-700" />
              <span>OFFICIAL ASTM D1525 VICAT SOFTENING CERTIFICATE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Vicat Softening Temp</span>
                <span className="font-mono text-base font-bold text-amber-700">{results.vicatTemp} °C</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Needle Test Load</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.load} N</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-amber-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Heating Rate Ramp</span>
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
            <span>Heating Bath ({Math.round(currentTemp)}°C / Needle: {penetration.toFixed(2)}mm)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run ASTM D1525 Vicat Test</span>
          </>
        )}
      </button>
    </div>
  )
}

export default VicatTester
