// src/app/api/research/papers/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const subject = searchParams.get('subject')

    let query = supabase
      .from('research_papers')
      .select('*')
      .order('publication_year', { ascending: false })

    if (subject && subject !== 'all') {
      query = query.eq('subject_slug', subject)
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,abstract.ilike.%${q}%,authors.ilike.%${q}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
