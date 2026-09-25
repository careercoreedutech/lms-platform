import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Cpu, 
  FlaskConical, 
  BookOpen, 
  Upload, 
  GitBranch,
  LayoutGrid,
  GraduationCap
} from 'lucide-react';

export default function InteractiveShowcase() {
  const [activeTabIndex, setActiveTabIndex] = useState(1);
  const [selectedFile, setSelectedFile] = useState('frontend_react');

  const tabs = [
    {
      id: 'open',
      shortTitle: 'INDUSTRY-ALIGNED CURRICULUM',
      title: 'INDUSTRY-ALIGNED CURRICULUM',
      desc: 'Master cutting-edge tech stacks updated continuously with input from senior engineers at Fortune 500 companies.',
      tree: ['html_css_js', 'react_frontend', 'node_backend', 'system_design']
    },
    {
      id: 'robust',
      shortTitle: 'REAL-WORLD PROJECT PORTFOLIO',
      title: 'REAL-WORLD PROJECT PORTFOLIO',
      desc: 'Build and deploy scalable full-stack applications, AI models, and cloud architectures to your personal portfolio before graduating.',
      tree: ['e-commerce_app', 'ai_chatbot', 'cloud_microservices', 'capstone_project']
    },
    {
      id: 'cross',
      shortTitle: 'CAREER & INTERVIEW ACCELERATION',
      title: 'CAREER & INTERVIEW ACCELERATION',
      desc: 'Get 1-on-1 mock interviews, resume optimization, salary negotiation coaching, and direct referrals to hiring partners.',
      tree: ['dsa_problem_solving', 'system_design_mock', 'resume_ats_optimizer', 'recruiter_referrals']
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTabIndex((prev) => (prev + 1) % tabs.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentTab = tabs[activeTabIndex];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vertical Tabs */}
          <div className="lg:col-span-5 space-y-6">
            {tabs.map((tab, idx) => {
              const isActive = activeTabIndex === idx;

              return (
                <div key={tab.id} className="transition-all duration-300">
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 sm:p-8 rounded-3xl bg-[#0A317B] text-white shadow-lg space-y-4 cursor-pointer"
                      onClick={() => setActiveTabIndex(idx)}
                    >
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#FA9C16] tracking-tight leading-tight uppercase font-sans">
                        {tab.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                        {tab.desc}
                      </p>

                      <div className="pt-2">
                        <div className="w-full bg-blue-900/60 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            key={activeTabIndex}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 8, ease: 'linear' }}
                            className="bg-[#1A9C9B] h-full rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div
                      onClick={() => setActiveTabIndex(idx)}
                      className="p-4 cursor-pointer text-gray-400 hover:text-[#0A317B] transition-colors group"
                    >
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase leading-snug font-sans group-hover:translate-x-1 transition-transform">
                        {tab.shortTitle}
                      </h3>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual UI Window Mockup */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[500px]">
            
            {/* Background Blob Shape in Teal #1A9C9B */}
            <div className="absolute w-[500px] h-[450px] bg-[#1A9C9B]/20 rounded-[100px] rotate-[-12deg] blur-lg pointer-events-none transform translate-x-12 translate-y-4" />

            {/* Hyma Design System Window */}
            <motion.div
              key={activeTabIndex}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              {/* Window Header Bar */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="CareerCore Logo" className="h-5 w-auto" />

                  <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                    <div className="w-6 h-6 rounded-lg bg-[#0A317B] text-white flex items-center justify-center font-bold text-xs">
                      C
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A317B]">
                      <span>CareerCore Hub</span>
                      <GitBranch className="w-3.5 h-3.5 text-[#1A9C9B]" />
                      <span className="text-gray-500 font-normal">main</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FA9C16]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1A9C9B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0A317B]" />
                </div>
              </div>

              {/* Main App Body */}
              <div className="grid grid-cols-12 min-h-[380px]">
                
                {/* Left Sidebar */}
                <div className="col-span-3 border-r border-gray-100 p-3 space-y-4 text-xs font-semibold text-gray-600 bg-white">
                  
                  <div className="flex flex-col items-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <LayoutGrid className="w-5 h-5 mb-1 text-gray-400" />
                    <span className="text-[10px]">Overview</span>
                  </div>

                  <div className="flex flex-col items-center p-2 rounded-xl bg-[#0A317B] text-white font-bold cursor-pointer shadow-sm">
                    <GraduationCap className="w-5 h-5 mb-1 text-[#FA9C16]" />
                    <span className="text-[10px]">Courses</span>
                  </div>

                  <div className="flex flex-col items-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <Cpu className="w-5 h-5 mb-1 text-gray-400" />
                    <span className="text-[10px]">Projects</span>
                  </div>

                  <div className="flex flex-col items-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <FlaskConical className="w-5 h-5 mb-1 text-gray-400" />
                    <span className="text-[10px]">Mentors</span>
                  </div>

                  <div className="flex flex-col items-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <BookOpen className="w-5 h-5 mb-1 text-gray-400" />
                    <span className="text-[10px]">Docs</span>
                  </div>

                  <div className="flex flex-col items-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-5 h-5 mb-1 text-gray-400" />
                    <span className="text-[10px]">Careers</span>
                  </div>

                </div>

                {/* Main Tree Panel */}
                <div className="col-span-9 p-6 space-y-5 bg-white">
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#0A317B]">Learning Modules</span>
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full bg-[#FA9C16]">
                      24
                    </span>
                  </div>

                  <div className="space-y-2 text-sm font-semibold text-gray-800 font-sans">
                    
                    <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <Folder className="w-4 h-4 text-[#1A9C9B] fill-[#1A9C9B]/20" />
                      <span>foundation_modules</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 p-1.5 rounded-lg text-[#0A317B] bg-blue-50 font-bold">
                        <ChevronDown className="w-4 h-4 text-[#0A317B]" />
                        <FolderOpen className="w-4 h-4 text-[#0A317B] fill-[#0A317B]/20" />
                        <span>advanced_spec</span>
                      </div>

                      <div className="pl-6 space-y-1">
                        {currentTab.tree.map((fileName) => {
                          const isSelected = selectedFile === fileName || fileName === 'frontend_react';

                          return (
                            <div
                              key={fileName}
                              onClick={() => setSelectedFile(fileName)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[#1A9C9B]/15 text-[#0A317B] font-extrabold shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <FileText className="w-4 h-4 text-[#1A9C9B]" />
                              <span>{fileName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
