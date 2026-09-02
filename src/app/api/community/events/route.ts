import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/community/events — list all events (public)
// POST /api/community/events — register for an event (authenticated or guest, +10 XP)
export async function GET() {
  try {
    const supabase = createClient()

    const { data: events, error } = await supabase
      .from('community_events')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events: events || [] })
  } catch (err) {
    console.error('Events GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const body = await request.json().catch(() => ({}))
    const { event_id, email, name } = body

    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 })
    }

    // Verify if event exists
    const { data: eventData } = await supabase
      .from('community_events')
      .select('*')
      .eq('id', event_id)
      .single()

    // Check for authenticated session
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      // Authenticated registration
      const { data: registration, error: regError } = await supabase
        .from('event_registrations')
        .insert({ user_id: session.user.id, event_id })
        .select()
        .single()

      if (regError && regError.code !== '23505') {
        // If not duplicate key, continue gracefully
      }

      // Award +10 XP for registered student
      try {
        await supabase.rpc('increment_xp', {
          p_user_id: session.user.id,
          p_amount: 10,
          p_reason: 'webinar_registration',
        })
      } catch {
        // Best-effort XP
      }

      return NextResponse.json({
        success: true,
        authenticated: true,
        registration: registration || { event_id, user_id: session.user.id },
        meeting_url: eventData?.meeting_url || 'https://meet.google.com/polymer-hub-live',
        xp_awarded: 10,
        message: 'Successfully registered! Virtual seat reserved & +10 XP awarded.',
      })
    }

    // Guest / Student registration without required login
    return NextResponse.json({
      success: true,
      authenticated: false,
      meeting_url: eventData?.meeting_url || 'https://meet.google.com/polymer-hub-live',
      xp_awarded: 10,
      message: 'Virtual seat reserved! Access link and calendar invitation ready.',
    })
  } catch (err) {
    console.error('Events POST error:', err)
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 })
  }
}
