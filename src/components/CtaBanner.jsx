import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, GraduationCap, Sparkles, CheckCircle2, PhoneCall } from 'lucide-react';

export default function CtaBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 12, seconds: 35 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#0A317B] via-[#061e4f] to-[#1A9C9B] text-white shadow-[0_20px_60px_rgba(10,49,123,0.25)] overflow-hidden text-center border border-white/20"
        >
          {/* Top Multi-color Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FA9C16] via-[#1A9C9B] to-[#0A317B]" />

          {/* Animated Background Glowing Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FA9C16]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1A9C9B]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            {/* Batch Status Badge with Live Countdown */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#FA9C16] border border-white/20 shadow-sm">
              <Sparkles className="w-4 h-4 fill-[#FA9C16]" />
              <span>Next Elite Batch Starts In:</span>
              <span className="font-mono text-white bg-white/20 px-2 py-0.5 rounded font-extrabold">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Transform your tech career—<span className="bg-gradient-to-r from-[#FA9C16] to-[#ffd000] bg-clip-text text-transparent">faster & guaranteed</span>
            </h2>

            <p className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ students and working professionals mastering in-demand skills and landing dream roles with CareerCore Edutech.
            </p>

            {/* Value Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-200 pt-1">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#1A9C9B]" /> Dedicated Career Acceleration</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#FA9C16]" /> 1-on-1 Mentor Support</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#1A9C9B]" /> Real Enterprise Capstones</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-white bg-[#FA9C16] hover:bg-[#e0890f] shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm group cursor-pointer"
              >
                <span>Enroll In Program Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#community"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-white bg-white/10 hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/20 backdrop-blur-md text-sm cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#1A9C9B]" />
                <span>Book 1-on-1 Free Counseling</span>
              </a>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
