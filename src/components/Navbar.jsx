import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowRight, ShieldCheck, UserCheck, LogOut } from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setAuthModal, currentUser, activeView, setActiveView, logout } = useLms();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed z-50 left-0 right-0 mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform ${
        scrolled 
          ? 'top-5 w-[86%] max-w-4xl sm:max-w-5xl bg-white shadow-[0_16px_40px_rgba(10,49,123,0.12)] border border-gray-200/90 rounded-2xl sm:rounded-3xl py-4 sm:py-5 px-6 sm:px-8' 
          : 'top-0 w-full bg-white border-b border-gray-100 py-4 px-6 sm:px-8 lg:px-12 rounded-none shadow-none'
      }`}
    >
      <div className="w-full flex items-center justify-between">
        
        {/* Logo image from logo.png */}
        <button onClick={() => setActiveView('landing')} className="flex items-center gap-3 cursor-pointer">
          <img 
            src="/logo.png" 
            alt="CareerCore Edutech Logo" 
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 sm:gap-10 text-xs font-extrabold uppercase tracking-wider text-[#0A317B]">
          <a href="#features" className="hover:text-[#1A9C9B] transition-colors">
            COURSES
          </a>

          <a href="#features" className="hover:text-[#1A9C9B] transition-colors">
            PROGRAMS
          </a>

          <a href="#community" className="hover:text-[#1A9C9B] transition-colors">
            PLACEMENTS
          </a>

          <button 
            onClick={() => {
              if (currentUser?.role === 'TEACHER') {
                setActiveView('teacher');
              } else {
                setAuthModal('teacherLogin');
              }
            }} 
            className="hover:text-[#1A9C9B] transition-colors flex items-center gap-1 text-[11px] text-[#1A9C9B] font-bold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#1A9C9B]" />
            <span>TEACHER PORTAL</span>
          </button>

          <button 
            onClick={() => {
              if (currentUser?.role === 'ADMIN') {
                setActiveView('admin');
              } else {
                setAuthModal('adminLogin');
              }
            }} 
            className="hover:text-[#FA9C16] transition-colors flex items-center gap-1 text-[11px] text-[#FA9C16] font-bold cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMIN PANEL</span>
          </button>
        </nav>

        {/* Right Action */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView(currentUser.role === 'ADMIN' ? 'admin' : currentUser.role === 'TEACHER' ? 'teacher' : 'portal')}
                className="px-4 py-2 rounded-xl bg-blue-50 text-[#0A317B] font-extrabold text-xs border border-blue-200 hover:bg-blue-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#1A9C9B]" />
                <span>{currentUser.role === 'ADMIN' ? 'Admin Console' : currentUser.role === 'TEACHER' ? 'Teacher Studio' : 'My Student Portal'}</span>
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setAuthModal('login')}
                className="flex items-center gap-1 text-xs font-extrabold text-[#0A317B] hover:text-[#1A9C9B] cursor-pointer transition-colors"
              >
                <span>Student Login</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              <button
                onClick={() => setAuthModal('enroll')}
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#FA9C16] hover:bg-[#e0890f] rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 mt-3 pt-4 pb-2 space-y-3 text-sm font-bold text-[#0A317B]"
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 hover:bg-gray-50 rounded-lg">COURSES</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 hover:bg-gray-50 rounded-lg">PROGRAMS</a>
            <a href="#community" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 hover:bg-gray-50 rounded-lg">PLACEMENTS</a>
            <button 
              onClick={() => { setMobileMenuOpen(false); setAuthModal('adminLogin'); }}
              className="block w-full text-left py-1.5 px-2 text-[#FA9C16] hover:bg-amber-50 rounded-lg"
            >
              ADMIN PANEL
            </button>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button 
                onClick={() => { setMobileMenuOpen(false); setAuthModal('login'); }}
                className="w-full text-center py-2.5 text-xs font-bold text-[#0A317B] bg-gray-100 rounded-xl"
              >
                Student Login
              </button>

              <button 
                onClick={() => { setMobileMenuOpen(false); setAuthModal('enroll'); }}
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-[#FA9C16] rounded-xl"
              >
                Enroll Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
