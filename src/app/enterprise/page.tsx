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
  Check,
  Calendar,
  AlertTriangle
} from 'lucide-react'

const PLANS = [
  {
    id: 'academic',
    name: 'Academic Starter',
    price: '₹5,000',
    period: '/semester',
    seats: 'Up to 50 student seats (~₹100/student)',
    features: [
      'HOD Seat Control & Roster Panel',
      'Batch Exam & Quiz Performance Analytics',
      '19 Disciplines Curriculum Alignment (216 Lessons)',
      'Individual Student Progress Tracking',
      'Downloadable PDF Technical Dossiers',
    ],
    cta: 'Register College Department',
    popular: true,
    color: 'border-[#2563EB] ring-2 ring-blue-500/20 shadow-md',
    badge: '⭐ RECOMMENDED FOR COLLEGES',
    badgeClass: 'bg-blue-100 text-[#1E40AF] border-blue-300'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Standard',
    price: '₹15,000',
    period: '/semester',
    seats: 'Up to 200 engineer seats (~₹75/seat)',
    features: [
      'Custom Machinery Simulator Configurations',
      'Skill Gap Matrix & Department Heatmaps',
      'Mould Defect & Extrusion Training Tracks',
      'Dedicated Institutional Support Engineer',
      'Exportable CSV & Compliance Reporting',
    ],
    cta: 'Request Corporate Quote',
    popular: false,
    color: 'border-slate-900 shadow-sm',
    badge: 'Industrial Plants & OEMs',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  {
    id: 'hiring',
    name: 'Hiring & R&D Partnership',
    price: 'Custom',
    period: 'Institutional Tier',
    seats: 'Unlimited Recruiter & Talent Access',
    features: [
      'Top Percentile Talent Search & Screening',
      'Sponsored Technical Engineering Challenges',
      'Direct Academic Portfolio & CAD Audits',
      'Campus Recruitment Pipeline Integration',
      'Co-branded Research & Pitch Tracks',
    ],
    cta: 'Partner With PolymerHub',
    popular: false,
    color: 'border-slate-900 shadow-sm',
    badge: 'Recruiters & R&D Labs',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
  },
]

export default function EnterpriseLandingPage() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    interestArea: 'Academic Bulk Seat Licenses (50 Seats)',
    message: '',
    agreedToPrivacy: true,
    isDemoRequest: false
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent, isDemo: boolean = false) => {
    e.preventDefault()
    if (!form.agreedToPrivacy) {
      alert('Please agree to the privacy policy to submit your institutional request.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/enterprise/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          interestArea: isDemo ? `[DEMO REQUEST] ${form.interestArea}` : form.interestArea
        })
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
          interestArea: 'Academic Bulk Seat Licenses (50 Seats)',
          message: '',
          agreedToPrivacy: true,
          isDemoRequest: false
        })
      }
    } catch {
      alert('Failed to submit contact request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20 font-sans">

      {/* ─── HERO SECTION: DEEP ENGINEERING NAVY ─── */}
      <section className="bg-gradient-to-br from-[#0B132B] via-[#0F2042] to-[#0A1128] text-white py-16 md:py-20 px-4 sm:px-6 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-2">
            <Building className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-200">
              Institutional Licensing &middot; Corporate Training &middot; Talent Pipelines
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Build Polymer Engineering Teams <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] via-[#FFFFFF] to-[#38BDF8] pb-2.5 pt-0.5 leading-[1.15]">
              That Are Ready for Industry.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Deploy structured polymer engineering curricula, virtual laboratories, gate assessments, and AI-assisted learning across your college, department, or enterprise organization.
          </p>

          {/* Transparent Pre-Launch Metrics Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="font-display text-xl font-bold text-white block">500+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Waitlist &amp; Signups</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="font-display text-xl font-bold text-[#38BDF8] block">19</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Disciplines Mapped</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="font-display text-xl font-bold text-white block">216</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Curriculum Lessons</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="font-display text-xl font-bold text-emerald-400 block">Target: 95%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Lab &amp; Exam Competency</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN WORKSPACE ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-12">
        
        {/* ─── OUTCOME-DRIVEN VALUE PROPOSITION CARDS WITH UI MOCKUPS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Bulk Seat Management */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-blue-200 bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Bulk Seat Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Save up to 40% on batch licenses. HODs get complete dashboards to assign, rotate, or reallocate student seats on-the-fly.
              </p>
            </div>

            {/* Mini UI Mockup */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Active Seat Roster:</span>
                <span className="text-[#2563EB]">124 / 150 Seats</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '82.6%' }} />
              </div>
              <span className="text-slate-400 block text-[9px]">82.6% Batch Engagement Rate</span>
            </div>
          </div>

          {/* Card 2: Skill Gap Heatmaps */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-amber-200 bg-amber-50 flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Skill Gap Heatmaps</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Identify exactly where your cohort struggles across 19 subjects before semester exams or placement drives.
              </p>
            </div>

            {/* Mini UI Mockup */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-700">Mould Design:</span>
                <span className="text-emerald-600 font-bold">84% Pass</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Polymer Testing:</span>
                <span className="text-blue-600 font-bold">69% Pass</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Rheology:</span>
                <span className="text-rose-600 font-bold">61% (Review Req.)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Custom Training Tracks */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                <Settings className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Curriculum &amp; Plant Tracks</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Pre-configured modules matching AICTE, CIPET, and major polymer processing plants (Injection, Extrusion, Compounding).
              </p>
            </div>

            {/* Mini UI Mockup */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[10px]">
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-blue-100 text-[#1E40AF] rounded border border-blue-200 font-bold">CIPET / AICTE</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-200 font-bold">ASTM / ISO</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-200 font-bold">GATE XE-F</span>
              </div>
              <span className="text-slate-500 block text-[9px] mt-1">✓ 19 Core Engineering Disciplines Verified</span>
            </div>
          </div>

        </div>

        {/* ─── PRICING PLANS GRID (READABLE SLATE-900 TEXT) ─── */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#2563EB] uppercase">Transparent Institutional Licensing</span>
            <h2 className="font-display text-3xl font-black uppercase text-slate-900">
              Corporate &amp; College Plans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map(plan => (
              <div 
                key={plan.id}
                className={`bg-white rounded-3xl border-2 p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl hover:-translate-y-0.5 ${plan.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-[10px] font-mono font-bold rounded-full uppercase border ${plan.badgeClass}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-black text-slate-900">{plan.price}</span>
                      <span className="font-mono text-xs text-slate-500">{plan.period}</span>
                    </div>
                    <p className="text-xs text-[#2563EB] font-mono font-bold mt-1">{plan.seats}</p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-slate-800 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact"
                  className={`w-full py-3.5 text-center font-mono font-bold text-xs uppercase tracking-wider rounded-xl border-2 transition-all block ${
                    plan.popular
                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-blue-700 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                  }`}
                >
                  {plan.cta} &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ENTERPRISE INQUIRY & DEMO FORM ─── */}
        <section id="contact" className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider block">Custom Onboarding</span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 uppercase">Enterprise Inquiry &amp; Demo</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Submit your details to configure a corporate or college plan.</p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center space-y-3 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-display text-lg font-bold text-emerald-950 uppercase">Request Successfully Registered!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed font-medium">
                  Thank you for your inquiry. A PolymerHub institutional advisor will contact your department within 24 hours to set up your preview environment.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-emerald-700 text-white font-mono text-xs font-bold uppercase rounded-xl hover:bg-emerald-800 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">Company / Institution Name</label>
                    <input
                      type="text"
                      required
                      value={form.companyName}
                      onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                      placeholder="e.g. CIPET, Reliance, IIT, Supreme"
                      className="w-full p-3 border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">Contact Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.contactName}
                      onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                      placeholder="e.g. Dr. Rajesh Kumar / HOD"
                      className="w-full p-3 border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="e.g. rajesh@institute.edu.in"
                      className="w-full p-3 border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">Contact Phone (Optional)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-3 border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">Institutional Package of Interest</label>
                  <select
                    value={form.interestArea}
                    onChange={e => setForm(f => ({ ...f, interestArea: e.target.value }))}
                    className="w-full p-3 border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs bg-white outline-none text-slate-900 font-bold"
                  >
                    <option value="Academic Bulk Seat Licenses (50 Seats)">Academic Starter (50 Student Seats — ₹5,000/sem)</option>
                    <option value="Enterprise Standard Package (200 Seats)">Enterprise Standard (200 Seats — ₹15,000/sem)</option>
                    <option value="Custom Corporate Training Track">Custom Corporate Processing Track</option>
                    <option value="Hiring & R&D Partnership">Hiring &amp; R&amp;D Talent Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">Detailed Requirements</label>
                  <textarea
                    required
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Specify your department student count, target academic year, or specific machinery simulator requirements..."
                    className="w-full p-3 border-2 border-slate-200 focus:border-[#2563EB] rounded-xl text-xs bg-white outline-none text-slate-900 font-medium leading-relaxed"
                  />
                </div>

                {/* Privacy Consent Checkbox (DPDP & Compliance) */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    checked={form.agreedToPrivacy}
                    onChange={e => setForm(f => ({ ...f, agreedToPrivacy: e.target.checked }))}
                    className="mt-0.5 rounded border-slate-300 text-[#2563EB] focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="privacyConsent" className="text-xs text-slate-600 font-sans leading-tight cursor-pointer">
                    By submitting, I agree to the <Link href="/privacy" className="text-[#2563EB] underline">Privacy Policy</Link> and consent to receiving institutional onboarding communications.
                  </label>
                </div>

                {/* Dual Action CTAs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={loading}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#38BDF8]" />
                    <span>Request Institutional Demo</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Submitting...' : 'Send Inquiry Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* ─── LIGHT BOTTOM AI CURRICULUM ADVISOR SECTION (NO DARK NAVY BLOCK) ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border-2 border-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#1E40AF] bg-blue-100 border border-blue-300 px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> PolymerHub AI &middot; Institutional Curriculum Advisor
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-slate-900">
            Need customized syllabus or lab simulator mapping? <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#0D9488] pb-2.5 pt-0.5 leading-[1.15]">
              Draft Your Department Blueprint.
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-normal">
            Draft preliminary custom curriculum blueprints for university curricula, corporate onboarding modules, or accreditation reporting.
          </p>

          {/* Academic Board Approval Disclaimer */}
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs font-mono text-left">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Academic Governance Note:</strong> AI-generated syllabus suggestions are preliminary blueprints and require review &amp; approval by your institutional Board of Studies (BOS) or certified faculty before formal implementation.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Explain%20how%20PolymerHub%20enterprise%20licensing%20and%20HOD%20analytics%20can%20be%20integrated%20into%20a%20Polymer%20Engineering%20department"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Institutional Advisor &rarr;
            </Link>

            <Link
              href="/education"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl border-2 border-slate-300 hover:border-slate-400 transition-all"
            >
              <Compass className="w-4 h-4" /> Explore 19 Curricula
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
