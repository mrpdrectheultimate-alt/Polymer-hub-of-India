'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Star, MessageSquare, User, Calendar, Send } from 'lucide-react'

type Project = {
  id: string
  user_id: string
  title: string
  description: string
  category: 'research' | 'design' | 'processing' | 'recycling' | 'product'
  image_url: string | null
  github_url: string | null
  team_members: string[] | null
  guide_name: string | null
  guide_org: string | null
  tags: string[] | null
  upvotes: number
  views: number
  created_at: string
  profiles?: {
    id: string
    full_name: string | null
    email: string
  } | null
}

type Comment = {
  id: string
  project_id: string
  user_id: string
  comment_text: string
  created_at: string
  profiles?: {
    id: string
    full_name: string | null
    email: string
  } | null
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const supabase = createClient()

  const [project, setProject] = useState<Project | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [upvoteSubmitting, setUpvoteSubmitting] = useState(false)
  const [sessionUser, setSessionUser] = useState<import('@supabase/supabase-js').User | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      setSessionUser(session?.user || null)

      // Fetch project details
      const { data: proj, error: projErr } = await supabase
        .from('student_projects')
        .select('*, profiles(id, full_name, email)')
        .eq('id', projectId)
        .single()

      if (projErr || !proj) {
        console.error('Project fetch error:', projErr)
        return
      }

      setProject(proj)

      // Fetch comments
      const { data: comms, error: commsErr } = await supabase
        .from('project_comments')
        .select('*, profiles(id, full_name, email)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (!commsErr && comms) {
        setComments(comms)
      }
    } catch (err: unknown) {
      console.error('Failed to load project details:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadData()
    }
  }, [projectId, supabase])

  const handleUpvote = async () => {
    if (!sessionUser) {
      alert('Please sign in to upvote student projects.')
      return
    }
    if (upvoteSubmitting) return

    setUpvoteSubmitting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upvote', projectId })
      })

      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert('✅ Upvoted successfully!')
        if (project) {
          setProject({ ...project, upvotes: data.upvotes })
        }
      }
    } catch {
      alert('Failed to submit upvote')
    } finally {
      setUpvoteSubmitting(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionUser) {
      alert('Please sign in to leave a comment.')
      return
    }
    if (!commentText.trim()) return

    setCommentSubmitting(true)
    try {
      const res = await fetch('/api/projects/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, commentText })
      })

      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        setCommentText('')
        // Append newly created comment to UI list dynamically
        setComments([...comments, data.comment])
      }
    } catch {
      alert('Failed to submit comment')
    } finally {
      setCommentSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-ink animate-pulse">Loading case details...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-black text-ink uppercase">Project Not Found</h2>
          <Link href="/projects" className="cn-btn-black text-xs uppercase font-mono">Back to Projects</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas pb-16">
      {/* Header Navigation banner */}
      <section className="border-b-4 border-ink bg-slate-50 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/projects"
            className="border-2 border-ink bg-white px-4 py-2 font-mono text-[9px] font-black uppercase shadow-hard-xs flex items-center gap-1.5 transition-transform hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
          </Link>
          <span className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest">
            Sub. ID: {project.id.slice(0, 8)}
          </span>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Project Card Scorecard */}
        <div className="border-4 border-ink bg-white shadow-hard p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4">
            <span className="font-mono text-[10px] font-black border-2 border-ink px-3 py-1 uppercase tracking-widest bg-yellow-bright text-ink">
              {project.category}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpvote}
                disabled={upvoteSubmitting}
                className="border-2 border-ink bg-amber-500 hover:bg-amber-600 text-white font-mono text-[10px] font-black uppercase px-4 py-1.5 shadow-hard-xs flex items-center gap-1 transition-transform active:translate-y-0.5"
              >
                <Star className="w-3.5 h-3.5 fill-white" /> Upvote ({project.upvotes})
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl md:text-4xl font-black text-ink uppercase leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-4 font-mono text-[10px] text-slate-500 uppercase">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Submitted by {project.profiles?.full_name || 'Anonymous Engineer'}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {project.image_url && (
            <div className="border-4 border-ink h-80 overflow-hidden relative bg-slate-100 shadow-hard-xs">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-black text-ink uppercase tracking-tight">📝 Case Description & Methodology</h3>
            <p className="font-sans text-sm text-ink/80 leading-relaxed font-semibold whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-ink pt-6">
            <div className="border-2 border-ink p-4 bg-slate-50 shadow-hard-xs space-y-2">
              <h4 className="font-mono text-[10px] font-black text-ink/40 uppercase tracking-widest">{"// Team and Guidance"}</h4>
              <div className="space-y-1 text-xs font-mono">
                <div><span className="text-slate-400">GUIDE:</span> {project.guide_name || 'N/A'}</div>
                <div><span className="text-slate-400">AFFILIATION:</span> {project.guide_org || 'N/A'}</div>
                <div><span className="text-slate-400">TEAM MEMBERS:</span> {(project.team_members || []).join(', ') || 'Solo Project'}</div>
              </div>
            </div>

            <div className="border-2 border-ink p-4 bg-slate-50 shadow-hard-xs space-y-3">
              <h4 className="font-mono text-[10px] font-black text-ink/40 uppercase tracking-widest">{"// External Links & Metadata"}</h4>
              <div className="flex flex-wrap gap-2">
                {project.github_url ? (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-ink bg-black text-white hover:bg-slate-900 font-mono text-[9px] font-black uppercase px-3 py-1.5 shadow-hard-xs flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                    </svg>
                    Repository Link
                  </a>
                ) : (
                  <span className="font-mono text-[9px] text-slate-400 uppercase italic">No repository linked</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {(project.tags || []).map((t) => (
                  <span key={t} className="text-[9px] font-mono border border-slate-300 bg-white px-2 py-0.5 uppercase">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-4 border-ink bg-white shadow-hard p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-display text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-ink" /> Feedback & Academic Review ({comments.length})
            </h3>
            <p className="font-mono text-[9px] text-slate-400 uppercase">Commentary and queries from peers and industry mentors</p>
          </div>

          {/* New Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave constructive feedback, question methodology, or suggest optimizations..."
              rows={3}
              className="w-full border-2 border-ink p-3 text-xs font-mono bg-canvas placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentSubmitting}
                className="border-2 border-ink bg-blue-600 hover:bg-blue-700 text-white font-mono text-[10px] font-black uppercase px-4 py-2 shadow-hard-xs flex items-center gap-1 transition-transform active:translate-y-0.5"
              >
                {commentSubmitting ? 'Posting...' : 'Send Review'} <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-4 border-t border-ink/10">
            {comments.length === 0 ? (
              <p className="font-mono text-[10px] text-slate-400 uppercase italic text-center py-6">
                No comments registered yet. Be the first to start the academic discussion!
              </p>
            ) : (
              comments.map((comm) => (
                <div key={comm.id} className="border-2 border-ink p-4 bg-slate-50 shadow-hard-xs space-y-2">
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase">
                    <span className="flex items-center gap-1 font-black text-ink"><User className="w-3.5 h-3.5" /> {comm.profiles?.full_name || 'Anonymous User'}</span>
                    <span>{new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed text-ink/80 whitespace-pre-wrap">
                    {comm.comment_text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
