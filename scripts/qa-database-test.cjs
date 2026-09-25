/**
 * Automated QA Database & Storage Reflection Test
 * 
 * Verifies:
 * 1. Profile Creation (Student profile with Phone and DOB in `profiles` table)
 * 2. Mentor Creation & Reflection (`mentors` table)
 * 3. Video Upload to Supabase Storage (`course-videos` bucket)
 * 4. Course Section & Video Item Persistence (`course_sections`, `course_items` tables)
 * 5. Signed Video URL Generation & Streaming Token Verification
 * 6. Student Enrollment DB Reflection (`enrollments` table)
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://plgzsaxvydceqidiwdup.supabase.co';
const SUPABASE_KEY = 'sb_publishable_z_5212pzL70-D30Gw0JTsw_Cp1QJT7v';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEST_TIMESTAMP = Date.now();
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

  let testStudentId = null;
  let testMentorId = null;
  let testStoragePath = null;
  let testCourseItemId = null;
  let testEnrollmentId = null;

  try {
    // ----------------------------------------------------
    // TEST 1: Student Profile Creation with Phone & DOB
    // ----------------------------------------------------
    console.log('--- TEST 1: Student Profile Creation & Reflection ---');
    const studentEmail = `qa_student_${TEST_TIMESTAMP}@careercore-qa.internal`;
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: studentEmail,
      password: 'Password123!',
      options: {
        data: {
          full_name: 'QA Test Student',
          username: `qa_std_${TEST_TIMESTAMP}`
        }
      }
    });

    if (authErr || !authData?.user?.id) {
      logTest('Student Auth SignUp', false, authErr?.message || 'No user ID returned');
    } else {
      testStudentId = authData.user.id;
      logTest('Student Auth SignUp', true, `Auth User ID: ${testStudentId}`);

      const studentPayload = {
        id: testStudentId,
        email: studentEmail,
        full_name: 'QA Test Student',
        username: `qa_std_${TEST_TIMESTAMP}`,
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

      logTest('Insert Student Profile with Phone & DOB', !stdInsertErr, stdInsertErr?.message || `ID: ${stdInsert?.id}`);

      // Query from DB to assert reflection
      const { data: stdFetch, error: stdFetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testStudentId)
        .single();

      const stdReflected = !!stdFetch && 
        stdFetch.phone === '+91 83418 76728' && 
        stdFetch.dob === '1998-05-15' &&
        stdFetch.role === 'STUDENT';

      logTest(
        'Verify Student Profile DB Reflection (Phone & DOB)',
        stdReflected,
        stdReflected ? `Phone: "${stdFetch.phone}", DOB: "${stdFetch.dob}", Status: "${stdFetch.status}"` : JSON.stringify(stdFetchErr || stdFetch)
      );

      // Test status update to APPROVED
      const { data: stdApproved, error: appErr } = await supabase
        .from('profiles')
        .update({ status: 'APPROVED', updated_at: new Date().toISOString() })
        .eq('id', testStudentId)
        .select()
        .single();

      logTest('Update Student Status to APPROVED in DB', !appErr && stdApproved?.status === 'APPROVED', `Status: ${stdApproved?.status}`);
    }

    // ----------------------------------------------------
    // TEST 2: Mentor Creation & Reflection in mentors Table
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Mentor Creation & DB Reflection ---');
    const mentorPayload = {
      name: `QA Lead Mentor ${TEST_TIMESTAMP}`,
      role: 'Staff Infrastructure Architect',
      company: 'Google DeepMind',
      course: 'Full Stack Web Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
      rating: 4.98,
      reviews_count: 95,
      mentees_count: 180,
      status: 'Active',
      experience: '10+ Years Experience',
      bio: 'Leading backend scalability and secure streaming pipelines.',
      created_at: new Date().toISOString()
    };

    const { data: mntInsert, error: mntInsertErr } = await supabase
      .from('mentors')
      .insert(mentorPayload)
      .select()
      .single();

    if (mntInsertErr) {
      logTest('Insert Mentor in mentors table', false, mntInsertErr.message);
    } else {
      testMentorId = mntInsert.id;
      logTest('Insert Mentor in mentors table', true, `Mentor ID: ${testMentorId}`);

      // Query mentors table to assert reflection
      const { data: mntFetch } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', testMentorId)
        .single();

      const mntReflected = !!mntFetch && mntFetch.company === 'Google DeepMind' && mntFetch.status === 'Active';
      logTest(
        'Verify Mentor DB Reflection',
        mntReflected,
        mntReflected ? `Name: "${mntFetch.name}", Role: "${mntFetch.role}", Company: "${mntFetch.company}"` : 'Mentor query failed'
      );
    }

    // ----------------------------------------------------
    // TEST 3: Video File Upload to Supabase Storage
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Video File Upload to Supabase Storage ---');
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

    testStoragePath = `courses/qa_test_video_${TEST_TIMESTAMP}.mp4`;

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('course-videos')
      .upload(testStoragePath, testVideoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: true
      });

    logTest('Upload Video to Supabase Storage (course-videos)', !uploadErr, uploadErr?.message || `Path: ${uploadData?.path}`);

    // Verify file in storage
    const { data: fileList } = await supabase.storage
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
      .createSignedUrl(testStoragePath, 3600);

    const signedUrlOk = !signedErr && signedData?.signedUrl && signedData.signedUrl.includes('token=');
    logTest('Generate Time-Limited Signed Video URL', signedUrlOk, signedUrlOk ? 'Signed URL generated with valid token' : signedErr?.message);

    // ----------------------------------------------------
    // TEST 4: Course Item & Video Association in Database
    // ----------------------------------------------------
    console.log('\n--- TEST 4: Course Item & Video DB Reflection ---');
    // Fetch active course and section
    const { data: courseRow } = await supabase.from('courses').select('id, title').limit(1).single();
    const { data: secRow } = await supabase.from('course_sections').select('id, title').eq('course_id', courseRow.id).limit(1).single();

    if (courseRow && secRow) {
      const itemPayload = {
        section_id: secRow.id,
        title: `QA Architecture Video Lesson (${TEST_TIMESTAMP})`,
        content_type: 'video',
        video_storage_path: testStoragePath,
        video_url: testStoragePath,
        duration: '35 mins',
        articles_count: 2,
        mcqs_count: 4,
        quiz_data: [
          { question: 'What protects video from downloader extensions?', options: ['XOR Scramble', 'Closed Shadow DOM', 'Both'], correctIndex: 2 }
        ],
        is_free_preview: true,
        order_index: 99
      };

      const { data: itemData, error: itmErr } = await supabase
        .from('course_items')
        .insert(itemPayload)
        .select()
        .single();

      if (itmErr) {
        logTest('Insert Video Item in course_items table', false, itmErr.message);
      } else {
        testCourseItemId = itemData.id;
        logTest('Insert Video Item in course_items table', true, `Item ID: ${testCourseItemId}`);

        // Verify reflection from database
        const { data: itmFetch } = await supabase
          .from('course_items')
          .select('*')
          .eq('id', testCourseItemId)
          .single();

        const itmReflected = !!itmFetch && itmFetch.video_storage_path === testStoragePath;
        logTest(
          'Verify Video Association in Database',
          itmReflected,
          itmReflected ? `video_storage_path: "${itmFetch.video_storage_path}"` : 'Failed video association'
        );
      }
    }

    // ----------------------------------------------------
    // TEST 5: Enrollment DB Reflection
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Student Enrollment DB Reflection ---');
    if (testStudentId && courseRow) {
      const { data: enrData, error: enrErr } = await supabase
        .from('enrollments')
        .insert({
          student_id: testStudentId,
          course_id: courseRow.id,
          status: 'ACTIVE'
        })
        .select()
        .single();

      if (enrErr) {
        logTest('Insert Enrollment in enrollments table', false, enrErr.message);
      } else {
        testEnrollmentId = enrData.id;
        logTest('Insert Enrollment in enrollments table', true, `Enrollment ID: ${testEnrollmentId}`);

        const { data: enrFetch } = await supabase
          .from('enrollments')
          .select('*')
          .eq('id', testEnrollmentId)
          .single();

        const enrReflected = !!enrFetch && enrFetch.status === 'ACTIVE';
        logTest('Verify Enrollment DB Reflection', enrReflected, enrReflected ? `Status: "${enrFetch.status}"` : 'Enrollment fetch failed');
      }
    }

  } catch (err) {
    console.error('QA Suite uncaught error:', err);
  } finally {
    // ----------------------------------------------------
    // CLEANUP TEMPORARY TEST FIXTURES
    // ----------------------------------------------------
    console.log('\n--- CLEANUP TEMPORARY TEST FIXTURES ---');
    if (testCourseItemId) {
      await supabase.from('course_items').delete().eq('id', testCourseItemId);
      console.log('Cleaned up test course item:', testCourseItemId);
    }
    if (testEnrollmentId) {
      await supabase.from('enrollments').delete().eq('id', testEnrollmentId);
      console.log('Cleaned up test enrollment:', testEnrollmentId);
    }
    if (testStudentId) {
      await supabase.from('profiles').delete().eq('id', testStudentId);
      console.log('Cleaned up test student profile:', testStudentId);
    }
    if (testMentorId) {
      await supabase.from('mentors').delete().eq('id', testMentorId);
      console.log('Cleaned up test mentor:', testMentorId);
    }
    if (testStoragePath) {
      await supabase.storage.from('course-videos').remove([testStoragePath]);
      console.log('Cleaned up test video from storage:', testStoragePath);
    }
  }

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
    console.error('Fatal error:', err);
    process.exit(1);
  });
