import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter / Self-Paced',
      desc: 'Essential foundational courses, practice quizzes, and community forum access.',
      priceMonthly: '$0',
      priceAnnual: '$0',
      badge: 'Free Trial',
      color: 'border-gray-200',
      buttonText: 'Start Free Learning',
      features: [
        'Access to 50+ foundational lectures',
        'Interactive coding sandbox',
        'Self-assessment quizzes',
        'Community Discord & Slack access',
        'Course completion certificates'
      ]
    },
    {
      name: 'CareerCore Pro',
      desc: 'For aspiring developers & data scientists seeking 1-on-1 mentorship and projects.',
      priceMonthly: '$19',
      priceAnnual: '$15',
      badge: 'Most Popular',
      popular: true,
      color: 'border-[#FA9C16] shadow-xl',
      buttonText: 'Enroll in Pro Track',
      features: [
        'Full access to all 200+ advanced courses',
        '1-on-1 weekly mentor sessions',
        'Capston project portfolio reviews',
        'ATS-optimized resume builder',
        'Mock technical interviews',
        'Priority 24/7 doubt resolution'
      ]
    },
    {
      name: 'Career Acceleration BootCamp',
      desc: 'Comprehensive career acceleration support, flexible ISA options, and direct hiring manager referrals.',
      priceMonthly: 'ISA / Custom',
      priceAnnual: 'ISA / Custom',
      badge: 'Guaranteed Career',
      color: 'border-[#1A9C9B]',
      buttonText: 'Apply For BootCamp',
      features: [
        'Everything in CareerCore Pro',
        'Guaranteed interview calls SLA',
        'Dedicated Career Coach & Interview Mentor',
        'Custom corporate hiring challenges',
        'Flexible payment options (ISA models)',
        'Lifetime alumni career support network'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A9C9B] bg-teal-50 px-3 py-1 rounded-full border border-[#1A9C9B]/30">
            Tuition & Flexible Plans
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-[#0A317B] tracking-tight">
            Transparent investment for <span className="text-[#FA9C16]">your future</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Choose a program that fits your goals. Start free, or join our career acceleration bootcamp.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!annual ? 'text-[#0A317B]' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-gray-200 p-1 relative transition-colors focus:outline-none"
            >
              <div className={`w-4 h-4 rounded-full bg-[#FA9C16] shadow-sm transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-bold ${annual ? 'text-[#0A317B]' : 'text-gray-400'}`}>
              Full Upfront <span className="text-[#1A9C9B] font-extrabold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className={`bg-white p-8 rounded-3xl border ${plan.color} relative flex flex-col justify-between ${
                plan.popular ? 'ring-2 ring-[#FA9C16] bg-gradient-to-b from-amber-50/40 to-white' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#FA9C16] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-[#0A317B]">{plan.name}</h3>
                  {!plan.popular && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2 min-h-[36px]">{plan.desc}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#0A317B]">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  {plan.priceMonthly !== 'ISA / Custom' && (
                    <span className="text-xs text-gray-500 font-mono">/ student / month</span>
                  )}
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <Check className="w-4 h-4 text-[#1A9C9B] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href="#"
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-[#FA9C16] hover:bg-[#e0890f] text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-[#0A317B]'
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
