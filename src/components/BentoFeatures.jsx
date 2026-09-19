import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  GraduationCap, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Terminal, 
  QrCode,
  Zap
} from 'lucide-react';

export default function BentoFeatures() {
  // Card 1 State: Selected AI Module
  const [activeModule, setActiveModule] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Card 2 State: Active Specialization Track
  const [selectedTrack, setSelectedTrack] = useState('fullstack');

  // Card 3 State: Active Certification Badge Preview
  const [activeCert, setActiveCert] = useState('blockchain');

  // Card 4 State: Active Pipeline Step
  const [pipelineStep, setPipelineStep] = useState(2);

  // Data for Card 1 (AI Adaptive Curricula)
  const modules = [
    { name: 'Module 1', title: 'Data Structures & Algorithms', duration: '4 Weeks', color: '#0A317B', progress: 100, topic: 'Trees, Graphs, Dynamic Programming' },
    { name: 'Module 2', title: 'Fullstack Architecture & APIs', duration: '5 Weeks', color: '#1A9C9B', progress: 100, topic: 'React, Node.js, GraphQL, Microservices' },
    { name: 'Module 3', title: 'Cloud Native & DevOps', duration: '4 Weeks', color: '#FA9C16', progress: 95, topic: 'Docker, Kubernetes, AWS Lambda' },
    { name: 'Module 4', title: 'AI Engineering & LLMs', duration: '6 Weeks', color: '#0A317B', progress: 85, topic: 'PyTorch, RAG Pipelines, LangChain' },
    { name: 'Module 5', title: 'System Design & Scalability', duration: '3 Weeks', color: '#1A9C9B', progress: 70, topic: 'Distributed Caching, Load Balancers' },
    { name: 'Module 6', title: 'Production Capstone', duration: '4 Weeks', color: '#FA9C16', progress: 40, topic: 'Live Enterprise Client Project' },
  ];

  // Data for Card 2 (Multi-Domain Specializations)
  const tracks = {
    fullstack: {
      name: 'Full Stack Engineering',
      tagline: 'Build scalable web & mobile apps',
      primaryColor: '#0A317B',
      accentColor: '#FA9C16',
      badgeBg: 'bg-[#0A317B]',
      salary: '₹14 - 28 LPA',
      skills: ['React 19', 'Next.js 15', 'Node.js', 'PostgreSQL', 'Docker'],
      projects: '3 Capstones'
    },
    ai: {
      name: 'AI & Machine Learning',
      tagline: 'Train neural nets & LLM agents',
      primaryColor: '#1A9C9B',
      accentColor: '#0A317B',
      badgeBg: 'bg-[#1A9C9B]',
      salary: '₹18 - 35 LPA',
      skills: ['PyTorch', 'Transformers', 'LangChain', 'Python', 'Vector DBs'],
      projects: '4 AI Models'
    },
    cloud: {
      name: 'Data & Cloud Architecture',
      tagline: 'Architect high-throughput data systems',
      primaryColor: '#FA9C16',
      accentColor: '#1A9C9B',
      badgeBg: 'bg-[#FA9C16]',
      salary: '₹16 - 30 LPA',
      skills: ['AWS / GCP', 'Kubernetes', 'Apache Kafka', 'Snowflake', 'Terraform'],
      projects: '3 Infrastructure Builds'
    }
  };

  // Data for Card 3 (Recognized Credentials)
  const certs = {
    blockchain: {
      title: 'Blockchain NFT Credential',
      color: '#1A9C9B',
      icon: ShieldCheck,
      hash: '0x8f9a...3c21',
      desc: 'Immutably verified on Ethereum testnet with public key proof.'
    },
    linkedin: {
      title: 'LinkedIn 1-Click Verification',
      color: '#0A317B',
      icon: Award,
      hash: 'LINKEDIN-CERT-9942',
      desc: 'Directly syncs to your LinkedIn profile Licenses & Certifications.'
    },
    recruiter: {
      title: 'Top 500 Employer Endorsement',
      color: '#FA9C16',
      icon: CheckCircle2,
      hash: 'CAREERCORE-REC-2026',
      desc: 'Pre-screened endorsement badge recognized by tier-1 hiring partners.'
    }
  };

  // Data for Card 4 (Placement Pipeline)
  const pipelineSteps = [
    { label: 'GitHub Sync', sub: '142 Commits Synced', color: '#0A317B' },
    { label: 'ATS Resume Score', sub: '99/100 Optimized', color: '#1A9C9B' },
    { label: 'Interview Calls', sub: '5 Tier-1 Invites', color: '#FA9C16' }
  ];

  const interviews = [
    { company: 'Google Cloud', role: 'Frontend Engineer II', package: '₹24 LPA', status: 'Confirmed' },
    { company: 'Microsoft', role: 'Full Stack Specialist', package: '₹26 LPA', status: 'In Review' },
    { company: 'Amazon AWS', role: 'DevOps Architect', package: '₹22 LPA', status: 'Confirmed' }
  ];

  const handleSimulateAI = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setActiveModule((prev) => (prev + 1) % modules.length);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background subtle multi-color brand glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#0A317B]/5 via-[#1A9C9B]/5 to-[#FA9C16]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0A317B]/10 via-[#1A9C9B]/10 to-[#FA9C16]/10 border border-[#1A9C9B]/30 shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FA9C16] animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-[#1A9C9B]" />
            <span className="w-2 h-2 rounded-full bg-[#0A317B]" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0A317B]">
              CareerCore EdTech Ecosystem
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A317B] tracking-tight leading-tight">
            Everything you need to <br />
            <span className="bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16] bg-clip-text text-transparent">
              accelerate your career
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Click & interact with our live AI learning engine, specialization tracks, credentials, and placement compiler.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* ========================================================================= */}
          {/* BENTO CARD 1: AI Adaptive Curricula - Personalized Learning Engine */}
          {/* ========================================================================= */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-[0_10px_30px_rgba(10,49,123,0.05)] hover:shadow-[0_20px_40px_rgba(10,49,123,0.1)] transition-all relative overflow-hidden flex flex-col justify-between group"
          >
            {/* Top Multi-color Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A317B] via-[#1A9C9B] to-[#FA9C16]" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FA9C16]/20 via-[#1A9C9B]/20 to-[#0A317B]/20 p-[1.5px] shadow-sm">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-[#FA9C16]">
                    <Cpu className="w-6 h-6" />
                  </div>
                </div>

                <button
                  onClick={handleSimulateAI}
                  disabled={isSimulating}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#FA9C16] to-[#1A9C9B] hover:opacity-90 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Evaluating AI...' : 'Next AI Module'}</span>
                </button>
              </div>

              <span className="text-xs font-mono text-[#FA9C16] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> AI ADAPTIVE CURRICULA
              </span>
              <h3 className="text-2xl font-bold text-[#0A317B] mt-1">
                Personalized Learning Engine
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-lg">
                Adaptive AI algorithms assess your current skill level and generate custom learning modules, practice quizzes, and real-time feedback loops.
              </p>
            </div>

            {/* Interactive Module Selector Terminal Box */}
            <div className="mt-8 p-5 rounded-2xl bg-[#0A317B] text-white font-mono text-xs space-y-4 border border-[#0A317B]/40 shadow-inner">
              <div className="flex flex-wrap items-center justify-between text-gray-300 border-b border-blue-950 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#1A9C9B]" />
                  <span className="text-white font-bold">{modules[activeModule].title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-[11px]">Duration: {modules[activeModule].duration}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: modules[activeModule].color }}>
                    {modules[activeModule].progress}% Done
                  </span>
                </div>
              </div>

              {/* Progress bar animation */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>Topic: {modules[activeModule].topic}</span>
                  <span className="text-[#FA9C16] font-bold">{modules[activeModule].name}</span>
                </div>
                <div className="w-full h-2 bg-blue-950 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${modules[activeModule].progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#1A9C9B] to-[#FA9C16]"
                  />
                </div>
              </div>

              {/* Clickable Module Swatches (Multi-Color Branding) */}
              <div>
                <span className="text-[10px] text-gray-400 block mb-2 font-sans font-semibold">
                  SELECT MODULE TO INSPECT (CLICK BELOW):
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {modules.map((mod, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveModule(idx)}
                      className={`p-2 rounded-xl text-center space-y-1 transition-all border cursor-pointer ${
                        activeModule === idx 
                          ? 'border-white bg-white/10 ring-2 ring-[#FA9C16] scale-105' 
                          : 'border-transparent hover:bg-white/5 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div 
                        className="h-7 rounded-lg shadow-inner flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: mod.color }}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-[9px] text-gray-300 block truncate font-sans">
                        Mod {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* BENTO CARD 2: Multi-Track Programs - Specializations */}
          {/* ========================================================================= */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-[0_10px_30px_rgba(26,156,155,0.05)] hover:shadow-[0_20px_40px_rgba(26,156,155,0.1)] transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Multi-color Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1A9C9B] via-[#FA9C16] to-[#0A317B]" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A9C9B]/20 to-[#0A317B]/20 p-[1.5px] shadow-sm mb-6">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-[#1A9C9B]">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              <span className="text-xs font-mono text-[#1A9C9B] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> INDUSTRY-ALIGNED TRACKS
              </span>
              <h3 className="text-2xl font-bold text-[#0A317B] mt-1">
                Multi-Domain Specializations
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Choose from Software Development, Artificial Intelligence, and Cloud Computing with 100% job-oriented projects.
              </p>
            </div>

            {/* Track Switcher */}
            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-gray-100 rounded-2xl border border-gray-200/60">
                {Object.keys(tracks).map((tKey) => {
                  const isSel = selectedTrack === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => setSelectedTrack(tKey)}
                      className={`py-2 px-2 text-[10px] sm:text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                        isSel 
                          ? `${tracks[tKey].badgeBg} text-white shadow-md scale-[1.02]` 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                      }`}
                    >
                      {tKey === 'fullstack' ? 'Full Stack' : tKey === 'ai' ? 'AI & ML' : 'Data & Cloud'}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Specialization Details Card */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedTrack}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl border-2 transition-all bg-gradient-to-b from-white to-gray-50/80"
                  style={{ borderColor: tracks[selectedTrack].primaryColor }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#0A317B]">
                        {tracks[selectedTrack].name}
                      </h4>
                      <p className="text-[11px] text-gray-500">{tracks[selectedTrack].tagline}</p>
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm"
                      style={{ backgroundColor: tracks[selectedTrack].accentColor }}
                    >
                      {tracks[selectedTrack].salary}
                    </span>
                  </div>

                  {/* Skills Pills with Multi-Color Logos/Styles */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {tracks[selectedTrack].skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-700 bg-white border border-gray-200 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#community"
                    className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-extrabold text-white text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                    style={{ backgroundColor: tracks[selectedTrack].primaryColor }}
                  >
                    <span>Enroll in {tracks[selectedTrack].name}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* BENTO CARD 3: Recognized Credentials - Industry-Verified Certifications */}
          {/* ========================================================================= */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-[0_10px_30px_rgba(10,49,123,0.05)] hover:shadow-[0_20px_40px_rgba(10,49,123,0.1)] transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Multi-color Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A317B] via-[#FA9C16] to-[#1A9C9B]" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A317B]/20 to-[#FA9C16]/20 p-[1.5px] shadow-sm mb-6">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-[#0A317B]">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <span className="text-xs font-mono text-[#0A317B] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> RECOGNIZED CREDENTIALS
              </span>
              <h3 className="text-2xl font-bold text-[#0A317B] mt-1">
                Industry-Verified Certifications
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Earn shareable certificates verified on blockchain, recognized by top employers worldwide to validate your tech competence.
              </p>
            </div>

            {/* Interactive Certification Type Tabs */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {Object.keys(certs).map((cKey) => {
                  const cert = certs[cKey];
                  const isAct = activeCert === cKey;
                  return (
                    <button
                      key={cKey}
                      onClick={() => setActiveCert(cKey)}
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs cursor-pointer ${
                        isAct 
                          ? 'bg-[#0A317B] text-white shadow-md ring-2 ring-[#FA9C16]' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <cert.icon className="w-3.5 h-3.5" style={{ color: isAct ? '#FA9C16' : cert.color }} />
                      <span>{cKey === 'blockchain' ? 'Blockchain' : cKey === 'linkedin' ? 'LinkedIn' : 'Recruiter'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Digital Certificate Verification Preview Box */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-xl text-white shadow-sm shrink-0"
                    style={{ backgroundColor: certs[activeCert].color }}
                  >
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-[#0A317B]">
                      {certs[activeCert].title}
                    </h5>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      Hash: {certs[activeCert].hash}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1 max-w-xs leading-snug">
                      {certs[activeCert].desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="px-2 py-1 rounded bg-teal-50 border border-[#1A9C9B]/40 text-[#1A9C9B] font-extrabold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* BENTO CARD 4: Automated Placement Compiler */}
          {/* ========================================================================= */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-[0_10px_30px_rgba(26,156,155,0.05)] hover:shadow-[0_20px_40px_rgba(26,156,155,0.1)] transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Multi-color Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FA9C16] via-[#0A317B] to-[#1A9C9B]" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A9C9B]/20 to-[#FA9C16]/20 p-[1.5px] shadow-sm mb-6">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-[#1A9C9B]">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>

              <span className="text-xs font-mono text-[#1A9C9B] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> PLACEMENT PIPELINE
              </span>
              <h3 className="text-2xl font-bold text-[#0A317B] mt-1">
                Automated Placement Compiler
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Compile your capstone projects, GitHub commits, and assessment scores into an ATS-friendly candidate profile delivered to 500+ recruiters.
              </p>
            </div>

            {/* Interactive Pipeline Stepper & Recruiter Invite Feed */}
            <div className="mt-8 space-y-3">
              {/* Stepper Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {pipelineSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPipelineStep(idx)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                      pipelineStep === idx 
                        ? 'bg-[#0A317B] text-white border-[#0A317B] shadow-md' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold block" style={{ color: pipelineStep === idx ? '#FA9C16' : step.color }}>
                      Step 0{idx + 1}
                    </span>
                    <span className="text-[11px] font-bold block truncate">{step.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Recruiter Offer Invitation Stream */}
              <div className="p-4 rounded-2xl bg-[#0A317B] text-white font-mono text-xs space-y-2 border border-[#0A317B]/40 shadow-inner">
                <div className="flex items-center justify-between border-b border-blue-950 pb-2 text-[11px]">
                  <span className="text-[#1A9C9B] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FA9C16]" /> Live Placement Stream
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FA9C16] text-white font-extrabold text-[10px]">
                    5 Active Calls
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {interviews.slice(0, pipelineStep + 1).map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-blue-950/70 border border-blue-900/60 text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-white block">{item.company}</span>
                        <span className="text-gray-400 text-[10px]">{item.role}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#FA9C16] font-bold block">{item.package}</span>
                        <span className="text-[#1A9C9B] text-[9px] uppercase tracking-wider">{item.status}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
