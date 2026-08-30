// src/app/careers/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Briefcase, 
  Search, 
  Printer, 
  Save,
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Award,
  Sparkles,
  Compass
} from 'lucide-react'
import { SPECareerExplorer } from '@/components/SPECareerExplorer'

// Mock Interview questions database
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the glass transition temperature (Tg) and why is it important in processing?",
    options: [
      "The temperature at which a polymer melts completely into a low-viscosity liquid",
      "The temperature at which an amorphous polymer transitions from a hard, glassy state to a rubbery, flexible state",
      "The temperature where chemical cross-linking reactions begin to occur",
      "The temperature at which thermal degradation and gas emission start"
    ],
    correct: 1,
    explanation: "Tg is the temperature where amorphous regions of a polymer gain chain mobility. Below Tg, polymers are brittle and glassy; above Tg, they are rubbery and ductile."
  },
  {
    id: 2,
    question: "What is the primary function of a runner system in an injection mold layout?",
    options: [
      "To circulate cooling water or oil around the cavity inserts",
      "To channel molten polymer from the sprue bushing to the gates of individual cavities",
      "To push the solidified molded parts out of the cores during mold open",
      "To vents out trapped gases and air from the cavities during injection fill"
    ],
    correct: 1,
    explanation: "The runner system acts as the feed channels directing molten thermoplastic from the sprue/nozzle connection into the entry gates of the product cavities."
  },
  {
    id: 3,
    question: "Why is a high L/D (Length to Diameter) screw ratio desirable in twin-screw compounding extruders?",
    options: [
      "It decreases machine manufacturing costs and reduces overall footprint",
      "It allows longer residence times, yielding superior melting, mixing, and dispersion of additives",
      "It decreases pressure drops across the extrusion die plate",
      "It prevents high shear heating, safeguarding heat-sensitive bioplastics"
    ],
    correct: 1,
    explanation: "A high L/D ratio (typically 36:1 to 48:1) gives more processing barrel length for modular compounding steps like feeding, melting, liquid injection, mixing, venting, and pressure building."
  },
  {
    id: 4,
    question: "Which ASTM standard is universally used to evaluate the tensile properties of plastics?",
    options: [
      "ASTM D1238 (Melt Flow Index)",
      "ASTM D648 (Heat Deflection Temperature)",
      "ASTM D638 (Tensile Testing of Plastics)",
      "ASTM D256 (Izod Impact Resistance)"
    ],
    correct: 2,
    explanation: "ASTM D638 outlines the test method for measuring tensile properties of unreinforced and reinforced plastics using dumbbell-shaped 'dogbone' specimens."
  },
  {
    id: 5,
    question: "What differentiates a Thermosetting polymer from a Thermoplastic polymer at the structural level?",
    options: [
      "Thermosets have high linear molecular weight but zero chemical linkages",
      "Thermosets form three-dimensional chemically cross-linked networks that do not melt upon reheating",
      "Thermosets are completely amorphous while thermoplastics are 100% crystalline",
      "Thermosets degrade at room temperature under low moisture exposure"
    ],
    correct: 1,
    explanation: "Thermosets undergo irreversible chemical cross-linking (curing) forming a rigid network. Reheating them will cause thermal degradation rather than melting, unlike thermoplastics."
  }
]

