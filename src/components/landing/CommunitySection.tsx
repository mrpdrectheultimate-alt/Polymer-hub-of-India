import { MessageCircle, Send, Users, ArrowRight } from 'lucide-react'

export default function CommunitySection() {
  return (
    <section id="community" className="py-20 sm:py-24 bg-[#0B101D] border-b border-slate-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Engineering Community Network
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Learn together. Grow together.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Join thousands of polymer science students, CIPET trainees, and industrial converters across India. Never prepare or troubleshoot alone.
          </p>
        </div>

        {/* 2 Big Community Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Official WhatsApp Channel */}
          <div className="bg-[#070A12] rounded-3xl border border-emerald-500/30 hover:border-emerald-500 p-8 shadow-2xl flex flex-col justify-between hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-6 h-6 fill-emerald-500/20" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Official Channel
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Polymer Hub of India
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed mb-6">
                Official community for B.Tech, Diploma, and CIPET plastics &amp; polymer engineering students across India. Daily morning formulas, spot price intelligence, and platform updates.
              </p>

              <div className="space-y-2.5 text-xs font-mono text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Daily 8:00 AM Formula &amp; Concept Drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Real-time Indian domestic resin spot updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Free &amp; privacy-protected (no phone sharing)</span>
                </div>
              </div>
            </div>

            <a
              href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Join Official WhatsApp Channel</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 2: GATE XE-F Telegram Mastermind */}
          <div className="bg-[#070A12] rounded-3xl border border-blue-500/30 hover:border-blue-500 p-8 shadow-2xl flex flex-col justify-between hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  GATE Mastermind 🎯
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-blue-400 transition-colors">
                PolymerHub GATE XE-F Mastermind
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed mb-6">
                Official community for GATE Engineering Sciences (XE Paper F) aspirants. Master polymer science, solve challenging numericals, and discuss PYQs with fellow aspirants.
              </p>

              <div className="space-y-2.5 text-xs font-mono text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Daily morning numerical question (8:00 AM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Full mathematical derivations (Carothers, rheology)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Downloadable revision formula sheets &amp; PYQs</span>
                </div>
              </div>
            </div>

            <a
              href="https://t.me/polymerhubofindia"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Join Telegram Mastermind</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  )
}
