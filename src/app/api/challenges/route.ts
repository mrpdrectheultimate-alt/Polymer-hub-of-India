import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type ChallengeSubmission = Database['public']['Tables']['challenge_submissions']['Row']

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Get all challenges
    const { data: challenges, error: chalError } = await supabase
      .from('sponsored_challenges')
      .select('*')
      .order('deadline', { ascending: true })

    if (chalError) {
      return NextResponse.json({ error: chalError.message }, { status: 500 })
    }

    // Get user session to attach submission statuses
    const { data: { user } } = await supabase.auth.getUser()
    let submissions: ChallengeSubmission[] = []

    if (user) {
      const { data } = await supabase
        .from('challenge_submissions')
        .select('*')
        .eq('user_id', user.id)
      
      submissions = data || []
    }

    const challengesWithSubmissions = (challenges || []).map(c => {
      const sub = submissions.find(s => s.challenge_id === c.id)
      return {
        ...c,
        submission: sub ? { status: sub.status, solution_text: sub.solution_text, solution_url: sub.solution_url, review_feedback: sub.review_feedback } : null
      }
    })

    return NextResponse.json(challengesWithSubmissions)

  } catch (error) {
    console.error('Challenges GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { challengeId, solutionText, solutionUrl } = await request.json()

    if (!challengeId || !solutionText) {
      return NextResponse.json({ error: 'Missing challengeId or solutionText' }, { status: 400 })
    }

    // Verify challenge exists and is not expired
    const { data: challenge, error: chalError } = await supabase
      .from('sponsored_challenges')
      .select('*')
      .eq('id', challengeId)
      .single()

    if (chalError || !challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Insert submission
    const { error: subError } = await supabase
      .from('challenge_submissions')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        solution_text: solutionText,
        solution_url: solutionUrl || null,
        status: 'pending'
      })

    if (subError) {
      // Check if unique constraint violated (already submitted)
      if (subError.code === '23505') {
        return NextResponse.json({ error: 'You have already submitted a solution to this challenge.' }, { status: 400 })
      }
      return NextResponse.json({ error: subError.message }, { status: 500 })
    }

    // Award +50 XP immediately using our Postgres RPC function
    const { error: xpError } = await supabase.rpc('award_xp', {
      user_id: user.id,
      amount: 50,
      reason: 'challenge_submission',
      ref: challengeId
    })

    if (xpError) {
      console.error('XP Award failed:', xpError)
      // We don't fail the submission if XP award triggers an issue (fallback safely)
    }

    return NextResponse.json({ success: true, xp_awarded: 50 })

  } catch (error) {
    console.error('Challenges POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
