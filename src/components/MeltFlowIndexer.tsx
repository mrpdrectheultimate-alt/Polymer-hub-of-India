// src/components/MeltFlowIndexer.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2, Flame, Weight, Clock, Gauge, Award } from 'lucide-react'

interface MfiProp {
  name: string
  densities: Record<number, number> // temp -> density g/cm3
  meltIndex: Record<number, Record<number, number>> // temp -> load -> MFI
}

const MFI_DATA: Record<string, MfiProp> = {
  'ldpe': { 
    name: 'LDPE (Low-Density Polyethylene)', 
    densities: { 190: 0.76, 230: 0.74 },
    meltIndex: {
      190: { 2.16: 2.0, 5.0: 5.0, 10.0: 12.0 },
      230: { 2.16: 5.0, 5.0: 12.0, 10.0: 25.0 }
    }
  },
  'hdpe': { 
    name: 'HDPE (High-Density Polyethylene)', 
    densities: { 190: 0.78, 230: 0.76 },
    meltIndex: {
      190: { 2.16: 0.5, 5.0: 1.5, 10.0: 4.5 },
      230: { 2.16: 1.5, 5.0: 5.0, 10.0: 12.5 }
    }
  },
  'pp': { 
    name: 'PP (Polypropylene Homopolymer)', 
    densities: { 190: 0.75, 230: 0.73 },
    meltIndex: {
      190: { 2.16: 1.5, 5.0: 4.0, 10.0: 10.0 },
      230: { 2.16: 4.0, 5.0: 12.0, 10.0: 28.0 }
    }
  },
  'ps': { 
    name: 'PS (General Purpose Polystyrene)', 
    densities: { 190: 0.94, 230: 0.92 },
    meltIndex: {
      190: { 2.16: 7.0, 5.0: 20.0, 10.0: 45.0 },
      230: { 2.16: 20.0, 5.0: 60.0, 10.0: 130.0 }
    }
  },
  'abs': { 
    name: 'ABS (Acrylonitrile Butadiene Styrene)', 
    densities: { 190: 0.98, 230: 0.96 },
    meltIndex: {
      190: { 2.16: 2.0, 5.0: 6.0, 10.0: 15.0 },
      230: { 2.16: 6.0, 5.0: 18.0, 10.0: 42.0 }
    }
  }
}

interface Results {
  mfi: number
  mass: number
  meltDensity: number
  viscosity: number // estimated Pa.s
}

