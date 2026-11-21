'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calculator, 
  Wrench, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react'

const DEFECT_DATA = [
  {
    id: 'splay',
    name: 'Silver Streaks / Splay Marks',
    category: 'Surface Cosmetic Defect',
    rootCause: 'Moisture in hygroscopic resin (PA, PC, PET > 0.02%) or trapped volatiles/gas in melt stream.',
    shopFloorFix: 'Check desiccant dryer dew point (-40°C required). Increase back pressure to 5–10 bar to eliminate trapped air.',
    interviewTip: 'Recruiters check if you know the difference between moisture splay (frothy/silver) and thermal degradation splay (brownish/brittle).',
    resinTested: 'Polycarbonate (PC) / Polyamide 6,6'
  },
  {
    id: 'sink',
    name: 'Sink Marks & Cavity Voids',
    category: 'Dimensional & Volumetric Shrinkage',
    rootCause: 'Volumetric shrinkage in thick ribs/bosses; packing pressure decayed before gate freeze-off.',
    shopFloorFix: 'Extend packing time until gate freeze is verified by part weight study. Maintain rib thickness at 40–60% of nominal wall.',
    interviewTip: 'Differentiate sink mark (solid core pulls surface inward) from vacuum void (rigid surface freezes, vacuum bubble forms inside).',
    resinTested: 'Polypropylene (PP) / ABS'
  },
  {
    id: 'warpage',
    name: 'Part Warpage & Distortion',
    category: 'Differential Thermal Shrinkage',
    rootCause: 'Non-uniform mold temperature between core and cavity sides or differential molecular orientation.',
    shopFloorFix: 'Rebalance cooling channel Reynolds number (>4,000 for turbulent flow). Reduce injection speed through thin sections.',
    interviewTip: 'Semi-crystalline polymers (HDPE, PP, POM) warp 3x more than amorphous (PS, PC) due to spherulite crystallization shrinkage.',
    resinTested: 'HDPE / Polypropylene Copolymer'
  },
  {
    id: 'diesel',
    name: 'Diesel Effect / Burn Marks',
    category: 'Venting Compression Explosion',
    rootCause: 'Trapped air in dead corners undergoes rapid adiabatic compression, igniting polymer volatiles at >400°C.',
    shopFloorFix: 'Clean clogged mold parting-line vents (vent depth 0.02–0.04 mm for polyolefins). Relocate gate or reduce final fill speed.',
    interviewTip: 'Always cite adiabatic compression (PV^gamma = const) when explaining why burns occur at the last point of fill.',
    resinTested: 'ABS / Polystyrene (HIPS)'
  }
]

const FORMULA_DATA = [
  {
    id: 'carothers',
    title: 'Carothers Equation (Step-Growth DP)',
    latex: 'X_n = 1 / (1 - p)',
    stoichiometric: 'X_n = (1 + r) / (1 + r - 2rp)',
    sampleProblem: 'For an equimolar PET reaction (Terephthalic acid + Ethylene glycol) at 99.2% conversion:',
    calculation: 'X_n = 1 / (1 - 0.992) = 1 / 0.008 = 125 repeating units.',
    molecularWeight: 'M_n = X_n * M_0 = 125 * 192.2 g/mol = 24,025 g/mol.',
    examNote: 'High-frequency GATE XE Paper F question (tested in 2021, 2023, 2025).'
  },
  {
    id: 'cooling',
    title: 'Ballman-Shusman Injection Cooling Time',
    latex: 't_c = (h^2 / (π^2 * α)) * ln((4 / π) * ((T_m - T_w) / (T_e - T_w)))',
    stoichiometric: 'Thermal Diffusivity: α = k / (ρ * C_p)',
    sampleProblem: 'Wall thickness h = 3 mm, Polypropylene (α = 0.096 mm²/s), T_melt = 230°C, T_mold = 40°C, T_eject = 90°C:',
    calculation: 't_c ≈ (9 / (9.869 * 0.096)) * ln(1.273 * (190 / 50)) = 9.49 * ln(4.837) = 9.49 * 1.576 ≈ 14.95 seconds.',
    molecularWeight: 'Doubling wall thickness from 3mm to 6mm increases cooling time by 400% (quadratic scaling h²).',
    examNote: 'Critical for both plant cycle time optimization and GATE heat transfer derivations.'
  },
  {
    id: 'mixtures',
    title: 'Rule of Mixtures (Composite Modulus E_c)',
    latex: 'E_c = E_f * V_f + E_m * (1 - V_f)',
    stoichiometric: 'Transverse: 1/E_ct = (V_f / E_f) + ((1 - V_f) / E_m)',
    sampleProblem: 'Carbon fiber (E_f = 230 GPa) in Epoxy matrix (E_m = 3.5 GPa) with 60% fiber volume fraction (V_f = 0.60):',
    calculation: 'E_cl = (230 * 0.60) + (3.5 * 0.40) = 138 + 1.4 = 139.4 GPa.',
    molecularWeight: 'The composite achieves 60.6% of pure carbon fiber stiffness while remaining lightweight.',
    examNote: 'GATE XE-F section on Polymer Blends & Advanced Composites.'
  }
]

