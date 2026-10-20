// src/lib/admin.ts — Centralized Admin & Operational Governance
import { User } from '@supabase/supabase-js'

export const ADMIN_EMAILS = [
  'founder@polymerhubofindia.com',
  'admin@polymerhubofindia.com',
  'support@polymerhubofindia.com',
]

export interface AdminProfileCheck {
  role?: string | null
  is_admin?: boolean | null
}

/**
 * Validates whether an authenticated user possesses administrative clearance.
 */
export function isUserAdmin(
  user: User | null | { email?: string | null },
  profile?: AdminProfileCheck | null
): boolean {
  if (!user) return false
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true
  if (profile?.role === 'admin' || profile?.role === 'organization_owner') return true
  if (profile?.is_admin === true) return true
  return false
}
