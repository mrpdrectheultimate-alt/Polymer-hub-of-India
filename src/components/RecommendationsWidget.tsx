'use client'

// src/components/RecommendationsWidget.tsx
// Add to dashboard page — shows AI-powered personalized next steps
// Calls /api/recommendations endpoint

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, Zap, BookOpen, Trophy, Flame, TrendingUp, TrendingDown } from 'lucide-react'

type Recommendation = {
  type: string
  priority: number
  title: string
  description: string
  lessonSlug?: string
  lessonTitle?: string
  subjectSlug?: string
  subjectName?: string
  score?: number
}

type Stats = {
  totalCompleted: number
  totalLessons: number
  overallAvg: number | null
  weakSubjects: { name: string; slug: string; score: number }[]
  strongSubjects: { name: string; slug: string; score: number }[]
  subjectProgress: { name: string; slug: string; pct: number; avgScore: number | null }[]
}

const TYPE_CONFIG: Record<string, { color: string; border: string; bg: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  weak_subject: { color: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50', icon: TrendingDown, label: 'Needs Attention' },
  continue:     { color: 'text-[#2563EB]', border: 'border-blue-200', bg: 'bg-blue-50', icon: BookOpen,     label: 'Continue Learning' },
  new_subject:  { color: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50', icon: Zap,          label: 'Explore New Topic' },
  practice:     { color: 'text-indigo-700', border: 'border-indigo-200', bg: 'bg-indigo-50', icon: Brain,        label: 'Practice Recommended' },
  gate:         { color: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50', icon: Trophy,       label: 'GATE Prep' },
  streak:       { color: 'text-orange-700', border: 'border-orange-200', bg: 'bg-orange-50', icon: Flame,        label: 'Streak Alert' },
}

export default function RecommendationsWidget() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recommendations')
      .then(r => r.json())
      .then(data => {
        setRecommendations(data.recommendations ?? [])
        setStats(data.stats ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-[#2563EB]" />
          <span className="font-display font-bold text-sm text-slate-900">AI Recommendations</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-[#2563EB]" />
          <span className="font-display font-bold text-sm text-slate-900">Personalized Recommendations</span>
        </div>
        <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/60">
          <Brain className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="font-display text-sm font-bold text-slate-800">Complete your first quiz</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Personalized syllabus recommendations and weak-spot diagnostics appear as you complete lessons.
          </p>
          <Link
            href="/subjects"
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs"
          >
            <span>Explore Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Recommendations List */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#2563EB]" /> Recommended Next Steps
          </span>
          <span className="text-[11px] font-mono text-slate-400">Based on your performance</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recommendations.map((rec, i) => {
            const cfg = TYPE_CONFIG[rec.type] ?? TYPE_CONFIG.continue
            const Icon = cfg.icon
            const href = rec.lessonSlug
              ? `/lessons/${rec.lessonSlug}`
              : rec.subjectSlug === 'practice'
              ? '/practice'
              : rec.subjectSlug === 'gate-mock'
              ? '/gate-mock'
              : rec.subjectSlug
              ? `/subjects/${rec.subjectSlug}`
              : '/subjects'

            return (
              <Link
                key={i}
                href={href}
                className="flex items-start gap-3.5 py-3.5 group hover:bg-slate-50 -mx-2 px-2 rounded-2xl transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {rec.score !== undefined && (
                      <span className="font-mono text-[10px] text-slate-400">{rec.score}% avg</span>
                    )}
                  </div>
                  <div className="font-display text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors leading-tight">
                    {rec.title}
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5 leading-relaxed">{rec.description}</p>
                  {rec.lessonTitle && (
                    <div className="font-mono text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#2563EB]" />
                      <span className="truncate">{rec.lessonTitle}</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 flex-shrink-0 mt-2.5 transition-transform" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Weak vs Strong subjects */}
      {stats && (stats.weakSubjects.length > 0 || stats.strongSubjects.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Weak subjects */}
          {stats.weakSubjects.length > 0 && (
            <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-amber-100">
                <TrendingDown className="w-4 h-4 text-amber-600" />
                <span className="font-mono text-xs font-bold text-amber-900 uppercase tracking-wider">Priority Revision Areas</span>
              </div>
              <div className="space-y-1.5">
                {stats.weakSubjects.map(s => (
                  <Link
                    key={s.slug}
                    href={`/subjects/${s.slug}`}
                    className="flex items-center justify-between hover:bg-amber-50/60 p-1.5 rounded-lg transition-colors group"
                  >
                    <span className="text-xs font-medium text-slate-800 group-hover:text-amber-700 truncate">
                      {s.name.replace('Polymer ', '')}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-700 flex-shrink-0 ml-2">{s.score}%</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Strong subjects */}
          {stats.strongSubjects.length > 0 && (
            <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-emerald-100">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-xs font-bold text-emerald-900 uppercase tracking-wider">Mastered Disciplines</span>
              </div>
              <div className="space-y-1.5">
                {stats.strongSubjects.map(s => (
                  <Link
                    key={s.slug}
                    href={`/subjects/${s.slug}`}
                    className="flex items-center justify-between hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors group"
                  >
                    <span className="text-xs font-medium text-slate-800 group-hover:text-emerald-700 truncate">
                      {s.name.replace('Polymer ', '')}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-700 flex-shrink-0 ml-2">{s.score}%</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
