// src/components/VisualMechanismPrimitives.tsx
'use client'

import React from 'react'

// ─── 1. ROMP Mechanism (Ring-Opening Metathesis Polymerization) ───────────────
// Chemically Verified: Standard Grubbs alkylidene carbene coordination & [2+2] metathesis cycle
export function ROMPMechanismSVG({ title = 'Ring-Opening Metathesis Polymerization (ROMP) Reaction Cycle' }: { title?: string }) {
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
          <polygon points="40,30 75,10 110,30 110,80 75,100 40,80" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
          <line x1="75" y1="10" x2="75" y2="100" stroke="#1D4ED8" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="40" y1="45" x2="40" y2="65" stroke="#2563EB" strokeWidth="3.5" />
          <text x="75" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E293B">Strained Norbornene</text>
          <text x="75" y="140" textAnchor="middle" fontSize="9" fill="#64748B">&Delta;G &lt; 0 (Ring Strain Relief ~27 kcal/mol)</text>

          <text x="145" y="65" fontSize="20" fontWeight="bold" fill="#94A3B8">+</text>

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
          <text x="80" y="140" textAnchor="middle" fontSize="9" fill="#065F46">PDI &le; 1.05 · Unsaturation Retained</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        IUPAC Verified Metathesis Cycle: Coordination of olefin to Ruthenium alkylidene followed by formal [2+2] cycloaddition to yield a ruthenacyclobutane, which undergoes cycloreversion relieving ring strain to drive living chain growth.
      </figcaption>
    </figure>
  )
}

// ─── 2. GPC Chromatogram (Gel Permeation Chromatography Calibration & MWD) ────
// Mathematically Exact: Size-exclusion log(MW) vs Retention Volume (Vr)
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
            <line key={y} x1={70} y1={y} x2={580} y2={y} />
          ))}
          {[140, 220, 300, 380, 460, 540].map(x => (
            <line key={x} x1={x} y1={30} x2={x} y2={270} />
          ))}
        </g>

        {/* Axes */}
        <g stroke="#0F172A" strokeWidth="2">
          <line x1="70" y1="270" x2="590" y2="270" />
          <line x1="70" y1="25" x2="70" y2="270" />
        </g>

        {/* Labels */}
        <text x="330" y="305" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letterSpacing="0.5">
          RETENTION VOLUME / ELUTION TIME &rarr; (LOW MW ELUTES LATER)
        </text>
        <text x="25" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" transform="rotate(-90, 25, 150)">
          DETECTOR RESPONSE (dRI / UV)
        </text>

        {/* Calibration curve (Log MW vs Elution Volume) */}
        <path d="M 90,60 Q 250,140 560,250" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4,4" />
        <text x="470" y="215" fontSize="10" fill="#64748B" fontWeight="600">Calibration: log(M) = -A·Vr + B</text>

        {/* Polymer MWD peak */}
        <path 
          d="M 160,270 Q 240,265 280,180 Q 320,60 360,60 Q 400,60 440,180 Q 480,265 540,270" 
          fill="rgba(16, 185, 129, 0.15)" 
          stroke="#059669" 
          strokeWidth="3.5" 
        />

        {/* Averages markers */}
        {/* Mz: z-average (heavy end) */}
        <line x1="310" y1="270" x2="310" y2="120" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="310" cy="120" r="4" fill="#DC2626" />
        <text x="310" y="110" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">Mz</text>

        {/* Mw: Weight-average */}
        <line x1="350" y1="270" x2="350" y2="65" stroke="#2563EB" strokeWidth="2" strokeDasharray="3,3" />
        <circle cx="350" cy="65" r="4" fill="#2563EB" />
        <text x="350" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2563EB">Mw</text>

        {/* Mn: Number-average (collated toward smaller chains) */}
        <line x1="400" y1="270" x2="400" y2="100" stroke="#D97706" strokeWidth="2" strokeDasharray="3,3" />
        <circle cx="400" cy="100" r="4" fill="#D97706" />
        <text x="400" y="90" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#D97706">Mn</text>

        {/* Callout box */}
        <g transform="translate(90, 40)">
          <rect x="0" y="0" width="130" height="50" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <text x="10" y="20" fontSize="10" fontWeight="bold" fill="#0F172A">PDI (Polydispersity):</text>
          <text x="10" y="38" fontSize="12" fontWeight="bold" fill="#059669" fontFamily="monospace">Mw / Mn &ge; 1.00</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Analytical SEC Chromatography: Larger hydrodynamic volumes are excluded from porous gel pores and elute first; Mz &gt; Mw &gt; Mn for all polydisperse polymers.
      </figcaption>
    </figure>
  )
}

