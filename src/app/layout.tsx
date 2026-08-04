import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'
import FeedbackWidget from '@/components/FeedbackWidget'
import { DEFAULT_METADATA } from '@/lib/seo'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* JSON-LD Structured Data — helps Google understand the site */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://polymer-hub-six.vercel.app/#website',
                  url: 'https://polymer-hub-six.vercel.app',
                  name: 'PolymerHub',
                  description: "India's Plastic Polymer Engineering Knowledge Platform",
                  inLanguage: 'en-IN',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://polymer-hub-six.vercel.app/subjects?q={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'EducationalOrganization',
                  '@id': 'https://polymer-hub-six.vercel.app/#organization',
                  name: 'PolymerHub',
                  url: 'https://polymer-hub-six.vercel.app',
                  description: "India's first knowledge platform for Plastic Polymer Engineering students",
                  areaServed: 'IN',
                  educationalCredentialAwarded: 'Polymer Engineering Knowledge Certificate',
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Polymer Engineering Courses',
                    numberOfItems: 15,
                  },
                },
                {
                  '@type': 'Course',
                  '@id': 'https://polymer-hub-six.vercel.app/#course',
                  name: 'Complete B.Tech Plastic Polymer Engineering Curriculum',
                  description: '155 world-class lessons across 15 subjects: Polymer Chemistry, Processing, Mould Design, Testing, Rubber Technology, Recycling, Sustainable Plastics, Composites, Medical Plastics, and Entrepreneurship',
                  provider: {
                    '@type': 'Organization',
                    name: 'PolymerHub',
                    url: 'https://polymer-hub-six.vercel.app',
                  },
                  courseCode: 'PPE-COMPLETE',
                  educationalLevel: 'Undergraduate',
                  inLanguage: 'en-IN',
                  hasCourseInstance: {
                    '@type': 'CourseInstance',
                    courseMode: 'online',
                    courseWorkload: 'PT155H',
                  },
                  offers: {
                    '@type': 'Offer',
                    price: '149',
                    priceCurrency: 'INR',
                    priceValidUntil: '2026-12-31',
                    availability: 'https://schema.org/InStock',
                    url: 'https://polymer-hub-six.vercel.app/pricing',
                  },
                  numberOfCredits: 155,
                  teaches: [
                    'Polymer Chemistry and Polymerization Mechanisms',
                    'Injection Moulding and Extrusion Processing',
                    'Mould Design and CAE Simulation',
                    'Polymer Testing to IS/ASTM Standards',
                    'Rubber Technology and Vulcanization',
                    'Recycling Technology and EPR Compliance',
                    'Sustainable Plastics and Bioplastics',
                    'Polymer Composites and CFRP',
                    'Medical Plastics and ISO 10993 Biocompatibility',
                    'Entrepreneurship in the Plastics Sector',
                  ],
                },
              ],
            }),
          }}
        />
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* PWA & Dark Mode support */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1D4ED8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="bg-canvas text-ink antialiased font-sans">
        <ServiceWorkerRegister />
        <Navbar />
        <main>{children}</main>
        <FeedbackWidget />
        <Toaster />
      </body>
    </html>
  )
}
