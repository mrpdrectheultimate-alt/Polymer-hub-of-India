import { Check, X, Minus, Sparkles } from 'lucide-react'

export default function ComparisonTable() {
  const rows = [
    {
      need: 'Structured Polymer Curriculum',
      youtube: 'Random playlists',
      nptel: 'Semester courses',
      specialist: 'Not primary focus',
      polymerhub: '19 subjects / 216 lessons',
      highlight: true,
    },
    {
      need: 'Interactive 3D Molecules & Products',
      youtube: '2D video animations',
      nptel: 'Static slides / drawings',
      specialist: 'Limited 2D diagrams',
      polymerhub: '100+ 3D rotatable models',
      highlight: true,
    },
    {
      need: 'Engineering Calculators & Solvers',
      youtube: 'Manual worked examples',
      nptel: 'Mathematical derivations',
      specialist: 'Generic web scripts',
      polymerhub: '8 integrated ASTM/ISO solvers',
      highlight: true,
    },
    {
      need: 'Shop-Floor Defect Troubleshooting',
      youtube: 'Scattered machine videos',
      nptel: 'Theoretical processing lectures',
      specialist: 'Isolated article guides',
      polymerhub: 'Rosato handbook diagnostics',
      highlight: true,
    },
    {
      need: 'GATE XE-F Numerical Practice & Mocks',
      youtube: 'Scattered PYQ walk-throughs',
      nptel: 'Course assignment sheets',
      specialist: 'Not supported',
      polymerhub: 'Dedicated mock tests & derivations',
      highlight: true,
    },
    {
      need: 'Curriculum-Grounded AI Copilot',
      youtube: 'None / General AI chatbots',
      nptel: 'None',
      specialist: 'Generic keyword search',
      polymerhub: 'RAG AI grounded in 216 lessons',
      highlight: true,
    },
    {
      need: 'Daily Petrochem Spot Benchmarks',
      youtube: 'Infrequent market commentary',
      nptel: 'None (Academic)',
      specialist: 'High-cost paywalled data',
      polymerhub: 'Indicative domestic benchmarks',
      highlight: true,
    },
  ]

  return (
    <section id="comparison" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            Honest Category Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            Stop jumping between disconnected resources.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            <strong className="text-slate-900 font-semibold">YouTube</strong> helps you discover. <strong className="text-slate-900 font-semibold">NPTEL</strong> helps you study academic theory. <strong className="text-slate-900 font-semibold">Specialist databases</strong> provide isolated specs. <strong className="text-blue-700 font-bold">PolymerHub</strong> connects polymer science, engineering tools, and exam preparation into one cohesive experience.
          </p>
        </div>

        {/* Desktop Comparison Table (Hidden on small mobile) */}
        <div className="hidden md:block overflow-hidden bg-white rounded-3xl border-2 border-slate-200 shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-900 font-mono text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold w-1/4">Learning &amp; Tooling Need</th>
                <th className="py-4 px-5 text-slate-600 font-medium">YouTube</th>
                <th className="py-4 px-5 text-slate-600 font-medium">NPTEL</th>
                <th className="py-4 px-5 text-slate-600 font-medium">Specialist Databases</th>
                <th className="py-4 px-6 bg-blue-600 text-white font-bold w-1/4">PolymerHub of India</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-sans">
              {rows.map((row) => (
                <tr key={row.need} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 font-display text-sm">
                    {row.need}
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    {row.youtube}
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    {row.nptel}
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    {row.specialist}
                  </td>
                  <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-900 border-l border-blue-200">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      {row.polymerhub}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards (Visible on mobile only) */}
        <div className="md:hidden space-y-4">
          {rows.map((row) => (
            <div key={row.need} className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-display font-bold text-sm text-slate-950">
                {row.need}
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="font-mono text-[10px] uppercase text-slate-400">YouTube:</span>
                  <span>{row.youtube}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-mono text-[10px] uppercase text-slate-400">NPTEL:</span>
                  <span>{row.nptel}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-mono text-[10px] uppercase text-slate-400">Specialist:</span>
                  <span>{row.specialist}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-blue-900 bg-blue-50/60 p-2 rounded-lg">
                  <span className="font-mono text-[10px] uppercase text-blue-700">PolymerHub:</span>
                  <span>{row.polymerhub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
