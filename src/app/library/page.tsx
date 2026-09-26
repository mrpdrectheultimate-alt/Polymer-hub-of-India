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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans">
      
      {/* ── 1. HERO SECTION: Professional Academic White with Blue Accent ── */}
      <section className="relative pt-12 pb-16 px-4 md:px-8 border-b border-slate-200/90 bg-white overflow-hidden shadow-2xs">
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-xs font-bold uppercase tracking-wider">
            <BookMarked className="w-4 h-4" /> PolymerHub Digital Library &middot; 3-Tier Visual System
          </div>

          <h1 className="font-display font-black text-3xl md:text-5xl text-slate-900 tracking-tight leading-tight uppercase">
            Curated Academic &amp; Industrial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-indigo-600 to-[#2563EB]">
              Polymer Bookshelf
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed font-normal">
            Partitioned into <strong className="text-purple-700 font-semibold">Class A Originals</strong>, <strong className="text-emerald-700 font-semibold">Class B Open Access PDFs</strong>, and <strong className="text-blue-700 font-semibold">Class D Reference Cards</strong> for complete legal compliance and academic transparency.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl">
            {STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-slate-900 text-base block leading-tight">{stat.value}</span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-medium">{stat.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── 2. LEGAL PARTITIONING EXPLANATION BANNER ── */}
      <section className="bg-slate-100/80 border-b border-slate-200 py-3.5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>4-Class Legal Partitioning System Active:</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-[11px]">
            <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 font-bold">
              Class A: Originals ({classACount})
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
              Class B: Open Access ({classBCount})
            </span>
            <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold">
              Class D: Reference Cards ({classDCount})
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. FILTER & SEARCH CONTROL TOOLBAR ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex-1 w-full space-y-8">
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 md:p-5 space-y-4 shadow-xs">
          
          {/* Top Row: Search & Class Filter */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search polymer titles, authors, ISBN..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            {/* Legal Class Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto whitespace-nowrap mobile-touch-scroll">
              {LEGAL_CLASS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedLegalClass(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedLegalClass === f.id
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pt-2 border-t border-slate-200/80 mobile-touch-scroll">
            {SUBJECT_FILTERS.map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSubject(s.slug)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer ${
                  selectedSubject === s.slug
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

        </div>

        {/* ── 4. BOOK CARDS GRID ── */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-900">No Matching Reference Books</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search query or switching legal classification filters to view the full bookshelf.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedSubject('all')
                setSelectedLegalClass('all')
              }}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase cursor-pointer"
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
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
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
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{book.publisher || 'PolymerHub Academic'} &middot; {book.publication_year || 2026}</span>
                        <span className="font-bold text-[#2563EB]">{book.difficulty}</span>
                      </div>

                      <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2">
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                        {book.summary}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-1">
                        {book.careers?.slice(0, 2).map((c, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            💼 {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                    <Link
                      href={`/library/${book.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#2563EB] hover:text-blue-800 uppercase tracking-wider"
                    >
                      View Details &rarr;
                    </Link>

                    {isClassA && (
                      <Link
                        href={`/library/${book.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-[#2563EB] hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                      >
                        Read Book <BookOpen className="w-3 h-3" />
                      </Link>
                    )}

                    {isClassB && (
                      <Link
                        href={`/library/${book.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                      >
                        Read Open PDF <Download className="w-3 h-3" />
                      </Link>
                    )}

                    {isClassD && (
                      <Link
                        href={`/library/${book.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
                      >
                        Catalog Card <ExternalLink className="w-3 h-3 text-[#2563EB]" />
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
