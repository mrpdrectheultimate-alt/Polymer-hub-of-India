'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Loader2,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  AlertCircle,
  Plus,
  MessageSquare,
  Calculator,
  Compass,
  Sliders,
  ChevronRight,
  Layers,
  RefreshCw,
  ArrowUp,
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

// ─── Engineering Suggestion Cards ──────────────────────────────────────────────

const ENGINEERING_PROMPTS = [
  {
    category: 'Thermodynamics',
    title: 'Glass Transition vs Melting',
    prompt: 'Explain the thermodynamic and molecular differences between Tg and Tm in semi-crystalline polymers like POM and Nylon 6,6.',
    sourceHint: 'Lesson 5.1 · Polymer Thermodynamics'
  },
  {
    category: 'Injection Moulding',
    title: 'Sink Marks & Cavity Pressure',
    prompt: 'What causes sink marks in thick-walled injection molded parts, and how do packing pressure and gate freeze-off time solve it?',
    sourceHint: 'Lesson 4.2 · Injection Moulding Process'
  },
  {
    category: 'Rheology',
    title: 'MFI to Zero-Shear Viscosity',
    prompt: 'How is Melt Flow Index (MFI/MFR) correlated with molecular weight distribution (MWD) and shear-thinning power-law fluid behavior?',
    sourceHint: 'Lesson 5.2 · Viscoelasticity & Shear Rheology'
  },
  {
    category: 'GATE XE-F Prep',
    title: 'Carothers Equation & Gel Point',
    prompt: 'How do you calculate the critical extent of reaction (Pc) for trifunctional monomer polycondensation using the Carothers equation?',
    sourceHint: 'Lesson 2.1 · Step-Growth Kinetics'
  },
]

// ─── Prompt Action Modes (Inside Input Box) ───────────────────────────────────

const PROMPT_MODES = [
  { id: 'explain', label: 'Teach', prefix: 'Teach me the core engineering principles of: ' },
  { id: 'solve', label: 'Calculate', prefix: 'Provide a step-by-step engineering calculation with formulas for: ' },
  { id: 'quiz', label: 'Test', prefix: 'Generate a GATE XE-F standard numerical problem with step-by-step derivation on: ' },
  { id: 'formulate', label: 'Analyze', prefix: 'Analyze the material properties, compounding formulation, and processing window for: ' },
]

// ─── Minimal AI Mark ──────────────────────────────────────────────────────────

function PolymerAIMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-[#2563EB] flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
      <Sparkles className="w-4 h-4 text-white" />
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
      <div className="flex justify-end mb-6 animate-in slide-in-from-bottom-1 duration-200">
        <div className="max-w-[85%] sm:max-w-[75%]">
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="w-7 h-7 rounded-full bg-[#2a2a2a] border border-[#383838] flex items-center justify-center flex-shrink-0 text-slate-300 font-mono text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#2a2a2a] text-[#ececec] border border-[#383838] shadow-sm">
              <p className="text-sm leading-relaxed font-sans whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
          <div className="flex justify-end mt-1 pr-10">
            <span className="text-[10px] text-[#737373] font-mono">
              {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-6 animate-in slide-in-from-bottom-1 duration-200">
      <div className="max-w-[95%] sm:max-w-[88%] w-full">
        <div className="flex items-start gap-3">
          <PolymerAIMark className="w-7 h-7 mt-0.5" />
          <div className="flex-1 bg-[#171717] border border-[#282828] rounded-2xl shadow-sm overflow-hidden">
            {/* Header micro-bar */}
            <div className="border-b border-[#262626] px-4 py-2 bg-[#141414] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-[#ececec]">
                  Polymer Copilot
                </span>
                <span className="w-1 h-1 rounded-full bg-[#404040]" />
                <span className="text-[10px] text-[#8a8a8a] font-mono">Verified Grounding</span>
              </div>
              <span className="text-[10px] text-[#737373] font-mono">
                {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Markdown Content */}
            <div className="p-4 sm:p-5">
              <div className="prose prose-sm prose-invert max-w-none text-[#d4d4d4] leading-relaxed font-sans prose-headings:font-display prose-headings:font-bold prose-headings:text-[#ececec] prose-code:font-mono prose-code:text-blue-300 prose-code:bg-[#222222] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>

              {/* Source Citations */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-[#262626] flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#8a8a8a] font-mono mr-1">Sources:</span>
                  {message.sources.map((src, idx) => (
                    <Link
                      key={src.slug || idx}
                      href={`/lessons/${src.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-[#222222] text-[#a3a3a3] border border-[#333333] hover:border-[#555555] hover:text-white transition-all"
                    >
                      <BookOpen className="w-3 h-3 text-[#2563EB]" />
                      <span>{src.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action micro-bar */}
        <div className="flex items-center gap-3 mt-2 pl-10 text-xs text-[#8a8a8a]">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 hover:text-white transition-colors font-mono text-[11px]"
            title="Copy response"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <span>·</span>
          <button
            onClick={() => onLike(message.id, true)}
            className={`inline-flex items-center gap-1 transition-colors ${message.liked === true ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}
            title="Helpful"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">Helpful</span>
          </button>
          <button
            onClick={() => onLike(message.id, false)}
            className={`inline-flex items-center gap-1 transition-colors ${message.liked === false ? 'text-rose-400 font-bold' : 'hover:text-rose-400'}`}
            title="Report issue"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Thinking Indicator ────────────────────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-6 animate-in fade-in duration-200">
      <PolymerAIMark className="w-7 h-7" />
      <div className="bg-[#171717] border border-[#282828] rounded-2xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-[#8a8a8a] font-mono">Querying 216 curriculum lessons…</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main AI Copilot Page ─────────────────────────────────────────────────────

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
    guestQueriesLeft: 10
  })
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [guestLimitModal, setGuestLimitModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'focus'>('chat')
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

  // Load Saved Chat History
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ph_ai_recent_chats')
      if (raw) setSavedChats(JSON.parse(raw))
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
          title: firstPrompt.slice(0, 44) + (firstPrompt.length > 44 ? '…' : ''),
          timestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          messageCount: msgCount
        },
        ...existing.filter(c => c.title !== firstPrompt.slice(0, 44))
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
          const isPremium = profile.subscription_status === 'premium' || profile.subscription_status === 'active'
          setQueryStatus({
            used: profile.ai_queries_today ?? 0,
            limit: isPremium ? 9999 : 15,
            isPremium,
            isGuest: false,
            guestQueriesLeft: 0,
          })
        }
      } else {
        setQueryStatus(prev => ({ ...prev, isGuest: true, guestQueriesLeft: 10 }))
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

  // Send message
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    if (messages.length === 0) {
      persistChatHistory(text.trim(), 1)
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
          throw new Error('You have used your 10 free guest queries. Sign in to continue asking questions.')
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
    setInput(mode.prefix)
    inputRef.current?.focus()
  }

  const clearConversation = () => {
    setMessages([])
    setError(null)
    setInput('')
    setSelectedMode(null)
  }

  const queriesLeft = Math.max(0, queryStatus.limit - queryStatus.used)

  return (
    <div className="flex h-[calc(100vh-68px)] bg-[#0d0d0d] overflow-hidden text-[#ececec]">

      {/* ─── LEFT WORKSPACE SIDEBAR (Thin, Quiet, Dark) ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#141414] border-r border-[#242424] text-[#ececec] flex flex-col transition-transform duration-200 lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-3.5 border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PolymerAIMark className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-[#ececec]">Polymer Copilot</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-[#8a8a8a] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* New Chat Button — Dark Quiet Pill */}
        <div className="p-3 border-b border-[#242424]">
          <button
            onClick={() => {
              clearConversation()
              setSidebarOpen(false)
            }}
            className="w-full py-2 px-3 bg-[#242424] hover:bg-[#2e2e2e] text-[#ececec] border border-[#333333] rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#8a8a8a]" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Engineering Modes */}
        <div className="p-3 border-b border-[#242424]">
          <p className="text-[10px] font-mono text-[#737373] uppercase tracking-wider px-2 mb-1.5">
            Engineering Modes
          </p>
          <div className="space-y-0.5">
            {PROMPT_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  handleModeClick(m)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                  selectedMode === m.id
                    ? 'bg-[#242424] text-white font-semibold'
                    : 'text-[#8a8a8a] hover:bg-[#1f1f1f] hover:text-[#ececec]'
                }`}
              >
                <span>{m.label}</span>
                <ChevronRight className="w-3 h-3 text-[#555555]" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-[10px] font-mono text-[#737373] uppercase tracking-wider px-2 mb-1.5">
            Recent Inquiries
          </p>
          {savedChats.length === 0 ? (
            <div className="px-2 py-4 text-center">
              <MessageSquare className="w-4 h-4 text-[#555555] mx-auto mb-1" />
              <p className="text-[11px] text-[#737373] font-mono">No recent inquiries.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {savedChats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setInput(c.title)
                    setSidebarOpen(false)
                    inputRef.current?.focus()
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-[#8a8a8a] hover:bg-[#1f1f1f] hover:text-[#ececec] transition-colors flex items-center gap-2 truncate cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3 text-[#555555] flex-shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Engineering Tools */}
        <div className="p-3 border-t border-[#242424] space-y-0.5">
          <p className="text-[10px] font-mono text-[#737373] uppercase tracking-wider px-2 mb-1">
            Engineering Tools
          </p>
          <Link
            href="/calculators"
            className="flex items-center justify-between px-2 py-1 rounded-lg text-xs text-[#8a8a8a] hover:bg-[#1f1f1f] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-[#38BDF8]" />
              Calculators
            </span>
            <ArrowRight className="w-3 h-3 text-[#555555]" />
          </Link>
          <Link
            href="/comparator"
            className="flex items-center justify-between px-2 py-1 rounded-lg text-xs text-[#8a8a8a] hover:bg-[#1f1f1f] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#FB923C]" />
              Polymer Comparator
            </span>
            <ArrowRight className="w-3 h-3 text-[#555555]" />
          </Link>
          <Link
            href="/gate-mock"
            className="flex items-center justify-between px-2 py-1 rounded-lg text-xs text-[#8a8a8a] hover:bg-[#1f1f1f] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
              GATE XE-F Mock
            </span>
            <ArrowRight className="w-3 h-3 text-[#555555]" />
          </Link>
        </div>

        {/* Auth / Guest Footer */}
        <div className="p-3 border-t border-[#242424] bg-[#111111]">
          {session ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white truncate max-w-[140px]">
                    {session.user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] font-mono text-[#8a8a8a]">
                    {queryStatus.isPremium ? 'Unlimited Pro Access' : `${queriesLeft} queries left`}
                  </p>
                </div>
                <Link href="/profile" className="text-xs text-blue-400 font-medium hover:underline">
                  Account
                </Link>
              </div>
              {!queryStatus.isPremium && (
                <Link
                  href="/pricing"
                  className="block text-center py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold font-mono transition-colors shadow-xs"
                >
                  Upgrade Unlimited (₹149/mo) →
                </Link>
              )}
            </div>
          ) : (
            <div className="p-2 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl text-center">
              <p className="text-[11px] text-[#8a8a8a] font-mono mb-1.5">
                Guest Mode · {queryStatus.guestQueriesLeft} queries left
              </p>
              <Link
                href="/login"
                className="block text-center py-1 bg-[#2a2a2a] hover:bg-[#333333] text-[#ececec] border border-[#3a3a3a] rounded-lg text-[11px] font-mono font-medium transition-colors"
              >
                Sign In to Save History →
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONSOLE CONTAINER (Deep Black Minimalist) ─── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0d]">

        {/* ─── TOP CONSOLE BAR ─── */}
        <header className="flex-shrink-0 h-14 bg-[#0d0d0d] border-b border-[#242424] px-4 sm:px-6 flex items-center justify-between z-10 text-[#ececec]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-[#333333] text-[#8a8a8a] hover:text-white"
            >
              <Layers className="w-4 h-4" />
            </button>
            
            {/* View Switcher */}
            <div className="flex items-center bg-[#171717] rounded-lg p-0.5 border border-[#262626]">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-[#262626] text-white'
                    : 'text-[#8a8a8a] hover:text-white'
                }`}
              >
                Copilot Console
              </button>
              <button
                onClick={() => setActiveTab('focus')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === 'focus'
                    ? 'bg-[#262626] text-amber-400'
                    : 'text-[#8a8a8a] hover:text-white'
                }`}
              >
                Career Focus Plan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Single Quiet Grounded Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171717] border border-[#2a2a2a] text-[11px] font-mono text-[#8a8a8a]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounded in 216 lessons</span>
            </div>

            {messages.length > 0 && activeTab === 'chat' && (
              <button
                onClick={clearConversation}
                className="p-1.5 rounded-lg border border-[#2e2e2e] text-[#8a8a8a] hover:text-white hover:border-[#444444] transition-colors cursor-pointer"
                title="Clear conversation"
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
              <div className="max-w-3xl mx-auto">

                {/* ─── MINIMALIST HERO (Centerpiece Greeting) ─── */}
                {messages.length === 0 && (
                  <div className="pt-8 pb-4 space-y-8 animate-in fade-in duration-300">
                    
                    <div className="text-center space-y-2">
                      <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#ececec] tracking-tight">
                        What would you like to engineer today?
                      </h1>
                      <p className="text-xs text-[#8a8a8a] font-sans">
                        AI engineering guidance grounded across 216 curriculum lessons.
                      </p>
                    </div>

                    {/* Subtle Prompt Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {ENGINEERING_PROMPTS.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(item.prompt)}
                          disabled={loading}
                          className="text-left p-3.5 rounded-2xl bg-[#171717] border border-[#262626] hover:border-[#383838] hover:bg-[#1a1a1a] transition-all group flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-[#8a8a8a] block mb-1">
                              [{item.category}]
                            </span>
                            <h3 className="text-xs font-semibold text-[#ececec] group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-[#8a8a8a] font-sans line-clamp-2 mt-1 leading-normal">
                              {item.prompt}
                            </p>
                          </div>
                        </button>
                      ))}
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
                  <div className="mb-4 border border-rose-900/60 bg-[#1e1113] rounded-xl p-3.5 flex items-center justify-between gap-3 text-rose-200 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                    {error.includes('limit') && (
                      <Link
                        href="/pricing"
                        className="flex-shrink-0 px-3 py-1 bg-[#2563EB] text-white rounded-lg font-mono text-[11px] font-bold hover:bg-blue-700 transition-colors"
                      >
                        Upgrade
                      </Link>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ─── THE CENTERPIECE INPUT BOX ─── */}
            <footer className="flex-shrink-0 p-4 sm:p-5 text-[#ececec] bg-transparent">
              <div className="max-w-3xl mx-auto">
                
                {/* The Ultra-Dark Rounded 3XL Input Box */}
                <div className="border border-[#333333] focus-within:border-[#555555] rounded-3xl bg-[#212121] text-[#ececec] shadow-2xl transition-all p-3.5 sm:p-4 space-y-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about tensile strength, mold flow, or GATE XE-F..."
                    disabled={loading}
                    className="w-full text-sm sm:text-base text-[#ececec] font-sans resize-none focus:outline-none placeholder:text-[#737373] bg-transparent leading-relaxed"
                    rows={2}
                    style={{ minHeight: '48px', maxHeight: '140px' }}
                  />

                  {/* Inside Input Box Controls */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Inline Mode Toggles */}
                    <div className="flex items-center gap-2">
                      {PROMPT_MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleModeClick(m)}
                          className={`text-[11px] font-mono transition-colors cursor-pointer ${
                            selectedMode === m.id
                              ? 'text-white font-semibold underline underline-offset-4'
                              : 'text-[#8a8a8a] hover:text-white'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Circular Blue Send Button */}
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || loading}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                        input.trim() && !loading
                          ? 'bg-[#2563EB] hover:bg-blue-600 text-white shadow-md'
                          : 'bg-[#333333] text-[#737373] cursor-not-allowed'
                      }`}
                      title="Send message"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <ArrowUp className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Single Quiet Disclaimer Line */}
                <p className="text-[11px] font-mono text-[#666666] text-center mt-2.5">
                  Polymer Copilot can make mistakes. Verify critical engineering formulas against standard textbooks.
                </p>
              </div>
            </footer>
          </div>
        ) : (
          /* ─── CAREER FOCUS PLAN TAB ─── */
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display text-white">
                  Personalized 7-Day Curriculum Schedule
                </h2>
                <p className="text-xs text-[#8a8a8a] font-sans mt-1">
                  Synthesizes your lesson quiz performance into an optimized study timetable.
                </p>
              </div>

              {!session ? (
                <div className="border border-[#282828] bg-[#171717] p-8 text-center rounded-2xl">
                  <p className="font-display font-bold text-white mb-2">Sign in to generate your Focus Plan</p>
                  <p className="text-xs text-[#8a8a8a] mb-5">
                    We analyze your quiz attempts across 19 subjects to highlight your weakest areas.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : focusLoading ? (
                <div className="border border-[#282828] bg-[#171717] p-10 text-center rounded-2xl flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
                  <p className="text-xs font-mono text-[#8a8a8a]">Synthesizing curriculum progress…</p>
                </div>
              ) : focusPlan ? (
                <div className="border border-[#282828] bg-[#171717] p-6 sm:p-8 rounded-2xl prose prose-sm prose-invert max-w-none text-[#d4d4d4] leading-relaxed font-sans">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{focusPlan}</ReactMarkdown>
                </div>
              ) : (
                <div className="border border-[#282828] p-8 text-center bg-[#171717] rounded-2xl">
                  <p className="font-display font-bold text-white mb-3">No active study plan generated yet.</p>
                  <button
                    onClick={() => { setFocusPlan(null); loadFocusPlan() }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-white">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2563EB]">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                You&apos;ve experienced the Copilot!
              </h3>
              <p className="text-xs text-[#a3a3a3] mt-1 leading-relaxed font-sans">
                You have used your 10 free guest inquiries. Create your free account in seconds to save your conversation history, unlock 15 daily queries, and track your syllabus progress.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Create Free Account / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setGuestLimitModal(false)}
                className="w-full py-2 text-[#737373] hover:text-white text-xs font-mono transition-colors cursor-pointer"
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
