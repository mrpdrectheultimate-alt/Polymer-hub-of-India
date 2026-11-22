import Link from 'next/link'
import { Check, Crown, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-[#070A12] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Transparent Engineering Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            One platform. One simple plan.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Core learning is free forever. Upgrade when you need advanced shop-floor solvers, full formula derivations, and unlimited AI engineering support.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plan 1: Free Forever */}
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Essential Learning
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Free Forever
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">₹0</span>
                <span className="text-xs font-mono text-slate-400 uppercase">/ Month</span>
              </div>

              <p className="text-xs text-slate-400 font-sans mb-6">
                Complete access to the curriculum, core 3D viewer, and shop-floor defect diagnostics for all students.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 mb-8">
                {[
                  'All 19 core subjects & 216 curriculum lessons',
                  'Interactive 3D molecular viewer (100+ models)',
                  'Shop-floor defect diagnostic troubleshooter',
                  '15 AI Polymer Copilot queries per day',
                  'Daily petrochem spot price benchmarks',
                  'Free access to Official WhatsApp & Telegram channels',
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#waitlist"
              className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 border border-slate-700 shadow-md"
            >
              <span>Join Free Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Plan 2: Premium Engineer */}
          <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white rounded-3xl border-2 border-blue-500/60 p-8 flex flex-col justify-between relative shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Early-Bird Offer
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Full Engineering Suite
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Premium
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">₹149</span>
                <span className="text-xs font-mono text-blue-300 uppercase">/ Month</span>
              </div>

              <p className="text-xs text-slate-300 font-sans mb-6">
                Designed for engineers, GATE aspirants, and researchers requiring complete industrial calculations and RAG AI.
              </p>

              <div className="space-y-3 pt-4 border-t border-blue-900/60 mb-8">
                {[
                  'Everything included in the Free tier',
                  'Full Master Formula Library (98 equations & LaTeX derivations)',
                  'All 8 Industrial Engineering Solvers (Tonnage, Cooling, Shrinkage)',
                  '21 ASTM / ISO Virtual Testing Lab Simulators',
                  'Full-length simulated GATE XE-F mock examinations',
                  'Unlimited RAG AI Polymer Copilot queries',
                  'Downloadable lesson notes with mathematical derivations',
                  'Priority email engineering & technical support',
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-200 font-sans">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="#waitlist"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Lock In Launch Rate &mdash; ₹149</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Statutory 7-day money-back guarantee &middot; Cancel anytime</span>
              </div>
            </div>
          </div>

        </div>

        {/* Institutional / Campus Callout */}
        <div className="mt-12 text-center text-xs font-mono text-slate-500">
          <span>Are you an HOD, faculty member, or CIPET center administrator? </span>
          <Link href="/enterprise" className="text-blue-400 hover:underline font-bold">
            Explore Institutional Campus Licences &rarr;
          </Link>
        </div>

      </div>
    </section>
  )
}
