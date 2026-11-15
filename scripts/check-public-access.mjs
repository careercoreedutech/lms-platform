#!/usr/bin/env node
/**
 * Shows what an anonymous visitor (public key only, not signed in) can see or change.
 * Prints counts only — never row contents.
 *
 *   node scripts/check-public-access.mjs
 *
 * After 002_lock_down_rls.sql every PRIVATE table should show 0 / blocked.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://plgzsaxvydceqidiwdup.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_z_5212pzL70-D30Gw0JTsw_Cp1QJT7v';
const db = createClient(url, key, { auth: { persistSession: false } });

const PRIVATE = ['profiles', 'mentors', 'admins', 'enrollments', 'student_progress',
                 'newsletter_subscribers', 'counseling_requests'];
const PUBLIC = ['courses', 'course_sections', 'course_items', 'feedbacks'];

let failures = 0;

async function count(table) {
  const { count: n, error } = await db.from(table).select('*', { count: 'exact', head: true });
  return error ? `blocked (${error.code || error.message})` : n;
}

console.log('Anonymous read access:');
for (const t of PRIVATE) {
  const r = await count(t);
  const ok = typeof r !== 'number' || r === 0;
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'OPEN'}  ${t.padEnd(24)} ${r}`);
}
for (const t of PUBLIC) {
  console.log(`  info  ${t.padEnd(24)} ${await count(t)}  (meant to be public)`);
}

// Password columns should be gone (the select fails once they are dropped).
for (const t of ['profiles', 'mentors', 'admins']) {
  const { error } = await db.from(t).select('password').limit(1);
  const gone = !!error && /column|does not exist|42703/i.test(`${error.code} ${error.message}`);
  console.log(`  ${gone ? 'OK  ' : 'WARN'}  ${t}.password column ${gone ? 'removed' : 'still exists'}`);
}

// Anonymous write attempt that must be refused (matches no row, changes nothing).
const { error: wErr, count: wCount } = await db.from('admins')
  .update({ status: 'ACTIVE' }, { count: 'exact' })
  .eq('id', '00000000-0000-0000-0000-000000000000');
console.log(`  info  anonymous update on admins: ${wErr ? 'refused' : `allowed by policy (rows: ${wCount ?? 0})`}`);

console.log(failures ? `\n${failures} private table(s) readable by anyone.` : '\nNo private data readable anonymously.');
process.exitCode = failures ? 1 : 0;
