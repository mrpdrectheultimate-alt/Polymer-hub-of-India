import Link from 'next/link'
import { Mail, Sparkles, MapPin, ArrowRight } from 'lucide-react'

export default function FounderSection() {
  return (
    <section id="founder" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-50 text-slate-900 rounded-3xl border-2 border-slate-200 p-8 sm:p-12 shadow-xl max-w-5xl mx-auto relative overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
            
            {/* Left: PolymerHub Official Emblem & Identity Card */}
            <div className="flex-shrink-0 text-center space-y-3">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl mx-auto bg-white p-5 flex items-center justify-center group hover:border-blue-400 hover:shadow-2xl transition-all">
                <img
                  src="/logo-icon.jpg"
                  alt="PolymerHub Emblem"
                  className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-slate-950">
                  PolymerHub of India
                </h3>
                <p className="text-xs font-mono text-blue-600 mt-0.5 font-semibold">
                  Engineering Knowledge Initiative
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 mt-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>Hyderabad &middot; Gujarat, India</span>
                </div>
              </div>
            </div>

            {/* Right: The Mission & Narrative */}
            <div className="space-y-4 text-slate-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> The Mission Behind PolymerHub
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-950 leading-tight">
                Built for India&apos;s polymer &amp; plastics engineering community.
              </h2>

              <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-700">
                &ldquo;PolymerHub was started because engineering students and professionals across plastics, polymer science, and chemical disciplines constantly struggled with fragmented resources: outdated photocopied notes, broken playlists, and an absence of dedicated interactive engineering tools. While computer science had GitHub and LeetCode, polymer engineering in India was left behind.
              </p>

              <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-700">
                PolymerHub was engineered as a comprehensive digital ecosystem &mdash; combining modern technical architecture with rigorous polymer curricula, interactive 3D molecular models, industrial injection press solvers, and dedicated GATE XE-F preparation. Our mission is to make world-class polymer engineering education and tooling accessible to every student, educator, technician, and plastics converter across India.&rdquo;
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <a
                  href="mailto:founder@polymerhubofindia.com"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>founder@polymerhubofindia.com</span>
                </a>
                <Link
                  href="/about"
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Read Full Platform Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