// ─── 3. Carothers Equation & Gel Point Polymerization Curve ───────────────────
// Mathematically Exact: Flory-Stockmayer non-linear condensation gel point pc = 2/favg
export function CarothersGelationSVG({ title = 'Carothers Equation & Crosslinking Gelation Kinetics' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-rose-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 650 300" className="w-full h-auto font-sans">
        <rect width="650" height="300" fill="#FFFFFF" rx="8" />

        {/* Grid lines */}
        <g stroke="#F1F5F9" strokeWidth="1">
          {[50, 100, 150, 200, 250].map(y => (
            <line key={y} x1={70} y1={y} x2={580} y2={y} />
          ))}
          {[170, 270, 370, 470, 570].map(x => (
            <line key={x} x1={x} y1={30} x2={x} y2={250} />
          ))}
        </g>

        {/* Axes */}
        <g stroke="#0F172A" strokeWidth="2">
          <line x1="70" y1="250" x2="590" y2="250" />
          <line x1="70" y1="20" x2="70" y2="250" />
        </g>

        {/* Scale labels */}
        <text x="70" y="265" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#64748B">0.0</text>
        <text x="195" y="265" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#64748B">0.50</text>
        <text x="320" y="265" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#64748B">0.75</text>
        <text x="445" y="265" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#64748B">0.90</text>
        <text x="545" y="265" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#64748B">0.99</text>

        <text x="330" y="288" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
          FRACTIONAL EXTENT OF REACTION (p) &rarr;
        </text>
        <text x="25" y="140" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" transform="rotate(-90, 25, 140)">
          DEGREE OF POLYMERIZATION (Xn)
        </text>

        {/* Linear Step-Growth (f=2, Bifunctional e.g. PET, PA-66) */}
        <path
          d="M 70,245 Q 320,240 445,215 T 545,50"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3.5"
        />
        <text x="500" y="40" fontSize="10" fontWeight="bold" fill="#2563EB">Linear Step-Growth (f=2)</text>

        {/* Crosslinking Non-Linear Gelation (f=3, Trifunctional e.g. Glycerol / Epoxy) */}
        <path
          d="M 70,245 Q 260,235 340,160 T 365,25"
          fill="none"
          stroke="#DC2626"
          strokeWidth="3.5"
          strokeDasharray="4,2"
        />
        <line x1="365" y1="20" x2="365" y2="250" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="365" cy="110" r="5" fill="#DC2626" stroke="#FFF" strokeWidth="2" />
        <text x="375" y="95" fontSize="10" fontWeight="bold" fill="#DC2626">Critical Gel Point (pc = 2/f = 0.67)</text>
        <text x="375" y="110" fontSize="8" fill="#991B1B">Infinitesimal Network • Viscosity &rarr; &infin;</text>

        {/* Governing Equation Callout */}
        <g transform="translate(100, 45)">
          <rect x="0" y="0" width="180" height="55" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
          <text x="10" y="20" fontSize="10" fontWeight="bold" fill="#0F172A">Carothers Equation:</text>
          <text x="10" y="42" fontSize="12" fontWeight="bold" fill="#2563EB" fontFamily="monospace">Xn = 2 / (2 - p · favg)</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Step-Growth Kinetics: High molecular weight requires extreme conversion (p &gt; 0.99). In non-linear systems, the polymer gels irreversibly at pc = 2 / favg.
      </figcaption>
    </figure>
  )
}

