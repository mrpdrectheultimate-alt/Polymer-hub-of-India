// src/app/api/research/pitches/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { awardUserXP } from '@/lib/xp'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')

    let query = supabase
      .from('research_pitches')
      .select('*, profiles(full_name, avatar_url, college_name)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (subject && subject !== 'all') {
      query = query.eq('subject_slug', subject)
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, subject_slug, contact_info } = body

    if (!title || !description || !contact_info) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('research_pitches')
      .insert({
        user_id: user.id,
        title,
        description,
        subject_slug,
        contact_info,
        status: 'open'
      })
      .select('*, profiles(full_name, avatar_url, college_name)')
      .single()

    if (error) throw error

    // Award +10 XP for starting a research pitch!
    try {
      await awardUserXP(supabase, {
        userId: user.id,
        action: 'research_pitch',
        reference: data.id
      })
    } catch (xpErr) {
      console.warn('Research pitch XP award skipped:', xpErr)
    }

    return NextResponse.json(data)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('research_pitches')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
