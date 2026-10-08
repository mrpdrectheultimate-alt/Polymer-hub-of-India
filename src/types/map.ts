// src/types/map.ts — TypeScript Interfaces for PolymerHub Master Site Map & Learning Guide

export interface MapSecondaryLink {
  label: string
  link: string
  badge?: string
}

export interface HomepageMapCard {
  id: string
  icon: string // Lucide icon name or emoji
  title: string
  subtitle: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  primaryCta: {
    label: string
    link: string
  }
  secondaryLinks: MapSecondaryLink[]
}

export interface GateSection {
  id: string
  number: number
  title: string
  subjects: string[]
  totalLessons: number
  relevanceStars: number
  link: string
  description: string
}

export interface GoalOption {
  id: string
  goalText: string
  primaryDestination: {
    name: string
    link: string
  }
  secondaryDestination: {
    name: string
    link: string
  }
  iconName: string
}

export interface SubjectMapItem {
  id: string
  slug: string
  name: string
  lessons: number
  level: 'Foundation' | 'Core' | 'Advanced'
  gateStars: number
  description: string
  industryMatch: string
  iconName: string
}

export interface FirstWeekStep {
  day: number
  title: string
  action: string
  destination: string
  link: string
  iconName: string
}

export interface UserMapProgress {
  lessonsCompleted: number
  totalLessons: number
  questionsAttempted: number
  gateReadinessPct: number
  currentStreak: number
  lastStudiedLesson?: string
}
