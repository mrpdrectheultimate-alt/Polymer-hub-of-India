import { Metadata } from 'next'
import MapPageContent from '@/components/map/MapPageContent'
import { GATE_CONFIG } from '@/lib/config/gate-config'

export const metadata: Metadata = {
  title: 'Start Here | Master Site Map & Learning Guide | PolymerHub India',
  description: `Complete orientation sitemap, GATE ${GATE_CONFIG.year} ${GATE_CONFIG.paperCode} (${GATE_CONFIG.organizingInstitute}) 9-section mapping, 19 subjects directory, and 7-day beginner learning guide.`,
}

export default function StartPage() {
  return <MapPageContent />
}
