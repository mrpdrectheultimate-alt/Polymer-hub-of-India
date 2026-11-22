import { Metadata } from 'next'
import AnnouncementBar from '@/components/landing/AnnouncementBar'
import LandingNavbar from '@/components/landing/LandingNavbar'
import Hero from '@/components/landing/Hero'
import ProofStrip from '@/components/landing/ProofStrip'
import WhyPolymerHub from '@/components/landing/WhyPolymerHub'
import InteractiveDemo from '@/components/landing/InteractiveDemo'
import AudienceCards from '@/components/landing/AudienceCards'
import FeatureShowcase from '@/components/landing/FeatureShowcase'
import GateSection from '@/components/landing/GateSection'
import IndustrySection from '@/components/landing/IndustrySection'
import ComparisonTable from '@/components/landing/ComparisonTable'
import PricingSection from '@/components/landing/PricingSection'
import CommunitySection from '@/components/landing/CommunitySection'
import FounderSection from '@/components/landing/FounderSection'
import FAQSection from '@/components/landing/FAQSection'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'PolymerHub of India — Master Polymer Engineering | From Molecules to Manufacturing',
  description: "Building India's dedicated, integrated learning and engineering platform for polymer science, plastics manufacturing technology, practical solvers, and GATE XE-F preparation.",
  keywords: [
    'polymer engineering',
    'plastics technology',
    'GATE XE-F',
    'GATE polymer science',
    'CIPET learning',
    'injection moulding defect troubleshooting',
    'clamping tonnage calculator',
    'polymer chemistry',
    'mould design',
    'extrusion parameters',
    'PolymerHub India'
  ],
  openGraph: {
    title: 'PolymerHub of India — Master Polymer Engineering',
    description: '19 subjects, 216 curriculum lessons, 8 industrial calculators, 100+ 3D models, and dedicated GATE XE-F preparation. 100% Free Core Access.',
    url: 'https://polymerhubofindia.com',
    siteName: 'PolymerHub of India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=630&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'PolymerHub of India — Polymer Science and Plastics Engineering Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PolymerHub of India — Master Polymer Engineering',
    description: "India's dedicated platform for plastics and polymer engineers. From molecules to manufacturing.",
    images: ['https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=630&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: 'https://polymerhubofindia.com',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Global Announcement Banner (Direct WhatsApp & LaunchBase Hook) */}
      <AnnouncementBar />

      {/* 2. Focused Landing Header */}
      <LandingNavbar />

      {/* 3. Hero Section (Above the fold 5-second clarity hook) */}
      <Hero />

      {/* 4. Verified Platform Proof Strip */}
      <ProofStrip />

      {/* 5. Why PolymerHub Exists (The Fragmented Knowledge Narrative) */}
      <WhyPolymerHub />

      {/* 6. Interactive Aha Demonstration (Non-gated Defect / Calc / GATE preview) */}
      <InteractiveDemo />

      {/* 7. Audience Pathways (College/CIPET vs GATE vs Shop Floor) */}
      <AudienceCards />

      {/* 8. Full Ecosystem Feature Showcase */}
      <FeatureShowcase />

      {/* 9. Dedicated GATE XE-F Section */}
      <GateSection />

      {/* 10. Live Industry Intelligence & Spot Price Benchmarks */}
      <IndustrySection />

      {/* 11. Honest Category Comparison Table */}
      <ComparisonTable />

      {/* 12. Transparent Pricing (Free Forever vs ₹149/mo) */}
      <PricingSection />

      {/* 13. Official Community Network (WhatsApp & Telegram) */}
      <CommunitySection />

      {/* 14. Founder & Mission Story (Ch. LPK Naidu) */}
      <FounderSection />

      {/* 15. Frequently Asked Questions */}
      <FAQSection />

      {/* 16. Final Sticky Call-to-Action */}
      <FinalCTA />

      {/* 17. Comprehensive Global Footer with Legal Charter & In-App Contact */}
      <Footer showTrustBar />

    </div>
  )
}
