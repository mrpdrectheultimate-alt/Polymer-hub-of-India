// src/app/api/research/pitches/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
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
        user_id: session.user.id,
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
    await supabase.from('profiles').select('xp_points').eq('id', session.user.id).single().then(async ({ data: profile }) => {
      if (profile) {
        await supabase
          .from('profiles')
          .update({ xp_points: (profile.xp_points || 0) + 10 })
          .eq('id', session.user.id)
      }
    })

    return NextResponse.json(data)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
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
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
