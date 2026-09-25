import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Lock, BookOpen, CheckCircle2, Clock, ShieldCheck, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { useLms } from '../context/LmsContext';

// Helper to sanitize phone numbers:
// - Disallows '+' symbol and prevents typing or pasting it
// - Strips duplicate country codes (+91 or 91)
// - Strips leading 0 (trunk prefix)
// - Strictly enforces only numbers (0-9) and max 10 digits
const sanitizePhoneNumber = (raw) => {
  if (!raw) return '';
  let str = String(raw).trim();
  // Strip leading +91 or +
  if (str.startsWith('+91')) {
    str = str.slice(3);
  } else if (str.startsWith('+')) {
    str = str.replace(/^\++/, '');
  }
  // Strip non-digit characters
  let digits = str.replace(/\D/g, '');
  // If user pasted 12 digits starting with country code 91 (e.g. 917416777662)
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    // Leading 0 trunk prefix
    digits = digits.slice(1);
  }
  // Strict 10 digits max
  return digits.slice(0, 10);
};

const MONTHS = [
  { value: '01', name: 'January' },
  { value: '02', name: 'February' },
  { value: '03', name: 'March' },
  { value: '04', name: 'April' },
  { value: '05', name: 'May' },
  { value: '06', name: 'June' },
  { value: '07', name: 'July' },
  { value: '08', name: 'August' },
  { value: '09', name: 'September' },
  { value: '10', name: 'October' },
  { value: '11', name: 'November' },
  { value: '12', name: 'December' },
];

const currentYear = new Date().getFullYear();
const maxYear = currentYear - 10; // e.g. 2016 for students
const minYear = 1950;
const YEARS = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

