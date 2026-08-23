'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, ShieldCheck, Download, ExternalLink, ArrowLeft, Play, ListCollapse, Award } from 'lucide-react'

import { getBookBySlug } from '@/lib/library_data'

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
  toc: { id: string; title: string }[]
  purchase_url?: string
  file_url?: string
  careers: string[]
  subject_slugs: string[]
}

export default function BookDetailPage() {
  const { slug } = useParams()
  const [book, setBook] = useState<Book | null>(null)
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
          const b = data as Book
          if (fallbackBook && !b.file_url && fallbackBook.file_url) {
            b.file_url = fallbackBook.file_url
          }
          setBook(b)
        } else if (fallbackBook) {
          setBook(fallbackBook as unknown as Book)
        }
      } catch (err) {
        console.error('Failed to load book from supabase, using fallback:', err)
        if (fallbackBook) {
          setBook(fallbackBook as unknown as Book)
        }
      } finally {
        setLoading(false)
      }
    }
    if (slug) loadBook()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading book profile...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Book Not Found</h2>
        <p className="text-slate-500 mb-6">The requested reference book or guide could not be found.</p>
        <Link
          href="/library"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>
      </div>
    )
  }

  const isOriginal = book.category === 'original_guide'
  const isOpenAccess = book.category === 'open_access'
  const isCommercial = book.category === 'commercial'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Navigation Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bookshelf
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-medium truncate">{book.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Book Details Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm sticky top-6">
            {/* Book Cover Design */}
            <div className="h-64 rounded-lg bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative p-6 flex flex-col justify-between text-white border-2 border-slate-200 shadow-md mb-6">
              <span className="self-start text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded border border-white/20 bg-white/5">
                {book.category.replace('_', ' ')}
              </span>
              <div>
                <h3 className="font-extrabold text-lg leading-snug line-clamp-3">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">by {book.authors}</p>
              </div>
              <div className="absolute right-4 bottom-4 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <BookOpen className="w-4 h-4 text-white/30" />
              </div>
            </div>

            {/* Difficulty and Classification */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  Difficulty Level
                </span>
                <span className="inline-flex text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {book.difficulty}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                  Target Careers
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {book.careers.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-medium text-blue-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Action Triggers */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {(isOriginal || isOpenAccess) && (
                <Link
                  href={`/library/${book.slug}/read`}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-4 py-3 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <Play className="w-4 h-4 fill-white" /> Launch Reading Room
                </Link>
              )}

              {isOpenAccess && book.file_url && (
                <a
                  href={book.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Original PDF
                </a>
              )}

              {isCommercial && book.purchase_url && (
                <a
                  href={book.purchase_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-3 rounded-lg shadow-sm hover:shadow transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> View Purchase Options
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Book Synopsis & Chapters */}
        <div className="lg:col-span-2 space-y-8">
          {/* About/Synopsis */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Book Synopsis
            </h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              {book.summary}
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Core Focus Area
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {book.focus}
              </p>
            </div>
          </div>

          {/* Table of Contents (TOC) */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <ListCollapse className="w-5 h-5 text-slate-600" /> Table of Contents
            </h2>
            {book.toc && book.toc.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {book.toc.map((chapter, index) => {
                  return (
                    <div
                      key={chapter.id}
                      className="py-4 flex justify-between items-center group transition-colors"
                    >
                      <div className="flex gap-4 items-center">
                        <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                          {chapter.title}
                        </span>
                      </div>
                      
                      {/* Interactive read buttons */}
                      {(isOriginal || isOpenAccess) ? (
                        <Link
                          href={`/library/${book.slug}/read?ch=${chapter.id}`}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Read Chapter
                        </Link>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Reference Only
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">No chapters defined in study profile.</p>
            )}
          </div>

          {/* Academic Compliance Standard */}
          {isCommercial && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4 items-start shadow-sm">
              <Award className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-blue-900 text-sm mb-1">
                  Copyright Notice & Reference Information
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  In compliance with copyright laws, PolymerHub does not distribute digital copies of commercial textbooks. We provide structured guides detailing tables of contents, study focuses, and links to purchase or borrow them legally. Use these profiles to align your reading with corresponding curriculum topics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
