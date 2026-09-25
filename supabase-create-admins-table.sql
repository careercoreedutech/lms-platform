-- ============================================================================
-- 1. CREATE DEDICATED ADMINS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Megaviz Admin',
    password TEXT NOT NULL DEFAULT 'megaviz@1234',
    role TEXT NOT NULL DEFAULT 'ADMIN',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    phone TEXT,
    avatar_url TEXT,
    permissions JSONB DEFAULT '["all"]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND policyname = 'Allow public read admins') THEN
        CREATE POLICY "Allow public read admins" ON public.admins FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND policyname = 'Allow admin management') THEN
        CREATE POLICY "Allow admin management" ON public.admins FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Move Megaviz admin from profiles to admins table
INSERT INTO public.admins (id, email, username, full_name, password, role, status, phone, created_at)
SELECT id, email, username, full_name, 'megaviz@1234', 'ADMIN', 'ACTIVE', phone, created_at
FROM public.profiles
WHERE role = 'ADMIN' OR username = 'megaviz'
ON CONFLICT (email) DO UPDATE 
SET 
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  password = 'megaviz@1234',
  role = 'ADMIN',
  status = 'ACTIVE';

-- Ensure Megaviz row exists even if profiles was empty
INSERT INTO public.admins (email, username, full_name, password, role, status)
VALUES ('megaviz@careercore.com', 'megaviz', 'Megaviz Admin', 'megaviz@1234', 'ADMIN', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Remove admin from profiles table so profiles is 100% students only
DELETE FROM public.profiles 
WHERE role = 'ADMIN' OR username = 'megaviz' OR email = 'megaviz@careercore.com';


-- ============================================================================
-- 2. ADD STUDENT COURSE & PROGRESS COLUMNS TO PROFILES TABLE
-- ============================================================================
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS course TEXT DEFAULT 'Full Stack Web Dev',
  ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_lessons INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_lessons INT DEFAULT 2,
  ADD COLUMN IF NOT EXISTS completed_weeks INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_week INT DEFAULT 1;

-- Backfill all student profiles with explicit ::text type casts to avoid type mismatch
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
  SELECT en.student_id::text AS student_id, en.progress_percent, c.title AS courses_title
  FROM public.enrollments en
  LEFT JOIN public.courses c ON en.course_id = c.id
) e
LEFT JOIN (
  SELECT student_id::text AS student_id, count(*) AS completed_cnt
  FROM public.student_progress
  WHERE status ILIKE 'completed'
  GROUP BY student_id
) prog ON e.student_id = prog.student_id
WHERE p.id::text = e.student_id;

-- Explicitly set Ramu to 100% (2/2 lessons, 1 week finished)
UPDATE public.profiles
SET 
  course = 'Full Stack Web Dev',
  progress_percent = 100,
  completed_lessons = 2,
  total_lessons = 2,
  completed_weeks = 1,
  current_week = 1
WHERE username = 'ram112' OR email = 'ramesh@gmail.com';


-- ============================================================================
-- 3. VERIFY BOTH TABLES
-- ============================================================================
SELECT 'Admins' AS table_name, count(*) AS total_records FROM public.admins
UNION ALL
SELECT 'Students (Profiles)' AS table_name, count(*) AS total_records FROM public.profiles;
