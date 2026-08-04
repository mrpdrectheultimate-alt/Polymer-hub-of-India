-- ============================================================
-- POLYMERHUB — GAMIFICATION SCHEMA
-- Streaks, Badges, XP Points, Leaderboard
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. EXTEND profiles FOR GAMIFICATION ─────────────────────────────────────
alter table public.profiles
  add column if not exists xp_points        integer default 0,
  add column if not exists current_streak   integer default 0,
  add column if not exists longest_streak   integer default 0,
  add column if not exists last_active_date date,
  add column if not exists total_lessons_completed integer default 0,
  add column if not exists total_quizzes_passed    integer default 0;

-- ── 2. BADGES TABLE ──────────────────────────────────────────────────────────
create table if not exists public.badges (
  id          uuid default gen_random_uuid() primary key,
  slug        text unique not null,
  name        text not null,
  description text not null,
  icon        text not null,   -- emoji
  color       text not null,   -- hex color
  xp_reward   integer default 50,
  category    text not null check (category in ('learning', 'quiz', 'streak', 'community', 'special')),
  condition   text not null,   -- human-readable condition
  created_at  timestamptz default now()
);

-- ── 3. USER BADGES TABLE ─────────────────────────────────────────────────────
create table if not exists public.user_badges (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  badge_id   uuid not null references public.badges(id) on delete cascade,
  earned_at  timestamptz default now(),
  unique(user_id, badge_id)
);

create index if not exists idx_user_badges_user on public.user_badges(user_id);

-- ── 4. XP ACTIVITY LOG ───────────────────────────────────────────────────────
create table if not exists public.xp_log (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  action      text not null,   -- 'lesson_complete', 'quiz_pass', 'streak_day', 'badge_earned', 'forum_answer'
  xp_earned   integer not null,
  reference   text,            -- lesson/quiz/badge id for context
  created_at  timestamptz default now()
);

create index if not exists idx_xp_log_user on public.xp_log(user_id);

-- ── 5. RLS ────────────────────────────────────────────────────────────────────
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.xp_log enable row level security;

-- Drop existing policies if they exist to prevent errors on re-run
drop policy if exists "Badges readable by all" on public.badges;
create policy "Badges readable by all" on public.badges for select using (true);

drop policy if exists "User badges readable by all" on public.user_badges;
create policy "User badges readable by all" on public.user_badges for select using (true);

drop policy if exists "Users manage own badges" on public.user_badges;
create policy "Users manage own badges" on public.user_badges for insert with check (auth.uid() = user_id);

drop policy if exists "Users view own XP" on public.xp_log;
create policy "Users view own XP" on public.xp_log for select using (auth.uid() = user_id);

drop policy if exists "Users earn XP" on public.xp_log;
create policy "Users earn XP" on public.xp_log for insert with check (auth.uid() = user_id);

-- ── 6. LEADERBOARD VIEW ──────────────────────────────────────────────────────
create or replace view public.leaderboard as
select
  p.id,
  p.full_name,
  p.avatar_url,
  p.college_name,
  p.xp_points,
  p.current_streak,
  p.total_lessons_completed,
  p.total_quizzes_passed,
  count(ub.id) as badges_earned
from public.profiles p
left join public.user_badges ub on ub.user_id = p.id
where p.xp_points > 0
group by p.id, p.full_name, p.avatar_url, p.college_name, p.xp_points, p.current_streak, p.total_lessons_completed, p.total_quizzes_passed
order by p.xp_points desc
limit 100;

-- ── 7. SEED BADGES ───────────────────────────────────────────────────────────
insert into public.badges (slug, name, description, icon, color, xp_reward, category, condition) values

-- Learning badges
('first_lesson', 'First Step', 'Completed your first lesson on PolymerHub', '📖', '#1D4ED8', 25, 'learning', 'Complete 1 lesson'),
('five_lessons', 'Getting Started', 'Completed 5 lessons', '📚', '#1D4ED8', 50, 'learning', 'Complete 5 lessons'),
('ten_lessons', 'Dedicated Learner', 'Completed 10 lessons', '🎓', '#1D4ED8', 100, 'learning', 'Complete 10 lessons'),
('twenty_five_lessons', 'Knowledge Builder', 'Completed 25 lessons', '🏗️', '#1D4ED8', 200, 'learning', 'Complete 25 lessons'),
('fifty_lessons', 'Halfway Hero', 'Completed 50 lessons', '⚡', '#CA8A04', 400, 'learning', 'Complete 50 lessons'),
('all_lessons', 'Polymer Master', 'Completed all 155 lessons — the highest learning achievement on PolymerHub', '🏆', '#CA8A04', 1000, 'learning', 'Complete all 155 lessons'),

