import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  
  // 1. Enforce 301 Canonical Domain Redirect (www -> non-www)
  if (host.startsWith('www.polymerhubofindia.com')) {
    const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://polymerhubofindia.com')
    return NextResponse.redirect(targetUrl, { status: 301 })
  }

  // 2. Protect against Header Spoofing & Middleware Bypass (CVE-2025-29927 defense)
  const requestHeaders = new Headers(request.headers)
  if (requestHeaders.has('x-middleware-subrequest')) {
    requestHeaders.delete('x-middleware-subrequest')
  }

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // Fast-path: Only refresh session on authenticated / protected routes or API routes
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/hod') ||
    pathname.startsWith('/api')
  ) {
    await supabase.auth.getSession()
  }

  // Enterprise Security & Performance Headers (A+ Grade Compliance)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=(), payment=(self "https://checkout.razorpay.com" "https://api.razorpay.com")')
  
  // Strict CSP: Zero 'unsafe-inline' or 'unsafe-eval' in script-src
  const csp = `
    default-src 'self';
    script-src 'self' https://vercel.live https://*.vercel.app https://checkout.razorpay.com https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    img-src 'self' data: https: blob: https://images.unsplash.com https://*.supabase.co https://img.youtube.com https://i.ytimg.com;
    font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net;
    connect-src 'self' https://*.supabase.co https://*.vercel.app https://vercel.live https://api.razorpay.com https://generativelanguage.googleapis.com https://api.openai.com https://openrouter.ai https://www.youtube.com https://www.youtube-nocookie.com;
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://api.razorpay.com https://checkout.razorpay.com;
    frame-ancestors 'self';
    object-src 'none';
    form-action 'self' https://api.razorpay.com;
    base-uri 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff|woff2)$).*)',
  ],
}
