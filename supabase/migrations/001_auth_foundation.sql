-- ============================================================================
-- 001 — AUTH FOUNDATION (non-breaking; safe to run while the old site is live)
--
-- Adds:  auth links for mentors/admins, role helper functions, username→email
--        lookup for login, sign-up trigger that creates the student profile,
--        and a guard so students can't change their own role/status.
-- Does NOT change any access policy yet — that is 002_lock_down_rls.sql,
-- which runs only after the new frontend is deployed.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.mentors  ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.mentors  ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.admins   ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone  TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dob    TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS course TEXT;

-- ---------------------------------------------------------------------------
-- 2. Role helpers. The ONLY source of truth for who is admin/mentor/student.
--    Admin and mentor rows can only be written by admins (see 002).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.app_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL THEN NULL
    WHEN EXISTS (SELECT 1 FROM public.admins a
                 WHERE a.auth_user_id = auth.uid()
                   AND upper(coalesce(a.status, 'ACTIVE')) = 'ACTIVE') THEN 'ADMIN'
    WHEN EXISTS (SELECT 1 FROM public.mentors m
                 WHERE m.auth_user_id = auth.uid()
                   AND lower(coalesce(m.status, 'active')) <> 'on leave') THEN 'MENTOR'
    WHEN EXISTS (SELECT 1 FROM public.profiles p
                 WHERE p.id::text = auth.uid()::text
                   AND upper(coalesce(p.role, 'STUDENT')) = 'STUDENT'
                   AND upper(coalesce(p.status, 'APPROVED')) <> 'REJECTED') THEN 'STUDENT'
  END
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT coalesce(public.app_role() = 'ADMIN', false) $$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT coalesce(public.app_role() IN ('ADMIN', 'MENTOR'), false) $$;

-- What the frontend calls after login to decide which portal to open.
-- Returns NULL for unknown, rejected or on-leave accounts.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.app_role() $$;

REVOKE ALL ON FUNCTION public.app_role(), public.is_admin(), public.is_staff(), public.get_my_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.app_role(), public.is_admin(), public.is_staff(), public.get_my_role() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Login helper: lets people keep typing a username / mentor name.
--    Returns the sign-in email only when exactly one account matches.
--    It reveals nothing else (no id, no role, no password).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.login_email_for(identifier TEXT)
RETURNS TEXT
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  ident  TEXT := lower(trim(coalesce(identifier, '')));
  emails TEXT[];
BEGIN
  IF ident = '' THEN RETURN NULL; END IF;
  IF position('@' IN ident) > 0 THEN RETURN ident; END IF;

  SELECT array_agg(DISTINCT lower(u.email)) INTO emails
  FROM (
    SELECT p.id::text AS uid FROM public.profiles p WHERE lower(trim(p.username)) = ident
    UNION
    SELECT a.auth_user_id::text FROM public.admins a WHERE lower(trim(a.username)) = ident
    UNION
    SELECT m.auth_user_id::text FROM public.mentors m WHERE lower(trim(m.name)) = ident
  ) c
  JOIN auth.users u ON u.id::text = c.uid
  WHERE u.email IS NOT NULL;

  IF emails IS NULL OR array_length(emails, 1) <> 1 THEN RETURN NULL; END IF;
  RETURN emails[1];
END;
$$;

REVOKE ALL ON FUNCTION public.login_email_for(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.login_email_for(TEXT) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Sign-up trigger: the database (not the browser) creates the student
--    profile and first enrollment. Role is always STUDENT; students are
--    auto-approved, matching the current behaviour.
--    Accounts created by the admin tools carry app_metadata.kind and are skipped.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta      JSONB := coalesce(NEW.raw_user_meta_data, '{}'::jsonb);
  v_course  TEXT  := nullif(trim(meta->>'course'), '');
  v_course_id TEXT;
BEGIN
  IF coalesce(NEW.raw_app_meta_data->>'kind', '') IN ('admin', 'mentor', 'migrated') THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, username, phone, dob, course, role, status, updated_at)
  VALUES (
    NEW.id,
    lower(NEW.email),
    coalesce(nullif(trim(meta->>'full_name'), ''), split_part(NEW.email, '@', 1)),
    coalesce(nullif(lower(trim(meta->>'username')), ''), split_part(lower(NEW.email), '@', 1)),
    nullif(trim(meta->>'phone'), ''),
    nullif(trim(meta->>'dob'), ''),
    v_course,
    'STUDENT',
    'APPROVED',
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_course IS NOT NULL THEN
    SELECT c.id::text INTO v_course_id FROM public.courses c
    WHERE lower(c.title) = lower(v_course) LIMIT 1;

    IF v_course_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.student_id::text = NEW.id::text AND e.course_id::text = v_course_id
    ) THEN
      EXECUTE 'INSERT INTO public.enrollments (student_id, course_id, status, enrolled_at)
               VALUES ($1, $2, ''ACTIVE'', now())'
      USING NEW.id, v_course_id::uuid;
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block sign-up because of a profile/enrollment problem.
  RAISE WARNING 'handle_new_auth_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- 5. Profile guard: a logged-in non-admin can edit their own progress and
--    contact fields, but never their role, status, id or email.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF coalesce(auth.role(), '') IN ('anon', 'authenticated') AND NOT public.is_admin() THEN
    NEW.id     := OLD.id;
    NEW.role   := OLD.role;
    NEW.status := OLD.status;
    NEW.email  := OLD.email;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_profile_update ON public.profiles;
CREATE TRIGGER guard_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_update();
