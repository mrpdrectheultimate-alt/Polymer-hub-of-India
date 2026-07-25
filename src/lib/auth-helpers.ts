/**
 * POLYMERHUB — AUTH HELPER FUNCTIONS
 */

export function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return '/dashboard'
  }
  return value
}
