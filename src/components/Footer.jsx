import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Linkedin, ArrowUp, Send, CheckCircle2, Phone, Loader2, MessageCircle } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { SITE, slugify } from '../config/site';
import { isValidEmail } from '../lib/validation';
import { subscribeNewsletter } from '../lib/leads';
import { FOOTER_SECTIONS } from '../content/pages';

const NEWSLETTER_KEY = 'careercore_newsletter_email';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [subscribedAs, setSubscribedAs] = useState(() => {
    try { return localStorage.getItem(NEWSLETTER_KEY) || ''; } catch { return ''; }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const clean = email.trim();
    if (!isValidEmail(clean)) {
      setError('Enter a valid email address (e.g. name@example.com).');
      return;
    }
    setError('');
    setSending(true);
    const res = await subscribeNewsletter(clean, 'footer');
    setSending(false);
    if (res.success) {
      try { localStorage.setItem(NEWSLETTER_KEY, clean); } catch {}
      setSubscribedAs(clean);
      setEmail('');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="relative mb-14 p-6 sm:p-10 rounded-3xl overflow-hidden bg-gradient-to-br from-brand-navy via-[#0B2A6B] to-brand-teal flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div aria-hidden className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-brand-orange/20 blur-3xl" />
      <div className="relative max-w-lg">
        <h4 className="text-xl font-black text-white">Free learning resources &amp; tech roadmaps, weekly</h4>
        <p className="text-sm text-white/70 mt-1">DSA cheat sheets, interview tips and career advice from our mentors. No spam — unsubscribe anytime.</p>
      </div>

      {subscribedAs ? (
        <div role="status" className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 ring-1 ring-white/20 text-sm text-white">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>
            You’re subscribed as <b>{subscribedAs}</b>.{' '}
            <button
              type="button"
              className="underline font-semibold cursor-pointer"
              onClick={() => { try { localStorage.removeItem(NEWSLETTER_KEY); } catch {} setSubscribedAs(''); }}
            >
              Use another email
            </button>
          </span>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="relative w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!error}
              aria-describedby={error ? 'newsletter-error' : undefined}
              className={`px-4 py-3 rounded-xl border text-sm w-full lg:w-72 bg-white focus:outline-none focus:ring-4 ${
                error ? 'border-red-400 focus:ring-red-200/40' : 'border-white/20 focus:ring-white/20 focus:border-white/60'
              }`}
            />
            <button type="submit" disabled={sending} className="btn-primary justify-center shrink-0">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{sending ? 'Subscribing…' : 'Subscribe'}</span>
            </button>
          </div>
          {error && <p id="newsletter-error" role="alert" className="mt-2 text-xs font-semibold text-red-200">{error}</p>}
        </form>
      )}
    </div>
  );
}

export default function Footer() {
  const { courses = [], navigate, openCounseling } = useLms();

  const sections = [
    {
      title: 'Programs',
      links: courses.slice(0, 6).map((c) => ({ label: c.title, to: `/courses/${slugify(c.title)}` })),
    },
    ...FOOTER_SECTIONS,
  ];

  const linkProps = (to) => ({
    href: to,
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      navigate(to);
    },
  });

  const socials = [
    { href: SITE.social.instagram, label: 'Instagram', Icon: Instagram, hover: 'hover:bg-[#E1306C]' },
    { href: SITE.social.x, label: 'X (Twitter)', Icon: Twitter, hover: 'hover:bg-black' },
    { href: SITE.social.facebook, label: 'Facebook', Icon: Facebook, hover: 'hover:bg-[#1877F2]' },
    { href: SITE.social.linkedin, label: 'LinkedIn', Icon: Linkedin, hover: 'hover:bg-[#0A66C2]' },
  ];

  return (
    <footer className="bg-[#050B1F] text-slate-400 text-sm pt-16 pb-28 sm:pb-12 relative overflow-hidden" data-site-footer>
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(26,156,155,0.15),transparent)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Newsletter />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <a {...linkProps('/')} className="inline-flex" aria-label="CareerCore Edutech home">
              <img src="/logo-light.png" alt="CareerCore Edutech" className="h-6 w-auto my-1.5" />
            </a>
            <p className="text-slate-400 text-[13px] max-w-sm leading-relaxed">
              CareerCore Edutech empowers students and working professionals to master industry-ready tech skills, build production projects, and achieve career breakthroughs.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-bold text-white">
              <a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-brand-teal">
                <Phone className="w-3.5 h-3.5 text-brand-orange" /> {SITE.phoneDisplay}
              </a>
              <button onClick={() => openCounseling()} className="flex items-center gap-2 hover:text-brand-teal cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5 text-brand-orange" /> Book free counseling
              </button>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              {socials.map(({ href, label, Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`p-2.5 rounded-xl bg-white/5 ring-1 ring-white/10 text-slate-300 hover:text-white ${hover} transition-colors`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {sections.map((sec) => (
            <nav key={sec.title} aria-label={sec.title} className="space-y-3.5">
              <p className="font-extrabold text-white uppercase tracking-wider text-[11px]">{sec.title}</p>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    <a {...linkProps(link.to)} className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a {...linkProps('/privacy-policy')} className="hover:text-white">Privacy</a>
            <a {...linkProps('/terms')} className="hover:text-white">Terms</a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/15 hover:text-white transition-all text-slate-300 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
