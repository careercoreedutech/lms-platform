import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  GraduationCap, 
  User, 
  Briefcase, 
  BookOpen, 
  ArrowRight,
  Send
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

const TAG_OPTIONS = [
  'Curriculum & Syllabus',
  'Live Mentorship',
  'Hands-on Projects',
  'Career Support',
  'Platform & Resources'
];

const RATING_LABELS = {
  1: 'Needs Improvement (1 Star)',
  2: 'Fair Experience (2 Stars)',
  3: 'Good Learning (3 Stars)',
  4: 'Very Good & Practical (4 Stars)',
  5: 'Outstanding / 5-Star Excellence! ★★★★★'
};

export default function FeedbackModal({ isOpen, onClose }) {
  const { currentUser, addFeedback, setActiveView } = useLms();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(currentUser?.name || '');
  const [role, setRole] = useState('Student Alumni');
  const [course, setCourse] = useState(currentUser?.course || 'Full Stack Web Dev');
  const [tag, setTag] = useState('Hands-on Projects');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please write a brief feedback comment.');
      return;
    }

    addFeedback({
      name: name.trim() || currentUser?.name || 'Student',
      role: role.trim() || 'Student Alumni',
      course: course || currentUser?.course || 'Full Stack Web Dev',
      rating,
      tag,
      title: title.trim() || 'Exceptional Learning Experience',
      comment: comment.trim()
    });

    setSubmitted(true);
  };

  const handleGoToLanding = () => {
    onClose();
    setActiveView('landing');
    setTimeout(() => {
      const el = document.getElementById('student-reviews');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Top Brand Accent Stripe */}
          <div className="h-2 bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16]" />

          <div className="p-6 sm:p-8">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#1A9C9B] border border-teal-200 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0A317B]">Share Course Feedback</h3>
                  <p className="text-xs text-slate-500">Your review will be showcased on our landing page</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-[#0A317B]">Review Published!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-slate-800">{name || 'Student'}</span>! Your feedback has been recorded and is now live on our landing page.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">{title || 'Student Feedback'}</span>
                    <div className="flex text-amber-400">
                      {[...Array(Math.max(1, Math.min(5, Math.round(Number(rating) || 5))))].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{comment}"</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="font-bold text-[#1A9C9B]">{course}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">✓ Verified Graduate</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleGoToLanding}
                    className="flex-1 py-3 rounded-xl bg-[#0A317B] hover:bg-[#061e4f] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View on Landing Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Rating Star Selection */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-1.5">
                  <label className="text-xs font-extrabold text-[#0A317B] block">
                    Overall Experience Rating
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              active
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_4px_rgba(250,156,22,0.4)]'
                                : 'text-slate-300 fill-slate-100'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] font-bold text-amber-800">
                    {RATING_LABELS[hoverRating || rating]}
                  </p>
                </div>

                {/* Category Tag Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    What stood out most?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_OPTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTag(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          tag === t
                            ? 'bg-[#1A9C9B] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Review Headline / Key Takeaway
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Practical projects and wonderful mentors!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                    required
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Detailed Review / Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your learning experience, what you built, how mentors assisted you, or how it helped your career..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium resize-none"
                    required
                  />
                </div>

                {/* Student Info Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Course Track</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Course program"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FA9C16] to-[#f58d00] hover:from-[#f58d00] hover:to-[#cb7702] text-white font-black text-xs shadow-md hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Publish Review</span>
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
