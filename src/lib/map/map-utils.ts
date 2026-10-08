// src/lib/map/map-utils.ts — Search & Utility Helper Functions for Master Platform Map
import { HOMEPAGE_MAP_CARDS, GATE_SECTIONS, GOAL_OPTIONS } from './map-data'

export interface MapSearchResult {
  title: string
  category: 'Page' | 'Tool' | 'Subject' | 'GATE Section' | 'Formula'
  description: string
  link: string
}

export function searchPlatformMap(query: string): MapSearchResult[] {
  const cleanQuery = query.trim().toLowerCase()
  if (!cleanQuery) return []

  const results: MapSearchResult[] = []

  // 1. Search Homepage Map Cards & Secondary Links
  HOMEPAGE_MAP_CARDS.forEach((card) => {
    if (
      card.title.toLowerCase().includes(cleanQuery) ||
      card.subtitle.toLowerCase().includes(cleanQuery) ||
      card.description.toLowerCase().includes(cleanQuery)
    ) {
      results.push({
        title: card.title,
        category: 'Page',
        description: card.description,
        link: card.primaryCta.link
      })
    }

    card.secondaryLinks.forEach((sec) => {
      if (sec.label.toLowerCase().includes(cleanQuery)) {
        results.push({
          title: sec.label,
          category: 'Tool',
          description: `Direct tool link: ${sec.badge || ''}`,
          link: sec.link
        })
      }
    })
  })

  // 2. Search GATE Sections
  GATE_SECTIONS.forEach((sec) => {
    if (
      sec.title.toLowerCase().includes(cleanQuery) ||
      sec.description.toLowerCase().includes(cleanQuery) ||
      sec.subjects.some((s) => s.toLowerCase().includes(cleanQuery))
    ) {
      results.push({
        title: `GATE Section ${sec.number}: ${sec.title}`,
        category: 'GATE Section',
        description: sec.description,
        link: sec.link
      })
    }
  })

  // 3. Search Goal Options
  GOAL_OPTIONS.forEach((goal) => {
    if (goal.goalText.toLowerCase().includes(cleanQuery)) {
      results.push({
        title: goal.goalText,
        category: 'Tool',
        description: `Primary: ${goal.primaryDestination.name}`,
        link: goal.primaryDestination.link
      })
    }
  })

  // Deduplicate by link + title
  const seen = new Set<string>()
  return results.filter((res) => {
    const key = `${res.title}-${res.link}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
