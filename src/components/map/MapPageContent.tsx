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
  Layers
} from 'lucide-react'
import Footer from '@/components/Footer'
import { GATE_SECTIONS, GOAL_OPTIONS, FIRST_WEEK_STEPS } from '@/lib/map/map-data'
import { searchPlatformMap } from '@/lib/map/map-utils'

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
  Trophy
}

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

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-3 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search any topic, equation, or tool (e.g., GATE XE-F, clamping force, rPET, Carothers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-blue-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 font-bold"
                >
                  Clear
                </button>
              )}
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
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Compass className="w-6 h-6 text-blue-600" />
              Section 1: &quot;I Want To...&quot; Goal Router
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Select your immediate learning objective to jump directly to the right page and tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GOAL_OPTIONS.map((option) => {
              const IconComp = ICON_MAP[option.iconName] || BookOpen
              const isSelected = selectedGoal === option.id

              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedGoal(isSelected ? null : option.id)}
                  className={`bg-white border-2 rounded-2xl p-5 cursor-pointer transition flex flex-col justify-between shadow-xs ${
                    isSelected ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 font-display">{option.goalText}</h3>
                    </div>

                    <div className="text-xs space-y-2 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Primary Target:</span>
                        <Link
                          href={option.primaryDestination.link}
                          className="font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 font-mono text-xs"
                        >
                          <span>{option.primaryDestination.name}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Secondary Tool:</span>
                        <Link
                          href={option.secondaryDestination.link}
                          className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>{option.secondaryDestination.name}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 2: GATE 2026 XE-F 9 Official Sections Mapping */}
        <section id="gate-sections" className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Award className="w-6 h-6 text-purple-600" />
              Section 2: GATE 2026 XE-F Syllabus Section Mapping (9 Official Sections)
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Official IIT Guwahati GATE XE-F Polymer Science &amp; Engineering syllabus mapped directly to PolymerHub subjects and lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GATE_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                className="bg-white border-2 border-slate-200 hover:border-purple-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-50 text-purple-800 border border-purple-200 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded">
                      Section {sec.number}
                    </span>
                    <span className="text-xs text-amber-500 font-mono font-bold">
                      {'⭐'.repeat(sec.relevanceStars)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 font-display">{sec.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{sec.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                    <span className="font-medium">Mapped Subjects:</span>
                    <span className="text-blue-700 font-bold truncate max-w-[150px]">{sec.subjects.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                    <span className="font-medium">Curriculum Lessons:</span>
                    <span className="text-emerald-700 font-bold">{sec.totalLessons} Lessons</span>
                  </div>
                  <Link
                    href={sec.link}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl transition shadow-xs font-mono uppercase tracking-wider"
                  >
                    <span>Study Section Lessons</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Your First Week on PolymerHub */}
        <section id="first-week" className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 font-display">
              <Zap className="w-6 h-6 text-amber-500" />
              Section 3: Your First Week on PolymerHub (Beginner Guide)
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              A 7-day recommended step-by-step roadmap to get 100% value out of PolymerHub without feeling overwhelmed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {FIRST_WEEK_STEPS.map((step) => {
              const StepIcon = ICON_MAP[step.iconName] || CheckCircle2

              return (
                <div key={step.day} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:bg-white hover:border-blue-400 transition-all shadow-xs">
                  <div className="space-y-2">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded">
                      Day {step.day}
                    </span>
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-lg w-fit border border-blue-200">
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 font-display">{step.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-tight font-normal">{step.action}</p>
                  </div>

                  <Link
                    href={step.link}
                    className="text-[11px] font-mono text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 pt-2 border-t border-slate-200"
                  >
                    <span>{step.destination} &rarr;</span>
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
