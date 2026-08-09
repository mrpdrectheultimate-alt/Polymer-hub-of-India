// src/components/ReaderControls.tsx
'use client'

import { useState } from 'react'

interface ReaderControlsProps {
  onSettingsChange: (key: string, value: string) => void
  initialSettings: {
    margins: string
    lineHeight: string
    font: string
  }
}

export function ReaderControls({ onSettingsChange, initialSettings }: ReaderControlsProps) {
  const [settings, setSettings] = useState(initialSettings)

  const handleSettingChange = (key: 'margins' | 'lineHeight' | 'font', value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    onSettingsChange(key, value)
  }

  const margins = ['narrow', 'normal', 'wide']
  const lineHeights = ['tight', 'normal', 'loose']
  const fonts = ['serif', 'sans', 'dyslexic']

  return (
    <div className="border-4 border-slate-900 rounded-xl p-4 bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="font-display font-black text-sm uppercase mb-4 tracking-wider">📖 Reader Settings</h3>
      
      <div className="space-y-4">
        {/* Margins */}
        <div>
          <label className="text-xs font-mono font-black uppercase text-slate-400 block mb-1">Margins</label>
          <div className="flex gap-2">
            {margins.map((m) => (
              <button
                key={m}
                onClick={() => handleSettingChange('margins', m)}
                className={`flex-1 px-3 py-1.5 border-2 text-xs font-bold uppercase transition-all ${
                  settings.margins === m 
                    ? 'border-slate-900 bg-slate-900 text-white' 
                    : 'border-slate-200 hover:border-slate-900 bg-transparent'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        
        {/* Line Height */}
        <div>
          <label className="text-xs font-mono font-black uppercase text-slate-400 block mb-1">Line Height</label>
          <div className="flex gap-2">
            {lineHeights.map((lh) => (
              <button
                key={lh}
                onClick={() => handleSettingChange('lineHeight', lh)}
                className={`flex-1 px-3 py-1.5 border-2 text-xs font-bold uppercase transition-all ${
                  settings.lineHeight === lh 
                    ? 'border-slate-900 bg-slate-900 text-white' 
                    : 'border-slate-200 hover:border-slate-900 bg-transparent'
                }`}
              >
                {lh}
              </button>
            ))}
          </div>
        </div>
        
        {/* Font */}
        <div>
          <label className="text-xs font-mono font-black uppercase text-slate-400 block mb-1">Font Family</label>
          <div className="flex gap-2">
            {fonts.map((f) => (
              <button
                key={f}
                onClick={() => handleSettingChange('font', f)}
                className={`flex-1 px-3 py-1.5 border-2 text-xs font-bold uppercase transition-all ${
                  settings.font === f 
                    ? 'border-slate-900 bg-slate-900 text-white' 
                    : 'border-slate-200 hover:border-slate-900 bg-transparent'
                }`}
              >
                {f === 'dyslexic' ? 'Dyslexic' : f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
