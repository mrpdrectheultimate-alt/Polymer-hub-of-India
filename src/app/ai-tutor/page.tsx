'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { Send, Brain, BookOpen, ArrowRight, RotateCcw, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; slug: string }[]
  timestamp: Date
}

type QueryStatus = {
  used: number
  limit: number
  isPremium: boolean
}

const STARTER_QUESTIONS = [
  'What is the difference between Tg and Tm?',
  'How does vulcanization work in rubber?',
  'Explain the Melt Flow Index and why it matters',
  'What causes sink marks in injection moulding?',
  'Compare PLA and PHA bioplastics',
  'How does ISO 10993 biocompatibility testing work?',
  'What is the EPR framework in India?',
  'Explain carbon fibre reinforced polymer (CFRP)',
]

// ─── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%]">
          <div className="border-4 border-ink p-4 bg-ink text-white" style={{ boxShadow: '3px 3px 0px 0px #1D4ED8' }}>
            <p className="text-sm font-medium leading-relaxed">{message.content}</p>
          </div>
          <div className="flex items-center justify-end gap-1 mt-1">
            <User className="w-3 h-3 text-ink/30" />
            <span className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">
              {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[90%] w-full">
        <div className="border-4 border-ink bg-canvas overflow-hidden" style={{ boxShadow: '3px 3px 0px 0px #15803D' }}>
          {/* Header */}
          <div className="border-b-4 border-ink px-4 py-2 bg-green flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-white" />
            <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">PolymerHub AI Tutor</span>
            <Sparkles className="w-3 h-3 text-white/60 ml-auto" />
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{message.content}</div>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 border-t-2 border-ink/10 pt-3">
                <div className="font-mono text-[8px] text-ink/40 uppercase tracking-widest mb-2">Sources from your lessons</div>
                <div className="flex flex-wrap gap-2">
                  {message.sources.map((src) => (
                    <Link
                      key={src.slug}
                      href={`/lessons/${src.slug}`}
                      className="font-mono text-[9px] font-bold border-2 border-green/40 text-green px-2 py-1 hover:bg-green hover:text-white transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-2.5 h-2.5" />
                      {src.title.length > 40 ? src.title.slice(0, 40) + '...' : src.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Brain className="w-3 h-3 text-ink/30" />
          <span className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">
            {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Phase 18 States
  const [activeTab, setActiveTab] = useState<'chat' | 'focus'>('chat')
  const [focusPlan, setFocusPlan] = useState<string | null>(null)
  const [focusLoading, setFocusLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('ai_queries_today, subscription_status')
          .eq('id', session.user.id)
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

  // Fetch Focus Plan dynamically when tab changes
  useEffect(() => {
    if (activeTab === 'focus' && !focusPlan && session) {
      setFocusLoading(true)
      fetch('/api/ai-generator/focus-plan')
        .then(res => res.json())
        .then(data => {
          if (data.plan) {
            setFocusPlan(data.plan)
          }
        })
        .catch(() => {})
        .finally(() => setFocusLoading(false))
    }
  }, [activeTab, focusPlan, session])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError(null)

    if (!session) {
      setError('Please sign in to use the AI Tutor.')
      return
    }

    if (!queryStatus.isPremium && queryStatus.used >= queryStatus.limit) {
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
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history,
        }),
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
    <div className="min-h-screen bg-canvas flex flex-col">
      <div className="h-2 bg-green" />

      {/* Header */}
      <div className="border-b-4 border-ink bg-ink flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green border-4 border-green flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display text-base font-black text-white leading-tight">AI Tutor</div>
              <div className="font-mono text-[8px] text-white/40 uppercase tracking-wider">Grounded in your 216 lessons · Gemini 2.5 Flash</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <div className="hidden sm:flex items-center gap-2 border-2 border-white/20 px-3 py-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isAtLimit ? '#EA580C' : '#4ADE80' }} />
                <span className="font-mono text-[9px] text-white/60 uppercase tracking-wider">
                  {queryStatus.isPremium ? '∞ unlimited' : `${queriesLeft} left today`}
                </span>
              </div>
            )}

            {activeTab === 'chat' && messages.length > 0 && (
              <button onClick={clearConversation} className="border-2 border-white/20 text-white/50 hover:text-white hover:border-white p-1.5 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {!session && (
              <Link href="/login" className="cn-btn-yellow text-xs py-1.5">
                Sign In to Ask
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-header */}
      <div className="border-b-4 border-ink bg-white flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-4">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-4 font-display text-sm font-black border-r-4 border-ink transition-all ${
              activeTab === 'chat' ? 'bg-green text-white' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            💬 AI Chat Tutor
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className={`py-3 px-4 font-display text-sm font-black border-r-4 border-ink transition-all ${
              activeTab === 'focus' ? 'bg-purple-600 text-white' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            🎯 AI Focus & Career Plan
          </button>
        </div>
      </div>

      {/* Main Area */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

              {/* Empty state */}
              {messages.length === 0 && (
                <div className="space-y-6">
                  {/* Welcome */}
                  <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #15803D' }}>
                    <div className="border-b-4 border-ink px-5 py-3 bg-green">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-white" />
                        <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">PolymerHub AI Tutor</span>
                      </div>
                    </div>
                    <div className="p-5 bg-canvas">
                      <p className="font-display text-xl font-black text-ink mb-2">Ask me anything about polymer engineering.</p>
                      <p className="text-sm text-ink/60 leading-relaxed mb-4">
                        I&apos;m trained on all 216 lessons across your 19 subjects — using real pgvector similarity search to ground every answer in your actual curriculum. I remember our conversation context, so you can ask follow-up questions naturally.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { label: '216 Lessons', color: '#1D4ED8' },
                          { label: '19 Subjects', color: '#EA580C' },
                          { label: 'Context Memory', color: '#15803D' },
                          { label: 'Source Citations', color: '#7C3AED' },
                        ].map((f) => (
                          <div key={f.label} className="border-2 border-ink p-3 flex items-center justify-between" style={{ backgroundColor: `${f.color}10` }}>
                            <span className="font-display text-sm font-black" style={{ color: f.color }}>{f.label}</span>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: f.color }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Starter questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        disabled={!session || isAtLimit}
                        className="border-4 border-ink p-4 text-left font-display text-xs font-black text-ink bg-canvas hover:bg-slate-50 transition-colors shadow-hard active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages list */}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="border-4 border-ink overflow-hidden max-w-[150px] w-full" style={{ boxShadow: '3px 3px 0px 0px #15803D' }}>
                    <div className="border-b-4 border-ink px-4 py-2 bg-green flex items-center gap-2">
                      <Brain className="w-3.5 h-3.5 text-white" />
                      <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Thinking...</span>
                    </div>
                    <div className="px-5 py-4 flex items-center gap-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 border-2 border-ink animate-bounce"
                          style={{ backgroundColor: '#15803D', animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="border-4 border-orange mb-4 overflow-hidden" style={{ boxShadow: '3px 3px 0px 0px #EA580C' }}>
                  <div className="border-b-4 border-ink px-4 py-2 bg-orange flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                    <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Error</span>
                  </div>
                  <div className="p-4 bg-orange/5 flex items-start justify-between gap-3">
                    <p className="text-sm text-ink">{error}</p>
                    {error.includes('limit') && (
                      <Link href="/pricing" className="cn-btn-yellow text-xs flex-shrink-0">
                        Upgrade
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Limit warning */}
              {isAtLimit && session && (
                <div className="border-4 border-orange overflow-hidden mb-4" style={{ boxShadow: '4px 4px 0px 0px #EA580C' }}>
                  <div className="p-5 flex items-center justify-between gap-4 flex-wrap" style={{ backgroundColor: '#FFF7ED' }}>
                    <div>
                      <div className="font-display text-lg font-black text-ink">Daily limit reached</div>
                      <p className="text-sm text-ink/60">You&apos;ve used all 15 free queries today. Resets at midnight.</p>
                    </div>
                    <Link href="/pricing" className="cn-btn-black text-sm flex-shrink-0">
                      Get Unlimited — ₹149/mo <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t-4 border-ink bg-canvas flex-shrink-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">

              {/* Query counter mobile */}
              {session && (
                <div className="flex items-center justify-between mb-2 sm:hidden">
                  <span className="font-mono text-[8px] text-ink/40 uppercase tracking-wider">
                    {queryStatus.isPremium ? 'Unlimited queries' : `${queriesLeft} of ${queryStatus.limit} queries left today`}
                  </span>
                  {messages.length > 0 && (
                    <button onClick={clearConversation} className="font-mono text-[8px] text-ink/40 hover:text-ink uppercase tracking-wider flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5" /> New chat
                    </button>
                  )}
                </div>
              )}

              <div className="flex gap-3 items-end">
                <div className="flex-1 border-4 border-ink overflow-hidden" style={{ boxShadow: '3px 3px 0px 0px #0A0A0A' }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      !session
                        ? 'Sign in to ask questions...'
                        : isAtLimit
                        ? 'Daily limit reached — upgrade for unlimited...'
                        : 'Ask anything about polymer engineering... (Enter to send, Shift+Enter for new line)'
                    }
                    disabled={!session || isAtLimit || loading}
                    className="w-full px-4 py-3 text-sm text-ink resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-canvas"
                    rows={2}
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading || !session || isAtLimit}
                  className="border-4 border-ink w-14 h-14 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-green hover:border-green"
                  style={{
                    backgroundColor: input.trim() && !loading && session && !isAtLimit ? '#15803D' : '#F9FAFB',
                    boxShadow: '3px 3px 0px 0px #0A0A0A',
                  }}
                >
                  <Send className={`w-5 h-5 ${input.trim() && !loading && session ? 'text-white' : 'text-ink/30'}`} />
                </button>
              </div>
              <p className="font-mono text-[8px] text-ink/30 mt-2 text-center uppercase tracking-wider">
                Answers grounded in your 216 lessons via Gemini 2.5 Flash + pgvector RAG
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="border-4 border-ink bg-purple-100 p-6 shadow-hard animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-650 shrink-0" />
                <div>
                  <h2 className="text-xl font-black text-slate-900">AI Advisor Blueprint</h2>
                  <p className="text-xs text-slate-600 font-bold mt-0.5">Analyses your lesson completions, quiz histories, and career goals to map a weekly focus guide.</p>
                </div>
              </div>
            </div>

            {focusLoading ? (
              <div className="border-4 border-ink p-8 text-center bg-white shadow-hard animate-pulse">
                <RefreshCw className="w-8 h-8 mx-auto text-purple-600 animate-spin mb-3" />
                <p className="font-display font-black text-slate-900">Analyzing study progress and running Gemini advisor planner...</p>
              </div>
            ) : !session ? (
              <div className="border-4 border-ink p-8 text-center bg-white shadow-hard">
                <p className="font-display text-lg font-black text-slate-900">Sign in to view your Focus Plan</p>
                <Link href="/login" className="cn-btn-purple mt-4 inline-flex">Sign In</Link>
              </div>
            ) : focusPlan ? (
              <div className="border-4 border-slate-900 bg-white p-6 shadow-hard prose max-w-none font-bold text-slate-900 leading-relaxed markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {focusPlan}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="border-4 border-ink p-8 text-center bg-white shadow-hard">
                <p className="font-display font-black text-slate-900">Unable to generate focus plan.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
