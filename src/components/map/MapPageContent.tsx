'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Compass, 
  Search, 
  GraduationCap, 
  BookOpen, 
  Wrench, 
  MessageCircle, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Flame, 
  Building2, 
  Calculator, 
  Scale, 
  FlaskConical, 
  Globe, 
  FileText, 
  Brain, 
  Trophy,
  ExternalLink,
  Layers,
  Sparkles,
  Check
} from 'lucide-react'
import Footer from '@/components/Footer'
import { GATE_SECTIONS, GOAL_OPTIONS, FIRST_WEEK_STEPS } from '@/lib/map/map-data'
import { searchPlatformMap } from '@/lib/map/map-utils'
import { GATE_CONFIG } from '@/lib/config/gate-config'

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
  Calculator,
  Wrench,
  Flame,
  Scale,
  Building2,
  Award,
  FlaskConical,
  Zap,
  FileText,
  Globe,
  Brain,
  Trophy,
  Sparkles
}

const SEARCH_SUGGESTIONS = [
  'clamping force',
  'Carothers',
  `GATE ${GATE_CONFIG.paperCode}`,
  'rPET',
  'Flory-Huggins',
  'MFI',
  'die swell',
  'LCA GWP'
]

// Section-specific left accent borders
const SECTION_ACCENTS = [
  'border-l-blue-600',
  'border-l-indigo-600',
  'border-l-emerald-600',
  'border-l-teal-600',
  'border-l-amber-600',
  'border-l-purple-600',
  'border-l-rose-600',
  'border-l-cyan-600',
  'border-l-slate-700'
]

