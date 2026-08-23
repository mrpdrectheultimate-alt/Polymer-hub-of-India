// src/app/simulations/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
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
import { 
  Award, 
  History, 
  RotateCw, 
  Beaker, 
  Sliders,
  Loader2,
  Sparkles,
  Brain,
  Compass,
  FlaskConical
} from 'lucide-react'

interface LabSession {
  id: string
  lab_id: string
  parameters: Record<string, unknown>
  results: Record<string, unknown>
  xp_awarded: number
  created_at: string
}

const LAB_BENCHES = [
  { id: 'tensile', num: 1, name: 'ASTM D638 Tensile', icon: '📊', category: 'Mechanical', color: 'bg-blue-600' },
  { id: 'mfi', num: 2, name: 'ASTM D1238 MFI', icon: '💧', category: 'Rheology', color: 'bg-orange-600' },
  { id: 'izod', num: 3, name: 'ASTM D256 Izod', icon: '🔨', category: 'Impact', color: 'bg-violet-600' },
  { id: 'charpy', num: 4, name: 'ASTM D6110 Charpy', icon: '⚡', category: 'Impact', color: 'bg-purple-600' },
  { id: 'flexural', num: 5, name: 'ASTM D790 Flexural', icon: '📐', category: 'Mechanical', color: 'bg-amber-600' },
  { id: 'hardness', num: 6, name: 'Shore Hardness', icon: '🎯', category: 'Mechanical', color: 'bg-emerald-600' },
  { id: 'dsc', num: 7, name: 'ASTM D3418 DSC', icon: '🌡️', category: 'Thermal', color: 'bg-red-600' },
  { id: 'tga', num: 8, name: 'ASTM E1131 TGA', icon: '⚖️', category: 'Thermal', color: 'bg-emerald-700' },
  { id: 'haze', num: 9, name: 'ASTM D1003 Haze', icon: '💡', category: 'Optical', color: 'bg-sky-600' },
  { id: 'mvr', num: 10, name: 'ISO 1133 MVR', icon: '🌊', category: 'Rheology', color: 'bg-orange-700' },
  { id: 'vicat', num: 11, name: 'ASTM D1525 Vicat', icon: '🔥', category: 'Thermal', color: 'bg-yellow-600' },
  { id: 'hdt', num: 12, name: 'ASTM D648 HDT', icon: '🏗️', category: 'Thermal', color: 'bg-amber-700' },
]

const MICRO_SIMS = [
  { id: 'polymerization', name: 'Polymerization Reactor', icon: '🧪' },
  { id: 'molding', name: 'Injection Molding Machine', icon: '⚙️' },
  { id: 'crystallization', name: 'Spherulite Cryst.', icon: '🔬' },
  { id: 'chain-folding', name: 'Chain Folding Lamellae', icon: '🧬' },
  { id: 'shear-thinning', name: 'Shear Thinning Viscosity', icon: '📊' },
  { id: 'mold-flow', name: 'Cavity Mold Flow', icon: '🏭' },
  { id: 'die-swell', name: 'Extrusion Die Swell', icon: '🌀' },
  { id: 'vulcanization', name: 'Rubber Vulcanization', icon: '🔥' },
  { id: 'gpc', name: 'GPC / SEC Chromatography', icon: '📈' },
]

