'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  Award, 
  Microscope, 
  FlaskConical, 
  Gauge, 
  Thermometer, 
  Ruler, 
  Zap, 
  Activity, 
  Droplets, 
  Flame, 
  Beaker, 
  Settings, 
  ChevronRight, 
  Search, 
  BookMarked,
  RotateCw,
  BarChart3,
  Layers,
  Globe,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

// Real Simulator Engines
import { TensileTester } from '@/components/TensileTester'
import { MeltFlowIndexer } from '@/components/MeltFlowIndexer'
import { IzodTester } from '@/components/IzodTester'
import { FlexuralTester } from '@/components/FlexuralTester'
import { DSCAnalyzer } from '@/components/DSCAnalyzer'
import { TGAnalyzer } from '@/components/TGAnalyzer'
import { CharpyTester } from '@/components/CharpyTester'
import { HardnessTester } from '@/components/HardnessTester'
import { HazeTester } from '@/components/HazeTester'
import { MvrTester } from '@/components/MvrTester'
import { VicatTester } from '@/components/VicatTester'
import { HDTTester } from '@/components/HDTTester'
import { PolymerizationAnimator } from '@/components/PolymerizationAnimator'
import { InjectionMoldingAnimator } from '@/components/InjectionMoldingAnimator'
import { SpheruliteCrystallizationSimulator } from '@/components/SpheruliteCrystallizationSimulator'
import { PolymerChainFoldingAnimator } from '@/components/PolymerChainFoldingAnimator'
import { ShearThinningVisualizer } from '@/components/ShearThinningVisualizer'
import { InjectionMoldingFlowSimulator } from '@/components/InjectionMoldingFlowSimulator'
import { ExtrusionDieSwellVisualizer } from '@/components/ExtrusionDieSwellVisualizer'
import { RubberVulcanizationSimulator } from '@/components/RubberVulcanizationSimulator'
import { GPCVisualizer } from '@/components/GPCVisualizer'
import Footer from '@/components/Footer'

// ==================== DATA & TYPES ====================

interface LabSession {
  id: string
  lab_id: string
  parameters: Record<string, unknown>
  results: Record<string, unknown>
  xp_awarded: number
  created_at: string
}

interface LabBenchItem {
  id: string
  name: string
  standard: string
  category: 'Mechanical' | 'Thermal' | 'Rheological' | 'Optical' | 'Impact'
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  bgColor: string
  description: string
}

