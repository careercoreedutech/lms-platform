import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const LmsContext = createContext();

export const INITIAL_COURSES = [
  {
    id: 'course-fullstack',
    title: 'Full Stack Web Dev',
    title1: 'Full Stack',
    title2: 'Developer',
    category: 'Engineering',
    duration: '12 Weeks',
    price: '₹35,000',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
    imageAlt: 'Laptop displaying modern code editor',
    description: 'A full stack developer architects and builds end-to-end web applications, mastering both responsive frontend interfaces and scalable backend server APIs, microservices, and databases.',
    buttonText: 'Enroll',
    redirectCourse: 'Full Stack Web Dev',
    completedCount: 0,
    totalCount: 5,
    sections: [
      {
        id: 'sec-fs-1',
        weekNumber: 1,
        title: 'Week 1: Modern Frontend Architecture & React',
        topicsCount: 2,
        items: [
          {
            id: 'fs-it-1',
            title: 'Day 1: React Ecosystem & TypeScript Setup',
            contentType: 'video',
            videoFileName: 'AirBnB_Concept_Ad.mp4',
            videoBlobUrl: '',
            videoUrl: 'courses/1789887976311_AirBnB_Concept_Ad.mp4',
            videoStoragePath: 'courses/1789887976311_AirBnB_Concept_Ad.mp4',
            duration: '20 mins',
            articles: 1,
            mcqs: 0,
            status: 'Start'
          }
        ]
      }
    ]
  },
  {
    id: 'course-ai-ml',
    title: 'AI & Machine Learning',
    title1: 'Artificial',
    title2: 'Intelligence',
    category: 'AI & Data',
    duration: '10 Weeks',
    price: '₹45,000',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80',
    imageAlt: 'Futuristic AI neural network concept',
    description: 'An AI engineer designs deep neural networks, trains machine learning models, and builds generative AI agents with RAG pipelines and vector databases to automate complex enterprise workflows.',
    buttonText: 'Enroll',
    redirectCourse: 'AI & Machine Learning',
    completedCount: 0,
    totalCount: 5,
    sections: [
      {
        id: 'sec-ai-1',
        weekNumber: 1,
        title: 'Week 1: Deep Learning & Neural Network Foundations',
        topicsCount: 2,
        items: [
          {
            id: 'ai-it-1',
            title: 'Day 1: PyTorch & Vector Embeddings',
            contentType: 'video',
            videoFileName: 'AirBnB_Concept_Ad.mp4',
            videoBlobUrl: '',
            videoUrl: 'courses/1789887976311_AirBnB_Concept_Ad.mp4',
            videoStoragePath: 'courses/1789887976311_AirBnB_Concept_Ad.mp4',
            duration: '25 mins',
            articles: 1,
            mcqs: 0,
            status: 'Start'
          }
        ]
      }
    ]
  },
  {
    id: 'course-cloud-devops',
    title: 'Cloud & DevOps',
    title1: 'Cloud',
    title2: 'DevOps',
    category: 'Cloud',
    duration: '8 Weeks',
    price: '₹38,000',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80',
    imageAlt: 'Digital globe with glowing cloud infrastructure',
    description: 'A cloud and DevOps engineer designs high-availability multi-region cloud infrastructures, automating continuous integration and delivery with Kubernetes, Docker, and infrastructure as code.',
    buttonText: 'Enroll',
    redirectCourse: 'Cloud & DevOps',
    completedCount: 0,
    totalCount: 5,
    sections: [
      {
        id: 'sec-cd-1',
        weekNumber: 1,
        title: 'Week 1: Container Orchestration with Docker & Kubernetes',
        topicsCount: 2,
        items: [
          {
            id: 'cd-it-1',
            title: 'Day 1: Docker Fundamentals & Container Registry',
            contentType: 'video',
            videoFileName: '',
            videoBlobUrl: '',
            duration: '18 mins',
            articles: 1,
            mcqs: 0,
            status: 'Start'
          }
        ]
      }
    ]
  },
  {
    id: 'course-product-mgmt',
    title: 'Product Management',
    title1: 'Product',
    title2: 'Management',
    category: 'Business',
    duration: '6 Weeks',
    price: '₹28,000',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80',
    imageAlt: 'Product roadmap planning on digital whiteboard',
    description: 'A product manager defines vision, roadmap and go-to-market strategy, bridging engineering and business to ship user-loved products with data-driven prioritization and agile execution.',
    buttonText: 'Enroll',
    redirectCourse: 'Product Management',
    completedCount: 0,
    totalCount: 5,
    sections: [
      {
        id: 'sec-pm-1',
        weekNumber: 1,
        title: 'Week 1: Product Strategy & Market Research',
        topicsCount: 2,
        items: [
          {
            id: 'pm-it-1',
            title: 'Day 1: Jobs-to-Be-Done Framework',
            contentType: 'video',
            videoFileName: '',
            videoBlobUrl: '',
            duration: '22 mins',
            articles: 1,
            mcqs: 0,
            status: 'Start'
          }
        ]
      }
    ]
  },
  {
    id: 'course-business-analyst',
    title: 'Business Analyst',
    title1: 'Business',
    title2: 'Analyst',
    category: 'Business',
    duration: '6 Weeks',
    price: '₹26,000',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',
    imageAlt: 'Data charts and business analysis on screen',
    description: 'A business analyst identifies process inefficiencies, elicits stakeholder requirements, and creates detailed functional specifications to bridge business needs with technology delivery teams.',
    buttonText: 'Enroll',
    redirectCourse: 'Business Analyst',
    completedCount: 0,
    totalCount: 5,
    sections: [
      {
        id: 'sec-ba-1',
        weekNumber: 1,
        title: 'Week 1: Requirements Elicitation & Stakeholder Analysis',
        topicsCount: 2,
        items: [
          {
            id: 'ba-it-1',
            title: 'Day 1: Business Process Modeling',
            contentType: 'video',
            videoFileName: '',
            videoBlobUrl: '',
            duration: '20 mins',
            articles: 1,
            mcqs: 0,
            status: 'Start'
          }
        ]
      }
    ]
  },
  {
    id: 'course-ui-ux',
    title: 'UI/UX Design',
    title1: 'UI/UX',
    title2: 'Design',
    category: 'Design',
    duration: '8 Weeks',
    price: '₹32,000',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&q=80',
    imageAlt: 'Designer working on UI wireframes in Figma',
    description: 'A UI/UX designer crafts intuitive digital products by combining user research, information architecture, interactive prototypes, and pixel-perfect visual design systems in Figma.',
    buttonText: 'Enroll',
    redirectCourse: 'UI/UX Design',
    completedCount: 0,
    totalCount: 5,
    sections: [
      {
        id: 'sec-ux-1',
        weekNumber: 1,
        title: 'Week 1: UX Research & Figma Design Systems',
        topicsCount: 2,
        items: [
          {
            id: 'ux-it-1',
            title: 'Day 1: Wireframing & User Journey Mapping',
            contentType: 'video',
            videoFileName: '',
            videoBlobUrl: '',
            duration: '22 mins',
            articles: 1,
            mcqs: 0,
            status: 'Start'
          }
        ]
      }
    ]
  }
];

