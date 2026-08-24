'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronDown, 
  ChevronUp, 
  Wrench, 
  Sparkles, 
  Brain,
  ArrowRight,
  ShieldAlert,
  Gauge,
  Lightbulb
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Process = 'injection' | 'extrusion' | 'blow'
type Severity = 'critical' | 'moderate' | 'minor'
type Fix = { parameter: string; action: string; detail: string }
type Defect = {
  id: string; name: string; description: string; severity: Severity
  causes: string[]; fixes: Fix[]; preventionTip: string; source: string
}
type ProcessData = { 
  label: string; 
  icon: string; 
  description: string;
  color: string;
  bg: string;
  defects: Defect[] 
}

// ─── Engineering Data (Rosato & Allen/Baker Handbooks) ─────────────────────────

const DATA: Record<Process, ProcessData> = {
  injection: {
    label: 'Injection Moulding', 
    icon: '🏗️',
    description: 'High-pressure cyclic moulding for precision structural components and enclosures.',
    color: '#2563EB',
    bg: '#EFF6FF',
    defects: [
      {
        id: 'sink-marks', 
        name: 'Sink Marks', 
        severity: 'moderate',
        description: 'Localized depressions or dimples on the surface of a moulded part, typically opposite thick ribs, bosses, or thick wall intersections.',
        causes: [
          'Insufficient holding/packing pressure — volumetric shrinkage pulls melt away from mould cavity walls',
          'Holding time too short — gate freezes prematurely before cavity is fully packed',
          'Wall section too thick — exterior skin solidifies while molten core contracts inward',
          'Melt temperature excessively high — increased volumetric thermal contraction upon cooling',
          'Gate cross-section too small — extreme pressure drop limits effective pressure transfer',
        ],
        fixes: [
          { parameter: 'Holding Pressure', action: 'Increase by 10–15%', detail: 'Raise hold pressure until sink marks disappear. Typical optimum range: 50–80% of peak injection pressure.' },
          { parameter: 'Holding Time', action: 'Extend by 1–3 seconds', detail: 'Maintain hold pressure until gate freeze-off occurs. Verify by weighing parts until part weight stabilizes.' },
          { parameter: 'Melt Temperature', action: 'Reduce by 5–10°C', detail: 'Lower melt temp reduces volumetric shrinkage magnitude. Stay within material processing window.' },
          { parameter: 'Mould Temperature', action: 'Reduce by 5–10°C', detail: 'Accelerates surface skin solidification, narrowing the time window during which sink depressions form.' },
          { parameter: 'Gate Size', action: 'Increase gate cross-section', detail: 'Enlarging the gate delays freeze-off, transmitting packing pressure deeper into thick wall regions.' },
        ],
        preventionTip: 'Design internal ribs to 60% or less of the adjacent nominal wall thickness. Position gates directly adjacent to the thickest wall sections.',
        source: 'Rosato — Plastics Processing Data Handbook; Allen & Baker — Handbook of Plastic Technology',
      },
      {
        id: 'warpage', 
        name: 'Warpage / Geometric Distortion', 
        severity: 'critical',
        description: 'The moulded part deforms or twists out of intended dimensional tolerances after ejection — the #1 dimensional quality defect in injection moulding.',
        causes: [
          'Non-uniform cooling rates — faster cooling areas shrink more rapidly, causing residual bending moments',
          'Differential orientation — anisotropic shrinkage between parallel and perpendicular polymer chain alignment',
          'Over-packing & residual stress — excessive holding pressure locks in compressive stresses near the gate',
          'Asymmetric wall thicknesses — uneven wall transitions create unbalanced internal contraction forces',
          'Premature part ejection — part is ejected before reaching safe structural modulus temperature',
        ],
        fixes: [
          { parameter: 'Cooling Uniformity', action: 'Audit cooling channel temperatures', detail: 'Measure core and cavity surface temperatures with a pyrometer. Temperature differential > 5°C causes bending towards the warmer half.' },
          { parameter: 'Cooling Time', action: 'Increase cooling time by 2–5 seconds', detail: 'Ensure part core reaches safe ejection temperature (HDT) before mechanical ejector pin actuation.' },
          { parameter: 'Holding Pressure', action: 'Reduce if over-packed', detail: 'Excessive packing locks in residual stresses that relieve themselves as warpage upon demoulding.' },
          { parameter: 'Gate Location', action: 'Optimize gate for symmetric fill', detail: 'Use CAE fill simulation to balance flow front arrival times and eliminate differential orientation vectors.' },
        ],
        preventionTip: 'Maintain uniform nominal wall thickness throughout part design. Place cooling channels equidistant from cavity surfaces on both mould halves.',
        source: 'Rosato — Plastics Processing Data Handbook; Osswald — Plastics Engineering',
      },
      {
        id: 'short-shot', 
        name: 'Short Shot / Incomplete Fill', 
        severity: 'critical',
        description: 'The mould cavity fails to fill completely — part is missing features or edges, typically at the end of flow paths or in thin ribs.',
        causes: [
          'Injection pressure or speed insufficient to overcome viscous resistance before freeze-off',
          'Melt temperature too low — high melt viscosity resists flow into thin wall sections',
          'Inadequate cavity venting — compressed air creates high backpressure opposing the melt front',
          'Shot volume insufficient — screw cushion drops to zero during injection stroke',
          'Undersized runner/gate — excessive pressure drop before entering cavity',
        ],
        fixes: [
          { parameter: 'Injection Pressure', action: 'Increase by 10–20 bar', detail: 'Ensure hydraulic/electric injection limit is not capped. Peak pressure at end of fill should drop 10–15%.' },
          { parameter: 'Injection Speed', action: 'Increase injection velocity', detail: 'Faster filling increases shear-thinning (lowering viscosity) and prevents premature gate/skin freezing.' },
          { parameter: 'Melt Temperature', action: 'Increase by 5–10°C', detail: 'Reduces melt viscosity, improving flow length-to-thickness (L/T) ratio into thin features.' },
          { parameter: 'Cavity Venting', action: 'Add or clean vents at last-fill points', detail: 'Provide 0.02–0.04mm deep vents along parting line at the short-shot boundary.' },
          { parameter: 'Shot Size & Cushion', action: 'Increase shot size to maintain 3–6mm cushion', detail: 'Verify screw cushion never hits zero during packing phase.' },
        ],
        preventionTip: 'Perform a progressive short-shot study (50%, 75%, 90%, 95% fill) during mould trials to identify last-to-fill vent requirements before production.',
        source: 'Allen & Baker — Handbook of Plastic Technology; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'flash', 
        name: 'Flash / Parting Line Fin', 
        severity: 'moderate',
        description: 'Thin webs or fins of plastic forced out of the cavity along the parting line, ejector pins, or slide joints.',
        causes: [
          'Clamping force insufficient for the projected area multiplied by peak cavity pressure',
          'Damaged, worn, or contaminated parting line preventing metal-to-metal sealing',
          'Excessive injection or packing pressure forcing mould halves apart during peak fill',
          'Mould temperature too high — overly fluid melt creeps into micro-clearances',
        ],
        fixes: [
          { parameter: 'Clamping Force', action: 'Recalculate required tonnage with 15% safety factor', detail: 'Tonnage = Projected Area (cm²) × Cavity Pressure (bar) / 1000. Increase machine clamp tonnage if needed.' },
          { parameter: 'Holding Pressure', action: 'Reduce packing pressure by 5–10 bar', detail: 'Flash frequently occurs during the hold phase. Lowering hold pressure often eliminates flash completely.' },
          { parameter: 'V/P Switchover Point', action: 'Switch to hold at 95% fill', detail: 'Transfer from velocity control to pressure control earlier to prevent dynamic pressure spikes at parting line.' },
          { parameter: 'Parting Surface', action: 'Inspect, clean, and stone parting line', detail: 'Remove plastic debris and inspect for parting land wash-out or indentation.' },
        ],
        preventionTip: 'Design parting land with minimum 3–5mm width. Always select injection machines with 15–20% clamp force overhead.',
        source: 'Allen & Baker — Handbook of Plastic Technology; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'burn-marks', 
        name: 'Burn Marks / Diesel Effect', 
        severity: 'moderate',
        description: 'Black or dark brown charred discolourations at the end of flow paths or blind ribs caused by adiabatic compression of trapped air.',
        causes: [
          'Trapped air unable to escape vents undergoes extreme adiabatic compression, igniting the plastic',
          'Injection speed too fast in the final 10% of stroke',
          'Melt temperature too close to degradation threshold before compression',
          'Vents fouled with plastic wax or pyrolyzed residue',
        ],
        fixes: [
          { parameter: 'Injection Speed Profiling', action: 'Decelerate velocity in final 15% of stroke', detail: 'Slow down screw velocity near the end of cavity filling to give compressed air time to exhaust through vents.' },
          { parameter: 'Venting Maintenance', action: 'Clean and deepen vent lands', detail: 'Clean vent deposits with solvent and ultrasonic bath. Ensure vent depth is 0.025–0.04mm.' },
          { parameter: 'Melt Temperature', action: 'Reduce barrel temperatures by 5–10°C', detail: 'Lower initial temperature provides higher thermal margin before reaching auto-ignition temperature.' },
          { parameter: 'Venting Pins', action: 'Add vented ejector pins at blind pockets', detail: 'Ejector pin clearance (0.015–0.02mm) acts as an effective vent in deep blind pockets.' },
        ],
        preventionTip: 'Locate parting line vents at all predicted air trap locations identified by Moldflow / CAE fill simulations.',
        source: 'Rosato — Plastics Processing Data Handbook; Allen & Baker',
      },
    ],
  },
  extrusion: {
    label: 'Extrusion Processing', 
    icon: '🔧',
    description: 'Continuous profile, pipe, film, and sheet extrusion through precision shaping dies.',
    color: '#15803D',
    bg: '#F0FDF4',
    defects: [
      {
        id: 'melt-fracture', 
        name: 'Melt Fracture / Sharkskin', 
        severity: 'critical',
        description: 'Periodic surface roughness, matte banding, or gross tearing of extrudate caused by critical shear stress exceedance at the die land exit.',
        causes: [
          'Wall shear stress at the die exit exceeds critical threshold (~0.1–0.2 MPa for LLDPE/HDPE)',
          'Extrusion throughput speed too high for die land dimensions',
          'Melt temperature at die land too cold — high viscosity increases shear stress',
          'Die entrance angle too abrupt — turbulent non-streamlined flow transitions',
        ],
        fixes: [
          { parameter: 'Die Land Temperature', action: 'Increase die lip temperature by 5–10°C', detail: 'Heating the die lips creates a lower-viscosity boundary lubrication layer, reducing exit shear stress.' },
          { parameter: 'Screw RPM & Line Speed', action: 'Reduce throughput rate by 10%', detail: 'Lowering flow rate directly lowers wall shear rate below the critical sharkskin transition threshold.' },
          { parameter: 'Processing Aid (PPA)', action: 'Add 0.05–0.1% fluoropolymer PPA masterbatch', detail: 'Fluoroelastomer polymer processing aids coat the die wall, creating slip and preventing melt fracture.' },
          { parameter: 'Die Land Length', action: 'Increase die land length (L/D)', detail: 'Longer die land provides shear stress relaxation time before the melt exits to atmospheric pressure.' },
        ],
        preventionTip: 'Use streamlined die entrance geometry (cone angle < 30°) and incorporate fluoropolymer PPA masterbatches for narrow-MWD metallocene polymers.',
        source: 'Rauwendaal — Polymer Extrusion; Allen & Baker — Handbook of Plastic Technology',
      },
      {
        id: 'die-swell', 
        name: 'Die Swell / Barus Effect', 
        severity: 'moderate',
        description: 'Extrudate dimensions expand significantly beyond die orifice dimensions upon exiting the die due to elastic memory recovery.',
        causes: [
          'Elastic memory recovery of stretched polymer chains when exiting the constraining die channel',
          'Die land too short — insufficient residence time for molecular orientation relaxation',
          'Melt temperature too low — increases elastic modulus and storage of entropic stress',
          'Broad molecular weight distribution resin with high high-molecular-weight fraction',
        ],
        fixes: [
          { parameter: 'Die Temperature', action: 'Increase die temperature by 5–10°C', detail: 'Higher temperature accelerates molecular relaxation rates, reducing elastic recovery magnitude.' },
          { parameter: 'Die Land Length', action: 'Extend die land length', detail: 'Ensure residence time in die land is at least 3x the longest molecular relaxation time (tau).' },
          { parameter: 'Draw Ratio', action: 'Increase haul-off puller speed', detail: 'Compensate for cross-sectional expansion by increasing downstream puller draw-down ratio.' },
        ],
        preventionTip: 'Select polymer grades with narrower MWD or optimize die land L/D ratio to at least 15:1 to 20:1 for tight dimensional profile tolerance.',
        source: 'Osswald — Polymer Processing; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'gauge-variation', 
        name: 'Gauge & Thickness Variation', 
        severity: 'critical',
        description: 'Circumferential or cross-web thickness deviations in blown film, pipe, or sheet extrusion exceeding standard tolerances.',
        causes: [
          'Non-uniform die lip gap adjustment across the circumference or width',
          'Uneven die lip temperature distribution — hot zones extrude faster than cool zones',
          'Air ring cooling asymmetry on blown film line causing bubble deflection',
          'Melt pressure/temperature surging from screw feed instability',
        ],
        fixes: [
          { parameter: 'Die Bolt Adjustment', action: 'Calibrate flexible die lip push/pull bolts', detail: 'Use micrometer gauge scan to adjust thermal or mechanical die bolts until thickness is within ±3%.' },
          { parameter: 'Die Heaters', action: 'Inspect and balance individual heater zones', detail: 'Check for failed band heaters. Temperature variation around the die ring should not exceed ±1.5°C.' },
          { parameter: 'Air Ring Alignment', action: 'Centrate air ring relative to die center', detail: 'Misaligned cooling air flow creates localized hot spots that blow thinner than adjacent sectors.' },
        ],
        preventionTip: 'Install automated thickness gauge scanners with closed-loop thermal die lip control for high-speed film and sheet lines.',
        source: 'Allen & Baker — Handbook of Plastic Technology',
      },
    ],
  },
  blow: {
    label: 'Blow Moulding', 
    icon: '💨',
    description: 'Extrusion and injection blow moulding for hollow bottles, tanks, and drums.',
    color: '#EA580C',
    bg: '#FFF7ED',
    defects: [
      {
        id: 'parison-sag', 
        name: 'Parison Sag / Draw-Down', 
        severity: 'critical',
        description: 'Gravity-induced elongation and thinning of the hanging molten parison before mould closure, causing thin bottle tops and uneven wall distribution.',
        causes: [
          'Extrusion parison hang time too long before mould clamp closure',
          'Melt temperature too high — reduces melt strength and zero-shear viscosity',
          'Resin High-Load Melt Index (HLMI) too high — insufficient low-shear melt elasticity',
          'Excessive parison length for single-cavity blow machine',
        ],
        fixes: [
          { parameter: 'Extrusion Speed', action: 'Increase parison extrusion velocity', detail: 'Extrude parison faster to minimize hang time under gravity before mould closing sequence initiates.' },
          { parameter: 'Melt Temperature', action: 'Reduce die and barrel temperatures by 5–10°C', detail: 'Lower temperature increases low-shear melt viscosity, directly resisting gravitational elongation.' },
          { parameter: 'Parison Programmer', action: 'Program die gap to thicken top profile', detail: 'Apply electronic parison wall thickness profiling to extrude thicker walls where sag thinning occurs.' },
          { parameter: 'Resin Selection', action: 'Switch to high molecular weight HDPE (bimodal grade)', detail: 'Bimodal HMW-HDPE grades provide superior melt strength and sag resistance for large hollow parts.' },
        ],
        preventionTip: 'Use 100-point electronic parison programmers (MOOG or Bekum) and select blow moulding grade resins with HLMI < 10 g/10min.',
        source: 'Rosato — Blow Molding Handbook; Allen & Baker',
      },
      {
        id: 'poor-pinch', 
        name: 'Pinch-Off Seam Failure / Weak Bottom', 
        severity: 'critical',
        description: 'Incomplete welding or brittle weld seams at the container base pinch-off line, resulting in drop impact rupture and leakage.',
        causes: [
          'Pinch-off blade land width too wide — crushes without fusing parison edges',
          'Parison temperature too cold at bottom pinch zone during mould closing',
          'Mould clamping tonnage insufficient to co-extrude and seal parison tail',
          'Excessive blow pressure applied before mould is 100% clamped',
        ],
        fixes: [
          { parameter: 'Pinch-Off Geometry', action: 'Sharpen pinch blade to 0.1–0.3mm radius with 30° relief', detail: 'Pinch blade must cut through and weld simultaneously. Replace worn or notched pinch inserts.' },
          { parameter: 'Die Zone Temperature', action: 'Increase lower die zone by 5°C', detail: 'Ensures molten parison weld seam fuses completely under mould clamp compressive force.' },
          { parameter: 'Blow Delay Timing', action: 'Delay blow valve trigger until full clamp lock', detail: 'Premature blowing forces parison apart before pinch weld solidifies under clamp pressure.' },
        ],
        preventionTip: 'Inspect pinch-off tooling every 50,000 cycles for beryllium-copper or steel inserts. Maintain relief angle of 30° to 45° to accommodate flash tail.',
        source: 'Rosato — Blow Molding Handbook; Allen & Baker',
      },
    ],
  },
}

