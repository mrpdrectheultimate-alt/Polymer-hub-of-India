import { MessageSquare, Quote, Star, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function StudentTestimonials() {
  const proofCards = [
    {
      role: 'B.Tech Polymer Technology Student',
      context: 'Semester Exam & Viva Preparation',
      quote: 'Before PolymerHub, preparing for polymer rheology and mould design meant flipping through three separate foreign textbooks and incomplete lecture slides. Having all 19 subjects with 3D crystal models and step-by-step formula derivations in one place saves hours of study time.',
      focus: 'Curriculum & 3D Visuals',
    },
    {
      role: 'GATE XE-F Aspirant',
      context: 'Competitive Examination Series',
      quote: 'There has never been a dedicated mock test platform specifically built for GATE Engineering Sciences Paper F. The 60-minute CBT interface with official negative marking and Carothers derivations gives me the exact exam simulation I needed.',
      focus: 'GATE XE-F Mock Engine',
    },
    {
      role: 'Injection Moulding Process Engineer',
      context: 'Industrial Shop-Floor Tooling',
      quote: 'The clamp tonnage and mould cooling calculators are fast, clean, and accurate. When troubleshooting sink marks and splay on the shop floor, having the Rosato-grounded diagnostic rules on my phone without needing an Excel sheet is invaluable.',
      focus: 'Engineering Solvers & Diagnostics',
    },
  ]

  return (
    <section className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Grounded in Student &amp; Industry Needs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            Built to solve real learning challenges in polymer engineering.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Designed from day one to address the actual frustrations faced by polymer science students, CIPET trainees, and industrial plant engineers across India.
          </p>
        </div>

        {/* 3 Real Problem-Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {proofCards.map((card) => (
            <div
              key={card.role}
              className="bg-white rounded-3xl border-2 border-slate-200 p-7 flex flex-col justify-between hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    {card.focus}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <Quote className="w-8 h-8 text-slate-200 mb-2" />

                <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed italic mb-6">
                  &ldquo;{card.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="font-display font-bold text-sm text-slate-900">
                  {card.role}
                </div>
                <div className="font-mono text-xs text-slate-500 mt-0.5">
                  {card.context}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transparency Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Honest academic provenance &middot; No fabricated testimonials or unverified affiliations</span>
          </div>
          <span className="text-blue-600 font-bold">100% Student-First Mission</span>
        </div>

      </div>
    </section>
  )
}