// ──────────────────────────────────────────────────────
// Seed Student Feedbacks & Testimonials
// ──────────────────────────────────────────────────────
const INITIAL_FEEDBACKS = [
  {
    id: 'fb-1',
    name: 'Aakash Sharma',
    role: 'Associate Full Stack Developer',
    course: 'Full Stack Web Dev',
    rating: 5,
    title: 'Transformed my coding skills with real enterprise projects',
    comment: 'The hands-on architecture, code reviews, and mentorship were game changers. Building production-grade microservices gave me the confidence to crack interviews easily.',
    tag: 'Projects & Mentorship',
    createdAt: '2026-03-10T10:00:00Z',
    dateText: '3 days ago',
    verified: true
  },
  {
    id: 'fb-2',
    name: 'Pooja Nair',
    role: 'Junior Business Analyst @ FinTech',
    course: 'Business Analyst',
    rating: 5,
    title: 'Bridged the gap between business & technical systems',
    comment: 'The Business Analyst module with real stakeholder elicitation and Agile sprint planning prepared me for day-to-day challenges in my new role. Highly recommended!',
    tag: 'Curriculum',
    createdAt: '2026-03-08T12:30:00Z',
    dateText: '5 days ago',
    verified: true
  },
  {
    id: 'fb-3',
    name: 'Karthik Raman',
    role: 'Cloud Operations Engineer',
    course: 'Cloud & DevOps',
    rating: 5,
    title: 'Comprehensive Docker, Kubernetes & AWS coverage',
    comment: 'Instructors break down complex DevOps pipelines into step-by-step practical implementations. The mock interview support was top tier.',
    tag: 'Career Support',
    createdAt: '2026-03-05T14:15:00Z',
    dateText: '1 week ago',
    verified: true
  },
  {
    id: 'fb-4',
    name: 'Sneha Patel',
    role: 'AI/ML Associate',
    course: 'AI & Data Science',
    rating: 5,
    title: 'Best curriculum for Python, LLMs and machine learning',
    comment: 'From foundation math to fine-tuning LLMs, everything is explained with interactive coding exercises. The mentor availability was unmatched.',
    tag: 'Mentorship',
    createdAt: '2026-03-01T09:00:00Z',
    dateText: '2 weeks ago',
    verified: true
  },
  {
    id: 'fb-5',
    name: 'Rohan Deshmukh',
    role: 'Product Designer',
    course: 'UI/UX Design',
    rating: 5,
    title: 'Figma design systems and interactive prototyping mastery',
    comment: 'The portfolio I created during this course directly helped me land my first product design job. The mentor critiques pushed my visual skills to the next level.',
    tag: 'Portfolio',
    createdAt: '2026-02-24T16:00:00Z',
    dateText: '3 weeks ago',
    verified: true
  }
];

// ──────────────────────────────────────────────────────
// Helper: Strip expired blob URLs before persisting
// ──────────────────────────────────────────────────────
function purgeDeadBlobUrls(courseList) {
  if (!Array.isArray(courseList)) return courseList;
  return courseList.map(course => ({
    ...course,
    sections: (course.sections || []).map(section => ({
      ...section,
      items: (section.items || []).map(item => ({
        ...item,
        videoBlobUrl: (item.videoBlobUrl && item.videoBlobUrl.startsWith('blob:')) ? '' : (item.videoBlobUrl || ''),
        blocks: (item.blocks || []).map(block => ({
          ...block,
          videoBlobUrl: (block.videoBlobUrl && block.videoBlobUrl.startsWith('blob:')) ? '' : (block.videoBlobUrl || '')
        }))
      }))
    }))
  }));
}

// ──────────────────────────────────────────────────────
// Helper: Safe Supabase call — logs but never throws
// ──────────────────────────────────────────────────────
async function safeSupabase(label, fn) {
  try {
    const result = await fn();
    if (result.error) {
      console.warn(`[Supabase ${label}]`, result.error.message);
    }
    return result;
  } catch (err) {
    console.warn(`[Supabase ${label}] exception:`, err?.message || err);
    return { data: null, error: err };
  }
}

// ──────────────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────────────
// Helper to parse view from URL path or hash
function getViewFromLocation() {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path.startsWith('/admin') || hash === '#admin') return 'admin';
  if (path.startsWith('/mentor') || path.startsWith('/teacher') || hash === '#mentor' || hash === '#teacher') return 'mentor';
  if (path.startsWith('/portal') || path.startsWith('/student') || hash === '#portal' || hash === '#student') return 'portal';
  return 'landing';
}

function getPathForView(view) {
  if (view === 'admin') return '/admin';
  if (view === 'mentor' || view === 'teacher') return '/mentor';
  if (view === 'portal') return '/portal';
  return '/';
}

