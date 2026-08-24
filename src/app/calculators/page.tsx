'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calculator,
  Gauge,
  Thermometer,
  Ruler,
  Clock,
  Zap,
  Wind,
  Droplet,
  Flame,
  BookOpen,
  Brain,
  Copy,
  Check
} from 'lucide-react'

// ─── Calculator definitions ────────────────────────────────────────────────────

type CalcId = 'tonnage' | 'cooling' | 'shrinkage' | 'cycle' | 'screw_shear' | 'gate_freeze' | 'mfi_viscosity' | 'drying'

const CALCS: { id: CalcId; label: string; icon: React.ElementType; color: string; bg: string; subject: string; lessonSlug: string }[] = [
  { id: 'tonnage', label: 'Clamping Force / Tonnage', icon: Gauge, color: '#EA580C', bg: '#FFF7ED', subject: 'Polymer Processing', lessonSlug: 'injection-moulding-process-parameters-and-defects' },
  { id: 'cooling', label: 'Cooling Time Estimator', icon: Thermometer, color: '#1D4ED8', bg: '#EFF6FF', subject: 'Mould Design', lessonSlug: 'cooling-system-design-and-cycle-time-optimization' },
  { id: 'shrinkage', label: 'Mould Shrinkage & Dimension', icon: Ruler, color: '#15803D', bg: '#F0FDF4', subject: 'Polymer Processing', lessonSlug: 'injection-moulding-process-parameters-and-defects' },
  { id: 'cycle', label: 'Cycle Time Breakdown', icon: Clock, color: '#7C3AED', bg: '#F5F3FF', subject: 'Mould Design', lessonSlug: 'cooling-system-design-and-cycle-time-optimization' },
  { id: 'screw_shear', label: 'Screw Shear Rate', icon: Zap, color: '#EA580C', bg: '#FFF7ED', subject: 'Polymer Processing', lessonSlug: 'extrusion-fundamentals-the-backbone-of-plastic-processing' },
  { id: 'gate_freeze', label: 'Gate Freeze-Off Time', icon: Wind, color: '#1D4ED8', bg: '#EFF6FF', subject: 'Mould Design', lessonSlug: 'gate-design-types-location-and-sizing' },
  { id: 'mfi_viscosity', label: 'MFI ↔ Viscosity Estimator', icon: Droplet, color: '#CA8A04', bg: '#FEFCE8', subject: 'Polymer Processing', lessonSlug: 'melt-flow-index-mfi-measurement-significance-and-indian-standards' },
  { id: 'drying', label: 'Drying Time Calculator', icon: Flame, color: '#15803D', bg: '#F0FDF4', subject: 'Polymer Processing', lessonSlug: 'polymer-degradation-and-stabilization' },
]

