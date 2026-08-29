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
          <polygon points="40,30 75,10 110,30 110,80 75,100 40,80" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
          <line x1="75" y1="10" x2="75" y2="100" stroke="#1D4ED8" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="40" y1="45" x2="40" y2="65" stroke="#2563EB" strokeWidth="3.5" />
          <text x="75" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E293B">Strained Norbornene</text>
          <text x="75" y="140" textAnchor="middle" fontSize="9" fill="#64748B">&Delta;G &lt; 0 (Ring Strain Relief)</text>

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
        <text x="330" y="305" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" letterSpacing="0.5">
          RETENTION VOLUME / ELUTION TIME &rarr; (LOW MW ELUTES LATER)
        </text>
        <text x="25" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569" transform="rotate(-90, 25, 150)">
          DETECTOR RI SIGNAL (DRI)
        </text>

        {/* GPC Gaussian Distribution Peak */}
        <path
          d="M 120,270 C 200,270 240,60 300,60 C 360,60 400,270 500,270"
          fill="rgba(37, 99, 235, 0.08)"
          stroke="#2563EB"
          strokeWidth="3.5"
        />

        {/* Molecular Weight Markers */}
        <g strokeDasharray="3,3" strokeWidth="1.5">
          <line x1="260" y1="65" x2="260" y2="270" stroke="#7C3AED" />
          <line x1="300" y1="60" x2="300" y2="270" stroke="#2563EB" />
          <line x1="340" y1="80" x2="340" y2="270" stroke="#EA580C" />
        </g>

        {/* Markers text */}
        <text x="260" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7C3AED">Mz (Z-Average)</text>
        <text x="300" y="35" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2563EB">Mw (Weight-Average)</text>
        <text x="340" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#EA580C">Mn (Number-Average)</text>

        {/* Polydispersity Callout Box */}
        <rect x="420" y="40" width="180" height="75" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="430" y="60" fontSize="10" fontWeight="bold" fill="#0F172A">Polydispersity Index (PDI):</text>
        <text x="430" y="78" fontSize="12" fontWeight="bold" fill="#2563EB" fontFamily="monospace">Đ = Mw / Mn = 2.15</text>
        <text x="430" y="98" fontSize="9" fill="#64748B">Commercial Injection Grade PP</text>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Size Exclusion Principle: High molecular weight fraction ($M_z$) elutes first due to pore exclusion, followed by medium ($M_w$) and low ($M_n$) oligomeric chains.
      </figcaption>
    </figure>
  )
}

