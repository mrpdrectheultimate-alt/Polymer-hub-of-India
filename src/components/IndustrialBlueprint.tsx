// src/components/IndustrialBlueprint.tsx
'use client'

import React from 'react'

export interface BlueprintDimension {
  label: string
  value: string
  tolerance?: string
}

export interface IndustrialBlueprintProps {
  title?: string
  drawingNumber?: string
  scale?: string
  material?: string
  dimensions?: BlueprintDimension[]
  notes?: string[]
  svgContent?: React.ReactNode
}

export function IndustrialBlueprint({
  title = 'Injection Mould Tooling Assembly — 2-Cavity Sub-Gate',
  drawingNumber = 'DWG-PLAST-2026-88',
  scale = '1:1 (FULL)',
  material = 'P20 Tool Steel (HRC 30-34)',
  dimensions = [],
  notes = [],
  svgContent
}: IndustrialBlueprintProps) {
  return (
    <figure className="my-6 bg-[#051124] border-2 border-blue-800 rounded-2xl overflow-hidden shadow-2xl text-blue-100 font-mono">
      {/* Blueprint Top Header Bar */}
      <div className="bg-[#091D3A] border-b-2 border-blue-700 px-4 py-3 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-cyan-400 rounded-xs" />
          <h4 className="font-bold text-white uppercase tracking-wider text-sm">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-cyan-300">
          <span>DWG NO: <strong className="text-white">{drawingNumber}</strong></span>
          <span>SCALE: <strong className="text-white">{scale}</strong></span>
          <span>MATERIAL: <strong className="text-white">{material}</strong></span>
        </div>
      </div>

      {/* Blueprint Grid & SVG Drawing Canvas */}
      <div className="relative p-6 bg-[#030B18] border-b border-blue-900 min-h-[260px] flex items-center justify-center">
        {/* Subtle CAD Grid Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #1E40AF 1px, transparent 1px), linear-gradient(to bottom, #1E40AF 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* CAD Schematic Content */}
        {svgContent ? (
          <div className="relative z-10 w-full max-w-2xl">{svgContent}</div>
        ) : (
          <svg viewBox="0 0 600 220" className="w-full h-auto max-w-2xl relative z-10 font-mono">
            {/* Core & Cavity Plates */}
            <rect x="50" y="30" width="500" height="160" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="6,4" />
            <line x1="300" y1="20" x2="300" y2="200" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="300" y="15" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">CL MOULD MOUNTING</text>

            {/* Left Cavity Block */}
            <rect x="90" y="60" width="160" height="100" fill="rgba(30, 58, 138, 0.4)" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="170" cy="110" r="30" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="170" y="114" textAnchor="middle" fill="#E0F2FE" fontSize="9" fontWeight="bold">CAVITY 1</text>

            {/* Right Cavity Block */}
            <rect x="350" y="60" width="160" height="100" fill="rgba(30, 58, 138, 0.4)" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="430" cy="110" r="30" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="430" y="114" textAnchor="middle" fill="#E0F2FE" fontSize="9" fontWeight="bold">CAVITY 2</text>

            {/* Runner & Sprue Lines */}
            <line x1="300" y1="60" x2="300" y2="110" stroke="#F59E0B" strokeWidth="3" />
            <line x1="200" y1="110" x2="400" y2="110" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="300" y="55" textAnchor="middle" fill="#FBBF24" fontSize="8">SPRUE BUSHING (Ø6.5mm)</text>

            {/* Cooling Line Channels */}
            <line x1="70" y1="45" x2="530" y2="45" stroke="#34D399" strokeWidth="1.5" strokeDasharray="5,3" />
            <text x="535" y="48" fill="#34D399" fontSize="8">WATER INLET (Ø10mm)</text>

            {/* Dimension Leader Lines */}
            <line x1="90" y1="175" x2="250" y2="175" stroke="#F43F5E" strokeWidth="1" />
            <polygon points="90,175 96,172 96,178" fill="#F43F5E" />
            <polygon points="250,175 244,172 244,178" fill="#F43F5E" />
            <text x="170" y="188" textAnchor="middle" fill="#F43F5E" fontSize="9" fontWeight="bold">160.00 ± 0.02 mm</text>
          </svg>
        )}
      </div>

      {/* Blueprint Title Block & Specs Footer */}
      <div className="bg-[#08172E] p-4 border-t border-blue-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Critical Dimensions List */}
        <div>
          <h5 className="font-bold text-cyan-300 uppercase text-[11px] mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Critical Geometric Dimensions & Tolerances (GD&T)
          </h5>
          <ul className="space-y-1 text-[11px] text-blue-200">
            {dimensions.length > 0 ? (
              dimensions.map((d, i) => (
                <li key={i} className="flex items-center justify-between border-b border-blue-900/50 pb-0.5">
                  <span>{d.label}:</span>
                  <span className="font-bold text-white">
                    {d.value} {d.tolerance && <span className="text-cyan-400 font-normal">({d.tolerance})</span>}
                  </span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-center justify-between">
                  <span>Draft Angle (Core/Cavity):</span>
                  <span className="font-bold text-white">1.5° MIN (ISO 20457)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Volumetric Shrinkage Allowance:</span>
                  <span className="font-bold text-white">1.8% (PP Homopolymer)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Ejector Pin Clearance:</span>
                  <span className="font-bold text-white">H7/g6 Precision Fit</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Engineering Notes & Sign-off */}
        <div>
          <h5 className="font-bold text-cyan-300 uppercase text-[11px] mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            Tooling Fabrication Notes
          </h5>
          <ul className="space-y-1 text-[10px] text-blue-300">
            {notes.length > 0 ? (
              notes.map((n, i) => <li key={i}>• {n}</li>)
            ) : (
              <>
                <li>• All dimensions in millimeters (mm) unless specified.</li>
                <li>• EDM texture finish SPI C-1 on cavity optical surfaces.</li>
                <li>• Conformal cooling channels vacuum brazed at 1050°C.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </figure>
  )
}

export default IndustrialBlueprint