// ─── 4. Free-Radical Chain Polymerization (FRP Kinetic Law Matrix) ────────────
// Pure Authoritative Kinetics & Rate Equations (Flory / Odian Principles)
export function FreeRadicalPolymerizationSVG({ title = 'Free-Radical Chain-Growth Polymerization Kinetics & Steady-State Rate Laws' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-amber-600 rounded-full" />
        {title}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
        {/* Phase 1: Initiation */}
        <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-amber-900 uppercase">1. Initiation</span>
            <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">kd, ki</span>
          </div>
          <p className="text-xs text-slate-600">Thermal homolytic cleavage of initiator followed by monomer radical addition.</p>
          <div className="p-2 rounded bg-amber-50/50 border border-amber-100 font-mono text-[11px] font-bold text-amber-950">
            Ri = 2 · f · kd · [I]
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">Typical initiators: AIBN, BPO (f &approx; 0.6-0.8)</span>
        </div>

        {/* Phase 2: Propagation */}
        <div className="p-3.5 bg-white rounded-xl border border-blue-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-blue-900 uppercase">2. Propagation</span>
            <span className="text-[9px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">kp</span>
          </div>
          <p className="text-xs text-slate-600">Rapid successive head-to-tail monomer addition to propagating macroradicals.</p>
          <div className="p-2 rounded bg-blue-50/50 border border-blue-100 font-mono text-[11px] font-bold text-blue-950">
            Rp = kp · [M] · &radic;( (f·kd·[I]) / kt )
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">Growth timescale: ~10⁻³ s / chain</span>
        </div>

        {/* Phase 3: Termination */}
        <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-900 uppercase">3. Termination</span>
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">ktc, ktd</span>
          </div>
          <p className="text-xs text-slate-600">Bimolecular mutual radical annihilation via combination or disproportionation.</p>
          <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 font-mono text-[11px] font-bold text-emerald-950">
            Xn = kp·[M] / &radic;( f·kd·kt·[I] )
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">Governs final molecular weight (Mw/Mn)</span>
        </div>
      </div>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Classic Vinyl Chain-Growth Kinetics (Odian Principles): Steady-state assumption [M•] = const yields 1st order in monomer and 0.5 order in initiator.
      </figcaption>
    </figure>
  )
}

// ─── 5. Single-Screw Extruder Functional Zones (Feed, Compression, Metering) ──
// Standard Mechanical Tooling Schematic (Rauwendaal Extrusion Engineering)
export function ExtrusionScrewZonesSVG({ title = 'Single-Screw Plasticating Extrusion Functional Geometry (L/D = 24:1 - 30:1)' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-orange-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 700 230" className="w-full h-auto font-sans">
        <rect width="700" height="230" fill="#0F172A" rx="10" />

        {/* Barrel Housing */}
        <rect x="30" y="40" width="640" height="110" fill="#1E293B" stroke="#334155" strokeWidth="2" rx="4" />
        
        {/* Hopper */}
        <polygon points="50,15 110,15 95,40 65,40" fill="#3B82F6" stroke="#60A5FA" strokeWidth="1.5" />
        <text x="80" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFFFF">HOPPER</text>

        {/* Screw Root Core */}
        <polygon points="50,115 220,115 450,90 650,90 650,75 450,75 220,50 50,50" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Flights Line-art */}
        <g stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round">
          {[70, 105, 140, 175, 210, 250, 290, 335, 380, 430, 480, 530, 580, 630].map((x, i) => (
            <line key={i} x1={x} y1="42" x2={x + 15} y2="148" opacity="0.8" />
          ))}
        </g>

        {/* Zone Boundaries */}
        <line x1="220" y1="35" x2="220" y2="160" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,4" />
        <line x1="450" y1="35" x2="450" y2="160" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,4" />

        {/* Zone 1: Feed */}
        <g transform="translate(130, 185)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60A5FA">1. FEED ZONE (4-8D)</text>
          <text x="0" y="15" textAnchor="middle" fontSize="9" fill="#94A3B8">Solid Bed Conveying • Deep Channel (hF)</text>
        </g>

        {/* Zone 2: Compression / Melting */}
        <g transform="translate(335, 185)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FBBF24">2. COMPRESSION ZONE (8-12D)</text>
          <text x="0" y="15" textAnchor="middle" fontSize="9" fill="#94A3B8">Viscous Dissipation • CR = hF / hM (2:1 to 4:1)</text>
        </g>

        {/* Zone 3: Metering */}
        <g transform="translate(550, 185)">
          <text x="0" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#34D399">3. METERING ZONE (6-10D)</text>
          <text x="0" y="15" textAnchor="middle" fontSize="9" fill="#94A3B8">Melt Homogenization • Pumping to Die</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Extruder Geometry (Rauwendaal Principles): Tapered screw root compresses the plastic solid bed against the heated barrel wall to generate intense frictional dissipation and uniform melt pressure.
      </figcaption>
    </figure>
  )
}

