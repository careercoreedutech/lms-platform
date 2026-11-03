import React, { useMemo, useState } from 'react';
import { ArrowRight, Clock, IndianRupee, CalendarDays, Download, Sparkles } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import Highlight from './ui/Highlight';
import TiltCard from './ui/TiltCard';
import { formatDuration, slugify, getNextBatchStart } from '../config/site';
import { downloadSyllabus } from '../lib/syllabus';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80';

// Skills shown on each card, matched by course title keywords
const SKILL_MAP = [
  [/full\s*stack|web/i, ['React', 'Node.js', 'PostgreSQL', 'Docker']],
  [/machine learning|\bai\b|data science/i, ['Python', 'PyTorch', 'LLMs & RAG', 'Vector DBs']],
  [/cloud|devops/i, ['AWS', 'Kubernetes', 'Terraform', 'CI/CD']],
  [/product/i, ['Roadmaps', 'PRDs', 'User research', 'Metrics']],
  [/business analyst|analytics/i, ['SQL', 'Power BI', 'BPMN', 'Agile']],
  [/ui|ux|design/i, ['Figma', 'User research', 'Prototyping', 'Design systems']],
];
const skillsFor = (title = '') => SKILL_MAP.find(([re]) => re.test(title))?.[1] || [];

function CourseCard({ course, batchLabel, featured }) {
  const { openEnrollment, navigate } = useLms();
  const href = `/courses/${slugify(course.title)}`;
  const description =
    course.description || course.text || 'Master industry-relevant skills with practical projects and expert mentor guidance.';
  const skills = skillsFor(course.title);
  const go = (e) => { e.preventDefault(); navigate(href); };

  return (
    <TiltCard className="h-full rounded-3xl">
      <article
        data-course-card
        className="group relative h-full flex flex-col bg-white rounded-3xl ring-1 ring-slate-200/90 shadow-[0_1px_2px_rgba(10,49,123,0.04)] hover:shadow-[0_30px_60px_-24px_rgba(10,49,123,0.35)] transition-shadow duration-300 overflow-hidden"
      >
        <a href={href} onClick={go} className="relative block aspect-[16/9] overflow-hidden" tabIndex={-1} aria-hidden="true">
          <img
            src={course.image || FALLBACK_IMG}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B1F]/85 via-[#050B1F]/20 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            {course.category && (
              <span className="px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-extrabold uppercase tracking-wider text-brand-navy shadow-sm">
                {course.category}
              </span>
            )}
            {featured && (
              <span className="px-2.5 py-1 rounded-full bg-brand-orange text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most enrolled
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDuration(course.duration) || 'Self-paced'}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-brand-orange" /> Starts {batchLabel}</span>
          </div>
        </a>

        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-black text-brand-navy leading-snug tracking-tight">
            <a href={href} onClick={go} className="hover:text-brand-teal transition-colors">{course.title}</a>
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-600 line-clamp-2">{description}</p>

          {skills.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">You’ll master</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="px-2 py-1 rounded-lg bg-slate-50 ring-1 ring-slate-200 text-[11px] font-bold text-slate-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 mb-5 flex items-end justify-between gap-3">
            {course.price ? (
              <div>
                <p className="flex items-center text-xl font-black text-brand-navy leading-none">
                  <IndianRupee className="w-4 h-4 text-brand-orange" />
                  {String(course.price).replace('₹', '')}
                </p>
                <p className="text-[11px] font-semibold text-emerald-600 mt-1">EMI available</p>
              </div>
            ) : <span />}
            <button
              type="button"
              onClick={() => downloadSyllabus(course)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-brand-navy cursor-pointer"
              aria-label={`Download ${course.title} syllabus`}
            >
              <Download className="w-3.5 h-3.5" /> Syllabus
            </button>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2">
            <a
              href={href}
              onClick={go}
              className="text-center py-2.5 rounded-xl text-xs font-bold text-brand-navy ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50 transition-colors"
            >
              View curriculum
            </a>
            <button
              type="button"
              onClick={() => openEnrollment(course.redirectCourse || course.title)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-brand-navy hover:bg-[#072563] transition-colors cursor-pointer"
            >
              {course.buttonText || 'Enroll'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default function BusinessAnalystCard() {
  const { courses = [], openCounseling } = useLms();
  const [filter, setFilter] = useState('All');
  const batchLabel = useMemo(
    () => getNextBatchStart().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }),
    []
  );
  const categories = useMemo(() => ['All', ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))], [courses]);
  const shown = filter === 'All' ? courses : courses.filter((c) => c.category === filter);

  return (
    <section id="courses" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Programs
            </span>
            <h2 className="section-title">
              Pick your <Highlight>career track</Highlight>
            </h2>
            <p className="section-lead">
              Industry-aligned curricula built with senior mentors — every track ends in a portfolio-ready capstone.
            </p>
          </div>
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter programs">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filter === c ? 'bg-brand-navy text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Responsive grid — every card, description and Enroll button is visible on all devices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {shown.map((course, idx) => (
            <CourseCard key={course.id || idx} course={course} batchLabel={batchLabel} featured={filter === 'All' && idx === 0} />
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-slate-500">
          <span>Not sure which track fits you?</span>
          <button onClick={() => openCounseling()} className="font-extrabold text-brand-navy hover:text-brand-teal underline underline-offset-4 decoration-brand-orange/60 cursor-pointer">
            Get a free 1-on-1 recommendation →
          </button>
        </div>
      </div>
    </section>
  );
}
