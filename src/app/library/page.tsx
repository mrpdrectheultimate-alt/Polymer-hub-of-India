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
  Brain, 
  Award, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  Star 
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ALL_LIBRARY_BOOKS, LibraryBook } from '@/lib/library_data'
import Footer from '@/components/Footer'

// ==================== DATA & CONSTANTS ====================

const SUBJECT_FILTERS = [
  { slug: 'all', label: 'All Subjects' },
  { slug: 'polymer-chemistry', label: 'Chemistry' },
  { slug: 'polymer-processing', label: 'Processing' },
  { slug: 'polymer-testing', label: 'Testing & QA' },
  { slug: 'polymer-rheology', label: 'Rheology' },
  { slug: 'polymer-composites', label: 'Composites' },
  { slug: 'rubber-technology', label: 'Rubber' },
  { slug: 'plastic-packaging-engineering', label: 'Packaging' },
  { slug: 'sustainable-plastics', label: 'Sustainability' },
]

const DIFFICULTY_FILTERS = [
  { id: 'all', label: 'All Levels' },
  { id: 'Foundational', label: 'Foundational' },
  { id: 'Intermediate', label: 'Intermediate' },
  { id: 'Advanced', label: 'Advanced' },
]

const FORMAT_FILTERS = [
  { id: 'all', label: 'All Formats' },
  { id: 'original_guide', label: '⭐ Original Interactive Guides' },
  { id: 'open_access', label: '🟢 Open Access (Free)' },
  { id: 'commercial', label: '📘 Standard Commercial References' },
]

