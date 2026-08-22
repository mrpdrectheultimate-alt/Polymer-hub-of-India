/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HSTS - Enforce HTTPS for 1 year with subdomains
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Prevent MIME-sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Prevent clickjacking while allowing same-origin embedding
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // Legacy XSS Protection for older browsers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Restrict hardware sensor APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app https://checkout.razorpay.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https: blob: https://images.unsplash.com https://*.supabase.co;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://*.supabase.co https://*.vercel.app https://vercel.live https://api.razorpay.com https://generativelanguage.googleapis.com https://api.openai.com;
              frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://api.razorpay.com;
              frame-ancestors 'self';
              form-action 'self' https://api.razorpay.com;
              base-uri 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      },
      // API specific caching and anti-leak headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
