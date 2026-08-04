-- Sprint 1B: Lesson Revision Snapshots, Structured Sources, Cron Logs & Governance

-- 1. Lesson Revisions Table (Version Rollback Protection)
CREATE TABLE IF NOT EXISTS public.lesson_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  version integer NOT NULL,
  title text NOT NULL,
  content_snapshot text NOT NULL,
  summary_snapshot text,
  quality_score integer,
  changed_by text NOT NULL DEFAULT 'curriculum_auditor',
  change_reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Lesson Structured Sources Table
CREATE TABLE IF NOT EXISTS public.lesson_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  source_organization text NOT NULL,
  citation_title text NOT NULL,
  source_role text NOT NULL CHECK (source_role IN ('core_theory', 'equation', 'standard', 'industry_case', 'image', 'regulation', 'further_reading')),
  claim_supported text,
  page_or_section text,
  url text,
  verified_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Cron Execution Logs Table (Idempotency & Auditing)
CREATE TABLE IF NOT EXISTS public.cron_execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id text UNIQUE NOT NULL,
  job_name text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  videos_checked integer DEFAULT 0,
  successes integer DEFAULT 0,
  failures integer DEFAULT 0,
  records_changed integer DEFAULT 0,
  error_summary text,
  status text DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed'))
);

-- 4. Governance Fields in Lessons Table
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS audited_by text DEFAULT 'automated_audit_v1',
ADD COLUMN IF NOT EXISTS audited_at timestamptz,
ADD COLUMN IF NOT EXISTS reviewed_by text,
ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
