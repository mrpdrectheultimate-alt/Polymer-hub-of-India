'use client'

import { useRef, useEffect, useState } from 'react'
import { getMoleculeData, getElementColor, getElementRadius } from '@/lib/molecule-generator'
import { getProductData } from '@/lib/product-generator'
import { getMachineData } from '@/lib/machine-generator'

interface ThreeDViewerProps {
  modelType: string
  name: string
  autoRotate?: boolean
  interactive?: boolean
  width?: number
  height?: number
  isModal?: boolean
}

interface Point3D {
  x: number
  y: number
  z: number
  color: string
  radius: number
  label?: string
}

interface Connection {
  from: number
  to: number
  color?: string
  width?: number
}

export function ThreeDViewer({
  modelType,
  name,
  autoRotate = true,
  interactive = true,
  width = 400,
  height = 280,
  isModal = false
}: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotationAngles = useRef({ x: 0.3, y: 0.5 })
  const zoomFactor = useRef(1.0)
  const [isInView, setIsInView] = useState(isModal)

  // IntersectionObserver to pause off-screen canvas loops entirely
  useEffect(() => {
    if (isModal) {
      setIsInView(true)
      return
    }

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [isModal])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationId: number
    let isSubscribed = true

    // ─── Generate Model Data ───
    const generateModelData = (): { points: Point3D[]; connections: Connection[] } => {
      if (modelType.startsWith('molecule_') || modelType.includes('molecule')) {
        const slug = modelType.replace('molecule_', '')
        const mol = getMoleculeData(slug)
        if (mol) {
          const pts: Point3D[] = mol.atoms.map((atom) => ({
            x: atom.x,
            y: atom.y,
            z: atom.z,
            color: getElementColor(atom.element),
            radius: getElementRadius(atom.element),
            label: atom.element,
          }))
          const conns: Connection[] = mol.bonds.map((bond) => ({
            from: bond.start,
            to: bond.end,
            color: '#E2E8F0',
            width: bond.type === 'double' ? 3.5 : bond.type === 'triple' ? 5 : 2,
          }))
          return { points: pts, connections: conns }
        }
      }

      if (modelType.startsWith('product_') || modelType.includes('product')) {
        const slug = modelType.replace('product_', '')
        return getProductData(slug)
      }

      if (modelType.startsWith('machine_') || modelType.includes('machine') || modelType.includes('extruder')) {
        const slug = modelType.replace('machine_', '')
        return getMachineData(slug)
      }

      const points: Point3D[] = [
        { x: -20, y: -20, z: -20, color: '#3B82F6', radius: 4 },
        { x: 20, y: -20, z: -20, color: '#3B82F6', radius: 4 },
        { x: 20, y: 20, z: -20, color: '#3B82F6', radius: 4 },
        { x: -20, y: 20, z: -20, color: '#3B82F6', radius: 4 },
        { x: -20, y: -20, z: 20, color: '#3B82F6', radius: 4 },
        { x: 20, y: -20, z: 20, color: '#3B82F6', radius: 4 },
        { x: 20, y: 20, z: 20, color: '#3B82F6', radius: 4 },
        { x: -20, y: 20, z: 20, color: '#3B82F6', radius: 4 },
      ]
      const connections: Connection[] = [
        { from: 0, to: 1, color: '#60A5FA' }, { from: 1, to: 2, color: '#60A5FA' },
        { from: 2, to: 3, color: '#60A5FA' }, { from: 3, to: 0, color: '#60A5FA' },
        { from: 4, to: 5, color: '#60A5FA' }, { from: 5, to: 6, color: '#60A5FA' },
        { from: 6, to: 7, color: '#60A5FA' }, { from: 7, to: 4, color: '#60A5FA' },
        { from: 0, to: 4, color: '#60A5FA' }, { from: 1, to: 5, color: '#60A5FA' },
        { from: 2, to: 6, color: '#60A5FA' }, { from: 3, to: 7, color: '#60A5FA' },
      ]
      return { points, connections }
    }

    const { points, connections } = generateModelData()

    // ─── Drawing Render Engine ───
    const draw = (angleX: number, angleY: number, zoom: number) => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2

      ctx.fillStyle = '#0F172A'
      ctx.fillRect(0, 0, w, h)

      // Background subtle circular grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, Math.min(w, h) * 0.38, 0, Math.PI * 2)
      ctx.stroke()

      const sinX = Math.sin(angleX)
      const cosX = Math.cos(angleX)
      const sinY = Math.sin(angleY)
      const cosY = Math.cos(angleY)
      const focusDistance = 400

      // 1. Perspective Transform
      const transformed = points.map(pt => {
        const x1 = (pt.x * cosY - pt.z * sinY) * zoom
        const z1 = pt.x * sinY + pt.z * cosY
        const y2 = (pt.y * cosX - z1 * sinX) * zoom
        const z2 = (pt.y * sinX + z1 * cosX) * zoom
        const perspective = focusDistance / (focusDistance + z2)
        const screenX = cx + x1 * perspective
        const screenY = cy + y2 * perspective

        return {
          screenX,
          screenY,
          depth: z2,
          radius: pt.radius * perspective,
          color: pt.color,
          label: pt.label
        }
      })

      // 2. Draw connections
      connections.forEach(conn => {
        const p1 = transformed[conn.from]
        const p2 = transformed[conn.to]
        if (!p1 || !p2) return

        ctx.strokeStyle = conn.color || '#CBD5E1'
        ctx.lineWidth = (conn.width || 2) * Math.max(0.6, (p1.radius + p2.radius) / 22)
        ctx.beginPath()
        ctx.moveTo(p1.screenX, p1.screenY)
        ctx.lineTo(p2.screenX, p2.screenY)
        ctx.stroke()
      })

      // 3. Draw sorted atom nodes
      const sortedIndices = transformed
        .map((node, idx) => ({ node, idx }))
        .sort((a, b) => b.node.depth - a.node.depth)

      sortedIndices.forEach(({ node }) => {
        const x = node.screenX
        const y = node.screenY
        const r = Math.max(1.5, node.radius)

        const radGrad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r)
        radGrad.addColorStop(0, '#FFFFFF')
        radGrad.addColorStop(0.35, node.color)
        radGrad.addColorStop(1, darkenColor(node.color, 0.45))

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = radGrad
        ctx.fill()

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 0.5
        ctx.stroke()

        if (node.label && r >= 6) {
          const fontSize = Math.max(8, Math.floor(r * 0.85))
          ctx.save()
          ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
          ctx.shadowBlur = 3
          ctx.fillStyle = '#FFFFFF'
          ctx.fillText(node.label, x, y)
          ctx.restore()
        }
      })
    }

    // Single static initial draw
    draw(rotationAngles.current.x, rotationAngles.current.y, zoomFactor.current)

    // Only start continuous animation if element is currently in view
    if (!isInView) return

    // Interactive Drag Handlers (Only attached to window when dragging is active!)
    let moveListener: ((e: MouseEvent) => void) | null = null
    let upListener: (() => void) | null = null

    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return
      isDragging.current = true
      previousMousePosition.current = { x: e.clientX, y: e.clientY }

      moveListener = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return
        const deltaX = moveEvent.clientX - previousMousePosition.current.x
        const deltaY = moveEvent.clientY - previousMousePosition.current.y
        rotationAngles.current.y += deltaX * 0.008
        rotationAngles.current.x -= deltaY * 0.008
        previousMousePosition.current = { x: moveEvent.clientX, y: moveEvent.clientY }
      }

      upListener = () => {
        isDragging.current = false
        if (moveListener) window.removeEventListener('mousemove', moveListener)
        if (upListener) window.removeEventListener('mouseup', upListener)
      }

      window.addEventListener('mousemove', moveListener)
      window.addEventListener('mouseup', upListener)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return
      isDragging.current = true
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !isDragging.current || e.touches.length === 0) return
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y
      rotationAngles.current.y += deltaX * 0.008
      rotationAngles.current.x -= deltaY * 0.008
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    const handleWheel = (e: WheelEvent) => {
      if (!interactive || !isModal) return
      e.preventDefault()
      const zoomDelta = e.deltaY * -0.001
      zoomFactor.current = Math.max(0.4, Math.min(2.5, zoomFactor.current + zoomDelta))
    }

    if (interactive) {
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
      canvas.addEventListener('touchmove', handleTouchMove, { passive: true })
      canvas.addEventListener('touchend', handleTouchEnd)
      if (isModal) {
        canvas.addEventListener('wheel', handleWheel, { passive: false })
      }
    }

    // Animation Loop
    const tick = () => {
      if (!isSubscribed) return
      if (autoRotate && !isDragging.current) {
        rotationAngles.current.y += isModal ? 0.006 : 0.004
      }
      draw(rotationAngles.current.x, rotationAngles.current.y, zoomFactor.current)
      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)

    return () => {
      isSubscribed = false
      cancelAnimationFrame(animationId)
      if (interactive) {
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('touchstart', handleTouchStart)
        canvas.removeEventListener('touchmove', handleTouchMove)
        canvas.removeEventListener('touchend', handleTouchEnd)
        if (isModal) {
          canvas.removeEventListener('wheel', handleWheel)
        }
      }
      if (moveListener) window.removeEventListener('mousemove', moveListener)
      if (upListener) window.removeEventListener('mouseup', upListener)
    }
  }, [modelType, autoRotate, interactive, isInView, isModal])

  return (
    <div
      ref={containerRef}
      className={`border border-slate-800 rounded-2xl overflow-hidden bg-[#0F172A] shadow-inner select-none relative group ${
        isModal ? 'cursor-grab active:cursor-grabbing w-full' : 'pointer-events-none'
      }`}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto block"
      />
      <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider shadow-sm flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        {name.split(' ')[0]} 3D
      </div>
      {isModal && (
        <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium text-slate-300 shadow-sm z-10 pointer-events-none flex items-center gap-1">
          <span>🖱️ Drag to rotate &middot; Scroll to zoom</span>
        </div>
      )}
    </div>
  )
}

function darkenColor(hex: string, factor: number): string {
  const cleanHex = hex.replace('#', '')
  if (cleanHex.length !== 6) return hex
  const r = parseInt(cleanHex.slice(0, 2), 16) * factor
  const g = parseInt(cleanHex.slice(2, 4), 16) * factor
  const b = parseInt(cleanHex.slice(4, 6), 16) * factor
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}
