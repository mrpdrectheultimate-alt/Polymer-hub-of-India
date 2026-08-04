// src/app/api/simulations/sessions/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('virtual_lab_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

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
    const { lab_id, parameters, results } = body

    if (!lab_id) {
      return NextResponse.json({ error: 'lab_id is required' }, { status: 400 })
    }

    // Insert lab session record
    const { data, error } = await supabase
      .from('virtual_lab_sessions')
      .insert({
        user_id: session.user.id,
        lab_id,
        parameters: typeof parameters === 'string' ? JSON.parse(parameters) : parameters,
        results: typeof results === 'string' ? JSON.parse(results) : results,
        xp_awarded: 15
      })
      .select()
      .single()

    if (error) throw error

    // Award +15 XP to the student's profile!
    await supabase.from('profiles').select('xp_points').eq('id', session.user.id).single().then(async ({ data: profile }) => {
      if (profile) {
        await supabase
          .from('profiles')
          .update({ xp_points: (profile.xp_points || 0) + 15 })
          .eq('id', session.user.id)
      }
    })

    return NextResponse.json(data)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
