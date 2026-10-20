'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Users, Search, Flame, Star, ShieldAlert, ArrowLeft, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react'

type CollegeLicense = {
  id?: string
  college_name: string
  total_seats: number
  allocated_seats: number
  is_active?: boolean
}

type StudentProfile = {
  id: string
  full_name: string | null
  email: string
  college_name: string | null
  subscription_status: string | null
  xp_points: number
  current_streak: number
}

export default function HodDashboardPage() {
  const [license, setLicense] = useState<CollegeLicense | null>(null)
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'premium' | 'free'>('all')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/hod/seats')
      if (res.status === 401) {
        setError('Please log in with your verified institutional account.')
        setLoading(false)
        return
      }
      if (res.status === 403) {
        setError('Access Restricted: Head of Department (HOD) verification required. Contact founder@polymerhubofindia.com or support@polymerhubofindia.com to verify your departmental credentials.')
        setLoading(false)
        return
      }

      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      setLicense(data.license)
      setStudents(data.students || [])
    } catch (err) {
      console.error('Failed to load institutional seats:', err)
      setError('An error occurred connecting to the institutional seat manager.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSeatAction = async (studentId: string, action: 'allocate' | 'revoke') => {
    setActionLoadingId(studentId)
    try {
      const res = await fetch('/api/hod/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, action })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        alert(data.error || 'Failed to update seat status')
      } else {
        await loadData()
      }
    } catch (err) {
      console.error('Seat allocation error:', err)
      alert('Error updating seat allocation. Please try again.')
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">Loading institutional seats...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-slate-200/90 rounded-3xl p-8 bg-white shadow-xs text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/profile" className="px-4 py-2 bg-[#2563EB] text-white font-mono text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xs">
              Edit Profile
            </Link>
            <Link href="/dashboard" className="px-4 py-2 border border-slate-200 text-slate-700 font-mono text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
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
  const availableSeats = Math.max(0, totalSeats - allocatedSeats)

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border border-slate-200/90 rounded-3xl p-6 sm:p-8 bg-white shadow-xs flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Institutional Portal</div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">🏛️ Department Seats Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Manage bulk student subscription seats for <strong className="text-slate-900">{license?.college_name}</strong></p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/hod-analytics" className="px-4 py-2.5 bg-[#2563EB] text-white rounded-xl font-mono text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics &amp; Insights</span>
            </Link>
            <Link href="/dashboard" className="px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl font-mono text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* License stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-blue-200 rounded-2xl p-5 bg-blue-50/50 shadow-xs">
            <span className="font-mono text-[10px] text-blue-700 uppercase tracking-wider block font-bold">Total Purchased Seats</span>
            <span className="font-display text-3xl font-bold text-blue-950 mt-1 block">{totalSeats}</span>
            <p className="text-[11px] text-blue-600/80 font-mono mt-2">Active college license package</p>
          </div>
          <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50/50 shadow-xs">
            <span className="font-mono text-[10px] text-emerald-700 uppercase tracking-wider block font-bold">Allocated Seats</span>
            <span className="font-display text-3xl font-bold text-emerald-950 mt-1 block">{allocatedSeats}</span>
            <p className="text-[11px] text-emerald-600/80 font-mono mt-2">Assigned to premium students</p>
          </div>
          <div className="border border-amber-200 rounded-2xl p-5 bg-amber-50/50 shadow-xs">
            <span className="font-mono text-[10px] text-amber-800 uppercase tracking-wider block font-bold">Available Seats</span>
            <span className="font-display text-3xl font-bold text-amber-950 mt-1 block">{availableSeats}</span>
            <p className="text-[11px] text-amber-700/80 font-mono mt-2">Ready for instant allocation</p>
          </div>
        </div>

        {/* Student Table & Filters */}
        <div className="border border-slate-200/90 rounded-3xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">Enrolled Department Students</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Allocate or revoke Premium Pro seats per student account</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#2563EB]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'premium' | 'free')}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none"
              >
                <option value="all">All Status</option>
                <option value="premium">Premium Only</option>
                <option value="free">Free Tier</option>
              </select>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs">
              No students found from {license?.college_name}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">XP Points</th>
                    <th className="pb-3 font-semibold">Streak</th>
                    <th className="pb-3 font-semibold text-right">Seat Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const isPremium = student.subscription_status === 'premium'
                    const isLoading = actionLoadingId === student.id

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-slate-900">{student.full_name || 'Anonymous Student'}</div>
                          <div className="font-mono text-[11px] text-slate-400">{student.email}</div>
                        </td>
                        <td className="py-3.5 pr-4">
                          {isPremium ? (
                            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Premium (Active)</span>
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              Free Tier
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 font-mono font-bold text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{student.xp_points || 0} XP</span>
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 font-mono text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-orange-500" />
                            <span>{student.current_streak || 0} days</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {isPremium ? (
                            <button
                              onClick={() => handleSeatAction(student.id, 'revoke')}
                              disabled={isLoading}
                              className="px-3 py-1.5 border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 rounded-lg font-mono text-[11px] font-bold transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              {isLoading ? 'Updating...' : 'Revoke Seat'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSeatAction(student.id, 'allocate')}
                              disabled={isLoading || availableSeats === 0}
                              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-mono text-[11px] font-bold transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                            >
                              {isLoading ? 'Updating...' : availableSeats === 0 ? 'No Seats' : 'Allocate Seat'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
