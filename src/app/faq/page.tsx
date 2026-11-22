'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, ChevronDown, HelpCircle, Sparkles, BookOpen, Calculator, ShieldCheck, Mail } from 'lucide-react'
import Footer from '@/components/Footer'

interface FAQCategory {
  title: string
  items: { q: string; a: string }[]
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: 'Platform & Access',
    items: [
      {
        q: 'What is PolymerHub of India?',
        a: 'PolymerHub of India is a dedicated digital learning and engineering platform connecting polymer science, plastics manufacturing technology, practical shop-floor calculators, and GATE XE-F examination preparation in one integrated ecosystem.'
      },
      {
        q: 'Is PolymerHub free to use?',
        a: 'Yes! The core learning platform is 100% free forever. All 19 subjects (216 lessons), the 3D molecular viewer, the defect troubleshooter, daily industry intelligence, and community channels are accessible at zero cost with no credit card required.'
      },
      {
        q: 'Can I access PolymerHub on my mobile phone?',
        a: 'Absolutely. PolymerHub is engineered mobile-first. Over 75% of our learners access lessons, formulas, and calculators directly from their smartphones via mobile web or as an installable PWA.'
      },
      {
        q: 'Do I need to be a CIPET student to join?',
        a: 'No. PolymerHub is open to all students, working professionals, researchers, and hobbyists across B.Tech, B.E., Diploma, M.Tech, and factory technicians across India and globally.'
      }
    ]
  },
  {
    title: 'Curriculum & Academics',
    items: [
      {
        q: 'How are the 19 subjects structured?',
        a: 'The curriculum spans three structured tiers: Foundation (Polymer Chemistry, Structure & Properties), Core Engineering Fundamentals (Processing, Mould Design, Testing, Rheology, Rubber Technology, Packaging, Additives, and Composites), and Applied/Advanced Topics (Medical Plastics, Recycling, Bioprocessing, Robotics, Digital Twins, Color Science, LCA, and Entrepreneurship).'
      },
      {
        q: 'Does PolymerHub cover the official AICTE and CIPET syllabi?',
        a: 'Yes. The 216 lessons directly map to AICTE Model Guidelines and the standardized curricula used across CIPET centers (DPT, DPMT, PGD-PPT, B.Tech) as well as university departments such as ICT Mumbai, MIT-WPU, Anna University, and HBTU Kanpur.'
      },
      {
        q: 'Are the end-of-lesson quizzes graded?',
        a: 'Yes. Each lesson concludes with an interactive knowledge check. Passing quizzes awards XP points, maintains study streaks, and updates your personal learning progress dashboard.'
      }
    ]
  },
  {
    title: 'GATE XE-F Preparation',
    items: [
      {
        q: 'What is GATE XE-F?',
        a: 'In the Graduate Aptitude Test in Engineering (GATE), Paper XE is Engineering Sciences. Section F is Polymer Science and Engineering (35 marks across 22 questions). It is one of the most predictable and high-scoring sections when prepared with structured derivations.'
      },
      {
        q: 'How does the simulated mock test work?',
        a: 'The simulated mock test features a 60-minute strict countdown timer, question palette, virtual scientific calculator, and the official GATE marking scheme (+1/+2 marks with -0.33/-0.66 negative marking). At the end, you receive an instant score report with step-by-step mathematical derivations.'
      },
      {
        q: 'Does PolymerHub cover Section A (Engineering Mathematics)?',
        a: 'PolymerHub specializes strictly in Section F (Polymer Science & Engineering). We advise candidates to prepare General Aptitude (GA) and Engineering Mathematics (Section A) through dedicated mathematics practice.'
      }
    ]
  },
  {
    title: 'Engineering Tools & Solvers',
    items: [
      {
        q: 'What formulas do the 8 calculators use?',
        a: 'The solvers implement established ASTM, ISO, and standard manufacturing equations: ASTM D3641 / ISO 294 for clamping tonnage, Ballman-Dutton 1D Fourier transient conduction for cooling cycle times, ISO 294-4 for mould shrinkage, Euromap 12 for cycle breakdowns, and ASTM D3835 for screw shear rates.'
      },
      {
        q: 'How accurate is the Defect Troubleshooter?',
        a: 'The troubleshooter is calibrated to the Rosato Injection Molding Handbook and SPI industrial standards, providing root causes, parameter adjustments, and test protocols for sink marks, short shots, warpage, flash, burn marks, and weld lines.'
      }
    ]
  },
  {
    title: 'Subscriptions & Billing',
    items: [
      {
        q: 'What does the ₹149/month Premium plan include?',
        a: 'Premium gives serious engineers and GATE aspirants full access to all 8 industrial engineering solvers, the complete 98-formula library with mathematical derivations, 21 ASTM/ISO virtual testing simulators, full simulated GATE XE-F mock examinations, unlimited RAG AI queries, and downloadable PDF lesson notes.'
      },
      {
        q: 'What is your refund policy?',
        a: 'Under our statutory policy compliant with the Consumer Protection (E-Commerce) Rules, 2020, you can request a 100% refund within 7 days of subscribing to Premium if you are not completely satisfied. No questions asked.'
      },
      {
        q: 'Can our college or department purchase institutional access?',
        a: 'Yes. We offer Institutional Campus Licences with dedicated HOD analytics dashboards, seat allocations, and custom syllabus mapping starting at ₹99/seat/month. Contact enterprise@polymerhubofindia.com.'
      }
    ]
  }
]

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({ '0-0': true })

  const toggle = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredCategories = FAQ_DATA.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((cat) => cat.items.length > 0)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      
      {/* Top Breadcrumb Header */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Knowledge Base &middot; Complete FAQ
          </span>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-blue-400" /> Complete FAQ Knowledge Base
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Find immediate answers regarding platform features, curriculum coverage, GATE XE-F preparation, solvers, and billing.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions (e.g. refund, GATE, calculators, CIPET)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main FAQ List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {filteredCategories.map((cat, catIdx) => (
          <div key={cat.title} className="space-y-4">
            <h2 className="font-display font-bold text-xl text-slate-900 border-b border-slate-200 pb-2">
              {cat.title}
            </h2>

            <div className="space-y-3">
              {cat.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`
                const isOpen = !!openMap[key]

                return (
                  <div
                    key={item.q}
                    className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-display font-bold text-sm sm:text-base text-slate-900 leading-snug">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-2">
            <p className="text-slate-600 text-sm">No questions matching your search query &ldquo;{search}&rdquo;.</p>
            <button
              onClick={() => setSearch('')}
              className="text-xs font-mono font-bold text-blue-600 hover:underline"
            >
              Clear search filter
            </button>
          </div>
        )}
      </main>

      <div className="mt-16">
        <Footer showTrustBar />
      </div>

    </div>
  )
}
