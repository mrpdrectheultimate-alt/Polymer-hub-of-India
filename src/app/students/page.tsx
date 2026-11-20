import { Metadata } from 'next'
import Link from 'next/link'
import { 
  BookOpen, 
  Sparkles, 
  Calculator, 
  Wrench, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Cpu, 
  Layers, 
  FileText, 
  QrCode, 
  Users, 
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Student Hub & Campus Learning Portal | PolymerHub India',
  description: 'Free structured learning for plastics & polymer engineering students across India: 216+ lessons, 19 subjects, 458+ GATE XE-F questions, formula library, and defect troubleshooting.',
  openGraph: {
    title: 'PolymerHub for Students | Learn Polymer Science & Plastics Engineering',
    description: 'Free curriculum-mapped lessons, formulas, shop-floor defect diagnosis, and GATE XE-F test series for B.Tech, Diploma, and CIPET students.',
    url: 'https://www.polymerhubofindia.com/students',
    siteName: 'PolymerHub of India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=630&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'PolymerHub Student Learning Portal',
      },
    ],
  },
}

const STUDENT_PILLARS = [
  {
    icon: BookOpen,
    title: '19 Subjects · 216+ Lessons',
    desc: 'Structured syllabus aligned with AICTE, CIPET, and premier university curricula — from Polymer Chemistry to Smart Mould Design.',
    tag: 'Curriculum Mapped',
    color: '#2563EB',
    href: '/subjects',
  },
  {
    icon: Award,
    title: '458+ GATE XE-F Question Bank',
    desc: 'Dedicated practice series for GATE XE Paper F (Polymer Science) with step-by-step Carothers, MFI, and cooling time derivations.',
    tag: 'GATE 2027 Ready',
    color: '#D97706',
    href: '/practice',
  },
  {
    icon: Wrench,
    title: 'Shop-Floor Defect Troubleshooter',
    desc: 'Solve splay, sink marks, warpage, and diesel effect with real metallurgical and thermodynamic corrective actions.',
    tag: 'Interview Weapon',
    color: '#059669',
    href: '/defects',
  },
  {
    icon: Calculator,
    title: '8 Industrial Calculators',
    desc: 'Calculate clamping tonnage, cooling time, MFI shear stress, and mold cavitation volume in under 5 seconds.',
    tag: 'Engineering Tools',
    color: '#7C3AED',
    href: '/calculators',
  },
  {
    icon: Cpu,
    title: 'Polymer-Specific AI Tutor',
    desc: '24/7 technical doubt-clearing trained specifically on polymer chemistry, rheology, and processing science.',
    tag: 'RAG Powered',
    color: '#DC2626',
    href: '/chat',
  },
  {
    icon: TrendingUp,
    title: 'Live Daily Spot Benchmarks',
    desc: 'Track daily Reliance Repol PP, Relene HDPE, Finolex PVC, and recycled resin spot prices updated every business day.',
    tag: 'Market Intel',
    color: '#0284C7',
    href: '/today',
  },
]

const STUDENT_PROFILES = [
  {
    title: 'CIPET Diploma & PGD-PPT Trainees',
    focus: 'Processing, Moulding & Quality Control',
    bullets: [
      'Master injection moulding parameter setup and defect prevention',
      'Learn ASTM D638, ASTM D1238, and ISO testing standards',
      'Prepare for shop-floor supervisory and QC roles'
    ]
  },
  {
    title: 'B.Tech / B.E Plastics & Polymer Students',
    focus: 'Semester Exams & GATE XE-F 2027',
    bullets: [
      'Pass semester exams with structured LaTeX derivations',
      'Practice 458+ multi-choice and numerical questions',
      'Build competitive depth in rheology, blends & composites'
    ]
  },
  {
    title: 'Final-Year Students & Job Seekers',
    focus: 'Campus Placements (Reliance, Supreme, Tata)',
    bullets: [
      'Crack technical rounds with real industrial defect case studies',
      'Understand resin selection, drying dew points, and mould cooling',
      'Download formula reference cheat-sheets for quick revision'
    ]
  }
]

