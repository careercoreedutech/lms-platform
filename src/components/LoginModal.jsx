import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, ArrowRight, ShieldCheck, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function LoginModal() {
  const { authModal, setAuthModal, loginStudent, loginTeacher, loginAdmin, users, setActiveView } = useLms();
  const [tab, setTab] = useState('student'); // 'student' | 'teacher' | 'admin'

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPendingAlert, setIsPendingAlert] = useState(false);

  useEffect(() => {
    if (authModal === 'adminLogin') {
      setTab('admin');
      setUsername('admin');
      setPassword('admin123');
    } else if (authModal === 'teacherLogin') {
      setTab('teacher');
      setUsername('teacher');
      setPassword('teacher123');
    } else if (authModal === 'login') {
      setTab('student');
    }
    setErrorMsg(null);
    setIsPendingAlert(false);
  }, [authModal]);

  if (authModal !== 'login' && authModal !== 'adminLogin' && authModal !== 'teacherLogin') return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsPendingAlert(false);

    if (tab === 'admin') {
      const res = loginAdmin(username, password);
      if (!res.success) setErrorMsg(res.message);
    } else if (tab === 'teacher') {
      const res = loginTeacher(username, password);
      if (!res.success) setErrorMsg(res.message);
    } else {
      const res = loginStudent(username, password);
      if (!res.success) {
        setErrorMsg(res.message);
        if (res.isPending) setIsPendingAlert(true);
      }
    }
  };

  const fillDemoStudent = () => {
    setTab('student');
    setUsername('johndoe');
    setPassword('password123');
    setErrorMsg(null);
    setIsPendingAlert(false);
  };

  const fillDemoTeacher = () => {
    setTab('teacher');
    setUsername('teacher');
    setPassword('teacher123');
    setErrorMsg(null);
    setIsPendingAlert(false);
  };

  const fillDemoAdmin = () => {
    setTab('admin');
    setUsername('admin');
    setPassword('admin123');
    setErrorMsg(null);
    setIsPendingAlert(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Top Accent Stripe */}
          <div className="h-2 bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16]" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="CareerCore Logo" className="h-7 w-auto" />
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0A317B]">
                    {tab === 'admin' ? 'Admin Control Panel' : tab === 'teacher' ? 'Teacher Course Studio' : 'Student Portal Login'}
                  </h3>
                  <p className="text-xs text-gray-500">Access your course dashboard</p>
                </div>
              </div>
              <button 
                onClick={() => setAuthModal(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-2xl mt-5 text-center">
              <button
                type="button"
                onClick={() => { setTab('student'); setErrorMsg(null); setIsPendingAlert(false); }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  tab === 'student' ? 'bg-[#0A317B] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => { setTab('teacher'); setErrorMsg(null); setIsPendingAlert(false); }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  tab === 'teacher' ? 'bg-[#1A9C9B] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Teacher
              </button>

              <button
                type="button"
                onClick={() => { setTab('admin'); setErrorMsg(null); setIsPendingAlert(false); }}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  tab === 'admin' ? 'bg-[#FA9C16] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Quick Fill Credentials Bar */}
            <div className="grid grid-cols-3 gap-1.5 mt-4 pt-1">
              <button
                type="button"
                onClick={fillDemoStudent}
                className="py-1.5 px-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0A317B] font-bold text-[10px] transition-all border border-blue-200 cursor-pointer text-center"
              >
                Student: johndoe
              </button>

              <button
                type="button"
                onClick={fillDemoTeacher}
                className="py-1.5 px-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#1A9C9B] font-bold text-[10px] transition-all border border-teal-200 cursor-pointer text-center"
              >
                Teacher: teacher
              </button>

              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-1.5 px-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#FA9C16] font-bold text-[10px] transition-all border border-amber-200 cursor-pointer text-center"
              >
                Admin: admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="mt-4 space-y-4">

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-950 text-xs font-semibold border border-amber-200 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <Clock className="w-4 h-4 text-[#FA9C16] shrink-0" />
                    <span>Login Status Notice:</span>
                  </div>
                  <p>{errorMsg}</p>

                  {isPendingAlert && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModal(null);
                        setActiveView('admin');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#FA9C16] text-white font-extrabold text-xs shadow-sm hover:bg-[#e0890f] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Open Admin Panel to Approve Student</span>
                    </button>
                  )}
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {tab === 'admin' ? 'Admin Username' : 'Username or Email'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={tab === 'admin' ? 'admin' : 'johndoe or john@example.com'}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    tab === 'admin' ? 'bg-[#FA9C16] hover:bg-[#e0890f]' : 'bg-[#0A317B] hover:bg-[#061e4f]'
                  }`}
                >
                  <span>{tab === 'admin' ? 'Access Admin Console' : 'Sign In To Student Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {tab === 'student' && (
                <div className="text-center pt-2 text-xs text-gray-500">
                  Need to register a new course?{' '}
                  <button 
                    type="button"
                    onClick={() => setAuthModal('enroll')} 
                    className="text-[#FA9C16] font-bold hover:underline cursor-pointer"
                  >
                    Enroll Now
                  </button>
                </div>
              )}

            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
