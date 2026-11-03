import React, { useEffect } from 'react';
import { ArrowRight, ChevronRight, Download, PhoneCall, Clock, FileText, Phone, MapPin } from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { PAGES, FOOTER_SECTIONS } from '../../content/pages';
import { SITE, formatDuration, slugify } from '../../config/site';
import { downloadSyllabus } from '../../lib/syllabus';
import { CounselingForm, ContactShortcuts } from '../CounselingModal';

export function PageHero({ eyebrow, title, lead, updated, crumbs = [] }) {
  const { navigate } = useLms();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white border-b border-slate-100" style={{ paddingTop: 'calc(var(--header-h) + 2.5rem)' }}>
      <div aria-hidden className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(26,156,155,0.10),transparent)]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-5">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-brand-navy">Home</a>
          {crumbs.map((c) => (
            <React.Fragment key={c}>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{c}</span>
            </React.Fragment>
          ))}
        </nav>
        {eyebrow && <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-teal mb-3">{eyebrow}</p>}
        <h1 className="text-3xl sm:text-5xl font-black text-brand-navy tracking-tight leading-[1.1]">{title}</h1>
        {lead && <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">{lead}</p>}
        {updated && (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Clock className="w-3.5 h-3.5" /> Last updated {updated}
          </p>
        )}
      </div>
    </section>
  );
}

function Blocks({ blocks = [] }) {
  return (
    <div className="prose-page">
      {blocks.map((b, i) => {
        if (b.h) return <h2 key={i}>{b.h}</h2>;
        if (b.p) return <p key={i}>{b.p}</p>;
        if (b.ul) return <ul key={i}>{b.ul.map((t) => <li key={t}>{t}</li>)}</ul>;
        if (b.cards) {
          return (
            <div key={i} className={`grid gap-4 my-8 ${b.cards.length === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
              {b.cards.map((c) => (
                <div key={c.title} className="p-5 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
                  <p className="text-lg font-black text-brand-navy">{c.title}</p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function CtaPanel({ kind, topic }) {
  const { openEnrollment, openCounseling } = useLms();
  return (
    <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-navy to-[#0D419D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div>
        <p className="text-lg font-extrabold">{kind === 'enroll' ? 'Ready to start learning?' : 'Have questions? Talk to us.'}</p>
        <p className="text-sm text-white/70 mt-1">Free 1-on-1 counseling to help you pick the right program.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
        {kind === 'enroll' && (
          <button onClick={() => openEnrollment()} className="btn-primary justify-center">
            Enroll now <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => openCounseling(topic)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 ring-1 ring-white/25 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" /> {topic ? 'Get in touch' : 'Book free counseling'}
        </button>
      </div>
    </div>
  );
}

function SyllabusList() {
  const { courses = [], navigate } = useLms();
  return (
    <div className="grid gap-4">
      {courses.map((c) => (
        <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-brand-navy">{c.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {[formatDuration(c.duration), c.sections?.length ? `${c.sections.length} ${c.sections.length === 1 ? 'module' : 'modules'}` : null, c.category].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href={`/courses/${slugify(c.title)}`}
              onClick={(e) => { e.preventDefault(); navigate(`/courses/${slugify(c.title)}`); }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-brand-navy ring-1 ring-slate-200 hover:bg-slate-50"
            >
              View
            </a>
            <button onClick={() => downloadSyllabus(c)} className="btn-navy !px-4 !py-2.5 !text-xs">
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactBlock() {
  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="p-5 rounded-2xl bg-slate-50 ring-1 ring-slate-200 space-y-3 text-sm">
          <p className="font-extrabold text-brand-navy">Enrollment desk</p>
          <a href={SITE.phoneHref} className="flex items-center gap-2 font-bold text-slate-700 hover:text-brand-teal">
            <Phone className="w-4 h-4 text-brand-orange" /> {SITE.phoneDisplay}
          </a>
          <p className="flex items-center gap-2 text-slate-500"><Clock className="w-4 h-4" /> Mon–Sat, 9 AM – 8 PM IST</p>
          <p className="flex items-center gap-2 text-slate-500"><MapPin className="w-4 h-4" /> Online programs, India-wide</p>
        </div>
        <ContactShortcuts compact />
      </div>
      <div className="lg:col-span-3 p-5 sm:p-7 rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm">
        <p className="text-lg font-extrabold text-brand-navy mb-1">Request a free callback</p>
        <p className="text-sm text-slate-500 mb-5">Tell us a little about you and a counselor will call you back.</p>
        <CounselingForm source="contact-page" />
      </div>
    </div>
  );
}

export default function InfoPage({ slug }) {
  const page = PAGES[slug];
  const { navigate } = useLms();

  useEffect(() => {
    document.title = `${page.title} | CareerCore Edutech`;
    return () => { document.title = 'CareerCore Edutech | Modern Tech Education & Mentorship Platform'; };
  }, [page.title]);

  const siblings = FOOTER_SECTIONS.find((s) => s.title === page.group)?.links || [];

  return (
    <>
      <PageHero eyebrow={page.group} title={page.title} lead={page.lead} updated={page.updated} crumbs={[page.group, page.title]} />
      <section className="py-12 sm:py-16">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${page.type === 'contact' ? 'max-w-6xl' : 'max-w-4xl'}`}>
          <div className={page.type === 'contact' ? '' : 'grid lg:grid-cols-[1fr_200px] gap-12'}>
            <div className="min-w-0">
              {page.type === 'syllabus' && <SyllabusList />}
              {page.type === 'contact' && <ContactBlock />}
              {page.blocks && <Blocks blocks={page.blocks} />}
              {page.legal && (
                <p className="mt-10 text-sm text-slate-500">
                  Questions about this policy? Call us on <a className="font-bold text-brand-navy" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>.
                </p>
              )}
              {page.cta && <CtaPanel kind={page.cta} topic={page.ctaTopic} />}
            </div>

            {page.type !== 'contact' && (
              <aside className="hidden lg:block">
                <div className="sticky" style={{ top: 'calc(var(--header-h) + 1rem)' }}>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">{page.group}</p>
                  <ul className="space-y-1 border-l border-slate-200">
                    {siblings.map((l) => {
                      const active = l.to === `/${slug}`;
                      return (
                        <li key={l.to}>
                          <a
                            href={l.to}
                            onClick={(e) => { e.preventDefault(); navigate(l.to); }}
                            aria-current={active ? 'page' : undefined}
                            className={`block -ml-px pl-4 py-1.5 text-[13px] border-l-2 ${active ? 'border-brand-teal text-brand-navy font-bold' : 'border-transparent text-slate-500 hover:text-brand-navy hover:border-slate-300'}`}
                          >
                            {l.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