export default function StudentsLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20 overflow-x-hidden">
      {/* ── Top Campus Announcement Bar ── */}
      <div className="bg-[#070F1E] border-b border-white/10 py-2 px-4 text-center">
        <p className="text-xs font-mono font-medium text-amber-400">
          🎓 Welcome Students & Faculty &middot; Free Curriculum Access Across All 19 AICTE &amp; CIPET Polymer Subjects
        </p>
      </div>

      {/* ── Hero Section ── */}
      <section className="bg-[#0A1628] text-white py-16 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              India&apos;s #1 Dedicated Polymer Engineering Learning Platform
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase max-w-4xl mx-auto">
            Master Plastics &amp; Polymers <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A] pb-2 pt-1 leading-[1.15]">
              From Molecules to Manufacturing
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Free structured learning for Diploma, B.Tech, and CIPET students. Access 216+ lessons, 458+ GATE practice numericals, shop-floor defect troubleshooters, and instant AI tutor doubt-solving.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all uppercase tracking-wider text-sm"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/practice"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 transition-all text-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Practice GATE XE-F Questions
            </Link>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 19 Specialized Subjects
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 216 Complete Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1,538 Verified Questions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Core Tier
            </span>
          </div>
        </div>
      </section>

      {/* ── The 6 Core Student Weapons ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
            Built For Indian Polymer &amp; Plastics Students
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">
            What You Can Do in 5 Minutes on PolymerHub
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Everything you need to top your semester exams, crack GATE XE-F, and ace your technical job interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_PILLARS.map((pillar, idx) => (
            <Link
              key={idx}
              href={pillar.href}
              className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-slate-900"
                    style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}
                  >
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
                    {pillar.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Explore Feature</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Who It Is For ── */}
      <section className="bg-slate-100 border-y-2 border-slate-900 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
              Tailored For Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">
              Which Student Are You?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDENT_PROFILES.map((prof, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-600">{prof.focus}</span>
                  <h3 className="text-xl font-bold text-slate-900">{prof.title}</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {prof.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Campus Visit & Workshop Request ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-full px-4 py-1 text-xs font-mono font-bold uppercase">
            🏛️ For HODs, Faculty &amp; Student Chapter Leads
          </div>

          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Host a Free 45-Minute Campus Workshop
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Invite the PolymerHub team to your college or CIPET center for an interactive masterclass on <em>&quot;Shop-Floor Defect Troubleshooting &amp; Cracking GATE XE-F&quot;</em>. All attending students receive 14 days of free premium access.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:contact@polymerhubofindia.com?subject=Campus%20Workshop%20Request%20for%20PolymerHub"
              className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl border-2 border-slate-900 shadow-md text-xs font-mono uppercase tracking-wider"
            >
              Request Campus Workshop
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl border border-white/20 text-xs font-mono uppercase tracking-wider"
            >
              View Institutional Plans (₹99/seat)
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-6">
        <h3 className="text-2xl font-black text-slate-900 uppercase text-center">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border-2 border-slate-900">
            <h4 className="font-bold text-slate-900 text-sm">Is PolymerHub really free for students?</h4>
            <p className="text-xs text-slate-600 mt-1">
              Yes! All 19 subjects (216+ lessons), basic material database, defect troubleshooters, and 15 daily AI queries are completely free forever. Premium unlocks unlimited AI queries, full 458+ GATE test bank with full derivations, and offline PDF downloads.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border-2 border-slate-900">
            <h4 className="font-bold text-slate-900 text-sm">How does this help with GATE XE-F 2027?</h4>
            <p className="text-xs text-slate-600 mt-1">
              GATE XE Paper F specifically tests polymer physics, rheology, synthesis kinetics, and processing. PolymerHub includes 458+ practice questions with step-by-step mathematical derivations for Carothers degree of polymerization, cooling times, and rule of mixtures.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border-2 border-slate-900">
            <h4 className="font-bold text-slate-900 text-sm">Can I access PolymerHub on my mobile phone?</h4>
            <p className="text-xs text-slate-600 mt-1">
              Yes, PolymerHub is a lightweight Progressive Web App (PWA). You can tap &quot;Add to Home Screen&quot; in Chrome or Safari on Android or iOS and use it just like a native mobile app without taking up heavy storage.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