const STATS = [
  { value: '50+', label: 'Curated Volumes', icon: BookOpen },
  { value: '19', label: 'Disciplines Covered', icon: Layers },
  { value: '100%', label: 'Academically Audited', icon: Award },
  { value: '4 Tiers', label: 'From Basic to Expert', icon: GraduationCap },
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
  'rubber-technology': {
    gradient: 'from-emerald-950 via-slate-950 to-zinc-950',
    watermark: 'ELASTOMERS, VULCANIZATION & EPDM TECHNOLOGY',
    tag: '🏎️ Rubber Tech',
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

function BookCoverVisual({ book, isOriginal, isOpenAccess }: { book: LibraryBook; isOriginal: boolean; isOpenAccess: boolean }) {
  const [imgError, setImgError] = useState(false)
  const primarySlug = book.subject_slugs?.[0] || 'polymer-chemistry'
  const theme = DISCIPLINE_THEMES[primarySlug] || DISCIPLINE_THEMES['polymer-chemistry']

  return (
    <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
      {/* Engineering blueprint background watermark */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-between p-3 select-none">
        <span className="font-mono text-[9px] font-black tracking-widest text-white/50 uppercase">
          {theme.watermark}
        </span>
        <div className="border border-white/20 rounded-lg p-2 flex items-center justify-between">
          <span className="font-mono text-[8px] text-white/60 font-bold uppercase">{theme.tag}</span>
          <span className="font-mono text-[8px] text-amber-300 font-bold uppercase">{book.difficulty}</span>
        </div>
      </div>

      {/* Book cover image with clean error fallback and crossfade */}
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

      {/* High-contrast gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

      {/* Format Badge */}
      <div className="absolute top-3.5 left-3.5 z-10">
        {isOriginal && (
          <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Star className="h-3 w-3 fill-slate-950" /> Original Guide
          </span>
        )}
        {isOpenAccess && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Free &middot; Open Access
          </span>
        )}
        {!isOriginal && !isOpenAccess && (
          <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm">
            Commercial Standard
          </span>
        )}
      </div>

      {/* Level Pill */}
      <div className="absolute bottom-3.5 left-3.5 z-10">
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/20 backdrop-blur-md text-white uppercase border border-white/20">
          {book.difficulty}
        </span>
      </div>

      <div className="absolute bottom-3.5 right-3.5 text-xs font-mono text-slate-300 z-10">
        {book.toc.length} Chapters
      </div>
    </div>
  )
}

// ==================== COMPONENT ====================

export default function LibraryPage() {
  const [books, setBooks] = useState<LibraryBook[]>(ALL_LIBRARY_BOOKS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState('all')
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Supabase live loading with fallback merge
  useEffect(() => {
    setIsLoaded(true)
    async function loadBooks() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('library_books')
          .select('*')
          .order('category', { ascending: true })
          .order('title', { ascending: true })

        if (data && data.length > 0) {
          // Merge Supabase books with enriched local data
          const merged = (data as unknown as LibraryBook[]).map((dbBook) => {
            const localMatch = ALL_LIBRARY_BOOKS.find((b) => b.slug === dbBook.slug || b.id === dbBook.id)
            return {
              ...dbBook,
              cover_url: dbBook.cover_url || localMatch?.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
              toc: localMatch?.toc || dbBook.toc || [{ id: 'ch1', title: 'Chapter 1: Foundations' }],
              chapters: localMatch?.chapters || dbBook.chapters || {},
              subject_slugs: localMatch?.subject_slugs || dbBook.subject_slugs || ['polymer-chemistry'],
              careers: localMatch?.careers || dbBook.careers || ['Polymer Engineer'],
              focus: dbBook.focus || localMatch?.focus || 'Core engineering principles and practical calculations.',
              summary: dbBook.summary || localMatch?.summary || 'Authoritative reference volume for plastics professionals.',
            }
          })
          setBooks(merged)
        }
      } catch (err) {
        console.warn('Using enriched library data fallback:', err)
        setBooks(ALL_LIBRARY_BOOKS)
      }
    }
    loadBooks()
  }, [])

  // Filtered Books List
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search
      const matchesSearch =
        !searchTerm.trim() ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.summary.toLowerCase().includes(searchTerm.toLowerCase())

      // Subject Filter
      const matchesSubject =
        selectedSubject === 'all' ||
        book.subject_slugs?.some((s) => s.toLowerCase() === selectedSubject.toLowerCase())

      // Difficulty Filter
      const matchesDifficulty =
        selectedDifficulty === 'all' ||
        book.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()

      // Format Filter
      const matchesFormat =
        selectedFormat === 'all' ||
        book.category === selectedFormat

      // Curated Collection Filter
      let matchesCollection = true
      if (activeCollection === 'gate') {
        matchesCollection = book.difficulty === 'Intermediate' || book.difficulty === 'Advanced' || book.category === 'original_guide'
      } else if (activeCollection === 'start') {
        matchesCollection = book.difficulty === 'Foundational'
      } else if (activeCollection === 'processing') {
        matchesCollection = book.subject_slugs?.includes('polymer-processing') || book.subject_slugs?.includes('mould-design')
      } else if (activeCollection === 'rd') {
        matchesCollection = book.subject_slugs?.includes('polymer-chemistry') || book.subject_slugs?.includes('polymer-rheology') || book.subject_slugs?.includes('polymer-composites')
      }

      return matchesSearch && matchesSubject && matchesDifficulty && matchesFormat && matchesCollection
    })
  }, [books, searchTerm, selectedSubject, selectedDifficulty, selectedFormat, activeCollection])

  // Featured Recommended Book (Gap-based)
  const recommendedBook = useMemo(() => {
    return books.find((b) => b.slug === 'rheology-processing-guide') || books[0]
  }, [books])

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedSubject('all')
    setSelectedDifficulty('all')
    setSelectedFormat('all')
    setActiveCollection(null)
  }

  const isFiltering = searchTerm !== '' || selectedSubject !== 'all' || selectedDifficulty !== 'all' || selectedFormat !== 'all' || activeCollection !== null

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Cinematic Navy & Emerald Research Library Header */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0A2E1A] to-[#0B172A] overflow-hidden py-14 lg:py-20 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              📚 Academic Reading Room &middot; Reference Library
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] pb-1 tracking-tight">
              Master Polymer Engineering.
              <span className="block bg-gradient-to-r from-[#6EE7B7] via-[#34D399] to-[#10B981] bg-clip-text text-transparent pb-3 pt-1 leading-[1.15]">
                One Resource At A Time.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              Curated textbooks, ASTM testing standards, interactive mathematical guides, 
              and Open Access monographs mapped directly to your practice gaps and research career.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm"
                  >
                    <StatIcon className="h-5 w-5 text-[#34D399] shrink-0" />
                    <div>
                      <p className="text-white font-bold text-base sm:text-lg font-mono leading-none">{stat.value}</p>
                      <p className="text-slate-300 text-[10px] sm:text-xs font-mono uppercase mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Instant Search Bar */}
            <div className="relative mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, author, topic, or ASTM standard (e.g. Rheology, Rosato, Mould Design)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-white/15 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder:text-slate-400 text-sm font-sans focus:outline-none focus:border-[#34D399] focus:ring-2 focus:ring-[#10B981]/30 transition-all shadow-inner"
              />
            </div>
          </motion.div>
        </div>

        {/* Tricolor Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* PERSONALIZED LEARNING PATHWAY PROGRESS TRACKER */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 sm:p-6"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                Your Academic Reading Ladder
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#111827]">
                Progress Across Curated Pedagogical Tiers
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 font-bold">Overall Reading Completion: 58%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* Foundational */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-bold text-blue-900">1. Foundational</span>
                <span className="text-blue-700 font-bold">8 / 12 Complete</span>
              </div>
              <div className="w-full bg-blue-200/80 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[66%]" />
              </div>
            </div>

            {/* Intermediate */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-bold text-amber-900">2. Intermediate</span>
                <span className="text-amber-700 font-bold">4 / 10 Complete</span>
              </div>
              <div className="w-full bg-amber-200/80 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[40%]" />
              </div>
            </div>

            {/* Advanced */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-bold text-emerald-900">3. Advanced</span>
                <span className="text-emerald-700 font-bold">2 / 8 Complete</span>
              </div>
              <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[25%]" />
              </div>
            </div>

            {/* Expert */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-bold text-purple-900">4. Specialist / Expert</span>
                <span className="text-purple-700 font-bold">1 / 6 Complete</span>
              </div>
              <div className="w-full bg-purple-200/80 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full w-[16%]" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* "CONTINUE READING" ACTIVE CHAPTER CARD */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
                alt="Plastics Processing Data Handbook"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-100 text-orange-800">
                  Currently Reading
                </span>
                <span className="text-xs font-mono text-slate-500">Chapter 3: Extrusion Processing Parameters</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#111827] mt-1">
                Plastics Processing Data Handbook &mdash; D.V. Rosato
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-36 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div className="bg-[#10B981] h-full rounded-full w-[45%]" />
                </div>
                <span className="text-xs font-mono text-slate-500 font-bold">45% Complete</span>
              </div>
            </div>
          </div>

          <Link
            href="/library/rosato-processing/read"
            className="w-full md:w-auto px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
          >
            Resume Reading
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* RECOMMENDED FOR YOU (Practice Gap-Based AI Suggestion) */}
      {/* ============================================================ */}
      {recommendedBook && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left: Book Cover Preview */}
              <div className="lg:col-span-3 flex justify-center lg:justify-start">
                <div className="relative w-40 h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                  <Image
                    src={recommendedBook.cover_url}
                    alt={recommendedBook.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[9px] font-black uppercase shadow-xs">
                    ⭐ 96% Match
                  </div>
                </div>
              </div>

              {/* Center: Gap Breakdown & Motivation */}
              <div className="lg:col-span-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  Recommended Based On Your Practice Gaps
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {recommendedBook.title}
                </h3>
                <p className="text-xs font-mono text-slate-300">by {recommendedBook.authors}</p>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-slate-200 leading-relaxed font-light">
                  <strong className="text-amber-300 font-mono block mb-1">Target Weakness: Polymer Rheology (54% Accuracy)</strong>
                  Studying Chapters 2 &amp; 3 will bridge your conceptual gap in non-Newtonian power-law shear-thinning and die swell physics before your next GATE mock test.
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300 pt-1">
                  <span>📚 {recommendedBook.toc.length} Chapters</span>
                  <span>&middot;</span>
                  <span>⏱️ ~4 Hours Required</span>
                  <span>&middot;</span>
                  <span className="text-emerald-400 font-bold">Interactive Derivations Included</span>
                </div>
              </div>

              {/* Right: Read CTA */}
              <div className="lg:col-span-3 text-center lg:text-right">
                <Link
                  href={`/library/${recommendedBook.slug}/read`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-slate-950 bg-[#10B981] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Read Chapter 1 Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* CURATED COLLECTIONS QUICK FILTER BAR */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
            Curated Tracks:
          </span>
          {[
            { id: 'start', label: '🚀 Start Here (Foundation)' },
            { id: 'gate', label: '🎯 GATE XE-F Prep Pack' },
            { id: 'processing', label: '⚙️ Processing & Tooling Mastery' },
            { id: 'rd', label: '🔬 R&D & Formulation Science' },
          ].map((track) => {
            const isActive = activeCollection === track.id
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveCollection(isActive ? null : track.id)}
                className={`
                  px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all
                  ${isActive
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }
                `}
              >
                {track.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* MULTI-FACTOR FILTER BAR (Subject, Level, Format) */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 space-y-3">
          
          {/* Row 1: Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SUBJECT_FILTERS.map((s) => {
              const isSelected = selectedSubject === s.slug
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setSelectedSubject(s.slug)}
                  className={`
                    px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all
                    ${isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  {s.label}
                </button>
              )
            })}
          </div>

          {/* Row 2: Level & Format Dropdowns + Clear Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Difficulty Dropdown */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#10B981]"
              >
                {DIFFICULTY_FILTERS.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>

              {/* Format Dropdown */}
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#10B981]"
              >
                {FORMAT_FILTERS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>

              {/* Clear filters button */}
              {isFiltering && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-xs font-mono font-bold text-rose-600 hover:underline"
                >
                  ✕ Reset Filters
                </button>
              )}
            </div>

            <span className="text-xs font-mono font-bold text-slate-500">
              Showing {filteredBooks.length} of {books.length} volumes
            </span>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* WORLD-CLASS BOOK CARD GRID */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => {
            const isOriginal = book.category === 'original_guide'
            const isOpenAccess = book.category === 'open_access'

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Card Header: Cover Thumbnail + Visual Badge */}
                  <BookCoverVisual book={book} isOriginal={isOriginal} isOpenAccess={isOpenAccess} />

                  {/* Card Body */}
                  <div className="p-5 space-y-3 cursor-pointer" onClick={() => window.location.href = `/library/${book.slug}/read`}>
                    <div>
                      <h3 className="font-extrabold text-[#111827] text-base leading-snug group-hover:text-[#10B981] transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 mt-1">by {book.authors}</p>
                    </div>

                    {/* Focus / Learn statement */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">Core Engineering Focus</p>
                      <p className="text-xs text-slate-700 font-light mt-0.5 line-clamp-2 leading-relaxed">
                        {book.focus}
                      </p>
                    </div>

                    {/* Reading Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Reading Progress</span>
                        <span className="font-bold text-slate-700">3 / {book.toc.length} Chapters</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#10B981] h-full rounded-full w-[35%]" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                  <Link
                    href={`/library/${book.slug}`}
                    className="text-xs font-mono font-bold text-slate-600 hover:text-slate-900"
                  >
                    View Index &rarr;
                  </Link>

                  <Link
                    href={`/library/${book.slug}/read`}
                    className="px-4 py-2 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-[#10B981] hover:bg-emerald-600 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    Read Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-lg font-bold text-[#111827]">No reference volumes match your filter</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">Try resetting your search query or subject filters.</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-5 py-2 rounded-xl bg-[#10B981] text-white text-xs font-mono font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* BRAND-ALIGNED AI RESEARCH SPECIALIST */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0A2E1A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs font-mono font-bold uppercase mb-3">
                <Brain className="h-3.5 w-3.5 text-amber-400" />
                AI Reference Specialist
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Need citation lookups or equation synthesis across books?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our AI Tutor to cross-reference Flory-Huggins thermodynamic equations, 
                Instron tensile calculation formulas, or Rosato processing tables instantly.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Synthesize Carreau-Yasuda Rheology</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Find ASTM D638 Specimen Type I Dimensions</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Compare PEEK vs PA66 Temperature Limits</span>
              </div>
            </div>

            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask AI Librarian
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}
