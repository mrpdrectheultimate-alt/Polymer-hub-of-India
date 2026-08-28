'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Sparkles,
  User,
  Loader2,
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
  Layers,
  Calculator,
  Compass,
  ChevronRight,
  CheckCircle2,
  Lock,
  Plus,
  MessageSquare,
  ShieldCheck,
  Terminal,
  Sliders,
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
  isGuest: boolean
  guestQueriesLeft: number
}

type ChatHistoryItem = {
  id: string
  title: string
  timestamp: string
  messageCount: number
}

// ─── Engineering Suggestion Cards (Zero Emojis · High Precision) ──────────────

const ENGINEERING_PROMPTS = [
  {
    category: 'Fundamentals',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Glass Transition vs Melting',
    prompt: 'Explain the thermodynamic and molecular differences between Tg and Tm in semi-crystalline polymers like POM and Nylon 6,6.',
    sourceHint: 'Lesson 1.3 · Polymer Physics'
  },
  {
    category: 'Processing',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Sink Marks & Cavity Pressure',
    prompt: 'What causes sink marks in thick-walled injection molded parts, and how do packing pressure and gate freeze-off time solve it?',
    sourceHint: 'Lesson 4.2 · Injection Moulding'
  },
  {
    category: 'Materials',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'PLA vs PHA Biodegradation',
    prompt: 'Compare the biodegradation mechanisms and crystalline degradation rates of Polylactic Acid (PLA) vs Polyhydroxyalkanoate (PHA).',
    sourceHint: 'Lesson 7.4 · Sustainable Biopolymers'
  },
  {
    category: 'Rheology',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'MFI to Zero-Shear Viscosity',
    prompt: 'How is Melt Flow Index (MFI/MFR) correlated with molecular weight distribution (MWD) and shear-thinning power-law fluid behavior?',
    sourceHint: 'Lesson 5.1 · Polymer Rheology'
  },
  {
    category: 'Tooling',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    title: 'Multi-Cavity Runner Balancing',
    prompt: 'Derive the hydrodynamic diameter formula for naturally balanced 8-cavity runner systems undergoing non-Newtonian shear heating.',
    sourceHint: 'Lesson 3.6 · Mould Design CAE'
  },
  {
    category: 'GATE XE-F',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Carothers Equation & Gel Point',
    prompt: 'How do you calculate the critical extent of reaction (Pc) for trifunctional monomer polycondensation using the Carothers equation?',
    sourceHint: 'Lesson 2.1 · Polymer Chemistry'
  },
]

// ─── Quick Prompt Action Modes ────────────────────────────────────────────────

const PROMPT_MODES = [
  { id: 'explain', label: 'Explain', prefix: 'Explain the fundamental polymer science concept of: ' },
  { id: 'solve', label: 'Solve Problem', prefix: 'Provide a step-by-step engineering calculation for: ' },
  { id: 'quiz', label: 'GATE Quiz', prefix: 'Generate a GATE XE-F standard numerical problem with solution on: ' },
  { id: 'calculate', label: 'Formulate', prefix: 'Give the compounding formulation and processing window for: ' },
]

// ─── Molecular AI Mark Component ──────────────────────────────────────────────

function PolymerAIMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <div className={`${className} relative rounded-xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#0D9488] flex items-center justify-center shadow-md shadow-blue-500/20 text-white`}>
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 19 6 19 14 12 18 5 14 5 6 12 2" />
        <circle cx="12" cy="10" r="2.5" fill="currentColor" />
        <path d="M12 2v4" />
        <path d="M19 14l-3-2" />
        <path d="M5 14l3-2" />
      </svg>
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F59E0B] rounded-full border-2 border-white animate-pulse" />
    </div>
  )
}

