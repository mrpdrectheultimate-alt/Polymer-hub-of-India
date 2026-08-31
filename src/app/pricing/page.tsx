'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Cpu,
  Lock,
  Building2,
  Award,
  Crown,
  Users,
  FileText,
  Database,
  Calculator,
  FlaskConical,
  Mail,
  TrendingUp,
  Download,
  Layers
} from 'lucide-react'
import RazorpayCheckout from '@/components/RazorpayCheckout'
import Footer from '@/components/Footer'

// ==================== DATA ====================

const PLANS = [
  {
    id: 'free',
    name: 'Free Forever',
    monthlyPrice: 0,
    period: '/ FOREVER',
    tagline: 'Essential study tools and fundamental syllabus.',
    bestFor: 'Students exploring PolymerHub',
    badge: null,
    icon: BookOpen,
    color: '#64748B',
    features: [
      { icon: BookOpen, text: 'All 19 core subjects (216+ lessons)' },
      { icon: Sparkles, text: '15 AI tutor queries per day' },
      { icon: Database, text: 'Polymer materials database (basic)' },
      { icon: Layers, text: 'Shop-floor defect troubleshooting' },
      { icon: Download, text: 'Mobile PWA offline access' },
    ],
    cta: 'Start Learning Free',
    ctaLink: '/signup',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Engineer',
    monthlyPrice: 149,
    period: '/ MONTH',
    tagline: 'The complete polymer engineering suite & unlimited RAG AI.',
    bestFor: 'Engineers serious about polymer science',
    badge: '⭐ Most Popular',
    icon: Crown,
    color: '#2563EB',
    features: [
      { icon: Sparkles, text: 'Everything in Free tier' },
      { icon: Cpu, text: 'Unlimited AI tutor queries' },
      { icon: Database, text: 'Advanced material properties database (1,000+ TDS)' },
      { icon: FileText, text: 'Chemical resistance & processing tables' },
      { icon: Download, text: 'PDF lesson downloads with LaTeX math' },
      { icon: Calculator, text: '8 Industrial engineering calculators' },
      { icon: FlaskConical, text: 'ASTM virtual testing lab access' },
      { icon: Mail, text: 'Priority email engineering support' },
    ],
    cta: 'Upgrade to Premium',
    popular: true,
  },
  {
    id: 'institutional',
    name: 'Institutional Campus',
    monthlyPrice: 99,
    period: '/ SEAT / MO',
    tagline: 'For colleges, universities, CIPET centers & departments.',
    bestFor: 'Departments & colleges',
    badge: '🏛️ For Colleges',
    icon: Building2,
    color: '#10B981',
    features: [
      { icon: Crown, text: 'Everything in Premium plan' },
      { icon: Users, text: 'HOD seat allocator dashboard' },
      { icon: TrendingUp, text: 'Student performance & quiz analytics' },
      { icon: Award, text: 'College leaderboard ranking' },
      { icon: Users, text: 'Minimum 30 seats (₹2,970/mo minimum)' },
      { icon: BookOpen, text: 'Custom regional syllabus mapping' },
    ],
    cta: 'Request Campus Demo',
    ctaLink: '/enterprise',
    popular: false,
  },
]

const FAQS = [
  {
    q: 'How does payment work?',
    a: "Click 'Upgrade to Premium' to checkout securely with Razorpay. You can pay via UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Net Banking, or wallets. Premium is activated immediately upon successful payment."
  },
  {
    q: "What's the minimum order for Institutional plans?",
    a: 'Institutional plans require a minimum of 30 seats. That means the minimum monthly commitment is ₹2,970/month (₹99 × 30 seats). For campus-wide deployments above 200 seats, we offer additional volume tiering.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Premium is month-to-month with no long-term lock-in. You can pause or cancel anytime from your profile settings.'
  },
  {
    q: 'Is the free plan really free forever?',
    a: 'Yes. All core lessons across 19 subjects (216+ lessons), basic materials database, and 15 AI queries/day are free forever with no credit card required.'
  },
  {
    q: 'What if I have a complex industrial calculation?',
    a: 'Premium users get access to 8 industrial engineering calculators (clamping tonnage, cooling cycle, shrinkage, runner pressure drop) and priority email support within 24 hours.'
  },
  {
    q: 'Is this useful for GATE Polymer Science & Engineering (XE-F)?',
    a: 'Yes. Our curriculum covers all GATE XE-F topics, mathematical derivations, formula cheat-sheets, and simulated computer-based mock tests with negative marking.'
  },
]

