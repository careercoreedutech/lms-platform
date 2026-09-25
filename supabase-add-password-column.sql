-- =======================================================================
-- ADD PASSWORD COLUMN TO PROFILES TABLE & SET PASSWORDS FOR ALL STUDENTS
-- =======================================================================
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/plgzsaxvydceqidiwdup/sql/new)

-- 1. Add the password column to public.profiles if it does not already exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password text DEFAULT 'student123';

-- 2. Populate passwords for all existing student profiles
UPDATE public.profiles 
SET password = 'student123' 
WHERE password IS NULL OR password = '';

-- 3. Set specific passwords for existing test profiles (optional / convenience)
UPDATE public.profiles SET password = 'student123' WHERE username = 'teststudent99';
UPDATE public.profiles SET password = 'student123' WHERE username = 'ram112';
UPDATE public.profiles SET password = 'student123' WHERE username = 'qalivestudent';
UPDATE public.profiles SET password = 'student123' WHERE username = 'kk112';

-- 4. Verify columns in public.profiles
SELECT id, full_name, username, email, password, role, status, course, progress_percent
FROM public.profiles
ORDER BY created_at DESC;
