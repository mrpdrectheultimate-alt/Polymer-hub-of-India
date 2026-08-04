// src/app/api/library/progress/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('book_id')
    const chapterId = searchParams.get('chapter_id')

    if (!bookId) {
      return NextResponse.json({ error: 'book_id is required' }, { status: 400 })
    }

    let query = supabase
      .from('library_reading_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('book_id', bookId)

    if (chapterId) {
      query = query.eq('chapter_id', chapterId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { book_id, chapter_id, progress_percent, seconds_spent } = body

    if (!book_id || !chapter_id) {
      return NextResponse.json({ error: 'book_id and chapter_id are required' }, { status: 400 })
    }

    // Attempt to select existing progress
    const { data: existing, error: fetchError } = await supabase
      .from('library_reading_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('book_id', book_id)
      .eq('chapter_id', chapter_id)
      .maybeSingle()

    if (fetchError) throw fetchError

    let result
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('library_reading_progress')
        .update({
          progress_percent: Math.max(existing.progress_percent || 0, progress_percent ?? 0),
          seconds_spent: (existing.seconds_spent || 0) + (seconds_spent ?? 0),
          last_read_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      result = data
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('library_reading_progress')
        .insert({
          user_id: session.user.id,
          book_id,
          chapter_id,
          progress_percent: progress_percent ?? 0,
          seconds_spent: seconds_spent ?? 0,
          last_read_at: new Date().toISOString()
        })
        .select()
        .single()
      if (error) throw error
      result = data
    }

    // Award minor XP points for reading progress milestones (e.g. 5 XP per chapter completed)
    if (result && result.progress_percent >= 90 && (!existing || existing.progress_percent < 90)) {
      // Trigger reward XP
      await supabase.from('profiles').select('xp_points').eq('id', session.user.id).single().then(async ({ data }) => {
        if (data) {
          const currentXp = data.xp_points || 0
          await supabase
            .from('profiles')
            .update({ xp_points: currentXp + 5 })
            .eq('id', session.user.id)
        }
      })
    }

    return NextResponse.json(result)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
