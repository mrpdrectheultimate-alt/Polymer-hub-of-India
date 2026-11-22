import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles, MapPin, Mail, ShieldCheck, Heart, Award, Code2, BookOpen, GraduationCap, ArrowRight } from 'lucide-react'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About PolymerHub of India | Founder, Mission & Academic Provenance',
  description: "Learn about PolymerHub of India, our mission to democratize polymer and plastics engineering education, and founder Ch. LPK Naidu's story.",
  openGraph: {
    title: 'About PolymerHub of India | Mission & Founder Story',
    description: "Building India's dedicated, integrated learning platform for polymer science and plastics technology.",
    url: 'https://polymerhubofindia.com/about',
  },
}

export default function AboutPage() {
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
            About &middot; Founder &amp; Mission
          </span>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" /> Independent Indian Engineering Initiative
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Building India&apos;s Dedicated Polymer Knowledge Ecosystem
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            From molecules to manufacturing &mdash; connecting fundamental chemistry, plastics processing parameters, industrial solvers, and GATE XE-F preparation in one platform.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Founder Story Block */}
        <section className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-200">
            <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white font-display font-black text-3xl flex items-center justify-center shadow-md shrink-0">
              LN
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900">
                Ch. LPK Naidu
              </h2>
              <p className="text-xs font-mono text-blue-600 font-bold mt-0.5">
                Founder, Software Architect &amp; Engineering Author
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Originally from Hyderabad &middot; Studying B.Tech CSE in Gujarat, India</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-sm font-sans leading-relaxed">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Why I Founded PolymerHub
            </h3>
            <p>
              During my academic journey, I noticed a striking gap in India&apos;s technical landscape. While computer science and coding enjoyed an explosion of modern interactive platforms like GitHub, LeetCode, and freeCodeCamp, India&apos;s core manufacturing sectors &mdash; particularly plastics and polymer engineering &mdash; remained marooned in the 1990s.
            </p>
            <p>
              Students preparing for semester exams at CIPET centers and engineering universities were relying on photocopied handwritten notes, blurry PDF scans of old handbooks, and fragmented YouTube playlists. Meanwhile, on the shop floor, machine operators and junior tooling engineers lacked quick digital calculators for clamp tonnages, mould shrinkage, and cooling cycles, having to guess or thumb through dense paper manuals.
            </p>
            <p>
              I founded PolymerHub of India to build the unified platform our engineering community deserves. Over months of relentless development, I architected a comprehensive platform featuring 19 subjects, 216 curriculum lessons, 100+ 3D molecular structures, 8 industrial calculators, 21 virtual lab simulators, and dedicated GATE XE-F preparation.
            </p>
          </div>
        </section>

        {/* 3 Core Operating Principles */}
        <section className="space-y-4">
          <h3 className="font-display font-bold text-xl text-slate-900">
            Our Core Operating Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-2">
              <div className="font-mono text-xs font-bold text-blue-600 uppercase">Principle 01</div>
              <h4 className="font-display font-bold text-base text-slate-900">Molecules to Manufacturing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never separate chemical synthesis from industrial processing. Theory and plant reality must always connect.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-2">
              <div className="font-mono text-xs font-bold text-emerald-600 uppercase">Principle 02</div>
              <h4 className="font-display font-bold text-base text-slate-900">100% Free Core Access</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every student in India deserves access to foundational education regardless of finances. The core curriculum remains free forever.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-2">
              <div className="font-mono text-xs font-bold text-purple-600 uppercase">Principle 03</div>
              <h4 className="font-display font-bold text-base text-slate-900">Academic &amp; Legal Integrity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All references, ASTM/ISO citations, and university syllabi are cited transparently under fair dealing provisions of the Indian Copyright Act 1957.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-lg text-white">Have feedback or want to collaborate?</h4>
            <p className="text-xs text-slate-400 font-mono">I personally read every email from students, professors, and plant engineers.</p>
          </div>
          <a
            href="mailto:founder@polymerhubofindia.com"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Email Founder Directly</span>
          </a>
        </div>

      </main>

      <div className="mt-16">
        <Footer showTrustBar />
      </div>

    </div>
  )
}
