import { Sparkles } from 'lucide-react'

export default function ComparisonTable() {
  const comparisons = [
    {
      category: 'YouTube',
      purpose: 'Video learning & visual walk-throughs',
      approach: 'Structured 216-lesson curriculum with integrated interactive 3D visual models and knowledge checks.',
    },
    {
      category: 'NPTEL & MOOCs',
      purpose: 'Broad academic semester video lectures',
      approach: 'Polymer-focused curriculum combining theoretical principles with 8 shop-floor engineering calculators.',
    },
    {
      category: 'Textbooks & Scanned PDFs',
      purpose: 'In-depth domain theory & documentation',
      approach: 'Searchable digital learning, structured notes, and 98 canonical formula derivations formatted in LaTeX.',
    },
    {
      category: 'Generic Exam Preparation Sites',
      purpose: 'General engineering MCQ test practice',
      approach: 'Polymer-specific GATE XE-F preparation with paper-specific numerical derivations and timed CBT mock engine.',
    },
    {
      category: 'Industry News Portals',
      purpose: 'High-level commercial news & market articles',
      approach: 'Daily petrochem intelligence and domestic resin spot benchmarks linked directly to academic lesson topics.',
    },
    {
      category: 'Specialist Material Databases',
      purpose: 'Isolated raw property data sheets',
      approach: 'Integrated ASTM property comparator, interactive 3D crystal structures, and processing parameter guidance.',
    },
    {
      category: 'Isolated Calculator Scripts',
      purpose: 'Single, disconnected mathematical formulas',
      approach: 'Eight production-grade shop-floor solvers (tonnage, cooling, shrinkage) in one unified engineering workspace.',
    },
    {
      category: 'PolymerHub of India',
      purpose: 'Integrated polymer learning & engineering',
      approach: 'One connected digital platform bringing theory, processing, calculations, and GATE preparation together.',
      isPolymerHub: true,
    },
  ]

  return (
    <section id="comparison" className="py-20 sm:py-24 bg-[#070A12] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            Resource Landscape &middot; Objective Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Why use multiple disconnected resources?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Different educational and industry tools serve different purposes. PolymerHub connects the fragmented pieces of polymer education into one unified digital workspace.
          </p>
          <p className="text-xs text-slate-500 mt-2 font-mono">
            Illustrative category-level comparison &middot; Built to highlight the benefits of an integrated learning approach
          </p>
        </div>

        {/* Comparison Table Container with Mobile Horizontal Scroll */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 pb-4">
          <div className="min-w-[720px] px-4 sm:px-0">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300 font-mono text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold w-1/4">Resource Category</th>
                    <th className="py-4 px-6 text-slate-400 font-bold w-1/3">Primary Purpose</th>
                    <th className="py-4 px-6 text-blue-300 font-bold w-5/12 bg-blue-950/50 border-l border-blue-900/40">
                      PolymerHub Integrated Approach
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs font-sans">
                  {comparisons.map((row) => (
                    <tr 
                      key={row.category} 
                      className={`transition-colors ${
                        row.isPolymerHub 
                          ? 'bg-blue-950/40 font-medium border-t-2 border-blue-500/50' 
                          : 'hover:bg-slate-850/60'
                      }`}
                    >
                      <td className="py-4 px-6 font-bold text-white">
                        {row.isPolymerHub ? (
                          <div className="flex items-center gap-2 text-blue-400 font-extrabold text-sm font-display">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span>{row.category}</span>
                          </div>
                        ) : (
                          <span className="text-slate-200 text-sm font-display font-bold">{row.category}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-400 leading-relaxed font-sans">
                        {row.purpose}
                      </td>
                      <td className={`py-4 px-6 leading-relaxed border-l ${
                        row.isPolymerHub 
                          ? 'border-blue-900/50 text-blue-200 font-semibold bg-blue-950/30' 
                          : 'border-slate-800/80 text-slate-300'
                      }`}>
                        {row.approach}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
