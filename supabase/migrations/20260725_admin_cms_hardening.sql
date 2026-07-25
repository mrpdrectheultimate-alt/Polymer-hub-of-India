-- ============================================================
-- POLYMERHUB — ADMIN CONTENT MANAGEMENT SYSTEM HARDENING
-- Migration: 20260725_admin_cms_hardening.sql
-- ============================================================

-- 1. Content lifecycle and version tracking columns on lessons
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS version_number INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'draft' CHECK (review_status IN ('draft', 'in_review', 'changes_requested', 'approved', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- 2. Append-only Admin Audit Log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id   UUID REFERENCES auth.users(id),
  action          TEXT NOT NULL,
  entity_type     TEXT NOT NULL,
  entity_id       UUID,
  previous_values JSONB,
  new_values      JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can read audit log
DROP POLICY IF EXISTS "Admins read audit logs" ON public.admin_audit_log;
CREATE POLICY "Admins read audit logs"
  ON public.admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'organization_owner')
    )
  );

-- Admins and system actions can append audit log
DROP POLICY IF EXISTS "System append audit logs" ON public.admin_audit_log;
CREATE POLICY "System append audit logs"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'content_reviewer' OR role = 'editor')
    ) OR auth.role() = 'service_role'
  );

-- NO UPDATE policy -- Audit logs are strictly immutable
DROP POLICY IF EXISTS "Deny update audit logs" ON public.admin_audit_log;
-- NO DELETE policy -- Audit logs are strictly immutable
DROP POLICY IF EXISTS "Deny delete audit logs" ON public.admin_audit_log;
