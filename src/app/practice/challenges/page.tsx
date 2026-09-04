'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import {
  Trophy, 
  AlertTriangle, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building2, 
  Sparkles, 
  Brain, 
  Briefcase
} from 'lucide-react'

type Challenge = {
  id: string
  title: string
  company_name: string
  description: string
  prize_pool: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  deadline: string
  criteria: string
  submission?: {
    status: 'pending' | 'accepted' | 'rejected'
    solution_text: string
    solution_url: string | null
    review_feedback: string | null
  } | null
}

export default function StudentChallengesPage() {
  const supabase = createClient()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionUser, setSessionUser] = useState<import('@supabase/supabase-js').User | null>(null)

  // In-Place Expanded States
  const [expandedCriteriaId, setExpandedCriteriaId] = useState<string | null>(null)
  const [expandedSubmitId, setExpandedSubmitId] = useState<string | null>(null)
  const [solutionText, setSolutionText] = useState('')
  const [solutionUrl, setSolutionUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  

  const loadChallenges = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSessionUser(session?.user || null)

      const res = await fetch('/api/challenges')
      const data = await res.json()
      if (Array.isArray(data)) {
        setChallenges(data)
      }
    } catch (err) {
      console.error('Failed to load challenges:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadChallenges()
  }, [loadChallenges])

  const handleSubmitSolution = async (challengeId: string) => {
    if (!solutionText.trim()) {
      alert('Please describe your engineering methodology and solution before submitting.')
      return
    }
    setSubmitting(true)

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          solutionText,
          solutionUrl
        })
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert('✅ Solution submitted! +50 XP has been added to your profile immediately.')
        setExpandedSubmitId(null)
        setSolutionText('')
        setSolutionUrl('')
        loadChallenges()
      }
    } catch {
      alert('Failed to submit solution')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">Loading sponsored challenges...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 pb-20">

      {/* ── Top Header Bar: Gold & Black ── */}
      <div className="bg-[#111827] border-b-4 border-[#F5C518]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#F5C518] text-xs font-mono font-bold uppercase tracking-wider">Industry Bounties</span>
              <div className="flex items-center gap-6 mt-1 text-xs font-mono font-medium text-slate-300">
                <span>{challenges.length} <span className="text-[#F5C518]">Active</span></span>
                <span>₹5L+ <span className="text-slate-400">Prize Pool</span></span>
                <span>+200 <span className="text-[#F5C518]">XP Bonus</span></span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#F5C518] text-xs font-mono font-bold">Recruiter Backed</p>
              <p className="text-white/60 text-[10px] font-mono">Direct Technical Interviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION: Gold / Black Gradient ── */}
      <section className="bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0A0F1D] text-white py-16 px-4 sm:px-6 relative overflow-hidden border-b-2 border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C518]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <Link href="/practice" className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#F5C518] hover:text-amber-300 uppercase tracking-widest mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Practice Arena
          </Link>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Solve Problems. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCD34D] via-[#F5C518] to-[#F59E0B]">
              Get Hired.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Solve real-world industrial polymer challenges posted directly by companies like Reliance, Supreme, and Tata. 
            Earn <strong className="text-[#F5C518] font-bold">+50 XP</strong> on submission, and <strong className="text-[#F5C518] font-bold">+200 XP</strong> if accepted!
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">{challenges.length}</span>
              <span className="text-[10px] font-mono text-[#F5C518] uppercase tracking-wider">Active Challenges</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-300 block">₹5L+</span>
              <span className="text-[10px] font-mono text-[#F5C518] uppercase tracking-wider">Total Prize Pool</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">+200 XP</span>
              <span className="text-[10px] font-mono text-[#F5C518] uppercase tracking-wider">Accepted Reward</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">Top Tier</span>
              <span className="text-[10px] font-mono text-[#F5C518] uppercase tracking-wider">Direct Interviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Workspace ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {!sessionUser && (
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xl flex items-center justify-between gap-4 flex-wrap bg-amber-50/50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-amber-950 font-medium">
                You must be logged in to submit engineering solutions and earn XP bonuses.
              </p>
            </div>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-sm"
            >
              Sign In to Submit &rarr;
            </Link>
          </div>
        )}

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.length === 0 ? (
            <div className="col-span-2 bg-white border-2 border-slate-900 rounded-2xl p-12 text-center shadow-xl space-y-2">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-display font-bold text-base text-slate-900">No Active Sponsored Challenges</h3>
              <p className="text-xs text-slate-500">Check back soon for new corporate challenges from industry sponsors.</p>
            </div>
          ) : (
            challenges.map(challenge => {
              const hasSubmitted = !!challenge.submission
              const status = challenge.submission?.status

              const isCriteriaOpen = expandedCriteriaId === challenge.id
              const isSubmitOpen = expandedSubmitId === challenge.id

              return (
                <article 
                  key={challenge.id} 
                  className={`bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isCriteriaOpen || isSubmitOpen ? 'md:col-span-2 ring-2 ring-blue-600 shadow-2xl' : 'hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-mono font-bold rounded-full uppercase border border-blue-200 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {challenge.company_name}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase border ${
                        challenge.difficulty === 'Hard' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                      {challenge.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono">Prize Pool:</span>
                      <span className="font-display font-bold text-amber-600 text-sm">💰 {challenge.prize_pool}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono">Submission Deadline:</span>
                      <span className="font-mono font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(challenge.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Submission status feedback */}
                    {hasSubmitted && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Submission Status</span>
                          <span className="text-xs font-bold uppercase flex items-center gap-1 mt-0.5">
                            {status === 'accepted' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : status === 'rejected' ? <XCircle className="w-3.5 h-3.5 text-rose-600" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                            {status}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setExpandedCriteriaId(isCriteriaOpen ? null : challenge.id)
                            setExpandedSubmitId(null)
                          }}
                          className="font-mono text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase cursor-pointer"
                        >
                          {isCriteriaOpen ? 'Hide Feedback ✕' : 'Feedback &darr;'}
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => {
                          setExpandedCriteriaId(isCriteriaOpen ? null : challenge.id)
                          setExpandedSubmitId(null)
                        }}
                        className={`flex-1 py-2.5 font-mono font-bold text-xs uppercase rounded-xl transition-all cursor-pointer ${
                          isCriteriaOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isCriteriaOpen ? 'Hide Criteria ✕' : 'View Criteria &darr;'}
                      </button>

                      {sessionUser && !hasSubmitted && (
                        <button 
                          type="button"
                          onClick={() => {
                            setExpandedSubmitId(isSubmitOpen ? null : challenge.id)
                            setExpandedCriteriaId(null)
                          }}
                          className={`flex-1 py-2.5 font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer ${
                            isSubmitOpen ? 'bg-slate-900 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isSubmitOpen ? 'Cancel Submit ✕' : 'Submit (+50 XP) &darr;'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* IN-PLACE EXPANDED CRITERIA DRAWER */}
                  {isCriteriaOpen && (
                    <div className="pt-4 border-t-2 border-slate-900 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                          📋 Evaluation Criteria &amp; Technical Requirements
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedCriteriaId(null)}
                          className="text-xs font-mono font-bold text-slate-500 hover:text-slate-900"
                        >
                          Collapse ✕
                        </button>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                        {challenge.criteria || 'Deliver complete CAD models, CAE flow simulations, and material selection analysis.'}
                      </div>

                      {challenge.submission?.review_feedback && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                          <span className="font-mono text-[10px] font-bold uppercase text-blue-900 block">Recruiter Review Feedback:</span>
                          <p className="text-xs text-blue-800 font-medium">{challenge.submission.review_feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* IN-PLACE EXPANDED SUBMIT SOLUTION FORM */}
                  {isSubmitOpen && (
                    <div className="pt-4 border-t-2 border-blue-600 bg-blue-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black uppercase text-blue-950 flex items-center gap-1.5">
                          🚀 Submit Engineering Solution
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedSubmitId(null)}
                          className="text-xs font-mono font-bold text-slate-500 hover:text-slate-900"
                        >
                          Cancel ✕
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                            Technical Methodology &amp; Calculations *
                          </label>
                          <textarea
                            rows={5}
                            value={solutionText}
                            onChange={(e) => setSolutionText(e.target.value)}
                            placeholder="Detail your engineering approach, resin selection reasoning, ASTM test verification, and mold processing parameters..."
                            className="w-full p-3 text-xs bg-white border-2 border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                            GitHub / CAD / Cloud Drive URL (Optional)
                          </label>
                          <input
                            type="url"
                            value={solutionUrl}
                            onChange={(e) => setSolutionUrl(e.target.value)}
                            placeholder="https://github.com/your-username/polymer-challenge-cad"
                            className="w-full p-3 text-xs bg-white border-2 border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => handleSubmitSolution(challenge.id)}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                          >
                            {submitting ? 'Submitting...' : 'Confirm Submission (+50 XP)'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedSubmitId(null)}
                            className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </article>
              )
            })
          )}
        </div>

      </div>

      {/* ── BOTTOM AI CHALLENGE COACH CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Challenge Coach &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Need guidance structuring your technical solution? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Challenge Coach.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Review compounding formulations, Moldflow cooling analysis setups, or ISO test standards required to submit winning entries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=How%20should%20I%20structure%20a%20technical%20solution%20for%20an%20industrial%20plasticizer%20or%20injection%20moulding%20challenge"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Challenge Coach &rarr;
            </Link>

            <Link
              href="/careers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Briefcase className="w-4 h-4" /> Career Hub &amp; Jobs
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
