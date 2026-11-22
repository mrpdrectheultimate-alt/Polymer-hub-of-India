'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  q: string
  a: React.ReactNode
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      q: 'What is PolymerHub of India?',
      a: 'PolymerHub of India is a dedicated digital learning and engineering platform connecting polymer science, plastics manufacturing technology, practical shop-floor calculators, and GATE XE-F examination preparation in one integrated ecosystem.',
    },
    {
      q: 'Is PolymerHub free to use?',
      a: 'Yes! The core learning platform is 100% free forever. All 19 subjects (216 lessons), the 3D molecular viewer, the defect troubleshooter, daily industry intelligence, and community channels are accessible at zero cost with no credit card required.',
    },
    {
      q: 'What is included in the ₹149/month Premium plan?',
      a: 'Premium gives serious engineers and GATE aspirants full access to all 8 industrial engineering solvers (clamp force, cooling time, shrinkage, etc.), the complete 98-formula library with mathematical derivations, 21 ASTM/ISO virtual testing simulators, full simulated GATE XE-F mock examinations, unlimited RAG AI queries, and downloadable PDF lesson notes.',
    },
    {
      q: 'Does PolymerHub cover CIPET and university B.Tech syllabi?',
      a: 'Yes. The 19 subjects and 216 lessons are structured in accordance with AICTE Model Guidelines and curricula from CIPET (DPT, DPMT, PGD-PPT, B.Tech), ICT Mumbai, MIT-WPU, Anna University, and HBTU Kanpur.',
    },
    {
      q: 'How does PolymerHub help with GATE XE-F preparation?',
      a: 'GATE Paper F (Polymer Science & Engineering) has historically lacked dedicated test series. PolymerHub provides official syllabus mapping, topic-wise derivations (Carothers equation, Flory-Huggins, MFI kinetics), numerical practice, and full-length 60-minute simulated mock tests with official negative marking (+1/+2, -0.33/-0.66).',
    },
    {
      q: 'Can I use PolymerHub on my mobile phone?',
      a: 'Absolutely. PolymerHub is engineered mobile-first. Over 75% of our learners access lessons, formulas, and calculators directly from their smartphones via mobile web or as an installable PWA.',
    },
    {
      q: 'Are the engineering calculators accurate for plant use?',
      a: 'All 8 calculators use established metallurgical, thermodynamic, and rheological equations (ASTM D3641, ISO 294, Ballman-Dutton cooling theory, and Rosato guidelines). They include standard safety factors and serve as rigorous engineering benchmarks for tool design and machine setting.',
    },
    {
      q: 'Is PolymerHub affiliated with AICTE, CIPET, or IIT Madras?',
      a: 'No. PolymerHub of India is an independent educational knowledge platform built by NextGen India. All university syllabi, ASTM/ISO designations, and GATE references are cited under fair dealing provisions of Section 52 of the Indian Copyright Act 1957 for academic instruction and educational indexing.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Under our statutory policy compliant with the Consumer Protection (E-Commerce) Rules, 2020, you can request a 100% refund within 7 days of subscribing to Premium if you are not completely satisfied. No questions asked.',
    },
    {
      q: 'How can I contact the founder or technical support team?',
      a: (
        <span>
          You can reach our team anytime at{' '}
          <a href="mailto:support@polymerhubofindia.com" className="text-blue-600 underline font-semibold">
            support@polymerhubofindia.com
          </a>{' '}
          or message the founder directly at{' '}
          <a href="mailto:founder@polymerhubofindia.com" className="text-blue-600 underline font-semibold">
            founder@polymerhubofindia.com
          </a>. You can also use the instant in-app contact composer in the website footer.
        </span>
      ),
    },
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-sans">
            Everything you need to know about PolymerHub, curriculum coverage, and access options.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center text-xs font-mono text-slate-500">
          <span>Have a question not listed here? </span>
          <Link href="/faq" className="text-blue-600 hover:underline font-bold">
            Read our full FAQ repository &rarr;
          </Link>
        </div>

      </div>
    </section>
  )
}
