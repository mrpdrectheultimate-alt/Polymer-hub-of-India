'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { ArrowLeft, Settings, Sparkles, Bookmark, ChevronLeft, ChevronRight, Menu, StickyNote } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

import { ReaderControls } from '@/components/ReaderControls'
import { GlossaryPopover } from '@/components/GlossaryPopover'
import { BOOK_IMAGES } from '@/lib/book_images'
import { getBookBySlug } from '@/lib/library_data'

interface Book {
  id: string
  slug: string
  title: string
  authors: string
  cover_image_url?: string
  chapter_images?: Record<string, { url: string; caption: string }[]>
  category: 'original_guide' | 'open_access' | 'commercial'
  file_url?: string
  purchase_url?: string
  toc: { id: string; title: string }[]
  chapters: Record<string, string>
}

interface Highlight {
  id: string
  chapter_id: string
  selected_text: string
  color: string
  note?: string | null
}

interface Bookmark {
  id: string
  chapter_id: string
  scroll_pos: number
}

interface Flashcard {
  id: string
  book_id: string
  chapter_id: string
  front: string
  back: string
}

export default function ReadingRoomPage() {
  const { slug } = useParams()
  const searchParams = useSearchParams()
  
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentChapterId, setCurrentChapterId] = useState<string>('')
  const [chapterContent, setChapterContent] = useState<string>('')
  
  // Customization States
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light')
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base')
  const [readerSettings, setReaderSettings] = useState({
    margins: 'normal',
    lineHeight: 'normal',
    font: 'serif'
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  // Interaction States
  const [selectedText, setSelectedText] = useState('')
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  
  // Bookmarks & Highlights States
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [session, setSession] = useState<Session | null>(null)
  
  // Sticky Note and Flashcard states
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [exportedCardIds, setExportedCardIds] = useState<Set<string>>(new Set())

  // Estimated read time left (minutes)
  const [readTimeLeft, setReadTimeLeft] = useState<number | null>(null)

  const textContainerRef = useRef<HTMLDivElement>(null)

  // 1. Get Auth Session
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  // 2. Load Book Profile
  useEffect(() => {
    async function loadBook() {
      const fallbackBook = getBookBySlug(slug as string)

      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('library_books')
          .select('*')
          .eq('slug', slug)
          .single()

        if (data) {
          const b = data as Book
          // Merge chapters from fallback library so all chapters have content
          if (fallbackBook) {
            b.chapters = {
              ...(fallbackBook.chapters || {}),
              ...(b.chapters || {})
            }
            if (!b.file_url && fallbackBook.file_url) {
              b.file_url = fallbackBook.file_url
            }
          }
          setBook(b)
          
          const chParam = searchParams.get('ch')
          if (chParam && b.toc && b.toc.some(t => t.id === chParam)) {
            setCurrentChapterId(chParam)
          } else if (b.toc && b.toc.length > 0) {
            setCurrentChapterId(b.toc[0].id)
          }
        } else if (fallbackBook) {
          setBook(fallbackBook as unknown as Book)
          const chParam = searchParams.get('ch')
          if (chParam && fallbackBook.toc.some(t => t.id === chParam)) {
            setCurrentChapterId(chParam)
          } else if (fallbackBook.toc && fallbackBook.toc.length > 0) {
            setCurrentChapterId(fallbackBook.toc[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load book from supabase, using fallback:', err)
        if (fallbackBook) {
          setBook(fallbackBook as unknown as Book)
          const chParam = searchParams.get('ch')
          if (chParam && fallbackBook.toc.some(t => t.id === chParam)) {
            setCurrentChapterId(chParam)
          } else if (fallbackBook.toc && fallbackBook.toc.length > 0) {
            setCurrentChapterId(fallbackBook.toc[0].id)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    if (slug) loadBook()
  }, [slug, searchParams])

  // 3. Load Chapter Content & Sync URL Search Param
  useEffect(() => {
    if (book && currentChapterId) {
      const fallbackBook = getBookBySlug(slug as string)
      let content = book.chapters?.[currentChapterId] || fallbackBook?.chapters?.[currentChapterId] || ''
      
      // If still empty, synthesize rich curriculum notes for this chapter
      if (!content) {
        const matchingToc = book.toc.find(t => t.id === currentChapterId)
        const chapterTitle = matchingToc ? matchingToc.title : `Chapter ${currentChapterId}`
        content = `# ${chapterTitle}\n*From "${book.title}" by ${book.authors}*\n\n## 📖 Overview\nThis chapter covers core principles in **${chapterTitle}**. Study the parameters, constitutive equations, and practical industrial processing considerations.\n\n${book.file_url ? `\n> [!TIP]\n> **[Click here to download the unabridged Open Access PDF Document](${book.file_url})**\n` : ''}`
      }

      setChapterContent(content)
      
      // Calculate initial estimated read time (avg 200 words per minute)
      const wordCount = content.split(/\s+/).length
      setReadTimeLeft(Math.max(1, Math.round(wordCount / 200)))
      
      // Update URL search parameters without page reload
      const url = new URL(window.location.href)
      url.searchParams.set('ch', currentChapterId)
      window.history.replaceState({}, '', url.toString())

      // Reset scroll position on chapter change
      if (textContainerRef.current) {
        textContainerRef.current.scrollTop = 0
      }
    }
  }, [book, currentChapterId, slug])

  // 4. Fetch User Bookmarks, Highlights & Flashcards
  useEffect(() => {
    async function loadUserPersonalization() {
      if (!session || !book) return
      try {
        const supabase = createClient()
        
        // Bookmarks
        const { data: bData } = await supabase
          .from('library_bookmarks')
          .select('id, chapter_id, scroll_pos')
          .eq('book_id', book.id)
        if (bData) setBookmarks(bData)

        // Highlights (with note column)
        const { data: hData } = await supabase
          .from('library_highlights')
          .select('id, chapter_id, selected_text, color, note')
          .eq('book_id', book.id)
        if (hData) setHighlights(hData as Highlight[])

        // Flashcards (to map exported cards matching this book)
        const res = await fetch('/api/library/flashcards')
        if (res.ok) {
          const fData = await res.json() as Flashcard[]
          const exported = new Set<string>()
          fData.forEach((f: Flashcard) => {
            // Find highlights with matching selected_text
            const matchingHighlight = (hData || []).find((h: Highlight) => h.selected_text === f.front)
            if (matchingHighlight) {
              exported.add(matchingHighlight.id)
            }
          })
          setExportedCardIds(exported)
        }
      } catch (err) {
        console.error('Failed to load user bookmarks/highlights/flashcards:', err)
      }
    }
    loadUserPersonalization()
  }, [session, book])

  // 5. Periodic reading progress tracker
  useEffect(() => {
    if (!session || !book || !currentChapterId || loading) return

    const interval = setInterval(async () => {
      const container = textContainerRef.current
      if (!container) return
      
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight
      const pct = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 100

      // Update estimated time left based on progress
      if (chapterContent) {
        const wordCount = chapterContent.split(/\s+/).length
        const totalMin = Math.max(1, wordCount / 200)
        const minLeft = Math.max(0, Math.round(totalMin * (1 - pct / 100)))
        setReadTimeLeft(minLeft)
      }

      try {
        await fetch('/api/library/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book_id: book.id,
            chapter_id: currentChapterId,
            progress_percent: pct,
            seconds_spent: 5
          })
        })
      } catch (err) {
        console.error('Failed to sync reading progress:', err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [session, book, currentChapterId, loading, chapterContent])

  // 6. Handle Text Selection
  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection) {
      const text = selection.toString().trim()
      if (text.length > 1 && text.length < 500) {
        setSelectedText(text)
      }
    }
  }

  // 7. Trigger AI Explanation
  const explainSelection = async () => {
    if (!selectedText) return
    setAiLoading(true)
    setShowAiPanel(true)
    setAiExplanation('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please explain the following polymer engineering term or section in detail, detailing any relevant reactions or calculations: "${selectedText}"`
        })
      })
      const data = await res.json()
      if (data.error) {
        setAiExplanation(`AI Tutor: ${data.error}`)
      } else {
        setAiExplanation(data.answer)
      }
    } catch {
      setAiExplanation('Failed to generate AI explanation. Please check your network connection.')
    } finally {
      setAiLoading(false)
    }
  }

  // 8. Save Highlight to Database
  const saveHighlight = async (color = 'yellow') => {
    if (!session || !book || !selectedText) return
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('library_highlights')
        .insert({
          user_id: session.user.id,
          book_id: book.id,
          chapter_id: currentChapterId,
          selected_text: selectedText,
          color,
          note: null
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        setHighlights(prev => [...prev, data as Highlight])
        // Clear selection UI
        setSelectedText('')
        window.getSelection()?.removeAllRanges()
      }
    } catch (err) {
      console.error('Failed to save highlight:', err)
    }
  }

  // 9. Save Annotation Note
  const saveHighlightNote = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('library_highlights')
        .update({ note: noteText })
        .eq('id', id)

      if (error) throw error
      setHighlights(prev => prev.map(h => h.id === id ? { ...h, note: noteText } : h))
      setActiveHighlightId(null)
      setNoteText('')
    } catch (err) {
      console.error('Failed to save highlight note:', err)
    }
  }

  // 10. Export Highlight to Flashcard
  const exportToFlashcard = async (h: Highlight) => {
    if (!book) return
    try {
      const res = await fetch('/api/library/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: book.id,
          chapter_id: currentChapterId,
          front: h.selected_text,
          back: h.note || 'Polymer Engineering term definition'
        })
      })
      if (res.ok) {
        setExportedCardIds(prev => {
          const n = new Set(prev)
          n.add(h.id)
          return n
        })
      }
    } catch (err) {
      console.error('Failed to export flashcard:', err)
    }
  }

  // 11. Toggle Bookmark
  const toggleBookmark = async () => {
    if (!session || !book || !currentChapterId) return
    try {
      const supabase = createClient()
      const existing = bookmarks.find(b => b.chapter_id === currentChapterId)

      if (existing) {
        const { error } = await supabase
          .from('library_bookmarks')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
        setBookmarks(prev => prev.filter(b => b.id !== existing.id))
      } else {
        const { data, error } = await supabase
          .from('library_bookmarks')
          .insert({
            user_id: session.user.id,
            book_id: book.id,
            chapter_id: currentChapterId,
            scroll_pos: 0
          })
          .select()
          .single()

        if (error) throw error
        if (data) setBookmarks(prev => [...prev, data])
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err)
    }
  }

  const handleSettingsChange = (key: string, value: string) => {
    setReaderSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Entering the reading room...</p>
      </div>
    )
  }

  if (!book || !chapterContent) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Chapter Content Unavailable</h2>
        <p className="text-slate-500 mb-6">We could not load reading material for this book chapter.</p>
        <Link
          href={`/library/${slug}`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Synopsis
        </Link>
      </div>
    )
  }

  // Get index and chapters for pagination
  const currentChapterIdx = book.toc.findIndex(t => t.id === currentChapterId)
  const prevChapter = currentChapterIdx > 0 ? book.toc[currentChapterIdx - 1] : null
  const nextChapter = currentChapterIdx < book.toc.length - 1 ? book.toc[currentChapterIdx + 1] : null

  // Map theme colors
  const themeClasses = {
    light: 'bg-white text-slate-900 border-slate-200',
    sepia: 'bg-[#FDF6E3] text-[#5C3F1B] border-[#E8DFC4]',
    dark: 'bg-slate-950 text-slate-100 border-slate-900'
  }

  // Font Size classes
  const fontSizeClasses: Record<string, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  // Line Height classes
  const lineHeightClasses: Record<string, string> = {
    tight: 'leading-snug',
    normal: 'leading-relaxed',
    loose: 'leading-loose'
  }

  // Margins width classes
  const marginClasses: Record<string, string> = {
    narrow: 'max-w-4xl',
    normal: 'max-w-3xl',
    wide: 'max-w-xl'
  }

  // Font family classes
  const fontFamilyClasses: Record<string, string> = {
    serif: 'font-serif',
    sans: 'font-sans',
    dyslexic: 'font-mono'
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${themeClasses[theme]}`}>
      <GlossaryPopover />

      {/* 1. Left Sidebar: Table of Contents & Highlights */}
      {showSidebar && (
        <div className={`w-80 shrink-0 border-r flex flex-col justify-between h-screen sticky top-0 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Link
                href={`/library/${book.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Book Details
              </Link>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 rounded hover:bg-slate-200/50"
                title="Hide Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Book Title & Cover */}
            <div className="flex gap-3">
              {(book.cover_image_url || BOOK_IMAGES[book.slug]?.cover) && (
                <div className="w-12 h-16 relative border-2 border-slate-900 rounded overflow-hidden flex-shrink-0 bg-slate-200">
                  <Image
                    src={book.cover_image_url || BOOK_IMAGES[book.slug]?.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="font-extrabold text-[10px] uppercase text-blue-600 mb-0.5">
                  Reading Room
                </h2>
                <h1 className="font-extrabold text-xs tracking-tight line-clamp-3">
                  {book.title}
                </h1>
              </div>
            </div>

            {/* Chapters List */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-slate-400 block mb-2 px-1">
                Chapters
              </span>
              {book.toc.map((t, idx) => {
                const isActive = t.id === currentChapterId
                const isBookmarked = bookmarks.some(b => b.chapter_id === t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => setCurrentChapterId(t.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex justify-between items-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'hover:bg-slate-800 text-slate-300'
                          : 'hover:bg-slate-200/60 text-slate-600'
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {t.title}</span>
                    {isBookmarked && (
                      <Bookmark className="w-3 h-3 fill-current shrink-0 ml-1.5" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Highlights List with Sticky Notes and Study Deck Export */}
            <div className="border-t border-slate-200/40 pt-4 space-y-3">
              <span className="text-[10px] uppercase font-black text-slate-400 block mb-2 px-1">
                Highlights &amp; Annotations ({highlights.length})
              </span>
              {highlights.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic px-1">Select text inside the reader to highlight or add sticky notes.</p>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {highlights.map(h => (
                    <div
                      key={h.id}
                      className={`p-3 rounded-lg text-xs border space-y-2 ${
                        theme === 'dark'
                          ? 'bg-slate-950 border-slate-800'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <span className="block italic text-[11px] leading-relaxed">
                        &ldquo;{h.selected_text}&rdquo;
                      </span>

                      {h.note ? (
                        <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-dashed border-slate-200 dark:border-slate-800 relative">
                          <span className="block font-medium">Sticky Note:</span>
                          <span className="block italic mt-0.5">&ldquo;{h.note}&rdquo;</span>
                          <button
                            onClick={() => {
                              setActiveHighlightId(h.id)
                              setNoteText(h.note || '')
                            }}
                            className="text-[9px] text-blue-600 font-bold uppercase mt-1.5 hover:underline inline-block"
                          >
                            Edit Note
                          </button>
                        </div>
                      ) : activeHighlightId === h.id ? (
                        <div className="space-y-1.5 pt-1">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Type personal sticky note..."
                            className="w-full p-2 border border-slate-900 text-[11px] bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 rounded"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveHighlightNote(h.id)}
                              className="bg-slate-900 text-white text-[9px] uppercase font-black px-2 py-1 rounded hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setActiveHighlightId(null)}
                              className="text-slate-400 text-[9px] uppercase font-black px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveHighlightId(h.id)
                            setNoteText('')
                          }}
                          className="text-[9px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1"
                        >
                          <StickyNote className="w-3 h-3" /> + Add Sticky Note
                        </button>
                      )}

                      {/* Export to revision cards */}
                      {h.note && (
                        <button
                          onClick={() => exportToFlashcard(h)}
                          disabled={exportedCardIds.has(h.id)}
                          className={`w-full py-1 text-[9px] uppercase font-black border rounded transition-all text-center ${
                            exportedCardIds.has(h.id)
                              ? 'border-green-600 text-green-600 bg-green-50/10'
                              : 'border-slate-300 text-slate-500 hover:border-slate-950 hover:text-slate-950 dark:border-slate-700 dark:hover:border-slate-100 dark:hover:text-white'
                          }`}
                        >
                          {exportedCardIds.has(h.id) ? '✓ Exported to Deck' : '📇 Export to Flashcard'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Reader Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Reader Top Controls Header */}
        <header className="sticky top-0 z-20 border-b flex items-center justify-between px-6 py-3 bg-inherit">
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-1.5 rounded hover:bg-slate-200/50"
                title="Show Sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <h3 className="font-bold text-xs truncate max-w-xs hidden sm:block">
              {book.title}
            </h3>
            {readTimeLeft !== null && (
              <span className="font-mono text-[9px] uppercase font-black text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                ⏱️ {readTimeLeft} min left
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100/10 ${
                bookmarks.some(b => b.chapter_id === currentChapterId)
                  ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                  : 'border-slate-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarks.some(b => b.chapter_id === currentChapterId) ? 'fill-current' : ''}`} />
              Bookmark
            </button>

            {/* Display Settings Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100/10"
              title="Formatting Options"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Settings Overlay Dropdown */}
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-72 z-50 bg-white border-4 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-slate-900 dark:border-slate-800 dark:shadow-none space-y-4">
                {/* Theme Selector */}
                <div>
                  <label className="text-xs font-mono font-black uppercase text-slate-400 block mb-1">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'sepia', 'dark'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`py-1 border-2 text-xs font-bold uppercase transition-all ${
                          theme === t
                            ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                            : 'border-slate-200 hover:border-slate-900 dark:border-slate-800 dark:hover:border-slate-100 bg-transparent'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size Selector */}
                <div>
                  <label className="text-xs font-mono font-black uppercase text-slate-400 block mb-1">Font Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`py-1 border-2 text-xs font-bold uppercase transition-all ${
                          fontSize === size
                            ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                            : 'border-slate-200 hover:border-slate-900 dark:border-slate-800 dark:hover:border-slate-100 bg-transparent'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <ReaderControls 
                  onSettingsChange={handleSettingsChange} 
                  initialSettings={readerSettings} 
                />
              </div>
            )}
          </div>
        </header>

        {/* Floating Context Toolbar */}
        {selectedText && (
          <div className="sticky top-14 z-30 mx-auto bg-slate-900 text-white shadow-xl px-4 py-2 rounded-full border border-slate-700 flex gap-4 items-center animate-fade-in">
            <span className="text-xs text-slate-300 max-w-xs truncate font-medium">
              &ldquo;{selectedText}&rdquo;
            </span>
            <div className="flex gap-2 border-l border-slate-700 pl-3">
              <button
                onClick={() => saveHighlight('yellow')}
                className="text-[10px] uppercase font-black tracking-wider bg-yellow-500 text-slate-950 px-2.5 py-1 rounded-full hover:bg-yellow-400 transition-colors"
              >
                Highlight
              </button>
              <button
                onClick={explainSelection}
                className="text-[10px] uppercase font-black tracking-wider bg-blue-600 text-white px-2.5 py-1 rounded-full hover:bg-blue-500 flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3 h-3 fill-white" /> AI Explain
              </button>
            </div>
          </div>
        )}

        {/* 3. Main Reading Content Pane */}
        <main
          ref={textContainerRef}
          onMouseUp={handleTextSelection}
          className="flex-1 overflow-y-auto px-6 md:px-12 py-10 w-full"
        >
          <div className={`mx-auto ${marginClasses[readerSettings.margins]}`}>
            {/* Double-click hint */}
            <div className="font-mono text-[9px] text-slate-400 text-center uppercase tracking-wider mb-6">
              💡 Tip: Double-click any polymer technical term to reveal its glossary definition instantly.
            </div>

            {/* Reader Body */}
            <article className={`prose max-w-none prose-slate ${
              fontFamilyClasses[readerSettings.font]
            } ${
              fontSizeClasses[fontSize]
            } ${
              lineHeightClasses[readerSettings.lineHeight]
            } ${
              theme === 'dark' ? 'prose-invert' : ''
            }`}>
              {/* Chapter Images */}
              {BOOK_IMAGES[book.slug]?.chapters?.[currentChapterId] && BOOK_IMAGES[book.slug].chapters[currentChapterId].length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
                  {BOOK_IMAGES[book.slug].chapters[currentChapterId].map((img, idx) => (
                    <figure key={idx} className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-slate-900 dark:border-slate-800">
                      <div className="aspect-video relative bg-slate-100 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <Image
                          src={img.url}
                          alt={img.caption || `Figure ${idx + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {img.caption && (
                        <figcaption className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center font-mono font-bold uppercase tracking-wide">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}

              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {chapterContent}
              </ReactMarkdown>
            </article>

            {/* Bottom Pagination Links */}
            <div className="border-t border-slate-200/40 mt-16 pt-8 flex justify-between gap-4">
              {prevChapter ? (
                <button
                  onClick={() => setCurrentChapterId(prevChapter.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold hover:underline ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous: {prevChapter.title}
                </button>
              ) : (
                <span />
              )}

              {nextChapter ? (
                <button
                  onClick={() => setCurrentChapterId(nextChapter.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold hover:underline ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Next: {nextChapter.title} <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 4. Right Panel: AI Explainer Sidebar */}
      {showAiPanel && (
        <div className={`w-80 shrink-0 border-l flex flex-col justify-between h-screen sticky top-0 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="p-4 flex-1 flex flex-col overflow-hidden h-full">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200/40 pb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <Sparkles className="w-4 h-4 fill-blue-600" /> AI Term Explainer
              </span>
              <button
                onClick={() => setShowAiPanel(false)}
                className="p-1 rounded hover:bg-slate-200/50"
                title="Hide Panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Explaining Status */}
            {aiLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-slate-500 font-medium">Formulating explanation...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Term Selected
                  </span>
                  <div className={`p-2.5 rounded-lg border italic font-medium ${
                    theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    &ldquo;{selectedText}&rdquo;
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    AI Tutor Explanation
                  </span>
                  <div className={`p-3 rounded-lg border prose max-w-none ${
                    theme === 'dark' ? 'bg-slate-800/40 border-slate-700 prose-invert text-slate-300' : 'bg-white border-slate-200'
                  }`}>
                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
