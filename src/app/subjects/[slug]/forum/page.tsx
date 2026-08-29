'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import {
  MessageSquare,
  Plus,
  Search,
  ArrowLeft,
  CheckCircle2,
  Pin,
  ChevronRight,
  Send,
  Sparkles,
  Clock,
  HelpCircle,
  AlertCircle
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subject {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Lesson {
  id: string
  title: string
  slug: string
  order_index: number
}

interface Author {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface ForumQuestion {
  id: string
  user_id: string
  subject_id: string
  lesson_id: string | null
  title: string
  body: string
  tags: string[] | null
  upvotes: number
  answer_count: number
  is_resolved: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
  author: Author
  lesson?: Lesson
}

interface ForumAnswer {
  id: string
  question_id: string
  user_id: string
  body: string
  upvotes: number
  is_accepted: boolean
  created_at: string
  updated_at: string
  author: Author
}

// ─── Honest Author & Timestamp Resolution ─────────────────────────────────────

function getAuthorInfo(originalName?: string | null) {
  if (originalName && originalName !== 'Student' && originalName !== 'Anonymous Student' && originalName.trim() !== '') {
    const initials = originalName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return { name: originalName, title: 'PolymerHub Contributor', initials, color: 'bg-blue-50 text-[#2563EB] border-blue-200' }
  }
  return { name: 'Community Member', title: 'Polymer Engineering Forum', initials: 'CM', color: 'bg-slate-100 text-slate-700 border-slate-200' }
}

function formatForumTime(dateStr: string): string {
  try {
    const parsed = new Date(dateStr).getTime()
    const now = Date.now()
    const diffSec = Math.floor((now - parsed) / 1000)

    if (diffSec < 60) return 'Just now'
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'Recently'
  }
}

export default function SubjectForumPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [user, setUser] = useState<User | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  
  // Forum list & filters
  const [questions, setQuestions] = useState<ForumQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved' | 'pinned'>('all')
  const [sort, setSort] = useState<'newest' | 'upvotes'>('newest')

  // Active question & replies
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [activeQuestion, setActiveQuestion] = useState<ForumQuestion | null>(null)
  const [answers, setAnswers] = useState<ForumAnswer[]>([])
  const [answersLoading, setAnswersLoading] = useState(false)
  // New question / answer form states
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newLessonId, setNewLessonId] = useState<string>('')
  const [newTags, setNewTags] = useState('')
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false)
  
  const [newAnswerBody, setNewAnswerBody] = useState('')
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const supabase = createClient()

  const loadQuestions = useCallback(async () => {
    if (!subject) return
    setLoading(true)

    let query = supabase
      .from('forum_questions')
      .select(`
        *,
        author:profiles(id, full_name, avatar_url),
        lesson:lessons(id, title, slug, order_index)
      `)
      .eq('subject_id', subject.id)

    if (sort === 'upvotes') {
      query = query.order('upvotes', { ascending: false })
    } else {
      query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (!error && data) {
      setQuestions(data as unknown as ForumQuestion[])
    }
    setLoading(false)
  }, [subject, sort, supabase])

  const loadAnswers = useCallback(async () => {
    if (!activeQuestionId) return
    setAnswersLoading(true)

    const { data, error } = await supabase
      .from('forum_answers')
      .select(`
        *,
        author:profiles(id, full_name, avatar_url)
      `)
      .eq('question_id', activeQuestionId)
      .order('is_accepted', { ascending: false })
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: true })

    if (!error && data) {
      setAnswers(data as unknown as ForumAnswer[])
    }
    setAnswersLoading(false)
  }, [activeQuestionId, supabase])

  useEffect(() => {
    async function init() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      const { data: currentSubject } = await supabase
        .from('subjects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!currentSubject) {
        router.push('/subjects')
        return
      }
      setSubject(currentSubject)

      const { data: lessonList } = await supabase
        .from('lessons')
        .select('id, title, slug, order_index')
        .eq('subject_id', currentSubject.id)
        .order('order_index')

      if (lessonList) setLessons(lessonList)
    }

    init()
  }, [slug, router, supabase])

  useEffect(() => {
    if (subject) {
      loadQuestions()
    }
  }, [subject, loadQuestions])

  useEffect(() => {
    if (activeQuestionId) {
      loadAnswers()
    }
  }, [activeQuestionId, loadAnswers])

  const handleSelectQuestion = (qId: string) => {
    setActiveQuestionId(qId)
    const found = questions.find((q) => q.id === qId)
    if (found) setActiveQuestion(found)
    setShowCreateForm(false)
  }

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !subject) return
    if (!newTitle.trim() || !newBody.trim()) {
      setErrorMsg('Question title and technical details are required.')
      return
    }

    setIsSubmittingQuestion(true)
    setErrorMsg(null)

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const { data, error } = await supabase
      .from('forum_questions')
      .insert({
        subject_id: subject.id,
        user_id: user.id,
        lesson_id: newLessonId || null,
        title: newTitle.trim(),
        body: newBody.trim(),
        tags: tagsArray.length > 0 ? tagsArray : null,
        upvotes: 1,
        answer_count: 0,
        is_resolved: false,
        is_pinned: false,
      })
      .select()
      .single()

    if (error) {
      setErrorMsg(error.message)
    } else if (data) {
      setNewTitle('')
      setNewBody('')
      setNewLessonId('')
      setNewTags('')
      setShowCreateForm(false)
      await loadQuestions()
      handleSelectQuestion(data.id)
    }
    setIsSubmittingQuestion(false)
  }

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !activeQuestionId || !newAnswerBody.trim()) return

    setIsSubmittingAnswer(true)
    setErrorMsg(null)

    const { error } = await supabase.from('forum_answers').insert({
      question_id: activeQuestionId,
      user_id: user.id,
      body: newAnswerBody.trim(),
      upvotes: 0,
      is_accepted: false,
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setNewAnswerBody('')
      await loadAnswers()
      await loadQuestions()
    }
    setIsSubmittingAnswer(false)
  }

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.body.toLowerCase().includes(search.toLowerCase()) ||
      (q.tags && q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'resolved'
        ? q.is_resolved
        : filter === 'unresolved'
        ? !q.is_resolved
        : filter === 'pinned'
        ? q.is_pinned
        : true

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* ── Header ── */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 sm:px-8 py-8 sm:py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/subjects/${slug}`}
                className="text-xs font-mono text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{subject?.name}</span>
              </Link>
              <span className="text-slate-500 font-mono">/</span>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Peer Forum
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {subject?.name} Discussions
            </h1>
          </div>

          <Link
            href="/forum"
            className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-xl bg-white/10 border border-white/15"
          >
            <span>All 19 Subject Forums</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Main Layout: Split Feed ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Inquiries List (5 cols) ── */}
          <div className="lg:col-span-5 space-y-4">
            {/* Toolbar & Search */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search technical questions, formulas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="flex gap-1">
                    {(['all', 'unresolved', 'resolved'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                          filter === f
                            ? 'bg-blue-50 text-[#2563EB] border border-blue-200 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'newest' | 'upvotes')}
                    className="text-[10px] font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                  >
                    <option value="newest">Newest</option>
                    <option value="upvotes">Top Voted</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setShowCreateForm(true)
                    setActiveQuestionId(null)
                    setActiveQuestion(null)
                  }}
                  className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Ask Question</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {loading ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs font-mono text-slate-400">
                  Loading discussion threads…
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-display font-bold text-sm text-slate-900">No questions found</p>
                  <p className="text-xs text-slate-500">Be the first to ask in {subject?.name}.</p>
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const isActive = q.id === activeQuestionId
                  const author = getAuthorInfo(q.author?.full_name)
                  const timeAgo = formatForumTime(q.created_at)

                  return (
                    <div
                      key={q.id}
                      onClick={() => handleSelectQuestion(q.id)}
                      className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                        isActive
                          ? 'border-[#2563EB] ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5">
                          {q.is_pinned && (
                            <span className="text-amber-700 font-bold flex items-center gap-0.5">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                          {q.is_resolved ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Resolved
                            </span>
                          ) : (
                            <span className="text-slate-400">Open</span>
                          )}
                        </div>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-1">
                        {q.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-sans line-clamp-2 mb-3">
                        {q.body}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 text-[11px] truncate max-w-[150px]">
                          {author.name}
                        </span>
                        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                          <span>▲ {q.upvotes}</span>
                          <span>💬 {q.answer_count} answers</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ── Right Column: Detail View or Create Form (7 cols) ── */}
          <div className="lg:col-span-7">
            {showCreateForm ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="font-display font-bold text-base text-slate-900">
                    Ask Question in {subject?.name}
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateQuestion} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Question Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. How does mould shrinkage differ between PP and PA-66?"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Related Lesson (Optional)
                    </label>
                    <select
                      value={newLessonId}
                      onChange={(e) => setNewLessonId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900"
                    >
                      <option value="">General to this Subject</option>
                      {lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          Lesson {l.order_index}: {l.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Technical Problem Description
                    </label>
                    <textarea
                      rows={5}
                      value={newBody}
                      onChange={(e) => setNewBody(e.target.value)}
                      placeholder="Provide materials, test methods, formulas, or processing context..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-sans text-slate-900 resize-none focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingQuestion}
                      className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs"
                    >
                      {isSubmittingQuestion ? 'Publishing…' : 'Publish Question →'}
                    </button>
                  </div>
                </form>
              </div>
            ) : activeQuestion ? (
              <div className="space-y-6">
                {/* Main Question Card */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#1E40AF] border border-blue-200 font-bold">
                      {subject?.name}
                    </span>
                    <span className="text-slate-400">
                      {formatForumTime(activeQuestion.created_at)}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-xl text-slate-900 leading-tight">
                    {activeQuestion.title}
                  </h2>

                  <p className="text-sm text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">
                    {activeQuestion.body}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-mono font-bold text-xs text-[#2563EB]">
                        {getAuthorInfo(activeQuestion.author?.full_name).initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">
                          {getAuthorInfo(activeQuestion.author?.full_name).name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {getAuthorInfo(activeQuestion.author?.full_name).title}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/ai-tutor"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] text-xs font-mono font-bold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Ask AI Copilot</span>
                    </Link>
                  </div>
                </div>

                {/* Answers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold text-slate-900">
                      {answers.length} Peer Solutions
                    </h3>
                  </div>

                  {answersLoading ? (
                    <div className="p-8 text-center text-xs font-mono text-slate-400">
                      Loading solutions…
                    </div>
                  ) : answers.length === 0 ? (
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center text-xs text-slate-500 font-sans">
                      No answers yet. Post the first solution below.
                    </div>
                  ) : (
                    answers.map((ans) => {
                      const ansAuthor = getAuthorInfo(ans.author?.full_name)
                      const ansTime = formatForumTime(ans.created_at)

                      return (
                        <div
                          key={ans.id}
                          className={`bg-white border rounded-2xl p-5 shadow-xs space-y-3 ${
                            ans.is_accepted ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-200/90'
                          }`}
                        >
                          {ans.is_accepted && (
                            <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Accepted Best Answer</span>
                            </div>
                          )}

                          <p className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
                            {ans.body}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                              {ansAuthor.name} <span className="font-mono text-slate-400">· {ansTime}</span>
                            </span>
                            <span className="font-mono text-slate-500">▲ {ans.upvotes}</span>
                          </div>
                        </div>
                      )
                    })
                  )}

                  {/* Post Answer Box */}
                  <form onSubmit={handlePostAnswer} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#2563EB]" />
                      Post Your Solution
                    </h4>
                    <textarea
                      rows={3}
                      value={newAnswerBody}
                      onChange={(e) => setNewAnswerBody(e.target.value)}
                      placeholder="Explain the chemical kinetics, mold mechanics, or calculation steps..."
                      className="w-full p-3 text-xs sm:text-sm text-slate-900 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-[#2563EB]"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingAnswer || !newAnswerBody.trim()}
                        className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs"
                      >
                        {isSubmittingAnswer ? 'Posting…' : 'Submit Solution →'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-xs space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Select an inquiry from the left feed
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click any question to view peer solutions or post a new inquiry for {subject?.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
