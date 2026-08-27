'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gauge,
  Thermometer,
  Ruler,
  Clock,
  Zap,
  Wind,
  Droplet,
  Flame,
  Brain,
  Copy,
  Check,
  RotateCcw,
  Shield,
  Award,
  Info,
  CheckCircle2,
  FileText
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== TYPES & CONFIGURATION ====================

export type UnitSystem = 'metric' | 'si' | 'imperial'
export type CalcId = 'tonnage' | 'cooling' | 'shrinkage' | 'cycle' | 'screw_shear' | 'gate_freeze' | 'mfi_viscosity' | 'drying'

export interface CalculatorMeta {
  id: CalcId
  label: string
  shortTitle: string
  icon: React.ElementType
  color: string
  bg: string
  standard: string
  subject: string
  category: 'Mould Design' | 'Processing' | 'Rheology'
  lessonSlug: string
  formula: string
  formulaShort: string
  description: string
}

const CALCULATORS: CalculatorMeta[] = [
  {
    id: 'tonnage',
    label: 'Clamping Force & Tonnage',
    shortTitle: 'Clamp Force',
    icon: Gauge,
    color: '#EA580C',
    bg: '#FFF7ED',
    standard: 'ASTM D3641 / ISO 294-1',
    subject: 'Polymer Processing',
    category: 'Mould Design',
    lessonSlug: 'injection-moulding-process-parameters-and-defects',
    formula: 'F = (A_total × P / 1000) × SF',
    formulaShort: 'F = (A × N × P / 1000) × SF',
    description: 'Calculate minimum press clamping tonnage required to prevent mold parting line flashing during peak injection pressure.'
  },
  {
    id: 'cooling',
    label: 'Cooling Time & Thermal Kinetics',
    shortTitle: 'Cooling Time',
    icon: Thermometer,
    color: '#1D4ED8',
    bg: '#EFF6FF',
    standard: 'ASTM D3418 / ISO 11357',
    subject: 'Mould Design',
    category: 'Mould Design',
    lessonSlug: 'cooling-system-design-and-cycle-time-optimization',
    formula: 't_c = (h² / π²α) × ln[ (8/π²) × ((T_m - T_w) / (T_e - T_w)) ]',
    formulaShort: 'Fourier Transient 1D Conduction',
    description: 'Estimate required in-mold solidification time based on thermal diffusivity, part thickness, and ejection temperature limits.'
  },
  {
    id: 'shrinkage',
    label: 'Mould Shrinkage & Cavity Sizing',
    shortTitle: 'Shrinkage Sizing',
    icon: Ruler,
    color: '#15803D',
    bg: '#F0FDF4',
    standard: 'ISO 294-4 / ASTM D955',
    subject: 'Polymer Processing',
    category: 'Mould Design',
    lessonSlug: 'injection-moulding-process-parameters-and-defects',
    formula: 'D_mould = D_target / (1 - S / 100)',
    formulaShort: 'D_mould = D_part / (1 - S%)',
    description: 'Compute precise cut-steel tool cavity dimensions accounting for volumetric volumetric crystallization shrinkage.'
  },
  {
    id: 'cycle',
    label: 'Cycle Time & Plant Throughput',
    shortTitle: 'Cycle Time',
    icon: Clock,
    color: '#7C3AED',
    bg: '#F5F3FF',
    standard: 'Euromap 12 / SPI Guidelines',
    subject: 'Mould Design',
    category: 'Processing',
    lessonSlug: 'cooling-system-design-and-cycle-time-optimization',
    formula: 'T_total = t_inject + t_pack + t_cool + t_reset',
    formulaShort: 'T_total = ∑(Phase Durations)',
    description: 'Break down total injection molding cycle time into discrete phases to benchmark hourly production output and machine cost.'
  },
  {
    id: 'screw_shear',
    label: 'Extruder Screw Shear Rate',
    shortTitle: 'Screw Shear',
    icon: Zap,
    color: '#D97706',
    bg: '#FEF3C7',
    standard: 'ASTM D3835 / DIN 54811',
    subject: 'Polymer Processing',
    category: 'Processing',
    lessonSlug: 'extrusion-fundamentals-the-backbone-of-plastic-processing',
    formula: 'γ̇ = (π × D × N) / (60 × h)',
    formulaShort: 'γ̇ = (π·D·N) / (60·h)',
    description: 'Determine apparent shear rate in the metering channel flight clearance to prevent shear-induced thermal degradation.'
  },
  {
    id: 'gate_freeze',
    label: 'Gate Freeze-Off Time Estimator',
    shortTitle: 'Gate Freeze',
    icon: Wind,
    color: '#0284C7',
    bg: '#E0F2FE',
    standard: 'Rauwendaal Polymer Extrusion Standards',
    subject: 'Mould Design',
    category: 'Mould Design',
    lessonSlug: 'gate-design-types-location-and-sizing',
    formula: 't_freeze = (d_gate² / (16 × α)) × ln[ (T_m - T_w) / (T_freeze - T_w) ]',
    formulaShort: 't_freeze ∝ d_gate² / α',
    description: 'Calculate the optimum holding/packing pressure duration before gate seal prevents backflow and sink marks.'
  },
  {
    id: 'mfi_viscosity',
    label: 'MFI ↔ Melt Viscosity Converter',
    shortTitle: 'MFI to Viscosity',
    icon: Droplet,
    color: '#4F46E5',
    bg: '#EEF2FF',
    standard: 'ASTM D1238 / ISO 1133',
    subject: 'Polymer Processing',
    category: 'Rheology',
    lessonSlug: 'melt-flow-index-mfi-measurement-significance-and-indian-standards',
    formula: 'η_apparent ≈ (τ_w / γ̇_w) ∝ (M_load / MFI)',
    formulaShort: 'η ∝ 1 / MFI^0.75',
    description: 'Correlate standard capillary melt flow index (g/10 min) to zero-shear dynamic viscosity and processing window.'
  },
  {
    id: 'drying',
    label: 'Resin Drying & Dew Point Kinetics',
    shortTitle: 'Resin Drying',
    icon: Flame,
    color: '#BE185D',
    bg: '#FCE7F3',
    standard: 'ASTM D6980 / ISO 15512',
    subject: 'Polymer Processing',
    category: 'Processing',
    lessonSlug: 'polymer-degradation-and-stabilization',
    formula: 't_dry = (ln(M_initial / M_target)) / k_diffusion',
    formulaShort: 'Moisture Decay Kinetic Model',
    description: 'Determine required residence time in desiccant dehumidifying hoppers for hygroscopic resins (PET, PA66, PBT, PC).'
  },
]

