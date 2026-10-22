import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { isUserAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify recruiter status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_recruiter, recruiter_company, role, email')
      .eq('id', user.id)
      .single()

    const admin = isUserAdmin(user, profile)
    if (!profile || (!profile.is_recruiter && !admin)) {
      return NextResponse.json({ error: 'Unauthorized: Recruiter access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const minXP = parseInt(searchParams.get('minXP') || '0', 10)
    const search = searchParams.get('search') || ''
    const college = searchParams.get('college') || ''
    const branch = searchParams.get('branch') || ''
    const targetPath = searchParams.get('targetPath') || ''

    const adminSupabase = getAdminClient()

    let query = adminSupabase
      .from('profiles')
      .select('id, full_name, email, college_name, education_level, branch, graduation_year, target_path, xp_points, current_streak, total_lessons_completed, total_quizzes_passed, bio, goals')
      .gte('xp_points', minXP)
      .order('xp_points', { ascending: false })

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (college) {
      query = query.ilike('college_name', `%${college}%`)
    }
    if (branch) {
      query = query.ilike('branch', `%${branch}%`)
    }
    if (targetPath) {
      query = query.eq('target_path', targetPath)
    }

    const { data: candidates, error } = await query.limit(50)

    if (error) {
      console.error('Recruiter talent search error:', error)
      return NextResponse.json({ error: 'Failed to search candidate talent' }, { status: 500 })
    }

    return NextResponse.json({ candidates })

  } catch (error) {
    console.error('Recruiter talent route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
