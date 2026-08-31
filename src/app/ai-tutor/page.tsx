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
    category: 'Thermodynamics',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Glass Transition vs Melting',
    prompt: 'Explain the thermodynamic and molecular differences between Tg and Tm in semi-crystalline polymers like POM and Nylon 6,6.',
    sourceHint: 'Lesson 5.1 · Polymer Thermodynamics & Glass Transition'
  },
  {
    category: 'Injection Moulding',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Sink Marks & Cavity Pressure',
    prompt: 'What causes sink marks in thick-walled injection molded parts, and how do packing pressure and gate freeze-off time solve it?',
    sourceHint: 'Lesson 4.2 · Injection Moulding Process Parameters'
  },
  {
    category: 'Biopolymers',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'PLA vs PHA Biodegradation',
    prompt: 'Compare the biodegradation mechanisms and crystalline degradation rates of Polylactic Acid (PLA) vs Polyhydroxyalkanoate (PHA).',
    sourceHint: 'Lesson 7.4 · Sustainable Biopolymers & Degradation'
  },
  {
    category: 'Rheology',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    title: 'MFI to Zero-Shear Viscosity',
    prompt: 'How is Melt Flow Index (MFI/MFR) correlated with molecular weight distribution (MWD) and shear-thinning power-law fluid behavior?',
    sourceHint: 'Lesson 5.2 · Viscoelasticity & Shear Rheology'
  },
  {
    category: 'Tooling & Mould Design',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    title: 'Multi-Cavity Runner Balancing',
    prompt: 'Derive the hydrodynamic diameter formula for naturally balanced 8-cavity runner systems undergoing non-Newtonian shear heating.',
    sourceHint: 'Lesson 3.6 · Mould Tooling & Runner Systems'
  },
  {
    category: 'GATE XE-F Prep',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Carothers Equation & Gel Point',
    prompt: 'How do you calculate the critical extent of reaction (Pc) for trifunctional monomer polycondensation using the Carothers equation?',
    sourceHint: 'Lesson 2.1 · Step-Growth Polymerization Kinetics'
  },
]

// ─── Quick Prompt Action Modes ────────────────────────────────────────────────

