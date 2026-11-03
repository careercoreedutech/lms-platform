import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, PhoneCall, CalendarDays } from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { getNextBatchStart } from '../config/site';

function diffParts(target, now) {
  const ms = Math.max(0, target.getTime() - now);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n) => String(n).padStart(2, '0');

export default function CtaBanner() {
  const { openEnrollment, openCounseling } = useLms();
  // Fixed target date — survives reloads (BUG-033)
  const target = useMemo(() => getNextBatchStart(), []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = diffParts(target, now);
  const startLabel = target.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[2rem] px-6 py-12 sm:p-14 bg-gradient-to-br from-brand-navy via-[#061e4f] to-brand-teal text-white shadow-[0_30px_80px_-20px_rgba(10,49,123,0.45)] overflow-hidden text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-teal/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange">
                <Sparkles className="w-4 h-4" /> Next elite batch starts in
              </span>
              <div className="flex items-center gap-1.5 font-mono" role="timer" aria-label={`Batch starts ${startLabel}`}>
                {[
                  [left.days, 'd'],
                  [left.hours, 'h'],
                  [left.minutes, 'm'],
                  [left.seconds, 's'],
                ].map(([v, u]) => (
                  <span key={u} className="min-w-[3rem] px-2 py-1.5 rounded-lg bg-white/10 ring-1 ring-white/15 text-sm font-extrabold tabular-nums">
                    {pad(v)}<span className="text-white/50 text-[10px] ml-0.5">{u}</span>
                  </span>
                ))}
              </div>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white/60 -mt-2">
              <CalendarDays className="w-3.5 h-3.5" /> Batch begins {startLabel}, 10:00 AM IST
            </p>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Transform your tech career—{' '}
              <span className="text-gradient-warm">faster &amp; guaranteed</span>
            </h2>

            <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ students and working professionals mastering in-demand skills and landing dream roles with CareerCore Edutech.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold text-white/85">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-teal" /> Dedicated career acceleration</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-orange" /> 1-on-1 mentor support</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-teal" /> Real enterprise capstones</span>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button onClick={() => openEnrollment()} className="btn-primary justify-center !px-8 !py-4 group">
                <span>Enroll in a program</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => openCounseling()}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-extrabold text-sm text-white bg-white/10 hover:bg-white/20 ring-1 ring-white/25 backdrop-blur transition-all active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-brand-teal" />
                <span>Book 1-on-1 Free Counseling</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
