'use client'

import React from 'react'

export interface MarketSparklineProps {
  isUp?: boolean
  width?: number
  height?: number
  points?: number[]
}

export function MarketSparkline({
  isUp = true,
  width = 80,
  height = 24,
  points
}: MarketSparklineProps) {
  // Generate a realistic 7-day price movement trend if points are not passed
  const defaultUpPoints = [15, 18, 14, 20, 22, 19, 25]
  const defaultDownPoints = [25, 22, 24, 18, 16, 17, 12]
  const data = points || (isUp ? defaultUpPoints : defaultDownPoints)

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Map 7 data points to SVG coordinates within (width, height)
  const svgPoints = data.map((val, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2
    const y = height - 2 - ((val - min) / range) * (height - 6)
    return `${x},${y}`
  }).join(' ')

  const strokeColor = isUp ? '#10B981' : '#F43F5E'
  const fillColor = isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'
  const gradientId = `sparkline-grad-${isUp ? 'up' : 'down'}-${Math.random().toString(36).substring(2, 7)}`

  // Closed path for subtle gradient fill under curve
  const firstX = 2
  const lastX = width - 2
  const fillPath = `M ${firstX},${height} L ${svgPoints} L ${lastX},${height} Z`

  return (
    <svg width={width} height={height} className="inline-block overflow-visible shrink-0 select-none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={svgPoints}
      />
      {/* Pulse dot at recent point */}
      {data.length > 0 && (
        <circle
          cx={lastX}
          cy={height - 2 - ((data[data.length - 1] - min) / range) * (height - 6)}
          r="2.5"
          fill={strokeColor}
        />
      )}
    </svg>
  )
}

export default MarketSparkline
