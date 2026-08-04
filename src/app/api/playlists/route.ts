// src/app/api/playlists/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('title', { ascending: true })

    if (error) throw error
    return NextResponse.json({ playlists: data ?? [] })
  } catch (err) {
    console.error('Playlists GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
  }
}
