'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Trophy, AlertTriangle, ArrowLeft, Clock, CheckCircle, XCircle
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

  // Submit Modal state
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [solutionText, setSolutionText] = useState('')
  const [solutionUrl, setSolutionUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [viewDetails, setViewDetails] = useState<Challenge | null>(null)

  const loadChallenges = async () => {
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
  }

  useEffect(() => {
    loadChallenges()
  }, [])

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChallenge) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          solutionText,
          solutionUrl
        })
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert(`✅ Solution submitted! +50 XP has been added to your profile immediately.`)
        setSelectedChallenge(null)
        setSolutionText('')
        setSolutionUrl('')
        loadChallenges() // Reload status
      }
    } catch {
      alert('Failed to submit solution')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-ink animate-pulse">Loading challenges...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas pb-12">
      {/* Hero Header */}
      <div className="border-b-4 border-ink bg-ink text-white px-6 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-4xl mx-auto space-y-3">
          <Link href="/practice" className="flex items-center gap-1 font-mono text-[9px] text-yellow-bright uppercase tracking-widest hover:opacity-80 mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to Practice
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
              <Trophy className="w-4 h-4 text-ink" />
            </div>
            <span className="font-mono text-[9px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Sponsored Challenges</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none">
            SOLVE PROBLEMS.<br />
            GET HIRED BY <span className="text-yellow-bright">TOP COMPANIES</span>.
          </h1>
          <p className="text-white/70 max-w-xl leading-relaxed text-sm">
            Solve real-world industrial polymer challenges posted directly by companies like Reliance and Supreme. Earn **+50 XP** on submission, and **+200 XP** if accepted!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {!sessionUser && (
          <div className="border-4 border-ink p-5 bg-amber-50 shadow-hard flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="font-mono text-xs text-amber-900 leading-normal">
              You must be logged in to submit solutions and track review statuses. <Link href="/login" className="underline font-bold">Log in here</Link>.
            </p>
          </div>
        )}

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.length === 0 && (
            <div className="col-span-2 border-4 border-ink p-12 text-center bg-white shadow-hard">
              <p className="font-display text-xl font-black text-slate-300 mb-1">No Active Challenges</p>
              <p className="font-mono text-[9px] text-slate-400 uppercase">Check back soon for sponsored entries</p>
            </div>
          )}

          {challenges.map(challenge => {
            const hasSubmitted = !!challenge.submission
            const status = challenge.submission?.status

            return (
              <div key={challenge.id} className="border-4 border-ink bg-white p-5 shadow-hard flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[9px] text-blue-600 font-bold uppercase">{challenge.company_name}</span>
                    <span className={`font-mono text-[8px] font-black px-2 py-0.5 border-2 ${
                      challenge.difficulty === 'Hard' ? 'border-red-500 text-red-600 bg-red-50' : 'border-orange-400 text-orange-600 bg-orange-50'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-black text-ink leading-tight">{challenge.title}</h3>
                  <p className="text-xs text-ink/70 leading-relaxed line-clamp-3">{challenge.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t-2 border-slate-100">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Prize Pool:</span>
                    <span className="font-black text-yellow-600">💰 {challenge.prize_pool}</span>
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Deadline:</span>
                    <span className="text-ink font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(challenge.deadline).toLocaleDateString()}</span>
                  </div>

                  {/* Submission status feedback */}
                  {hasSubmitted && (
                    <div className="border-2 border-ink p-3 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[8px] text-slate-400 uppercase block">Submission Status</span>
                        <span className="text-xs font-bold text-ink uppercase flex items-center gap-1 mt-0.5">
                          {status === 'accepted' ? <CheckCircle className="w-4 h-4 text-green-600" /> : status === 'rejected' ? <XCircle className="w-4 h-4 text-red-600" /> : <Clock className="w-4 h-4 text-amber-500" />}
                          {status}
                        </span>
                      </div>
                      <button onClick={() => setViewDetails(challenge)}
                        className="font-mono text-[9px] font-black uppercase text-blue-600 hover:underline">
                        Feedback →
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => setViewDetails(challenge)}
                      className="flex-1 border-2 border-ink bg-white text-ink py-2 font-mono text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 transition-colors">
                      View Criteria
                    </button>

                    {sessionUser && !hasSubmitted && (
                      <button onClick={() => setSelectedChallenge(challenge)}
                        className="flex-1 border-4 border-ink bg-blue-600 text-white py-1.5 font-mono text-[10px] font-black uppercase tracking-wider shadow-hard-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform">
                        Submit Solution
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── MODAL: Detail Viewer ── */}
      {viewDetails && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full border-4 border-ink bg-white shadow-hard flex flex-col max-h-[90vh]">
            <div className="border-b-4 border-ink px-6 py-4 bg-ink text-white flex justify-between items-center">
              <div>
                <span className="font-mono text-[8px] text-yellow-bright uppercase block">{viewDetails.company_name}</span>
                <span className="font-display text-base font-black uppercase">{viewDetails.title}</span>
              </div>
              <button onClick={() => setViewDetails(null)} className="font-mono font-black text-sm uppercase text-yellow-bright">✕ Close</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase block font-bold">Challenge Details</span>
                <p className="text-xs text-ink leading-relaxed font-mono">{viewDetails.description}</p>
              </div>

              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase block font-bold">Evaluation Criteria</span>
                <p className="text-xs text-ink leading-relaxed font-mono bg-blue-50/50 p-3 border-2 border-blue-100">{viewDetails.criteria}</p>
              </div>

              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase block font-bold">Prize Pool & Rewards</span>
                <p className="text-sm font-black text-yellow-600 font-mono">💰 {viewDetails.prize_pool}</p>
              </div>

              {viewDetails.submission?.review_feedback && (
                <div className="border-4 border-ink p-4 bg-yellow-50">
                  <span className="font-mono text-[9px] text-yellow-800 uppercase block font-black mb-1">Company Feedback</span>
                  <p className="text-xs text-ink leading-relaxed font-mono">{viewDetails.submission.review_feedback}</p>
                </div>
              )}
            </div>

            <div className="border-t-4 border-ink p-4 bg-slate-50 flex justify-end">
              <button onClick={() => setViewDetails(null)}
                className="border-4 border-ink bg-white px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm transition-all hover:translate-x-[-1px]">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Solution Submission Form ── */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitSolution} className="max-w-lg w-full border-4 border-ink bg-white shadow-hard flex flex-col max-h-[90vh]">
            <div className="border-b-4 border-ink px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <span className="font-mono text-[9px] text-blue-200 uppercase block">Submit Solution</span>
                <span className="font-display text-base font-black uppercase">{selectedChallenge.title}</span>
              </div>
              <button type="button" onClick={() => setSelectedChallenge(null)} className="font-mono font-black text-sm uppercase">✕ Close</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="border-2 border-yellow-200 bg-yellow-50 p-4">
                <p className="font-mono text-[9px] font-black text-yellow-800 uppercase mb-1">🎁 XP Incentives</p>
                <p className="text-xs text-yellow-900 leading-normal">
                  Uploading your solution awards **+50 XP** base immediately. If the engineering recruiter accepts your design, you earn a **+200 XP** bonus milestone!
                </p>
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Solution Description / Text Calculations</label>
                <textarea
                  required
                  value={solutionText}
                  onChange={e => setSolutionText(e.target.value)}
                  placeholder="Explain your approach, polymer pathways, compounding steps, and formulas..."
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none min-h-[150px]"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Link to Repository / PDF (Optional)</label>
                <input
                  type="url"
                  value={solutionUrl}
                  onChange={e => setSolutionUrl(e.target.value)}
                  placeholder="e.g. https://github.com/your-username/ bumper-molding"
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="border-t-4 border-ink p-4 bg-slate-50 flex gap-3 justify-end">
              <button type="button" onClick={() => setSelectedChallenge(null)}
                className="border-2 border-ink bg-white px-4 py-2 font-mono text-xs font-black uppercase transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="border-4 border-ink bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-mono text-xs font-black uppercase shadow-hard-xs transition-all">
                {submitting ? 'Submitting...' : 'Upload Solution (+50 XP)'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