const TRACKS = [
  {
    id: 'design',
    title: 'Design & Simulation Engineer',
    subtitle: 'CAD · CAE · Moldflow',
    color: '#1D4ED8', bg: '#EFF6FF',
    salary: '₹6–22 LPA',
    growth: 'High Demand',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    desc: 'Design plastic parts and moulds using CAD, simulate filling and warpage using Moldflow or Moldex3D before any steel is cut.',
    skills: ['SolidWorks / CATIA', 'Autodesk Moldflow', 'Mould design fundamentals', 'GD&T tolerancing', 'Design for Manufacturing'],
    recruiters: ['Motherson Sumi', 'Varroc Engineering', 'Mold-Tek Technologies', 'Lumax Industries'],
    lessons: [{ name: 'Gate Design in Injection Moulds', slug: 'gate-design-in-injection-moulds-types-location-and-selection' }],
  },
  {
    id: 'process',
    title: 'Process & Production Engineer',
    subtitle: 'Injection · Extrusion · Blow Moulding',
    color: '#EA580C', bg: '#FFF7ED',
    salary: '₹5–18 LPA',
    growth: 'Steady',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    desc: 'Set up and optimize processing lines — minimizing defects, reducing cycle time, and maintaining dimensional consistency.',
    skills: ['Injection moulding parameters', 'Extrusion screw design', 'PLC/SCADA basics', 'Six Sigma / Lean', 'Defect troubleshooting'],
    recruiters: ['Supreme Industries', 'Astral Pipes', 'Finolex Industries', 'Sintex BAPL'],
    lessons: [{ name: 'Injection Moulding: Process, Parameters, and Defects', slug: 'injection-moulding-process-parameters-and-defects' }],
  },
  {
    id: 'rnd',
    title: 'Materials & R&D Engineer',
    subtitle: 'Compounding · Formulation · Innovation',
    color: '#7C3AED', bg: '#F5F3FF',
    salary: '₹8–28 LPA',
    growth: 'Very High',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    desc: 'Develop new polymer compounds, engineer blends for specific applications, push the frontier from bioplastics to carbon-fibre composites.',
    skills: ['Polymer chemistry fundamentals', 'Compound formulation', 'DSC/TGA/FTIR characterization', 'Blending & compatibilization', 'Patent writing'],
    recruiters: ['BASF India', 'SABIC India', 'Reliance R&D', 'DIC India', 'Lanxess India'],
    lessons: [{ name: 'Polymer Degradation and Stabilization', slug: 'polymer-degradation-and-stabilization' }],
  },
  {
    id: 'sustainability',
    title: 'Recycling & Sustainability Engineer',
    subtitle: 'Circular Economy · EPR · LCA',
    color: '#15803D', bg: '#F0FDF4',
    salary: '₹7–20 LPA',
    growth: 'Fastest Growing',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    desc: 'The most future-proof career in the sector. Design recycling lines, navigate EPR compliance, help companies hit circular economy targets.',
    skills: ['Mechanical recycling processes', 'Chemical recycling (pyrolysis, enzymatic)', 'EPR compliance', 'Life Cycle Assessment (LCA)', 'Carbon footprint calculation'],
    recruiters: ['Reliance Green', 'Dalmia Polypro', 'UPL Sustainability', 'HDFC ESG roles'],
    lessons: [{ name: 'Introduction to the Plastics Recycling Landscape', slug: 'introduction-to-the-plastics-recycling-landscape-why-it-matters-now' }],
  },
  {
    id: 'qaqc',
    title: 'QA / QC Engineer',
    subtitle: 'Testing · Standards · Compliance',
    color: '#7C3AED', bg: '#F5F3FF',
    salary: '₹4–15 LPA',
    growth: 'Stable',
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=80',
    desc: 'The quality gatekeeper — runs incoming material testing, in-process checks, and finished product certification against IS, ASTM, and ISO standards.',
    skills: ['MFI, tensile, impact testing', 'IS / ASTM / ISO standards', 'ISO 9001 / IATF 16949', 'Statistical Process Control', 'BIS certification'],
    recruiters: ['CIPET', 'Finolex Industries', 'Supreme Industries', 'Motherson Sumi'],
    lessons: [{ name: 'Tensile and Flexural Testing', slug: 'tensile-and-flexural-testing-measuring-mechanical-strength' }],
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    subtitle: 'Build Your Own Plastics Business',
    color: '#CA8A04', bg: '#FEFCE8',
    salary: 'Unlimited',
    growth: 'High Risk → High Return',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    desc: "India's plastics sector has some of the lowest barriers to entry in manufacturing. Your engineering knowledge is the moat most business owners lack.",
    skills: ['Product costing & pricing', 'Machine selection & CAPEX planning', 'Vendor/raw material sourcing', 'BIS/IS compliance', 'Export-import basics'],
    recruiters: [],
    lessons: [{ name: 'The Plastics Entrepreneurship Landscape in India', slug: 'the-plastics-entrepreneurship-landscape-in-india-why-your-degree-is-the-moat' }],
  },
]

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  type: 'Full-time' | 'Internship'
  salary: string
  description: string
  application_url: string
}

interface Education {
  degree: string
  institute: string
  year: string
}

interface Experience {
  role: string
  company: string
  duration: string
  desc: string
}

interface Project {
  name: string
  tech: string
  desc: string
}

