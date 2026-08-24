'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  Shield, 
  CreditCard,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'
import RazorpayCheckout from '@/components/RazorpayCheckout'

const FAQS = [
  {
    question: 'How does payment work?',
    answer: 'Click "Upgrade to Premium" to checkout securely with Razorpay. You can pay via UPI, Credit/Debit cards, Net Banking, or mobile wallets. Premium is activated immediately upon successful payment.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. Premium is month-to-month with no lock-in. You can pause or cancel renewal anytime from your profile settings.',
  },
  {
    question: 'Is the free plan really free forever?',
    answer: 'Yes. All core lessons across 19 subjects, basic materials database, and 15 daily AI tutor queries are completely free forever.',
  },
  {
    question: 'What if I have a complex industrial calculation or question?',
    answer: 'Premium users unlock unlimited AI tutor queries and priority email support with responses from polymer engineers within 24 hours.',
  },
  {
    question: 'Is this useful for GATE Polymer Science & Engineering?',
    answer: 'Yes. Our curriculum covers all GATE XE-F syllabus topics, formulas, rationale engines, and timed mock tests with negative marking.',
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [demoRequested, setDemoRequested] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="relative bg-[#0B172A] overflow-hidden text-white border-b-2 border-slate-900">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1600&q=80"
            alt="PolymerHub Pricing"
            fill
            sizes="100vw"
            className="object-cover opacity-15 filter grayscale contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B172A] via-[#0B172A]/85 to-transparent" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 lg:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Simple, Transparent Pricing &middot; Zero Hidden Fees
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tight">
              Choose Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7722] via-[#FFFFFF] to-[#10B981]">
                Learning Path
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed font-light">
              Core B.Tech syllabus lessons and interactive tools are free forever. Upgrade to Premium to unlock advanced engineering databases, PDF downloads, and unlimited AI tutoring.
            </p>

            {/* Billing Frequency Toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm font-semibold transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-white/40'}`}>
                Monthly
              </span>
              <button
                type="button"
                aria-label="Toggle Billing Frequency"
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 rounded-full bg-white/20 p-1 transition-colors border border-white/20"
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-md"
                  animate={{ x: billingPeriod === 'annual' ? 26 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </button>
              <span className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${billingPeriod === 'annual' ? 'text-white' : 'text-white/40'}`}>
                Annual
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase">
                  Save 20%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* 1. Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl border-2 border-slate-200 p-7 lg:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl p-2.5 rounded-2xl bg-slate-100 border border-slate-200">📚</span>
                <div>
                  <h3 className="text-xl font-display font-black text-slate-900 uppercase">Free Tier</h3>
                  <p className="text-xs text-slate-500 font-medium">Essential study tools to get started.</p>
                </div>
              </div>

              <div className="mb-6 pt-2 pb-4 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-black text-slate-900">₹0</span>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">/ forever</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'All 19 core subjects (216+ lessons)',
                  '15 AI tutor queries per day',
                  'Polymer materials database (basic)',
                  'Shop-floor defect troubleshooter',
                  'Mobile PWA offline access',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/login"
              className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 text-center transition-all block border border-slate-200 active:scale-[0.98]"
            >
              Get Started Free →
            </Link>
          </motion.div>

          {/* 2. Premium Plan (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border-2 border-blue-600 p-7 lg:p-8 shadow-[0_10px_35px_rgba(37,99,235,0.15)] hover:shadow-2xl hover:-translate-y-1 transition-all relative flex flex-col justify-between"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Most Popular
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl p-2.5 rounded-2xl bg-blue-50 border border-blue-100">⭐</span>
                <div>
                  <h3 className="text-xl font-display font-black text-slate-900 uppercase">Premium Tier</h3>
                  <p className="text-xs text-blue-600 font-medium">Complete platform unlock. Cancel anytime.</p>
                </div>
              </div>

              <div className="mb-6 pt-2 pb-4 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-black text-slate-900">
                    {billingPeriod === 'annual' ? '₹119' : '₹149'}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                    {billingPeriod === 'annual' ? '/ mo (billed annually)' : '/ month'}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free tier',
                  'Unlimited Gemini AI tutor queries',
                  'Advanced CAMPUS material properties',
                  'Chemical resistance & processing tables',
                  'PDF lesson downloads with LaTeX math',
                  '8 Industrial engineering calculators',
                  'ASTM virtual testing lab benches',
                  'Priority email engineering support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <RazorpayCheckout
              buttonText="Upgrade to Premium →"
              buttonClass="w-full py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md"
            />
          </motion.div>

          {/* 3. Institutional Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl border-2 border-slate-200 p-7 lg:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl p-2.5 rounded-2xl bg-purple-50 border border-purple-100">🏛️</span>
                <div>
                  <h3 className="text-xl font-display font-black text-slate-900 uppercase">Institutional</h3>
                  <p className="text-xs text-purple-600 font-medium">For colleges, universities & departments.</p>
                </div>
              </div>

              <div className="mb-6 pt-2 pb-4 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-black text-slate-900">₹99</span>
                  <span className="text-xs font-mono font-bold text-purple-600 uppercase">/ seat / mo</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Premium plan for all students',
                  'College-wide HOD seat allocator dashboard',
                  'Student performance & quiz analytics tracking',
                  'Collective college leaderboard ranking',
                  'Minimum 30 seats batch deployment',
                  'Custom regional university syllabus mapping',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                    <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {demoRequested ? (
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-3.5 text-center text-xs font-medium text-purple-800 leading-snug">
                📨 Demo request received! Our B2B onboarding team will contact your department within 12 hours.
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDemoRequested(true)}
                className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-center transition-all block active:scale-[0.98]"
              >
                Request B2B Demo →
              </button>
            )}
          </motion.div>
        </div>

        {/* ── PROMO CODE BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 rounded-2xl border-2 border-amber-400/30 text-center flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-sm"
        >
          <div className="flex items-center gap-3 text-left">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-bold text-slate-900">
                3 Months Free Engineering Promotion
              </p>
              <p className="text-xs text-slate-600">
                Use coupon code when verifying payment to unlock immediate trial credits.
              </p>
            </div>
          </div>
          <code className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-900 font-mono font-bold text-sm tracking-wider select-all shadow-inner">
            PIIU2025
          </code>
        </motion.div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 uppercase">
            Common Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Everything you need to know about our plans, payments, and syllabus coverage
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={index}
                className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-800 text-sm flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-normal"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── TRUST SIGNALS FOOTER ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12 border-t border-slate-200 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-600" /> Secured by Razorpay
          </span>
          <span className="w-px h-3 bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-blue-600" /> UPI &middot; Credit/Debit Cards &middot; Net Banking
          </span>
          <span className="w-px h-3 bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600" /> Cancel Anytime
          </span>
          <span className="w-px h-3 bg-slate-300" />
          <span>🇮🇳 Made in India for Indian Engineers</span>
        </div>
      </section>
    </div>
  )
}
