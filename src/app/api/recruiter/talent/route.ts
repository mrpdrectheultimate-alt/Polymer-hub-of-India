import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Create a service role client to query all profiles bypass RLS (secure server-side)
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createSupabaseClient(supabaseUrl, serviceRoleKey)
}

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
      .select('is_recruiter, recruiter_company')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_recruiter) {
      return NextResponse.json({ error: 'Unauthorized: Recruiter access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const minXP = parseInt(searchParams.get('minXP') || '0', 10)
    const search = searchParams.get('search') || ''
    const college = searchParams.get('college') || ''
    const branch = searchParams.get('branch') || ''
    const targetPath = searchParams.get('targetPath') || ''

    const adminSupabase = createAdminClient()

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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ candidates })

  } catch (error) {
    console.error('Recruiter talent route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
