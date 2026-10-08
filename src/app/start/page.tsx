import { Metadata } from 'next'
import MapPageContent from '@/components/map/MapPageContent'

export const metadata: Metadata = {
  title: 'Start Here | Master Site Map & Learning Guide | PolymerHub India',
  description: 'Complete orientation sitemap, GATE 2026 XE-F 9-section mapping, 19 subjects directory, and 7-day beginner learning guide.',
}

export default function StartPage() {
  return <MapPageContent />
}
