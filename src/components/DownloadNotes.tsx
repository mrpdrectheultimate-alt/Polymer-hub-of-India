'use client'

import { useState } from 'react'
import { Download, Loader2, FileText, Printer, CheckCircle2 } from 'lucide-react'

type DownloadNotesProps = {
  lessonSlug: string
  lessonTitle: string
  isPremium?: boolean
  compact?: boolean
}

export default function DownloadNotes({
  lessonSlug,
  lessonTitle,
  isPremium = true,
  compact = false,
}: DownloadNotesProps) {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = () => {
    setLoading(true)
    try {
      const url = `/api/lesson/pdf?slug=${encodeURIComponent(lessonSlug)}`
      const printWindow = window.open(url, '_blank')
      if (!printWindow) {
        window.location.href = url
      }
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 4000)
    } catch (err) {
      console.error('PDF export error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Compact button (for sticky top breadcrumb bar) ──
  if (compact) {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title="Export / Print Lesson as PDF Notes"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer hover:shadow-md disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
        ) : downloaded ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Download className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>{downloaded ? 'Opening PDF...' : 'PDF Notes'}</span>
      </button>
    )
  }

  // ── Full Featured Card (for lesson body & sidebar) ──
  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0A1628] to-slate-950 text-white border-2 border-slate-900 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <FileText className="w-3 h-3 text-amber-400" /> OFFICIAL CURRICULUM NOTES
            </span>
            <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              A4 PRINT READY
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            Download Offline Study Notes (PDF)
          </h3>
          <p className="text-slate-300 text-xs font-medium leading-relaxed max-w-xl">
            Complete formatted lesson content, reaction schemes, formulas, tables, and review points formatted for exam revision and offline printing.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Formatting Notes...</span>
            </>
          ) : downloaded ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Opened PDF Dialog</span>
            </>
          ) : (
            <>
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Export PDF / Print</span>
            </>
          )}
        </button>
      </div>

      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Includes all technical tables &amp; figures
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" /> 1-Click Save as PDF via Browser Print
        </span>
      </div>
    </div>
  )
}
