'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Sparkles, Zap, GraduationCap } from 'lucide-react'
import RazorpayCheckout from '@/components/RazorpayCheckout'

const FREE_FEATURES = [
  { text: 'All core lessons (30+ lessons)', included: true },
  { text: '15 AI tutor queries per day', included: true },
  { text: 'Polymer materials database (basic)', included: true },
  { text: 'Subject-wise lesson navigation', included: true },
  { text: 'Mobile-friendly reading', included: true },
  { text: 'Unlimited AI tutor queries', included: false },
  { text: 'Advanced material properties', included: false },
  { text: 'Chemical resistance tables', included: false },
  { text: 'PDF lesson downloads', included: false },
  { text: 'Premium lessons (advanced topics)', included: false },
]

const PREMIUM_FEATURES = [
  { text: 'Everything in Free', included: true },
  { text: 'Unlimited AI tutor queries', included: true },
  { text: 'Advanced material properties', included: true },
  { text: 'Chemical resistance tables', included: true },
  { text: 'PDF lesson downloads', included: true },
  { text: 'Premium lessons (advanced topics)', included: true },
  { text: 'Processing condition datasheets', included: true },
  { text: 'Priority email support', included: true },
]

export default function PricingPage() {
  const [demoRequested, setDemoRequested] = useState(false)

  return (
    <div className="min-h-screen bg-canvas pb-16">

      {/* Hero */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                Pricing
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                PLANS
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              SIMPLE, HONEST<br />
              <span className="italic">PRICING PLANS</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm font-bold text-ink/70 leading-relaxed">
              Core B.Tech syllabus notes are free forever. Upgrade to Premium to unlock advanced tools, datasets, and unlimited AI tutoring support.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Free plan */}
          <div className="bg-white border-4 border-ink p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="mb-6 border-b-2 border-ink/10 pb-4">
                <h2 className="font-display font-black text-xl text-ink uppercase tracking-tight mb-1">Free Tier</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-ink font-mono">₹0</span>
                  <span className="text-ink/40 font-mono text-xs uppercase font-bold">/ forever</span>
                </div>
                <p className="text-xs font-bold text-ink/50 uppercase">Essential study tools to get started.</p>
              </div>

              <div className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    {f.included
                      ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      : <X className="w-4 h-4 text-ink/20 flex-shrink-0 mt-0.5" />
                    }
                    <span className={`text-xs font-bold ${f.included ? 'text-ink' : 'text-ink/30'}`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/login"
              className="w-full text-center border-4 border-ink bg-white hover:bg-slate-50 text-ink font-mono font-black text-xs py-3.5 uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              Get started free
            </Link>
          </div>

          {/* Premium plan */}
          <div className="bg-white border-4 border-ink p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(29,78,216,1)] flex flex-col justify-between">
            <div>
              <div className="mb-6 border-b-2 border-ink/10 pb-4">
                <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase border-2 border-ink shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mb-3">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
                <h2 className="font-display font-black text-xl text-ink uppercase tracking-tight mb-1">Premium Tier</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-ink font-mono">₹149</span>
                  <span className="text-blue font-mono text-xs uppercase font-bold">/ month</span>
                </div>
                <p className="text-xs font-bold text-blue uppercase">Complete platform unlock. Cancel anytime.</p>
              </div>

              <div className="space-y-3 mb-8">
                {PREMIUM_FEATURES.map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-ink">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <RazorpayCheckout
              buttonText="Upgrade to Premium"
              buttonClass="w-full border-4 border-ink bg-blue hover:bg-blue/90 text-white font-mono font-black text-xs py-3.5 uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            />
          </div>

          {/* Institutional plan */}
          <div className="bg-white border-4 border-ink p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(124,58,237,1)] flex flex-col justify-between">
            <div>
              <div className="mb-6 border-b-2 border-ink/10 pb-4">
                <div className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase border-2 border-ink shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mb-3">
                  <GraduationCap className="w-3 h-3" /> B2B Package
                </div>
                <h2 className="font-display font-black text-xl text-ink uppercase tracking-tight mb-1">Institutional Plan</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-ink font-mono">₹99</span>
                  <span className="text-violet-600 font-mono text-xs uppercase font-bold">/ seat / mo</span>
                </div>
                <p className="text-xs font-bold text-violet-600 uppercase">For colleges, universities & departments.</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { text: 'Everything in Premium plan', included: true },
                  { text: 'College-wide HOD seat allocator dashboard', included: true },
                  { text: 'Student performance metrics tracking', included: true },
                  { text: 'Collective college leaderboard rank', included: true },
                  { text: '30+ seats minimum purchase', included: true },
                  { text: 'Customized regional syllabus tags', included: true },
                ].map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-ink">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {demoRequested ? (
              <div className="border-2 border-dashed border-violet-600 bg-violet-50 p-4 text-center font-mono text-[10px] font-black uppercase text-violet-700 leading-snug">
                📨 Demo request received! Our B2B onboarding team will contact your department within 12 hours.
              </div>
            ) : (
              <button
                onClick={() => setDemoRequested(true)}
                className="w-full border-4 border-ink bg-violet-600 hover:bg-violet-700 text-white font-mono font-black text-xs py-3.5 uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
              >
                Request B2B Demo
              </button>
            )}
          </div>
        </div>

        {/* Promo code */}
        <div className="mt-6 border-4 border-ink p-5 shadow-hard" style={{ backgroundColor: '#FEFCE8', boxShadow: '3px 3px 0px 0px #EA580C' }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-black text-sm text-ink uppercase tracking-tight mb-1">
                3 months free promotion
              </p>
              <p className="text-xs text-ink/70 font-bold leading-normal">
                Use code <span className="font-mono font-black bg-white border border-ink px-1.5 py-0.5">PIIU2025</span> when submitting payment. Paste it into the verification message input box.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <div className="border-b-4 border-ink pb-2 mb-6">
            <h2 className="font-mono text-xs font-black text-ink uppercase tracking-widest">Common questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'How does payment work?',
                a: 'Click "Upgrade to Premium" to checkout securely with Razorpay. You can pay via UPI, cards, net banking, or wallets. Premium is activated immediately upon successful payment.',
              },
              {
                q: 'Can I cancel anytime?',
                a: "Yes. Premium is month-to-month. Just don't pay next month and your account reverts to the free plan automatically.",
              },
              {
                q: 'Is the free plan really free forever?',
                a: 'Yes. All core lessons (30+), basic materials database, and 15 AI queries/day are free forever. No trial, no expiry.',
              },
              {
                q: 'What if I have a question the AI can\'t answer?',
                a: 'Premium users get priority email support. We respond within 24 hours for subject-specific questions.',
              },
              {
                q: 'Is this useful for GATE preparation?',
                a: 'Yes. Our lessons cover topics tested in GATE Polymer Science paper. The AI tutor is great for quick revision before the exam.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-4 border-ink p-5 bg-white shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-display font-black text-sm text-ink mb-2 uppercase tracking-tight">{q}</h3>
                <p className="text-xs text-ink/70 font-bold leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
