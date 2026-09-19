// src/components/DynamicVisualRenderer.tsx
'use client'

import React from 'react'
import { VisualMechanismDispatcher } from './VisualMechanismPrimitives'
import { IndustrialPhotographViewer } from './IndustrialPhotographViewer'
import { ProcessFlowDiagram } from './ProcessFlowDiagram'
import { IndustrialBlueprint } from './IndustrialBlueprint'

export interface DynamicVisualRendererProps {
  type: 'visual-mechanism' | 'industrial-photograph' | 'process-flow' | 'industrial-blueprint' | string
  data: any
}

export function DynamicVisualRenderer({ type, data }: DynamicVisualRendererProps) {
  if (!data) return null

  // Safely parse JSON if passed as string
  let parsedData = data
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data)
    } catch (e) {
      console.error('Failed to parse visual component JSON data:', e)
      return null
    }
  }

  const visualType = (type || '').toLowerCase().trim()

  switch (visualType) {
    case 'visual-mechanism':
    case 'mechanism':
      return (
        <VisualMechanismDispatcher
          mechanismId={parsedData.primitiveId || parsedData.mechanismId || parsedData.id}
          title={parsedData.title}
        />
      )

    case 'industrial-photograph':
    case 'photograph':
    case 'micrograph':
      return (
        <IndustrialPhotographViewer
          src={parsedData.src || parsedData.url}
          alt={parsedData.alt || parsedData.title || 'Industrial Photograph'}
          caption={parsedData.caption || parsedData.description}
          source={parsedData.source}
          scale={parsedData.scale}
          magnification={parsedData.magnification}
          technique={parsedData.technique}
          annotations={parsedData.annotations}
        />
      )

    case 'process-flow':
    case 'flowchart':
    case 'pfd':
      return (
        <ProcessFlowDiagram
          title={parsedData.title}
          subtitle={parsedData.subtitle}
          steps={parsedData.steps || []}
          recycleLoop={parsedData.recycleLoop}
          notes={parsedData.notes}
        />
      )

    case 'industrial-blueprint':
    case 'blueprint':
    case 'cad':
      return (
        <IndustrialBlueprint
          title={parsedData.title}
          drawingNumber={parsedData.drawingNumber}
          scale={parsedData.scale}
          material={parsedData.material}
          dimensions={parsedData.dimensions || []}
          notes={parsedData.notes || []}
        />
      )

    default:
      return null
  }
}

export default DynamicVisualRenderer
