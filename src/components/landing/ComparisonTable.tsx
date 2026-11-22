import { Check, X, Sparkles } from 'lucide-react'

export default function ComparisonTable() {
  const features = [
    {
      name: 'Structured University Curriculum',
      desc: '19 subjects & 216 lessons mapped to Indian college & CIPET syllabi',
      youtube: 'Fragmented playlists',
      textbooks: 'Dense, static text',
      coaching: 'Generic engineering only',
      polymerhub: 'Complete 216-lesson sequence',
    },
    {
      name: 'Master Formula Library with Derivations',
      desc: '98 equations formatted in LaTeX with step-by-step proofs',
      youtube: false,
      textbooks: 'Unverified manual proofs',
      coaching: 'Brief summary sheets',
      polymerhub: '98 full LaTeX derivations',
    },
    {
      name: 'Shop-Floor Press & Tooling Solvers',
      desc: '8 industrial engineering calculators (clamp force, cooling, shrinkage)',
      youtube: false,
      textbooks: false,
      coaching: false,
      polymerhub: '8 interactive solvers with units',
    },
    {
      name: 'Dedicated GATE XE-F CBT Engine',
      desc: 'Official 60-minute timed mock tests, NAT questions, and negative marking',
      youtube: false,
      textbooks: false,
      coaching: 'General aptitude only',
      polymerhub: 'Full Paper F simulated CBT',
    },
    {
      name: 'Moulding Defect Diagnostic Matrices',
      desc: '24 shop-floor injection moulding defects with parameter adjustments',
      youtube: 'Scattered clips',
      textbooks: 'High-level theory only',
      coaching: false,
      polymerhub: 'Rosato-grounded decision tree',
    },
    {
      name: 'Live Petrochem Spot Price Intelligence',
      desc: 'Daily Reliance/IOCL plant-gate benchmarks & CPCB EPR policies',
      youtube: false,
      textbooks: false,
      coaching: false,
      polymerhub: 'Updated daily benchmarks',
    },
    {
      name: '3D Molecular & Machine Simulator',
      desc: 'Interactive 3D crystal structures, repeat units, and machine assemblies',
      youtube: 'Static video clips',
      textbooks: '2D flat diagrams',
      coaching: false,
      polymerhub: 'Interactive 3D WebGL viewer',
    },
    {
      name: 'Zero-Cost Core Learning Access',
      desc: 'Curriculum lessons, formulas, troubleshooter, and community free forever',
      youtube: 'Free with ads',
      textbooks: '₹1,500+ per textbook',
      coaching: '₹15,000–₹45,000 fees',
      polymerhub: '100% Free core learning',
    },
  ]

  return (
    <section id="comparison" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Objective Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-950 tracking-tight">
            The other options were never built for this.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            When you try to learn polymer engineering from generic coaching centers or fragmented web videos, you spend more time searching than learning.
          </p>
        </div>

        {/* High-Contrast Comparison Table Container (AgentHub Style) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Table Header */}
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-xs font-mono text-slate-700 uppercase">
                  <th className="py-5 px-6 font-bold w-[34%]">
                    Capability / Resource
                  </th>
                  <th className="py-5 px-4 font-bold text-center w-[16%] text-slate-500">
                    YouTube &amp; Videos
                  </th>
                  <th className="py-5 px-4 font-bold text-center w-[16%] text-slate-500">
                    Textbooks &amp; PDFs
                  </th>
                  <th className="py-5 px-4 font-bold text-center w-[16%] text-slate-500">
                    Generic Coaching
                  </th>
                  <th className="py-5 px-6 font-black text-center w-[18%] bg-blue-600 text-white text-sm">
                    PolymerHub
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-sans">
                {features.map((f, idx) => (
                  <tr key={f.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    
                    {/* Feature Name & Description */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-950">
                        {f.name}
                      </div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">
                        {f.desc}
                      </div>
                    </td>

                    {/* YouTube */}
                    <td className="py-4 px-4 text-center text-slate-600 text-xs">
                      {typeof f.youtube === 'boolean' ? (
                        f.youtube ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span>{f.youtube}</span>
                      )}
                    </td>

                    {/* Textbooks */}
                    <td className="py-4 px-4 text-center text-slate-600 text-xs">
                      {typeof f.textbooks === 'boolean' ? (
                        f.textbooks ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span>{f.textbooks}</span>
                      )}
                    </td>

                    {/* Generic Coaching */}
                    <td className="py-4 px-4 text-center text-slate-600 text-xs">
                      {typeof f.coaching === 'boolean' ? (
                        f.coaching ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span>{f.coaching}</span>
                      )}
                    </td>

                    {/* PolymerHub (Highlighted Column) */}
                    <td className="py-4 px-6 text-center font-bold text-blue-900 bg-blue-50/80 border-l border-r border-blue-200">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-blue-700 font-mono font-bold">
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{f.polymerhub}</span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Bottom CTA Hook */}
        <div className="mt-8 text-center">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
          >
            <span>Lock in your free access and join 1,240+ students on the priority waitlist &rarr;</span>
          </a>
        </div>

      </div>
    </section>
  )
}
