// src/components/MeltFlowIndexer.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, Info, CheckCircle } from 'lucide-react'

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
    name: 'PP (Polypropylene)', 
    densities: { 190: 0.75, 230: 0.73 },
    meltIndex: {
      190: { 2.16: 1.5, 5.0: 4.0, 10.0: 10.0 },
      230: { 2.16: 4.0, 5.0: 12.0, 10.0: 28.0 }
    }
  },
  'ps': { 
    name: 'PS (Polystyrene)', 
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
  const [materialKey, setMaterialKey] = useState('ldpe')
  const [temperature, setTemperature] = useState(190) // °C
  const [load, setLoad] = useState(2.16) // kg
  const [cutDuration, setCutDuration] = useState(2) // mins

  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  
  // Animation state
  const [pistonPosition, setPistonPosition] = useState(10) // top offset %
  const [extrudedDrops, setExtrudedDrops] = useState(0)
  const [xpAwarded, setXpAwarded] = useState(false)

  const handleRunTest = () => {
    setRunning(true)
    setXpAwarded(false)
    setResults(null)
    setPistonPosition(10)
    setExtrudedDrops(0)

    const mfi = MFI_DATA[materialKey]?.meltIndex[temperature]?.[load] || 1.0
    const density = MFI_DATA[materialKey]?.densities[temperature] || 0.75
    
    // Simulate volumetric displacement step intervals
    const steps = 40
    let step = 0

    const interval = setInterval(() => {
      if (step >= steps) {
        clearInterval(interval)
        
        // Output calculations
        const massExtruded = (mfi * cutDuration) / 10
        // Viscosity estimate (roughly inversely proportional to MFI)
        const estimatedViscosity = Math.round(12000 / mfi)
        
        const finalResults: Results = {
          mfi,
          mass: Number(massExtruded.toFixed(3)),
          meltDensity: density,
          viscosity: estimatedViscosity
        }
        setResults(finalResults)
        setRunning(false)

        // Log session & award +15 XP
        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'mfi-astm-d1238',
            parameters: { material: materialKey, temperature, load, cutDuration },
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

      setPistonPosition(10 + (step / steps) * 70)
      if (step % 8 === 0) {
        setExtrudedDrops(prev => prev + 1)
      }
      step++
    }, 100) // 4 seconds total extrusion timer
  }

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-orange-600 uppercase tracking-wider block mb-1">Standard flow evaluation</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🔥 Melt Flow Indexer (ASTM D1238)</h2>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Polymer Material</label>
            <select
              disabled={running}
              value={materialKey}
              onChange={(e) => setMaterialKey(e.target.value)}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              {Object.entries(MFI_DATA).map(([k, val]) => (
                <option key={k} value={k}>{val.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Heating Temperature</label>
            <select
              disabled={running}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={190}>190 °C</option>
              <option value={230}>230 °C (Standard PP)</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Piston Load Weight</label>
            <select
              disabled={running}
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={2.16}>2.16 kg (Standard)</option>
              <option value={5.0}>5.0 kg</option>
              <option value={10.0}>10.0 kg</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Extrudate Cut Interval (Minutes)</label>
            <select
              disabled={running}
              value={cutDuration}
              onChange={(e) => setCutDuration(Number(e.target.value))}
              className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            >
              <option value={1}>1 Minute</option>
              <option value={2}>2 Minutes (Recommended)</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
            </select>
          </div>
        </div>

        {/* Visual Extruder instrument diagram */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-4 flex justify-around items-center">
          
          {/* Cylinder drawing */}
          <div className="relative w-28 h-40 flex flex-col items-center">
            {/* Load Weight block */}
            <div className="w-16 h-8 bg-slate-700 border-2 border-slate-800 rounded flex items-center justify-center text-[10px] text-white font-mono font-bold transition-all"
                 style={{ transform: `translateY(${pistonPosition / 2}px)` }}
            >
              {load} kg
            </div>

            {/* Piston shaft */}
            <div className="w-2 bg-slate-500 transition-all" 
                 style={{ height: '40px', transform: `translateY(${pistonPosition / 2}px)` }}
            />

            {/* Heated Barrel */}
            <div className="w-12 h-20 bg-slate-350 border-x-4 border-slate-900 dark:border-slate-800 relative flex flex-col items-center py-1">
              <div className="absolute inset-0 bg-orange-600/10 animate-pulse" />
              
              {/* Molten polymer volume */}
              <div className="w-8 bg-orange-500/80 rounded-sm absolute bottom-1 transition-all"
                   style={{ height: `${80 - pistonPosition}%`, backgroundColor: running ? '#EA580C' : '#94A3B8' }}
              />
            </div>

            {/* Extrusion Die Orifice */}
            <div className="w-4 h-2 bg-slate-900 dark:bg-slate-800" />
            
            {/* Melting Extrudate Drops */}
            <div className="h-10 relative w-full flex justify-center items-start pt-1">
              {running && (
                <div className="w-1 bg-orange-600 animate-bounce rounded-full" style={{ height: '14px' }} />
              )}
              {extrudedDrops > 0 && (
                <div className="absolute top-4 flex flex-col items-center gap-1">
                  {[...Array(Math.min(3, extrudedDrops))].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="text-right space-y-1">
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Heated Barrel</span>
            <div className="text-xs font-mono font-bold text-orange-600 border border-orange-600 px-2 py-0.5 rounded bg-orange-50/10">
              {temperature} °C
            </div>
            <span className="font-mono text-[8px] uppercase font-bold text-slate-400 block">Piston Feed</span>
          </div>

        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-orange-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-orange-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Extruding polymer melt...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Extrusion
            </>
          )}
        </button>
      </div>

      {/* Volumetric Results output */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {results ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-green-50 dark:bg-green-950/20 p-2.5 rounded-lg border border-green-200 dark:border-green-900">
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Extrusions cut successfully
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Melt Flow Index</span>
                <strong className="text-xs text-orange-600">{results.mfi} g/10 min</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Extrudate Mass</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.mass} grams</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Melt Density</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.meltDensity} g/cm³</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Estimated Viscosity</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.viscosity} Pa·s</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg dark:bg-slate-900/40">
            <Info className="w-4 h-4 text-slate-300" /> Start cylinder extrusion test to get Melt Flow calculation sheet.
          </div>
        )}
      </div>
    </div>
  )
}
