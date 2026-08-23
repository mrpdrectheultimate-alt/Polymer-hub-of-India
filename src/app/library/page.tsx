'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  BookOpen, 
  Search, 
  Download, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Compass,
  BookMarked
} from 'lucide-react'

interface Book {
  id: string
  slug: string
  title: string
  authors: string
  cover_url: string
  category: 'original_guide' | 'open_access' | 'commercial'
  difficulty: string
  focus: string
  summary: string
  purchase_url?: string
  file_url?: string
  careers: string[]
  subject_slugs: string[]
}

function LibraryPageContent() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  useEffect(() => {
    async function loadBooks() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('library_books')
          .select('*')
          .order('category', { ascending: true })
          .order('title', { ascending: true })

        if (error) throw error
        if (data) setBooks(data as Book[])
      } catch (err) {
        console.error('Failed to load library books:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [])

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.focus.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || book.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Digital Library &middot; 100% Verified Standards &middot; Commercial Reference Guides
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            PolymerHub <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Reading Room
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Access our digital library of original guides, verified open-access standards, and structured profiles of classic commercial textbooks mapped directly to your curriculum.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">{books.length || 24}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Curated Titles</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">3</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Resource Tiers</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">100%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Academically Audited</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-blue-400 block">19</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Subjects Mapped</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Workspace ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Search and Filters Toolbar */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs sm:text-sm font-medium text-slate-800 bg-white outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            {/* Category Filter Pills */}
            <div className="flex border-2 border-slate-200 rounded-xl p-1 bg-slate-50 overflow-hidden">
              {[
                { id: 'all', label: 'All Titles' },
                { id: 'original_guide', label: 'Original Guides' },
                { id: 'open_access', label: 'Open Access' },
                { id: 'commercial', label: 'Commercial' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="border-2 border-slate-200 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="Foundational">Foundational</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Reference">Reference</option>
            </select>
          </div>
        </div>

        {/* Loading / Bookshelf Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="border-2 border-slate-200 bg-white rounded-2xl p-6 animate-pulse space-y-4">
                <div className="h-28 bg-slate-200 rounded-xl w-full" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-12 text-center shadow-xl space-y-2">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-base text-slate-900">No books found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We could not find any resources matching your search query or selected filters. Try broadening your keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isOriginal = book.category === 'original_guide'
              const isOpenAccess = book.category === 'open_access'
              
              let tagColor = 'bg-amber-50 text-amber-800 border-amber-200'
              let label = 'Commercial Reference'
              if (isOriginal) {
                tagColor = 'bg-blue-50 text-blue-800 border-blue-200'
                label = 'Original Guide'
              } else if (isOpenAccess) {
                tagColor = 'bg-emerald-50 text-emerald-800 border-emerald-200'
                label = 'Open Access'
              }

              const isFree = isOriginal || isOpenAccess

              return (
                <article
                  key={book.id}
                  className="bg-white border-2 border-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Book Header Visual Banner */}
                  <div className="bg-[#0A1628] text-white p-5 border-b-2 border-slate-900 relative flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-center w-full mb-2">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagColor}`}>
                        {label}
                      </span>
                      {isFree && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                          FREE
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-display font-bold text-base text-white leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 font-mono">by {book.authors}</p>
                    </div>

                    <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Book Description & Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 uppercase">
                          {book.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                        {book.focus}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      {/* Careers mapping */}
                      <div className="flex flex-wrap gap-1.5">
                        {book.careers.slice(0, 2).map((c, idx) => (
                          <span key={idx} className="text-[10px] font-mono font-medium bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-blue-700">
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/library/${book.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        {isOpenAccess && book.file_url && (
                          <a
                            href={book.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        {book.category === 'commercial' && book.purchase_url && (
                          <a
                            href={book.purchase_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                            title="Buy Reference Book"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

      </div>

      {/* ── BOTTOM AI READING ASSISTANT CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Literature Specialist &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
            Looking for a specific polymer reference or textbook chapter? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Literature Specialist.
            </span>
          </h2>

          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            Search chapter summaries, standard citations, or find which textbook contains the most comprehensive breakdown of your research topic.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor?prompt=Which%20classic%20textbook%20or%20standard%20in%20the%20reading%20room%20best%20explains%20Ziegler-Natta%20catalysis%20and%20polymer%20rheology"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask Literature Specialist &rarr;
            </Link>

            <Link
              href="/subjects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> 19 Subjects Curriculum
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default function LibraryHubPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-[#FAF8F5]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-mono text-xs uppercase tracking-wider">Entering the reading room...</p>
      </div>
    }>
      <LibraryPageContent />
    </Suspense>
  )
}
