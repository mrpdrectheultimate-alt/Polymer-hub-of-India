import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Scale, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Upper Navigation Bar */}
      <div className="border-b-4 border-slate-900 bg-slate-900 px-6 py-4 flex items-center justify-between text-white shadow-md">
        <Link href="/education" className="flex items-center gap-1.5 font-mono text-xs font-bold hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Education Hub
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
          COMPARATIVE ANALYTICS
        </span>
      </div>

      {/* Hero Header */}
      <section className="border-b-4 border-slate-900 bg-yellow-400 px-6 md:px-12 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 border-4 border-slate-900 flex items-center justify-center rounded">
                <Scale className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="font-mono text-[10px] font-black text-slate-900 border-2 border-slate-900 px-3 py-1 uppercase tracking-widest rounded bg-white">
                Comparator Engine
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-slate-950 leading-none">
              COMPARE POLYMER<br />
              <span className="italic text-slate-900">ACADEMIC PROGRAMS</span>
            </h1>
            <p className="text-slate-700 max-w-xl text-sm leading-relaxed mt-3 font-medium">
              Compare annual fees, admission pathways, prerequisite requirements, and syllabus highlights side-by-side to make informed higher education decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <ProgramComparator programs={programs} />
      </div>

    </div>
  )
}
