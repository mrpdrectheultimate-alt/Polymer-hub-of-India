'use client'

import { useRef, useEffect } from 'react'
import { getMoleculeData, getElementColor, getElementRadius } from '@/lib/molecule-generator'
import { getProductData } from '@/lib/product-generator'
import { getMachineData } from '@/lib/machine-generator'

interface ThreeDViewerProps {
  modelType: string
  name: string
  autoRotate?: boolean
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
  color?: string;
  width?: number;
}

export function ThreeDViewer({ modelType, name, autoRotate = true }: ThreeDViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotationAngles = useRef({ x: 0.3, y: 0.5 }) // Initial angles
  const zoomFactor = useRef(1.0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    // ─── Coordinate Generators for presets ───
    const generateModelData = (): { points: Point3D[]; connections: Connection[] } => {
      // 1. Check Molecule Presets
      if (modelType.startsWith('molecule_') || modelType.includes('molecule')) {
        const slug = modelType.replace('molecule_', '');
        const mol = getMoleculeData(slug);
        if (mol) {
          const pts: Point3D[] = mol.atoms.map((atom) => ({
            x: atom.x,
            y: atom.y,
            z: atom.z,
            color: getElementColor(atom.element),
            radius: getElementRadius(atom.element),
            label: atom.element,
          }));
          const conns: Connection[] = mol.bonds.map((bond) => ({
            from: bond.start,
            to: bond.end,
            color: '#E5E7EB',
            width: bond.type === 'double' ? 4 : bond.type === 'triple' ? 6 : 2,
          }));
          return { points: pts, connections: conns };
        }
      }

      // 2. Check Product Presets
      if (modelType.startsWith('product_') || modelType.includes('product')) {
        const slug = modelType.replace('product_', '');
        return getProductData(slug);
      }

      // 3. Check Machine Presets
      if (modelType.startsWith('machine_') || modelType.includes('machine') || modelType.includes('extruder')) {
        const slug = modelType.replace('machine_', '');
        return getMachineData(slug);
      }

      // Fallback: Default to a simple cube representing loading or unknown model
      const points: Point3D[] = [
        { x: -20, y: -20, z: -20, color: '#6366F1', radius: 3 },
        { x: 20, y: -20, z: -20, color: '#6366F1', radius: 3 },
        { x: 20, y: 20, z: -20, color: '#6366F1', radius: 3 },
        { x: -20, y: 20, z: -20, color: '#6366F1', radius: 3 },
        { x: -20, y: -20, z: 20, color: '#6366F1', radius: 3 },
        { x: 20, y: -20, z: 20, color: '#6366F1', radius: 3 },
        { x: 20, y: 20, z: 20, color: '#6366F1', radius: 3 },
        { x: -20, y: 20, z: 20, color: '#6366F1', radius: 3 },
      ];
      const connections: Connection[] = [
        { from: 0, to: 1, color: '#818CF8' }, { from: 1, to: 2, color: '#818CF8' },
        { from: 2, to: 3, color: '#818CF8' }, { from: 3, to: 0, color: '#818CF8' },
        { from: 4, to: 5, color: '#818CF8' }, { from: 5, to: 6, color: '#818CF8' },
        { from: 6, to: 7, color: '#818CF8' }, { from: 7, to: 4, color: '#818CF8' },
        { from: 0, to: 4, color: '#818CF8' }, { from: 1, to: 5, color: '#818CF8' },
        { from: 2, to: 6, color: '#818CF8' }, { from: 3, to: 7, color: '#818CF8' },
      ];
      return { points, connections };
    };

    const { points, connections } = generateModelData()

    // ─── Drawing Render Engine ───
    const draw = (angleX: number, angleY: number, zoom: number) => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2

      ctx.clearRect(0, 0, w, h)

      // Shaded Vector background
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, w)
      gradient.addColorStop(0, '#1E293B') // slate 800
      gradient.addColorStop(1, '#0F172A') // slate 900
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      // Circular alignment scope
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, Math.min(w, h) * 0.35, 0, Math.PI * 2)
      ctx.stroke()

      // Crosshair lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.beginPath()
      ctx.moveTo(cx, 0); ctx.lineTo(cx, h)
      ctx.moveTo(0, cy); ctx.lineTo(w, cy)
      ctx.stroke()

      const sinX = Math.sin(angleX)
      const cosX = Math.cos(angleX)
      const sinY = Math.sin(angleY)
      const cosY = Math.cos(angleY)

      const focusDistance = 400

      // 1. Transform coordinates with rotations
      const transformed = points.map(pt => {
        // Rotate around Y-axis (yaw)
        const x1 = (pt.x * cosY - pt.z * sinY) * zoom
        const z1 = pt.x * sinY + pt.z * cosY

        // Rotate around X-axis (pitch)
        const y2 = (pt.y * cosX - z1 * sinX) * zoom
        const z2 = (pt.y * sinX + z1 * cosX) * zoom

        // 3D perspective projection formula
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

      // 2. Draw connections (bonds or wires)
      connections.forEach(conn => {
        const p1 = transformed[conn.from]
        const p2 = transformed[conn.to]

        if (!p1 || !p2) return

        ctx.strokeStyle = conn.color || '#94A3B8'
        ctx.lineWidth = (conn.width || 2) * ((p1.radius + p2.radius) / 20)
        ctx.beginPath()
        ctx.moveTo(p1.screenX, p1.screenY)
        ctx.lineTo(p2.screenX, p2.screenY)
        ctx.stroke()
      })

      // 3. Draw points (atoms or vertices), depth-sorted back-to-front
      const sortedIndices = transformed
        .map((node, idx) => ({ node, idx }))
        .sort((a, b) => b.node.depth - a.node.depth) // Draw far nodes first

      sortedIndices.forEach(({ node }) => {
        const x = node.screenX
        const y = node.screenY
        const r = Math.max(1, node.radius)

        // Radial highlight gradient for atomic shading
        const radGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r)
        radGrad.addColorStop(0, '#FFFFFF')
        radGrad.addColorStop(0.3, node.color)
        radGrad.addColorStop(1, darkenColor(node.color, 0.4))

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = radGrad
        ctx.fill()

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Atom Symbol labels
        if (node.label) {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = `bold ${Math.max(6, Math.floor(r * 0.7))}px monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(node.label, x, y)
        }
      })
    }

    // ─── Interaction Handlers ───
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const deltaX = e.clientX - previousMousePosition.current.x
      const deltaY = e.clientY - previousMousePosition.current.y

      rotationAngles.current.y += deltaX * 0.008
      rotationAngles.current.x -= deltaY * 0.008

      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      // Adjust zoom factor
      const zoomDelta = e.deltaY * -0.001
      zoomFactor.current = Math.max(0.3, Math.min(3.0, zoomFactor.current + zoomDelta))
    }

    // Attach local events
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel, { passive: false })

    // Animation Loop
    const tick = () => {
      if (autoRotate && !isDragging.current) {
        rotationAngles.current.y += 0.006
      }
      draw(rotationAngles.current.x, rotationAngles.current.y, zoomFactor.current)
      animationId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [modelType, autoRotate])

  return (
    <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-[#0A1128] shadow-inner select-none relative group cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} width={400} height={280} className="w-full h-auto block" />
      <div className="absolute top-2.5 left-2.5 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-[8px] font-mono text-cyan-300 uppercase tracking-wider">
        {name.split(' ')[0]} 3D scope
      </div>
      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/90 text-[8px] font-mono text-slate-300 py-1 px-2 rounded border border-slate-800">
        🖱️ Drag to Rotate · Scroll Wheel to Zoom
      </div>
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
