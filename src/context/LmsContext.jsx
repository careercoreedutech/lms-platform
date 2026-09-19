import React, { createContext, useContext, useState, useEffect } from 'react';
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
            videoFileName: '',
            videoBlobUrl: '',
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
            title: 'Day 1: Microservices Architecture & Containerization',
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
    id: 'course-1',
    title: 'Product Management - Skill Up',
    title1: 'Product',
    title2: 'Manager',
    category: 'Product & Business',
    duration: '5 Weeks',
    price: '₹25,000',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80',
    imageAlt: 'Product roadmap and wireframe sketches',
    description: 'Master product roadmap strategy, market research, wireframing, metrics, and team leadership to drive measurable business growth.',
    buttonText: 'Enroll',
    redirectCourse: 'Product Management - Skill Up',
    completedCount: 0,
    totalCount: 40,
    sections: [
      {
        id: 'sec-1',
        weekNumber: 1,
        title: 'Week 1: Introduction and Fundamentals',
        topicsCount: 5,
        items: [
          { 
            id: 'it-1', 
            title: 'Product Management Week 1: Course Overview', 
            contentType: 'video', 
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
            duration: '15 mins', 
            articles: 1, 
            mcqs: 0, 
            status: 'Continue' 
          },
          { 
            id: 'it-2', 
            title: 'Day 1: Product Management Basics', 
            contentType: 'notion', 
            articles: 2, 
            mcqs: 5, 
            status: 'Start',
            notionDoc: `# Day 1: Product Management Basics

Welcome to the foundational guide on modern **Product Management**.

---

### Key Pillars of a Product Manager

1. **User Empathy**: Deeply understanding customer pain points and unarticulated needs.
2. **Business Strategy**: Aligning product features with company revenue & growth metrics.
3. **Tech Knowledge**: Speaking the language of engineers and technical architects.

> **Pro Tip**: A Product Manager is not the "boss" of the team—you lead through influence, data, and clear communication.

---

### The Product Lifecycle Spectrum
- **Discovery**: Research, user interviews, hypothesis testing.
- **Definition**: Product Requirement Documents (PRDs), user stories, specs.
- **Delivery**: Sprint planning, engineering execution, QA testing.
- **Growth**: Launching, analyzing funnel conversion, iterating based on feedback.`
          },
          { 
            id: 'it-3', 
            title: 'Day 2: Roles and Responsibilities', 
            contentType: 'notion', 
            articles: 3, 
            mcqs: 5, 
            status: 'Start',
            notionDoc: `# Day 2: PM Roles & Responsibilities

### Cross-Functional Collaboration Matrix

| Role | Responsibility | Interaction Model |
| :--- | :--- | :--- |
| **Engineering** | Architecture & Delivery | Daily Standups & Backlog Grooming |
| **UX/UI Design** | User Research & Wireframes | Design Sprints & Usability Testing |
| **Product Marketing** | Go-to-Market & Messaging | Launch Alignment & Sales Enablement |

> **Key Takeaway**: Great PMs bring clarity where there is ambiguity.`
          },
          { 
            id: 'it-quiz-1', 
            title: 'Day 3: Product Management Quiz & MCQs', 
            contentType: 'quiz', 
            articles: 1, 
            mcqs: 3, 
            status: 'Start',
            quizQuestions: [
              {
                question: 'What is the primary responsibility of a Product Manager during the Discovery phase?',
                options: [
                  'Writing production CSS code',
                  'Validating customer pain points & market demand',
                  'Managing server hardware',
                  'Auditing tax returns'
                ],
                correctIndex: 1,
                explanation: 'Discovery focuses on understanding real customer pain points before building solutions.'
              },
              {
                question: 'Which metric measures the percentage of users who stop using a product over a given period?',
                options: [
                  'LTV (Lifetime Value)',
                  'CAC (Customer Acquisition Cost)',
                  'Churn Rate',
                  'NPS (Net Promoter Score)'
                ],
                correctIndex: 2,
                explanation: 'Churn rate represents the rate at which customers cancel or drop off.'
              },
              {
                question: 'What does MVP stand for in product development?',
                options: [
                  'Most Valuable Player',
                  'Minimum Viable Product',
                  'Maximum Velocity Process',
                  'Modular Vector Protocol'
                ],
                correctIndex: 1,
                explanation: 'Minimum Viable Product is the simplest version of a product released to gather feedback.'
              }
            ]
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
    price: '₹30,000',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',
    imageAlt: 'Desk with a calculator, notebook and printed charts',
    description: 'A business analyst helps organizations improve processes, products, and services by analyzing data and stakeholder needs. They bridge the gap between business goals and technology solutions, ensuring projects deliver value.',
    buttonText: 'Enroll',
    redirectCourse: 'Business Analyst',
    completedCount: 0,
    totalCount: 5,
    sections: [
      {
        id: 'sec-ba-1',
        weekNumber: 1,
        title: 'Week 1: Process Modeling & Requirements Analysis',
        topicsCount: 2,
        items: [
          {
            id: 'ba-it-1',
            title: 'Day 1: Stakeholder Interviews & Gap Analysis',
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
    id: 'course-ui-ux',
    title: 'UI/UX Design',
    title1: 'UI/UX',
    title2: 'Designer',
    category: 'Design',
    duration: '6 Weeks',
    price: '₹28,000',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&q=80',
    imageAlt: 'Designer wireframing user interfaces on tablet',
    description: 'A UI/UX designer creates intuitive, human-centered digital experiences by conducting user research, designing wireframes, interactive prototypes, and scalable design systems in Figma.',
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

const INITIAL_USERS = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    course: 'Product Management - Skill Up',
    status: 'APPROVED',
    registeredAt: '2026-09-15 10:30 AM'
  }
];

export function LmsProvider({ children }) {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('careercore_lms_courses_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    const oldSaved = localStorage.getItem('careercore_lms_courses_v4');
    if (oldSaved) {
      try {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 1) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COURSES;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('careercore_lms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('careercore_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState('landing');
  const [authModal, setAuthModal] = useState(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState(null);

  const openEnrollment = (courseTitle) => {
    if (courseTitle) setSelectedEnrollCourse(courseTitle);
    setAuthModal('enroll');
  };

  useEffect(() => {
    localStorage.setItem('careercore_lms_courses_v5', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('careercore_lms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('careercore_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('careercore_current_user');
    }
  }, [currentUser]);

  // Sync courses with Supabase on load
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: dbCourses, error } = await supabase.from('courses').select('*');
        if (!error && dbCourses && dbCourses.length > 0) {
          setCourses(prev => {
            return dbCourses.map(dbC => {
              const matchedLocal = prev.find(
                c => (c.id && c.id === dbC.id) || 
                     (c.title && dbC.title && c.title.toLowerCase() === dbC.title.toLowerCase())
              );
              return {
                id: dbC.id,
                title: dbC.title,
                title1: dbC.title1 || (matchedLocal ? matchedLocal.title1 : ''),
                title2: dbC.title2 || (matchedLocal ? matchedLocal.title2 : ''),
                category: dbC.category,
                duration: dbC.duration,
                price: dbC.price,
                image: dbC.image_url,
                imageAlt: dbC.image_alt || dbC.title,
                description: dbC.description,
                buttonText: dbC.button_text || 'Enroll',
                redirectCourse: dbC.redirect_course || dbC.title,
                completedCount: matchedLocal?.completedCount || 0,
                totalCount: matchedLocal?.totalCount || (matchedLocal?.sections ? matchedLocal.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0) : 5),
                sections: matchedLocal?.sections || []
              };
            });
          });
        }
      } catch (err) {
        console.warn('Supabase courses sync notice:', err);
      }
    }

    loadSupabaseData();

    // Listen to Supabase auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && event === 'SIGNED_IN') {
        const meta = session.user.user_metadata || {};
        setCurrentUser({
          id: session.user.id,
          name: meta.full_name || session.user.email?.split('@')[0],
          username: meta.username || session.user.email?.split('@')[0],
          email: session.user.email,
          role: meta.role || 'STUDENT',
          status: 'APPROVED'
        });
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const createCourse = async (courseData) => {
    if (!courseData.title) return { success: false, message: 'Course title is required' };
    const cleanTitle = courseData.title.trim();

    // 1. Sync to Supabase courses table
    try {
      await supabase.from('courses').upsert({
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
      });
    } catch (e) {
      console.warn('Supabase course upsert notice:', e);
    }

    // 2. Update local state
    setCourses(prev => {
      const existingIdx = prev.findIndex(c => (courseData.id && c.id === courseData.id) || c.title.toLowerCase() === cleanTitle.toLowerCase());
      if (existingIdx >= 0) {
        const updated = [...prev];
        const prevCourse = updated[existingIdx];
        updated[existingIdx] = {
          ...prevCourse,
          ...courseData,
          id: prevCourse.id || courseData.id || `course-${Date.now()}`,
          title: cleanTitle,
          title1: courseData.title1 !== undefined ? courseData.title1 : (prevCourse.title1 || ''),
          title2: courseData.title2 !== undefined ? courseData.title2 : (prevCourse.title2 || ''),
          image: courseData.image?.trim() || prevCourse.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
          category: courseData.category?.trim() || prevCourse.category || 'Custom Track',
          duration: courseData.duration?.trim() || prevCourse.duration || '5 Weeks',
          price: courseData.price?.trim() || prevCourse.price || 'Standard Tuition',
          description: courseData.description?.trim() || prevCourse.description || 'Custom Structured Course',
          buttonText: courseData.buttonText?.trim() || prevCourse.buttonText || 'Enroll',
          redirectCourse: courseData.redirectCourse?.trim() || prevCourse.redirectCourse || cleanTitle,
          totalCount: courseData.sections ? courseData.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0) : prevCourse.totalCount || 0,
          sections: courseData.sections || prevCourse.sections || []
        };
        return updated;
      }

      const newCourse = {
        id: courseData.id || `course-${Date.now()}`,
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

      return [newCourse, ...prev];
    });

    return { success: true, message: 'Structured course saved successfully!' };
  };

  const deleteCourse = async (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    try {
      await supabase.from('courses').delete().eq('id', courseId);
    } catch (e) {
      console.warn('Supabase course delete notice:', e);
    }
  };

  const registerStudent = async ({ name, email, username, password, course }) => {
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      course,
      status: 'PENDING',
      registeredAt: new Date().toLocaleString()
    };

    setUsers(prev => [newUser, ...prev]);

    // Also register with Supabase Auth
    try {
      await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: name.trim(),
            username: username.trim(),
            role: 'STUDENT',
            status: 'APPROVED'
          }
        }
      });
    } catch (e) {
      console.warn('Supabase signup notice:', e);
    }

    return { success: true, message: 'Registration submitted! Awaiting Admin Approval.' };
  };

  const loginStudent = async (usernameOrEmail, password) => {
    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === 'admin' && cleanPass === 'admin123') {
      return loginAdmin('admin', 'admin123');
    }

    if ((cleanUser === 'teacher' || cleanUser === 'instructor') && (cleanPass === 'teacher123' || cleanPass === 'password123')) {
      return loginTeacher('teacher', 'teacher123');
    }

    // Try Supabase Auth if user provided an email
    if (cleanUser.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanUser,
          password: cleanPass
        });
        if (!error && data?.user) {
          const profile = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            email: data.user.email,
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
            role: data.user.user_metadata?.role || 'STUDENT',
            status: 'APPROVED'
          };
          setCurrentUser(profile);
          setActiveView(profile.role === 'ADMIN' ? 'admin' : profile.role === 'TEACHER' ? 'teacher' : 'portal');
          setAuthModal(null);
          return { success: true };
        }
      } catch (e) {
        console.warn('Supabase auth notice:', e);
      }
    }

    const found = users.find(
      u => (u.username.trim().toLowerCase() === cleanUser || 
            u.email.trim().toLowerCase() === cleanUser) && 
            u.password.trim() === cleanPass
    );

    if (!found) {
      return { 
        success: false, 
        message: 'Invalid username/email or password.' 
      };
    }

    if (found.status === 'PENDING') {
      return { 
        success: false, 
        isPending: true,
        message: `Your account (${found.username}) is PENDING ADMIN APPROVAL. Log into the ADMIN PANEL (admin / admin123) to click "Approve" first!` 
      };
    }

    if (found.status === 'REJECTED') {
      return { 
        success: false, 
        message: 'Your account request was not approved by the administrator.' 
      };
    }

    setCurrentUser({ ...found, role: 'STUDENT' });
    setActiveView('portal');
    setAuthModal(null);
    return { success: true };
  };

  const loginAdmin = (username, password) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === 'admin' && cleanPass === 'admin123') {
      setCurrentUser({ name: 'System Admin', username: 'admin', role: 'ADMIN' });
      setActiveView('admin');
      setAuthModal(null);
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials. Use admin / admin123' };
  };

  const loginTeacher = (username, password) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if ((cleanUser === 'teacher' || cleanUser === 'instructor') && (cleanPass === 'teacher123' || cleanPass === 'password123')) {
      setCurrentUser({ name: 'Instructor Alex', username: 'teacher', email: 'teacher@careercore.com', role: 'TEACHER' });
      setActiveView('teacher');
      setAuthModal(null);
      return { success: true };
    }

    const found = users.find(
      u => (u.username.trim().toLowerCase() === cleanUser || u.email.trim().toLowerCase() === cleanUser) && 
           u.password.trim() === cleanPass && (u.role === 'TEACHER' || u.status === 'TEACHER')
    );

    if (!found) {
      return { success: false, message: 'Invalid teacher credentials. Use teacher / teacher123' };
    }

    setCurrentUser({ ...found, role: 'TEACHER' });
    setActiveView('teacher');
    setAuthModal(null);
    return { success: true };
  };

  const approveUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u));
  };

  const rejectUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'REJECTED' } : u));
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
    setCurrentUser(null);
    setActiveView('landing');
  };

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
      createCourse,
      deleteCourse,
      registerStudent,
      loginStudent,
      loginTeacher,
      loginAdmin,
      approveUser,
      rejectUser,
      logout
    }}>
      {children}
    </LmsContext.Provider>
  );
}

export const useLms = () => useContext(LmsContext);
