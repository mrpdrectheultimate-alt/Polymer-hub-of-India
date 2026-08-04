'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Users, Award, Settings, Search, Star, Flame, BookOpen,
  Plus, CheckCircle, ShieldAlert,
  ArrowLeft, ExternalLink, Mail
} from 'lucide-react'

/* ─── Types ───────────────────────────────────────────────────────────── */
type Candidate = {
  id: string
  full_name: string | null
  email: string
  college_name: string | null
  education_level: string | null
  branch: string | null
  graduation_year: number | null
  target_path: string | null
  xp_points: number | null
  current_streak: number | null
  total_lessons_completed: number | null
  total_quizzes_passed: number | null
  bio: string | null
  goals: string | null
}

type Challenge = {
  id: string
  title: string
  company_name: string
  description: string
  prize_pool: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  deadline: string
  criteria: string
  created_at: string
}

type Submission = {
  id: string
  challenge_id: string
  user_id: string
  solution_text: string
  solution_url: string | null
  status: 'pending' | 'accepted' | 'rejected'
  review_feedback: string | null
  xp_rewarded: number
  created_at: string
  reviewed_at: string | null
  profiles: {
    id: string
    full_name: string | null
    email: string
    college_name: string | null
    xp_points: number | null
  }
  sponsored_challenges: {
    id: string
    title: string
    difficulty: string
  }
}

