// src/app/hod-dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Star, Flame, ShieldAlert, Search } from 'lucide-react'

type Student = {
  id: string
  full_name: string | null
  email: string
  subscription_status: string | null
  xp_points: number
  current_streak: number
}

type License = {
  id: string
  college_name: string
  total_seats: number
  allocated_seats: number
}

export default function HODDashboardPage() {
  const [license, setLicense] = useState<License | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'premium' | 'free'>('all')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const res = await fetch('/api/hod/seats')
      const data = await res.json()
      if (res.status === 403) {
        setError('HOD Access Denied. Toggle HOD mode in your Profile page to view this dashboard.')
        setLoading(false)
        return
      }
      if (data.error) {
        setError(data.error)
      } else {
        setLicense(data.license)
        setStudents(data.students)
      }
      setLoading(false)
    } catch (err) {
      console.error('Failed to load seats data:', err)
      setError('Failed to connect to the server')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSeatAction = async (studentId: string, action: 'allocate' | 'revoke') => {
    setActionLoadingId(studentId)
    try {
      const res = await fetch('/api/hod/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, action })
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        await loadData()
      }
    } catch (err) {
      console.error('Error toggling seat allocation:', err)
      alert('Failed to update seat allocation')
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-ink animate-pulse">Loading seats...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full border-4 border-ink p-8 bg-white shadow-hard text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-black text-ink mb-2">Access Restricted</h2>
          <p className="text-sm text-ink/70 leading-relaxed mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/profile" className="border-4 border-ink bg-yellow-bright px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              Edit Profile
            </Link>
            <Link href="/dashboard" className="border-4 border-ink bg-white px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    
    if (statusFilter === 'all') return matchesSearch
    return matchesSearch && student.subscription_status === statusFilter
  })

  const totalSeats = license?.total_seats || 0
  const allocatedSeats = license?.allocated_seats || 0
  const availableSeats = totalSeats - allocatedSeats

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-4 border-ink p-6 bg-white shadow-hard flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="font-mono text-[9px] font-black text-violet-600 uppercase tracking-widest">B2B Portal</div>
            <h1 className="font-display text-3xl font-black text-ink mt-1">🏛️ HOD Seats Dashboard</h1>
            <p className="text-sm text-ink/60 mt-1">Manage bulk student subscription seats for <strong className="text-ink">{license?.college_name}</strong></p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/hod-analytics" className="border-4 border-ink bg-yellow-bright text-ink px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2">
              📊 Analytics & Insights
            </Link>
            <Link href="/dashboard" className="border-4 border-ink bg-white text-ink px-4 py-2 font-mono text-xs font-black uppercase shadow-hard-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* License stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-4 border-ink p-5 bg-white shadow-hard" style={{ borderLeftColor: '#1d4ed8', borderLeftWidth: '12px' }}>
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Total Purchased seats</span>
            <span className="font-display text-4xl font-black text-ink mt-1 block">{totalSeats}</span>
            <p className="text-[10px] text-slate-400 font-mono uppercase mt-2">Active college license package</p>
          </div>
          <div className="border-4 border-ink p-5 bg-white shadow-hard" style={{ borderLeftColor: '#15803d', borderLeftWidth: '12px' }}>
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Allocated seats</span>
            <span className="font-display text-4xl font-black text-ink mt-1 block">{allocatedSeats}</span>
            <p className="text-[10px] text-slate-400 font-mono uppercase mt-2">Assigned to premium students</p>
          </div>
          <div className="border-4 border-ink p-5 bg-white shadow-hard" style={{ borderLeftColor: '#ca8a04', borderLeftWidth: '12px' }}>
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Available seats</span>
            <span className="font-display text-4xl font-black text-ink mt-1 block">{availableSeats}</span>
            <p className="text-[10px] text-slate-400 font-mono uppercase mt-2">Ready for allocation</p>
          </div>
        </div>

        {/* Seats allocation manager */}
        <div className="border-4 border-ink bg-white overflow-hidden shadow-hard">
          <div className="border-b-4 border-ink bg-ink text-white px-6 py-4 flex justify-between items-center flex-wrap gap-4">
            <h2 className="font-display text-xl font-black uppercase tracking-wide flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-bright" /> Student Licensing List
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`font-mono text-[9px] font-black uppercase px-3 py-1 border-2 border-white transition-colors ${statusFilter === 'all' ? 'bg-white text-ink' : 'text-white hover:bg-white/10'}`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setStatusFilter('premium')}
                className={`font-mono text-[9px] font-black uppercase px-3 py-1 border-2 border-white transition-colors ${statusFilter === 'premium' ? 'bg-white text-ink' : 'text-white hover:bg-white/10'}`}
              >
                Premium ({students.filter(s => s.subscription_status === 'premium').length})
              </button>
              <button
                onClick={() => setStatusFilter('free')}
                className={`font-mono text-[9px] font-black uppercase px-3 py-1 border-2 border-white transition-colors ${statusFilter === 'free' ? 'bg-white text-ink' : 'text-white hover:bg-white/10'}`}
              >
                Free ({students.filter(s => s.subscription_status !== 'premium').length})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="border-b-2 border-ink/10 p-4 bg-slate-50 flex items-center gap-3">
            <Search className="w-4 h-4 text-ink/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-0 outline-none text-sm w-full font-mono placeholder-slate-400 text-ink"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-ink/10 bg-slate-50 font-mono text-[9px] text-ink/50 uppercase tracking-widest text-left">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">XP Points</th>
                  <th className="px-6 py-3">Active Streak</th>
                  <th className="px-6 py-3">Plan Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10 font-sans text-sm text-ink">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-ink bg-yellow-bright flex items-center justify-center font-display font-black text-xs">
                        {(student.full_name || 'S')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-ink">{student.full_name || 'Unnamed Student'}</div>
                        <div className="text-[9px] font-mono text-ink/40 uppercase">Student</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-black text-ink flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-600 fill-current" /> {student.xp_points.toLocaleString()} XP
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-black text-ink flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-current" /> {student.current_streak} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-[9px] font-black uppercase px-2 py-1 border-2 border-ink rounded ${student.subscription_status === 'premium' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {student.subscription_status === 'premium' ? '👑 Premium' : 'Free Plan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.subscription_status === 'premium' ? (
                        <button
                          onClick={() => handleSeatAction(student.id, 'revoke')}
                          disabled={actionLoadingId !== null}
                          className="border-2 border-ink bg-red-100 hover:bg-red-200 text-red-700 font-mono text-[9px] font-black uppercase px-3 py-1.5 shadow-hard-xs hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0 active:translate-y-0 transition-all"
                        >
                          Revoke Seat
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSeatAction(student.id, 'allocate')}
                          disabled={actionLoadingId !== null || availableSeats <= 0}
                          className={`border-2 border-ink font-mono text-[9px] font-black uppercase px-3 py-1.5 shadow-hard-xs transition-all ${availableSeats <= 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200 text-blue-700 hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0 active:translate-y-0'}`}
                        >
                          Allocate Seat
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center font-mono text-xs text-ink/40 uppercase">
                      No students found matching filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