export function MeltFlowIndexer({ onComplete }: { onComplete?: () => void }) {
  const [materialKey, setMaterialKey] = useState('pp')
  const [temperature, setTemperature] = useState(230)
  const [load, setLoad] = useState(2.16)
  const [cutDuration, setCutDuration] = useState(2) // in minutes
  
  const [running, setRunning] = useState(false)
  const [pistonPosition, setPistonPosition] = useState(10) // percentage
  const [extrudedDrops, setExtrudedDrops] = useState(0)
  const [results, setResults] = useState<Results | null>(null)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleStartTest = () => {
    setRunning(true)
    setResults(null)
    setPistonPosition(10)
    setExtrudedDrops(0)

    let step = 0
    const steps = 40

    const interval = setInterval(() => {
      if (step >= steps) {
        clearInterval(interval)
        setRunning(false)
        
        // Calculate physics
        const mat = MFI_DATA[materialKey]
        const tempObj = mat.meltIndex[temperature] || mat.meltIndex[190] || { 2.16: 2.0 }
        const trueMfi = tempObj[load] || 2.0
        
        // mass extruded = (MFI / 10 min) * cutDuration
        const massExtruded = (trueMfi / 10) * cutDuration
        const meltDensity = mat.densities[temperature] || 0.75
        const estViscosity = Math.round(15000 / (trueMfi + 0.1))

        setResults({
          mfi: Number(trueMfi.toFixed(2)),
          mass: Number(massExtruded.toFixed(3)),
          meltDensity,
          viscosity: estViscosity
        })

        // Award XP
        fetch('/api/xp/award', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simulation_run', simulationId: 'mfi_tester' })
        }).then(res => {
          if (res.ok) {
            setXpAwarded(true)
            if (onComplete) onComplete()
          }
        }).catch(err => console.error(err))

        return
      }

      setPistonPosition(10 + (step / steps) * 70)
      if (step % 8 === 0) {
        setExtrudedDrops(prev => prev + 1)
      }
      step++
    }, 100)
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#EA580C] tracking-wider block">
                Standard Rheological Evaluation (ASTM D1238 / ISO 1133)
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Melt Flow Indexer (MFI / MFR) Virtual Bench
              </h3>
            </div>
          </div>
          {xpAwarded && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> +25 XP Earned
            </span>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
              Polymer Material
            </label>
            <select
              disabled={running}
              value={materialKey}
              onChange={(e) => setMaterialKey(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              {Object.entries(MFI_DATA).map(([k, val]) => (
                <option key={k} value={k}>{val.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> Heating Temp
            </label>
            <select
              disabled={running}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={190}>190 °C (Standard PE)</option>
              <option value={230}>230 °C (Standard PP)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Weight className="w-3 h-3 text-blue-500" /> Test Dead Load
            </label>
            <select
              disabled={running}
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={2.16}>2.16 kg (Standard ASTM)</option>
              <option value={5.0}>5.0 kg</option>
              <option value={10.0}>10.0 kg (High Load / HL-MFR)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> Extrudate Cut Interval
            </label>
            <select
              disabled={running}
              value={cutDuration}
              onChange={(e) => setCutDuration(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2563EB]"
            >
              <option value={1}>1 Minute</option>
              <option value={2}>2 Minutes (Standard Cut)</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes (Direct MFI)</option>
            </select>
          </div>
        </div>

        {/* Visual Extruder Instrument Bench */}
        <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 flex justify-around items-center text-white">
          {/* Cylinder drawing */}
          <div className="relative w-32 h-44 flex flex-col items-center">
            {/* Load Weight block */}
            <div
              className="w-18 h-8 bg-blue-600 border border-blue-400 rounded-lg flex items-center justify-center text-xs text-white font-mono font-bold transition-all shadow-md"
              style={{ transform: `translateY(${pistonPosition / 2}px)` }}
            >
              {load} kg
            </div>

            {/* Piston shaft */}
            <div
              className="w-2.5 bg-slate-400 transition-all rounded"
              style={{ height: '40px', transform: `translateY(${pistonPosition / 2}px)` }}
            />

            {/* Heated Barrel */}
            <div className="w-20 h-24 bg-slate-800 border-2 border-slate-700 rounded-b-xl relative flex flex-col items-center justify-between p-1 shadow-inner">
              <span className="text-[9px] font-mono text-orange-400 font-bold">{temperature}°C</span>
              
              {/* Molten Core */}
              <div
                className="w-14 bg-gradient-to-b from-amber-500 to-orange-600 rounded transition-all"
                style={{ height: `${Math.max(10, 70 - pistonPosition * 0.7)}px` }}
              />

              {/* Standard Die Orifice (2.095 mm) */}
              <div className="w-4 h-2 bg-slate-600 rounded-b" />
            </div>

            {/* Extruded Strand */}
            <div className="w-1.5 bg-orange-400 rounded transition-all mt-1 animate-pulse"
                 style={{ height: `${extrudedDrops * 6}px` }}
            />
          </div>

          {/* Telemetry Display */}
          <div className="space-y-2 text-right font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Piston Displacement</span>
              <span className="text-base font-bold text-blue-400">{Math.round(pistonPosition)}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Barrel Temp</span>
              <span className="text-base font-bold text-amber-400">{temperature}.0 °C</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Standard Orifice</span>
              <span className="text-xs text-slate-300">&Oslash; 2.095 mm &times; 8.0 mm</span>
            </div>
          </div>
        </div>

        {/* Results Box */}
        {results && (
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-900">
              <Award className="w-4 h-4 text-blue-700" />
              <span>OFFICIAL ASTM D1238 TEST CERTIFICATE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Calculated MFI</span>
                <span className="font-mono text-base font-bold text-[#2563EB]">{results.mfi} g/10 min</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Cut Mass</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.mass} g</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Melt Density</span>
                <span className="font-mono text-base font-bold text-slate-800">{results.meltDensity} g/cm&sup3;</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-blue-100">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Est. Viscosity</span>
                <span className="font-mono text-base font-bold text-emerald-700">{results.viscosity} Pa&bull;s</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        disabled={running}
        onClick={handleStartTest}
        className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
      >
        {running ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Extruding Specimen ({Math.round(pistonPosition)}%)…</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run ASTM D1238 Extrusion Test</span>
          </>
        )}
      </button>
    </div>
  )
}

export default MeltFlowIndexer
