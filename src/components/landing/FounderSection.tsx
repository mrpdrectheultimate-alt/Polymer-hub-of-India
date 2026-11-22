import Image from 'next/image'
import Link from 'next/link'
import { Heart, Mail, Sparkles, MapPin, GraduationCap, Code2, ArrowRight } from 'lucide-react'

export default function FounderSection() {
  return (
    <section id="founder" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 text-white rounded-3xl border-2 border-slate-800 p-8 sm:p-12 shadow-2xl max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left: Founder Avatar / Badge */}
            <div className="flex-shrink-0 text-center space-y-3">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-blue-500 shadow-2xl mx-auto bg-slate-800 flex items-center justify-center">
                <span className="font-display font-black text-4xl sm:text-5xl text-blue-400">
                  LN
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  Ch. LPK Naidu
                </h3>
                <p className="text-xs font-mono text-blue-400 mt-0.5">
                  Founder &amp; Lead Architect
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>Hyderabad &middot; Gujarat, India</span>
                </div>
              </div>
            </div>

            {/* Right: The Mission & Narrative */}
            <div className="space-y-4 text-slate-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> The Mission Behind PolymerHub
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white leading-tight">
                Built by a student engineer for India&apos;s polymer community.
              </h2>

              <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-300">
                &ldquo;PolymerHub was started because I saw engineering peers across plastics and chemical disciplines constantly struggling with fragmented learning: ancient photocopied notes, broken YouTube playlists, and a complete absence of modern interactive tools. While computer science had GitHub and LeetCode, polymer engineering in India was left behind.
              </p>

              <p className="text-xs sm:text-sm font-sans leading-relaxed text-slate-300">
                I built PolymerHub as an independent developer &mdash; combining full-stack software architecture with rigorous polymer science curricula, 3D molecular structures, shop-floor diagnostic algorithms, and dedicated GATE XE-F preparation. Our mission is to make world-class polymer engineering education and tooling accessible to every student, technician, and converter in India.&rdquo;
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <a
                  href="mailto:founder@polymerhubofindia.com"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>founder@polymerhubofindia.com</span>
                </a>
                <Link
                  href="/about"
                  className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  <span>Read Full About Story</span>
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