const SEV_CONFIG: Record<Severity, { label: string; bg: string; text: string; border: string }> = {
  critical: { label: 'CRITICAL', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
  moderate: { label: 'MODERATE', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  minor:    { label: 'MINOR',    bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-300' },
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TroubleshooterPage() {
  const [process, setProcess] = useState<Process>('injection')
  const [selectedDefectId, setSelectedDefectId] = useState<string>('sink-marks')
  const [expandedFixIndex, setExpandedFixIndex] = useState<number | null>(0)

  const processKeys: Process[] = ['injection', 'extrusion', 'blow']
  const currentProcessData = DATA[process]
  const currentDefect = currentProcessData.defects.find((d) => d.id === selectedDefectId) || currentProcessData.defects[0]

  const handleProcessChange = (p: Process) => {
    setProcess(p)
    setSelectedDefectId(DATA[p].defects[0].id)
    setExpandedFixIndex(0)
  }

  return (
    <div className="min-h-screen bg-[#FEF2F2] text-slate-900 pb-20">
      
      {/* ── Top Header Bar: Red ── */}
      <div className="bg-[#DC2626] border-b-4 border-[#EF4444]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#FECACA] text-xs font-mono font-bold uppercase tracking-wider">Diagnostic Engine</span>
              <div className="flex flex-wrap gap-4 mt-1 text-white text-xs font-mono">
                <span>12+ <span className="text-[#FECACA]">Defects</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>3 <span className="text-[#FECACA]">Methods</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>AI <span className="text-[#FECACA]">Diagnosis</span></span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#FECACA] text-xs font-mono font-bold">Rosato &amp; Baker</p>
              <p className="text-white/60 text-[10px] font-mono">Handbook Cited</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Section: Red Gradient ── */}
      <section className="bg-gradient-to-br from-[#EF4444] via-[#DC2626] to-[#B91C1C] text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Wrench className="w-4 h-4 text-red-200" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Interactive Diagnostic Engine &middot; Handbook Mapped
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Diagnose &amp; Fix <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FECACA] via-[#FFFFFF] to-[#FCA5A5]">
              Processing Defects
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-red-100 max-w-2xl mx-auto leading-relaxed font-light">
            Root-cause analysis and step-by-step corrective parameters drawn directly from <strong>Rosato&apos;s Plastics Processing Data Handbook</strong> and <strong>Allen &amp; Baker&apos;s Plastic Technology</strong>.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">12+</span>
              <span className="text-[10px] font-mono text-red-200 uppercase tracking-wider">Defects Mapped</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">3</span>
              <span className="text-[10px] font-mono text-red-200 uppercase tracking-wider">Core Processes</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-300 block">100%</span>
              <span className="text-[10px] font-mono text-red-200 uppercase tracking-wider">Handbook Cited</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Main Diagnostic Workbench ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Step 1: Process Method Selector */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              Step 1 &mdash; Select Processing Method
            </h2>
            <span className="text-xs font-mono text-slate-400 font-semibold">
              {currentProcessData.defects.length} Defects Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {processKeys.map((p) => {
              const d = DATA[p]
              const isSelected = process === p
              return (
                <button
                  key={p}
                  onClick={() => handleProcessChange(p)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-3xl mb-2 block">{d.icon}</span>
                    <h3 className="font-display text-lg font-black text-slate-900">{d.label}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-blue-700">
                      {d.defects.length} Defects &rarr;
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2 & 3: Workbench Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Defect Symptoms Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider">
                Step 2 &mdash; Select Defect
              </h3>
              <span className="text-[11px] font-mono text-slate-400 font-bold">
                {currentProcessData.defects.length} Cases
              </span>
            </div>

            <div className="space-y-2.5">
              {currentProcessData.defects.map((d) => {
                const isSelected = currentDefect.id === d.id
                const sev = SEV_CONFIG[d.severity]
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDefectId(d.id)
                      setExpandedFixIndex(0)
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className={`font-display text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                        {d.name}
                      </h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${sev.bg} ${sev.text} ${sev.border}`}>
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {d.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Engineering Diagnostic Engine Output */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Defect Hero Card */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
                    {currentProcessData.label} &middot; Defect Dossier
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    {currentDefect.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border uppercase ${SEV_CONFIG[currentDefect.severity].bg} ${SEV_CONFIG[currentDefect.severity].text} ${SEV_CONFIG[currentDefect.severity].border}`}>
                    {SEV_CONFIG[currentDefect.severity].label} Priority
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
                {currentDefect.description}
              </p>

              {/* Root Causes Checklist */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Primary Root Causes
                </h4>
                <div className="space-y-2">
                  {currentDefect.causes.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs sm:text-sm text-slate-800">
                      <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 font-mono">
                        {i + 1}
                      </span>
                      <span className="font-medium leading-relaxed">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Parameter Fixes Accordion */}
              <div className="space-y-3 pt-2">
                <h4 className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Machine Parameter Corrective Actions
                </h4>
                
                <div className="space-y-2.5">
                  {currentDefect.fixes.map((fix, idx) => {
                    const isExpanded = expandedFixIndex === idx
                    return (
                      <div 
                        key={idx}
                        className="rounded-xl border-2 border-slate-200 overflow-hidden bg-white shadow-sm transition-all"
                      >
                        <button
                          onClick={() => setExpandedFixIndex(isExpanded ? null : idx)}
                          className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                              #{idx + 1}
                            </span>
                            <div>
                              <p className="font-display font-bold text-xs sm:text-sm text-slate-900">
                                {fix.parameter}: <span className="text-blue-700 font-semibold">{fix.action}</span>
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-4 bg-blue-50/40 border-t border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium animate-in fade-in duration-200">
                            <p className="font-mono text-[10px] text-blue-800 uppercase font-bold mb-1">
                              Engineering Protocol &amp; Rationale:
                            </p>
                            {fix.detail}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Shop-Floor Prevention Tip */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-800 uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-amber-600" /> Tooling &amp; Tool Design Prevention Tip
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-amber-900">
                  {currentDefect.preventionTip}
                </p>
              </div>

              {/* Literature Citation */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
                <span>📚 <strong>Source Citation:</strong> {currentDefect.source}</span>
                <Link
                  href={`/ai-tutor?prompt=${encodeURIComponent(`Explain how to fix ${currentDefect.name} in ${currentProcessData.label} according to Rosato Handbook`)}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold"
                >
                  <Brain className="w-3.5 h-3.5" /> Ask AI Specialist &rarr;
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ── Theory Bridge Banner ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-gradient-to-r from-[#0A1628] via-[#0F284D] to-[#0A1628] text-white rounded-3xl p-8 sm:p-10 border-2 border-slate-900 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Master the Science
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black">
              Learn the Underlying Fluid &amp; Thermal Science
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light">
              Understanding shear rates, non-Newtonian flow, and polymer crystallization kinetics makes you an elite mould design and processing engineer.
            </p>
          </div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider px-6 py-3.5 rounded-xl border-2 border-slate-900 transition-all shadow-[4px_4px_0px_0px_#000] flex-shrink-0"
          >
            Explore 19 Subjects Curriculum <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