const isLeapYear = (y) => {
  const year = parseInt(y, 10);
  if (!year) return false;
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getDaysInMonth = (monthVal, yearVal) => {
  if (!monthVal) return 31;
  const m = parseInt(monthVal, 10);
  if ([4, 6, 9, 11].includes(m)) return 30;
  if (m === 2) {
    return isLeapYear(yearVal) ? 29 : 28;
  }
  return 31;
};

export default function EnrollmentModal() {
  const { authModal, setAuthModal, registerStudent, courses, selectedEnrollCourse } = useLms();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    dobMonth: '',
    dobDate: '',
    dobYear: '',
    password: '',
    course: selectedEnrollCourse || courses[0]?.title || 'Full Stack Web Dev'
  });

  useEffect(() => {
    if (authModal === 'enroll') {
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        dobMonth: '',
        dobDate: '',
        dobYear: '',
        password: '',
        course: selectedEnrollCourse || courses[0]?.title || 'Full Stack Web Dev'
      });
      setStatusMessage(null);
      setErrorMsg(null);
    }
  }, [selectedEnrollCourse, authModal]);

  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (authModal !== 'enroll') return null;

  const purePhone = sanitizePhoneNumber(formData.phone);
  const isPhoneComplete = purePhone.length === 10;
  const isPhoneValid = isPhoneComplete && /^[6-9]/.test(purePhone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    // Phone validation
    if (!isPhoneValid) {
      if (purePhone.length !== 10) {
        setErrorMsg(`Mobile number must be exactly 10 digits (currently ${purePhone.length} digits).`);
      } else {
        setErrorMsg('Invalid mobile number. Indian mobile numbers must start with 6, 7, 8, or 9.');
      }
      return;
    }

    // DOB validation
    if (!formData.dobMonth || !formData.dobDate || !formData.dobYear) {
      setErrorMsg('Please select your complete Date of Birth (Month, Date, and Year).');
      return;
    }

    const monthObj = MONTHS.find(m => m.value === formData.dobMonth);
    const formattedDob = `${String(formData.dobDate).padStart(2, '0')} ${monthObj?.name || formData.dobMonth} ${formData.dobYear}`;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await registerStudent({
        ...formData,
        phone: purePhone,
        dob: formattedDob
      });
      if (res && res.success) {
        setStatusMessage(res.message);
      } else {
        setErrorMsg(res?.message || 'Could not complete registration. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
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
                  {formData.dobMonth && formData.dobDate && formData.dobYear && (
                    <div className="flex justify-between">
                      <span>Date of Birth:</span>
                      <span className="font-bold text-blue-700">
                        {String(formData.dobDate).padStart(2, '0')} {MONTHS.find(m => m.value === formData.dobMonth)?.name || formData.dobMonth} {formData.dobYear}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between"><span>Phone / WhatsApp:</span><span className="font-bold text-emerald-700">+91 {purePhone || formData.phone}</span></div>
                  <div className="flex justify-between"><span>Email:</span><span className="font-bold text-slate-700">{formData.email}</span></div>
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
              <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
                
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
                      name="student_fullname"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
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
                      name="new_student_username"
                      autoComplete="off"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Choose a username"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="student_email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#1A9C9B]" />
                      <span>Mobile Number (10 Digits)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    {formData.phone && (
                      <span className={`text-[11px] font-bold flex items-center gap-1 ${
                        isPhoneValid ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {isPhoneValid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Valid Mobile</span>
                          </>
                        ) : (
                          <span>{purePhone.length}/10 digits</span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 flex items-center gap-1 text-gray-500 text-xs font-bold pointer-events-none">
                      <span>+91</span>
                      <span className="text-gray-300">|</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="student_phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const sanitized = sanitizePhoneNumber(e.target.value);
                        setFormData({ ...formData, phone: sanitized });
                      }}
                      onKeyDown={(e) => {
                        // Prevent typing '+' or other non-numeric symbols
                        if (['+', '-', '.', 'e', 'E'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasteData = e.clipboardData?.getData('text') || '';
                        const sanitized = sanitizePhoneNumber(pasteData);
                        setFormData({ ...formData, phone: sanitized });
                      }}
                      placeholder="8341876728"
                      maxLength={10}
                      className={`w-full pl-14 pr-4 py-2.5 rounded-xl border ${
                        formData.phone && !isPhoneValid ? 'border-amber-400 bg-amber-50/20 focus:ring-amber-400' : 'border-gray-300 focus:ring-[#1A9C9B]'
                      } focus:ring-2 focus:outline-none text-xs font-medium`}
                      required
                    />
                  </div>
                  {formData.phone && !isPhoneValid && (
                    <p className="text-[11px] text-amber-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      {purePhone.length === 10 && !/^[6-9]/.test(purePhone) ? (
                        'Mobile number must start with 6, 7, 8, or 9'
                      ) : purePhone.length < 10 ? (
                        `Enter 10-digit mobile number (${10 - purePhone.length} more digits needed)`
                      ) : (
                        'Mobile number must be exactly 10 digits'
                      )}
                    </p>
                  )}
                </div>

                {/* Date of Birth (DOB) - 3 Dropdowns (Month, Date, Year) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1A9C9B]" />
                      <span>Date of Birth (DOB)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    {formData.dobMonth && formData.dobDate && formData.dobYear && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{String(formData.dobDate).padStart(2, '0')} {MONTHS.find(m => m.value === formData.dobMonth)?.name} {formData.dobYear}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Month Dropdown */}
                    <div>
                      <select
                        value={formData.dobMonth}
                        onChange={(e) => {
                          const newMonth = e.target.value;
                          const maxDays = getDaysInMonth(newMonth, formData.dobYear);
                          setFormData(prev => ({
                            ...prev,
                            dobMonth: newMonth,
                            dobDate: prev.dobDate && parseInt(prev.dobDate, 10) > maxDays ? String(maxDays) : prev.dobDate
                          }));
                        }}
                        className="w-full px-2.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-semibold text-gray-800 bg-white cursor-pointer"
                        required
                      >
                        <option value="" disabled>Month</option>
                        {MONTHS.map(m => (
                          <option key={m.value} value={m.value}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Dropdown */}
                    <div>
                      <select
                        value={formData.dobDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dobDate: e.target.value }))}
                        className="w-full px-2.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-semibold text-gray-800 bg-white cursor-pointer"
                        required
                      >
                        <option value="" disabled>Date</option>
                        {Array.from({ length: getDaysInMonth(formData.dobMonth, formData.dobYear) }, (_, i) => {
                          const day = i + 1;
                          return (
                            <option key={day} value={String(day)}>
                              {day}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Year Dropdown */}
                    <div>
                      <select
                        value={formData.dobYear}
                        onChange={(e) => {
                          const newYear = e.target.value;
                          const maxDays = getDaysInMonth(formData.dobMonth, newYear);
                          setFormData(prev => ({
                            ...prev,
                            dobYear: newYear,
                            dobDate: prev.dobDate && parseInt(prev.dobDate, 10) > maxDays ? String(maxDays) : prev.dobDate
                          }));
                        }}
                        className="w-full px-2.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-semibold text-gray-800 bg-white cursor-pointer"
                        required
                      >
                        <option value="" disabled>Year</option>
                        {YEARS.map(y => (
                          <option key={y} value={String(y)}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="new_student_password"
                      autoComplete="new-password"
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
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] disabled:opacity-60 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Account Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
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
