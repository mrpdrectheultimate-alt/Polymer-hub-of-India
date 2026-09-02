import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Scale, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import ProgramComparator from '@/components/ProgramComparator'
import { Program } from '@/components/EducationDashboard'

// Render dynamically to show fresh database changes
export const dynamic = 'force-dynamic'

export default async function ComparePage() {
  const supabase = createClient()

  // Fetch all programs for select lists
  const { data: programsData } = await supabase
    .from('education_programs')
    .select('*')
    .order('name', { ascending: true })

  const programs: Program[] = ((programsData as unknown as Program[]) || []).map((p) => ({
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-24">
      
      {/* Upper Navigation Bar */}
      <div className="border-b border-slate-800 bg-[#0A1628] px-6 py-3.5 flex items-center justify-between text-white shadow-sm">
        <Link href="/education" className="flex items-center gap-2 font-mono text-xs font-bold hover:text-amber-400 transition-colors text-slate-300">
          <ArrowLeft className="w-4 h-4" /> Back to Education Hub
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
            Verified Academic Data &middot; 2026 Edition
          </span>
        </div>
      </div>

      {/* Hero Header - Clean Academic White/Slate Canvas (No Yellow) */}
      <section className="border-b border-slate-200 bg-white px-6 md:px-12 py-10 md:py-12 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full font-mono text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5 text-blue-600" /> Academic Comparator Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full font-mono text-[11px] font-semibold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Tuition &amp; Cutoffs
              </span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Compare Polymer <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900">
                Engineering &amp; Science Programs
              </span>
            </h1>

            <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed font-normal">
              Make an informed academic decision with verified annual tuition fees, NIRF rankings, entrance exam pathways, eligibility criteria, and syllabus highlights side-by-side.
            </p>
          </div>

          {/* Trust Metadata Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:max-w-xs w-full text-xs space-y-2 shrink-0">
            <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5 uppercase text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sourced from Official Portals
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Curated from official CIPET, CUSAT, ICT Mumbai, Anna University, and IIT prospectuses. Updated for the 2026–2027 academic year.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ProgramComparator programs={programs} />
      </div>

    </div>
  )
}
