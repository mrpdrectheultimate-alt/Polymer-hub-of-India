'use client'

import ClientPortal from '@/components/ClientPortal'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  Plus, 
  Star, 
  X, 
  Sparkles, 
  Brain, 
  Compass
} from 'lucide-react'

type StudyGroup = {
  id: string
  name: string
  description: string | null
  subject_id: string | null
  subject_name: string
  created_by: string
  is_public: boolean
  created_at: string
  member_count: number
  is_member: boolean
}

type Subject = {
  id: string
  name: string
  slug: string
}

type Member = {
  id: string
  full_name: string | null
  avatar_url: string | null
  college_name: string | null
  xp_points: number
}

export default function StudyGroupsPage() {
  const supabase = createClient()
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  
  // Modal states
  const [createOpen, setCreateOpen] = useState(false)
  const [detailsGroup, setDetailsGroup] = useState<StudyGroup | null>(null)
  const [groupMembers, setGroupMembers] = useState<Member[]>([])
  const [membersLoading, setMembersLoading] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) setCurrentUser(session.user.id)

        const { data: subs } = await supabase
          .from('subjects')
          .select('id, name, slug')
          .order('order_index')
        if (subs) setSubjects(subs)

        await loadGroups()
      } catch (err) {
        console.error('Failed to initialize study groups page:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [supabase])

  const loadGroups = async () => {
    try {
      const res = await fetch('/api/study-groups')
      const json = await res.json()
      if (json.data) {
        setGroups(json.data)
      }
    } catch (err) {
      console.error('Failed to fetch study groups:', err)
    }
  }

  const handleJoinLeave = async (group: StudyGroup) => {
    if (!currentUser) {
      window.location.href = '/login'
      return
    }
    
    try {
      const action = group.is_member ? 'leave' : 'join'
      const res = await fetch('/api/study-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, groupId: group.id })
      })
      const json = await res.json()
      if (json.success) {
        await loadGroups()
        if (detailsGroup?.id === group.id) {
          const updatedGroup = { ...group, is_member: !group.is_member, member_count: group.is_member ? group.member_count - 1 : group.member_count + 1 }
          setDetailsGroup(updatedGroup)
          fetchGroupMembers(group.id)
        }
      }
    } catch (err) {
      console.error('Failed to toggle study group membership:', err)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      setFormError('Group name is required')
      return
    }
    setSubmitting(true)
    setFormError('')

    try {
      const res = await fetch('/api/study-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name,
          description,
          subjectId
        })
      })
      const json = await res.json()
      if (json.success) {
        setName('')
        setDescription('')
        setSubjectId('')
        setCreateOpen(false)
        await loadGroups()
      } else {
        setFormError(json.error || 'Failed to create group')
      }
    } catch (err) {
      console.error('Failed to create group:', err)
      setFormError('Network error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const fetchGroupMembers = async (groupId: string) => {
    setMembersLoading(true)
    try {
      const { data: memberLinks, error } = await supabase
        .from('study_group_members')
        .select('user_id')
        .eq('group_id', groupId)

      if (error) throw error

      if (memberLinks && memberLinks.length > 0) {
        const userIds = memberLinks.map(m => m.user_id)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, college_name, xp_points')
          .in('id', userIds)
          .order('xp_points', { ascending: false })

        if (profilesError) throw profilesError
        setGroupMembers(profiles || [])
      } else {
        setGroupMembers([])
      }
    } catch (err) {
      console.error('Failed to load group members:', err)
    } finally {
      setMembersLoading(false)
    }
  }

  const viewGroupDetails = async (group: StudyGroup) => {
    setDetailsGroup(group)
    await fetchGroupMembers(group.id)
  }

  const filteredGroups = selectedSubject === 'all' 
    ? groups 
    : groups.filter(g => g.subject_id === selectedSubject)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Peer Learning &middot; 19 Subject Study Circles &middot; National Collaboration
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            Learn Together. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Grow Together.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Form engineering circles, track collective curriculum goals, solve tough industrial case studies, and prepare together for campus placements.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">{groups.length || 12}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Circles</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">256+</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Engineering Peers</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">19</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Subjects Covered</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">89%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Completion Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Workspace ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Toolbar Bar */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full sm:w-auto border-2 border-slate-200 focus:border-blue-600 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-white focus:outline-none"
            >
              <option value="all">All 19 Subjects</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setCreateOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase px-5 py-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Study Circle
          </button>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="border-2 border-slate-200 bg-white rounded-2xl p-6 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="border-2 border-slate-900 bg-white p-12 text-center rounded-2xl shadow-sm space-y-2">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-900">No study groups created in this subject yet</h3>
            <p className="text-xs text-slate-500">Be the first to create a circle and invite your classmates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <article key={group.id} className="border-2 border-slate-900 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-mono font-bold rounded-full uppercase border border-blue-200">
                      {group.subject_name}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {group.member_count} peers
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                    {group.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                    {group.description || 'Collaborative study and review circle focused on plastics engineering.'}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewGroupDetails(group)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs uppercase rounded-xl transition-all"
                    >
                      View Roster
                    </button>
                    <button
                      onClick={() => handleJoinLeave(group)}
                      className={`flex-1 py-2.5 font-mono font-bold text-xs uppercase rounded-xl border-2 transition-all ${
                        group.is_member
                          ? 'border-rose-500 bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'border-slate-900 bg-slate-900 text-white hover:bg-blue-600 hover:border-blue-600'
                      }`}
                    >
                      {group.is_member ? 'Leave Circle' : 'Join Circle'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* ── BOTTOM AI STUDY GROUP COUNSELOR CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Study Coach &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Need a weekly group study schedule? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Study Coach.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Generate an 8-week semester revision schedule tailored to your university curriculum, with prioritized lab problem sets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Create%20an%208-week%20study%20circle%20curriculum%20schedule%20for%20Polymer%20Processing%20and%20Mould%20Design"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Study Coach &rarr;
            </Link>

            <Link
              href="/community"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Community Hub
            </Link>
          </div>
        </div>
      </section>

      {/* ── Create Group Modal ── */}
      {createOpen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={() => setCreateOpen(false)}>
            <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base uppercase tracking-wide">👥 Create Study Circle</h3>
                <button onClick={() => setCreateOpen(false)} className="text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Group Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Injection Moulding Troubleshooters"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Subject Focus</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-bold"
                  >
                    <option value="">General / All Subjects</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1">Description &amp; Goals</label>
                  <textarea
                    rows={3}
                    placeholder="What will this group focus on? (e.g., Weekly problem solving, GATE review, lab viva prep)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs bg-white outline-none text-slate-900 font-medium leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    className="px-4 py-2 border-2 border-slate-200 text-xs font-mono font-bold uppercase rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-sm"
                  >
                    {submitting ? 'Creating...' : 'Create Circle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* ── View Details Roster Modal ── */}
      {detailsGroup && (
        <ClientPortal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={() => setDetailsGroup(null)}>
            <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block">{detailsGroup.subject_name}</span>
                  <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">{detailsGroup.name}</h3>
                </div>
                <button onClick={() => setDetailsGroup(null)} className="text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {detailsGroup.description || 'No detailed description provided for this study circle.'}
              </p>

              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Enrolled Peers ({groupMembers.length})
                </span>

                {membersLoading ? (
                  <div className="py-6 text-center text-xs font-mono text-slate-400">Loading roster...</div>
                ) : groupMembers.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 italic">No peers enrolled yet. Be the first!</div>
                ) : (
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {groupMembers.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            {m.full_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">{m.full_name || 'Engineering Student'}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{m.college_name || 'Plastics Institute'}</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {m.xp_points.toLocaleString()} XP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setDetailsGroup(null)}
                  className="px-5 py-2 bg-slate-900 text-white font-mono font-bold text-xs uppercase rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

    </div>
  )
}
