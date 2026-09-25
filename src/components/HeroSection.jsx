import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  X, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Briefcase,
  Star
} from 'lucide-react';
import BottomFlowBar from './BottomFlowBar';
import { useLms } from '../context/LmsContext';

export default function HeroSection() {
  const { openEnrollment, setAuthModal } = useLms();
  const [selectedFormat, setSelectedFormat] = useState('Live'); // 'Live' | 'Self-Paced' | 'Mentor' | 'Projects'
  const [skillCount, setSkillCount] = useState(25);
  const [courseIndex, setCourseIndex] = useState(0);
  const [assessmentChecked, setAssessmentChecked] = useState(true);
  const [darkModeActive, setDarkModeActive] = useState(false);
  const [selectedCertMode, setSelectedCertMode] = useState('Honors'); // 'Standard' | 'Honors'
  const [chatOpen, setChatOpen] = useState(true);
  const [curveHeight, setCurveHeight] = useState(14);

  const courses = [
    { name: 'Full Stack Web Dev', primary: '#0A317B', secondary: '#1A9C9B', category: 'Software' },
    { name: 'AI & Data Science', primary: '#1A9C9B', secondary: '#FA9C16', category: 'AI/ML' },
    { name: 'Cloud & DevOps', primary: '#FA9C16', secondary: '#0A317B', category: 'Cloud' },
    { name: 'UI/UX Design', primary: '#0A317B', secondary: '#FA9C16', category: 'Design' },
  ];

  const currentCourse = courses[courseIndex];

  const formatFamilies = {
    Live: 'Inter, sans-serif',
    'Self-Paced': 'Georgia, serif',
    Mentor: '"Fragment Mono", monospace',
    Projects: 'Hepta Slab, serif'
  };

  const borderRadiusVal = selectedCertMode === 'Standard' ? '4px' : '20px';

  return (
    <section className={`relative pt-28 pb-20 transition-colors duration-500 overflow-hidden min-h-[90vh] ${
      darkModeActive ? 'bg-[#06122b] text-white' : 'bg-white text-[#0A317B]'
    }`}>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Headline Banner */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          
          {/* Top Pill Micro-Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-bold mb-5 shadow-2xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#0A317B] font-extrabold">CareerCore 2.0</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Next-Gen Tech Cohorts Open</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FA9C16]" />
          </motion.div>

          {/* Main H1 Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#0A317B]"
          >
            Empowering your career, <br />
            <span className="bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16] bg-clip-text text-transparent">
              fully accelerated
            </span>
          </motion.h1>

          {/* Subtitle directly beneath title */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            CareerCore Edutech is the premier learning ecosystem for ambitious students and professionals. Master in-demand industry skills, build real-world capstone projects, and land high-growth tech & business careers.
          </motion.p>

          {/* Dual Action Hero CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              onClick={() => openEnrollment ? openEnrollment() : setAuthModal('enroll')}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#FA9C16] to-[#f58d00] hover:from-[#f58d00] hover:to-[#cb7702] text-white font-extrabold text-sm shadow-lg hover:shadow-orange-500/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer group"
            >
              <span>Explore Programs & Enroll</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <a
              href="#features"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0A317B] font-bold text-sm border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#1A9C9B]" />
              <span>Browse Curriculum</span>
            </a>
          </motion.div>

          {/* Lottie People Animation Flow Row with Title */}
          <div className="mt-8 pt-5 border-t border-slate-100/80">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Continuous Skill & Career Progression Track
            </p>
            <BottomFlowBar />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN 3D FLOATING TOKEN COMPOSITION CONTAINER */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-6xl mx-auto pt-4 pb-12 min-h-[660px] flex items-center justify-center">

          {/* FLOATING 3D WIDGET 1: Top-Left Orange Curve Card (Upward Growth Curve) */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-6, -4, -6] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            whileHover={{ scale: 1.08, rotate: -2, zIndex: 40 }}
            className="hidden md:flex absolute top-2 left-2 sm:left-6 z-20 w-44 sm:w-56 h-32 sm:h-40 bg-[#FA9C16] rounded-3xl p-3 shadow-3d-orange border-2 border-white/60 cursor-pointer flex-col justify-between"
            onClick={() => setCurveHeight(curveHeight === 14 ? 26 : 14)}
          >
            <div className="w-full h-full bg-[#FA9C16] rounded-2xl border border-white/30 p-2 relative overflow-hidden flex items-center justify-center">
              <div className="absolute top-1 left-2 text-[9px] font-mono font-bold text-white/90">
                Learning Growth Curve 📈
              </div>

              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 100 60">
                <path
                  d={`M 10 48 Q 50 42 90 ${curveHeight}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="48" r="4.5" fill="white" stroke="#FA9C16" strokeWidth="2" />
                <circle cx="50" cy="42" r="4" fill="white" stroke="#FA9C16" strokeWidth="2" />
                <circle cx="90" cy={curveHeight} r="5" fill="white" stroke="#FA9C16" strokeWidth="2.5" />
              </svg>
            </div>
          </motion.div>

          {/* FLOATING 3D WIDGET 2: Mid-Left Deep Navy Skill Assessment Badge */}
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [-2, 1, -2] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
            whileHover={{ scale: 1.08, zIndex: 40 }}
            className="hidden lg:block absolute top-44 left-0 sm:left-10 z-30 bg-[#0A317B] text-white p-3.5 rounded-2xl shadow-3d-navy border-2 border-white/60 cursor-pointer space-y-1.5 w-48"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-wide">Skill Verification</span>
              <span className="text-[9px] font-mono bg-[#1A9C9B] px-1.5 py-0.5 rounded font-bold text-white">
                {assessmentChecked ? 'Verified ✓' : 'Pending'}
              </span>
            </div>
            
            <div 
              onClick={() => setAssessmentChecked(!assessmentChecked)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-2.5 py-1.5 rounded-xl text-xs font-bold"
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center border border-white transition-all ${assessmentChecked ? 'bg-white text-[#0A317B]' : ''}`}>
                {assessmentChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Coding & Aptitude</span>
            </div>
          </motion.div>

          {/* FLOATING 3D WIDGET 3: Teal Mastered Skills Pill */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1 }}
            whileHover={{ scale: 1.08, zIndex: 40 }}
            className="hidden md:flex absolute top-80 left-4 sm:left-14 z-30 bg-[#1A9C9B] text-white px-4 py-2.5 rounded-2xl shadow-3d-teal border-2 border-white/60 items-center justify-between gap-3 font-extrabold text-xs w-52"
          >
            <button 
              onClick={() => setSkillCount(Math.max(5, skillCount - 1))}
              className="p-1 hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
            <span>{skillCount} Skills Mastered</span>
            <button 
              onClick={() => setSkillCount(skillCount + 1)}
              className="p-1 hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>

          {/* FLOATING 3D WIDGET 4: Orange Course Slider */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 1.5 }}
            whileHover={{ scale: 1.08, zIndex: 40 }}
            className="hidden md:flex absolute bottom-14 left-8 sm:left-20 z-30 bg-[#FA9C16] text-white px-5 py-3 rounded-2xl shadow-3d-orange border-2 border-white/60 items-center justify-between gap-4 font-extrabold text-sm w-60"
          >
            <button 
              onClick={() => setCourseIndex((courseIndex - 1 + courses.length) % courses.length)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
            <span className="tracking-wide text-xs">{currentCourse.name}</span>
            <button 
              onClick={() => setCourseIndex((courseIndex + 1) % courses.length)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>

          {/* Teal Cube Accent */}
          <motion.div 
            animate={{ rotate: [-12, -8, -12] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="hidden md:block absolute bottom-4 left-4 sm:left-8 z-20 w-12 h-12 bg-[#1A9C9B] rounded-2xl shadow-lg border-2 border-white/60" 
          />

          {/* FLOATING 3D WIDGET 5: Top-Right Teal Course Format Card */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [6, 4, 6] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.2 }}
            whileHover={{ scale: 1.08, rotate: 2, zIndex: 40 }}
            className="hidden md:block absolute top-2 right-12 sm:right-56 z-30 bg-[#1A9C9B] p-3.5 rounded-3xl shadow-3d-teal border-2 border-white/60 w-56 text-white"
          >
            <span className="text-xs font-extrabold block mb-2 tracking-wide">Learning Mode</span>
            <div className="grid grid-cols-2 gap-1.5 font-bold text-xs">
              {['Live', 'Self-Paced', 'Mentor', 'Projects'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`py-1.5 px-3 rounded-xl border border-white/20 transition-all ${
                    selectedFormat === fmt ? 'bg-[#0A317B] text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FLOATING 3D WIDGET 6: Far-Right Navy Student Record Editor Window */}
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [4, 2, 4] }}
            transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 0.8 }}
            whileHover={{ scale: 1.05, zIndex: 40 }}
            className="absolute top-20 right-0 sm:right-2 z-20 w-64 sm:w-72 bg-[#0A317B] text-[#1A9C9B] p-4 rounded-2xl shadow-2xl border-2 border-blue-900/50 font-mono text-[11px] leading-relaxed hidden lg:block"
          >
            <div className="flex items-center justify-between border-b border-blue-800/60 pb-2 mb-2 text-white">
              <span className="text-[10px] font-bold">student.career.json</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FA9C16]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#1A9C9B]" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
            </div>
            <pre className="overflow-x-auto text-[#ffffff] text-[10px]">
{`{
  "student": {
    "program": "Full Stack Dev",
    "status": "Job-Ready"
  },
  "modules": [
    "React.js",
    "Node.js",
    "System Design"
  ],
  "career": {
    "mockInterviews": 5,
    "certified": true
  }
}`}
            </pre>
          </motion.div>

          {/* FLOATING 3D WIDGET 7: Orange Study Toggle Switch */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.2 }}
            whileHover={{ scale: 1.15, zIndex: 40 }}
            onClick={() => setDarkModeActive(!darkModeActive)}
            className="hidden md:flex absolute top-48 right-36 sm:right-64 z-30 bg-[#FA9C16] p-2 rounded-2xl shadow-3d-orange border-2 border-white/60 cursor-pointer items-center justify-between w-20"
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform duration-300 ${darkModeActive ? 'translate-x-9 bg-[#0A317B] text-white' : 'bg-white text-[#0A317B]'}`}>
              {darkModeActive ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
          </motion.div>

          {/* FLOATING 3D WIDGET 8: Orange Certificate Mode Card */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut", delay: 0.4 }}
            whileHover={{ scale: 1.08, zIndex: 40 }}
            className="hidden lg:block absolute bottom-12 right-6 sm:right-28 z-30 bg-[#FA9C16] text-white p-3.5 rounded-2xl shadow-3d-orange border-2 border-white/60 w-48"
          >
            <span className="text-xs font-extrabold block mb-2 tracking-wide">Certification Mode</span>
            <div className="flex gap-2 text-xs font-bold">
              <button
                onClick={() => setSelectedCertMode('Standard')}
                className={`flex-1 p-2 rounded-xl border border-white/20 flex flex-col items-center gap-1 transition-all ${selectedCertMode === 'Standard' ? 'bg-[#0A317B] text-white shadow-md' : 'bg-white/20'}`}
              >
                <div className="w-4 h-4 border-2 border-current" />
                <span>Standard</span>
              </button>

              <button
                onClick={() => setSelectedCertMode('Honors')}
                className={`flex-1 p-2 rounded-xl border border-white/20 flex flex-col items-center gap-1 transition-all ${selectedCertMode === 'Honors' ? 'bg-[#0A317B] text-white shadow-md' : 'bg-white/20'}`}
              >
                <div className="w-4 h-4 rounded-full border-2 border-current" />
                <span>Honors</span>
              </button>
            </div>
          </motion.div>


          {/* ========================================================================= */}
          {/* CENTRAL CAREERCORE DASHBOARD CARD */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              fontFamily: formatFamilies[selectedFormat],
              borderRadius: borderRadiusVal
            }}
            className="w-full max-w-3xl bg-white text-[#0A317B] p-6 shadow-2xl border border-gray-200/90 z-10 relative space-y-6 transition-all duration-300"
          >
            {/* Top Row: Skill Progress Chart | Donut Chart | Learning Track */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center border-b border-gray-100 pb-6">
              
              {/* Distribution Bar Chart */}
              <div className="sm:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Student Skill Progress
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0A317B]">
                    {currentCourse.name}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-gray-600 font-bold px-1">
                  {courses.map((c, i) => (
                    <span 
                      key={i} 
                      className={`cursor-pointer ${courseIndex === i ? 'text-[#0A317B] font-extrabold underline' : ''}`}
                      onClick={() => setCourseIndex(i)}
                    >
                      {c.category}
                    </span>
                  ))}
                </div>

                {/* Stacked Bars */}
                <div className="grid grid-cols-4 gap-3 h-28 items-end bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div 
                    className="w-full rounded-md transition-all duration-500" 
                    style={{ 
                      backgroundColor: currentCourse.primary, 
                      height: `${Math.min(95, skillCount * 3.5)}%` 
                    }} 
                  />
                  <div 
                    className="w-full rounded-md transition-all duration-500 opacity-80" 
                    style={{ 
                      backgroundColor: currentCourse.primary, 
                      height: `${Math.min(85, skillCount * 2.8)}%` 
                    }} 
                  />
                  <div 
                    className="w-full rounded-md transition-all duration-500 opacity-60" 
                    style={{ 
                      backgroundColor: currentCourse.primary, 
                      height: `${Math.min(100, skillCount * 3.8)}%` 
                    }} 
                  />
                  <div 
                    className="w-full rounded-md transition-all duration-500 opacity-40" 
                    style={{ 
                      backgroundColor: currentCourse.primary, 
                      height: `${Math.min(65, skillCount * 2.2)}%` 
                    }} 
                  />
                </div>

                <div className="flex gap-2 text-[10px] text-gray-500 flex-wrap pt-1 font-sans">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ backgroundColor: currentCourse.primary }} /> Web Dev</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#1A9C9B]" /> AI & Data</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#FA9C16]" /> DevOps</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-300" /> UI/UX</span>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="sm:col-span-3 flex flex-col items-center text-center space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Course Completion
                </span>
                
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.8"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={currentCourse.primary}
                      strokeWidth="3.8"
                      strokeDasharray={`${Math.min(95, skillCount * 3.5)}, 100`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-sm font-extrabold text-[#0A317B]">{skillCount * 4 + 4}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-bold">Lessons</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 w-full space-y-0.5 font-sans">
                  <div className="flex justify-between"><span>Completed</span><span className="font-bold">{skillCount * 3}</span></div>
                  <div className="flex justify-between"><span>In Progress</span><span className="font-bold">{skillCount}</span></div>
                  <div className="flex justify-between"><span>Upcoming</span><span className="font-bold">4</span></div>
                </div>
              </div>

              {/* Learning Track Panel */}
              <div className="sm:col-span-4 space-y-2 border-l border-gray-100 pl-4 font-sans">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Track Overview
                </span>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-semibold text-gray-700">Course Track</span>
                    <span className="text-[10px] font-bold text-[#0A317B]">{currentCourse.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-semibold text-gray-700">Learning Format</span>
                    <span className="text-[10px] font-bold text-[#1A9C9B]">{selectedFormat}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-semibold text-gray-700">Certification</span>
                    <span className="text-[10px] font-bold text-[#FA9C16]">{selectedCertMode}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-semibold text-gray-700">Job Guarantee</span>
                    <span className="text-[10px] font-bold text-emerald-600">Active ✓</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: 4 EdTech Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { bg: 'text-white', primaryColor: currentCourse.primary, title: 'Real-World Projects', desc: 'Build production-ready apps' },
                { bg: 'bg-[#1A9C9B]/10 text-[#0A317B]', primaryColor: '#1A9C9B', title: '1-on-1 Mentorship', desc: 'Guidance from top engineers' },
                { bg: 'bg-[#FA9C16]/15 text-[#0A317B]', primaryColor: '#FA9C16', title: 'Resume Compiler', desc: 'ATS-optimized portfolio' },
                { bg: 'bg-blue-50 text-[#0A317B]', primaryColor: '#0A317B', title: 'Career Guidance', desc: '1-on-1 interview prep' },
              ].map((card, i) => (
                <motion.div 
                  key={i} 
                  style={{ borderRadius: selectedCertMode === 'Standard' ? '4px' : '14px' }}
                  className={`p-3.5 ${card.bg} space-y-1 shadow-sm transition-all duration-300`}
                  {...(i === 0 ? { style: { backgroundColor: currentCourse.primary, color: '#fff', borderRadius: selectedCertMode === 'Standard' ? '4px' : '14px' } } : {})}
                >
                  <span className="text-[10px] font-mono opacity-80 uppercase block font-bold">CAREERCORE</span>
                  <h6 className="text-xs font-extrabold leading-snug">{card.title}</h6>
                  <p className="text-[10px] opacity-80 leading-tight">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </motion.div>



        </div>

      </div>
    </section>
  );
}
