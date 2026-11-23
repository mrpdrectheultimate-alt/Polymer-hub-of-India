import Link from 'next/link'
import { Trophy, Clock, Target, CheckCircle2, ArrowRight, AlertCircle, Scale } from 'lucide-react'
import { GATE_CONFIG } from '@/lib/config/gate-config'

export default function GateSection() {
  const syllabusUnits = [
    { code: 'Unit 1', name: 'Chemistry of High Polymers', desc: 'Step-growth, chain-growth, copolymerization kinetics & Carothers equation' },
    { code: 'Unit 2', name: 'Polymer Characterization', desc: 'Molecular weight distribution (Mn, Mw), GPC, DSC, TGA, DMA & FTIR' },
    { code: 'Unit 3', name: 'Synthesis & Properties', desc: 'Commodity polyolefins, engineering thermoplastics & elastomers' },
    { code: 'Unit 4', name: 'Polymer Blends & Composites', desc: 'Thermodynamics of mixing, Flory-Huggins theory & Rule of Mixtures' },
    { code: 'Unit 5', name: 'Polymer Rheology & Processing', desc: 'Power-law flow, shear-thinning, extrusion, injection & blow moulding' },
    { code: 'Unit 6', name: 'Polymer Testing', desc: 'ASTM/ISO tensile, flexural, Izod/Charpy impact, HDT & dielectric strength' },
  ]

  return (
    <section id="gate-xef" className="py-20 sm:py-24 bg-white border-b border-slate-200 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5 text-amber-600" /> Dedicated GATE XE-F Preparation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-950 leading-tight">
            Stop scattering your XE-F preparation across disconnected resources.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 font-sans leading-relaxed">
            GATE Engineering Sciences Paper F (Polymer Science and Engineering) is one of the highest-scoring XE sections when prepared systematically. PolymerHub consolidates syllabus learning, formula derivations, and simulated mock assessments into one environment.
          </p>
        </div>

        {/* Content & Interactive Mock Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left: Syllabus Matrix (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Official {GATE_CONFIG.year} Syllabus Mapping ({GATE_CONFIG.paperCode} / {GATE_CONFIG.previousPaperCode})
              </span>
              <span className="text-[11px] font-mono text-amber-700 font-bold">
                Organizing: {GATE_CONFIG.organizingInstitute}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {syllabusUnits.map((unit) => (
                <div
                  key={unit.code}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      {unit.code}
                    </span>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-950">
                      {unit.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {unit.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Honest Boundary Note */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 font-sans leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5 font-bold">Important Scope Notice:</strong>
                PolymerHub provides deep, specialized preparation specifically for Section F (Polymer Science &amp; Engineering). General Aptitude and Section A (Engineering Mathematics) are separate requirements of the GATE XE paper.
              </div>
            </div>
          </div>

          {/* Right: Simulated Mock Test Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-800 space-y-5 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Mock Engine
              </span>
              <span className="text-xs font-mono text-slate-400">Exam Mode Ready</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-bold text-xl text-white">
                Full-Length Simulated Exam
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Experience real GATE examination conditions with timed navigation, scientific calculator, question palette, and official marking protocols.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>60-Minute strict countdown timer</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span>Official scoring: +1/+2 marks, -0.33/-0.66 negative marking</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-400" />
                <span>MCQ, MSQ, and NAT numerical answer type questions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant score report with step-by-step derivations</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                href="/gate-mock"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Launch Simulated Mock Test</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gate-xe-f"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Full GATE XE-F Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://t.me/polymerhubofindia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>Join Telegram Mastermind 🎯</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