// Helper for clipboard copy
function CopyButton(props: { text: string; id?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(props.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-slate-100/50 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm flex items-center justify-center flex-shrink-0"
      title="Copy value"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  )
}

// ─── Individual calculators ────────────────────────────────────────────────────

function TonnageCalc() {
  const [area, setArea] = useState(150)
  const [cavities, setCavities] = useState(4)
  const [pressure, setPressure] = useState(400)
  const [safety, setSafety] = useState(1.1)

  const tonnage = Math.round((area * cavities * pressure / 1000) * safety)
  const totalArea = area * cavities

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-orange-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Equation formula</p>
        <p className="font-mono text-sm font-black text-slate-900 mt-1">F = (A × N × P / 1000) × SF</p>
        <p className="font-mono text-[9px] text-slate-500 mt-1">Where A = projected area (cm²), N = cavities, P = cavity pressure (bar), SF = safety factor</p>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Projected area per cavity (cm²)', val: area, set: setArea, min: 10, max: 2000, step: 5, hint: 'Typical: 50–500 cm²' },
          { label: 'Number of cavities', val: cavities, set: setCavities, min: 1, max: 64, step: 1, hint: '1, 2, 4, 8, 16, 32...' },
          { label: 'Cavity pressure (bar)', val: pressure, set: setPressure, min: 100, max: 1500, step: 10, hint: 'Typical: 300–600 bar' },
          { label: 'Safety factor', val: safety, set: setSafety, min: 1.0, max: 1.5, step: 0.05, hint: 'Recommended: 1.1–1.2' },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
              <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-350">{f.val}</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))}
                className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EA580C]" />
              <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))}
                className="w-20 border-2 border-slate-900 px-2 py-1 font-mono text-xs font-black text-center bg-white" />
            </div>
            <p className="font-mono text-[9px] text-slate-400 leading-none">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#EA580C]">
        <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#EA580C] text-white flex justify-between items-center">
          <span className="font-mono text-[10px] font-black uppercase tracking-widest">Required Tonnage Results</span>
          <CopyButton text={`${tonnage} Tonnes`} id="tonnage-result" />
        </div>
        <div className="p-5 bg-orange-50/40">
          <div className="font-display text-4.5xl font-black text-[#EA580C] mb-1">{tonnage} <span className="text-xl">Tonnes</span></div>
          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Required clamping force</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="border-2 border-slate-900 p-2.5 text-center bg-white rounded-lg">
              <div className="font-mono text-sm font-black text-slate-900">{totalArea} cm²</div>
              <div className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">Total area</div>
            </div>
            <div className="border-2 border-slate-900 p-2.5 text-center bg-white rounded-lg">
              <div className="font-mono text-sm font-black text-slate-900">{Math.round(tonnage / safety)} T</div>
              <div className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">Without safety factor</div>
            </div>
          </div>
          <div className="mt-4 border-l-4 border-[#EA580C] pl-3">
            <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
              {tonnage < 100 ? 'Small machine range — desktop or benchtop injection moulders.' :
               tonnage < 300 ? 'Medium machine — typical for automotive trim, consumer electronic enclosures.' :
               tonnage < 800 ? 'Large machine — suited for automotive bumpers, industrial crates.' :
               'Very large machine — requires specialized large-tonnage facilities.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoolingCalc() {
  const [thickness, setThickness] = useState(2.5)
  const [alpha, setAlpha] = useState(0.08)
  const [Tm, setTm] = useState(230)
  const [Tw, setTw] = useState(50)
  const [Te, setTe] = useState(90)

  const valid = Tm > Te && Te > Tw && thickness > 0 && alpha > 0
  const innerLog = (8 / Math.pow(Math.PI, 2)) * ((Tm - Tw) / (Te - Tw))
  const coolingTime = valid && innerLog > 0
    ? Math.max(0, (Math.pow(thickness, 2) / (Math.pow(Math.PI, 2) * alpha)) * Math.log(innerLog)).toFixed(1)
    : '—'

  const DIFFUSIVITY_PRESETS = [
    { label: 'PP / HDPE', val: 0.08 },
    { label: 'ABS / PS', val: 0.085 },
    { label: 'PC / Nylon', val: 0.09 },
    { label: 'POM / PET', val: 0.095 },
  ]

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-blue-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Fourier Transient Conduction Formula</p>
        <p className="font-mono text-sm font-black text-slate-900 mt-1">tc = (h² / π²α) × ln(8/π² × (Tm-Tw)/(Te-Tw))</p>
        <p className="font-mono text-[9px] text-slate-500 mt-1">h = half-thickness (mm), α = thermal diffusivity (mm²/s)</p>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider block">Material presets (thermal diffusivity)</label>
        <div className="flex gap-2 flex-wrap">
          {DIFFUSIVITY_PRESETS.map(p => (
            <button key={p.label} onClick={() => setAlpha(p.val)}
              className={`font-mono text-[10px] font-black border-2 border-slate-900 px-3 py-1.5 uppercase transition-colors rounded-lg ${
                alpha === p.val ? 'bg-[#1D4ED8] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-55'
              }`}>
              {p.label} ({p.val})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Maximum wall thickness (mm)', val: thickness, set: setThickness, min: 0.5, max: 15, step: 0.5, hint: 'Use maximum wall section in the part' },
          { label: 'Melt temperature Tm (°C)', val: Tm, set: setTm, min: 150, max: 400, step: 5, hint: 'PP: 220-250 · PC: 280-310 · Nylon: 260-290' },
          { label: 'Mould wall temperature Tw (°C)', val: Tw, set: setTw, min: 10, max: 150, step: 5, hint: 'PP: 40-60 · PC: 80-100 · Nylon: 60-80' },
          { label: 'Ejection temperature Te (°C)', val: Te, set: setTe, min: 40, max: 200, step: 5, hint: 'Must be below heat deflection temperature (HDT)' },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
              <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-350">{f.val}</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8]" />
              <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))}
                className="w-20 border-2 border-slate-900 px-2 py-1 font-mono text-xs font-black text-center bg-white" />
            </div>
            <p className="font-mono text-[9px] text-slate-400 leading-none">{f.hint}</p>
          </div>
        ))}
      </div>

      {!valid && <div className="border-2 border-red-500 bg-red-50/50 p-3 rounded-lg font-mono text-[10px] font-bold text-red-700">⚠ Check temperatures: Melt (Tm) &gt; Ejection (Te) &gt; Mould (Tw) is required.</div>}

      <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#1D4ED8]">
        <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#1D4ED8] text-white flex justify-between items-center">
          <span className="font-mono text-[10px] font-black uppercase tracking-widest">Cooling Performance Results</span>
          <CopyButton text={`${coolingTime} seconds`} id="cooling-result" />
        </div>
        <div className="p-5 bg-blue-50/40">
          <div className="font-display text-4.5xl font-black text-[#1D4ED8] mb-1">{coolingTime} <span className="text-xl">seconds</span></div>
          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">Minimum theoretical cooling time</p>
          <div className="mt-3 border-l-4 border-blue-600 pl-3">
            <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
              Cooling accounts for 50-70% of total injection cycle times. Add 20-30% to this value for real-world tooling designs to account for heat transfer limitations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShrinkageCalc() {
  const [mouldDim, setMouldDim] = useState(100.0)
  const [shrinkage, setShrinkage] = useState(1.5)
  const [target, setTarget] = useState(98.5)

  const partDim = mouldDim * (1 - shrinkage / 100)
  const requiredMould = target / (1 - shrinkage / 100)

  const SHRINKAGE_PRESETS = [
    { label: 'PP (unfilled)', val: 1.5 }, { label: 'HDPE', val: 2.0 },
    { label: 'ABS', val: 0.5 }, { label: 'PC', val: 0.6 },
    { label: 'Nylon 6 (dry)', val: 1.0 }, { label: 'POM', val: 2.0 },
    { label: '30% GF Nylon', val: 0.4 },
  ]

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-emerald-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Equation Formulas</p>
        <p className="font-mono text-sm font-black text-slate-900 mt-1">Part Dim = Mould Dim × (1 - S/100)</p>
        <p className="font-mono text-sm font-black text-slate-900">Mould Dim = Target / (1 - S/100)</p>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider block">Material shrinkage presets</label>
        <div className="flex gap-2 flex-wrap">
          {SHRINKAGE_PRESETS.map(p => (
            <button key={p.label} onClick={() => setShrinkage(p.val)}
              className={`font-mono text-[10px] font-black border-2 border-slate-900 px-3 py-1.5 uppercase transition-colors rounded-lg ${
                shrinkage === p.val ? 'bg-[#15803D] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-55'
              }`}>
              {p.label} ({p.val}%)
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Shrinkage rate (%)', val: shrinkage, set: setShrinkage, min: 0.1, max: 5.0, step: 0.1, hint: 'See material datasheets or presets above' },
          { label: 'Mould cavity dimension (mm)', val: mouldDim, set: setMouldDim, min: 1, max: 1000, step: 0.5, hint: 'Original cut-steel dimension of the mould' },
          { label: 'Required finished part dimension (mm)', val: target, set: setTarget, min: 1, max: 1000, step: 0.5, hint: 'Blueprint design target dimensional value' },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
              <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-350">{f.val}</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#15803D]" />
              <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))}
                className="w-20 border-2 border-slate-900 px-2 py-1 font-mono text-xs font-black text-center bg-white" />
            </div>
            <p className="font-mono text-[9px] text-slate-400 leading-none">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#15803D]">
          <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#15803D] text-white flex justify-between items-center">
            <span className="font-mono text-[9px] font-black uppercase">Part Dimension</span>
            <CopyButton text={`${partDim.toFixed(2)} mm`} id="part-dim-result" />
          </div>
          <div className="p-4 bg-emerald-50/40 text-center">
            <div className="font-display text-3xl font-black text-[#15803D]">{partDim.toFixed(2)} mm</div>
            <p className="font-mono text-[9px] text-slate-500 mt-1">From mould size: {mouldDim} mm</p>
          </div>
        </div>

        <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#15803D]">
          <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#15803D] text-white flex justify-between items-center">
            <span className="font-mono text-[9px] font-black uppercase">Required Mould Size</span>
            <CopyButton text={`${requiredMould.toFixed(2)} mm`} id="mould-size-result" />
          </div>
          <div className="p-4 bg-emerald-50/40 text-center">
            <div className="font-display text-3xl font-black text-[#15803D]">{requiredMould.toFixed(2)} mm</div>
            <p className="font-mono text-[9px] text-slate-500 mt-1">To achieve part size: {target} mm</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CycleTimeCalc() {
  const [injection, setInjection] = useState(3)
  const [packing, setPacking] = useState(8)
  const [cooling, setCooling] = useState(20)
  const [mould, setMould] = useState(4)

  const total = injection + packing + cooling + mould
  const cyclesPerHour = Math.round(3600 / total)
  const phases = [
    { label: 'Injection time', val: injection, set: setInjection, color: '#EA580C', hint: 'Filling phase: 1-5 seconds typical' },
    { label: 'Packing / Hold time', val: packing, set: setPacking, color: '#7C3AED', hint: 'Compensates for shrinkage: 5-15 seconds' },
    { label: 'Cooling time', val: cooling, set: setCooling, color: '#1D4ED8', hint: 'Largest component: 10-40 seconds' },
    { label: 'Mould open / Eject / Close', val: mould, set: setMould, color: '#15803D', hint: 'Machine dependent: 2-8 seconds' },
  ]

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-purple-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Cycle Formula</p>
        <p className="font-mono text-sm font-black text-slate-900 mt-1">Total Cycle = Injection + Packing + Cooling + Mould Movement</p>
      </div>

      <div className="space-y-4">
        {phases.map(f => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
              <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-350">{f.val}s</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative flex flex-col justify-center">
                <div className="border-2 border-slate-900 h-2 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${(f.val / 60) * 100}%`, backgroundColor: f.color }} />
                </div>
                <input type="range" min={0.5} max={60} step={0.5} value={f.val}
                  onChange={e => f.set(Number(e.target.value))}
                  className="w-full mt-1.5 h-1 bg-transparent rounded-lg appearance-none cursor-pointer accent-violet-600" />
              </div>
              <input type="number" min={0.5} max={60} step={0.5} value={f.val}
                onChange={e => f.set(Number(e.target.value))}
                className="w-20 border-2 border-slate-900 px-2 py-1 font-mono text-xs font-black text-center bg-white" />
            </div>
            <p className="font-mono text-[9px] text-slate-400 leading-none">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#7C3AED]">
        <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#7C3AED] text-white flex justify-between items-center">
          <span className="font-mono text-[10px] font-black uppercase tracking-widest">Total Cycle Speeds</span>
          <CopyButton text={`${total.toFixed(1)}s (${cyclesPerHour} shots/hr)`} id="cycle-result" />
        </div>
        <div className="p-5 bg-purple-50/40">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="font-display text-4xl font-black text-purple-700">{total.toFixed(1)}s</div>
              <p className="font-mono text-[9px] text-slate-500 uppercase mt-1">Total Cycle Time</p>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-black text-purple-700">{cyclesPerHour}</div>
              <p className="font-mono text-[9px] text-slate-500 uppercase mt-1">Shots / Hour</p>
            </div>
          </div>
          <div className="border-2 border-slate-900 h-6 rounded-lg overflow-hidden flex bg-white shadow-inner">
            {phases.map(f => (
              <div key={f.label} className="h-full first:rounded-l last:rounded-r" title={`${f.label}: ${f.val}s`}
                style={{ width: `${(f.val / total) * 100}%`, backgroundColor: f.color }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
            {phases.map(f => (
              <div key={f.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 border border-slate-950 rounded-sm" style={{ backgroundColor: f.color }} />
                <span className="font-mono text-[8px] text-slate-500">{f.label.split(' ')[0]}: {((f.val / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScrewShearCalc() {
  const [diameter, setDiameter] = useState(40)
  const [rpm, setRpm] = useState(120)
  const [channelDepth, setChannelDepth] = useState(4)

  const shearRate = Math.round((Math.PI * diameter * rpm) / (60 * channelDepth))
  const tipSpeed = Math.round((Math.PI * diameter * rpm) / 60)

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-orange-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Velocity Shear Formula</p>
        <p className="font-mono text-sm font-black text-slate-900 mt-1">γ̇ = (π × D × N) / (60 × h)</p>
        <p className="font-mono text-[9px] text-slate-500 mt-1">D = screw diameter (mm), N = screw speed (RPM), h = metering channel depth (mm)</p>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Screw diameter D (mm)', val: diameter, set: setDiameter, min: 20, max: 200, step: 5, hint: 'Standard: 30, 40, 50, 60, 80mm' },
          { label: 'Screw speed N (RPM)', val: rpm, set: setRpm, min: 10, max: 400, step: 5, hint: 'Typical compounding range: 50-200 RPM' },
          { label: 'Metering zone channel depth h (mm)', val: channelDepth, set: setChannelDepth, min: 1, max: 20, step: 0.5, hint: 'Typically D/8 to D/12 ratio' },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
              <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-350">{f.val}</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EA580C]" />
              <input type="number" value={f.val} onChange={e => f.set(Number(e.target.value))}
                className="w-20 border-2 border-slate-900 px-2 py-1 font-mono text-xs font-black text-center bg-white" />
            </div>
            <p className="font-mono text-[9px] text-slate-400 leading-none">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#EA580C]">
          <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#EA580C] text-white flex justify-between items-center">
            <span className="font-mono text-[9px] font-black uppercase">Shear Rate</span>
            <CopyButton text={`${shearRate} s⁻¹`} id="shear-rate-result" />
          </div>
          <div className="p-4 bg-orange-50/40 text-center">
            <div className="font-display text-3xl font-black text-[#EA580C]">{shearRate} s⁻¹</div>
            <p className="font-mono text-[9px] text-slate-500 mt-1">{shearRate < 50 ? 'Low — risk of unmelt' : shearRate < 200 ? 'Normal range' : 'High — risk of degradation'}</p>
          </div>
        </div>

        <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#EA580C]">
          <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#EA580C] text-white flex justify-between items-center">
            <span className="font-mono text-[9px] font-black uppercase">Screw Tip Speed</span>
            <CopyButton text={`${tipSpeed} mm/s`} id="tip-speed-result" />
          </div>
          <div className="p-4 bg-orange-50/40 text-center">
            <div className="font-display text-3xl font-black text-[#EA580C]">{tipSpeed} mm/s</div>
            <p className="font-mono text-[9px] text-slate-500 mt-1">{tipSpeed < 300 ? 'Acceptable' : 'High — check thermal stability limit'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GateFreezeCalc() {
  const [gateThickness, setGateThickness] = useState(1.0)
  const [alpha, setAlpha] = useState(0.08)

  const freezeTime = ((Math.pow(gateThickness, 2)) / (4 * Math.pow(Math.PI, 2) * alpha)).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-blue-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Formula (simplified)</p>
        <p className="font-mono text-sm font-black text-slate-900 mt-1">tf ≈ tg² / (4π²α)</p>
        <p className="font-mono text-[9px] text-slate-505 mt-1">tg = gate thickness (mm), α = thermal diffusivity (mm²/s)</p>
        <p className="font-mono text-[9px] text-[#1D4ED8] font-bold mt-1">Hold time must be ≥ gate freeze-off time to prevent backflow</p>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Gate thickness tg (mm)', val: gateThickness, set: setGateThickness, min: 0.2, max: 5, step: 0.1, hint: 'Typically 50-70% of adjacent wall thickness' },
          { label: 'Thermal diffusivity α (mm²/s)', val: alpha, set: setAlpha, min: 0.05, max: 0.15, step: 0.005, hint: 'PP: 0.08 · ABS: 0.085 · PC: 0.09' },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider">{f.label}</label>
              <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-350">{f.val}</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8]" />
              <input type="number" value={f.val} onChange={e => f.set(Number(e.target.value))}
                className="w-20 border-2 border-slate-900 px-2 py-1 font-mono text-xs font-black text-center bg-white" />
            </div>
            <p className="font-mono text-[9px] text-slate-400 leading-none">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#1D4ED8]">
        <div className="border-b-4 border-slate-900 px-4 py-2 bg-[#1D4ED8] text-white flex justify-between items-center">
          <span className="font-mono text-[10px] font-black uppercase tracking-widest">Gate Solidification</span>
          <CopyButton text={`${freezeTime} seconds`} id="gate-result" />
        </div>
        <div className="p-5 bg-blue-50/40 text-center">
          <div className="font-display text-4.5xl font-black text-[#1D4ED8] mb-1">{freezeTime} <span className="text-xl">seconds</span></div>
          <p className="font-mono text-[10px] text-slate-500">Recommended minimum pack/hold time: <strong>{freezeTime}s</strong></p>
        </div>
      </div>
    </div>
  )
}

function MFICalc() {
  const [mfi, setMfi] = useState(10)

  // Approximate viscosity from MFI (empirical relationship)
  const viscosity = Math.round(53000 / Math.pow(mfi, 0.67))
  const mwEst = mfi < 1 ? 'Very High (>500,000 g/mol)' : mfi < 5 ? 'High (200,000-500,000 g/mol)' : mfi < 20 ? 'Medium (100,000-200,000 g/mol)' : 'Low (<100,000 g/mol)'
  const application = mfi < 1 ? 'Pipe / Profile extrusion, film blowing' : mfi < 5 ? 'Blow moulding, general extrusion' : mfi < 20 ? 'General injection moulding' : mfi < 50 ? 'Thin-wall moulding, fibres' : 'Fibres, non-wovens, fast-cycling thin parts'

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-yellow-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Empirical Approximation Formula</p>
        <p className="font-mono text-sm font-black text-slate-900 mt-1">η ≈ 53,000 / MFI^0.67</p>
        <p className="font-mono text-[9px] text-slate-500 mt-1">Viscosity is zero-shear estimate. Actual viscosity varies with shear rate processing.</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider">MFI value (g/10min)</label>
          <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-350">{mfi}</span>
        </div>
        <div className="flex items-center gap-3">
          <input type="range" min={0.1} max={100} step={0.5} value={mfi}
            onChange={e => setMfi(Number(e.target.value))} className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#CA8A04]" />
          <input type="number" value={mfi} onChange={e => setMfi(Number(e.target.value))}
            className="w-20 border-2 border-slate-900 px-2 py-1 font-mono text-xs font-black text-center bg-white" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="border-4 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#CA8A04] bg-yellow-50/40 flex justify-between items-center">
          <div>
            <div className="font-display text-3xl font-black text-[#CA8A04]">{viscosity.toLocaleString()} Pa·s</div>
            <p className="font-mono text-[9px] text-slate-500 uppercase mt-0.5">Estimated Zero-Shear Viscosity</p>
          </div>
          <CopyButton text={`${viscosity} Pa·s`} id="mfi-visc" />
        </div>

        <div className="border-2 border-slate-900 rounded-xl p-4 bg-white shadow-sm">
          <p className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Molecular Weight</p>
          <p className="font-bold text-slate-800 text-sm">{mwEst}</p>
        </div>

        <div className="border-2 border-slate-900 rounded-xl p-4 bg-white shadow-sm">
          <p className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommended Application</p>
          <p className="font-bold text-slate-800 text-sm leading-relaxed">{application}</p>
        </div>
      </div>
    </div>
  )
}

function DryingCalc() {
  const MATERIALS = [
    { label: 'Nylon 6 (PA6)', temp: 80, time: 4, target: 0.20, initial: 3.5, color: '#7C3AED' },
    { label: 'Nylon 66 (PA66)', temp: 80, time: 4, target: 0.20, initial: 2.5, color: '#7C3AED' },
    { label: 'PET (bottle grade)', temp: 165, time: 4, target: 0.005, initial: 0.4, color: '#1D4ED8' },
    { label: 'PC (Polycarbonate)', temp: 120, time: 4, target: 0.020, initial: 0.35, color: '#1D4ED8' },
    { label: 'ABS', temp: 80, time: 3, target: 0.10, initial: 0.4, color: '#EA580C' },
    { label: 'PBT', temp: 120, time: 4, target: 0.020, initial: 0.3, color: '#EA580C' },
    { label: 'PMMA (Acrylic)', temp: 80, time: 4, target: 0.10, initial: 0.35, color: '#15803D' },
    { label: 'PP (standard)', temp: 0, time: 0, target: 0, initial: 0.01, color: '#15803D' },
  ]

  const [selected, setSelected] = useState(MATERIALS[2])

  return (
    <div className="space-y-6">
      <div className="border-4 border-slate-900 p-4 bg-emerald-50 rounded-xl">
        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Hygroscopic Polymer Dynamics</p>
        <p className="text-xs md:text-sm text-slate-700 mt-1 leading-relaxed">
          Polymers absorb moisture from the air. Under melt temperatures, this moisture triggers <strong>hydrolytic degradation</strong>, cutting polymer chains, creating silver streaks, and destroying impact strength. Pre-drying is mandatory.
        </p>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-wider block">Select Material Preset</label>
        <div className="flex flex-wrap gap-2">
          {MATERIALS.map(m => (
            <button key={m.label} onClick={() => setSelected(m)}
              className={`font-mono text-[10px] font-black border-2 border-slate-900 px-3 py-1.5 uppercase transition-colors rounded-lg ${
                selected.label === m.label ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {selected.time === 0 ? (
        <div className="border-4 border-slate-900 bg-emerald-50/50 p-5 text-center rounded-xl">
          <div className="font-display text-xl font-black text-[#15803D] mb-2">No Drying Required</div>
          <p className="font-mono text-[10px] text-slate-500 leading-relaxed">PP is non-hygroscopic. It does not chemically absorb moisture inside its molecular matrix. Drying is only required if surface condensation is present.</p>
        </div>
      ) : (
        <div className="border-4 border-slate-900 overflow-hidden rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <div className="border-b-4 border-slate-900 px-4 py-2 bg-slate-900 text-white flex justify-between items-center">
            <span className="font-mono text-[9px] font-black uppercase tracking-widest">Drying Spec sheet — {selected.label}</span>
            <CopyButton text={`Dry PA/PET/PC at ${selected.temp}°C for ${selected.time}h`} id="drying-spec" />
          </div>
          <div className="p-5 bg-white">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border-2 border-slate-900 p-3 text-center rounded-lg bg-slate-50">
                <div className="font-display text-2xl md:text-3xl font-black text-slate-800">{selected.temp}°C</div>
                <p className="font-mono text-[9px] text-slate-400 uppercase mt-1">Drying Temp</p>
              </div>
              <div className="border-2 border-slate-900 p-3 text-center rounded-lg bg-slate-50">
                <div className="font-display text-2xl md:text-3xl font-black text-slate-800">{selected.time}h</div>
                <p className="font-mono text-[9px] text-slate-400 uppercase mt-1">Drying Time</p>
              </div>
              <div className="border-2 border-slate-900 p-3 text-center rounded-lg bg-slate-50">
                <div className="font-display text-2xl md:text-3xl font-black text-slate-800">{selected.target}%</div>
                <p className="font-mono text-[9px] text-slate-400 uppercase mt-1">Max moisture</p>
              </div>
            </div>
            <div className="border-2 border-slate-900 p-3 rounded-lg bg-slate-50 font-mono text-[10px] text-slate-500 leading-relaxed">
              <strong>Initial Moisture:</strong> ~{selected.initial}% (typical equilibrium) → must dry down below <strong>{selected.target}%</strong> before processing. Avoid standard hopper dryers; use desiccant dehumidifiers.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page Component ───────────────────────────────────────────────────────

const CALC_COMPONENTS: Record<CalcId, React.ReactNode> = {
  tonnage: <TonnageCalc />,
  cooling: <CoolingCalc />,
  shrinkage: <ShrinkageCalc />,
  cycle: <CycleTimeCalc />,
  screw_shear: <ScrewShearCalc />,
  gate_freeze: <GateFreezeCalc />,
  mfi_viscosity: <MFICalc />,
  drying: <DryingCalc />,
}

export default function CalculatorsPage() {
  const [active, setActive] = useState<CalcId>('tonnage')
  const current = CALCS.find(c => c.id === active)!
  const Icon = current.icon

  return (
    <div className="min-h-screen bg-[#ECFEFF] text-slate-900 pb-20">

      {/* ── Top Header Bar: Cyan ── */}
      <div className="bg-[#0891B2] border-b-4 border-[#06B6D4]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#A5F3FC] text-xs font-mono font-bold uppercase tracking-wider">Calculators</span>
              <div className="flex flex-wrap gap-4 mt-1 text-white text-xs font-mono">
                <span>8 <span className="text-[#A5F3FC]">Tools</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>12+ <span className="text-[#A5F3FC]">Formulas</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>99% <span className="text-[#A5F3FC]">Precision</span></span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#A5F3FC] text-xs font-mono font-bold">Dynamic Engine</p>
              <p className="text-white/60 text-[10px] font-mono">Real-time Shop-Floor Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION: Cyan Gradient ── */}
      <section className="bg-gradient-to-br from-[#0891B2] via-[#0E7490] to-[#155E75] text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Calculator className="w-4 h-4 text-cyan-200" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              8 Industrial Calculators &middot; ASTM / ISO Formulas &middot; Instant Spec Sheets
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Calculate. Not Guess. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A5F3FC] via-[#FFFFFF] to-[#67E8F9]">
              Engineering Precision.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-cyan-100 max-w-2xl mx-auto leading-relaxed font-light">
            8 industrial-grade calculators for polymer processing engineers. Clamping force, cooling, shrinkage, cycle times, screw shear rate &mdash; all dynamically calculated.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">8</span>
              <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-wider">Calculators</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-300 block">12+</span>
              <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-wider">Formulas</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">100%</span>
              <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-wider">Dynamic Engine</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-cyan-200 block">1-Click</span>
              <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-wider">Spec Copies</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Workspace ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Sidebar Selector */}
          <div className="lg:col-span-1 bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-xl space-y-2 sticky top-24">
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block px-2 pb-1 border-b border-slate-100">
              Select Calculator
            </span>

            <div className="space-y-1.5 pt-1">
              {CALCS.map(c => {
                const CalcIcon = c.icon
                const isActive = active === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      isActive
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-sm'
                        : 'border-transparent hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isActive 
                        ? 'bg-blue-600 text-white border-blue-700' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <CalcIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs leading-tight">{c.label}</div>
                      <div className="text-[9px] font-mono text-slate-400 mt-0.5">{c.subject}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dynamic Calculator Workspace */}
          <div className="lg:col-span-3 bg-white border-2 border-slate-900 rounded-2xl shadow-xl overflow-hidden">
            
            {/* Workspace Header */}
            <div className="border-b-2 border-slate-100 p-5 bg-slate-50 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center bg-white" style={{ color: current.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-black text-slate-900 leading-none">
                    {current.label}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">{current.subject}</span>
                    <span className="text-slate-300">&bull;</span>
                    <Link 
                      href={`/lessons/${current.lessonSlug}`}
                      className="font-mono text-[10px] font-bold flex items-center gap-1 hover:underline text-blue-600"
                    >
                      <BookOpen className="w-3 h-3" /> Related Lesson &rarr;
                    </Link>
                  </div>
                </div>
              </div>
              
              <Link 
                href={`/ai-tutor?prompt=Explain%20the%20engineering%20formula%20and%20derivation%20for%20${encodeURIComponent(current.label)}`}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Brain className="w-3.5 h-3.5 text-amber-400" /> Ask AI Specialist
              </Link>
            </div>

            {/* Active Calculator Content */}
            <div className="p-6">
              {CALC_COMPONENTS[active]}
            </div>

          </div>

        </div>

      </div>

      {/* ── BOTTOM AI CALCULATOR SPECIALIST CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Calculator className="w-3.5 h-3.5 text-amber-400" /> AI Calculation Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Need custom formula derivations or mold sizing? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Calculation Specialist.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Derive custom Fourier cooling curves, non-Newtonian Power Law shear rate equations, or runner pressure drop calculations step-by-step.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Derive%20the%20injection%20moulding%20cooling%20time%20formula%20using%20Fourier%20heat%20conduction%20equation"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Calculation Specialist &rarr;
            </Link>

            <Link
              href="/simulations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Gauge className="w-4 h-4" /> 12 ASTM Testing Benches
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
