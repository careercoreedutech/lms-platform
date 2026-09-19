import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, GraduationCap, Star, Quote, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function CommunitySection() {
  const stats = [
    { label: 'Learners Placed', val: '50,000+', color: 'text-[#FA9C16]' },
    { label: 'Average Salary Hike', val: '140%', color: 'text-[#1A9C9B]' },
    { label: 'Hiring Partners', val: '500+ Top Tech', color: 'text-[#0A317B]' },
    { label: 'Placement Rate', val: '98.4%', color: 'text-[#1A9C9B]' }
  ];

  const posts = [
    {
      title: 'From Non-Tech Background to Senior Full Stack Engineer',
      desc: 'How Rahul transformed his career in 6 months with CareerCore 1-on-1 mentorship and landed an 18 LPA role at Google.',
      author: 'Rahul Sharma',
      role: 'Software Engineer @ Google',
      salary: '₹18 LPA Package',
      tag: 'Full Stack Career',
      color: 'text-[#FA9C16]',
      border: 'border-[#FA9C16]/30',
      initials: 'RS'
    },
    {
      title: 'Transitioning into Data Science & AI Leadership',
      desc: 'Priya mastered machine learning models and end-to-end data pipelines, securing a Senior Data Scientist position at Amazon.',
      author: 'Priya Nair',
      role: 'Senior Data Scientist @ Amazon',
      salary: '₹26 LPA Package',
      tag: 'AI & Data Science',
      color: 'text-[#1A9C9B]',
      border: 'border-[#1A9C9B]/30',
      initials: 'PN'
    },
    {
      title: 'How 1-on-1 Mentorship & Mock Interviews Helped Me Land a Job',
      desc: 'Inside the placement boot-camp experience: resume ATS tuning, system design whiteboarding, and direct hiring partner referrals.',
      author: 'Ankit Verma',
      role: 'DevOps Architect @ Microsoft',
      salary: '₹22 LPA Package',
      tag: 'Placement Bootcamp',
      color: 'text-[#0A317B]',
      border: 'border-[#0A317B]/30',
      initials: 'AV'
    }
  ];

  return (
    <section id="community" className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Background glow orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#FA9C16]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1A9C9B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-[#FA9C16]/30 text-xs font-bold text-[#FA9C16] shadow-sm mb-4">
            <GraduationCap className="w-4 h-4 fill-[#FA9C16]" />
            <span>Alumni Success Stories & Impact</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A317B] tracking-tight leading-tight">
            Building careers that <br />
            <span className="bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16] bg-clip-text text-transparent">
              transform lives & futures
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Over 50,000+ students and working professionals have accelerated their tech careers with CareerCore Edutech.
          </p>
        </div>

        {/* Impact Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((st, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 text-center shadow-xs hover:shadow-md transition-all"
            >
              <div className={`text-2xl sm:text-4xl font-extrabold ${st.color}`}>
                {st.val}
              </div>
              <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">
                {st.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl flex flex-col justify-between group hover:border-[#1A9C9B] transition-all relative overflow-hidden"
            >
              {/* Top Card Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16]" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-gray-100 ${post.color}`}>
                    {post.tag}
                  </span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <Quote className="w-7 h-7 text-gray-200 mb-2 group-hover:text-[#1A9C9B]/40 transition-colors" />

                <h3 className="text-lg font-extrabold text-[#0A317B] group-hover:text-[#1A9C9B] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {post.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A317B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {post.initials}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0A317B] block">
                      {post.author}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium block">
                      {post.role}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-1 rounded bg-amber-50 text-[#FA9C16] text-[10px] font-extrabold border border-[#FA9C16]/30">
                  {post.salary}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
