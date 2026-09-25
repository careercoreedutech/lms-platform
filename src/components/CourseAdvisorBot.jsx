import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import lottie from 'lottie-web';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Bot
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import botAnimation from '../../bot.json';

function BotAvatar({ className = "w-full h-full" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let anim;
    if (containerRef.current) {
      const animationData = (typeof botAnimation === 'object' && botAnimation.default) ? botAnimation.default : botAnimation;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'canvas',
        loop: true,
        autoplay: true,
        animationData: animationData
      });
    }
    return () => {
      if (anim) anim.destroy();
    };
  }, []);

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div ref={containerRef} className="w-full h-full flex items-center justify-center scale-110 translate-y-1" />
    </div>
  );
}

const RECOMMENDED_COURSES = [
  {
    id: 'course-pm',
    title: 'Product Management - Skill Up',
    category: 'Product & Business',
    duration: '5 Weeks',
    price: '₹25,000',
    rating: '4.9 ★ (1,240 reviews)',
    skills: ['Product Roadmap', 'Wireframing', 'PRD Specs', 'User Discovery', 'Metrics & Funnels'],
    targetAudience: 'PM Aspirants, Business Analysts, Tech Leads, Entrepreneurs',
    description: 'Master end-to-end product lifecycle, customer research, PRD documentation, and agile execution.'
  },
  {
    id: 'course-fs',
    title: 'Full Stack Web Engineering',
    category: 'Software Engineering',
    duration: '12 Weeks',
    price: '₹35,000',
    rating: '4.95 ★ (2,150 reviews)',
    skills: ['React 19', 'Next.js 15', 'Node.js', 'PostgreSQL', 'Docker & CI/CD'],
    targetAudience: 'Beginners, Computer Science Students, Career Changers',
    description: 'Build enterprise production applications from scratch with modern frontend, backend, and DB architectures.'
  },
  {
    id: 'course-ai',
    title: 'AI & Machine Learning Engineering',
    category: 'Artificial Intelligence',
    duration: '10 Weeks',
    price: '₹40,000',
    rating: '4.98 ★ (890 reviews)',
    skills: ['PyTorch', 'LLMs & RAG', 'LangChain', 'Python Data Science', 'Vector DBs'],
    targetAudience: 'Developers, Data Analysts, AI Enthusiasts',
    description: 'Train deep neural networks, build RAG pipelines, and deploy custom LLM AI agents.'
  },
  {
    id: 'course-cloud',
    title: 'Cloud Native & DevOps Architecture',
    category: 'Cloud & Infrastructure',
    duration: '8 Weeks',
    price: '₹30,000',
    rating: '4.88 ★ (760 reviews)',
    skills: ['AWS & GCP', 'Kubernetes', 'Terraform', 'Kafka Streaming', 'System Design'],
    targetAudience: 'SysAdmins, Backend Engineers, Cloud Engineers',
    description: 'Architect auto-scaling multi-region cloud infrastructure, microservices, and automated pipelines.'
  }
];

