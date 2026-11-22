import { Sparkles, MessageCircle, Send } from 'lucide-react'
import WaitlistForm from './WaitlistForm'

export default function FinalCTA() {
  return (
    <section className="bg-[#070A12] border-t border-slate-800 py-24 sm:py-32 text-white relative overflow-hidden">
      
      {/* Decorative Luminous Cobalt Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Top Priority Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Early-Bird Launch Access &middot; Zero Cost Core
        </div>

        {/* Master Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-tight">
          Claim your priority spot on India&apos;s polymer knowledge ecosystem.
        </h2>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          Join students, GATE XE-F aspirants, and shop-floor engineers across India. Secure your early-bird position, get instant community access, and unlock day-one platform privileges.
        </p>

        {/* Integrated Waitlist Form Container */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="bg-[#0B101D]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-left">
            <WaitlistForm source="final_cta" />
          </div>
        </div>

        {/* Alternative Community Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono font-bold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span>Join WhatsApp Channel</span>
          </a>

          <a
            href="https://t.me/polymerhubofindia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono font-bold text-blue-300 bg-blue-950/50 hover:bg-blue-900/60 border border-blue-500/30 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4 text-blue-400" />
            <span>Join GATE Mastermind</span>
          </a>
        </div>

        {/* Bottom Feature Micro-Badges */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <span>📚 216 Lessons</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>🎓 19 Subjects</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>🧬 100+ 3D Models</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>🔧 8 Engineering Solvers</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>🎯 GATE XE-F Ready</span>
        </div>

      </div>
    </section>
  )
}