const SOCIAL_PROOF = {
  students: '12,000+',
  colleges: '150+',
  label: 'engineering students across India'
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900">
      
      {/* ===== HERO: Midnight Navy with Tricolor Gradient ===== */}
      <section className="relative bg-[#0B172A] overflow-hidden py-16 lg:py-24 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero/students-polymer-lab.jpg"
            alt="PolymerHub pricing"
            fill
            className="object-cover opacity-15 filter grayscale contrast-125"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B172A] via-[#0B172A]/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        </div>

        {/* Ambient Radial Energy */}
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#F5C518]" />
              Simple, Transparent Pricing &middot; Zero Hidden Fees
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Choose How You
              <span className="block bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                Learn Polymer Engineering
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed font-light">
              Core B.Tech syllabus lessons and interactive tools are free forever. Upgrade to Premium 
              to unlock advanced engineering databases, PDF downloads, and unlimited AI tutoring.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-xs sm:text-sm font-semibold transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-white/40'}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 rounded-full bg-white/20 p-1 transition-colors border border-white/20 focus:outline-none"
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-md"
                  animate={{ x: billingPeriod === 'annual' ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </button>
              <span className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${billingPeriod === 'annual' ? 'text-white' : 'text-white/40'}`}>
                Annual
                <span className="px-2 py-0.5 rounded-full bg-[#F5C518]/20 text-[#F5C518] text-[10px] font-mono font-bold">
                  Save 20%
                </span>
              </span>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-white/50 font-mono">
              <span className="font-bold text-white">{SOCIAL_PROOF.students}</span>
              <span>students across</span>
              <span className="font-bold text-white">{SOCIAL_PROOF.colleges}</span>
              <span>colleges trust PolymerHub</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PRICING CARDS ===== */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => {
            const isAnnual = billingPeriod === 'annual' && plan.id === 'premium'
            const displayPrice = isAnnual ? '₹119' : `₹${plan.monthlyPrice}`
            const displayPeriod = isAnnual ? '/ MO (BILLED ANNUALLY)' : plan.period

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.15 }}
                className={`
                  bg-white rounded-3xl border-2 p-6 sm:p-8 relative flex flex-col justify-between transition-all
                  ${plan.popular 
                    ? 'border-[#2563EB] shadow-[0_8px_30px_rgba(37,99,235,0.14)] md:-translate-y-3' 
                    : 'border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
                  }
                  hover:-translate-y-2 hover:shadow-2xl duration-300
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#2563EB] text-white text-xs font-mono font-bold shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Target Audience Label */}
                  <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    {plan.bestFor}
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: `${plan.color}15` }}
                    >
                      <plan.icon className="h-6 w-6" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#111827]">{plan.name}</h3>
                      <p className="text-xs text-[#64748B] mt-0.5">{plan.tagline}</p>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="mb-6 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-[#111827] tracking-tight">{displayPrice}</span>
                      <span className="text-xs font-mono text-[#64748B] uppercase"> {displayPeriod}</span>
                    </div>
                    
                    {isAnnual && (
                      <div className="text-xs text-[#16A34A] font-semibold mt-1 font-mono">
                        ✓ Save ₹360/year vs monthly billing
                      </div>
                    )}
                    {plan.id === 'institutional' && (
                      <div className="text-xs text-[#64748B] font-mono mt-1">
                        Minimum 30 seats (₹2,970/mo commit)
                      </div>
                    )}
                    {plan.id === 'premium' && (
                      <div className="text-xs text-[#16A34A] font-semibold mt-1 font-mono">
                        ≈ ₹4 to ₹5 / day &middot; Cancel anytime
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475569]">
                        <feature.icon className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div>
                  {plan.id === 'premium' ? (
                    <div>
                      <RazorpayCheckout 
                        buttonText={isAnnual ? 'Start Annual Premium — ₹1,430/yr' : 'Start Premium — ₹149/mo'}
                        buttonClass="w-full py-3.5 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-blue-700 shadow-md transition-all text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
                        planName={plan.name}
                        amount={isAnnual ? 1430 : 149}
                        isAnnual={isAnnual}
                      />
                      <div className="mt-3 text-center text-[11px] text-[#94A3B8] font-mono flex items-center justify-center gap-1">
                        <Lock className="h-3 w-3 text-emerald-600" />
                        UPI Scan &middot; Instant Proof Verification &middot; Cards
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={plan.ctaLink || '/signup'}
                      className={`
                        w-full py-3.5 rounded-xl font-bold text-center transition-all block text-sm
                        ${plan.id === 'institutional' 
                          ? 'bg-[#10B981] text-white hover:bg-emerald-700 shadow-md' 
                          : 'bg-[#F1F5F9] text-[#111827] hover:bg-[#E2E8F0]'
                        }
                      `}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Help &amp; Support</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">Everything you need to know before getting started</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="border-2 border-[#E2E8F0] rounded-2xl overflow-hidden bg-white hover:border-[#2563EB]/40 transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors text-left"
                >
                  <span className="font-bold text-[#111827] text-sm flex items-center gap-2">
                    <span className="text-[#2563EB] font-mono">{index + 1}.</span>
                    {faq.q}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="h-4 w-4 text-[#94A3B8] shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#94A3B8] shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 pt-1"
                    >
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed border-t border-[#F1F5F9] pt-3">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== GLOBAL FOOTER WITH TRUST BAR ===== */}
      <Footer showTrustBar />

    </div>
  )
}
