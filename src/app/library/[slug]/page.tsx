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
            <div className="h-64 rounded-xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 relative p-6 flex flex-col justify-between text-white border border-slate-800 shadow-md mb-6">
              <span className="self-start text-[9px] uppercase font-mono font-black tracking-widest px-2.5 py-1 rounded bg-black/40 border border-white/20">
                {book.legal_class}
              </span>
              <div>
                <h3 className="font-extrabold text-lg leading-snug line-clamp-3 text-amber-300">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">by {book.authors}</p>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>{book.difficulty}</span>
                <BookOpen className="w-4 h-4 text-amber-400/50" />
              </div>
            </div>

            {/* Quick Metadata List */}
            <div className="space-y-3 mb-6 text-xs border-b border-slate-800 pb-5">
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-md"
                >
                  <Sparkles className="w-4 h-4" /> Launch Interactive Reading Room
                </Link>
              )}

              {isClassB && (
                <>
                  {book.file_url && (
                    <a
                      href={book.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-md"
                    >
                      <Download className="w-4 h-4" /> Download / View Official PDF
                    </a>
                  )}
                  <Link
                    href={`/library/${book.slug}/read`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition-all text-xs border border-slate-700"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Read Open Access Summary
                  </Link>
                </>
              )}

              {isClassD && (
                <>
                  {book.purchase_url && (
                    <a
                      href={book.purchase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl transition-all text-xs shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4" /> Buy Edition (Amazon / Publisher)
                    </a>
                  )}
                  {book.worldcat_url && (
                    <a
                      href={book.worldcat_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition-all text-xs border border-slate-700"
                    >
                      <LibraryIcon className="w-4 h-4 text-blue-400" /> Find in University Library (WorldCat)
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Bibliographic Metadata & Table of Contents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Legal Rights Banner */}
          {isClassD && (
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    External Reference Catalog Card (Class D)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Full text copyright for <em>"{book.title}"</em> is strictly held by {book.publisher || 'the original authors and publisher'}. PolymerHub displays verified bibliographic metadata, ISBN/DOI details, and Table of Contents for academic citation and discovery. Zero unauthorized body text is hosted.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isClassA && (
            <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-5">
              <div className="flex items-start gap-3.5">
                <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-purple-200">
                    PolymerHub Proprietary Original Guide (Class A)
                  </h4>
                  <p className="text-xs text-purple-300 mt-1 leading-relaxed">
                    100% original, interactive technical guide written by the PolymerHub Academic Board. Includes KaTeX math formulas, shop-floor parameters, worked examples, and interactive calculators.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Book Summary & Focus */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3">Executive Summary</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{book.summary}</p>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Engineering Focus</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{book.focus}</p>
            </div>
          </div>

          {/* Table of Contents Index */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-amber-400" /> Table of Contents Reference
              </h3>
              <span className="text-xs font-mono text-slate-400">{book.toc?.length || 0} Modules Listed</span>
            </div>

            <div className="space-y-2.5">
              {book.toc?.map((chapter, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-amber-300">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-200">{chapter.title}</span>
                  </div>

                  {isClassA && (
                    <Link
                      href={`/library/${book.slug}/read?ch=${chapter.id}`}
                      className="text-[11px] font-bold text-purple-400 hover:text-purple-300"
                    >
                      Read Chapter &rarr;
                    </Link>
                  )}
                  {isClassB && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Open Access Reference
                    </span>
                  )}
                  {isClassD && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Citation Index
                    </span>
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
