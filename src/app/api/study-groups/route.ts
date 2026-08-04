// src/app/api/study-groups/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user.id

    // Fetch study groups with member details and subject details
    const { data: groups, error: groupsError } = await supabase
      .from('study_groups')
      .select('*, study_group_members(user_id), subjects(name)')
      .eq('is_public', true)

    if (groupsError) throw groupsError

    const formattedGroups = (groups || []).map(group => {
      const members = group.study_group_members || []
      return {
        id: group.id,
        name: group.name,
        description: group.description,
        subject_id: group.subject_id,
        subject_name: group.subjects?.name || 'General',
        created_by: group.created_by,
        is_public: group.is_public,
        created_at: group.created_at,
        member_count: members.length,
        is_member: userId ? members.some((m: { user_id: string }) => m.user_id === userId) : false
      }
    })

    return NextResponse.json({ data: formattedGroups })

  } catch (error) {
    console.error('Study groups GET error:', error)
    const errMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const userId = session.user.id
    const body = await req.json()
    const { action, groupId, name, description, subjectId, isPublic = true } = body

    if (action === 'create') {
      if (!name) return NextResponse.json({ error: 'Group name is required' }, { status: 400 })

      // Create study group
      const { data: newGroup, error: createError } = await supabase
        .from('study_groups')
        .insert({
          name,
          description,
          subject_id: subjectId || null,
          created_by: userId,
          is_public: isPublic
        })
        .select()
        .single()

      if (createError) throw createError

      // Automatically join the newly created group as a member
      const { error: joinError } = await supabase
        .from('study_group_members')
        .insert({
          group_id: newGroup.id,
          user_id: userId
        })

      if (joinError) throw joinError

      // Award XP for joining/creating a study group
      try {
        const host = req.headers.get('host') || 'localhost:3000'
        const protocol = host.includes('localhost') ? 'http' : 'https'
        await fetch(`${protocol}://${host}/api/xp/award`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({ action: 'study_group_join', reference: newGroup.id })
        })
      } catch (e) {
        console.warn('Failed to award study group XP:', e)
      }

      return NextResponse.json({ success: true, group: newGroup })
    }

    if (action === 'join') {
      if (!groupId) return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })

      const { error: joinError } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: userId
        })

      if (joinError) {
        if (joinError.code === '23505') { // Already joined
          return NextResponse.json({ success: true, message: 'Already a member' })
        }
        throw joinError
      }

      // Award XP for joining a study group
      try {
        const host = req.headers.get('host') || 'localhost:3000'
        const protocol = host.includes('localhost') ? 'http' : 'https'
        await fetch(`${protocol}://${host}/api/xp/award`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({ action: 'study_group_join', reference: groupId })
        })
      } catch (e) {
        console.warn('Failed to award study group XP:', e)
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'leave') {
      if (!groupId) return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })

      const { error: leaveError } = await supabase
        .from('study_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId)

      if (leaveError) throw leaveError

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Study groups POST error:', error)
    const errMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}
