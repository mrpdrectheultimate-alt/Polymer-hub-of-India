'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Users, Search, Flame, Star, ShieldAlert, ArrowLeft, BarChart3 } from 'lucide-react'

type CollegeLicense = {
  id: string
  college_name: string
  total_seats: number
  allocated_seats: number
  is_active: boolean
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
  const supabase = createClient()

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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Please log in with your HOD institutional account.')
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('college_name')
        .eq('id', session.user.id)
        .single()

      if (!profile?.college_name) {
        setError('No institutional affiliation found on your profile. Please specify your college in profile settings.')
        setLoading(false)
        return
      }

      // Fetch license
      const { data: licenseData } = await supabase
        .from('college_licenses')
        .select('*')
        .eq('college_name', profile.college_name)
        .single()

      if (!licenseData) {
        setError(`No active institutional license found for "${profile.college_name}". Contact admin@polymerhub.in for academic batch licenses.`)
        setLoading(false)
        return
      }

      setLicense(licenseData)

      // Fetch students
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, full_name, email, college_name, subscription_status, xp_points, current_streak')
        .eq('college_name', profile.college_name)
        .order('xp_points', { ascending: false })

      setStudents(studentsData || [])
    } catch (err) {
      console.error(err)
      setError('An error occurred loading your dashboard.')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSeatAction = async (studentId: string, action: 'allocate' | 'revoke') => {
    setActionLoadingId(studentId)
    try {
      const res = await fetch('/api/hod/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, action })
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(errorData.error || 'Failed to update seat status')
      } else {
        await loadData()
      }
    } catch (err) {
      console.error(err)
      alert('Error updating seat allocation')
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
  const availableSeats = totalSeats - allocatedSeats

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

        {/* Seats allocation manager */}
        <div className="border border-slate-200/90 rounded-3xl bg-white overflow-hidden shadow-xs">
          <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center flex-wrap gap-4 bg-slate-50">
            <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" /> Student Licensing List
            </h2>
            <div className="flex gap-1.5">
              <button
                onClick={() => setStatusFilter('all')}
                className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'all' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setStatusFilter('premium')}
                className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'premium' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Premium ({students.filter(s => s.subscription_status === 'premium').length})
              </button>
              <button
                onClick={() => setStatusFilter('free')}
                className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'free' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                Free ({students.filter(s => s.subscription_status !== 'premium').length})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="border-b border-slate-100 p-4 bg-white flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs sm:text-sm w-full font-sans placeholder:text-slate-400 text-slate-900"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 font-mono text-[10px] text-slate-500 uppercase tracking-wider text-left">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">XP Points</th>
                  <th className="px-6 py-3">Active Streak</th>
                  <th className="px-6 py-3">Plan Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs sm:text-sm text-slate-800">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl border border-slate-200 bg-blue-50 text-[#2563EB] flex items-center justify-center font-mono font-bold text-xs">
                        {(student.full_name || 'S')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{student.full_name || 'Unnamed Student'}</div>
                        <div className="text-[10px] font-mono text-slate-400">Student</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {student.xp_points.toLocaleString()} XP
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-current" /> {student.current_streak} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${student.subscription_status === 'premium' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {student.subscription_status === 'premium' ? '👑 Premium' : 'Free Plan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.subscription_status === 'premium' ? (
                        <button
                          onClick={() => handleSeatAction(student.id, 'revoke')}
                          disabled={actionLoadingId !== null}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-mono text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all"
                        >
                          Revoke Seat
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSeatAction(student.id, 'allocate')}
                          disabled={actionLoadingId !== null || availableSeats <= 0}
                          className={`font-mono text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${availableSeats <= 0 ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'}`}
                        >
                          Allocate Seat
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center font-mono text-xs text-slate-400">
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