export default function StudentInteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'tonnage' | 'defect' | 'formula'>('tonnage')

  // Calculator State
  const [projectedArea, setProjectedArea] = useState<number>(240)
  const [cavities, setCavities] = useState<number>(4)
  const [cavityPressure, setCavityPressure] = useState<number>(350) // bar

  // Defect State
  const [selectedDefectIndex, setSelectedDefectIndex] = useState<number>(0)

  // Formula State
  const [selectedFormulaIndex, setSelectedFormulaIndex] = useState<number>(0)

  // Tonnage calculation: Force (tons) = (Area_cm2 * Cavities * Pressure_bar) / 1000 * SafetyFactor (1.15)
  const totalArea = projectedArea * cavities
  const rawForce = (totalArea * cavityPressure) / 1000
  const recommendedTonnage = Math.ceil((rawForce * 1.15) / 10) * 10 // rounded to nearest 10 tons

  const currentDefect = DEFECT_DATA[selectedDefectIndex]
  const currentFormula = FORMULA_DATA[selectedFormulaIndex]

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
      {/* Widget Header Strip */}
      <div className="bg-[#0A1628] text-white p-5 border-b-2 border-slate-900 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold uppercase text-amber-400 tracking-wider">
              Interactive 5-Second Lab Sandbox
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              Try PolymerHub Shop-Floor Solvers Live
            </h3>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-white/20 gap-1 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('tonnage')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'tonnage'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Tonnage Solver</span>
          </button>

          <button
            onClick={() => setActiveTab('defect')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'defect'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Defect Fixer</span>
          </button>

          <button
            onClick={() => setActiveTab('formula')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'formula'
                ? 'bg-[#D97706] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>GATE Formulas</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="p-6 sm:p-8 bg-[#FAF8F5]">
        {/* TAB 1: CLAMPING TONNAGE SOLVER */}
        {activeTab === 'tonnage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-blue-700 uppercase tracking-widest">
                  Live Machine Sizing Solver
                </span>
                <h4 className="text-xl font-black text-slate-900">
                  Calculate Clamping Tonnage in Real-Time
                </h4>
                <p className="text-xs text-slate-600 font-normal">
                  Avoid mould flash or tool distortion by matching projected area and polymer cavity pressure.
                </p>
              </div>

              {/* Slider 1: Projected Area */}
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-700">Single Part Projected Area (A):</span>
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {projectedArea} cm²
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1200"
                  step="10"
                  value={projectedArea}
                  onChange={(e) => setProjectedArea(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>20 cm² (Bottle Cap)</span>
                  <span>500 cm² (Container)</span>
                  <span>1,200 cm² (Auto Bumper/Crate)</span>
                </div>
              </div>

              {/* Slider 2: Cavities */}
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-700">Mould Number of Cavities (n):</span>
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {cavities} Cavities
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  step="1"
                  value={cavities}
                  onChange={(e) => setCavities(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>1 Cavity</span>
                  <span>4 Cavities</span>
                  <span>16 Cavities</span>
                  <span>32 Cavities</span>
                </div>
              </div>

              {/* Selector: Material Cavity Pressure */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-800">
                  Select Polymer Resin &amp; Cavity Pressure:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'PP / PE', pressure: 300, desc: 'Easy Flow' },
                    { name: 'ABS / PS', pressure: 450, desc: 'Medium Viscosity' },
                    { name: 'PC / PA66', pressure: 650, desc: 'High Viscosity' },
                  ].map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => setCavityPressure(mat.pressure)}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                        cavityPressure === mat.pressure
                          ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-500 text-slate-700'
                      }`}
                    >
                      <div className="font-mono text-xs">{mat.name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{mat.pressure} bar &middot; {mat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Output Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#0A1628] text-white p-6 rounded-3xl border-2 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Calculated Shop-Floor Result
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Formula: F = (A_proj × n × P_cav) / 1000
                </div>
              </div>

              <div className="space-y-1 py-2 border-y border-white/10">
                <div className="text-xs text-slate-300 font-mono">Minimum Required Clamping:</div>
                <div className="text-4xl sm:text-5xl font-black text-amber-400 font-display tabular-nums">
                  {rawForce.toFixed(1)}{' '}
                  <span className="text-lg font-mono text-white font-bold">Metric Tons</span>
                </div>
                <div className="text-xs text-slate-400">
                  Total Projected Area: <span className="text-white font-mono">{totalArea.toLocaleString()} cm²</span>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-1.5">
                <div className="font-mono text-xs font-bold text-emerald-300 uppercase">
                  Recommended IMM Machine Sizing (15% Safety):
                </div>
                <div className="text-2xl font-black text-white font-display">
                  {recommendedTonnage} Ton Machine
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Prevents flashing at peak holding pressure and reduces hydraulic oil heating.
                </p>
              </div>

              <Link
                href="/calculators"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-xl border-2 border-slate-900 text-xs font-mono uppercase tracking-wider transition-all"
              >
                Explore All 8 Solvers (Cooling, Shrinkage, MFI)
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: SHOP-FLOOR DEFECT DIAGNOSIS */}
        {activeTab === 'defect' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Rosato-Standard Injection Diagnostics
                </span>
                <h4 className="text-xl font-black text-slate-900">
                  Select a Moulding Defect to Diagnose Root Cause
                </h4>
              </div>
              <Link
                href="/troubleshooter"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                Open Full Troubleshooter &rarr;
              </Link>
            </div>

            {/* Defect Quick Filter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEFECT_DATA.map((defect, idx) => (
                <button
                  key={defect.id}
                  onClick={() => setSelectedDefectIndex(idx)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    selectedDefectIndex === idx
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-300 bg-white hover:border-slate-500 text-slate-700'
                  }`}
                >
                  <div className="font-mono text-xs truncate">{defect.name}</div>
                  <div className="font-mono text-[10px] text-slate-500 truncate mt-0.5">{defect.category}</div>
                </button>
              ))}
            </div>

            {/* Diagnostic Detail Panel */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
                <div className="font-mono text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  {currentDefect.category}
                </div>
                <h5 className="text-2xl font-black text-slate-900">{currentDefect.name}</h5>
                <div className="text-xs font-mono text-slate-500">
                  Typical High-Risk Resins: <br />
                  <span className="font-bold text-slate-800">{currentDefect.resinTested}</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-red-600 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Thermodynamic &amp; Metallurgical Root Cause:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-red-50/50 p-3 rounded-xl border border-red-200">
                    {currentDefect.rootCause}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-emerald-700 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Immediate Shop-Floor Corrective Action:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 font-medium">
                    {currentDefect.shopFloorFix}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs">
                  <span className="font-mono text-[10px] font-black text-blue-800 uppercase tracking-wider block">
                    🎯 Core Technical Interview Edge (Reliance, Supreme, Tata AutoComp):
                  </span>
                  <p className="text-slate-700 font-sans">
                    {currentDefect.interviewTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GATE XE-F FORMULA DERIVATION */}
        {activeTab === 'formula' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-widest">
                  GATE XE-F 2027 Numerical Solvers
                </span>
                <h4 className="text-xl font-black text-slate-900">
                  Master High-Yield Exam Formulas with Solved Derivations
                </h4>
              </div>
              <Link
                href="/gate-mock"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Launch GATE Mock Arena &rarr;
              </Link>
            </div>

            {/* Formula Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FORMULA_DATA.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormulaIndex(idx)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    selectedFormulaIndex === idx
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                      : 'border-slate-300 bg-white hover:border-slate-500 text-slate-700'
                  }`}
                >
                  <div className="font-mono text-xs truncate">{f.title}</div>
                  <div className="font-mono text-[10px] text-amber-700 truncate mt-0.5">{f.latex}</div>
                </button>
              ))}
            </div>

            {/* Derivation Canvas */}
            <div className="bg-[#0A1628] text-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-white/10 px-2.5 py-0.5 rounded uppercase">
                    Official GATE XE Paper F Syllabus
                  </span>
                  <h5 className="text-2xl font-black text-white mt-1">{currentFormula.title}</h5>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{currentFormula.examNote}</span>
                </div>
              </div>

              {/* LaTeX Formula Highlight */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Core Equation:</div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300 tracking-wider">
                    {currentFormula.latex}
                  </div>
                </div>
                <div className="text-right sm:border-l border-white/10 sm:pl-4">
                  <div className="text-xs font-mono text-slate-400 uppercase">Condition / Variation:</div>
                  <div className="text-sm font-mono text-slate-200">
                    {currentFormula.stoichiometric}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Derivation Breakdown */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs font-mono">
                <div className="text-slate-300 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Solved Numerical Walkthrough:
                </div>
                <div className="text-slate-300 pl-6 border-l-2 border-amber-400 space-y-1.5">
                  <p className="text-slate-400">{currentFormula.sampleProblem}</p>
                  <p className="text-emerald-400 font-bold text-sm">{currentFormula.calculation}</p>
                  <p className="text-slate-300">{currentFormula.molecularWeight}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="text-xs font-mono text-slate-400">
                  458+ verified GATE questions available in test engine.
                </span>
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl border-2 border-slate-900 text-xs font-mono uppercase tracking-wider"
                >
                  Solve GATE XE-F Practice Series &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