export default function RecruiterPage() {
  const supabase = createClient()
  const [isRecruiter, setIsRecruiter] = useState<boolean | null>(null)
  const [recruiterCompany, setRecruiterCompany] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Recruiter Tabs
  const [activeTab, setActiveTab] = useState<'talent' | 'challenges' | 'settings'>('talent')

  // Candidates Search & Filter State
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [talentSearch, setTalentSearch] = useState('')
  const [minXP, setMinXP] = useState('0')
  const [targetPath, setTargetPath] = useState('')
  const [collegeFilter, setCollegeFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [searchingTalent, setSearchingTalent] = useState(false)

  // Challenges State
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [reviewFeedback, setReviewFeedback] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)

  // Create Challenge Modal
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    prizePool: '',
    difficulty: 'Medium',
    deadline: '',
    criteria: ''
  })
  const [challengeSubmitting, setChallengeSubmitting] = useState(false)

  // Activation check
  const checkStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setIsRecruiter(false)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_recruiter, recruiter_company')
        .eq('id', session.user.id)
        .single()

      if (profile && profile.is_recruiter) {
        setIsRecruiter(true)
        setRecruiterCompany(profile.recruiter_company || 'Your Company')
      } else {
        setIsRecruiter(false)
      }
    } catch {
      setIsRecruiter(false)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => { checkStatus() }, [checkStatus])

  // Fetch Candidates
  const fetchCandidates = useCallback(async () => {
    setSearchingTalent(true)
    try {
      const params = new URLSearchParams({
        minXP,
        search: talentSearch,
        college: collegeFilter,
        branch: branchFilter,
        targetPath
      })
      const res = await fetch(`/api/recruiter/talent?${params.toString()}`)
      const data = await res.json()
      setCandidates(data.candidates || [])
    } catch (err) {
      console.error('Talent search error:', err)
    } finally {
      setSearchingTalent(false)
    }
  }, [minXP, talentSearch, collegeFilter, branchFilter, targetPath])

  // Fetch Submissions and Challenges
  const fetchSubmissions = useCallback(async () => {
    setLoadingSubmissions(true)
    try {
      const resSub = await fetch('/api/recruiter/submissions')
      const dataSub = await resSub.json()
      setSubmissions(dataSub.submissions || [])

      const resChal = await fetch('/api/challenges')
      const dataChal = await resChal.json()
      // Filter challenges for this recruiter's company
      const companyChal = (dataChal || []).filter((c: Challenge) => c.company_name === recruiterCompany)
      setChallenges(companyChal)
    } catch (err) {
      console.error('Fetch submissions error:', err)
    } finally {
      setLoadingSubmissions(false)
    }
  }, [recruiterCompany])

  useEffect(() => {
    if (isRecruiter) {
      if (activeTab === 'talent') {
        fetchCandidates()
      } else if (activeTab === 'challenges') {
        fetchSubmissions()
      }
    }
  }, [isRecruiter, activeTab, fetchCandidates, fetchSubmissions])

  // Submit Solution Review
  const handleReviewSubmit = async (status: 'accepted' | 'rejected') => {
    if (!selectedSubmission) return
    setReviewSubmitting(true)
    try {
      const res = await fetch('/api/challenges/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          status,
          feedback: reviewFeedback
        })
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert(`Submission ${status} successfully!`)
        setSelectedSubmission(null)
        setReviewFeedback('')
        fetchSubmissions()
      }
    } catch {
      alert('Review failed to submit')
    } finally {
      setReviewSubmitting(false)
    }
  }

  // Create Challenge
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    setChallengeSubmitting(true)
    try {
      const res = await fetch('/api/recruiter/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChallenge)
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert('Sponsored Challenge created successfully!')
        setIsChallengeModalOpen(false)
        setNewChallenge({
          title: '',
          description: '',
          prizePool: '',
          difficulty: 'Medium',
          deadline: '',
          criteria: ''
        })
        fetchSubmissions()
      }
    } catch {
      alert('Failed to create challenge')
    } finally {
      setChallengeSubmitting(false)
    }
  }

  // Enable Demo recruiter status
  const handleEnableDemoMode = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in first!')
        setLoading(false)
        return
      }

      await supabase
        .from('profiles')
        .update({
          is_recruiter: true,
          recruiter_company: 'Reliance Industries'
        })
        .eq('id', session.user.id)

      window.location.reload()
    } catch {
      alert('Failed to enable recruiter demo mode')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-ink animate-pulse">Loading Recruiter Portal...</div>
      </div>
    )
  }

  if (isRecruiter === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full border-4 border-ink p-8 bg-white shadow-hard text-center">
          <ShieldAlert className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-black text-ink mb-2">Recruiter Access Required</h2>
          <p className="text-sm text-ink/70 leading-relaxed mb-6">
            Access to the Recruiter Talent search and Sponsored Challenges is restricted to verified industry hiring managers.
          </p>
          <div className="border-4 border-blue-200 bg-blue-50 p-4 mb-6 text-left">
            <p className="font-mono text-[9px] font-black text-blue-700 uppercase mb-1">💡 Sandbox Testing Mode</p>
            <p className="text-xs text-blue-900 leading-normal">
              You can activate a recruiter profile on your current sandbox account immediately to test out the talent search directory and challenges.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={handleEnableDemoMode}
              className="border-4 border-ink bg-yellow-bright text-ink px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              Activate Recruiter Demo Mode
            </button>
            <Link href="/profile" className="border-4 border-ink bg-white text-ink px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Banner */}
      <div className="border-b-4 border-ink bg-ink text-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] text-yellow-bright border-2 border-yellow-bright px-2 py-0.5 font-bold uppercase tracking-wider">Enterprise</span>
              <span className="font-mono text-[9px] text-blue-400 font-bold uppercase">{recruiterCompany}</span>
            </div>
            <h1 className="font-display text-3xl font-black text-white">👔 Recruiter Talent Portal</h1>
            <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Find & evaluate top polymer engineering graduates</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 border-4 border-white bg-white text-ink px-4 py-2 font-mono text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-transform">
            <ArrowLeft className="w-4 h-4" /> Student Portal
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-4 border-ink bg-white shadow-hard rounded-lg overflow-hidden">
          {([
            { id: 'talent', label: '🔍 Candidate Directory', icon: Users },
            { id: 'challenges', label: '🏆 Sponsored Challenges', icon: Award },
            { id: 'settings', label: '⚙️ Company Settings', icon: Settings }
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 px-4 py-3 font-mono text-[9px] sm:text-xs font-black uppercase tracking-wider border-r-4 border-ink last:border-r-0 transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: activeTab === tab.id ? '#0A0A0A' : 'white', color: activeTab === tab.id ? '#FACC15' : '#6B7280' }}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Candidates search ── */}
        {activeTab === 'talent' && (
          <div className="grid lg:grid-cols-4 gap-6 items-start">
            {/* Left sidebar filters */}
            <div className="border-4 border-ink bg-white p-5 shadow-hard space-y-4">
              <h3 className="font-display font-black text-sm text-ink uppercase pb-2 border-b-2 border-ink/10">Filter Talent</h3>

              <div className="space-y-3">
                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Search Candidates</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={talentSearch}
                      onChange={e => setTalentSearch(e.target.value)}
                      placeholder="Name or Email..."
                      className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Min Experience Points (XP)</label>
                  <select value={minXP} onChange={e => setMinXP(e.target.value)}
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none bg-white">
                    <option value="0">Show All</option>
                    <option value="200">200+ XP</option>
                    <option value="500">500+ XP (Advanced)</option>
                    <option value="1000">1000+ XP (High Achiever)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Branch / Stream</label>
                  <input
                    type="text"
                    value={branchFilter}
                    onChange={e => setBranchFilter(e.target.value)}
                    placeholder="e.g. Plastic, Polymer"
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">College / University</label>
                  <input
                    type="text"
                    value={collegeFilter}
                    onChange={e => setCollegeFilter(e.target.value)}
                    placeholder="e.g. CIPET, ICT"
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Preferred Path</label>
                  <select value={targetPath} onChange={e => setTargetPath(e.target.value)}
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none bg-white">
                    <option value="">All targets</option>
                    <option value="exam">GATE Preparation</option>
                    <option value="job">Placement / Job Opportunities</option>
                    <option value="industry">Practical Machinery</option>
                    <option value="business">Entrepreneurship</option>
                  </select>
                </div>

                <button onClick={fetchCandidates} disabled={searchingTalent}
                  className="w-full border-4 border-ink bg-blue-600 text-white font-mono text-xs font-black uppercase py-2 shadow-hard-sm hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform">
                  {searchingTalent ? 'Searching...' : 'Apply Filters'}
                </button>
              </div>
            </div>

            {/* Right: Results list */}
            <div className="lg:col-span-3 border-4 border-ink bg-white shadow-hard relative min-h-[400px]">
              <div className="border-b-4 border-ink px-5 py-3 bg-slate-50 font-mono text-[10px] font-black uppercase tracking-wider text-slate-500">
                Candidates Found ({candidates.length})
              </div>

              {searchingTalent && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <div className="font-mono text-xs uppercase animate-pulse">Loading Candidates...</div>
                </div>
              )}

              <div className="divide-y-2 divide-ink/10">
                {candidates.length === 0 && !searchingTalent && (
                  <div className="p-12 text-center">
                    <p className="font-display text-xl font-black text-slate-300 mb-2">No Candidates match your filters</p>
                    <p className="font-mono text-[9px] text-slate-400 uppercase">Try relaxing your search terms</p>
                  </div>
                )}

                {candidates.map(candidate => (
                  <div key={candidate.id} className="p-5 flex items-center gap-4 justify-between flex-wrap hover:bg-slate-50/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-ink">{candidate.full_name ?? 'Unnamed Student'}</span>
                        <span className="font-mono text-[8px] bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-slate-500">{candidate.education_level || 'Student'}</span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 mt-1 truncate">{candidate.email}</p>
                      {candidate.college_name && (
                        <p className="font-mono text-[10px] text-slate-500 font-bold mt-1">🏛️ {candidate.college_name}</p>
                      )}
                      {candidate.branch && (
                        <p className="font-mono text-[9px] text-slate-400 mt-0.5">{candidate.branch}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-mono text-sm font-black text-ink flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-500" />
                          {candidate.xp_points?.toLocaleString() ?? 0}
                        </div>
                        <div className="font-mono text-[8px] text-slate-400 uppercase">Total XP</div>
                      </div>

                      <div className="text-center">
                        <div className="font-mono text-sm font-black text-blue-600">
                          {candidate.total_lessons_completed ?? 0}
                        </div>
                        <div className="font-mono text-[8px] text-slate-400 uppercase">Lessons</div>
                      </div>

                      <button onClick={() => setSelectedCandidate(candidate)}
                        className="border-2 border-ink bg-white px-3 py-1 font-mono text-[9px] font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-all shadow-hard-xs">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Sponsored Challenges ── */}
        {activeTab === 'challenges' && (
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Left side: sponsored challenges */}
            <div className="border-4 border-ink bg-white shadow-hard p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b-2 border-ink/10">
                <h3 className="font-display font-black text-sm text-ink uppercase">Our Challenges</h3>
                <button onClick={() => setIsChallengeModalOpen(true)}
                  className="flex items-center gap-1 border-2 border-ink bg-yellow-bright px-2 py-1 font-mono text-[9px] font-black uppercase shadow-hard-xs hover:translate-y-[-1px] transition-transform">
                  <Plus className="w-3.5 h-3.5" /> Post Challenge
                </button>
              </div>

              {challenges.length === 0 && (
                <p className="font-mono text-xs text-slate-400 text-center py-6">No challenges posted by your company yet.</p>
              )}

              <div className="space-y-3">
                {challenges.map(c => (
                  <div key={c.id} className="border-2 border-ink p-3 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-ink leading-tight">{c.title}</span>
                      <span className={`font-mono text-[8px] font-black px-1.5 py-0.5 uppercase border ${c.difficulty === 'Hard' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>{c.difficulty}</span>
                    </div>
                    <p className="font-mono text-[10px] text-yellow-600 font-bold">💰 {c.prize_pool}</p>
                    <p className="font-mono text-[8px] text-slate-400">Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: solution submissions list */}
            <div className="lg:col-span-2 border-4 border-ink bg-white shadow-hard relative min-h-[400px]">
              <div className="border-b-4 border-ink px-5 py-3 bg-slate-50 font-mono text-[10px] font-black uppercase tracking-wider text-slate-500">
                Student Submissions to Review
              </div>

              {loadingSubmissions && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                  <span className="font-mono text-xs uppercase animate-pulse">Loading Submissions...</span>
                </div>
              )}

              <div className="divide-y-2 divide-ink/10">
                {submissions.length === 0 && !loadingSubmissions && (
                  <div className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-display text-xl font-black text-slate-300">All submissions reviewed!</p>
                    <p className="font-mono text-[9px] text-slate-400 uppercase mt-1">Check back later for student solutions.</p>
                  </div>
                )}

                {submissions.map(sub => (
                  <div key={sub.id} className="p-5 flex justify-between items-center gap-4 flex-wrap hover:bg-slate-50/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-ink">{sub.profiles.full_name ?? 'Unnamed Student'}</span>
                        <span className="font-mono text-[8px] bg-slate-100 border border-slate-300 px-1 py-0.5 rounded text-slate-500">{sub.profiles.college_name || 'Generic College'}</span>
                      </div>
                      <p className="font-mono text-[9px] text-slate-400 mt-0.5">Submitted: {new Date(sub.created_at).toLocaleDateString()}</p>
                      <p className="font-mono text-[10px] text-blue-600 font-bold mt-1">Challenge: {sub.sponsored_challenges.title}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {sub.status === 'pending' ? (
                        <button onClick={() => { setSelectedSubmission(sub); setReviewFeedback(sub.review_feedback || '') }}
                          className="border-2 border-ink bg-yellow-bright px-3 py-1 font-mono text-[9px] font-black uppercase shadow-hard-xs hover:translate-y-[-1px] transition-transform">
                          Review solution
                        </button>
                      ) : (
                        <span className={`font-mono text-[8px] font-black uppercase px-2 py-1 border-2 ${sub.status === 'accepted' ? 'border-green-600 text-green-600 bg-green-50' : 'border-red-600 text-red-600 bg-red-50'}`}>
                          {sub.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: settings ── */}
        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto border-4 border-ink bg-white shadow-hard p-6 space-y-4">
            <h3 className="font-display font-black text-lg text-ink uppercase border-b-2 border-ink/10 pb-2">💼 Corporate Profile</h3>

            <div className="space-y-3">
              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Company Name</label>
                <div className="border-2 border-ink p-2 font-mono text-xs bg-slate-50 text-slate-600 font-bold">
                  {recruiterCompany}
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">License Tier</label>
                <div className="border-2 border-ink p-2 font-mono text-xs bg-slate-50 text-slate-600 font-bold">
                  Demo Recruiter Sandbox Package
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Active Sponsored Challenges</label>
                <div className="border-2 border-ink p-2 font-mono text-xs bg-slate-50 text-slate-600 font-bold">
                  {challenges.length} challenges active
                </div>
              </div>

              <div className="border-4 border-blue-200 bg-blue-50 p-4">
                <p className="font-mono text-[9px] font-black text-blue-700 uppercase mb-1">Hiring Pipeline</p>
                <p className="text-xs text-blue-900 leading-normal">
                  Recruiters get direct contact credentials to top percentile graduates on the platform. Adjust filters in the candidate list to discover students with high quiz success score percentages.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL: Solution Review Drawer ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full border-4 border-ink bg-white shadow-hard flex flex-col max-h-[90vh]">
            <div className="border-b-4 border-ink px-6 py-4 bg-yellow-bright flex justify-between items-center">
              <span className="font-display text-lg font-black uppercase text-ink">Review Student Solution</span>
              <button onClick={() => setSelectedSubmission(null)} className="font-mono font-black text-sm uppercase">✕ Close</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase block">Candidate</span>
                <span className="font-bold text-sm text-ink">{selectedSubmission.profiles.full_name ?? 'Unnamed Student'}</span>
                <span className="font-mono text-[10px] text-slate-400 block">{selectedSubmission.profiles.email}</span>
              </div>

              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase block">Challenge</span>
                <span className="font-bold text-xs text-ink">{selectedSubmission.sponsored_challenges.title}</span>
              </div>

              <div>
                <span className="font-mono text-[9px] text-slate-400 uppercase block mb-1">Solution Description / Text</span>
                <div className="border-2 border-ink p-3 bg-slate-50 font-mono text-xs whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedSubmission.solution_text}
                </div>
              </div>

              {selectedSubmission.solution_url && (
                <div>
                  <span className="font-mono text-[9px] text-slate-400 uppercase block mb-1">Project File / Repository</span>
                  <a href={selectedSubmission.solution_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-600 font-bold hover:underline">
                    View Solution Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Review Feedback</label>
                <textarea
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  placeholder="Provide feedback to the student on their design calculations..."
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none min-h-[100px]"
                />
              </div>
            </div>

            <div className="border-t-4 border-ink p-4 bg-slate-50 flex gap-3 justify-end">
              <button onClick={() => handleReviewSubmit('rejected')} disabled={reviewSubmitting}
                className="border-2 border-ink bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 font-mono text-xs font-black uppercase transition-colors">
                Decline Solution
              </button>
              <button onClick={() => handleReviewSubmit('accepted')} disabled={reviewSubmitting}
                className="border-4 border-ink bg-green-600 hover:bg-green-700 text-white px-5 py-2 font-mono text-xs font-black uppercase shadow-hard-xs transition-all">
                Accept Solution (+200 XP Bonus)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Create Challenge Modal ── */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateChallenge} className="max-w-lg w-full border-4 border-ink bg-white shadow-hard flex flex-col max-h-[90vh]">
            <div className="border-b-4 border-ink px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <span className="font-display text-lg font-black uppercase">Post Sponsored Challenge</span>
              <button type="button" onClick={() => setIsChallengeModalOpen(false)} className="font-mono font-black text-sm uppercase">✕ Close</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Challenge Title</label>
                <input
                  type="text"
                  required
                  value={newChallenge.title}
                  onChange={e => setNewChallenge(c => ({ ...c, title: e.target.value }))}
                  placeholder="e.g. Plasticizer Optimization for PVC sheets"
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Difficulty</label>
                  <select value={newChallenge.difficulty} onChange={e => setNewChallenge(c => ({ ...c, difficulty: e.target.value }))}
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none bg-white">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Prize Pool / Reward description</label>
                  <input
                    type="text"
                    required
                    value={newChallenge.prizePool}
                    onChange={e => setNewChallenge(c => ({ ...c, prizePool: e.target.value }))}
                    placeholder="e.g. ₹50,000 + Internship"
                    className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Challenge Description</label>
                <textarea
                  required
                  value={newChallenge.description}
                  onChange={e => setNewChallenge(c => ({ ...c, description: e.target.value }))}
                  placeholder="Explain the technical problem students need to solve..."
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none min-h-[100px]"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Acceptance / Evaluation Criteria</label>
                <textarea
                  required
                  value={newChallenge.criteria}
                  onChange={e => setNewChallenge(c => ({ ...c, criteria: e.target.value }))}
                  placeholder="What details are required? (e.g. melt temp, tensile strength metrics, simulation charts)"
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none min-h-[80px]"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">Submission Deadline</label>
                <input
                  type="date"
                  required
                  value={newChallenge.deadline}
                  onChange={e => setNewChallenge(c => ({ ...c, deadline: e.target.value }))}
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="border-t-4 border-ink p-4 bg-slate-50 flex gap-3 justify-end">
              <button type="button" onClick={() => setIsChallengeModalOpen(false)}
                className="border-2 border-ink bg-white px-4 py-2 font-mono text-xs font-black uppercase transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={challengeSubmitting}
                className="border-4 border-ink bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-mono text-xs font-black uppercase shadow-hard-xs transition-all">
                {challengeSubmitting ? 'Posting...' : 'Post Challenge'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL: Candidate Side-Drawer transcript view ── */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg border-l-4 border-ink bg-white shadow-hard flex flex-col h-full animate-slide-in">
            <div className="border-b-4 border-ink px-6 py-5 bg-ink text-white flex justify-between items-center">
              <div>
                <span className="font-mono text-[9px] text-yellow-bright uppercase block">Candidate Transcript</span>
                <span className="font-display text-xl font-black">{selectedCandidate.full_name ?? 'Unnamed Student'}</span>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="font-mono font-black text-sm uppercase text-yellow-bright hover:opacity-80">✕ Close</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              {/* Profile Overview */}
              <div className="border-4 border-ink bg-white p-4 shadow-hard-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[8px] text-slate-400 uppercase">Current Target</span>
                    <p className="font-bold text-xs uppercase text-green-700">{selectedCandidate.target_path ? selectedCandidate.target_path.toUpperCase() : 'NOT SET'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[8px] text-slate-400 uppercase">Graduation Year</span>
                    <p className="font-bold text-xs text-ink">{selectedCandidate.graduation_year || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[8px] text-slate-400 uppercase">College / University</span>
                  <p className="font-bold text-sm text-ink">{selectedCandidate.college_name || 'Unnamed Institution'}</p>
                </div>

                <div>
                  <span className="font-mono text-[8px] text-slate-400 uppercase">Branch / Specialty</span>
                  <p className="font-mono text-xs text-slate-600 font-bold">{selectedCandidate.branch || 'B.Tech Plastic Polymer Engineering'}</p>
                </div>
              </div>

              {/* Bio & Goals */}
              {(selectedCandidate.bio || selectedCandidate.goals) && (
                <div className="border-4 border-ink bg-white p-4 shadow-hard-sm space-y-3">
                  {selectedCandidate.bio && (
                    <div>
                      <span className="font-mono text-[8px] text-slate-400 uppercase block mb-0.5">Bio / Summary</span>
                      <p className="text-xs text-ink leading-relaxed font-mono">{selectedCandidate.bio}</p>
                    </div>
                  )}
                  {selectedCandidate.goals && (
                    <div>
                      <span className="font-mono text-[8px] text-slate-400 uppercase block mb-0.5">Career Goals</span>
                      <p className="text-xs text-ink leading-relaxed font-mono">{selectedCandidate.goals}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics Scorecard */}
              <div className="grid grid-cols-3 gap-3">
                <div className="border-4 border-ink bg-white p-3 text-center shadow-hard-sm">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-500 mx-auto mb-1" />
                  <div className="font-mono text-sm font-black text-ink">{(selectedCandidate.xp_points ?? 0).toLocaleString()}</div>
                  <div className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">Total XP</div>
                </div>

                <div className="border-4 border-ink bg-white p-3 text-center shadow-hard-sm">
                  <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="font-mono text-sm font-black text-ink">{selectedCandidate.total_lessons_completed ?? 0}</div>
                  <div className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">Lessons</div>
                </div>

                <div className="border-4 border-ink bg-white p-3 text-center shadow-hard-sm">
                  <Flame className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <div className="font-mono text-sm font-black text-ink">{selectedCandidate.current_streak ?? 0} 🔥</div>
                  <div className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">Active Streak</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <a href={`mailto:${selectedCandidate.email}`}
                  className="w-full border-4 border-ink bg-blue-600 text-white font-mono text-xs font-black uppercase py-3 shadow-hard-sm hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Send Email Invitation
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
