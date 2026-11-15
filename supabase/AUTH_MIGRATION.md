# Moving logins to Supabase Auth — runbook

Do these steps in order. Steps 1–3 don't break the live site. The new frontend (step 4) needs 1–3 to be done first.

## 0. Check what's there now (read-only)
In Supabase → SQL Editor, run `supabase/audit-current-state.sql`. Keep the output: it shows the current tables and policies.

## 1. Add the auth foundation
Run `supabase/migrations/001_auth_foundation.sql` in the SQL Editor. It adds:
- `auth_user_id` on `mentors` and `admins`
- `get_my_role()` and `login_email_for()`
- the sign-up trigger
- the profile guard

It doesn't change any access policy.

## 2. Create Auth logins for everyone
Run this on your own machine. Get the service role key from Supabase → Settings → API. Never commit it or paste it anywhere else.

```bash
SUPABASE_URL=https://plgzsaxvydceqidiwdup.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=... \
ADMIN_NEW_PASSWORD='...a new strong password...' \
node scripts/migrate-auth-accounts.mjs          # dry run
# then the same command with --apply
```

The script does three things:
- **Students** keep their current password.
- **Admins** get `ADMIN_NEW_PASSWORD`. The old shared admin password stops working.
- **Default passwords:** anyone on a default password (`student123`, `mentor123`, their own username, …) gets a random one instead. They're listed under `needsNewPassword` in `auth-migration-report.json`. That file is gitignored and contains emails, so don't share it.

## 3. Deploy the Edge Function
```bash
supabase functions deploy admin-users
```
This is needed for setting passwords, creating mentor logins and deleting users from the Admin Panel. Supabase provides its keys to the function automatically.

## 4. Deploy the new frontend
Then log in as the admin with the new password, and test:
- **Mentors:** for each one, use "Create login" or "Reset password" on their card to set a temporary password. They choose their own at first login.
- **Students on the `needsNewPassword` list:** use "Reset password", or they can use "Forgot password?" on the login box. That needs Supabase email to be working.
- **Smoke test:** log in as a student, a mentor and the admin.

## 5. Lock it down
Run `supabase/migrations/002_lock_down_rls.sql`. It does three things:
- replaces every open policy with role-based ones
- makes the video bucket private
- drops all `password` columns

Then run:
```bash
node scripts/check-public-access.mjs
```
It should report "No private data readable anonymously".

## Supabase settings to check
- **Authentication → Providers → Email:**
  - If "Confirm email" is ON, new students must click the email link before logging in. The site tells them this.
  - If it's OFF, they're logged in straight away, like before.
- **Authentication → URL Configuration:** add your site URL plus `/portal` to the allowed redirect URLs, so reset and confirmation links work.
