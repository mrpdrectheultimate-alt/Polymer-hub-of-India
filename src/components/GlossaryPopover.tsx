// src/components/GlossaryPopover.tsx
'use client'

import { useEffect, useState } from 'react'
import { polymerGlossary } from '@/lib/polymer-glossary'
import { X, BookOpen } from 'lucide-react'

export function GlossaryPopover() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [activeTerm, setActiveTerm] = useState('')
  const [definition, setDefinition] = useState('')

  useEffect(() => {
    const handleDoubleClick = () => {
      const selection = window.getSelection()
      if (!selection) return
      
      const text = selection.toString().toLowerCase().trim()
      if (!text) return

      // Attempt exact matching or base matching (removing plural/suffix)
      let matchedTerm = ''
      let matchedDef = ''

      if (polymerGlossary[text]) {
        matchedTerm = text
        matchedDef = polymerGlossary[text]
      } else {
        // Try singular/stem versions
        const stems = [
          text.replace(/s$/, ''),
          text.replace(/es$/, ''),
          text.replace(/ing$/, ''),
          text.replace(/ed$/, '')
        ]
        for (const stem of stems) {
          if (polymerGlossary[stem]) {
            matchedTerm = stem
            matchedDef = polymerGlossary[stem]
            break
          }
        }
      }

      if (matchedTerm && matchedDef) {
        // Position it near the cursor or selection bounds
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        
        // Calculate scroll offsets
        const scrollX = window.scrollX || window.pageXOffset
        const scrollY = window.scrollY || window.pageYOffset

        setPosition({
          x: rect.left + scrollX + rect.width / 2,
          y: rect.top + scrollY - 100 // place above text
        })
        
        setActiveTerm(matchedTerm)
        setDefinition(matchedDef)
        setVisible(true)
      }
    }

    document.addEventListener('dblclick', handleDoubleClick)
    return () => document.removeEventListener('dblclick', handleDoubleClick)
  }, [])

  if (!visible) return null

  return (
    <div 
      className="absolute bg-white text-slate-900 border-4 border-slate-900 rounded-xl p-4 max-w-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 animate-fade-in font-sans -translate-x-1/2 transition-all"
      style={{ left: position.x, top: position.y }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 mb-2">
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-black text-blue-600">
          <BookOpen className="w-3.5 h-3.5" /> Polymer Glossary
        </span>
        <button 
          onClick={() => setVisible(false)}
          className="p-0.5 rounded hover:bg-slate-100"
        >
          <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
        </button>
      </div>
      <h4 className="font-display font-black text-sm uppercase tracking-wide">{activeTerm}</h4>
      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{definition}</p>
    </div>
  )
}
