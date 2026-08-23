import { createClient } from '@/lib/supabase/server'
import { GraduationCap, Compass, Sparkles, Brain } from 'lucide-react'
import EducationDashboard, { Program, Scholarship } from '@/components/EducationDashboard'
import Link from 'next/link'

// Render dynamically to show fresh database changes
export const dynamic = 'force-dynamic'

export default async function EducationPage() {
  const supabase = createClient()

  // Fetch programs and scholarships in parallel
  const [progRes, scholRes] = await Promise.all([
    supabase.from('education_programs').select('*').order('name', { ascending: true }),
    supabase.from('scholarships').select('*').order('name', { ascending: true })
  ])

  const programs: Program[] = ((progRes.data as unknown as Program[]) || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    institution: p.institution,
    location: p.location,
    country: p.country,
    degree_type: p.degree_type,
    duration: p.duration,
    fees_annual: p.fees_annual,
    ranking: p.ranking,
    admission_process: p.admission_process,
    eligibility: p.eligibility,
    curriculum_highlights: p.curriculum_highlights || [],
    website_url: p.website_url,
    is_indian: p.is_indian
  }))

  const scholarships: Scholarship[] = ((scholRes.data as unknown as Scholarship[]) || []).map((s) => ({
    id: s.id,
    name: s.name,
    provider: s.provider,
    amount: s.amount,
    eligibility: s.eligibility,
    deadline: s.deadline,
    apply_url: s.apply_url,
    description: s.description,
    is_indian: s.is_indian
  }))

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      
      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Academic Hub &middot; 85+ Global Programs &middot; 17 Fellowships &middot; 15+ Countries
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Find Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Polymer Education Path
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Explore 85+ undergraduate and postgraduate degrees across premier Indian institutes (CIPET, IITs, ICT) and top global research universities with funding fellowships.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">{programs.length || '85+'}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Curated Programs</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">{scholarships.length || '17'}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Funding Fellowships</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">15+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Countries Covered</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">B.Sc &rarr; Ph.D</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">All Academic Levels</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Interactive Dashboard ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <EducationDashboard programs={programs} scholarships={scholarships} />
      </div>

      {/* ── BOTTOM AI EDUCATION COUNSELOR CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Education Counselor &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Not sure which degree fits your goals? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Counselor.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Compare syllabus rigor, laboratory infrastructure, alumni placements, and eligibility cutoffs across CIPET, ICT Mumbai, and European Master&apos;s programs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Compare%20B.Tech%20Plastic%20Engineering%20at%20CIPET%20vs%20ICT%20Mumbai%20and%20recommend%20the%20best%20fit%20for%20automotive%20R%26D%20careers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask AI Counselor &rarr;
            </Link>

            <Link
              href="/education/compare"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Side-by-Side Comparison
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
