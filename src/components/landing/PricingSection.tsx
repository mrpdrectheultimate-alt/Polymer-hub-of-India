import { Check, Crown, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Transparent Engineering Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-950 tracking-tight">
            One platform. One simple plan.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Core learning is free forever. Unlock advanced shop-floor press solvers, full LaTeX formula derivations, and unlimited simulated GATE mock examinations with one transparent subscription.
          </p>
        </div>

        {/* Pricing Cards Grid — Both in Matching Black with Premium Highlighted */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Plan 1: Free Forever (Normal Black Card) */}
          <div className="bg-gradient-to-b from-[#0B132B] to-[#090F20] text-white rounded-3xl border border-slate-800 p-8 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Essential Learning
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                  Free Forever
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">₹0</span>
                <span className="text-xs font-mono text-slate-400 uppercase">/ Month</span>
              </div>

              <p className="text-xs text-slate-300 font-sans mb-6 leading-relaxed">
                Complete access to the curriculum, core 3D molecular viewer, and shop-floor defect diagnostics for all students.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 mb-8">
                {[
                  'All 19 core subjects & 216 curriculum lessons online',
                  '3 Core shop-floor press solvers (Tonnage, Shrinkage, Cycle Time)',
                  '3 Foundational ASTM testing labs (Tensile, MFI, Izod Impact)',
                  '20+ Base & engineering polymers property specs (PP, HDPE, PC, PA66)',
                  '15 AI Polymer Copilot queries per day',
                  'GATE 2025–2026 PYQ papers & 5-question demo CBT mock test',
                  'Interactive 3D molecular viewer (100+ models)',
                  '3 Offline A4 PDF lesson notes per month',
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-200 font-sans">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#waitlist"
              className="w-full py-4 rounded-xl font-mono font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 border border-slate-700 shadow-md"
            >
              <span>Get Free Day-1 Access</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Plan 2: Premium (Same Black Base + Electric Blue & Amber Highlight) */}
          <div className="bg-gradient-to-b from-[#0B132B] to-[#090F20] text-white rounded-3xl border-2 border-blue-500 p-8 flex flex-col justify-between shadow-[0_0_45px_rgba(37,99,235,0.28)] relative overflow-hidden group">
            
            {/* Top Luminous Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-mono font-black text-[10px] uppercase px-4 py-1.5 rounded-bl-xl tracking-wider shadow-md">
              Waitlist 50% Off Perks
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" /> Complete Engineering Suite
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Early-Bird Lock
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">₹149</span>
                <span className="text-xs font-mono text-slate-400 uppercase">/ Month</span>
                <span className="text-[11px] font-mono text-amber-400 font-bold ml-1">
                  (₹74/mo with Waitlist Pass)
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans mb-6 leading-relaxed">
                Full industrial engineering calculators, 12 ASTM testing benches, complete 11-year GATE XE-F archive, and 30-question CBT mock exam with derivations.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 mb-8">
                {[
                  'Everything in Free Core Access included',
                  'All 8 industrial shop-floor press calculators (Cooling, Shear, Gate Freeze)',
                  'All 12 ASTM virtual testing benches with virtual physics simulations',
                  'Full 11-Year GATE XE-F PYQs (2016–2026) with official keys',
                  'Full 30-Question timed GATE CBT mock test with step-by-step LaTeX derivations',
                  'Specialty high-performance aerospace resins (PEEK, PTFE, PVDF, PEI)',
                  'Unlimited AI Polymer Copilot queries & document RAG',
                  'Unlimited offline A4 PDF lesson booklet exports',
                  'Priority member engineering support within 24h',
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-200 font-sans">
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#waitlist"
              className="w-full py-4 rounded-xl font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/35 text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-2xl"
            >
              <span>Lock Early-Bird Rate on Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </a>

          </div>

        </div>

      </div>
    </section>
  )
}
