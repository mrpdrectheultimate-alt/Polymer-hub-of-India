// src/app/api/contact/route.ts — In-App Contact Gateway submission handler
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CONTACT_CHANNELS, ContactChannel } from '@/lib/contact'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      role,
      subject,
      message,
      channel,
      pageUrl,
      website_hp // Honeypot field
    } = body

    // 1. Silent anti-bot rejection: If honeypot is filled, return success without processing
    if (website_hp) {
      console.warn('Bot submission blocked via honeypot:', { email, ip: request.headers.get('x-forwarded-for') })
      return NextResponse.json({ success: true })
    }

    // 2. Validate channel enum strictly on the server
    if (!channel || !(channel in CONTACT_CHANNELS)) {
      return NextResponse.json({ error: 'Invalid or unsupported contact channel' }, { status: 400 })
    }

    const channelMeta = CONTACT_CHANNELS[channel as ContactChannel]

    // 3. Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 })
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters long' }, { status: 400 })
    }

    // 4. Persistence Layer: Always record securely in Supabase (Dual-Resilience Pattern)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const formattedMessage = `[Role: ${role || 'Not specified'}]\n[Subject: ${subject.trim()}]\n\n${message.trim()}`

    // Map channel to valid feedback constraint: 'bug' for support, 'general' for inquiries/founder
    const feedbackType = channel === 'support' ? 'bug' : 'general'

    const { error: dbError } = await supabase.from('feedback').insert({
      user_id: user?.id || null,
      type: feedbackType,
      rating: null,
      message: formattedMessage,
      page_url: pageUrl || '/',
      user_email: email.trim().toLowerCase(),
      user_name: name.trim(),
      status: 'new',
      admin_note: `Channel: ${channel.toUpperCase()} | Routed to ${channelMeta.email}`
    })

    if (dbError) {
      console.error('Database message backup error:', dbError.message)
    }

    // If channel is founder, also cross-log into enterprise_inquiries for institutional tracking
    if (channel === 'founder') {
      try {
        await supabase.from('enterprise_inquiries').insert({
          company_name: role || 'Academic / Industry Contact',
          contact_name: name.trim(),
          email: email.trim().toLowerCase(),
          interest_area: `Founder Direct: ${subject.trim()}`,
          message: message.trim()
        })
      } catch (inqErr) {
        console.warn('Founder enterprise inquiry mirror warning:', inqErr)
      }
    }

    // 5. Outbound Email Dispatch via Resend (if API key is configured)
    let emailDispatched = false
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        
        // Use verified domain sender or Resend sandbox fallback
        const fromAddress = process.env.RESEND_FROM_EMAIL || 'PolymerHub Gateway <onboarding@resend.dev>'

        await resend.emails.send({
          from: fromAddress,
          to: channelMeta.email,
          replyTo: email.trim(),
          subject: `[${channel.toUpperCase()}] ${subject.trim()}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="background: #0A1628; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #ffffff; margin: 0 0 4px 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;">PolymerHub of India</h2>
                <div style="display: inline-block; background: ${channelMeta.accentColor}; color: #ffffff; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                  ${channelMeta.badgeLabel}
                </div>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 6px 0; width: 110px; font-weight: 700; color: #64748b;">Sender Name:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${name.trim()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Sender Email:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${email.trim()}" style="color: #2563eb; text-decoration: underline;">${email.trim()}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Academic / Role:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${role || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Origin Page:</td>
                  <td style="padding: 6px 0; font-family: monospace; color: #475569;">${pageUrl || '/'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 700; color: #64748b;">Subject:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${subject.trim()}</td>
                </tr>
              </table>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #1e293b; white-space: pre-wrap;">${message.trim()}</p>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                <p style="margin: 0;">💡 <strong>Quick Reply:</strong> You can hit <strong>Reply</strong> in your email client to respond directly to <strong>${name.trim()}</strong> at <strong>${email.trim()}</strong>.</p>
                <p style="margin: 4px 0 0 0;">Received via PolymerHub In-App Communication Gateway &middot; ${new Date().toUTCString()}</p>
              </div>
            </div>
          `
        })
        emailDispatched = true
      } catch (emailErr) {
        console.warn('Resend email dispatch error (fallback preserved in Supabase):', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      emailDispatched,
      message: 'Your message has been received and routed to the PolymerHub team.'
    })

  } catch (error) {
    console.error('Contact gateway submission error:', error)
    return NextResponse.json({ error: 'Internal server error processing message' }, { status: 500 })
  }
}
