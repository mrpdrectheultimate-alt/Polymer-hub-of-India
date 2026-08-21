'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Zap,
  BookOpen,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Brain,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; slug: string }[]
  timestamp: Date
  liked?: boolean | null
}

type QueryStatus = {
  used: number
  limit: number
  isPremium: boolean
}

// ─── Starter Questions ────────────────────────────────────────────────────────

const STARTER_QUESTIONS = [
  { icon: '🧪', text: 'What is the difference between Tg and Tm?' },
  { icon: '🔬', text: 'How does vulcanization work in rubber?' },
  { icon: '📊', text: 'Explain the Melt Flow Index and why it matters' },
  { icon: '⚙️', text: 'What causes sink marks in injection moulding?' },
  { icon: '♻️', text: 'Compare PLA and PHA bioplastics' },
  { icon: '🏥', text: 'How does ISO 10993 biocompatibility testing work?' },
  { icon: '🇮🇳', text: 'What is the EPR framework in India?' },
  { icon: '🚀', text: 'Explain carbon fibre reinforced polymer (CFRP)' },
]

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onLike,
  onCopy,
}: {
  message: Message
  onLike: (id: string, val: boolean) => void
  onCopy: (text: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    onCopy(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-5 animate-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-[80%]">
          <div className="flex items-start gap-2.5 flex-row-reverse">
            <div className="w-8 h-8 rounded-xl bg-[#1D4ED8] flex items-center justify-center flex-shrink-0 shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-[#1D4ED8] shadow-md">
              <p className="text-sm leading-relaxed text-white font-medium">{message.content}</p>
            </div>
          </div>
          <div className="flex justify-end mt-1 pr-10">
            <span className="text-[10px] text-slate-400 font-mono">
              {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-5 animate-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[90%] w-full">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 bg-white border-2 border-slate-200 rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
            {/* AI label bar */}
            <div className="border-b border-slate-100 px-4 py-2 bg-gradient-to-r from-blue-50 to-violet-50 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-violet-500" />
              <span className="font-mono text-[9px] font-black text-violet-600 uppercase tracking-widest">
                PolymerHub AI Tutor
              </span>
            </div>
            {/* Content */}
            <div className="px-4 py-3">
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide mb-1.5">
                    📚 Grounded in your lessons:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {message.sources.map((src) => (
                      <Link
                        key={src.slug}
                        href={`/lessons/${src.slug}`}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
                      >
                        <BookOpen className="w-2.5 h-2.5" />
                        {src.title.length > 38 ? src.title.slice(0, 38) + '…' : src.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Feedback row */}
        <div className="flex items-center gap-3 mt-1.5 pl-10">
          <span className="text-[10px] text-slate-400 font-mono">
            {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-[#1D4ED8] transition-colors"
            title="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onLike(message.id, true)}
            className={`transition-colors ${message.liked === true ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}
            title="Helpful"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onLike(message.id, false)}
            className={`transition-colors ${message.liked === false ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
            title="Not helpful"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Thinking Dots ────────────────────────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mb-5 animate-in fade-in duration-300">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-bounce" style={{ animationDelay: '160ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-bounce" style={{ animationDelay: '320ms' }} />
          <span className="text-[10px] text-slate-400 font-mono ml-1 uppercase tracking-wide">Thinking…</span>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AITutorPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [queryStatus, setQueryStatus] = useState<QueryStatus>({ used: 0, limit: 15, isPremium: false })
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'focus'>('chat')
  const [focusPlan, setFocusPlan] = useState<string | null>(null)
  const [focusLoading, setFocusLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auth + profile init
  useEffect(() => {
    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession()
      setSession(s)
      if (s) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('ai_queries_today, subscription_status')
          .eq('id', s.user.id)
          .single()
        if (profile) {
          const isPremium = profile.subscription_status === 'premium'
          setQueryStatus({
            used: profile.ai_queries_today ?? 0,
            limit: isPremium ? 999 : 15,
            isPremium,
          })
        }
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load focus plan when tab switches
  const loadFocusPlan = useCallback(() => {
    if (!session || focusPlan || focusLoading) return
    setFocusLoading(true)
    fetch('/api/ai-generator/focus-plan')
      .then((r) => r.json())
      .then((d) => { if (d.plan) setFocusPlan(d.plan) })
      .catch(() => {})
      .finally(() => setFocusLoading(false))
  }, [session, focusPlan, focusLoading])

  useEffect(() => {
    if (activeTab === 'focus') loadFocusPlan()
  }, [activeTab, loadFocusPlan])

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  // Feedback helper
  const handleLike = (id: string, val: boolean) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: m.liked === val ? null : val } : m))
    )
  }

  // Send message
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError(null)

    if (!session) {
      setError('Please sign in to use the AI Tutor.')
      return
    }

    const isAtLimit = !queryStatus.isPremium && queryStatus.used >= queryStatus.limit
    if (isAtLimit) {
      setError('Daily query limit reached. Upgrade to Premium for unlimited queries.')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources ?? [],
        timestamp: new Date(),
        liked: null,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setQueryStatus((prev) => ({ ...prev, used: prev.used + 1 }))
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      setError(errMsg || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearConversation = () => {
    setMessages([])
    setError(null)
  }

  const queriesLeft = Math.max(0, queryStatus.limit - queryStatus.used)
  const isAtLimit = !queryStatus.isPremium && queryStatus.used >= queryStatus.limit

  return (
    <div className="flex flex-col bg-[#F8FAFC]" style={{ height: 'calc(100vh - 68px)' }}>

      {/* ─── HEADER ─── */}
      <div
        className="flex-shrink-0 border-b-4 border-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black font-display text-slate-900 leading-tight">AI Tutor</h1>
            <p className="text-[10px] text-slate-500 font-mono">Grounded in 216 PPE lessons · Gemini 2.5 Flash</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session && (
            <span className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded-full ${
              isAtLimit
                ? 'bg-orange-100 text-orange-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAtLimit ? 'bg-orange-500' : 'bg-emerald-500 animate-pulse'}`} />
              {queryStatus.isPremium ? '∞ Unlimited' : isAtLimit ? 'Limit reached' : `${queriesLeft} left today`}
            </span>
          )}
          {messages.length > 0 && activeTab === 'chat' && (
            <button
              onClick={clearConversation}
              className="p-2 rounded-lg border-2 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors"
              title="New conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {!session && (
            <Link href="/login" className="px-4 py-2 bg-[#1D4ED8] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Sign In to Ask
            </Link>
          )}
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="flex-shrink-0 border-b-4 border-slate-900 bg-white flex">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-5 py-2.5 font-display text-sm font-black border-r-4 border-slate-900 transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          💬 AI Chat Tutor
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`px-5 py-2.5 font-display text-sm font-black border-r-4 border-slate-900 transition-all ${
            activeTab === 'focus'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          🎯 AI Focus &amp; Career Plan
        </button>
      </div>

      {/* ─── CHAT TAB ─── */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-h-0">

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

              {/* Empty State */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto pt-4 pb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-5">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black font-display text-slate-900">
                    Ask me anything about polymer engineering
                  </h2>
                  <p className="text-slate-500 text-sm mt-2 max-w-md leading-relaxed">
                    Grounded in all <strong>216 lessons</strong> across 19 subjects — using pgvector similarity search to give you accurate, curriculum-grounded answers with source citations.
                  </p>

                  {/* Capability chips */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {[
                      { label: '216 Lessons', color: 'bg-blue-100 text-blue-700' },
                      { label: '19 Subjects', color: 'bg-orange-100 text-orange-700' },
                      { label: 'Context Memory', color: 'bg-emerald-100 text-emerald-700' },
                      { label: 'Source Citations', color: 'bg-violet-100 text-violet-700' },
                    ].map((c) => (
                      <span key={c.label} className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full ${c.color}`}>
                        {c.label}
                      </span>
                    ))}
                  </div>

                  {/* Suggested Questions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 w-full">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q.text}
                        onClick={() => sendMessage(q.text)}
                        disabled={!session || isAtLimit}
                        className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-[#1D4ED8] hover:shadow-md transition-all text-sm text-left text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <span className="text-lg flex-shrink-0">{q.icon}</span>
                        <span className="line-clamp-1 group-hover:text-[#1D4ED8] transition-colors">{q.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages list */}
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onLike={handleLike}
                  onCopy={handleCopy}
                />
              ))}

              {/* Thinking indicator */}
              {loading && <ThinkingIndicator />}

              {/* Error */}
              {error && (
                <div className="mb-4 border-2 border-orange-300 bg-orange-50 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-orange-500 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                    <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Error</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-orange-800">{error}</p>
                    {error.includes('limit') && (
                      <Link href="/pricing" className="flex-shrink-0 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1">
                        Upgrade <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Daily limit warning */}
              {isAtLimit && session && (
                <div className="mb-4 border-2 border-orange-300 bg-orange-50 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-display font-black text-slate-900">Daily limit reached</p>
                    <p className="text-sm text-slate-600 mt-0.5">You&apos;ve used all 15 free queries. Resets at midnight.</p>
                  </div>
                  <Link href="/pricing" className="flex-shrink-0 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-1.5">
                    Get Unlimited — ₹149/mo <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ─── INPUT AREA ─── */}
          <div className="flex-shrink-0 border-t-4 border-slate-900 bg-white px-4 sm:px-6 py-4">
            <div className="max-w-4xl mx-auto">
              {/* Mobile query counter */}
              {session && (
                <div className="flex items-center justify-between mb-2 sm:hidden">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {queryStatus.isPremium ? 'Unlimited' : `${queriesLeft} / ${queryStatus.limit} queries left today`}
                  </span>
                  {messages.length > 0 && (
                    <button onClick={clearConversation} className="text-[10px] text-slate-400 hover:text-slate-700 font-mono flex items-center gap-1 uppercase">
                      <RotateCcw className="w-3 h-3" /> New chat
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-end gap-3">
                <div className="flex-1 border-2 border-slate-200 rounded-2xl overflow-hidden focus-within:border-[#1D4ED8] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      !session
                        ? 'Sign in to ask questions…'
                        : isAtLimit
                        ? 'Daily limit reached — upgrade for unlimited…'
                        : 'Ask anything about polymer engineering… (Enter to send, Shift+Enter for new line)'
                    }
                    disabled={!session || isAtLimit || loading}
                    className="w-full px-4 py-3 text-sm text-slate-900 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white placeholder:text-slate-400"
                    rows={2}
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                  />
                  <div className="flex items-center justify-between px-4 py-1.5 border-t border-slate-100 bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-mono">{input.length}/1000</span>
                    <span className="text-[10px] text-slate-400">Enter ↵ to send</span>
                  </div>
                </div>

                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading || !session || isAtLimit}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-md ${
                    input.trim() && !loading && session && !isAtLimit
                      ? 'bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                      : 'bg-slate-200 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className={`w-5 h-5 ${input.trim() && session ? 'text-white' : 'text-slate-400'}`} />
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-mono text-center mt-2 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                Powered by Gemini 2.5 Flash · Grounded in 216 PPE lessons via pgvector RAG
              </p>
            </div>
          </div>
        </div>

      ) : (
        /* ─── FOCUS PLAN TAB ─── */
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="border-4 border-slate-900 bg-purple-100 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-700 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-black font-display text-slate-900">AI Advisor Blueprint</h2>
                  <p className="text-xs text-slate-600 font-bold mt-0.5">
                    Analyses your lesson completions, quiz histories, and career goals to map a weekly focus guide.
                  </p>
                </div>
              </div>
            </div>

            {focusLoading ? (
              <div className="border-4 border-slate-900 p-10 text-center bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                <RefreshCw className="w-8 h-8 mx-auto text-purple-600 animate-spin mb-3" />
                <p className="font-display font-black text-slate-900">Analysing study progress and running Gemini advisor planner…</p>
              </div>
            ) : !session ? (
              <div className="border-4 border-slate-900 p-10 text-center bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-display text-lg font-black text-slate-900">Sign in to view your Focus Plan</p>
                <Link href="/login" className="mt-4 inline-flex px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                  Sign In
                </Link>
              </div>
            ) : focusPlan ? (
              <div className="border-4 border-slate-900 bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] prose max-w-none text-slate-900 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{focusPlan}</ReactMarkdown>
              </div>
            ) : (
              <div className="border-4 border-slate-900 p-10 text-center bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-display font-black text-slate-900">Unable to generate focus plan. Please try again.</p>
                <button
                  onClick={() => { setFocusPlan(null); loadFocusPlan() }}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
