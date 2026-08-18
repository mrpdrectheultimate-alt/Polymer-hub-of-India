'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  BookOpen, Search, Plus, ArrowRight, User, Award, 
  Clock, CheckCircle2, FolderOpen, Heart, Target, Wrench, ShieldCheck 
} from 'lucide-react'
import { PREDEFINED_PROJECTS, PredefinedProject } from '@/lib/predefined_projects'

type CustomProject = {
  id: string
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

const CUSTOM_CATEGORIES = [
  { value: 'all', label: 'All Projects', icon: '🌍' },
  { value: 'research', label: '🔬 Research', icon: '🔬' },
  { value: 'design', label: '🎨 Mold Design', icon: '🎨' },
  { value: 'processing', label: '🏭 Processing', icon: '🏭' },
  { value: 'recycling', label: '♻️ Recycling', icon: '♻️' },
  { value: 'product', label: '📦 Product Dev', icon: '📦' }
]

const CUSTOM_CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'research': { bg: '#EFF6FF', text: '#1D4ED8', border: '#1D4ED8' },
  'design': { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
  'processing': { bg: '#F5F3FF', text: '#7C3AED', border: '#7C3AED' },
  'recycling': { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
  'product': { bg: '#FFF1F2', text: '#E11D48', border: '#E11D48' }
}

const PREDEFINED_CATEGORIES = [
  { value: 'all', label: 'All Levels' },
  { value: 'foundation', label: '🧪 Level 1: Foundation' },
  { value: 'intermediate', label: '🏗️ Level 2: Intermediate' },
  { value: 'advanced', label: '⚙️ Level 3: Advanced' },
  { value: 'expert', label: '🚀 Level 4: Expert' }
]

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
  Hard: 'bg-orange-50 text-orange-700 border-orange-200',
  Expert: 'bg-purple-50 text-purple-700 border-purple-200'
}

export default function StudentProjectsHub() {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'portfolio'>('curriculum')
  
  // Predefined Projects State
  const [curriculumSearch, setCurriculumSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [progressMap, setProgressMap] = useState<Record<string, 'not_started' | 'in_progress' | 'completed'>>({})
  const [titleToUuidMap, setTitleToUuidMap] = useState<Record<string, string>>({})
  const [selectedProject, setSelectedProject] = useState<PredefinedProject | null>(null)
  
  // Custom Projects State
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([])
  const [loadingCustom, setLoadingCustom] = useState(true)
  const [customSearch, setCustomSearch] = useState('')
  const [selectedCustomCategory, setSelectedCustomCategory] = useState('all')
  const [upvotedProjects, setUpvotedProjects] = useState<Set<string>>(new Set())

  // Load progress states and DB matches
  useEffect(() => {
    async function initProgress() {
      // 1. Load LocalStorage first
      const cached = localStorage.getItem('polymerhub_project_progress')
      const localMap = cached ? JSON.parse(cached) : {}
      setProgressMap(localMap)

      // 2. Fetch from DB if user is authenticated
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Load progress
          const { data: progressData } = await supabase
            .from('user_project_progress')
            .select('*')
            .eq('user_id', user.id)

          if (progressData) {
            const dbMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {}
            progressData.forEach((p: { project_id: string; status: 'not_started' | 'in_progress' | 'completed' }) => {
              dbMap[p.project_id] = p.status
            })
            const merged = { ...localMap, ...dbMap }
            setProgressMap(merged)
            localStorage.setItem('polymerhub_project_progress', JSON.stringify(merged))
          }

          // Load upvotes
          const { data: upvotes } = await supabase
            .from('project_upvotes')
            .select('project_id')
            .eq('user_id', user.id)
          
          if (upvotes) {
            setUpvotedProjects(new Set(upvotes.map(u => u.project_id)))
          }
        }
      } catch (err) {
        console.log('Running in local cache mode for progress tracking.', err)
      }
    }
    
    async function loadDbIds() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('student_projects')
          .select('id, title')

        if (data) {
          const mapping: Record<string, string> = {}
          data.forEach((p: { id: string; title: string }) => {
            mapping[p.title] = p.id
          })
          setTitleToUuidMap(mapping)
        }
      } catch (err) {
        console.error('Failed to map database UUIDs:', err)
      }
    }

    initProgress()
    loadDbIds()
  }, [])

  // Load custom student portfolios
  useEffect(() => {
    async function fetchCustomProjects() {
      setLoadingCustom(true)
      try {
        const supabase = createClient()
        let query = supabase
          .from('student_projects')
          .select('*, profiles(id, full_name, email)')
          .eq('is_predefined', false)
          .order('upvotes', { ascending: false })

        if (selectedCustomCategory !== 'all') {
          query = query.eq('category', selectedCustomCategory)
        }

        const { data, error } = await query
        if (error) throw error
        setCustomProjects((data || []) as CustomProject[])
      } catch (err) {
        console.error('Failed to load custom portfolios:', err)
      } finally {
        setLoadingCustom(false)
      }
    }

    if (activeTab === 'portfolio') {
      fetchCustomProjects()
    }
  }, [activeTab, selectedCustomCategory])

  const handleUpdateProgress = async (project: PredefinedProject, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    // Determine the database ID (matching by title, falling back to static ID string)
    const dbId = titleToUuidMap[project.title] || project.id

    // Update local state
    const updated = { ...progressMap, [dbId]: newStatus }
    setProgressMap(updated)
    localStorage.setItem('polymerhub_project_progress', JSON.stringify(updated))

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Upsert to user_project_progress table
        await supabase
          .from('user_project_progress')
          .upsert({
            user_id: user.id,
            project_id: dbId,
            status: newStatus,
            started_at: newStatus === 'in_progress' ? new Date().toISOString() : undefined,
            completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined
          }, { onConflict: 'user_id,project_id' })
      }
    } catch (err) {
      console.log('Failed to sync progress to database. Stored in local cache.', err)
    }
  }

  const handleUpvote = async (projectId: string) => {
    if (upvotedProjects.has(projectId)) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to upvote student projects.')
        return
      }

      // Record upvote
      const { error: upvoteError } = await supabase
        .from('project_upvotes')
        .insert({ user_id: user.id, project_id: projectId })

      if (upvoteError) throw upvoteError

      // Increment count
      const project = customProjects.find(p => p.id === projectId)
      const currentUpvotes = project?.upvotes || 0
      
      await supabase
        .from('student_projects')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', projectId)

      setUpvotedProjects(prev => {
        const next = new Set(prev)
        next.add(projectId)
        return next
      })

      setCustomProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, upvotes: p.upvotes + 1 } : p))
      )
    } catch (err) {
      console.error('Failed to register upvote:', err)
    }
  }

  // Filtered Predefined Projects
  const filteredPredefined = PREDEFINED_PROJECTS.filter((proj) => {
    const matchesSearch = 
      proj.title.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
      proj.description.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
      proj.skills.some(s => s.toLowerCase().includes(curriculumSearch.toLowerCase())) ||
      proj.equipment.some(e => e.toLowerCase().includes(curriculumSearch.toLowerCase())) ||
      proj.curriculum_match.toLowerCase().includes(curriculumSearch.toLowerCase())

    const matchesLevel = selectedLevel === 'all' || proj.category === selectedLevel

    return matchesSearch && matchesLevel
  })

  // Filtered Custom Projects
  const filteredCustom = customProjects.filter((proj) => {
    const query = customSearch.toLowerCase().trim()
    if (!query) return true
    return (
      proj.title.toLowerCase().includes(query) ||
      proj.description.toLowerCase().includes(query) ||
      (proj.tags || []).some(t => t.toLowerCase().includes(query)) ||
      (proj.profiles?.full_name || '').toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 md:px-8 border-b-4 border-blue-600 shadow-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/30 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Mapped to 2026 Global Engineering Guidelines
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            Student Projects Hub
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl leading-relaxed">
            Enhance your curriculum learning with 50 curated industry-aligned engineering projects or view case studies and portfolios submitted by students.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-slate-200 mb-8 gap-6 justify-between items-center">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`pb-3 font-black text-base border-b-4 transition-all ${
                activeTab === 'curriculum'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              🚀 2026 Curriculum Projects (50)
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-3 font-black text-base border-b-4 transition-all ${
                activeTab === 'portfolio'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              💼 Student Portfolios & Showcase
            </button>
          </div>
          {activeTab === 'portfolio' && (
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm mb-2"
            >
              <Plus className="w-3.5 h-3.5" /> Submit Portfolio
            </Link>
          )}
        </div>

        {activeTab === 'curriculum' ? (
          /* Predefined Curriculum Projects Browser */
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search by title, equipment, skills, syllabus match..."
                  value={curriculumSearch}
                  onChange={(e) => setCurriculumSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm bg-slate-50 transition-colors"
                />
              </div>

              {/* Level Filter */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedLevel(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      selectedLevel === cat.value
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Curriculum Projects Grid */}
            {filteredPredefined.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
                <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No projects matched</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  We couldn&apos;t find any predefined projects matching your current query. Try clearing your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPredefined.map((proj) => {
                  const dbId = titleToUuidMap[proj.title] || proj.id
                  const status = progressMap[dbId] || 'not_started'

                  return (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 cursor-pointer relative"
                    >
                      <div>
                        {/* Tags and Status Header */}
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[proj.difficulty]}`}>
                            {proj.difficulty}
                          </span>
                          
                          {/* Progress Indicator */}
                          {status === 'in_progress' && (
                            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
                              In Progress
                            </span>
                          )}
                          {status === 'completed' && (
                            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-base leading-snug line-clamp-2 text-slate-800 mb-2">
                          {proj.title}
                        </h3>
                        <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-4">
                          {proj.description}
                        </p>
                      </div>

                      <div>
                        {/* Skills summary */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {proj.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Metadata Footer */}
                        <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {proj.duration}
                          </span>
                          <span className="text-blue-600 font-extrabold text-xs inline-flex items-center gap-1 hover:underline">
                            View Details <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          /* Student Submitted Portfolios View */
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search student titles, descriptions, authors..."
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm bg-slate-50 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {CUSTOM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCustomCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      selectedCustomCategory === cat.value
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingCustom ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Opening student archives...</p>
              </div>
            ) : filteredCustom.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
                <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No portfolios found</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm mb-4">
                  Be the first to submit a case study or research portfolio in this category!
                </p>
                <Link
                  href="/projects/new"
                  className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  Submit Project
                </Link>
              </div>
            ) : (
              /* Custom Projects Showcase Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustom.map((proj) => {
                  const cc = CUSTOM_CATEGORY_COLORS[proj.category] || { bg: '#F8FAFC', text: '#000', border: '#000' }
                  
                  return (
                    <div
                      key={proj.id}
                      className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5"
                    >
                      <div className="p-6">
                        {/* Author Header */}
                        <div className="flex justify-between items-center mb-3">
                          <span
                            className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded border"
                            style={{ backgroundColor: cc.bg, color: cc.text, borderColor: cc.border }}
                          >
                            {proj.category}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                            <User className="w-3.5 h-3.5" />
                            {proj.profiles?.full_name || 'Anonymous User'}
                          </div>
                        </div>

                        <h3 className="font-extrabold text-base leading-snug line-clamp-2 text-slate-800 mb-2">
                          {proj.title}
                        </h3>
                        <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-4">
                          {proj.description}
                        </p>

                        {/* Guide detail */}
                        {(proj.guide_name || proj.guide_org) && (
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 mb-4 text-[10px] text-slate-600">
                            <span className="font-bold">Supervised by:</span> {proj.guide_name} {proj.guide_org ? `(${proj.guide_org})` : ''}
                          </div>
                        )}
                      </div>

                      <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                        {/* Skills / Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(proj.tags || []).slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-600">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleUpvote(proj.id)}
                            className={`flex items-center gap-1.5 transition-colors font-bold ${
                              upvotedProjects.has(proj.id)
                                ? 'text-red-500'
                                : 'text-slate-500 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${upvotedProjects.has(proj.id) ? 'fill-current' : ''}`} /> {proj.upvotes}
                          </button>
                          
                          <Link
                            href={`/projects/${proj.id}`}
                            className="text-blue-600 font-extrabold text-xs inline-flex items-center gap-1 hover:underline"
                          >
                            View Case Study <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Predefined Project Lightbox Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl border-4 border-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[selectedProject.difficulty]} mb-2 inline-block`}>
                  {selectedProject.difficulty}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-1">
                  {selectedProject.title}
                </h2>
                <div className="flex gap-4 mt-2 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedProject.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {selectedProject.curriculum_match}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold p-2.5 rounded-full transition-colors leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 mb-1 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-blue-600" /> Project Description
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 mb-2 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-slate-700" /> Equipment Needed
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedProject.equipment.map((eq, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">•</span> {eq}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" /> Deliverables
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl font-medium">
                    {selectedProject.deliverable}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-800 mb-1 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-orange-600" /> Why This Project Matters
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed italic bg-amber-50/30 border border-amber-100 p-3 rounded-xl">
                  &ldquo;{selectedProject.why_matters}&rdquo;
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-800 mb-1">
                  🌐 Real-World Application
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {selectedProject.real_world_app}
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-800 mb-2">
                  🛠️ Skills Developed
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.skills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg font-medium text-indigo-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer (Action Panel) */}
            <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 font-semibold">
                  Status: <span className="font-black text-slate-800 uppercase">
                    {(progressMap[titleToUuidMap[selectedProject.title] || selectedProject.id] || 'not_started').replace('_', ' ')}
                  </span>
                </span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                {(progressMap[titleToUuidMap[selectedProject.title] || selectedProject.id] || 'not_started') === 'not_started' && (
                  <button
                    onClick={() => {
                      handleUpdateProgress(selectedProject, 'in_progress')
                      setSelectedProject(null)
                    }}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Start Project <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {(progressMap[titleToUuidMap[selectedProject.title] || selectedProject.id] || 'not_started') === 'in_progress' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateProgress(selectedProject, 'completed')
                        setSelectedProject(null)
                      }}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateProgress(selectedProject, 'not_started')
                        setSelectedProject(null)
                      }}
                      className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Reset Status
                    </button>
                  </>
                )}
                {(progressMap[titleToUuidMap[selectedProject.title] || selectedProject.id] || 'not_started') === 'completed' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      disabled
                      className="w-full sm:w-auto bg-emerald-100 border border-emerald-200 text-emerald-800 font-black text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateProgress(selectedProject, 'in_progress')
                        setSelectedProject(null)
                      }}
                      className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Re-open Project
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
