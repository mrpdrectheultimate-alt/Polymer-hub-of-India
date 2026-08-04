'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LessonNotesProps {
  lessonSlug: string
}

export function LessonNotes({ lessonSlug }: LessonNotesProps) {
  const supabase = createClient()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('Untitled Note')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

  // Fetch initial note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setIsAuthenticated(false)
          return
        }
        setIsAuthenticated(true)

        const { data, error } = await supabase
          .from('user_lesson_notes')
          .select('content, note_title, updated_at')
          .eq('lesson_slug', lessonSlug)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Notes fetch error:', error)
          return
        }

        if (data) {
          setContent(data.content || '')
          setTitle(data.note_title || 'Untitled Note')
          setSavedAt(data.updated_at)
        } else {
          setContent('')
          setTitle('Untitled Note')
          setSavedAt(null)
        }
      } catch (err) {
        console.error('Error fetching note:', err)
      }
    }

    fetchNote()
  }, [lessonSlug, supabase])

  // Save function
  const saveNote = async (updatedContent: string, updatedTitle: string) => {
    setSaving(true)
    setErrorMsg(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setErrorMsg('Log in to save notes')
        setSaving(false)
        return
      }

      const { error } = await supabase
        .from('user_lesson_notes')
        .upsert({
          user_id: user.id,
          lesson_slug: lessonSlug,
          content: updatedContent,
          note_title: updatedTitle,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_slug'
        })

      if (error) {
        throw error
      }

      setSavedAt(new Date().toISOString())
    } catch (err: unknown) {
      console.error('Save note error:', err)
      const error = err as Error
      setErrorMsg(error.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // Handle changes with debounce autosave
  const handleContentChange = (val: string) => {
    setContent(val)
    
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
    }

    autoSaveTimer.current = setTimeout(() => {
      saveNote(val, title)
    }, 1500) // Auto-save after 1.5 seconds of inactivity
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
    }

    autoSaveTimer.current = setTimeout(() => {
      saveNote(content, val)
    }, 1500)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FFF8E7] border-4 border-ink rounded-2xl p-6 text-center space-y-2">
        <span className="text-2xl">📝</span>
        <h4 className="font-display text-base font-black text-ink uppercase">Personal Lesson Notes</h4>
        <p className="font-mono text-[9px] text-slate-500 uppercase">Please sign in to write and save notes during lessons</p>
      </div>
    )
  }

  return (
    <div className="bg-[#FFF8E7] border-4 border-ink rounded-2xl p-5 shadow-hard space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">📝</span>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent border-b-2 border-dashed border-ink/40 focus:border-ink focus:outline-none font-display font-black text-ink text-sm w-full uppercase"
            placeholder="Note title..."
          />
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-3 text-[10px]">
          {savedAt && (
            <span className="font-mono text-slate-500">
              SAVED: {new Date(savedAt).toLocaleTimeString()}
            </span>
          )}
          
          <button
            onClick={() => saveNote(content, title)}
            disabled={saving}
            className="border-2 border-ink bg-blue-600 hover:bg-blue-700 text-white font-mono text-[9px] font-black uppercase px-3 py-1 shadow-hard-xs transition-transform active:translate-y-0.5"
          >
            {saving ? 'Saving...' : '💾 Force Save'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border-2 border-red-500 text-red-700 p-2 text-[10px] font-mono rounded">
          ⚠️ {errorMsg}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Type your notes here... This is your private workspace. Content auto-saves as you type."
        className="w-full min-h-[160px] bg-transparent border-2 border-ink rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono leading-relaxed resize-y"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 font-mono text-[9px] text-slate-500 uppercase">
        <span>💡 Private workspace. Auto-saves 1.5s after typing.</span>
        <span>{content.length} characters</span>
      </div>
    </div>
  )
}