const LAB_BENCHES: LabBenchItem[] = [
  // Mechanical
  { id: 'tensile', name: 'Tensile Strength', standard: 'ASTM D638', category: 'Mechanical', icon: Gauge, color: '#2563EB', bgColor: '#EFF6FF', description: 'Measure tensile strength, Young modulus, yield necking, and elongation at break.' },
  { id: 'flexural', name: 'Flexural 3-Point', standard: 'ASTM D790', category: 'Mechanical', icon: Ruler, color: '#2563EB', bgColor: '#EFF6FF', description: 'Determine flexural modulus and stress at 5% strain under 3-point bending load.' },
  { id: 'hardness', name: 'Shore Hardness', standard: 'ASTM D2240', category: 'Mechanical', icon: Layers, color: '#2563EB', bgColor: '#EFF6FF', description: 'Measure durometer Shore A and Shore D indentation hardness of polymers and elastomers.' },
  // Thermal
  { id: 'dsc', name: 'DSC Calorimeter', standard: 'ASTM D3418', category: 'Thermal', icon: Flame, color: '#F59E0B', bgColor: '#FEF3E8', description: 'Measure glass transition (Tg), crystallization exotherm, and melting endotherm (Tm).' },
  { id: 'tga', name: 'TGA Thermogravimetry', standard: 'ASTM E1131', category: 'Thermal', icon: Thermometer, color: '#F59E0B', bgColor: '#FEF3E8', description: 'Analyze thermal degradation kinetics, decomposition onset, and carbon black filler content.' },
  { id: 'vicat', name: 'Vicat Softening', standard: 'ASTM D1525', category: 'Thermal', icon: Activity, color: '#F59E0B', bgColor: '#FEF3E8', description: 'Determine temperature at which standard needle penetrates 1mm into specimen under load.' },
  { id: 'hdt', name: 'HDT Deflection', standard: 'ASTM D648', category: 'Thermal', icon: Flame, color: '#F59E0B', bgColor: '#FEF3E8', description: 'Measure heat deflection temperature under 0.455 MPa and 1.82 MPa surface stress.' },
  // Rheological
  { id: 'mfi', name: 'Melt Flow Index', standard: 'ASTM D1238', category: 'Rheological', icon: Droplets, color: '#06B6D4', bgColor: '#E8F8FA', description: 'Measure thermoplastic melt flow rate (g/10 min) under 2.16 kg and 5.0 kg standardized weights.' },
  { id: 'mvr', name: 'MVR Volume Rate', standard: 'ISO 1133', category: 'Rheological', icon: Activity, color: '#06B6D4', bgColor: '#E8F8FA', description: 'Measure volumetric melt displacement per 10 minutes at elevated processing temperatures.' },
  // Optical
  { id: 'haze', name: 'Haze & Clarity', standard: 'ASTM D1003', category: 'Optical', icon: Beaker, color: '#EAB308', bgColor: '#FEFCE8', description: 'Measure percent wide-angle light scattering and total luminous transmittance of films.' },
  // Impact
  { id: 'izod', name: 'Izod Impact Pendulum', standard: 'ASTM D256', category: 'Impact', icon: Zap, color: '#EF4444', bgColor: '#FDE8E8', description: 'Measure notched cantilever impact toughness (J/m) under rapid pendulum striking velocity.' },
  { id: 'charpy', name: 'Charpy Impact', standard: 'ASTM D6110', category: 'Impact', icon: Activity, color: '#EF4444', bgColor: '#FDE8E8', description: 'Determine 3-point supported beam fracture energy absorption under high-speed impact.' },
]

const CATEGORIES = [
  { id: 'all', label: 'All Benches', icon: Layers },
  { id: 'Mechanical', label: 'Mechanical', icon: Gauge },
  { id: 'Thermal', label: 'Thermal', icon: Flame },
  { id: 'Rheological', label: 'Rheology', icon: Droplets },
  { id: 'Optical', label: 'Optical', icon: Beaker },
  { id: 'Impact', label: 'Impact', icon: Zap },
]

const MICRO_SIMS = [
  { id: 'polymerization', name: 'Polymerization Reactor', icon: FlaskConical, color: '#2563EB', description: 'Simulate free-radical kinetics, conversion rates, and jacket temperature control.' },
  { id: 'molding', name: 'Injection Molding Cycle', icon: Settings, color: '#F59E0B', description: 'Observe clamping, injection, pack-hold, plasticizing screw recovery, and part ejection.' },
  { id: 'crystallization', name: 'Spherulite Crystallization', icon: Globe, color: '#10B981', description: 'Watch maltese-cross spherulite nucleation and growth from isothermal polymer melt.' },
  { id: 'chain-folding', name: 'Chain Folding Lamellae', icon: Layers, color: '#7C3AED', description: 'Explore polymer chain re-entry and lamellar crystal thickness thermodynamics.' },
  { id: 'shear-thinning', name: 'Shear Thinning Viscosity', icon: Droplets, color: '#06B6D4', description: 'Observe non-Newtonian pseudoplastic viscosity drop under increasing shear rate.' },
  { id: 'mold-flow', name: 'Cavity Mold Flow Front', icon: ArrowRight, color: '#EF4444', description: 'Visualize fountain flow front propagation, weld line formation, and air trap locations.' },
  { id: 'die-swell', name: 'Extrusion Die Swell', icon: BarChart3, color: '#F59E0B', description: 'Simulate elastic recovery and molecular chain relaxation exiting the extrusion nozzle.' },
  { id: 'vulcanization', name: 'Rubber Vulcanization Rheometer', icon: Zap, color: '#8B5CF6', description: 'Plot moving die rheometer (MDR) torque curve, scorch time (ts2), and cure time (tc90).' },
  { id: 'gpc', name: 'GPC / SEC Chromatography', icon: BarChart3, color: '#2563EB', description: 'Analyze retention volume elution curves, Mn, Mw, and polydispersity index (PDI).' },
]

