// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/hod-dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://polymerhubofindia.com/sitemap.xml',
  }
}
