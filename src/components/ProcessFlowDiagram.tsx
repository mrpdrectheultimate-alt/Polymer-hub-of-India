// src/components/ProcessFlowDiagram.tsx
'use client'

import React from 'react'
import { ArrowRight, Settings, Activity, RefreshCw } from 'lucide-react'

export interface ProcessStep {
  step: number
  title: string
  description?: string
  parameters?: string
  output?: string
  status?: 'primary' | 'secondary' | 'recycle' | 'critical'
}

export interface ProcessFlowDiagramProps {
  title?: string
  subtitle?: string
  steps: ProcessStep[]
  recycleLoop?: string
  notes?: string
}

export function ProcessFlowDiagram({
  title = 'Industrial Process Flow Diagram (PFD)',
  subtitle = 'Sequential Unit Operations & Thermodynamic Control Points',
  steps = [],
  recycleLoop,
  notes
}: ProcessFlowDiagramProps) {
  return (
    <figure className="my-8 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs font-sans text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800">
              {title}
            </h4>
          </div>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{subtitle}</p>}
        </div>
        <span className="text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
          ISO 10628 PFD Standard
        </span>
      </div>

      {/* Process Flow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 relative">
        {steps.map((s, idx) => {
          const isLast = idx === steps.length - 1
          const statusStyles = {
            primary: 'border-slate-200 bg-slate-50/80 text-slate-900',
            secondary: 'border-blue-200 bg-blue-50/70 text-slate-900',
            recycle: 'border-emerald-200 bg-emerald-50/70 text-slate-900',
            critical: 'border-amber-200 bg-amber-50/70 text-slate-900'
          }[s.status || 'primary']

          return (
            <div key={idx} className="relative flex flex-col justify-between">
              <div className={`p-4 rounded-2xl border ${statusStyles} shadow-2xs space-y-2 h-full flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-lg bg-[#2563EB] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {s.step || idx + 1}
                    </span>
                    {s.parameters && (
                      <span className="text-[9px] font-mono bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold">
                        {s.parameters}
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold font-display text-slate-900 leading-snug">
                    {s.title}
                  </h5>
                  {s.description && (
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-sans">
                      {s.description}
                    </p>
                  )}
                </div>

                {s.output && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Output:</span>
                    <span className="text-emerald-700 font-bold">{s.output}</span>
                  </div>
                )}
              </div>

              {!isLast && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 bg-white border border-slate-300 rounded-full p-1 text-[#2563EB] shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Optional Recycle Loop Callout */}
      {recycleLoop && (
        <div className="mt-5 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-950">
          <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <strong className="font-mono text-emerald-800 uppercase text-[10px] block">Recycle Loop Stream:</strong>
            <span className="text-[11px] font-sans">{recycleLoop}</span>
          </div>
        </div>
      )}

      {/* Notes & Standards Footer */}
      {notes && (
        <figcaption className="mt-4 text-[11px] font-mono text-slate-500 border-t border-slate-100 pt-2.5 text-center">
          {notes}
        </figcaption>
      )}
    </figure>
  )
}


export default ProcessFlowDiagram
