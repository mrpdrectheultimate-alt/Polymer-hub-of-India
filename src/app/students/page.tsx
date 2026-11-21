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
  ExternalLink,
  Building,
  Target,
  MessageSquare,
  Flame,
  Star
} from 'lucide-react'
import Footer from '@/components/Footer'
import StudentInteractiveDemo from '@/components/students/StudentInteractiveDemo'

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

const ACADEMIC_HUBS = [
  { name: 'CIPET (All 42+ Centres)', note: 'Hyderabad, Ahmedabad, Chennai, Bhubaneswar, Lucknow, Bhopal' },
  { name: 'ICT Mumbai', note: 'Department of Polymer & Surface Engineering' },
  { name: 'MIT-WPU Pune', note: 'School of Polymer Engineering' },
  { name: 'L.D. College of Engineering', note: 'Rubber & Plastics Technology, Ahmedabad' },
  { name: 'Anna University Chennai', note: 'Department of Rubber and Plastics' },
  { name: 'HBTU Kanpur', note: 'School of Chemical Technology — Plastic Tech' },
  { name: 'COEP Technological University', note: 'Metallurgy & Materials / Polymers, Pune' },
  { name: 'IIT Roorkee / IIT Kharagpur', note: 'Polymer Science & Engineering' },
]

const TARGET_RECRUITERS = [
  { name: 'Reliance Industries', desc: 'Repol PP & Relene HDPE' },
  { name: 'Supreme Industries', desc: 'Piping & Injection Moulding' },
  { name: 'Tata AutoComp Systems', desc: 'Automotive Plastics' },
  { name: 'Nilkamal Limited', desc: 'Moulded Furniture & Crates' },
  { name: 'Motherson Sumi Systems', desc: 'Precision Automotive Injection' },
  { name: 'Finolex Industries', desc: 'PVC Resins & Pipe Compounds' },
  { name: 'EPL Limited (Essel)', desc: 'Multilayer Laminate Tubes' },
  { name: 'Alok Masterbatches', desc: 'Colour Science & Compounding' },
]

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
    href: '/troubleshooter',
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
    href: '/ai-tutor',
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
      'Master injection moulding parameter setup, cycle time, and defect prevention',
      'Learn ASTM D638, ASTM D1238, and ISO testing standards inside out',
      'Prepare for shop-floor supervisory, mould technician, and QC executive roles'
    ]
  },
  {
    title: 'B.Tech / B.E Plastics & Polymer Students',
    focus: 'Semester Exams & GATE XE-F 2027',
    bullets: [
      'Pass semester university exams with structured LaTeX mathematical derivations',
      'Practice 458+ multi-choice and numerical questions across all 9 syllabus sections',
      'Build competitive depth in rheology, polymer blends, and advanced composites'
    ]
  },
  {
    title: 'Final-Year Students & Job Seekers',
    focus: 'Campus Placements (Reliance, Supreme, Tata)',
    bullets: [
      'Crack core technical interviews with real industrial defect case studies',
      'Understand resin selection, drying dew points, and mould thermal cooling',
      'Download formula reference cheat-sheets for last-minute revision before rounds'
    ]
  }
]

const STUDENT_TESTIMONIALS = [
  {
    name: 'Rahul Verma',
    role: 'PGD-PPT Final Year',
    college: 'CIPET Ahmedabad',
    quote: 'The Rosato defect troubleshooter alone saved me in my Supreme Industries technical interview. Instead of generic answers, I explained parting-line vent depth and adiabatic compression burn marks.',
    badge: 'Placed at Supreme Industries'
  },
  {
    name: 'Sneha Kulkarni',
    role: 'B.Tech Polymer Engineering',
    college: 'MIT-WPU Pune',
    quote: 'Every GATE numerical in polymer physics has step-by-step derivations here. The Carothers formula breakdown and Ballman-Shusman cooling times are clearer than any textbook or coaching notes.',
    badge: 'GATE XE-F Aspirant'
  },
  {
    name: 'Mohammed Arshad',
    role: 'Diploma in Plastics Technology (DPT)',
    college: 'CIPET Hyderabad',
    quote: 'Having live daily spot resin prices and 8 injection calculators on my mobile phone makes shop-floor lab sessions effortless. The whole batch uses PolymerHub daily.',
    badge: 'Top 5% in Semester Lab'
  }
]

