'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  ExternalLink,
  Download,
  BookMarked
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ALL_LIBRARY_BOOKS, LibraryBook, LegalClass } from '@/lib/library_data'
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

const DISCIPLINE_THEMES: Record<string, { gradient: string; watermark: string; tag: string }> = {
  'polymer-chemistry': {
    gradient: 'from-blue-900 via-indigo-950 to-slate-950',
    watermark: 'POLYMER SYNTHESIS & MOLECULAR ARCHITECTURE',
    tag: '⚗️ Chemistry',
  },
  'polymer-processing': {
    gradient: 'from-amber-900 via-orange-950 to-slate-950',
    watermark: 'INJECTION MOULDING & EXTRUSION DYNAMICS',
    tag: '⚙️ Processing',
  },
  'polymer-testing': {
    gradient: 'from-purple-900 via-slate-950 to-indigo-950',
    watermark: 'ASTM / ISO MECHANICAL CHARACTERIZATION',
    tag: '🔬 Testing & QA',
  },
  'polymer-rheology': {
    gradient: 'from-cyan-900 via-blue-950 to-slate-950',
    watermark: 'VISCOELASTICITY & SHEAR FLOW MECHANICS',
    tag: '🌊 Rheology',
  },
  'polymer-composites': {
    gradient: 'from-sky-900 via-slate-950 to-teal-950',
    watermark: 'CFRP STRUCTURAL COMPOSITES & RESIN MATRIX',
    tag: '🚀 Composites',
  },
  'mould-design': {
    gradient: 'from-slate-900 via-zinc-950 to-blue-950',
    watermark: 'INJECTION MOULDS & RUNNER COOLING LAYOUTS',
    tag: '📐 Mould Design',
  },
  'sustainable-plastics': {
    gradient: 'from-emerald-900 via-teal-950 to-slate-950',
    watermark: 'CIRCULAR ECONOMY & BIOPOLYMER DEGRADATION',
    tag: '🌱 Sustainability',
  },
  'additives-and-compounding': {
    gradient: 'from-amber-950 via-zinc-950 to-slate-950',
    watermark: 'TWIN SCREW COMPOUNDING & MASTERBATCH',
    tag: '🧪 Compounding',
  },
}

function BookCoverVisual({ book }: { book: LibraryBook }) {
  const [imgError, setImgError] = useState(false)
  const primarySlug = book.subject_slugs?.[0] || 'polymer-chemistry'
  const theme = DISCIPLINE_THEMES[primarySlug] || DISCIPLINE_THEMES['polymer-chemistry']

  return (
    <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
      <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-between p-3 select-none">
        <span className="font-mono text-[9px] font-black tracking-widest text-white/50 uppercase">
          {theme.watermark}
        </span>
        <div className="border border-white/20 rounded-lg p-2 flex items-center justify-between">
          <span className="font-mono text-[8px] text-white/60 font-bold uppercase">{theme.tag}</span>
          <span className="font-mono text-[8px] text-amber-300 font-bold uppercase">{book.difficulty}</span>
        </div>
      </div>

      {book.cover_url && !imgError && (
        <Image
          src={book.cover_url}
          alt={book.title}
          fill
          unoptimized
          onError={() => setImgError(true)}
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

      {/* 4-Class Legal Badges */}
      <div className="absolute top-3.5 left-3.5 z-10">
        {book.legal_class === 'Class A' && (
          <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="h-3 w-3 fill-white" /> Class A &middot; PolymerHub Original
          </span>
        )}
        {book.legal_class === 'Class B' && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Download className="h-3 w-3" /> Class B &middot; Open Access PDF
          </span>
        )}
        {book.legal_class === 'Class D' && (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-600 text-[10px] font-mono font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <ExternalLink className="h-3 w-3 text-amber-400" /> Class D &middot; Catalog Card
          </span>
        )}
      </div>
    </div>
  )
}

export default function DigitalLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedLegalClass, setSelectedLegalClass] = useState('all')
  const [books, setBooks] = useState<LibraryBook[]>(ALL_LIBRARY_BOOKS)

  useEffect(() => {
    async function fetchSupabaseBooks() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('library_books').select('*')
        if (data && data.length > 0) {
          // Merge with fallback data
          const merged = ALL_LIBRARY_BOOKS.map(localB => {
            const dbB = data.find((d: any) => d.slug === localB.slug)
            return dbB ? { ...localB, ...dbB } : localB
          })
          setBooks(merged)
        }
      } catch (err) {
        console.error('Using local library fallback:', err)
      }
    }
    fetchSupabaseBooks()
  }, [])

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.summary.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSubject = selectedSubject === 'all' || book.subject_slugs.includes(selectedSubject)
      const matchesLegalClass = selectedLegalClass === 'all' || book.legal_class === selectedLegalClass

      return matchesSearch && matchesSubject && matchesLegalClass
    })
  }, [books, searchQuery, selectedSubject, selectedLegalClass])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Banner: 4-Class Legal Guarantee */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 border-b border-purple-800/40 py-2.5 px-4 text-center text-xs font-medium text-slate-200">
        <span className="inline-flex items-center gap-1.5 font-bold text-amber-400">
          <ShieldCheck className="h-4 w-4" /> PolymerHub 4-Class Legal Infrastructure:
        </span>{' '}
        Zero misattributed AI filler. Original interactive guides (Class A) + Open Access standards (Class B) + Bibliographic commercial discovery cards (Class D).
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold mb-4">
            <BookMarked className="h-3.5 w-3.5" /> ACADEMIC & INDUSTRIAL KNOWLEDGE ENGINE
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            PolymerHub <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Digital Library</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Legally partitioned reference library. Deep interactive original guides for polymer engineers, verified public domain technical standards, and external commercial discovery cards.
          </p>

          {/* Search & Filter Controls */}
          <div className="mt-8 relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, author, ASTM standard, or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {STATS.map((s, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
              <s.icon className="h-5 w-5 text-amber-400 mx-auto mb-2" />
              <div className="text-xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Legal Class Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 border-b border-slate-800 pb-4">
          {LEGAL_CLASS_FILTERS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedLegalClass(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedLegalClass === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {SUBJECT_FILTERS.map(sub => (
            <button
              key={sub.slug}
              onClick={() => setSelectedSubject(sub.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedSubject === sub.slug
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-purple-500/50 transition-all flex flex-col group"
            >
              {/* Visual Book Cover */}
              <BookCoverVisual book={book} />

              {/* Book Content Metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {book.category.toUpperCase().replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {book.toc?.length || 0} Chapters
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">by {book.authors}</p>
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {book.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/library/${book.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-all"
                  >
                    {book.legal_class === 'Class A' && 'Read Interactive Guide'}
                    {book.legal_class === 'Class B' && 'View Open Access PDF'}
                    {book.legal_class === 'Class D' && 'View Catalog Card & Citation'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {book.legal_class === 'Class D' && (
                    <span className="text-[9px] font-mono text-slate-500 uppercase">External Catalog</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No matching books found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your subject or legal classification filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
