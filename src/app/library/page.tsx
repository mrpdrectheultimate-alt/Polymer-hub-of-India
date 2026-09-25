'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  ExternalLink,
  Download,
  BookMarked
} from 'lucide-react'
import { ALL_LIBRARY_BOOKS, LibraryBook, LegalClass } from '@/lib/library_data'
import LibraryBookCover from '@/components/LibraryBookCover'
import Footer from '@/components/Footer'

// ==================== DATA & CONSTANTS ====================

const SUBJECT_FILTERS = [
  { slug: 'all', label: 'All Subjects' },
  { slug: 'polymer-chemistry', label: 'Chemistry' },
  { slug: 'polymer-processing', label: 'Processing' },
  { slug: 'polymer-testing', label: 'Testing & QA' },
  { slug: 'polymer-rheology', label: 'Rheology' },
  { slug: 'polymer-composites', label: 'Composites' },
  { slug: 'mould-design', label: 'Mould Design' },
  { slug: 'additives-and-compounding', label: 'Compounding' },
  { slug: 'sustainable-plastics', label: 'Sustainability' },
]

const LEGAL_CLASS_FILTERS = [
  { id: 'all', label: 'All Books (20)' },
  { id: 'Class A', label: '⭐ Class A: PolymerHub Originals (5)' },
  { id: 'Class B', label: '🟢 Class B: Open Access / PDF (6)' },
  { id: 'Class D', label: '📘 Class D: External Reference Cards (9)' },
]

const STATS = [
  { value: '20', label: 'Curated Volumes', icon: BookOpen },
  { value: '4 Classes', label: 'Strict Legal Classification', icon: ShieldCheck },
  { value: '100%', label: 'Legally Audited & Partitioned', icon: Award },
  { value: '5 Deep Guides', label: 'Full Interactive Books', icon: GraduationCap },
]

export default function DigitalLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedLegalClass, setSelectedLegalClass] = useState<string>('all')

  const books: LibraryBook[] = ALL_LIBRARY_BOOKS

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch = 
        !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSubject = 
        selectedSubject === 'all' || 
        b.subject_slugs?.includes(selectedSubject)

      const matchesLegalClass = 
        selectedLegalClass === 'all' || 
        b.legal_class === selectedLegalClass

      return matchesSearch && matchesSubject && matchesLegalClass
    })
  }, [books, searchQuery, selectedSubject, selectedLegalClass])

  const classACount = useMemo(() => books.filter((b) => b.legal_class === 'Class A').length, [books])
  const classBCount = useMemo(() => books.filter((b) => b.legal_class === 'Class B').length, [books])
  const classDCount = useMemo(() => books.filter((b) => b.legal_class === 'Class D').length, [books])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* ── 1. HERO SECTION: Midnight Navy with Gold Accent ── */}
      <section className="relative pt-12 pb-16 px-4 md:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,197,24,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <BookMarked className="w-4 h-4" /> PolymerHub Digital Library &middot; 3-Tier Visual System
          </div>

          <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-tight uppercase">
            Curated Academic &amp; Industrial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              Polymer Bookshelf
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed font-light">
            Partitioned into <strong className="text-purple-300 font-semibold">Class A Originals</strong>, <strong className="text-emerald-300 font-semibold">Class B Open Access PDFs</strong>, and <strong className="text-amber-300 font-semibold">Class D Reference Cards</strong> for complete legal compliance and academic transparency.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl">
            {STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-white text-base block leading-tight">{stat.value}</span>
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-medium">{stat.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── 2. LEGAL PARTITIONING EXPLANATION BANNER ── */}
      <section className="bg-slate-900/60 border-b border-slate-800 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>4-Class Legal Partitioning System Active:</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-[11px]">
            <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
              Class A: Originals ({classACount})
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              Class B: Open Access ({classBCount})
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-bold">
              Class D: Reference Cards ({classDCount})
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. FILTER & SEARCH CONTROL TOOLBAR ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex-1 w-full space-y-8">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
          
          {/* Top Row: Search & Class Filter */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search polymer titles, authors, ISBN..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Legal Class Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto whitespace-nowrap mobile-touch-scroll">
              {LEGAL_CLASS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedLegalClass(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedLegalClass === f.id
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pt-2 border-t border-slate-800/80 mobile-touch-scroll">
            {SUBJECT_FILTERS.map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSubject(s.slug)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                  selectedSubject === s.slug
                    ? 'bg-slate-800 text-amber-300 border border-amber-400/40'
                    : 'text-slate-400 hover:text-white border border-slate-800/50 hover:bg-slate-950'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

        </div>

        {/* ── 4. BOOK CARDS GRID ── */}
        {filteredBooks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-display font-bold text-lg text-white">No Matching Reference Books</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your search query or switching legal classification filters to view the full bookshelf.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedSubject('all')
                setSelectedLegalClass('all')
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isClassA = book.legal_class === 'Class A'
              const isClassB = book.legal_class === 'Class B'
              const isClassD = book.legal_class === 'Class D'

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* 3-Tier Visual Library Cover Header */}
                    <LibraryBookCover
                      id={book.id}
                      slug={book.slug}
                      title={book.title}
                      authors={book.authors}
                      legalClass={book.legal_class}
                      isbn={book.isbn}
                      publisher={book.publisher}
                      subjectSlugs={book.subject_slugs}
                      coverUrl={book.cover_url}
                      difficulty={book.difficulty}
                      isHero={false}
                    />

                    {/* Book Text Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{book.publisher || 'PolymerHub Academic'} &middot; {book.publication_year || 2026}</span>
                        <span className="font-bold text-amber-400">{book.difficulty}</span>
                      </div>

                      <h3 className="font-display font-bold text-base text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-light">
                        {book.summary}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-1">
                        {book.careers?.slice(0, 2).map((c, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                            💼 {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-5 pt-0 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-4">
                    <Link
                      href={`/library/${book.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
                    >
                      View Details &rarr;
                    </Link>

                    {isClassA && (
                      <Link
                        href={`/library/${book.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Read Book <BookOpen className="w-3 h-3" />
                      </Link>
                    )}

                    {isClassB && (
                      <Link
                        href={`/library/${book.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Read Open PDF <Download className="w-3 h-3" />
                      </Link>
                    )}

                    {isClassD && (
                      <Link
                        href={`/library/${book.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        Catalog Card <ExternalLink className="w-3 h-3 text-amber-400" />
                      </Link>
                    )}
                  </div>

                </motion.div>
              )
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
