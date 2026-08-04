import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { companyName, contactName, email, phone, interestArea, message } = await request.json()

    if (!companyName || !contactName || !email || !interestArea || !message) {
      return NextResponse.json({ error: 'Missing required inquiry parameters' }, { status: 400 })
    }

    const { error } = await supabase
      .from('enterprise_inquiries')
      .insert({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone: phone || null,
        interest_area: interestArea,
        message
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Enterprise inquiry error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