export default function SimulationsDashboardPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [activeLab, setActiveLab] = useState<string>('tensile')
  
  // History logs
  const [history, setHistory] = useState<LabSession[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  // 1. Fetch Session
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  // 2. Fetch history logs
  const loadHistory = async () => {
    if (!session) return
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/simulations/sessions')
      if (res.ok) {
        setHistory(await res.json())
      }
    } catch (err) {
      console.error('Failed to load lab sessions history:', err)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeLab])

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Virtual Testing Lab &middot; 12 ASTM Benches &middot; 9 Micro-Sims &middot; IIT Connected
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Polymer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Virtual Testing Lab
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Conduct high-fidelity mechanical tensile pulls, MFI melt flow measurements, DSC crystallization scans, and GPC molecular weight distributions grounded in international ASTM &amp; ISO standards.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">12</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ASTM Standards</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">9</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Micro-Simulators</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">3</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">IIT Labs Linked</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">+15 XP</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Awarded Per Run</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Dashboard Workspace ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Lab Benches Selector Toolbar */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="font-display font-black text-lg uppercase text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-600" /> Lab Benches &mdash; ASTM &amp; ISO Standards
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select an instrument bench below to configure test parameters, run real-time stress/strain curves, and calculate mechanical values.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {LAB_BENCHES.map((bench) => {
              const isActive = activeLab === bench.id
              return (
                <button
                  key={bench.id}
                  onClick={() => setActiveLab(bench.id)}
                  className={`border-2 rounded-xl p-3 text-left transition-all select-none ${
                    isActive
                      ? 'border-slate-900 bg-blue-600 text-white shadow-md -translate-y-0.5'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      Bench {bench.num}
                    </span>
                    <span className="text-base">{bench.icon}</span>
                  </div>
                  <h3 className="font-display font-bold text-xs leading-snug truncate">
                    {bench.name}
                  </h3>
                  <span className={`text-[9px] font-mono uppercase block mt-1 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {bench.category}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Micro-simulations Selector Strip */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              Molecular Micro-Simulations &amp; Process Physics
            </h3>
            <div className="flex flex-wrap gap-2">
              {MICRO_SIMS.map((sim) => {
                const isActive = activeLab === sim.id
                return (
                  <button
                    key={sim.id}
                    onClick={() => setActiveLab(sim.id)}
                    className={`font-mono text-xs font-bold px-3.5 py-2 rounded-xl border-2 transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-white'
                    }`}
                  >
                    <span>{sim.icon}</span>
                    {sim.name}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* ── Active Testing Workspace & Live Logs Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Active Instrument Component (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-xl p-4 sm:p-6">
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
              {activeLab === 'polymerization' && <PolymerizationAnimator />}
              {activeLab === 'molding' && <InjectionMoldingAnimator />}
              {activeLab === 'crystallization' && <SpheruliteCrystallizationSimulator />}
              {activeLab === 'chain-folding' && <PolymerChainFoldingAnimator />}
              {activeLab === 'shear-thinning' && <ShearThinningVisualizer />}
              {activeLab === 'mold-flow' && <InjectionMoldingFlowSimulator />}
              {activeLab === 'die-swell' && <ExtrusionDieSwellVisualizer />}
              {activeLab === 'vulcanization' && <RubberVulcanizationSimulator />}
              {activeLab === 'gpc' && <GPCVisualizer />}
            </div>

            {/* ── IIT Virtual Labs Reference Panel ── */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400 mb-2">
                  <Beaker className="w-3.5 h-3.5" /> Official IIT Virtual Labs
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase">
                  Indian Institutes of Technology (IIT) Curated Simulators
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-1 max-w-2xl">
                  Deepen your experimental understanding by exploring open lab simulations created by premier Indian research faculties.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-blue-300 uppercase block mb-1">IIT Kharagpur</span>
                    <h4 className="font-display font-bold text-sm text-white">Polymerization Reactor</h4>
                    <p className="text-[11px] text-slate-300 font-light mt-1">
                      Simulate reactor kinetics, free-radical rates, and thermal control profiles.
                    </p>
                  </div>
                  <a
                    href="https://virtual-labs.github.io/exp-polymerization-reactor-iitkgp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold text-amber-400 hover:text-amber-300 uppercase flex items-center gap-1"
                  >
                    Open Lab &rarr;
                  </a>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-orange-300 uppercase block mb-1">IIT Madras</span>
                    <h4 className="font-display font-bold text-sm text-white">Material Mechanics</h4>
                    <p className="text-[11px] text-slate-300 font-light mt-1">
                      Molecular dynamics simulations for polymers, electrolytes, and composites.
                    </p>
                  </div>
                  <a
                    href="https://home.iitm.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold text-amber-400 hover:text-amber-300 uppercase flex items-center gap-1"
                  >
                    Open Lab &rarr;
                  </a>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-purple-300 uppercase block mb-1">IIT Delhi</span>
                    <h4 className="font-display font-bold text-sm text-white">Mechanical DMA Testing</h4>
                    <p className="text-[11px] text-slate-300 font-light mt-1">
                      Verify stress-strain and dynamic mechanical analysis (DMA) under loading.
                    </p>
                  </div>
                  <a
                    href="https://nptel.ac.in/courses/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold text-amber-400 hover:text-amber-300 uppercase flex items-center gap-1"
                  >
                    Open Lab &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Completed Trials Logs & XP (1 Column) */}
          <div className="space-y-6">
            
            {/* XP progress card */}
            <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white shadow-md space-y-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
                <Award className="w-4 h-4 text-amber-500" /> Lab XP Milestones
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Completing each simulation run feeds trial data to your research logs and awards <strong>+15 XP points</strong> directly.
              </p>
            </div>

            {/* Completed sessions trials history */}
            <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white shadow-md space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
                  <History className="w-4 h-4 text-blue-600" /> Lab Logs History
                </h3>
                {session && (
                  <button 
                    onClick={loadHistory}
                    className="text-slate-400 hover:text-slate-950 p-1"
                    title="Refresh logs"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {!session ? (
                <div className="py-4 text-center space-y-3">
                  <p className="text-xs text-slate-400">Login to save your experimental runs to your permanent profile.</p>
                  <Link href="/login" className="inline-block bg-slate-900 text-white font-mono text-xs font-bold uppercase px-4 py-2 rounded-xl border border-slate-900 shadow-sm">
                    Log In &rarr;
                  </Link>
                </div>
              ) : historyLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No completed runs recorded yet. Start your first test!</p>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {history.map(item => (
                    <div key={item.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[11px] uppercase text-slate-900">
                          {item.lab_id === 'tensile-astm-d638' ? 'Tensile Test' :
                           item.lab_id === 'mfi-astm-d1238' ? 'Melt Flow Index' :
                           item.lab_id === 'izod-astm-d256' ? 'Izod Impact Test' :
                           item.lab_id === 'charpy-astm-d6110' ? 'Charpy Impact Test' :
                           item.lab_id === 'flexural-astm-d790' ? 'Flexural 3-Point' :
                           item.lab_id === 'hardness-shore-ad' ? 'Shore Hardness' :
                           item.lab_id === 'dsc-astm-d3418' ? 'DSC Thermal Scan' :
                           item.lab_id === 'tga-astm-e1131' ? 'TGA Decomposition' :
                           item.lab_id === 'haze-astm-d1003' ? 'Haze & Transm.' :
                           item.lab_id === 'mvr-iso-1133' ? 'ISO 1133 MVR' :
                           item.lab_id === 'vicat-astm-d1525' ? 'Vicat Softening' :
                           item.lab_id === 'hdt-astm-d648' ? 'HDT Deflection' : 'Lab Test'}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-500 font-mono">
                        Material: {`${item.parameters?.material || ''}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instrument reference specs */}
            <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white shadow-md space-y-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
                <Sliders className="w-3.5 h-3.5 text-blue-600" /> ASTM Standards Specs
              </h4>
              <ul className="space-y-2 font-mono text-[10px] text-slate-500 leading-normal">
                <li>
                  <strong>ASTM D638:</strong> Type I dumbbell specimens tested at standard 5 mm/min speeds.
                </li>
                <li>
                  <strong>ASTM D1238:</strong> Melt flow values depend on load weights (2.16 kg up to 10 kg).
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* ── BOTTOM AI LAB SPECIALIST CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Lab Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Need help interpreting your stress-strain data? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Lab Specialist.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Ask for calculation breakdowns of Young&apos;s modulus, yield elongation, shear thinning power-law index, or crystallization kinetics from your simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Explain%20how%20to%20calculate%20Young's%20Modulus%20and%20Yield%20Stress%20from%20an%20ASTM%20D638%20tensile%20test%20simulation"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Lab Specialist &rarr;
            </Link>

            <Link
              href="/subjects/polymer-testing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Polymer Testing Syllabus
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