// ─── 3. Ziegler-Natta Catalysis & Coordinate Insertion Mechanism ──────────────
export function ZieglerNattaMechanismSVG({ title = 'Ziegler-Natta Catalytic Polymerization (Cossee-Arlman Mechanism)' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-indigo-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 700 240" className="w-full h-auto font-sans">
        <rect width="700" height="240" fill="#F8FAFC" rx="12" />

        {/* Step 1: Active Ti Center with Vacant Site & Alkyl Group */}
        <g transform="translate(30, 40)">
          <rect x="15" y="15" width="90" height="90" rx="12" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
          <text x="60" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#312E81">[Ti]—R</text>
          <rect x="75" y="60" width="18" height="18" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="84" y="73" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#DC2626">□</text>
          <text x="60" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E293B">1. Octahedral Ti Active Site</text>
          <text x="60" y="140" textAnchor="middle" fontSize="9" fill="#64748B">Vacant Coordination Site (□)</text>
        </g>

        {/* Reaction Arrow 1: Propylene Monomer π-Coordination */}
        <g transform="translate(145, 80)">
          <line x1="0" y1="15" x2="35" y2="15" stroke="#0F172A" strokeWidth="2" />
          <polygon points="35,11 43,15 35,19" fill="#0F172A" />
          <text x="20" y="0" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2563EB">+ CH₂=CH-CH₃</text>
          <text x="20" y="32" textAnchor="middle" fontSize="8" fill="#64748B">π-Complex</text>
        </g>

        {/* Step 2: Monomer Coordinated Intermediate */}
        <g transform="translate(210, 40)">
          <rect x="15" y="15" width="105" height="90" rx="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <text x="67" y="48" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400E">[Ti]—(CH₂-CH-CH₃)</text>
          <line x1="67" y1="58" x2="67" y2="78" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="67" y="90" textAnchor="middle" fontSize="10" fill="#B45309">Olefin π-Bond</text>
          <text x="67" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E293B">2. Stereospecific Docking</text>
          <text x="67" y="140" textAnchor="middle" fontSize="9" fill="#64748B">Regioselective 1,2-Insertion</text>
        </g>

        {/* Reaction Arrow 2: Cossee-Arlman Cis-Migratory Insertion */}
        <g transform="translate(335, 80)">
          <line x1="0" y1="15" x2="35" y2="15" stroke="#0F172A" strokeWidth="2" />
          <polygon points="35,11 43,15 35,19" fill="#0F172A" />
          <text x="20" y="0" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#059669">cis-Migration</text>
          <text x="20" y="32" textAnchor="middle" fontSize="8" fill="#64748B">4-Center TS</text>
        </g>

        {/* Step 3: Extended Chain with Regenerated Vacant Site */}
        <g transform="translate(400, 40)">
          <rect x="15" y="15" width="115" height="90" rx="12" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
          <text x="72" y="45" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#065F46">[Ti]—CH₂-CH(CH₃)—R</text>
          <rect x="25" y="65" width="16" height="16" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="33" y="77" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#DC2626">□</text>
          <text x="72" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">3. Isotactic Polypropylene</text>
          <text x="72" y="140" textAnchor="middle" fontSize="9" fill="#065F46">Site Regenerated for Next Monomer</text>
        </g>

        {/* Stereo Tacticity Badge */}
        <g transform="translate(545, 45)">
          <rect x="0" y="0" width="140" height="120" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="70" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0F172A">Tacticity Outcome:</text>
          <path d="M 15,65 Q 40,45 70,65 T 125,65" fill="none" stroke="#4F46E5" strokeWidth="2" />
          <circle cx="35" cy="52" r="4" fill="#DC2626" />
          <circle cx="65" cy="52" r="4" fill="#DC2626" />
          <circle cx="95" cy="52" r="4" fill="#DC2626" />
          <text x="70" y="90" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4338CA">Isotactic (All -CH₃ on same side)</text>
          <text x="70" y="105" textAnchor="middle" fontSize="8" fill="#64748B">Tm ≈ 165°C · χc &gt; 60%</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Cossee-Arlman Mechanism: Propylene coordinates to the vacant octahedral site of TiCl₄ / AlEt₃, undergoing four-center cis-migratory insertion to enforce isotactic stereoregularity.
      </figcaption>
    </figure>
  )
}

