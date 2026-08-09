// src/components/InjectionMoldingAnimator.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, RotateCw, Info } from 'lucide-react'

interface Stage {
  id: number
  name: string
  color: string
  description: string
}

const STAGES: Stage[] = [
  { id: 1, name: 'Clamping', color: '#1D4ED8', description: 'The mold halves close securely and clamp pressure is applied to prevent flashing.' },
  { id: 2, name: 'Injection', color: '#EA580C', description: 'The reciprocating screw plunges forward, forcing molten polymer into the mold cavity.' },
  { id: 3, name: 'Pack/Hold', color: '#7C3AED', description: 'High packing pressure is maintained to compensate for volumetric shrinkage during cooling.' },
  { id: 4, name: 'Cooling', color: '#15803D', description: 'Water channels dissipate thermal energy. The polymer cools and solidifies inside the mold.' },
  { id: 5, name: 'Mold Open', color: '#CA8A04', description: 'The movable mold plate retracts, opening the mold parting line.' },
  { id: 6, name: 'Ejection', color: '#B91C1C', description: 'Ejector pins actuate forward, pushing the solid plastic part out of the mold.' },
]

export function InjectionMoldingAnimator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStage, setCurrentStage] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Background grid
      ctx.fillStyle = '#0F172A' // slate-900 background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
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

      // Mold separation gap based on stage
      const moldGap = (currentStage >= 5) ? 60 : 15
      
      const leftMoldX = 140
      const rightMoldX = 140 + moldGap
      const moldY = 110
      const moldHeight = 160
      const moldWidth = 50

      // ── 1. BARREL & PLUNGER (Right side) ──────────────────────────────────
      const barrelX = 320
      const barrelY = moldY + 50
      const barrelWidth = 240
      const barrelHeight = 40

      // Draw heating bands on barrel
      ctx.fillStyle = '#F43F5E' // heated red
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(barrelX + 40 + i * 50, barrelY - 6, 20, barrelHeight + 12)
      }

      // Draw barrel body
      ctx.fillStyle = '#64748B' // slate-500
      ctx.fillRect(barrelX, barrelY, barrelWidth, barrelHeight)
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.strokeRect(barrelX, barrelY, barrelWidth, barrelHeight)

      // Nozzle orifice
      ctx.fillStyle = '#64748B'
      ctx.beginPath()
      ctx.moveTo(barrelX, barrelY + 10)
      ctx.lineTo(barrelX - 20, barrelY + 18)
      ctx.lineTo(barrelX - 20, barrelY + 22)
      ctx.lineTo(barrelX, barrelY + 30)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Hopper (resin supply)
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.moveTo(barrelX + 180, barrelY - 5)
      ctx.lineTo(barrelX + 150, barrelY - 45)
      ctx.lineTo(barrelX + 210, barrelY - 45)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#FFFFFF'
      ctx.stroke()

      // Resin pellets in hopper
      ctx.fillStyle = '#E2E8F0'
      for (let i = 0; i < 6; i++) {
        ctx.beginPath()
        ctx.arc(barrelX + 165 + (i * 6), barrelY - 15 - (i % 2 * 6), 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Reciprocating Screw shaft position
      // Screw moves forward in injection (stage 2) and packing (stage 3)
      const screwOffset = (currentStage === 2 || currentStage === 3) ? -35 : 0
      const screwX = barrelX + 60 + screwOffset
      const screwY = barrelY + 10
      const screwWidth = 175
      const screwHeight = 20

      ctx.fillStyle = '#94A3B8'
      ctx.fillRect(screwX, screwY, screwWidth, screwHeight)
      
      // Screw threads
      ctx.fillStyle = '#475569'
      for (let i = 0; i < 11; i++) {
        ctx.fillRect(screwX + i * 15, screwY - 2, 5, screwHeight + 4)
      }

      // ── 2. MOLD PLATES (Left side) ────────────────────────────────────────
      // Stationary platen (left)
      ctx.fillStyle = '#334155'
      ctx.fillRect(90, moldY - 20, 30, moldHeight + 40)
      ctx.strokeStyle = '#FFFFFF'
      ctx.strokeRect(90, moldY - 20, 30, moldHeight + 40)

      // Movable platen (far left shaft)
      ctx.fillStyle = '#334155'
      const movablePlatenOffset = (currentStage >= 5) ? -60 : 0
      ctx.fillRect(30 + movablePlatenOffset, moldY - 20, 30, moldHeight + 40)
      ctx.strokeRect(30 + movablePlatenOffset, moldY - 20, 30, moldHeight + 40)

      // Tie bars
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(20, moldY + 10)
      ctx.lineTo(340, moldY + 10)
      ctx.moveTo(20, moldY + moldHeight - 10)
      ctx.lineTo(340, moldY + moldHeight - 10)
      ctx.stroke()

      // Left mold half (Stationary)
      ctx.fillStyle = '#475569'
      ctx.fillRect(leftMoldX, moldY, moldWidth, moldHeight)
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 1.5
      ctx.strokeRect(leftMoldX, moldY, moldWidth, moldHeight)

      // Right mold half (Movable)
      ctx.fillStyle = '#475569'
      ctx.fillRect(rightMoldX, moldY, moldWidth, moldHeight)
      ctx.strokeRect(rightMoldX, moldY, moldWidth, moldHeight)

      // ── 3. CAVITY MELT RENDER ─────────────────────────────────────────────
      // Sprue bush feed path
      if (currentStage >= 2 && currentStage <= 5) {
        ctx.fillStyle = (currentStage === 4) ? '#EA580C' : // cooling turns orange
                       (currentStage === 5) ? '#475569' : '#EF4444' // solid turns gray/cool
        ctx.fillRect(leftMoldX - 20, barrelY + 15, 40, 10)
      }

      // Mold cavity inside parting line
      const cavityColor = (currentStage === 2 || currentStage === 3) ? '#EF4444' : // hot red
                           (currentStage === 4) ? '#EA580C' : // cooling orange
                           (currentStage === 5) ? '#94A3B8' : // cooled gray part
                           '#0F172A' // empty cavity in clamping / ejection

      ctx.fillStyle = cavityColor
      if (currentStage >= 2 && currentStage <= 5) {
        // draw tray shape cavity
        ctx.fillRect(leftMoldX + moldWidth - 8, moldY + 30, 8, moldHeight - 60)
        ctx.fillRect(leftMoldX + moldWidth - 8, moldY + 30, 20, 8)
        ctx.fillRect(leftMoldX + moldWidth - 8, moldY + moldHeight - 38, 20, 8)
      }

      // ── 4. EJECTED PART ───────────────────────────────────────────────────
      if (currentStage === 6) {
        // Draw ejector pins pushed out
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(leftMoldX + 10, moldY + 40)
        ctx.lineTo(leftMoldX + 45, moldY + 40)
        ctx.moveTo(leftMoldX + 10, moldY + moldHeight - 40)
        ctx.lineTo(leftMoldX + 45, moldY + moldHeight - 40)
        ctx.stroke()

        // Draw gravity-dropping completed tray part
        ctx.fillStyle = '#94A3B8'
        const dropY = moldY + 60 + (progressFrame * 4) // animate falling drop
        ctx.fillRect(leftMoldX + 60, dropY, 8, moldHeight - 90)
        ctx.fillRect(leftMoldX + 60, dropY, 15, 8)
        ctx.fillRect(leftMoldX + 60, dropY + moldHeight - 98, 15, 8)
      }

      // ── 5. WATER COOLING CHANNELS INDICATOR ───────────────────────────────
      if (currentStage === 4) {
        ctx.strokeStyle = '#38BDF8' // cooling water blue dots
        ctx.lineWidth = 3
        ctx.setLineDash([5, 10])
        ctx.beginPath()
        ctx.moveTo(leftMoldX + 25, moldY + 20)
        ctx.lineTo(leftMoldX + 25, moldY + moldHeight - 20)
        ctx.moveTo(rightMoldX + 25, moldY + 20)
        ctx.lineTo(rightMoldX + 25, moldY + moldHeight - 20)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    let progressFrame = 0
    let intervalId: ReturnType<typeof setInterval> | undefined
    
    if (currentStage === 6) {
      intervalId = setInterval(() => {
        progressFrame = (progressFrame + 1) % 15
        draw()
      }, 50)
    } else {
      draw()
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [currentStage])

  useEffect(() => {
    if (!isPlaying) return
    
    const timer = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= STAGES.length) {
          setIsPlaying(false)
          return 1
        }
        return prev + 1
      })
    }, 1800) // 1.8 seconds per cycle phase
    
    return () => clearInterval(timer)
  }, [isPlaying])

  const handleStageClick = (stage: number) => {
    setCurrentStage(stage)
    setIsPlaying(false)
  }

  const handlePlay = () => {
    setCurrentStage(1)
    setIsPlaying(true)
  }

  const handleReset = () => {
    setCurrentStage(1)
    setIsPlaying(false)
  }

  return (
    <div className="bg-white border-4 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-red-600 uppercase tracking-wider block mb-1">Molding equipment cycle controller</span>
          <h2 className="font-display font-black text-sm uppercase leading-tight">🏭 Injection Molding Cycle</h2>
        </div>

        <div className="flex gap-2 flex-wrap">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              className={`px-3 py-1.5 border-2 border-slate-900 rounded-lg text-[10px] font-mono font-black uppercase transition-all ${
                currentStage === stage.id ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100'
              }`}
              onClick={() => handleStageClick(stage.id)}
            >
              {stage.id}. {stage.name}
            </button>
          ))}
        </div>
        
        <div className="relative border-4 border-slate-900 rounded-xl overflow-hidden bg-[#0F172A]">
          <canvas ref={canvasRef} width={650} height={350} className="w-full block" />
        </div>

        <div className="flex gap-4">
          <button 
            className="flex-1 bg-red-600 text-white font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-slate-900 shadow-hard hover:bg-red-750 disabled:opacity-60 flex items-center justify-center gap-1.5"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            {isPlaying ? 'Running Cycle...' : (
              <>
                <Play className="w-4 h-4" /> Play Full Cycle
              </>
            )}
          </button>
          <button 
            className="px-6 py-3 border-2 border-slate-900 font-mono text-xs font-black uppercase rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            onClick={handleReset}
          >
            <RotateCw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Phase Context details banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">
              Stage {currentStage}: {STAGES[currentStage - 1].name}
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              {STAGES[currentStage - 1].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
