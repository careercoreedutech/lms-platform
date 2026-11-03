import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Clock, Download, IndianRupee, Layers, PhoneCall, PlayCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { formatDuration, slugify } from '../../config/site';
import { downloadSyllabus } from '../../lib/syllabus';

const INCLUDED = [
  'Live mentor-led sessions + recordings',
  '1-on-1 mentor reviews on every module',
  'Production-style capstone project',
  'Resume, LinkedIn & mock-interview support',
  'Verifiable completion certificate',
];

export default function CoursePage({ course }) {
  const { openEnrollment, openCounseling, navigate, courses = [] } = useLms();
  const [openIdx, setOpenIdx] = useState(0);
  const sections = course.sections || [];
  const lessonCount = sections.reduce((n, s) => n + (s.items?.length || 0), 0);

  useEffect(() => {
    document.title = `${course.title} | CareerCore Edutech`;
    return () => { document.title = 'CareerCore Edutech | Modern Tech Education & Mentorship Platform'; };
  }, [course.title]);

  const others = courses.filter((c) => c.id !== course.id).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy text-white" style={{ paddingTop: 'calc(var(--header-h) + 2.5rem)' }}>
        {course.image && (
          <img src={course.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/95 to-brand-navy/60" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 grid lg:grid-cols-[1fr_360px] gap-10 items-end">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs font-semibold text-white/50 mb-5">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-white">Home</a>
              <ChevronRight className="w-3.5 h-3.5" />
              <a href="/#courses" onClick={(e) => { e.preventDefault(); navigate('/#courses'); }} className="hover:text-white">Courses</a>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/80">{course.title}</span>
            </nav>
            {course.category && (
              <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-[11px] font-extrabold uppercase tracking-wider text-brand-orange mb-4">
                {course.category}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.08]">{course.title}</h1>
            <p className="mt-4 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/80">
              {course.duration && <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-teal" /> {formatDuration(course.duration)}</span>}
              {sections.length > 0 && <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-brand-teal" /> {sections.length} {sections.length === 1 ? 'module' : 'modules'}</span>}
              {lessonCount > 0 && <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-brand-teal" /> {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>}
            </div>
          </div>

          {/* Enrollment card */}
          <div className="bg-white text-slate-700 rounded-3xl p-6 shadow-2xl ring-1 ring-black/5">
            {course.price && (
              <p className="flex items-baseline gap-1 text-3xl font-black text-brand-navy">
                <IndianRupee className="w-6 h-6 self-center text-brand-orange" />
                {String(course.price).replace('₹', '')}
                <span className="text-xs font-semibold text-slate-400 ml-1">· EMI available</span>
              </p>
            )}
            <ul className="mt-4 space-y-2.5">
              {INCLUDED.map((t) => (
                <li key={t} className="flex gap-2 text-[13px]"><CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" /> {t}</li>
              ))}
            </ul>
            <div className="mt-6 grid gap-2">
              <button onClick={() => openEnrollment(course.redirectCourse || course.title)} className="btn-primary justify-center w-full !py-3.5">
                Enroll in this program <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => openCounseling()} className="btn-ghost justify-center w-full">
                <PhoneCall className="w-4 h-4 text-brand-teal" /> Talk to a counselor
              </button>
              <button onClick={() => downloadSyllabus(course)} className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-500 hover:text-brand-navy cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Download syllabus (PDF)
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">Curriculum</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">Week-by-week plan. Every module ends with a hands-on build reviewed by your mentor.</p>

            {sections.length === 0 ? (
              <p className="p-5 rounded-2xl bg-slate-50 ring-1 ring-slate-200 text-sm text-slate-600">
                The detailed curriculum for this program is being updated. Book a counseling call and we’ll walk you through it.
              </p>
            ) : (
              <div className="rounded-2xl ring-1 ring-slate-200 divide-y divide-slate-200 overflow-hidden bg-white">
                {sections.map((sec, i) => {
                  const open = openIdx === i;
                  return (
                    <div key={sec.id || i}>
                      <button
                        onClick={() => setOpenIdx(open ? -1 : i)}
                        aria-expanded={open}
                        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange text-xs font-black flex items-center justify-center shrink-0">
                            {sec.weekNumber || i + 1}
                          </span>
                          <span className="font-bold text-brand-navy text-[15px]">{sec.title}</span>
                        </span>
                        <span className="flex items-center gap-3 shrink-0">
                          <span className="hidden sm:inline text-xs font-semibold text-slate-400">{sec.items?.length || 0} {(sec.items?.length || 0) === 1 ? 'lesson' : 'lessons'}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                        </span>
                      </button>
                      {open && (
                        <ul className="px-5 pb-5 pl-[3.75rem] sm:pl-16 space-y-2">
                          {(sec.items || []).map((it) => (
                            <li key={it.id || it.title} className="flex items-center justify-between gap-3 text-sm text-slate-600">
                              <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-brand-teal shrink-0" /> {it.title}</span>
                              {it.duration && <span className="text-xs text-slate-400 shrink-0">{it.duration}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-black text-brand-navy mb-5">Explore other programs</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {others.map((c) => (
                <a
                  key={c.id}
                  href={`/courses/${slugify(c.title)}`}
                  onClick={(e) => { e.preventDefault(); navigate(`/courses/${slugify(c.title)}`); }}
                  className="group p-5 rounded-2xl ring-1 ring-slate-200 hover:ring-brand-teal/50 hover:shadow-lg transition-all bg-white"
                >
                  <p className="font-extrabold text-brand-navy group-hover:text-brand-teal">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDuration(c.duration)}{c.price ? ` · ${c.price}` : ''}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
