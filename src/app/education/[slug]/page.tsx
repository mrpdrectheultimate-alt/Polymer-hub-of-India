import { createClient as createDirectClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GraduationCap, ArrowLeft, Landmark, DollarSign, Clock, ListChecks, CheckCircle, ExternalLink, Scale } from 'lucide-react'

// Render dynamically to show fresh database changes
export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: program } = await supabase
    .from('education_programs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!program) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Upper Navigation Bar */}
      <div className="border-b-4 border-slate-900 bg-slate-900 px-6 py-4 flex items-center justify-between text-white shadow-md">
        <Link href="/education" className="flex items-center gap-1.5 font-mono text-xs font-bold hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Education Hub
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
          PROGRAM DOSSIER
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Textbook-Style Program Detail Card */}
        <article className="border-4 border-slate-900 bg-white rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_#000]">
          
          {/* Header Block */}
          <div className="bg-yellow-400 border-b-4 border-slate-900 p-6 md:p-8">
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className="font-mono text-[9px] font-black border-2 border-slate-900 px-3 py-1 uppercase rounded-md bg-slate-900 text-white shadow-[1px_1px_0px_0px_#000]">
                {program.degree_type}
              </span>
              <span className="font-mono text-[9px] font-black border-2 border-slate-900 px-3 py-1 uppercase rounded bg-white text-slate-900">
                {program.country}
              </span>
            </div>
            
            <h1 className="font-display font-black text-2xl md:text-3xl text-slate-950 leading-tight">
              {program.name}
            </h1>
            <h2 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider mt-1">
              {program.institution}
            </h2>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-xs text-slate-800 font-mono font-medium">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-slate-900" /> {program.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-900" /> Duration: {program.duration}
              </span>
              {program.ranking && (
                <span className="flex items-center gap-1.5 bg-yellow-500/20 border border-slate-900/30 px-2 py-0.5 rounded">
                  ⭐ {program.ranking}
                </span>
              )}
            </div>
          </div>

          {/* Details Body Grid */}
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Fees & Funding Block */}
            <div className="border-2 border-slate-200 bg-slate-50 p-5 rounded-xl">
              <h3 className="font-mono text-xs font-black text-slate-500 uppercase tracking-widest block mb-3.5">
                💰 Fees & Funding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 border-2 border-slate-900 flex items-center justify-center rounded">
                    <DollarSign className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block">Annual Tuition Fees</span>
                    <span className="text-sm font-black text-slate-800 font-mono">{program.fees_annual}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 border-2 border-slate-900 flex items-center justify-center rounded">
                    <GraduationCap className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block">Fellowships & Scholarships</span>
                    <span className="text-xs font-semibold text-slate-700 leading-snug">Multiple state & structural options listed on central board.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admission Process & Eligibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="font-mono text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-slate-400" /> Admission Pathways
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {program.admission_process}
                </p>
              </div>

              <div className="border-2 border-slate-200 rounded-xl p-5 space-y-3">
                <h4 className="font-mono text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-slate-400" /> Academic Eligibility
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {program.eligibility}
                </p>
              </div>
            </div>

            {/* Curriculum Highlights */}
            {program.curriculum_highlights && program.curriculum_highlights.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-mono text-xs font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-900 pb-2">
                  📚 Core Curriculum Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {program.curriculum_highlights.map((highlight: string) => (
                    <div key={highlight} className="flex gap-2 items-start text-xs text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link out & Compare buttons */}
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-3">
              {program.website_url && (
                <a
                  href={program.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] font-black uppercase tracking-widest py-3 rounded-lg transition-colors border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]"
                >
                  Visit Official Website <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link
                href={`/education/compare?prefA=${program.slug}`}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-mono text-[10px] font-black uppercase tracking-widest py-3 rounded-lg transition-colors border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]"
              >
                <Scale className="w-4 h-4" /> Compare Program
              </Link>
            </div>

          </div>

        </article>

      </div>

    </div>
  )
}
