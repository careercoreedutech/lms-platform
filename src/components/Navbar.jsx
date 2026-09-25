import React, { useState, useEffect, useRef } from 'react';
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
  Award, 
  Briefcase, 
  Bot, 
  Phone, 
  ShieldCheck, 
  Star,
  ExternalLink,
  Laptop,
  Layers
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const dropdownRef = useRef(null);

  const { 
    setAuthModal, 
    currentUser, 
    activeView, 
    setActiveView, 
    logout, 
    courses = [], 
    openEnrollment 
  } = useLms();

  useEffect(() => {
    let lastScrolled = typeof window !== 'undefined' ? window.scrollY > 30 : false;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCoursesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPortalLabel = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'ADMIN') return 'Admin Console';
    if (currentUser.role === 'MENTOR' || currentUser.role === 'TEACHER') return 'Mentor Studio';
    return 'My Student Portal';
  };

  const getPortalView = () => {
    if (!currentUser) return 'landing';
    if (currentUser.role === 'ADMIN') return 'admin';
    if (currentUser.role === 'MENTOR' || currentUser.role === 'TEACHER') return 'mentor';
    return 'portal';
  };

  const courseIcons = {
    'Full Stack Web Dev': { bg: 'bg-blue-50 text-[#0A317B] border-blue-200', tag: 'High Demand' },
    'AI & Data Science': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', tag: 'Trending' },
    'Cloud & DevOps': { bg: 'bg-amber-50 text-amber-700 border-amber-200', tag: 'Enterprise' },
    'Business Analyst': { bg: 'bg-purple-50 text-purple-700 border-purple-200', tag: 'Most Popular' },
    'UI/UX Design': { bg: 'bg-pink-50 text-pink-700 border-pink-200', tag: 'Creative Tech' },
  };

  return (
    <header className="fixed z-50 left-0 right-0 top-0 w-full transition-all duration-300">
      
      {/* ── Top Announcement Ribbon (Hidden on scroll or if dismissed) ──────── */}
      <AnimatePresence>
        {announcementVisible && !scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-gradient-to-r from-[#0A317B] via-[#0D419D] to-[#1A9C9B] text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium overflow-hidden border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#FA9C16] text-[#0A317B] font-black text-[9px] shrink-0">
                  ★
                </span>
                <span className="font-bold tracking-wide">
                  Admissions Open for 2026 Batches
                </span>
                <span className="hidden md:inline text-white/70">•</span>
                <span className="hidden md:inline text-white/90">
                  100% Practical Capstone Projects & Dedicated Career Mentorship
                </span>
                <button
                  onClick={() => openEnrollment()}
                  className="ml-2 underline font-extrabold text-[#FA9C16] hover:text-amber-200 cursor-pointer transition-colors"
                >
                  Apply Now &rarr;
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <a
                  href="tel:+918341876728"
                  className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#FA9C16]" />
                  <span>Call: +91 83418 76728</span>
                </a>
                <button
                  onClick={() => setAnnouncementVisible(false)}
                  className="p-0.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Dismiss banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Navigation Bar ────────────────────────────────────────────── */}
      <div 
        className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          scrolled 
            ? 'mt-3 w-[94%] max-w-6xl bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(10,49,123,0.14)] border border-slate-200/90 rounded-2xl py-3 px-5 sm:px-8' 
            : 'w-full bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5 px-6 sm:px-8 lg:px-12'
        }`}
      >
        <div className="w-full flex items-center justify-between">
          
          {/* Logo Brand with Micro-Badge */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img 
                src="/logo.png" 
                alt="CareerCore Edutech Logo" 
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-[#0A317B] border border-blue-200/70 tracking-wide">
                <Sparkles className="w-2.5 h-2.5 text-[#FA9C16]" />
                <span>Edutech Ecosystem</span>
              </span>
            </button>
          </div>

          {/* Center Navigation Links with Mega Dropdown */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-[13px] font-bold text-slate-700">
            
            {/* Courses Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  coursesDropdownOpen ? 'bg-blue-50/80 text-[#0A317B]' : 'hover:bg-slate-50 hover:text-[#0A317B]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#1A9C9B]" />
                <span>Courses & Programs</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${coursesDropdownOpen ? 'rotate-180 text-[#0A317B]' : 'text-slate-400'}`} />
              </button>

              {/* Mega Dropdown Menu */}
              <AnimatePresence>
                {coursesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setCoursesDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-3xl shadow-[0_25px_60px_rgba(10,49,123,0.18)] border border-slate-200/90 p-4 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                      <div>
                        <p className="text-xs font-black text-[#0A317B] uppercase tracking-wider">Explore Career Tracks</p>
                        <p className="text-[11px] text-slate-500">Live projects, mentor feedback & verified certification</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        {courses.length} Tracks Live
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {courses.map((course) => {
                        const iconData = courseIcons[course.title] || { bg: 'bg-slate-50 text-slate-700 border-slate-200', tag: 'Certificate' };
                        return (
                          <div 
                            key={course.id}
                            onClick={() => {
                              openEnrollment(course.title);
                              setCoursesDropdownOpen(false);
                            }}
                            className="group p-2.5 rounded-2xl hover:bg-slate-50/90 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl ${iconData.bg} border flex items-center justify-center font-bold text-xs shrink-0`}>
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0A317B] transition-colors">
                                  {course.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                  {course.duration || '6-8 Weeks'} • {course.price || 'Flexible EMI'}
                                </p>
                              </div>
                            </div>

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-[#FA9C16] group-hover:text-white transition-colors">
                              {iconData.tag}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Curriculum / Bento Features */}
            <a 
              href="#features" 
              className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#0A317B] transition-colors"
            >
              Curriculum
            </a>

            {/* Business Analyst Spotlight */}
            <a 
              href="#features" 
              className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#0A317B] transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#FA9C16]" />
              <span>Specializations</span>
            </a>

          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 pl-3 rounded-2xl border border-slate-200">
                {/* User avatar / initial */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0A317B] to-[#1A9C9B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {currentUser.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-[11px] font-black text-slate-800 leading-tight">
                      {currentUser.name?.split(' ')[0] || 'Member'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {currentUser.role || 'STUDENT'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView(getPortalView())}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0A317B] hover:bg-[#061e4f] text-white font-extrabold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#1A9C9B]" />
                  <span>{getPortalLabel()}</span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Student Login Trigger */}
                <button
                  onClick={() => setAuthModal('login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#0A317B] hover:text-[#1A9C9B] bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Student Login</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Primary Enroll CTA */}
                <button
                  onClick={() => setAuthModal('enroll')}
                  className="relative group overflow-hidden px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-[#FA9C16] to-[#f58d00] hover:from-[#f58d00] hover:to-[#cb7702] rounded-xl shadow-md hover:shadow-orange-500/25 transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span className="relative z-10">Enroll Now</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* ── Mobile Navigation Drawer ──────────────────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-slate-100 mt-3 pt-4 pb-3 space-y-3"
            >
              <div className="px-2 pb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Programs</p>
                <div className="space-y-1">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openEnrollment(course.title);
                      }}
                      className="w-full text-left py-2 px-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-[#1A9C9B]" />
                        <span>{course.title}</span>
                      </span>
                      <span className="text-[10px] text-[#FA9C16] font-bold">Enroll &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2 px-2 space-y-1 text-xs font-bold text-slate-700">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block py-2 px-3 hover:bg-slate-50 rounded-xl"
                >
                  Curriculum & Specializations
                </a>
              </div>

              {/* Action Buttons in Mobile Drawer */}
              <div className="pt-3 border-t border-slate-100 px-2 flex flex-col gap-2">
                {currentUser ? (
                  <>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); setActiveView(getPortalView()); }}
                      className="w-full text-center py-3 text-xs font-bold text-white bg-[#0A317B] rounded-xl flex items-center justify-center gap-2 shadow-xs"
                    >
                      <UserCheck className="w-4 h-4 text-[#1A9C9B]" />
                      <span>{getPortalLabel()}</span>
                    </button>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); logout(); }}
                      className="w-full text-center py-2.5 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); setAuthModal('login'); }}
                      className="w-full text-center py-2.5 text-xs font-bold text-[#0A317B] bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Student Login
                    </button>

                    <button 
                      onClick={() => { setMobileMenuOpen(false); setAuthModal('enroll'); }}
                      className="w-full text-center py-3 text-xs font-bold text-white bg-gradient-to-r from-[#FA9C16] to-[#f58d00] rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
