import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Video, Code2, Briefcase, CheckCircle2, Sparkles, GitPullRequest, MessageSquare, Star,
  CalendarDays, Clock, Users, ArrowRight, PhoneCall,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import Highlight from './ui/Highlight';

const STEPS = [
  {
    icon: Compass,
    title: 'Pick the right track',
    desc: 'A free 1-on-1 counseling call maps your background and goals to the program that fits — no guesswork.',
    tone: 'text-brand-orange bg-orange-50',
  },
  {
    icon: Video,
    title: 'Learn live with mentors',
    desc: 'Industry-aligned curriculum taught live by working engineers, with recordings, quizzes and doubt-solving.',
    tone: 'text-brand-teal bg-teal-50',
  },
  {
    icon: Code2,
    title: 'Build a real portfolio',
    desc: 'Ship production-style capstones reviewed line-by-line by your mentor — proof recruiters can actually open.',
    tone: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Briefcase,
    title: 'Interview & get hired',
    desc: 'Resume and LinkedIn reviews, mock interviews and referrals into our hiring network.',
    tone: 'text-emerald-600 bg-emerald-50',
  },
];

const DURATION = 7000;

function Panel({ step }) {
  if (step === 0) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your counseling summary</p>
        <div className="p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 text-sm text-slate-600">
          <p><b className="text-brand-navy">Background:</b> Final-year B.Tech, knows Python basics</p>
          <p className="mt-1"><b className="text-brand-navy">Goal:</b> AI engineering role in 6 months</p>
        </div>
        {[['AI & Machine Learning', 96, 'bg-brand-teal'], ['Full Stack Web Dev', 81, 'bg-brand-navy'], ['Cloud & DevOps', 64, 'bg-brand-orange']].map(([t, v, c], i) => (
          <div key={t} className={`p-3.5 rounded-2xl ring-1 ${i === 0 ? 'ring-brand-teal/40 bg-teal-50/50' : 'ring-slate-200'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-brand-navy flex items-center gap-2">{i === 0 && <Sparkles className="w-4 h-4 text-brand-orange" />}{t}</span>
              <span className="font-black text-brand-navy tabular-nums">{v}% match</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.7, delay: i * 0.1 }} className={`h-full rounded-full ${c}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This week</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live now</span>
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-navy to-[#0D419D] text-white p-5">
          <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider">Live class · Week 4</p>
          <p className="text-lg font-black mt-1">RAG pipelines with LangChain</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 38 attending</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 90 min</span>
          </div>
          <span className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-red-500 text-[10px] font-black">LIVE</span>
        </div>
        {[['Mon', 'Vector embeddings — quiz', true], ['Wed', 'Mentor office hours', true], ['Fri', 'Build: chat with your PDFs', false]].map(([d, t, done]) => (
          <div key={t} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-slate-200">
            <span className="w-10 text-center text-[11px] font-black text-slate-400 uppercase">{d}</span>
            <span className="flex-1 text-sm font-semibold text-slate-700">{t}</span>
            {done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <CalendarDays className="w-4 h-4 text-slate-300" />}
          </div>
        ))}
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capstone review</p>
        <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-sm">
            <GitPullRequest className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-brand-navy">ai-study-buddy</span>
            <span className="text-slate-400">#14 · Add streaming answers</span>
          </div>
          <pre className="px-4 py-3 text-[12px] leading-6 font-mono bg-slate-950 text-slate-300 overflow-x-auto">
{`  const stream = await llm.stream(prompt);
- return await llm.invoke(prompt);
+ for await (const chunk of stream) {
+   res.write(chunk.content);
+ }`}
          </pre>
          <div className="p-4 flex gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-navy text-white text-xs font-black flex items-center justify-center shrink-0">M</span>
            <div className="text-sm">
              <p className="font-bold text-brand-navy flex items-center gap-1.5">Mentor review <MessageSquare className="w-3.5 h-3.5 text-slate-400" /></p>
              <p className="text-slate-600 mt-0.5">Nice — streaming cuts perceived latency a lot. Add a timeout and you’re ready to deploy. ✅ Approved</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[['3', 'Capstones'], ['42', 'Commits'], ['A+', 'Review grade']].map(([v, l]) => (
            <div key={l} className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200">
              <p className="text-lg font-black text-brand-navy">{v}</p>
              <p className="text-[11px] font-semibold text-slate-500">{l}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Career pipeline</p>
      {[['Resume & LinkedIn review', 'Score 92/100', true], ['Mock interview — DSA', 'Mentor: “Strong hire”', true], ['Mock interview — System design', 'Completed', true], ['Referral shared', '3 companies', false]].map(([t, s, done]) => (
        <div key={t} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-slate-200">
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${done ? 'text-emerald-500' : 'text-slate-300'}`} />
          <span className="flex-1 text-sm font-semibold text-slate-700">{t}</span>
          <span className="text-xs font-bold text-slate-400">{s}</span>
        </div>
      ))}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-teal text-white"
      >
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">Offer received 🎉</p>
        <p className="text-lg font-black mt-1">Associate AI Engineer</p>
        <div className="mt-2 flex items-center gap-1 text-white/90 text-xs font-semibold">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />)}
          <span className="ml-1">“The mock interviews made the real one feel easy.”</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function InteractiveShowcase() {
  const { openCounseling } = useLms();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    timer.current = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), DURATION);
    return () => clearTimeout(timer.current);
  }, [active, paused]);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="eyebrow mb-5"><span className="w-1.5 h-1.5 rounded-full bg-brand-teal" /> How it works</span>
            <h2 className="section-title">
              From first lesson <br className="hidden sm:block" />to <Highlight>job offer</Highlight>
            </h2>
            <p className="section-lead">Four steps, one mentor by your side the whole way.</p>

            <ol
              className="mt-10 relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <span aria-hidden className="absolute left-[19px] top-3 bottom-3 w-px bg-slate-200" />
              {STEPS.map((s, i) => {
                const on = active === i;
                return (
                  <li key={s.title} className="relative">
                    <button
                      onClick={() => setActive(i)}
                      aria-current={on ? 'step' : undefined}
                      className="w-full flex gap-4 py-3 text-left cursor-pointer group"
                    >
                      <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition-colors ${on ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                        <s.icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="flex-1 min-w-0 pt-1.5">
                        <span className={`block text-[17px] font-extrabold transition-colors ${on ? 'text-brand-navy' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          <span className="text-xs font-black mr-2 opacity-60">0{i + 1}</span>{s.title}
                        </span>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="block overflow-hidden"
                            >
                              <span className="block text-[15px] text-slate-600 leading-relaxed mt-1.5">{s.desc}</span>
                              <span className="block mt-3 h-1 rounded-full bg-slate-100 overflow-hidden">
                                <motion.span
                                  key={`${active}-${paused}`}
                                  className="block h-full bg-brand-teal rounded-full"
                                  initial={{ width: paused ? '100%' : '0%' }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: paused ? 0 : DURATION / 1000, ease: 'linear' }}
                                />
                              </span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <button onClick={() => openCounseling()} className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-brand-navy hover:text-brand-teal cursor-pointer group">
              <PhoneCall className="w-4 h-4 text-brand-orange" /> Start with a free counseling call
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-7 relative">
            <div aria-hidden className="absolute -inset-6 sm:-inset-10 rounded-[40px] bg-gradient-to-br from-teal-50 via-sky-50 to-orange-50" />
            <div className="relative max-w-xl mx-auto rounded-[28px] bg-white shadow-[0_40px_80px_-30px_rgba(10,49,123,0.35)] ring-1 ring-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </span>
                <span className="ml-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${STEPS[active].tone}`}>
                    {React.createElement(STEPS[active].icon, { className: 'w-3.5 h-3.5' })}
                  </span>
                  CareerCore · {STEPS[active].title}
                </span>
              </div>
              <div className="p-5 sm:p-6 min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Panel step={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
