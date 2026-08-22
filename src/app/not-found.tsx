// src/app/not-found.tsx — World-Class PolymerHub 404 Page
'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { 
  Home, 
  BookOpen, 
  FlaskConical, 
  Sparkles, 
  Calculator,
  Compass,
  ArrowLeft
} from 'lucide-react'

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated polymer chain background simulation (60fps canvas)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = []
    const colors = ['#1D4ED8', '#EA580C', '#15803D', '#7C3AED', '#CA8A04', '#0284C7']

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.75
      )
      gradient.addColorStop(0, '#0F2B4A')
      gradient.addColorStop(0.5, '#0A1628')
      gradient.addColorStop(1, '#060D18')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw subtle monomer connection chains
      for (let i = 0; i < 6; i++) {
        const startX = (canvas.width / 6) * i + 50
        const startY = (canvas.height / 6) * ((i * 2) % 6) + 30
        const length = 120 + ((i * 37) % 150)
        const angle = (Math.PI / 4) * i

        ctx.beginPath()
        ctx.moveTo(startX, startY)

        let x = startX
        let y = startY
        const segments = 6

        for (let j = 0; j < segments; j++) {
          const segLength = length / segments
          const segAngle = angle + (j % 2 === 0 ? 0.35 : -0.35)
          x += Math.cos(segAngle) * segLength
          y += Math.sin(segAngle) * segLength

          const radius = 2.5
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(59, 130, 246, 0.12)'
          ctx.fill()
        }
      }

      // Draw floating nodes & connecting bonds
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Bond lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 110)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }

        // Particle sphere
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '33'
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  // Quick navigation links
  const quickLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/subjects', label: '19 Subjects', icon: BookOpen },
    { href: '/materials', label: 'Materials Specs', icon: FlaskConical },
    { href: '/calculators', label: '8 Calculators', icon: Calculator },
    { href: '/ai-tutor', label: 'AI Polymer Tutor', icon: Sparkles },
  ]

  // Popular subjects
  const popularSubjects = [
    { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
    { name: 'Polymer Processing', slug: 'polymer-processing' },
    { name: 'Mould Design', slug: 'mould-design' },
    { name: 'Polymer Testing', slug: 'polymer-testing' },
    { name: 'Rubber Technology', slug: 'rubber-technology' },
    { name: 'Sustainable Plastics', slug: 'sustainable-plastics' },
    { name: 'Recycling Technology', slug: 'recycling-technology' },
  ]

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628] text-white select-none">
      {/* ─── Animated HTML5 Canvas Background ─── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* ─── Radial Gradient Vignette ─── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,13,24,0.7)_100%)] pointer-events-none z-10" />

      {/* ─── Floating Polymer Badges (Decorative CSS float) ─── */}
      <div className="absolute top-16 left-12 hidden lg:flex flex-col items-center gap-1 opacity-20 pointer-events-none z-10 animate-bounce" style={{ animationDuration: '6s' }}>
        <span className="text-6xl font-black text-blue-500 tracking-tighter">[ -CH₂-CH₂- ]ₙ</span>
        <span className="text-xs font-mono tracking-widest text-blue-300">POLYETHYLENE (PE)</span>
      </div>
      <div className="absolute bottom-20 right-12 hidden lg:flex flex-col items-center gap-1 opacity-20 pointer-events-none z-10 animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}>
        <span className="text-6xl font-black text-orange-500 tracking-tighter">[ -CH₂-CH(CH₃)- ]ₙ</span>
        <span className="text-xs font-mono tracking-widest text-orange-300">POLYPROPYLENE (PP)</span>
      </div>
      <div className="absolute top-24 right-20 hidden xl:flex flex-col items-center gap-1 opacity-15 pointer-events-none z-10">
        <span className="text-5xl font-black text-purple-400 font-mono">Tg: -120°C</span>
      </div>

      {/* ─── Main Content Container ─── */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6 shadow-lg shadow-black/20">
          <Compass className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="text-xs font-bold tracking-widest uppercase text-white/90">
            Chain Scission &middot; Error 404
          </span>
        </div>

        {/* Polymer 3D Symbol / Icon Box */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-900 border-2 border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-2xl">
              <span className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-400 via-purple-300 to-orange-400">
                ?
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider mt-0.5">
                Mₙ = 0 g/mol
              </span>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-orange-400">
            Polymer Chain Broken
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed mb-8 font-light">
          The link you followed experienced thermal degradation or does not exist.
          Let&apos;s guide you back to active research and lessons.
        </p>

        {/* Quick Navigation Cards */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 hover:border-white/30 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-black/30"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Popular Subjects Quick Jump */}
        <div className="bg-slate-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-8 max-w-2xl mx-auto shadow-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Quick Jump to Popular Disciplines
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSubjects.map((sub) => (
              <Link
                key={sub.slug}
                href={`/subjects/${sub.slug}`}
                className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500/50 px-3 py-1.5 rounded-lg transition-all"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Inspirational Quote Card */}
        <div className="border-l-4 border-orange-500 bg-orange-950/20 backdrop-blur-sm rounded-r-xl py-3 px-4 max-w-lg mx-auto text-left mb-6">
          <p className="text-xs text-orange-200/80 italic">
            &quot;In polymer science, unexpected crosslinks often lead to the strongest materials.&quot;
          </p>
          <span className="text-[10px] text-orange-400/60 block mt-1 font-mono uppercase tracking-wider">
            &mdash; PolymerHub Engineering Philosophy
          </span>
        </div>

        {/* Footer Brand */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 max-w-xl mx-auto">
          <span>PolymerHub &middot; India&apos;s #1 Polymer Engineering Platform</span>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
        </div>

      </div>
    </main>
  )
}
