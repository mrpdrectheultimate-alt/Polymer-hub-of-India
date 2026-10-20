// src/lib/contact.ts — Shared configuration and routing for In-App Contact Gateway
export type ContactChannel = 'support' | 'inquiries' | 'founder'

export interface ChannelMeta {
  channel: ContactChannel
  email: string
  title: string
  subtitle: string
  defaultSubject: string
  badgeLabel: string
  badgeClass: string
  accentColor: string
}

export const CONTACT_CHANNELS: Record<ContactChannel, ChannelMeta> = {
  support: {
    channel: 'support',
    email: 'support@polymerhubofindia.com',
    title: 'PolymerHub Support Desk',
    subtitle: 'Technical assistance, simulator issues, account access, or subscription inquiries.',
    defaultSubject: '[Technical Support] ',
    badgeLabel: 'Technical Support',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: '#2563EB'
  },
  inquiries: {
    channel: 'inquiries',
    email: 'hello@polymerhubofindia.com',
    title: 'General & Academic Inquiries',
    subtitle: 'Curriculum alignment, campus student chapters, guest lectures, and general questions.',
    defaultSubject: '[General Inquiry] ',
    badgeLabel: 'Inquiries & Community',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: '#16A34A'
  },
  founder: {
    channel: 'founder',
    email: 'founder@polymerhubofindia.com',
    title: 'Direct Line to Founder',
    subtitle: 'Institutional HOD licensing, university lab pilots, enterprise compounding partnerships, and strategic discussions.',
    defaultSubject: '[Founder Direct] ',
    badgeLabel: 'Executive & Strategic',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    accentColor: '#EA580C'
  }
}

export const USER_ROLES = [
  'B.Tech Polymer / Chemical Engineering Student',
  'Diploma / CIPET Student',
  'College Faculty / Head of Department (HOD)',
  'Plastics Industry Processor / Compounder',
  'GATE 2027 XE5 Aspirant',
  'Academic Researcher / Scholar',
  'Other / General Visitor'
] as const

export type UserRole = (typeof USER_ROLES)[number]
