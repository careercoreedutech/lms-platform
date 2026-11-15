#!/usr/bin/env node
/**
 * One-time move of every student, mentor and admin onto Supabase Auth.
 *
 * Run AFTER supabase/migrations/001_auth_foundation.sql and BEFORE 002.
 *
 *   SUPABASE_URL=https://<project>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=<service role key — never commit or paste it> \
 *   ADMIN_NEW_PASSWORD='<new strong admin password>' \
 *   node scripts/migrate-auth-accounts.mjs            # dry run: prints what it would do
 *   node scripts/migrate-auth-accounts.mjs --apply    # actually writes
 *
 * Rules:
 *  - Students and mentors keep the password currently stored for them, so nobody
 *    is locked out.
 *  - Accounts still on a default/guessable password (student123, mentor123, their
 *    own username, ...) get a random password instead. They are listed in
 *    auth-migration-report.json so an admin can set a temporary password for them
 *    (or they can use "Forgot password").
 *  - Admins get ADMIN_NEW_PASSWORD; the old shared admin password stops working.
 *  - Passwords are never printed. The report holds names/emails, so it is gitignored.
 */
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_NEW_PASSWORD } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}
if (!ADMIN_NEW_PASSWORD || ADMIN_NEW_PASSWORD.length < 12) {
  console.error('Set ADMIN_NEW_PASSWORD (at least 12 characters).');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEFAULT_PASSWORDS = new Set([
  '', 'student123', 'password123', 'student', 'mentor123', 'teacher123',
  'megaviz@1234', 'admin123', 'password', '123456', '12345678',
]);

function isGuessable(pw, ...names) {
  const p = (pw || '').trim();
  if (p.length < 6 || DEFAULT_PASSWORDS.has(p.toLowerCase())) return true;
  return names.filter(Boolean).some((n) => {
    const base = String(n).trim().toLowerCase().split(/\s+/)[0];
    return base && [base, `${base}123`, `${base}@123`].includes(p.toLowerCase());
  });
}
const randomPassword = () => randomBytes(24).toString('base64url');
const syntheticMentorEmail = (id) => `mentor-${String(id).replace(/[^a-z0-9]/gi, '').slice(0, 12).toLowerCase()}@mentors.careercore.invalid`;

const report = { applied: APPLY, created: [], updated: [], linked: [], needsNewPassword: [], skipped: [], errors: [] };

async function listAllAuthUsers() {
  const all = [];
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    all.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return all;
}

async function selectAll(table) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select('*').range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < 1000) break;
  }
  return rows;
}

async function act(label, entry, fn) {
  if (!APPLY) { report[label].push({ ...entry, dryRun: true }); return null; }
  try {
    const res = await fn();
    if (res?.error) throw res.error;
    report[label].push(entry);
    return res;
  } catch (e) {
    report.errors.push({ ...entry, step: label, error: e.message || String(e) });
    return null;
  }
}

async function main() {
  console.log(APPLY ? '== APPLYING CHANGES ==' : '== DRY RUN (add --apply to write) ==');
  const authUsers = await listAllAuthUsers();
  const byId = new Map(authUsers.map((u) => [u.id, u]));
  const byEmail = new Map(authUsers.filter((u) => u.email).map((u) => [u.email.toLowerCase(), u]));

  // ---------------- Students ----------------
  const profiles = await selectAll('profiles');
  for (const p of profiles) {
    const role = (p.role || 'STUDENT').toUpperCase();
    if (role !== 'STUDENT') continue;
    const who = { kind: 'student', id: p.id, username: p.username, email: p.email };
    const weak = isGuessable(p.password, p.username, p.full_name);
    const password = weak ? randomPassword() : p.password.trim();
    if (weak) report.needsNewPassword.push(who);

    const existing = byId.get(p.id);
    if (existing) {
      await act('updated', who, () => db.auth.admin.updateUserById(p.id, { password }));
      continue;
    }
    const email = (p.email || '').trim().toLowerCase();
    if (!email) { report.skipped.push({ ...who, reason: 'no email on profile' }); continue; }
    if (byEmail.has(email)) {
      report.skipped.push({ ...who, reason: `email already used by another auth account (${byEmail.get(email).id})` });
      continue;
    }
    await act('created', who, () => db.auth.admin.createUser({
      id: p.id, email, password, email_confirm: true,
      app_metadata: { kind: 'migrated' },
      user_metadata: { full_name: p.full_name, username: p.username },
    }));
  }

  // ---------------- Mentors ----------------
  const mentors = await selectAll('mentors');
  for (const m of mentors) {
    const who = { kind: 'mentor', id: m.id, name: m.name };
    const weak = isGuessable(m.password, m.name);
    const password = weak ? randomPassword() : m.password.trim();
    if (weak) report.needsNewPassword.push(who);

    if (m.auth_user_id && byId.has(m.auth_user_id)) {
      await act('updated', who, () => db.auth.admin.updateUserById(m.auth_user_id, {
        password, app_metadata: { kind: 'mentor' },
      }));
      continue;
    }
    const email = (m.email || '').trim().toLowerCase() || syntheticMentorEmail(m.id);
    let authId = byEmail.get(email)?.id;
    if (authId) {
      await act('linked', who, () => db.auth.admin.updateUserById(authId, { password, app_metadata: { kind: 'mentor' } }));
    } else {
      const res = await act('created', who, () => db.auth.admin.createUser({
        email, password, email_confirm: true,
        app_metadata: { kind: 'mentor' }, user_metadata: { full_name: m.name },
      }));
      authId = res?.data?.user?.id;
    }
    if (authId) {
      await act('linked', { ...who, step: 'mentors.auth_user_id' }, () =>
        db.from('mentors').update({ auth_user_id: authId }).eq('id', m.id));
    }
  }

  // ---------------- Admins ----------------
  const admins = await selectAll('admins');
  for (const a of admins) {
    const who = { kind: 'admin', id: a.id, username: a.username, email: a.email };
    const email = (a.email || '').trim().toLowerCase();
    if (!email) { report.skipped.push({ ...who, reason: 'no email on admin row' }); continue; }
    let authId = (a.auth_user_id && byId.has(a.auth_user_id)) ? a.auth_user_id : byEmail.get(email)?.id;
    if (authId) {
      await act('updated', who, () => db.auth.admin.updateUserById(authId, {
        password: ADMIN_NEW_PASSWORD, email_confirm: true, app_metadata: { kind: 'admin' },
      }));
    } else {
      const res = await act('created', who, () => db.auth.admin.createUser({
        email, password: ADMIN_NEW_PASSWORD, email_confirm: true,
        app_metadata: { kind: 'admin' }, user_metadata: { full_name: a.full_name },
      }));
      authId = res?.data?.user?.id;
    }
    if (authId) {
      await act('linked', { ...who, step: 'admins.auth_user_id' }, () =>
        db.from('admins').update({ auth_user_id: authId }).eq('id', a.id));
    }
  }

  writeFileSync('auth-migration-report.json', JSON.stringify(report, null, 2));
  console.log({
    created: report.created.length,
    updated: report.updated.length,
    linked: report.linked.length,
    needsNewPassword: report.needsNewPassword.length,
    skipped: report.skipped.length,
    errors: report.errors.length,
  });
  console.log('Details: auth-migration-report.json (contains names/emails — do not commit or share).');
  if (report.errors.length) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
