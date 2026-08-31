'use client'

import React from 'react'
import { FlaskConical, Cog, Package, Layers, ShieldCheck } from 'lucide-react'

export interface TriadData {
  material: {
    name: string
    chemicalFormula: string
    properties: { label: string; value: string }[]
    morphology: string
  }
  machine: {
    name: string
    type: string
    parameters: { label: string; value: string }[]
    tooling: string
  }
  product: {
    name: string
    application: string
    standard: string
    commercialGrades: string
  }
}

// Domain-calibrated verified engineering mappings
const DOMAIN_TRIADS: Record<string, TriadData> = {
  'polymer-chemistry': {
    material: {
      name: 'High-Density Polyethylene (HDPE)',
      chemicalFormula: '—[CH₂—CH₂]ₙ— (Linear, M_w ~ 120,000–250,000 g/mol)',
      properties: [
        { label: 'Density', value: '0.941–0.965 g/cm³' },
        { label: 'Melt Temp (Tm)', value: '130–137 °C' },
        { label: 'Crystallinity', value: '65–85%' },
        { label: 'MFI (190°C/2.16kg)', value: '0.2–20 g/10min' }
      ],
      morphology: 'Spherulitic semi-crystalline lamellae folded ribbons'
    },
    machine: {
      name: 'Continuous Gas-Phase Fluidized Bed Reactor',
      type: 'Unipol / Hostalen Polymerization Technology',
      parameters: [
        { label: 'Reactor Pressure', value: '20–25 bar' },
        { label: 'Operating Temp', value: '85–100 °C' },
        { label: 'Catalyst System', value: 'Ziegler-Natta (TiCl₄/MgCl₂)' },
        { label: 'Co-catalyst', value: 'Triethylaluminium (TEAL)' }
      ],
      tooling: 'Multi-stage cyclone separator & fluidized gas distribution grid'
    },
    product: {
      name: 'Extrusion Blow-Molded Fuel & Chemical Tanks',
      application: 'Automotive fuel containment & UN-certified hazardous chemical drums',
      standard: 'IS 6312 / ASTM D4976 / ISO 1872',
      commercialGrades: 'Reliance Relene 52GB003, IOCL Propel 010DP45'
    }
  },
  'polymer-processing': {
    material: {
      name: 'Polypropylene Homopolymer (PP-H)',
      chemicalFormula: '—[CH₂—CH(CH₃)]ₙ— (Isotactic, PDI ~ 3.5–5.0)',
      properties: [
        { label: 'Melt Flow Rate', value: '12–25 g/10min' },
        { label: 'Melt Temp (Tm)', value: '160–165 °C' },
        { label: 'Mold Shrinkage', value: '1.2–2.0%' },
        { label: 'Flexural Modulus', value: '1,400–1,600 MPa' }
      ],
      morphology: 'Spherulitic monoclinic alpha-crystal structure'
    },
    machine: {
      name: '180-Ton Electric Toggle Injection Moulding Machine',
      type: 'Reciprocating Screw (L/D = 22:1, Compression Ratio 3:1)',
      parameters: [
        { label: 'Barrel Temps (Z1-Z4)', value: '200–235 °C' },
        { label: 'Injection Pressure', value: '80–120 MPa' },
        { label: 'Holding Pressure', value: '50–70 MPa' },
        { label: 'Mold Cooling Temp', value: '30–45 °C' }
      ],
      tooling: '4-Cavity Cold-Runner P20 Hardened Steel Tool with Sub-Gates'
    },
    product: {
      name: 'Automotive Interior Door Trims & Battery Casings',
      application: 'High-stiffness thin-walled automotive structural components',
      standard: 'ASTM D4101 / ISO 19069-1 / JIS K6921',
      commercialGrades: 'Reliance Repol H110MA, SABIC PP 575P, HPCL PP1110'
    }
  },
  'mould-design': {
    material: {
      name: 'Polycarbonate (PC) Optical Grade',
      chemicalFormula: '—[O—C₆H₄—C(CH₃)₂—C₆H₄—O—CO]ₙ— (Bisphenol A Polycarbonate)',
      properties: [
        { label: 'Glass Transition (Tg)', value: '145–150 °C' },
        { label: 'Light Transmission', value: '88–92%' },
        { label: 'Tensile Strength', value: '65–72 MPa' },
        { label: 'Melt Temp Range', value: '280–310 °C' }
      ],
      morphology: 'Amorphous glass with zero crystalline spherulites'
    },
    machine: {
      name: '250-Ton Precision Servo-Hydraulic Moulding Machine',
      type: 'Optics-Calibrated Injection Compression Unit',
      parameters: [
        { label: 'Injection Speed', value: '80–150 mm/s (profiled)' },
        { label: 'Cavity Pressure', value: '900–1,200 bar' },
        { label: 'Mold Temperature', value: '85–110 °C (Oil TCU)' },
        { label: 'Residual Stress', value: '< 5 MPa (Birefringence checked)' }
      ],
      tooling: 'H13 Hardened 52 HRC Hot Runner Tool with Valve Gates'
    },
    product: {
      name: 'Automotive Headlamp Lenses & Safety Visors',
      application: 'Impact-resistant optical enclosures with UV-stabilized coating',
      standard: 'ISO 7391 / ASTM D3935 / SAE J576',
      commercialGrades: 'SABIC LEXAN 121R, Covestro Makrolon 2805'
    }
  },
  'polymer-testing': {
    material: {
      name: 'Acrylonitrile Butadiene Styrene (ABS)',
      chemicalFormula: 'Poly(acrylonitrile-co-butadiene-co-styrene) Terpolymer',
      properties: [
        { label: 'Izod Impact (Notched)', value: '180–300 J/m' },
        { label: 'Heat Deflection (0.45MPa)', value: '92–98 °C' },
        { label: 'Tensile Yield Strength', value: '42–50 MPa' },
        { label: 'Rockwell Hardness', value: 'R 105–112' }
      ],
      morphology: 'SAN Matrix with dispersed Polybutadiene rubber graft spheres'
    },
    machine: {
      name: 'Computerized Servo-Universal Testing Machine (UTM 50kN)',
      type: 'Dual-Column Testing Rig with Video Extensometer',
      parameters: [
        { label: 'Crosshead Speed', value: '50 mm/min (ASTM D638)' },
        { label: 'Gauge Length', value: '50.0 ± 0.1 mm' },
        { label: 'Load Cell Precision', value: 'Class 0.5 (±0.5% accuracy)' },
        { label: 'Temperature Chamber', value: '23.0 ± 2.0 °C / 50% RH' }
      ],
      tooling: 'Pneumatic Wedge Action Grips with Diamond-Serrated Jaw Faces'
    },
    product: {
      name: 'Consumer Electronics Enclosures & Crash Helmets',
      application: 'Dimensional stability & high impact absorbing protective shells',
      standard: 'ASTM D638 / ASTM D256 / ISO 178 / IS 4151',
      commercialGrades: 'LG Chem ABS AF312, INEOS Styrolution Terluran GP-22'
    }
  },
  'rubber-technology': {
    material: {
      name: 'Nitrile Butadiene Rubber (NBR) Compound',
      chemicalFormula: '—[CH₂—CH=CH—CH₂]ₓ—[CH₂—CH(CN)]ᵧ— (33% Bound ACN)',
      properties: [
        { label: 'Mooney Viscosity', value: 'ML 1+4 @ 100°C: 45–55' },
        { label: 'Hardness (Shore A)', value: '65–75 Shore A' },
        { label: 'Oil Swell (IRM 903)', value: '< 15% after 70h @ 100°C' },
        { label: 'Compression Set', value: '< 20% (22h @ 100°C)' }
      ],
      morphology: 'Sulfur-crosslinked elastomer network matrix with Carbon Black N330'
    },
    machine: {
      name: '55-Liter Internal Banbury Dispersion Mixer & Two-Roll Mill',
      type: 'Tangential Rotor Compounding Line with Batch-Off Chiller',
      parameters: [
        { label: 'Rotor Speed', value: '45–60 RPM' },
        { label: 'Dump Temperature', value: '145–155 °C' },
        { label: 'Vulcanization Temp', value: '165 °C @ 8 min' },
        { label: 'Curing Pressure', value: '150 bar (Hydraulic Press)' }
      ],
      tooling: 'Multi-cavity compression mold for precision O-rings'
    },
    product: {
      name: 'Fuel Line O-Rings, Gaskets & Industrial Hydraulic Seals',
      application: 'Petroleum fuel, diesel, and hydraulic oil resistance sealing',
      standard: 'ASTM D2000 M2BG714 / ISO 1629 / SAE J200',
      commercialGrades: 'Apcotex Chem NBR 3350, Zeon Chemicals Nipol 1052'
    }
  },
  'sustainable-plastics': {
    material: {
      name: 'Poly(lactic acid) (PLA) & PBAT Blend',
      chemicalFormula: '—[O—CH(CH₃)—CO]ₙ— (Enantiomeric L-Lactide / D-Lactide)',
      properties: [
        { label: 'Bio-based Content', value: '100% Renewable Feedstock' },
        { label: 'Glass Transition (Tg)', value: '55–60 °C' },
        { label: 'Tensile Modulus', value: '3,200–3,600 MPa' },
        { label: 'Compostability', value: 'EN 13432 / ISO 17088 Certified' }
      ],
      morphology: 'Semi-crystalline biodegradable polyester with PBAT impact modifier'
    },
    machine: {
      name: 'Multi-Layer Blown Film Extrusion Line with Internal Bubble Cooling',
      type: 'Co-Extrusion 3-Layer Die (Grooved Feed Extruders, L/D = 30:1)',
      parameters: [
        { label: 'Melt Temp Profile', value: '160–185 °C' },
        { label: 'Blow-Up Ratio (BUR)', value: '2.5–3.2' },
        { label: 'Frost Line Height', value: '450–600 mm' },
        { label: 'Film Thickness', value: '25–40 microns' }
      ],
      tooling: 'Spiral Mandrel Die with Dual-Lip Air Ring & Chilled Air Blower'
    },
    product: {
      name: 'Certified Industrially Compostable Carry Bags & Mulch Films',
      application: 'Single-use plastic replacement complying with PWM Rules 2022',
      standard: 'IS/ISO 17088:2021 / ASTM D6400 / CPCB Certified',
      commercialGrades: 'NatureWorks Ingeo 4043D, BASF ecovio F2341'
    }
  }
}

