'use client'

import React from 'react'

// ─── 1. ROMP Mechanism (Ring-Opening Metathesis Polymerization) ───────────────
export function ROMPMechanismSVG({ title = 'Ring-Opening Metathesis Polymerization (ROMP) Mechanism' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 700 240" className="w-full h-auto font-sans">
        <rect width="700" height="240" fill="#F8FAFC" rx="12" />
        
        {/* Step 1: Norbornene Monomer + Grubbs Catalyst */}
        <g transform="translate(40, 40)">
          {/* Strained Norbornene Bicyclic Ring */}
          <polygon points="40,30 75,10 110,30 110,80 75,100 40,80" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
          <line x1="75" y1="10" x2="75" y2="100" stroke="#1D4ED8" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="40" y1="45" x2="40" y2="65" stroke="#2563EB" strokeWidth="3.5" />
          <text x="75" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E293B">Strained Norbornene</text>
          <text x="75" y="140" textAnchor="middle" fontSize="9" fill="#64748B">&Delta;G &lt; 0 (Ring Strain Relief)</text>

          {/* Plus symbol */}
          <text x="145" y="65" fontSize="20" fontWeight="bold" fill="#94A3B8">+</text>

          {/* Ruthenium Carbene Complex */}
          <circle cx="205" cy="55" r="26" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <text x="205" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E">[Ru]=CH-R</text>
          <text x="205" y="66" textAnchor="middle" fontSize="8" fill="#B45309">Grubbs Catalyst</text>
        </g>

        {/* Reaction Arrow 1: [2+2] Cycloaddition */}
        <g transform="translate(290, 80)">
          <line x1="0" y1="15" x2="40" y2="15" stroke="#0F172A" strokeWidth="2" />
          <polygon points="40,11 48,15 40,19" fill="#0F172A" />
          <text x="22" y="5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2563EB">[2+2] Addn</text>
        </g>

        {/* Step 2: Metallacyclobutane Intermediate */}
        <g transform="translate(350, 40)">
          <rect x="20" y="25" width="70" height="60" rx="8" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="2" />
          <text x="55" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#581C87">Ruthenacycle</text>
          <text x="55" y="68" textAnchor="middle" fontSize="8" fill="#6B21A8">[Ru]—C₄ Ring</text>
          <text x="55" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E293B">4-Membered Intermediate</text>
        </g>

        {/* Reaction Arrow 2: Ring Opening & Propagation */}
        <g transform="translate(460, 80)">
          <line x1="0" y1="15" x2="40" y2="15" stroke="#0F172A" strokeWidth="2" />
          <polygon points="40,11 48,15 40,19" fill="#0F172A" />
          <text x="22" y="5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#059669">Ring Opening</text>
        </g>

        {/* Step 3: Living Polyalkenamer Chain */}
        <g transform="translate(520, 40)">
          <path d="M 15,55 Q 40,30 65,55 T 115,55" fill="none" stroke="#059669" strokeWidth="3" />
          <line x1="115" y1="55" x2="135" y2="55" stroke="#D97706" strokeWidth="3" />
          <circle cx="145" cy="55" r="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <text x="145" y="59" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400E">[Ru]</text>
          <text x="80" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Living Polyalkenamer</text>
          <text x="80" y="140" textAnchor="middle" fontSize="9" fill="#065F46">PDI &le; 1.05 · Unsaturation in Chain</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Chemically Validated Mechanism: Coordination of olefin to Ruthenium alkylidene followed by [2+2] cycloaddition and cycloreversion to drive living chain growth.
      </figcaption>
    </figure>
  )
}

