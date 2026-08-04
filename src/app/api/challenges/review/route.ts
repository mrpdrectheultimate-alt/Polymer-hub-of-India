import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

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

    if (!profile || !profile.is_recruiter) {
      return NextResponse.json({ error: 'Unauthorized: Recruiter access required' }, { status: 403 })
    }

    const { submissionId, status, feedback } = await request.json()

    if (!submissionId || !status) {
      return NextResponse.json({ error: 'Missing submissionId or status' }, { status: 400 })
    }

    // Fetch submission details to ensure it belongs to this recruiter's company
    const { data: submission, error: subError } = await supabase
      .from('challenge_submissions')
      .select('*, sponsored_challenges(*)')
      .eq('id', submissionId)
      .single()

    if (subError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const challenge = submission.sponsored_challenges as { company_name: string }
    if (challenge.company_name !== profile.recruiter_company) {
      return NextResponse.json({ error: 'Unauthorized: You can only review submissions for your own company\'s challenges.' }, { status: 403 })
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from('challenge_submissions')
      .update({
        status,
        review_feedback: feedback || null,
        reviewed_at: new Date().toISOString(),
        xp_rewarded: status === 'accepted' ? 200 : 0
      })
      .eq('id', submissionId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // If accepted, award +200 XP bonus
    if (status === 'accepted') {
      const { error: xpError } = await supabase.rpc('award_xp', {
        user_id: submission.user_id,
        amount: 200,
        reason: 'challenge_accepted',
        ref: submission.challenge_id
      })

      if (xpError) {
        console.error('XP Award failed:', xpError)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Challenge review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
