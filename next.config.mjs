/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image Optimization (AVIF + WebP)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },

  // Compression, Minification & Compiler
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Package import optimization for tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Security, Caching & Performance Headers
  async headers() {
    return [
      // Immutable static assets caching
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(logo-.*|images/.*|.*\\.(?:png|jpg|jpeg|webp|svg|ico|avif))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Global Security & HSTS
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=(), payment=(self "https://checkout.razorpay.com" "https://api.razorpay.com")',
          },
          {
            key: 'Content-Security-Policy',
            value: `
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
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
      // API specific caching and anti-leak headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },

  // 301 Canonical Domain Redirect (www -> non-www)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.polymerhubofindia.com',
          },
        ],
        destination: 'https://polymerhubofindia.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
