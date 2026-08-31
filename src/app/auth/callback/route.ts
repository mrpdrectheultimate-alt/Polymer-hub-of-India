import { createClient } from '@/lib/supabase/server'
import { safeRedirectPath } from '@/lib/auth-helpers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next')

  // Resolve true public origin (handles Vercel reverse proxy headers)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const isLocal = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1'
  
  const origin = isLocal 
    ? requestUrl.origin 
    : forwardedHost 
    ? `${forwardedProto}://${forwardedHost}` 
    : requestUrl.origin

  const supabase = createClient()

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (err) {
      console.error('Failed to exchange code for session:', err)
    }
  } else if (tokenHash && type) {
    try {
      await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type,
      })
    } catch (err) {
      console.error('Failed to verify token hash:', err)
    }
  }

  const targetPath = safeRedirectPath(next)
  return NextResponse.redirect(new URL(targetPath, origin))
}
