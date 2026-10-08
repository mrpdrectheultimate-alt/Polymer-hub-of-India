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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Hero Header */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-[#091327] via-[#050C1A] to-[#030712] overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            PolymerHub Official Orientation Map & Learning GPS
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            The Master Site Map & <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Learning Guide for PolymerHub
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Understand every page, tool, subject, and exam resource on PolymerHub. Find what you need in under 10 seconds and follow your personalized learning pathway.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search any topic, equation, or tool (e.g., GATE XE-F, clamping force, rPET, Carothers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#081225] border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-xl transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#081225] border border-slate-700 rounded-xl p-3 shadow-2xl z-50 space-y-2 max-h-80 overflow-y-auto text-left">
                {searchResults.length > 0 ? (
                  searchResults.map((res, idx) => (
                    <Link
                      key={idx}
                      href={res.link}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#040A17] hover:bg-slate-800/80 text-xs transition group"
                    >
                      <div>
                        <span className="font-bold text-white group-hover:text-amber-400 block mb-0.5">
                          {res.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-sans">{res.description}</span>
                      </div>
                      <span className="font-mono text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        {res.category}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
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
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-400" />
              Section 1: &quot;I Want To...&quot; Goal Router
            </h2>
            <p className="text-xs text-slate-400 mt-1">
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
                  className={`bg-[#081225] border rounded-xl p-5 cursor-pointer transition flex flex-col justify-between ${
                    isSelected ? 'border-amber-400 bg-[#0A162E]' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-white">{option.goalText}</h3>
                    </div>

                    <div className="text-xs space-y-2 pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Primary Target:</span>
                        <Link
                          href={option.primaryDestination.link}
                          className="font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{option.primaryDestination.name}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Secondary Tool:</span>
                        <Link
                          href={option.secondaryDestination.link}
                          className="text-slate-300 hover:text-white inline-flex items-center gap-1 font-mono text-[11px]"
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
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" />
              Section 2: GATE 2026 XE-F Syllabus Section Mapping (9 Official Sections)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Official IIT Guwahati GATE XE-F Polymer Science & Engineering syllabus mapped directly to PolymerHub subjects and lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GATE_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                className="bg-[#081225] border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded">
                      Section {sec.number}
                    </span>
                    <span className="text-xs text-amber-400 font-mono">
                      {'⭐'.repeat(sec.relevanceStars)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">{sec.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{sec.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Mapped Subjects:</span>
                    <span className="text-blue-400 font-bold">{sec.subjects.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Curriculum Lessons:</span>
                    <span className="text-amber-400 font-bold">{sec.totalLessons} Lessons</span>
                  </div>
                  <Link
                    href={sec.link}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-lg border border-slate-700 transition"
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
        <section id="first-week" className="bg-[#081225] border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              Section 3: Your First Week on PolymerHub (Beginner Guide)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              A 7-day recommended step-by-step roadmap to get 100% value out of PolymerHub without feeling overwhelmed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {FIRST_WEEK_STEPS.map((step) => {
              const StepIcon = ICON_MAP[step.iconName] || CheckCircle2

              return (
                <div key={step.day} className="bg-[#040A17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      Day {step.day}
                    </span>
                    <div className="p-2 bg-slate-900 text-amber-400 rounded-lg w-fit">
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs text-white">{step.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-tight">{step.action}</p>
                  </div>

                  <Link
                    href={step.link}
                    className="text-[11px] font-mono text-amber-400 hover:underline inline-flex items-center gap-1 pt-2 border-t border-slate-800"
                  >
                    <span>{step.destination} →</span>
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