const PROMPT_MODES = [
  { id: 'explain', label: 'Teach me', prefix: 'Teach me the core engineering principles of: ' },
  { id: 'solve', label: 'Calculate', prefix: 'Provide a step-by-step engineering calculation with formulas for: ' },
  { id: 'quiz', label: 'Test me', prefix: 'Generate a GATE XE-F standard numerical problem with step-by-step derivation on: ' },
  { id: 'formulate', label: 'Analyze material', prefix: 'Analyze the material properties, compounding formulation, and processing window for: ' },
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
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-xs shadow-lg overflow-hidden">
            {/* Header pill bar */}
            <div className="border-b border-slate-800 px-4 py-2.5 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  PolymerHub AI Copilot
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] text-slate-400 font-mono">Verified Syllabus Grounding</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Markdown Content */}
            <div className="p-4 sm:p-5">
              <div className="prose prose-sm prose-invert max-w-none text-slate-200 leading-relaxed font-sans prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-code:font-mono prose-code:text-amber-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>

              {/* Source Citations — The Trust Layer */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-slate-800 bg-slate-950/80 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 rounded-b-2xl">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <p className="text-[11px] text-slate-300 font-mono font-bold uppercase tracking-wider">
                      Verified Curriculum Sources:
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.sources.map((src, idx) => (
                      <Link
                        key={src.slug || idx}
                        href={`/lessons/${src.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-slate-850 text-slate-200 border border-slate-700 hover:border-amber-400 hover:text-amber-300 hover:shadow-xs transition-all group"
                      >
                        <BookOpen className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>{src.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-amber-300 transition-all" />
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
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors font-mono text-[11px]"
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
          <span className="text-xs text-slate-500 font-mono">Querying 216 lessons &amp; formulating verified answer…</span>
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
    guestQueriesLeft: 10
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
    <div className="flex h-[calc(100vh-68px)] bg-slate-950 overflow-hidden text-white">

      {/* ─── LEFT WORKSPACE SIDEBAR (Dark Navy Engineering Rail) ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PolymerAIMark className="w-7 h-7" />
            <div>
              <span className="font-display font-bold text-sm text-white leading-none">Polymer Copilot</span>
              <p className="text-[10px] font-mono text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                216 Lessons Indexed
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* New Chat CTA — Gold/Amber Pill */}
        <div className="p-3 border-b border-slate-800">
          <button
            onClick={() => {
              clearConversation()
              setSidebarOpen(false)
            }}
            className="w-full py-2.5 px-3.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Mode Selector Links */}
        <div className="p-3 border-b border-slate-800">
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
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                  selectedMode === m.id
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
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
              <MessageSquare className="w-5 h-5 text-slate-600 mx-auto mb-1" />
              <p className="text-[11px] text-slate-400 font-mono">No recent inquiries yet. Start a new session below.</p>
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
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-sans text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:text-amber-400" />
                  <span className="truncate flex-1">{c.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Engineering Tools Rail */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            Engineering Tools
          </p>
          <Link
            href="/calculators"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-[#38BDF8]" />
              Calculators
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </Link>
          <Link
            href="/comparator"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#FB923C]" />
              Polymer Comparator
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </Link>
          <Link
            href="/gate-mock"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
              GATE XE-F Mock
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </Link>
        </div>

        {/* Auth / Guest Status Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          {session ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white truncate">
                  {session.user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  {queryStatus.isPremium ? 'Unlimited Pro Access' : `${queriesLeft} queries left today`}
                </p>
              </div>
              <Link href="/profile" className="text-xs text-amber-400 font-bold hover:underline">
                Account
              </Link>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-400 font-mono">Guest Mode (10 Queries)</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">
                {queryStatus.guestQueriesLeft > 0
                  ? `${queryStatus.guestQueriesLeft} free queries remaining without sign-in.`
                  : 'Free guest quota used.'}
              </p>
              <Link
                href="/login"
                className="mt-2 block text-center py-1.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-bold font-mono transition-colors shadow-xs"
              >
                Sign In to Save History →
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONSOLE CONTAINER (Dark Navy Tech Console) ─── */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">

        {/* ─── TOP CONSOLE BAR ─── */}
        <header className="flex-shrink-0 h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-10 text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Layers className="w-4 h-4" />
            </button>
            
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Copilot Console
              </button>
              <button
                onClick={() => setActiveTab('focus')}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'focus'
                    ? 'bg-slate-800 text-amber-400 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Career Focus Plan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounded in 216 Lessons</span>
            </div>

            {messages.length > 0 && activeTab === 'chat' && (
              <button
                onClick={clearConversation}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
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
                    
                    {/* Compact Hero Header */}
                    <div className="text-center max-w-2xl mx-auto space-y-1.5">
                      <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                        Engineering Copilot
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                        Grounded in 216 lessons across 19 subjects.
                      </p>
                    </div>

                    {/* ─── CAPABILITY SUGGESTION CARDS (Dark Navy Glass · Technical Badges) ─── */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                          Recommended Engineering Inquiries
                        </p>
                        <span className="text-[11px] font-mono text-slate-500">Click any card to query</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {ENGINEERING_PROMPTS.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(item.prompt)}
                            disabled={loading}
                            className="text-left p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/80 hover:bg-slate-850 hover:shadow-lg transition-all group flex flex-col justify-between shadow-md cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                                  [{item.category}]
                                </span>
                                <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-[#F59E0B] group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-colors">
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              </div>
                              <h3 className="text-sm font-bold text-white font-display line-clamp-1 mb-1 group-hover:text-amber-400 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed font-normal">
                                {item.prompt}
                              </p>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                              <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="truncate">{item.sourceHint}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ─── "SHOW, DON'T TELL" STATIC PROOF DEMO ─── */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-md">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                            Sample Grounded Response Demonstration
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/30">
                          Live Architecture Proof
                        </span>
                      </div>
                      <div className="space-y-2 font-sans text-xs text-slate-300 leading-relaxed">
                        <p className="font-bold text-white">
                          Q: How does molecular weight affect polymer melt viscosity?
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                          Above the critical entanglement molecular weight ($M_c$), zero-shear viscosity ($\eta_0$) scales dramatically following the Fox-Flory power law: $\eta_0 = K \cdot M_w^{3.4}$. This creates significant flow resistance during injection moulding but enhances mechanical tensile elongation in solid state.
                        </p>
                        <div className="pt-2 flex items-center gap-2 font-mono text-xs text-slate-400">
                          <span className="font-bold text-amber-400">Verified Source:</span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                            Lesson 5.2 &middot; Viscoelastic Properties &amp; Melt Rheology
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
                  <div className="mb-4 border border-red-500/40 bg-red-950/50 rounded-xl p-4 flex items-center justify-between gap-3 text-red-200 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
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

            {/* ─── BOTTOM ENGINEERING INPUT CONSOLE (DARK NAVY CONSOLE) ─── */}
            <footer className="flex-shrink-0 border-t border-slate-800 bg-slate-900 p-4 sm:p-5 shadow-2xl text-white">
              <div className="max-w-4xl mx-auto space-y-3">
                
                {/* Mode Selector Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-xs font-mono text-slate-400 font-bold flex items-center gap-1 mr-1 flex-shrink-0">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" /> Mode:
                  </span>
                  {PROMPT_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleModeClick(m)}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 border cursor-pointer ${
                        selectedMode === m.id
                          ? 'bg-[#F59E0B] border-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* The Dark Engineering Console Input Box */}
                <div className="relative border border-slate-700 rounded-2xl bg-slate-950 text-white focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all shadow-xl overflow-hidden">
                  <div className="flex items-start px-4 pt-3.5">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="> Ask about tensile strength, mold flow, or GATE XE-F..."
                      disabled={loading}
                      className="w-full text-sm text-white font-sans resize-none focus:outline-none placeholder:text-slate-500 bg-transparent"
                      rows={2}
                      style={{ minHeight: '56px', maxHeight: '140px' }}
                    />
                  </div>

                  {/* Input Footer Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-900/90">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-medium">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Grounded in 216 lessons
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">Press Enter ↵</span>
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className={`px-5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          input.trim() && !loading
                            ? 'bg-[#F4C51B] hover:bg-amber-400 text-slate-950 shadow-md hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
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

                {/* AI Exam & Derivation Disclaimer */}
                <div className="flex items-center justify-center gap-2 p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-200 text-xs font-sans text-center">
                  <span className="font-bold text-amber-400">⚠️</span>
                  <span>AI-generated technical guidance &middot; Always verify critical formulas, numerical constants &amp; derivations against standard textbooks or your professor before exams.</span>
                </div>

                {/* Bottom Trust Line */}
                <p className="text-[11px] text-slate-500 font-mono text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>PolymerHub AI &middot; Grounded in 19 PPE Disciplines &middot; Strictly citing standard reference literature &amp; ASTM/ISO test methods</span>
                </p>
              </div>
            </footer>
          </div>
        ) : (
          /* ─── CAREER & FOCUS PLAN TAB (Dark Navy Theme) ─── */
          <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 text-white">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border border-slate-800 bg-slate-900 p-6 rounded-2xl shadow-md">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold font-display text-white">Personalized AI Focus Blueprint</h2>
                    <p className="text-xs text-slate-300 mt-0.5 font-sans">
                      Synthesizes your lesson completion analytics, quiz performance, and career focus to map your weekly master plan.
                    </p>
                  </div>
                </div>
              </div>

              {focusLoading ? (
                <div className="border border-slate-800 p-12 text-center bg-slate-900 rounded-2xl shadow-md animate-pulse">
                  <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin mb-3" />
                  <p className="font-display font-bold text-white">Analyzing study progress and running Gemini advisor planner…</p>
                </div>
              ) : !session ? (
                <div className="border border-slate-800 p-10 text-center bg-slate-900 rounded-2xl shadow-md space-y-3">
                  <Lock className="w-8 h-8 mx-auto text-amber-400" />
                  <p className="font-display text-lg font-bold text-white">Sign in to generate your Personal Study Focus Plan</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                    Log in with your free account to track your progress across all 19 subjects and generate custom weekly study milestones.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    <span>Sign In to Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : focusPlan ? (
                <div className="border border-slate-800 bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-md prose prose-sm prose-invert max-w-none text-slate-200 leading-relaxed font-sans">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{focusPlan}</ReactMarkdown>
                </div>
              ) : (
                <div className="border border-slate-800 p-10 text-center bg-slate-900 rounded-2xl shadow-md">
                  <p className="font-display font-bold text-white mb-3">No active study plan generated yet.</p>
                  <button
                    onClick={() => { setFocusPlan(null); loadFocusPlan() }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                You&apos;ve experienced the Copilot!
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                You have used your 10 free guest inquiries. Create your free account in seconds to save your conversation history, unlock 15 daily queries, and track your syllabus progress.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="w-full py-3 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Create Free Account / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setGuestLimitModal(false)}
                className="w-full py-2.5 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors cursor-pointer"
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