export default function StudentsLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20 overflow-x-hidden">
      {/* ── Top Campus Announcement Bar ── */}
      <div className="bg-[#070F1E] border-b border-white/10 py-2.5 px-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-medium text-amber-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>🎓 Welcome Students &amp; Faculty &middot; Free 100% Curriculum Access Across All 19 AICTE &amp; CIPET Polymer Subjects</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <Link href="/practice" className="hidden sm:inline text-white hover:text-amber-300 underline font-bold">
            Try 458+ Free GATE XE-F Questions &rarr;
          </Link>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="bg-[#0A1628] text-white py-16 sm:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 shadow-sm">
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
            Free structured learning for Diploma, B.Tech, and CIPET students across India. Access 216+ lessons, 458+ GATE practice numericals, shop-floor defect troubleshooters, and instant AI tutor doubt-solving.
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
              Solve GATE XE-F Practice Series
            </Link>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 19 Specialized Subjects
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 216 Curriculum Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 458+ GATE Questions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Core Tier
            </span>
          </div>
        </div>
      </section>

      {/* ── Academic Hubs Alignment Strip ── */}
      <section className="bg-white border-b-2 border-slate-900 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <span className="font-mono text-xs font-black uppercase text-slate-500 tracking-wider">
              Curriculum Aligned &amp; Designed For Students Across India:
            </span>
            <span className="text-[11px] font-mono text-blue-600 font-bold">
              AICTE Model Curriculum &middot; CIPET Syllabi &middot; GATE XE Paper F
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACADEMIC_HUBS.map((hub) => (
              <div
                key={hub.name}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-blue-400 transition-all"
              >
                <div className="font-mono text-xs font-bold text-slate-900 truncate">{hub.name}</div>
                <div className="font-mono text-[10px] text-slate-500 truncate mt-0.5">{hub.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive 5-Second Lab Sandbox (Centerpiece Component) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest inline-block">
            ⚡ Test Drive PolymerHub
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">
            Experience the Tools You Get in 5 Seconds
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Drag the sliders or tap defect options below to see how our engineering solvers work in real time.
          </p>
        </div>

        {/* Embedded Interactive Client Component */}
        <StudentInteractiveDemo />
      </section>

      {/* ── The 6 Core Student Weapons ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
            Built For Indian Polymer &amp; Plastics Students
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">
            What You Can Do on PolymerHub
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

      {/* ── Tailored Student Personas ── */}
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

      {/* ── Target Placement Recruiters Strip ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest inline-block">
            💼 Campus Placements &amp; Industry Career Weapon
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">
            Prepare for Technical Rounds at Top Employers
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Learn the exact polymer grades, processing windows, and defect troubleshooting tested by premier campus interviewers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TARGET_RECRUITERS.map((rec) => (
            <div
              key={rec.name}
              className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-1"
            >
              <div className="font-mono text-xs font-black text-slate-900">{rec.name}</div>
              <div className="font-mono text-[10px] text-slate-500">{rec.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Student Reviews & Campus Testimonials ── */}
      <section className="bg-[#0A1628] text-white border-y-2 border-slate-900 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              From Classrooms to Shop-Floors
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">
              What Students Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDENT_TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl p-6 border-2 border-white/20 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-1">
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs font-mono text-slate-400">{t.role} &middot; {t.college}</div>
                  <div className="inline-block font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    {t.badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Become a PolymerHub Campus Lead (Ambassador Program) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-mono text-xs font-black px-3 py-1 rounded-full uppercase border border-slate-900 shadow-2xs">
                <Flame className="w-3.5 h-3.5" /> Campus Leadership Role
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
                Become a PolymerHub Campus Lead
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 max-w-xl">
                Represent PolymerHub at your college or CIPET centre. Lead study circles, host peer problem-solving sessions, and earn recognized leadership credentials.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 text-center shrink-0">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">Student Lead Reward</span>
              <span className="text-2xl font-black text-emerald-600 font-display">₹35 / Signup</span>
              <span className="font-mono text-[10px] text-slate-600 block mt-0.5">+ Free Lifetime Access</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-1">
              <div className="font-bold text-slate-900 uppercase">⭐ Free Lifetime Premium</div>
              <p className="text-slate-600 text-[11px]">Unlimited AI queries, all 458+ GATE questions, and offline PDF formula sheets.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-1">
              <div className="font-bold text-slate-900 uppercase">📜 Certificate of Leadership</div>
              <p className="text-slate-600 text-[11px]">Official credentials signed by PolymerHub leadership for your LinkedIn and CV.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-1">
              <div className="font-bold text-slate-900 uppercase">🤝 Founder Mentorship</div>
              <p className="text-slate-600 text-[11px]">Direct monthly masterminds on industry hiring trends and polymer research.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <a
              href="mailto:contact@polymerhubofindia.com?subject=Application%20for%20PolymerHub%20Campus%20Lead&body=Hi%20PolymerHub%20Team%2C%0A%0AI%20am%20interested%20in%20becoming%20the%20Campus%20Lead%20for%20my%20college.%0A%0AName%3A%0ACollege%20%2F%20CIPET%20Centre%3A%0ABranch%20%26%20Year%3A%0APhone%20Number%3A%0A"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl border-2 border-slate-900 text-xs font-mono uppercase tracking-wider transition-all"
            >
              Apply as Campus Lead &rarr;
            </a>

            <span className="text-xs font-mono text-slate-600">
              Only 2 Campus Leads appointed per college / CIPET centre.
            </span>
          </div>
        </div>
      </section>

      {/* ── Official Student Community Channels (WhatsApp & Telegram) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-mono text-xs font-black px-3 py-1 rounded-full uppercase border border-emerald-300">
              <Users className="w-3.5 h-3.5" /> All-India Student Masterminds
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              Join India&apos;s Dedicated Polymer Communities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Connect directly with thousands of plastics and polymer students from CIPET, ICT Mumbai, MIT Pune, and colleges across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* WhatsApp Card */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border-2 border-slate-900 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center border-2 border-slate-900 shadow-xs">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.668-.699c.969.54 1.769.816 2.792.817h.005c3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.767-5.768-5.767zm3.393 8.163c-.144.405-.837.774-1.17.824-.311.045-.694.072-2.127-.518-1.748-.72-2.883-2.483-2.971-2.599-.088-.116-.708-.941-.708-1.794 0-.853.447-1.273.607-1.446.16-.174.348-.217.464-.217.116 0 .232.001.333.006.107.005.25-.041.391.297.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.059.116-.088.188-.175.29-.087.102-.183.228-.261.306-.087.087-.179.182-.077.356.101.174.45 1.742 1.488 2.665.342.304.629.499.845.568.216.069.412.06.567.037.174-.026.536-.219.611-.431.076-.212.076-.393.053-.431-.022-.038-.088-.06-.188-.11zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.637 0-3.161-.462-4.457-1.261l-.32-.198-2.956.775.789-2.882-.218-.346A8.209 8.209 0 013.75 12c0-4.549 3.701-8.25 8.25-8.25 4.549 0 8.25 3.701 8.25 8.25 0 4.549-3.701 8.25-8.25 8.25z"/>
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase">
                    Official Channel
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900">Polymer Hub of India (WhatsApp)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Instant updates on domestic spot resin prices, moulding defect troubleshooting guides, and technical interview placement drops.
                  </p>
                </div>
              </div>

              <a
                href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold px-6 py-3 rounded-xl border-2 border-slate-900 text-xs font-mono uppercase tracking-wider transition-all shadow-xs"
              >
                Join WhatsApp Channel &rarr;
              </a>
            </div>

            {/* Telegram Card */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border-2 border-slate-900 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0088CC] text-white flex items-center justify-center border-2 border-slate-900 shadow-xs">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z"/>
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-full uppercase">
                    GATE XE-F Mastermind
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900">PolymerHub GATE Mastermind (Telegram)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Daily 8:00 AM numerical derivations (Carothers, Ballman-Shusman cooling, Rule of Mixtures) and downloadable revision PDFs.
                  </p>
                </div>
              </div>

              <a
                href="https://t.me/polymerhubofindia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0088CC] hover:bg-[#0077b5] text-white font-bold px-6 py-3 rounded-xl border-2 border-slate-900 text-xs font-mono uppercase tracking-wider transition-all shadow-xs"
              >
                Join Telegram Mastermind &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Campus Visit & Workshop Request ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center space-y-6">
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
