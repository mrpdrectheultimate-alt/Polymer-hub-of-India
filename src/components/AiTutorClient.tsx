'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Brain, Send, Loader2, Sparkles, AlertCircle, ArrowRight, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AiTutorClientProps {
  initialQueriesUsed: number
  isPremium: boolean
  userFullName: string
}

const starterPrompts = [
  'What is the difference between CV and EV vulcanization systems?',
  'Explain how Melt Flow Index (MFI) relates to molecular weight.',
  'What are the typical gate design rules in injection moulding?',
  'Give me a real-world B.Tech polymer engineering exam question.',
]

export default function AiTutorClient({ initialQueriesUsed, isPremium, userFullName }: AiTutorClientProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Namaste ${userFullName.split(' ')[0]}! I am your PolymerHub AI Study Buddy. I am trained on standard polymer chemistry, testing, processing, mould design, and rubber technology. Ask me anything about your B.Tech PPE syllabus!`,
    },
  ])
  const [input, setInput] = useState('')
  const [queriesUsed, setQueriesUsed] = useState(initialQueriesUsed)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const maxQueries = 5

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return

    // If free and query limit exceeded, block client side
    if (!isPremium && queriesUsed >= maxQueries) {
      setError('You have reached your limit of 5 free queries for today. Upgrade to Premium for unlimited tutor queries!')
      return
    }

    setError(null)
    const userMessage = text.trim()
    setInput('')
    
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to the tutor')
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      
      // Update local query counter
      if (data.queriesUsed !== undefined) {
        setQueriesUsed(data.queriesUsed)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left panel: Chat Interface (8/12 width) */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-lg shadow-slate-100/50 flex flex-col h-[600px] md:h-[650px]">
        {/* Chat Header */}
        <div className="bg-[#0F4C81] text-white p-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-[#F97316]" />
            </div>
            <div>
              <h2 className="font-bold text-sm">PolymerHub AI Tutor</h2>
              <p className="text-[9px] text-blue-200">Trained on standard CIPET & B.Tech notes</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isPremium ? (
              <span className="bg-emerald-500/20 text-emerald-200 font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 text-[10px]">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Unlimited Active
              </span>
            ) : (
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1 text-[10px] font-semibold">
                {queriesUsed} / {maxQueries} Queries Used
              </span>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-100 shadow-sm mt-1">
                  AI
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-[#0F4C81] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-slate prose-xs max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-headings:text-sm prose-p:text-slate-600 prose-li:text-slate-600 prose-code:text-[#0F4C81] prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-line font-medium">{m.content}</div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-300 shadow-sm mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-100 shadow-sm">
                AI
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#0F4C81] animate-spin" />
                <span className="text-slate-400 text-xs font-semibold">Tutor is searching database and composing response...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error:</span> {error}
                {!isPremium && queriesUsed >= maxQueries && (
                  <Link
                    href="/pricing"
                    className="block font-bold text-[#F97316] hover:underline mt-1.5"
                  >
                    Unlock Unlimited Queries Now →
                  </Link>
                )}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
            className="flex gap-2.5 items-end"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(input)
                }
              }}
              placeholder="Ask a polymer engineering question (e.g. How is MFI measured?)..."
              rows={2}
              className="flex-1 min-h-[50px] max-h-[120px] border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81] rounded-2xl text-xs py-2.5 px-4 resize-none font-medium"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#0F4C81] hover:bg-[#0A3560] text-white p-3 rounded-2xl h-11 w-11 shrink-0 flex items-center justify-center transition-colors shadow-sm"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right panel: Sidebar (4/12 width) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* starter prompt cards */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F97316]" /> Starter Questions
          </h3>
          <div className="flex flex-col gap-2">
            {starterPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 text-xs text-slate-600 hover:text-[#0F4C81] p-3 rounded-2xl transition-all font-semibold leading-snug"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Free Limits Banner */}
        {!isPremium && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="text-amber-800 font-extrabold text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F97316]" />
              Need Unlimited Queries?
            </div>
            <p className="text-[11px] text-amber-700/80 leading-relaxed">
              Upgrade to Premium for ₹149/month and remove all daily limits. Get unlimited answers grounded in B.Tech PPE notes.
            </p>
            <Link
              href="/pricing"
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-orange-950/10"
            >
              Get Unlimited AI Tutor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
        
      </div>
    </div>
  )
}
