import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify recruiter
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_recruiter, recruiter_company')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_recruiter || !profile.recruiter_company) {
      return NextResponse.json({ error: 'Unauthorized: Recruiter access required' }, { status: 403 })
    }

    // Fetch challenges sponsored by this company
    const { data: challenges } = await supabase
      .from('sponsored_challenges')
      .select('id')
      .eq('company_name', profile.recruiter_company)

    const challengeIds = (challenges || []).map(c => c.id)

    if (challengeIds.length === 0) {
      return NextResponse.json({ submissions: [] })
    }

    // Fetch submissions for these challenges with student profiles
    const { data: submissions, error } = await supabase
      .from('challenge_submissions')
      .select(`
        *,
        profiles:user_id (id, full_name, email, college_name, xp_points),
        sponsored_challenges:challenge_id (id, title, difficulty)
      `)
      .in('challenge_id', challengeIds)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch submissions error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions: submissions || [] })

  } catch (error) {
    console.error('Recruiter submissions route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Recruiters can also POST a new challenge sponsored by their company
export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify recruiter
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_recruiter, recruiter_company')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_recruiter || !profile.recruiter_company) {
      return NextResponse.json({ error: 'Unauthorized: Recruiter access required' }, { status: 403 })
    }

    const { title, description, prizePool, difficulty, deadline, criteria } = await request.json()

    if (!title || !description || !prizePool || !deadline || !criteria) {
      return NextResponse.json({ error: 'Missing required challenge parameters' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('sponsored_challenges')
      .insert({
        title,
        description,
        prize_pool: prizePool,
        difficulty: difficulty || 'Medium',
        deadline: new Date(deadline).toISOString(),
        criteria,
        company_name: profile.recruiter_company
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, challenge: data })

  } catch (error) {
    console.error('Create challenge route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
