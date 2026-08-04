// src/app/api/careers/resume/route.ts
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
      .from('resume_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (error) throw error

    return NextResponse.json(data || null)
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
    const { full_name, email, phone, education, experience, projects, skills } = body

    if (!full_name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required contact fields' }, { status: 400 })
    }

    // Upsert using supabase
    const { data, error } = await supabase
      .from('resume_profiles')
      .upsert({
        user_id: session.user.id,
        full_name,
        email,
        phone,
        education: typeof education === 'string' ? JSON.parse(education) : education,
        experience: typeof experience === 'string' ? JSON.parse(experience) : experience,
        projects: typeof projects === 'string' ? JSON.parse(projects) : projects,
        skills: Array.isArray(skills) ? skills : [],
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
