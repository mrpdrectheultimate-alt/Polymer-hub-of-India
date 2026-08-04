'use client'


export function SocialLinks() {
  return (
    <div className="border-4 border-ink bg-yellow-bright shadow-hard p-6 rounded-2xl space-y-4">
      <div>
        <h3 className="font-display text-xl font-black text-ink uppercase tracking-tight">📱 Join The Polymer Community</h3>
        <p className="font-mono text-[9px] text-ink uppercase font-bold tracking-wide">Connect with students, researchers, and professional engineers</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="https://twitter.com/polymerhub_"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-2 border-ink bg-black text-white hover:bg-slate-950 px-4 py-2 font-mono text-[10px] font-black uppercase shadow-hard-xs transition-transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Follow @polymerhub_
        </a>

        <a
          href="https://linkedin.com/in/lpk-naidu-3414153b2"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-2 border-ink bg-[#0A66C2] text-white hover:bg-[#004182] px-4 py-2 font-mono text-[10px] font-black uppercase shadow-hard-xs transition-transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Connect on LinkedIn
        </a>

        <a
          href="https://t.me/PolymerHub"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-2 border-ink bg-[#0088CC] text-white hover:bg-[#006699] px-4 py-2 font-mono text-[10px] font-black uppercase shadow-hard-xs transition-transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Join Telegram Hub
        </a>
      </div>
    </div>
  )
}