// ─── Message Bubble Component ─────────────────────────────────────────────────

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
      <div className="flex justify-end mb-6 animate-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-[85%] sm:max-w-[75%]">
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-sm text-white font-mono text-xs font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tr-xs bg-[#2563EB] shadow-xs text-white">
              <p className="text-sm leading-relaxed font-medium font-sans whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
          <div className="flex justify-end mt-1.5 pr-11">
            <span className="text-[11px] text-slate-400 font-mono">
              {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-6 animate-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[92%] sm:max-w-[85%] w-full">
        <div className="flex items-start gap-3">
          <PolymerAIMark className="w-8 h-8 flex-shrink-0 mt-0.5" />
          <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs shadow-xs overflow-hidden">
            {/* Header pill bar */}
            <div className="border-b border-slate-100 px-4 py-2 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                  PolymerHub AI Copilot
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] text-slate-500 font-mono">Verified Syllabus Grounding</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Markdown Content */}
            <div className="p-4 sm:p-5">
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans prose-headings:font-display prose-headings:font-bold prose-code:font-mono prose-code:text-[#2563EB] prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>

              {/* Source Citations — The Trust Layer */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-slate-100 bg-slate-50/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 rounded-b-2xl">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <p className="text-[11px] text-slate-700 font-mono font-bold uppercase tracking-wider">
                      Verified Curriculum Sources:
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.sources.map((src, idx) => (
                      <Link
                        key={src.slug || idx}
                        href={`/lessons/${src.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-xs transition-all group"
                      >
                        <BookOpen className="w-3 h-3 text-[#2563EB] group-hover:scale-110 transition-transform" />
                        <span>{src.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action micro-bar */}
        <div className="flex items-center gap-3 mt-2 pl-11 text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors font-mono text-[11px]"
            title="Copy response"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => onLike(message.id, true)}
            className={`inline-flex items-center gap-1 transition-colors ${message.liked === true ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-emerald-600'}`}
            title="Helpful citation"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">Helpful</span>
          </button>
          <button
            onClick={() => onLike(message.id, false)}
            className={`inline-flex items-center gap-1 transition-colors ${message.liked === false ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-red-500'}`}
            title="Report issue"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Thinking Molecular Waveform ──────────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-6 animate-in fade-in duration-300">
      <PolymerAIMark className="w-8 h-8 flex-shrink-0" />
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-slate-500 font-mono">Querying 218 lessons &amp; formulating verified answer…</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main AI Tutor Workspace Page ─────────────────────────────────────────────

export default function AITutorPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [queryStatus, setQueryStatus] = useState<QueryStatus>({
    used: 0,
    limit: 15,
    isPremium: false,
    isGuest: true,
    guestQueriesLeft: 3
  })
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [guestLimitModal, setGuestLimitModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'focus' | 'index'>('chat')
  const [focusPlan, setFocusPlan] = useState<string | null>(null)
  const [focusLoading, setFocusLoading] = useState(false)
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [savedChats, setSavedChats] = useState<ChatHistoryItem[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Load Saved Chat History from LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ph_ai_recent_chats')
      if (raw) {
        setSavedChats(JSON.parse(raw))
      }
    } catch {
      // ignore
    }
  }, [])

  // Save current conversation to history
  const persistChatHistory = useCallback((firstPrompt: string, msgCount: number) => {
    try {
      const existing: ChatHistoryItem[] = JSON.parse(localStorage.getItem('ph_ai_recent_chats') || '[]')
      const updated = [
        {
          id: Date.now().toString(),
          title: firstPrompt.slice(0, 48) + (firstPrompt.length > 48 ? '…' : ''),
          timestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          messageCount: msgCount
        },
        ...existing.filter(c => c.title !== firstPrompt.slice(0, 48))
      ].slice(0, 8)
      localStorage.setItem('ph_ai_recent_chats', JSON.stringify(updated))
      setSavedChats(updated)
    } catch {
      // ignore
    }
  }, [])

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
            limit: isPremium ? 9999 : 15,
            isPremium,
            isGuest: false,
            guestQueriesLeft: 0,
          })
        }
      } else {
        setQueryStatus(prev => ({ ...prev, isGuest: true, guestQueriesLeft: 3 }))
      }
    }
    init()
  }, [supabase])

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

  // Send message (Supports both logged-in and guest users!)
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    // Save title on first message
    if (messages.length === 0) {
      persistChatHistory(text.trim(), 2)
    }

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.guestLimitReached) {
          setGuestLimitModal(true)
          throw new Error('You have used your 3 free guest queries. Sign in to continue asking questions.')
        }
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources ?? [],
        timestamp: new Date(),
        liked: null,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.isGuest) {
        setQueryStatus((prev) => ({
          ...prev,
          guestQueriesLeft: data.guestQueriesLeft ?? 0,
        }))
      } else {
        setQueryStatus((prev) => ({ ...prev, used: prev.used + 1 }))
      }
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

  const handleModeClick = (mode: typeof PROMPT_MODES[0]) => {
    setSelectedMode(mode.id)
    if (!input.startsWith(mode.prefix)) {
      setInput(mode.prefix)
    }
    inputRef.current?.focus()
  }

  const clearConversation = () => {
    setMessages([])
    setError(null)
    setSelectedMode(null)
  }

  const queriesLeft = Math.max(0, queryStatus.limit - queryStatus.used)

  return (
    <div className="flex h-[calc(100vh-68px)] bg-[#FAF8F5] overflow-hidden">

      {/* ─── LEFT WORKSPACE SIDEBAR (Desktop + Mobile Drawer) ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PolymerAIMark className="w-7 h-7" />
            <div>
              <span className="font-display font-bold text-sm text-slate-900 leading-none">Polymer Copilot</span>
              <p className="text-[10px] font-mono text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                218 Lessons Indexed
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* New Chat CTA */}
        <div className="p-3 border-b border-slate-100">
          <button
            onClick={() => {
              clearConversation()
              setSidebarOpen(false)
            }}
            className="w-full py-2.5 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Mode Selector Links */}
        <div className="p-3 border-b border-slate-100">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Engineering Modes
          </p>
          <div className="space-y-1">
            {PROMPT_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  handleModeClick(m)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                  selectedMode === m.id
                    ? 'bg-blue-50 text-[#2563EB] font-bold border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{m.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Recent Inquiries
          </p>
          {savedChats.length === 0 ? (
            <div className="px-2 py-4 text-center">
              <MessageSquare className="w-5 h-5 text-slate-300 mx-auto mb-1" />
              <p className="text-[11px] text-slate-400 font-mono">No recent sessions yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {savedChats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setInput(c.title)
                    setSidebarOpen(false)
                    inputRef.current?.focus()
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-sans text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 group border border-transparent hover:border-slate-200"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:text-[#2563EB]" />
                  <span className="truncate flex-1">{c.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Engineering Tools Rail */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-1">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            Engineering Tools
          </p>
          <Link
            href="/calculators"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-[#2563EB]" />
              Calculators
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
          <Link
            href="/comparator"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#EA580C]" />
              Polymer Comparator
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
          <Link
            href="/gate-mock"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#15803D]" />
              GATE XE-F Mock
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
        </div>

        {/* Auth / Guest Status Footer */}
        <div className="p-3 border-t border-slate-200 bg-white">
          {session ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {session.user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] font-mono text-slate-500">
                  {queryStatus.isPremium ? 'Unlimited Pro Access' : `${queriesLeft} queries left today`}
                </p>
              </div>
              <Link href="/profile" className="text-xs text-[#2563EB] font-bold hover:underline">
                Account
              </Link>
            </div>
          ) : (
            <div className="p-2 bg-blue-50/70 border border-blue-200/80 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-[11px] font-bold text-[#1E40AF] font-mono">Guest Mode</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-tight">
                {queryStatus.guestQueriesLeft > 0
                  ? `${queryStatus.guestQueriesLeft} free query remaining without sign-in.`
                  : 'Free guest quota used.'}
              </p>
              <Link
                href="/login"
                className="mt-2 block text-center py-1.5 bg-[#2563EB] text-white rounded-lg text-[11px] font-bold font-mono hover:bg-blue-700 transition-colors"
              >
                Sign In to Save History →
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONSOLE CONTAINER ─── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF8F5]">

        {/* ─── TOP CONSOLE BAR ─── */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Layers className="w-4 h-4" />
            </button>
            
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-100/90 rounded-lg p-1 border border-slate-200/60">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Copilot Console
              </button>
              <button
                onClick={() => setActiveTab('focus')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                  activeTab === 'focus'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Career Focus Plan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono font-bold text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Grounded in 218 Lessons</span>
            </div>

            {messages.length > 0 && activeTab === 'chat' && (
              <button
                onClick={clearConversation}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors"
                title="Clear current conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* ─── CHAT TAB CONTENT ─── */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Scrollable Conversation Stream */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-4xl mx-auto">

                {/* ─── EMPTY STATE: THE ENGINEERING CONSOLE CENTERPIECE ─── */}
                {messages.length === 0 && (
                  <div className="pt-2 pb-6 space-y-6 animate-in fade-in duration-300">
                    
                    {/* Hero Header */}
                    <div className="text-center max-w-2xl mx-auto space-y-2.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E40AF] text-xs font-mono font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>POLYMERHUB ENGINEERING COPILOT</span>
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
                        Precision AI for Polymer Engineers
                      </h1>
                      <p className="text-sm text-slate-600 font-sans leading-relaxed">
                        Every answer is grounded in <strong className="text-slate-900">218 accredited PPE lessons</strong> across 19 subjects, citing textbook formulas, ASTM/ISO standards, and Indian industrial best practices.
                      </p>
                    </div>

                    {/* ─── CAPABILITY SUGGESTION CARDS (Precision · Technical Icons) ─── */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Recommended Engineering Inquiries
                        </p>
                        <span className="text-[11px] font-mono text-slate-400">Click any card to query</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ENGINEERING_PROMPTS.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(item.prompt)}
                            disabled={loading}
                            className="text-left p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#2563EB] hover:shadow-md transition-all group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${item.badgeClass}`}>
                                  [{item.category}]
                                </span>
                                <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              </div>
                              <h3 className="text-xs font-bold text-slate-900 font-display line-clamp-1 mb-1 group-hover:text-[#2563EB] transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-500 font-sans line-clamp-2 leading-relaxed">
                                {item.prompt}
                              </p>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] font-mono text-slate-400">
                              <BookOpen className="w-2.5 h-2.5 text-[#2563EB]" />
                              <span className="truncate">{item.sourceHint}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ─── "SHOW, DON'T TELL" STATIC PROOF DEMO ─── */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                            Sample Grounded Response Demonstration
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold">
                          Live Architecture Proof
                        </span>
                      </div>
                      <div className="space-y-2 font-sans text-xs text-slate-700 leading-relaxed">
                        <p className="font-bold text-slate-900">
                          Q: How does molecular weight affect polymer melt viscosity?
                        </p>
                        <p className="text-slate-600">
                          Above the critical entanglement molecular weight ($M_c$), zero-shear viscosity ($\eta_0$) scales dramatically following the Fox-Flory power law: $\eta_0 = K \cdot M_w^{3.4}$. This creates significant flow resistance during injection moulding but enhances mechanical tensile elongation in solid state.
                        </p>
                        <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-slate-600">
                          <span className="font-bold text-[#2563EB]">Verified Source:</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            Lesson 5.2 · Viscoelastic Properties &amp; Melt Rheology
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* ─── MESSAGE STREAM ─── */}
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onLike={handleLike}
                    onCopy={handleCopy}
                  />
                ))}

                {/* Thinking Indicator */}
                {loading && <ThinkingIndicator />}

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 border border-red-200 bg-red-50/80 rounded-xl p-4 flex items-center justify-between gap-3 text-red-800 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                    {error.includes('limit') && (
                      <Link
                        href="/pricing"
                        className="flex-shrink-0 px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-mono text-[11px] font-bold hover:bg-blue-700 transition-colors"
                      >
                        Upgrade Unlimited
                      </Link>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ─── BOTTOM ENGINEERING INPUT CONSOLE ─── */}
            <footer className="flex-shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4 shadow-lg">
              <div className="max-w-4xl mx-auto space-y-2">
                
                {/* Mode Selector Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
                    <Terminal className="w-3 h-3 text-[#2563EB]" /> Mode:
                  </span>
                  {PROMPT_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleModeClick(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                        selectedMode === m.id
                          ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* The Input Box */}
                <div className="relative border border-slate-300 rounded-2xl bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-xs overflow-hidden">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about polymer engineering, tensile formulations, mold flow, or GATE XE-F..."
                    disabled={loading}
                    className="w-full px-4 py-3 text-sm text-slate-900 resize-none focus:outline-none placeholder:text-slate-400 bg-white"
                    rows={2}
                    style={{ minHeight: '58px', maxHeight: '140px' }}
                  />

                  {/* Input Footer Bar */}
                  <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>✦ Every answer cited from 218 lessons</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Enter ↵ to send</span>
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                          input.trim() && !loading
                            ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm hover:-translate-y-0.5'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Computing...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Query</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Trust Line */}
                <p className="text-[10px] text-slate-400 font-mono text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>PolymerHub AI v3 · Grounded in 19 B.Tech PPE Subjects · Digital Personal Data Protection Act (DPDP) Compliant</span>
                </p>
              </div>
            </footer>
          </div>
        ) : (
          /* ─── CAREER & FOCUS PLAN TAB ─── */
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border border-blue-200 bg-blue-50/80 p-6 rounded-2xl shadow-xs">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-[#2563EB] flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-900">Personalized AI Focus Blueprint</h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Synthesizes your lesson completion analytics, quiz performance, and career focus to map your weekly master plan.
                    </p>
                  </div>
                </div>
              </div>

              {focusLoading ? (
                <div className="border border-slate-200 p-12 text-center bg-white rounded-2xl shadow-xs animate-pulse">
                  <RefreshCw className="w-8 h-8 mx-auto text-[#2563EB] animate-spin mb-3" />
                  <p className="font-display font-bold text-slate-900">Analyzing study progress and running Gemini advisor planner…</p>
                </div>
              ) : !session ? (
                <div className="border border-slate-200 p-10 text-center bg-white rounded-2xl shadow-xs space-y-3">
                  <Lock className="w-8 h-8 mx-auto text-[#2563EB]" />
                  <p className="font-display text-lg font-bold text-slate-900">Sign in to generate your Personal Study Focus Plan</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Log in with your free account to track your progress across all 19 subjects and generate custom weekly study milestones.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] text-white font-mono text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <span>Sign In to Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : focusPlan ? (
                <div className="border border-slate-200 bg-white p-6 sm:p-8 rounded-2xl shadow-xs prose prose-sm max-w-none text-slate-900 leading-relaxed font-sans">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{focusPlan}</ReactMarkdown>
                </div>
              ) : (
                <div className="border border-slate-200 p-10 text-center bg-white rounded-2xl shadow-xs">
                  <p className="font-display font-bold text-slate-900 mb-3">No active study plan generated yet.</p>
                  <button
                    onClick={() => { setFocusPlan(null); loadFocusPlan() }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-mono text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Generate Focus Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── GUEST CONVERSION MODAL ─── */}
      {guestLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <Sparkles className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900">
                You&apos;ve experienced the Copilot!
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                You have used your 3 free guest inquiries. Create your free account in seconds to save your conversation history, unlock 15 daily queries, and track your syllabus progress.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Create Free Account / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setGuestLimitModal(false)}
                className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-mono transition-colors"
              >
                Continue Browsing Syllabus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
