import { createClient } from '@/lib/supabase/server'
import { safeRedirectPath } from '@/lib/auth-helpers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  const targetPath = safeRedirectPath(next)
  return NextResponse.redirect(new URL(targetPath, requestUrl.origin))
}
