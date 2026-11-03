import React, { useState, useCallback, lazy, Suspense } from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import ErrorBoundary from './components/ErrorBoundary';
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BentoFeatures from './components/BentoFeatures';
import BusinessAnalystCard from './components/BusinessAnalystCard';
import InteractiveShowcase from './components/InteractiveShowcase';
import CtaBanner from './components/CtaBanner';
import StudentFeedbackSection from './components/StudentFeedbackSection';
import Footer from './components/Footer';

import EnrollmentModal from './components/EnrollmentModal';
import LoginModal from './components/LoginModal';
import CourseAdvisorBot from './components/CourseAdvisorBot';
import CounselingModal from './components/CounselingModal';
import FaqSection from './components/FaqSection';
import DashboardPreview from './components/DashboardPreview';
import InfoPage from './components/pages/InfoPage';
import CoursePage from './components/pages/CoursePage';
import NotFound from './components/pages/NotFound';
import { PAGES } from './content/pages';
import { slugify } from './config/site';

// Lazy load large portal views for optimal initial bundle size and near-instant load speeds
const StudentPortal = lazy(() => import('./components/StudentPortal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const TeacherPanel = lazy(() => import('./components/TeacherPanel'));

function PortalLoader({ title = 'Loading Workspace...' }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-[#0A317B]">
      <div className="w-10 h-10 border-3 border-blue-200 border-t-[#0A317B] rounded-full animate-spin"></div>
      <p className="font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">{title}</p>
    </div>
  );
}

// Resolve a public-site path to what should render
function resolveRoute(path, courses) {
  const clean = (path || '/').replace(/\/+$/, '').toLowerCase() || '/';
  if (clean === '/' || clean === '/index.html') return { type: 'home' };
  const slug = clean.slice(1);
  if (PAGES[slug]) return { type: 'page', slug };
  const m = clean.match(/^\/courses\/([^/]+)$/);
  if (m) {
    const course = courses.find((c) => slugify(c.title) === m[1] || c.id === m[1]);
    if (course) return { type: 'course', course };
  }
  return { type: 'notfound' };
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <BentoFeatures />
      <BusinessAnalystCard />
      <DashboardPreview />
      <InteractiveShowcase />
      <CtaBanner />
      <StudentFeedbackSection />
      <FaqSection />
    </>
  );
}

function MainContent() {
  const { activeView, currentPath, courses = [] } = useLms();
  const route = resolveRoute(currentPath, courses);

  // Scroll to #hash on first load (e.g. /#courses)
  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || ['admin', 'mentor', 'teacher', 'portal', 'student'].includes(hash)) return;
    const t = setTimeout(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }), 400);
    return () => clearTimeout(t);
  }, []);

  // Intro animation state machine:
  // 'intro'    → only IntroAnimation visible (site not mounted yet)
  // 'revealed' → site mounted behind the still-opaque intro overlay
  // 'done'     → intro fully gone, site is interactive
  const [introPhase, setIntroPhase] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        /^\/(admin|mentor|teacher|portal|student)(\/|$)/.test(path) ||
        hash === '#admin' ||
        hash === '#mentor' ||
        hash === '#teacher' ||
        hash === '#portal' ||
        (path !== '/' && path !== '/index.html') ||
        sessionStorage.getItem('careercore_intro_seen') === 'true'
      ) {
        return 'done';
      }
    }
    return 'intro';
  });

  // Called by IntroAnimation after its core animation finishes
  const handleReveal = useCallback(() => {
    setIntroPhase((prev) => (prev === 'intro' ? 'revealed' : prev));
  }, []);

  // Called by IntroAnimation after fade-out completes
  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem('careercore_intro_seen', 'true');
    } catch {}
    setIntroPhase('done');
  }, []);

  const siteReady = introPhase === 'revealed';

  // Intro overlay (renders on top of landing page until done; skipped for /admin, /mentor, /portal)
  const introOverlay = (introPhase !== 'done' && activeView === 'landing') ? (
    <IntroAnimation
      onReveal={handleReveal}
      onComplete={handleComplete}
      siteReady={siteReady}
    />
  ) : null;

  if (activeView === 'portal') {
    return (
      <>
        {introOverlay}
        {introPhase !== 'intro' && (
          <Suspense fallback={<PortalLoader title="Loading Student Workspace..." />}>
            <StudentPortal />
          </Suspense>
        )}
      </>
    );
  }

  if (activeView === 'admin') {
    return (
      <>
        {introOverlay}
        {introPhase !== 'intro' && (
          <Suspense fallback={<PortalLoader title="Loading Admin Workspace..." />}>
            <AdminPanel />
          </Suspense>
        )}
      </>
    );
  }

  if (activeView === 'mentor' || activeView === 'teacher') {
    return (
      <>
        {introOverlay}
        {introPhase !== 'intro' && (
          <Suspense fallback={<PortalLoader title="Loading Mentor Studio..." />}>
            <TeacherPanel />
          </Suspense>
        )}
      </>
    );
  }

  return (
    <>
      {/* Intro Splash Screen – plays first, then fades away */}
      {introOverlay}

      {/* Main Site – only mounts after intro signals reveal */}
      {introPhase !== 'intro' && (
        <div className="min-h-screen bg-white text-[#0A317B] selection:bg-[#FA9C16] selection:text-white relative flex flex-col">
          <Navbar />
          <main className="flex-1" key={route.type === 'home' ? 'home' : currentPath}>
            {route.type === 'home' && <HomePage />}
            {route.type === 'page' && <InfoPage slug={route.slug} />}
            {route.type === 'course' && <CoursePage course={route.course} />}
            {route.type === 'notfound' && <NotFound />}
          </main>
          <Footer />

          {/* AI Course Recommendation Bot */}
          <CourseAdvisorBot />

          {/* Auth Modals */}
          <EnrollmentModal />
          <LoginModal />
          <CounselingModal />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LmsProvider>
        <MainContent />
      </LmsProvider>
    </ErrorBoundary>
  );
}
