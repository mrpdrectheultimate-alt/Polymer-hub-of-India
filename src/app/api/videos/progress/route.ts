// src/app/api/videos/progress/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { awardUserXP } from '@/lib/xp'

// GET — fetch user's watch progress for all videos
export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ progress: [] })

    const { data, error } = await supabase
      .from('video_watch_progress')
      .select('video_id, progress_seconds, completed, last_watched_at')
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ progress: data ?? [] })
  } catch (err) {
    console.error('Watch progress GET error:', err)
    return NextResponse.json({ progress: [] })
  }
}

// POST — upsert watch progress for a video
export async function POST(request: Request) {
  try {
    const { videoId, progressSeconds, completed } = await request.json()
    if (!videoId) return NextResponse.json({ error: 'videoId required' }, { status: 400 })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('video_watch_progress')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        progress_seconds: progressSeconds ?? 0,
        completed: completed ?? false,
        last_watched_at: new Date().toISOString(),
      }, { onConflict: 'user_id,video_id' })

    if (error) throw error

    // Award XP for completing a video
    if (completed) {
      try {
        await awardUserXP(supabase, {
          userId: user.id,
          action: 'video_complete',
          reference: videoId
        })
      } catch (xpErr) {
        console.warn('Video XP award failed:', xpErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Watch progress POST error:', err)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
