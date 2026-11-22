import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Send, MapPin, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact & Engineering Support Desk | PolymerHub India',
  description: 'Reach our technical support desk, message the founder directly, or access statutory grievance redressal under the DPDP Act 2023.',
  openGraph: {
    title: 'Contact PolymerHub of India | Support & Founder Desk',
    description: 'Get support for lessons, calculators, institutional campus licenses, or grievance redressal.',
    url: 'https://polymerhubofindia.com/contact',
  },
}

export default function ContactPage() {
  const channels = [
    {
      title: 'Student & Technical Support',
      desc: 'Encountered an issue with a lesson, formula derivation, or calculator? Our team assists with technical queries.',
      email: 'support@polymerhubofindia.com',
      badge: 'Technical Desk',
      sla: 'Response within 24 hours',
      color: 'blue',
    },
    {
      title: 'Founder Direct Desk',
      desc: 'Have a personal question, curriculum suggestion, partnership idea, or feedback for founder Ch. LPK Naidu?',
      email: 'founder@polymerhubofindia.com',
      badge: 'Founder Desk',
      sla: 'Personal reply from founder',
      color: 'amber',
    },
    {
      title: 'Institutional Campus & Enterprise',
      desc: 'For college HODs, CIPET center administrators, and plastics company HR teams seeking group seat allocations.',
      email: 'enterprise@polymerhubofindia.com',
      badge: 'Campus Licences',
      sla: 'Response within 12 hours',
      color: 'emerald',
    },
    {
      title: 'Statutory Grievance Redressal',
      desc: 'Under DPDP Act 2023, IT Act 2000 (Section 79), and Consumer Protection Rules 2020. Statutory Redressal Officer.',
      email: 'grievance@polymerhubofindia.com',
      badge: 'Legal & Compliance',
      sla: 'Acknowledgment in 24h · Resolution in 15d',
      color: 'purple',
    },
  ]

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
            Contact &amp; Support Gateway
          </span>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4 text-blue-400" /> Direct Support &amp; Communication Channels
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            How can we help you?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Reach out directly for technical assistance, syllabus feedback, institutional onboarding, or statutory grievance redressal.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        
        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((ch) => (
            <div
              key={ch.title}
              className="bg-white rounded-3xl border-2 border-slate-200 p-7 flex flex-col justify-between hover:border-blue-600 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                    {ch.badge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{ch.sla.split('·')[0]}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                  {ch.title}
                </h3>

                <p className="text-xs text-slate-600 font-sans leading-relaxed mb-6">
                  {ch.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`mailto:${ch.email}`}
                  className="w-full py-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-800 hover:text-white border border-slate-200 hover:border-blue-600 font-mono font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{ch.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Community Instant Channels Banner */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-3xl p-8 border-2 border-emerald-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-lg text-white">Need immediate community answers?</h4>
            <p className="text-xs text-slate-300 font-sans">
              Join thousands of students and engineers on our Official WhatsApp Channel and Telegram Mastermind.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-100" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://t.me/polymerhubofindia"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </a>
          </div>
        </div>

      </main>

      <div className="mt-16">
        <Footer showTrustBar />
      </div>

    </div>
  )
}