export default function CourseAdvisorBot() {
  const { setAuthModal } = useLms();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello! I am your CareerCore AI Course Advisor.\nI can help you find the perfect course based on your career goals, background, and budget.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        { label: 'Recommend a course for me', action: 'start_quiz' },
        { label: 'Product Management (5 Wks)', action: 'select_pm' },
        { label: 'Full Stack Web Dev (12 Wks)', action: 'select_fs' },
        { label: 'AI & Machine Learning Track', action: 'select_ai' },
        { label: 'Ask about tuition fees & career tracks', action: 'faq_pricing' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ field: '', experience: '' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const addBotMessage = (text, options = null, courseRecommendation = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'bot',
          text,
          options,
          courseRecommendation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [
      ...prev,
      {
        id: 'user_' + Date.now(),
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleOptionClick = (option) => {
    addUserMessage(option.label);

    if (option.action === 'start_quiz') {
      setQuizStep(1);
      addBotMessage("Great! What primary career path are you aiming for?", [
        { label: 'Product Management', action: 'quiz_field_pm' },
        { label: 'Web / Software Development', action: 'quiz_field_fs' },
        { label: 'AI & Machine Learning', action: 'quiz_field_ai' },
        { label: 'Cloud & System Architecture', action: 'quiz_field_cloud' }
      ]);
      return;
    }

    if (option.action?.startsWith('quiz_field_')) {
      const field = option.action.replace('quiz_field_', '');
      setQuizAnswers(prev => ({ ...prev, field }));
      setQuizStep(2);
      addBotMessage("Awesome choice! What is your current level of experience?", [
        { label: 'Beginner / Fresh Graduate', action: `quiz_exp_beginner_${field}` },
        { label: 'Working Professional (1-3 yrs)', action: `quiz_exp_mid_${field}` },
        { label: 'Experienced Specialist (3+ yrs)', action: `quiz_exp_senior_${field}` }
      ]);
      return;
    }

    if (option.action?.startsWith('quiz_exp_')) {
      setQuizStep(0);
      let matchedCourse = RECOMMENDED_COURSES[0];
      if (option.action.includes('fs')) matchedCourse = RECOMMENDED_COURSES[1];
      if (option.action.includes('ai')) matchedCourse = RECOMMENDED_COURSES[2];
      if (option.action.includes('cloud')) matchedCourse = RECOMMENDED_COURSES[3];

      addBotMessage(
        `Based on your selections, here is the best matched program for you (98% Match):`,
        [
          { label: 'Find another course', action: 'start_quiz' },
          { label: 'Ask another question', action: 'reset_chat' }
        ],
        matchedCourse
      );
      return;
    }

    if (option.action === 'select_pm') {
      addBotMessage(
        "Here are the details for our top-rated Product Management Track:",
        [
          { label: 'Take the 30-sec Match Quiz', action: 'start_quiz' },
          { label: 'How do enrollment fees work?', action: 'faq_pricing' }
        ],
        RECOMMENDED_COURSES[0]
      );
      return;
    }

    if (option.action === 'select_fs') {
      addBotMessage(
        "Here are the details for Full Stack Web Engineering:",
        [
          { label: 'Take the 30-sec Match Quiz', action: 'start_quiz' },
          { label: 'How do enrollment fees work?', action: 'faq_pricing' }
        ],
        RECOMMENDED_COURSES[1]
      );
      return;
    }

    if (option.action === 'select_ai') {
      addBotMessage(
        "Here are the details for AI & Machine Learning Engineering:",
        [
          { label: 'Take the 30-sec Match Quiz', action: 'start_quiz' },
          { label: 'How do enrollment fees work?', action: 'faq_pricing' }
        ],
        RECOMMENDED_COURSES[2]
      );
      return;
    }

    if (option.action === 'faq_pricing') {
      addBotMessage(
        "Tuition & Payment Options:\n\n• Flexible installment plans are available for all courses.\n• Complete career acceleration program.\n• Live mentor guidance & direct code review on every module.\n\nWould you like me to suggest a course for your background?",
        [
          { label: 'Recommend a course for me', action: 'start_quiz' },
          { label: 'Register / Enroll Now', action: 'trigger_enroll' }
        ]
      );
      return;
    }

    if (option.action === 'trigger_enroll') {
      setIsOpen(false);
      setAuthModal('enroll');
      return;
    }

    if (option.action === 'reset_chat') {
      addBotMessage("How else can I assist your career journey today?", [
        { label: 'Recommend a course for me', action: 'start_quiz' },
        { label: 'Product Management', action: 'select_pm' },
        { label: 'Full Stack Web Dev', action: 'select_fs' }
      ]);
    }
  };

  const handleSendQuery = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    addUserMessage(userText);

    const lower = userText.toLowerCase();

    if (lower.includes('price') || lower.includes('cost') || lower.includes('fee') || lower.includes('money')) {
      addBotMessage(
        "Our courses range from ₹25,000 to ₹40,000 depending on the specialization duration (5 to 12 weeks).\n\n• Product Management: ₹25,000\n• Full Stack Web Dev: ₹35,000\n• AI & ML Engineering: ₹40,000\n• Cloud Architecture: ₹30,000",
        [
          { label: 'Recommend a course for me', action: 'start_quiz' },
          { label: 'Enroll Now', action: 'trigger_enroll' }
        ]
      );
    } else if (lower.includes('product') || lower.includes('pm')) {
      addBotMessage(
        "Our Product Management - Skill Up program covers user discovery, PRD writing, wireframing, sprint planning, and funnels.",
        [
          { label: 'View PM Course', action: 'select_pm' },
          { label: 'Take Match Quiz', action: 'start_quiz' }
        ],
        RECOMMENDED_COURSES[0]
      );
    } else if (lower.includes('code') || lower.includes('web') || lower.includes('dev') || lower.includes('fullstack') || lower.includes('react')) {
      addBotMessage(
        "Our Full Stack Web Engineering course teaches React 19, Next.js, Node.js, PostgreSQL, and Docker with 3 production capstones.",
        [
          { label: 'View Fullstack Course', action: 'select_fs' },
          { label: 'Take Match Quiz', action: 'start_quiz' }
        ],
        RECOMMENDED_COURSES[1]
      );
    } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('ml') || lower.includes('python')) {
      addBotMessage(
        "Our AI & Machine Learning Engineering course covers PyTorch, RAG Pipelines, LangChain, Transformers, and LLM Agent building.",
        [
          { label: 'View AI Course', action: 'select_ai' },
          { label: 'Take Match Quiz', action: 'start_quiz' }
        ],
        RECOMMENDED_COURSES[2]
      );
    } else if (lower.includes('job') || lower.includes('career') || lower.includes('salary') || lower.includes('hiring')) {
      addBotMessage(
        "We provide Career 360° assistance:\n\n• Resume & LinkedIn optimization\n• 1-on-1 mock technical interviews\n• Exclusive referral network with top hiring tech companies\n• Average graduate salaries range from ₹14 LPA to ₹35 LPA!",
        [
          { label: 'Find Best Course for Me', action: 'start_quiz' },
          { label: 'Enroll Now', action: 'trigger_enroll' }
        ]
      );
    } else {
      addBotMessage(
        `Thank you for asking! Based on your query "${userText}", I recommend taking our 30-second AI Course Match Quiz to get a tailored recommendation.`,
        [
          { label: 'Start 30-sec Match Quiz', action: 'start_quiz' },
          { label: 'Talk to Enrollment Desk', action: 'trigger_enroll' }
        ]
      );
    }
  };

  return (
    <>
      {/* FLOATING BOT LAUNCHER BUTTON */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-transparent flex items-center justify-center relative hover:scale-105 transition-all cursor-pointer border-none outline-none group focus:outline-none"
          title="Open Course Advisor Chat"
        >
          {isOpen ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <BotAvatar className="w-full h-full" />
              <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-[#0A317B] text-white flex items-center justify-center shadow-lg border border-white">
                <X className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <BotAvatar className="w-full h-full" />
              <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse shadow-md" />
            </div>
          )}
        </button>

        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A317B] text-white shadow-2xl border border-white/20 text-[11px] font-extrabold cursor-pointer hover:bg-[#07245c] transition-all"
            onClick={() => setIsOpen(true)}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FA9C16] animate-pulse" />
            <span>Need course advice? Ask AI Bot!</span>
          </motion.div>
        )}
      </div>

      {/* CHATBOT DRAWER / WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[550px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* CHAT HEADER */}
            <div className="p-4 bg-gradient-to-r from-[#0A317B] via-[#0D41A1] to-[#1A9C9B] text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <BotAvatar className="w-full h-full" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5 leading-tight">
                    Course Advisor Bot
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <p className="text-[11px] text-teal-100 font-medium">CareerCore AI Recommendation Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setMessages([
                      {
                        id: 'welcome-1',
                        sender: 'bot',
                        text: "Hello! I am your CareerCore AI Course Advisor.\nI can help you find the perfect course based on your career goals, background, and budget.",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        options: [
                          { label: 'Recommend a course for me', action: 'start_quiz' },
                          { label: 'Product Management (5 Wks)', action: 'select_pm' },
                          { label: 'Full Stack Web Dev (12 Wks)', action: 'select_fs' },
                          { label: 'AI & Machine Learning Track', action: 'select_ai' }
                        ]
                      }
                    ]);
                  }}
                  className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Restart Conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES BODY */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.sender === 'bot' && (
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        <BotAvatar className="w-full h-full" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#0A317B] text-white rounded-br-none font-medium'
                          : 'bg-white text-slate-800 border border-gray-200/90 rounded-bl-none font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* COURSE RECOMMENDATION CARD IN CHAT */}
                  {msg.courseRecommendation && (
                    <div className="w-full max-w-[90%] p-4 rounded-2xl bg-gradient-to-br from-white to-teal-50/60 border border-teal-200 shadow-md space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-[#1A9C9B]/10 text-[#1A9C9B] font-extrabold text-[10px]">
                            {msg.courseRecommendation.category}
                          </span>
                          <h5 className="font-extrabold text-sm text-[#0A317B] mt-1">
                            {msg.courseRecommendation.title}
                          </h5>
                        </div>
                        <span className="font-extrabold text-xs text-[#FA9C16]">
                          {msg.courseRecommendation.price}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-600 line-clamp-2">
                        {msg.courseRecommendation.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {msg.courseRecommendation.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-bold text-gray-700">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-[11px]">
                        <span className="text-gray-500 font-mono">Duration: {msg.courseRecommendation.duration}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            setAuthModal('enroll');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] text-white font-extrabold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Enroll Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* QUICK OPTIONS CHIPS */}
                  {msg.options && (
                    <div className="flex flex-col gap-1.5 w-full pl-9">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleOptionClick(opt)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-teal-50 border border-teal-200/80 hover:border-teal-400 text-[#0A317B] font-bold text-xs text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between cursor-pointer group"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-gray-400 px-2 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 text-xs pl-2">
                  <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-[#1A9C9B]" />
                  </div>
                  <span className="animate-pulse font-bold text-[11px] text-[#1A9C9B]">Advisor is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT FORM */}
            <form onSubmit={handleSendQuery} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about courses, fees, or career tracks..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium text-[#0A317B] focus:bg-white focus:ring-2 focus:ring-[#1A9C9B] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2.5 rounded-2xl bg-[#0A317B] hover:bg-[#07245c] disabled:opacity-40 text-white shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
