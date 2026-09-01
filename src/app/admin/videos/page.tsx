'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Play, ShieldAlert, CheckCircle, AlertTriangle, Search, Loader2, Edit3, ArrowLeft, RefreshCw } from 'lucide-react'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl } from '@/lib/youtube'
import { toast } from '@/hooks/use-toast'

interface DBVideo {
  id: string
  title: string
  youtube_id: string | null
  embed_status: string | null
  oembed_verified_at?: string | null
  last_checked_at?: string | null
  failure_reason?: string | null
  embed_error?: string | null
  subject_name: string | null
  subject_slug: string | null
}

export default function AdminVideosPage() {
  const supabase = createClient()
  const [videos, setVideos] = useState<DBVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  
  // Edit form states
  const [editingVideo, setEditingVideo] = useState<DBVideo | null>(null)
  const [newYoutubeId, setNewYoutubeId] = useState('')
  const [updating, setUpdating] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'working' | 'broken'>('all')

  const checkAuthAndLoad = useCallback(async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = '/login'
      return
    }
    setAuthorized(true)

    // Select * to handle schema drift dynamically without crashes
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('title', { ascending: true })

    if (error) {
      console.error('Error fetching videos:', error)
      toast({
        title: 'Error',
        description: 'Failed to load video library records.',
        variant: 'destructive'
      })
    } else {
      setVideos(data ?? [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    checkAuthAndLoad()
  }, [checkAuthAndLoad])

  const handleUpdateYoutubeId = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVideo) return

    const cleanId = extractYouTubeVideoId(newYoutubeId)
    if (!cleanId) {
      toast({
        title: 'Invalid ID',
        description: 'Please input a valid 11-character YouTube video ID or full watch URL.',
        variant: 'destructive'
      })
      return
    }

    setUpdating(true)
    try {
      // 1. Check YouTube oEmbed status immediately
      const ytResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${cleanId}&format=json`)
      const isWorking = ytResponse.ok
      const statusText = isWorking ? 'working' : 'broken'
      const failureReason = isWorking ? null : `oEmbed status code ${ytResponse.status}`

      // Resolve table fields dynamically
      const hasLastCheckedAt = 'last_checked_at' in editingVideo
      const hasOembedVerifiedAt = 'oembed_verified_at' in editingVideo
      const hasEmbedError = 'embed_error' in editingVideo
      const hasFailureReason = 'failure_reason' in editingVideo

      const updateData: Record<string, string | null> = {
        youtube_id: cleanId,
        embed_status: statusText,
      }

      if (hasLastCheckedAt) {
        updateData.last_checked_at = new Date().toISOString()
      }
      if (hasOembedVerifiedAt) {
        updateData.oembed_verified_at = new Date().toISOString()
      }
      if (hasEmbedError) {
        updateData.embed_error = failureReason
      }
      if (hasFailureReason) {
        updateData.failure_reason = failureReason
      }

      // 2. Mutate in Supabase
      const { error } = await supabase
        .from('videos')
        .update(updateData)
        .eq('id', editingVideo.id)

      if (error) throw error

      toast({
        title: 'Video Updated',
        description: `Successfully set video to "${statusText}" with YouTube ID ${cleanId}.`
      })

      // Refresh list
      setVideos(prev => prev.map(v => v.id === editingVideo.id ? {
        ...v,
        youtube_id: cleanId,
        embed_status: statusText,
        ...updateData
      } : v))
      setEditingVideo(null)
    } catch (err: unknown) {
      console.error(err)
      toast({
        title: 'Mutation Failed',
        description: err instanceof Error ? err.message : 'Error updating video record.',
        variant: 'destructive'
      })
    } finally {
      setUpdating(false)
    }
  }

  const triggerHealthCheck = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cron/video-health')
      if (res.ok) {
        const stats = await res.json()
        toast({
          title: 'Check Completed',
          description: `Ran audit on all videos. Working: ${stats.working}, Broken: ${stats.broken}.`
        })
        await checkAuthAndLoad()
      } else {
        toast({
          title: 'Execution Failed',
          description: 'Bearer authentication required or Vercel cron environment unset.',
          variant: 'destructive'
        })
      }
    } catch (err: unknown) {
      toast({
        title: 'Network Error',
        description: err instanceof Error ? err.message : 'Network failure.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Stats
  const totalCount = videos.length
  const brokenCount = videos.filter(v => v.embed_status === 'broken').length
  const workingCount = videos.filter(v => v.embed_status === 'working' || v.embed_status === 'active').length
  const pendingCount = totalCount - (brokenCount + workingCount)

  // Filter videos list
  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (v.subject_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.youtube_id || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'broken' && v.embed_status === 'broken') ||
                          (statusFilter === 'working' && (v.embed_status === 'working' || v.embed_status === 'active'))

    return matchesSearch && matchesStatus
  })

  if (loading && !authorized) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-2xl font-black text-ink animate-pulse">
          Authorizing...
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard text-center">
          <p className="font-display text-2xl font-black text-ink">Not authorized</p>
          <Link href="/" className="cn-btn-black mt-4 text-sm">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-rose-500" />

      {/* Header */}
      <div className="border-b-4 border-ink bg-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-500 border-4 border-rose-500 flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="font-display text-lg font-black text-white uppercase tracking-tight">Video Library Curation Panel</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">Replace placeholder URLs and maintain oEmbed health</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={triggerHealthCheck}
            disabled={loading}
            className="border-2 border-white/30 text-white font-mono text-[9px] px-3 py-1.5 hover:bg-white/10 transition-colors uppercase flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Run Verification Cron
          </button>
          <Link href="/admin/analytics" className="border-2 border-white/30 text-white font-mono text-[9px] px-3 py-1.5 hover:bg-white/10 transition-colors uppercase flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Analytics Dashboard
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-b-4 border-ink grid grid-cols-4 divide-x-4 divide-ink">
        {[
          { val: totalCount, label: 'Total Videos', color: '#1D4ED8' },
          { val: workingCount, label: 'Working embeds', color: '#15803D' },
          { val: brokenCount, label: 'Broken / Dummy embeds', color: '#EF4444' },
          { val: pendingCount, label: 'Unchecked', color: '#CA8A04' },
        ].map(s => (
          <div key={s.label} className="p-4 text-center animate-soft-fade" style={{ backgroundColor: s.color + '10' }}>
            <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main interactive catalog column */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters card */}
          <div className="border-4 border-ink p-4 bg-white shadow-hard-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border-4 border-ink pl-10 pr-4 py-2 text-xs text-ink focus:outline-none focus:border-blue bg-canvas"
                placeholder="Search by title, subject, or YouTube ID..." 
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'working', 'broken'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase transition-all ${
                    statusFilter === tab ? 'bg-ink text-white' : 'bg-white text-ink/60'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'working' ? '🟢 Working' : '🔴 Broken'}
                </button>
              ))}
            </div>
          </div>

          {/* Videos listing */}
          <div className="border-4 border-ink bg-white shadow-hard overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-4 border-ink font-mono text-[9px] text-ink/50 uppercase">
                  <th className="p-3">Video Title / Subject</th>
                  <th className="p-3">YouTube ID</th>
                  <th className="p-3">Health Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/10 font-sans text-xs">
                {filteredVideos.map(video => {
                  const isBroken = video.embed_status === 'broken'
                  const displayErr = video.failure_reason || video.embed_error
                  return (
                    <tr key={video.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 max-w-sm">
                        <div className="font-bold text-ink leading-snug">{video.title}</div>
                        <div className="font-mono text-[8px] text-ink/40 mt-1 uppercase tracking-wider">
                          📚 {video.subject_name || 'Polymer Science'}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-ink/60">
                        {video.youtube_id ? (
                          <a 
                            href={getYouTubeCanonicalUrl(video.youtube_id)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline text-blue hover:text-blue-700"
                          >
                            {video.youtube_id}
                          </a>
                        ) : (
                          <span className="text-red-500 italic">None</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isBroken ? (
                          <div className="flex items-center gap-1.5 text-red-600 font-mono text-[9px] font-black uppercase">
                            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                            Broken
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-mono text-[9px] font-black uppercase">
                            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            Working
                          </div>
                        )}
                        {displayErr && (
                          <div className="text-[8px] text-red-500/80 font-mono mt-0.5 leading-tight">
                            {displayErr}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setEditingVideo(video)
                            setNewYoutubeId(video.youtube_id || '')
                          }}
                          className="border-2 border-ink bg-yellow-bright hover:bg-ink hover:text-white text-ink px-2 py-1 font-mono text-[9px] font-black uppercase flex items-center gap-1 ml-auto shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Sidebar forms & tools */}
        <div className="space-y-6">
          
          {/* Edit panel */}
          {editingVideo ? (
            <div className="border-4 border-ink p-5 bg-white shadow-hard animate-soft-fade h-fit">
              <div className="border-b-2 border-ink/10 pb-3 mb-4 flex items-center justify-between">
                <h3 className="font-display font-black text-ink uppercase tracking-tight text-sm">Update Video Link</h3>
                <button 
                  onClick={() => setEditingVideo(null)} 
                  className="font-mono text-[9px] text-ink/40 uppercase hover:underline"
                >
                  Cancel
                </button>
              </div>
              <form onSubmit={handleUpdateYoutubeId} className="space-y-4">
                <div>
                  <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-1">Editing Video</div>
                  <div className="text-xs font-bold text-ink leading-snug bg-slate-50 border-2 border-ink p-3">
                    {editingVideo.title}
                  </div>
                </div>

                <div>
                  <label htmlFor="youtubeId" className="block font-mono text-[8px] text-ink/50 uppercase tracking-wider mb-2">
                    YouTube URL or 11-Character ID
                  </label>
                  <input
                    id="youtubeId"
                    type="text"
                    required
                    value={newYoutubeId}
                    onChange={e => setNewYoutubeId(e.target.value)}
                    className="w-full border-4 border-ink px-3 py-2 text-xs text-ink focus:outline-none focus:border-blue bg-canvas font-mono font-bold"
                    placeholder="e.g. RMjtmsr3CqA or watch?v=..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 border-4 border-ink bg-ink text-white font-mono font-black text-[10px] py-2.5 uppercase tracking-wider hover:bg-slate-900 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      Verify & Save Embed Link
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="border-4 border-ink border-dashed p-8 text-center bg-white h-fit flex flex-col items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-ink/20 mb-2" />
              <p className="font-display font-black text-ink/40 uppercase text-xs">Select Video to Replace</p>
              <p className="font-mono text-[8px] text-ink/30 uppercase tracking-wider mt-1">
                Click edit on any video card to swap IDs directly in database.
              </p>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="border-4 border-ink p-4 bg-yellow-bright/10 border-yellow-300 text-xs">
            <h4 className="font-display font-black text-yellow-900 uppercase tracking-wide mb-2">💡 Curation Guidelines</h4>
            <ul className="space-y-2 font-mono text-[9px] text-yellow-800 list-disc pl-4 leading-relaxed">
              <li>Check oEmbed statuses daily to resolve deleted or private clips.</li>
              <li>Always replace broken links with high-quality NPTEL lectures, university content, or industrial demonstrations.</li>
              <li>Changes update on students&apos; screens in real-time.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}
