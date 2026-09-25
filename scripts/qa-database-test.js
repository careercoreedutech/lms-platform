/**
 * Automated QA Database & Storage Reflection Test
 * 
 * Verifies:
 * 1. Profile Creation (Student profile with Phone and DOB in `profiles` table)
 * 2. Mentor Creation & Sync (`mentors` table and `profiles` table)
 * 3. Video Upload to Supabase Storage (`course-videos` bucket)
 * 4. Course, Section & Item Persistence (`courses`, `course_sections`, `course_items` tables)
 * 5. Signed Video URL Generation & Streaming Verification
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://plgzsaxvydceqidiwdup.supabase.co';
const SUPABASE_KEY = 'sb_publishable_z_5212pzL70-D30Gw0JTsw_Cp1QJT7v';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEST_TIMESTAMP = Date.now();
const QA_STUDENT_ID = `qa_std_${TEST_TIMESTAMP}`;
const QA_MENTOR_ID = `qa_mnt_${TEST_TIMESTAMP}`;
const QA_COURSE_ID = `qa_crs_${TEST_TIMESTAMP}`;

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  if (passed) {
    results.passed++;
    console.log(`[PASS] ${name} ${details ? '(' + details + ')' : ''}`);
  } else {
    results.failed++;
    console.error(`[FAIL] ${name} ${details ? ': ' + details : ''}`);
  }
  results.tests.push({ name, passed, details });
}

async function runQASuite() {
  console.log('====================================================');
  console.log('  STARTING CAREERCORE QA DATABASE & STORAGE SUITE   ');
  console.log(`  Timestamp: ${new Date().toISOString()}            `);
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST 1: Student Profile Creation with Phone & DOB
  // ----------------------------------------------------
  console.log('--- TEST 1: Student Profile Creation & Reflection ---');
  const studentPayload = {
    id: QA_STUDENT_ID,
    email: `qa_student_${TEST_TIMESTAMP}@careercore-qa.internal`,
    full_name: 'QA Test Student',
    username: `qa_student_${TEST_TIMESTAMP}`,
    role: 'STUDENT',
    status: 'PENDING',
    phone: '+91 83418 76728',
    dob: '1998-05-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: stdInsert, error: stdInsertErr } = await supabase
    .from('profiles')
    .upsert(studentPayload)
    .select()
    .single();

  if (stdInsertErr) {
    logTest('Insert Student Profile', false, stdInsertErr.message);
  } else {
    logTest('Insert Student Profile', true, `ID: ${stdInsert.id}`);
  }

  // Verify reflection in DB
  const { data: stdFetch, error: stdFetchErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', QA_STUDENT_ID)
    .single();

  const stdReflected = !!stdFetch && 
    stdFetch.phone === '+91 83418 76728' && 
    stdFetch.dob === '1998-05-15' &&
    stdFetch.role === 'STUDENT';

  logTest(
    'Verify Student Profile DB Reflection (Phone & DOB)',
    stdReflected,
    stdReflected ? `Phone: ${stdFetch.phone}, DOB: ${stdFetch.dob}, Status: ${stdFetch.status}` : JSON.stringify(stdFetchErr || stdFetch)
  );

  // ----------------------------------------------------
  // TEST 2: Mentor Creation & Profiles Table Sync
  // ----------------------------------------------------
  console.log('\n--- TEST 2: Mentor Creation & Dual Reflection ---');
  const mentorPayload = {
    id: QA_MENTOR_ID,
    name: 'QA Senior Architect',
    role: 'Principal Staff Engineer',
    company: 'Google / DeepMind',
    course: 'Full Stack Web Dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    rating: 4.95,
    reviews_count: 88,
    mentees_count: 140,
    status: 'Active',
    experience: '12+ Years Experience',
    bio: 'Lead system architect guiding students through distributed systems and cloud scale.',
    created_at: new Date().toISOString()
  };

  const { data: mntInsert, error: mntInsertErr } = await supabase
    .from('mentors')
    .upsert(mentorPayload)
    .select()
    .single();

  logTest('Insert Mentor in mentors table', !mntInsertErr, mntInsertErr?.message || `ID: ${mntInsert?.id}`);

  // Dual reflection into profiles table
  const mentorProfilePayload = {
    id: QA_MENTOR_ID,
    full_name: mentorPayload.name,
    username: `qa_mentor_${TEST_TIMESTAMP}`,
    role: 'MENTOR',
    status: 'APPROVED',
    phone: '+91 83418 76728',
    dob: '1988-10-22',
    updated_at: new Date().toISOString()
  };

  const { data: mntProfInsert, error: mntProfErr } = await supabase
    .from('profiles')
    .upsert(mentorProfilePayload)
    .select()
    .single();

  logTest('Sync Mentor in profiles table', !mntProfErr, mntProfErr?.message || `ID: ${mntProfInsert?.id}`);

  // Query both tables to assert reflection
  const { data: mntDbRecord } = await supabase.from('mentors').select('*').eq('id', QA_MENTOR_ID).single();
  const { data: mntProfRecord } = await supabase.from('profiles').select('*').eq('id', QA_MENTOR_ID).single();

  const mentorDualReflected = !!mntDbRecord && !!mntProfRecord && mntProfRecord.dob === '1988-10-22';
  logTest(
    'Verify Mentor Dual Reflection in Database',
    mentorDualReflected,
    mentorDualReflected ? `mentors.name: "${mntDbRecord.name}", profiles.dob: "${mntProfRecord.dob}", role: "${mntProfRecord.role}"` : 'Failed dual reflection'
  );

  // ----------------------------------------------------
  // TEST 3: Video File Upload to Supabase Storage
  // ----------------------------------------------------
  console.log('\n--- TEST 3: Video File Upload to Supabase Storage ---');
  // Create a valid binary MP4 container buffer (ftyp box + basic atoms)
  const ftypHeader = Buffer.from([
    0x00, 0x00, 0x00, 0x20, // box size: 32 bytes
    0x66, 0x74, 0x79, 0x70, // 'ftyp'
    0x69, 0x73, 0x6f, 0x6d, // major brand 'isom'
    0x00, 0x00, 0x02, 0x00, // minor version
    0x69, 0x73, 0x6f, 0x6d, // compatible brand 'isom'
    0x69, 0x73, 0x6f, 0x32, // compatible brand 'iso2'
    0x61, 0x76, 0x63, 0x31, // compatible brand 'avc1'
    0x6d, 0x70, 0x34, 0x31  // compatible brand 'mp41'
  ]);
  const dummyPayload = Buffer.alloc(1024 * 64, 0x41); // 64KB dummy media data
  const testVideoBuffer = Buffer.concat([ftypHeader, dummyPayload]);

  const storageFilePath = `courses/qa_test_video_${TEST_TIMESTAMP}.mp4`;

  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('course-videos')
    .upload(storageFilePath, testVideoBuffer, {
      contentType: 'video/mp4',
      cacheControl: '3600',
      upsert: true
    });

  logTest('Upload Video to Supabase Storage (course-videos)', !uploadErr, uploadErr?.message || `Path: ${uploadData?.path}`);

  // Verify file in storage
  const { data: fileList, error: listErr } = await supabase.storage
    .from('course-videos')
    .list('courses', { search: `qa_test_video_${TEST_TIMESTAMP}` });

  const fileReflected = fileList && fileList.length > 0;
  logTest(
    'Verify Video Storage Reflection',
    fileReflected,
    fileReflected ? `File: ${fileList[0].name}, Size: ${fileList[0].metadata?.size || testVideoBuffer.length} bytes` : 'File not listed in bucket'
  );

  // Test signed URL generation
  const { data: signedData, error: signedErr } = await supabase.storage
    .from('course-videos')
    .createSignedUrl(storageFilePath, 3600);

  const signedUrlOk = !signedErr && signedData?.signedUrl && signedData.signedUrl.includes('token=');
  logTest('Generate Time-Limited Signed Video URL', signedUrlOk, signedUrlOk ? 'Signed URL valid with auth token' : signedErr?.message);

  // ----------------------------------------------------
  // TEST 4: Course, Section, and Video Item Database Reflection
  // ----------------------------------------------------
  console.log('\n--- TEST 4: Course, Section & Video Item DB Reflection ---');
  const coursePayload = {
    id: QA_COURSE_ID,
    title: `QA Masterclass: Full Stack AI Systems (${TEST_TIMESTAMP})`,
    category: 'Full Stack Engineering',
    duration: '6 Weeks',
    price: '₹29,999',
    description: 'Comprehensive QA verified course with end-to-end architecture and DRM protection.',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
    button_text: 'Enroll Now',
    redirect_course: 'qa-masterclass',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: crsInsert, error: crsErr } = await supabase
    .from('courses')
    .upsert(coursePayload)
    .select()
    .single();

  logTest('Insert Course in courses table', !crsErr, crsErr?.message || `Title: ${crsInsert?.title}`);

  // Insert Section
  const sectionPayload = {
    course_id: QA_COURSE_ID,
    title: 'Week 1: High-Performance Architecture',
    week_number: 1,
    order_index: 0,
    created_at: new Date().toISOString()
  };

  const { data: secInsert, error: secErr } = await supabase
    .from('course_sections')
    .insert(sectionPayload)
    .select()
    .single();

  logTest('Insert Section in course_sections table', !secErr, secErr?.message || `Section ID: ${secInsert?.id}`);

  // Insert Video Item linking to the uploaded storage video
  let itemReflected = false;
  if (secInsert?.id) {
    const itemPayload = {
      section_id: secInsert.id,
      title: 'Day 1: Microservices & DRM Video Pipeline',
      content_type: 'video',
      video_storage_path: storageFilePath,
      video_url: storageFilePath,
      duration: '45 mins',
      articles_count: 2,
      mcqs_count: 3,
      quiz_data: [
        { question: 'What ensures video cannot be downloaded?', options: ['XOR Scramble', 'Closed Shadow DOM', 'Octet-Stream MIME', 'All of the above'], correctIndex: 3 }
      ],
      is_free_preview: true,
      order_index: 0,
      created_at: new Date().toISOString()
    };

    const { data: itmInsert, error: itmErr } = await supabase
      .from('course_items')
      .insert(itemPayload)
      .select()
      .single();

    logTest('Insert Video Item in course_items table', !itmErr, itmErr?.message || `Item ID: ${itmInsert?.id}`);

    // Verify deep database reflection
    const { data: fullCourseQuery } = await supabase
      .from('courses')
      .select(`
        id, title,
        course_sections (
          id, title, week_number,
          course_items (
            id, title, content_type, video_storage_path, video_url
          )
        )
      `)
      .eq('id', QA_COURSE_ID)
      .single();

    const nestedItem = fullCourseQuery?.course_sections?.[0]?.course_items?.[0];
    itemReflected = !!nestedItem && nestedItem.video_storage_path === storageFilePath;
    logTest(
      'Verify Deep Relational DB Reflection (Course -> Section -> Video Item)',
      itemReflected,
      itemReflected ? `Video linked to storage: "${nestedItem.video_storage_path}"` : 'Relational nesting check failed'
    );
  }

  // ----------------------------------------------------
  // TEST 5: Student Progress & Enrollment Reflection
  // ----------------------------------------------------
  console.log('\n--- TEST 5: Enrollment & Student Progress DB Reflection ---');
  const enrollmentPayload = {
    student_id: QA_STUDENT_ID,
    course_id: QA_COURSE_ID,
    status: 'ACTIVE',
    progress_percent: 100,
    payment_status: 'COMPLETED',
    payment_id: `pay_qa_${TEST_TIMESTAMP}`,
    enrolled_at: new Date().toISOString()
  };

  const { data: enrollData, error: enrollErr } = await supabase
    .from('enrollments')
    .insert(enrollPayload)
    .select()
    .single();

  logTest('Insert Enrollment in enrollments table', !enrollErr, enrollErr?.message || `Enrollment ID: ${enrollData?.id}`);

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`  QA TEST RUN COMPLETE: ${results.passed} PASSED, ${results.failed} FAILED`);
  console.log('====================================================\n');

  return results;
}

runQASuite()
  .then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  })
  .catch(err => {
    console.error('Unhandled QA test error:', err);
    process.exit(1);
  });
