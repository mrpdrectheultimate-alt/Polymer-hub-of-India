// src/app/api/videos/watchlist/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET — fetch current user's watchlist
export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('video_watchlist')
      .select('video_id, added_at')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ watchlist: data ?? [] })
  } catch (err) {
    console.error('Watchlist GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }
}

// POST — add video to watchlist
export async function POST(request: Request) {
  try {
    const { videoId } = await request.json()
    if (!videoId) return NextResponse.json({ error: 'videoId required' }, { status: 400 })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('video_watchlist')
      .upsert({ user_id: user.id, video_id: videoId }, { onConflict: 'user_id,video_id' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Watchlist POST error:', err)
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 })
  }
}

// DELETE — remove video from watchlist
export async function DELETE(request: Request) {
  try {
    const { videoId } = await request.json()
    if (!videoId) return NextResponse.json({ error: 'videoId required' }, { status: 400 })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('video_watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('video_id', videoId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Watchlist DELETE error:', err)
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 })
  }
}
