// src/components/FlashcardWidget.tsx
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, BrainCircuit } from 'lucide-react'

interface Flashcard {
  id: string
  book_id: string
  chapter_id: string
  front: string
  back: string
}

export function FlashcardWidget() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await fetch('/api/library/flashcards')
        if (res.ok) {
          const data = await res.json()
          setCards(data)
        }
      } catch (err) {
        console.error('Failed to load flashcards:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCards()
  }, [])

  const deleteCard = async (id: string) => {
    try {
      const res = await fetch(`/api/library/flashcards?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setCards(prev => prev.filter(c => c.id !== id))
        setFlipped(false)
        if (currentIndex >= cards.length - 1 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1)
        }
      }
    } catch (err) {
      console.error('Failed to delete flashcard:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border-4 border-slate-900 rounded-xl p-6 text-center shadow-hard">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-mono">Loading revision deck...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="bg-white border-4 border-slate-900 rounded-xl p-6 text-center shadow-hard">
        <div className="text-3xl mb-2">📚</div>
        <h4 className="font-display font-black text-sm uppercase tracking-wide mb-1">No Flashcards Yet</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Double-click terms or highlight paragraphs while reading original guides in the library to create study revision decks.
        </p>
      </div>
    )
  }

  const currentCard = cards[currentIndex]

  return (
    <div className="bg-white border-4 border-slate-900 rounded-xl p-6 shadow-hard">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 className="font-display font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
          <BrainCircuit className="w-4 h-4 text-violet-600 shrink-0" /> Revision Deck
        </h3>
        <span className="font-mono text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>
      
      {/* 3D Flip Card Container */}
      <div 
        className="relative min-h-[220px] w-full cursor-pointer group perspective-1000 mb-4"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full min-h-[220px] duration-500 transform-style-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front side */}
          <div className="absolute inset-0 w-full h-full backface-hidden border-2 border-slate-950 rounded-xl p-5 bg-[#FAF9F6] flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="font-bold text-sm text-slate-800 line-clamp-6 leading-relaxed italic">
                &ldquo;{currentCard.front}&rdquo;
              </p>
            </div>
            <div className="text-center font-mono text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-2">
              Tap to Flip &amp; Reveal Definition
            </div>
          </div>

          {/* Back side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-slate-950 rounded-xl p-5 bg-violet-50/30 flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="font-semibold text-xs text-slate-700 leading-relaxed">
                {currentCard.back}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-violet-100/50 pt-2 mt-2">
              <span className="font-mono text-[8px] uppercase font-bold text-slate-400">Answer / Annotation</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCard(currentCard.id)
                }}
                className="inline-flex items-center gap-1 text-[9px] uppercase font-black tracking-wider text-green-600 hover:text-green-700 transition-colors"
                title="Remove from deck"
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-current" /> Got It
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex gap-2">
        <button 
          className="flex-1 border-2 border-slate-900 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
          onClick={() => {
            setCurrentIndex((currentIndex - 1 + cards.length) % cards.length)
            setFlipped(false)
          }}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>
        <button 
          className="flex-1 border-2 border-slate-900 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
          onClick={() => {
            setCurrentIndex((currentIndex + 1) % cards.length)
            setFlipped(false)
          }}
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
