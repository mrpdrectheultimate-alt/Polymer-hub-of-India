// src/components/PolymerizationAnimator.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, RotateCw, CheckCircle, Info } from 'lucide-react'

interface Monomer {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  symbol: string
  bonded: boolean
}

export function PolymerizationAnimator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'addition' | 'condensation'>('addition')
  const [isRunning, setIsRunning] = useState(false)
  const [monomers, setMonomers] = useState<Monomer[]>([])
  const [chainLength, setChainLength] = useState(0)

  // Initialize monomers
  const initMonomers = () => {
    const initialMonomers: Monomer[] = []
    const colors = ['#1D4ED8', '#EA580C', '#7C3AED', '#15803D']
    const symbols = ['E', 'S', 'P', 'A']
    
    for (let i = 0; i < 20; i++) {
      initialMonomers.push({
        id: i,
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 20,
        color: colors[i % colors.length],
        symbol: symbols[i % symbols.length],
        bonded: false,
      })
    }
    setMonomers(initialMonomers)
  }

  useEffect(() => {
    initMonomers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Animation loop
  useEffect(() => {
    if (!isRunning) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frameId: number
    let step = 0
    const totalSteps = 120 // slower animation (120 steps)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw background
      ctx.fillStyle = '#0F172A' // deep slate
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid
      ctx.strokeStyle = '#1E293B'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw monomers
      const progress = step / totalSteps
      const bondedCount = Math.floor(progress * monomers.length)
      const chainMonomers = monomers.slice(0, Math.max(1, bondedCount))
      
      // Draw floating (unbonded) monomers
      const floatingMonomers = monomers.slice(bondedCount)
      floatingMonomers.forEach(monomer => {
        // Move floating monomer slightly
        monomer.x += monomer.vx
        monomer.y += monomer.vy

        // Bounce off bounds
        if (monomer.x < monomer.radius || monomer.x > canvas.width - monomer.radius) monomer.vx *= -1
        if (monomer.y < monomer.radius || monomer.y > canvas.height - monomer.radius) monomer.vy *= -1

        const x = monomer.x
        const y = monomer.y

        // Draw monomer
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, monomer.radius)
        gradient.addColorStop(0, monomer.color)
        gradient.addColorStop(1, darkenColor(monomer.color, 0.6))
        ctx.beginPath()
        ctx.arc(x, y, monomer.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1.5
        ctx.stroke()
        
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 12px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(monomer.symbol, x, y)
      })

      // Draw chain (bonded monomers)
      chainMonomers.forEach((monomer, index) => {
        const spacing = 28
        const startX = (canvas.width - (chainMonomers.length - 1) * spacing) / 2
        const x = startX + index * spacing
        const y = canvas.height / 2
        
        // Draw bond between monomers
        if (index > 0) {
          ctx.strokeStyle = '#94A3B8'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(startX + (index - 1) * spacing, y)
          ctx.lineTo(x, y)
          ctx.stroke()
          
          // Condensation: draw released H₂O molecule floating away
          if (mode === 'condensation' && index % 2 === 0) {
            const h2oY = y - 30 - (step % 20)
            ctx.fillStyle = '#60A5FA'
            ctx.font = 'bold 10px monospace'
            ctx.fillText('H₂O ↑', x - spacing / 2, h2oY)
          }
        }
        
        // Draw monomer
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, monomer.radius)
        gradient.addColorStop(0, monomer.color)
        gradient.addColorStop(1, darkenColor(monomer.color, 0.6))
        ctx.beginPath()
        ctx.arc(x, y, monomer.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Draw symbol
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 12px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(monomer.symbol, x, y)
      })
      
      step++
      if (step <= totalSteps) {
        frameId = requestAnimationFrame(animate)
      } else {
        setChainLength(chainMonomers.length)
        setIsRunning(false)
      }
    }
    
    animate()
    return () => cancelAnimationFrame(frameId)
  }, [isRunning, monomers, mode])

  const handleStart = () => {
    setIsRunning(true)
    setChainLength(0)
  }

  const handleReset = () => {
    setIsRunning(false)
    setChainLength(0)
    initMonomers()
  }

  return (
    <div className="bg-white border-4 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Monomer addition & condensation visualizer</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🧬 Polymerization Simulator</h2>
        </div>

        <div className="flex gap-3">
          <button 
            disabled={isRunning}
            className={`flex-1 py-2 border-2 border-slate-900 rounded-xl font-mono text-xs uppercase font-black transition-all ${
              mode === 'addition' ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
            }`}
            onClick={() => setMode('addition')}
          >
            Addition
          </button>
          <button 
            disabled={isRunning}
            className={`flex-1 py-2 border-2 border-slate-900 rounded-xl font-mono text-xs uppercase font-black transition-all ${
              mode === 'condensation' ? 'bg-slate-900 text-white dark:bg-slate-800' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
            }`}
            onClick={() => setMode('condensation')}
          >
            Condensation
          </button>
        </div>
        
        <div className="relative border-4 border-slate-900 rounded-xl overflow-hidden bg-[#0F172A] dark:border-slate-800">
          <canvas ref={canvasRef} width={600} height={350} className="w-full block" />
        </div>
        
        <div className="flex gap-4">
          <button 
            className="flex-1 bg-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
            onClick={handleStart}
            disabled={isRunning}
          >
            {isRunning ? 'Polymerizing...' : (
              <>
                <Play className="w-4 h-4" /> Initiate Reaction
              </>
            )}
          </button>
          <button 
            className="px-6 py-3 border-2 border-slate-900 font-mono text-xs font-black uppercase rounded-lg hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 flex items-center gap-1.5"
            onClick={handleReset}
          >
            <RotateCw className="w-4 h-4" /> Reset
          </button>
        </div>
        
        {chainLength > 0 ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-900 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-green-800 dark:text-green-300">
                Reaction Finalized (DP: {chainLength} monomers)
              </p>
              <p className="text-[10px] text-green-700/85 dark:text-green-400/80 leading-normal">
                {mode === 'addition' 
                  ? 'Addition polymerization successfully linking monomers without side-products (e.g. Polyethylene/Polypropylene).' 
                  : 'Condensation polymerization successfully linking monomers while releasing water (H₂O) side-products (e.g. Polyesters/Nylon).'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg dark:bg-slate-900/50 dark:border-slate-800 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-normal">
              Click Initiate Reaction to see floating monomers align and chemically bond to form polymer chains.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function darkenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16) * factor
  const g = parseInt(hex.slice(3, 5), 16) * factor
  const b = parseInt(hex.slice(5, 7), 16) * factor
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}
