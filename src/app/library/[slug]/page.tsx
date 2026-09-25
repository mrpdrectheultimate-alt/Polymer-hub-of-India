'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  BookOpen, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  ArrowLeft, 
  Sparkles, 
  BookMarked,
  ShoppingBag,
  Library as LibraryIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

import { getBookBySlug, LibraryBook } from '@/lib/library_data'
import LibraryBookCover from '@/components/LibraryBookCover'

export default function BookDetailPage() {
  const { slug } = useParams()
  const [book, setBook] = useState<LibraryBook | null>(null)
  const [loading, setLoading] = useState(true)

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
          const b = data as LibraryBook
          if (fallbackBook) {
            // Keep fallback fields if missing in DB
            b.legal_class = b.legal_class || fallbackBook.legal_class
            b.publisher = b.publisher || fallbackBook.publisher
            b.isbn = b.isbn || fallbackBook.isbn
            b.doi = b.doi || fallbackBook.doi
            b.worldcat_url = b.worldcat_url || fallbackBook.worldcat_url
            b.openlibrary_url = b.openlibrary_url || fallbackBook.openlibrary_url
          }
          setBook(b)
        } else if (fallbackBook) {
          setBook(fallbackBook)
        }
      } catch (err) {
        console.error('Failed to load book from supabase, using fallback:', err)
        if (fallbackBook) {
          setBook(fallbackBook)
        }
      } finally {
        setLoading(false)
      }
    }
    if (slug) loadBook()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium text-sm">Loading academic book card...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Book Card Not Found</h2>
        <p className="text-slate-400 mb-6 text-sm">The requested reference volume could not be located in the catalog.</p>
        <Link
          href="/library"
          className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bookshelf
        </Link>
      </div>
    )
  }

  const isClassA = book.legal_class === 'Class A'
  const isClassB = book.legal_class === 'Class B'
  const isClassD = book.legal_class === 'Class D'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      {/* Top Breadcrumb Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-3.5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
          </Link>

          <div className="flex items-center gap-2">
            {isClassA && (
              <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold uppercase">
                ⭐ Class A: PolymerHub Original
              </span>
            )}
            {isClassB && (
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold uppercase">
                🟢 Class B: Open Access PDF
              </span>
            )}
            {isClassD && (
              <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Class D: External Reference Card
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cover Card & Legal Status */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl sticky top-6">
            
            {/* Visual Book Cover */}
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-md mb-6">
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
                isHero={true}
              />
            </div>

            {/* Quick Metadata List */}
            <div className="space-y-3 mb-6 text-xs border-b border-slate-800 pb-5 font-mono">
              {book.publisher && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Publisher:</span>
                  <span className="font-semibold text-white">{book.publisher}</span>
                </div>
              )}
              {book.publication_year && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Publication Year:</span>
                  <span className="font-semibold text-white">{book.publication_year}</span>
                </div>
              )}
              {book.isbn && (
                <div className="flex justify-between">
                  <span className="text-slate-400">ISBN-13:</span>
                  <span className="font-mono text-amber-300">{book.isbn}</span>
                </div>
              )}
              {book.doi && (
                <div className="flex justify-between">
                  <span className="text-slate-400">DOI:</span>
                  <span className="font-mono text-amber-300 truncate max-w-[160px]">{book.doi}</span>
                </div>
              )}
            </div>

            {/* Primary Action Buttons based on Legal Class */}
            <div className="space-y-3">
              {isClassA && (
                <Link
                  href={`/library/${book.slug}/read`}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase py-3 rounded-xl shadow-lg transition-all"
                >
                  <BookOpen className="w-4 h-4" /> Launch Interactive Reader
                </Link>
              )}

              {isClassB && book.file_url && (
                <a
                  href={book.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase py-3 rounded-xl shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" /> Download / Open Verified PDF
                </a>
              )}

              {isClassD && (
                <div className="space-y-2">
                  {book.purchase_url && (
                    <a
                      href={book.purchase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs uppercase py-3 rounded-xl transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> Publisher / Merchant Link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {book.worldcat_url && (
                    <a
                      href={book.worldcat_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono font-bold text-xs uppercase py-2.5 rounded-xl transition-all"
                    >
                      <LibraryIcon className="w-4 h-4 text-amber-400" /> Find in Library (WorldCat) <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right 2 Columns: Book Synopsis, Syllabus Links & Table of Contents */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Book Information */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                {book.focus}
              </span>
              <h1 className="font-display font-black text-2xl md:text-3xl text-white leading-snug">
                {book.title}
              </h1>
              <p className="text-sm text-slate-300 mt-2 font-medium">by {book.authors}</p>
            </div>

            {/* Legal Class Partition Warning / Notice */}
            <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
              isClassA ? 'bg-purple-950/60 border-purple-800 text-purple-200' :
              isClassB ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' :
              'bg-amber-950/40 border-amber-800/80 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Legal Partition Status: {book.legal_class}
              </div>
              <p>{book.notice}</p>
            </div>

            {/* Book Executive Summary */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-white">Executive Summary</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {book.summary}
              </p>
            </div>

            {/* Target Careers & Syllabus Alignment */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target Industry Careers &amp; Academic Focus
              </h4>
              <div className="flex flex-wrap gap-2">
                {book.careers.map((career, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono font-medium">
                    💼 {career}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Table of Contents / Chapter Syllabus Overview */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center justify-between">
              <span>Table of Contents / Chapter Index</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                {book.toc.length} Chapters Cataloged
              </span>
            </h3>

            <div className="space-y-2.5">
              {book.toc.map((chap, idx) => (
                <div
                  key={chap.id || idx}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300 hover:border-slate-700 transition-colors"
                >
                  <span className="font-medium">{chap.title}</span>
                  {isClassA ? (
                    <Link
                      href={`/library/${book.slug}/read#${chap.id}`}
                      className="text-purple-400 hover:text-purple-300 font-bold uppercase text-[10px] shrink-0 ml-3"
                    >
                      Read Chapter &rarr;
                    </Link>
                  ) : (
                    <span className="text-[10px] text-slate-500 uppercase">Chapter Reference</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
