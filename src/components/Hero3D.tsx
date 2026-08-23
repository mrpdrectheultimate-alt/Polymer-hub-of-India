'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Sparkles, BookOpen, GraduationCap, Play, Users } from 'lucide-react'

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDragging = useRef(false)
  const previousMouse = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0.4, y: 0.6 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    const handleResize = () => {
      if (!canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener('resize', handleResize)

    // ── Generate 3D Icosahedron & Polymer Lattice Geometry ──
    const phi = (1 + Math.sqrt(5)) / 2
    const baseVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.hypot(x, y, z)
      return { x: (x / len) * 160, y: (y / len) * 160, z: (z / len) * 160 }
    })

    // Additional polymer branch nodes
    const polymerNodes = [
      { x: 0, y: 0, z: 0, color: '#4F8FFF', radius: 10, label: 'C' },
      ...baseVertices.map((v, i) => ({
        ...v,
        color: i % 3 === 0 ? '#FF7722' : i % 3 === 1 ? '#10B981' : '#4F8FFF',
        radius: 6,
        label: i % 2 === 0 ? 'O' : 'H'
      }))
    ]

    const connections = [
      [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
      [1, 5], [1, 7], [1, 8], [1, 9],
      [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
      [3, 4], [3, 6], [3, 8], [3, 9],
      [4, 5], [4, 9], [4, 11],
      [5, 9], [5, 11],
      [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10],
      [8, 9], [10, 11]
    ]

    // Floating micro-particles background
    const bgParticles = Array.from({ length: 45 }, () => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      z: (Math.random() - 0.5) * 500,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(79, 143, 255, 0.4)' : 'rgba(16, 185, 129, 0.3)'
    }))

    const render = () => {
      if (!isDragging.current) {
        rotation.current.y += 0.005
        rotation.current.x += 0.002
      }

      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const fov = 500

      // Matrix rotation math
      const cosX = Math.cos(rotation.current.x)
      const sinX = Math.sin(rotation.current.x)
      const cosY = Math.cos(rotation.current.y)
      const sinY = Math.sin(rotation.current.y)

      const project = (p: { x: number; y: number; z: number }) => {
        // Rotate Y
        const x = p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY
        // Rotate X
        const y = p.y * cosX - z1 * sinX
        const z = p.y * sinX + z1 * cosX

        const scale = fov / (fov + z + 250)
        return {
          px: cx + x * scale,
          py: cy + y * scale,
          scale,
          z
        }
      }

      // Render background floating particles
      bgParticles.forEach((p) => {
        const prj = project(p)
        if (prj.scale > 0) {
          ctx.beginPath()
          ctx.arc(prj.px, prj.py, p.radius * prj.scale, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        }
      })

      // Project vertices
      const projectedNodes = polymerNodes.map((node) => ({
        ...node,
        ...project(node)
      }))

      // Render Connections
      ctx.lineWidth = 1.2
      connections.forEach(([i, j]) => {
        const n1 = projectedNodes[i]
        const n2 = projectedNodes[j]
        if (!n1 || !n2) return

        const avgZ = (n1.z + n2.z) / 2
        const alpha = Math.max(0.1, Math.min(0.6, (avgZ + 250) / 400))

        const grad = ctx.createLinearGradient(n1.px, n1.py, n2.px, n2.py)
        grad.addColorStop(0, n1.color)
        grad.addColorStop(1, n2.color)

        ctx.strokeStyle = grad
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.moveTo(n1.px, n1.py)
        ctx.lineTo(n2.px, n2.py)
        ctx.stroke()
      })

      ctx.globalAlpha = 1.0

      // Sort nodes by Z for depth rendering
      const sortedNodes = [...projectedNodes].sort((a, b) => a.z - b.z)

      sortedNodes.forEach((node) => {
        if (node.scale <= 0) return

        // Ambient node glow
        const rad = node.radius * node.scale
        const glow = ctx.createRadialGradient(node.px, node.py, 0, node.px, node.py, rad * 2.5)
        glow.addColorStop(0, node.color)
        glow.addColorStop(1, 'transparent')

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(node.px, node.py, rad * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Solid atom sphere
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(node.px, node.py, rad, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(node.px, node.py, rad * 0.8, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      previousMouse.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - previousMouse.current.x
      const dy = e.clientY - previousMouse.current.y
      rotation.current.y += dx * 0.008
      rotation.current.x += dy * 0.008
      previousMouse.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => {
      isDragging.current = false
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <section className="relative min-h-[92vh] bg-[#0A0E1A] overflow-hidden flex items-center">
      {/* 3D Interactive Canvas Layer */}
      <div className="absolute inset-0 pointer-events-auto">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A] via-[#0A0E1A]/70 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Floating Radial Ambient Halos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl space-y-6"
        >
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white/90 text-xs font-mono font-bold tracking-wider uppercase shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>🇮🇳 India&apos;s #1 Polymer Engineering Ecosystem</span>
          </motion.div>

          {/* Kinetic Tricolor Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.04] tracking-tight uppercase">
            Where Polymers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7722] via-[#FFFFFF] to-[#10B981] animate-pulse">
              Shape Tomorrow
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-2xl">
            Master the molecular science, shop-floor manufacturing parameters, and global trade dynamics of plastics, elastomers, and composites — crafted for India&apos;s next generation of engineers.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-2xl">
            {[
              { value: '216+', label: 'Lessons', icon: BookOpen, color: '#4F8FFF' },
              { value: '19', label: 'Subjects', icon: GraduationCap, color: '#FF7722' },
              { value: '357+', label: 'Videos', icon: Play, color: '#10B981' },
              { value: '5,000+', label: 'Engineers', icon: Users, color: '#EC4899' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-white/25 transition-all shadow-md flex items-center gap-3"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-white leading-tight">{stat.value}</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all"
            >
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Explore 19 Subjects <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Interactive Orbit Hint */}
      <div className="hidden lg:flex absolute bottom-8 right-12 z-10 items-center gap-2 text-white/40 text-xs font-mono bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        <span>Drag to orbit 3D macromolecule</span>
      </div>
    </section>
  )
}
