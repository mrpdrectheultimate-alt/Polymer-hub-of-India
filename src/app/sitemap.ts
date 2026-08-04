import { createClient } from '@supabase/supabase-js'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://polymer-hub-six.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  const supabase = createClient(supabaseUrl, supabaseKey)

  // ── Static pages ───────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/subjects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/ai-tutor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/today`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/history`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/world`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/library`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/comparator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/troubleshooter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/practice`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/materials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/forum`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/calculators`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/achievements`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/feedback`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/education`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/education/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/study-groups`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/hod-dashboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/research`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/simulations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // ── Library book pages ──────────────────────────────────────────────────────
  const { data: books } = await supabase
    .from('library_books')
    .select('slug, created_at')

  const bookPages: MetadataRoute.Sitemap = (books ?? []).map((b) => ({
    url: `${BASE_URL}/library/${b.slug}`,
    lastModified: b.created_at ? new Date(b.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  // ── Subject pages ──────────────────────────────────────────────────────────
  const { data: subjects } = await supabase
    .from('subjects')
    .select('slug, updated_at')
    .order('order_index')

  const subjectPages: MetadataRoute.Sitemap = (subjects ?? []).map((s) => ({
    url: `${BASE_URL}/subjects/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // ── Lesson pages ───────────────────────────────────────────────────────────
  const { data: lessons } = await supabase
    .from('lessons')
    .select('slug, updated_at')
    .order('order_index')

  const lessonPages: MetadataRoute.Sitemap = (lessons ?? []).map((l) => ({
    url: `${BASE_URL}/lessons/${l.slug}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // ── Education Program pages ──────────────────────────────────────────────────
  const { data: programs } = await supabase
    .from('education_programs')
    .select('slug, created_at')

  const programPages: MetadataRoute.Sitemap = (programs ?? []).map((p) => ({
    url: `${BASE_URL}/education/${p.slug}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [...staticPages, ...bookPages, ...subjectPages, ...lessonPages, ...programPages]
}