export default function CareersHubPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [activeTab, setActiveTab] = useState<'spe' | 'tracks' | 'resume' | 'interview'>('spe')
  
  // Job Board States
  const [listings, setListings] = useState<JobListing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  // Resume Builder States
  const [resumeLoaded, setResumeLoaded] = useState(false)
  const [resumeSaving, setResumeSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  // Temporary item inputs
  const [tempEdu, setTempEdu] = useState<Education>({ degree: '', institute: '', year: '' })
  const [tempExp, setTempExp] = useState<Experience>({ role: '', company: '', duration: '', desc: '' })
  const [tempProj, setTempProj] = useState<Project>({ name: '', tech: '', desc: '' })

  // Mock Interview States
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submittedInterview, setSubmittedInterview] = useState(false)
  const [interviewScore, setInterviewScore] = useState<number | null>(null)

  // 1. Fetch Session
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  // 2. Fetch Job Listings
  useEffect(() => {
    if (activeTab !== 'tracks') return
    async function loadListings() {
      setListingsLoading(true)
      try {
        const res = await fetch(`/api/careers/listings?q=${searchQuery}&type=${selectedType}`)
        if (res.ok) {
          setListings(await res.json())
        }
      } catch (err) {
        console.error('Failed to load listings:', err)
      } finally {
        setListingsLoading(false)
      }
    }
    loadListings()
  }, [activeTab, searchQuery, selectedType])

  // 3. Fetch Resume Profile (once session is active)
  useEffect(() => {
    if (!session || activeTab !== 'resume') return
    async function loadResume() {
      try {
        const res = await fetch('/api/careers/resume')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setFullName(data.full_name || '')
            setEmail(data.email || '')
            setPhone(data.phone || '')
            setSkills(data.skills || [])
            setEducation(data.education || [])
            setExperience(data.experience || [])
            setProjects(data.projects || [])
          }
        }
      } catch (err) {
        console.error('Failed to fetch resume:', err)
      } finally {
        setResumeLoaded(true)
      }
    }
    loadResume()
  }, [session, activeTab])

  // 4. Save/Update Resume Profile
  const handleSaveResume = async () => {
    if (!session) return
    setResumeSaving(true)
    try {
      const res = await fetch('/api/careers/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          education,
          experience,
          projects,
          skills
        })
      })
      if (!res.ok) throw new Error('Failed to save')
      alert('Resume specs saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save resume details.')
    } finally {
      setResumeSaving(false)
    }
  }

  // 5. Add items to list
  const addEdu = () => {
    if (!tempEdu.degree || !tempEdu.institute || !tempEdu.year) return
    setEducation(prev => [...prev, tempEdu])
    setTempEdu({ degree: '', institute: '', year: '' })
  }
  const addExp = () => {
    if (!tempExp.role || !tempExp.company || !tempExp.duration) return
    setExperience(prev => [...prev, tempExp])
    setTempExp({ role: '', company: '', duration: '', desc: '' })
  }
  const addProj = () => {
    if (!tempProj.name || !tempProj.tech) return
    setProjects(prev => [...prev, tempProj])
    setTempProj({ name: '', tech: '', desc: '' })
  }
  const addSkill = () => {
    if (!newSkill.trim()) return
    if (!skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()])
    }
    setNewSkill('')
  }

  // 6. Technical Interview submit check
  const handleInterviewSubmit = () => {
    let score = 0
    MOCK_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) {
        score++
      }
    })
    setInterviewScore(Math.round((score / MOCK_QUESTIONS.length) * 100))
    setSubmittedInterview(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              SPE Career Pathways &middot; Jobs &amp; Internships &middot; Polymer Resume Builder
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Build Your Career. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Shape The Future.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Explore 20+ specialized career paths, find live job openings, build an ATS-optimized polymer resume, and practice technical interview simulations.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">20+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Career Paths</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">&#8377;4&ndash;28L</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Salary Range</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">95%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Placement Rate</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">6</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Specialized Tracks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Column */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Workspace tabs */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-2 shadow-xl flex flex-wrap gap-2">
          {([
            { id: 'spe', label: 'SPE Career Pathways', icon: Award },
            { id: 'tracks', label: 'Career Tracks & Jobs', icon: Briefcase },
            { id: 'resume', label: 'Resume Builder', icon: Printer },
            { id: 'interview', label: 'Mock Interview', icon: Brain }
          ] as const).map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB CONTENTS */}
        
        {/* TAB 0: SPE CAREER PATHWAYS (PHASE 4) */}
        {activeTab === 'spe' && (
          <SPECareerExplorer />
        )}

        {/* TAB 1: CAREER TRACKS & JOB BOARD */}
        {activeTab === 'tracks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: 6 Tracks + Job Board */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Job Listings Panel */}
              <div className="space-y-4">
                <div className="border-b-4 border-slate-900 pb-2 flex justify-between items-center">
                  <h2 className="font-display font-black text-sm uppercase">Active Polymer Openings</h2>
                  <span className="font-mono text-[9px] uppercase text-slate-400">Real-time Industry Feed</span>
                </div>

                {/* Filter and Search Box */}
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px] border-4 border-slate-900 bg-white rounded-xl flex items-center px-3 gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 bg-transparent text-xs outline-none"
                    />
                  </div>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border-4 border-slate-900 p-2 text-xs font-bold uppercase rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {listingsLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-600 mb-2" />
                    <p className="font-mono text-xs text-slate-500">Checking job board feeds...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.length === 0 ? (
                      <p className="text-center font-mono text-xs text-slate-400 py-10">No active job listings found.</p>
                    ) : (
                      listings.map(job => (
                        <div 
                          key={job.id} 
                          className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-4 flex-wrap">
                              <h3 className="font-display font-black text-sm uppercase text-slate-950 leading-tight">
                                {job.title}
                              </h3>
                              <span className="font-mono text-[9px] font-bold border-2 border-slate-900 bg-slate-50 px-2 py-0.5 uppercase">
                                {job.type}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-400">
                              {job.company} · {job.location}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 leading-normal line-clamp-3">
                            {job.description}
                          </p>

                          <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 flex-wrap">
                            <span className="font-mono text-xs font-black text-green-600">
                              {job.salary}
                            </span>
                            <a
                              href={job.application_url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-[9px] font-black uppercase bg-violet-600 text-white px-3 py-1.5 rounded hover:bg-violet-700 transition-colors"
                            >
                              Apply Now &rarr;
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 6 Career Tracks */}
              <div className="space-y-4">
                <div className="border-b-4 border-slate-900 pb-2">
                  <h2 className="font-display font-black text-sm uppercase">6 Specialized Career Pathways</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {TRACKS.map(track => (
                    <TrackCard key={track.id} track={track} />
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar: Quick info */}
            <div className="space-y-6">
              {/* Placement moats */}
              <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <h4 className="font-display font-black text-xs uppercase tracking-wider">
                  💼 Polymer Job Market Stats
                </h4>
                <ul className="space-y-2 font-mono text-[9px] text-slate-500 leading-normal">
                  <li>
                    <strong>India CAGR:</strong> Plastics consumption is growing at 8.5% annually, driven by automotive weight-reduction and flexible packaging demand.
                  </li>
                  <li>
                    <strong>Compounding Hubs:</strong> Top clusters are centered in Gujarat (Halol, Ahmedabad), Maharashtra (Pune), Daman &amp; Diu, Chennai (CIPET/Motherson hubs), and Noida.
                  </li>
                  <li>
                    <strong>Standards knowledge:</strong> Companies prioritize candidates familiar with testing standards (ASTM D638, ASTM D1238, ISO 9001).
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: RESUME BUILDER */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            {!session ? (
              <div className="border-4 border-slate-900 rounded-xl p-8 bg-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto">
                <span className="text-3xl block mb-2">🔒</span>
                <h3 className="font-display font-black text-xs uppercase mb-1">Resume Drafting locked</h3>
                <p className="text-[10px] text-slate-400 leading-normal mb-4">Please log in to design and save your professional polymer resume profile.</p>
                <Link href="/login" className="inline-block bg-slate-900 text-white font-mono text-[9px] font-black uppercase px-4 py-2 border-2 border-slate-900 shadow-hard-sm hover:bg-slate-800">
                  Authenticate →
                </Link>
              </div>
            ) : !resumeLoaded ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600 mb-2" />
                <p className="font-mono text-xs text-slate-500">Retrieving resume profile...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Form Editor (Left side) */}
                <div className="space-y-6 border-4 border-slate-900 bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <h3 className="font-display font-black text-sm uppercase mb-1">Plastics Engineering Resume Form</h3>
                    <p className="text-[10px] text-slate-500">Provide details to construct your standard PDF resume.</p>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] font-black uppercase text-slate-400 border-b pb-1">1. Contact Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Priyesh Kumar"
                          className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. priyesh@college.edu"
                          className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[9px] font-mono text-slate-400 mb-0.5">Phone Number</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education details */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] font-black uppercase text-slate-400 border-b pb-1">2. Education History</h4>
                    <div className="space-y-2">
                      {education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded text-xs text-slate-900">
                          <div>
                            <strong>{edu.degree}</strong> - {edu.institute} ({edu.year})
                          </div>
                          <button
                            onClick={() => setEducation(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end pt-1">
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.Tech Polymer)"
                        value={tempEdu.degree}
                        onChange={(e) => setTempEdu(prev => ({ ...prev, degree: e.target.value }))}
                        className="p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Institute (e.g. CIPET)"
                        value={tempEdu.institute}
                        onChange={(e) => setTempEdu(prev => ({ ...prev, institute: e.target.value }))}
                        className="p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Year"
                          value={tempEdu.year}
                          onChange={(e) => setTempEdu(prev => ({ ...prev, year: e.target.value }))}
                          className="w-16 p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                        <button
                          onClick={addEdu}
                          className="flex-1 bg-slate-900 text-white font-mono text-[9px] uppercase font-black py-1.5 border-2 border-slate-900 rounded"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Experience details */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] font-black uppercase text-slate-400 border-b pb-1">3. Professional Experience</h4>
                    <div className="space-y-2">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-slate-50 p-2 rounded text-xs text-slate-900">
                          <div>
                            <strong>{exp.role}</strong> at {exp.company} ({exp.duration})
                            <p className="text-[10px] text-slate-500 mt-0.5">{exp.desc}</p>
                          </div>
                          <button
                            onClick={() => setExperience(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 shrink-0"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Role (e.g. Design Intern)"
                          value={tempExp.role}
                          onChange={(e) => setTempExp(prev => ({ ...prev, role: e.target.value }))}
                          className="p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={tempExp.company}
                          onChange={(e) => setTempExp(prev => ({ ...prev, company: e.target.value }))}
                          className="p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 2025-2026)"
                          value={tempExp.duration}
                          onChange={(e) => setTempExp(prev => ({ ...prev, duration: e.target.value }))}
                          className="p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Key responsibilities summary..."
                          value={tempExp.desc}
                          onChange={(e) => setTempExp(prev => ({ ...prev, desc: e.target.value }))}
                          className="flex-1 p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                        <button
                          onClick={addExp}
                          className="bg-slate-900 text-white font-mono text-[9px] uppercase font-black px-4 py-1.5 border-2 border-slate-900 rounded shrink-0"
                        >
                          + Add Exp
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Projects details */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] font-black uppercase text-slate-400 border-b pb-1">4. Gating &amp; Polymer Projects</h4>
                    <div className="space-y-2">
                      {projects.map((proj, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-slate-50 p-2 rounded text-xs text-slate-900">
                          <div>
                            <strong>{proj.name}</strong> (Technology: {proj.tech})
                            <p className="text-[10px] text-slate-500 mt-0.5">{proj.desc}</p>
                          </div>
                          <button
                            onClick={() => setProjects(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 shrink-0"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Project Name (e.g. Mould Flow Analysis)"
                          value={tempProj.name}
                          onChange={(e) => setTempProj(prev => ({ ...prev, name: e.target.value }))}
                          className="p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Tech / Standards (e.g. Moldflow, CAD)"
                          value={tempProj.tech}
                          onChange={(e) => setTempProj(prev => ({ ...prev, tech: e.target.value }))}
                          className="p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Key results achieved (e.g. Reduced warpage by 20%...)"
                          value={tempProj.desc}
                          onChange={(e) => setTempProj(prev => ({ ...prev, desc: e.target.value }))}
                          className="flex-1 p-1.5 border border-slate-350 rounded text-xs bg-slate-50 text-slate-900 outline-none"
                        />
                        <button
                          onClick={addProj}
                          className="bg-slate-900 text-white font-mono text-[9px] uppercase font-black px-4 py-1.5 border-2 border-slate-900 rounded shrink-0"
                        >
                          + Add Proj
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Skills details */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] font-black uppercase text-slate-400 border-b pb-1">5. Skills Tagging</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s} className="font-mono text-[9px] font-bold border-2 border-slate-900 bg-slate-50 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          {s}
                          <button
                            type="button"
                            onClick={() => setSkills(prev => prev.filter(item => item !== s))}
                            className="text-red-500 font-bold hover:text-red-700 ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add skill tag (e.g. Extrusion, DSC, SOLIDWORKS)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 p-2 border-2 border-slate-900 rounded-lg text-xs bg-slate-50 outline-none text-slate-900"
                        onKeyDown={(e) => { if (e.key === 'Enter') addSkill() }}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="bg-slate-900 text-white font-mono text-[9px] uppercase font-black px-4 py-2 border-2 border-slate-900 shadow-hard-sm hover:bg-slate-800"
                      >
                        + Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Save trigger */}
                  <button
                    onClick={handleSaveResume}
                    disabled={resumeSaving}
                    className="w-full bg-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-blue-700 flex items-center justify-center gap-1.5"
                  >
                    {resumeSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Specifications
                  </button>

                </div>

                {/* Resume Preview Sheet (Right side) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-slate-400">Standard printable layout</span>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase hover:underline border border-slate-300 px-3 py-1 rounded bg-white"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print PDF / A4
                    </button>
                  </div>

                  {/* Printable A4 Box */}
                  <div id="resume-preview-box" className="border-4 border-slate-900 bg-white text-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6 min-h-[600px] rounded-xl">
                    
                    {/* Header */}
                    <div className="text-center border-b pb-4 border-slate-200">
                      <h2 className="font-display font-black text-xl uppercase tracking-tight">
                        {fullName || 'Your Name'}
                      </h2>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">
                        {email || 'candidate@domain.com'} · {phone || '+91 99999 99999'}
                      </p>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-0.5">Education</h3>
                      {education.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic">No education records added.</p>
                      ) : (
                        <div className="space-y-2">
                          {education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <div>
                                <strong className="text-slate-800">{edu.degree}</strong>
                                <span className="block text-[10px] text-slate-500">{edu.institute}</span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-0.5">Experience</h3>
                      {experience.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic">No experience records added.</p>
                      ) : (
                        <div className="space-y-3">
                          {experience.map((exp, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <div>
                                  <strong className="text-slate-800">{exp.role}</strong> at <span className="italic">{exp.company}</span>
                                </div>
                                <span className="font-mono text-[10px] text-slate-400">{exp.duration}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal">{exp.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Projects */}
                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-0.5">Compounding &amp; Processing Projects</h3>
                      {projects.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic">No project listings added.</p>
                      ) : (
                        <div className="space-y-3">
                          {projects.map((proj, idx) => (
                            <div key={idx} className="space-y-1 text-xs">
                              <div>
                                <strong className="text-slate-800">{proj.name}</strong> · <span className="font-mono text-[9px] text-blue-600 uppercase">{proj.tech}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal">{proj.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-0.5">Technical Skills &amp; Standards</h3>
                      {skills.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic">No skills listed.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {skills.map((s) => (
                            <span key={s} className="font-mono text-[9px] border px-2 py-0.5 rounded text-slate-600 bg-slate-50 uppercase">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 3: MOCK INTERVIEW */}
        {activeTab === 'interview' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="border-b-4 border-slate-900 pb-2 flex justify-between items-center">
              <div>
                <h2 className="font-display font-black text-sm uppercase">Technical Mock Interview Board</h2>
                <p className="text-[10px] text-slate-400 mt-1">Answer 5 core questions evaluating polymer science and manufacturing competencies.</p>
              </div>
            </div>

            <div className="space-y-6">
              {MOCK_QUESTIONS.map((q, idx) => {
                return (
                  <div 
                    key={q.id} 
                    className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4"
                  >
                    <div>
                      <span className="font-mono text-[9px] uppercase font-black text-blue-600 block mb-1">Question {idx + 1} of 5</span>
                      <h3 className="font-display font-black text-xs uppercase leading-relaxed text-slate-950">
                        {q.question}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === optIdx
                        const isCorrect = q.correct === optIdx
                        
                        let optionStyle = 'border-slate-200 hover:bg-slate-50'
                        if (submittedInterview) {
                          if (isCorrect) {
                            optionStyle = 'border-green-600 bg-green-50/10 text-green-700'
                          } else if (isSelected) {
                            optionStyle = 'border-red-600 bg-red-50/10 text-red-700'
                          }
                        } else if (isSelected) {
                          optionStyle = 'border-blue-600 bg-blue-50/10'
                        }

                        return (
                          <label 
                            key={optIdx}
                            className={`flex items-start gap-2.5 p-3 rounded-lg border-2 cursor-pointer transition-colors text-xs leading-normal ${optionStyle}`}
                          >
                            <input
                              type="radio"
                              name={`mock-q-${q.id}`}
                              disabled={submittedInterview}
                              checked={isSelected}
                              onChange={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className="mt-0.5 border-2 border-slate-900 rounded-full"
                            />
                            <span>{opt}</span>
                          </label>
                        )
                      })}
                    </div>

                    {submittedInterview && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-2.5 items-start">
                        {answers[q.id] === q.correct ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-mono text-[9px] font-black uppercase text-slate-400 block mb-0.5">Explanation</span>
                          <p className="text-[10px] text-slate-600 leading-normal">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Score presentation or Submit action */}
            <div className="border-4 border-slate-900 rounded-xl p-5 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              {interviewScore === null ? (
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <p className="text-xs text-slate-400">Ensure you have selected answers for all 5 questions.</p>
                  <button
                    onClick={handleInterviewSubmit}
                    disabled={Object.keys(answers).length < 5}
                    className="bg-violet-600 border-2 border-slate-900 text-white font-mono text-xs font-black uppercase tracking-wider px-6 py-3 hover:bg-violet-700 shadow-hard disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answers
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-6 flex-wrap">
                  <div>
                    <h4 className="font-display font-black text-sm uppercase">Evaluation Complete</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {interviewScore >= 80 
                        ? "🎉 Excellent job! You are thoroughly prepared for polymer technical interviews." 
                        : "📚 We recommend reviewing the subjects and retry to improve."}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center border-4 border-slate-900 rounded-xl px-5 py-2.5 bg-yellow-400">
                      <span className="font-mono text-2xl font-black block">{interviewScore}%</span>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-slate-700 font-bold">Your Score</span>
                    </div>
                    <button
                      onClick={() => {
                        setAnswers({})
                        setInterviewScore(null)
                        setSubmittedInterview(false)
                      }}
                      className="font-mono text-[10px] font-black uppercase hover:underline"
                    >
                      Reset Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ── BOTTOM AI CAREER COACH CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Career Coach &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Need guidance preparing for technical polymer interviews? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Career Coach.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Generate custom technical questions on Moldflow, compounding let-down calculations, ASTM testing procedures, and salary benchmarking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Conduct%20a%20rigorous%20technical%20interview%20for%20a%20Polymer%20Compounding%20and%20Extrusion%20Specialist%20role"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Start AI Mock Interview &rarr;
            </Link>

            <Link
              href="/practice/challenges"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Sponsored Industry Challenges
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

function TrackCard({ track }: { track: typeof TRACKS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200/90 bg-white overflow-hidden shadow-xs rounded-2xl transition-all">
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="relative overflow-hidden" style={{ height: '120px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="font-mono text-[9px] font-bold text-white/80 uppercase tracking-wider">{track.subtitle}</div>
              <h3 className="font-display text-base font-bold text-white leading-tight">{track.title}</h3>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-mono text-[10px] font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/30">{track.salary}</span>
              <span className="font-mono text-[9px] text-white/80 uppercase">{track.growth}</span>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center justify-between bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-600 flex-1 pr-3 leading-relaxed">{track.desc}</p>
          {open ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 p-5 space-y-4 bg-white">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Key Skills</div>
            <div className="space-y-1.5">
              {track.skills.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#2563EB]" />
                  <span className="text-xs text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
          {track.recruiters.length > 0 && (
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Top Recruiters</div>
              <div className="flex flex-wrap gap-1.5">
                {track.recruiters.map((r) => (
                  <span key={r} className="font-mono text-[10px] font-bold border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 bg-slate-50">{r}</span>
                ))}
              </div>
            </div>
          )}
          {track.lessons.map((l) => (
            <Link
              key={l.slug}
              href={`/lessons/${l.slug}`}
              className="flex items-center justify-between border border-slate-200 p-3 rounded-xl hover:border-[#2563EB] hover:bg-blue-50/50 group transition-all"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#2563EB]">{l.name}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
