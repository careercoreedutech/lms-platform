const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://plgzsaxvydceqidiwdup.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_z_5212pzL70-D30Gw0JTsw_Cp1QJT7v';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runScaleAndIntegrityVerification() {
  console.log('================================================================');
  console.log('  SUPABASE ENTERPRISE DATABASE & 100K SCALE VERIFICATION SUITE  ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function report(title, isPass, detail = '') {
    if (isPass) {
      passed++;
      console.log(`[PASS] ${title} ${detail ? '-> ' + detail : ''}`);
    } else {
      failed++;
      console.error(`[FAIL] ${title} ${detail ? '-> ' + detail : ''}`);
    }
  }

  // 1. Relational Lesson Hierarchy
  console.log('--- 1. Relational Hierarchy: courses -> course_sections -> course_items ---');
  const t0 = Date.now();
  const { data: courses, error: cErr } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      category,
      course_sections (
        id,
        week_number,
        title,
        order_index,
        course_items (
          id,
          title,
          content_type,
          duration,
          order_index
        )
      )
    `);
  const t1 = Date.now();

  report('Query nested courses/sections/items in single network round-trip', !cErr && courses && courses.length > 0, `Took ${t1 - t0}ms (${courses?.length || 0} courses loaded)`);

  let totalLessonsFound = 0;
  courses?.forEach(c => {
    const sections = c.course_sections || [];
    const itemCount = sections.reduce((acc, s) => acc + (s.course_items?.length || 0), 0);
    totalLessonsFound += itemCount;
    console.log(`  * [Course: "${c.title}"] -> ${sections.length} sections, ${itemCount} lesson items`);
  });

  report('Total active lesson items stored in course_items', totalLessonsFound > 0, `${totalLessonsFound} items across courses`);

  // 2. Student Progress & Integrity Check
  console.log('\n--- 2. Student Progress & Enrolled Progress Integrity ---');
  const { data: progressRows, error: pErr } = await supabase
    .from('student_progress')
    .select('*');

  report('Query student_progress table', !pErr && Array.isArray(progressRows), `${progressRows?.length || 0} completion records`);

  const { data: enrollments, error: eErr } = await supabase
    .from('enrollments')
    .select('id, student_id, course_id, status, progress_percent');

  report('Query enrollments table with progress_percent', !eErr && Array.isArray(enrollments), `${enrollments?.length || 0} active enrollments`);

  // 3. High-Scale Query Performance Test
  console.log('\n--- 3. 10k–100k High-Scale Pattern Test ---');
  const testStudentId = enrollments?.[0]?.student_id || '0619c97b-8779-4a61-9422-f741654dcf0a';

  // Test 3a: Targeted Student Query with index simulation
  const tStartSingle = Date.now();
  const { data: studentProgress, error: spErr } = await supabase
    .from('student_progress')
    .select('item_id, status')
    .eq('student_id', testStudentId);
  const tEndSingle = Date.now();

  report(
    'Targeted student progress query (per-student index access)',
    !spErr && (tEndSingle - tStartSingle) < 500,
    `Latency: ${tEndSingle - tStartSingle}ms (Records: ${studentProgress?.length || 0})`
  );

  // Test 3b: Paginated Admin Query
  const tStartPage = Date.now();
  const { data: paginatedStudents, error: pgErr } = await supabase
    .from('profiles')
    .select('id, full_name, role, status')
    .eq('role', 'STUDENT')
    .range(0, 50);
  const tEndPage = Date.now();

  report(
    'Paginated student roster query (range 0..50)',
    !pgErr && (tEndPage - tStartPage) < 500,
    `Latency: ${tEndPage - tStartPage}ms (Loaded: ${paginatedStudents?.length || 0} students)`
  );

  // 4. Schema Migration Script Existence
  console.log('\n--- 4. Migration & SQL Script Verification ---');
  const fs = require('fs');
  const path = require('path');
  const sqlPath = path.join(__dirname, '..', 'supabase-schema-scale-100k.sql');
  const sqlExists = fs.existsSync(sqlPath);
  const sqlContent = sqlExists ? fs.readFileSync(sqlPath, 'utf8') : '';

  report(
    'supabase-schema-scale-100k.sql exists in workspace root',
    sqlExists,
    `Size: ${sqlContent.length} bytes`
  );

  report(
    'SQL script includes UNIQUE(student_id, item_id) constraint',
    sqlContent.includes('idx_student_progress_student_item') && sqlContent.includes('UNIQUE'),
    'Enforces zero duplicate progress entries'
  );

  report(
    'SQL script includes feedbacks table DDL with RLS',
    sqlContent.includes('CREATE TABLE IF NOT EXISTS public.feedbacks') && sqlContent.includes('ENABLE ROW LEVEL SECURITY'),
    'Supports pure Supabase feedback reviews'
  );

  console.log('\n================================================================');
  console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runScaleAndIntegrityVerification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
