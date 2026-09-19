import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, BookOpen, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function EnrollmentModal() {
  const { authModal, setAuthModal, registerStudent, courses, selectedEnrollCourse } = useLms();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    course: selectedEnrollCourse || courses[0]?.title || 'Full Stack Web Dev'
  });

  useEffect(() => {
    if (selectedEnrollCourse) {
      setFormData(prev => ({ ...prev, course: selectedEnrollCourse }));
    }
  }, [selectedEnrollCourse, authModal]);

  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (authModal !== 'enroll') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const res = registerStudent(formData);
    if (res.success) {
      setStatusMessage(res.message);
      setErrorMsg(null);
    }
  };

  const coursesList = Array.from(new Set([
    ...(formData.course ? [formData.course] : []),
    ...courses.map(c => c.title)
  ]));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Top Multi-color Gradient Accent */}
          <div className="h-2 bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16]" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="CareerCore Logo" className="h-7 w-auto" />
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A317B]">Student Registration</h3>
                  <p className="text-xs text-gray-500">Create an account to enroll in CareerCore Edutech</p>
                </div>
              </div>
              <button 
                onClick={() => setAuthModal(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-[#FA9C16] flex items-center justify-center mx-auto border border-[#FA9C16]/30 shadow-inner">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>
                
                <h4 className="text-xl font-extrabold text-[#0A317B]">Registration Received!</h4>
                
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                  {statusMessage}
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-1 text-xs text-gray-600 font-mono">
                  <div className="flex justify-between"><span>Applicant:</span><span className="font-bold text-[#0A317B]">{formData.name}</span></div>
                  <div className="flex justify-between"><span>Selected Course:</span><span className="font-bold text-[#1A9C9B]">{formData.course}</span></div>
                  <div className="flex justify-between"><span>Status:</span><span className="font-bold text-[#FA9C16]">PENDING ADMIN APPROVAL</span></div>
                </div>

                <button
                  onClick={() => setAuthModal('login')}
                  className="w-full py-3 rounded-xl bg-[#0A317B] text-white font-extrabold text-xs shadow-md hover:bg-[#061e4f] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Go to Student Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      placeholder="e.g. johndoe"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Select Course Program</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <select
                      value={formData.course}
                      onChange={e => setFormData({ ...formData, course: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-bold text-[#0A317B] bg-white cursor-pointer"
                    >
                      {coursesList.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Submit Account Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center pt-2 text-xs text-gray-500">
                  Already registered?{' '}
                  <button 
                    type="button"
                    onClick={() => setAuthModal('login')} 
                    className="text-[#0A317B] font-bold hover:underline cursor-pointer"
                  >
                    Student Login
                  </button>
                </div>

              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
