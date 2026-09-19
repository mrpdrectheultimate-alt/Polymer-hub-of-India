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
    <figure className="my-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
              {title}
            </h4>
          </div>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{subtitle}</p>}
        </div>
        <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-1 rounded font-bold">
          ISO 10628 PFD Standard
        </span>
      </div>

      {/* Process Flow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {steps.map((s, idx) => {
          const isLast = idx === steps.length - 1
          const statusStyles = {
            primary: 'border-slate-700 bg-slate-800/80 text-slate-100',
            secondary: 'border-blue-900/60 bg-blue-950/40 text-blue-100',
            recycle: 'border-emerald-900/60 bg-emerald-950/40 text-emerald-100',
            critical: 'border-amber-900/60 bg-amber-950/40 text-amber-100'
          }[s.status || 'primary']

          return (
            <div key={idx} className="relative flex flex-col justify-between">
              <div className={`p-3.5 rounded-xl border ${statusStyles} shadow-sm space-y-2 h-full flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center border border-slate-600">
                      {s.step || idx + 1}
                    </span>
                    {s.parameters && (
                      <span className="text-[9px] font-mono bg-slate-900 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-700">
                        {s.parameters}
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold font-mono text-slate-100 leading-snug">
                    {s.title}
                  </h5>
                  {s.description && (
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  )}
                </div>

                {s.output && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Output Stream:</span>
                    <span className="text-emerald-400 font-semibold">{s.output}</span>
                  </div>
                )}
              </div>

              {!isLast && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-slate-950 border border-slate-700 rounded-full p-1 text-cyan-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Optional Recycle Loop Callout */}
      {recycleLoop && (
        <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-center gap-3 text-xs text-emerald-200">
          <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <strong className="font-mono text-emerald-300 uppercase text-[10px] block">Recycle Loop Stream:</strong>
            <span className="text-[11px]">{recycleLoop}</span>
          </div>
        </div>
      )}

      {/* Notes & Standards Footer */}
      {notes && (
        <figcaption className="mt-3 text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2 text-center">
          {notes}
        </figcaption>
      )}
    </figure>
  )
}

export default ProcessFlowDiagram
