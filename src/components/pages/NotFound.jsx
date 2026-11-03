import React, { useEffect } from 'react';
import { ArrowLeft, Compass, PhoneCall } from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { slugify } from '../../config/site';

export default function NotFound() {
  const { navigate, courses = [], openCounseling } = useLms();

  useEffect(() => {
    document.title = 'Page not found | CareerCore Edutech';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex';
    return () => {
      document.title = 'CareerCore Edutech | Modern Tech Education & Mentorship Platform';
      meta?.remove();
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }} data-testid="not-found">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,49,123,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,49,123,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center pb-20">
        <p className="text-[120px] sm:text-[160px] font-black leading-none text-gradient select-none">404</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black text-brand-navy">Page not found</h1>
        <p className="mt-3 text-slate-600">
          The page <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[13px] text-slate-700">{window.location.pathname}</code> doesn’t exist or has moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="btn-primary justify-center">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </a>
          <button onClick={() => openCounseling()} className="btn-ghost justify-center">
            <PhoneCall className="w-4 h-4 text-brand-teal" /> Contact us
          </button>
        </div>

        {courses.length > 0 && (
          <div className="mt-12">
            <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Compass className="w-3.5 h-3.5" /> Popular programs
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {courses.slice(0, 6).map((c) => (
                <a
                  key={c.id}
                  href={`/courses/${slugify(c.title)}`}
                  onClick={(e) => { e.preventDefault(); navigate(`/courses/${slugify(c.title)}`); }}
                  className="px-3.5 py-2 rounded-xl bg-white ring-1 ring-slate-200 text-xs font-bold text-brand-navy hover:ring-brand-teal/60"
                >
                  {c.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
