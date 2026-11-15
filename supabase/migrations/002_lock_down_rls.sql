-- ============================================================================
-- 002 — LOCK DOWN ACCESS (breaking for the OLD frontend)
--
-- Run ONLY after:
--   1. 001_auth_foundation.sql has run,
--   2. scripts/migrate-auth-accounts.mjs has run (every user has an auth login),
--   3. the new frontend is deployed and you've logged in as admin, mentor and student.
--
-- Replaces every policy on the app tables with role-based ones, locks the
-- course-videos bucket, and deletes the plain-text password columns.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Drop every existing policy on the core tables (they are all USING (true)
--    or unknown). Lead-capture tables and feedback read/insert are kept.
-- ---------------------------------------------------------------------------
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles','mentors','admins','courses','course_sections',
                        'course_items','enrollments','student_progress')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Admin manage feedbacks" ON public.feedbacks;

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks        ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Course catalogue: everyone reads, admins and mentors edit.
-- ---------------------------------------------------------------------------
CREATE POLICY "catalogue read"   ON public.courses         FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "catalogue write"  ON public.courses         FOR ALL    TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "sections read"    ON public.course_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "sections write"   ON public.course_sections FOR ALL    TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "items read"       ON public.course_items    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "items write"      ON public.course_items    FOR ALL    TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------------------------------------------------------------------------
-- 3. Profiles: own row, or staff. Only admins insert/delete.
--    (Sign-up rows are created by the security-definer trigger from 001.)
-- ---------------------------------------------------------------------------
CREATE POLICY "profiles read own or staff" ON public.profiles FOR SELECT TO authenticated
  USING (id::text = auth.uid()::text OR public.is_staff());
CREATE POLICY "profiles update own or admin" ON public.profiles FOR UPDATE TO authenticated
  USING (id::text = auth.uid()::text OR public.is_admin())
  WITH CHECK (id::text = auth.uid()::text OR public.is_admin());
CREATE POLICY "profiles admin insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "profiles admin delete" ON public.profiles FOR DELETE TO authenticated USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Enrollments and progress: student owns theirs; staff read; admin manages.
-- ---------------------------------------------------------------------------
CREATE POLICY "enrollments read own or staff" ON public.enrollments FOR SELECT TO authenticated
  USING (student_id::text = auth.uid()::text OR public.is_staff());
CREATE POLICY "enrollments insert own or admin" ON public.enrollments FOR INSERT TO authenticated
  WITH CHECK (student_id::text = auth.uid()::text OR public.is_admin());
CREATE POLICY "enrollments update own or admin" ON public.enrollments FOR UPDATE TO authenticated
  USING (student_id::text = auth.uid()::text OR public.is_admin())
  WITH CHECK (student_id::text = auth.uid()::text OR public.is_admin());
CREATE POLICY "enrollments admin delete" ON public.enrollments FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE POLICY "progress read own or staff" ON public.student_progress FOR SELECT TO authenticated
  USING (student_id::text = auth.uid()::text OR public.is_staff());
CREATE POLICY "progress insert own" ON public.student_progress FOR INSERT TO authenticated
  WITH CHECK (student_id::text = auth.uid()::text OR public.is_admin());
CREATE POLICY "progress update own" ON public.student_progress FOR UPDATE TO authenticated
  USING (student_id::text = auth.uid()::text OR public.is_admin())
  WITH CHECK (student_id::text = auth.uid()::text OR public.is_admin());
CREATE POLICY "progress admin delete" ON public.student_progress FOR DELETE TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Mentors and admins tables.
-- ---------------------------------------------------------------------------
CREATE POLICY "mentors read staff"   ON public.mentors FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "mentors admin manage" ON public.mentors FOR ALL    TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admins read own or admin" ON public.admins FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR public.is_admin());
CREATE POLICY "admins admin manage" ON public.admins FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Feedback moderation and lead tables: admins only (public insert stays).
-- ---------------------------------------------------------------------------
CREATE POLICY "Admin manage feedbacks" ON public.feedbacks FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DO $$
BEGIN
  IF to_regclass('public.newsletter_subscribers') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin read subscribers" ON public.newsletter_subscribers;
    CREATE POLICY "Admin read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
  IF to_regclass('public.counseling_requests') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin read counseling" ON public.counseling_requests;
    CREATE POLICY "Admin read counseling" ON public.counseling_requests FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 7. course-videos bucket: private; logged-in students/staff watch,
--    admins and mentors upload.
-- ---------------------------------------------------------------------------
UPDATE storage.buckets SET public = false WHERE id = 'course-videos';

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (coalesce(qual, '') ILIKE '%course-videos%' OR coalesce(with_check, '') ILIKE '%course-videos%')
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "course videos read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'course-videos' AND public.app_role() IS NOT NULL);
CREATE POLICY "course videos insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'course-videos' AND public.is_staff());
CREATE POLICY "course videos update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'course-videos' AND public.is_staff())
  WITH CHECK (bucket_id = 'course-videos' AND public.is_staff());
CREATE POLICY "course videos delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'course-videos' AND public.is_staff());

-- ---------------------------------------------------------------------------
-- 8. Delete plain-text passwords. Supabase Auth now holds the only (hashed) copy.
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles DROP COLUMN IF EXISTS password;
ALTER TABLE public.mentors  DROP COLUMN IF EXISTS password;
ALTER TABLE public.admins   DROP COLUMN IF EXISTS password;

COMMIT;
