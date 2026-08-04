import { createClient } from '@/lib/supabase/server'
import { GraduationCap } from 'lucide-react'
import EducationDashboard, { Program, Scholarship } from '@/components/EducationDashboard'

// Revalidate every 6 hours
export const revalidate = 21600

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
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Header */}
      <section className="border-b-4 border-slate-900 bg-yellow-400 px-6 md:px-12 py-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 border-4 border-slate-900 flex items-center justify-center rounded">
                <GraduationCap className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="font-mono text-[10px] font-black text-slate-900 border-2 border-slate-900 px-3 py-1 uppercase tracking-widest rounded bg-white">
                Education Hub
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-slate-900 bg-slate-900 text-yellow-400 px-3 py-1 uppercase tracking-widest rounded">
                Indian & Global programs
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-slate-950 leading-none">
              ACADEMIC OPPORTUNITIES<br />
              <span className="italic text-slate-900">IN POLYMERS & PLASTICS</span>
            </h1>
            <p className="text-slate-700 max-w-xl text-sm leading-relaxed mt-4 font-medium">
              Explore undergraduate and graduate programs across premier Indian institutions and top global research universities, paired with funding fellowships.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <EducationDashboard programs={programs} scholarships={scholarships} />
      </div>

    </div>
  )
}
