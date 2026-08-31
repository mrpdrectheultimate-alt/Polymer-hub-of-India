'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronDown, 
  ChevronUp, 
  Wrench, 
  Brain, 
  ShieldAlert, 
  Gauge, 
  Cog,
  Copy,
  Check,
  Printer,
  CheckCircle2,
  Layers,
  Sliders
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Process = 'injection' | 'extrusion' | 'blow'
type Severity = 'critical' | 'moderate' | 'minor'
type Fix = { 
  parameter: string
  action: string
  detail: string
  testProtocol?: { baseline: string; target: string; expected: string }
}
type Defect = {
  id: string
  name: string
  description: string
  severity: Severity
  causes: string[]
  fixes: Fix[]
  preventionTip: string
  source: string
}
type ProcessData = { 
  label: string
  icon: string
  description: string
  color: string
  bg: string
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
          { 
            parameter: 'Holding Pressure', 
            action: 'Increase by 10–15%', 
            detail: 'Raise hold pressure until sink marks disappear. Typical optimum range: 50–80% of peak injection pressure.',
            testProtocol: { baseline: '80 MPa', target: '90–92 MPa', expected: 'Elimination of depression depth on thick wall sections' }
          },
          { 
            parameter: 'Holding Time', 
            action: 'Extend by 1–3 seconds', 
            detail: 'Maintain hold pressure until gate freeze-off occurs. Verify by weighing parts until part weight stabilizes.',
            testProtocol: { baseline: '3.5 s', target: '5.0 s', expected: 'Part weight reaches asymptotic maximum (gate frozen)' }
          },
          { 
            parameter: 'Melt Temperature', 
            action: 'Reduce by 5–10°C', 
            detail: 'Lower melt temp reduces volumetric shrinkage magnitude. Stay within material processing window.',
            testProtocol: { baseline: '235°C', target: '225°C', expected: 'Reduced volumetric contraction without increasing injection pressure' }
          },
          { 
            parameter: 'Mould Temperature', 
            action: 'Reduce by 5–10°C', 
            detail: 'Accelerates surface skin solidification, narrowing the time window during which sink depressions form.',
            testProtocol: { baseline: '50°C', target: '40°C', expected: 'Faster surface skin freeze prevents inward sink pull' }
          },
          { 
            parameter: 'Gate Size', 
            action: 'Increase gate cross-section', 
            detail: 'Enlarging the gate delays freeze-off, transmitting packing pressure deeper into thick wall regions.',
            testProtocol: { baseline: '1.2 mm sub-gate', target: '1.6 mm sub-gate', expected: 'Extended pressure transmission window' }
          },
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
          { 
            parameter: 'Cooling Uniformity', 
            action: 'Audit cooling channel temperatures', 
            detail: 'Measure core and cavity surface temperatures with a pyrometer. Temperature differential > 5°C causes bending towards the warmer half.',
            testProtocol: { baseline: 'ΔT = 12°C between halves', target: 'ΔT < 3°C', expected: 'Balanced thermal contraction on core and cavity sides' }
          },
          { 
            parameter: 'Cooling Time', 
            action: 'Increase cooling time by 2–5 seconds', 
            detail: 'Ensure part core reaches safe ejection temperature (HDT) before mechanical ejector pin actuation.',
            testProtocol: { baseline: '12 s', target: '15 s', expected: 'Sufficient flexural rigidity during mechanical ejection' }
          },
          { 
            parameter: 'Holding Pressure', 
            action: 'Reduce if over-packed', 
            detail: 'Excessive packing locks in residual stresses that relieve themselves as warpage upon demoulding.',
            testProtocol: { baseline: '95 MPa', target: '75 MPa', expected: 'Relaxation of locked-in gate area compressive stresses' }
          },
          { 
            parameter: 'Gate Location', 
            action: 'Optimize gate for symmetric fill', 
            detail: 'Use CAE fill simulation to balance flow front arrival times and eliminate differential orientation vectors.',
            testProtocol: { baseline: 'Edge gate asymmetric', target: 'Central diaphragm gate', expected: 'Radial symmetric shrinkage' }
          },
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
          { 
            parameter: 'Injection Pressure', 
            action: 'Increase by 10–20 bar', 
            detail: 'Ensure hydraulic/electric injection limit is not capped. Peak pressure at end of fill should drop 10–15%.',
            testProtocol: { baseline: '110 bar hydraulic', target: '125 bar', expected: 'Complete cavity filling without flash' }
          },
          { 
            parameter: 'Injection Speed', 
            action: 'Increase injection velocity', 
            detail: 'Faster filling increases shear-thinning (lowering viscosity) and prevents premature gate/skin freezing.',
            testProtocol: { baseline: '45 mm/s', target: '65 mm/s', expected: 'Higher shear rate lowers melt viscosity into thin ribs' }
          },
          { 
            parameter: 'Melt Temperature', 
            action: 'Increase by 5–10°C', 
            detail: 'Reduces melt viscosity, improving flow length-to-thickness (L/T) ratio into thin features.',
            testProtocol: { baseline: '220°C', target: '230°C', expected: 'Extended flow length before freeze-off' }
          },
          { 
            parameter: 'Cavity Venting', 
            action: 'Add or clean vents at last-fill points', 
            detail: 'Provide 0.02–0.04mm deep vents along parting line at the short-shot boundary.',
            testProtocol: { baseline: 'Parting line clogged', target: 'Cleaned 0.03mm vent land', expected: 'Zero air backpressure resistance' }
          },
          { 
            parameter: 'Shot Size & Cushion', 
            action: 'Maintain 3–6mm cushion', 
            detail: 'Verify screw cushion never hits zero during packing phase.',
            testProtocol: { baseline: 'Cushion = 0.5 mm (bottomed out)', target: 'Cushion = 4.0 mm', expected: 'Sufficient melt reserve for packing' }
          },
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
          { 
            parameter: 'Clamping Force', 
            action: 'Recalculate required tonnage with 15% safety factor', 
            detail: 'Tonnage = Projected Area (cm²) × Cavity Pressure (bar) / 1000. Increase machine clamp tonnage if needed.',
            testProtocol: { baseline: '120 Tons', target: '150 Tons', expected: 'Zero parting line separation during peak injection stroke' }
          },
          { 
            parameter: 'Holding Pressure', 
            action: 'Reduce packing pressure by 5–10 bar', 
            detail: 'Flash frequently occurs during the hold phase. Lowering hold pressure often eliminates flash completely.',
            testProtocol: { baseline: '85 bar', target: '75 bar', expected: 'Flash eliminated while maintaining part weight tolerances' }
          },
          { 
            parameter: 'V/P Switchover Point', 
            action: 'Switch to hold at 95% fill', 
            detail: 'Transfer from velocity control to pressure control earlier to prevent dynamic pressure spikes at parting line.',
            testProtocol: { baseline: '99% fill switchover', target: '95% volumetric fill', expected: 'Elimination of inertial pressure spike' }
          },
          { 
            parameter: 'Parting Surface', 
            action: 'Inspect, clean, and stone parting line', 
            detail: 'Remove plastic debris and inspect for parting land wash-out or indentation.',
            testProtocol: { baseline: 'Surface debris present', target: 'Clean metal land 100% blued', expected: 'Uniform parting line seal' }
          },
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
          { 
            parameter: 'Injection Speed Profiling', 
            action: 'Decelerate velocity in final 15% of stroke', 
            detail: 'Slow down screw velocity near the end of cavity filling to give compressed air time to exhaust through vents.',
            testProtocol: { baseline: 'Constant 60 mm/s to 100% stroke', target: 'Step-down to 20 mm/s at 85% stroke', expected: 'Air exhausts smoothly without ignition' }
          },
          { 
            parameter: 'Venting Maintenance', 
            action: 'Clean and deepen vent lands', 
            detail: 'Clean vent deposits with solvent and ultrasonic bath. Ensure vent depth is 0.025–0.04mm.',
            testProtocol: { baseline: 'Fouled vent channels', target: 'Cleaned vent slots 0.03mm depth', expected: 'Full exhaust pathway restored' }
          },
          { 
            parameter: 'Melt Temperature', 
            action: 'Reduce barrel temperatures by 5–10°C', 
            detail: 'Lower initial temperature provides higher thermal margin before reaching auto-ignition temperature.',
            testProtocol: { baseline: '250°C', target: '240°C', expected: 'Increased thermal degradation safety threshold' }
          },
        ],
        preventionTip: 'Locate parting line vents at all predicted air trap locations identified by Moldflow / CAE fill simulations.',
        source: 'Rosato — Plastics Processing Data Handbook; Allen & Baker',
      },
    ],
  },
  extrusion: {
    label: 'Extrusion Profile & Film',
    icon: '⚙️',
    description: 'Continuous plasticating and shaping through precision dies for pipes, profiles, sheets, and blown film.',
    color: '#0D9488',
    bg: '#F0FDFA',
    defects: [
      {
        id: 'sharkskin',
        name: 'Melt Fracture / Sharkskin',
        severity: 'critical',
        description: 'Periodic surface roughness or matte finish caused by critical tensile stress exceeding melt strength at the die exit land.',
        causes: [
          'Shear stress at die wall exceeding critical shear stress (typically ~0.1–0.2 MPa)',
          'Extrusion throughput rate too high for given die geometry',
          'Die exit temperature too cold relative to melt core',
          'High molecular weight narrow MWD resin without processing aids',
        ],
        fixes: [
          { 
            parameter: 'Die Lip Temperature', 
            action: 'Increase die lip zone by 5–10°C', 
            detail: 'Lowers melt viscosity directly at the wall interface, reducing tensile exit stress.',
            testProtocol: { baseline: '190°C', target: '200°C', expected: 'Surface gloss restored; sharkskin roughness eliminated' }
          },
          { 
            parameter: 'Extrusion Line Speed', 
            action: 'Reduce screw RPM by 10–15%', 
            detail: 'Lowers volumetric shear rate below the critical melt fracture threshold.',
            testProtocol: { baseline: '75 RPM', target: '65 RPM', expected: 'Shear stress drops below critical 0.1 MPa limit' }
          },
          { 
            parameter: 'Processing Aid (PPA)', 
            action: 'Dose 500–1000 ppm fluoropolymer PPA', 
            detail: 'Forms a low-friction dynamic coating on die metal, promoting slip and eliminating exit sharkskin.',
            testProtocol: { baseline: '0 ppm PPA', target: '800 ppm masterbatch', expected: 'Die pressure drops 15%; surface defects clear' }
          },
        ],
        preventionTip: 'Maintain generous die entry taper angles (30° to 45° included angle) to avoid extensional stress concentrations.',
        source: 'Rauwendaal — Polymer Extrusion; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'die-lines',
        name: 'Die Lines / Longitudinal Streaks',
        severity: 'moderate',
        description: 'Continuous continuous parallel ridges, grooves, or streaks running along the length of extruded product.',
        causes: [
          'Degraded polymer hang-up or carbon deposits adhering to the die lip',
          'Mechanical nick, scratch, or burr on the die metal land surface',
          'Unmelted gel or contaminant particle lodged in die gap',
        ],
        fixes: [
          { 
            parameter: 'Die Lip Purging', 
            action: 'Brass blade scraping & high-MFI purge', 
            detail: 'Use a soft brass or copper scraper with purging compound while line is running at low RPM.',
            testProtocol: { baseline: 'Visible carbon specks on lip', target: 'Clean polished die orifice', expected: 'Elimination of longitudinal groove marks' }
          },
          { 
            parameter: 'Melt Filtration (Screen Pack)', 
            action: 'Install finer mesh (e.g. 20/40/80/100 mesh)', 
            detail: 'Prevents unmelted gels and foreign particles from reaching the die gap.',
            testProtocol: { baseline: '40/60 mesh pack', target: '20/40/80/100 mesh pack', expected: 'Zero unmelts reaching die orifice' }
          },
        ],
        preventionTip: 'Never use steel tools or wire brushes on hardened die surfaces. Polish die lands with 1-micron diamond paste.',
        source: 'Rauwendaal — Polymer Extrusion; Allen & Baker',
      },
      {
        id: 'gauge-variation',
        name: 'Thickness / Gauge Variation',
        severity: 'critical',
        description: 'Circumferential or cross-web thickness unevenness exceeding allowed tolerance specifications.',
        causes: [
          'Non-uniform die gap clearance across width or circumference',
          'Temperature variation across die heating zones',
          'Asymmetrical air ring cooling flow in blown film extrusion',
          'Extruder surge caused by erratic solids feeding or poor screw plastication',
        ],
        fixes: [
          { 
            parameter: 'Die Bolt Adjustment', 
            action: 'Adjust push/pull micro-bolts at thin/thick spots', 
            detail: 'Tighten push bolts at thick spots to narrow die clearance; loosen at thin spots.',
            testProtocol: { baseline: '±15% gauge variance', target: '±3% gauge variance', expected: 'Uniform circumferential film thickness profile' }
          },
          { 
            parameter: 'Die Zone Heaters', 
            action: 'Check all band heaters and thermocouple contacts', 
            detail: 'A failed heater causes high melt viscosity in that zone, creating a local thin spot.',
            testProtocol: { baseline: 'Zone 3 heater open-circuit', target: 'Replaced heater; PID tuned', expected: 'Uniform 360° melt temperature profile' }
          },
        ],
        preventionTip: 'Install automated thickness measuring gauge scanners (beta-ray/capacitance) with closed-loop auto-profile die adjustment.',
        source: 'Rosato — Plastics Processing Data Handbook; Rauwendaal',
      },
      {
        id: 'bubble-instability',
        name: 'Blown Film Bubble Instability',
        severity: 'critical',
        description: 'Oscillation, breathing, helical twist, or collapse of the blown film bubble leading to film wrinkle and gauge failure.',
        causes: [
          'Blow-Up Ratio (BUR) or Frost Line Height (FLH) out of stable processing window',
          'Air ring velocity uneven or turbulent ambient air drafts around bubble',
          'Melt temperature too high — excessive sag before frost line solidification',
          'Melt elasticity too low for given draw ratio',
        ],
        fixes: [
          { 
            parameter: 'Air Ring Chilled Air Balance', 
            action: 'Adjust lip opening & reduce blower turbulence', 
            detail: 'Balance dual-lip air flow to stabilize frost line at 2.5–3.5× die diameter height.',
            testProtocol: { baseline: 'Frost line hunting ±150mm', target: 'Stable frost line height ±15mm', expected: 'Stationary cylindrical bubble shape' }
          },
          { 
            parameter: 'Melt Temperature Profile', 
            action: 'Lower adapter and die zones by 5–8°C', 
            detail: 'Increases melt strength to resist gravitational sagging and aerodynamic drag.',
            testProtocol: { baseline: '205°C melt temp', target: '195°C melt temp', expected: 'Higher extensional melt modulus at die exit' }
          },
        ],
        preventionTip: 'Enclose blown film tower with draft curtains to prevent external ambient cross-winds from perturbing the bubble.',
        source: 'Rosato — Blow Molding Handbook; Rauwendaal — Polymer Extrusion',
      },
    ],
  },
  blow: {
    label: 'Blow Moulding',
    icon: '🧴',
    description: 'Extrusion blow moulding (EBM) and stretch blow moulding (ISBM) for hollow packaging and containers.',
    color: '#CA8A04',
    bg: '#FEFCE8',
    defects: [
      {
        id: 'thin-corners',
        name: 'Thin Corners / Uneven Wall Distribution',
        severity: 'critical',
        description: 'Excessive thinning at corners or bottom radii of blown containers resulting in stress cracking and drop test failure.',
        causes: [
          'Parison sag or excessive draw down before mould closure',
          'Parison programming profile inappropriate for container aspect ratio',
          'Blow pressure applied too late or pre-blow pressure too low',
          'Container corner radius too sharp in product design',
        ],
        fixes: [
          { 
            parameter: 'Parison Wall Programmer', 
            action: 'Increase parison thickness at corner axial points', 
            detail: 'Program electronic parison cylinder to thicken tube sections that stretch into deep corner corners.',
            testProtocol: { baseline: 'Flat 50-point profile', target: 'Step up to 75% opening at points 22-28', expected: 'Target 0.8mm minimum corner wall thickness' }
          },
          { 
            parameter: 'Pre-Blow Pressure & Timing', 
            action: 'Trigger pre-blow earlier during mould descent', 
            detail: 'Pre-inflates parison to prevent premature contact with cold mould walls before corner expansion.',
            testProtocol: { baseline: 'Pre-blow delay 0.4s', target: 'Pre-blow delay 0.15s @ 1.5 bar', expected: 'Uniform radial expansion into corner cavities' }
          },
        ],
        preventionTip: 'Ensure product design maintains corner radii of at least 3–5× wall thickness to prevent geometric stress concentration.',
        source: 'Rosato — Blow Molding Handbook; Allen & Baker',
      },
      {
        id: 'rocker-bottom',
        name: 'Rocker Bottom / Unstable Base',
        severity: 'moderate',
        description: 'Container base pushes outward (convex) instead of staying recessed, making the bottle unable to stand upright.',
        causes: [
          'Base push-up core temperature too warm upon ejection',
          'Blow exhaust time too short — trapped internal pressure bulges hot base outwards upon mould opening',
          'Excessive thick pinch-off tail cooling slowly and contracting unevenly',
        ],
        fixes: [
          { 
            parameter: 'Exhaust Time Cycle', 
            action: 'Extend blow pin exhaust duration by 0.5–1.0 s', 
            detail: 'Ensure internal container air pressure drops to 0 bar gauge before mould halves separate.',
            testProtocol: { baseline: '0.3 s exhaust', target: '0.9 s exhaust before mould open', expected: 'Zero residual internal pressure outward push' }
          },
          { 
            parameter: 'Base Insert Cooling', 
            action: 'Increase chilled water flow to base push-up insert', 
            detail: 'Dedicated water flow to base plug freezes the push-up concavity before part ejection.',
            testProtocol: { baseline: 'Base insert temp 35°C', target: 'Base insert temp 12°C (chilled)', expected: 'Stable concave push-up geometry upon ejection' }
          },
        ],
        preventionTip: 'Design push-up depth of 4–8mm with inward dome geometry to guarantee bottle sits only on outer contact rim.',
        source: 'Rosato — Blow Molding Handbook; Allen & Baker',
      },
      {
        id: 'weak-pinch-off',
        name: 'Weak Pinch-Off Weld / Bottom Rupture',
        severity: 'critical',
        description: 'Incomplete welding or brittle weld seams at the container base pinch-off line, resulting in drop impact rupture and leakage.',
        causes: [
          'Pinch-off blade land width too wide — crushes without fusing parison edges',
          'Parison temperature too cold at bottom pinch zone during mould closing',
          'Mould clamping tonnage insufficient to co-extrude and seal parison tail',
          'Excessive blow pressure applied before mould is 100% clamped',
        ],
        fixes: [
          { 
            parameter: 'Pinch-Off Geometry', 
            action: 'Sharpen pinch blade to 0.1–0.3mm radius with 30° relief', 
            detail: 'Pinch blade must cut through and weld simultaneously. Replace worn or notched pinch inserts.',
            testProtocol: { baseline: 'Land width = 1.0mm (blunt)', target: 'Land width = 0.25mm with 35° relief pocket', expected: 'Complete molecular weld fusion without flash tail rupture' }
          },
          { 
            parameter: 'Die Zone Temperature', 
            action: 'Increase lower die zone by 5°C', 
            detail: 'Ensures molten parison weld seam fuses completely under mould clamp compressive force.',
            testProtocol: { baseline: '185°C bottom die zone', target: '190°C', expected: 'Enhanced molecular inter-diffusion at weld line' }
          },
          { 
            parameter: 'Blow Delay Timing', 
            action: 'Delay blow valve trigger until full clamp lock', 
            detail: 'Premature blowing forces parison apart before pinch weld solidifies under clamp pressure.',
            testProtocol: { baseline: 'Blow trigger at 90% clamp stroke', target: 'Blow trigger at 100% clamp tonnage lock', expected: 'Weld seam undisturbed during formation' }
          },
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
  const [copied, setCopied] = useState(false)

  const processKeys: Process[] = ['injection', 'extrusion', 'blow']
  const currentProcessData = DATA[process]
  const currentDefect = currentProcessData.defects.find((d) => d.id === selectedDefectId) || currentProcessData.defects[0]

  const handleProcessChange = (p: Process) => {
    setProcess(p)
    setSelectedDefectId(DATA[p].defects[0].id)
    setExpandedFixIndex(0)
  }

  // Copy structured lab report to clipboard
  const handleCopyReport = () => {
    const text = `
=========================================
POLYMERHUB DIAGNOSTIC DOSSIER
Process: ${currentProcessData.label}
Defect: ${currentDefect.name} (Priority: ${currentDefect.severity.toUpperCase()})
Source: ${currentDefect.source}
=========================================

DESCRIPTION:
${currentDefect.description}

PRIMARY ROOT CAUSES:
${currentDefect.causes.map((c, i) => `${i + 1}. ${c}`).join('\n')}

CORRECTIVE PARAMETER PROTOCOLS:
${currentDefect.fixes.map((f, i) => `[Action #${i + 1}] ${f.parameter} -> ${f.action}\n  Protocol: ${f.detail}\n${f.testProtocol ? `  Test Loop: Baseline ${f.testProtocol.baseline} -> Target ${f.testProtocol.target} -> Expected: ${f.testProtocol.expected}\n` : ''}`).join('\n')}

TOOLING & DESIGN PREVENTION NOTE:
${currentDefect.preventionTip}
=========================================
Generated via PolymerHub Diagnostic Engine
    `.trim()

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // Real browser print/PDF trigger
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      
      {/* ─── TOP CONSOLE BAR (DEEP ENGINEERING NAVY) ─── */}
      <div className="bg-[#0B132B] border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Inventory Breakdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Diagnostic Engine
              </span>
              <span className="w-px h-3.5 bg-slate-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300">
                <span>12 Industrial Defects Mapped</span>
                <span className="text-slate-500">&middot;</span>
                <span className="text-emerald-400 font-bold">5 Injection &middot; 4 Extrusion &middot; 3 Blow</span>
              </div>
            </div>

            {/* Right: Functional Utility Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
                title="Copy structured diagnostic report to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Report Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Save to Lab Report</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
                title="Print or export diagnostic sheet as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ─── HERO SECTION: DEEP ENGINEERING NAVY ─── */}
      <section className="bg-gradient-to-br from-[#0B132B] via-[#0F2042] to-[#0A1128] text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-200">
              Interactive Shop-Floor Diagnostic Workbench
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight uppercase">
            Diagnose &amp; Fix <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] via-[#FFFFFF] to-[#38BDF8]">
              Processing Defects
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Source-backed root-cause analysis and step-by-step corrective parameters drawn directly from <strong>Rosato&apos;s Plastics Processing Data Handbook</strong> and <strong>Allen &amp; Baker&apos;s Plastic Technology</strong>.
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="font-display text-xl font-bold text-white block">5 of 12+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Injection Moulding Active</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="font-display text-xl font-bold text-white block">3</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Core Industrial Methods</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="font-display text-xl font-bold text-emerald-400 block">Source-Backed</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Handbook Diagnostic Guidance</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── MAIN DIAGNOSTIC WORKBENCH ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-8">
        
        {/* Step 1: Process Method Selector */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[#2563EB]" />
              Step 1 &mdash; Select Manufacturing Method
            </h2>
            <span className="text-xs font-mono text-slate-500 font-semibold">
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
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#2563EB] bg-blue-50/60 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-3xl mb-2 block select-none">{d.icon}</span>
                    <h3 className="font-display text-lg font-bold text-slate-900">{d.label}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{d.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#2563EB]">
                      {d.defects.length} Defect Matrices &rarr;
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
              <h3 className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 2 &mdash; Select Defect
              </h3>
              <span className="text-[11px] font-mono text-slate-400 font-bold">
                {currentProcessData.defects.length} Diagnoses
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
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#2563EB] shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className={`font-display text-sm font-bold ${isSelected ? 'text-[#2563EB]' : 'text-slate-900'}`}>
                        {d.name}
                      </h4>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${sev.bg} ${sev.text} ${sev.border}`}>
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
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
            <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              
              {/* Header with Space Grotesk 700 24px */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-widest">
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
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {currentDefect.description}
              </p>

              {/* ─── PRIMARY ROOT CAUSES (LEFT-ALIGNED 16px INTER) ─── */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Primary Root Causes
                </h4>
                <div className="space-y-2.5">
                  {currentDefect.causes.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── STEP-BY-STEP PARAMETER CORRECTIVE ACTIONS ACCORDION ─── */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#2563EB]" />
                    Machine Parameter Corrective Actions
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">Click to reveal diagnostic loop</span>
                </div>
                
                <div className="space-y-2.5">
                  {currentDefect.fixes.map((fix, idx) => {
                    const isExpanded = expandedFixIndex === idx
                    return (
                      <div 
                        key={idx}
                        className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-white shadow-xs transition-all"
                      >
                        <button
                          onClick={() => setExpandedFixIndex(isExpanded ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                              #{idx + 1}
                            </span>
                            <div>
                              <p className="font-display font-bold text-xs sm:text-sm text-slate-900">
                                {fix.parameter}: <span className="text-[#2563EB] font-semibold">{fix.action}</span>
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
                          <div className="p-4 sm:p-5 bg-slate-900 text-slate-100 border-t border-slate-700 space-y-3 font-mono text-xs leading-relaxed animate-in fade-in duration-200">
                            <div>
                              <p className="text-[10px] text-[#38BDF8] uppercase font-bold tracking-wider mb-1">
                                Engineering Protocol &amp; Rationale:
                              </p>
                              <p className="text-slate-200">{fix.detail}</p>
                            </div>

                            {/* Verification Loop Protocol */}
                            {fix.testProtocol && (
                              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-slate-500 block text-[9px] uppercase">1. Baseline:</span>
                                  <span className="text-slate-300 font-bold">{fix.testProtocol.baseline}</span>
                                </div>
                                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-[#38BDF8] block text-[9px] uppercase">2. Test Target:</span>
                                  <span className="text-white font-bold">{fix.testProtocol.target}</span>
                                </div>
                                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-emerald-400 block text-[9px] uppercase">3. Expected Result:</span>
                                  <span className="text-emerald-300">{fix.testProtocol.expected}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ─── TOOLING & TOOL DESIGN PREVENTION TIP (CLEAN BLUE-50) ─── */}
              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#1E40AF] uppercase tracking-wider">
                  <Cog className="w-4 h-4 text-[#2563EB]" /> Tooling &amp; Mould Design Prevention Note
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-sans font-medium text-slate-800">
                  {currentDefect.preventionTip}
                </p>
              </div>

              {/* Literature Citation & Direct AI Context Handoff */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-400">
                  📚 <strong className="text-slate-600">Literature Source:</strong> {currentDefect.source}
                </span>
                <Link
                  href={`/ai-tutor?prompt=${encodeURIComponent(`Teach me how to eliminate ${currentDefect.name} in ${currentProcessData.label} following Rosato and Allen & Baker engineering guidelines.`)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-bold transition-colors"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Ask AI Copilot about this defect &rarr;</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
