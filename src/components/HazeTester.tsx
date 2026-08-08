// src/components/HazeTester.tsx
'use client'

import { useState } from 'react'
import { Play, Loader2, HelpCircle, CheckCircle } from 'lucide-react'

interface MaterialProp {
  name: string
  baseHaze: number // %
  baseTransmittance: number // %
}

const MATERIALS: Record<string, MaterialProp> = {
  'ldpe': { name: 'LDPE (Low-Density Polyethylene)', baseHaze: 15, baseTransmittance: 85 },
  'pp': { name: 'PP (Polypropylene Homopolymer)', baseHaze: 25, baseTransmittance: 75 },
  'pc': { name: 'PC (Polycarbonate)', baseHaze: 5, baseTransmittance: 90 },
  'pet': { name: 'PET (Polyethylene Terephthalate)', baseHaze: 3, baseTransmittance: 92 },
  'pmma': { name: 'PMMA (Acrylic Glass)', baseHaze: 2, baseTransmittance: 93 },
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
    // Haze scales linearly with thickness. Transmittance falls exponentially due to absorption Beer-Lambert
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

        fetch('/api/simulations/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: 'haze-astm-d1003',
            parameters: { material: materialKey, thickness },
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

      setLaserIntensity(step / steps)
    }, 45)
  }

  // Laser transparency stroke widths/opacities based on current test state
  const laserOpacity = running ? laserIntensity : results ? 1 : 0
  const scatterCount = results ? Math.min(8, Math.floor(results.haze / 3)) : 0

  return (
    <div className="border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Standard Optical Photometry</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">💡 Haze & Transmittance — ASTM D1003</h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Polymer Material Film</label>
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
            <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Thickness (mm)</label>
            <input
              type="number"
              disabled={running}
              step="0.5"
              min="0.5"
              max="5.0"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-full p-1.5 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900 dark:border-slate-800 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Light path animation view */}
        <div className="border-4 border-slate-900 rounded-xl bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-4 flex flex-col items-center justify-center">
          <svg width="240" height="120" viewBox="0 0 240 120" className="overflow-visible bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            
            {/* Light emitter source */}
            <rect x="10" y="45" width="25" height="30" fill="#475569" rx="1" />
            <circle cx="35" cy="60" r="4" fill="#E2E8F0" />

            {/* Film specimen sample block */}
            <rect 
              x="105" 
              y="30" 
              width={`${8 + thickness * 4}`} 
              height="60" 
              fill="rgba(148, 163, 184, 0.2)" 
              stroke="#64748B" 
              strokeWidth="1.5" 
            />
            <text x="110" y="25" className="fill-slate-400 font-mono text-[6px]">Sample</text>

            {/* Photometer Integrator Receiver sphere */}
            <circle cx="205" cy="60" r="18" fill="#F8FAFC" stroke="#475569" strokeWidth="2.5" />
            <rect x="202" y="52" width="6" height="16" fill="#334155" />

            {/* Direct Incident Laser beam */}
            <line 
              x1="35" 
              y1="60" 
              x2="105" 
              y2="60" 
              stroke="#F59E0B" 
              strokeWidth="3.5" 
              style={{ opacity: laserOpacity, transition: 'opacity 0.1s' }} 
            />

            {/* Transmitted Laser beam inside sphere */}
            {results && (
              <line 
                x1="115" 
                y1="60" 
                x2="187" 
                y2="60" 
                stroke="#F59E0B" 
                strokeWidth={`${3.5 * (results.transmittance / 100)}`} 
                style={{ opacity: laserOpacity }} 
              />
            )}

            {/* Scattered Haze ray lines */}
            {results && Array.from({ length: scatterCount }).map((_, i) => {
              const spread = -15 + (i / (scatterCount - 1 || 1)) * 30
              return (
                <line 
                  key={i}
                  x1="115" 
                  y1="60" 
                  x2="160" 
                  y2={`${60 + spread}`} 
                  stroke="#FBBF24" 
                  strokeWidth="1.2" 
                  strokeDasharray="2 2"
                  style={{ opacity: laserOpacity * 0.7 }}
                />
              )
            })}
          </svg>
        </div>

        <button
          disabled={running}
          onClick={handleRunTest}
          className="w-full bg-blue-700 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-blue-800 disabled:opacity-60 flex items-center justify-center gap-1.5"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Emitting collimated light...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Measure Haze & Transmittance
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
                <CheckCircle className="w-3.5 h-3.5" /> Optical analysis resolved
              </span>
              {xpAwarded && (
                <span className="font-mono text-[8px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded shadow-sm">
                  +15 XP Earned
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Haze Value</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.haze}%</strong>
              </div>
              <div>
                <span className="block text-[8px] font-mono text-slate-400 uppercase">Total Transmittance</span>
                <strong className="text-xs text-slate-800 dark:text-slate-100">{results.transmittance}%</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] justify-center py-4 bg-slate-50/50 rounded-lg dark:bg-slate-900/40">
            <HelpCircle className="w-4 h-4 text-slate-300" /> Start optical scan to evaluate specimen light-scattering characteristics.
          </div>
        )}
      </div>
    </div>
  )
}
