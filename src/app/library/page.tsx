'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Search, ShieldCheck, Download, ExternalLink, ArrowRight } from 'lucide-react'

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

export default function LibraryHubPage() {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 md:px-8 border-b-4 border-blue-600 shadow-lg relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/30 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Legal & Academically Audited
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            PolymerHub Reading Room
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl leading-relaxed">
            Access our digital library of original guides, verified open-access standards, and structured profiles of classic commercial textbooks mapped directly to your curriculum.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 h-5 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by title, author, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm bg-slate-50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-lg">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-white shadow text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('original_guide')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedCategory === 'original_guide'
                    ? 'bg-white shadow text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Original Guides
              </button>
              <button
                onClick={() => setSelectedCategory('open_access')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedCategory === 'open_access'
                    ? 'bg-white shadow text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Open Access
              </button>
              <button
                onClick={() => setSelectedCategory('commercial')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedCategory === 'commercial'
                    ? 'bg-white shadow text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Commercial
              </button>
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="border-2 border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Levels</option>
              <option value="Foundational">Foundational</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Reference">Reference</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Entering the reading room...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No books found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We could not find any resources matching your search query or selected filters. Try broadening your keywords.
            </p>
          </div>
        ) : (
          /* Bookshelf Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => {
              const isOriginal = book.category === 'original_guide'
              const isOpenAccess = book.category === 'open_access'
              
              let tagColor = 'bg-amber-100 text-amber-800 border-amber-200'
              let label = 'Commercial Reference'
              if (isOriginal) {
                tagColor = 'bg-blue-100 text-blue-800 border-blue-200'
                label = 'Original Guide'
              } else if (isOpenAccess) {
                tagColor = 'bg-emerald-100 text-emerald-800 border-emerald-200'
                label = 'Open Access'
              }

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col hover:-translate-y-0.5"
                >
                  {/* Book Cover Placeholder */}
                  <div className="h-44 bg-gradient-to-br from-slate-800 to-slate-950 relative p-6 flex flex-col justify-between text-white border-b-2 border-slate-200">
                    <span className={`self-start text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded border ${tagColor}`}>
                      {label}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-lg leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">by {book.authors}</p>
                    </div>
                    {/* Visual pattern */}
                    <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 pointer-events-none">
                      <BookOpen className="w-5 h-5 text-white/20" />
                    </div>
                  </div>

                  {/* Book Content Summary */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-2 mb-3">
                        <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-600">
                          {book.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-4">
                        {book.focus}
                      </p>
                    </div>

                    <div>
                      {/* Careers mapping */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {book.careers.slice(0, 2).map((c, idx) => (
                          <span key={idx} className="text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-medium text-indigo-700">
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="border-t border-slate-100 pt-4 flex gap-2">
                        <Link
                          href={`/library/${book.slug}`}
                          className="w-full inline-flex items-center justify-center gap-1 bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        {isOpenAccess && book.file_url && (
                          <a
                            href={book.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2.5 rounded-lg border-2 border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
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
                            className="inline-flex items-center justify-center p-2.5 rounded-lg border-2 border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                            title="Buy Reference Book"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