// ─── 4. Carothers Equation & Gel Point Polymerization Curve ───────────────────
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
            <line key={y} x1="70" y1={y} x2="580" y2={y} />
          ))}
          {[170, 270, 370, 470, 570].map(x => (
            <line key={x} x1={x} y1="30" x2={x} y2="250" />
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

// ─── 5. Free-Radical Addition Polymerization (FRP Kinetics) ───────────────────
export function FreeRadicalPolymerizationSVG({ title = 'Free-Radical Chain Polymerization Mechanism (Initiation-Propagation-Termination)' }: { title?: string }) {
  return (
    <figure className="my-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="font-mono text-xs font-bold uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className="w-2 h-2 bg-amber-600 rounded-full" />
        {title}
      </div>
      <svg viewBox="0 0 700 230" className="w-full h-auto font-sans">
        <rect width="700" height="230" fill="#F8FAFC" rx="12" />

        {/* Phase 1: Initiation */}
        <g transform="translate(25, 30)">
          <rect x="0" y="0" width="195" height="150" rx="10" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="12" y="22" fontSize="11" fontWeight="bold" fill="#92400E">1. INITIATION (ki, kd)</text>
          
          <text x="12" y="50" fontSize="10" fontFamily="monospace" fill="#B45309">I-I &rarr; 2 R• (AIBN / BPO)</text>
          <text x="12" y="70" fontSize="9" fill="#78350F">Thermal Homolytic Cleavage</text>

          <text x="12" y="100" fontSize="10" fontFamily="monospace" fill="#92400E">R• + CH₂=CHX &rarr; R-CH₂-CHX•</text>
          <text x="12" y="120" fontSize="9" fill="#78350F">Primary Radical Addition</text>
        </g>

        {/* Phase 2: Propagation */}
        <g transform="translate(240, 30)">
          <rect x="0" y="0" width="205" height="150" rx="10" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="12" y="22" fontSize="11" fontWeight="bold" fill="#1E40AF">2. PROPAGATION (kp)</text>

          <text x="12" y="50" fontSize="10" fontFamily="monospace" fill="#1D4ED8">Pn• + M &rarr; P(n+1)•</text>
          <text x="12" y="70" fontSize="9" fill="#1E3A8A">Head-to-Tail Regioselective</text>
          
          <path d="M 15,100 Q 50,85 85,100 T 155,100" fill="none" stroke="#2563EB" strokeWidth="2.5" />
          <circle cx="160" cy="100" r="4" fill="#DC2626" />
          <text x="12" y="130" fontSize="9" fill="#1E3A8A">Rapid Chain Growth (~10⁻³ s/chain)</text>
        </g>

        {/* Phase 3: Termination */}
        <g transform="translate(465, 30)">
          <rect x="0" y="0" width="210" height="150" rx="10" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <text x="12" y="22" fontSize="11" fontWeight="bold" fill="#065F46">3. TERMINATION (ktc, ktd)</text>

          <text x="12" y="48" fontSize="10" fontWeight="bold" fill="#047857">A. Combination (ktc):</text>
          <text x="12" y="65" fontSize="9" fontFamily="monospace" fill="#065F46">Pn• + Pm• &rarr; P(n+m) (PS, PMMA)</text>

          <text x="12" y="98" fontSize="10" fontWeight="bold" fill="#047857">B. Disproportionation (ktd):</text>
          <text x="12" y="115" fontSize="9" fontFamily="monospace" fill="#065F46">Pn• + Pm• &rarr; Pn(H) + Pm(=)</text>
          <text x="12" y="135" fontSize="8" fill="#064E3B">H-Transfer creates end-chain olefin</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs font-mono text-slate-500 text-center">
        Classic Chain-Growth Kinetics: Steady-state radical concentration governs the instantaneous rate of vinyl polymerization.
      </figcaption>
    </figure>
  )
}

// ─── 6. Single-Screw Extruder Functional Zones (Feed, Compression, Metering) ──
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
        Extruder Geometry: Tapered screw root compresses the plastic solid bed against the heated barrel wall to generate intense frictional dissipation and uniform melt pressure.
      </figcaption>
    </figure>
  )
}

// ─── 7. Spherulite Morphology & Maltese Cross Extinction ──────────────────────
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

          <line x1="-105" y1="0" x2="105" y2="0" stroke="#0B0F19" strokeWidth="16" />
          <line x1="0" y1="-105" x2="0" y2="105" stroke="#0B0F19" strokeWidth="16" />

          <circle cx="0" cy="0" r="5" fill="#F59E0B" />
        </g>

        {/* Right: Technical Explanation Callouts */}
        <g transform="translate(320, 35)">
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
        Crossed-Polarizer Microscopy: Anisotropic refractive indices generate the characteristic four-quadrant Maltese cross extinction pattern in semi-crystalline thermoplastics (PP, POM, PA66).
      </figcaption>
    </figure>
  )
}

// ─── Dispatcher for Markdown Mechanism tags ──────────────────────────────────
export function VisualMechanismDispatcher({ mechanism }: { mechanism: string }) {
  const m = mechanism.toLowerCase().trim()
  if (m.includes('romp') || m.includes('metathesis')) return <ROMPMechanismSVG />
  if (m.includes('gpc') || m.includes('sec') || m.includes('molecular-weight') || m.includes('mwd')) return <GPCChromatogramSVG />
  if (m.includes('ziegler') || m.includes('natta') || m.includes('catalysis') || m.includes('cossee') || m.includes('polypropylene')) return <ZieglerNattaMechanismSVG />
  if (m.includes('carothers') || m.includes('gelation') || m.includes('crosslink')) return <CarothersGelationSVG />
  if (m.includes('radical') || m.includes('frp') || m.includes('aibn') || m.includes('addition')) return <FreeRadicalPolymerizationSVG />
  if (m.includes('extruder') || m.includes('screw') || m.includes('extrusion')) return <ExtrusionScrewZonesSVG />
  if (m.includes('spherulite') || m.includes('crystallization') || m.includes('morphology')) return <SpheruliteMorphologySVG />
  return <ROMPMechanismSVG />
}
