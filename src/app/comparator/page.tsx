'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, RotateCcw, ChevronDown, BookOpen, Brain } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

type PolymerType = 'commodity' | 'engineering' | 'specialty' | 'elastomer' | 'bioplastic'

type Polymer = {
  id: string
  name: string
  abbr: string
  family: string
  type: PolymerType
  color: string
  bg: string
  properties: Record<string, string>
}

const TYPE_CONFIG: Record<PolymerType, { label: string; color: string; bg: string }> = {
  commodity:   { label: 'Commodity',    color: '#1D4ED8', bg: '#EFF6FF' },
  engineering: { label: 'Engineering',  color: '#EA580C', bg: '#FFF7ED' },
  specialty:   { label: 'Specialty',    color: '#7C3AED', bg: '#F5F3FF' },
  elastomer:   { label: 'Elastomer',    color: '#15803D', bg: '#F0FDF4' },
  bioplastic:  { label: 'Bioplastic',   color: '#15803D', bg: '#F0FDF4' },
}

const POLYMERS: Polymer[] = [
  { id: 'pp', name: 'Polypropylene', abbr: 'PP', family: 'Polyolefin', type: 'commodity', color: '#1D4ED8', bg: '#EFF6FF',
    properties: { density: '0.90–0.91 g/cm³', tg: '−10°C to 0°C', tm: '160–170°C', tensile: '30–40 MPa', modulus: '1,200–1,700 MPa', elongation: '100–600%', impact: '20–80 J/m', hdt: '55–65°C (0.45 MPa)', mfi: '0.5–35 g/10min', processing: '200–280°C', shrinkage: '1.0–2.5%', water: '<0.02%', flammability: 'HB', chemical: 'Excellent to acids/alkalis; Poor to solvents', applications: 'Woven sacks, pipes, crates, automotive, packaging', india: 'Reliance (Repol), GAIL, Haldia Petrochemicals' }},
  { id: 'hdpe', name: 'High-Density Polyethylene', abbr: 'HDPE', family: 'Polyolefin', type: 'commodity', color: '#1D4ED8', bg: '#EFF6FF',
    properties: { density: '0.94–0.97 g/cm³', tg: '−120°C', tm: '125–135°C', tensile: '25–35 MPa', modulus: '800–1,200 MPa', elongation: '300–800%', impact: '40–100 J/m', hdt: '60–80°C (0.45 MPa)', mfi: '0.05–80 g/10min', processing: '160–280°C', shrinkage: '1.5–3.5%', water: '<0.01%', flammability: 'HB', chemical: 'Excellent to most chemicals', applications: 'Water pipes, fuel tanks, containers, geomembranes', india: 'Reliance (Relene), GAIL, Haldia Petrochemicals' }},
  { id: 'ldpe', name: 'Low-Density Polyethylene', abbr: 'LDPE', family: 'Polyolefin', type: 'commodity', color: '#1D4ED8', bg: '#EFF6FF',
    properties: { density: '0.91–0.94 g/cm³', tg: '−120°C', tm: '105–115°C', tensile: '8–20 MPa', modulus: '150–400 MPa', elongation: '300–700%', impact: 'No break', hdt: '40–50°C (0.45 MPa)', mfi: '0.2–80 g/10min', processing: '160–240°C', shrinkage: '1.5–5.0%', water: '<0.01%', flammability: 'HB', chemical: 'Good to most chemicals', applications: 'Flexible films, bubble wrap, squeeze bottles, coatings', india: 'Reliance (Relene LD), ONGC Petro Additions' }},
  { id: 'pvc', name: 'Polyvinyl Chloride', abbr: 'PVC', family: 'Vinyl Polymer', type: 'commodity', color: '#1D4ED8', bg: '#EFF6FF',
    properties: { density: '1.35–1.45 g/cm³', tg: '80–85°C (rigid)', tm: 'None (amorphous)', tensile: '40–55 MPa (rigid)', modulus: '2,400–4,200 MPa', elongation: '2–80% (rigid)', impact: '20–80 J/m', hdt: '60–80°C (0.45 MPa)', mfi: 'K-value 57–80', processing: '160–200°C', shrinkage: '0.2–0.6%', water: '0.04–0.4%', flammability: 'V-0 (self-extinguishing)', chemical: 'Excellent to acids/alkalis; Poor to ketones', applications: 'Pipes, window profiles, cable sheathing, flooring', india: 'Finolex Industries, Chemplast Sanmar' }},
  { id: 'abs', name: 'Acrylonitrile Butadiene Styrene', abbr: 'ABS', family: 'Styrenic Copolymer', type: 'engineering', color: '#EA580C', bg: '#FFF7ED',
    properties: { density: '1.03–1.06 g/cm³', tg: '100–125°C', tm: 'None (amorphous)', tensile: '35–50 MPa', modulus: '2,000–2,800 MPa', elongation: '10–50%', impact: '100–400 J/m', hdt: '80–100°C (0.45 MPa)', mfi: '1–30 g/10min', processing: '200–250°C', shrinkage: '0.4–0.8%', water: '0.20–0.35%', flammability: 'HB–V-2', chemical: 'Good to dilute acids; Poor to ketones/esters', applications: 'Dashboards, electronic housings, appliances, LEGO', india: 'INEOS Styrolution India, LG Chem India' }},
  { id: 'pc', name: 'Polycarbonate', abbr: 'PC', family: 'Polyester Carbonate', type: 'engineering', color: '#EA580C', bg: '#FFF7ED',
    properties: { density: '1.20–1.22 g/cm³', tg: '145–150°C', tm: 'None (amorphous)', tensile: '55–70 MPa', modulus: '2,200–2,500 MPa', elongation: '80–150%', impact: '600–900 J/m', hdt: '130–140°C (0.45 MPa)', mfi: '2–30 g/10min', processing: '270–320°C', shrinkage: '0.5–0.7%', water: '0.15–0.35%', flammability: 'V-2 to V-0', chemical: 'Good to dilute acids; Poor to alkalis/ketones', applications: 'Safety helmets, optical discs, medical devices, glazing', india: 'SABIC India, Covestro India' }},
  { id: 'nylon6', name: 'Nylon 6 (Polyamide 6)', abbr: 'PA6', family: 'Polyamide', type: 'engineering', color: '#EA580C', bg: '#FFF7ED',
    properties: { density: '1.12–1.15 g/cm³', tg: '40–60°C', tm: '215–225°C', tensile: '70–85 MPa (dry)', modulus: '2,600–3,200 MPa', elongation: '30–100%', impact: '40–80 J/m (dry)', hdt: '60–70°C (dry)', mfi: '5–80 g/10min', processing: '230–290°C', shrinkage: '0.5–2.0%', water: '2.5–3.5% (equilibrium)', flammability: 'V-2', chemical: 'Excellent to hydrocarbons; Poor to strong acids', applications: 'Gears, bearings, cable ties, tyre cord, sportswear', india: 'SRF Limited, GSFC, BASF India' }},
  { id: 'pet', name: 'Polyethylene Terephthalate', abbr: 'PET', family: 'Polyester', type: 'engineering', color: '#EA580C', bg: '#FFF7ED',
    properties: { density: '1.33–1.40 g/cm³', tg: '75–80°C', tm: '245–265°C', tensile: '55–75 MPa', modulus: '2,700–3,500 MPa', elongation: '50–300%', impact: '35–60 J/m', hdt: '65–75°C (amorphous)', mfi: 'IV 0.55–0.85 dL/g', processing: '270–290°C', shrinkage: '0.2–0.4%', water: '0.10–0.20%', flammability: 'HB–V-2', chemical: 'Good to dilute acids; Poor to alkalis', applications: 'Water bottles, PET film, tyre cord, polyester fibre', india: 'JBF Industries, Reliance (PET), Indorama' }},
  { id: 'peek', name: 'Polyether Ether Ketone', abbr: 'PEEK', family: 'Polyaryletherketone', type: 'specialty', color: '#7C3AED', bg: '#F5F3FF',
    properties: { density: '1.30–1.32 g/cm³', tg: '143°C', tm: '343°C', tensile: '100 MPa (unfilled)', modulus: '3,600–4,000 MPa', elongation: '30–50%', impact: '55–85 J/m', hdt: '160°C (0.45 MPa)', mfi: '3–20 g/10min', processing: '370–400°C', shrinkage: '1.0–1.5%', water: '0.10–0.50%', flammability: 'V-0', chemical: 'Outstanding — resists virtually all chemicals', applications: 'Aerospace, medical implants, semiconductor, oil & gas', india: 'Victrex (supply), specialty distributors' }},
  { id: 'ptfe', name: 'Polytetrafluoroethylene', abbr: 'PTFE', family: 'Fluoropolymer', type: 'specialty', color: '#7C3AED', bg: '#F5F3FF',
    properties: { density: '2.10–2.20 g/cm³', tg: '−120°C', tm: '325–335°C', tensile: '20–35 MPa', modulus: '400–600 MPa', elongation: '200–400%', impact: '160 J/m', hdt: '55°C (0.45 MPa)', mfi: 'Not injection mouldable', processing: '370–385°C (sintering)', shrinkage: '3–6%', water: '<0.01%', flammability: 'V-0 (non-flammable)', chemical: 'Outstanding — virtually all chemicals', applications: 'Non-stick coatings, chemical seals, lab equipment', india: 'Gujarat Fluorochemicals (PTFE producer)' }},
  { id: 'nr', name: 'Natural Rubber', abbr: 'NR', family: 'Natural Elastomer', type: 'elastomer', color: '#15803D', bg: '#F0FDF4',
    properties: { density: '0.91–0.93 g/cm³', tg: '−70°C', tm: '36°C (strain crystallization)', tensile: '20–35 MPa', modulus: 'Shore A 30–80', elongation: '500–800%', impact: 'No break', hdt: 'Softens above 60°C', mfi: 'Mooney ML(1+4) 50–80', processing: 'Vulcanization: 140–180°C', shrinkage: 'N/A', water: '0.1–1.0%', flammability: 'HB', chemical: 'Poor to oils/fuels; Good to dilute acids', applications: 'Tyres, conveyor belts, latex gloves, seals', india: 'MRF, Apollo Tyres, CEAT, Rubfila' }},
  { id: 'epdm', name: 'EPDM Rubber', abbr: 'EPDM', family: 'Synthetic Elastomer', type: 'elastomer', color: '#15803D', bg: '#F0FDF4',
    properties: { density: '0.85–0.90 g/cm³', tg: '−50 to −65°C', tm: 'None', tensile: '10–20 MPa', modulus: 'Shore A 40–90', elongation: '200–500%', impact: 'Very high', hdt: 'Use range: −50 to +150°C', mfi: 'Mooney viscosity characterized', processing: 'Vulcanization: 160–180°C', shrinkage: 'N/A', water: '<0.1%', flammability: 'HB', chemical: 'Excellent weathering/ozone; Poor to oils', applications: 'Weatherstripping, roofing membranes, radiator hoses', india: 'Lanxess India, Motherson Sumi' }},
  { id: 'pla', name: 'Polylactic Acid', abbr: 'PLA', family: 'Biopolyester', type: 'bioplastic', color: '#15803D', bg: '#F0FDF4',
    properties: { density: '1.21–1.25 g/cm³', tg: '55–65°C', tm: '150–175°C', tensile: '50–70 MPa', modulus: '3,200–4,000 MPa', elongation: '2–10%', impact: '15–30 J/m', hdt: '50–55°C (0.45 MPa)', mfi: '3–30 g/10min', processing: '180–220°C', shrinkage: '0.3–0.5%', water: '0.3–0.5%', flammability: 'V-2', chemical: 'Good to organic solvents; Poor to alkalis', applications: 'Compostable packaging, cutlery, 3D printing filament', india: 'Ecogreen Bioplastics, Compostable India' }},
]

