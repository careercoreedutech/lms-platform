import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  GraduationCap, 
  Award, 
  Quote, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function StudentFeedbackSection() {
  const { feedbacks = [], setActiveView, currentUser, setAuthModal } = useLms();
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filterTabs = [
    { key: 'ALL', label: 'All Reviews' },
    { key: 'Full Stack Web Dev', label: 'Full Stack' },
    { key: 'Business Analyst', label: 'Business Analyst' },
    { key: 'AI & Data Science', label: 'AI & Data Science' },
    { key: 'Cloud & DevOps', label: 'Cloud & DevOps' },
    { key: 'UI/UX Design', label: 'UI/UX Design' }
  ];

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (selectedFilter === 'ALL') return true;
    return fb.course?.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const averageRating = (
    feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / (feedbacks.length || 1)
  ).toFixed(1);

  return (
    <section id="student-reviews" className="py-24 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#1A9C9B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FA9C16]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold mb-4 shadow-2xs"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[#0A317B] font-extrabold">Student Wall of Love</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Verified Alumni Experiences</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-[#0A317B] tracking-tight"
          >
            What Our Students <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16] bg-clip-text text-transparent">
              Say About CareerCore
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Read authentic reviews and career milestones submitted directly by our students and graduates across all tech and business programs.
          </motion.p>
        </div>

        {/* Rating Metrics Strip */}
        <div className="max-w-4xl mx-auto mb-10 p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black text-amber-700 leading-none">{averageRating}</span>
              <div className="flex text-amber-400 scale-75 -mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Overall Satisfaction Score</p>
              <p className="text-[11px] text-slate-500 font-medium">Based on {feedbacks.length}+ verified student submissions</p>
            </div>
          </div>

          <div className="flex items-center gap-8 mx-auto sm:mx-0 text-xs">
            <div>
              <p className="text-base font-black text-[#0A317B]">96%</p>
              <p className="text-[11px] text-slate-500 font-medium">Interview Ready</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-base font-black text-[#1A9C9B]">1:1</p>
              <p className="text-[11px] text-slate-500 font-medium">Dedicated Mentors</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-base font-black text-[#FA9C16]">100%</p>
              <p className="text-[11px] text-slate-500 font-medium">Hands-on Capstones</p>
            </div>
          </div>
        </div>

        {/* Course Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab.key
                  ? 'bg-[#0A317B] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredFeedbacks.map((fb, idx) => {
              const ratingCount = Math.max(1, Math.min(5, Math.round(Number(fb.rating) || 5)));
              const initial = fb.name?.[0]?.toUpperCase() || 'S';

              return (
                <motion.div
                  key={fb.id || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                    fb.isNew 
                      ? 'border-[#FA9C16] shadow-[0_8px_30px_rgba(250,156,22,0.15)] ring-2 ring-[#FA9C16]/20' 
                      : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  {/* Top Row: Stars + Tag + New Pill */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(ratingCount)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {fb.isNew && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FA9C16] text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>New</span>
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {fb.tag || 'Curriculum'}
                        </span>
                      </div>
                    </div>

                    {/* Review Title */}
                    <h4 className="text-sm font-black text-slate-900 mb-2 leading-snug">
                      "{fb.title || 'Great Experience'}"
                    </h4>

                    {/* Review Comment Quote */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mb-6">
                      {fb.comment}
                    </p>
                  </div>

                  {/* Student Details Card Bottom */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0A317B] to-[#1A9C9B] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                        {initial}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 leading-tight">
                            {fb.name}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Student" />
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {fb.course || 'Student Alumni'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-slate-400 font-mono">
                      {fb.dateText || 'Recently'}
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white to-teal-50/80 border border-blue-200/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0A317B] text-white flex items-center justify-center shrink-0 shadow-md">
              <MessageSquare className="w-6 h-6 text-[#FA9C16]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#0A317B]">Are you a current student or graduate?</h4>
              <p className="text-xs text-slate-500 font-medium">Share your review from your Student Portal to inspire the next generation of engineers!</p>
            </div>
          </div>

          <div>
            {currentUser ? (
              <button
                onClick={() => setActiveView('portal')}
                className="px-5 py-2.5 rounded-xl bg-[#0A317B] hover:bg-[#061e4f] text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setAuthModal('login')}
                className="px-5 py-2.5 rounded-xl bg-[#0A317B] hover:bg-[#061e4f] text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Login to Share Feedback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
