-- ============================================================
-- POLYMERHUB — INTERACTIVE LEARNING SCHEMA
-- Phase 14: Virtual Lab Sessions logs
-- ============================================================

-- ── 1. VIRTUAL LAB SESSIONS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.virtual_lab_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_id       TEXT NOT NULL CHECK (lab_id in ('tensile-astm-d638', 'mfi-astm-d1238')),
  parameters   JSONB NOT NULL DEFAULT '{}', -- Input parameters (material, load, temp, etc.)
  results      JSONB NOT NULL DEFAULT '{}', -- Calculated results (modulus, MFI, yield)
  xp_awarded   INT DEFAULT 15,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.virtual_lab_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own lab sessions" ON public.virtual_lab_sessions;
CREATE POLICY "Users manage own lab sessions" 
  ON public.virtual_lab_sessions FOR ALL USING (auth.uid() = user_id);