const COMPARE_PROPS = [
  { key: 'density',     label: 'Density',              icon: '⚖️',  highlight: false },
  { key: 'tg',         label: 'Glass Transition (Tg)', icon: '🌡️',  highlight: true },
  { key: 'tm',         label: 'Melting Point (Tm)',    icon: '🔥',  highlight: true },
  { key: 'tensile',    label: 'Tensile Strength',      icon: '💪',  highlight: true },
  { key: 'modulus',    label: 'Flexural Modulus',      icon: '📐',  highlight: false },
  { key: 'elongation', label: 'Elongation at Break',   icon: '↔️',  highlight: false },
  { key: 'impact',     label: 'Izod Impact',           icon: '🛡️',  highlight: false },
  { key: 'hdt',        label: 'Heat Deflection Temp',  icon: '♨️',  highlight: true },
  { key: 'mfi',        label: 'MFI / Flow Rate',       icon: '🌊',  highlight: false },
  { key: 'processing', label: 'Processing Temp',       icon: '⚙️',  highlight: false },
  { key: 'shrinkage',  label: 'Moulding Shrinkage',    icon: '📏',  highlight: false },
  { key: 'water',      label: 'Water Absorption',      icon: '💧',  highlight: false },
  { key: 'flammability',label: 'Flammability',         icon: '🔥',  highlight: false },
  { key: 'chemical',   label: 'Chemical Resistance',   icon: '🧪',  highlight: false },
  { key: 'applications',label: 'Applications',         icon: '🏭',  highlight: false },
  { key: 'india',      label: 'Indian Industry',       icon: '🇮🇳', highlight: false },
]

