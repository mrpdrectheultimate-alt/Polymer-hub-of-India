'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, BookOpen, Send, Lock } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()

  const [sessionUser, setSessionUser] = useState<import('@supabase/supabase-js').User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('research')
  const [imageUrl, setImageUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [teamMembersInput, setTeamMembersInput] = useState('')
  const [guideName, setGuideName] = useState('')
  const [guideOrg, setGuideOrg] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      setSessionUser(session?.user || null)
      setLoading(false)
    }
    checkUser()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionUser) return
    if (!title || !description || !category) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    // Process inputs
    const teamMembers = teamMembersInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          imageUrl,
          githubUrl,
          teamMembers,
          guideName,
          guideOrg,
          tags
        })
      })

      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      } else {
        alert('🎉 Case study portfolio registered successfully!')
        router.push('/projects')
      }
    } catch (err: unknown) {
      console.error(err)
      const error = err as Error
      setErrorMsg(error.message || 'Failed to submit project.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-ink animate-pulse">Verifying session...</div>
      </div>
    )
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="border-4 border-ink bg-white shadow-hard p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 border-4 border-ink bg-yellow-bright mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-ink" />
          </div>
          <h2 className="font-display text-xl font-black text-ink uppercase">Authentication Required</h2>
          <p className="font-mono text-[10px] text-slate-500 uppercase leading-relaxed">
            Please sign in to publish your projects and build your polymer engineering portfolio.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" className="cn-btn-yellow text-xs uppercase font-mono py-2 text-center block w-full">Sign In</Link>
            <Link href="/projects" className="cn-btn-black text-xs uppercase font-mono py-2 text-center block w-full">Back to Directory</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas pb-16">
      {/* Header section */}
      <section className="border-b-4 border-ink bg-slate-50 px-6 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/projects"
            className="border-2 border-ink bg-white px-4 py-2 font-mono text-[9px] font-black uppercase shadow-hard-xs flex items-center gap-1.5 transition-transform hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to directory
          </Link>
          <span className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest">
            Portfolio Builder
          </span>
        </div>
      </section>

      {/* Form Card Container */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="border-4 border-ink bg-white shadow-hard p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2 border-b-2 border-ink pb-4">
            <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center mx-auto">
              <BookOpen className="w-5 h-5 text-yellow-bright" />
            </div>
            <h2 className="font-display text-2xl font-black text-ink uppercase">Submit Engineering Project</h2>
            <p className="font-mono text-[9px] text-slate-400 uppercase">Share your research, mold design calculations, or compounding experiments</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 p-3 text-xs font-mono rounded">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Injection Molding Cooling Line optimization using CAE"
                className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded cursor-pointer"
              >
                <option value="research">🔬 Research Portfolio / Thesis</option>
                <option value="design">🎨 Mold / Product CAD Design</option>
                <option value="processing">🏭 Polymer Processing & Machinery</option>
                <option value="recycling">♻️ Recycling & Waste Management</option>
                <option value="product">📦 Advanced Polymer Product Dev</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                Case Description, Abstract & Methodology <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline your project scope, equipment used (extruders, UTM, MFI, mold layout), parameters tested, and final research outputs. Keep it detailed."
                className="w-full border-2 border-ink p-3 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
              />
            </div>

            {/* Project Image URL */}
            <div>
              <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                Project Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/your-project-photo"
                className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
              />
              <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5 block">Host your image on Unsplash, Imgur or similar and paste URL</span>
            </div>

            {/* GitHub URL */}
            <div>
              <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                GitHub / Repository Link (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project-repo"
                className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
              />
            </div>

            {/* Guide Name & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                  Project Guide / Faculty Name (Optional)
                </label>
                <input
                  type="text"
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  placeholder="e.g. Dr. A.K. Sharma"
                  className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                  Affiliated Institution / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={guideOrg}
                  onChange={(e) => setGuideOrg(e.target.value)}
                  placeholder="e.g. CIPET, IIT, Reliance R&D"
                  className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                />
              </div>
            </div>

            {/* Team Members & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                  Team Members (Comma separated, Optional)
                </label>
                <input
                  type="text"
                  value={teamMembersInput}
                  onChange={(e) => setTeamMembersInput(e.target.value)}
                  placeholder="e.g. Amit Patel, Rahul Sen"
                  className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-black mb-1">
                  Tags (Comma separated, Optional)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. extrusion, recycled PET, bioplastics"
                  className="w-full border-2 border-ink p-2.5 text-xs font-mono bg-canvas focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                />
              </div>
            </div>

            {/* Submit buttons */}
            <div className="pt-4 border-t border-ink/10 flex justify-end gap-3">
              <Link
                href="/projects"
                className="border-2 border-ink bg-white px-4 py-2 font-mono text-[10px] font-black uppercase shadow-hard-xs"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="border-2 border-ink bg-blue-600 hover:bg-blue-700 text-white font-mono text-[10px] font-black uppercase px-6 py-2 shadow-hard flex items-center gap-1 hover:-translate-y-0.5 transition-transform"
              >
                {submitting ? 'Registering...' : 'Submit Portfolio'} <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