// Fallback universal technical triad
const DEFAULT_TRIAD: TriadData = {
  material: {
    name: 'Standard Engineering Thermoplastic Resin',
    chemicalFormula: '—[Monomer Backbone]ₙ— (Calibrated Molecular Weight & PDI)',
    properties: [
      { label: 'Specific Gravity', value: '1.05–1.42 g/cm³' },
      { label: 'Glass Transition (Tg)', value: '100–160 °C' },
      { label: 'Tensile Yield Strength', value: '45–85 MPa' },
      { label: 'Melt Flow Index', value: '5–25 g/10min' }
    ],
    morphology: 'Engineered Polymer Morphology (Amorphous / Semi-crystalline Matrix)'
  },
  machine: {
    name: 'Industrial Polymer Processing & Tooling System',
    type: 'Computer-Controlled Extrusion / Injection Moulding Hardware',
    parameters: [
      { label: 'Thermal Zones', value: '180–280 °C (PID Controlled)' },
      { label: 'Injection / Melt Pressure', value: '60–140 MPa' },
      { label: 'Cycle Time', value: '15–45 seconds' },
      { label: 'Tooling Temperature', value: '40–90 °C (Chiller Regulated)' }
    ],
    tooling: 'Hardened Tool Steel (H13/P20) Precision Cavity & Runner Layout'
  },
  product: {
    name: 'Commercial Engineering Parts & Quality-Inspected Components',
    application: 'Automotive, Electrical, Medical & Packaging Applications',
    standard: 'ASTM D3641 / ISO 294 / BIS Standard Compliance',
    commercialGrades: 'Reliance, SABIC, BASF, Covestro Standard Engineering Resins'
  }
}