// ─── Polymer Selector ─────────────────────────────────────────────────────────

function PolymerSelector({ label, selected, onChange, exclude }: {
  label: string; selected: Polymer | null
  onChange: (p: Polymer) => void; exclude: string | null
}) {
  const [open, setOpen] = useState(false)
  const types: PolymerType[] = ['commodity', 'engineering', 'specialty', 'elastomer', 'bioplastic']

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left border-2 border-ink overflow-hidden transition-all"
        style={{
          boxShadow: selected ? `2px 2px 0px 0px ${selected.color}` : '2px 2px 0px 0px #1A1C20',
        }}
      >
        {selected ? (
          <div className="flex items-center gap-0">
            <div className="w-16 h-16 border-r-2 border-ink flex items-center justify-center flex-shrink-0 font-mono font-black text-sm text-white" style={{ backgroundColor: selected.color }}>
              {selected.abbr}
            </div>
            <div className="px-4 flex-1 bg-canvas">
              <div className="font-display text-base font-black text-ink">{selected.name}</div>
              <div className="font-mono text-[10px] text-ink/50">{selected.family}</div>
            </div>
            <div className="px-4 font-mono text-[10px] text-ink/40 border-l-2 border-ink h-16 flex items-center">Change ▾</div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-5 bg-canvas">
            <div className="w-10 h-10 border-2 border-ink flex items-center justify-center">
              <Scale className="w-5 h-5 text-ink/40" />
            </div>
            <div>
              <div className="font-display text-base font-black text-ink">{label}</div>
              <div className="font-mono text-[10px] text-ink/40 uppercase tracking-wider">Click to select polymer</div>
            </div>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-30 border-2 border-ink bg-canvas mt-1 max-h-80 overflow-y-auto shadow-hard-lg">
          {types.map((type) => {
            const tc = TYPE_CONFIG[type]
            const group = POLYMERS.filter((p) => p.type === type && p.id !== exclude)
            if (!group.length) return null
            return (
              <div key={type}>
                <div className="px-4 py-2 border-b-2 border-ink/10 font-mono text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: tc.bg, color: tc.color }}>
                  {tc.label}
                </div>
                {group.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onChange(p); setOpen(false) }}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 border-b-2 border-ink/10 hover:bg-ink hover:text-white group transition-colors"
                  >
                    <div className="w-8 h-8 border-2 border-ink flex items-center justify-center font-mono text-[10px] font-black flex-shrink-0 text-white" style={{ backgroundColor: p.color }}>
                      {p.abbr}
                    </div>
                    <div>
                      <div className="font-bold text-sm group-hover:text-white">{p.name}</div>
                      <div className="font-mono text-[9px] text-ink/40 group-hover:text-white/50">{p.family}</div>
                    </div>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComparatorPage() {
  const [polyA, setPolyA] = useState<Polymer | null>(null)
  const [polyB, setPolyB] = useState<Polymer | null>(null)
  const [showAll, setShowAll] = useState(false)

  const reset = () => { setPolyA(null); setPolyB(null); setShowAll(false) }
  const canCompare = polyA && polyB
  const visibleProps = showAll ? COMPARE_PROPS : COMPARE_PROPS.filter((p) => p.highlight)

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-blue" />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 md:py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue border-2 border-blue flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Property Comparator</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
              COMPARE ANY TWO<br />
              <span className="text-yellow-bright italic">POLYMERS</span> — 16 PROPERTIES
            </h1>
            <p className="text-white/60 max-w-lg text-sm leading-relaxed">
              Property data from Brandrup Polymer Handbook + Chanda Plastics Technology Handbook. 13 polymers across 5 categories.
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-mono text-4xl font-black text-yellow-bright">13</div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Polymers available</div>
            <div className="font-mono text-4xl font-black text-yellow-bright mt-2">16</div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Properties each</div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <PolymerSelector label="Select Polymer A" selected={polyA} onChange={setPolyA} exclude={polyB?.id ?? null} />
          <PolymerSelector label="Select Polymer B" selected={polyB} onChange={setPolyB} exclude={polyA?.id ?? null} />
        </div>

        {/* Controls */}
        {canCompare && (
          <div className="flex items-center justify-between mb-5 border-b-4 border-ink pb-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="cn-btn-black text-xs py-2 px-4"
            >
              {showAll ? 'Show Key Properties Only' : 'Show All 16 Properties'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={reset} className="border-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink hover:text-white transition-colors flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        )}

        {/* Comparison table */}
        {canCompare ? (
          <div className="space-y-2 animate-fade-up">

            {/* Header row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div />
              {[polyA, polyB].map((poly) => (
                <div key={poly!.id} className="border-2 border-ink overflow-hidden" style={{ boxShadow: `2px 2px 0px 0px ${poly!.color}` }}>
                  <div className="border-b-2 border-ink p-3 text-center text-white font-mono font-black text-xl" style={{ backgroundColor: poly!.color }}>
                    {poly!.abbr}
                  </div>
                  <div className="p-3 text-center bg-canvas">
                    <div className="font-display text-sm font-black text-ink leading-tight">{poly!.name}</div>
                    <div className="font-mono text-[9px] text-ink/50 mt-0.5">{poly!.family}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Property rows */}
            {visibleProps.map((prop) => (
              <div key={prop.key} className={`grid grid-cols-3 gap-3 ${prop.highlight ? 'ring-2 ring-yellow-bright' : ''}`}>
                {/* Label */}
                <div
                  className="border-2 border-ink px-3 py-3 flex items-center gap-2"
                  style={{ backgroundColor: prop.highlight ? '#FEFCE8' : '#F9FAFB' }}
                >
                  <span className="text-base flex-shrink-0">{prop.icon}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-wider leading-tight ${prop.highlight ? 'font-black text-yellow' : 'text-ink/60'}`} style={{ color: prop.highlight ? '#CA8A04' : undefined }}>
                    {prop.label}
                  </span>
                </div>

                {/* Values */}
                {[polyA, polyB].map((poly) => (
                  <div
                    key={poly!.id}
                    className="border-2 border-ink px-3 py-3 flex items-center bg-canvas"
                    style={{ borderColor: prop.highlight ? poly!.color : 'var(--border)' }}
                  >
                    <p className="text-sm text-ink leading-relaxed">{poly!.properties[prop.key]}</p>
                  </div>
                ))}
              </div>
            ))}

            <p className="font-mono text-[9px] text-ink/40 pt-3 uppercase tracking-wider">
              Source: Brandrup, Immergut and Grulke — Polymer Handbook · Chanda — Plastics Technology Handbook
            </p>
          </div>
        ) : (
          <div className="border-2 border-ink p-12 text-center shadow-hard">
            <div className="w-16 h-16 border-2 border-ink mx-auto mb-5 flex items-center justify-center">
              <Scale className="w-8 h-8 text-ink/30" />
            </div>
            <div className="font-display text-2xl font-black text-ink mb-2">Select Two Polymers to Compare</div>
            <p className="font-mono text-xs text-ink/50 uppercase tracking-wider">13 materials · 16 properties each · Brandrup Handbook data</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <section className="border-t-4 border-ink bg-blue px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Learn the science behind the numbers</div>
            <h3 className="font-display text-2xl font-black text-white">Understand why properties differ</h3>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/subjects/polymer-chemistry" className="cn-btn bg-white text-blue border-white text-sm">
              <BookOpen className="w-4 h-4" /> Polymer Chemistry
            </Link>
            <Link href="/ai-tutor" className="cn-btn bg-yellow-bright text-ink border-yellow-bright text-sm">
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}