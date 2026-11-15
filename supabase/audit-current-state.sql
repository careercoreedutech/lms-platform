-- ============================================================================
-- READ-ONLY AUDIT — run in Supabase SQL Editor and paste the results back.
-- Nothing here changes data. No passwords or personal data are returned.
-- ============================================================================

-- 1. Columns of every app table
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles','mentors','admins','courses','course_sections','course_items',
                     'enrollments','student_progress','feedbacks',
                     'newsletter_subscribers','counseling_requests')
ORDER BY table_name, ordinal_position;

-- 2. RLS on/off per table
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relnamespace = 'public'::regnamespace AND relkind = 'r'
ORDER BY relname;

-- 3. Every existing policy (public tables + storage)
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname IN ('public','storage')
ORDER BY schemaname, tablename, policyname;

-- 4. Constraints, foreign keys and existing triggers
SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY 1, 2;

SELECT event_object_schema, event_object_table, trigger_name, action_statement
FROM information_schema.triggers
WHERE event_object_schema IN ('public','auth');

-- 5. Account counts (numbers only)
SELECT
  (SELECT count(*) FROM auth.users)                                              AS auth_users,
  (SELECT count(*) FROM public.profiles)                                          AS profiles,
  (SELECT count(*) FROM public.profiles p WHERE NOT EXISTS
     (SELECT 1 FROM auth.users u WHERE u.id = p.id))                              AS profiles_without_auth,
  (SELECT count(*) FROM public.profiles WHERE email IS NULL OR email = '')        AS profiles_without_email,
  (SELECT count(*) FROM public.mentors)                                           AS mentors,
  (SELECT count(*) FROM public.mentors WHERE email IS NULL OR email = '')         AS mentors_without_email,
  (SELECT count(*) FROM public.admins)                                            AS admins;

-- 6. Storage bucket settings
SELECT id, name, public FROM storage.buckets;
