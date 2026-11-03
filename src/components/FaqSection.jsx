import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PhoneCall, MessageCircle } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { SITE, MIN_STUDENT_AGE, getNextBatchStart } from '../config/site';
import Highlight from './ui/Highlight';

const priceNum = (p) => Number(String(p || '').replace(/[^\d]/g, '')) || null;
const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function FaqSection() {
  const { courses = [], navigate, openCounseling } = useLms();
  const [open, setOpen] = useState(0);

  const faqs = useMemo(() => {
    const prices = courses.map((c) => priceNum(c.price)).filter(Boolean);
    const feeLine = prices.length
      ? `Program fees range from ${inr(Math.min(...prices))} to ${inr(Math.max(...prices))} depending on the track and duration.`
      : 'Program fees depend on the track and duration.';
    const batch = getNextBatchStart().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });
    return [
      {
        q: 'Who are CareerCore programs for?',
        a: `College students, fresh graduates and working professionals who want to move into tech, data, product or design roles. You need to be at least ${MIN_STUDENT_AGE} years old to register.`,
      },
      {
        q: 'Do I need prior coding experience?',
        a: 'No. Most tracks start from the fundamentals. In your free counseling call we look at your background and recommend the track and starting point that fits you.',
      },
      {
        q: 'Are classes live or recorded?',
        a: 'Both. Core sessions are taught live by working mentors, and every session is recorded so you can rewatch it. You also get mentor office hours and doubt-solving through the week.',
      },
      {
        q: 'How much does a program cost? Is EMI available?',
        a: `${feeLine} Flexible instalment (EMI) plans are available on every program — ask your counselor for the plan that suits you.`,
      },
      {
        q: 'What career support do I get?',
        a: 'Resume and LinkedIn reviews, at least two 1-on-1 mock interviews, and access to job and referral openings shared with your cohort — available for 6 months after your program ends.',
        link: { label: 'Read the Career Support SLA', to: '/career-support-sla' },
      },
      {
        q: 'Will I get a certificate?',
        a: 'Yes. You receive a verifiable certificate of completion with a public verification ID that you can add to LinkedIn and share with recruiters.',
      },
      {
        q: 'What if the program isn’t right for me?',
        a: 'You can request a full refund within 7 days of your batch start, before completing 20% of the content.',
        link: { label: 'See the refund policy', to: '/refund-policy' },
      },
      {
        q: 'When does the next batch start?',
        a: `The next batch begins on ${batch}. Seats are limited per batch so mentors can give everyone 1-on-1 attention.`,
      },
    ];
  }, [courses]);

  const jsonLd = useMemo(() => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }), [faqs]);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white border-t border-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky" style={{ top: 'calc(var(--header-h) + 1.5rem)' }}>
            <span className="eyebrow mb-5"><span className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> FAQ</span>
            <h2 className="section-title">
              Questions, <Highlight>answered</Highlight>
            </h2>
            <p className="section-lead">Can’t find what you’re looking for? Our counselors are happy to help.</p>
            <div className="mt-8 p-5 rounded-3xl bg-slate-50 ring-1 ring-slate-200 space-y-3">
              <p className="text-sm font-extrabold text-brand-navy">Talk to a human</p>
              <button onClick={() => openCounseling()} className="btn-navy w-full justify-center">
                <PhoneCall className="w-4 h-4" /> Book free counseling
              </button>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q}>
                  <h3>
                    <button
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between gap-6 py-5 sm:py-6 text-left cursor-pointer group"
                    >
                      <span className={`text-base sm:text-lg font-extrabold transition-colors ${isOpen ? 'text-brand-navy' : 'text-slate-700 group-hover:text-brand-navy'}`}>
                        {f.q}
                      </span>
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${isOpen ? 'bg-brand-navy text-white rotate-45' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-a-${i}`}
                        role="region"
                        aria-labelledby={`faq-q-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-14 text-[15px] leading-relaxed text-slate-600">
                          {f.a}
                          {f.link && (
                            <a
                              href={f.link.to}
                              onClick={(e) => { e.preventDefault(); navigate(f.link.to); }}
                              className="block mt-2 font-bold text-brand-teal hover:text-brand-navy"
                            >
                              {f.link.label} →
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
