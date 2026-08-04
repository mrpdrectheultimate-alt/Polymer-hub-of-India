'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check, Users, BarChart2, Send, Building, Layers, CheckCircle
} from 'lucide-react'

export default function EnterpriseLandingPage() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    interestArea: 'training',
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
          interestArea: 'training',
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
    <div className="min-h-screen bg-canvas text-ink font-sans pb-16">
      {/* Hero Section */}
      <header className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Building className="w-5 h-5 text-ink" />
            <span className="font-mono text-[9px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">PolymerHub Enterprise</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none">
            EMPOWER YOUR TEAM.<br />
            TRAIN WITH THE <span className="underline">BEST IN CLASS</span>.
          </h1>
          <p className="text-ink/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Upskill your polymer engineering departments, configure customized training tracks, analyze conceptual skill gaps, and hire validated top percentile talent.
          </p>
        </div>
      </header>

      {/* Feature Blocks */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Bulk Seat Licenses',
            desc: 'Equip your entire college department or manufacturing floor with premium access. HODs get complete dashboards to revoke or assign seats on-the-fly.',
            icon: Users,
            color: '#3B82F6'
          },
          {
            title: 'Custom Training Tracks',
            desc: 'Onboard fresh hires with curated syllabi, dedicated extrusion modules, mould simulators, and safety checklists specific to your operational workflows.',
            icon: Layers,
            color: '#10B981'
          },
          {
            title: 'Skill Gap Heatmaps',
            desc: 'Access deep-dive analytics. Our platform flags conceptual weak points where student or employee quiz success rates fall below standard thresholds.',
            icon: BarChart2,
            color: '#F59E0B'
          }
        ].map(feat => (
          <div key={feat.title} className="border-4 border-ink bg-white p-6 shadow-hard space-y-3">
            <div className="w-10 h-10 border-2 border-ink flex items-center justify-center text-white" style={{ backgroundColor: feat.color }}>
              <feat.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-black text-ink">{feat.title}</h3>
            <p className="text-xs text-ink/75 leading-relaxed font-mono">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing Matrix */}
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl font-black text-center uppercase">Flexible Corporate & College Licensing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Academic Starter',
              price: '₹5,000',
              period: '/semester',
              features: ['Up to 50 seats', 'HOD Seat Control Panel', 'College Performance Analytics', 'Syllabus alignment'],
              cta: 'Register College',
              bg: '#EFF6FF',
              color: '#1D4ED8'
            },
            {
              title: 'Hiring Partnership',
              price: 'Custom',
              period: 'Quote',
              features: ['Candidate search access', 'Sponsored coding/formulation challenges', 'Custom talent filters', 'Side-drawer profile audits'],
              cta: 'Partner with us',
              bg: '#FFF7ED',
              color: '#EA580C'
            },
            {
              title: 'Enterprise Standard',
              price: '₹15,000',
              period: '/semester',
              features: ['Up to 200 seats', 'Custom machinery simulator configurations', 'Bulk PDF download logs', 'Skill gap heatmaps'],
              cta: 'Request Quote',
              bg: '#FDF2F8',
              color: '#DB2777'
            }
          ].map(plan => (
            <div key={plan.title} className="border-4 border-ink bg-white shadow-hard flex flex-col justify-between" style={{ borderColor: plan.color }}>
              <div className="p-6 space-y-4">
                <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5" style={{ backgroundColor: plan.bg, color: plan.color }}>{plan.title}</span>
                <div className="pt-2">
                  <span className="font-display text-4xl font-black text-ink">{plan.price}</span>
                  <span className="font-mono text-xs text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-2 pt-2 border-t-2 border-slate-100">
                  {plan.features.map(f => (
                    <li key={f} className="text-xs text-ink/80 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-slate-50 border-t-2 border-slate-100">
                <a href="#contact"
                  className="w-full border-2 border-ink text-center py-2 font-mono text-[9px] font-black uppercase tracking-wider block hover:bg-ink hover:text-white transition-all shadow-hard-xs">
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="contact" className="max-w-2xl mx-auto px-4 py-12">
        <div className="border-4 border-ink bg-white shadow-hard p-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-display text-2xl font-black text-ink uppercase">✉️ Enterprise Inquiry</h3>
            <p className="font-mono text-[10px] text-slate-400 uppercase">Submit details to customize a corporate license plan</p>
          </div>

          {submitted ? (
            <div className="border-4 border-green-600 bg-green-50 p-6 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <h4 className="font-display text-lg font-black text-green-900 uppercase">Request Registered!</h4>
              <p className="font-mono text-xs text-green-800 leading-normal">
                Thank you for your interest. A PolymerHub onboarding advisor will contact you within 24 hours to set up your corporate dashboard.
              </p>
              <button onClick={() => setSubmitted(false)}
                className="border-2 border-ink bg-white px-4 py-1.5 font-mono text-[9px] font-black uppercase shadow-hard-xs">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Company / Institution Name</label>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="e.g. CIPET, Reliance"
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Contact Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="e.g. rajesh@cipet.in"
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Contact Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Area of Interest</label>
                <select value={form.interestArea} onChange={e => setForm(f => ({ ...f, interestArea: e.target.value }))}
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none bg-white">
                  <option value="training">Premium Corporate Training Package</option>
                  <option value="seats">Academic Bulk Seat Licenses</option>
                  <option value="recruitment">Hiring Partner / Sponsored Challenges</option>
                  <option value="other">Other custom arrangements</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Detailed Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Explain your seat quantities or targeted recruitment specifications..."
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none min-h-[100px]"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full border-4 border-ink bg-ink text-white font-mono text-xs font-black uppercase py-3 shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {loading ? 'Submitting request...' : 'Send Inquiry Request'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer Nav back-link */}
      <div className="text-center pt-4">
        <Link href="/dashboard" className="font-mono text-[10px] text-slate-400 hover:text-ink uppercase tracking-wider transition-colors">
          ← Back to Student Dashboard
        </Link>
      </div>
    </div>
  )
}
