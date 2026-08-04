'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Plus, Star, X } from 'lucide-react'

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
        // Reload groups
        await loadGroups()
        // If viewing details, update members list too
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

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-2xl font-black text-ink bg-white animate-pulse">
          Loading study groups...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-blue-600" />

      {/* Hero Header */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 border-4 border-blue-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-mono text-[10px] font-black text-blue-400 border-2 border-blue-400 px-3 py-1 uppercase tracking-widest">Colleagues</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
              STUDY <span className="text-blue-400 italic">GROUPS.</span>
            </h1>
            <p className="text-white/70 max-w-lg">Form groups, track collective goals, compare progress, and help each other ace the Plastics & Polymer Engineering curricula.</p>
          </div>

          <button onClick={() => setCreateOpen(true)}
            className="border-4 border-ink bg-yellow-bright hover:bg-yellow-400 font-mono text-xs font-black uppercase tracking-wider px-6 py-3 shadow-hard transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Study Group
          </button>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="border-4 border-ink bg-white overflow-hidden shadow-hard flex flex-col">
              <div className="border-b-4 border-ink px-4 py-3 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-400 px-2.5 py-0.5 rounded-full uppercase">
                    {group.subject_name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-black text-slate-400">
                  <Users className="w-3.5 h-3.5" /> {group.member_count} members
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-ink mb-2 leading-tight">{group.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">{group.description || 'No description provided.'}</p>
                </div>

                <div className="flex gap-2 border-t border-ink/10 pt-4 mt-auto">
                  <button onClick={() => viewGroupDetails(group)}
                    className="flex-1 border-2 border-ink py-1.5 font-mono text-[10px] font-black uppercase tracking-wider hover:bg-slate-100 transition-colors">
                    View Progress
                  </button>
                  <button onClick={() => handleJoinLeave(group)}
                    className={`px-4 py-1.5 border-4 border-ink font-mono text-[10px] font-black uppercase tracking-wider transition-all ${
                      group.is_member ? 'bg-rose-100 hover:bg-rose-200 text-rose-800' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}>
                    {group.is_member ? 'Leave' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <div className="col-span-full border-4 border-dashed border-slate-300 p-12 text-center bg-white rounded-xl">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-display text-xl font-black text-slate-400 mb-1">No active study groups</p>
              <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-4">Be the first to create one!</p>
              <button onClick={() => setCreateOpen(true)}
                className="border-4 border-ink bg-blue-500 hover:bg-blue-600 text-white font-mono text-xs font-black uppercase px-6 py-2.5 shadow-hard transition-all inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Study Group
              </button>
            </div>
          )}
        </div>
      </main>

      {/* CREATE GROUP DIALOG MODAL */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="border-4 border-ink bg-white max-w-md w-full shadow-hard overflow-hidden">
            <div className="border-b-4 border-ink px-5 py-3 bg-ink text-white flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-yellow-bright">New Study Group</span>
              <button onClick={() => setCreateOpen(false)} className="text-white hover:text-yellow-bright">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="p-5 space-y-4">
              {formError && (
                <div className="border-2 border-red-500 bg-red-50 text-red-700 p-3 font-mono text-xs font-bold leading-tight">
                  ⚠️ {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-mono text-[9px] font-black uppercase tracking-wider text-slate-400">Group Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:ring-0 focus:outline-none"
                  placeholder="e.g. B.Tech Plastics 2026 Study Squad" />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[9px] font-black uppercase tracking-wider text-slate-400">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  className="w-full border-2 border-ink p-2 font-mono text-xs focus:ring-0 focus:outline-none"
                  placeholder="What is this group focusing on? (e.g. Preparing for Mould Design test)" />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[9px] font-black uppercase tracking-wider text-slate-400">Subject Tag (Optional)</label>
                <select value={subjectId} onChange={e => setSubjectId(e.target.value)}
                  className="w-full border-2 border-ink p-2 bg-white font-mono text-xs focus:ring-0 focus:outline-none">
                  <option value="">General / Multiple Subjects</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full border-4 border-ink bg-blue-500 hover:bg-blue-600 text-white font-mono text-xs font-black uppercase py-3 shadow-hard transition-all mt-2 disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create & Join Group'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STUDY GROUP DETAILS MODAL */}
      {detailsGroup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="border-4 border-ink bg-white max-w-xl w-full shadow-hard overflow-hidden">
            <div className="border-b-4 border-ink px-5 py-3 bg-blue-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-black bg-blue-700 text-white border border-blue-300 px-2 py-0.5 uppercase">
                  {detailsGroup.subject_name}
                </span>
                <span className="font-mono text-xs font-black uppercase tracking-wider">Group Progress Dashboard</span>
              </div>
              <button onClick={() => setDetailsGroup(null)} className="text-white hover:text-yellow-bright">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              <div>
                <h2 className="font-display text-2xl font-black text-ink mb-1.5 leading-tight">{detailsGroup.name}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{detailsGroup.description || 'No description provided.'}</p>
              </div>

              {/* Group Milestones / Challenge card */}
              <div className="border-2 border-ink p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-mono text-[8px] text-blue-700 uppercase font-black tracking-wide">Weekly Group Challenge</div>
                  <div className="font-bold text-xs text-ink mt-0.5">Reach 500 XP collectively this week</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-black text-blue-600">
                    {groupMembers.reduce((sum, m) => sum + (m.xp_points % 100), 0)} / 500 XP
                  </div>
                  <div className="w-24 h-2 bg-slate-200 border border-ink overflow-hidden rounded-full mt-1 ml-auto">
                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (groupMembers.reduce((sum, m) => sum + (m.xp_points % 100), 0) / 500) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Members progress ranking list */}
              <div className="space-y-2">
                <h4 className="font-mono text-[9px] font-black text-slate-400 uppercase tracking-wider">Group Leaderboard</h4>
                
                {membersLoading ? (
                  <div className="p-4 text-center font-mono text-xs animate-pulse">Loading members...</div>
                ) : (
                  <div className="border-2 border-ink divide-y-2 divide-ink/10 rounded-lg overflow-hidden max-h-[250px] overflow-y-auto">
                    {groupMembers.map((member, index) => (
                      <div key={member.id} className="flex items-center gap-3 px-3 py-2 bg-white">
                        <span className="font-mono text-xs font-black text-slate-400 w-4 text-right">#{index + 1}</span>
                        <div className="w-7 h-7 border border-ink bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                          {member.full_name ? member.full_name.substring(0,2).toUpperCase() : 'ST'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-ink truncate leading-tight">{member.full_name || 'Student'}</div>
                          {member.college_name && <div className="font-mono text-[8px] text-slate-400 truncate">{member.college_name}</div>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3 h-3 text-yellow-600" />
                          <span className="font-mono text-[10px] font-black text-ink">{member.xp_points.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-ink/10 pt-4 flex items-center justify-between">
                <span className="font-mono text-[9px] text-slate-400">Created on {new Date(detailsGroup.created_at).toLocaleDateString()}</span>
                <button onClick={() => handleJoinLeave(detailsGroup)}
                  className={`px-6 py-2 border-4 border-ink font-mono text-xs font-black uppercase tracking-wider transition-all ${
                    detailsGroup.is_member ? 'bg-rose-100 hover:bg-rose-200 text-rose-800' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}>
                  {detailsGroup.is_member ? 'Leave Group' : 'Join Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
