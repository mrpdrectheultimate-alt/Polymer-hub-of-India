// src/lib/security.ts — Enterprise Security, Crypto & Privacy Utility Library
import crypto from 'crypto'

/**
 * ── 1. DATA MASKING & PII SANITIZATION ──────────────────────────
 */

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '****'
  const [local, domain] = email.split('@')
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`
  }
  const maskedLocal = local[0] + '*'.repeat(Math.min(local.length - 2, 6)) + local[local.length - 1]
  return `${maskedLocal}@${domain}`
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return '****'
  const visible = phone.slice(-4)
  return '*'.repeat(phone.length - 4) + visible
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '********'
  return key.slice(0, 4) + '...' + key.slice(-4)
}

export function maskSensitiveData<T extends Record<string, unknown>>(obj: T, sensitiveKeys = ['password', 'token', 'secret', 'key', 'apiKey', 'accessToken']): T {
  if (!obj || typeof obj !== 'object') return obj
  const clone = { ...obj } as Record<string, unknown>
  for (const k of Object.keys(clone)) {
    if (sensitiveKeys.some(sk => k.toLowerCase().includes(sk.toLowerCase()))) {
      if (typeof clone[k] === 'string') {
        clone[k] = maskApiKey(clone[k] as string)
      } else {
        clone[k] = '[REDACTED]'
      }
    } else if (k.toLowerCase() === 'email' && typeof clone[k] === 'string') {
      clone[k] = maskEmail(clone[k] as string)
    } else if (k.toLowerCase().includes('phone') && typeof clone[k] === 'string') {
      clone[k] = maskPhone(clone[k] as string)
    }
  }
  return clone as T
}

/**
 * ── 2. CRYPTOGRAPHIC UTILITIES & TIMING-SAFE VERIFICATION ────────
 */

export function hashSecret(secret: string, salt = crypto.randomBytes(16).toString('hex')): string {
  const hash = crypto.scryptSync(secret, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifySecret(secret: string, combinedHash: string): boolean {
  if (!combinedHash || !combinedHash.includes(':')) return false
  const [salt, originalHash] = combinedHash.split(':')
  const calculatedHash = crypto.scryptSync(secret, salt, 64).toString('hex')
  
  const buf1 = Buffer.from(originalHash, 'hex')
  const buf2 = Buffer.from(calculatedHash, 'hex')
  if (buf1.length !== buf2.length) return false
  return crypto.timingSafeEqual(buf1, buf2)
}

export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex')
}

/**
 * ── 3. INPUT SANITIZATION & SAFE STRING NORMALIZATION ────────────
 */

export function sanitizeInput(input: string): string {
  if (!input) return ''
  return input
    .replace(/[<>]/g, '') // remove raw bracket injection
    .trim()
}

export function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * ── 4. ROLE-BASED ACCESS CONTROL (RBAC) ──────────────────────────
 */

export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  HOD = 'HOD',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum Permission {
  VIEW_CONTENT = 'VIEW_CONTENT',
  SUBMIT_PROJECT = 'SUBMIT_PROJECT',
  ACCESS_CALCULATORS = 'ACCESS_CALCULATORS',
  POST_FORUM = 'POST_FORUM',
  MANAGE_COURSES = 'MANAGE_COURSES',
  MANAGE_STUDENTS = 'MANAGE_STUDENTS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  SEARCH_TALENT = 'SEARCH_TALENT',
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    Permission.VIEW_CONTENT,
    Permission.SUBMIT_PROJECT,
    Permission.ACCESS_CALCULATORS,
    Permission.POST_FORUM,
  ],
  [UserRole.INSTRUCTOR]: [
    Permission.VIEW_CONTENT,
    Permission.SUBMIT_PROJECT,
    Permission.ACCESS_CALCULATORS,
    Permission.POST_FORUM,
    Permission.MANAGE_COURSES,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.HOD]: [
    Permission.VIEW_CONTENT,
    Permission.ACCESS_CALCULATORS,
    Permission.MANAGE_STUDENTS,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.RECRUITER]: [
    Permission.VIEW_CONTENT,
    Permission.SEARCH_TALENT,
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_CONTENT,
    Permission.SUBMIT_PROJECT,
    Permission.ACCESS_CALCULATORS,
    Permission.POST_FORUM,
    Permission.MANAGE_COURSES,
    Permission.MANAGE_STUDENTS,
    Permission.VIEW_ANALYTICS,
    Permission.SEARCH_TALENT,
    Permission.ADMIN_ACCESS,
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
}

export function hasPermission(role: UserRole | string, permission: Permission): boolean {
  const matchedRole = (role?.toUpperCase() as UserRole) || UserRole.STUDENT
  const permissions = ROLE_PERMISSIONS[matchedRole] || ROLE_PERMISSIONS[UserRole.STUDENT]
  return permissions.includes(permission)
}
