// src/app/api/research/patents/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const jurisdiction = searchParams.get('jurisdiction')

    let query = supabase
      .from('patents')
      .select('*')
      .order('publication_date', { ascending: false })

    if (jurisdiction && jurisdiction !== 'all') {
      query = query.eq('jurisdiction', jurisdiction)
    }

    if (q) {
      query = query.or(`patent_number.ilike.%${q}%,title.ilike.%${q}%,abstract.ilike.%${q}%,inventors.ilike.%${q}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
