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
import Highlight from './ui/Highlight';

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
    <section id="reviews" className="py-20 sm:py-24 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#1A9C9B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FA9C16]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          
          <motion.div
            initial={false}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold mb-4 shadow-2xs"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[#0A317B] font-extrabold">Student Wall of Love</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Verified Alumni Experiences</span>
          </motion.div>

          <motion.h2 
            initial={false}
            className="section-title"
          >
            What our students <br className="hidden sm:block" />
            <Highlight>say about CareerCore</Highlight>
          </motion.h2>

          <motion.p
            initial={false}
            className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Read authentic reviews and career milestones submitted directly by our students and graduates across all tech and business programs.
          </motion.p>
        </div>

        {/* Rating Metrics Strip */}
        <div className="max-w-4xl mx-auto mb-10 grid grid-cols-2 sm:grid-cols-4 rounded-3xl bg-white ring-1 ring-slate-200/90 shadow-sm overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 ring-1 ring-amber-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-xl font-black text-amber-700 leading-none">{averageRating}</span>
              <div className="flex scale-75 -mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider leading-tight">Satisfaction score</p>
              <p className="text-[11px] text-slate-500 font-medium">{feedbacks.length}+ verified reviews</p>
            </div>
          </div>
          {[
            ['96%', 'Interview ready', 'text-brand-navy'],
            ['1:1', 'Dedicated mentors', 'text-brand-teal'],
            ['100%', 'Hands-on capstones', 'text-brand-orange'],
          ].map(([v, l, c], i) => (
            <div key={l} className={`p-5 flex flex-col justify-center text-center ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
              <p className={`text-2xl font-black ${c}`}>{v}</p>
              <p className="text-[11px] text-slate-500 font-semibold">{l}</p>
            </div>
          ))}
        </div>

        {/* Course Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab.key
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews wall (masonry) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {filteredFeedbacks.map((fb, idx) => {
            const ratingCount = Math.max(1, Math.min(5, Math.round(Number(fb.rating) || 5)));
            const initial = fb.name?.[0]?.toUpperCase() || 'S';
            const featured = idx === 0 && selectedFilter === 'ALL';
            return (
              <motion.figure
                key={fb.id || idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx, 6) * 0.04 }}
                className={`break-inside-avoid mb-5 relative rounded-3xl p-6 ring-1 transition-shadow duration-300 hover:shadow-[0_20px_40px_-20px_rgba(10,49,123,0.25)] ${
                  featured
                    ? 'bg-brand-navy text-white ring-brand-navy'
                    : fb.isNew
                      ? 'bg-white ring-brand-orange/60 shadow-[0_8px_30px_rgba(250,156,22,0.12)]'
                      : 'bg-white ring-slate-200/90'
                }`}
              >
                <Quote aria-hidden className={`absolute top-5 right-5 w-8 h-8 ${featured ? 'text-white/10' : 'text-slate-100'}`} />
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(ratingCount)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {fb.isNew && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-orange text-white font-black text-[9px] uppercase tracking-wider">New</span>
                  )}
                </div>
                <blockquote>
                  <p className={`font-black leading-snug ${featured ? 'text-xl' : 'text-base'} ${featured ? 'text-white' : 'text-slate-900'}`}>
                    “{fb.title || 'Great experience'}”
                  </p>
                  <p className={`mt-2.5 text-sm leading-relaxed ${featured ? 'text-white/75' : 'text-slate-600'}`}>{fb.comment}</p>
                </blockquote>
                <figcaption className={`mt-5 pt-4 border-t flex items-center justify-between gap-3 ${featured ? 'border-white/15' : 'border-slate-100'}`}>
                  <span className="flex items-center gap-3 min-w-0">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${featured ? 'bg-white text-brand-navy' : 'bg-gradient-to-tr from-brand-navy to-brand-teal text-white'}`}>
                      {initial}
                    </span>
                    <span className="min-w-0">
                      <span className={`flex items-center gap-1.5 text-sm font-extrabold ${featured ? 'text-white' : 'text-slate-900'}`}>
                        <span className="truncate">{fb.name}</span>
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${featured ? 'text-emerald-300' : 'text-emerald-600'}`} aria-label="Verified student" />
                      </span>
                      <span className={`block text-xs ${featured ? 'text-white/60' : 'text-slate-500'}`}>{fb.course || 'Student alumni'}</span>
                    </span>
                  </span>
                  <span className={`text-[11px] font-semibold shrink-0 ${featured ? 'text-white/50' : 'text-slate-400'}`}>{fb.dateText || 'Recently'}</span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
        {filteredFeedbacks.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-10">No reviews for this track yet — be the first to share yours.</p>
        )}

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