export default function MapPageContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const searchResults = searchPlatformMap(searchQuery)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Hero Header */}
      <section className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider shadow-xs">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-blue-600" />
            PolymerHub Official Orientation Map &amp; Learning GPS
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 font-display">
            The Master Site Map &amp; <br />
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 bg-clip-text text-transparent">
              Learning Guide for PolymerHub
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Understand every page, tool, subject, and exam resource on PolymerHub. Find what you need in under 10 seconds and follow your personalized learning pathway.
          </p>

          {/* Search Bar with Suggestion Chips (Fix 2.5) */}
          <div className="max-w-2xl mx-auto pt-3 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={`Search any topic, equation, or tool (e.g., GATE ${GATE_CONFIG.paperCode}, clamping force, rPET, Carothers)...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-blue-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500">
              <span className="font-mono text-[11px] font-semibold text-slate-400">Try:</span>
              {SEARCH_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => setSearchQuery(sug)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-full font-mono text-[11px] font-medium transition cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Dropdown Results */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-xl z-50 space-y-2 max-h-80 overflow-y-auto text-left">
                {searchResults.length > 0 ? (
                  searchResults.map((res, idx) => (
                    <Link
                      key={idx}
                      href={res.link}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 text-xs transition group"
                    >
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 block mb-0.5">
                          {res.title}
                        </span>
                        <span className="text-[11px] text-slate-600 font-sans">{res.description}</span>
                      </div>
                      <span className="font-mono text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 font-bold">
                        {res.category}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching platform routes found for &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-16">
        {/* SECTION 1: "I Want To..." Goal Router */}
        <section id="goal-router" className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-200">
              Section 1
            </span>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Compass className="w-6 h-6 text-blue-600" />
              &quot;I Want To...&quot; Goal Router
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Select your immediate learning objective to jump directly to the right page and tools.
            </p>
          </div>

          {/* Equal Height Goal Grid (Fix 2.1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {GOAL_OPTIONS.map((option) => {
              const IconComp = ICON_MAP[option.iconName] || BookOpen
              const isSelected = selectedGoal === option.id

              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedGoal(isSelected ? null : option.id)}
                  className={`bg-white border-2 rounded-2xl p-5 cursor-pointer transition flex flex-col justify-between shadow-xs min-h-[180px] h-full hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 font-display leading-snug">{option.goalText}</h3>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-100 flex flex-col gap-2">
                    <Link
                      href={option.primaryDestination.link}
                      className="w-full inline-flex items-center justify-between py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl font-bold font-mono text-xs transition"
                    >
                      <span className="truncate pr-1">{option.primaryDestination.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    </Link>
                    <Link
                      href={option.secondaryDestination.link}
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-mono text-[11px] px-1 font-medium transition truncate"
                    >
                      <span className="text-slate-400">Tool:</span>
                      <span className="truncate">{option.secondaryDestination.name}</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 2: GATE 2027 XE5 9 Official Sections Mapping */}
        <section id="gate-sections" className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-purple-200">
              Section 2
            </span>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Award className="w-6 h-6 text-purple-600" />
              GATE {GATE_CONFIG.year} ({GATE_CONFIG.paperCode}) Syllabus Section Mapping (9 Official Sections)
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Official {GATE_CONFIG.organizingInstitute} GATE {GATE_CONFIG.paperCode} ({GATE_CONFIG.paperName}) syllabus mapped directly to PolymerHub subjects and lessons.
            </p>
          </div>

          {/* Section Cards with Coverage Bars (Fix 2.2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GATE_SECTIONS.map((sec, idx) => {
              const accentBorder = SECTION_ACCENTS[idx % SECTION_ACCENTS.length]
              // Calculate syllabus coverage depth percentage
              const coveragePct = Math.min(100, Math.round((sec.totalLessons / 32) * 100))

              return (
                <article
                  key={sec.id}
                  className={`bg-white border-2 border-slate-200 border-l-4 ${accentBorder} hover:border-purple-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-purple-50 text-purple-800 border border-purple-200 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded">
                        Section {sec.number}
                      </span>
                      <span className="text-xs text-amber-500 font-mono font-bold tracking-tight">
                        {'⭐'.repeat(sec.relevanceStars)}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 font-display leading-tight">{sec.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{sec.description}</p>

                    {/* Mapped Subjects as Full Chips (Fix 2.2) */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 block">
                        Mapped Subjects:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sec.subjects.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Coverage Progress Bar (Fix 2.2) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 mb-1">
                        <span>Curriculum Depth</span>
                        <span className="font-bold text-blue-700">{sec.totalLessons} Lessons ({coveragePct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${coveragePct}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={sec.link}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl transition shadow-xs font-mono uppercase tracking-wider text-center"
                      >
                        <span>Lessons</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </Link>
                      {sec.formulaLink ? (
                        <Link
                          href={sec.formulaLink}
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-800 border border-blue-200 rounded-xl transition font-mono uppercase tracking-wider text-center"
                        >
                          <Calculator className="w-3.5 h-3.5 text-blue-600" />
                          <span>Formulas</span>
                        </Link>
                      ) : (
                        <Link
                          href="/formulas"
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl transition font-mono uppercase tracking-wider text-center"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Formulas</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* SECTION 3: Your First Week on PolymerHub (Vertical Timeline - Fix 2.3) */}
        <section id="first-week" className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-200">
              Section 3
            </span>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Zap className="w-6 h-6 text-amber-500" />
              Your First Week on PolymerHub (7-Day Guided Roadmap)
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              A 7-day recommended step-by-step roadmap to get 100% value out of PolymerHub without feeling overwhelmed.
            </p>
          </div>

          {/* Structured Vertical Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {FIRST_WEEK_STEPS.map((step) => {
              const StepIcon = ICON_MAP[step.iconName] || CheckCircle2

              return (
                <div key={step.day} className="relative flex items-start gap-4 sm:gap-6 group">
                  {/* Timeline Circular Marker */}
                  <div className="absolute -left-6 sm:-left-8 top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-blue-600 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {String(step.day).padStart(2, '0')}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 hover:bg-white hover:border-blue-400 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 font-display">{step.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.action}</p>
                    </div>

                    <Link
                      href={step.link}
                      className="px-4 py-2 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-blue-700 text-xs font-mono font-bold rounded-xl transition flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
                    >
                      <span>{step.destination}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 4: Final CTA Before Footer (Fix 2.6) */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-2 border-blue-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Empowering Next-Gen Polymer Engineers
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Ready to Begin Your GATE {GATE_CONFIG.year} Preparation?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Take the 10-question GATE {GATE_CONFIG.paperCode} diagnostic test to benchmark your baseline readiness, or dive into any of the 19 curriculum subjects.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/gate-mock"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition font-mono uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>Start Diagnostic Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/subjects"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 font-bold text-xs rounded-xl shadow-xs transition font-mono uppercase tracking-wider"
            >
              Browse All 19 Subjects
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
