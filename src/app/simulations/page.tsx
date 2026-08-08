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
import { PolymerizationAnimator } from '@/components/PolymerizationAnimator'
import { InjectionMoldingAnimator } from '@/components/InjectionMoldingAnimator'
import { 
  Award, 
  History, 
  RotateCw, 
  Beaker, 
  Sliders,
  ChevronRight,
  Loader2
} from 'lucide-react'

interface LabSession {
  id: string
  lab_id: string
  parameters: Record<string, unknown>
  results: Record<string, unknown>
  xp_awarded: number
  created_at: string
}

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
    <div className="min-h-screen bg-canvas text-slate-900 pb-20 dark:text-slate-100">
      <div className="h-2 bg-blue-600" />

      {/* Top Banner */}
      <section className="border-b-4 border-slate-900 bg-slate-900 text-white px-6 py-8 relative overflow-hidden dark:border-slate-800">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
                <Beaker className="w-4 h-4 text-white" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">Virtual Labs</span>
            </div>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight leading-none">
              🧪 Interactive Simulations
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
              Conduct high-fidelity mechanical pulls and extrusion measurements. Calibrate properties and generate charts grounded in international standards.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left / Center: Interactive Lab workspace */}
          <div className="lg:col-span-3 space-y-6">
            
             {/* Lab Bench & Animation Selectors */}
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <button
                 onClick={() => setActiveLab('tensile')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'tensile' 
                     ? 'bg-blue-600 text-white' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Lab Bench 1</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">ASTM D638 Tensile</h3>
               </button>

               <button
                 onClick={() => setActiveLab('mfi')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'mfi' 
                     ? 'bg-orange-600 text-white' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Lab Bench 2</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">ASTM D1238 MFI</h3>
               </button>

               <button
                 onClick={() => setActiveLab('izod')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'izod' 
                     ? 'bg-violet-600 text-white' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Lab Bench 3</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">ASTM D256 Izod</h3>
               </button>

               <button
                 onClick={() => setActiveLab('flexural')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'flexural' 
                     ? 'bg-amber-600 text-white' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Lab Bench 4</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">ASTM D790 Flexural</h3>
               </button>

               <button
                 onClick={() => setActiveLab('dsc')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'dsc' 
                     ? 'bg-red-600 text-white' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Lab Bench 5</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">ASTM D3418 DSC</h3>
               </button>

               <button
                 onClick={() => setActiveLab('tga')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'tga' 
                     ? 'bg-emerald-600 text-white' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Lab Bench 6</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">ASTM E1131 TGA</h3>
               </button>

               <button
                 onClick={() => setActiveLab('polymerization')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'polymerization' 
                     ? 'bg-slate-900 text-white dark:bg-slate-800' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Animation 1</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">Polymerization</h3>
               </button>

               <button
                 onClick={() => setActiveLab('molding')}
                 className={`border-4 border-slate-900 rounded-xl p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-slate-800 dark:shadow-none ${
                   activeLab === 'molding' 
                     ? 'bg-[#4F46E5] text-white' 
                     : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                 }`}
               >
                 <div className="flex items-center justify-between gap-2 mb-1">
                   <span className="font-mono text-[9px] uppercase font-black opacity-85">Animation 2</span>
                   <ChevronRight className="w-4 h-4 shrink-0" />
                 </div>
                 <h3 className="font-display font-black text-xs uppercase">Injection Molding</h3>
               </button>
             </div>

             {/* Active instrument/animation workspace rendering */}
             <div>
               {activeLab === 'tensile' && (
                 <TensileTester onComplete={loadHistory} />
               )}
               {activeLab === 'mfi' && (
                 <MeltFlowIndexer onComplete={loadHistory} />
               )}
               {activeLab === 'izod' && (
                 <IzodTester onComplete={loadHistory} />
               )}
               {activeLab === 'flexural' && (
                 <FlexuralTester onComplete={loadHistory} />
               )}
               {activeLab === 'dsc' && (
                 <DSCAnalyzer onComplete={loadHistory} />
               )}
               {activeLab === 'tga' && (
                 <TGAnalyzer onComplete={loadHistory} />
               )}
               {activeLab === 'polymerization' && (
                 <PolymerizationAnimator />
               )}
               {activeLab === 'molding' && (
                 <InjectionMoldingAnimator />
               )}
             </div>

          </div>

          {/* Right Sidebar: Completed Trials Logs */}
          <div className="space-y-6">
            
            {/* XP progress card */}
            <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none space-y-3">
              <h4 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-500" /> Lab XP Milestones
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal">
                Completing each simulation run feeds trial data to research logs and awards <strong>+15 XP points</strong> directly.
              </p>
            </div>

            {/* Completed sessions trials history */}
            <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between dark:border-slate-800">
                <h3 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-violet-600" /> Lab Logs History
                </h3>
                {session && (
                  <button 
                    onClick={loadHistory}
                    className="text-slate-400 hover:text-slate-950 dark:hover:text-white"
                    title="Refresh logs"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {!session ? (
                <div className="py-4 text-center">
                  <p className="text-[10px] text-slate-400 italic">Login to record your lab runs history.</p>
                  <Link href="/login" className="inline-block mt-3 bg-slate-900 text-white font-mono text-[9px] uppercase font-black px-4 py-2 border-2 border-slate-900 shadow-hard-sm">
                    Log In →
                  </Link>
                </div>
              ) : historyLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No completed runs recorded yet.</p>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {history.map(item => (
                    <div key={item.id} className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[10px] uppercase text-slate-800 dark:text-slate-200">
                          {item.lab_id === 'tensile-astm-d638' ? 'Tensile Test' :
                           item.lab_id === 'mfi-astm-d1238' ? 'Melt Flow Index' :
                           item.lab_id === 'izod-astm-d256' ? 'Izod Impact Test' :
                           item.lab_id === 'flexural-astm-d790' ? 'Flexural 3-Point' :
                           item.lab_id === 'dsc-astm-d3418' ? 'DSC Thermal Scan' :
                           item.lab_id === 'tga-astm-e1131' ? 'TGA Decomposition' : 'Lab Test'}
                        </span>
                        <span className="font-mono text-[8px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-[9px] text-slate-500 font-mono">
                        Material: {`${item.parameters?.material || ''}`}
                      </p>

                      <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-1 mt-1 flex justify-between text-[9px] font-bold">
                        {item.lab_id === 'tensile-astm-d638' && (
                          <>
                            <span>Modulus: {`${item.results?.modulus || ''}`} GPa</span>
                            <span className="text-blue-600">UTS: {`${item.results?.ultimateStrength || ''}`} MPa</span>
                          </>
                        )}
                        {item.lab_id === 'mfi-astm-d1238' && (
                          <>
                            <span>Temp: {`${item.parameters?.temperature || ''}`}°C</span>
                            <span className="text-orange-600">MFI: {`${item.results?.mfi || ''}`} g/10m</span>
                          </>
                        )}
                        {item.lab_id === 'izod-astm-d256' && (
                          <>
                            <span>Absorbed: {`${item.results?.absorbedEnergy || ''}`} J</span>
                            <span className="text-violet-600">Impact: {`${item.results?.impactStrength || ''}`} J/m</span>
                          </>
                        )}
                        {item.lab_id === 'flexural-astm-d790' && (
                          <>
                            <span>Span: {`${item.parameters?.spanRatio || ''}`}:1</span>
                            <span className="text-amber-600">Strength: {`${item.results?.flexStrength || ''}`} MPa</span>
                          </>
                        )}
                        {item.lab_id === 'dsc-astm-d3418' && (
                          <>
                            <span>Tm: {`${item.results?.tm || ''}`}°C</span>
                            <span className="text-red-600">Cryst: {`${item.results?.crystallinity || ''}`}%</span>
                          </>
                        )}
                        {item.lab_id === 'tga-astm-e1131' && (
                          <>
                            <span>Onset: {`${item.results?.onsetTemp || ''}`}°C</span>
                            <span className="text-emerald-600">Residue: {`${item.results?.ashResidue || ''}`}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instrument reference specs */}
            <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none space-y-3">
              <h4 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" /> ASTM Standards Specs
              </h4>
              <ul className="space-y-2 font-mono text-[9px] text-slate-500 leading-normal">
                <li>
                  <strong>ASTM D638 Spec:</strong> Type I dumbbell specimens are tested at standard 5 mm/min speeds unless high elongation requires higher rates.
                </li>
                <li>
                  <strong>ASTM D1238 Spec:</strong> Melt flow values depend heavily on testing weight loads (2.16 kg up to 10 kg) and melting heat. Must cut and weigh precise segments.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