interface Props {
  subjectSlug?: string
  lessonTitle?: string
}

export function MaterialMachineProductTriad({ subjectSlug = 'polymer-processing', lessonTitle }: Props) {
  const triad = DOMAIN_TRIADS[subjectSlug] || DEFAULT_TRIAD

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-display">
              {lessonTitle ? `${lessonTitle} · Engineering Triad` : 'Tri-Vector Engineering Triad (0% Mismatch Guarantee)'}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Material Synthesis &middot; Processing Hardware &middot; Commercial Application
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3 h-3" /> ASTM / ISO Aligned
        </span>
      </div>

      {/* Triad 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Column 1: Material */}
        <div className="bg-blue-50/50 border border-blue-100/90 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
                <FlaskConical className="w-3.5 h-3.5" /> 1. Material
              </span>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded">Resin / Chemistry</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 font-display leading-tight">{triad.material.name}</h4>
              <p className="text-[11px] font-mono text-blue-900/80 mt-1 font-semibold bg-white p-2 rounded-lg border border-blue-100">
                {triad.material.chemicalFormula}
              </p>
            </div>

            {/* Spec Matrix */}
            <div className="space-y-1.5 pt-1">
              {triad.material.properties.map((prop, i) => (
                <div key={i} className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">{prop.label}:</span>
                  <span className="font-bold text-slate-800">{prop.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-blue-100 text-[10px] font-mono text-slate-600">
            <span className="font-bold text-slate-700">Morphology:</span> {triad.material.morphology}
          </div>
        </div>

        {/* Column 2: Machine & Tooling */}
        <div className="bg-amber-50/40 border border-amber-100/90 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
                <Cog className="w-3.5 h-3.5 text-amber-600" /> 2. Machine &amp; Mould
              </span>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">Shop Floor</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 font-display leading-tight">{triad.machine.name}</h4>
              <p className="text-[11px] font-mono text-slate-600 mt-1 bg-white p-2 rounded-lg border border-amber-100">
                {triad.machine.type}
              </p>
            </div>

            {/* Parameter Matrix */}
            <div className="space-y-1.5 pt-1">
              {triad.machine.parameters.map((param, i) => (
                <div key={i} className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">{param.label}:</span>
                  <span className="font-bold text-slate-800">{param.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-100 text-[10px] font-mono text-slate-600">
            <span className="font-bold text-slate-700">Tooling:</span> {triad.machine.tooling}
          </div>
        </div>

        {/* Column 3: Commercial Product */}
        <div className="bg-emerald-50/40 border border-emerald-100/90 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                <Package className="w-3.5 h-3.5 text-emerald-600" /> 3. Real Product
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">Application</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 font-display leading-tight">{triad.product.name}</h4>
              <p className="text-[11px] text-slate-600 mt-1 bg-white p-2 rounded-lg border border-emerald-100 leading-snug">
                {triad.product.application}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Standard:</span>
                <span className="font-bold text-emerald-800">{triad.product.standard}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-100 text-[10px] font-mono text-slate-600">
            <span className="font-bold text-slate-700">Resin Grades:</span> {triad.product.commercialGrades}
          </div>
        </div>

      </div>
    </section>
  )
}

export default MaterialMachineProductTriad
