'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  q: string
  a: React.ReactNode
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      q: 'What is PolymerHub of India?',
      a: 'PolymerHub of India is a dedicated digital learning and engineering platform connecting polymer science, plastics manufacturing technology, practical shop-floor engineering calculators, and GATE XE-F examination preparation in one integrated ecosystem.',
    },
    {
      q: 'Who can use PolymerHub?',
      a: 'PolymerHub is built for three primary groups: (1) B.Tech, M.Tech, and CIPET diploma students preparing for semester exams and vivas; (2) GATE Engineering Sciences (XE Paper F) aspirants; and (3) Shop-floor tooling, injection moulding, and quality engineers working in manufacturing plants.',
    },
    {
      q: 'Is PolymerHub free?',
      a: 'Yes. Core learning access is 100% free forever. All 19 subjects (216 lessons), the 3D molecular viewer, the defect troubleshooter, daily industry intelligence, and our community channels on WhatsApp and Telegram are open to all registered learners at zero cost.',
    },
    {
      q: 'What is included in Premium?',
      a: 'PolymerHub Premium includes full access to all 8 industrial engineering solvers (clamp force, cooling time, shrinkage, shear rate), the complete 98-formula library with mathematical derivations formatted in LaTeX, 21 ASTM/ISO virtual testing simulators, full simulated GATE XE-F mock examinations, and unlimited RAG AI Polymer Copilot queries.',
    },
    {
      q: 'Is there only one Premium subscription?',
      a: 'Yes. We maintain a simple, transparent business model: one single Premium plan at ₹149 per month (or ₹1,499 per year). We do not lock features behind multiple confusing enterprise tiers.',
    },
    {
      q: 'How does PolymerHub help GATE XE-F aspirants?',
      a: 'PolymerHub provides paper-specific preparation tailored strictly to GATE Engineering Sciences Paper F: official syllabus topic breakdown, mathematical derivations (Carothers equation, Flory-Huggins, rheology), daily numerical practice, and full 60-minute simulated CBT mock examinations with official negative marking (+1/+2, -0.33/-0.66).',
    },
    {
      q: 'Does PolymerHub cover college and CIPET learning topics?',
      a: 'Yes. The 19 subjects and 216 lessons align with curricula taught across CIPET centers (DPT, DPMT, PGD-PPT, B.Tech) and leading universities including ICT Mumbai, MIT-WPU Pune, Anna University, and HBTU Kanpur.',
    },
    {
      q: 'Are the lessons suitable for beginners?',
      a: 'Yes. Subjects are organized with clear foundational stepping stones. Beginners can start with Polymer Chemistry and Polymer Physics fundamentals before progressing into specialized subjects like Mould Design, Composites, Rheology, and Advanced Compounding.',
    },
    {
      q: 'Can I use PolymerHub on my phone?',
      a: 'Yes. PolymerHub is fully responsive and optimized mobile-first. Lessons, formula reference cards, and engineering calculators run smoothly on smartphones, and the web app can be installed directly to your home screen as a PWA.',
    },
    {
      q: 'Does PolymerHub provide AI-assisted learning?',
      a: 'Yes. The Polymer AI Copilot uses Retrieval-Augmented Generation (RAG) grounded strictly in our 216 lessons and 98 formulas. When you ask a technical question, it cites the exact lesson and mathematical formula rather than generating generic web hallucinations.',
    },
    {
      q: 'Is PolymerHub affiliated with any university or institute?',
      a: 'No. PolymerHub of India is an independent educational technology platform built by NextGen India. Academic syllabi, ASTM/ISO standard designations, and GATE references are indexed under the fair dealing provisions of Section 52 of the Indian Copyright Act 1957 for educational instruction.',
    },
    {
      q: 'How can I contact the founder or report an issue?',
      a: (
        <span>
          You can reach our team anytime at{' '}
          <a href="mailto:support@polymerhubofindia.com" className="text-blue-600 underline font-semibold">
            support@polymerhubofindia.com
          </a>{' '}
          or message the founder directly at{' '}
          <a href="mailto:founder@polymerhubofindia.com" className="text-blue-600 underline font-semibold">
            founder@polymerhubofindia.com
          </a>. You can also use the contact composer in the website footer or message our WhatsApp community channel.
        </span>
      ),
    },
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-950 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 font-sans">
            Straightforward answers to the most common questions from students, aspirants, and engineers.
          </p>
        </div>

        {/* Accordion List (12 Questions) */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.q}
                className="bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden transition-all hover:border-blue-400 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 sm:py-5 px-6 text-left flex items-center justify-between gap-4 hover:bg-slate-100/60 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-sm sm:text-base text-slate-950">
                    {idx + 1}. {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-200/80 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
