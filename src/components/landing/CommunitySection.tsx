import { MessageCircle, Send, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function CommunitySection() {
  return (
    <section id="community" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-emerald-600" /> Engineering Community Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 tracking-tight">
            Learn together. Grow together.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-sans leading-relaxed">
            Join thousands of polymer science students, CIPET trainees, and industrial converters across India. Never prepare or troubleshoot alone.
          </p>
        </div>

        {/* 2 Big Community Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          
          {/* Card 1: Official WhatsApp Channel */}
          <div className="bg-white rounded-3xl border-2 border-emerald-300 p-8 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-emerald-500 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <MessageCircle className="w-6 h-6 fill-emerald-100" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Official Channel
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                Polymer Hub of India
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mb-6">
                Official community for B.Tech, Diploma, and CIPET plastics &amp; polymer engineering students across India. Daily morning formulas, spot price intelligence, and platform updates.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-600 mb-6">
                <div>&bull; Daily 8:00 AM Formula &amp; Concept Drop</div>
                <div>&bull; Real-time Indian domestic resin spot updates</div>
                <div>&bull; Free &amp; privacy-protected (no phone sharing)</div>
              </div>
            </div>

            <a
              href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Join Official WhatsApp Channel</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 2: GATE XE-F Telegram Mastermind */}
          <div className="bg-white rounded-3xl border-2 border-blue-300 p-8 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-blue-500 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  GATE Mastermind 🎯
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                PolymerHub GATE XE-F Mastermind
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mb-6">
                Official community for GATE Engineering Sciences (XE Paper F) aspirants. Master polymer science, solve challenging numericals, and discuss PYQs with fellow aspirants.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-600 mb-6">
                <div>&bull; Daily morning numerical question (8:00 AM)</div>
                <div>&bull; Full mathematical derivations (Carothers, rheology)</div>
                <div>&bull; Downloadable revision formula sheets &amp; PYQs</div>
              </div>
            </div>

            <a
              href="https://t.me/polymerhubofindia"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-sm"
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