// ─── 2. GPC Chromatogram (Gel Permeation Chromatography Calibration & MWD) ────
export function GPCChromatogramSVG({ title = 'Gel Permeation Chromatography (GPC / SEC) Molecular Weight Distribution' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-emerald-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 650 320" className="w-full h-auto font-sans">
        <rect width="650" height="320" fill="#FFFFFF" rx="8" />
        
        {/* Grid lines */}
        <g stroke="#F1F5F9" strokeWidth="1">
          {[50, 100, 150, 200, 250].map(y => (
            <line key={y} x1="70" y1={y} x2="580" y2={y} />
          ))}
          {[140, 220, 300, 380, 460, 540].map(x => (
            <line key={x} x1={x} y1="30" x2={x} y2="270" />
          ))}
        </g>

        {/* Axes */}
        <g stroke="#0F172A" strokeWidth="2">
          <line x1="70" y1="270" x2="590" y2="270" />
          <line x1="70" y1="25" x2="70" y2="270" />
        </g>

        {/* Labels */}
        <text x="330" y="302" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letterSpacing="0.5">RETENTION VOLUME Vr (mL) &rarr; DECREASING LOG (MOL WT)</text>
        <text x="25" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" transform="rotate(-90, 25, 150)">DETECTOR SIGNAL (RI / UV)</text>

        {/* GPC Elution Peak (Pore Exclusion: Higher MW elutes first!) */}
        <path
          d="M 120,270 Q 220,265 260,200 Q 310,60 340,60 Q 370,60 410,180 Q 450,265 530,270"
          fill="url(#gpcGradient)"
          stroke="#0D9488"
          strokeWidth="3"
        />

        <defs>
          <linearGradient id="gpcGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Averages markers */}
        {/* Mz: Z-average */}
        <line x1="300" y1="60" x2="300" y2="270" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="300" cy="115" r="4" fill="#7C3AED" />
        <text x="290" y="105" textAnchor="end" fontSize="10" fontWeight="bold" fill="#7C3AED">Mz (High MW)</text>

        {/* Mw: Weight-average */}
        <line x1="340" y1="60" x2="340" y2="270" stroke="#2563EB" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="340" cy="60" r="5" fill="#2563EB" />
        <text x="340" y="45" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2563EB">Mw Peak (Mode)</text>

        {/* Mn: Number-average */}
        <line x1="385" y1="60" x2="385" y2="270" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="385" cy="130" r="4" fill="#D97706" />
        <text x="395" y="125" textAnchor="start" fontSize="10" fontWeight="bold" fill="#D97706">Mn (Colligative)</text>

        {/* Polydispersity Index annotation */}
        <rect x="440" y="40" width="135" height="55" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
        <text x="450" y="58" fontSize="10" fontWeight="bold" fill="#0F172A">Polydispersity (Đ):</text>
        <text x="450" y="74" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#0D9488">Đ = Mw / Mn &ge; 1.0</text>
        <text x="450" y="88" fontSize="8" fill="#64748B">Narrow: 1.05 | Broad: &gt; 3.5</text>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Size Exclusion Chromatography: Porous stationary phase retains smaller hydrodynamic coils longer; high-Mw fractions elute earlier.
      </figcaption>
    </figure>
  )
}

// ─── 3. Extrusion Single Screw Functional Zones ───────────────────────────────
export function ExtrusionScrewZonesSVG({ title = 'Single-Screw Extruder Functional Zones & Compression Ratio' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-orange-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 700 240" className="w-full h-auto font-sans">
        <rect width="700" height="240" fill="#F8FAFC" rx="10" />

        {/* Barrel Housing */}
        <rect x="40" y="50" width="620" height="90" fill="#E2E8F0" stroke="#475569" strokeWidth="2" rx="4" />
        
        {/* Screw Root (Tapered Root in Transition Zone) */}
        {/* Feed Zone Root: Deep (h1) */}
        <polygon points="50,115 230,115 450,130 640,130 640,60 450,60 230,75 50,75" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />

        {/* Screw Flights */}
        {[70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550, 590, 630].map((x, idx) => (
          <line key={idx} x1={x} y1="52" x2={x + 15} y2="138" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        ))}

        {/* Hopper Feed Port */}
        <polygon points="80,20 120,20 105,50 95,50" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
        <text x="100" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0F172A">Resin Hopper</text>

        {/* Breaker Plate / Die */}
        <rect x="655" y="60" width="10" height="70" fill="#0F172A" rx="2" />
        <text x="660" y="148" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0F172A">Die</text>

        {/* Zone Markers & Dimensions */}
        {/* Zone 1: Feed */}
        <line x1="50" y1="160" x2="230" y2="160" stroke="#2563EB" strokeWidth="2" />
        <text x="140" y="178" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563EB">FEED ZONE (Solid Bed)</text>
        <text x="140" y="192" textAnchor="middle" fontSize="9" fill="#64748B">Deep Channel (h_feed) · ~4-8 D</text>

        {/* Zone 2: Compression/Transition */}
        <line x1="230" y1="160" x2="450" y2="160" stroke="#EA580C" strokeWidth="2" />
        <text x="340" y="178" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#EA580C">COMPRESSION ZONE (Melting)</text>
        <text x="340" y="192" textAnchor="middle" fontSize="9" fill="#64748B">Tapered Root · Shear Heating · CR = 2.5:1 to 4:1</text>

        {/* Zone 3: Metering */}
        <line x1="450" y1="160" x2="640" y2="160" stroke="#15803D" strokeWidth="2" />
        <text x="545" y="178" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">METERING ZONE (Pumping)</text>
        <text x="545" y="192" textAnchor="middle" fontSize="9" fill="#64748B">Shallow Channel (h_meter) · Homogenization</text>

        {/* Total L/D annotation */}
        <text x="350" y="222" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#0F172A">
          Standard Indian Industrial Specification: L/D = 24:1 to 32:1 · Flight Pitch &asymp; 1.0 D
        </text>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Extrusion geometry: Progressive compression ratio (CR = h_feed / h_meter) drives trapped air back while plasticating polymer under intense viscous dissipation.
      </figcaption>
    </figure>
  )
}