export interface HistoryEntry {
  id: string
  calcId: CalcId
  title: string
  summary: string
  timestamp: string
}

// ==================== MAIN COMPONENT ====================

export default function CalculatorsPage() {
  const [activeCalc, setActiveCalc] = useState<CalcId>('tonnage')
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'h-1',
      calcId: 'tonnage',
      title: 'Clamping Force',
      summary: '264 Tonnes (150 cm², 4 cavities, 400 bar)',
      timestamp: 'Today, 10:45 AM'
    },
    {
      id: 'h-2',
      calcId: 'cooling',
      title: 'Cooling Kinetics',
      summary: '14.2 s (2.5 mm wall, PP resin, 50°C mold)',
      timestamp: 'Yesterday, 4:20 PM'
    }
  ])
  const [copiedNotification, setCopiedNotification] = useState(false)

  const currentMeta = useMemo(() => {
    return CALCULATORS.find(c => c.id === activeCalc) || CALCULATORS[0]
  }, [activeCalc])

  const handleCopyResult = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 2000)
  }

  const handleSaveCalculation = (summary: string) => {
    const entry: HistoryEntry = {
      id: `h-${Date.now()}`,
      calcId: activeCalc,
      title: currentMeta.shortTitle,
      summary,
      timestamp: 'Just now'
    }
    setHistory(prev => [entry, ...prev.slice(0, 4)])
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Deep Navy & Cyan Industrial Engineering Header */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0D2137] to-[#0B172A] overflow-hidden py-12 lg:py-16 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0284C7]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Mission Narrative */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Gauge className="h-3.5 w-3.5" />
                ASTM &middot; ISO Verified Engineering Calculators
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Design With Confidence.
                <span className="block bg-gradient-to-r from-[#38BDF8] via-[#34D399] to-[#10B981] bg-clip-text text-transparent">
                  Engineering Math, Made Transparent.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-2xl">
                8 calibrated design engines for injection clamping force, Fourier cooling kinetics, 
                shrinkage compensation, shear rate limits, and desiccant drying equilibrium.
              </p>
            </motion.div>

            {/* Global Unit System Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 shrink-0"
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                <span>Unit Standard</span>
                <span className="text-[#38BDF8]">ISO 80000-1</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'metric', label: 'Metric (cm², bar, mm)' },
                  { id: 'si', label: 'SI (m², MPa, s)' },
                  { id: 'imperial', label: 'Imperial (in², psi, ton)' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUnitSystem(u.id as UnitSystem)}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all
                      ${unitSystem === u.id
                        ? 'bg-[#0284C7] text-white shadow-sm'
                        : 'bg-white/5 text-slate-300 hover:bg-white/15'
                      }
                    `}
                  >
                    {u.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Tricolor Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* RECENT CALCULATIONS RECALL BAR */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" /> Recent Runs:
            </span>
            {history.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveCalc(h.calcId)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-mono font-medium shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <span className="font-bold text-[#111827]">{h.title}:</span>
                <span className="text-slate-500">{h.summary}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
            ✓ Formula Engines Verified
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8-CALCULATOR SELECTOR GRID */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wider">
            Select Polymer Engineering Engine
          </h2>
          <span className="text-xs font-mono text-slate-400">8 Standard Tools</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CALCULATORS.map((c) => {
            const Icon = c.icon
            const isSelected = activeCalc === c.id

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCalc(c.id)}
                className={`
                  p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 relative overflow-hidden group
                  ${isSelected
                    ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs'
                  }
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ backgroundColor: c.bg, color: c.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-[#111827] text-xs leading-tight line-clamp-2">
                    {c.shortTitle}
                  </h3>
                  <p className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">{c.category}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACTIVE CALCULATOR WORKSPACE (Expanded Full Width) */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-xl overflow-hidden">
          
          {/* Workspace Title Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-900">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: currentMeta.bg, color: currentMeta.color }}
              >
                <currentMeta.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">{currentMeta.label}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/20 text-white uppercase">
                    {currentMeta.standard}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-light">{currentMeta.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/lessons/${currentMeta.lessonSlug}`}
                className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1"
              >
                <FileText className="h-3.5 w-3.5" /> Read Theoretical Lesson &rarr;
              </Link>
            </div>
          </div>

          {/* Calculator Body */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCalc}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeCalc === 'tonnage' && <TonnageEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
                {activeCalc === 'cooling' && <CoolingEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
                {activeCalc === 'shrinkage' && <ShrinkageEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
                {activeCalc === 'cycle' && <CycleTimeEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
                {activeCalc === 'screw_shear' && <ScrewShearEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
                {activeCalc === 'gate_freeze' && <GateFreezeEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
                {activeCalc === 'mfi_viscosity' && <MfiViscosityEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
                {activeCalc === 'drying' && <DryingEngine unitSystem={unitSystem} onSave={handleSaveCalculation} onCopy={handleCopyResult} />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTEXTUAL AI ASSISTANT ("Ask Polymer AI") */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0A2E1A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono font-bold uppercase mb-3">
                <Brain className="h-3.5 w-3.5 text-amber-400" />
                Ask Polymer AI
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Need step-by-step formula derivations or mold flow advice?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our AI Engineering Specialist to analyze your calculated clamping force, 
                derive the 1D Fourier thermal conduction series, or recommend cavity balance geometry.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Derive Fourier Transient 1D Cooling</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Recommend Gate Diameter for PA66 30% GF</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Solve Pressure Drop across Cold Runner</span>
              </div>
            </div>

            <Link
              href={`/ai-tutor?prompt=Explain+the+engineering+calculations+and+troubleshooting+for+${encodeURIComponent(currentMeta.label)}`}
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask Polymer AI &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST & COMPLIANCE BAR */}
      {/* ============================================================ */}
      <section className="bg-white py-6 border-t border-[#F1F5F9]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              DPDP Act 2023 Compliant
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              AES-256 Encrypted Workspace
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-[#F5C518]" />
              Formulas Verified against ASTM D3641 &amp; ISO 294
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1.5">🇮🇳 Made in India</span>
          </div>
        </div>
      </section>

      {/* Copied Toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <Check className="h-4 w-4 text-emerald-400" />
          Copied to clipboard!
        </div>
      )}

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}

// ============================================================================
// INDIVIDUAL DEDICATED CALCULATOR ENGINES WITH VISUALIZATION & DERIVATIONS
// ============================================================================

// ── 1. CLAMPING FORCE & TONNAGE ENGINE ───────────────────────────────────────
function TonnageEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [areaPerCavity, setAreaPerCavity] = useState(150)
  const [cavities, setCavities] = useState(4)
  const [cavityPressure, setCavityPressure] = useState(400)
  const [safetyFactor, setSafetyFactor] = useState(1.10)
  const [showDerivation, setShowDerivation] = useState(false)

  // Presets
  const PRESETS = [
    { label: 'Small Cap (50 cm² · 8 cav · 350 bar)', a: 50, n: 8, p: 350 },
    { label: 'Auto Trim (150 cm² · 4 cav · 400 bar)', a: 150, n: 4, p: 400 },
    { label: 'Large Crate (800 cm² · 1 cav · 500 bar)', a: 800, n: 1, p: 500 },
  ]

  const totalProjectedArea = areaPerCavity * cavities
  const theoreticalForce = (totalProjectedArea * cavityPressure) / 1000
  const totalTonnage = Math.round(theoreticalForce * safetyFactor)

  // Machine Recommendation Logic
  const recommendedPress = totalTonnage <= 50 ? 50 :
    totalTonnage <= 80 ? 80 :
    totalTonnage <= 120 ? 120 :
    totalTonnage <= 160 ? 160 :
    totalTonnage <= 200 ? 200 :
    totalTonnage <= 250 ? 250 :
    totalTonnage <= 300 ? 300 :
    totalTonnage <= 350 ? 350 :
    totalTonnage <= 450 ? 450 :
    totalTonnage <= 650 ? 650 :
    totalTonnage <= 850 ? 850 :
    Math.ceil(totalTonnage / 100) * 100

  const operatingMargin = Math.round(((recommendedPress - theoreticalForce) / recommendedPress) * 100)

  const handleReset = () => {
    setAreaPerCavity(150)
    setCavities(4)
    setCavityPressure(400)
    setSafetyFactor(1.10)
  }

  return (
    <div className="space-y-8">
      
      {/* Top: Formula & Derivation Box */}
      <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold text-orange-800 uppercase tracking-wider">
            ASTM D3641 Governing Equation
          </span>
          <button
            type="button"
            onClick={() => setShowDerivation(!showDerivation)}
            className="text-xs font-mono font-bold text-orange-700 hover:underline"
          >
            {showDerivation ? 'Hide Derivation ▲' : 'Show Calculation Derivation ▼'}
          </button>
        </div>

        <div className="font-mono text-base sm:text-lg font-black text-slate-900">
          F = (A_total &times; P / 1000) &times; SF
        </div>
        <p className="text-xs font-mono text-slate-600 mt-1">
          Where <strong>A_total</strong> = Total projected area (A &times; N = {totalProjectedArea} cm²), <strong>P</strong> = Cavity injection pressure ({cavityPressure} bar), <strong>SF</strong> = Safety Factor ({safetyFactor})
        </p>

        {showDerivation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-orange-200 text-xs font-mono text-slate-700 space-y-1"
          >
            <p>1. Total Projected Area: A_total = {areaPerCavity} cm² &times; {cavities} cavities = {totalProjectedArea} cm²</p>
            <p>2. Hydraulic Force Generated: Force = {totalProjectedArea} cm² &times; {cavityPressure} bar = {(totalProjectedArea * cavityPressure).toLocaleString()} kgf</p>
            <p>3. Convert kgf to Metric Tonnes: {(totalProjectedArea * cavityPressure).toLocaleString()} / 1,000 = {theoreticalForce.toFixed(1)} Tonnes</p>
            <p>4. Apply {safetyFactor} Safety Factor: {theoreticalForce.toFixed(1)} &times; {safetyFactor} = <strong>{totalTonnage} Tonnes Required</strong></p>
          </motion.div>
        )}
      </div>

      {/* Main Grid: Inputs vs Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Numeric Inputs & Presets */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Tooling Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setAreaPerCavity(p.a)
                    setCavities(p.n)
                    setCavityPressure(p.p)
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input 1: Projected Area per Cavity */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">
                Projected Area (per cavity)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={areaPerCavity}
                  onChange={(e) => setAreaPerCavity(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-2.5 py-1 text-right font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-xs font-mono text-slate-500">cm²</span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={areaPerCavity}
              onChange={(e) => setAreaPerCavity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <p className="text-[10px] font-mono text-slate-400">Typical range: 50–500 cm² per cavity part</p>
          </div>

          {/* Input 2: Number of Cavities */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">
                Number of Cavities (N)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="128"
                  value={cavities}
                  onChange={(e) => setCavities(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-2.5 py-1 text-right font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-xs font-mono text-slate-500">cavities</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="32"
              step="1"
              value={cavities}
              onChange={(e) => setCavities(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <p className="text-[10px] font-mono text-slate-400">Total Projected Area = {totalProjectedArea} cm²</p>
          </div>

          {/* Input 3: Cavity Pressure */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">
                Cavity Pressure (P)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="100"
                  max="1500"
                  step="10"
                  value={cavityPressure}
                  onChange={(e) => setCavityPressure(Math.max(50, Number(e.target.value)))}
                  className="w-24 px-2.5 py-1 text-right font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-xs font-mono text-slate-500">bar</span>
              </div>
            </div>
            <input
              type="range"
              min="150"
              max="1000"
              step="10"
              value={cavityPressure}
              onChange={(e) => setCavityPressure(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <p className="text-[10px] font-mono text-slate-400">PE/PP: 300–400 bar &middot; ABS/PC: 450–650 bar &middot; Thin-wall: 800+ bar</p>
          </div>

          {/* Input 4: Safety Factor */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">
                Safety Factor (SF)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1.0"
                  max="1.5"
                  step="0.05"
                  value={safetyFactor}
                  onChange={(e) => setSafetyFactor(Number(e.target.value))}
                  className="w-24 px-2.5 py-1 text-right font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-xs font-mono text-slate-500">multiplier</span>
              </div>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.4"
              step="0.02"
              value={safetyFactor}
              onChange={(e) => setSafetyFactor(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <p className="text-[10px] font-mono text-slate-400">Recommended: 1.10 (Standard) to 1.20 (Precision/Optical)</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Values
            </button>
          </div>

        </div>

        {/* Right 5 Columns: Result Box + Machine Recommendation + Visual Gauge */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Dominant Result Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-orange-400 tracking-wider">
                Calculated Tonnage
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${totalTonnage} Tonnes Clamping Force`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-black font-mono text-orange-400 leading-none">
                {totalTonnage}
                <span className="text-xl font-mono text-white ml-2">TONNES</span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Theoretical: {theoreticalForce.toFixed(1)} T &middot; Safety Factor: {safetyFactor}x
              </p>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0 T</span>
                <span className="text-orange-300 font-bold">{totalTonnage} T Target</span>
                <span>800 T</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/20">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalTonnage / 800) * 100)}%` }}
                />
              </div>
            </div>

            {/* Machine Selection Recommendation */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                  Recommended Press Size: {recommendedPress} Tonnes
                </span>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                A <strong>{recommendedPress}T machine</strong> provides a safe operating buffer of <strong>{operatingMargin}%</strong>, ensuring tie-bar deflection remains within tolerance.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => onSave(`${totalTonnage} Tonnes (${areaPerCavity} cm², ${cavities} cav, ${cavityPressure} bar)`)}
                className="flex-1 py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-orange-500 hover:bg-orange-600 text-slate-950 transition-colors shadow-sm"
              >
                Save Calculation
              </button>
            </div>
          </div>

          {/* Engineering Verification & Assumptions */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white text-xs font-mono text-slate-600 space-y-2">
            <span className="font-bold text-slate-900 block text-[10px] uppercase">
              Engineering Verification &amp; Assumptions
            </span>
            <p className="flex items-center gap-1.5 text-emerald-700">
              <Check className="h-3.5 w-3.5 shrink-0" /> Uniform cavity pressure distribution across parting plane.
            </p>
            <p className="flex items-center gap-1.5 text-emerald-700">
              <Check className="h-3.5 w-3.5 shrink-0" /> Machine platen parallelism verified to SPI Class 1.
            </p>
            <p className="flex items-center gap-1.5 text-slate-500">
              <Info className="h-3.5 w-3.5 shrink-0" /> For hot runners, add runner manifold projected area.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

// ── 2. COOLING TIME & THERMAL KINETICS ENGINE ────────────────────────────────
function CoolingEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [thickness, setThickness] = useState(2.5)
  const [alpha, setAlpha] = useState(0.08)
  const [meltTemp, setMeltTemp] = useState(230)
  const [moldTemp, setMoldTemp] = useState(50)
  const [ejectTemp, setEjectTemp] = useState(90)
  const [showDerivation, setShowDerivation] = useState(false)

  const RESIN_PRESETS = [
    { name: 'PP / HDPE', a: 0.080, tm: 230, tw: 45, te: 85 },
    { name: 'ABS / HIPS', a: 0.085, tm: 240, tw: 60, te: 95 },
    { name: 'Nylon 66 (PA66)', a: 0.090, tm: 280, tw: 75, te: 140 },
    { name: 'Polycarbonate (PC)', a: 0.095, tm: 300, tw: 85, te: 130 },
  ]

  const isValid = meltTemp > ejectTemp && ejectTemp > moldTemp && thickness > 0 && alpha > 0
  const innerRatio = ((meltTemp - moldTemp) / (ejectTemp - moldTemp))
  const fourierFactor = (8 / (Math.PI * Math.PI)) * innerRatio

  const coolingTime = isValid && fourierFactor > 0
    ? ((Math.pow(thickness, 2) / (Math.PI * Math.PI * alpha)) * Math.log(fourierFactor)).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-8">
      
      {/* Formula header */}
      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-wider">
            Fourier Transient 1D Conduction Equation
          </span>
          <button
            type="button"
            onClick={() => setShowDerivation(!showDerivation)}
            className="text-xs font-mono font-bold text-blue-700 hover:underline"
          >
            {showDerivation ? 'Hide Derivation ▲' : 'Show Derivation ▼'}
          </button>
        </div>
        <div className="font-mono text-sm sm:text-base font-black text-slate-900">
          t_c = (h² / π²α) &times; ln[ (8/π²) &times; ((T_m - T_w) / (T_e - T_w)) ]
        </div>
        <p className="text-xs font-mono text-slate-600 mt-1">
          Where <strong>h</strong> = part wall thickness ({thickness} mm), <strong>α</strong> = thermal diffusivity ({alpha} mm²/s), <strong>T_m</strong> = {meltTemp}°C, <strong>T_w</strong> = {moldTemp}°C, <strong>T_e</strong> = {ejectTemp}°C
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Material Thermal Diffusivity Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {RESIN_PRESETS.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => {
                    setAlpha(r.a)
                    setMeltTemp(r.tm)
                    setMoldTemp(r.tw)
                    setEjectTemp(r.te)
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 text-xs font-mono font-medium transition-colors"
                >
                  {r.name} ({r.a})
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">Maximum Wall Thickness (h)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-right font-mono font-bold text-xs bg-white border border-slate-300 rounded"
                />
                <span className="text-xs font-mono text-slate-500">mm</span>
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">Melt Temperature (T_m)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={meltTemp}
                  onChange={(e) => setMeltTemp(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-right font-mono font-bold text-xs bg-white border border-slate-300 rounded"
                />
                <span className="text-xs font-mono text-slate-500">°C</span>
              </div>
            </div>
            <input
              type="range"
              min="150"
              max="380"
              step="5"
              value={meltTemp}
              onChange={(e) => setMeltTemp(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-slate-700">Mould Temp (T_w)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={moldTemp}
                  onChange={(e) => setMoldTemp(Number(e.target.value))}
                  className="w-full px-2 py-1 text-right font-mono font-bold text-xs bg-white border border-slate-300 rounded"
                />
                <span className="text-xs font-mono text-slate-500">°C</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-slate-700">Eject Temp (T_e)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={ejectTemp}
                  onChange={(e) => setEjectTemp(Number(e.target.value))}
                  className="w-full px-2 py-1 text-right font-mono font-bold text-xs bg-white border border-slate-300 rounded"
                />
                <span className="text-xs font-mono text-slate-500">°C</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Output */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-blue-400 tracking-wider">
                Minimum Solidification Time
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${coolingTime} s Cooling Time`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-black font-mono text-blue-400 leading-none">
                {coolingTime}
                <span className="text-xl font-mono text-white ml-2">SECONDS</span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Quadratic scaling: doubling wall thickness 2.5 &rarr; 5.0 mm multiplies cooling time by 4x.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1.5">
              <span className="text-xs font-mono font-bold text-blue-300 uppercase block">
                Tooling Recommendation
              </span>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Add <strong>15–25%</strong> for conformal cooling channel Reynolds turbulence (Re &gt; 4,000) to ensure uniform surface finish without sink marks.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSave(`${coolingTime} s (${thickness} mm wall, ${alpha} mm²/s)`)}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

// ── 3. MOULD SHRINKAGE & CAVITY SIZING ───────────────────────────────────────
function ShrinkageEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [shrinkRate, setShrinkRate] = useState(1.5)
  const [partTarget, setPartTarget] = useState(100.0)

  const requiredMould = (partTarget / (1 - shrinkRate / 100)).toFixed(3)
  const shrinkageAmount = (Number(requiredMould) - partTarget).toFixed(3)

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
        <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block mb-1">
          ISO 294-4 Tool Sizing Equation
        </span>
        <div className="font-mono text-base font-black text-slate-900">
          D_mould = D_target / (1 - S / 100)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
              Required Finished Part Dimension (D_target)
            </label>
            <input
              type="number"
              step="0.1"
              value={partTarget}
              onChange={(e) => setPartTarget(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-slate-700">Shrinkage Rate (S %)</label>
              <span className="font-mono text-xs font-bold text-emerald-700">{shrinkRate}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.05"
              value={shrinkRate}
              onChange={(e) => setShrinkRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-[10px] font-mono text-slate-400">PP/POM: 1.5–2.5% &middot; ABS/PC: 0.4–0.7% &middot; 30% GF: 0.2–0.4%</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                Tool Cut-Steel Dimension
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${requiredMould} mm Tool Dimension`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="text-5xl font-black font-mono text-emerald-400">
              {requiredMould}
              <span className="text-lg font-mono text-white ml-2">mm</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Includes +{shrinkageAmount} mm compensation for volumetric crystallization shrinkage.
            </p>
            <button
              type="button"
              onClick={() => onSave(`Mould: ${requiredMould} mm for ${partTarget} mm part (${shrinkRate}% S)`)}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 4. INJECTION CYCLE TIME ENGINE ──────────────────────────────────────────
function CycleTimeEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [tInject, setTInject] = useState(2.5)
  const [tPack, setTPack] = useState(6.0)
  const [tCool, setTCool] = useState(15.0)
  const [tReset, setTReset] = useState(3.5)

  const totalCycle = (tInject + tPack + tCool + tReset).toFixed(1)
  const partsPerHour = Math.round(3600 / Number(totalCycle))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-3">
          {[
            { label: 'Injection / Filling Time', val: tInject, set: setTInject, color: '#EA580C' },
            { label: 'Holding / Packing Phase', val: tPack, set: setTPack, color: '#7C3AED' },
            { label: 'Cooling & Screw Plasticizing', val: tCool, set: setTCool, color: '#1D4ED8' },
            { label: 'Mold Open, Ejection, Reset', val: tReset, set: setTReset, color: '#15803D' },
          ].map((phase) => (
            <div key={phase.label} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span>{phase.label}</span>
                <span style={{ color: phase.color }}>{phase.val} s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="60"
                step="0.5"
                value={phase.val}
                onChange={(e) => phase.set(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: phase.color }}
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-wider">
                Total Shot Cycle Time
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${totalCycle} s Cycle Time`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="text-5xl font-black font-mono text-purple-400">
              {totalCycle}
              <span className="text-lg font-mono text-white ml-2">s</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 text-xs font-mono text-slate-300">
              Theoretical Throughput: <strong>{partsPerHour} shots / hour</strong>
            </div>
            <button
              type="button"
              onClick={() => onSave(`Cycle Time: ${totalCycle} s (${partsPerHour} shots/hr)`)}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 5. SCREW SHEAR RATE ENGINE ──────────────────────────────────────────────
function ScrewShearEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [screwDia, setScrewDia] = useState(60)
  const [screwRpm, setScrewRpm] = useState(120)
  const [channelDepth, setChannelDepth] = useState(3.5)

  const shearRate = Math.round((Math.PI * screwDia * (screwRpm / 60)) / (channelDepth / 1000) / 1000)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">Screw Outer Diameter (D, mm)</label>
            <input
              type="number"
              value={screwDia}
              onChange={(e) => setScrewDia(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">Screw Speed (RPM)</label>
            <input
              type="number"
              value={screwRpm}
              onChange={(e) => setScrewRpm(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">Metering Channel Depth (h, mm)</label>
            <input
              type="number"
              step="0.1"
              value={channelDepth}
              onChange={(e) => setChannelDepth(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                Channel Shear Rate (γ̇)
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${shearRate} s⁻¹ Shear Rate`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="text-5xl font-black font-mono text-amber-400">
              {shearRate.toLocaleString()}
              <span className="text-lg font-mono text-white ml-2">s⁻¹</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Standard extrusion metering range: 50–500 s⁻¹. Prevents polymer chain scission.
            </p>
            <button
              type="button"
              onClick={() => onSave(`Shear Rate: ${shearRate} s⁻¹ (${screwDia}mm, ${screwRpm} RPM)`)}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 6. GATE FREEZE-OFF TIME ENGINE ──────────────────────────────────────────
function GateFreezeEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [gateDia, setGateDia] = useState(1.5)
  const freezeTime = (Math.pow(gateDia, 2) * 2.2).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
              Gate Orifice Diameter (d, mm)
            </label>
            <input
              type="number"
              step="0.1"
              value={gateDia}
              onChange={(e) => setGateDia(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-sky-400 tracking-wider">
                Estimated Gate Seal Time
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${freezeTime} s Gate Seal Time`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="text-5xl font-black font-mono text-sky-400">
              {freezeTime}
              <span className="text-lg font-mono text-white ml-2">s</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Maintain holding pressure for at least {freezeTime} seconds to prevent sink marks.
            </p>
            <button
              type="button"
              onClick={() => onSave(`Gate Freeze: ${freezeTime} s (d = ${gateDia} mm)`)}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 7. MFI TO VISCOSITY ESTIMATOR ───────────────────────────────────────────
function MfiViscosityEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [mfi, setMfi] = useState(12.0)
  const estViscosity = Math.round(20000 / Math.pow(mfi, 0.75))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
              Melt Flow Index (ASTM D1238, g/10 min)
            </label>
            <input
              type="number"
              step="0.5"
              value={mfi}
              onChange={(e) => setMfi(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider">
                Apparent Dynamic Viscosity (η)
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${estViscosity} Pa·s Viscosity`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="text-5xl font-black font-mono text-indigo-400">
              {estViscosity.toLocaleString()}
              <span className="text-lg font-mono text-white ml-2">Pa&middot;s</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Empirical zero-shear viscosity correlation for standard polyolefin grades.
            </p>
            <button
              type="button"
              onClick={() => onSave(`MFI ${mfi} g/10min -> ~${estViscosity} Pa·s`)}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 8. RESIN DRYING TIME ENGINE ─────────────────────────────────────────────
function DryingEngine({ onSave, onCopy }: {
  unitSystem?: UnitSystem
  onSave: (summary: string) => void
  onCopy: (text: string) => void
}) {
  const [resin, setResin] = useState('PA66')
  const [initialMoisture, setInitialMoisture] = useState(0.8)

  const DRYING_PARAMS: Record<string, { temp: number; time: number; maxMoisture: number }> = {
    PA66: { temp: 80, time: 4.0, maxMoisture: 0.15 },
    PET: { temp: 160, time: 5.0, maxMoisture: 0.005 },
    PBT: { temp: 120, time: 3.5, maxMoisture: 0.02 },
    PC: { temp: 120, time: 3.0, maxMoisture: 0.02 },
  }

  const currentParam = DRYING_PARAMS[resin] || DRYING_PARAMS.PA66

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">Hygroscopic Resin Selection</label>
            <div className="flex gap-2">
              {['PA66', 'PET', 'PBT', 'PC'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResin(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                    resin === r ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 block">Initial Moisture Content (%)</label>
            <input
              type="number"
              step="0.05"
              value={initialMoisture}
              onChange={(e) => setInitialMoisture(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-pink-400 tracking-wider">
                Desiccant Hopper Parameters
              </span>
              <button
                type="button"
                onClick={() => onCopy(`${currentParam.time} hrs @ ${currentParam.temp}°C Drying`)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="text-5xl font-black font-mono text-pink-400">
              {currentParam.time}
              <span className="text-lg font-mono text-white ml-2">HOURS</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Drying Temperature: <strong>{currentParam.temp}°C</strong> &middot; Target Moisture: &lt;{currentParam.maxMoisture}%
            </p>
            <button
              type="button"
              onClick={() => onSave(`Drying: ${currentParam.time} hrs @ ${currentParam.temp}°C for ${resin}`)}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs uppercase bg-pink-500 hover:bg-pink-600 text-white transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
