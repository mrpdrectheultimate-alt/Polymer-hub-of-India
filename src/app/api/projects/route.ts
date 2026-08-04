import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const supabase = createClient()

    let query = supabase
      .from('student_projects')
      .select('*, profiles(id, full_name, email)')
      .eq('status', 'published')
      .order('upvotes', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: projects, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Projects GET error:', error)
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

    const body = await request.json()
    const { action, projectId, title, description, category, imageUrl, githubUrl, teamMembers, guideName, guideOrg, tags } = body

    if (action === 'upvote') {
      if (!projectId) {
        return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
      }

      // Check if already upvoted
      const { data: existing } = await supabase
        .from('project_upvotes')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'You have already upvoted this project.' }, { status: 400 })
      }

      // Record upvote
      const { error: upvoteInsertError } = await supabase
        .from('project_upvotes')
        .insert({ user_id: user.id, project_id: projectId })

      if (upvoteInsertError) {
        return NextResponse.json({ error: upvoteInsertError.message }, { status: 500 })
      }

      // Fetch current upvotes
      const { data: project } = await supabase
        .from('student_projects')
        .select('upvotes')
        .eq('id', projectId)
        .single()

      const currentUpvotes = project?.upvotes || 0

      // Increment count
      const { error: updateError } = await supabase
        .from('student_projects')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', projectId)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, upvotes: currentUpvotes + 1 })
    }

    // Submit new project
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields: title, description, category' }, { status: 400 })
    }

    const { data: newProject, error: insertError } = await supabase
      .from('student_projects')
      .insert({
        user_id: user.id,
        title,
        description,
        category,
        image_url: imageUrl || null,
        github_url: githubUrl || null,
        team_members: teamMembers || [],
        guide_name: guideName || null,
        guide_org: guideOrg || null,
        tags: tags || [],
        status: 'published',
        upvotes: 0,
        views: 0
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, project: newProject })
  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