// ─── 6. Spherulite Morphology & Maltese Cross Extinction ──────────────────────
// Physically Exact Optical Crystallography (Keller / Bassett Lamellar Optics)
export function SpheruliteMorphologySVG({ title = 'Polymer Crystallization: Spherulitic Super-Structure & Polarized Optics' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-sky-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 650 290" className="w-full h-auto font-sans">
        <rect width="650" height="290" fill="#0B0F19" rx="10" />

        {/* Left: Maltese Cross Spherulite Vector */}
        <g transform="translate(160, 145)">
          <circle cx="0" cy="0" r="105" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          
          {/* Radial Lamellar Fibrils */}
          {[15, 30, 45, 60, 75, 105, 120, 135, 150, 165, 195, 210, 225, 240, 255, 285, 300, 315, 330, 345].map(deg => {
            const rad = (deg * Math.PI) / 180
            const x2 = Math.cos(rad) * 100
            const y2 = Math.sin(rad) * 100
            return (
              <line
                key={deg}
                x1="0"
                y1="0"
                x2={x2}
                y2={y2}
                stroke="#0284C7"
                strokeWidth="1.5"
                strokeDasharray="4,2"
                opacity="0.75"
              />
            )
          })}

          {/* 4-Quadrant Extinction Maltese Cross */}
          <path
            d="M 0,0 L 40,-95 A 105 105 0 0 1 95,-40 Z"
            fill="rgba(56, 189, 248, 0.4)"
          />
          <path
            d="M 0,0 L -95,-40 A 105 105 0 0 1 -40,-95 Z"
            fill="rgba(56, 189, 248, 0.4)"
          />
          <path
            d="M 0,0 L -40,95 A 105 105 0 0 1 -95,40 Z"
            fill="rgba(56, 189, 248, 0.4)"
          />
          <path
            d="M 0,0 L 95,40 A 105 105 0 0 1 40,95 Z"
            fill="rgba(56, 189, 248, 0.4)"
          />

          {/* Extinction Dark Cross Overlay (Polarizer / Analyzer axes) */}
          <line x1="0" y1="-105" x2="0" y2="105" stroke="#0B0F19" strokeWidth="8" />
          <line x1="-105" y1="0" x2="105" y2="0" stroke="#0B0F19" strokeWidth="8" />

          {/* Nucleation Core */}
          <circle cx="0" cy="0" r="6" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="0" y="125" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#38BDF8">Crossed Nicols Polarized View</text>
        </g>

        {/* Right: Lamellar Chain-Folded Microstructure Callout */}
        <g transform="translate(340, 45)">
          <rect x="0" y="0" width="280" height="200" rx="8" fill="#1E293B" stroke="#334155" />
          
          <text x="15" y="25" fontSize="12" fontWeight="bold" fill="#F8FAFC">Lamellar Crystallite Architecture</text>
          <text x="15" y="42" fontSize="9" fill="#94A3B8">Chain-folded ribbons (10-20 nm thickness)</text>

          {/* Chain-folded zigzag SVG */}
          <path
            d="M 30,80 L 30,140 Q 40,150 50,140 L 50,80 Q 60,70 70,80 L 70,140 Q 80,150 90,140 L 90,80 Q 100,70 110,80 L 110,140 Q 120,150 130,140 L 130,80"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3.5"
          />

          {/* Amorphous Tie Molecules */}
          <path
            d="M 130,110 C 160,80 170,150 200,100"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="2,2"
          />
          <text x="175" y="75" fontSize="9" fill="#FBBF24">Tie Molecule</text>

          {/* Annotations */}
          <text x="15" y="175" fontSize="9" fill="#E2E8F0">
            • <tspan fill="#38BDF8" fontWeight="bold">Crystalline Core:</tspan> High modulus &amp; barrier
          </text>
          <text x="15" y="190" fontSize="9" fill="#E2E8F0">
            • <tspan fill="#FBBF24" fontWeight="bold">Amorphous Interlamellar:</tspan> Impact toughness
          </text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Spherulitic Super-Structure (Keller Chain-Folding Model): Radial growth of chain-folded lamellae produces birefringence extinction in 4 quadrants parallel to polarizer/analyzer axes.
      </figcaption>
    </figure>
  )
}

// ─── Visual Mechanism Dispatcher Component ───────────────────────────────────
export function VisualMechanismDispatcher({ mechanismId, mechanism, title }: { mechanismId?: string; mechanism?: string; title?: string }) {
  const id = mechanismId || mechanism || ''
  switch (id) {
    case 'mechanism-romp':
      return <ROMPMechanismSVG title={title} />
    case 'gpc-chromatogram':
    case 'gpc-mwd':
      return <GPCChromatogramSVG title={title} />
    case 'graph-carothers':
    case 'carothers-gelation':
      return <CarothersGelationSVG title={title} />
    case 'mechanism-free-radical':
    case 'frp-kinetics':
      return <FreeRadicalPolymerizationSVG title={title} />
    case 'extrusion-screw':
    case 'screw-zones':
      return <ExtrusionScrewZonesSVG title={title} />
    case 'morphology-spherulite':
    case 'spherulite-optics':
      return <SpheruliteMorphologySVG title={title} />
    default:
      return null
  }
}

export default VisualMechanismDispatcher
