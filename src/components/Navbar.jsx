import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  LogOut,
  UserCheck,
  Sparkles,
  BookOpen,
  GraduationCap,
  Phone,
  PhoneCall,
  Star,
  LayoutGrid,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { useOverlay } from '../hooks/useOverlay';
import { SITE, formatDuration, slugify } from '../config/site';

const COURSE_TAGS = {
  'Full Stack Web Dev': 'High demand',
  'AI & Machine Learning': 'Trending',
  'AI & Data Science': 'Trending',
  'Cloud & DevOps': 'Enterprise',
  'Business Analyst': 'Most popular',
  'UI/UX Design': 'Creative tech',
  'Product Management': 'Leadership',
};

const NAV_LINKS = [
  { label: 'Why CareerCore', to: '/#features', icon: Sparkles },
  { label: 'Reviews', to: '/#reviews', icon: Star },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(() => {
    try { return sessionStorage.getItem('careercore_banner_dismissed') !== 'true'; } catch { return true; }
  });
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const closeTimer = useRef(null);

  const {
    setAuthModal,
    currentUser,
    setActiveView,
    logout,
    courses = [],
    openEnrollment,
    openCounseling,
    navigate,
    currentPath,
  } = useLms();

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);
  useOverlay(mobileMenuOpen, closeMobile);

  useEffect(() => {
    let last = window.scrollY > 30;
    setScrolled(last);
    const onScroll = () => {
      const s = window.scrollY > 30;
      if (s !== last) { last = s; setScrolled(s); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Publish the real header height so page content never hides underneath it (BUG-019)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const publish = () => {
      if (window.scrollY <= 30 && !mobileMenuOpen) {
        document.documentElement.style.setProperty('--header-h', `${Math.ceil(el.getBoundingClientRect().height)}px`);
      }
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, [announcementVisible, scrolled, mobileMenuOpen]);

  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setCoursesOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setCoursesOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const dismissBanner = () => {
    setAnnouncementVisible(false);
    try { sessionStorage.setItem('careercore_banner_dismissed', 'true'); } catch {}
  };

  const portalLabel = !currentUser ? '' : currentUser.role === 'ADMIN' ? 'Admin Console'
    : (currentUser.role === 'MENTOR' || currentUser.role === 'TEACHER') ? 'Mentor Studio' : 'My Portal';
  const portalView = !currentUser ? 'landing' : currentUser.role === 'ADMIN' ? 'admin'
    : (currentUser.role === 'MENTOR' || currentUser.role === 'TEACHER') ? 'mentor' : 'portal';

  const go = (to) => (e) => {
    e?.preventDefault();
    setCoursesOpen(false);
    setMobileMenuOpen(false);
    navigate(to);
  };

  const openDropdown = () => { clearTimeout(closeTimer.current); setCoursesOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setCoursesOpen(false), 140); };

  const showBanner = announcementVisible && !scrolled && !mobileMenuOpen;
  // Transparent, light-on-dark navbar while sitting on top of the dark home hero
  const dark = (currentPath === '/' || currentPath === '') && !scrolled && !mobileMenuOpen;

  return (
    <header ref={headerRef} className="fixed z-50 inset-x-0 top-0 w-full">
      {/* ── Announcement bar ── */}
      <AnimatePresence initial={false}>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-gradient-to-r from-brand-navy via-[#0D419D] to-brand-teal text-white text-[11px] sm:text-xs font-medium overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center gap-2">
              <div className="flex-1 min-w-0 flex items-center justify-center sm:justify-start gap-2">
                <span className="hidden sm:flex items-center justify-center w-4 h-4 rounded-full bg-brand-orange text-brand-navy font-black text-[9px] shrink-0">★</span>
                <span className="font-bold truncate">Admissions open for upcoming batches</span>
                <span className="hidden md:inline text-white/50">•</span>
                <span className="hidden md:inline text-white/85 truncate">Hands-on capstones & 1-on-1 career mentorship</span>
                <button
                  onClick={() => openEnrollment()}
                  className="shrink-0 underline underline-offset-2 font-extrabold text-brand-orange hover:text-amber-200 cursor-pointer"
                >
                  Apply now →
                </button>
              </div>
              <a href={SITE.phoneHref} className="hidden sm:flex items-center gap-1 text-white/80 hover:text-white shrink-0">
                <Phone className="w-3 h-3 text-brand-orange" />
                <span>{SITE.phoneDisplay}</span>
              </a>
              <button
                onClick={dismissBanner}
                className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                aria-label="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main bar ── */}
      <div
        className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled && !mobileMenuOpen
            ? 'mt-3 w-[calc(100%-1.5rem)] max-w-6xl bg-white/90 backdrop-blur-xl shadow-[0_18px_48px_-12px_rgba(10,49,123,0.22)] ring-1 ring-slate-200/80 rounded-2xl py-2.5 px-4 sm:px-6'
            : dark
              ? 'w-full bg-transparent border-b border-white/10 py-3 px-4 sm:px-8 lg:px-12'
              : 'w-full bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 px-4 sm:px-8 lg:px-12'
        }`}
      >
        <div className="w-full flex items-center justify-between gap-4">
          <a href="/" onClick={go('/')} className="flex items-center gap-2.5 group shrink-0" aria-label="CareerCore Edutech home">
            {dark ? (
              <span className="h-8 sm:h-9 flex items-center">
                <img src="/logo-light.png" alt="CareerCore Edutech" className="h-[18px] sm:h-5 w-auto transition-transform duration-300 group-hover:scale-[1.03]" />
              </span>
            ) : (
              <img src="/logo.png" alt="CareerCore Edutech" className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]" />
            )}
          </a>

          {/* Desktop navigation */}
          <nav className={`hidden lg:flex items-center gap-1 text-[13px] font-bold whitespace-nowrap transition-colors ${dark ? 'text-white/80' : 'text-slate-600'}`} aria-label="Main">
            <div className="relative" ref={dropdownRef} onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
              <button
                onClick={() => setCoursesOpen((v) => !v)}
                aria-expanded={coursesOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  coursesOpen ? (dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-brand-navy') : (dark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-slate-50 hover:text-brand-navy')
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-teal" />
                <span>Courses</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${coursesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {coursesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full left-0 pt-2 w-[440px] z-50"
                  >
                    {/* Height capped to the viewport so the last item is never cut off (BUG-021) */}
                    <div
                      className="bg-white rounded-2xl shadow-[0_24px_60px_-12px_rgba(10,49,123,0.25)] ring-1 ring-slate-200 p-2.5 overflow-y-auto overscroll-contain"
                      style={{ maxHeight: 'calc(100dvh - var(--header-h) - 24px)' }}
                    >
                      <div className="px-2.5 pt-1.5 pb-2.5 mb-1 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-[11px] font-black text-brand-navy uppercase tracking-wider">Career tracks</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                          {courses.length} live
                        </span>
                      </div>
                      {courses.map((course) => (
                        <a
                          key={course.id}
                          href={`/courses/${slugify(course.title)}`}
                          onClick={go(`/courses/${slugify(course.title)}`)}
                          className="group flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-white transition-colors">
                              <GraduationCap className="w-4 h-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] font-bold text-slate-900 group-hover:text-brand-navy truncate">{course.title}</span>
                              <span className="block text-[11px] font-medium text-slate-400">
                                {formatDuration(course.duration) || '6–8 Weeks'} · {course.price || 'Flexible EMI'}
                              </span>
                            </span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-brand-orange group-hover:text-white transition-colors shrink-0">
                            {COURSE_TAGS[course.title] || 'Certificate'}
                          </span>
                        </a>
                      ))}
                      <a
                        href="/#courses"
                        onClick={go('/#courses')}
                        className="mt-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-bold text-brand-teal hover:bg-teal-50"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" /> View all programs
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.to} onClick={go(l.to)} className={`px-3 py-2 rounded-xl transition-colors ${dark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-slate-50 hover:text-brand-navy'}`}>
                {l.label}
              </a>
            ))}
            <button onClick={() => openCounseling()} className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${dark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-slate-50 hover:text-brand-navy'}`}>
              Free Counseling
            </button>
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2 whitespace-nowrap">
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 pl-2.5 rounded-2xl ring-1 ring-slate-200">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-navy to-brand-teal text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden xl:block text-xs font-bold text-slate-700 pr-1">{currentUser.name?.split(' ')[0] || 'Member'}</span>
                <button onClick={() => setActiveView(portalView)} className="px-3 py-1.5 rounded-xl bg-brand-navy hover:bg-[#072563] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{portalLabel}</span>
                </button>
                <button onClick={logout} className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer" title="Sign out" aria-label="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Plain button — no dropdown arrow (BUG-025) */}
                <button
                  onClick={() => setAuthModal('login')}
                  className={`px-4 py-2.5 rounded-xl text-[13px] font-bold ring-1 transition-all cursor-pointer ${dark ? 'text-white ring-white/25 hover:bg-white/10' : 'text-brand-navy ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'}`}
                >
                  Student Login
                </button>
                <button onClick={() => openEnrollment()} className="btn-primary !px-4 !py-2.5 !text-[13px] group">
                  <span>Enroll Now</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`lg:hidden p-2 -mr-2 rounded-xl cursor-pointer ${dark ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu: full-height sheet above every floating widget (BUG-017) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-y-auto overscroll-contain shadow-xl"
            style={{ height: 'calc(100dvh - 61px)' }}
          >
            <div className="px-4 pt-4 pb-8 space-y-5">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Courses</p>
                <div className="grid gap-1">
                  {courses.map((course) => (
                    <a
                      key={course.id}
                      href={`/courses/${slugify(course.title)}`}
                      onClick={go(`/courses/${slugify(course.title)}`)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 active:bg-slate-100"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                        <GraduationCap className="w-4 h-4 text-brand-teal" />
                        {course.title}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{formatDuration(course.duration)}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid gap-1">
                {NAV_LINKS.map((l) => (
                  <a key={l.label} href={l.to} onClick={go(l.to)} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <l.icon className="w-4 h-4 text-brand-orange" /> {l.label}
                  </a>
                ))}
                <button
                  onClick={() => { setMobileMenuOpen(false); openCounseling(); }}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-brand-orange" /> Free Counseling
                </button>
              </div>

              <div className="border-t border-slate-100 pt-4 grid gap-2">
                {currentUser ? (
                  <>
                    <button onClick={() => { setMobileMenuOpen(false); setActiveView(portalView); }} className="btn-navy justify-center w-full">
                      <UserCheck className="w-4 h-4" /> {portalLabel}
                    </button>
                    <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="w-full py-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl cursor-pointer">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setMobileMenuOpen(false); setAuthModal('login'); }} className="btn-ghost justify-center w-full">
                      Student Login
                    </button>
                    <button onClick={() => { setMobileMenuOpen(false); openEnrollment(); }} className="btn-primary justify-center w-full">
                      Enroll Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 pt-2 text-xs font-bold text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-brand-orange" /> {SITE.phoneDisplay}
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
