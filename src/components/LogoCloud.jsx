import React from 'react';
import { 
  Building2, 
  Globe, 
  Briefcase, 
  Code, 
  Laptop, 
  Terminal, 
  Award,
  Layers 
} from 'lucide-react';

export default function LogoCloud() {
  const hiringPartners = [
    { name: 'Google', icon: Globe, label: 'Alumni Network' },
    { name: 'Microsoft', icon: Laptop, label: 'Cloud & Tech Partner' },
    { name: 'Amazon', icon: Building2, label: 'Hiring Network' },
    { name: 'Meta', icon: Code, label: 'Tech Recruiter' },
    { name: 'Flipkart', icon: Briefcase, label: 'Campus Hiring' },
    { name: 'TCS', icon: Terminal, label: 'Enterprise Partner' },
    { name: 'Infosys', icon: Award, label: 'Certified Hiring' },
    { name: 'Wipro', icon: Layers, label: 'Tech Careers' },
  ];

  return (
    <section className="py-12 border-y border-gray-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Our alumni work at world-class technology companies
        </p>
      </div>

      <div className="flex overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex gap-8 sm:gap-12 animate-marquee whitespace-nowrap py-2">
          {[...hiringPartners, ...hiringPartners].map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-[#1A9C9B]/50 transition-all group shrink-0"
            >
              <div className="p-2 rounded-xl bg-white text-[#0A317B] shadow-sm group-hover:scale-110 transition-transform">
                <p.icon className="w-5 h-5 text-[#0A317B]" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-[#0A317B] block group-hover:text-[#1A9C9B] transition-colors">
                  {p.name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono block">
                  {p.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