-- Subject completion badges
('chemistry_complete', 'Polymer Chemist', 'Completed all Polymer Chemistry lessons', '🧪', '#1D4ED8', 150, 'learning', 'Complete all Chemistry lessons'),
('processing_complete', 'Processing Pro', 'Completed all Polymer Processing lessons', '⚙️', '#EA580C', 150, 'learning', 'Complete all Processing lessons'),
('rubber_complete', 'Rubber Specialist', 'Completed all Rubber Technology lessons', '🔴', '#EA580C', 150, 'learning', 'Complete all Rubber Technology lessons'),
('recycling_complete', 'Circular Economy Champion', 'Completed all Recycling Technology lessons', '♻️', '#15803D', 150, 'learning', 'Complete all Recycling lessons'),
('medical_complete', 'MedTech Engineer', 'Completed all Medical Plastics lessons', '💊', '#7C3AED', 150, 'learning', 'Complete all Medical Plastics lessons'),

-- Quiz badges
('first_quiz', 'Quiz Taker', 'Passed your first lesson quiz', '✅', '#15803D', 25, 'quiz', 'Pass 1 quiz'),
('perfect_score', 'Perfection', 'Scored 100% on a lesson quiz', '💯', '#CA8A04', 100, 'quiz', 'Score 100% on any quiz'),
('ten_quizzes', 'Quiz Champion', 'Passed 10 lesson quizzes', '🏅', '#15803D', 150, 'quiz', 'Pass 10 quizzes'),
('gate_warrior', 'GATE Warrior', 'Scored above 70% on the GATE Mock Test', '⚔️', '#7C3AED', 200, 'quiz', 'Score >70% on GATE mock'),
('gate_topper', 'GATE Topper', 'Scored above 90% on the GATE Mock Test', '👑', '#CA8A04', 500, 'quiz', 'Score >90% on GATE mock'),

-- Streak badges
('streak_3', '3-Day Streak', 'Studied 3 days in a row', '🔥', '#EA580C', 30, 'streak', '3 consecutive study days'),
('streak_7', 'Week Warrior', 'Studied 7 days in a row', '🔥', '#EA580C', 75, 'streak', '7 consecutive study days'),
('streak_14', 'Two Weeks Strong', 'Studied 14 days in a row', '🌟', '#CA8A04', 150, 'streak', '14 consecutive study days'),
('streak_30', 'Monthly Master', 'Studied 30 days in a row — extraordinary commitment', '💎', '#CA8A04', 500, 'streak', '30 consecutive study days'),

-- Community badges
('first_question', 'Curious Mind', 'Asked your first forum question', '❓', '#7C3AED', 20, 'community', 'Post 1 forum question'),
('first_answer', 'Helper', 'Answered a forum question', '💬', '#7C3AED', 30, 'community', 'Post 1 forum answer'),
('accepted_answer', 'Problem Solver', 'Had an answer accepted as the best answer', '⭐', '#CA8A04', 100, 'community', 'Get 1 accepted answer'),

-- Special badges
('early_adopter', 'Early Adopter', 'One of the first 200 students on PolymerHub', '🚀', '#CA8A04', 100, 'special', 'Join in the first 200 users'),
('premium_member', 'Premium Scholar', 'Upgraded to PolymerHub Premium', '⭐', '#CA8A04', 50, 'special', 'Purchase premium subscription'),
('profile_complete', 'Identity Set', 'Completed your profile with college, bio, and goals', '🪪', '#15803D', 25, 'special', 'Fill in all profile fields')

on conflict (slug) do nothing;

-- ── 8. XP POINT VALUES (reference) ───────────────────────────────────────────
-- Lesson started:        5 XP
-- Lesson completed:     25 XP
-- Quiz passed (70%+):   30 XP
-- Quiz perfect (100%):  50 XP
-- Daily streak:         10 XP/day
-- Forum question:        5 XP
-- Forum answer:         10 XP
-- Accepted answer:      25 XP
-- Badge earned:         badge.xp_reward XP

-- ============================================================
-- ✅ GAMIFICATION SCHEMA COMPLETE
-- Tables: badges, user_badges, xp_log
-- Extended: profiles (xp_points, streaks)
-- View: leaderboard
-- Seed: 26 badges across 5 categories
-- ============================================================
