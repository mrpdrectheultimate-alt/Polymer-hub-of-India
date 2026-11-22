import Link from 'next/link'
import { ArrowRight, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="bg-slate-950 py-20 text-white relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Start Today &middot; 100% Free Core Access
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
          Your polymer engineering journey starts here.
        </h2>

        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          Join students, GATE aspirants, and plant engineers mastering polymer science, mould design, and processing parameters across India. Start learning today without any cost.
        </p>

        {/* Dual Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login?mode=signup"
            className="w-full sm:w-auto px-10 py-4 rounded-xl font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://whatsapp.com/channel/0029Vb9GCBDGU3BNTFEMeR3l"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span>Join WhatsApp Channel</span>
          </a>
        </div>

        {/* Bottom Feature Badges */}
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
