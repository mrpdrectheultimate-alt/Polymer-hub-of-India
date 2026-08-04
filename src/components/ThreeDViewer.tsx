'use client'

import { useRef, useEffect } from 'react'

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
  color?: string
  width?: number
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
      const points: Point3D[] = []
      const connections: Connection[] = []

      if (modelType === 'molecule_pe') {
        // Polyethylene chain (repeating CH2-CH2)
        // 6 Carbons in a zig-zag chain
        for (let i = 0; i < 6; i++) {
          const cx = -100 + i * 40
          const cy = i % 2 === 0 ? -15 : 15
          const cz = 0
          points.push({ x: cx, y: cy, z: cz, color: '#4B5563', radius: 12, label: 'C' }) // Carbon

          // Hydrogens (2 per Carbon)
          const hzY = i % 2 === 0 ? 30 : -30
          points.push({ x: cx, y: cy + hzY, z: -25, color: '#3B82F6', radius: 7, label: 'H' })
          points.push({ x: cx, y: cy + hzY, z: 25, color: '#3B82F6', radius: 7, label: 'H' })

          const cIdx = points.length - 3
          connections.push({ from: cIdx, to: cIdx + 1, color: '#E5E7EB', width: 2 })
          connections.push({ from: cIdx, to: cIdx + 2, color: '#E5E7EB', width: 2 })

          // Connect Carbons
          if (i > 0) {
            connections.push({ from: cIdx - 3, to: cIdx, color: '#E5E7EB', width: 4 })
          }
        }
      } else if (modelType === 'molecule_pp') {
        // Polypropylene chain (repeating CH2-CH(CH3))
        for (let i = 0; i < 4; i++) {
          const cx = -80 + i * 50
          const cy = i % 2 === 0 ? -15 : 15
          const cz = 0
          points.push({ x: cx, y: cy, z: cz, color: '#4B5563', radius: 12, label: 'C' }) // Backbone Carbon

          const cIdx = points.length - 1

          if (i % 2 === 0) {
            // Regular CH2 hydrogens
            points.push({ x: cx, y: cy + 30, z: -20, color: '#3B82F6', radius: 7, label: 'H' })
            points.push({ x: cx, y: cy + 30, z: 20, color: '#3B82F6', radius: 7, label: 'H' })
            connections.push({ from: cIdx, to: cIdx + 1 })
            connections.push({ from: cIdx, to: cIdx + 2 })
          } else {
            // CH(CH3) -> One hydrogen, one methyl (CH3) group
            points.push({ x: cx, y: cy - 25, z: -20, color: '#3B82F6', radius: 7, label: 'H' }) // H
            connections.push({ from: cIdx, to: cIdx + 1 })

            // Methyl Carbon
            points.push({ x: cx, y: cy + 40, z: 20, color: '#4B5563', radius: 12, label: 'C' }) // Methyl C
            const methylCIdx = points.length - 1
            connections.push({ from: cIdx, to: methylCIdx, color: '#FCD34D', width: 3 })

            // Methyl Hydrogens (3 atoms)
            points.push({ x: cx - 15, y: cy + 60, z: 35, color: '#3B82F6', radius: 7, label: 'H' })
            points.push({ x: cx + 15, y: cy + 60, z: 35, color: '#3B82F6', radius: 7, label: 'H' })
            points.push({ x: cx, y: cy + 40, z: 50, color: '#3B82F6', radius: 7, label: 'H' })
            connections.push({ from: methylCIdx, to: methylCIdx + 1 })
            connections.push({ from: methylCIdx, to: methylCIdx + 2 })
            connections.push({ from: methylCIdx, to: methylCIdx + 3 })
          }

          // Connect backbone
          if (i > 0) {
            // Find previous carbon index
            const prevCIdx = (i - 1) % 2 === 0 ? cIdx - 3 : cIdx - 6
            connections.push({ from: prevCIdx, to: cIdx, color: '#E5E7EB', width: 4 })
          }
        }
      } else if (modelType === 'molecule_pvc') {
        // PVC chain (repeating CH2-CH(Cl))
        for (let i = 0; i < 4; i++) {
          const cx = -80 + i * 50
          const cy = i % 2 === 0 ? -15 : 15
          const cz = 0
          points.push({ x: cx, y: cy, z: cz, color: '#4B5563', radius: 12, label: 'C' }) // Carbon

          const cIdx = points.length - 1

          if (i % 2 === 0) {
            // CH2 Hydrogens
            points.push({ x: cx, y: cy + 30, z: -20, color: '#3B82F6', radius: 7, label: 'H' })
            points.push({ x: cx, y: cy + 30, z: 20, color: '#3B82F6', radius: 7, label: 'H' })
            connections.push({ from: cIdx, to: cIdx + 1 })
            connections.push({ from: cIdx, to: cIdx + 2 })
          } else {
            // CH(Cl) -> One hydrogen, one chlorine
            points.push({ x: cx, y: cy - 25, z: -20, color: '#3B82F6', radius: 7, label: 'H' })
            connections.push({ from: cIdx, to: cIdx + 1 })

            // Chlorine (large green sphere)
            points.push({ x: cx, y: cy + 35, z: 25, color: '#10B981', radius: 18, label: 'Cl' })
            connections.push({ from: cIdx, to: cIdx + 2, color: '#34D399', width: 3 })
          }

          if (i > 0) {
            const prevCIdx = (i - 1) % 2 === 0 ? cIdx - 3 : cIdx - 4
            connections.push({ from: prevCIdx, to: cIdx, color: '#E5E7EB', width: 4 })
          }
        }
      } else if (modelType === 'molecule_nylon') {
        // Nylon 6,6 structure chain with amide linkage C(=O)-NH
        const chain = [
          { label: 'C', color: '#4B5563', r: 12 },
          { label: 'C', color: '#4B5563', r: 12 },
          { label: 'N', color: '#3B82F6', r: 12 }, // nitrogen
          { label: 'C', color: '#4B5563', r: 12 },
          { label: 'O', color: '#EF4444', r: 12 }, // oxygen
          { label: 'C', color: '#4B5563', r: 12 },
        ]

        for (let i = 0; i < chain.length; i++) {
          const cx = -100 + i * 40
          const cy = i % 2 === 0 ? -15 : 15
          points.push({ x: cx, y: cy, z: 0, color: chain[i].color, radius: chain[i].r, label: chain[i].label })
          const idx = points.length - 1

          if (chain[i].label === 'C' && i !== 4) {
            // attach H
            points.push({ x: cx, y: cy + 30, z: 15, color: '#3B82F6', radius: 7, label: 'H' })
            connections.push({ from: idx, to: points.length - 1 })
          } else if (chain[i].label === 'N') {
            // attach H (amide H)
            points.push({ x: cx, y: cy - 30, z: 0, color: '#3B82F6', radius: 7, label: 'H' })
            connections.push({ from: idx, to: points.length - 1, color: '#60A5FA' })
          } else if (chain[i].label === 'O') {
            // Carbon (i=3) has carbonyl oxygen (i=4)
            connections.push({ from: idx - 1, to: idx, color: '#F87171', width: 4 }) // carbonyl double bond
          }

          if (i > 0 && chain[i].label !== 'O') {
            // connect backbone (i=4 is carbonyl oxygen, doesn't link to i=5 carbon. i=3 carbon links to i=5 carbon directly)
            const prevIdx = i === 5 ? idx - 2 : idx - 1
            connections.push({ from: prevIdx, to: idx, color: '#E5E7EB', width: 3 })
          }
        }
      } else if (modelType === 'product_bottle') {
        // PET bottle wireframe/polygon model
        // Cylinder rings stacked vertically to simulate bottle shape
        const segments = 16
        const rings = [
          { y: -70, r: 8, color: '#3B82F6' },  // cap top
          { y: -60, r: 8, color: '#3B82F6' },  // cap bottom
          { y: -59, r: 12, color: '#60A5FA' }, // neck flange
          { y: -45, r: 10, color: '#60A5FA' }, // neck
          { y: -25, r: 22, color: '#60A5FA' }, // shoulder start
          { y: 0, r: 25, color: '#60A5FA' },   // body upper
          { y: 35, r: 25, color: '#60A5FA' },  // body lower
          { y: 55, r: 22, color: '#60A5FA' },  // base curve
          { y: 60, r: 16, color: '#3B82F6' },  // bottle bottom ring
        ]

        rings.forEach((ring, rIdx) => {
          const ptOffset = points.length
          for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            const px = Math.cos(angle) * ring.r
            const pz = Math.sin(angle) * ring.r
            points.push({ x: px, y: ring.y, z: pz, color: ring.color, radius: 2 })

            // Connect within ring
            connections.push({
              from: ptOffset + i,
              to: ptOffset + ((i + 1) % segments),
              color: ring.color,
              width: 1
            })

            // Connect to previous ring
            if (rIdx > 0) {
              connections.push({
                from: ptOffset + i - segments,
                to: ptOffset + i,
                color: 'rgba(96, 165, 250, 0.3)',
                width: 1
              })
            }
          }
        })
      } else if (modelType === 'product_bumper') {
        // Curved automotive bumper wireframe
        const widthSteps = 16
        const heightSteps = 5
        const fullWidth = 180
        const fullHeight = 40

        for (let h = 0; h < heightSteps; h++) {
          const ptOffset = points.length
          const y = -fullHeight / 2 + (h / (heightSteps - 1)) * fullHeight

          for (let w = 0; w < widthSteps; w++) {
            const wPct = w / (widthSteps - 1)
            const angle = wPct * Math.PI
            const x = Math.cos(angle) * (fullWidth / 2)
            // Curved depth profile
            const z = -Math.sin(angle) * 50 + (h % 2 === 0 ? 5 : 0)

            points.push({ x, y, z, color: '#EF4444', radius: 2 })

            // Connect horizontally
            if (w > 0) {
              connections.push({
                from: ptOffset + w - 1,
                to: ptOffset + w,
                color: '#EF4444',
                width: 1.5
              })
            }

            // Connect vertically
            if (h > 0) {
              connections.push({
                from: ptOffset + w - widthSteps,
                to: ptOffset + w,
                color: 'rgba(239, 68, 68, 0.4)',
                width: 1
              })
            }
          }
        }
      } else if (modelType === 'machine_extruder') {
        // Extruder machine screw inside transparent barrel
        // Barrel outer casing (outer wireframe)
        const segments = 12
        const barrelR = 30
        const length = 200

        // Extruder screw helical thread points
        const turns = 10
        const screwPtsCount = 120
        const screwR = 20

        // Helix coordinates
        const threadOffset = points.length
        for (let i = 0; i < screwPtsCount; i++) {
          const t = i / (screwPtsCount - 1)
          const x = -length / 2 + t * length
          const angle = t * turns * Math.PI * 2
          const y = Math.cos(angle) * screwR
          const z = Math.sin(angle) * screwR
          points.push({ x, y, z, color: '#F59E0B', radius: 2.5 })

          if (i > 0) {
            connections.push({
              from: threadOffset + i - 1,
              to: threadOffset + i,
              color: '#F59E0B',
              width: 3.5
            })
          }
        }

        // Barrel rings (for visualization)
        const ringSpacing = 40
        const ringCount = Math.floor(length / ringSpacing) + 1
        for (let r = 0; r < ringCount; r++) {
          const rx = -length / 2 + r * ringSpacing
          const ringOffset = points.length
          for (let s = 0; s < segments; s++) {
            const angle = (s / segments) * Math.PI * 2
            const ry = Math.cos(angle) * barrelR
            const rz = Math.sin(angle) * barrelR
            points.push({ x: rx, y: ry, z: rz, color: '#9CA3AF', radius: 1.5 })

            // Connect ring segments
            connections.push({
              from: ringOffset + s,
              to: ringOffset + ((s + 1) % segments),
              color: 'rgba(156, 163, 175, 0.5)',
              width: 1
            })
          }
        }
      }

      return { points, connections }
    }

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
    <div className="border-4 border-ink rounded-2xl overflow-hidden bg-[#1A1D23] shadow-hard select-none relative group cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} width={400} height={300} className="w-full h-auto block" />
      <div className="absolute top-3 left-3 bg-ink/75 border border-white/20 px-2 py-0.5 rounded text-[8px] font-mono text-yellow-bright uppercase tracking-wider">
        {name.split(' ')[0]} 3D scope
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-ink/80 text-[8px] font-mono text-white/80 py-1 px-2 rounded">
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
