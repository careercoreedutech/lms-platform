import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  Award, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  Search, 
  LogOut, 
  Bell, 
  Sparkles, 
  Video, 
  FileCode, 
  X, 
  Check,
  AlertCircle,
  LayoutGrid,
  BookOpen,
  ClipboardCheck,
  ChevronsRight
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export default function StudentPortal() {
  const { currentUser, courses, logout, setActiveView } = useLms();
  const [activeSubTab, setActiveSubTab] = useState('RESOURCES');
  const [expandedWeeks, setExpandedWeeks] = useState({ 0: true, 1: false, 2: false });
  const [activeModalItem, setActiveModalItem] = useState(null); // Item to view in Modal
  const [completedItemIds, setCompletedItemIds] = useState({});
  const [sidebarRailTab, setSidebarRailTab] = useState('articles'); // 'all' | 'articles' | 'quiz'

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  if (!currentUser) return null;

  // Helper to extract multi-blocks for an item
  const getBlocksForItem = (item) => {
    if (!item) return [];
    if (Array.isArray(item.blocks) && item.blocks.length > 0) {
      return item.blocks;
    }
    const type = item.contentType || 'video';
    return [{
      id: 'block_init_' + (item.id || Date.now()),
      type: type,
      videoFileName: item.videoFileName || '',
      videoBlobUrl: item.videoBlobUrl || '',
      videoUrl: item.videoUrl || '',
      notionDoc: item.notionDoc || (type === 'notion' ? '# Study Article\n\nWrite lesson notes here...' : ''),
      quizQuestions: item.quizQuestions || (type === 'quiz' ? [{ question: 'Sample Question', options: ['Option A', 'Option B'], correctIndex: 0 }] : []),
      resourceFileName: item.resourceFileName || ''
    }];
  };

  // Find enrolled course or default to matching course title or first available
  const courseData = courses.find(c => c.title === currentUser?.course) 
    || courses.find(c => c.title?.toLowerCase() === (currentUser?.course || '').toLowerCase())
    || courses.find(c => c.title?.toLowerCase().includes((currentUser?.course || '').toLowerCase()))
    || courses[0];
  const sections = courseData?.sections || [];

  const toggleWeek = (index) => {
    setExpandedWeeks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const markComplete = (itemId) => {
    setCompletedItemIds(prev => ({ ...prev, [itemId]: true }));
  };

  const openItemModal = (item) => {
    setActiveModalItem(item);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleQuizSubmit = (questions) => {
    if (!questions) return;
    let correct = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    setQuizScore({ correct, total: questions.length });
    setQuizSubmitted(true);
    markComplete(activeModalItem.id);
  };

  // Helper to render Notion Markdown Text
  const renderNotionContent = (contentStr) => {
    if (!contentStr) return <p className="text-gray-500">No document content added yet for this topic.</p>;

    const lines = contentStr.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-extrabold text-[#0A317B] my-3 border-b border-gray-200 pb-2">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-bold text-[#0A317B] my-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-[#1A9C9B] my-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('> ')) {
        return (
          <div key={idx} className="my-3 p-4 rounded-2xl bg-amber-50 border-l-4 border-[#FA9C16] text-xs font-medium text-amber-900 shadow-xs">
            {line.replace('> ', '')}
          </div>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4 text-xs text-gray-700 list-disc font-medium my-1">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '---') {
        return <hr key={idx} className="my-4 border-gray-200" />;
      }
      return <p key={idx} className="text-xs text-gray-700 leading-relaxed my-1.5 font-medium">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 font-sans">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src="/logo.png" alt="CareerCore Logo" className="h-8 w-auto" />
            </button>

            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full border border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-slate-700">
            <nav className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-1 cursor-pointer hover:text-emerald-700">
                <span>Courses</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-emerald-700">
                <span>Tutorials</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-emerald-700">
                <span>Practice</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-emerald-700">
                <span>Jobs</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </nav>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer relative">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold absolute -top-1 -right-1 flex items-center justify-center">86</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#1A9C9B] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>

              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Course Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Course Header Banner Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-200/80">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {courseData?.title}
            </h1>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold max-w-md">
                <span>{Object.keys(completedItemIds).length} of 337 Complete. ({Math.min(100, Object.keys(completedItemIds).length * 5)}%)</span>
              </div>

              <div className="w-80 sm:w-96 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1A9C9B] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Object.keys(completedItemIds).length * 5)}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-500">
                Progress updates in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="px-5 py-2.5 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer">
              <Award className="w-4 h-4" />
              <span>Get Certificates</span>
            </button>

            <button className="px-5 py-2.5 rounded-xl bg-white border border-[#1A9C9B] text-[#1A9C9B] hover:bg-teal-50 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer">
              <MessageSquare className="w-4 h-4" />
              <span>Share Feedback</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-8 border-b border-gray-200 text-xs font-bold text-gray-500">
          {['RESOURCES', 'NOTES', 'LIVE', 'LEADERBOARD', 'NOTICEBOARD'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`py-3 transition-all relative cursor-pointer ${
                activeSubTab === tab ? 'text-[#1A9C9B] font-extrabold' : 'hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              {activeSubTab === tab && (
                <motion.div 
                  layoutId="activeSubTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A9C9B]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Grid: Course Structure Tree + Placement Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Folders / Accordion Tree */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Featured Item Card */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1A9C9B] flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-[#1A9C9B]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {sections[0]?.items[0]?.title || 'Course Overview & Setup'}
                  </h4>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <FileText className="w-3.5 h-3.5 text-[#1A9C9B]" />
                    <span>{courseData?.title}</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={() => openItemModal(sections[0]?.items[0] || { title: 'Course Overview', contentType: 'notion', notionDoc: '# Welcome to the Course' })}
                className="px-5 py-2 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
              >
                Continue
              </button>
            </div>

            {/* Hierarchical Sections Accordion Tree */}
            <div className="space-y-3">
              {sections.map((sec, secIdx) => {
                const isExpanded = expandedWeeks[secIdx];

                return (
                  <div 
                    key={sec.id || secIdx} 
                    className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden transition-all"
                  >
                    {/* Accordion Folder Header */}
                    <div 
                      onClick={() => toggleWeek(secIdx)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {sec.weekNumber || secIdx + 1}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                          {sec.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span>{sec.items?.length || sec.topicsCount || 8} Topics</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Accordion Expanded Sub-topics List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-100 bg-slate-50/50 p-3 sm:p-4 space-y-2.5"
                        >
                          {sec.items?.map((item, itemIdx) => {
                            const isVideo = item.contentType === 'video';
                            const isQuiz = item.contentType === 'quiz';
                            const isCompleted = completedItemIds[item.id || itemIdx];

                            return (
                              <div 
                                key={item.id || itemIdx}
                                onClick={() => openItemModal(item)}
                                className={`p-3 sm:p-4 rounded-xl border bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all cursor-pointer hover:border-[#1A9C9B] ${
                                  isCompleted ? 'bg-teal-50/30 border-teal-200' : 'border-gray-200/90'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isVideo ? 'bg-blue-50 text-[#0A317B]' : isQuiz ? 'bg-amber-50 text-[#FA9C16]' : 'bg-teal-50 text-[#1A9C9B]'
                                  }`}>
                                    {isVideo ? <Video className="w-4 h-4 text-[#0A317B]" /> : isQuiz ? <HelpCircle className="w-4 h-4 text-[#FA9C16]" /> : <FileCode className="w-4 h-4 text-[#1A9C9B]" />}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs font-bold text-slate-900">
                                        {item.title}
                                      </h4>
                                      {isVideo ? (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-blue-100 text-[#0A317B]">
                                          VIDEO
                                        </span>
                                      ) : isQuiz ? (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-amber-100 text-[#FA9C16]">
                                          QUIZ / MCQS
                                        </span>
                                      ) : (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-teal-100 text-[#1A9C9B]">
                                          NOTION DOC
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                                      <span className="flex items-center gap-1">
                                        <FileText className="w-3.5 h-3.5 text-[#1A9C9B]" /> {item.articles || 2} Articles
                                      </span>
                                      {item.mcqs !== undefined && (
                                        <span className="flex items-center gap-1">
                                          <HelpCircle className="w-3.5 h-3.5 text-[#FA9C16]" /> {item.mcqs} MCQ's
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button className={`px-5 py-1.5 rounded-lg text-white font-bold text-xs shadow-2xs transition-all shrink-0 self-end sm:self-center cursor-pointer ${
                                  isCompleted ? 'bg-emerald-600' : 'bg-[#1A9C9B] hover:bg-[#147d7c]'
                                }`}>
                                  {isCompleted ? '✓ Completed' : item.status || 'Start'}
                                </button>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Program Sidebar Banner */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-6 rounded-3xl bg-white border border-[#1A9C9B]/30 shadow-md text-center space-y-4 relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#1A9C9B] font-extrabold text-[10px] border border-[#1A9C9B]/30">
                <Sparkles className="w-3 h-3 fill-[#1A9C9B]" /> CareerCore Ecosystem
              </div>

              <h4 className="text-xl font-extrabold text-slate-900 leading-snug">
                One Program. <br /> Every round covered.
              </h4>

              <div className="p-3 rounded-2xl bg-[#0A317B] text-white space-y-1 text-xs font-mono font-bold shadow-inner">
                <div className="text-[#FA9C16] text-sm">Placement 360°</div>
                <div className="text-[10px] text-gray-300">Your Career Starts Here</div>
              </div>

              <div className="text-xs text-gray-600 font-medium pt-2">
                Programming • DSA • System Design • Core CS • Aptitude
              </div>

              <button className="w-full py-2.5 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer">
                Unlock Relevant Job Opportunities
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* GEEKSFORGEEKS MATCHING SPLIT-SIDEBAR DRAWER & CONTENT READER (EXACT MATCH) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-white w-full h-full flex flex-col overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="w-full h-full bg-white flex flex-col overflow-hidden"
            >
              {/* Top Drawer Header Bar (Matching Image 2) */}
              <div className="px-5 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveModalItem(null)} 
                    className="w-7 h-7 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title="Return to Course"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-md sm:max-w-xl">
                    {activeModalItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Circular Progress Badge */}
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[11px] font-extrabold font-mono text-emerald-800 bg-emerald-50">
                    {completedItemIds[activeModalItem.id] ? '100%' : '0%'}
                  </div>

                  <button 
                    onClick={() => setActiveModalItem(null)} 
                    className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Split Body: Left Sidebar Rail + Articles Panel + Right Content Reader */}
              <div className="flex flex-1 overflow-hidden">
                
                {/* 1. SLIM LEFT VERTICAL RAIL (Icon Toolbar - Width ~64px) */}
                <div className="w-16 bg-slate-50 border-r border-gray-200 py-4 flex flex-col items-center justify-between shrink-0 text-gray-500">
                  <div className="space-y-4 w-full px-1.5">
                    {/* All Button */}
                    <button
                      onClick={() => setSidebarRailTab('all')}
                      className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                        sidebarRailTab === 'all' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs' 
                          : 'hover:bg-gray-200/60 hover:text-gray-800'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span>All</span>
                    </button>

                    {/* Articles Button (Active Green Border) */}
                    <button
                      onClick={() => setSidebarRailTab('articles')}
                      className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                        sidebarRailTab === 'articles' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-400 shadow-xs' 
                          : 'hover:bg-gray-200/60 hover:text-gray-800'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Articles</span>
                    </button>

                    {/* Quiz Button */}
                    <button
                      onClick={() => setSidebarRailTab('quiz')}
                      className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                        sidebarRailTab === 'quiz' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs' 
                          : 'hover:bg-gray-200/60 hover:text-gray-800'
                      }`}
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Quiz</span>
                    </button>
                  </div>

                  {/* Bottom Next Track Icon */}
                  <button
                    onClick={() => {
                      markComplete(activeModalItem.id);
                      setActiveModalItem(null);
                    }}
                    className="w-full py-2 flex flex-col items-center gap-1 text-[9px] font-bold text-gray-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <ChevronsRight className="w-5 h-5 text-emerald-700" />
                    <span>Next Track</span>
                  </button>
                </div>

                {/* 2. ARTICLES & BLOCKS DRAWER PANEL (Middle Column) */}
                <div className="w-64 sm:w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      {sidebarRailTab === 'all' && `Page Content (${getBlocksForItem(activeModalItem).length} Blocks)`}
                      {sidebarRailTab === 'articles' && `Articles / Docs (${getBlocksForItem(activeModalItem).filter(b => b.type === 'notion').length > 0 ? getBlocksForItem(activeModalItem).filter(b => b.type === 'notion').length : sections.flatMap(s => s.items || []).filter(i => i.contentType === 'notion' || getBlocksForItem(i).some(b => b.type === 'notion')).length})`}
                      {sidebarRailTab === 'quiz' && `Quizzes & MCQs (${getBlocksForItem(activeModalItem).filter(b => b.type === 'quiz').length > 0 ? getBlocksForItem(activeModalItem).filter(b => b.type === 'quiz').length : sections.flatMap(s => s.items || []).filter(i => i.contentType === 'quiz' || getBlocksForItem(i).some(b => b.type === 'quiz')).length})`}
                    </h4>
                  </div>

                  <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                    {/* If current page has blocks matching active filter tab */}
                    {getBlocksForItem(activeModalItem).filter(b => {
                      if (sidebarRailTab === 'articles') return b.type === 'notion';
                      if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                      return true;
                    }).length > 0 ? (
                      getBlocksForItem(activeModalItem).filter(b => {
                        if (sidebarRailTab === 'articles') return b.type === 'notion';
                        if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                        return true;
                      }).map((blk, blkIdx) => (
                        <div 
                          key={blk.id || blkIdx}
                          onClick={() => {
                            const el = document.getElementById(`block-view-${blk.id || blkIdx}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="p-3 rounded-2xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 transition-all cursor-pointer space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {blk.type === 'video' && (blk.videoFileName || 'Video Lesson')}
                              {blk.type === 'notion' && 'Article Document'}
                              {blk.type === 'quiz' && 'MCQ Quiz'}
                              {blk.type === 'file' && (blk.resourceFileName || 'Resource File')}
                            </h5>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                          </div>
                          <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-emerald-600" />
                            <span>Block #{blkIdx + 1}</span>
                          </p>
                        </div>
                      ))
                    ) : (
                      /* Fallback: Section items matching the filter tab */
                      sections.flatMap(s => s.items || []).filter(item => {
                        if (sidebarRailTab === 'articles') return item.contentType === 'notion' || getBlocksForItem(item).some(b => b.type === 'notion');
                        if (sidebarRailTab === 'quiz') return item.contentType === 'quiz' || getBlocksForItem(item).some(b => b.type === 'quiz');
                        return true;
                      }).map((secItem, sIdx) => (
                        <div
                          key={secItem.id || sIdx}
                          onClick={() => setActiveModalItem(secItem)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                            activeModalItem.id === secItem.id 
                              ? 'border-teal-400 bg-teal-50' 
                              : 'border-gray-200 hover:border-teal-200 bg-white hover:bg-teal-50/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {secItem.title}
                            </h5>
                            {completedItemIds[secItem.id] && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            {sidebarRailTab === 'quiz' ? <HelpCircle className="w-3 h-3 text-amber-500" /> : <BookOpen className="w-3 h-3 text-emerald-600" />}
                            <span>{sidebarRailTab === 'quiz' ? 'MCQ Assessment' : 'Article Topic'}</span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. RIGHT MAIN CONTENT READER AREA */}
                <div className="flex-1 bg-slate-50/50 p-6 sm:p-8 overflow-y-auto space-y-8">
                  {getBlocksForItem(activeModalItem).filter(b => {
                    if (sidebarRailTab === 'articles') return b.type === 'notion';
                    if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                    return true;
                  }).length > 0 ? (
                    getBlocksForItem(activeModalItem).filter(b => {
                      if (sidebarRailTab === 'articles') return b.type === 'notion';
                      if (sidebarRailTab === 'quiz') return b.type === 'quiz';
                      return true;
                    }).map((block, blockIdx) => (
                      <div id={`block-view-${block.id || blockIdx}`} key={block.id || blockIdx} className="space-y-4">
                        {/* Block Header Divider */}
                        {getBlocksForItem(activeModalItem).length > 1 && (
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-200/80 text-xs font-bold text-[#0A317B]">
                            <span className="w-6 h-6 rounded-lg bg-[#1A9C9B] text-white font-mono flex items-center justify-center text-xs">
                              {blockIdx + 1}
                            </span>
                            <span className="uppercase tracking-wider">
                              {block.type === 'video' && 'Video Lesson Block'}
                              {block.type === 'notion' && 'Article / Study Document Block'}
                              {block.type === 'quiz' && 'Interactive MCQ Quiz Block'}
                              {block.type === 'file' && 'Resource File Attachment Block'}
                            </span>
                          </div>
                        )}

                        {/* BLOCK TYPE 1: DRAG & DROP VIDEO / HTML5 VIDEO PLAYER (PROTECTED) */}
                        {block.type === 'video' && (
                          <div className="space-y-4">
                            <div 
                              onContextMenu={(e) => e.preventDefault()}
                              className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex items-center justify-center text-white select-none group"
                            >
                              {block.videoBlobUrl ? (
                                <video 
                                  controls 
                                  controlsList="nodownload"
                                  disablePictureInPicture
                                  onContextMenu={(e) => e.preventDefault()}
                                  autoPlay={blockIdx === 0}
                                  src={block.videoBlobUrl} 
                                  className="w-full h-full object-contain pointer-events-auto"
                                />
                              ) : (
                                <iframe
                                  src={block.videoUrl || activeModalItem.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                                  title={activeModalItem.title}
                                  className="w-full h-full"
                                  allowFullScreen
                                />
                              )}

                              {/* Anti-Piracy Floating Student Watermark */}
                              <div className="absolute bottom-14 right-4 pointer-events-none opacity-20 text-[10px] font-mono text-white select-none z-10 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                                <span>{currentUser?.email || currentUser?.username || 'Student'}</span>
                                <span>•</span>
                                <span>CareerCore DRM Protected</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                              <span className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                Protected Stream: {block.videoFileName || activeModalItem.videoFileName || 'Secure Video Stream'}
                              </span>
                              <span className="text-[11px] text-gray-400">Encrypted • Download Disabled</span>
                            </div>
                          </div>
                        )}

                        {/* BLOCK TYPE 2: NOTION DOCUMENT READER */}
                        {block.type === 'notion' && (
                          <div className="p-6 rounded-2xl bg-white border border-gray-200 font-sans shadow-sm">
                            {renderNotionContent(block.notionDoc || activeModalItem.notionDoc)}
                          </div>
                        )}

                        {/* BLOCK TYPE 3: INTERACTIVE QUIZ & MCQS */}
                        {block.type === 'quiz' && (
                          <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
                              <span>Interactive Assessment Quiz</span>
                              <span>{(block.quizQuestions || activeModalItem.quizQuestions || []).length} Multiple Choice Questions</span>
                            </div>

                            {quizSubmitted && quizScore && (
                              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
                                <div className="text-xl font-extrabold text-[#1A9C9B]">
                                  Quiz Score: {quizScore.correct} / {quizScore.total} ({Math.round((quizScore.correct / quizScore.total) * 100)}%)
                                </div>
                                <p className="text-xs text-gray-600">Great job! Your score has been submitted to your student record.</p>
                              </div>
                            )}

                            <div className="space-y-6">
                              {(block.quizQuestions || activeModalItem.quizQuestions || []).map((q, qIdx) => (
                                <div key={qIdx} className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
                                  <h4 className="text-sm font-extrabold text-[#0A317B]">
                                    {qIdx + 1}. {q.question}
                                  </h4>

                                  <div className="space-y-2">
                                    {q.options?.map((opt, optIdx) => {
                                      const ansKey = `${blockIdx}-${qIdx}`;
                                      const isSelected = quizAnswers[ansKey] === optIdx || quizAnswers[qIdx] === optIdx;
                                      const isCorrect = q.correctIndex === optIdx;

                                      return (
                                        <label 
                                          key={optIdx} 
                                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                            quizSubmitted 
                                              ? isCorrect 
                                                ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' 
                                                : isSelected 
                                                  ? 'bg-red-50 border-red-300 text-red-800' 
                                                  : 'bg-white border-gray-200'
                                              : isSelected 
                                                ? 'bg-blue-50 border-[#0A317B] text-[#0A317B] font-bold' 
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="radio"
                                              name={`quiz-${blockIdx}-${qIdx}`}
                                              disabled={quizSubmitted}
                                              checked={isSelected}
                                              onChange={() => setQuizAnswers({ ...quizAnswers, [ansKey]: optIdx, [qIdx]: optIdx })}
                                              className="accent-[#0A317B]"
                                            />
                                            <span className="text-xs">{opt}</span>
                                          </div>

                                          {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {!quizSubmitted && (
                              <button
                                onClick={() => handleQuizSubmit(block.quizQuestions || activeModalItem.quizQuestions)}
                                className="w-full py-3 rounded-xl bg-[#FA9C16] hover:bg-[#e0890f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                              >
                                Submit Answers & Grade Quiz
                              </button>
                            )}
                          </div>
                        )}

                        {/* BLOCK TYPE 4: FILE RESOURCE */}
                        {block.type === 'file' && (
                          <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <File className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">
                                  {block.resourceFileName || 'Course Document Resource (.pdf / .zip)'}
                                </h5>
                                <p className="text-[10px] text-gray-500 font-mono">Attachment ready for download</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer">
                              Download File
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 rounded-3xl bg-white border border-gray-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FA9C16] flex items-center justify-center mx-auto">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-extrabold text-[#0A317B]">
                        {sidebarRailTab === 'quiz' ? 'No MCQ Quizzes on this Topic Page' : 'No Articles on this Topic Page'}
                      </h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        {sidebarRailTab === 'quiz' 
                          ? 'The Admin has not added an MCQ Quiz block to this topic canvas yet. Select a Quiz topic from the middle column or click "All" to view this page.' 
                          : 'The Admin has not added an Article block to this topic canvas yet. Select an Article topic from the middle column or click "All" to view this page.'}
                      </p>
                      <button 
                        onClick={() => setSidebarRailTab('all')}
                        className="px-4 py-2 rounded-xl bg-[#1A9C9B] text-white font-bold text-xs cursor-pointer"
                      >
                        View All Page Content
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Reader
                </button>

                <button
                  onClick={() => {
                    markComplete(activeModalItem.id);
                    setActiveModalItem(null);
                  }}
                  className="px-6 py-2 rounded-xl bg-[#1A9C9B] hover:bg-[#147d7c] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Completed</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