const IIT_LABS = [
  { name: 'Polymerization Reactor', university: 'IIT Kharagpur', icon: FlaskConical, color: '#2563EB', url: 'https://virtual-labs.github.io/exp-polymerization-reactor-iitkgp/', description: 'Simulate reactor kinetics, free-radical rates, and thermal control profiles.' },
  { name: 'Material Mechanics & Molecular Dynamics', university: 'IIT Madras', icon: Gauge, color: '#F59E0B', url: 'https://home.iitm.ac.in/', description: 'Molecular dynamics simulations for polymers, electrolytes, and composites.' },
  { name: 'Mechanical DMA Testing', university: 'IIT Delhi', icon: Activity, color: '#10B981', url: 'https://nptel.ac.in/courses/', description: 'Verify stress-strain and dynamic mechanical analysis (DMA) under loading.' },
]

const STATS = [
  { value: '12', label: 'ASTM / ISO Standards', icon: Microscope },
  { value: '9', label: 'Micro-Simulators', icon: FlaskConical },
  { value: '+15 XP', label: 'Per Completed Trial', icon: Award },
]

// ==================== MAIN COMPONENT ====================

export default function SimulationsPage() {
  const [activeLab, setActiveLab] = useState<string>('tensile')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [history, setHistory] = useState<LabSession[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  // 1. Fetch Supabase Session & Session History
  useEffect(() => {
    setIsLoaded(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [supabase])

  const loadHistory = async () => {
    if (!session) return
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/simulations/sessions')
      if (res.ok) {
        const data = await res.json()
        setHistory(data.sessions || [])
      }
    } catch (err) {
      console.warn('Could not load session history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      loadHistory()
    } else {
      setHistoryLoading(false)
    }
  }, [session])

  // Filtered Lab Benches
  const filteredBenches = useMemo(() => {
    return LAB_BENCHES.filter(bench => {
      const matchCat = selectedCategory === 'all' || bench.category === selectedCategory
      const matchSearch = !searchQuery.trim() || 
        bench.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bench.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bench.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const currentBench = useMemo(() => {
    return LAB_BENCHES.find(b => b.id === activeLab) || LAB_BENCHES[0]
  }, [activeLab])

  const CurrentBenchIcon = currentBench.icon

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Cinematic Virtual Laboratory Environment */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0A2E1A] to-[#0B172A] overflow-hidden py-16 lg:py-24 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              🧪 Virtual Testing Laboratory
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] pb-1 tracking-tight">
              Run the Test.
              <span className="block bg-gradient-to-r from-[#60A5FA] via-[#34D399] to-[#10B981] bg-clip-text text-transparent pb-3 pt-1 leading-[1.15]">
                Watch the Material Respond.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              High-fidelity mechanical tensile pulls, MFI melt flow, DSC crystallization, Izod impact strikes, 
              and GPC molecular weight distributions &mdash; grounded in international ASTM &amp; ISO standards.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 max-w-xl">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 shadow-sm"
                  >
                    <StatIcon className="h-5 w-5 text-[#60A5FA] shrink-0" />
                    <div>
                      <p className="text-white font-bold text-base sm:text-lg font-mono leading-none">{stat.value}</p>
                      <p className="text-slate-300 text-[10px] sm:text-xs font-mono uppercase mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#workspace"
                className="px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all flex items-center gap-2 shadow-md hover:scale-102"
              >
                Enter Active Lab Bench
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveLab('tensile')
                  const el = document.getElementById('workspace')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
              >
                <Play className="h-4 w-4 fill-white" />
                Launch ASTM D638 Tensile
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ASTM/ISO standards, instruments, or tests (e.g. Tensile, DSC, MFI, D638)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-white/15 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder:text-slate-400 text-sm font-sans focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#2563EB]/30 transition-all shadow-inner"
              />
            </div>
          </motion.div>
        </div>

        {/* Tricolor Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* CATEGORY SELECTOR FILTERS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] scale-102'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  <CatIcon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 12 ASTM & ISO LAB BENCHES */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Testing Apparatus</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">12 ASTM &amp; ISO Standards Lab Benches</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{filteredBenches.length} test benches calibrated and ready</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredBenches.map((bench) => {
              const BenchIcon = bench.icon
              const isActive = activeLab === bench.id

              return (
                <motion.button
                  key={bench.id}
                  type="button"
                  onClick={() => {
                    setActiveLab(bench.id)
                    const el = document.getElementById('workspace')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`
                    p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between
                    ${isActive 
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-[0_4px_18px_rgba(37,99,235,0.15)] scale-102' 
                      : 'border-slate-100 hover:border-[#2563EB]/40 bg-white hover:bg-slate-50'
                    }
                  `}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: `${bench.color}15` }}
                    >
                      <BenchIcon className="h-4 w-4" style={{ color: bench.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#111827] truncate">{bench.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono font-bold">{bench.standard}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white uppercase"
                      style={{ backgroundColor: bench.color }}
                    >
                      {bench.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600">+15 XP</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9 PROCESS & MICRO-SIMULATIONS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-[#7C3AED]" />
              <div>
                <span className="text-xs font-mono font-bold text-[#7C3AED] uppercase tracking-wider">Molecular &amp; Process Physics</span>
                <h2 className="text-lg sm:text-xl font-black text-[#111827]">9 Interactive Micro-Simulations</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MICRO_SIMS.map((sim) => {
              const SimIcon = sim.icon
              const isActive = activeLab === sim.id

              return (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => {
                    setActiveLab(sim.id)
                    const el = document.getElementById('workspace')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`
                    p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group
                    ${isActive 
                      ? 'border-[#7C3AED] bg-purple-50/50 shadow-sm' 
                      : 'border-slate-100 hover:border-[#7C3AED]/40 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: `${sim.color}15` }}
                    >
                      <SimIcon className="h-5 w-5" style={{ color: sim.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#111827] truncate group-hover:text-[#7C3AED] transition-colors">{sim.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 font-mono">{sim.description}</p>
                    </div>
                  </div>
                  <Play className="h-4 w-4 text-slate-400 group-hover:text-[#7C3AED] shrink-0 ml-2 transition-colors" />
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACTIVE WORKSPACE SIMULATION BENCH */}
      {/* ============================================================ */}
      <section id="workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-xl overflow-hidden">
          
          {/* Workspace Header Bar */}
          <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 border border-white/20"
              >
                <CurrentBenchIcon className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  {currentBench.name} Testing Workbench
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  {currentBench.standard} &middot; {currentBench.category} Standard Procedure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold uppercase">
                +15 XP on Complete
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-xs font-bold uppercase">
                CALIBRATED
              </span>
            </div>
          </div>

          {/* Workbench Execution Arena */}
          <div className="p-6 sm:p-8 bg-slate-50/50 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLab}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* 12 ASTM/ISO Real Simulation Components */}
                {activeLab === 'tensile' && <TensileTester onComplete={loadHistory} />}
                {activeLab === 'mfi' && <MeltFlowIndexer onComplete={loadHistory} />}
                {activeLab === 'izod' && <IzodTester onComplete={loadHistory} />}
                {activeLab === 'charpy' && <CharpyTester onComplete={loadHistory} />}
                {activeLab === 'flexural' && <FlexuralTester onComplete={loadHistory} />}
                {activeLab === 'hardness' && <HardnessTester onComplete={loadHistory} />}
                {activeLab === 'dsc' && <DSCAnalyzer onComplete={loadHistory} />}
                {activeLab === 'tga' && <TGAnalyzer onComplete={loadHistory} />}
                {activeLab === 'haze' && <HazeTester onComplete={loadHistory} />}
                {activeLab === 'mvr' && <MvrTester onComplete={loadHistory} />}
                {activeLab === 'vicat' && <VicatTester onComplete={loadHistory} />}
                {activeLab === 'hdt' && <HDTTester onComplete={loadHistory} />}

                {/* 9 Molecular & Process Simulators */}
                {activeLab === 'polymerization' && <PolymerizationAnimator />}
                {activeLab === 'molding' && <InjectionMoldingAnimator />}
                {activeLab === 'crystallization' && <SpheruliteCrystallizationSimulator />}
                {activeLab === 'chain-folding' && <PolymerChainFoldingAnimator />}
                {activeLab === 'shear-thinning' && <ShearThinningVisualizer />}
                {activeLab === 'mold-flow' && <InjectionMoldingFlowSimulator />}
                {activeLab === 'die-swell' && <ExtrusionDieSwellVisualizer />}
                {activeLab === 'vulcanization' && <RubberVulcanizationSimulator />}
                {activeLab === 'gpc' && <GPCVisualizer />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Learning Objectives Box */}
          <div className="p-6 bg-white border-t border-slate-200">
            <p className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider mb-2">Core Experimental Competencies Acquired</p>
            <div className="flex flex-wrap gap-2">
              {[
                "ASTM / ISO Standard Specimen Dimensions",
                "Machine Load-Cell Calibration & Crosshead Velocity",
                "Stress-Strain Elastic Modulus & Poisson Ratio",
                "Yield Point Necking & Strain Hardening Kinetics",
                "ASTM D638 Tensile Strength & Elongation at Break",
                "Statistical Standard Deviation & Outlier Elimination"
              ].map((item) => (
                <span key={item} className="px-3 py-1 rounded-full bg-[#F1F5F9] border border-slate-200 text-slate-700 text-xs font-mono">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LAB NOTEBOOK & EXPERIMENTAL HISTORY */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <BookMarked className="h-6 w-6 text-[#2563EB]" />
              <div>
                <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Permanent Research Records</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Virtual Lab Notebook</h2>
              </div>
            </div>

            {session && (
              <button
                type="button"
                onClick={loadHistory}
                className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors"
                title="Refresh trial logs"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Refresh Logs
              </button>
            )}
          </div>

          {!session ? (
            <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
              <span className="text-4xl block mb-2">📓</span>
              <p className="text-sm font-bold text-[#111827]">Sign in to automatically archive your test trials &amp; earn XP</p>
              <p className="text-xs text-slate-500 font-mono mt-1 mb-4">Your stress-strain curves, DSC thermal peaks, and MFI rates persist to your profile.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
              >
                Log In To Save Logs
              </Link>
            </div>
          ) : historyLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
            </div>
          ) : history.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 rounded-2xl p-6">
              <span className="text-4xl block mb-2">🧪</span>
              <p className="text-sm font-bold text-[#111827]">No completed test trials in this session yet</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Run any test bench above to register certified lab trial logs and earn +15 XP.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.map((h) => (
                <div key={h.id} className="p-4 rounded-2xl border border-[#E2E8F0] bg-slate-50/70 hover:bg-white transition-all shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">{h.lab_id}</span>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="font-extrabold text-[#111827] text-sm mt-1 capitalize">{h.lab_id} ASTM Certified Run</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-xs font-mono">
                    <span className="text-emerald-600 font-bold">+{h.xp_awarded} XP Awarded</span>
                    <span className="text-slate-500">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* IIT RESEARCH FACULTY VIRTUAL LABS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏫</span>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Academic Simulators</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">Indian Institutes of Technology (IIT) Curated Simulators</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-0.5">Open lab simulations developed by premier Indian research faculties</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {IIT_LABS.map((lab) => {
              const LabIcon = lab.icon
              return (
                <div 
                  key={lab.name}
                  className="bg-white/10 border border-white/15 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/15 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <LabIcon className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-blue-300 uppercase block">{lab.university}</span>
                        <h4 className="font-bold text-sm text-white">{lab.name}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">{lab.description}</p>
                  </div>

                  <a
                    href={lab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 pt-3 border-t border-white/10 text-xs font-mono font-bold uppercase text-amber-400 hover:text-amber-300"
                  >
                    Open Research Lab
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BRAND-ALIGNED AI LAB SPECIALIST */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0A2E1A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-mono font-bold uppercase mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                AI Lab Specialist
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Need help interpreting your stress-strain data or DSC peaks?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our AI Tutor for step-by-step mathematical derivations of Young&apos;s modulus, yield necking elongation, 
                power-law index, or Avrami crystallization kinetics.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Calculate Young&apos;s Modulus</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Explain Yield Necking</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Derive Power-Law Index</span>
              </div>
            </div>

            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask AI Lab Specialist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}
