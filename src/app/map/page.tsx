import { Metadata } from 'next'
import MapPageContent from '@/components/map/MapPageContent'

export const metadata: Metadata = {
  title: 'Platform Map & Learning GPS | PolymerHub India',
  description: 'Complete orientation sitemap, GATE 2026 XE-F 9-section mapping, 19 subjects directory, and 7-day beginner learning guide.',
}

export default function MapPage() {
  return <MapPageContent />
}
