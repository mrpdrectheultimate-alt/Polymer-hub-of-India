-- Migration: Enforce NOT NULL on lessons.module_id and add index

ALTER TABLE public.lessons
ALTER COLUMN module_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS lessons_module_id_idx
ON public.lessons(module_id);
