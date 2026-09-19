import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Linkedin, Heart, ArrowUp, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Programs',
      links: ['Full Stack Development', 'AI & Data Science', 'Cloud & DevOps Track', 'UI/UX Product Design', 'System Design Bootcamp', 'Corporate Upskilling']
    },
    {
      title: 'Resources',
      links: ['Placement Reports', 'Student Projects Hub', 'Free Coding Workshops', 'Interview Cheat Sheets', 'Syllabus Download', 'Alumni Network']
    },
    {
      title: 'Company',
      links: ['About CareerCore', 'Our Mission & Vision', 'Careers (Hiring Mentors)', 'Press & Media', 'Community Events', 'Contact Counseling']
    },
    {
      title: 'Legal & Policy',
      links: ['Privacy Policy', 'Terms & Conditions', 'Tuition Refund Policy', 'ISA Terms', 'Placement Guarantee SLA']
    }
  ];

  return (
    <footer className="bg-white text-gray-600 text-xs border-t border-gray-200 pt-16 pb-12 relative">
      {/* Top Multi-color Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Banner Box */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h4 className="text-base font-extrabold text-[#0A317B]">
              Stay updated with free learning resources & tech roadmaps
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Join 100,000+ subscribers receiving weekly DSA cheatsheets & career advice.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1A9C9B] text-xs w-full md:w-64 bg-white"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0A317B] hover:bg-[#061e4f] text-white font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#1A9C9B]" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-200">
          
          <div className="col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <img src="/logo.png" alt="CareerCore Edutech Logo" className="h-9 w-auto object-contain" />
            </a>

            <p className="text-gray-500 text-xs max-w-sm leading-relaxed">
              CareerCore Edutech empowers students and working professionals to master industry-ready tech skills, build production projects, and achieve career breakthroughs.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/careercore_edutech/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-xl bg-gray-100 hover:bg-[#E1306C] hover:text-white text-gray-700 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/CareerCore_Edu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="p-2 rounded-xl bg-gray-100 hover:bg-black hover:text-white text-gray-700 transition-colors"
                title="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/people/CareerCore-Edutech/61594042732296/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-xl bg-gray-100 hover:bg-[#1877F2] hover:text-white text-gray-700 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-xl bg-gray-100 hover:bg-[#0A66C2] hover:text-white text-gray-700 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {footerSections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <span className="font-extrabold text-[#0A317B] uppercase tracking-wider text-[11px] block">
                {sec.title}
              </span>
              <ul className="space-y-2">
                {sec.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href="#" className="hover:text-[#1A9C9B] transition-colors font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 font-mono text-[11px]">
          <div>
            © {new Date().getFullYear()} CareerCore Edutech Private Limited. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-[#FA9C16] fill-[#FA9C16]" />
              <span>for future tech leaders</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-gray-100 hover:bg-[#0A317B] hover:text-white transition-all text-gray-700 cursor-pointer flex items-center gap-1"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
