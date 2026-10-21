// src/lib/supabase/admin.ts — Centralized Elevated Supabase Service-Role Client
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let adminClientInstance: SupabaseClient | null = null

/**
 * Returns a singleton elevated Supabase client configured with the service-role key.
 * This client bypasses PostgreSQL Row-Level Security (RLS) and must strictly be used
 * in secure server-side execution contexts (API routes, background cron jobs, webhooks).
 */
export function getAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'PolymerHub Configuration Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing. Service-role admin operations cannot be performed.'
    )
  }

  adminClientInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return adminClientInstance
}

// Named alias for interoperability
export const createAdminClient = getAdminClient