// ─── 4. Spherulite Morphology & Lamellar Branching ─────────────────────────────
export function SpheruliteMorphologySVG({ title = 'Spherulite Crystalline Morphology under Polarized Light Optical Microscopy' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-indigo-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 650 280" className="w-full h-auto font-sans">
        <rect width="650" height="280" fill="#0F172A" rx="10" />

        {/* Left: Maltese Cross Spherulite */}
        <g transform="translate(160, 140)">
          {/* Outer circle */}
          <circle cx="0" cy="0" r="100" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
          
          {/* Radial Lamellae Fibrils */}
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            const x = Math.cos(rad) * 98
            const y = Math.sin(rad) * 98
            return (
              <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#38BDF8" strokeWidth="1.2" opacity="0.6" strokeDasharray="2,2" />
            )
          })}

          {/* Maltese Cross Extinction Quadrants (Birefringence extinction parallel to polarizer/analyzer) */}
          <path d="M 0,0 L -80,-80 A 100 100 0 0 1 80,-80 Z" fill="#0284C7" opacity="0.35" />
          <path d="M 0,0 L 80,-80 A 100 100 0 0 1 80,80 Z" fill="#0284C7" opacity="0.35" />
          <path d="M 0,0 L 80,80 A 100 100 0 0 1 -80,80 Z" fill="#0284C7" opacity="0.35" />
          <path d="M 0,0 L -80,80 A 100 100 0 0 1 -80,-80 Z" fill="#0284C7" opacity="0.35" />

          {/* Crosshairs (Extinction Brushes along Polarizer Axes) */}
          <line x1="-100" y1="0" x2="100" y2="0" stroke="#0F172A" strokeWidth="14" />
          <line x1="0" y1="-100" x2="0" y2="100" stroke="#0F172A" strokeWidth="14" />

          {/* Nucleation Center */}
          <circle cx="0" cy="0" r="5" fill="#F59E0B" />
        </g>

        {/* Right: Technical Explanation Callouts */}
        <g transform="translate(320, 40)">
          <text x="0" y="20" fontSize="13" fontWeight="bold" fill="#F8FAFC">Key Morphological Features:</text>
          
          <circle cx="8" cy="50" r="4" fill="#F59E0B" />
          <text x="20" y="54" fontSize="11" fontWeight="bold" fill="#FDE68A">Heterogeneous Nucleus</text>
          <text x="20" y="68" fontSize="10" fill="#94A3B8">Dust, talc, or clarifying agent initiating crystal growth.</text>

          <circle cx="8" cy="100" r="4" fill="#38BDF8" />
          <text x="20" y="104" fontSize="11" fontWeight="bold" fill="#BAE6FD">Radially Growing Lamellae</text>
          <text x="20" y="118" fontSize="10" fill="#94A3B8">Chain-folded polymer crystallites twisting outward radially.</text>

          <circle cx="8" cy="150" r="4" fill="#0284C7" />
          <text x="20" y="154" fontSize="11" fontWeight="bold" fill="#E0F2FE">Maltese Cross Extinction</text>
          <text x="20" y="168" fontSize="10" fill="#94A3B8">Zero light transmission along polariser vibration planes.</text>

          <rect x="0" y="195" width="300" height="32" rx="6" fill="#1E293B" stroke="#334155" />
          <text x="15" y="215" fontSize="10" fontFamily="monospace" fill="#38BDF8">Optical Property: Spherulite &gt; &lambda; &rarr; Hazy/Opaque</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Crossed-Polarizer Microscopy: Anisotropic refractive indices ($n_\parallel \neq n_\perp$) generate the characteristic four-quadrant Maltese cross extinction pattern in semi-crystalline thermoplastics (PP, POM, PA66).
      </figcaption>
    </figure>
  )
}

// ─── Dispatcher for Markdown Mechanism tags ──────────────────────────────────
export function VisualMechanismDispatcher({ mechanism }: { mechanism: string }) {
  const m = mechanism.toLowerCase().trim()
  if (m.includes('romp') || m.includes('metathesis')) return <ROMPMechanismSVG />
  if (m.includes('gpc') || m.includes('sec') || m.includes('molecular-weight') || m.includes('mwd')) return <GPCChromatogramSVG />
  if (m.includes('extruder') || m.includes('screw') || m.includes('extrusion')) return <ExtrusionScrewZonesSVG />
  if (m.includes('spherulite') || m.includes('crystallization') || m.includes('morphology')) return <SpheruliteMorphologySVG />
  return <ROMPMechanismSVG />
}
