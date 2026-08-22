// src/components/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, Cookie, ChevronDown, ChevronUp, Check } from 'lucide-react'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  preferences: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    preferences: true,
  })

  useEffect(() => {
    try {
      const consent = localStorage.getItem('polymerhub_cookie_consent')
      if (!consent) {
        // Delay showing banner slightly for smooth page load
        const timer = setTimeout(() => setShowBanner(true), 1500)
        return () => clearTimeout(timer)
      } else {
        setPrefs(JSON.parse(consent))
      }
    } catch {
      // Fallback
    }
  }, [])

  const saveChoice = (updated: CookiePreferences) => {
    try {
      localStorage.setItem('polymerhub_cookie_consent', JSON.stringify(updated))
    } catch {
      // ignore
    }
    setPrefs(updated)
    setShowBanner(false)
  }

  const acceptAll = () => {
    saveChoice({ necessary: true, analytics: true, preferences: true })
  }

  const rejectOptional = () => {
    saveChoice({ necessary: true, analytics: false, preferences: false })
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 max-w-lg w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0A1628] text-white border-2 border-slate-700 rounded-2xl shadow-2xl p-5 md:p-6 backdrop-blur-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-base text-white">Privacy &amp; Cookie Notice</h3>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" /> DPDP 2023
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              PolymerHub uses essential cookies for secure sessions and anonymous analytics to improve engineering lessons.
              <Link href="/privacy" className="text-blue-400 hover:underline ml-1 font-semibold">
                Privacy Policy &rarr;
              </Link>
            </p>
          </div>
        </div>

        {/* Advanced Settings Drawer */}
        {showAdvanced && (
          <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div>
                <p className="font-bold text-white">Essential &amp; Authentication</p>
                <p className="text-[10px] text-slate-400">Required for login sessions, CSRF, and security tokens.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Always Active
              </span>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div>
                <p className="font-bold text-white">Analytics &amp; Performance</p>
                <p className="text-[10px] text-slate-400">Anonymous page view telemetry to improve curriculum.</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs(prev => ({ ...prev, analytics: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Buttons & Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-center"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAdvanced ? 'Hide Preferences' : 'Customize Cookies'}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={rejectOptional}
              className="flex-1 sm:flex-none text-xs font-mono font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-xl transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={showAdvanced ? () => saveChoice(prefs) : acceptAll}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-900/40"
            >
              <Check className="w-3.5 h-3.5" /> {showAdvanced ? 'Save Preferences' : 'Accept All'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
