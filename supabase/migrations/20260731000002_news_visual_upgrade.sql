-- ============================================================
-- POLYMERHUB — DAILY PULSE VISUAL UPGRADE
-- Phase 4: Geographical and Editorial news enhancement
-- ============================================================

-- 1. Upgrade schema with new columns
alter table public.daily_updates
  add column if not exists image_credit    text,
  add column if not exists region          text default 'Global' 
    check (region in ('India', 'Global', 'Regional')),
  add column if not exists editorial_status text default 'published' 
    check (editorial_status in ('draft', 'source_checked', 'image_rights_verified', 'reviewed', 'published'));

-- Drop views first to avoid column alteration errors in PostgreSQL
drop view if exists public.todays_updates;
drop view if exists public.latest_updates;

-- 2. Update todays_updates view
create view public.todays_updates as
select
  id, headline, summary, full_body, source_name, source_url, image_url, image_credit,
  category, region, related_lesson_slug, related_subject_slug,
  published_at, publish_date, is_featured, editorial_status
from public.daily_updates
where is_published = true
  and editorial_status = 'published'
  and publish_date = current_date
order by is_featured desc, published_at asc;

-- 3. Update latest_updates view
create view public.latest_updates as
select
  id, headline, summary, full_body, source_name, source_url, image_url, image_credit,
  category, region, related_lesson_slug, related_subject_slug,
  published_at, publish_date, is_featured, editorial_status
from public.daily_updates
where is_published = true
  and editorial_status = 'published'
order by publish_date desc, is_featured desc, published_at asc
limit 6;
