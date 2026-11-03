import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, PhoneCall, CheckCircle2, Video, Briefcase, CalendarDays } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { getNextBatchStart, slugify } from '../config/site';
import Highlight from './ui/Highlight';
import CountUp from './ui/CountUp';

const HeroScene = lazy(() => import('./three/HeroScene'));

const AVATAR_COLORS = ['from-brand-teal to-sky-400', 'from-brand-orange to-amber-300', 'from-sky-500 to-indigo-500', 'from-emerald-400 to-brand-teal'];

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

class SceneBoundary extends React.Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.warn('[HeroScene] disabled:', err?.message); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

// Shown while the 3D chunk loads, or when WebGL isn't available
function OrbFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="relative w-56 h-56 sm:w-72 sm:h-72">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#5EEAD4,#1A9C9B_40%,#0A317B_75%)] shadow-[0_0_120px_rgba(26,156,155,0.45)]" />
        <div className="absolute -inset-10 rounded-full border border-sky-300/20 rotate-12" />
        <div className="absolute -inset-20 rounded-full border border-orange-300/15 -rotate-12" />
      </div>
    </div>
  );
}

function FloatCard({ className, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6 + delay, duration: 0.5 }}
      className={`absolute z-10 glass-dark rounded-2xl px-4 py-3 text-white ${className}`}
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 5 + delay * 2, ease: 'easeInOut' }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const { openEnrollment, openCounseling, navigate, feedbacks = [], courses = [] } = useLms();
  const [webgl, setWebgl] = useState(false);
  const [compact, setCompact] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    setWebgl(hasWebGL());
    const mq = window.matchMedia('(max-width: 1023px)');
    const set = () => setCompact(mq.matches);
    set();
    mq.addEventListener?.('change', set);
    return () => mq.removeEventListener?.('change', set);
  }, []);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((a, f) => a + (Number(f.rating) || 5), 0) / feedbacks.length).toFixed(1)
    : '4.9';
  const batch = getNextBatchStart().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
  const quickLinks = courses.slice(0, 4);

  return (
    <section
      className="relative overflow-hidden bg-[#050B1F] text-white"
      style={{ paddingTop: 'calc(var(--header-h) + 2.5rem)' }}
    >
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(26,156,155,0.28),transparent)]" />
        <div className="absolute top-20 right-[-200px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(closest-side,rgba(29,78,216,0.30),transparent)]" />
        <div className="absolute bottom-[-300px] left-1/3 w-[700px] h-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(250,156,22,0.14),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-4 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 xl:col-span-6 text-center lg:text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full glass-dark text-[11px] sm:text-xs font-bold mb-6 whitespace-nowrap"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-white font-extrabold">CareerCore 2.0</span>
              <span className="text-white/30">•</span>
              <span className="text-white/70">Next-Gen Tech Cohorts Open</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-[2.6rem] leading-[1.04] sm:text-6xl xl:text-7xl font-black tracking-tight"
            >
              Empowering your career, fully <Highlight tone="light">accelerated</Highlight>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Master in-demand skills with live mentors, build real-world capstone projects, and land high-growth tech &amp; business careers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 max-w-xs sm:max-w-none mx-auto lg:mx-0"
            >
              <button onClick={() => openEnrollment()} className="btn-primary justify-center !px-7 !py-4 group">
                <span>Explore Programs &amp; Enroll</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => openCounseling()}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold text-white glass-dark hover:bg-white/10 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-brand-teal" />
                <span>Request a callback</span>
              </button>
            </motion.div>

            {/* Program quick links */}
            {quickLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-2"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 mr-1">Popular</span>
                {quickLinks.map((c) => (
                  <a
                    key={c.id}
                    href={`/courses/${slugify(c.title)}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/courses/${slugify(c.title)}`); }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 ring-1 ring-white/15 hover:ring-brand-teal hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {c.title}
                  </a>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-xs font-semibold text-slate-400"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex -space-x-2">
                  {['A', 'P', 'K', 'S'].map((l, i) => (
                    <span key={l} className={`w-7 h-7 rounded-full ring-2 ring-[#050B1F] bg-gradient-to-br ${AVATAR_COLORS[i]} text-white text-[10px] font-black flex items-center justify-center`}>{l}</span>
                  ))}
                </span>
                <span><b className="text-white">50,000+</b> learners</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <b className="text-white">{avgRating}</b> student rating
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-brand-orange" />
                Next batch <b className="text-white">{batch}</b>
              </span>
            </motion.div>
          </div>

          {/* 3D scene */}
          <div className="lg:col-span-6 xl:col-span-6 relative h-[340px] sm:h-[420px] lg:h-[580px] -mx-4 sm:mx-0">
            {!sceneReady && <OrbFallback />}
            {webgl && (
              <SceneBoundary fallback={null}>
                <Suspense fallback={null}>
                  <motion.div
                    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_88%)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: sceneReady ? 1 : 0 }}
                    transition={{ duration: 0.9 }}
                  >
                    <HeroScene compact={compact} onReady={() => setSceneReady(true)} />
                  </motion.div>
                </Suspense>
              </SceneBoundary>
            )}

            <FloatCard className="hidden sm:block top-8 left-2 lg:left-0" delay={0}>
              <p className="flex items-center gap-2 text-[11px] font-bold text-white/60 uppercase tracking-wider"><Video className="w-3.5 h-3.5 text-red-400" /> Live class</p>
              <p className="text-sm font-extrabold mt-0.5">RAG pipelines with LangChain</p>
              <p className="text-[11px] text-white/50 mt-0.5">38 learners attending</p>
            </FloatCard>
            <FloatCard className="hidden sm:block bottom-24 left-0 lg:-left-6" delay={0.25}>
              <p className="flex items-center gap-2 text-sm font-extrabold"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Capstone approved</p>
              <p className="text-[11px] text-white/50 mt-0.5">Mentor review · “Ready to deploy”</p>
            </FloatCard>
            <FloatCard className="hidden sm:block top-1/2 right-0 lg:-right-2" delay={0.5}>
              <p className="flex items-center gap-2 text-[11px] font-bold text-white/60 uppercase tracking-wider"><Briefcase className="w-3.5 h-3.5 text-brand-orange" /> Offer received</p>
              <p className="text-sm font-extrabold mt-0.5">Associate AI Engineer</p>
              <div className="mt-1 flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</div>
            </FloatCard>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 rounded-3xl glass-dark overflow-hidden divide-x divide-y lg:divide-y-0 divide-white/10">
          {[
            { to: 50000, suffix: '+', label: 'Learners trained' },
            { to: 96, suffix: '%', label: 'Interview-ready graduates' },
            { to: Math.max(courses.length, 6), suffix: '', label: 'Industry career tracks' },
            { to: Number(avgRating), decimals: 1, suffix: '/5', label: 'Average student rating' },
          ].map((s) => (
            <div key={s.label} className="p-5 sm:p-7 text-center lg:text-left">
              <p className="text-3xl sm:text-4xl font-black tracking-tight">
                <CountUp to={s.to} decimals={s.decimals || 0} suffix={s.suffix} />
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills marquee */}
      <div className="relative mt-14 pb-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Tools &amp; technologies you’ll master</p>
        <div className="flex w-max animate-marquee-x gap-3">
          {[...Array(2)].flatMap((_, k) =>
            ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'PyTorch', 'LangChain', 'SQL', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Figma', 'Power BI', 'Jira', 'Git & GitHub', 'System Design'].map((t) => (
              <span key={`${k}-${t}`} className="px-4 py-2 rounded-full text-sm font-semibold text-white/75 ring-1 ring-white/10 bg-white/[0.03] whitespace-nowrap">
                {t}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
