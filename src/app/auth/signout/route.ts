// src/app/auth/signout/route.ts — Secure Signout Handler
import { createClient } from '@/lib/supabase/server'
import { safeRedirectPath } from '@/lib/auth-helpers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  // Verify user before signout
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.auth.signOut()
  }

  // Resolve true public origin (handles Vercel / reverse proxy headers)
  const requestUrl = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const isLocal = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1'

  const origin = isLocal
    ? requestUrl.origin
    : forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin

  const next = requestUrl.searchParams.get('next') || '/'
  const targetPath = safeRedirectPath(next)

  return NextResponse.redirect(new URL(targetPath, origin), {
    status: 303, // Redirect after POST
  })
}

export async function GET(request: NextRequest) {
  return POST(request)
}
