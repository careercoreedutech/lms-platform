import React, { useState } from 'react';
import { useLms } from '../context/LmsContext';
import Highlight from './ui/Highlight';
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

// Map each specialization tab to the matching registration program
const TRACK_COURSE_MATCH = {
  fullstack: ['full stack'],
  ai: ['machine learning', 'ai &', 'data science'],
  cloud: ['cloud', 'devops', 'data'],
};


const Card = ({ className = '', children }) => (
  <div className={`group relative flex flex-col bg-white rounded-[28px] p-6 sm:p-8 ring-1 ring-slate-200/80 shadow-[0_1px_2px_rgba(10,49,123,0.04)] hover:shadow-[0_24px_60px_-24px_rgba(10,49,123,0.25)] transition-shadow duration-300 overflow-hidden ${className}`}>
    {children}
  </div>
);
const CardHead = ({ icon: Icon, tone, label, title, desc, action }) => (
  <div>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <span className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.12em] whitespace-nowrap ${tone}`}>
        <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"><Icon className="w-3.5 h-3.5" /></span>
        {label}
      </span>
      {action}
    </div>
    <h3 className="text-2xl font-black text-brand-navy tracking-tight">{title}</h3>
    <p className="text-[15px] text-slate-600 mt-2 leading-relaxed max-w-lg">{desc}</p>
  </div>
);

export default function BentoFeatures() {
  const { courses = [], openEnrollment } = useLms();
  const enrollInTrack = (trackKey, fallbackTitle) => {
    const needles = TRACK_COURSE_MATCH[trackKey] || [];
    const match = courses.find((c) => needles.some((n) => c.title?.toLowerCase().includes(n)));
    openEnrollment(match?.title || fallbackTitle);
  };
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

  // Data for Card 4 (Career Pipeline)
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

  const cert = certs[activeCert];

  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50/70 border-y border-slate-100 relative overflow-hidden">
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(26,156,155,0.08),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="eyebrow mb-5"><span className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Why CareerCore</span>
          <h2 className="section-title">
            Everything you need to <br className="hidden sm:block" />
            <Highlight>accelerate your career</Highlight>
          </h2>
          <p className="section-lead">
            An adaptive learning engine, industry-aligned specializations, verifiable credentials and a career pipeline — all in one place. Try them below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* ── 1. Adaptive learning ── */}
          <Card className="lg:col-span-7">
            <CardHead
              icon={Zap}
              tone="bg-orange-50 text-orange-700"
              label="AI adaptive curricula"
              title="Personalized learning engine"
              desc="Adaptive algorithms assess your level and generate custom modules, practice quizzes and real-time feedback loops."
              action={
                <button
                  onClick={handleSimulateAI}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-navy bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-brand-orange ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Adapting…' : 'Next module'}
                </button>
              }
            />
            <div className="mt-8 p-5 rounded-2xl bg-brand-navy text-white">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">{modules[activeModule].name} · {modules[activeModule].duration}</p>
                  <p className="text-base font-extrabold mt-0.5 flex items-center gap-2"><Terminal className="w-4 h-4 text-brand-teal shrink-0" />{modules[activeModule].title}</p>
                  <p className="text-xs text-white/60 mt-1">{modules[activeModule].topic}</p>
                </div>
                <span className="text-2xl font-black tabular-nums">{modules[activeModule].progress}<span className="text-sm text-white/50">%</span></span>
              </div>
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: `${modules[activeModule].progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-orange"
                />
              </div>
              <div className="mt-5 grid grid-cols-6 gap-1.5 sm:gap-2" role="tablist" aria-label="Modules">
                {modules.map((mod, idx) => (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={activeModule === idx}
                    onClick={() => setActiveModule(idx)}
                    className={`group/m rounded-xl p-1.5 sm:p-2 text-center transition-all cursor-pointer ${activeModule === idx ? 'bg-white text-brand-navy' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                  >
                    <span className="block text-sm font-black">{idx + 1}</span>
                    <span className="block h-1 mt-1.5 rounded-full bg-current/20 overflow-hidden">
                      <span className="block h-full rounded-full" style={{ width: `${mod.progress}%`, backgroundColor: mod.color === '#0A317B' ? '#38bdf8' : mod.color }} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* ── 2. Specializations ── */}
          <Card className="lg:col-span-5">
            <CardHead
              icon={Layers}
              tone="bg-teal-50 text-teal-700"
              label="Industry-aligned tracks"
              title="Multi-domain specializations"
              desc="Software development, AI and cloud — every track is 100% job-oriented, with capstones employers recognise."
            />
            <div className="mt-auto pt-8 space-y-4">
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl" role="tablist" aria-label="Specializations">
                {Object.keys(tracks).map((tKey) => {
                  const isSel = selectedTrack === tKey;
                  return (
                    <button
                      key={tKey}
                      role="tab"
                      aria-selected={isSel}
                      onClick={() => setSelectedTrack(tKey)}
                      className={`py-2 px-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${isSel ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {tKey === 'fullstack' ? 'Full Stack' : tKey === 'ai' ? 'AI & ML' : 'Data & Cloud'}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTrack}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="p-5 rounded-2xl ring-1 ring-slate-200 bg-gradient-to-b from-white to-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-extrabold text-brand-navy">{tracks[selectedTrack].name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{tracks[selectedTrack].tagline}</p>
                    </div>
                    <span className="text-right shrink-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary range</span>
                      <span className="block text-sm font-black text-emerald-600">{tracks[selectedTrack].salary}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 my-4">
                    {tracks[selectedTrack].skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-white ring-1 ring-slate-200">{skill}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => enrollInTrack(selectedTrack, tracks[selectedTrack].name)}
                    className="w-full py-3 px-4 rounded-xl text-[13px] font-extrabold text-white text-center transition-all flex items-center justify-center gap-1.5 group/b cursor-pointer hover:brightness-110"
                    style={{ backgroundColor: tracks[selectedTrack].primaryColor }}
                  >
                    <span>Enroll in {tracks[selectedTrack].name}</span>
                    <ChevronRight className="w-4 h-4 group-hover/b:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>

          {/* ── 3. Credentials ── */}
          <Card className="lg:col-span-5">
            <CardHead
              icon={ShieldCheck}
              tone="bg-blue-50 text-blue-700"
              label="Recognized credentials"
              title="Industry-verified certificates"
              desc="Shareable certificates with a public verification ID, ready for LinkedIn and recruiter checks."
            />
            <div className="mt-auto pt-8 space-y-4">
              {/* Certificate mock */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCert}
                  initial={{ opacity: 0, rotate: -1.5, y: 6 }}
                  animate={{ opacity: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-2xl p-5 bg-[linear-gradient(135deg,#fffdf7,#fff)] ring-1 ring-amber-200/70 shadow-[0_12px_30px_-12px_rgba(250,156,22,0.35)] overflow-hidden"
                >
                  <div aria-hidden className="absolute inset-2 rounded-xl border border-dashed border-amber-300/60 pointer-events-none" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-700">Certificate of completion</p>
                      <p className="text-lg font-black text-brand-navy mt-1 leading-tight">{cert.title}</p>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{cert.desc}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-white shadow-md ring-4 ring-white" style={{ backgroundColor: cert.color }}>
                      <cert.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="relative mt-4 pt-3 border-t border-amber-200/70 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" /> {cert.hash}</span>
                    <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Credential types">
                {Object.keys(certs).map((cKey) => {
                  const c = certs[cKey];
                  const on = activeCert === cKey;
                  return (
                    <button
                      key={cKey}
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActiveCert(cKey)}
                      className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${on ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <c.icon className="w-3.5 h-3.5" style={{ color: on ? '#FA9C16' : c.color }} />
                      {cKey === 'blockchain' ? 'Blockchain' : cKey === 'linkedin' ? 'LinkedIn' : 'Recruiter'}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* ── 4. Career pipeline ── */}
          <Card className="lg:col-span-7">
            <CardHead
              icon={TrendingUp}
              tone="bg-emerald-50 text-emerald-700"
              label="Career pipeline"
              title="Automated career compiler"
              desc="Your capstones, GitHub commits and assessment scores compiled into an ATS-friendly profile shared with 500+ recruiters."
            />
            <div className="mt-auto pt-8 grid sm:grid-cols-[180px_1fr] gap-4">
              <ol className="grid grid-cols-3 sm:grid-cols-1 gap-2">
                {pipelineSteps.map((step, idx) => {
                  const on = pipelineStep === idx;
                  const done = idx < pipelineStep;
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => setPipelineStep(idx)}
                        className={`w-full h-full p-3 rounded-xl text-left transition-all cursor-pointer ring-1 ${on ? 'bg-brand-navy text-white ring-brand-navy' : 'bg-white text-slate-700 ring-slate-200 hover:ring-slate-300'}`}
                      >
                        <span className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider ${on ? 'text-brand-orange' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {done ? <CheckCircle2 className="w-3 h-3" /> : null} Step {idx + 1}
                        </span>
                        <span className="block text-xs font-bold mt-0.5">{step.label}</span>
                        <span className={`hidden sm:block text-[11px] mt-0.5 ${on ? 'text-white/60' : 'text-slate-400'}`}>{step.sub}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="p-4 rounded-2xl bg-slate-950 text-white">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold text-white/80">
                    <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
                    Live career stream
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange font-extrabold">{pipelineStep + 1} active</span>
                </div>
                <div className="space-y-2">
                  {interviews.slice(0, pipelineStep + 1).map((item) => (
                    <motion.div
                      key={item.company}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 ring-1 ring-white/10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black shrink-0">{item.company[0]}</span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold truncate">{item.company}</p>
                          <p className="text-[11px] text-white/50 truncate">{item.role}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-black text-brand-orange">{item.package}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'Confirmed' ? 'text-emerald-400' : 'text-sky-300'}`}>{item.status}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
