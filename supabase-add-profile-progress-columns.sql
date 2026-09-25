-- ============================================================================
-- ADD STUDENT COURSE & PROGRESS TRACKING DIRECTLY TO PROFILES TABLE
-- ============================================================================
-- Instructions:
-- 1. Open your Supabase SQL Editor: https://supabase.com/dashboard/project/plgzsaxvydceqidiwdup/sql/new
-- 2. Paste this entire script and click "Run"
-- ============================================================================

-- 1. ADD COURSE & PROGRESS COLUMNS TO PROFILES
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS course TEXT DEFAULT 'Full Stack Web Dev',
  ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_lessons INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_lessons INT DEFAULT 2,
  ADD COLUMN IF NOT EXISTS completed_weeks INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_week INT DEFAULT 1;

-- 2. BACKFILL ALL EXISTING STUDENTS WITH ACCURATE PROGRESS DATA
UPDATE public.profiles p
SET 
  course = COALESCE(e.courses_title, p.course, 'Full Stack Web Dev'),
  progress_percent = COALESCE(e.progress_percent, 0),
  completed_lessons = COALESCE(prog.completed_cnt, 0),
  total_lessons = CASE 
    WHEN COALESCE(e.courses_title, p.course, '') ILIKE '%Full Stack%' THEN 2
    ELSE 1
  END,
  completed_weeks = CASE 
    WHEN COALESCE(e.progress_percent, 0) >= 100 THEN 1 
    ELSE 0 
  END,
  current_week = 1
FROM (
  SELECT en.student_id, en.progress_percent, c.title AS courses_title
  FROM public.enrollments en
  LEFT JOIN public.courses c ON en.course_id = c.id
) e
LEFT JOIN (
  SELECT student_id, count(*) AS completed_cnt
  FROM public.student_progress
  WHERE status ILIKE 'completed'
  GROUP BY student_id
) prog ON e.student_id = prog.student_id
WHERE p.id = e.student_id;

-- 3. SPECIFICALLY SET RAMU TO 100% (2/2 LESSONS, 1 WEEK FINISHED)
UPDATE public.profiles
SET 
  course = 'Full Stack Web Dev',
  progress_percent = 100,
  completed_lessons = 2,
  total_lessons = 2,
  completed_weeks = 1,
  current_week = 1
WHERE username = 'ram112' OR email = 'ramesh@gmail.com';

-- 4. VERIFY RESULTING PROFILES
SELECT id, full_name, username, course, progress_percent, completed_lessons, total_lessons, completed_weeks, current_week 
FROM public.profiles;
