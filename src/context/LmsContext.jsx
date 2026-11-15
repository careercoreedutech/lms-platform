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

  const view = getViewFromPath(path);
  if (view !== 'landing') return view;
  if (hash === '#admin') return 'admin';
  if (hash === '#mentor' || hash === '#teacher') return 'mentor';
  if (hash === '#portal' || hash === '#student') return 'portal';
  return 'landing';
}

function getViewFromPath(pathname) {
  const path = (pathname || '/').toLowerCase();
  // Match whole path segments only, so e.g. /student-projects stays a public page
  const is = (prefix) => path === prefix || path.startsWith(`${prefix}/`);
  if (is('/admin')) return 'admin';
  if (is('/mentor') || is('/teacher')) return 'mentor';
  if (is('/portal') || is('/student')) return 'portal';
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

  // Student list: loaded from the database for signed-in admins/mentors only, never cached in the browser.
  const [users, setUsers] = useState([]);

  // Set only from a verified Supabase session (see Auth below).
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [activeView, setActiveViewState] = useState(() => getViewFromLocation());
  // Current public-site path (used to render content pages, course pages and the 404 page)
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

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
      setCurrentPath(targetPath);
    }
  }, []);

  // Client-side navigation for public pages: navigate('/about'), navigate('/#features'), navigate('/courses/ui-ux-design')
  const navigate = useCallback((to) => {
    if (typeof window === 'undefined' || !to) return;
    const [rawPath, hash] = to.split('#');
    const targetPath = rawPath || '/';
    const view = getViewFromPath(targetPath);
    const samePath = window.location.pathname === targetPath;
    if (!samePath || (hash && window.location.hash !== `#${hash}`)) {
      window.history.pushState({ view }, '', `${targetPath}${hash ? `#${hash}` : ''}`);
    }
    setActiveViewState(view);
    setCurrentPath(targetPath);
    const scrollTarget = () => {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true; }
        return false;
      }
      window.scrollTo({ top: 0, behavior: samePath ? 'smooth' : 'auto' });
      return true;
    };
    if (samePath) {
      scrollTarget();
    } else {
      // wait for the new page to render, then scroll
      let tries = 0;
      const tick = () => { if (!scrollTarget() && tries++ < 20) setTimeout(tick, 50); };
      setTimeout(tick, 30);
    }
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = (e) => {
      const view = e.state?.view || getViewFromLocation();
      setActiveViewState(view === 'teacher' ? 'mentor' : view);
      setCurrentPath(window.location.pathname);
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

  // ── Helpers ────────────────────────────────────────
  const openEnrollment = (courseTitle) => {
    setSelectedEnrollCourse(courseTitle || null);
    setAuthModal('enroll');
  };

  // Counseling / enrollment-desk contact form ('counsel' modal)
  const [counselTopic, setCounselTopic] = useState(null);
  const openCounseling = (topic) => {
    setCounselTopic(topic || null);
    setAuthModal('counsel');
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

    // DOBs saved by older builds before the dob column existed
    let storedStudentDobs = {};
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

    // The database is the only source: no merging with browser-cached users.
    setUsers(studentProfiles);
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

        // Student list is loaded only after an admin or mentor signs in (see Auth below).

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

  // ── Auth ───────────────────────────────────────────
  // Supabase Auth is the only source of truth for who is signed in.
  // The role comes from the database (get_my_role), never from the browser.

  const VIEW_FOR_ROLE = { ADMIN: 'admin', MENTOR: 'mentor', STUDENT: 'portal' };

  // Turns a Supabase session into the app's currentUser. Returns null (and signs out)
  // for accounts with no role: unknown, rejected students, mentors on leave.
  const loadUserForSession = useCallback(async (session) => {
    const authUser = session?.user;
    if (!authUser) {
      setCurrentUser(null);
      return null;
    }

    const { data: role, error: roleErr } = await supabase.rpc('get_my_role');
    if (roleErr || !role) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      return null;
    }

    const meta = authUser.user_metadata || {};
    let user;

    if (role === 'ADMIN') {
      const { data: a } = await supabase
        .from('admins')
        .select('id, username, full_name, email')
        .eq('auth_user_id', authUser.id)
        .maybeSingle();
      user = {
        id: authUser.id,
        adminId: a?.id,
        name: a?.full_name || a?.username || 'Administrator',
        username: a?.username || '',
        email: a?.email || authUser.email,
        role: 'ADMIN'
      };
    } else if (role === 'MENTOR') {
      const { data: m } = await supabase
        .from('mentors')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .maybeSingle();
      user = {
        id: m?.id || authUser.id,
        authUserId: authUser.id,
        name: m?.name || meta.full_name || 'Mentor',
        username: (m?.name || '').toLowerCase().replace(/\s+/g, '_'),
        email: m?.email || '',
        role: 'MENTOR',
        company: m?.company || '',
        course: m?.course || '',
        avatar: m?.avatar || '',
        rating: m?.rating || 4.9,
        reviewsCount: m?.reviews_count || 100,
        mentees: m?.mentees_count || 150,
        status: m?.status || 'Active'
      };
    } else {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();
      let studentCourse = p?.course || meta.course || '';
      if (!studentCourse) {
        const { data: en } = await supabase
          .from('enrollments')
          .select('courses(title)')
          .eq('student_id', authUser.id)
          .limit(1)
          .maybeSingle();
        if (en?.courses?.title) studentCourse = en.courses.title;
      }
      user = {
        id: authUser.id,
        name: p?.full_name || meta.full_name || authUser.email?.split('@')[0],
        email: authUser.email,
        username: p?.username || meta.username || authUser.email?.split('@')[0],
        phone: p?.phone || meta.phone || '',
        dob: p?.dob || meta.dob || '',
        course: studentCourse || 'Full Stack Web Dev',
        role: 'STUDENT',
        status: 'APPROVED',
        progressPercent: p?.progress_percent || 0,
        completedLessons: p?.completed_lessons || 0,
        totalLessons: p?.total_lessons || 2,
        completedWeeks: p?.completed_weeks || 0,
        currentWeek: p?.current_week || 1
      };
    }

    user.mustResetPassword = !!meta.must_reset_password;
    setCurrentUser(user);
    return user;
  }, []);

  // While signIn/registerStudent load the user themselves, the auth listener stays out of the way.
  const signingInRef = useRef(false);

  const signIn = async (identifier = '', password = '', expectedRole = null) => {
    const id = (identifier || '').trim();
    const pw = password || '';
    if (!id || !pw) {
      return { success: false, message: 'Please enter your username (or email) and password.' };
    }

    signingInRef.current = true;
    try {
      const { data: email, error: lookupErr } = await supabase.rpc('login_email_for', { identifier: id });
      if (lookupErr) {
        return { success: false, message: 'Could not reach the server. Please try again.' };
      }
      if (!email) {
        return { success: false, message: 'Incorrect username or password.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error || !data?.session) {
        if (error && /confirm/i.test(error.message)) {
          return { success: false, message: 'Please confirm your email address first (check your inbox), then log in.' };
        }
        return { success: false, message: 'Incorrect username or password.' };
      }

      const user = await loadUserForSession(data.session);
      if (!user) {
        return { success: false, message: 'This account does not have access. Please contact the administrator.' };
      }
      if (expectedRole && user.role !== expectedRole && user.role !== 'ADMIN') {
        await supabase.auth.signOut();
        setCurrentUser(null);
        return { success: false, message: 'This account does not have access to this portal.' };
      }

      setActiveView(expectedRole ? VIEW_FOR_ROLE[expectedRole] : VIEW_FOR_ROLE[user.role]);
      setAuthModal(null);
      return { success: true, role: user.role };
    } finally {
      signingInRef.current = false;
    }
  };

  // Main login box: opens whichever portal the account belongs to.
  const loginStudent = (identifier, password) => signIn(identifier, password);
  const loginAdmin = (identifier, password) => signIn(identifier, password, 'ADMIN');
  const loginMentor = (identifier, password) => signIn(identifier, password, 'MENTOR');
  const loginTeacher = loginMentor;

  // ── registerStudent ────────────────────────────────
  // The database trigger creates the profile and first enrollment.
  const registerStudent = async (studentData = {}) => {
    const email = (studentData.email || '').trim().toLowerCase();
    const password = studentData.password || '';
    const username = (studentData.username || email.split('@')[0] || '').trim().toLowerCase();
    if (!email) return { success: false, message: 'Please enter your email address.' };
    if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };

    const { data: taken } = await supabase.rpc('login_email_for', { identifier: username });
    if (taken && taken !== email) {
      return { success: false, message: 'That username is already taken. Please choose another.' };
    }

    signingInRef.current = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/portal`,
          data: {
            full_name: studentData.name || '',
            phone: studentData.phone || '',
            dob: studentData.dob || '',
            username,
            course: studentData.course || '',
            mode: studentData.mode || 'Interactive'
          }
        }
      });

      if (error) {
        if (/registered|exists/i.test(error.message)) {
          return { success: false, message: 'An account with this email already exists. Please log in instead.' };
        }
        return { success: false, message: error.message };
      }

      if (data?.session) {
        const user = await loadUserForSession(data.session);
        if (user) {
          setActiveView('portal');
          setAuthModal(null);
        }
        return { success: true, message: 'Registration complete! Welcome to CareerCore.' };
      }

      return {
        success: true,
        message: 'Almost done! We sent a confirmation link to your email. Click it, then log in.'
      };
    } finally {
      signingInRef.current = false;
    }
  };

  // ── Password self-service ──────────────────────────
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  const changeOwnPassword = async (newPassword = '') => {
    if (newPassword.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters.' };
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { must_reset_password: false }
    });
    if (error) return { success: false, message: error.message };
    setPasswordRecovery(false);
    setCurrentUser(prev => (prev ? { ...prev, mustResetPassword: false } : prev));
    return { success: true };
  };

  // Always answers the same way, so it can't be used to discover accounts.
  const sendPasswordReset = async (identifier = '') => {
    const genericMessage = 'If an account exists for that username or email, a reset link is on its way.';
    try {
      const { data: email } = await supabase.rpc('login_email_for', { identifier: identifier.trim() });
      if (email && !email.endsWith('.invalid')) {
        await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/portal` });
      }
    } catch (e) {}
    return { success: true, message: genericMessage };
  };

  // Restore the session on load and follow sign-in/out in other tabs.
  useEffect(() => {
    // Old builds kept users, passwords and a trusted role in localStorage. Remove them.
    try {
      ['careercore_current_user', 'careercore_lms_users', 'careercore_lms_users_v2',
       'careercore_student_passwords', 'careercore_mentor_passwords']
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}

    supabase.auth.getSession().then(({ data }) => {
      loadUserForSession(data?.session).finally(() => setAuthReady(true));
    });

    // Supabase advises against awaiting Supabase calls inside this callback, hence setTimeout.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUsers([]);
        return;
      }
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
      }
      if ((event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') && !signingInRef.current) {
        setTimeout(() => loadUserForSession(session), 0);
      }
    });

    return () => subscription?.unsubscribe();
  }, [loadUserForSession]);

  // Staff see the student list; students and visitors never load it.
  useEffect(() => {
    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'MENTOR') {
      syncUsersFromSupabase();
    }
  }, [currentUser?.role, currentUser?.id, syncUsersFromSupabase]);

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

  // ── Admin account actions (server-side, Edge Function "admin-users") ──
  const callAdminFunction = async (body) => {
    const { data, error } = await supabase.functions.invoke('admin-users', { body });
    if (error) {
      let message = error.message;
      try {
        const detail = await error.context?.json?.();
        if (detail?.error) message = detail.error;
      } catch (e) {}
      return { success: false, message };
    }
    if (data?.error) return { success: false, message: data.error };
    return { ...data, success: data?.ok !== false };
  };

  // ── deleteUser ─────────────────────────────────────
  const deleteUser = async (userId) => {
    const res = await callAdminFunction({ action: 'delete_users', ids: [userId] });
    if (res.success) setUsers(prev => prev.filter(u => u.id !== userId));
    return res;
  };

  // ── deleteAllStudents ──────────────────────────────
  const deleteAllStudents = async () => {
    const ids = users.filter(u => (u.role || 'STUDENT').toUpperCase() === 'STUDENT').map(u => u.id);
    if (ids.length === 0) return { success: true };
    const res = await callAdminFunction({ action: 'delete_users', ids });
    await syncUsersFromSupabase();
    return res;
  };

  // ── logout ─────────────────────────────────────────
  const logout = async () => {
    await safeSupabase('logout', () => supabase.auth.signOut());
    setCurrentUser(null);
    setUsers([]);
    setActiveView('landing');
  };

  // ── Passwords set by an admin (user must change it at next login) ──
  const updateStudentPassword = async (userId, newPassword) => {
    const password = (newPassword || '').trim();
    if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };
    return callAdminFunction({ action: 'set_password', kind: 'student', id: userId, password });
  };

  const setMentorPassword = async (mentorId, newPassword) => {
    const password = (newPassword || '').trim();
    if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };
    return callAdminFunction({ action: 'set_password', kind: 'mentor', id: mentorId, password });
  };

  const deleteMentorAccount = (mentorId) => callAdminFunction({ action: 'delete_mentor', id: mentorId });

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
      openCounseling,
      counselTopic,
      currentPath,
      navigate,
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
      setMentorPassword,
      deleteMentorAccount,
      changeOwnPassword,
      sendPasswordReset,
      passwordRecovery,
      authReady,
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
