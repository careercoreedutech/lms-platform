import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import Highlight from './ui/Highlight';

/*
 * "Inside your dashboard" — the interactive product preview.
 * The dashboard starts tilted back in 3D and straightens as it scrolls into view.
 */
export default function DashboardPreview() {
  const [selectedFormat, setSelectedFormat] = useState('Live');
  const skillCount = 25;
  const [courseIndex, setCourseIndex] = useState(0);
  const [assessmentChecked, setAssessmentChecked] = useState(true);
  const [selectedCertMode, setSelectedCertMode] = useState('Honors');
  const [curveHeight, setCurveHeight] = useState(14);
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [32, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, 0]);

  const courses = [
    { name: 'Full Stack Web Dev', primary: '#0A317B', secondary: '#1A9C9B', category: 'Software' },
    { name: 'AI & Data Science', primary: '#1A9C9B', secondary: '#FA9C16', category: 'AI/ML' },
    { name: 'Cloud & DevOps', primary: '#FA9C16', secondary: '#0A317B', category: 'Cloud' },
    { name: 'UI/UX Design', primary: '#0A317B', secondary: '#FA9C16', category: 'Design' },
  ];
  const currentCourse = courses[courseIndex];
  const borderRadiusVal = '24px';

  return (
    <section id="dashboard" ref={ref} className="relative py-20 sm:py-28 bg-white overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-slate-50 to-transparent" />
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <span className="eyebrow mb-5"><LayoutDashboard className="w-3.5 h-3.5 text-brand-teal" /> Student dashboard</span>
          <h2 className="section-title">Your progress, <Highlight>always in view</Highlight></h2>
          <p className="section-lead">Track skills, lessons, mentor reviews and career readiness in one place. Click around — it’s interactive.</p>
        </div>
        <div style={{ perspective: '1600px' }}>
          <motion.div style={{ rotateX, scale, y, transformOrigin: 'center top' }}>
        {/* ── Product preview composition ── */}
        <div className="relative w-full max-w-6xl mx-auto pt-2 md:pt-6 pb-4 md:pb-12 md:min-h-[560px] flex items-center justify-center">

          {/* Growth curve (top-left) */}
          <motion.button
            type="button"
            aria-label="Toggle growth curve"
            animate={{ y: [0, -8, 0], rotate: [-6, -4, -6] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06, rotate: -2 }}
            className="hidden xl:flex absolute top-0 -left-10 z-20 w-52 h-36 bg-brand-orange rounded-3xl p-3 shadow-3d-orange ring-2 ring-white/60 cursor-pointer"
            onClick={() => setCurveHeight(curveHeight === 14 ? 26 : 14)}
          >
            <div className="w-full h-full rounded-2xl border border-white/30 p-2 relative overflow-hidden flex items-center justify-center">
              <div className="absolute top-1.5 left-2.5 text-[10px] font-mono font-bold text-white/95">Learning growth curve</div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:16px_16px]" />
              <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 100 60">
                <path d={`M 10 48 Q 50 42 90 ${curveHeight}`} fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="10" cy="48" r="4.5" fill="white" stroke="#FA9C16" strokeWidth="2" />
                <circle cx="50" cy="42" r="4" fill="white" stroke="#FA9C16" strokeWidth="2" />
                <circle cx="90" cy={curveHeight} r="5" fill="white" stroke="#FA9C16" strokeWidth="2.5" />
              </svg>
            </div>
          </motion.button>

          {/* Skill verification (mid-left) */}
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [-2, 1, -2] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
            className="hidden xl:block absolute top-56 -left-12 z-30 bg-brand-navy text-white p-3.5 rounded-2xl shadow-3d-navy ring-2 ring-white/60 space-y-2 w-52"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-wide">Skill verification</span>
              <span className="text-[9px] font-mono bg-brand-teal px-1.5 py-0.5 rounded font-bold">
                {assessmentChecked ? 'Verified ✓' : 'Pending'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAssessmentChecked(!assessmentChecked)}
              className="w-full flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center border border-white ${assessmentChecked ? 'bg-white text-brand-navy' : ''}`}>
                {assessmentChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
              <span>Coding &amp; aptitude</span>
            </button>
          </motion.div>

          {/* Track switcher (bottom-left) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 1.5 }}
            className="hidden md:flex absolute bottom-16 left-2 lg:left-6 xl:left-0 z-30 bg-brand-teal text-white px-3 py-2.5 rounded-2xl shadow-3d-teal ring-2 ring-white/60 items-center justify-between gap-2 font-extrabold w-60"
          >
            <button type="button" aria-label="Previous track" onClick={() => setCourseIndex((courseIndex - 1 + courses.length) % courses.length)} className="p-1 hover:bg-white/20 rounded-lg cursor-pointer">
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
            <span className="text-xs tracking-wide text-center">{currentCourse.name}</span>
            <button type="button" aria-label="Next track" onClick={() => setCourseIndex((courseIndex + 1) % courses.length)} className="p-1 hover:bg-white/20 rounded-lg cursor-pointer">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>

          {/* Learning mode (top-right) */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [5, 3, 5] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 0.2 }}
            className="hidden md:block absolute top-0 right-0 xl:-right-10 z-30 bg-brand-teal p-3.5 rounded-3xl shadow-3d-teal ring-2 ring-white/60 w-56 text-white"
          >
            <span className="text-xs font-extrabold block mb-2 tracking-wide">Learning mode</span>
            <div className="grid grid-cols-2 gap-1.5 font-bold text-xs">
              {['Live', 'Self-Paced', 'Mentor', 'Projects'].map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`py-1.5 px-2 rounded-xl border border-white/20 transition-all cursor-pointer ${
                    selectedFormat === fmt ? 'bg-brand-navy text-white shadow-md' : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Certification mode (bottom-right) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5.8, ease: 'easeInOut', delay: 0.4 }}
            className="hidden lg:block absolute bottom-6 right-0 xl:-right-10 z-30 bg-brand-orange text-white p-3.5 rounded-2xl shadow-3d-orange ring-2 ring-white/60 w-48"
          >
            <span className="text-xs font-extrabold block mb-2 tracking-wide">Certification</span>
            <div className="flex gap-2 text-xs font-bold">
              {['Standard', 'Honors'].map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setSelectedCertMode(mode)}
                  className={`flex-1 p-2 rounded-xl border border-white/20 flex flex-col items-center gap-1 transition-all cursor-pointer ${selectedCertMode === mode ? 'bg-brand-navy shadow-md' : 'bg-white/20'}`}
                >
                  <span className={`w-4 h-4 border-2 border-current ${mode === 'Honors' ? 'rounded-full' : ''}`} />
                  <span>{mode}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* CENTRAL CAREERCORE DASHBOARD CARD */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ borderRadius: borderRadiusVal }}
            className="w-full max-w-3xl bg-white text-brand-navy p-5 sm:p-6 shadow-[0_40px_80px_-24px_rgba(10,49,123,0.35)] ring-1 ring-slate-200 z-10 relative space-y-6"
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
              <div className="sm:col-span-4 space-y-2 sm:border-l border-gray-100 sm:pl-4 font-sans">
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
                  className={`p-3.5 rounded-2xl ${card.bg} space-y-1 transition-all duration-300`}
                  {...(i === 0 ? { style: { backgroundColor: currentCourse.primary, color: '#fff' } } : {})}
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

          </motion.div>
        </div>
      </div>
    </section>
  );
}