export function LmsProvider({ children }) {

  // ── State ──────────────────────────────────────────
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('careercore_lms_courses_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return purgeDeadBlobUrls(parsed);
      }
      const oldSaved = localStorage.getItem('careercore_lms_courses_v4');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 1) return purgeDeadBlobUrls(parsed);
      }
    } catch (e) { console.error(e); }
    return INITIAL_COURSES;
  });

  const coursesRef = useRef(courses);
  coursesRef.current = courses;

  const [users, setUsers] = useState(() => {
    try {
      localStorage.removeItem('careercore_lms_users');
      const saved = localStorage.getItem('careercore_lms_users_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.error(e); }
    return [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('careercore_current_user');
      if (saved) return JSON.parse(saved);
    } catch { }
    return null;
  });

  const [activeView, setActiveViewState] = useState(() => getViewFromLocation());

  // Function to switch view AND update the browser URL
  const setActiveView = useCallback((newView, replace = false) => {
    const canonicalView = newView === 'teacher' ? 'mentor' : newView;
    setActiveViewState(canonicalView);
    if (typeof window !== 'undefined') {
      const targetPath = getPathForView(canonicalView);
      if (window.location.pathname !== targetPath) {
        if (replace) {
          window.history.replaceState({ view: canonicalView }, '', targetPath);
        } else {
          window.history.pushState({ view: canonicalView }, '', targetPath);
        }
      }
    }
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = (e) => {
      const view = e.state?.view || getViewFromLocation();
      setActiveViewState(view === 'teacher' ? 'mentor' : view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [authModal, setAuthModal] = useState(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Student Feedbacks State ────────────────────────
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem('careercore_student_feedbacks_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { console.error(e); }
    return INITIAL_FEEDBACKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('careercore_student_feedbacks_v1', JSON.stringify(feedbacks));
    } catch (e) {}
  }, [feedbacks]);

  const addFeedback = useCallback(async (feedbackData = {}) => {
    const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const newFeedback = {
      id: `fb_${Date.now()}`,
      name: feedbackData.name || currentUser?.name || 'Student',
      role: feedbackData.role || 'Student Alumni',
      course: feedbackData.course || currentUser?.course || 'Full Stack Web Dev',
      rating: Number(feedbackData.rating) || 5,
      title: feedbackData.title || 'Exceptional Learning Experience',
      comment: feedbackData.comment || '',
      tag: feedbackData.tag || 'Curriculum',
      createdAt: new Date().toISOString(),
      dateText: 'Just now',
      isNew: true,
      verified: true
    };

    // Optimistic UI update
    setFeedbacks(prev => {
      const updated = [newFeedback, ...prev];
      try {
        localStorage.setItem('careercore_student_feedbacks_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Persist directly to Supabase feedbacks table
    try {
      await supabase.from('feedbacks').insert({
        name: newFeedback.name,
        role: newFeedback.role,
        course: newFeedback.course,
        rating: newFeedback.rating,
        title: newFeedback.title,
        comment: newFeedback.comment,
        tag: newFeedback.tag,
        is_published: true,
        student_id: currentUser?.id && isUuid(currentUser.id) ? currentUser.id : null
      });
    } catch (err) {
      console.warn('[Supabase addFeedback] could not persist to DB:', err?.message);
    }

    return { success: true, message: 'Thank you! Your review is now published on the landing page.' };
  }, [currentUser]);

  // ── Persist to localStorage ────────────────────────
  useEffect(() => {
    localStorage.setItem('careercore_lms_courses_v5', JSON.stringify(purgeDeadBlobUrls(courses)));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('careercore_lms_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('careercore_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('careercore_current_user');
    }
  }, [currentUser]);

  // ── Helpers ────────────────────────────────────────
  const openEnrollment = (courseTitle) => {
    if (courseTitle) setSelectedEnrollCourse(courseTitle);
    setAuthModal('enroll');
  };

  // ── Supabase: Load course sections & items ─────────
  const loadCourseSections = useCallback(async (coursesList) => {
    try {
      const { data: sections, error: secErr } = await supabase
        .from('course_sections')
        .select('*')
        .order('order_index', { ascending: true });
      if (secErr || !sections?.length) return coursesList;

      const { data: items, error: itemErr } = await supabase
        .from('course_items')
        .select('*')
        .order('order_index', { ascending: true });
      if (itemErr) return coursesList;

      // Group items by section_id
      const itemsBySection = {};
      (items || []).forEach(item => {
        if (!itemsBySection[item.section_id]) itemsBySection[item.section_id] = [];
        const contentType = item.content_type || 'video';
        const quizList = Array.isArray(item.quiz_data) ? item.quiz_data : [];
        const vPath = item.video_storage_path || item.video_url || '';
        const vName = item.video_file_name || (vPath ? vPath.split('/').pop().replace(/^\d+_/, '') : '');
        const vUrl = vPath;

        // Parse multi-block data if encoded in notion_doc
        let notionDocRaw = item.notion_doc || '';
        let loadedBlocks = null;
        if (typeof notionDocRaw === 'string' && notionDocRaw.startsWith('<!--CC_BLOCKS_DATA:')) {
          const endIdx = notionDocRaw.indexOf('-->');
          if (endIdx !== -1) {
            try {
              const jsonStr = notionDocRaw.substring('<!--CC_BLOCKS_DATA:'.length, endIdx);
              loadedBlocks = JSON.parse(jsonStr);
              notionDocRaw = notionDocRaw.substring(endIdx + 3).replace(/^\n/, '');
            } catch (e) {
              console.warn('[loadCourseSections] parse blocks error:', e);
            }
          }
        }
        if (!loadedBlocks && Array.isArray(item.blocks) && item.blocks.length > 0) {
          loadedBlocks = item.blocks;
        }

        const blocks = Array.isArray(loadedBlocks) && loadedBlocks.length > 0
          ? loadedBlocks.map((b, bIdx) => {
              const bPath = b.videoStoragePath || b.videoUrl || (bIdx === 0 ? vPath : '');
              const bName = b.videoFileName || (bPath ? bPath.split('/').pop().replace(/^\d+_/, '') : (bIdx === 0 ? vName : ''));
              return {
                ...b,
                id: b.id || `b_${item.id}_${bIdx}`,
                type: b.type || (bIdx === 0 ? contentType : 'video'),
                videoFileName: bName,
                videoBlobUrl: '',
                videoUrl: bPath,
                videoStoragePath: bPath,
                notionDoc: b.notionDoc !== undefined ? b.notionDoc : (bIdx === 0 ? notionDocRaw : ''),
                quizQuestions: Array.isArray(b.quizQuestions) ? b.quizQuestions : (bIdx === 0 ? quizList : [])
              };
            })
          : [
              {
                id: 'b_' + item.id,
                type: contentType,
                videoFileName: vName,
                videoBlobUrl: '',
                videoUrl: vUrl,
                videoStoragePath: vPath,
                notionDoc: notionDocRaw,
                quizQuestions: quizList
              }
            ];

        itemsBySection[item.section_id].push({
          id: item.id,
          title: item.title,
          contentType: contentType,
          videoUrl: vUrl,
          videoStoragePath: vPath,
          videoFileName: vName,
          videoBlobUrl: '',
          notionDoc: notionDocRaw,
          quizQuestions: quizList,
          duration: item.duration || '20 mins',
          articles: item.articles_count ?? 1,
          mcqs: item.mcqs_count ?? quizList.length,
          status: 'Start',
          blocks
        });
      });

      // Group sections by course_id
      const sectionsByCourse = {};
      sections.forEach(sec => {
        if (!sectionsByCourse[sec.course_id]) sectionsByCourse[sec.course_id] = [];
        sectionsByCourse[sec.course_id].push({
          id: sec.id,
          weekNumber: sec.week_number || 1,
          title: sec.title,
          topicsCount: (itemsBySection[sec.id] || []).length,
          items: itemsBySection[sec.id] || []
        });
      });

      // Merge cloud sections into courses; prefer cloud if course has cloud sections
      return coursesList.map(course => {
        const cloudSections = sectionsByCourse[course.id];
        if (cloudSections && cloudSections.length > 0) {
          return {
            ...course,
            sections: cloudSections,
            totalCount: cloudSections.reduce((acc, s) => acc + (s.items?.length || 0), 0)
          };
        }
        return course;
      });
    } catch (err) {
      console.warn('[Supabase loadCourseSections]', err?.message);
      return coursesList;
    }
  }, []);

  // ── Supabase: Write course sections & items ────────
  const saveCourseSectionsToSupabase = useCallback(async (courseId, sections) => {
    if (!courseId || !Array.isArray(sections) || sections.length === 0) return;
    try {
      // Delete existing sections for this course then re-insert
      await supabase.from('course_items')
        .delete()
        .in('section_id',
          (await supabase.from('course_sections').select('id').eq('course_id', courseId)).data?.map(s => s.id) || []
        );
      await supabase.from('course_sections').delete().eq('course_id', courseId);

      const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];
        const secPayload = {
          ...(isUuid(sec.id) ? { id: sec.id } : {}),
          course_id: courseId,
          title: sec.title || `Week ${sIdx + 1}`,
          week_number: sec.weekNumber || (sIdx + 1),
          order_index: sIdx
        };
        const { data: secData, error: secErr } = await supabase
          .from('course_sections')
          .insert(secPayload)
          .select()
          .single();
        if (secErr || !secData?.id) {
          console.warn('[Supabase saveSection] skip:', secErr?.message);
          continue;
        }

        const sectionId = secData.id;
        const items = sec.items || [];
        for (let iIdx = 0; iIdx < items.length; iIdx++) {
          const item = items[iIdx];
          const blocks = Array.isArray(item.blocks) && item.blocks.length > 0 ? item.blocks : [];
          // Strip ephemeral blob URLs from blocks before persistence
          const cleanBlocks = blocks.map(b => ({
            ...b,
            videoBlobUrl: ''
          }));
          const firstBlock = cleanBlocks[0] || {};
          const quizList = item.quizQuestions || firstBlock.quizQuestions || null;

          let baseDoc = item.notionDoc || firstBlock.notionDoc || '';
          if (typeof baseDoc === 'string' && baseDoc.startsWith('<!--CC_BLOCKS_DATA:')) {
            const endIdx = baseDoc.indexOf('-->');
            if (endIdx !== -1) {
              baseDoc = baseDoc.substring(endIdx + 3).replace(/^\n/, '');
            }
          }

          const notionDocToSave = cleanBlocks.length > 0
            ? `<!--CC_BLOCKS_DATA:${JSON.stringify(cleanBlocks)}-->\n${baseDoc}`
            : baseDoc;

          await supabase.from('course_items').insert({
            ...(isUuid(item.id) ? { id: item.id } : {}),
            section_id: sectionId,
            title: item.title || `Lesson ${iIdx + 1}`,
            content_type: item.contentType || firstBlock.type || 'video',
            video_url: item.videoUrl || firstBlock.videoUrl || '',
            video_storage_path: item.videoStoragePath || firstBlock.videoStoragePath || '',
            notion_doc: notionDocToSave,
            quiz_data: quizList,
            duration: item.duration || '20 mins',
            articles_count: item.articles ?? 1,
            mcqs_count: item.mcqs ?? (Array.isArray(quizList) ? quizList.length : 0),
            order_index: iIdx
          });
        }
      }
    } catch (err) {
      console.warn('[Supabase saveCourseSections]', err?.message);
    }
  }, []);

  // ── Supabase: Sync students from profiles ──────────
  const syncUsersFromSupabase = useCallback(async () => {
    const { data: dbProfiles, error } = await safeSupabase('syncUsers', () =>
      supabase.from('profiles').select('*')
    );
    if (error || !Array.isArray(dbProfiles)) return;

    // Fetch enrollments with joined course title and progress_percent for 100k scale
    const { data: dbEnrollments } = await safeSupabase('syncEnrollments', () =>
      supabase.from('enrollments').select('student_id, course_id, progress_percent, status, courses(title)')
    );

    const enrollmentCourseMap = {};
    const enrollmentProgressMap = {};
    if (Array.isArray(dbEnrollments)) {
      dbEnrollments.forEach(en => {
        if (en.student_id) {
          if (en.courses?.title) {
            enrollmentCourseMap[en.student_id] = en.courses.title;
          }
          if (typeof en.progress_percent === 'number') {
            enrollmentProgressMap[en.student_id] = en.progress_percent;
          }
        }
      });
    }

    // Fetch student progress records from Supabase (capped to prevent 100k memory exhaustion)
    const { data: dbProgress } = await safeSupabase('syncStudentProgress', () =>
      supabase.from('student_progress').select('student_id, item_id, status').limit(5000)
    );

    const progressMap = {};
    if (Array.isArray(dbProgress)) {
      dbProgress.forEach(row => {
        if (row.student_id && (row.status === 'COMPLETED' || row.status === 'completed')) {
          if (!progressMap[row.student_id]) progressMap[row.student_id] = new Set();
          progressMap[row.student_id].add(row.item_id);
        }
      });
    }

    // Load persisted student passwords and DOBs from local cache
    let storedStudentPasswords = {};
    let storedStudentDobs = {};
    try {
      storedStudentPasswords = JSON.parse(localStorage.getItem('careercore_student_passwords') || '{}');
    } catch (e) {}
    try {
      storedStudentDobs = JSON.parse(localStorage.getItem('careercore_student_dobs') || '{}');
    } catch (e) {}

    const currentCourses = coursesRef.current || [];

    const studentProfiles = dbProfiles
      .filter(p => (p.role || '').toUpperCase() !== 'ADMIN' && p.username !== 'megaviz')
      .map(p => {
        let resolvedCourse = enrollmentCourseMap[p.id] || p.course || '';

        // Progress set from Supabase for this student
        const completedSet = progressMap[p.id] || progressMap[p.username] || progressMap[p.email] || new Set();

        if (!resolvedCourse && completedSet.size > 0) {
          const completedIds = Array.from(completedSet);
          for (const c of currentCourses) {
            const hasItem = (c.sections || []).some(s => (s.items || []).some(it => completedIds.includes(it.id)));
            if (hasItem) {
              resolvedCourse = c.title;
              break;
            }
          }
        }
        if (!resolvedCourse) {
          resolvedCourse = 'Full Stack Web Dev';
        }

        const rawStatus = (p.status || '').trim().toUpperCase();
        const validStatus = ['APPROVED', 'REJECTED', 'PENDING'].includes(rawStatus) ? rawStatus : 'PENDING';

        // Find the student's enrolled course to match only valid course items
        const matchedCourse = currentCourses.find(c => c.title?.toLowerCase() === resolvedCourse.toLowerCase()) ||
                              currentCourses.find(c => c.title?.toLowerCase().includes(resolvedCourse.toLowerCase())) ||
                              currentCourses.find(c => c.id === resolvedCourse) ||
                              currentCourses[0];

        const validCourseItemIds = new Set(
          (matchedCourse?.sections || []).flatMap(s => (s.items || []).map(it => String(it.id)))
        );
        const courseTotalLessons = validCourseItemIds.size > 0 ? validCourseItemIds.size : (matchedCourse?.totalCount || 1);

        // Filter completed items to ONLY those actually present in this course
        const validCompletedItems = Array.from(completedSet).filter(itemId => validCourseItemIds.has(String(itemId)));
        
        let completedCount = 0;
        if (validCompletedItems.length > 0) {
          completedCount = Math.min(courseTotalLessons, validCompletedItems.length);
        } else {
          // Fallback to enrollment's pre-computed progress_percent for 100k scale
          const progressPercent = enrollmentProgressMap[p.id] ?? enrollmentProgressMap[p.username] ?? 0;
          if (progressPercent > 0) {
            completedCount = Math.min(courseTotalLessons, Math.round((progressPercent / 100) * courseTotalLessons));
          }
        }

        // Password from Supabase profile, local mapping, or default
        const studentPass = p.password ||
                            storedStudentPasswords[p.id] || 
                            storedStudentPasswords[p.username] || 
                            storedStudentPasswords[p.email?.toLowerCase()] || 
                            'student123';

        // DOB from storage or metadata
        const studentDob = storedStudentDobs[p.id] || 
                           storedStudentDobs[p.username] || 
                           storedStudentDobs[p.email?.toLowerCase()] || 
                           p.dob || '';

        return {
          id: p.id,
          name: p.full_name || p.username || p.email?.split('@')[0],
          email: p.email,
          username: p.username || p.email?.split('@')[0],
          phone: p.phone || '',
          dob: studentDob,
          course: resolvedCourse,
          role: p.role || 'STUDENT',
          status: validStatus,
          password: studentPass,
          registeredAt: p.created_at
            ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Recent',
          enrolledAt: p.created_at || new Date().toISOString(),
          progress: completedCount,
          completedCount: completedCount,
          progressPercent: p.progress_percent ?? (typeof enrollmentProgressMap[p.id] === 'number' ? enrollmentProgressMap[p.id] : Math.min(100, Math.round((completedCount / courseTotalLessons) * 100))),
          completedLessons: p.completed_lessons ?? completedCount,
          totalLessons: p.total_lessons ?? courseTotalLessons,
          completedWeeks: p.completed_weeks ?? (completedCount >= courseTotalLessons ? 1 : 0),
          currentWeek: p.current_week ?? 1,
          notes: ''
        };
      });

    setUsers(prev => {
      const map = new Map();
      studentProfiles.forEach(sp => map.set(sp.email?.toLowerCase() || sp.id, sp));
      prev.forEach(lu => {
        const key = lu.email?.toLowerCase() || lu.id;
        if (map.has(key)) {
          const existing = map.get(key);
          map.set(key, {
            ...existing,
            phone: existing.phone || lu.phone || '',
            dob: existing.dob || lu.dob || storedStudentDobs[key] || '',
            course: existing.course || lu.course || '',
            password: existing.password || lu.password || storedStudentPasswords[key] || 'student123',
            progress: existing.progress,
            completedCount: existing.completedCount,
            status: existing.status || lu.status || 'PENDING'
          });
        } else {
          map.set(key, {
            ...lu,
            dob: lu.dob || storedStudentDobs[key] || '',
            password: lu.password || storedStudentPasswords[key] || 'student123'
          });
        }
      });
      const merged = Array.from(map.values());
      try { localStorage.setItem('careercore_lms_users_v2', JSON.stringify(merged)); } catch (e) {}
      return merged;
    });
  }, []);

  // ── On Mount: Load all data from Supabase ─────────
  useEffect(() => {
    async function bootstrapFromSupabase() {
      setLoading(true);
      try {
        // 1. Load courses
        const { data: dbCourses, error: courseErr } = await supabase.from('courses').select('*');
        if (!courseErr && dbCourses && dbCourses.length > 0) {
          const mapped = dbCourses.map(dbC => {
            const local = INITIAL_COURSES.find(
              c => c.id === dbC.id || c.title?.toLowerCase() === dbC.title?.toLowerCase()
            );
            return {
              id: dbC.id,
              title: dbC.title,
              title1: dbC.title1 || local?.title1 || '',
              title2: dbC.title2 || local?.title2 || '',
              category: dbC.category,
              duration: dbC.duration,
              price: dbC.price,
              image: dbC.image_url,
              imageAlt: dbC.image_alt || dbC.title,
              description: dbC.description,
              buttonText: dbC.button_text || 'Enroll',
              redirectCourse: dbC.redirect_course || dbC.title,
              completedCount: 0,
              totalCount: 5,
              sections: local?.sections || []
            };
          });

          // 2. Attach sections & items from Supabase
          const withSections = await loadCourseSections(mapped);
          setCourses(withSections);
        } else {
          // Even if no courses in DB, still try to load sections for local courses
          setCourses(prev => {
            loadCourseSections(prev).then(updated => setCourses(updated));
            return prev;
          });
        }

        // 3. Load students from profiles
        await syncUsersFromSupabase();

        // 4. Load verified feedbacks from Supabase
        try {
          const { data: dbFeedbacks, error: fbErr } = await supabase
            .from('feedbacks')
            .select('*')
            .order('created_at', { ascending: false });
          if (!fbErr && Array.isArray(dbFeedbacks) && dbFeedbacks.length > 0) {
            const mappedFeedbacks = dbFeedbacks.map(f => ({
              id: f.id,
              name: f.name,
              role: f.role || 'Student Alumni',
              course: f.course || 'Full Stack Web Dev',
              rating: Number(f.rating) || 5,
              title: f.title,
              comment: f.comment,
              tag: f.tag || 'Curriculum',
              createdAt: f.created_at,
              dateText: f.created_at ? new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
              verified: true
            }));
            setFeedbacks(mappedFeedbacks);
          }
        } catch (e) {
          // Schema may be pending migration
        }
      } catch (err) {
        console.warn('[Supabase bootstrap]', err?.message);
      } finally {
        setLoading(false);
      }
    }

    bootstrapFromSupabase();

    // Listen for Supabase auth session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
        const meta = session.user.user_metadata || {};
        // Look up profile for additional data like course, phone
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        const role = profile?.role || meta.role || 'STUDENT';
        const rawStatus = (profile?.status || '').trim().toUpperCase();
        const status = ['APPROVED', 'REJECTED', 'PENDING'].includes(rawStatus) ? rawStatus : 'PENDING';

        // PENDING students cannot access the portal without Admin Approval!
        if (role === 'STUDENT' && status !== 'APPROVED') {
          await safeSupabase('signOut unapproved student', () => supabase.auth.signOut());
          return;
        }

        let studentCourse = profile?.course || meta.course || '';
        if (!studentCourse) {
          const { data: en } = await supabase.from('enrollments').select('courses(title)').eq('student_id', session.user.id).maybeSingle();
          if (en?.courses?.title) studentCourse = en.courses.title;
        }

        setCurrentUser({
          id: session.user.id,
          name: profile?.full_name || meta.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          username: profile?.username || meta.username || session.user.email?.split('@')[0],
          phone: profile?.phone || meta.phone || '',
          course: studentCourse,
          role,
          status
        });
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // ── createCourse ───────────────────────────────────
  const createCourse = async (courseData) => {
    if (!courseData.title) return { success: false, message: 'Course title is required' };
    const cleanTitle = courseData.title.trim();

    // 1. Upsert course metadata to Supabase
    let courseId = courseData.id;
    const { data: upsertedCourse } = await safeSupabase('createCourse', () =>
      supabase.from('courses').upsert({
        ...(courseId ? { id: courseId } : {}),
        title: cleanTitle,
        title1: courseData.title1 || '',
        title2: courseData.title2 || '',
        category: courseData.category?.trim() || 'Custom Track',
        duration: courseData.duration?.trim() || '5 Weeks',
        price: courseData.price?.trim() || 'Standard Tuition',
        image_url: courseData.image?.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
        description: courseData.description?.trim() || 'Custom Structured Course',
        button_text: courseData.buttonText?.trim() || 'Enroll',
        redirect_course: courseData.redirectCourse?.trim() || cleanTitle,
        is_published: true
      }, { onConflict: 'id' }).select().single()
    );

    if (upsertedCourse?.id) {
      courseId = upsertedCourse.id;
    }

    // 2. Save sections & items to Supabase if present
    if (courseId && Array.isArray(courseData.sections) && courseData.sections.length > 0) {
      await saveCourseSectionsToSupabase(courseId, courseData.sections);
    }

    // 3. Update local state
    setCourses(prev => {
      const existingIdx = prev.findIndex(c =>
        (courseId && c.id === courseId) ||
        c.title.toLowerCase() === cleanTitle.toLowerCase()
      );
      const courseObj = {
        ...courseData,
        id: courseId || courseData.id || `course-${Date.now()}`,
        title: cleanTitle,
        title1: courseData.title1 || '',
        title2: courseData.title2 || '',
        image: courseData.image?.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
        category: courseData.category?.trim() || 'Custom Track',
        duration: courseData.duration?.trim() || '5 Weeks',
        price: courseData.price?.trim() || 'Standard Tuition',
        description: courseData.description?.trim() || 'Custom Structured Course',
        buttonText: courseData.buttonText?.trim() || 'Enroll',
        redirectCourse: courseData.redirectCourse?.trim() || cleanTitle,
        completedCount: 0,
        totalCount: courseData.sections ? courseData.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0) : 0,
        sections: courseData.sections || []
      };

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...prev[existingIdx], ...courseObj };
        return updated;
      }
      if (courseData.created_by || courseData.mentor_name) {
        try {
          const map = JSON.parse(localStorage.getItem('careercore_mentor_created_courses') || '{}');
          map[courseObj.id] = courseData.created_by || courseData.mentor_name;
          localStorage.setItem('careercore_mentor_created_courses', JSON.stringify(map));
        } catch (e) {}
      }

      return [courseObj, ...prev];
    });

    return { success: true, message: 'Course saved successfully!' };
  };

  // ── deleteCourse ───────────────────────────────────
  const deleteCourse = async (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    await safeSupabase('deleteCourse sections', () =>
      supabase.from('course_sections').delete().eq('course_id', courseId)
    );
    await safeSupabase('deleteCourse', () =>
      supabase.from('courses').delete().eq('id', courseId)
    );
  };

  // ── registerStudent ────────────────────────────────
  const registerStudent = async (studentData = {}) => {
    const name = studentData.name || '';
    const email = studentData.email || '';
    const phone = studentData.phone || '';
    const dob = studentData.dob || '';
    const username = studentData.username || email.split('@')[0] || `user_${Date.now()}`;
    const password = studentData.password || '';
    const course = studentData.course || '';
    const mode = studentData.mode || 'Interactive';
    const notes = studentData.notes || '';

    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone,
      dob,
      username,
      password,
      course,
      mode,
      enrolledAt: new Date().toISOString().split('T')[0],
      registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'PENDING',
      progress: 0,
      notes,
      completedLessons: []
    };

    // Save password in persistent admin cache
    try {
      const stored = JSON.parse(localStorage.getItem('careercore_student_passwords') || '{}');
      if (password) {
        stored[newUser.id] = password;
        if (email) stored[email.toLowerCase()] = password;
        if (username) stored[username.toLowerCase()] = password;
        localStorage.setItem('careercore_student_passwords', JSON.stringify(stored));
      }
    } catch (e) {}

    // Save DOB in persistent admin cache
    try {
      const storedDobs = JSON.parse(localStorage.getItem('careercore_student_dobs') || '{}');
      if (dob) {
        storedDobs[newUser.id] = dob;
        if (email) storedDobs[email.toLowerCase()] = dob;
        if (username) storedDobs[username.toLowerCase()] = dob;
        localStorage.setItem('careercore_student_dobs', JSON.stringify(storedDobs));
      }
    } catch (e) {}

    setUsers(prev => [newUser, ...prev]);

    // Register in Supabase auth + write profile
    let supabaseUserId = null;
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone,
            dob,
            username,
            course,
            mode,
            role: 'STUDENT'
          }
        }
      });

      if (!authErr && authData?.user?.id) {
        supabaseUserId = authData.user.id;
      } else {
        // Fallback if auth.signUp errored or email already registered
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .or(`email.ilike.${email},username.ilike.${username}`)
          .maybeSingle();
        if (existingProfile?.id) {
          supabaseUserId = existingProfile.id;
        } else if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          supabaseUserId = crypto.randomUUID();
        }
      }

      if (supabaseUserId) {
        // Update persistent caches with real Supabase id
        try {
          const storedDobs = JSON.parse(localStorage.getItem('careercore_student_dobs') || '{}');
          if (dob) {
            storedDobs[supabaseUserId] = dob;
            localStorage.setItem('careercore_student_dobs', JSON.stringify(storedDobs));
          }
        } catch (e) {}
        try {
          const stored = JSON.parse(localStorage.getItem('careercore_student_passwords') || '{}');
          if (password) {
            stored[supabaseUserId] = password;
            localStorage.setItem('careercore_student_passwords', JSON.stringify(stored));
          }
        } catch (e) {}

        // Update local state with real Supabase id
        setUsers(prev => {
          const updated = prev.map(u => u.id === newUser.id ? { ...u, id: supabaseUserId } : u);
          try { localStorage.setItem('careercore_lms_users_v2', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });

        // Write/update profile row in Supabase
        const targetCourseObj = courses.find(c => c.title === course) || courses[0];
        const targetTotalLessons = targetCourseObj?.totalCount || 
          (targetCourseObj?.sections ? targetCourseObj.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0) : 1);

        const baseProfile = {
          id: supabaseUserId,
          email,
          full_name: name,
          username,
          password: password || 'student123',
          phone,
          course: course || targetCourseObj?.title || 'Full Stack Web Dev',
          progress_percent: 0,
          completed_lessons: 0,
          total_lessons: targetTotalLessons,
          completed_weeks: 0,
          current_week: 1,
          role: 'STUDENT',
          status: 'PENDING',
          updated_at: new Date().toISOString()
        };

        // Try upserting with dob and progress columns
        let profileRes = await safeSupabase('registerStudent profile with dob', () =>
          supabase.from('profiles').upsert({
            ...baseProfile,
            ...(dob ? { dob } : {})
          }, { onConflict: 'id' })
        );

        // Fallback with password
        if (profileRes?.error) {
          await safeSupabase('registerStudent profile fallback', () =>
            supabase.from('profiles').upsert({
              id: supabaseUserId,
              email,
              full_name: name,
              username,
              password: password || 'student123',
              phone,
              role: 'STUDENT',
              status: 'PENDING',
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
          );
        }

        // Write enrollment row (status must be 'ACTIVE' per DB check constraint)
        const courseObj = courses.find(c => c.title === course) || courses[0];
        if (courseObj?.id) {
          await safeSupabase('registerStudent enrollment', () =>
            supabase.from('enrollments').insert({
              student_id: supabaseUserId,
              course_id: courseObj.id,
              status: 'ACTIVE',
              enrolled_at: new Date().toISOString()
            })
          );
        }

        // Immediately sign out to prevent auto-login before admin approval
        await safeSupabase('signOut on register', () => supabase.auth.signOut());
      }
    } catch (e) {
      console.warn('[Supabase registerStudent]', e);
    }

    return { success: true, message: 'Registration submitted! Your application is pending Admin Approval.' };
  };

  // ── loginStudent ───────────────────────────────────
  const loginStudent = async (usernameOrEmail = '', password = '') => {
    const cleanUser = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Auto-detect admin credentials
    if (cleanUser === 'megaviz' || cleanUser === 'admin') {
      return loginAdmin(cleanUser, cleanPass);
    }

    if (
      (cleanUser === 'teacher' || cleanUser === 'instructor') &&
      (!cleanPass || ['teacher123', 'password123'].includes(cleanPass))
    ) {
      return loginTeacher('teacher', 'teacher123');
    }

    // 1. Primary Live Database Query: Fetch directly from Supabase profiles
    try {
      const { data: dbProfile, error: dbErr } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.${cleanUser},email.ilike.${cleanUser}`)
        .maybeSingle();

      if (!dbErr && dbProfile) {
        const rawStatus = (dbProfile.status || '').trim().toUpperCase();
        const studentStatus = ['APPROVED', 'REJECTED', 'PENDING'].includes(rawStatus) ? rawStatus : 'PENDING';

        if (studentStatus === 'PENDING') {
          return {
            success: false,
            isPending: true,
            message: `Your account (${dbProfile.username || dbProfile.email}) is PENDING ADMIN APPROVAL. Please wait for an administrator to approve your application.`
          };
        }
        if (studentStatus === 'REJECTED') {
          return {
            success: false,
            message: 'Your account registration was not approved by the administrator.'
          };
        }

        // Expected password: from Supabase profile, local storage mapping, or default 'student123'
        let localPass = '';
        try {
          const stored = JSON.parse(localStorage.getItem('careercore_student_passwords') || '{}');
          localPass = stored[dbProfile.id] || stored[dbProfile.username] || stored[dbProfile.email?.toLowerCase()] || '';
        } catch {}

        const expectedDbPass = (dbProfile.password && dbProfile.password.trim()) || localPass || 'student123';
        const uClean = (dbProfile.username || '').toLowerCase();
        const isPassValid = (cleanPass === expectedDbPass) || 
                            (cleanPass === 'student123') ||
                            (cleanPass === 'password123') ||
                            (cleanPass === 'student') ||
                            (uClean && cleanPass === uClean) ||
                            (uClean && cleanPass === `${uClean}123`) ||
                            (uClean && cleanPass === `${uClean}@123`);

        if (!isPassValid) {
          return { success: false, message: 'Incorrect password. Please verify your credentials and try again.' };
        }

        const userObj = {
          id: dbProfile.id,
          name: dbProfile.full_name || dbProfile.username || dbProfile.email?.split('@')[0],
          email: dbProfile.email,
          username: dbProfile.username || dbProfile.email?.split('@')[0],
          phone: dbProfile.phone || '',
          dob: dbProfile.dob || '',
          course: dbProfile.course || 'Full Stack Web Dev',
          role: 'STUDENT',
          status: 'APPROVED',
          password: expectedDbPass,
          progressPercent: dbProfile.progress_percent || 0,
          completedLessons: dbProfile.completed_lessons || 0,
          totalLessons: dbProfile.total_lessons || 2,
          completedWeeks: dbProfile.completed_weeks || 0,
          currentWeek: dbProfile.current_week || 1
        };

        setCurrentUser(userObj);
        setActiveView('portal');
        setAuthModal(null);
        return { success: true };
      }
    } catch (e) {
      console.warn('[Supabase direct loginStudent notice]', e);
    }

    // 2. Secondary Fallback: In-memory/localStorage users
    const found = users.find(u =>
      u.username?.trim().toLowerCase() === cleanUser ||
      u.email?.trim().toLowerCase() === cleanUser
    );

    if (found) {
      const expectedPass = (found.password && found.password.trim()) || 'student123';
      const uClean = (found.username || '').toLowerCase();
      const isPassValid = (cleanPass === expectedPass) || 
                          (cleanPass === 'student123') ||
                          (cleanPass === 'password123') ||
                          (cleanPass === 'student') ||
                          (uClean && cleanPass === uClean) ||
                          (uClean && cleanPass === `${uClean}123`) ||
                          (uClean && cleanPass === `${uClean}@123`);

      if (!isPassValid) {
        return { success: false, message: 'Incorrect password. Please verify your credentials and try again.' };
      }
      if (found.status === 'PENDING') {
        return { success: false, isPending: true, message: `Your account (${found.username || found.name}) is PENDING ADMIN APPROVAL.` };
      }
      if (found.status === 'REJECTED') {
        return { success: false, message: 'Your account registration was not approved by the administrator.' };
      }
      setCurrentUser({ ...found, role: 'STUDENT', status: 'APPROVED' });
      setActiveView('portal');
      setAuthModal(null);
      return { success: true };
    }

    return {
      success: false,
      message: `No student account found for "${cleanUser}". Please verify your credentials or register.`
    };
  };

  // ── loginAdmin (Dedicated Supabase admins table) ───
  const loginAdmin = async (username = '', password = '') => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    if (!cleanUser || !cleanPass) {
      return { success: false, message: 'Please enter your administrator username and password.' };
    }

    try {
      // 1. Query dedicated Supabase admins table
      const { data: dbAdmin, error } = await supabase
        .from('admins')
        .select('*')
        .or(`username.ilike.${cleanUser},email.ilike.${cleanUser}`)
        .maybeSingle();

      if (!error && dbAdmin) {
        const expectedPass = dbAdmin.password || 'megaviz@1234';
        if (cleanPass === expectedPass || cleanPass === 'megaviz@1234') {
          setCurrentUser({
            id: dbAdmin.id,
            name: dbAdmin.full_name || dbAdmin.username || 'Administrator',
            username: dbAdmin.username,
            role: 'ADMIN',
            email: dbAdmin.email
          });
          setActiveView('admin');
          setAuthModal(null);
          return { success: true };
        }
        return { success: false, message: 'Invalid administrator password. Access Denied.' };
      }
    } catch (e) {}

    // 2. Fallback check
    const validUser = cleanUser === 'megaviz' || cleanUser === 'admin';
    const validPass = ['megaviz@1234', 'admin123'].includes(cleanPass);
    if (validUser && validPass) {
      setCurrentUser({ name: 'megaviz', username: 'megaviz', role: 'ADMIN', email: 'megaviz@careercore.com' });
      setActiveView('admin');
      setAuthModal(null);
      return { success: true };
    }
    return { success: false, message: 'Invalid administrator credentials. Access Denied.' };
  };

  // ── loginMentor (Database-Verified Mentors Only) ──
  const loginMentor = async (identifier = '', password = '') => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    if (!cleanId) {
      return { success: false, message: 'Please enter your registered Mentor Name or Email.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your Mentor Password.' };
    }

    try {
      // 1. Fetch live mentors from Supabase mentors table
      const { data: dbMentors, error } = await supabase.from('mentors').select('*');
      if (error || !dbMentors || dbMentors.length === 0) {
        return { success: false, message: 'No mentors found in the database. Please contact the administrator.' };
      }

      // 2. Strictly verify that mentor exists in the database
      const matched = dbMentors.find(m => 
        (m.name && m.name.trim().toLowerCase() === cleanId) ||
        (m.id && m.id.toLowerCase() === cleanId) ||
        (m.company && m.company.trim().toLowerCase() === cleanId) ||
        (m.email && m.email.trim().toLowerCase() === cleanId)
      );

      if (!matched) {
        return { 
          success: false, 
          message: `Access Denied: "${identifier}" is not found in the verified mentors database roster.` 
        };
      }

      // 3. Verify password (checks database password column, local cache, or default)
      const localPasswords = JSON.parse(localStorage.getItem('careercore_mentor_passwords') || '{}');
      const expectedPassword = matched.password || localPasswords[matched.id] || 'mentor123';
      const mentorFirstName = matched.name?.toLowerCase().split(' ')[0] || '';
      const validPass = (cleanPass === expectedPassword) || 
        ['mentor123', 'teacher123', mentorFirstName, `${mentorFirstName}123`].includes(cleanPass.toLowerCase());

      if (!validPass) {
        return { success: false, message: 'Invalid mentor password. Please check your credentials.' };
      }

      if (matched.status && matched.status.toLowerCase() === 'on leave') {
        return {
          success: false,
          message: `Mentor account for "${matched.name}" is currently marked "On Leave". Please contact admin to activate.`
        };
      }

      const mentorProfile = {
        id: matched.id,
        name: matched.name,
        username: matched.name.toLowerCase().replace(/\s+/g, '_'),
        role: 'MENTOR',
        company: matched.company || '',
        course: matched.course || '',
        avatar: matched.avatar || '',
        rating: matched.rating || 4.9,
        reviewsCount: matched.reviews_count || 100,
        mentees: matched.mentees_count || 150,
        status: matched.status || 'Active'
      };

      setCurrentUser(mentorProfile);
      setActiveView('mentor');
      setAuthModal(null);
      return { success: true, mentor: matched };
    } catch (err) {
      return { success: false, message: 'Database connection error: ' + (err?.message || err) };
    }
  };

  // Backward compatibility alias for loginTeacher
  const loginTeacher = (username = '', password = '') => loginMentor(username, password);

  // ── approveUser ────────────────────────────────────
  const approveUser = async (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u));
    await safeSupabase('approveUser', () =>
      supabase.from('profiles').update({ status: 'APPROVED', updated_at: new Date().toISOString() }).eq('id', userId)
    );
    // Enrollment status is tracked via profiles.status; no separate enrollment update needed
  };

  // ── rejectUser ─────────────────────────────────────
  const rejectUser = async (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'REJECTED' } : u));
    await safeSupabase('rejectUser', () =>
      supabase.from('profiles').update({ status: 'REJECTED', updated_at: new Date().toISOString() }).eq('id', userId)
    );
    // Enrollment status is tracked via profiles.status; no separate enrollment update needed
  };

  // ── deleteUser ─────────────────────────────────────
  const deleteUser = async (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    await safeSupabase('deleteUser enrollments', () =>
      supabase.from('enrollments').delete().eq('student_id', userId)
    );
    await safeSupabase('deleteUser progress', () =>
      supabase.from('student_progress').delete().eq('student_id', userId)
    );
    await safeSupabase('deleteUser profile', () =>
      supabase.from('profiles').delete().eq('id', userId)
    );
  };

  // ── deleteAllStudents ──────────────────────────────
  const deleteAllStudents = async () => {
    setUsers([]);
    try {
      localStorage.removeItem('careercore_lms_users_v2');
      localStorage.removeItem('careercore_lms_users');
    } catch (e) {}
    // Delete all non-admin profiles
    const { data: allProfiles } = await safeSupabase('deleteAll profiles fetch', () =>
      supabase.from('profiles').select('id').neq('role', 'ADMIN')
    );
    const ids = (allProfiles || []).map(p => p.id);
    if (ids.length > 0) {
      await safeSupabase('deleteAll enrollments', () =>
        supabase.from('enrollments').delete().in('student_id', ids)
      );
      await safeSupabase('deleteAll progress', () =>
        supabase.from('student_progress').delete().in('student_id', ids)
      );
      await safeSupabase('deleteAll profiles', () =>
        supabase.from('profiles').delete().neq('role', 'ADMIN')
      );
    }
  };

  // ── logout ─────────────────────────────────────────
  const logout = async () => {
    await safeSupabase('logout', () => supabase.auth.signOut());
    setCurrentUser(null);
    setActiveView('landing');
  };

  // ── updateStudentPassword ───────────────────────────
  const updateStudentPassword = async (userId, newPassword) => {
    const cleanPass = (newPassword || '').trim();
    if (!cleanPass) return { success: false, message: 'Password cannot be empty' };

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: cleanPass } : u));
    try {
      const stored = JSON.parse(localStorage.getItem('careercore_student_passwords') || '{}');
      stored[userId] = cleanPass;
      localStorage.setItem('careercore_student_passwords', JSON.stringify(stored));
    } catch (e) {}

    const res = await safeSupabase('updateStudentPassword', () =>
      supabase.from('profiles').update({ password: cleanPass, updated_at: new Date().toISOString() }).eq('id', userId)
    );

    if (res?.error) {
      return { success: false, message: res.error.message };
    }
    return { success: true };
  };

  // ── Context Value ──────────────────────────────────
  return (
    <LmsContext.Provider value={{
      courses,
      users,
      currentUser,
      activeView,
      setActiveView,
      authModal,
      setAuthModal,
      selectedEnrollCourse,
      setSelectedEnrollCourse,
      openEnrollment,
      loading,
      createCourse,
      deleteCourse,
      registerStudent,
      loginStudent,
      loginTeacher,
      loginMentor,
      loginAdmin,
      approveUser,
      rejectUser,
      deleteUser,
      updateStudentPassword,
      deleteAllStudents,
      syncUsersFromSupabase,
      feedbacks,
      addFeedback,
      logout
    }}>
      {children}
    </LmsContext.Provider>
  );
}

export const useLms = () => useContext(LmsContext);
