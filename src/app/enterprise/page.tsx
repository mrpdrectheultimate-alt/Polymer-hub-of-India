'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users, 
  BarChart2, 
  Send, 
  Building, 
  CheckCircle,
  Settings,
  Sparkles,
  Brain,
  Compass,
  Check
} from 'lucide-react'

const PLANS = [
  {
    id: 'academic',
    name: 'Academic Starter',
    price: '₹5,000',
    period: '/semester',
    seats: 'Up to 50 student seats',
    features: [
      'HOD Seat Control Panel',
      'College Performance Analytics',
      '19 Subjects Curriculum Alignment',
      'Student Progress Tracking',
      'Batch Exam Management',
    ],
    cta: 'Register College',
    popular: false,
    color: 'border-slate-900',
    badge: 'Universities & Colleges'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Standard',
    price: '₹15,000',
    period: '/semester',
    seats: 'Up to 200 engineer seats',
    features: [
      'Custom Machinery Simulator Configs',
      'Bulk PDF Technical Reports',
      'Skill Gap Matrix & Heatmaps',
      'Custom Processing Training Tracks',
      'Dedicated Account Engineer',
    ],
    cta: 'Request Corporate Quote',
    popular: true,
    color: 'border-blue-600',
    badge: '⭐ Most Popular'
  },
  {
    id: 'hiring',
    name: 'Hiring & R&D Partnership',
    price: 'Custom',
    period: 'Plan',
    seats: 'Unlimited Recruiter Access',
    features: [
      'Top Percentile Talent Search',
      'Sponsored Technical Challenges',
      'Campus Recruitment Pipelines',
      'Direct Portfolio Audits',
      'Custom Screening Tests',
    ],
    cta: 'Partner With Us',
    popular: false,
    color: 'border-slate-900',
    badge: 'Recruiters & OEMs'
  },
]

export default function EnterpriseLandingPage() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    interestArea: 'Premium Corporate Training Package',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/enterprise/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        setSubmitted(true)
        setForm({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          interestArea: 'Premium Corporate Training Package',
          message: ''
        })
      }
    } catch {
      alert('Failed to submit contact request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Enterprise &amp; Institutional Solutions &middot; Corporate Training &middot; Talent Pipelines
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Empower Your Team. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Train With The Best.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Upskill your polymer engineering departments, configure customized training tracks, analyze conceptual skill gaps, and hire validated top percentile talent.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">500+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Institutions &amp; OEMs</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">50K+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Seats Licensed</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">95%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Retention Rate</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">19</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Subjects Mapped</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Workspace ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-12">
        
        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Bulk Seat Licenses',
              desc: 'Equip your entire college department or manufacturing floor with premium access. HODs get complete dashboards to assign or rotate seats on-the-fly.',
              icon: Users,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              border: 'border-blue-200'
            },
            {
              title: 'Custom Training Tracks',
              desc: 'Onboard fresh hires with curated syllabi, dedicated extrusion modules, mould simulators, and safety checklists specific to your operational workflows.',
              icon: Settings,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200'
            },
            {
              title: 'Skill Gap Heatmaps',
              desc: 'Access deep-dive analytics. Our platform flags conceptual weak points where student or employee quiz success rates fall below standard thresholds.',
              icon: BarChart2,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              border: 'border-amber-200'
            }
          ].map(item => {
            const Icon = item.icon
            return (
              <div 
                key={item.title} 
                className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl border ${item.border} ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Pricing Plans Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Transparent Institutional Licensing</span>
            <h2 className="font-display text-3xl font-black uppercase text-slate-900">
              Corporate &amp; College Plans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map(plan => (
              <div 
                key={plan.id}
                className={`bg-white rounded-2xl border-2 p-6 shadow-sm flex flex-col justify-between space-y-6 transition-all hover:shadow-xl hover:-translate-y-0.5 ${plan.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-100 text-slate-800 text-[10px] font-mono font-bold rounded-full uppercase border border-slate-200">
                      {plan.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-black text-slate-900">{plan.price}</span>
                      <span className="font-mono text-xs text-slate-400">{plan.period}</span>
                    </div>
                    <p className="text-xs text-blue-600 font-mono font-bold mt-1">{plan.seats}</p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact"
                  className={`w-full py-3 text-center font-mono font-bold text-xs uppercase rounded-xl border-2 transition-all block ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                  }`}
                >
                  {plan.cta} &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <section id="contact" className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">Custom Onboarding</span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Enterprise Inquiry</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Submit your details to configure a corporate or college plan.</p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center space-y-3 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-display text-lg font-bold text-emerald-950 uppercase">Request Successfully Registered!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed font-medium">
                  Thank you for your inquiry. A PolymerHub institutional advisor will contact you within 24 hours to configure your customized dashboard.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-emerald-700 text-white font-mono text-xs font-bold uppercase rounded-xl hover:bg-emerald-800 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Company / Institution Name</label>
                    <input
                      type="text"
                      required
                      value={form.companyName}
                      onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                      placeholder="e.g. CIPET, Reliance, Supreme"
                      className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Contact Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.contactName}
                      onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                      placeholder="e.g. Dr. Rajesh Kumar"
                      className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Corporate Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="e.g. rajesh@institute.in"
                      className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Contact Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Area of Interest</label>
                  <select
                    value={form.interestArea}
                    onChange={e => setForm(f => ({ ...f, interestArea: e.target.value }))}
                    className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-bold"
                  >
                    <option value="Premium Corporate Training Package">Premium Corporate Training Package</option>
                    <option value="Academic Bulk Seat Licenses">Academic Bulk Seat Licenses</option>
                    <option value="Hiring Partner / Sponsored Challenges">Hiring Partner / Sponsored Challenges</option>
                    <option value="Custom Training Tracks">Custom Training Tracks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Detailed Requirements</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Explain your seat quantities or targeted recruitment specifications..."
                    className="w-full p-3 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-medium leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {loading ? 'Submitting request...' : 'Send Inquiry Request'}
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* ── BOTTOM AI ENTERPRISE ADVISOR CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Institutional Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Need customized syllabus or lab simulator mapping? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Institutional Advisor.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Generate custom AI-powered mapping for university curricula, corporate onboarding modules, or accreditation reporting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Explain%20how%20PolymerHub%20enterprise%20licensing%20and%20HOD%20analytics%20can%20be%20integrated%20into%20a%20Polymer%20Engineering%20department"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Institutional Advisor &rarr;
            </Link>

            <Link
              href="/education"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Academic Programs Hub
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
