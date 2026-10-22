import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(`inquiry:${clientIp}`, { limit: 5, windowMs: 60 * 1000 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many inquiries submitted. Please wait a moment before trying again.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          }
        }
      )
    }

    const supabase = createClient()
    const { companyName, contactName, email, phone, interestArea, message } = await request.json()

    if (!companyName || !contactName || !email || !interestArea || !message) {
      return NextResponse.json({ error: 'Missing required inquiry parameters' }, { status: 400 })
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const { error } = await supabase
      .from('enterprise_inquiries')
      .insert({
        company_name: String(companyName).trim(),
        contact_name: String(contactName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        interest_area: String(interestArea).trim(),
        message: String(message).trim()
      })

    if (error) {
      console.error('Enterprise inquiry insertion error:', error.message)
      return NextResponse.json(
        { error: 'Unable to submit inquiry at this time. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Enterprise inquiry route error:', error)
    return NextResponse.json({ error: 'Internal server error processing inquiry' }, { status: 500 })
  }
}
