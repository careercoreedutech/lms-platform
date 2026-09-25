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

function MainContent() {
  const { activeView } = useLms();

  // Intro animation state machine:
  // 'intro'    → only IntroAnimation visible (site not mounted yet)
  // 'revealed' → site mounted behind the still-opaque intro overlay
  // 'done'     → intro fully gone, site is interactive
  const [introPhase, setIntroPhase] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path.startsWith('/admin') ||
        path.startsWith('/mentor') ||
        path.startsWith('/teacher') ||
        path.startsWith('/portal') ||
        path.startsWith('/student') ||
        hash === '#admin' ||
        hash === '#mentor' ||
        hash === '#teacher' ||
        hash === '#portal' ||
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
        <div className="min-h-screen bg-white text-[#0A317B] selection:bg-[#FA9C16] selection:text-white relative">
          <Navbar />
          <main>
            <HeroSection />
            <BentoFeatures />
            <BusinessAnalystCard />
            <InteractiveShowcase />
            <CtaBanner />
            <StudentFeedbackSection />
          </main>
          <Footer />

          {/* AI Course Recommendation Bot */}
          <CourseAdvisorBot />

          {/* Auth Modals */}
          <EnrollmentModal />
          <LoginModal />
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
